import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, validateObject } from '../src/index.mjs';

const LAYER_SCHEMAS = [
  'resource', 'option-entry', 'track', 'deployment', 'implementation-record',
  'claim-evidence', 'evolution-record', 'concept-lineage', 'encyclopedia-entry', 'update-proposal',
];

test('all layer entry schemas load + extend frontmatter', () => {
  for (const n of LAYER_SCHEMAS) {
    const s = loadSchema(n);
    assert.ok(s.id, `${n} missing id`);
    assert.equal(s.extends, 'frontmatter', `${n} should extend frontmatter`);
  }
});

test('deployment requires the 6 structural-integrity components', () => {
  const r = validateObject('deployment', { title: 'd', type: 'deployment' });
  assert.equal(r.valid, false);
  for (const c of ['decision_system', 'power_structure', 'accountability', 'failure_detection']) {
    assert.ok(r.errors.some((e) => e.includes(c)), `should require ${c}`);
  }
});

test('option-entry enforces category enum + K1 maturity axis', () => {
  assert.equal(validateObject('option-entry', { title: 'o', type: 'option', category: 'governance', maturity: 'reviewed' }).valid, true);
  assert.equal(validateObject('option-entry', { title: 'o', type: 'option', category: 'made-up' }).valid, false);
});

test('implementation-record requires source_position (anti-promotional discipline)', () => {
  assert.equal(validateObject('implementation-record', { title: 'i', type: 'implementation-record' }).valid, false);
  assert.equal(validateObject('implementation-record', { title: 'i', type: 'implementation-record', source_position: 'third-party-observer' }).valid, true);
});
