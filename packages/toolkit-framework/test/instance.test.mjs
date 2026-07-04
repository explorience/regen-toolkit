import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { initInstance, loadConfig } from '../src/instance.mjs';
import { validateObject } from '../src/index.mjs';
import { loadWorkOrders } from '../src/workorder.mjs';
import { getAdapter } from '../src/storage.mjs';

test('init --new stamps the substrate: kb/, .workorders/, kms.yaml, self source-system card', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-'));
  const res = initInstance({ dir, name: 'test-commons' });
  assert.ok(existsSync(join(dir, 'kb')));
  assert.ok(existsSync(join(dir, '.workorders')));
  const cfg = loadConfig(dir);
  assert.equal(cfg.instance, 'test-commons');
  assert.equal(cfg.adapter, 'kb-folder');
  assert.equal(cfg.target, 'kb');
  // born a federation citizen: its own card exists (stored via the adapter, so
  // it's real inventory — visible to kb index / review, not a loose file) and validates
  const entries = getAdapter('kb-folder').list(join(dir, 'kb'));
  assert.equal(entries.length, 1);
  const card = entries[0].object;
  assert.equal(entries[0].ref, cfg.self_ref, 'kms.yaml remembers where the self card lives');
  const { valid, errors } = validateObject('source-system', card);
  assert.equal(valid, true, errors.join('; '));
  assert.equal(card.maturity, 'raw', 'draft card until the operator completes it via register-source');
  assert.equal(res.workOrders, 0);
});

test('init --existing also queues the existing corpus as work orders', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-ex-'));
  const content = join(dir, 'content');
  const sub = join(content, 'docs');
  mkdirSync(sub, { recursive: true });   // build a tiny corpus
  writeFileSync(join(content, 'a.md'), '# A\nprose');
  writeFileSync(join(sub, 'b.md'), '# B\nprose');
  const res = initInstance({ dir, name: 'wrapped', mode: 'existing', existingPath: content });
  assert.equal(res.workOrders, 2);
  assert.equal(loadWorkOrders(join(dir, '.workorders')).length, 2);
});

test('init is idempotent — re-running never clobbers an existing kms.yaml or card', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-idem-'));
  initInstance({ dir, name: 'once' });
  const before = readFileSync(join(dir, 'kms.yaml'), 'utf8');
  initInstance({ dir, name: 'twice' });
  assert.equal(readFileSync(join(dir, 'kms.yaml'), 'utf8'), before, 'existing config untouched');
  // and the card inventory is still exactly one entry — re-init did not re-stamp
  assert.equal(getAdapter('kb-folder').list(join(dir, 'kb')).length, 1);
});
