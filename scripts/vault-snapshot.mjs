#!/usr/bin/env node
// vault-snapshot.mjs — capture the workspace working tree to a permanent git ref.
//
// Creates `refs/snapshots/<timestamp>-<slug>` containing the full working
// tree (tracked + untracked + ignored-but-present), without disturbing
// the tree or the stash list. Snapshots are recoverable indefinitely
// via `git ls-tree` and `git cat-file` (they survive `git gc`).
//
// "Vault" in the name preserves the original Obsidian-flavored vocabulary;
// the script applies to any workspace where untracked content is precious
// (org-os instances, knowledge bases, daily-note systems, etc.).
//
// Usage:
//   npm run vault:snapshot                    # default reason "manual"
//   npm run vault:snapshot -- "before merge"  # custom reason

import { execFileSync } from "node:child_process";

const reason = process.argv.slice(2).join(" ").trim() || "manual";
const slug = reason
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 60) || "manual";

const ts = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d+Z$/, "Z")
  .replace("T", "-");

const refName = `refs/snapshots/${ts}-${slug}`;

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).trim();
}

// `git stash create` writes a stash *object* and prints its hash, without
// modifying the working tree, the index, or the stash list. This is the
// safe primitive — never use `git stash push` in a workspace with
// precious untracked content.
const stashHash = git(["stash", "create", "-u", "-m", `vault-snapshot: ${reason}`]);

if (!stashHash) {
  // Empty tree — nothing to snapshot. Use HEAD instead so a ref exists.
  const head = git(["rev-parse", "HEAD"]);
  git(["update-ref", refName, head]);
  console.log(`Working tree clean. Snapshot ref points to HEAD (${head.slice(0, 8)}).`);
  console.log(`  ${refName}`);
  process.exit(0);
}

git(["update-ref", refName, stashHash]);

// Count root-level content notes — fast, and the metric `vault:audit` uses.
const rootNotes = git(["-c", "core.quotePath=false", "ls-tree", "--name-only", stashHash])
  .split("\n")
  .filter((f) => /\.(md|canvas|base|ya?ml)$/i.test(f)).length;

console.log(`✓ Workspace snapshot saved`);
console.log(`  ref:        ${refName}`);
console.log(`  commit:     ${stashHash.slice(0, 12)}`);
console.log(`  root notes: ${rootNotes}`);
console.log(``);
console.log(`Recover one file:`);
console.log(`  git cat-file -p ${refName}:"<filename>" > "<filename>"`);
console.log(``);
console.log(`List snapshots:`);
console.log(`  git for-each-ref refs/snapshots/`);
