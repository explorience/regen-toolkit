// test/pipeline.test.mjs — the vertical slice, end to end on fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare, acceptWorkOrder } from '../src/ingest.mjs';
import { transition, saveWorkOrder } from '../src/workorder.mjs';
import { getAdapter } from '../src/storage.mjs';

const here = dirname(fileURLToPath(import.meta.url));

test('vertical slice: transcript → work order → candidates → accept → store → index', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-pipe-'));
  const woDir = join(dir, '.workorders');
  const kb = join(dir, 'kb');

  // prepare (idempotent)
  const [wo] = prepare({ path: join(here, 'fixtures', 'transcript.md'), workOrdersDir: woDir }).created;
  assert.equal(prepare({ path: join(here, 'fixtures', 'transcript.md'), workOrdersDir: woDir }).created.length, 0);

  // agent's part, simulated by fixtures
  saveWorkOrder(woDir, transition(transition(wo, 'claimed'), 'fulfilled'));
  const cdir = join(woDir, wo.id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(here, 'fixtures', 'candidates', 'good-source-system.yaml'), join(cdir, 'c1.yaml'));

  // gate + store
  const res = acceptWorkOrder({ workOrdersDir: woDir, id: wo.id });
  assert.equal(res.accepted, true, res.errors.join('; '));
  const adapter = getAdapter('kb-folder');
  const { stored } = adapter.store(kb, res.objects);
  assert.equal(stored.length, 1);
  adapter.writeIndex(kb);

  // the index is the site's read surface (seam 3)
  const idx = adapter.index(kb);
  assert.equal(idx.total, 1);
  assert.equal(idx.review_queue, 1, 'raw + ai_assisted objects await review');
  // provenance chain is complete
  const [{ object }] = adapter.list(kb);
  assert.equal(object.work_order, wo.id);
  assert.ok(object.provenance.origin);
  assert.ok(object.source_lineage);
});
