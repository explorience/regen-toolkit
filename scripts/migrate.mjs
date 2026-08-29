#!/usr/bin/env node

/**
 * migrate.mjs — Run every applicable framework migration script.
 *
 * Detects current framework_version in the instance (from federation.yaml)
 * and runs every migration from that version up to package.json.version.
 *
 * Usage:
 *   node scripts/migrate.mjs           # run all applicable migrations
 *   node scripts/migrate.mjs --dry     # show which would run, don't execute
 *
 * Migrations are idempotent. Safe to re-run.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import { load as loadYaml } from 'js-yaml';

const root = resolve(process.argv[1], '../..');
const dryRun = process.argv.includes('--dry');

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}
function readYamlSafe(p) {
  if (!existsSync(p)) return null;
  try { return loadYaml(readFileSync(p, 'utf-8')); } catch { return null; }
}

const pkg = readJson(join(root, 'package.json'));
const fed = readYamlSafe(join(root, 'federation.yaml'));

const currentFramework = pkg.version;
const instanceFramework = fed?.metadata?.framework_version || '0.0';

console.log(`Framework version (code):       ${currentFramework}`);
console.log(`Instance framework_version:     ${instanceFramework}`);

// List migrations. Each file encodes its applicable range in its filename:
// <fromMajorMinor>-to-<toMajorMinor>-<slug>.mjs
const migrationsDir = join(root, 'scripts', 'migrations');
if (!existsSync(migrationsDir)) {
  console.log('No scripts/migrations/ directory — nothing to run.');
  process.exit(0);
}

function majorMinor(v) {
  const m = v.match(/^(\d+)\.(\d+)/);
  return m ? `${m[1]}.${m[2]}` : v;
}

const instanceMM = majorMinor(instanceFramework);
const currentMM = majorMinor(currentFramework);

function cmp(a, b) {
  const [aM, am] = a.split('.').map((n) => parseInt(n, 10));
  const [bM, bm] = b.split('.').map((n) => parseInt(n, 10));
  if (aM !== bM) return aM - bM;
  return am - bm;
}

const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.mjs'));
const applicable = [];

for (const f of files) {
  const match = f.match(/^v?(\d+)-to-v?(\d+)-/);
  if (!match) continue;
  const from = `${match[1]}.0`;
  const to = `${match[2]}.0`;
  if (cmp(from, instanceMM) >= 0 && cmp(to, currentMM) <= 0) {
    applicable.push({ file: f, from, to });
  }
}

applicable.sort((a, b) => cmp(a.from, b.from) || cmp(a.to, b.to));

if (applicable.length === 0) {
  console.log('\n✓ No migrations to run — instance is at current framework version.');
  process.exit(0);
}

console.log(`\nMigrations to run (${applicable.length}):`);
for (const m of applicable) {
  console.log(`  ${m.file}  (${m.from} → ${m.to})`);
}

if (dryRun) {
  console.log('\n(--dry) Not executing.');
  process.exit(0);
}

console.log('');
let failed = 0;
for (const m of applicable) {
  console.log(`─── ${m.file} ───`);
  const result = spawnSync('node', [join(migrationsDir, m.file)], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`✗ Migration ${m.file} exited with code ${result.status}`);
    failed++;
  }
  console.log('');
}

if (failed > 0) {
  console.error(`${failed} migration(s) failed. Resolve manually and re-run.`);
  process.exit(1);
}

console.log(`✓ All ${applicable.length} migration(s) ran successfully.`);
