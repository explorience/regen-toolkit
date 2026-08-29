#!/usr/bin/env node
/**
 * v3-to-v3-5-consolidation.mjs — additive, idempotent migration from v3.0 → v3.5.
 *
 * Run via: npm run migrate -- --target v3.5
 *
 * Strictly additive. No deletes. No destructive renames. Re-running is safe.
 *
 * What it does (per instance):
 *   1. Seed federation.yaml.metadata.genesis_commit (if missing) from
 *      `git rev-list --max-parents=0 HEAD | tail -1` of the instance.
 *   2. Seed federation.yaml.metadata.last_sync_commit (if missing) to null.
 *   3. Add `lifecycle_status` field to any data/packages-matrix.yaml entries
 *      that lack it (default "dormant" — operator can adjust).
 *   4. Log to memory/migrations-YYYY-MM-DD.md.
 *
 * What it does NOT do:
 *   - Force-upgrade framework_version (operator must explicitly opt in)
 *   - Touch skills-matrix.yaml (instance-specific; framework owns its own)
 *   - Modify any data/*.yaml or skill/package content
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");

const log = [];
function note(msg) {
  console.log(msg);
  log.push(msg);
}

note(`v3-to-v3-5-consolidation: running in ${rootDir}`);

// === Step 1+2: federation.yaml lineage stamp ===
const fedPath = path.join(rootDir, "federation.yaml");
if (existsSync(fedPath)) {
  let raw = readFileSync(fedPath, "utf-8");
  let changed = false;

  const fed = yaml.load(raw) || {};
  const meta = fed.metadata || {};

  if (!meta.genesis_commit) {
    let genesis = null;
    try {
      genesis = execSync("git rev-list --max-parents=0 HEAD | tail -1", {
        cwd: rootDir,
        encoding: "utf-8",
      }).trim();
    } catch {
      note("  ⚠ Could not derive genesis_commit (no git history?); skipping");
    }
    if (genesis) {
      raw = raw.replace(/(^metadata:[\s\S]*?)(?=^\S|\Z)/m, (block) => {
        if (/genesis_commit:/.test(block)) return block;
        return block.trimEnd() + `\n  genesis_commit: "${genesis}"\n`;
      });
      note(`  ✓ Seeded metadata.genesis_commit: ${genesis.slice(0, 12)}…`);
      changed = true;
    }
  } else {
    note(`  · metadata.genesis_commit already set (${String(meta.genesis_commit).slice(0, 12)}…)`);
  }

  if (meta.last_sync_commit === undefined) {
    raw = raw.replace(/(^metadata:[\s\S]*?)(?=^\S|\Z)/m, (block) => {
      if (/last_sync_commit:/.test(block)) return block;
      return block.trimEnd() + `\n  last_sync_commit: null  # seed by sync-upstream\n`;
    });
    note(`  ✓ Seeded metadata.last_sync_commit: null`);
    changed = true;
  } else {
    note(`  · metadata.last_sync_commit already present`);
  }

  if (changed) writeFileSync(fedPath, raw);
} else {
  note("  · No federation.yaml; skipping lineage stamp");
}

// === Step 3: packages-matrix lifecycle_status ===
const pmPath = path.join(rootDir, "data", "packages-matrix.yaml");
if (existsSync(pmPath)) {
  const pm = yaml.load(readFileSync(pmPath, "utf-8")) || { packages: [] };
  let updated = 0;
  for (const pkg of pm.packages || []) {
    if (!pkg.lifecycle_status) {
      pkg.lifecycle_status = "dormant";
      updated++;
    }
  }
  if (updated > 0) {
    writeFileSync(pmPath, yaml.dump(pm, { lineWidth: 120 }));
    note(`  ✓ Added lifecycle_status: "dormant" to ${updated} packages-matrix entries`);
  } else {
    note(`  · packages-matrix lifecycle_status already populated`);
  }
} else {
  note("  · No data/packages-matrix.yaml (framework-only registry); skipping");
}

// === Log ===
const today = new Date().toISOString().slice(0, 10);
const memDir = path.join(rootDir, "memory");
if (!existsSync(memDir)) mkdirSync(memDir, { recursive: true });
const logPath = path.join(memDir, `migrations-${today}.md`);
const entry = `\n## v3-to-v3-5-consolidation — ${new Date().toISOString()}\n\n${log.map((l) => `- ${l}`).join("\n")}\n`;
if (existsSync(logPath)) {
  appendFileSync(logPath, entry);
} else {
  writeFileSync(logPath, `# Migration log — ${today}\n${entry}`);
}
note(`\n✓ Migration recorded in ${path.relative(rootDir, logPath)}`);
