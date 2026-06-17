import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, isValid } from '../src/index.mjs';

// K1 / R1: the canonical state model is THREE orthogonal axes (not one ladder).
test('review-maturity defines the three orthogonal axes', () => {
  const s = loadSchema('review-maturity');
  assert.deepEqual(Object.keys(s.axes).sort(), ['lifecycle_state', 'maturity', 'public_use']);
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
