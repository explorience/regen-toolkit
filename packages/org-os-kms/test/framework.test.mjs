import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fw from '../src/framework.mjs';

test('framework shim re-exports the functions org-os-kms needs', () => {
  for (const name of ['listSchemas', 'validateObject', 'getAdapter', 'slugify',
    'deriveIndex', 'isAwaitingReview', 'reviewQueue', 'promote', 'loadConfig',
    'federateAdd', 'federateCheck', 'prepare', 'acceptWorkOrder']) {
    assert.equal(typeof fw[name], 'function', `missing ${name}`);
  }
});

test('framework shim resolves live schemas (binding actually reaches the framework)', () => {
  assert.ok(fw.listSchemas().includes('source-system'));
  assert.ok(fw.listSchemas().includes('review-maturity'));
});
