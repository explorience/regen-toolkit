// test/accept.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare, acceptWorkOrder } from '../src/ingest.mjs';
import { loadWorkOrder, transition, saveWorkOrder } from '../src/workorder.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(here, 'fixtures', 'transcript.md');
const CANDIDATES = join(here, 'fixtures', 'candidates');

function setup(candidateFiles) {
  const dir = mkdtempSync(join(tmpdir(), 'tf-acc-'));
  const woDir = join(dir, '.workorders');
  const [wo] = prepare({ path: FIXTURE, workOrdersDir: woDir }).created;
  saveWorkOrder(woDir, transition(transition(wo, 'claimed'), 'fulfilled'));
  const cdir = join(woDir, wo.id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  for (const f of candidateFiles) copyFileSync(join(CANDIDATES, f), join(cdir, f));
  return { woDir, id: wo.id };
}

test('accept validates candidates, stamps provenance, moves them to accepted/', () => {
  const { woDir, id } = setup(['good-source-system.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, true, JSON.stringify(res.errors));
  assert.equal(loadWorkOrder(woDir, id).status, 'accepted');
  assert.ok(existsSync(join(woDir, id, 'accepted', 'good-source-system.yaml')));
  // the CLI stamps lineage — provenance is structural, not trusted from the agent
  assert.equal(res.objects[0].object.work_order, id);
  assert.ok(res.objects[0].object.source_lineage.includes('transcript.md'));
});

test('accept is atomic: one bad candidate rejects nothing into the KB and keeps the order open with error notes', () => {
  const { woDir, id } = setup(['good-source-system.yaml', 'bad-maturity.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, false);
  assert.ok(res.errors.some((e) => e.includes('bad-maturity.yaml')));
  const wo = loadWorkOrder(woDir, id);
  assert.equal(wo.status, 'fulfilled', 'order stays fulfilled for retry');
  assert.ok(wo.error_notes.length > 10, 'validator output saved as retry instructions');
  assert.ok(!existsSync(join(woDir, id, 'accepted')), 'nothing partially accepted');
});

test('accept enforces the born-rules: ai_assisted true + maturity raw + provenance.origin', () => {
  const { woDir, id } = setup(['bad-maturity.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, false);
  const all = res.errors.join(' | ');
  assert.match(all, /maturity must be "raw" at accept/);
  assert.match(all, /provenance\.origin/);
});
