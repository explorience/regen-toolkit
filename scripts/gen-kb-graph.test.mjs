// scripts/gen-kb-graph.test.mjs
// TDD for scripts/gen-kb-graph.mjs — the graph derivation the /kb/graph/ page consumes.
// Run: node --test scripts/gen-kb-graph.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  RELATIONSHIP_FIELDS, nodeKey, buildNodes, buildEdges, layout, buildGraph,
} from './gen-kb-graph.mjs';

const obj = (corpus, type, id, data = {}, links = []) => ({ corpus, type, id, data, links, layer: null });

test('nodeKey is corpus/type/id — collision-safe across corpora', () => {
  assert.equal(nodeKey({ corpus: 'articles', type: 'resource', id: 'giveth' }), 'articles/resource/giveth');
  assert.notEqual(
    nodeKey({ corpus: 'articles', type: 'resource', id: 'giveth' }),
    nodeKey({ corpus: 'handoff', type: 'resource', id: 'giveth' }),
  );
});

test('buildNodes: one node per object, carries type/corpus/layer/maturity, degree starts 0', () => {
  const objects = [
    obj('articles', 'encyclopedia-entry', 'e1', { title: 'E1', maturity: 'raw' }),
    obj('handoff', 'resource', 'r1', { title: 'R1' }), // no maturity → 'unspecified'
  ].map((o) => ({ ...o, layer: o.type === 'encyclopedia-entry' ? 2 : 3 }));
  const nodes = buildNodes(objects);
  assert.equal(nodes.length, 2);
  assert.deepEqual(
    nodes.map((n) => [n.key, n.type, n.corpus, n.layer, n.maturity, n.degree, n.title]),
    [
      ['articles/encyclopedia-entry/e1', 'encyclopedia-entry', 'articles', 2, 'raw', 0, 'E1'],
      ['handoff/resource/r1', 'resource', 'handoff', 3, 'unspecified', 0, 'R1'],
    ],
  );
});

test('buildEdges: keeps relationship-field links, drops noise + self-loops + dangling', () => {
  const objects = [
    obj('articles', 'concept-lineage', 'decentralization', {}, []),
    obj('articles', 'encyclopedia-entry', 'what-is-decentralization', {}, [
      { field: 'related_concepts', corpus: 'articles', type: 'concept-lineage', id: 'decentralization' }, // keep
      { field: 'adjacent_meanings', corpus: 'articles', type: 'source-system', id: 'noise' },             // drop: not a rel field
      { field: 'related_concepts', corpus: 'articles', type: 'encyclopedia-entry', id: 'what-is-decentralization' }, // drop: self
      { field: 'related_resources', corpus: 'articles', type: 'resource', id: 'missing' },                // drop: dangling (no node)
    ]),
  ].map((o) => ({ ...o, layer: 4 }));
  const nodes = buildNodes(objects);
  const nodeKeys = new Set(nodes.map((n) => n.key));
  const edges = buildEdges(objects, nodeKeys);
  assert.deepEqual(edges, [
    { source: 'articles/encyclopedia-entry/what-is-decentralization', target: 'articles/concept-lineage/decentralization', field: 'related_concepts' },
  ]);
  assert.ok(RELATIONSHIP_FIELDS.has('related_concepts'));
  assert.ok(!RELATIONSHIP_FIELDS.has('adjacent_meanings'));
});

test('degree is incremented on both endpoints of every kept edge', () => {
  const objects = [
    obj('articles', 'concept-lineage', 'a', {}, []),
    obj('articles', 'concept-lineage', 'b', {}, [{ field: 'related_concepts', corpus: 'articles', type: 'concept-lineage', id: 'a' }]),
  ].map((o) => ({ ...o, layer: 4 }));
  const graph = buildGraph(objects, { iterations: 5 });
  const byKey = Object.fromEntries(graph.nodes.map((n) => [n.key, n]));
  assert.equal(byKey['articles/concept-lineage/a'].degree, 1);
  assert.equal(byKey['articles/concept-lineage/b'].degree, 1);
});

test('layout is deterministic, finite, and integer-rounded (no NaN, no randomness)', () => {
  const nodes = Array.from({ length: 40 }, (_, i) => ({ key: `k${i}`, degree: i % 4 }));
  const edges = nodes.slice(1).map((n, i) => ({ source: n.key, target: `k${i}` }));
  const a = layout(nodes.map((n) => ({ ...n })), edges, { iterations: 60 });
  const b = layout(nodes.map((n) => ({ ...n })), edges, { iterations: 60 });
  for (const n of a) {
    assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y), `finite coords for ${n.key}`);
    assert.equal(n.x, Math.round(n.x), 'x is integer-rounded');
  }
  assert.deepEqual(a.map((n) => [n.x, n.y]), b.map((n) => [n.x, n.y]), 'same input → same layout');
});

test('buildGraph output shape: meta + nodes(with x/y) + edges', () => {
  const objects = [
    obj('articles', 'concept-lineage', 'a', { title: 'A', maturity: 'raw' }, []),
    obj('articles', 'encyclopedia-entry', 'b', { title: 'B', maturity: 'raw' },
      [{ field: 'related_concepts', corpus: 'articles', type: 'concept-lineage', id: 'a' }]),
  ].map((o) => ({ ...o, layer: o.type === 'concept-lineage' ? 4 : 2 }));
  const g = buildGraph(objects, { iterations: 10 });
  assert.equal(g.node_count, 2);
  assert.equal(g.edge_count, 1);
  assert.ok(g.nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y)));
  assert.deepEqual(new Set(Object.keys(g.by_layer)), new Set(['2', '4']));
  assert.match(g.generated_from, /gen-kb-graph/);
});
