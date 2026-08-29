// discover-skills.mjs — walk workspace + user + plugin skill sources, return inventory
//
// Sources scanned (in priority order):
//   workspace:  <workspaceDir>/skills/<name>/SKILL.md
//   user:       <userDir>/skills/<name>/SKILL.md          (typically ~/.claude/)
//   plugin:     <pluginRoot>/.../skills/<name>/SKILL.md   (recursive scan)
//
// Returns: { skills: [...], anomalies: [...], totals: { workspace, user, plugin } }
//
// Each skill: { id, source, path, frontmatter, hasIssues }
// frontmatter is parsed best-effort from SKILL.md (name, description, version, etc.).
// anomalies: SKILL.md missing or unparseable; duplicate id across sources (later flagged).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

// Anomaly `path` values are published: they land in .well-known/skills.json and
// SKILLS.md, which the federation site serves and llms.txt advertises. Absolute
// paths would leak the operator's username and home layout onto that surface,
// so every anomaly path is rendered relative to the root it was scanned from:
// workspace-scoped paths relative to the workspace dir, user-scoped as
// "~/.claude/skills/…". Skill records keep their absolute `path` — that field
// is consumed in-process and is not written to any published file.
function makeRelativizer(root, prefix = "") {
  if (!root) return (p) => p;
  const base = path.resolve(root);
  return (p) => {
    const abs = path.resolve(p);
    const rel = path.relative(base, abs);
    // Outside the scanned root (shouldn't happen) → leave it alone rather than
    // emit a misleading ../.. chain.
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return p;
    return prefix + rel.split(path.sep).join("/");
  };
}

// "~/.claude/" for a root inside the home directory; "" for anything else
// (temp dirs in tests, system paths) — never the literal home path.
function homePrefix(root) {
  const home = homedir();
  const rel = path.relative(home, path.resolve(root));
  if (rel.startsWith("..") || path.isAbsolute(rel)) return "";
  if (!rel) return "~/";
  return "~/" + rel.split(path.sep).join("/") + "/";
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  const fm = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^(\w[\w-]*?):\s*(.*)$/);
    if (m) {
      let value = m[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      fm[m[1]] = value;
    }
  }
  return fm;
}

function scanSkillsDir(skillsDir, source, rel = (p) => p) {
  const skills = [];
  const anomalies = [];

  if (!existsSync(skillsDir)) return { skills, anomalies };

  let entries;
  try {
    entries = readdirSync(skillsDir, { withFileTypes: true });
  } catch (e) {
    anomalies.push({ source, kind: "unreadable", path: rel(skillsDir), detail: e.message });
    return { skills, anomalies };
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;

    const skillDir = path.join(skillsDir, entry.name);
    const skillFile = path.join(skillDir, "SKILL.md");

    if (!existsSync(skillFile)) {
      anomalies.push({
        source,
        kind: "missing-skill-md",
        path: rel(skillDir),
        detail: `${entry.name}/SKILL.md not found`,
      });
      continue;
    }

    let content;
    try {
      content = readFileSync(skillFile, "utf-8");
    } catch (e) {
      anomalies.push({ source, kind: "unreadable", path: rel(skillFile), detail: e.message });
      continue;
    }

    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
      anomalies.push({
        source,
        kind: "no-frontmatter",
        path: rel(skillFile),
        detail: `${entry.name}/SKILL.md lacks YAML frontmatter`,
      });
      // Still register the skill with empty frontmatter
    }

    skills.push({
      id: (frontmatter && frontmatter.name) || entry.name,
      source,
      path: skillFile,
      // Publication-safe rendering of `path`, used wherever an anomaly is
      // written to a generated file.
      displayPath: rel(skillFile),
      frontmatter: frontmatter || {},
      hasIssues: !frontmatter,
    });
  }

  return { skills, anomalies };
}

function findPluginSkills(pluginRoot, maxDepth = 5, rel = (p) => p) {
  // Plugin skills live under arbitrary sub-paths (e.g., ~/.claude/plugins/<pkg>/skills/<name>/).
  // Bounded recursive scan looking for "skills" directories.
  const skills = [];
  const anomalies = [];

  if (!existsSync(pluginRoot)) return { skills, anomalies };

  function walk(dir, depth) {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.name === "skills") {
        const { skills: s, anomalies: a } = scanSkillsDir(full, "plugin", rel);
        skills.push(...s);
        anomalies.push(...a);
      } else {
        walk(full, depth + 1);
      }
    }
  }
  walk(pluginRoot, 0);
  return { skills, anomalies };
}

export function discoverSkills({ workspaceDir = null, userDir = null, pluginRoot = null } = {}) {
  const allSkills = [];
  const allAnomalies = [];

  if (workspaceDir) {
    const rel = makeRelativizer(workspaceDir);
    const { skills, anomalies } = scanSkillsDir(path.join(workspaceDir, "skills"), "workspace", rel);
    allSkills.push(...skills);
    allAnomalies.push(...anomalies);
  }
  if (userDir) {
    const rel = makeRelativizer(userDir, homePrefix(userDir));
    const { skills, anomalies } = scanSkillsDir(path.join(userDir, "skills"), "user", rel);
    allSkills.push(...skills);
    allAnomalies.push(...anomalies);
  }
  if (pluginRoot) {
    const rel = makeRelativizer(pluginRoot, homePrefix(pluginRoot));
    const { skills, anomalies } = findPluginSkills(pluginRoot, 5, rel);
    allSkills.push(...skills);
    allAnomalies.push(...anomalies);
  }

  // Duplicate detection across sources
  const byId = {};
  for (const s of allSkills) {
    (byId[s.id] = byId[s.id] || []).push(s);
  }
  for (const [id, instances] of Object.entries(byId)) {
    if (instances.length > 1) {
      allAnomalies.push({
        source: "cross-source",
        kind: "duplicate-id",
        path: instances.map((i) => i.displayPath ?? i.path).join(", "),
        detail: `skill id "${id}" appears in ${instances.length} sources: ${instances.map((i) => i.source).join(", ")}`,
      });
    }
  }

  const totals = {
    workspace: allSkills.filter((s) => s.source === "workspace").length,
    user: allSkills.filter((s) => s.source === "user").length,
    plugin: allSkills.filter((s) => s.source === "plugin").length,
  };

  return { skills: allSkills, anomalies: allAnomalies, totals };
}
