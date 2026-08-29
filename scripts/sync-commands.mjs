#!/usr/bin/env node
// sync-commands.mjs — propagate org-os slash commands across AI coding tools.
//
// Canonical source of truth: `.claude/commands/*.md` (Claude Code native).
// This regenerates each other tool's command directory from it so a command is
// authored ONCE and surfaces everywhere.
//
// Targets:
//   - OpenCode → `.opencode/commands/`  (verified: OpenCode reads .opencode/commands/, plural)
//   - Cursor   → `.cursor/commands/`     (best-effort; verify in your Cursor version)
//   - Hermes   → `skills/commands/<name>/SKILL.md`  (each command becomes a thin
//                "command skill"; Hermes' `/` menu keys off a skill's frontmatter
//                `name:` → `/name`, and its scanner walks skills.external_dirs
//                which points at this repo's skills/. So /initialize, /close, /sync,
//                /commit, /notion-test surface in the Hermes CLI AND Telegram gateway
//                on every host — local, Railway, DappNode. Commands that collide with
//                a real skill (e.g. symbient) are skipped — that skill already owns /name.)
//   - Zed      → (no files) surfaces the backend agent's commands via ACP, so
//                populating the Claude Code / OpenCode dirs already covers Zed.
//
// The instruction body is preserved verbatim; only the frontmatter is swapped
// for each tool's convention. OpenCode supports `$ARGUMENTS` interpolation like
// Claude Code, so it is preserved there; it is stripped for Cursor (no known
// support). Generated dirs are prettier-ignored (see .prettierignore) so
// `npm run format` and this generator don't fight.
//
// Usage:  node scripts/sync-commands.mjs   (or: npm run sync:commands)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, ".claude", "commands");
const GENERATED_MARK = "<!-- GENERATED from .claude/commands/";

const TARGETS = [
  {
    name: "opencode",
    dir: path.join(root, ".opencode", "commands"),
    frontmatter: (desc) =>
      `---\ndescription: ${JSON.stringify(desc)}\nagent: build\n---\n`,
    keepArguments: true,
    // Migrate away from the mistaken singular `command/` dir OpenCode ignores.
    legacyDirs: [path.join(root, ".opencode", "command")],
  },
  {
    name: "cursor",
    dir: path.join(root, ".cursor", "commands"),
    frontmatter: (desc) => `---\ndescription: ${JSON.stringify(desc)}\n---\n`,
    keepArguments: false,
    legacyDirs: [],
  },
];

if (!fs.existsSync(SRC)) {
  console.error(
    `ERROR: canonical source ${path.relative(root, SRC)} not found.`,
  );
  process.exit(1);
}

// Read + parse each canonical command exactly once (gray-matter = the repo's
// YAML frontmatter parser, so multi-line / special-char descriptions survive).
const sources = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((file) => {
    const parsed = matter(fs.readFileSync(path.join(SRC, file), "utf8"));
    const desc =
      parsed.data.description || `org-os command: ${file.replace(/\.md$/, "")}`;
    return { file, desc, body: parsed.content.trimEnd() };
  });
const validNames = new Set(sources.map((s) => s.file));

