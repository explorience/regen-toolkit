import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderDashboardSection, renderSiteData } from '../src/render.mjs';

test('dashboard section renders totals, types, and review depth', () => {
  const s = renderDashboardSection({ total: 3, by_type: { resource: 2, signal: 1 }, review_queue: 1 });
  assert.match(s, /Knowledge Commons/);
  assert.match(s, /3 objects/);
  assert.match(s, /resource/);
  assert.match(s, /1 awaiting review/);
});

test('dashboard section counts review_queue when it is an array (deriveIndex shape)', () => {
  const s = renderDashboardSection({ total: 5, by_type: { resource: 5 }, review_queue: ['a', 'b'] });
  assert.match(s, /2 awaiting review/);
});

test('dashboard section tolerates an empty index', () => {
  const s = renderDashboardSection({});
  assert.match(s, /0 objects/);
});

test('site data copies the derived index.json to the site path', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-render-'));
  mkdirSync(join(dir, 'data/kb'), { recursive: true });
  writeFileSync(join(dir, 'data/kb/index.json'), JSON.stringify({ total: 2, by_type: { resource: 2 } }));
  const out = renderSiteData({ dir, target: '.', outPath: 'src/data/kms-index.json' });
  assert.equal(out.ok, true);
  const written = JSON.parse(readFileSync(join(dir, 'src/data/kms-index.json'), 'utf8'));
  assert.equal(written.total, 2);
});

test('site data returns ok:false (fail-soft) when no index.json exists yet', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-render-empty-'));
  const out = renderSiteData({ dir, target: '.', outPath: 'src/data/kms-index.json' });
  assert.equal(out.ok, false);
});
