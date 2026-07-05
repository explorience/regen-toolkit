import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { bridge } from '../src/registry-bridge.mjs';
import * as fw from '../src/framework.mjs';

// Seed a temp instance's framework KB (<dir>/data/kb/) via the repo-data adapter, then bridge.
function seed() {
  const dir = mkdtempSync(join(tmpdir(), 'kms-bridge-'));
  const a = fw.getAdapter('repo-data');
  a.store(dir, [
    { schema: 'resource', object: { id: 'r1', title: 'Res One', maturity: 'raw', ai_assisted: true } },
    { schema: 'source-system', object: { id: 's1', title: 'Src One', type: 'wiki', steward: 'S', return_path: 'PRs' } },
  ]);
  return dir;
}

test('bridges framework KB objects into data/<registry>.yaml, upsert by id', () => {
  const dir = seed();
  const ctx = { dir, config: { adapter: 'repo-data', target: dir } };
  const out = bridge(ctx);
  assert.equal(out.ok, true);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const key = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.ok(resDoc[key].some(e => e.id === 'r1'));
});

test('idempotent: bridging twice does not duplicate', () => {
  const dir = seed();
  const ctx = { dir, config: { adapter: 'repo-data', target: dir } };
  bridge(ctx); bridge(ctx);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const key = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.equal(resDoc[key].filter(e => e.id === 'r1').length, 1);
});

test('non-destructive: pre-existing registry entries survive', () => {
  const dir = seed();
  mkdirSync(join(dir, 'data'), { recursive: true });
  writeFileSync(join(dir, 'data/resources.yaml'),
    yaml.dump({ resources: [{ id: 'keep', title: 'Keep Me' }] }));
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  assert.ok(resDoc.resources.some(e => e.id === 'keep'));
  assert.ok(resDoc.resources.some(e => e.id === 'r1'));
});

test('encyclopedia-entry writes a markdown doc, not a registry row', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-bridge-md-'));
  fw.getAdapter('repo-data').store(dir, [
    { schema: 'encyclopedia-entry', object: { id: 'topic-x', title: 'Topic X', body: 'Hello.' } },
  ]);
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const p = join(dir, 'src/content/docs/kb/topic-x.md');
  assert.ok(existsSync(p));
  assert.match(readFileSync(p, 'utf8'), /^---\n[\s\S]*title: Topic X[\s\S]*---\n\nHello\./);
});

test('real registry shape: scalar header + underscore key are preserved, new row added under existing key', () => {
  const dir = seed();
  mkdirSync(join(dir, 'data'), { recursive: true });
  writeFileSync(join(dir, 'data/source-systems.yaml'),
    yaml.dump({ schema_version: '2.0', source_systems: [{ id: 'keep', title: 'Keep' }] }));
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const doc = yaml.load(readFileSync(join(dir, 'data/source-systems.yaml'), 'utf8'));
  assert.equal(doc.schema_version, '2.0');                 // scalar header preserved
  assert.ok(doc.source_systems.some(e => e.id === 'keep')); // existing row preserved
  assert.ok(doc.source_systems.some(e => e.id === 's1'));   // new row added under the existing underscore key
  assert.equal(doc.source_systems.filter(e => e.id === 's1').length, 1);
});

test('creates a brand-new registry file with the underscore-form key (source_systems)', () => {
  const dir = seed(); // stores a source-system into data/kb/, but no data/source-systems.yaml exists
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const doc = yaml.load(readFileSync(join(dir, 'data/source-systems.yaml'), 'utf8'));
  assert.ok(Array.isArray(doc.source_systems), 'new file keys the list as source_systems (underscore), not the hyphenated filename');
  assert.ok(doc.source_systems.some(e => e.id === 's1'));
});

test('bridge does not line-fold long scalars (diff-clean YAML, lineWidth:-1)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-bridge-width-'));
  // A long scalar WITH internal spaces: at the default width (80) js-yaml folds it across
  // multiple lines (breaking the contiguous run); at lineWidth:-1 it stays on one line.
  // (A no-space run like 'x'.repeat(200) can't be folded, so it wouldn't exercise the guard.)
  const longVal = Array(40).fill('word').join(' ');
  fw.getAdapter('repo-data').store(dir, [
    { schema: 'resource', object: { id: 'long-1', title: 'Long', summary: longVal } },
  ]);
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const raw = readFileSync(join(dir, 'data/resources.yaml'), 'utf8');
  assert.ok(raw.includes(longVal), 'the long scalar stays on one line (not folded)');
});
