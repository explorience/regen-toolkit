import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dispatch } from '../src/cli.mjs';

test('parses "lifecycle initialize --dir X" into a verb + flags', () => {
  const r = dispatch(['lifecycle', 'initialize', '--dir', '/tmp/x'], { dry: true });
  assert.equal(r.verb, 'lifecycle');
  assert.equal(r.args[0], 'initialize');
  assert.equal(r.flags.dir, '/tmp/x');
});

test('unknown verb returns an error result, not a throw', () => {
  const r = dispatch(['frobnicate'], { dry: true });
  assert.match(r.error, /unknown verb: frobnicate/);
});

test('known verbs are all routable', () => {
  for (const v of ['lifecycle', 'bridge', 'render', 'federate', 'promote', 'init']) {
    assert.equal(dispatch([v], { dry: true }).verb, v);
  }
});
