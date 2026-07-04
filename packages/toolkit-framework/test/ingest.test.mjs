// test/ingest.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifySource, chunkContent, prepare } from '../src/ingest.mjs';
import { loadWorkOrders } from '../src/workorder.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(here, 'fixtures', 'transcript.md');

test('classifySource detects source types', () => {
  assert.equal(classifySource('call.md', 'Ada: hi\nGrace: hello\nAda: more'), 'transcript');
  assert.equal(classifySource('notes.md', '# Doc\nplain prose, no speakers'), 'document');
  assert.equal(classifySource('rows.csv', 'a,b,c'), 'csv-crosswalk');
  assert.equal(classifySource('links.txt', 'https://a.org\nhttps://b.org'), 'url-list');
});

test('chunkContent splits oversized markdown at heading boundaries', () => {
  const small = chunkContent('# One\nshort');
  assert.equal(small.length, 1);
  assert.equal(small[0].chunk, null);
  const big = '## S1\n' + 'a'.repeat(20000) + '\n## S2\n' + 'b'.repeat(20000);
  const chunks = chunkContent(big);
  assert.ok(chunks.length >= 2, 'oversized content must split');
  assert.equal(chunks[0].chunk, `1/${chunks.length}`);
});

test('chunkContent enforces max via paragraph fallback when no headings exist', () => {
  const original = ('para ' + 'x'.repeat(95) + '\n\n').repeat(10); // 10 paragraphs, no headings
  const max = 300;
  const chunks = chunkContent(original, max);
  assert.ok(chunks.length >= 2, 'heading-free oversized content must still split');
  for (const c of chunks) {
    assert.ok(c.text.length <= max, `each chunk within max (got ${c.text.length})`);
  }
  assert.equal(chunks.map((c) => c.text).join(''), original, 'chunks rejoin losslessly');
});

test('chunkContent labels single-part oversized output as chunk null', () => {
  const giant = 'a'.repeat(50); // one unsplittable paragraph: no headings, no blank lines
  const chunks = chunkContent(giant, 10);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].chunk, null, 'single part is whole, not 1/1');
  assert.equal(chunks[0].text, giant);
});

test('prepare emits work orders and is idempotent by source hash', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-prep-'));
  const woDir = join(dir, '.workorders');
  const first = prepare({ path: FIXTURE, workOrdersDir: woDir });
  assert.equal(first.created.length, 1);
  assert.equal(first.created[0].source_type, 'transcript');
  assert.ok(first.created[0].target_schemas.includes('source-system'));
  // second run: nothing new
  const second = prepare({ path: FIXTURE, workOrdersDir: woDir });
  assert.equal(second.created.length, 0);
  assert.equal(second.skipped.length, 1);
  assert.equal(loadWorkOrders(woDir).length, 1);
});

test('prepare walks a directory recursively', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-walk-'));
  mkdirSync(join(dir, 'sub'));
  writeFileSync(join(dir, 'one.md'), '# One\nprose');
  writeFileSync(join(dir, 'sub', 'two.md'), '# Two\nprose');
  writeFileSync(join(dir, 'skip.png'), 'binary-ish');
  const woDir = join(dir, '.workorders');
  const res = prepare({ path: dir, workOrdersDir: woDir });
  assert.equal(res.created.length, 2, 'md files only, recursive');
});
