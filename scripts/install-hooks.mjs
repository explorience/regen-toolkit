#!/usr/bin/env node
/**
 * install-hooks.mjs — install this repo's versioned git hooks into the live
 * git hooks directory.
 *
 * Single installer for ALL hooks (there used to be a second one,
 * scripts/install-git-hooks.mjs behind `npm run hooks:install`; two installers
 * with near-identical names meant someone running the widely-documented
 * `install:hooks` got only pre-commit and reasonably believed hooks were
 * installed, while the safety-critical pre-push guard silently was not live):
 *
 *   pre-commit  ← .github/hooks/pre-commit.sh   (validate:structure, schemas)
 *   pre-push    ← scripts/git-hooks/pre-push    (refuses to push agent/* branches)
 *
 * Operator runs once per clone (or whenever hooks change). Idempotent.
 * Hooks dir is resolved with `git rev-parse --git-path hooks`, which is
 * correct for worktrees, for this repo used as a submodule (git dir lives
 * under the parent's .git/modules/), and respects core.hooksPath.
 *
 * Existing hooks whose content differs from the versioned source are NOT
 * overwritten — a hand-written or foreign hook is never clobbered silently.
 * Pass --force to update them to the versioned content.
 *
 * Usage:
 *   npm run install:hooks
 *   npm run install:hooks -- --force
 *   npm run install:hooks -- --uninstall
 */

import { readFileSync, writeFileSync, chmodSync, existsSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const uninstall = process.argv.includes("--uninstall");
const force = process.argv.includes("--force");

const hooksTargetDir = (() => {
  try {
    const gitPath = execSync("git rev-parse --git-path hooks", {
      cwd: rootDir,
      encoding: "utf-8",
    }).trim();
    return path.resolve(rootDir, gitPath);
  } catch {
    console.error("✗ Not a git repository (or git not available)");
    process.exit(1);
  }
})();

// A hooks dir that does not exist is possible (e.g. core.hooksPath points at
// an uncreated directory). Fail with a clear message instead of an ENOENT
// stack trace out of writeFileSync.
if (!existsSync(hooksTargetDir)) {
  console.error(`✗ hooks directory does not exist: ${hooksTargetDir}`);
  console.error("  Create it (or fix core.hooksPath) and re-run: npm run install:hooks");
  process.exit(1);
}

const hooks = [
  { source: path.join(rootDir, ".github", "hooks", "pre-commit.sh"), target: "pre-commit" },
  { source: path.join(rootDir, "scripts", "git-hooks", "pre-push"), target: "pre-push" },
];

let installedCount = 0;
let uninstalledCount = 0;
let skippedCount = 0;
let failed = false;

for (const { source, target } of hooks) {
  const sourcePath = source;
  const targetPath = path.join(hooksTargetDir, target);
  const sourceLabel = path.relative(rootDir, sourcePath);

  if (uninstall) {
    if (existsSync(targetPath)) {
      unlinkSync(targetPath);
      console.log(`✓ removed ${targetPath}`);
      uninstalledCount++;
    } else {
      console.log(`· ${targetPath} (not present)`);
      skippedCount++;
    }
    continue;
  }

  if (!existsSync(sourcePath)) {
    console.error(`✗ source missing: ${sourceLabel}`);
    process.exit(1);
  }

  const content = readFileSync(sourcePath, "utf-8");

  if (existsSync(targetPath) && readFileSync(targetPath, "utf-8") !== content) {
    if (!force) {
      console.error(
        `✗ ${target} exists at ${targetPath} with different content — not overwriting.`,
      );
      console.error(
        `  Review it, then re-run with --force to replace it with ${sourceLabel}:`,
      );
      console.error("  npm run install:hooks -- --force");
      failed = true;
      skippedCount++;
      continue;
    }
    console.log(`! overwriting differing ${target} (--force)`);
  }

  writeFileSync(targetPath, content);
  chmodSync(targetPath, 0o755);
  console.log(`✓ installed ${target} -> ${targetPath} (from ${sourceLabel})`);
  installedCount++;
}

if (uninstall) {
  console.log(`\n${uninstalledCount} hook(s) removed, ${skippedCount} skipped.`);
  console.log("Reinstall: npm run install:hooks");
} else {
  console.log(`\n${installedCount} hook(s) installed, ${skippedCount} skipped.`);
  console.log("pre-commit: runs validate:structure (+ validate:schemas when data/*.yaml is staged).");
  console.log("pre-push:   refuses to push agent/* branches (multica operator work stays local).");
  console.log("Bypass (use sparingly, with explicit user OK): git commit --no-verify");
}

process.exitCode = failed ? 1 : 0;
