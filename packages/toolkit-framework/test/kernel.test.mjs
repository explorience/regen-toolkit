import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, validateKernel, isForkCompatible, toJsonLdContext } from '../src/index.mjs';

test('core-entities is the frozen Layer-A interoperable core', () => {
  const c = loadSchema('core-entities');
  assert.equal(c.layer, 'A');
  for (const t of ['concept', 'source-system', 'claim', 'evidence', 'pattern', 'person', 'place']) {
    assert.ok(t in c.entities, `core missing ${t}`);
  }
});

// THE fork-compatibility contract: every extension must downgrade to a core type.
test('every extension type maps to a real core type (interop contract)', () => {
  const { valid, errors } = validateKernel();
  assert.equal(valid, true, errors.join('; '));
});

test('fork-compatibility: a local extension needs a valid maps_to_core', () => {
  assert.equal(isForkCompatible({ maps_to_core: 'artifact' }), true);
  assert.equal(isForkCompatible({ maps_to_core: 'made-up-core' }), false);
  assert.equal(isForkCompatible({}), false);
});

test('relationships: core interop group present + CSIS/governance is a SEPARABLE optional module (R7)', () => {
  const r = loadSchema('relationships');
  assert.ok(r.groups.core_interop, 'core_interop group');
  assert.ok(r.groups.core_interop.predicates.maps_to, 'maps_to predicate');
  assert.equal(r.groups.governance_csis.optional, true, 'csis/governance must be optional/separable');
});

test('kernel-profile exposes the 5 MOK objects as a curated subset (R3)', () => {
  const { valid } = validateKernel(); // already asserts profile refs resolve
  assert.equal(valid, true);
  const kp = loadSchema('kernel-profile');
  assert.deepEqual(Object.keys(kp.objects).sort(), ['concept', 'deployment', 'option', 'resource', 'signal']);
});

test('JSON-LD @context generates from the kernel (graph-compatible)', () => {
  const ld = toJsonLdContext();
  assert.ok(ld['@context'].concept, 'core type in context');
  assert.ok(ld['@context']['source-system'], 'core type in context');
  assert.ok(ld['@context'].resource, 'extension type in context');
  assert.equal(ld['@context'].maps_to['@type'], '@id', 'predicate typed as @id');
});
