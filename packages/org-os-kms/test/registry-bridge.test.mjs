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
  const p = join(dir, 'src/content/docs/topic-x.md');
  assert.ok(existsSync(p));
  assert.match(readFileSync(p, 'utf8'), /^---\n[\s\S]*title: Topic X[\s\S]*---\n\nHello\./);
});
