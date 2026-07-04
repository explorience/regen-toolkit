import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const here = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(here, '..', 'skills');
const SKILLS = ['capture-and-route', 'compose-journey', 'csis-review', 'ingest', 'map-ontology', 'register-source', 'review-promote'];

test('every agentic skill has a SKILL.md with well-formed, agnostic frontmatter', () => {
  for (const s of SKILLS) {
    const p = join(skillsDir, s, 'SKILL.md');
    assert.ok(existsSync(p), `${s}/SKILL.md should exist`);
    const md = readFileSync(p, 'utf8');
    const fm = yaml.load(md.split('---')[1]);
    assert.equal(fm.name, s, `${s} frontmatter name`);
    assert.ok(fm.description && fm.description.length > 20, `${s} has a description`);
    assert.equal(fm.agnostic, true, `${s} marked agnostic`);
    assert.equal(fm.framework, 'toolkit-framework');
  }
});

test('csis-review carries the frame-language-audit mode', () => {
  const md = readFileSync(join(skillsDir, 'csis-review', 'SKILL.md'), 'utf8');
  assert.match(md, /## Mode: frame-language-audit/);
  assert.match(md, /structure beats/i);
});