let total = 0;
for (const target of TARGETS) {
  for (const legacy of target.legacyDirs) {
    if (
      fs.existsSync(legacy) &&
      path.resolve(legacy) !== path.resolve(target.dir)
    ) {
      fs.rmSync(legacy, { recursive: true, force: true });
      console.log(`  removed legacy dir: ${path.relative(root, legacy)}/`);
    }
  }
  fs.mkdirSync(target.dir, { recursive: true });

  // Prune generated files whose canonical source was deleted/renamed — but only
  // ones we ourselves generated (bear the marker), never a hand-authored file.
  for (const existing of fs
    .readdirSync(target.dir)
    .filter((f) => f.endsWith(".md"))) {
    if (validNames.has(existing)) continue;
    const p = path.join(target.dir, existing);
    if (fs.readFileSync(p, "utf8").includes(GENERATED_MARK)) {
      fs.rmSync(p);
      console.log(`  pruned stale: ${path.relative(root, p)}`);
    }
  }

  for (const { file, desc, body } of sources) {
    const header =
      `<!-- GENERATED from .claude/commands/${file} by scripts/sync-commands.mjs` +
      ` — edit the source, then run: npm run sync:commands -->\n`;
    const outBody = target.keepArguments
      ? body
      : body.replace(/\n*\$ARGUMENTS\s*$/, "").trimEnd();
    const dest = path.join(target.dir, file);
    // Unlink first so we never write THROUGH a symlink (e.g. one left by the
    // framework's install-commands.sh) into another repo.
    fs.rmSync(dest, { force: true });
    fs.writeFileSync(
      dest,
      `${target.frontmatter(desc)}${header}\n${outBody}\n`,
    );
    total++;
  }
  console.log(
    `✓ ${target.name.padEnd(9)} ${sources.length} commands → ${path.relative(root, target.dir)}/`,
  );
}

// ── Hermes target (structurally different: a skill DIRECTORY per command) ─────
// Hermes has no flat "commands/" dir. Its `/` menu is built by scanning skills
// (local + external_dirs) and mapping each skill's frontmatter `name:` → `/name`.
// So we emit a thin command-skill per source at skills/commands/<name>/SKILL.md.
const skillsRoot = path.join(root, "skills");
const HERMES_DIR = path.join(skillsRoot, "commands");

// Real top-level skills already own their `/name`; skip any command that would
// collide (e.g. a `symbient` command vs the existing symbient skill).
const existingSkills = new Set(
  fs.existsSync(skillsRoot)
    ? fs
        .readdirSync(skillsRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name !== "commands")
        .map((d) => d.name)
    : [],
);

fs.mkdirSync(HERMES_DIR, { recursive: true });

const hermesSources = sources.filter(({ file }) => {
  const name = file.replace(/\.md$/, "");
  if (existingSkills.has(name)) {
    console.log(`  hermes: skip /${name} (a real skill already provides it)`);
    return false;
  }
  return true;
});
const hermesValid = new Set(
  hermesSources.map((s) => s.file.replace(/\.md$/, "")),
);

// Prune stale generated command-skill dirs — only ones we generated (marker).
for (const entry of fs
  .readdirSync(HERMES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())) {
  if (hermesValid.has(entry.name)) continue;
  const skillMd = path.join(HERMES_DIR, entry.name, "SKILL.md");
  if (
    fs.existsSync(skillMd) &&
    fs.readFileSync(skillMd, "utf8").includes(GENERATED_MARK)
  ) {
    fs.rmSync(path.join(HERMES_DIR, entry.name), {
      recursive: true,
      force: true,
    });
    console.log(`  pruned stale: skills/commands/${entry.name}/`);
  }
}

for (const { file, desc, body } of hermesSources) {
  const name = file.replace(/\.md$/, "");
  const skillDir = path.join(HERMES_DIR, name);
  fs.mkdirSync(skillDir, { recursive: true });
  const header =
    `<!-- GENERATED from .claude/commands/${file} by scripts/sync-commands.mjs` +
    ` — edit the source, then run: npm run sync:commands -->\n`;
  // Hermes command-skills don't take a $ARGUMENTS placeholder; strip it.
  const outBody = body.replace(/\n*\$ARGUMENTS\s*$/, "").trimEnd();
  const fm = `---\nname: ${name}\ndescription: ${JSON.stringify(desc)}\n---\n`;
  const dest = path.join(skillDir, "SKILL.md");
  fs.rmSync(dest, { force: true });
  fs.writeFileSync(dest, `${fm}${header}\n${outBody}\n`);
  total++;
}
console.log(
  `✓ ${"hermes".padEnd(9)} ${hermesSources.length} command-skills → skills/commands/`,
);

console.log(
  `\nGenerated ${total} files across ${TARGETS.length + 1} tools from ${sources.length} canonical commands.` +
    `\nCanonical source: .claude/commands/  ·  Hermes reads them via skills.external_dirs  ·  Zed via ACP.`,
);
