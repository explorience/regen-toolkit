#!/usr/bin/env node

/**
 * v2-to-v3-workstream-frontmatter.mjs
 *
 * Migration: add `workstream` field to every plan in docs/agent-plans/ that
 * doesn't already have it. Idempotent — running twice changes nothing.
 *
 * Context: v3.0.0 introduced the projects-vs-plans separation. Plans now
 * belong to a long-lived workstream declared in data/projects.yaml.
 *
 * What it reads:  docs/agent-plans/*.md frontmatter
 * What it writes: adds `workstream: <inferred>` after `tags:` if missing
 *
 * Inference strategy: match plan id prefix to workstream id, then fall back
 * to the v2-stabilization workstream for anything unmatched (operator reviews
 * manually).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { load as loadYaml } from 'js-yaml';

const frameworkRoot = resolve(process.argv[1], '../../..');
const plansDir = join(frameworkRoot, 'docs', 'agent-plans');
const projectsPath = join(frameworkRoot, 'data', 'projects.yaml');

function loadProjects() {
  if (!existsSync(projectsPath)) return new Set();
  const data = loadYaml(readFileSync(projectsPath, 'utf-8'));
  return new Set((data?.projects || []).map((p) => p.id));
}

// Map plan IDs (or id prefixes) to workstreams. Extend as new plans land.
const mapping = {
  'v2-phase1-framework': 'v2-stabilization',
  'framework-dashboard-template': 'v2-stabilization',
  'versioning-system': 'v2-stabilization',
  'federation-protocol': 'federation-protocol',
  'future-instance-specs': 'framework-evolution',
  'non-tech-onboarding': 'non-tech-onboarding',
  'obsidian-interface': 'operator-interfaces',
  'obsidian-canvas-interface': 'operator-interfaces',
};

function inferWorkstream(planId) {
  if (mapping[planId]) return mapping[planId];
  // Heuristic fallback by id prefix
  if (planId.startsWith('v2-')) return 'v2-stabilization';
  if (planId.startsWith('federation-')) return 'federation-protocol';
  if (planId.startsWith('obsidian-')) return 'operator-interfaces';
  if (planId.startsWith('instance-')) return 'instance-orchestration';
  if (planId.startsWith('skill-')) return 'skill-promotion';
  if (planId.startsWith('opal-')) return 'opal-rollout';
  return 'v2-stabilization'; // operator should review
}

const validWorkstreams = loadProjects();
let updated = 0;
let skipped = 0;
let flagged = [];

for (const file of readdirSync(plansDir)) {
  if (!file.endsWith('.md') || file === 'QUEUE.md' || file === 'README.md') continue;

  const fullPath = join(plansDir, file);
  const content = readFileSync(fullPath, 'utf-8');

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) {
    flagged.push(`${file}: no frontmatter block, skipping`);
    continue;
  }

  const fmRaw = fmMatch[1];

  if (/^workstream:/m.test(fmRaw)) {
    skipped++;
    continue;
  }

  const idMatch = fmRaw.match(/^id:\s*(\S+)/m);
  if (!idMatch) {
    flagged.push(`${file}: no id in frontmatter, skipping`);
    continue;
  }
  const planId = idMatch[1];
  const ws = inferWorkstream(planId);

  if (validWorkstreams.size > 0 && !validWorkstreams.has(ws)) {
    flagged.push(`${file}: inferred workstream '${ws}' not found in data/projects.yaml`);
  }

  // Insert `workstream: <ws>` as the last field before the closing `---`
  const newFm = fmRaw.replace(/\n*$/, `\nworkstream: ${ws}\n`);
  const newContent = content.replace(fmMatch[0], `---\n${newFm}---\n`);
  writeFileSync(fullPath, newContent, 'utf-8');
  updated++;
  console.log(`  ✓ ${file}: added workstream: ${ws}`);
}

console.log('');
console.log(`Migration v2→v3 (workstream frontmatter):`);
console.log(`  ${updated} plan(s) updated, ${skipped} already migrated`);
if (flagged.length) {
  console.log(`  ${flagged.length} flagged for operator review:`);
  for (const f of flagged) console.log(`    - ${f}`);
}
