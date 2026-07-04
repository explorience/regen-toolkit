// test/adapters.test.mjs — the adapter contract. Every shipping adapter passes
// the same assertions; the interface is what this file says it is.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
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
    a.store(target, [entry()]);                       // idempotent by slug
    assert.equal(a.list(target).length, 1);

    a.update(target, stored[0], { maturity: 'plausible' });
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
