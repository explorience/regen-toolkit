import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadKmsConfig } from '../src/config.mjs';

function tmpInstance(yamlText) {
  const dir = mkdtempSync(join(tmpdir(), 'kms-config-'));
  if (yamlText != null) writeFileSync(join(dir, 'kms.yaml'), yamlText);
  return dir;
}

test('loads a valid kms.yaml and defaults render to {}', () => {
  const dir = tmpInstance('instance: t\nadapter: repo-data\ntarget: "."\n');
  const cfg = loadKmsConfig(dir);
  assert.equal(cfg.instance, 't');
  assert.equal(cfg.adapter, 'repo-data');
  assert.deepEqual(cfg.render, {});
});

test('throws a clear error when kms.yaml is absent', () => {
  const dir = tmpInstance(null);
  assert.throws(() => loadKmsConfig(dir), /no kms.yaml/);
});

test('throws when adapter or target is missing', () => {
  const dir = tmpInstance('instance: t\n');
  assert.throws(() => loadKmsConfig(dir), /missing "adapter"/);
});

test('throws when target is missing but adapter is present', () => {
  const dir = tmpInstance('instance: t\nadapter: repo-data\n');
  assert.throws(() => loadKmsConfig(dir), /missing "target"/);
});
