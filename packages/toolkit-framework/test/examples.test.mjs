import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';
import { validateObject } from '../src/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const EXAMPLES = join(here, '..', 'examples');

const OBJECT_SCHEMAS = [
  'frontmatter', 'resource', 'source-system', 'option-entry', 'track', 'deployment',
  'implementation-record', 'claim-evidence', 'evolution-record', 'concept-lineage',
  'encyclopedia-entry', 'update-proposal', 'signal', 'contribution-record',
  'provenance', 'public-use-boundary', 'work-order',
];

test('examples/ directory exists', () => {
  assert.ok(existsSync(EXAMPLES), 'examples/ must exist');
});

test('every object-schema has exactly one example file', () => {
  for (const name of OBJECT_SCHEMAS) {
    const f = join(EXAMPLES, `${name}.example.yaml`);
    assert.ok(existsSync(f), `missing example for schema: ${name} (${name}.example.yaml)`);
  }
});

test('every example validates against its schema', () => {
  const files = readdirSync(EXAMPLES).filter((f) => f.endsWith('.example.yaml'));
  assert.ok(files.length >= OBJECT_SCHEMAS.length, 'expected one example per object-schema');
  for (const f of files) {
    const schemaName = f.replace(/\.example\.yaml$/, '');
    assert.ok(OBJECT_SCHEMAS.includes(schemaName),
      `${f} has no declared object-schema (add "${schemaName}" to OBJECT_SCHEMAS or rename the file)`);
    try {
      const obj = yaml.load(readFileSync(join(EXAMPLES, f), 'utf8'));
      const { valid, errors } = validateObject(schemaName, obj);
      assert.equal(valid, true, `${f} failed validation: ${errors.join('; ')}`);
    } catch (e) {
      assert.fail(`${f}: ${e.message}`);
    }
  }
});

test('no example is written for a structural schema (those have no per-instance form)', () => {
  for (const structural of ['core-entities', 'extension-entities', 'kernel-profile', 'relationships', 'review-maturity']) {
    assert.ok(!existsSync(join(EXAMPLES, `${structural}.example.yaml`)),
      `${structural} is structural — it should not have an example instance`);
  }
});
