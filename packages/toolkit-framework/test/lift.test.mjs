import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, liftRow, liftRows } from '../src/lift.mjs';
import { validateObject } from '../src/index.mjs';

test('parseCsv handles headers, quoted commas, and "" escapes', () => {
  const rows = parseCsv('name,url,note\n"A, Inc",http://a,"x ""y"""\nB,,z');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].name, 'A, Inc');
  assert.equal(rows[0].note, 'x "y"');
  assert.equal(rows[1].name, 'B');
});

test('liftRow produces a valid resource that is never auto-promoted', () => {
  const r = liftRow({
    name: 'Gitcoin', url: 'https://gitcoin.co', primary_type: 'org',
    toolkit_route: 'Resource Graph', source_origin: 'provided seed', review_status: 'raw',
  });
  assert.equal(r.maturity, 'raw');
  assert.equal(r.lifecycle_state, 'raw-lead');
  const v = validateObject('resource', r);
  assert.equal(v.valid, true, v.errors.join('; '));
});

test('liftRows skips tweet-noise rows (route guard)', () => {
  const { resources, skipped } = liftRows([
    { name: 'Clean', toolkit_route: 'Resource Graph' },
    { name: 'Noisy', toolkit_route: 'check out https://t.co/abc for more' },
  ]);
  assert.equal(resources.length, 1);
  assert.equal(skipped.length, 1);
});
