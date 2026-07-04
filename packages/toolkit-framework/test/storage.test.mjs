import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getAdapter, listAdapters, slugify } from '../src/storage.mjs';

const here = dirname(fileURLToPath(import.meta.url));

test('kb-folder adapter is importable as the entry module (no circular-import TDZ)', () => {
  const out = execFileSync('node', ['-e',
    "import('./src/adapters/kb-folder.mjs').then(m => console.log(m.kbFolderAdapter.name))"],
    { encoding: 'utf8', cwd: join(here, '..') });
  assert.equal(out.trim(), 'kb-folder');
});

test('adapter registry knows kb-folder; unknown names error with the available list', () => {
  assert.ok(listAdapters().includes('kb-folder'));
  assert.throws(() => getAdapter('nope'), /unknown storage adapter: nope \(available:/);
});

test('slugify produces stable file-safe slugs', () => {
  assert.equal(slugify('Fixture Wiki — a Source!'), 'fixture-wiki-a-source');
});

test('non-Latin titles never degenerate to an empty slug / hidden file', () => {
  const kb = mkdtempSync(join(tmpdir(), 'tf-kb-slug-'));
  const a = getAdapter('kb-folder');
  const { stored } = a.store(kb, [
    { schema: 'source-system', object: { title: '知识共享', type: 'wiki', steward: 'S', return_path: 'r' } },
  ]);
  assert.ok(!stored[0].endsWith('/.yaml'), `got hidden file: ${stored[0]}`);
  assert.equal(a.list(kb).length, 1);
});

test('store rejects path-escaping schema names', () => {
  const kb = mkdtempSync(join(tmpdir(), 'tf-kb-schema-'));
  const a = getAdapter('kb-folder');
  assert.throws(() => a.store(kb, [{ schema: '../../evil', object: { title: 'x' } }]), /invalid schema name/);
});

test('kb-folder stores, lists, updates, indexes — atomic, idempotent, derived index', () => {
  const kb = mkdtempSync(join(tmpdir(), 'tf-kb-'));
  const a = getAdapter('kb-folder');
  const entry = {
    schema: 'source-system',
    object: { title: 'Fixture Wiki', type: 'wiki', steward: 'Fixture Collective',
      return_path: 'PRs welcome', maturity: 'raw', ai_assisted: true },
  };
  const { stored } = a.store(kb, [entry]);
  assert.equal(stored.length, 1);
  assert.ok(existsSync(join(kb, 'objects', 'source-system', 'fixture-wiki.yaml')));
  // idempotent: same title+schema overwrites, never duplicates
  a.store(kb, [entry]);
  assert.equal(a.list(kb).length, 1);
  // update merges a patch
  a.update(kb, stored[0], { maturity: 'plausible' });
  assert.equal(a.list(kb)[0].object.maturity, 'plausible');
  // index is derived + rebuildable
  const idx = a.index(kb);
  assert.equal(idx.total, 1);
  assert.equal(idx.by_type['source-system'], 1);
  assert.equal(idx.by_maturity.plausible, 1);
  const { indexPath, contextPath } = a.writeIndex(kb);
  assert.ok(existsSync(indexPath) && existsSync(contextPath));
  assert.ok(JSON.parse(readFileSync(contextPath, 'utf8'))['@context']);
});
