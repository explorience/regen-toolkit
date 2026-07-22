# Interactive KB Graph — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive force-directed graph of the 868 reprocessed KB objects at `/kb/graph/` — pan/zoom/hover/click, colored by layer, filterable by corpus/layer/maturity — as a clean, non-colliding add-on to the parallel session's `/kb/` content pages.

**Architecture:** A new prebuild generator (`scripts/gen-kb-graph.mjs`) reads the parallel session's committed `src/data/kb-content.json`, builds nodes (one per object) + edges (relationship-field links only), computes a **deterministic in-script force layout** (no `d3-force` dependency, no `Math.random` — byte-identical like the other generators), and writes `src/data/kb-graph.json` with baked `x`/`y`. A single Astro route `src/pages/kb/graph.astro` embeds that JSON and mounts a self-contained `<canvas>` island (`src/components/KbGraph.astro`) that renders the baked layout and handles interaction client-side. No runtime physics.

**Tech Stack:** Astro 6 (existing), plain Node + `node:test` for the generator (repo convention), vanilla `<canvas>` + a Vite-bundled client `<script>` (the site's first interactive island). Zero new npm dependencies.

**Scope note:** This plan delivers ONLY the interactive graph (Unit C of `docs/plans/2026-07-21-kb-dev-instance-design.md`). Units A/B (snapshot + content pages) are delivered by the parallel session's `docs/plans/dev-instance-build.md` (Tasks 1–8), which explicitly deferred the graph. Built on branch `kb-graph-dev` in an isolated worktree; merges back to `regen-toolkit-os`.

---

## Context an executor needs (read first, verify each)

- **Worktree:** `~/.config/superpowers/worktrees/regen-toolkit/kb-graph`, branch `kb-graph-dev` (off `regen-toolkit-os` @ `609d06a`). `node_modules` is a symlink to the main checkout — **do NOT run `npm install`** (it would churn the shared node_modules + lockfile). Zero new deps by design.
- **Vault safety:** no `git stash`/`clean`/`reset --hard`; scoped `git add` only (never `git add -A`/`.`). Never push `origin` or touch `main`.
- **Input contract — `src/data/kb-content.json`** (committed by the parallel session; regenerate with `node scripts/gen-kb-content.mjs`): `{ total, by_corpus, by_type, by_layer, by_maturity, layers, objects }`. Each `objects[i]` = `{ id, type, corpus, layer, data, links }` where:
  - `corpus` ∈ `"articles" | "handoff"`; `type` is a schema slug; `id` is the object slug; `layer` is an integer 1–10 or `null`.
  - `data` is the raw object (has `title`, `maturity`, etc.).
  - `links` = `[{ field, corpus, type, id }]` — outbound references. **Noisy:** the parallel session's `deriveObjectLinks` walks every string field, so `field` may be free-text (e.g. `adjacent_meanings`). This plan filters to relationship fields.
- **Object page URL** (built by the parallel session, route `src/pages/kb/[corpus]/[type]/[slug].astro`): `/kb/<corpus>/<type>/<id>/`. Clicking a node navigates there.
- **Base-path:** `const base = import.meta.env.BASE_URL` → `/` on Vercel, `/regen-toolkit/` on Pages. Client code must prefix nav URLs with `base` (passed via a `data-base` attribute).
- **Design source:** `docs/plans/2026-07-21-kb-dev-instance-design.md` §4.2 (graph JSON) + §6.1 (interactive graph).

## File structure

| File | Responsibility |
|---|---|
| Create `scripts/gen-kb-graph.mjs` | Read `kb-content.json` → nodes + filtered edges → deterministic force layout → `src/data/kb-graph.json`. Exports pure fns for testing. |
| Create `scripts/gen-kb-graph.test.mjs` | `node:test` for edge filtering, node/degree building, layout determinism + finiteness, snapshot shape. |
| Create `src/data/kb-graph.json` | Derived, committed snapshot (like `kb-content.json`; self-heals on prebuild). |
| Create `src/components/KbGraph.astro` | The canvas island: markup + scoped CSS + Vite-bundled client script (render + pan/zoom/hover/click/filter). |
| Create `src/pages/kb/graph.astro` | The `/kb/graph/` route: honesty banner, legend, filters, `<KbGraph>`, no-JS fallback. |
| Modify `package.json` | Append `gen:kb-graph` to `scripts` + to the `prebuild` chain (single shared-file touch; append-only). |

**Deliberately NOT touched (owned by the parallel session — avoid collision):** `src/pages/kb/index.astro`, `astro.config.mjs` (sidebar), `src/layouts/Page.astro` (nav). Discoverability cross-links into those are added at merge time (Task 6), not in this branch.

---

### Task 1: The graph generator (`gen-kb-graph.mjs`) — TDD

**Files:**
- Create: `scripts/gen-kb-graph.test.mjs`
- Create: `scripts/gen-kb-graph.mjs`

- [ ] **Step 1: Write the failing test**

```js
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
    obj('handoff', 'resource', 'r1', { title: 'R1' }), // no maturity → 'raw'
  ].map((o) => ({ ...o, layer: o.type === 'encyclopedia-entry' ? 2 : 3 }));
  const nodes = buildNodes(objects);
  assert.equal(nodes.length, 2);
  assert.deepEqual(
    nodes.map((n) => [n.key, n.type, n.corpus, n.layer, n.maturity, n.degree, n.title]),
    [
      ['articles/encyclopedia-entry/e1', 'encyclopedia-entry', 'articles', 2, 'raw', 0, 'E1'],
      ['handoff/resource/r1', 'resource', 'handoff', 3, 'raw', 0, 'R1'],
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/gen-kb-graph.test.mjs`
Expected: FAIL — `Cannot find module ... gen-kb-graph.mjs`

- [ ] **Step 3: Write the implementation**

```js
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

export function buildNodes(objects) {
  return objects.map((o) => ({
    key: nodeKey(o),
    id: o.id,
    type: o.type,
    corpus: o.corpus,
    layer: o.layer ?? null,
    maturity: o.data?.maturity ?? 'raw',
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
      const undirected = src < tgt ? `${src} ${tgt}` : `${tgt} ${src}`;
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
        if (d2 < 0.01) { dx = ((i % 7) - 3) * 0.1; dy = ((j % 7) - 3) * 0.1; d2 = dx * dx + dy * dy + 0.01; }
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
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/gen-kb-graph.test.mjs`
Expected: PASS (6 tests). Also `node --test scripts/gen-kb-content.test.mjs scripts/generate-kb-viz.test.mjs` → still PASS (unchanged).

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-kb-graph.mjs scripts/gen-kb-graph.test.mjs
git commit -m "feat(kb-graph): deterministic graph generator (nodes + rel-edges + baked force layout; TDD)"
```

---

### Task 2: Wire into the build + generate the real graph

**Files:**
- Modify: `package.json` (the `scripts` block — append only)
- Create (generated): `src/data/kb-graph.json`

- [ ] **Step 1: Add the npm script + prebuild hook.** In `package.json` `scripts`, change:

```json
    "gen:kb-content": "node scripts/gen-kb-content.mjs",
```

to:

```json
    "gen:kb-content": "node scripts/gen-kb-content.mjs",
    "gen:kb-graph": "node scripts/gen-kb-graph.mjs",
```

and change the `prebuild` line (append the graph step at the END so it runs after the content snapshot it depends on):

```json
    "prebuild": "node scripts/gen-framework-manifest.mjs && node scripts/gen-instance-stats.mjs && node scripts/generate-kb-viz.mjs && node scripts/gen-kb-content.mjs",
```

to:

```json
    "prebuild": "node scripts/gen-framework-manifest.mjs && node scripts/gen-instance-stats.mjs && node scripts/generate-kb-viz.mjs && node scripts/gen-kb-content.mjs && node scripts/gen-kb-graph.mjs",
```

- [ ] **Step 2: Generate against the real snapshot + sanity-check**

Run: `node scripts/gen-kb-content.mjs && node scripts/gen-kb-graph.mjs`
Expected: `kb-graph: 868 nodes · <N> edges → src/data/kb-graph.json` (N is however many relationship-field edges resolve — a few hundred is expected; a low N is fine and honest).

Then: `node -e "const g=require('./src/data/kb-graph.json'); const bad=g.nodes.filter(n=>!Number.isFinite(n.x)||!Number.isFinite(n.y)); console.log('nodes',g.node_count,'edges',g.edge_count,'nonfinite',bad.length,'layers',Object.keys(g.by_layer).sort())"`
Expected: `nodes 868 edges <N> nonfinite 0 layers [ ... ]` — **zero non-finite coordinates.**

Idempotency check: `node scripts/gen-kb-graph.mjs && git diff --stat src/data/kb-graph.json` → **no diff** on the second run (byte-stable).

- [ ] **Step 3: Commit**

```bash
git add package.json src/data/kb-graph.json
git commit -m "feat(kb-graph): generate kb-graph snapshot in prebuild (868 nodes)"
```

---

### Task 3: The canvas island (`KbGraph.astro`)

**Files:**
- Create: `src/components/KbGraph.astro`

The component takes the graph object as a prop, embeds it as a JSON `<script type="application/json">` (so the client script reads it without a network fetch), renders a `<canvas>` + filter controls, and ships a Vite-bundled client script. Base URL is passed via `data-base` for click-navigation.

- [ ] **Step 1: Write the component**

```astro
---
// Interactive KB graph — a self-contained canvas island. Reads a baked-layout
// graph (nodes with x/y + edges), renders it, and handles pan/zoom/hover/click/
// filter entirely client-side. No runtime physics. Progressive: if JS is off, the
// page's fallback (in graph.astro) still explains + links to the browse pages.
const { graph, base } = Astro.props;

// Layer → color + name. Theme palette hues in layer order; 'unmapped' is grey.
// This component owns the legend AND the layer filter (they're the same chips).
const LAYER_COLORS = {
  1: '#6b7280', 2: '#3f7d5a', 3: '#2f6f6f', 4: '#8a6d3b', 5: '#9c5a3c',
  6: '#7d5a9c', 7: '#3f6d9c', 8: '#4a7d3f', 9: '#9c3f6d', 10: '#5a5a5a',
  unmapped: '#b0b0b0',
};
const LAYER_NAMES = {
  1: 'Ontology', 2: 'Knowledge', 3: 'Resource graph', 4: 'Concept ecology', 5: 'Option library',
  6: 'Deployment', 7: 'Tracks', 8: 'Implementation', 9: 'Evolution', 10: 'Infrastructure',
};
// Present layers, unmapped last — each renders as a legend chip that is also a filter toggle.
const legendKeys = Object.keys(graph.by_layer)
  .sort((a, b) => (a === 'unmapped' ? 1 : b === 'unmapped' ? -1 : Number(a) - Number(b)));
const chipLabel = (k) => (k === 'unmapped' ? 'Unmapped' : `L${k} · ${LAYER_NAMES[k]}`);
---

<div class="kbg" data-base={base}>
  <div class="kbg__controls">
    <fieldset class="kbg__filters" aria-label="Filter graph">
      <label><input type="checkbox" data-filter="corpus" value="articles" checked /> Articles</label>
      <label><input type="checkbox" data-filter="corpus" value="handoff" checked /> Handoff</label>
      <span class="kbg__sep" aria-hidden="true"></span>
      <label><input type="checkbox" data-filter="maturity" value="raw-only" /> Spotlight raw</label>
      <button type="button" class="kbg__reset">Reset view</button>
    </fieldset>
    <p class="kbg__hint">Drag to pan · scroll to zoom · hover for detail · click a node to open it</p>
  </div>
  <div class="kbg__legend" role="group" aria-label="Layers (click to toggle)">
    {legendKeys.map((k) => (
      <button type="button" class="kbg__chip" data-filter="layer" data-layer={k} aria-pressed="true">
        <span class="kbg__dot" style={`background:${LAYER_COLORS[k]}`}></span>
        {chipLabel(k)} <small>({graph.by_layer[k]})</small>
      </button>
    ))}
  </div>
  <canvas class="kbg__canvas" width="1000" height="640" role="img"
    aria-label={`Force-directed graph of ${graph.node_count} reprocessed knowledge-base objects`}></canvas>
  <div class="kbg__tooltip" hidden></div>
  <script type="application/json" set:html={JSON.stringify(graph)} data-kbg-data></script>
</div>

<style>
  .kbg { position: relative; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--paper-2); overflow: hidden; }
  .kbg__controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--line); font-family: var(--font-ui); font-size: .85rem; }
  .kbg__filters { border: 0; margin: 0; padding: 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .kbg__filters label { display: inline-flex; align-items: center; gap: 5px; color: var(--ink-soft); cursor: pointer; }
  .kbg__sep { width: 1px; height: 16px; background: var(--line-strong); }
  .kbg__reset { font: inherit; color: var(--ink-soft); background: var(--paper); border: 1px solid var(--line-strong); border-radius: 6px; padding: 2px 10px; cursor: pointer; }
  .kbg__reset:hover { color: var(--moss); border-color: var(--moss); }
  .kbg__hint { margin: 0; color: var(--ink-faint); font-size: .78rem; }
  .kbg__legend { display: flex; flex-wrap: wrap; gap: 6px 8px; padding: 8px 14px; border-bottom: 1px solid var(--line); }
  .kbg__chip { display: inline-flex; align-items: center; gap: 5px; font: inherit; font-family: var(--font-ui); font-size: .76rem; color: var(--ink-soft); background: var(--paper); border: 1px solid var(--line-strong); border-radius: 999px; padding: 2px 9px; cursor: pointer; transition: opacity .15s; }
  .kbg__chip[aria-pressed="false"] { opacity: .38; text-decoration: line-through; }
  .kbg__chip small { color: var(--ink-faint); }
  .kbg__dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .kbg__canvas { display: block; width: 100%; height: min(70vh, 640px); touch-action: none; cursor: grab; background: var(--paper); }
  .kbg__canvas:active { cursor: grabbing; }
  .kbg__tooltip { position: absolute; pointer-events: none; z-index: 5; max-width: 260px; padding: 8px 10px; border-radius: 8px; background: var(--ink); color: var(--paper); font-family: var(--font-ui); font-size: .8rem; line-height: 1.35; box-shadow: var(--shadow); }
  .kbg__tooltip b { font-weight: 600; }
  .kbg__tooltip small { opacity: .8; }
</style>

<script>
  // Client island. Runs once per graph container on the page.
  const LAYER_COLORS = {
    1: '#6b7280', 2: '#3f7d5a', 3: '#2f6f6f', 4: '#8a6d3b', 5: '#9c5a3c',
    6: '#7d5a9c', 7: '#3f6d9c', 8: '#4a7d3f', 9: '#9c3f6d', 10: '#5a5a5a',
    unmapped: '#b0b0b0',
  };
  const colorFor = (layer) => LAYER_COLORS[layer ?? 'unmapped'] ?? LAYER_COLORS.unmapped;

  for (const root of document.querySelectorAll('.kbg')) {
    const canvas = root.querySelector('.kbg__canvas');
    const tip = root.querySelector('.kbg__tooltip');
    const dataEl = root.querySelector('[data-kbg-data]');
    if (!canvas || !dataEl) continue;
    const base = root.getAttribute('data-base') || '/';
    const graph = JSON.parse(dataEl.textContent);
    const nodes = graph.nodes;
    const byKey = new Map(nodes.map((n) => [n.key, n]));
    const edges = graph.edges.map((e) => ({ a: byKey.get(e.source), b: byKey.get(e.target) })).filter((e) => e.a && e.b);
    const ctx = canvas.getContext('2d');

    // fit baked layout into view
    const pad = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) { minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x); maxY = Math.max(maxY, n.y); }
    const spanX = Math.max(1, maxX - minX), spanY = Math.max(1, maxY - minY);

    const view = { scale: 1, tx: 0, ty: 0 };
    const allLayers = new Set(nodes.map((n) => String(n.layer ?? 'unmapped')));
    const filters = { corpus: new Set(['articles', 'handoff']), layers: new Set(allLayers), rawOnly: false };
    let hover = null;

    function fit() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const s = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
      view.scale = s;
      view.tx = (w - spanX * s) / 2 - minX * s;
      view.ty = (h - spanY * s) / 2 - minY * s;
    }
    const toScreen = (n) => ({ x: n.x * view.scale + view.tx, y: n.y * view.scale + view.ty });
    const layerKey = (n) => String(n.layer ?? 'unmapped');
    const visible = (n) => filters.corpus.has(n.corpus) && filters.layers.has(layerKey(n)) && (!filters.rawOnly || n.maturity === 'raw');
    const radius = (n) => Math.max(2.2, Math.min(9, 2 + Math.sqrt(n.degree)));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      // edges
      ctx.lineWidth = 0.6;
      for (const e of edges) {
        if (!visible(e.a) || !visible(e.b)) continue;
        const p = toScreen(e.a), q = toScreen(e.b);
        ctx.strokeStyle = 'rgba(120,120,120,0.18)';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      // nodes
      for (const n of nodes) {
        const dim = !visible(n);
        const p = toScreen(n);
        const r = radius(n) * (hover === n ? 1.6 : 1);
        ctx.globalAlpha = dim ? 0.08 : 1;
        ctx.fillStyle = colorFor(n.layer);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        // hover halo — a ring in the node's own layer color (theme-safe in light + dark)
        if (hover === n && !dim) {
          ctx.lineWidth = 2; ctx.strokeStyle = colorFor(n.layer); ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
      ctx.globalAlpha = 1;
    }

    function pick(sx, sy) {
      let best = null, bestD = 12 * 12;
      for (const n of nodes) {
        if (!visible(n)) continue;
        const p = toScreen(n);
        const d = (p.x - sx) ** 2 + (p.y - sy) ** 2;
        if (d < bestD) { bestD = d; best = n; }
      }
      return best;
    }

    // interaction
    let dragging = false, lastX = 0, lastY = 0, moved = 0;
    canvas.addEventListener('pointerdown', (e) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointerup', (e) => {
      dragging = false;
      if (moved < 5) { // treat as click
        const rect = canvas.getBoundingClientRect();
        const n = pick(e.clientX - rect.left, e.clientY - rect.top);
        if (n) location.href = base + `kb/${n.corpus}/${n.type}/${n.id}/`.replace(/^\//, '');
      }
    });
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      if (dragging) {
        moved += Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
        view.tx += e.clientX - lastX; view.ty += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        tip.hidden = true; draw(); return;
      }
      const n = pick(sx, sy);
      if (n !== hover) { hover = n; draw(); }
      if (n) {
        tip.hidden = false;
        tip.innerHTML = `<b>${n.title.replace(/</g, '&lt;')}</b><br><small>${n.type} · ${n.corpus} · ${n.maturity}${n.layer ? ' · layer ' + n.layer : ''}</small>`;
        tip.style.left = Math.min(sx + 14, canvas.clientWidth - 260) + 'px';
        tip.style.top = (sy + 14) + 'px';
      } else { tip.hidden = true; }
    });
    canvas.addEventListener('pointerleave', () => { hover = null; tip.hidden = true; draw(); });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      const f = Math.exp(-e.deltaY * 0.001);
      view.tx = sx - (sx - view.tx) * f; view.ty = sy - (sy - view.ty) * f;
      view.scale *= f; draw();
    }, { passive: false });

    root.querySelectorAll('[data-filter="corpus"]').forEach((cb) => cb.addEventListener('change', () => {
      cb.checked ? filters.corpus.add(cb.value) : filters.corpus.delete(cb.value); draw();
    }));
    root.querySelectorAll('[data-filter="maturity"]').forEach((cb) => cb.addEventListener('change', () => { filters.rawOnly = cb.checked; draw(); }));
    root.querySelectorAll('[data-filter="layer"]').forEach((btn) => btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-layer');
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      on ? filters.layers.add(key) : filters.layers.delete(key);
      draw();
    }));
    root.querySelector('.kbg__reset')?.addEventListener('click', () => { fit(); draw(); });

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    fit(); resize();
  }
