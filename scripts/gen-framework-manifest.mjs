// gen-framework-manifest.mjs
// Snapshot the live framework API to a JSON manifest the site can import safely.
//
// Why: the framework package (@regen-commons/toolkit-framework) reads its schema
// YAML off disk via `import.meta.url`-relative paths. When Astro/Vite bundles the
// page that imports it, that relative path breaks (the .mjs is rewritten into
// dist/.prerender/chunks/). So instead of importing the framework at render time,
// we run its API here in plain Node — where fs reads work — and write the result
// to src/data/framework-manifest.json, which the page imports as static JSON.
//
// Runs before `astro build` (see the npm "prebuild" script). Idempotent.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const frameworkDir = join(repoRoot, 'packages', 'toolkit-framework');
const outDir = join(repoRoot, 'src', 'data');
const outFile = join(outDir, 'framework-manifest.json');

function readVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(frameworkDir, 'package.json'), 'utf8'));
    return { name: pkg.name, version: pkg.version };
  } catch {
    return { name: '@regen-commons/toolkit-framework', version: 'unknown' };
  }
}

const { name, version } = readVersion();

let schemas = [];
let kernel = { valid: false, errors: ['framework API not loaded'] };

try {
  const fw = await import(join(frameworkDir, 'src', 'index.mjs'));
  schemas = fw.listSchemas();
  kernel = fw.validateKernel();
} catch (err) {
  // Fail loud: a broken manifest is better caught here than shipped silently.
  console.error('[gen-framework-manifest] failed to load framework API:', err.message);
  process.exitCode = 1;
}

const manifest = {
  name,
  version,
  generatedAt: new Date().toISOString(),
  schemaCount: schemas.length,
  schemas,
  kernelOk: kernel.valid,
  kernelErrors: kernel.errors,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(
  `[gen-framework-manifest] wrote ${schemas.length} schemas · kernel ${kernel.valid ? 'consistent ✓' : 'INVALID'} → src/data/framework-manifest.json`,
);
