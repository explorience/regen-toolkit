#!/usr/bin/env node

/**
 * validate-structure.mjs — Validate an org-os instance against the canonical spec
 *
 * Usage: node scripts/validate-structure.mjs [path]
 *   path: Root directory of the org-os instance (defaults to current directory)
 *
 * Checks:
 * 1. Required root files exist
 * 2. Required directories exist
 * 3. data/ contains minimum required YAML files
 * 4. .well-known/ schemas are present
 * 5. skills/ contains at least one SKILL.md
 * 6. federation.yaml has required sections
 * 7. package.json has required scripts
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { load as loadYaml } from 'js-yaml';

const rootDir = resolve(process.argv[2] || '.');

let passed = 0;
let failed = 0;
let warnings = 0;

function check(description, condition) {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.log(`  ✗ ${description}`);
    failed++;
  }
}

function warn(description) {
  console.log(`  ⚠ ${description}`);
  warnings++;
}

function fileExists(relativePath) {
  return existsSync(join(rootDir, relativePath));
}

function dirExists(relativePath) {
  return existsSync(join(rootDir, relativePath));
}

// --- 1. Required Root Files ---
console.log('\n1. Required Root Files');

const requiredRootFiles = [
  'MASTERPLAN.md',
  'AGENTS.md',
  'SOUL.md',
  'IDENTITY.md',
  'USER.md',
  'MEMORY.md',
  'HEARTBEAT.md',
  'TOOLS.md',
  'CLAUDE.md',
  'README.md',
  'federation.yaml',
  'package.json',
];

for (const file of requiredRootFiles) {
  check(`${file} exists`, fileExists(file));
}

// Check for legacy MASTERPROMPT.md
if (fileExists('MASTERPROMPT.md') && fileExists('MASTERPLAN.md')) {
  warn('Both MASTERPROMPT.md and MASTERPLAN.md exist — remove MASTERPROMPT.md');
} else if (fileExists('MASTERPROMPT.md') && !fileExists('MASTERPLAN.md')) {
  warn('MASTERPROMPT.md found — rename to MASTERPLAN.md');
}

// --- 2. Required Directories ---
console.log('\n2. Required Directories');

const requiredDirs = [
  'data',
  '.well-known',
  'memory',
  'skills',
  'packages',
  'scripts',
];

for (const dir of requiredDirs) {
  check(`${dir}/ exists`, dirExists(dir));
}

// Optional directories
const optionalDirs = ['knowledge', 'ideas', 'docs', 'repos', '.claude'];
for (const dir of optionalDirs) {
  if (!dirExists(dir)) {
    warn(`${dir}/ not present (optional)`);
  }
}

// --- 3. Required Data Files ---
console.log('\n3. Required Data Files');

const requiredDataFiles = [
  'members.yaml',
  'projects.yaml',
  'finances.yaml',
  'governance.yaml',
  'meetings.yaml',
  'ideas.yaml',
];

const optionalDataFiles = [
  'funding-opportunities.yaml',
  'relationships.yaml',
  'sources.yaml',
  'knowledge-manifest.yaml',
  'events.yaml',
  'channels.yaml',
  'assets.yaml',
];

for (const file of requiredDataFiles) {
  check(`data/${file} exists`, fileExists(`data/${file}`));
}

for (const file of optionalDataFiles) {
  if (!fileExists(`data/${file}`)) {
    warn(`data/${file} not present (optional)`);
  }
}

// --- 4. .well-known/ Schemas ---
console.log('\n4. .well-known/ Schemas');

const expectedSchemas = [
  'dao.json',
  'members.json',
  'projects.json',
];

for (const file of expectedSchemas) {
  check(`.well-known/${file} exists`, fileExists(`.well-known/${file}`));
}

// Check schemas are valid JSON
if (dirExists('.well-known')) {
  const wellKnownFiles = readdirSync(join(rootDir, '.well-known'))
    .filter(f => f.endsWith('.json'));

  for (const file of wellKnownFiles) {
    try {
      JSON.parse(readFileSync(join(rootDir, '.well-known', file), 'utf-8'));
      check(`.well-known/${file} is valid JSON`, true);
    } catch {
      check(`.well-known/${file} is valid JSON`, false);
    }
  }
}

// --- 5. Skills ---
console.log('\n5. Skills');

if (dirExists('skills')) {
  const skillDirs = readdirSync(join(rootDir, 'skills'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  check('At least one skill directory exists', skillDirs.length > 0);

  let skillsWithSkillMd = 0;
  for (const skillDir of skillDirs) {
    if (fileExists(`skills/${skillDir}/SKILL.md`)) {
      skillsWithSkillMd++;
    } else {
      warn(`skills/${skillDir}/ missing SKILL.md`);
    }
  }

  check('All skill directories have SKILL.md', skillsWithSkillMd === skillDirs.length);
  console.log(`  Found ${skillDirs.length} skills: ${skillDirs.join(', ')}`);
} else {
  check('skills/ directory exists', false);
}

// --- 6. federation.yaml Structure ---
console.log('\n6. federation.yaml Structure');

if (fileExists('federation.yaml')) {
  try {
    const fedContent = readFileSync(join(rootDir, 'federation.yaml'), 'utf-8');
    const fed = loadYaml(fedContent);

    check('federation.yaml has identity section', !!fed?.identity);
    check('federation.yaml has identity.name', !!fed?.identity?.name);
    check('federation.yaml has identity.type', !!fed?.identity?.type);
    check('federation.yaml has federation section', !!fed?.federation);
    check('federation.yaml has agent section', !!fed?.agent);

    if (!fed?.['knowledge-commons']) {
      warn('federation.yaml missing knowledge-commons section (optional)');
    }
  } catch (e) {
    check('federation.yaml is valid YAML', false);
  }
} else {
  check('federation.yaml exists', false);
}

// --- 7. package.json Scripts ---
console.log('\n7. package.json Scripts');

if (fileExists('package.json')) {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
    const scripts = pkg.scripts || {};

    check('Has generate:schemas script', !!scripts['generate:schemas']);
    check('Has validate:schemas script', !!scripts['validate:schemas']);

    // Optional but recommended scripts
    const recommendedScripts = ['clone:repos', 'setup', 'sync:upstream'];
    for (const script of recommendedScripts) {
      if (!scripts[script]) {
        warn(`Missing recommended script: ${script}`);
      }
    }
  } catch {
    check('package.json is valid JSON', false);
  }
}

// --- Summary ---
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed, ${warnings} warnings`);

if (failed === 0) {
  console.log('\n✓ Instance passes structural validation');
} else {
  console.log(`\n✗ Instance has ${failed} structural issue(s) to fix`);
  process.exit(1);
}
