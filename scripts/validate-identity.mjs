#!/usr/bin/env node
/**
 * validate-identity.mjs — schemas + identity coherence validator
 *
 * Combines:
 *  1. EIP-4824 .well-known/*.json schema validation (structural sanity)
 *  2. IDENTITY.md ↔ federation.yaml.identity agreement check
 *  3. federation.yaml.metadata.framework_version triplet sanity
 *  4. Lineage stamp shape (v3.5+):
 *     - metadata.genesis_commit: 40-hex SHA (immutable, set at clone time)
 *     - metadata.last_sync_commit: 40-hex SHA OR null (mutable, set by sync-upstream)
 *
 * Exit 0 if all green (warnings allowed); 1 on any failure, or on
 * warnings when --strict. Warnings must NOT block by default: sync-upstream
 * stage 8 runs this validator, and instances without a genesis_commit yet
 * (seeded on first sync) would otherwise never be able to sync.
 *
 * Wired in as `npm run validate:schemas` (per existing package.json mapping).
 *
 * Usage:
 *   npm run validate:schemas
 *   node scripts/validate-identity.mjs --strict          # warnings → errors
 *   node scripts/validate-identity.mjs ../refi-med-os    # validate another instance
 *
 * The target directory defaults to this script's own checkout. Passing one
 * lets the FRAMEWORK's validator assess a sibling instance, which is what
 * packages/instance-doctor does — instances carry missing or skewed copies of
 * this script, so running theirs is exactly what cannot be relied on.
 * Mirrors scripts/validate-structure.mjs, which has always taken argv[2].
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const targetArg = args.find((a) => !a.startsWith("-"));
const rootDir = targetArg ? path.resolve(targetArg) : path.resolve(__dirname, "..");
let passed = 0, failed = 0, warned = 0;

function check(name, ok, detail = "") {
  const icon = ok ? "✓" : "✗";
  console.log(`  ${icon} ${name}${detail ? "  " + detail : ""}`);
  if (ok) passed++;
  else failed++;
}

function warn(msg) {
  console.log(`  ⚠ ${msg}`);
  if (strict) failed++;
  else warned++;
}

// --- 1. .well-known/*.json validity ---
console.log("\n1. .well-known/*.json schemas");
const wellKnownDir = path.join(rootDir, ".well-known");
if (existsSync(wellKnownDir)) {
  const files = ["dao.json", "members.json", "projects.json", "finances.json", "activities.json", "proposals.json", "contracts.json"];
  for (const f of files) {
    const p = path.join(wellKnownDir, f);
    if (!existsSync(p)) {
      warn(`.well-known/${f} missing (regenerate via npm run generate:schemas)`);
      continue;
    }
    try {
      const data = JSON.parse(readFileSync(p, "utf-8"));
      check(`.well-known/${f} parses as JSON`, true);
      if (f === "dao.json") {
        check(`.well-known/dao.json has @context`, !!data["@context"]);
        check(`.well-known/dao.json has name`, !!data.name);
      }
    } catch (e) {
      check(`.well-known/${f} parses as JSON`, false, e.message);
    }
  }
} else {
  warn(".well-known/ directory missing — run npm run generate:schemas");
}

// --- 2. IDENTITY.md ↔ federation.yaml agreement ---
console.log("\n2. IDENTITY.md ↔ federation.yaml.identity agreement");
const identityMdPath = path.join(rootDir, "IDENTITY.md");
const fedPath = path.join(rootDir, "federation.yaml");

if (existsSync(identityMdPath) && existsSync(fedPath)) {
  const idMd = readFileSync(identityMdPath, "utf-8");
  const fed = yaml.load(readFileSync(fedPath, "utf-8")) || {};

  const idName = (idMd.match(/^\s*-\s*\*\*Name:\*\*\s*(.+)$/m) || [])[1]?.trim();
  const idType = (idMd.match(/^\s*-\s*\*\*Type:\*\*\s*(.+)$/m) || [])[1]?.trim();
  const fedName = fed.identity?.name;
  const fedType = fed.identity?.type;

  if (idName && fedName) {
    check(`Name agreement (IDENTITY.md "${idName}" ≈ federation.yaml "${fedName}")`, idName === fedName);
  } else {
    warn("Name not present in both IDENTITY.md and federation.yaml — cannot compare");
  }
  if (idType && fedType) {
    check(`Type agreement (IDENTITY.md "${idType}" ≈ federation.yaml "${fedType}")`, idType === fedType);
  } else {
    warn("Type not present in both IDENTITY.md and federation.yaml — cannot compare");
  }
} else {
  if (!existsSync(identityMdPath)) warn("IDENTITY.md missing");
  if (!existsSync(fedPath)) warn("federation.yaml missing");
}

// --- 3. Lineage stamp shape (v3.5+) ---
console.log("\n3. federation.yaml.metadata lineage stamp");
if (existsSync(fedPath)) {
  const fed = yaml.load(readFileSync(fedPath, "utf-8")) || {};
  const meta = fed.metadata || {};

  if (meta.framework_version) {
    const fv = String(meta.framework_version);
    const fvMajorMinor = (fv.match(/^(\d+)\.(\d+)/) || [])[0];
    const fvOk = fvMajorMinor === fv;
    check(`framework_version "${fv}" is major.minor (e.g., "3.5")`, fvOk);
  } else {
    check(`federation.yaml.metadata.framework_version present`, false);
  }

  const SHA_RE = /^[0-9a-f]{40}$/i;
  if (meta.genesis_commit) {
    check(`metadata.genesis_commit is 40-hex SHA`, SHA_RE.test(meta.genesis_commit));
  } else {
    warn(`metadata.genesis_commit missing (lands during v3.5 migration; will auto-seed on first sync-upstream)`);
  }

  if (meta.last_sync_commit === null || meta.last_sync_commit === undefined) {
    check(`metadata.last_sync_commit is null or 40-hex SHA`, true);
  } else {
    check(
      `metadata.last_sync_commit is null or 40-hex SHA`,
      SHA_RE.test(meta.last_sync_commit),
      String(meta.last_sync_commit).slice(0, 12),
    );
  }
}

// --- Summary ---
console.log("\n" + "=".repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed, ${warned} warnings`);

if (failed > 0) {
  console.log("\n✗ Identity/schema validation failed");
  process.exit(1);
}
if (warned > 0 && strict) {
  process.exit(1);
}
console.log("\n✓ Identity/schema validation passed");
