// scripts/generate-kb-viz.test.mjs
// TDD for scripts/generate-kb-viz.mjs — corpus loaders, schema-graph builder,
// edge derivation, and Obsidian stub rendering.
// Run: node --test scripts/generate-kb-viz.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  TYPE_ORDER,
  loadArticlesCorpus,
  loadHandoffCorpus,
  buildSchemaGraph,
  deriveEdges,
  pickDescription,
  buildStub,
} from './generate-kb-viz.mjs';

function fixtureArticlesDir() {
  const dir = mkdtempSync(join(tmpdir(), 'kbviz-articles-'));
  writeFileSync(join(dir, 'resource.yaml'), [
    'entries:',
    '  res-one:',
    '    title: Resource One',
    '    maturity: raw',
    '    ai_assisted: true',
    '    sourced_from: sys-a',
    '  res-two:',
    '    title: Resource Two',
    '    maturity: reviewed',
    '    related:',
    '      - res-one',
    '      - not-a-known-id',
  ].join('\n'));
  writeFileSync(join(dir, 'source-system.yaml'), [
    'entries:',
    '  sys-a:',
    '    title: System A',
    '    maturity: reviewed',
  ].join('\n'));
  // Manifest files must be skipped.
  writeFileSync(join(dir, '_slice-manifest.yaml'), 'anything: true');
  return dir;
}

function fixtureHandoffDir() {
  const dir = mkdtempSync(join(tmpdir(), 'kbviz-handoff-'));
  mkdirSync(join(dir, 'concept-lineage'), { recursive: true });
  writeFileSync(join(dir, 'concept-lineage', 'care-web.yaml'), [
    'title: Care web',
    'type: concept-lineage',
    'maturity: raw',
    'ai_assisted: true',
    'short_description: A short description.',
    'related_to: res-one',
  ].join('\n'));
  return dir;
}

test('loadArticlesCorpus reads entries keyed by id, skips _manifests', () => {
  const objs = loadArticlesCorpus(fixtureArticlesDir());
  assert.equal(objs.length, 3);
  const one = objs.find((o) => o.id === 'res-one');
  assert.equal(one.type, 'resource');
  assert.equal(one.corpus, 'articles');
  assert.equal(one.data.title, 'Resource One');
  assert.ok(!objs.some((o) => o.id === 'anything'));
});

test('loadHandoffCorpus reads one object per file, type from dir name', () => {
  const objs = loadHandoffCorpus(fixtureHandoffDir());
  assert.equal(objs.length, 1);
  assert.deepEqual(
    [objs[0].id, objs[0].type, objs[0].corpus],
    ['care-web', 'concept-lineage', 'handoff']
  );
});

test('loaders return [] when the directory is missing (main-branch case)', () => {
  assert.deepEqual(loadArticlesCorpus('/nonexistent/kbviz'), []);
  assert.deepEqual(loadHandoffCorpus('/nonexistent/kbviz'), []);
});

test('buildSchemaGraph counts totals/raw/reviewed/byCorpus, ordered by TYPE_ORDER', () => {
  const objs = [
    ...loadArticlesCorpus(fixtureArticlesDir()),
    ...loadHandoffCorpus(fixtureHandoffDir()),
  ];
  const { nodes } = buildSchemaGraph(objs);
  assert.deepEqual(nodes.map((n) => n.type), ['resource', 'source-system', 'concept-lineage']);
  const res = nodes[0];
  assert.equal(res.total, 2);
  assert.equal(res.raw, 1);
  assert.equal(res.reviewed, 1);
  assert.deepEqual(res.byCorpus, { articles: 2, handoff: 0 });
});

test('deriveEdges finds exact-ID references in strings and arrays, aggregated to type level', () => {
  const objs = [
    ...loadArticlesCorpus(fixtureArticlesDir()),
    ...loadHandoffCorpus(fixtureHandoffDir()),
  ];
  const edges = deriveEdges(objs);
  // res-one --sourced_from--> sys-a
  assert.ok(edges.some((e) =>
    e.from === 'resource' && e.to === 'source-system' && e.label === 'sourced_from' && e.count === 1));
  // res-two --related--> res-one (same-type edge is kept in data; page filters it)
  assert.ok(edges.some((e) =>
    e.from === 'resource' && e.to === 'resource' && e.label === 'related' && e.count === 1));
  // care-web --related_to--> res-one
  assert.ok(edges.some((e) =>
    e.from === 'concept-lineage' && e.to === 'resource' && e.label === 'related_to'));
  // Unknown strings never become edges.
  assert.ok(!edges.some((e) => e.label === 'title'));
});

test('deriveEdges ignores self-references (an object citing its own id)', () => {
  const objs = [
    { id: 'a', type: 'resource', corpus: 'articles', data: { self: 'a' } },
    { id: 'b', type: 'resource', corpus: 'articles', data: {} },
  ];
  assert.deepEqual(deriveEdges(objs), []);
});

test('buildSchemaGraph output is deterministic regardless of input order', () => {
  const objs = [
    ...loadArticlesCorpus(fixtureArticlesDir()),
    ...loadHandoffCorpus(fixtureHandoffDir()),
  ];
  const a = JSON.stringify(buildSchemaGraph(objs));
  const b = JSON.stringify(buildSchemaGraph([...objs].reverse()));
  assert.equal(a, b);
});

test('pickDescription prefers short_description, falls back through the chain', () => {
  assert.equal(pickDescription({ short_description: 'S', notes: 'N' }), 'S');
  assert.equal(pickDescription({ what_it_curates: 'W' }), 'W');
  assert.equal(pickDescription({}), '');
});

test('buildStub renders frontmatter, hub wikilink, related links, source path', () => {
  const objs = [
    ...loadArticlesCorpus(fixtureArticlesDir()),
    ...loadHandoffCorpus(fixtureHandoffDir()),
  ];
  const idToType = new Map(objs.map((o) => [o.id, o.type]));
  const careWeb = objs.find((o) => o.id === 'care-web');
  const stub = buildStub(careWeb, idToType);
  assert.match(stub, /^---\n/);
  assert.match(stub, /kb_type: concept-lineage/);
  assert.match(stub, /corpus: handoff/);
  assert.match(stub, /# Care web/);
  assert.match(stub, /A short description\./);
  assert.match(stub, /\[\[kb-hub-concept-lineage\]\]/);
  assert.match(stub, /\[\[res-one\]\]/);
  assert.match(stub, /kb-handoff\/objects\/concept-lineage\/care-web\.yaml/);

  const resOne = objs.find((o) => o.id === 'res-one');
  const stub2 = buildStub(resOne, idToType);
  assert.match(stub2, /data\/kb\/resource\.yaml#res-one/);
});
