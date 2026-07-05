import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promote } from '../src/promote.mjs';

function pair() {
  const from = mkdtempSync(join(tmpdir(), 'kms-from-'));
  const to = mkdtempSync(join(tmpdir(), 'kms-to-'));
  mkdirSync(join(from, 'src'), { recursive: true });
  writeFileSync(join(from, 'src/a.mjs'), 'export const a = 1;');
  writeFileSync(join(from, 'src/b.mjs'), 'export const b = 2;');
  return { from, to };
}

test('computes a drift manifest and defaults to draft (no write)', () => {
  const { from, to } = pair();
  const r = promote({ from, to });
  assert.equal(r.applied, false);
  const a = r.manifest.find(m => m.rel === 'src/a.mjs');
  assert.equal(a.status, 'new'); // absent in `to`
});

test('flags changed vs same files', () => {
  const { from, to } = pair();
  mkdirSync(join(to, 'src'), { recursive: true });
  writeFileSync(join(to, 'src/a.mjs'), 'export const a = 1;'); // identical
  writeFileSync(join(to, 'src/b.mjs'), 'export const b = 999;'); // changed
  const r = promote({ from, to });
  assert.equal(r.manifest.find(m => m.rel === 'src/a.mjs').status, 'same');
  assert.equal(r.manifest.find(m => m.rel === 'src/b.mjs').status, 'changed');
  assert.equal(r.drift.length, 1);
});

test('safety: apply:true is inert — still applied:false, writes nothing', () => {
  const { from, to } = pair();
  const before = readdirSync(to); // `to` is empty
  const r = promote({ from, to, apply: true });
  assert.equal(r.applied, false); // never writes cross-repo, even when apply requested
  assert.equal(r.requested_apply, true);
  assert.deepEqual(readdirSync(to), before); // `to` untouched
});
