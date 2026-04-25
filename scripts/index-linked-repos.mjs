#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const reposManifestPath = path.join(rootDir, 'repos.manifest.json');
const indexManifestPath = path.join(rootDir, 'repos.index.manifest.json');
const changedMode = process.argv.includes('--changed');

if (!fs.existsSync(reposManifestPath)) {
  console.error('Missing repos.manifest.json');
  process.exit(1);
}

if (!fs.existsSync(indexManifestPath)) {
  console.error('Missing repos.index.manifest.json');
  process.exit(1);
}

const reposManifest = JSON.parse(fs.readFileSync(reposManifestPath, 'utf-8'));
const indexManifest = JSON.parse(fs.readFileSync(indexManifestPath, 'utf-8'));

const baseDirectory = reposManifest.baseDirectory || 'repos';
const reposBasePath = path.join(rootDir, baseDirectory);
const globalInclude = indexManifest.globalRules?.include || [];
const globalExclude = indexManifest.globalRules?.exclude || [];
const indexedRepos = indexManifest.repositories || [];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function globToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^/]*')
    .replace(/__DOUBLE_STAR__/g, '.*');
  return new RegExp(`^${escaped}$`);
}

const includeRegexes = globalInclude.map(globToRegex);
const excludeRegexes = globalExclude.map(globToRegex);

function matchesAny(regexes, relPath) {
  return regexes.some(regex => regex.test(relPath));
}

function walkFiles(basePath, currentPath = '') {
  const fullPath = path.join(basePath, currentPath);
  if (!fs.existsSync(fullPath)) return [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = currentPath ? `${currentPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walkFiles(basePath, rel));
    } else if (entry.isFile()) {
      files.push(toPosix(rel));
    }
  }
  return files;
}

function getChangedFiles(repoPath) {
  try {
    const statusOutput = execSync('git status --porcelain', {
      cwd: repoPath,
      encoding: 'utf-8'
    }).trim();
    if (!statusOutput) return [];

    const files = [];
    const lines = statusOutput.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.includes(' -> ')) {
        const parts = trimmed.split(' -> ');
        files.push(parts[parts.length - 1].trim());
      } else if (trimmed.length > 3) {
        files.push(trimmed.slice(3).trim());
      }
    }
    return files.map(toPosix);
  } catch {
    return [];
  }
}

function filterIndexedFiles(files) {
  return files.filter(file => {
    if (matchesAny(excludeRegexes, file)) return false;
    if (includeRegexes.length === 0) return true;
    return matchesAny(includeRegexes, file);
  });
}

function evaluatePriority(repoName, files, priorityPaths) {
  const present = [];
  const missing = [];

  for (const priorityPath of priorityPaths || []) {
    const normalized = toPosix(priorityPath.replace(/^\.\//, ''));
    const regex = globToRegex(normalized);
    const found = files.some(file => regex.test(file));
    if (found) {
      present.push(priorityPath);
    } else {
      missing.push(priorityPath);
    }
  }

  return { present, missing };
}

const result = {
  generatedAt: new Date().toISOString(),
  mode: changedMode ? 'changed' : 'full',
  baseDirectory,
  repositories: []
};

for (const repoDef of indexedRepos) {
  const repoName = repoDef.name;
  const repoPath = path.join(reposBasePath, repoName);
  const exists = fs.existsSync(repoPath);

  if (!exists) {
    result.repositories.push({
      name: repoName,
      ownership: repoDef.ownership || 'reference-only',
      exists: false,
      indexedFilesCount: 0,
      indexedFiles: [],
      priority: { present: [], missing: repoDef.priorityPaths || [] }
    });
    continue;
  }

  const rawFiles = changedMode ? getChangedFiles(repoPath) : walkFiles(repoPath);
  const indexedFiles = filterIndexedFiles(rawFiles);
  const priority = evaluatePriority(repoName, indexedFiles, repoDef.priorityPaths || []);

  result.repositories.push({
    name: repoName,
    ownership: repoDef.ownership || 'reference-only',
    exists: true,
    indexedFilesCount: indexedFiles.length,
    indexedFiles,
    priority
  });
}

const outputDir = path.join(rootDir, 'docs', 'indexes');
fs.mkdirSync(outputDir, { recursive: true });

const outputFile = changedMode
  ? path.join(outputDir, 'repos-index-changed.json')
  : path.join(outputDir, 'repos-index-full.json');

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`Wrote ${path.relative(rootDir, outputFile)}`);
