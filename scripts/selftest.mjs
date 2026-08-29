#!/usr/bin/env node
/**
 * selftest.mjs — aggregator for framework reliability checks
 *
 * Runs every validator + every optional capability check that the
 * framework currently exposes. Exit code:
 *   0 — all green
 *   1 — at least one failure
 *   2 — only warnings (everything else passed)
 *
 * Each check is a self-contained shell-out. If an optional check's
 * underlying script doesn't exist, it's reported as "skipped" rather
 * than failing the suite — this lets the selftest survive partial
 * framework states (e.g., pre-P10 when clone-framework.mjs is absent).
 *
 * Usage:
 *   npm run selftest
 *   npm run selftest -- --verbose
 *   npm run selftest -- --skip clone
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const argv = process.argv.slice(2);
const verbose = argv.includes("--verbose");
const skipArg = argv.includes("--skip") ? argv[argv.indexOf("--skip") + 1] : "";
const skips = skipArg ? skipArg.split(",") : [];

const results = []; // { name, status: 'PASS'|'FAIL'|'WARN'|'SKIP', detail }

function run(name, cmd, args, { optional = false, skipKey = null } = {}) {
  if (skipKey && skips.includes(skipKey)) {
    results.push({ name, status: "SKIP", detail: `--skip ${skipKey}` });
    return;
  }

  // Check if the underlying script file exists (optional checks)
  if (optional) {
    const scriptIdx = args.findIndex((a) => a.endsWith(".mjs") || a.endsWith(".js"));
    if (scriptIdx > -1) {
      const scriptPath = path.resolve(rootDir, args[scriptIdx]);
      if (!existsSync(scriptPath)) {
        results.push({ name, status: "SKIP", detail: `script missing: ${args[scriptIdx]}` });
        return;
      }
    }
  }

  const result = spawnSync(cmd, args, {
    cwd: rootDir,
    encoding: "utf-8",
    stdio: verbose ? "inherit" : "pipe",
  });

  if (result.error) {
    results.push({ name, status: "FAIL", detail: result.error.message });
    return;
  }

  if (result.status === 0) {
    results.push({ name, status: "PASS", detail: "" });
  } else {
    const tail = (result.stderr || result.stdout || "").trim().split("\n").slice(-3).join(" | ");
    results.push({ name, status: "FAIL", detail: `exit ${result.status}: ${tail}` });
  }
}

console.log(`Running selftest from ${rootDir}\n`);

// Mandatory checks
run("validate:structure", "node", ["scripts/validate-structure.mjs"]);
run("validate:schemas", "node", ["scripts/validate-identity.mjs"], { optional: true });
run("analyze:instances", "node", ["scripts/analyze-instances.mjs"]);

// Optional advisory checks
run("check:divergence", "node", ["scripts/check-divergence.mjs"], {
  optional: true,
  skipKey: "divergence",
});

// Optional capability checks (introduced by later phases)
run("clone:framework --dry", "node", [
  "scripts/clone-framework.mjs",
  "--target",
  "/tmp/selftest-clone-" + process.pid,
  "--config",
  "tests/fixtures/instance-config.yaml",
  "--dry",
], { optional: true, skipKey: "clone" });

// Node test suites (if tests/ exists)
if (existsSync(path.join(rootDir, "tests"))) {
  run("node --test tests/", "node", ["--test", "tests/**/*.test.mjs"], { skipKey: "tests" });
} else {
  results.push({ name: "node --test tests/", status: "SKIP", detail: "no tests/ directory" });
}

// Package suites live outside the root `tests/**` glob, so `npm test` cannot
// see them. Unless they are named here they simply never run again after the
// day they merge — which is exactly what happened to test:multica-bridge and
// test:cloudflare-os-integration. Instances carry no packages/admin, so this
// reports SKIP there rather than failing. It also SKIPs (with instructions)
// when the package is present but its deps are not installed: packages/admin
// is not an npm workspace, so a plain root `npm install` never reaches it, and
// running vitest dep-less would FAIL the whole reliability suite on a machine
// that did everything the README asks. CI installs the deps explicitly, so the
// suite still gates every push there.
const adminDir = path.join(rootDir, "packages", "admin");
if (!existsSync(path.join(adminDir, "package.json"))) {
  results.push({ name: "test:admin", status: "SKIP", detail: "packages/admin not present" });
} else if (!existsSync(path.join(adminDir, "node_modules"))) {
  results.push({
    name: "test:admin",
    status: "SKIP",
    detail: "deps not installed — npm ci --prefix packages/admin",
  });
} else {
  run("test:admin", "npm", ["run", "test:admin"], { skipKey: "admin" });
}

// Report
console.log("\nResults:");
let passed = 0, failed = 0, warned = 0, skipped = 0;
for (const r of results) {
  const icon = { PASS: "✓", FAIL: "✗", WARN: "⚠", SKIP: "·" }[r.status];
  const detail = r.detail ? `  ${r.detail}` : "";
  console.log(`  ${icon} ${r.name.padEnd(30)} ${r.status}${detail}`);
  if (r.status === "PASS") passed++;
  else if (r.status === "FAIL") failed++;
  else if (r.status === "WARN") warned++;
  else skipped++;
}

console.log(`\n  ${passed} passed, ${failed} failed, ${warned} warnings, ${skipped} skipped`);

if (failed > 0) process.exit(1);
if (warned > 0) process.exit(2);
process.exit(0);
