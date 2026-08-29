#!/usr/bin/env node
/**
 * sync-upstream.mjs — pull-based framework→instance synchronization (v3.5+).
 *
 * Closes Loop C (Metabolism → Cognition → Federation cascade) from the
 * autopoiesis Phase 2 pilot. Run from within an instance:
 *
 * Stages:
 *   1. Vault-safety: refuse to sync if working tree is dirty (operator must
 *      vault:snapshot + commit/discard first).
 *   2. Sync-freeze check: refuse if .sync-freeze lockfile present.
 *   3. Read federation.yaml.customizations[].maintain_on_sync — paths to preserve.
 *   4. git fetch upstream main; identify new commits since last_sync_commit.
 *   5. git pull --rebase (or merge depending on instance preference).
 *   6. Run npm run migrate (if any new framework migrations to apply).
 *   7. Run npm run sync:packages (refresh enabled packages from framework).
 *   8. Run npm run validate:structure + validate:schemas.
 *   9. Update federation.yaml.metadata.last_sync_commit + last_updated;
 *      seed metadata.genesis_commit from the instance's root commit if
 *      it was never recorded (first sync).
 *  10. Write memory/sync-YYYY-MM-DD.md receipt (creating memory/ if needed).
 *
 * Usage:
 *   npm run sync:upstream                # interactive confirmation
 *   npm run sync:upstream -- --yes       # non-interactive
 *   npm run sync:upstream -- --dry       # show what would happen, don't execute
 *
 * Exit 0 on clean sync, 1 on any error, 2 on sync-freeze refusal.
 */

import {
  readFileSync, writeFileSync, existsSync, statSync, mkdirSync,
} from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const dry = process.argv.includes("--dry");
const yes = process.argv.includes("--yes");

function log(stage, msg) {
  console.log(`[${stage}] ${msg}`);
}

function git(args, opts = {}) {
  // With stdio: "inherit" execSync returns null — guard before trim,
  // otherwise a *successful* pull is misreported as a failure (stage 5).
  const out = execSync(`git ${args}`, { cwd: rootDir, encoding: "utf-8", ...opts });
  return out == null ? "" : out.trim();
}

