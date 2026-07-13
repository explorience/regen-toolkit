import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yamlLib from 'js-yaml';
import { listSchemas, loadSchema, validateObject } from '../src/index.mjs';

const goodSource = yamlLib.load(
  readFileSync(new URL('./fixtures/candidates/good-source-system.yaml', import.meta.url), 'utf8')
).object;

test('all schemas load and are well-formed (id + version)', () => {
  const names = listSchemas();
  for (const expected of ['review-maturity', 'frontmatter', 'source-system', 'contribution-record', 'signal', 'provenance', 'public-use-boundary']) {
    assert.ok(names.includes(expected), `missing schema: ${expected}`);
  }
  for (const n of names) {
    const s = loadSchema(n);
    assert.ok(s.id, `${n} missing id`);
    assert.ok(s.version, `${n} missing version`);
  }
});

test('source-system requires the federation return_path primitive (K2)', () => {
  const ok = validateObject('source-system', {
    title: 'Gitcoin Governance Forum', type: 'forum', steward: 'Gitcoin',
    return_path: 'post corrections to the forum thread', maturity: 'reviewed',
  });
  assert.equal(ok.valid, true, ok.errors.join('; '));

  const bad = validateObject('source-system', { title: 'X', type: 'forum', steward: 'Y' });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.some((e) => e.includes('return_path')), 'return_path must be required');
});

test('object validation enforces enums and inherited K1 axes', () => {
  const badType = validateObject('source-system', { title: 'X', type: 'spreadsheet-of-doom', steward: 'Y', return_path: 'z' });
  assert.equal(badType.valid, false);
  // 'canonical' is an OLD ontology maturity value — K1 rejects it (R1)
  const badMaturity = validateObject('source-system', { title: 'X', type: 'forum', steward: 'Y', return_path: 'z', maturity: 'canonical' });
  assert.equal(badMaturity.valid, false);
});

test('contribution-record carries the source_system_reciprocity hook (K5)', () => {
  const s = loadSchema('contribution-record');
  assert.ok('source_system_reciprocity' in s.fields, 'reciprocity hook present');
  const ok = validateObject('contribution-record', {
    title: 'added Gitcoin source-system card', type: 'contribution-record',
    contributor: 'luiz', what: 'source-system card', where_it_appears: 'data/source-systems.yaml',
    labor_kind: 'capture',
  });
  assert.equal(ok.valid, true, ok.errors.join('; '));
  const badLabor = validateObject('contribution-record', {
    contributor: 'x', what: 'y', where_it_appears: 'z', labor_kind: 'vibes',
  });
  assert.equal(badLabor.valid, false);
});

test('signal + public-use-boundary enums validate', () => {
  // signal extends frontmatter, so `type` (the discriminator) is required too
  assert.equal(validateObject('signal', { title: 's', type: 'signal', signal_type: 'ontology', proposed_intervention: 'route' }).valid, true);
  assert.equal(validateObject('signal', { title: 's', type: 'signal', signal_type: 'made-up' }).valid, false);
  // public-use-boundary is a mixin block (no frontmatter), only `tier` required
  assert.equal(validateObject('public-use-boundary', { tier: 'restricted-working-notes' }).valid, true);
  assert.equal(validateObject('public-use-boundary', { tier: 'totally-public' }).valid, false);
});

test('source-system accepts type: blog', () => {
  const r = validateObject('source-system', { ...goodSource, type: 'blog' });
  assert.equal(r.valid, true, r.errors.join('; '));
});
test('source-system accepts type: publication', () => {
  const r = validateObject('source-system', { ...goodSource, type: 'publication' });
  assert.equal(r.valid, true, r.errors.join('; '));
});

test('track.outcome accepts an array', () => {
  const obj = { title: 'T', type: 'journey', audience: 'newcomers', outcome: ['understands DAOs', 'has a wallet'] };
  const r = validateObject('track', obj);
  assert.equal(r.valid, true, r.errors.join('; '));
});
test('a field declared type: array rejects a scalar', () => {
  const obj = { title: 'T', type: 'journey', audience: 'newcomers', outcome: 'a single string' };
  const r = validateObject('track', obj);
  assert.ok(r.errors.some((e) => /outcome/.test(e) && /array/.test(e)), `expected an array error, got: ${JSON.stringify(r.errors)}`);
});
