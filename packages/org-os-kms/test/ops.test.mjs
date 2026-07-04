import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OPS } from '../src/ops.mjs';
import { LIFECYCLE_BINDINGS } from '../src/bind.mjs';

test('every lifecycle op-name resolves to a registered op', () => {
  const names = new Set([...LIFECYCLE_BINDINGS.initialize, ...LIFECYCLE_BINDINGS.close]);
  for (const n of names) assert.ok(OPS[n], `unregistered op: ${n}`);
});

test('exec ops carry a run() fn; skill ops carry a skill name', () => {
  for (const [name, op] of Object.entries(OPS)) {
    if (op.kind === 'exec') assert.equal(typeof op.run, 'function', `${name} missing run`);
    else { assert.equal(op.kind, 'skill'); assert.ok(op.skill, `${name} missing skill`); }
  }
});

test('csis-review and emit-contributions are skill directives', () => {
  assert.equal(OPS['csis-review'].kind, 'skill');
  assert.equal(OPS['emit-contributions'].kind, 'skill');
});
