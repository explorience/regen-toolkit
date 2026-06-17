import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkOptionCompatibility, checkDeploymentValidity, checkTrackComposition } from '../src/compatibility.mjs';

test('option compatibility detects a declared incompatibility', () => {
  const opts = [
    { id: 'token-voting', category: 'governance', incompatibilities: ['one-person-one-vote'] },
    { id: 'one-person-one-vote', category: 'governance' },
  ];
  const r = checkOptionCompatibility(opts);
  assert.equal(r.compatible, false);
  assert.equal(r.conflicts.length, 1);
});

test('option compatibility passes when there are no conflicts', () => {
  const opts = [{ id: 'sociocracy', category: 'governance' }, { id: 'quadratic-funding', category: 'funding-capital' }];
  assert.equal(checkOptionCompatibility(opts).compatible, true);
});

test('deployment validity requires the 6 structural components', () => {
  const r = checkDeploymentValidity({ title: 'd', decision_system: 'consent' });
  assert.equal(r.valid, false);
  assert.ok(r.missing.includes('power_structure'));

  const complete = {
    decision_system: 'consent', information_requirements: 'x', power_structure: 'distributed',
    accountability: 'y', failure_detection: 'z', boundaries: 'fixed: charter',
    readiness_level: 'L3-community-pilot',
  };
  const ok = checkDeploymentValidity(complete);
  assert.equal(ok.valid, true);
  assert.equal(ok.missing.length, 0);
});

test('track composition reuses the option engine + flags unresolved options', () => {
  const index = { a: { id: 'a', incompatibilities: ['b'] }, b: { id: 'b' } };
  const track = { title: 't', options: ['a', 'b', 'missing'] };
  const r = checkTrackComposition(track, index);
  assert.equal(r.composable, false);          // a conflicts with b
  assert.deepEqual(r.unresolved, ['missing']);
});
