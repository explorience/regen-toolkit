import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateObject } from '../src/index.mjs';
import {
  hashContent, makeWorkOrder, transition, saveWorkOrder, loadWorkOrders, loadWorkOrder,
} from '../src/workorder.mjs';

test('makeWorkOrder produces a valid, deterministic work-order (seam 1)', () => {
  const wo = makeWorkOrder({
    sourcePath: 'meetings/call.md', content: '# A call\nnotes…', sourceType: 'transcript',
    targetSchemas: ['source-system', 'resource'], instructions: 'deep intake',
  });
  assert.match(wo.id, /^wo-[0-9a-f]{12}$/);
  assert.equal(wo.status, 'open');
  assert.equal(wo.source_hash, hashContent('# A call\nnotes…'));
  // same input → same id (idempotency key)
  const again = makeWorkOrder({ sourcePath: 'meetings/call.md', content: '# A call\nnotes…', sourceType: 'transcript' });
  assert.equal(again.id, wo.id);
  // it validates against its own schema
  const { valid, errors } = validateObject('work-order', wo);
  assert.equal(valid, true, errors.join('; '));
});

test('work-order transitions follow the legal state machine', () => {
  let wo = makeWorkOrder({ sourcePath: 'a.md', content: 'x' });
  wo = transition(wo, 'claimed');
  wo = transition(wo, 'fulfilled');
  wo = transition(wo, 'accepted');
  assert.equal(wo.status, 'accepted');
  assert.throws(() => transition(wo, 'open'), /illegal work-order transition/);
  assert.throws(() => transition(makeWorkOrder({ sourcePath: 'a.md', content: 'x' }), 'accepted'),
    /illegal work-order transition: open → accepted/);
});

test('work-orders persist and load from a directory (resumable)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-wo-'));
  const wo = makeWorkOrder({ sourcePath: 'a.md', content: 'x' });
  saveWorkOrder(dir, wo);
  const all = loadWorkOrders(dir);
  assert.equal(all.length, 1);
  assert.equal(all[0].id, wo.id);
  assert.deepEqual(loadWorkOrder(dir, wo.id), wo);
});
