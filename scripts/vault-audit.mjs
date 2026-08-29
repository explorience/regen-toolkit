#!/usr/bin/env node
// vault-audit.mjs — compare current workspace root content count against
// the latest snapshot ref. Exit 1 if any files have disappeared.
//
// "Vault" in the name preserves the original Obsidian-flavored vocabulary;
// the audit applies to any workspace where untracked content is precious.
//
// Scope: root-level content files (.md, .canvas, .base, .yaml) — the same
// set tracked by `vault-snapshot.mjs`. Subdirectories (memory/, data/, etc.)
// are *snapshotted* but not *audited* here — they're protected by the
// snapshot ref, which captures the entire tree.
//
// Usage:
//   npm run vault:audit                  # against latest snapshot
//   npm run vault:audit -- <ref-name>    # against a specific snapshot

import { execFileSync } from "node:child_process";

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).trim();
  } catch {
    return "";
  }
}

function getLatestSnapshot() {
  const refs = git(["for-each-ref", "--sort=-creatordate", "--format=%(refname)", "refs/snapshots/"]);
  return refs.split("\n").filter(Boolean)[0] || "";
}

const argRef = process.argv[2];
const snapRef = argRef || getLatestSnapshot();

if (!snapRef) {
  console.error("✗ No snapshot found.");
  console.error('  Create one with: npm run vault:snapshot -- "<reason>"');
  process.exit(2);
}

// APFS stores filenames as NFD (decomposed); git stores NFC (composed).
// Normalize both sides to NFC for the comparison.
const nfc = (s) => s.normalize("NFC");

const CONTENT_PATTERN = /\.(md|canvas|base|ya?ml)$/i;

// Files in snapshot — root level only, content files.
const snapFiles = new Set(
  git(["-c", "core.quotePath=false", "ls-tree", "--name-only", snapRef])
    .split("\n")
    .filter((f) => f && CONTENT_PATTERN.test(f))
    .map(nfc),
);

// Files currently in workspace root, content files.
const fs = await import("node:fs");
const path = await import("node:path");
const here = process.cwd();
const currentFiles = new Set(
  fs
    .readdirSync(here)
    .filter((f) => CONTENT_PATTERN.test(f))
    .filter((f) => fs.statSync(path.join(here, f)).isFile())
    .map(nfc),
);

const missing = [...snapFiles].filter((f) => !currentFiles.has(f));
const added = [...currentFiles].filter((f) => !snapFiles.has(f));

console.log(`Audit against snapshot: ${snapRef}`);
console.log(`  snapshot: ${snapFiles.size} root files`);
console.log(`  current:  ${currentFiles.size} root files`);
console.log(`  missing:  ${missing.length}`);
console.log(`  added:    ${added.length}`);

if (missing.length > 0) {
  console.log(``);
  console.log(`✗ Missing files (in snapshot, not in workspace):`);
  missing.slice(0, 30).forEach((f) => console.log(`  - ${f}`));
  if (missing.length > 30) console.log(`  ... and ${missing.length - 30} more`);
  console.log(``);
  console.log(`Recover from snapshot:`);
  console.log(`  git cat-file -p ${snapRef}:"<filename>" > "<filename>"`);
  process.exit(1);
}

if (added.length > 0) {
  console.log(``);
  console.log(`+ New files since snapshot:`);
  added.slice(0, 10).forEach((f) => console.log(`  + ${f}`));
  if (added.length > 10) console.log(`  ... and ${added.length - 10} more`);
}

console.log(``);
console.log(`✓ No files lost since snapshot.`);
