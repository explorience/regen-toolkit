import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAdapter } from '../src/storage.mjs';
import { reviewQueue, promote } from '../src/review.mjs';

function seed() {
  const kb = mkdtempSync(join(tmpdir(), 'tf-rev-'));
  const a = getAdapter('kb-folder');
  a.store(kb, [{ schema: 'source-system',
    object: { title: 'Raw Wiki', type: 'wiki', steward: 'S', return_path: 'r', maturity: 'raw', ai_assisted: true } }]);
  return { kb, a };
}

test('reviewQueue lists raw / ai_assisted objects', () => {
  const { kb } = seed();
  const q = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.equal(q.length, 1);
  assert.equal(q[0].object.title, 'Raw Wiki');
});

test('promote to reviewed requires a reviewer, clears ai_assisted, stamps review fields', () => {
  const { kb } = seed();
  const [{ ref }] = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'reviewed' }),
    /--reviewer is required/);
  const { object } = promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'reviewed',
    reviewer: 'luiz', date: '2026-07-05' });
  assert.equal(object.maturity, 'reviewed');
  assert.equal(object.ai_assisted, false, 'human review clears the flag (invariant); provenance.authorship keeps the history');
  assert.equal(object.last_reviewed, '2026-07-05');
  assert.equal(object.reviewed_by, 'luiz');
  assert.equal(reviewQueue({ adapter: 'kb-folder', target: kb }).length, 0);
});

test('promote validates the maturity value against K1', () => {
  const { kb } = seed();
  const [{ ref }] = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'canonical', reviewer: 'x' }),
    /not a valid maturity/);
});

test('promote checks invariants BEFORE writing — failed demotion leaves disk untouched', () => {
  const kb = mkdtempSync(join(tmpdir(), 'tf-rev-torn-'));
  const a = getAdapter('kb-folder');
  a.store(kb, [{ schema: 'source-system',
    object: { title: 'Guided Wiki', type: 'wiki', steward: 'S', return_path: 'r',
      maturity: 'reviewed', public_use: 'reviewed-for-guidance', ai_assisted: false } }]);
  const [{ ref }] = getAdapter('kb-folder').list(kb).map((e) => e);
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'raw' }),
    /would violate invariants — nothing written/);
  const [{ object }] = a.list(kb);
  assert.equal(object.maturity, 'reviewed', 'disk untouched after refused demotion');
});

test('promote rejects refs that are not in this KB (no arbitrary-file writes)', () => {
  const { kb } = seed();
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref: '/tmp/anything.yaml', maturity: 'raw' }),
    /ref not found in this KB/);
});
