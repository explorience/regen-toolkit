import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, isValid } from '../src/index.mjs';
import { isAwaitingReview } from '../src/util.mjs';

// K1 / R1: the canonical state model is orthogonal axes (not one ladder). Started as
// THREE (maturity/public_use/lifecycle_state); T4 adds Matty's 3 missing status
// dimensions (currentness/confidence/maintenance) as further orthogonal axes.
test('review-maturity defines the canonical orthogonal axes', () => {
  const s = loadSchema('review-maturity');
  assert.deepEqual(Object.keys(s.axes).sort(),
    ['confidence', 'currentness', 'lifecycle_state', 'maintenance', 'maturity', 'public_use']);
});

// T4 — Matty's 3 missing status dimensions (framework<->Database_Spec crosswalk).
test('currentness/confidence/maintenance axes accept their canonical values', () => {
  assert.equal(isValid('currentness', 'stale'), true);
  assert.equal(isValid('confidence', 'low'), true);
  assert.equal(isValid('maintenance', 'orphaned'), true);
});
test('currentness/confidence/maintenance axes reject bogus values', () => {
  assert.equal(isValid('currentness', 'nonsense'), false);
  assert.equal(isValid('confidence', 'nonsense'), false);
  assert.equal(isValid('maintenance', 'nonsense'), false);
});

test('maturity axis accepts canonical values, rejects the old ontology vocab', () => {
  assert.equal(isValid('maturity', 'reviewed'), true);
  assert.equal(isValid('maturity', 'field-informed'), true);
  // 'canonical' was the old data/ontology value — deliberately NOT in the canonical set (R1)
  assert.equal(isValid('maturity', 'canonical'), false);
  assert.equal(isValid('maturity', 'nonsense'), false);
});

test('public_use and lifecycle_state are independent axes (R2)', () => {
  assert.equal(isValid('public_use', 'requires-community-consent'), true);
  assert.equal(isValid('lifecycle_state', 'compost'), true);
  // a public_use value is not a maturity value — axes are orthogonal
  assert.equal(isValid('maturity', 'requires-community-consent'), false);
});

test('deployment readiness L0–L6 crosswalks to maturity', () => {
  const s = loadSchema('review-maturity');
  assert.equal(s.crosswalks.deployment_readiness['L5-reviewed-deployment'], 'reviewed');
  assert.equal(s.crosswalks.deployment_readiness['L0-idea'], 'raw');
});

test('maturity axis includes held', () => {
  assert.equal(isValid('maturity', 'held'), true);
});
test('held objects are awaiting review', () => {
  assert.equal(isAwaitingReview({ maturity: 'held' }), true);
});
