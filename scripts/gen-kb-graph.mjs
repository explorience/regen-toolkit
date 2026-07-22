#!/usr/bin/env node
// scripts/gen-kb-graph.mjs
// Derives the interactive-graph data from the committed KB content snapshot:
//   src/data/kb-content.json  →  src/data/kb-graph.json
// Nodes = objects; edges = relationship-field links (noise fields dropped). Layout
// is a small deterministic force sim baked at build time — no d3 dependency, no
// Math.random, integer-rounded → byte-identical on re-run, like the sibling generators.
// Run: node scripts/gen-kb-graph.mjs   (or npm run gen:kb-graph; runs in prebuild)

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Only these fields are genuine object→object references (id-slug arrays/scalars).
// Everything else the upstream link-walker surfaces (free text that happens to
// equal an id, e.g. `adjacent_meanings`) is dropped — a hairball is not a graph.
export const RELATIONSHIP_FIELDS = new Set([
  'related_concepts', 'related_resources', 'related_options', 'related',
  'concepts', 'options', 'selected_options',
  'related_deployment', 'related_track', 'signal_ref',
]);

export const nodeKey = ({ corpus, type, id }) => `${corpus}/${type}/${id}`;

// Normalize a free-text label to a comparison key for entity resolution:
// lowercase, strip diacritics (NFKD), collapse any run of non-alphanumerics to a
// single space, trim. Used to match a relationship-record's subject/object label
// against object titles.
export function normalizeTitle(s) {
  return String(s ?? '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// relationship-record objects carry free-text subject/predicate/object (they are
// "Relationship Leads", not resolved refs). Wire the ones whose BOTH endpoints
// resolve unambiguously (exactly one node) by normalized-title match → an edge
// subject→object tagged with the predicate. Ambiguous (title shared by >1 node),
// unresolved, or self endpoints are skipped and tallied. This is the ~11% that
// auto-resolve; the rest stay raw leads (a known framework gap — see the daily log).
export function buildRelationshipEdges(objects, nodes) {
  const titleIndex = new Map(); // normTitle -> Set<nodeKey>
  for (const n of nodes) {
    if (n.type === 'relationship-record') continue;
    const k = normalizeTitle(n.title);
    if (!k) continue;
    if (!titleIndex.has(k)) titleIndex.set(k, new Set());
    titleIndex.get(k).add(n.key);
  }
  const resolve = (label) => {
    const set = titleIndex.get(normalizeTitle(label));
    return set && set.size === 1 ? [...set][0] : (set && set.size > 1 ? 'AMBIGUOUS' : null);
  };
  const edges = [];
  const stats = { total: 0, wired: 0, ambiguous: 0, unresolved: 0 };
  for (const o of objects) {
    if (o.type !== 'relationship-record') continue;
    stats.total += 1;
    const s = resolve(o.data?.subject);
    const t = resolve(o.data?.object);
    if (s === 'AMBIGUOUS' || t === 'AMBIGUOUS') { stats.ambiguous += 1; continue; }
    if (!s || !t || s === t) { stats.unresolved += 1; continue; }
    edges.push({ source: s, target: t, field: 'relationship-record', predicate: o.data?.predicate ?? '' });
    stats.wired += 1;
  }
  return { edges, stats };
}

export function buildNodes(objects) {
  return objects.map((o) => ({
    key: nodeKey(o),
    id: o.id,
    type: o.type,
    corpus: o.corpus,
    layer: o.layer ?? null,
    // Honest maturity: an object with no maturity field is `unspecified`, NOT raw
    // (folding unset into raw over-reports raw and would wrongly sweep these into
    // the "Spotlight raw" filter). Matches the lesson in generate-kb-viz.mjs.
    maturity: o.data?.maturity ?? 'unspecified',
    title: (typeof o.data?.title === 'string' && o.data.title.trim()) || o.id,
    degree: 0,
  }));
}

// Edges from relationship-field links only. Drops self-loops and links whose
// target isn't a real node (dangling). De-duplicates undirected pairs so a mutual
// reference doesn't draw twice.
export function buildEdges(objects, nodeKeys) {
  const seen = new Set();
  const edges = [];
  for (const o of objects) {
    const src = nodeKey(o);
    for (const l of o.links ?? []) {
      if (!RELATIONSHIP_FIELDS.has(l.field)) continue;
      const tgt = nodeKey(l);
      if (tgt === src || !nodeKeys.has(tgt)) continue;
      const undirected = src < tgt ? `${src} ${tgt}` : `${tgt} ${src}`;
      if (seen.has(undirected)) continue;
      seen.add(undirected);
      edges.push({ source: src, target: tgt, field: l.field });
    }
  }
  return edges;
}

// Deterministic force-directed layout. Initial placement = golden-angle spiral by
// index (stable, no RNG). Then fixed iterations of repulsion (O(n^2), fine at ~900
// nodes, build-time only) + spring attraction along edges + mild centering, with
// linear cooling. Coordinates are rounded to integers at the end so the JSON is
// byte-stable run-to-run.
export function layout(nodes, edges, { iterations = 300, area = 1600 } = {}) {
  const n = nodes.length;
  if (n === 0) return nodes;
  const GA = Math.PI * (3 - Math.sqrt(5)); // golden angle
  const R = area / 2;
  const p = nodes.map((_, i) => {
    const r = Math.sqrt((i + 0.5) / n) * R;
    const a = i * GA;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
  const idx = new Map(nodes.map((nd, i) => [nd.key, i]));
  const links = edges
    .map((e) => [idx.get(e.source), idx.get(e.target)])
    .filter(([a, b]) => a != null && b != null && a !== b);

  const k = area / Math.sqrt(n);      // ideal separation
  const kRep = k * k;                 // repulsion strength
  for (let it = 0; it < iterations; it++) {
    const cool = 1 - it / iterations;                  // 1 → 0
    const maxStep = k * cool + 0.01;                   // clamp displacement, cools down
    const disp = p.map(() => ({ x: 0, y: 0 }));
    // repulsion (every pair)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = p[i].x - p[j].x;
        let dy = p[i].y - p[j].y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 0.01) { dx = ((i % 7) - 3) * 0.1 + 0.05; dy = ((j % 5) - 2) * 0.1 + 0.05; d2 = dx * dx + dy * dy; }
        const f = kRep / d2;
        const d = Math.sqrt(d2);
        const ux = dx / d, uy = dy / d;
        disp[i].x += ux * f; disp[i].y += uy * f;
        disp[j].x -= ux * f; disp[j].y -= uy * f;
      }
    }
    // spring attraction along edges
    for (const [a, b] of links) {
      const dx = p[a].x - p[b].x;
      const dy = p[a].y - p[b].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d * d) / k;
      const ux = dx / d, uy = dy / d;
      disp[a].x -= ux * f; disp[a].y -= uy * f;
      disp[b].x += ux * f; disp[b].y += uy * f;
    }
    // integrate with cooling + mild centering pull
    for (let i = 0; i < n; i++) {
      let mx = disp[i].x, my = disp[i].y;
      const dl = Math.sqrt(mx * mx + my * my) || 1;
      const step = Math.min(dl, maxStep);
      p[i].x += (mx / dl) * step - p[i].x * 0.002 * cool;
      p[i].y += (my / dl) * step - p[i].y * 0.002 * cool;
    }
  }
  for (let i = 0; i < n; i++) {
    nodes[i].x = Math.round(p[i].x);
    nodes[i].y = Math.round(p[i].y);
  }
  return nodes;
}

