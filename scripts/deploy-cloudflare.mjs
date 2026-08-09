#!/usr/bin/env node

/**
 * Deploy the toolkit site to Cloudflare Workers (static assets).
 *
 * Option B (2026-08-06 engineering sync): two Workers projects —
 *   dev  → `regen-toolkit-dev`  built from this branch (regen-toolkit-os)
 *   prod → `regen-toolkit`      built from origin/main in a disposable worktree,
 *                               so nothing is ever committed to main and the
 *                               working tree is never touched (vault-safe).
 *
 * Usage:
 *   npm run deploy:cf          # dev (this branch)
 *   npm run deploy:cf:prod     # prod (origin/main via worktree)
 *
 * Interim tool: once Workers Builds is git-connected in the Cloudflare
 * dashboard (build-on-push + PR previews), this script becomes redundant
 * for day-to-day use. Requires `npx wrangler login` once per machine.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] === 'prod' ? 'prod' : 'dev';
const run = (cmd, cwd = rootDir) =>
  execSync(cmd, { cwd, stdio: 'inherit' });

// Cloudflare static-asset limits — fail fast, before uploading.
function checkLimits(distDir) {
  let count = 0;
  const tooBig = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else {
        count++;
        if (fs.statSync(p).size > 25 * 1024 * 1024) tooBig.push(p);
      }
    }
  };
  walk(distDir);
  if (count > 20000)
    throw new Error(`dist has ${count} files — over Cloudflare's 20,000-file limit`);
  if (tooBig.length)
    throw new Error(`files over 25 MiB: ${tooBig.join(', ')}`);
  console.log(`✓ ${count} files, within Cloudflare limits`);
}

if (target === 'dev') {
  console.log('→ Deploying DEV (regen-toolkit-dev) from this branch…');
  run('npm run build');
  checkLimits(path.join(rootDir, 'dist'));
  run('npx wrangler deploy'); // reads wrangler.jsonc
} else {
  console.log('→ Deploying PROD (regen-toolkit) from origin/main via worktree…');
  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), 'regen-toolkit-main-'));
  try {
    run('git fetch origin main --quiet');
    run(`git worktree add --force "${worktree}" origin/main`);
    run('npm install --no-audit --no-fund', worktree);
    run('npm run build', worktree);
    checkLimits(path.join(worktree, 'dist'));
    run(
      'npx wrangler deploy --name regen-toolkit --compatibility-date 2026-08-01 --assets ./dist',
      worktree,
    );
  } finally {
    try {
      run(`git worktree remove --force "${worktree}"`);
    } catch {
      console.warn(`⚠ could not remove worktree at ${worktree} — remove manually`);
    }
  }
}

console.log(`✓ ${target} deploy complete`);
