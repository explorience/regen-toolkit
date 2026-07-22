// scripts/gen-kb-graph.test.mjs
// TDD for scripts/gen-kb-graph.mjs — the graph derivation the /kb/graph/ page consumes.
// Run: node --test scripts/gen-kb-graph.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  RELATIONSHIP_FIELDS, nodeKey, buildNodes, buildEdges, layout, buildGraph,
  normalizeTitle, buildRelationshipEdges,
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

test('normalizeTitle folds case, punctuation, and unicode to a comparable key', () => {
  assert.equal(normalizeTitle('Aapti Institute'), 'aapti institute');
  assert.equal(normalizeTitle('  Karnataka Rajya Raitha Sangha (KRRS) '), 'karnataka rajya raitha sangha krrs');
  assert.equal(normalizeTitle('Café—Déjà'), 'cafe deja');
  assert.equal(normalizeTitle(undefined), '');
});

test('buildRelationshipEdges wires an RR whose subject+object both resolve unambiguously', () => {
  const objects = [
    { corpus: 'handoff', type: 'organization', id: 'aapti', layer: 3, data: { title: 'Aapti Institute' }, links: [] },
    { corpus: 'handoff', type: 'resource', id: 'fpds', layer: 3, data: { title: 'Fostering Participatory Data Stewardship' }, links: [] },
    { corpus: 'handoff', type: 'relationship-record', id: 'rr1', layer: 1, links: [],
      data: { subject: 'Aapti Institute', predicate: 'developed', object: 'Fostering Participatory Data Stewardship' } },
  ];
  const nodes = buildNodes(objects);
  const { edges, stats } = buildRelationshipEdges(objects, nodes);
  assert.deepEqual(edges, [
    { source: 'handoff/organization/aapti', target: 'handoff/resource/fpds', field: 'relationship-record', predicate: 'developed' },
  ]);
  assert.equal(stats.total, 1);
  assert.equal(stats.wired, 1);
});

test('buildRelationshipEdges skips ambiguous, unresolved, and self endpoints', () => {
  const objects = [
    { corpus: 'articles', type: 'resource', id: 'giveth-a', layer: 3, data: { title: 'Giveth' }, links: [] },
    { corpus: 'handoff', type: 'source-system', id: 'giveth-b', layer: 3, data: { title: 'Giveth' }, links: [] }, // same title → ambiguous
    { corpus: 'handoff', type: 'organization', id: 'aapti', layer: 3, data: { title: 'Aapti Institute' }, links: [] },
    { corpus: 'handoff', type: 'relationship-record', id: 'rr-amb', layer: 1, links: [],
      data: { subject: 'Giveth', predicate: 'x', object: 'Aapti Institute' } },        // subject ambiguous → skip
    { corpus: 'handoff', type: 'relationship-record', id: 'rr-unres', layer: 1, links: [],
      data: { subject: 'Aapti Institute', predicate: 'y', object: 'Nonexistent Thing' } }, // object unresolved → skip
    { corpus: 'handoff', type: 'relationship-record', id: 'rr-self', layer: 1, links: [],
      data: { subject: 'Aapti Institute', predicate: 'z', object: 'Aapti Institute' } },    // resolves to same node → skip
  ];
  const nodes = buildNodes(objects);
  const { edges, stats } = buildRelationshipEdges(objects, nodes);
  assert.deepEqual(edges, []);
  assert.equal(stats.total, 3);
  assert.equal(stats.wired, 0);
  assert.equal(stats.ambiguous, 1);
});

test('buildGraph merges relationship edges, dedups vs related_* edges, and counts degree', () => {
  const objects = [
    { corpus: 'articles', type: 'concept-lineage', id: 'a', layer: 4, data: { title: 'Alpha' },
      links: [{ field: 'related_concepts', corpus: 'articles', type: 'concept-lineage', id: 'b' }] },
    { corpus: 'articles', type: 'concept-lineage', id: 'b', layer: 4, data: { title: 'Beta' }, links: [] },
    // RR asserting the SAME undirected pair a<->b — must dedup, not double
    { corpus: 'articles', type: 'relationship-record', id: 'rrdup', layer: 1, links: [],
      data: { subject: 'Alpha', predicate: 'relates', object: 'Beta' } },
    // RR asserting a NEW pair a<->c
    { corpus: 'articles', type: 'resource', id: 'c', layer: 3, data: { title: 'Gamma' }, links: [] },
    { corpus: 'articles', type: 'relationship-record', id: 'rrnew', layer: 1, links: [],
      data: { subject: 'Alpha', predicate: 'uses', object: 'Gamma' } },
  ];
  const g = buildGraph(objects, { iterations: 5 });
  // undirected pairs present: a-b (from related_concepts, dedups the RR dup) and a-c (from RR)
  assert.equal(g.edge_count, 2);
  assert.ok(g.rr_stats && g.rr_stats.total === 2, 'rr_stats present with total 2');
  const byKey = Object.fromEntries(g.nodes.map((n) => [n.key, n]));
  assert.equal(byKey['articles/concept-lineage/a'].degree, 2); // a-b and a-c
  assert.equal(byKey['articles/resource/c'].degree, 1);
});
