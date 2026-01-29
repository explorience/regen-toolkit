/**
 * Sync GitHub issue labels → article frontmatter
 * Also: replace source letter codes with human-readable names
 * Also: add source:* labels to GitHub issues
 *
 * Run: npx tsx scripts/sync-issues-to-frontmatter.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const REPO = "explorience/regen-toolkit";
const CONTENT_DIR = path.resolve(__dirname, "../content");

// ── Source code → name mapping (from content/sources/*.md frontmatter) ──

function buildSourceMap(): Record<string, string> {
  const sourcesDir = path.join(CONTENT_DIR, "sources");
  const map: Record<string, string> = {};
  for (const file of fs.readdirSync(sourcesDir)) {
    if (file === "_index.md" || !file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(path.join(sourcesDir, file), "utf8"));
    if (data.code && data.name) {
      map[data.code.toUpperCase()] = data.name;
    }
  }
  return map;
}

// ── Collect all markdown files ──

function collectMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.name.endsWith(".md") && entry.name !== "_index.md") {
      results.push(full);
    }
  }
  return results;
}

// ── Fetch issues via gh CLI ──

interface GHIssue {
  number: number;
  title: string;
  labels: { name: string }[];
  body: string;
  assignees: { login: string }[];
}

function fetchIssues(): GHIssue[] {
  const raw = execSync(
    `gh issue list -R ${REPO} --limit 300 --state all --json number,title,labels,body,assignees`,
    { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
  );
  return JSON.parse(raw);
}

// ── Extract file path from issue body ──

function extractFilePath(body: string): string | null {
  const m = body.match(/\*\*File:\*\*\s*`([^`]+)`/);
  return m ? m[1] : null;
}

// ── Source slug for label (e.g. "ReFi DAO Local ReFi Toolkit" → "refi-dao-toolkit") ──

function sourceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Main ──

async function main() {
  const sourceMap = buildSourceMap();
  console.log(`Source map: ${Object.keys(sourceMap).length} entries`);
  for (const [code, name] of Object.entries(sourceMap)) {
    console.log(`  ${code} → ${name}`);
  }

  // Build reverse map: source slug → source name (for label creation)
  const sourceNames = Object.values(sourceMap);

  // ── 1. Fix source references in all markdown files ──
  console.log("\n── Fixing source references in frontmatter ──");
  const allFiles = collectMarkdownFiles(CONTENT_DIR);
  let sourcesFixed = 0;

  // Also track which files reference which sources (for adding labels to issues later)
  const fileToSources: Record<string, string[]> = {};

  for (const filePath of allFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    if (!Array.isArray(data.sources) || data.sources.length === 0) continue;

    const relPath = "content/" + path.relative(CONTENT_DIR, filePath);
    const resolvedSources: string[] = [];
    let changed = false;

    for (const src of data.sources) {
      const code = typeof src === "string" ? src : src?.code;
      if (!code) continue;
      const upper = String(code).toUpperCase();
      if (sourceMap[upper]) {
        resolvedSources.push(sourceMap[upper]);
        changed = true;
      } else if (upper === "NEW") {
        resolvedSources.push("original");
        changed = true;
      } else if (/^[A-Z]$/.test(upper)) {
        // Unmapped single-letter code (P, Q, R, S etc.)
        resolvedSources.push(`unknown-source-${upper}`);
        changed = true;
      } else {
        // Keep as-is if already a name string
        resolvedSources.push(String(code));
      }
    }

    if (changed) {
      data.sources = resolvedSources;
      fs.writeFileSync(filePath, matter.stringify(content, data));
      sourcesFixed++;
    }

    fileToSources[relPath] = resolvedSources;
  }
  console.log(`Fixed sources in ${sourcesFixed} files`);

  // ── 2. Fetch issues and sync labels → frontmatter ──
  console.log("\n── Fetching GitHub issues ──");
  const issues = fetchIssues();
  console.log(`Fetched ${issues.length} issues`);

  // Build file → issue map
  const fileToIssue: Record<string, GHIssue> = {};
  let matchCount = 0;
  const unmatched: { number: number; title: string }[] = [];

  for (const issue of issues) {
    if (!issue.body) continue;
    const fp = extractFilePath(issue.body);
    if (fp) {
      fileToIssue[fp] = issue;
      matchCount++;
    } else {
      // Critical-path / meta issues don't have File: paths — skip silently
      const isMeta = issue.labels.some(
        (l) =>
          l.name === "critical-path" ||
          ["bug", "enhancement", "documentation", "question", "duplicate", "invalid", "wontfix"].includes(l.name)
      );
      if (!isMeta) {
        unmatched.push({ number: issue.number, title: issue.title });
      }
    }
  }
  console.log(`Matched ${matchCount} issues to files`);
  if (unmatched.length) {
    console.log(`Unmatched issues (no File: path): ${unmatched.length}`);
    for (const u of unmatched.slice(0, 5)) {
      console.log(`  #${u.number}: ${u.title}`);
    }
    if (unmatched.length > 5) console.log(`  ... and ${unmatched.length - 5} more`);
  }

  // ── 3. Update frontmatter from issue labels ──
  console.log("\n── Updating frontmatter from issue labels ──");
  let updated = 0;

  for (const filePath of allFiles) {
    const relPath = "content/" + path.relative(CONTENT_DIR, filePath);
    const issue = fileToIssue[relPath];
    if (!issue) continue;

    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const labels = issue.labels.map((l) => l.name);

    // status
    const statusLabel = labels.find((l) => l.startsWith("status:"));
    if (statusLabel) data.status = statusLabel.replace("status:", "");

    // priority
    const priorityLabel = labels.find((l) => l.startsWith("priority:"));
    if (priorityLabel) data.priority = priorityLabel.replace("priority:", "");

    // critical_paths
    const pathLabels = labels.filter((l) => l.startsWith("path:")).map((l) => l.replace("path:", ""));
    if (pathLabels.length > 0) data.critical_paths = pathLabels;

    // boolean flags
    if (labels.includes("needs-sources")) data.needs_sources = true;
    if (labels.includes("good-first-issue")) data.good_first_issue = true;

    // issue number
    data.issue = issue.number;

    // assignees
    if (issue.assignees.length > 0) {
      data.assignees = issue.assignees.map((a) => a.login);
    }

    fs.writeFileSync(filePath, matter.stringify(content, data));
    updated++;
  }
  console.log(`Updated ${updated} files with issue metadata`);

  // ── 4. Create source labels and add them to issues ──
  console.log("\n── Creating source labels on GitHub ──");

  // Collect ALL unique source slugs from resolved frontmatter (includes unknown-source-*)
  const allSourceSlugs = new Set<string>();
  for (const sources of Object.values(fileToSources)) {
    for (const src of sources) {
      allSourceSlugs.add(src === "original" ? "original" : sourceSlug(src));
    }
  }

  const sourceColors = [
    "C5DEF5", "BFD4F2", "D4C5F9", "F9D0C4", "FEF2C0",
    "BFDADC", "C2E0C6", "E6E6FA", "FADADD", "D5E8D4",
    "FFE4B5", "E0BBE4", "957DAD", "D291BC", "FEC8D8",
  ];

  let colorIdx = 0;
  for (const slug of allSourceSlugs) {
    const labelName = `source:${slug}`;
    const color = slug === "original" ? "0E8A16" : slug.startsWith("unknown-source") ? "CCCCCC" : sourceColors[colorIdx++ % sourceColors.length];
    const desc = slug === "original" ? "Original content (no external source)" : slug.startsWith("unknown-source") ? `Unmapped source code ${slug.slice(-1).toUpperCase()}` : `Source: ${slug}`;
    try {
      execSync(
        `gh label create "${labelName}" -R ${REPO} --color "${color}" --description "${desc}" --force`,
        { encoding: "utf8", stdio: "pipe" }
      );
      console.log(`  Created/updated label: ${labelName}`);
    } catch (e: any) {
      console.log(`  Label ${labelName}: ${e.message?.split("\n")[0]}`);
    }
  }

  // ── 5. Add source labels to matching issues ──
  console.log("\n── Adding source labels to issues ──");
  let labelsAdded = 0;

  for (const [relPath, sources] of Object.entries(fileToSources)) {
    const issue = fileToIssue[relPath];
    if (!issue || sources.length === 0) continue;

    const existingLabels = issue.labels.map((l) => l.name);
    const newLabels: string[] = [];

    for (const src of sources) {
      const labelName = src === "original" ? "source:original" : `source:${sourceSlug(src)}`;
      if (!existingLabels.includes(labelName)) {
        newLabels.push(labelName);
      }
    }

    if (newLabels.length > 0) {
      // Add all labels in one call
      const labelArgs = newLabels.map((l) => `--add-label "${l}"`).join(" ");
      try {
        execSync(
          `gh issue edit ${issue.number} -R ${REPO} ${labelArgs}`,
          { encoding: "utf8", stdio: "pipe" }
        );
        labelsAdded++;
      } catch (e: any) {
        // If batch fails, try one at a time
        let anyAdded = false;
        for (const label of newLabels) {
          try {
            execSync(
              `gh issue edit ${issue.number} -R ${REPO} --add-label "${label}"`,
              { encoding: "utf8", stdio: "pipe" }
            );
            anyAdded = true;
          } catch {}
        }
        if (anyAdded) labelsAdded++;
        else console.log(`  Failed to label #${issue.number}: ${e.message?.split("\n")[0]}`);
      }
    }
  }
  console.log(`Added source labels to ${labelsAdded} issues`);

  // ── Summary ──
  console.log("\n── Summary ──");
  console.log(`  Sources fixed in frontmatter: ${sourcesFixed}`);
  console.log(`  Issues matched to files: ${matchCount}`);
  console.log(`  Files updated with issue metadata: ${updated}`);
  console.log(`  Issues given source labels: ${labelsAdded}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
