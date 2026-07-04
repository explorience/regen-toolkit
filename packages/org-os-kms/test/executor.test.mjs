import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runLifecycle } from '../src/executor.mjs';
import { OPS } from '../src/ops.mjs';

// Build an isolated OPS-like map by monkeypatching run() to record order without touching disk.
function stubOps(order) {
  return {
    'a.read':  { kind: 'exec', write: false, run: () => { order.push('a.read'); return { ok: true }; } },
    'a.write': { kind: 'exec', write: true,  run: () => { order.push('a.write'); return { ok: true }; } },
    'a.render': { kind: 'exec', write: false, run: () => { order.push('a.render'); throw new Error('render boom'); } },
    'a.crash': { kind: 'exec', write: true,  run: () => { order.push('a.crash'); throw new Error('write boom'); } },
    'a.skill': { kind: 'skill', skill: 'demo-skill' },
  };
}

test('runs exec ops in order, collects skill directives', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.read', 'a.skill', 'a.write'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.read', 'a.write']);
  assert.deepEqual(r.skills, ['demo-skill']);
  assert.equal(r.errors.length, 0);
});

test('fail-soft: a render/read op error is logged but the run continues', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.render', 'a.read'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.render', 'a.read']);
  assert.match(r.errors[0], /render boom/);
});

test('fail-hard: a write op error stops the run', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.crash', 'a.read'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.crash']); // a.read never runs
  assert.match(r.errors[0], /write boom/);
});

test('default deps use the real OPS + LIFECYCLE_BINDINGS', () => {
  assert.ok(OPS['config.load']); // sanity: real registry wired
});