export function buildGraph(objects, opts = {}) {
  const nodes = buildNodes(objects);
  const nodeKeys = new Set(nodes.map((nd) => nd.key));
  const edges = buildEdges(objects, nodeKeys);
  // Add relationship-record-derived edges, skipping any undirected pair already present.
  const seen = new Set(edges.map((e) => (e.source < e.target ? `${e.source} ${e.target}` : `${e.target} ${e.source}`)));
  const { edges: relEdges, stats: rr_stats } = buildRelationshipEdges(objects, nodes);
  for (const e of relEdges) {
    const pair = e.source < e.target ? `${e.source} ${e.target}` : `${e.target} ${e.source}`;
    if (seen.has(pair)) continue;
    seen.add(pair);
    edges.push(e);
  }
  const deg = new Map(nodes.map((nd) => [nd.key, 0]));
  for (const e of edges) {
    deg.set(e.source, deg.get(e.source) + 1);
    deg.set(e.target, deg.get(e.target) + 1);
  }
  for (const nd of nodes) nd.degree = deg.get(nd.key);
  layout(nodes, edges, opts);
  const by_layer = {};
  for (const nd of nodes) {
    const key = nd.layer ?? 'unmapped';
    by_layer[key] = (by_layer[key] ?? 0) + 1;
  }
  return {
    generated_from: 'derived — rebuildable via scripts/gen-kb-graph.mjs (prebuild)',
    node_count: nodes.length,
    edge_count: edges.length,
    rr_stats,
    by_layer,
    nodes,
    edges,
  };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const snapPath = join(ROOT, 'src', 'data', 'kb-content.json');
  const snap = JSON.parse(readFileSync(snapPath, 'utf8'));
  const graph = buildGraph(snap.objects);
  const outPath = join(ROOT, 'src', 'data', 'kb-graph.json');
  writeFileSync(outPath, JSON.stringify(graph, null, 2) + '\n');
  console.log(`kb-graph: ${graph.node_count} nodes · ${graph.edge_count} edges → src/data/kb-graph.json`);
  console.log(`  relationship-records: ${graph.rr_stats.total} · wired ${graph.rr_stats.wired} · ambiguous ${graph.rr_stats.ambiguous} · unresolved ${graph.rr_stats.unresolved} (free-text subject/object — framework gap)`);
}
