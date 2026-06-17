import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkInvariants } from '../src/index.mjs';

test('Track ≠ Deployment: a track carrying deployment structural fields is a violation', () => {
  const bad = { type: 'track', title: 't', decision_system: 'consent', power_structure: 'flat' };
  const r = checkInvariants(bad);
  assert.equal(r.ok, false);
  assert.ok(r.violations[0].includes('Track ≠ Deployment'));

  const ok = { type: 'track', title: 't', audience: 'newcomers' };
  assert.equal(checkInvariants(ok).ok, true);
});

test('AI-assisted ≠ Human-reviewed: ai_assisted + maturity reviewed is a violation', () => {
  assert.equal(checkInvariants({ type: 'resource', ai_assisted: true, maturity: 'reviewed' }).ok, false);
  assert.equal(checkInvariants({ type: 'resource', ai_assisted: true, maturity: 'candidate' }).ok, true);
});

test('Inclusion ≠ Endorsement: a raw item cannot be public_use reviewed-for-*', () => {
  assert.equal(checkInvariants({ type: 'resource', maturity: 'raw', public_use: 'reviewed-for-guidance' }).ok, false);
  assert.equal(checkInvariants({ type: 'resource', maturity: 'raw', public_use: 'raw-lead' }).ok, true);
});
