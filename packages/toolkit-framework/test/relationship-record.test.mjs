// relationship-record — a first-class per-edge sourced-assertion (Database_Spec Core
// Decision #3 + DoD #6). Today relationships are bare ID arrays; this schema makes an
// individual edge a reviewable, evidenced, KB-content object in its own right.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateObject, loadSchema, validateKernel } from '../src/index.mjs';

test('relationship-record: a valid sourced-assertion edge validates', () => {
  // confidence's axis lands in the review-maturity status-dims commit (T4 step 3);
  // keep this fixture axis-free so the two commits stay independently orderable.
  const ok = validateObject('relationship-record', {
    title: 'gitcoin-passport implemented_by holonym', type: 'relationship-record',
    subject: 'gitcoin-passport', predicate: 'implemented_by', object: 'holonym',
    evidence: 'docs page cross-reference', scope: '2026 grant round',
    direction: 'directed', source_lineage: 'test/fixtures/x.md',
    maturity: 'raw', ai_assisted: true, provenance: { origin: 'x' },
  });
  assert.equal(ok.valid, true, ok.errors.join('; '));
});

test('relationship-record: missing object fails', () => {
  const bad = validateObject('relationship-record', {
    title: 'x', type: 'relationship-record',
    subject: 'gitcoin-passport', predicate: 'implemented_by',
    maturity: 'raw', ai_assisted: true, provenance: { origin: 'x' },
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.some((e) => e.includes('object')), bad.errors.join('; '));
});

test('relationship-record is registered as a Layer-B extension mapping to claim', () => {
  const ext = loadSchema('extension-entities');
  assert.ok('relationship-record' in ext.entities, 'relationship-record must be registered');
  assert.equal(ext.entities['relationship-record'].maps_to_core, 'claim');
});

test('kernel stays consistent after adding relationship-record', () => {
  const { valid, errors } = validateKernel();
  assert.equal(valid, true, errors.join('; '));
});
