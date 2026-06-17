import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toOrgOsRegistries, profileManifest, REGISTRY_BINDINGS } from '../src/bind.mjs';

test('binds framework objects to their org-os registries (module)', () => {
  const out = toOrgOsRegistries([
    { type: 'resource', title: 'a' },
    { type: 'source-system', title: 'b' },
    { type: 'mystery', title: 'c' },
  ]);
  assert.ok(out['data/resources.yaml']);
  assert.ok(out['data/source-systems.yaml']);
  assert.ok(out['data/misc.yaml'], 'unknown types fall through to misc');
});

test('profile ships the framework pre-loaded as the default KMS (profile)', () => {
  const m = profileManifest();
  assert.equal(m.default_knowledge_system, '@regen-commons/toolkit-framework');
  // schemas are loaded live from the framework package — proves the binding resolves
  assert.ok(m.schemas.includes('source-system'));
  assert.ok(m.schemas.includes('review-maturity'));
  assert.equal(m.replaceable, true);
  assert.ok(Object.keys(REGISTRY_BINDINGS).length >= 8);
});
