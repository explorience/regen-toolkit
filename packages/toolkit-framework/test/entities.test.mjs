// person + organization entry schemas — crosswalk "Entities = GAP" (8/30 Database_Spec
// handoff rows fell back to `resource` for lack of a dedicated person/organization schema).
// `person` is already a Layer-A core type (core-entities.yaml); `organization` is new
// Layer-B, mapping to the core `group` type.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateObject, loadSchema, validateKernel } from '../src/index.mjs';

test('person: a minimal person entry validates', () => {
  const ok = validateObject('person', {
    title: 'Ashley Cooper', type: 'person', full_name: 'Ashley Cooper',
    affiliation: 'Gitcoin', consent_status: 'consented-public',
    maturity: 'raw', ai_assisted: true, provenance: { origin: 'x' },
  });
  assert.equal(ok.valid, true, ok.errors.join('; '));
});

test('organization: a minimal organization entry validates', () => {
  const ok = validateObject('organization', {
    title: 'Gitcoin', type: 'organization', org_type: 'DAO',
    url: 'https://gitcoin.co', steward: 'Gitcoin Governance',
    is_source_system_candidate: true,
    maturity: 'raw', ai_assisted: true, provenance: { origin: 'x' },
  });
  assert.equal(ok.valid, true, ok.errors.join('; '));
});

test('organization is registered as a Layer-B extension mapping to group', () => {
  const ext = loadSchema('extension-entities');
  assert.ok('organization' in ext.entities, 'organization must be registered');
  assert.equal(ext.entities.organization.maps_to_core, 'group');
});

test('person is already a frozen Layer-A core type — no extension registration needed', () => {
  const core = loadSchema('core-entities');
  assert.ok('person' in core.entities, 'person must remain a core type');
  const ext = loadSchema('extension-entities');
  assert.ok(!('person' in ext.entities), 'person should not be re-registered as an extension');
});

test('kernel stays consistent after adding person + organization', () => {
  const { valid, errors } = validateKernel();
  assert.equal(valid, true, errors.join('; '));
});