function gitOk(args) {
  try {
    git(args, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// === Stage 1: vault-safety ===
log("stage 1", "vault-safety check");
const dirty = git("status --porcelain").trim();
if (dirty && !dry) {
  console.error("✗ Working tree is dirty. Snapshot + commit (or discard) before sync.");
  console.error("  → npm run vault:snapshot -- \"pre-sync-upstream\"");
  console.error("  → review/commit changes");
  console.error("  → re-run npm run sync:upstream");
  process.exit(1);
}
if (dirty && dry) {
  console.log("  ⚠ (dry) working tree is dirty — sync would refuse in non-dry mode");
}

// === Stage 2: sync-freeze check ===
log("stage 2", "sync-freeze check");
const freezePath = path.join(rootDir, ".sync-freeze");
if (existsSync(freezePath)) {
  const reason = readFileSync(freezePath, "utf-8").trim();
  console.error(`✗ Sync is FROZEN by .sync-freeze:`);
  console.error(`  ${reason}`);
  console.error("\n  Remove .sync-freeze to enable syncing.");
  process.exit(2);
}

// === Stage 3: read federation.yaml ===
log("stage 3", "reading federation.yaml.customizations + metadata");
const fedPath = path.join(rootDir, "federation.yaml");
if (!existsSync(fedPath)) {
  console.error(`✗ federation.yaml missing — not an org-os workspace?`);
  process.exit(1);
}
let fedRaw = readFileSync(fedPath, "utf-8");
const fed = yaml.load(fedRaw) || {};
const customizations = fed.customizations || [];
const lastSyncCommit = fed.metadata?.last_sync_commit || null;
const upstream = (fed.upstream || [])[0];

if (!upstream || !upstream.url) {
  console.error("✗ No upstream defined in federation.yaml.upstream[0].url");
  process.exit(1);
}

if (customizations.length > 0) {
  log("stage 3", `${customizations.length} customization(s) flagged as maintain_on_sync`);
}

// === Stage 4: fetch + identify new commits ===
log("stage 4", "git fetch upstream");
if (!gitOk("remote get-url upstream")) {
  log("stage 4", `adding upstream remote: ${upstream.url}`);
  if (!dry) git(`remote add upstream ${upstream.url}`);
}
if (!dry) git("fetch upstream --quiet");

let newCommitCount = 0;
let newHead = null;
try {
  newHead = git("rev-parse upstream/main");
  if (lastSyncCommit) {
    const range = `${lastSyncCommit}..${newHead}`;
    newCommitCount = parseInt(git(`rev-list --count ${range}`).trim() || "0", 10);
  } else {
    newCommitCount = parseInt(git(`rev-list --count upstream/main`).trim() || "0", 10);
  }
} catch (e) {
  console.error(`✗ Could not read upstream/main: ${e.message}`);
  process.exit(1);
}

log("stage 4", `${newCommitCount} new commit(s) on upstream/main since ${lastSyncCommit?.slice(0, 12) || "(no last_sync_commit)"}`);

if (newCommitCount === 0) {
  console.log("\n✓ Already up to date with upstream.");
  process.exit(0);
}

// === Confirm ===
if (!yes && !dry) {
  console.log(`\nReady to sync ${newCommitCount} commit(s) from upstream into ${path.basename(rootDir)}.`);
  console.log(`Re-run with --yes to proceed without confirmation, or --dry to preview.`);
  process.exit(0);
}

// === Stage 5: git pull ===
log("stage 5", "git pull --rebase upstream main");
if (!dry) {
  try {
    git("pull --rebase upstream main", { stdio: "inherit" });
  } catch (e) {
    console.error(`✗ Pull failed: ${e.message}`);
    console.error(`  Working tree may be in conflict state. Resolve manually.`);
    process.exit(1);
  }
}

// === Stage 6: migrate ===
log("stage 6", "npm run migrate");
if (!dry) {
  const r = spawnSync("npm", ["run", "migrate"], { cwd: rootDir, encoding: "utf-8", stdio: "inherit" });
  if (r.status !== 0) {
    console.warn("⚠ migrate failed or no migrations to run (check output above)");
  }
}

// === Stage 7: sync packages ===
log("stage 7", "npm run sync:packages");
if (!dry) {
  const r = spawnSync("npm", ["run", "sync:packages"], { cwd: rootDir, encoding: "utf-8", stdio: "inherit" });
  if (r.status !== 0) {
    console.warn("⚠ sync:packages failed (check output above; not fatal)");
  }
}

// === Stage 8: validate ===
log("stage 8", "npm run validate:structure + validate:schemas");
if (!dry) {
  for (const cmd of ["validate:structure", "validate:schemas"]) {
    const r = spawnSync("npm", ["run", cmd], { cwd: rootDir, encoding: "utf-8" });
    if (r.status !== 0) {
      console.error(`✗ ${cmd} failed post-sync. Output:\n${r.stdout}\n${r.stderr}`);
      console.error("  Investigate before proceeding. Lineage stamp NOT updated.");
      process.exit(1);
    }
  }
}

// === Stage 9: update lineage stamp ===
log("stage 9", "updating federation.yaml.metadata.last_sync_commit + last_updated");
if (!dry) {
  const today = new Date().toISOString().slice(0, 10);
  let updated = fedRaw;
  // Seed genesis_commit on first sync if the instance never recorded one
  // (validate-identity warns about this case and promises the auto-seed).
  if (!/genesis_commit:/.test(updated)) {
    const rootCommits = git("rev-list --max-parents=0 HEAD").split("\n");
    const genesis = rootCommits[rootCommits.length - 1].trim();
    updated = updated.replace(/(metadata:)/, `$1\n  genesis_commit: "${genesis}"`);
    log("stage 9", `seeded genesis_commit ${genesis.slice(0, 12)} (first sync)`);
  }
  // Replace last_sync_commit
  if (/last_sync_commit:/.test(updated)) {
    updated = updated.replace(
      /last_sync_commit:\s*(null|"[^"]*")/,
      `last_sync_commit: "${newHead}"`,
    );
  } else {
    updated = updated.replace(/(metadata:)/, `$1\n  last_sync_commit: "${newHead}"`);
  }
  // Replace last_updated
  if (/last_updated:/.test(updated)) {
    updated = updated.replace(
      /last_updated:\s*"[^"]*"/,
      `last_updated: "${today}"`,
    );
  } else {
    updated = updated.replace(/(metadata:)/, `$1\n  last_updated: "${today}"`);
  }
  writeFileSync(fedPath, updated);
}

// === Stage 10: receipt ===
log("stage 10", "writing memory receipt");
if (!dry) {
  const today = new Date().toISOString().slice(0, 10);
  const memoryDir = path.join(rootDir, "memory");
  mkdirSync(memoryDir, { recursive: true }); // fresh instances may lack memory/
  const receiptPath = path.join(memoryDir, `sync-${today}.md`);
  const receipt = `# Sync receipt — ${today}

- **Upstream:** ${upstream.url}
- **Previous last_sync_commit:** ${lastSyncCommit || "(none)"}
- **New last_sync_commit:** ${newHead}
- **Commits applied:** ${newCommitCount}
- **Customizations preserved:** ${customizations.length}

## Next steps

- Review changes: \`git log --oneline ${lastSyncCommit ? lastSyncCommit.slice(0, 12) + ".." : ""}HEAD\`
- Re-run \`/initialize\` to refresh dashboard
- If sync introduced regressions, investigate before next sync

Generated by scripts/sync-upstream.mjs.
`;
  writeFileSync(receiptPath, receipt);
  log("stage 10", `wrote ${path.relative(rootDir, receiptPath)}`);
}

console.log(`\n✓ ${dry ? "dry-run complete" : `synced ${newCommitCount} commit(s) from upstream`}`);
