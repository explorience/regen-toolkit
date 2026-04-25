#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'repos.manifest.json');
const gitmodulesPath = path.join(rootDir, '.gitmodules');
const dryRun = process.argv.includes('--dry-run');

if (!fs.existsSync(manifestPath)) {
  console.error('Manifest not found: repos.manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const baseDirectory = manifest.baseDirectory || 'repos';
const repositories = manifest.repositories || [];
const reposDir = path.join(rootDir, baseDirectory);
const submodulePaths = new Set();

if (fs.existsSync(gitmodulesPath)) {
  const gitmodules = fs.readFileSync(gitmodulesPath, 'utf-8');
  const pathMatches = gitmodules.matchAll(/^\s*path\s*=\s*(.+)\s*$/gm);
  for (const match of pathMatches) {
    submodulePaths.add(match[1].trim());
  }
}

fs.mkdirSync(reposDir, { recursive: true });

function run(command, cwd) {
  if (dryRun) {
    console.log(`[dry-run] (${cwd}) ${command}`);
    return;
  }
  execSync(command, { cwd, stdio: 'inherit' });
}

function isDirEmpty(dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries.length === 0;
}

const errors = [];

for (const repo of repositories) {
  const name = repo.name;
  const url = repo.url;
  const branch = repo.branch || 'main';
  const targetPath = path.join(reposDir, name);
  const relativeTargetPath = path.relative(rootDir, targetPath);
  const gitDir = path.join(targetPath, '.git');

  if (!name || !url) {
    console.warn('Skipping invalid manifest entry:', repo);
    continue;
  }

  if (submodulePaths.has(relativeTargetPath)) {
    console.log(`Skipping ${name}: managed as git submodule (${relativeTargetPath})`);
    continue;
  }

  try {
    if (fs.existsSync(gitDir)) {
      console.log(`Updating ${name}...`);
      run('git fetch --all --prune', targetPath);
      run(`git checkout ${branch}`, targetPath);
      run(`git pull origin ${branch}`, targetPath);
      continue;
    }

    // Remove empty dirs left from failed clones so we can retry
    if (fs.existsSync(targetPath) && !fs.existsSync(gitDir) && isDirEmpty(targetPath)) {
      console.log(`Removing empty directory ${name}/ for re-clone...`);
      fs.rmSync(targetPath, { recursive: true });
    }

    if (fs.existsSync(targetPath) && !fs.existsSync(gitDir)) {
      console.warn(`Skipping ${name}: target exists but is not a git repo (${targetPath})`);
      continue;
    }

    console.log(`Cloning ${name}...`);
    run(`git clone --branch ${branch} "${url}" "${targetPath}"`, rootDir);
  } catch (err) {
    console.error(`Failed to clone/update ${name}: ${err.message}`);
    errors.push(name);
  }
}

if (errors.length > 0) {
  console.error(`\nFailed repos: ${errors.join(', ')}`);
}

console.log(
  `\n${dryRun ? 'Dry run complete. ' : ''}Linked repositories are available in: ${reposDir}`,
);