</script>
```

- [ ] **Step 2: Typecheck-free sanity** (no test harness for `.astro`; the build in Task 4 is the gate). Confirm the file has balanced `<script>`/`<style>` tags and the client `<script>` is a plain (bundled) module, not `is:inline`.

- [ ] **Step 3: Commit**

```bash
git add src/components/KbGraph.astro
git commit -m "feat(kb-graph): canvas island — pan/zoom/hover/click/filter over the baked layout"
```

---

### Task 4: The `/kb/graph/` route

**Files:**
- Create: `src/pages/kb/graph.astro`

- [ ] **Step 1: Write the page**

```astro
---
// The interactive graph view of the reprocessed KB. Everything here is raw /
// under review — the graph is a lens on the dev review surface, not published.
import Page from "../../layouts/Page.astro";
import KbGraph from "../../components/KbGraph.astro";
import graph from "../../data/kb-graph.json";

const base = import.meta.env.BASE_URL;
const withBase = (p) => base + String(p).replace(/^\//, "");
// The layer legend + filter live inside <KbGraph> (they are the same chips).
---

<Page
  title="Reprocessed KB — graph · Regen Web3 Toolkit (dev)"
  description="Interactive force-directed graph of the framework-reprocessed knowledge base — raw, under review, dev preview only."
>
  <section class="in-hero">
    <div class="wrap in-hero__inner">
      <p class="eyebrow">Reprocessed content · dev preview · <strong>raw, under review</strong></p>
      <h1 class="in-hero__title">The knowledge base as a graph.</h1>
      <p class="in-hero__lede">
        {graph.node_count} typed objects, {graph.edge_count} relationship links between them —
        colored by layer of the master architecture. Nothing here is reviewed or published; this is
        the review surface. Browse the same content as lists on the
        <a href={withBase("/kb/")}>KB home</a>.
      </p>
    </div>
  </section>

  <section class="in-reg">
    <div class="wrap">
      <KbGraph graph={graph} base={base} />

      <noscript>
        <p class="kbg-noscript">
          The interactive graph needs JavaScript. You can still browse every object as lists on the
          <a href={withBase("/kb/")}>KB home</a> (by layer and by type).
        </p>
      </noscript>

      <p class="in-reg__caption">
        Generated at build from <code>src/data/kb-graph.json</code> (a baked force layout over
        <code>src/data/kb-content.json</code>). Edges are relationship-field references only; free-text
        matches are excluded. Layout is deterministic — no data leaves your browser.
      </p>
    </div>
  </section>
</Page>

<style>
  .kbg-noscript { margin-top: 1rem; color: var(--ink-soft); }
</style>
```

- [ ] **Step 2: Build + verify the page renders**

Run: `npm run build 2>&1 | tail -6` — build succeeds (prebuild regenerates both snapshots).
Run: `test -f dist/kb/graph/index.html && grep -o "as a graph" dist/kb/graph/index.html | head -1` — Expected: file exists + a match.
Run: `grep -c 'data-kbg-data' dist/kb/graph/index.html` — Expected: `1` (graph JSON embedded).

- [ ] **Step 3: Commit**

```bash
git add src/pages/kb/graph.astro
git commit -m "feat(kb-graph): /kb/graph/ route — legend, honesty banner, no-JS fallback"
```

---

### Task 5: Full verification — both base modes + interaction

- [ ] **Step 1: Test + build sweep**

```bash
node --test scripts/gen-kb-graph.test.mjs scripts/gen-kb-content.test.mjs scripts/generate-kb-viz.test.mjs   # all pass
npm run build                                    # Vercel-mode (base '/') green
GITHUB_PAGES=true npm run build                  # Pages-mode (base '/regen-toolkit/') green
```

- [ ] **Step 2: Base-path spot-check on the Pages build** (the classic foot-gun — the click-nav uses `base` at runtime, but check the page's own links):

```bash
grep -o 'href="/regen-toolkit/kb/[^"]*"' dist/kb/graph/index.html | head -3   # base-prefixed links present
grep -c 'href="/kb/' dist/kb/graph/index.html                                  # Expected: 0 un-prefixed
```

- [ ] **Step 3: Eyeball it** — `npm run preview`, open `/kb/graph/`:
  - graph renders (nodes colored by layer, edges faint);
  - drag pans, scroll zooms, hover shows a tooltip, "Reset view" refits;
  - toggling Articles/Handoff dims the right nodes; "Spotlight raw" dims non-raw;
  - clicking a node opens its `/kb/<corpus>/<type>/<id>/` object page (built by the parallel session);
  - the "raw, under review" banner is visible.

- [ ] **Step 4: Commit anything the sweep fixed**, message `fix(kb-graph): <what>`.

---

### Task 6: Land it on `regen-toolkit-os` + discoverability cross-links

> **Coordination gate:** this branch (`kb-graph-dev`) only *adds* files, except a one-line append to `package.json`'s `prebuild`. Merge back to `regen-toolkit-os` once the parallel session's content-page work has settled, to avoid a working-tree race. Confirm with the operator before merging/pushing. **Never push `origin` or touch `main`.**

- [ ] **Step 1: Confirm the parallel session has paused/landed its content-page tasks** (operator confirms). Then from the main checkout:

```bash
cd "/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit"
git status --porcelain          # expect a clean-ish tree (their commits landed)
git log --oneline -5
```

- [ ] **Step 2: Merge the graph branch** (no rebase of shared history; a merge preserves both lines):

```bash
git merge --no-ff kb-graph-dev -m "merge(kb-graph): interactive /kb/graph/ view into the dev instance"
```

Expected: clean merge, or at most a one-line conflict on the `prebuild` chain in `package.json` — resolve by keeping BOTH content and graph steps in order (`... && gen-kb-content.mjs && gen-kb-graph.mjs`).

- [ ] **Step 3: Add discoverability cross-links** (now safe — same tree). Two minimal edits: (a) in `src/pages/kb/index.astro`, add a link to `/kb/graph/` near the hero (e.g. in the `in-hero__meta` row: `<a href={withBase("/kb/graph/")}>Graph view →</a>`); (b) in `astro.config.mjs`, add `{ label: 'Graph view', link: '/kb/graph/' }` to the "Reprocessed content (dev · raw, under review)" sidebar group created by the parallel session's Task 6. If that sidebar group doesn't exist yet (parallel Task 6 not landed), skip (b) and record it as a follow-up.

```bash
npm run build && GITHUB_PAGES=true npm run build   # both green after merge + cross-links
git add src/pages/kb/index.astro astro.config.mjs
git commit -m "feat(kb-graph): cross-link the graph view from the KB home + sidebar"
```

- [ ] **Step 4: Deploy (operator-confirmed) + report.** Push the branch to `fork` to deploy to Pages (this is the parallel session's Task 8 too — coordinate so it happens once):

```bash
git push fork regen-toolkit-os
```

Then verify live and report: `https://luizfernandosg.github.io/regen-toolkit/kb/graph/` renders; report node/edge counts + what's interactive.

- [ ] **Step 5: Clean up the worktree** (REQUIRED SUB-SKILL: superpowers:finishing-a-development-branch) once merged:

```bash
git worktree remove "$HOME/.config/superpowers/worktrees/regen-toolkit/kb-graph"
```

---

## Deferred (named, not built — YAGNI for the review gate)

- **Edge bundling / clustering by layer** — at 868 nodes the plain layout is legible enough; hierarchical bundling is a later polish.
- **Search-to-highlight in the graph** — filters cover the review need; a search box is a fast-follow.
- **Re-simulate button** (live physics in the browser) — the baked layout is intentional (crisp, deterministic); not needed.
- **Reverse links from object pages into the graph** (deep-link a node) — nice-to-have; object → graph anchor is a later pass.

## Success criteria (from the design spec §6.1)

A live `/kb/graph/` on the fork: an interactive force-directed graph of all 868 objects, colored by layer, with pan/zoom/hover/click-to-open and corpus/maturity filters; honesty banner + legend; no-JS fallback; both base modes build green; deployed from the fork (not prod); `main`/`origin` untouched.
```
