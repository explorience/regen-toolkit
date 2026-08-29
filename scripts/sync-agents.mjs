#!/usr/bin/env node
// sync-agents.mjs — install/update the repo's Berd agent personas globally.
//
// Canonical source of truth: `.agents/agents/*.md` (Berd's project-local
// Agent Markdown dir — Berd discovers these automatically when this project
// is open). This script mirrors them to the user-level `~/.agents/agents/`
// so the personas also work when no project (or another project) is open —
// Operator spans the whole federation, not just this repo.
//
// Safety rules (in order):
//   - Never touch an agent listed in the target's `.berd-bundled-agents.json`
//     (those belong to the Berd app, not to us) — even with --adopt.
//   - Overwrite a target file only if its frontmatter says
//     `managed_by: org-os` (i.e. a previous sync wrote it). Hand-authored
//     files are skipped with a warning; pass --adopt to take them over.
//   - Every canonical source must carry `managed_by: org-os` itself (the
//     copy is verbatim, so the marker is what makes future syncs safe) and
//     the Berd-required `name` + `description` keys.
//
// Usage:  node scripts/sync-agents.mjs [--adopt] [--dry-run]
//         (or: npm run sync:agents)
// Tests pass --source/--target to run against fixture dirs.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flagValue = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : undefined;
};
const SRC = flagValue("--source") ?? path.join(root, ".agents", "agents");
const DEST =
  flagValue("--target") ?? path.join(os.homedir(), ".agents", "agents");
const ADOPT = argv.includes("--adopt");
const DRY = argv.includes("--dry-run");

if (!fs.existsSync(SRC)) {
  console.error(`ERROR: canonical source ${SRC} not found.`);
  process.exit(1);
}

// Validate every canonical agent before writing anything.
const sources = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((file) => {
    const raw = fs.readFileSync(path.join(SRC, file), "utf8");
    const { data } = matter(raw);
    for (const key of ["name", "description"]) {
      if (!data[key]) {
        console.error(
          `ERROR: ${file} is missing required frontmatter key "${key}" (Berd Agent Markdown requires name + description).`,
        );
        process.exit(1);
      }
    }
    if (data.managed_by !== "org-os") {
      console.error(
        `ERROR: ${file} is missing "managed_by: org-os" in its frontmatter — add it so future syncs know the installed copy is ours to update.`,
      );
      process.exit(1);
    }
    return { file, raw };
  });

// Agents seeded by the Berd app itself are off-limits.
const bundledManifest = path.join(DEST, ".berd-bundled-agents.json");
const bundled = new Set(
  fs.existsSync(bundledManifest)
    ? (JSON.parse(fs.readFileSync(bundledManifest, "utf8")).seededFiles ?? [])
    : [],
);

if (!DRY) fs.mkdirSync(DEST, { recursive: true });

const would = (past, base) => (DRY ? `would ${base}` : past);
const counts = {};
const tally = (action, file, note = "") => {
  counts[action] = (counts[action] ?? 0) + 1;
  console.log(`  ${action.padEnd(13)} ${file}${note}`);
};

for (const { file, raw } of sources) {
  if (bundled.has(file)) {
    tally("skipped", file, "  (Berd-bundled agent — never touched)");
    continue;
  }
  const dest = path.join(DEST, file);
  if (!fs.existsSync(dest)) {
    if (!DRY) fs.writeFileSync(dest, raw);
    tally(would("installed", "install"), file);
    continue;
  }
  const existing = fs.readFileSync(dest, "utf8");
  if (existing === raw) {
    tally("unchanged", file);
    continue;
  }
  const managed = matter(existing).data.managed_by === "org-os";
  if (!managed && !ADOPT) {
    tally(
      "skipped",
      file,
      "  (hand-authored — rerun with --adopt to take over)",
    );
    continue;
  }
  if (!DRY) fs.writeFileSync(dest, raw);
  tally(
    would(managed ? "updated" : "adopted", managed ? "update" : "adopt"),
    file,
  );
}

const summary = Object.entries(counts)
  .map(([action, n]) => `${n} ${action}`)
  .join(", ");
console.log(
  `\n✓ ${sources.length} canonical agents → ${DEST}${DRY ? "  (dry run)" : ""}` +
    `\n  ${summary || "nothing to do"}` +
    `\n  Canonical source: .agents/agents/  ·  Berd also reads it directly when this project is open.`,
);
