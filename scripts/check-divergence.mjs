#!/usr/bin/env node
/**
 * check-divergence.mjs — advisory: compare instance scripts against framework canonical.
 *
 * For each script in the framework's `scripts/` directory (whose name appears
 * in any instance's `scripts/`), compute md5 hashes side-by-side and report:
 *   IDENTICAL → instance is on the canonical version
 *   DIVERGES  → instance has a local variant (intentional or drift)
 *   MISSING   → script not present in that instance
 *
 * Non-destructive: never modifies any file. Output is purely informational,
 * intended to be reviewed by the operator during cascade (see Phase 14 of
 * the v3.5.0 consolidation release plan).
 *
 * Usage:
 *   npm run check:divergence
 *   npm run check:divergence -- --instances "../refi-bcn-os,../refi-dao-os"
 *   npm run check:divergence -- --script compile-knowledge.mjs
 *
 * Default --instances: discovered from data/instances.yaml (looks for
 * sibling directories under the framework's parent).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const parentDir = path.resolve(rootDir, "..");

function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

function md5(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

// Resolve instance list
let instances = [];
const instancesArg = getArg("--instances");
if (instancesArg) {
  instances = instancesArg.split(",").map((s) => path.resolve(rootDir, s.trim()));
} else {
  const instancesYamlPath = path.join(rootDir, "data", "instances.yaml");
  if (fs.existsSync(instancesYamlPath)) {
    const data = yaml.load(fs.readFileSync(instancesYamlPath, "utf-8")) || {};
    const known = (data.instances || []).map((i) => i.id).filter(Boolean);
    instances = known
      .map((id) => path.resolve(parentDir, id))
      .filter((p) => fs.existsSync(path.join(p, "scripts")));
  }
}

if (instances.length === 0) {
  console.log("No instances discovered.");
  console.log("Pass --instances \"path1,path2,...\" or populate data/instances.yaml.");
  process.exit(0);
}

// Resolve script list
let scripts;
const scriptArg = getArg("--script");
if (scriptArg) {
  scripts = [scriptArg];
} else {
  scripts = fs
    .readdirSync(path.join(rootDir, "scripts"))
    .filter((f) => f.endsWith(".mjs") || f.endsWith(".js"));
}

console.log(`Framework: ${rootDir}`);
console.log(`Instances: ${instances.length} (${instances.map((i) => path.basename(i)).join(", ")})`);
console.log(`Scripts:   ${scripts.length}\n`);

let divergencesCount = 0;
let missingCount = 0;
let identicalCount = 0;

for (const script of scripts) {
  const frameworkPath = path.join(rootDir, "scripts", script);
  if (!fs.existsSync(frameworkPath)) continue;
  const fwHash = md5(frameworkPath);

  // Only report if at least one instance has this script
  const instanceStates = instances.map((inst) => {
    const p = path.join(inst, "scripts", script);
    if (!fs.existsSync(p)) return { instance: path.basename(inst), state: "MISSING", hash: null };
    const h = md5(p);
    return {
      instance: path.basename(inst),
      state: h === fwHash ? "IDENTICAL" : "DIVERGES",
      hash: h,
    };
  });

  const hasAny = instanceStates.some((s) => s.state !== "MISSING");
  if (!hasAny) continue;

  const diverges = instanceStates.filter((s) => s.state === "DIVERGES");
  const missing = instanceStates.filter((s) => s.state === "MISSING");
  const identical = instanceStates.filter((s) => s.state === "IDENTICAL");

  divergencesCount += diverges.length;
  missingCount += missing.length;
  identicalCount += identical.length;

  if (diverges.length === 0 && missing.length === 0) {
    console.log(`✓ ${script} — all ${identical.length} instance(s) IDENTICAL`);
    continue;
  }

  console.log(`! ${script}`);
  console.log(`  framework: ${fwHash.slice(0, 12)}`);
  for (const s of instanceStates) {
    const marker = s.state === "IDENTICAL" ? "=" : s.state === "DIVERGES" ? "≠" : "·";
    const hashShort = s.hash ? s.hash.slice(0, 12) : "—".padEnd(12);
    console.log(`  ${marker} ${s.instance.padEnd(28)} ${hashShort}  ${s.state}`);
  }
}

console.log(
  `\nSummary: ${identicalCount} identical, ${divergencesCount} divergent, ${missingCount} missing`,
);

if (divergencesCount > 0) {
  console.log(`\nDivergent instance scripts are not auto-resolved. Operator review required:`);
  console.log(`  diff scripts/<name> ../<instance>/scripts/<name>`);
}
