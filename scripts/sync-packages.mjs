#!/usr/bin/env node
/**
 * sync-packages.mjs — materialize framework packages into an instance.
 *
 * Reads the instance's federation.yaml `packages:` map, copies enabled
 * packages from the framework's packages/ into the instance's packages/.
 * Disabled-but-locally-present packages are warned about (not deleted)
 * unless --prune is passed.
 *
 * Usage:
 *   npm run sync:packages                                # framework→cwd, derived from manifest
 *   node scripts/sync-packages.mjs --framework <fw> --target <tgt>
 *   node scripts/sync-packages.mjs --target . --prune    # also remove disabled
 *   node scripts/sync-packages.mjs --dry                 # don't write
 *
 * Defaults:
 *   --framework: this script's parent (where the script lives)
 *   --target:    current working directory
 *
 * Reads federation.yaml `packages:` map. If the target has no federation.yaml
 * (e.g., dry-run into a temp dir), expects --enabled "<id1>,<id2>" instead.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptFrameworkRoot = path.resolve(__dirname, "..");

function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

const frameworkDir = path.resolve(getArg("--framework") || scriptFrameworkRoot);
const targetDir = path.resolve(getArg("--target") || process.cwd());
const prune = process.argv.includes("--prune");
const dry = process.argv.includes("--dry");
const enabledArg = getArg("--enabled");

function loadEnabled() {
  if (enabledArg) {
    return Object.fromEntries(enabledArg.split(",").map((id) => [id.trim(), true]));
  }
  const fedPath = path.join(targetDir, "federation.yaml");
  if (!existsSync(fedPath)) {
    console.error(`✗ No federation.yaml at ${fedPath} and no --enabled passed.`);
    process.exit(1);
  }
  const fed = yaml.load(readFileSync(fedPath, "utf-8")) || {};
  return fed.packages || {};
}

function copyDir(src, dst) {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFileSync(s, d);
    }
  }
}

const enabled = loadEnabled();
const frameworkPackagesDir = path.join(frameworkDir, "packages");
const targetPackagesDir = path.join(targetDir, "packages");

if (!existsSync(frameworkPackagesDir)) {
  console.error(`✗ Framework packages dir missing: ${frameworkPackagesDir}`);
  process.exit(1);
}

let copied = 0, skipped = 0, warned = 0, pruned = 0;

// 1. Copy enabled packages from framework to target
for (const [pkgId, isEnabled] of Object.entries(enabled)) {
  if (!isEnabled) continue;
  const src = path.join(frameworkPackagesDir, pkgId);
  if (!existsSync(src)) {
    console.error(`✗ Package "${pkgId}" enabled but not in framework: ${src}`);
    process.exit(1);
  }
  const dst = path.join(targetPackagesDir, pkgId);
  if (dry) {
    console.log(`would copy ${pkgId}: ${path.relative(targetDir, src)} → ${path.relative(targetDir, dst)}`);
  } else {
    copyDir(src, dst);
    console.log(`✓ copied ${pkgId} (${src} → ${dst})`);
  }
  copied++;
}

// 2. Warn about disabled-but-present packages in target
if (existsSync(targetPackagesDir)) {
  for (const entry of readdirSync(targetPackagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgId = entry.name;
    if (enabled[pkgId] === true) continue;
    if (prune) {
      const dst = path.join(targetPackagesDir, pkgId);
      if (dry) {
        console.log(`would prune ${pkgId}: ${path.relative(targetDir, dst)}`);
      } else {
        rmSync(dst, { recursive: true, force: true });
        console.log(`- pruned ${pkgId} (was disabled or absent from federation.yaml)`);
      }
      pruned++;
    } else {
      console.log(`⚠ ${pkgId} is disabled (or not listed) but present locally — use --prune to remove`);
      warned++;
    }
  }
}

console.log(`\n${copied} copied, ${pruned} pruned, ${warned} disabled-but-present${dry ? " (dry run)" : ""}`);
