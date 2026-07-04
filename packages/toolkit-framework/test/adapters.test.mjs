// test/adapters.test.mjs — the adapter contract. Every shipping adapter passes
// the same assertions; the interface is what this file says it is.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAdapter } from '../src/storage.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const SHIPPING = ['kb-folder', 'repo-data'];
const entry = (title = 'Contract Fixture') => ({
  schema: 'source-system',
  object: { title, type: 'wiki', steward: 'Suite', return_path: 'PRs', maturity: 'raw', ai_assisted: true },
});

for (const name of SHIPPING) {
  test(`[${name}] store → list → update → index round-trip, idempotent + derived`, () => {
    const target = mkdtempSync(join(tmpdir(), `tf-${name}-`));
    const a = getAdapter(name);
    assert.equal(a.name, name);

    const { stored } = a.store(target, [entry()]);
    assert.equal(stored.length, 1);
    // idempotent by slug: a re-store with a changed field overwrites in place
    a.store(target, [{ ...entry(), object: { ...entry().object, steward: 'Suite v2' } }]);
    assert.equal(a.list(target).length, 1);
    assert.equal(a.list(target)[0].object.steward, 'Suite v2');
    assert.equal(a.list(target)[0].ref, stored[0]);   // list refs identical to store refs

    const upd = a.update(target, stored[0], { maturity: 'plausible' });
    assert.equal(upd.ref, stored[0]);                 // update returns { ref, object }
    assert.equal(upd.object.maturity, 'plausible');
    assert.equal(a.list(target)[0].object.maturity, 'plausible');

    const idx = a.index(target);
    assert.equal(idx.total, 1);
    assert.equal(idx.by_type['source-system'], 1);
    assert.ok(idx.generated_from.includes('derived'));

    const { indexPath, contextPath } = a.writeIndex(target);
    assert.ok(existsSync(indexPath) && existsSync(contextPath));
    // index.json content is real, not just present
    const written = JSON.parse(readFileSync(indexPath, 'utf8'));
    assert.equal(written.total, 1);

    // empty target: list/index degrade gracefully
    const empty = mkdtempSync(join(tmpdir(), `tf-${name}-empty-`));
    assert.deepEqual(a.list(empty), []);
    assert.equal(a.index(empty).total, 0);
  });

  test(`[${name}] non-Latin titles never degenerate to an empty slug`, () => {
    const target = mkdtempSync(join(tmpdir(), `tf-${name}-nl-`));
    const a = getAdapter(name);
    const { stored } = a.store(target, [entry('知识共享')]);
    assert.equal(stored.length, 1);
    assert.equal(a.list(target).length, 1);
    assert.ok(!stored[0].includes('/.yaml') && !stored[0].endsWith('#'), `bad ref: ${stored[0]}`);
  });

  test(`[${name}] store rejects path-escaping schema names`, () => {
    const target = mkdtempSync(join(tmpdir(), `tf-${name}-esc-`));
    const a = getAdapter(name);
    assert.throws(() => a.store(target, [{ schema: '../../evil', object: { title: 'x' } }]), /invalid schema name/);
  });

  test(`[${name}] adapter module is importable as the entry module (no import cycle)`, () => {
    const out = execFileSync('node', ['-e',
      `import('./src/adapters/${name}.mjs').then(m => console.log(Object.values(m)[0].name))`],
      { encoding: 'utf8', cwd: join(here, '..') });
    assert.equal(out.trim(), name);
  });
}

// repo-data-specific: a hand-edited registry file without `entries:` must not crash writes
test('[repo-data] store/update tolerate a legacy registry file lacking entries key', () => {
  const target = mkdtempSync(join(tmpdir(), 'tf-repo-data-legacy-'));
  const a = getAdapter('repo-data');
  mkdirSync(join(target, 'data', 'kb'), { recursive: true });
  writeFileSync(join(target, 'data', 'kb', 'source-system.yaml'), 'foo: bar\n');
  const { stored } = a.store(target, [entry('Legacy Survivor')]);
  assert.equal(stored.length, 1);
  assert.equal(a.list(target).length, 1);
  const { object } = a.update(target, stored[0], { maturity: 'plausible' });
  assert.equal(object.maturity, 'plausible');
});

// repo-data-specific: a registry file whose `entries` is a YAML LIST cannot be
// round-tripped through the mapping model — refusing loudly beats silently
// dropping the list items on the next write.
test('[repo-data] store refuses a registry file whose entries is a list — file left untouched', () => {
  const target = mkdtempSync(join(tmpdir(), 'tf-repo-data-list-'));
  const a = getAdapter('repo-data');
  const file = join(target, 'data', 'kb', 'source-system.yaml');
  mkdirSync(dirname(file), { recursive: true });
  const original = 'entries:\n  - a\n  - b\n';
  writeFileSync(file, original);
  assert.throws(() => a.store(target, [entry('Doomed')]), /non-mapping "entries"/);
  assert.equal(readFileSync(file, 'utf8'), original); // no silent loss: bytes unchanged
});

// repo-data-specific: a scalar doc is not a registry at all — spreading a string
// would leak its character indices into the registry.
test('[repo-data] store refuses a scalar (non-mapping) registry file', () => {
  const target = mkdtempSync(join(tmpdir(), 'tf-repo-data-scalar-'));
  const a = getAdapter('repo-data');
  const file = join(target, 'data', 'kb', 'source-system.yaml');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, 'just a string\n');
  assert.throws(() => a.store(target, [entry('Doomed')]), /not a registry file/);
});

// repo-data-specific: refs are <file>#<slug>; slugs are [a-z0-9-] and never
// contain '#', but the TARGET path may — update must split at the last '#'.
test('[repo-data] update works when the target path itself contains "#"', () => {
  const target = mkdtempSync(join(tmpdir(), 'tf-hash#dir-'));
  const a = getAdapter('repo-data');
  const { stored } = a.store(target, [entry('Hash Path')]);
  const upd = a.update(target, stored[0], { maturity: 'plausible' });
  assert.equal(upd.ref, stored[0]);
  assert.equal(upd.object.maturity, 'plausible');
  assert.equal(a.list(target)[0].object.maturity, 'plausible');
});

// geo is a registered, documented STUB — the seam Rather's Geo Protocol SDK fills.
// Not in SHIPPING: it must never pass the round-trip; it must fail loudly with docs.
test('[geo] is a documented stub: registered, but every operation throws with the seam docs', () => {
  const geo = getAdapter('geo');
  assert.equal(geo.name, 'geo');
  for (const call of [() => geo.store('x', []), () => geo.list('x'), () => geo.update('x', 'r', {}), () => geo.index('x'), () => geo.writeIndex('x')]) {
    assert.throws(call, /geo adapter is a documented stub[\s\S]*(Geo Protocol|IPFS)/);
  }
});

test('[geo] adapter module is importable as the entry module (no import cycle)', () => {
  const out = execFileSync('node', ['-e',
    "import('./src/adapters/geo.mjs').then(m => console.log(Object.values(m)[0].name))"],
    { encoding: 'utf8', cwd: join(here, '..') });
  assert.equal(out.trim(), 'geo');
});
