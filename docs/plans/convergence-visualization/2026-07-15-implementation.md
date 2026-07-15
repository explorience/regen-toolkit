# Convergence Visualization Pack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the framework/convergence visible on three surfaces — a `/convergence` Astro page with a schema-map graph, Obsidian companion notes for the KB, and a machine canvas — all derived from the real KB by one script.

**Architecture:** One derivation script (`scripts/generate-kb-viz.mjs`, plain Node + js-yaml, TDD'd with `node --test`) reads both corpora and emits `src/data/kb-schema-graph.json` + `kb-graph/` Obsidian notes. A plain (non-Starlight) Astro page renders the pipeline + schema map as inline SVG with build-time data — no client JS, no new dependencies. The canvas is hand-authored JSONCanvas.

**Tech Stack:** Node ≥22 (`node --test`), js-yaml (already a root dependency), Astro 6 (`Page.astro` layout pattern), JSONCanvas.

**Spec:** `docs/plans/convergence-visualization/2026-07-15-design.md` (approved 2026-07-15).

**Repo facts the implementer needs:**
- `data/kb/<type>.yaml` = articles corpus: `entries: { <id>: {…fields} }`; files starting with `_` are manifests, not objects. Type = filename without `.yaml`.
- `kb-handoff/objects/<type>/<id>.yaml` = handoff corpus: one object per file, fields at top level. **May be absent** (it is dev-branch-only) — every consumer must tolerate that.
- Root test precedent: `scripts/process-content.test.mjs`, run via `node --test scripts/<file>.test.mjs`.
- Page precedent: `src/pages/framework.astro` (uses `src/layouts/Page.astro`, `import.meta.env.BASE_URL` + `withBase`).
- Canvas precedent: `docs/canvases/self-ingestion-diff.canvas` (JSONCanvas, group lanes with `color` "1"–"6").
- **Vault safety:** the script must never delete a `kb-graph/` it didn't generate (marker check below). Never `git add -A`; add exact paths.

**Validated palette (dataviz six-checks, run 2026-07-15 against the real surfaces `#F4EEE0` light / `#10160F` dark — both PASS).** Fixed type order; hues assigned by this order and never cycled or reassigned:

| # | type | light | dark |
|---|---|---|---|
| 1 | resource | `#2E7D3E` | `#3FA05F` |
| 2 | source-system | `#3D6BC2` | `#5F85DD` |
| 3 | concept-lineage | `#C05A2A` | `#D86C33` |
| 4 | claim-evidence | `#008C7E` | `#2FA89A` |
| 5 | encyclopedia-entry | `#B43A6A` | `#D66590` |
| 6 | option-entry | `#6E7C1B` | `#8A9C2E` |
| 7 | public-use-boundary | `#7B4FB0` | `#9A73DA` |
| 8 | implementation-record | `#9A6E00` | `#B58D22` |
| 9 | signal | `#A23F9C` | `#C965C0` |
| 10 | track | `#8B4513` | `#B5713A` |

CVD separation is in the 8–12 floor band → **legal only with secondary encoding**: every node carries its text label, and a table view ships below the chart. Do not remove either.

---

### Task 1: Derivation script core — loaders, graph builder, edge derivation (TDD)

**Files:**
- Create: `scripts/generate-kb-viz.mjs`
- Test: `scripts/generate-kb-viz.test.mjs`

- [ ] **Step 1: Write the failing tests**

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/generate-kb-viz.test.mjs`
Expected: FAIL — `Cannot find module '…/scripts/generate-kb-viz.mjs'`

- [ ] **Step 3: Write the implementation**

```js
// scripts/generate-kb-viz.mjs
// Derive the visualization products from the knowledge base:
//   a) src/data/kb-schema-graph.json — type-level schema map (nodes + observed edges)
//   b) kb-graph/                     — Obsidian companion notes (type hubs + one stub per object)
// Both corpora are read: data/kb/ (articles) and kb-handoff/objects/ (handoff; tolerated absent —
// on main the handoff corpus doesn't exist and every output is single-corpus automatically).
// Derived + rebuildable; idempotent: same inputs → byte-identical outputs (no timestamps).
// Run: node scripts/generate-kb-viz.mjs   (or npm run generate:kb-viz)

import {
  readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED_MARK = 'generated by scripts/generate-kb-viz.mjs';

// Fixed categorical order — the page's palette is assigned by this order (dataviz
// rule: hues in fixed order, never cycled). Unknown types sort after, alphabetically.
export const TYPE_ORDER = [
  'resource', 'source-system', 'concept-lineage', 'claim-evidence',
  'encyclopedia-entry', 'option-entry', 'public-use-boundary',
  'implementation-record', 'signal', 'track',
];
const typeRank = (t) => {
  const i = TYPE_ORDER.indexOf(t);
  return i === -1 ? TYPE_ORDER.length : i;
};

export function loadArticlesCorpus(kbDir) {
  if (!existsSync(kbDir)) return [];
  const out = [];
  for (const f of readdirSync(kbDir).sort()) {
    if (!f.endsWith('.yaml') || f.startsWith('_')) continue;
    const type = f.replace(/\.yaml$/, '');
    const doc = yaml.load(readFileSync(join(kbDir, f), 'utf8'));
    for (const [id, data] of Object.entries(doc?.entries ?? {})) {
      out.push({ id, type, corpus: 'articles', data: data ?? {} });
    }
  }
  return out;
}

export function loadHandoffCorpus(objDir) {
  if (!existsSync(objDir)) return [];
  const out = [];
  const typeDirs = readdirSync(objDir, { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name).sort();
  for (const type of typeDirs) {
    for (const f of readdirSync(join(objDir, type)).sort()) {
      if (!f.endsWith('.yaml')) continue;
      const id = f.replace(/\.yaml$/, '');
      const data = yaml.load(readFileSync(join(objDir, type, f), 'utf8'));
      out.push({ id, type, corpus: 'handoff', data: data ?? {} });
    }
  }
  return out;
}

// Depth-first over every string value, remembering the nearest field name
// (arrays inherit the array's field name).
function walkValues(node, field, visit) {
  if (node == null) return;
  if (typeof node === 'string') { if (field) visit(field, node); return; }
  if (Array.isArray(node)) { for (const v of node) walkValues(v, field, visit); return; }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walkValues(v, k, visit);
  }
}

// Type→type edges from observed references: a string value that exactly equals
// another object's id, labeled by the field it sat in. Sparse is honest.
export function deriveEdges(objects) {
  const idToType = new Map(objects.map((o) => [o.id, o.type]));
  const tally = new Map();
  for (const o of objects) {
    walkValues(o.data, null, (field, value) => {
      if (value === o.id || !idToType.has(value)) return;
      const key = `${o.type}|${idToType.get(value)}|${field}`;
      tally.set(key, (tally.get(key) ?? 0) + 1);
    });
  }
  return [...tally.entries()]
    .map(([k, count]) => {
      const [from, to, label] = k.split('|');
      return { from, to, label, count };
    })
    .sort((a, b) =>
      typeRank(a.from) - typeRank(b.from) || a.from.localeCompare(b.from) ||
      typeRank(a.to) - typeRank(b.to) || a.to.localeCompare(b.to) ||
      a.label.localeCompare(b.label));
}

export function buildSchemaGraph(objects) {
  const byType = new Map();
  for (const o of objects) {
    if (!byType.has(o.type)) {
      byType.set(o.type, {
        type: o.type, total: 0, raw: 0, reviewed: 0,
        byCorpus: { articles: 0, handoff: 0 },
      });
    }
    const n = byType.get(o.type);
    n.total += 1;
    const m = o.data?.maturity ?? 'raw';
    if (m === 'raw') n.raw += 1;
    if (m === 'reviewed') n.reviewed += 1;
    n.byCorpus[o.corpus] += 1;
  }
  const nodes = [...byType.values()].sort((a, b) =>
    typeRank(a.type) - typeRank(b.type) || a.type.localeCompare(b.type));
  return { nodes, edges: deriveEdges(objects) };
}

export function pickDescription(data) {
  for (const k of ['short_description', 'description', 'summary', 'what_it_curates', 'notes']) {
    if (typeof data?.[k] === 'string' && data[k].trim()) return data[k].trim();
  }
  return '';
}

const safeName = (s) => String(s).replace(/[/\\:#|?*"<>]/g, '-');

export function buildStub(o, idToType) {
  const title = (typeof o.data?.title === 'string' && o.data.title.trim()) || o.id;
  const related = new Set();
  walkValues(o.data, null, (_field, value) => {
    if (value !== o.id && idToType.has(value)) related.add(value);
  });
  const rel = [...related].sort();
  const src = o.corpus === 'articles'
    ? `data/kb/${o.type}.yaml#${o.id}`
    : `kb-handoff/objects/${o.type}/${o.id}.yaml`;
  const fm = yaml.dump({
    kb_type: o.type,
    maturity: o.data?.maturity ?? 'raw',
    corpus: o.corpus,
    ai_assisted: o.data?.ai_assisted ?? false,
  }, { lineWidth: -1 }).trimEnd();
  const desc = pickDescription(o.data);
  return [
    '---', fm, '---', '',
    `# ${title}`, '',
    ...(desc ? [desc, ''] : []),
    `Hub: [[kb-hub-${o.type}]]`,
    ...(rel.length ? ['', `Related: ${rel.map((r) => `[[${safeName(r)}]]`).join(' · ')}`] : []),
    '',
    `Source: \`${src}\``, '',
  ].join('\n');
}

export function main() {
  const objects = [
    ...loadArticlesCorpus(join(ROOT, 'data/kb')),
    ...loadHandoffCorpus(join(ROOT, 'kb-handoff/objects')),
  ];
  const { nodes, edges } = buildSchemaGraph(objects);
  const corpora = {
    articles: objects.filter((o) => o.corpus === 'articles').length,
    handoff: objects.filter((o) => o.corpus === 'handoff').length,
  };

  // a) The schema-map JSON for the site.
  writeFileSync(join(ROOT, 'src/data/kb-schema-graph.json'), JSON.stringify({
    generated_from: 'derived — rebuildable via npm run generate:kb-viz',
    corpora, nodes, edges,
  }, null, 2) + '\n');

  // b) kb-graph/ Obsidian companion notes.
  // Vault safety: refuse to clear a kb-graph/ this script didn't generate.
  const kbGraph = join(ROOT, 'kb-graph');
  const readmePath = join(kbGraph, 'README.md');
  if (existsSync(kbGraph)) {
    if (!existsSync(readmePath) || !readFileSync(readmePath, 'utf8').includes(GENERATED_MARK)) {
      throw new Error('kb-graph/ exists but has no generated marker — refusing to overwrite. Move it aside first.');
    }
    rmSync(kbGraph, { recursive: true });
  }
  mkdirSync(join(kbGraph, 'hubs'), { recursive: true });

  const idToType = new Map(objects.map((o) => [o.id, o.type]));
  const byType = new Map(nodes.map((n) => [n.type, []]));
  for (const o of objects) byType.get(o.type).push(o);

  for (const [type, members] of byType) {
    mkdirSync(join(kbGraph, type), { recursive: true });
    members.sort((a, b) => a.id.localeCompare(b.id));
    for (const o of members) {
      writeFileSync(join(kbGraph, type, `${safeName(o.id)}.md`), buildStub(o, idToType));
    }
    const n = nodes.find((x) => x.type === type);
    writeFileSync(join(kbGraph, 'hubs', `kb-hub-${type}.md`), [
      '---', `kb_hub: ${type}`, '---', '',
      `# ${type} — ${n.total} objects`, '',
      `${n.raw} raw · ${n.reviewed} reviewed · articles ${n.byCorpus.articles} / handoff ${n.byCorpus.handoff}`, '',
      `Up: [[kb-commons]]`, '',
      ...members.map((o) => {
        const title = (typeof o.data?.title === 'string' && o.data.title.trim()) || o.id;
        return `- [[${safeName(o.id)}|${title.replace(/[|[\]]/g, ' ').trim()}]]`;
      }),
      '',
    ].join('\n'));
  }

  writeFileSync(join(kbGraph, 'kb-commons.md'), [
    '---', 'kb_hub: root', '---', '',
    '# Knowledge Commons', '',
    `${objects.length} objects · ${nodes.length} types · corpora: articles ${corpora.articles} / handoff ${corpora.handoff}`, '',
    ...nodes.map((n) => `- [[kb-hub-${n.type}|${n.type}]] — ${n.total} (${n.raw} raw · ${n.reviewed} reviewed)`),
    '',
  ].join('\n'));

  writeFileSync(readmePath, [
    `# kb-graph/ — Obsidian companion notes (${GENERATED_MARK})`, '',
    'Derived, rebuildable renderings of the knowledge base for Obsidian graph view.',
    'Do not edit by hand — regenerate with `npm run generate:kb-viz`.',
    'Entry point: [[kb-commons]]. One stub per KB object; hubs cluster the graph by type.', '',
  ].join('\n'));

  console.log(`kb-viz: ${nodes.length} types · ${objects.length} objects · ${edges.length} edges → src/data/kb-schema-graph.json + kb-graph/`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/generate-kb-viz.test.mjs`
Expected: PASS — 9 tests, 0 failures

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-kb-viz.mjs scripts/generate-kb-viz.test.mjs
git commit -m "viz: kb-viz derivation core — corpus loaders, schema graph, observed edges (TDD)"
```

---

### Task 2: Run the generator on the real KB + npm wiring

**Files:**
- Modify: `package.json` (two script lines)
- Generated: `src/data/kb-schema-graph.json`, `kb-graph/` (committed — derived-and-rebuildable convention)

- [ ] **Step 1: Add the npm scripts**

In `package.json`, add to `"scripts"`:

```json
"generate:kb-viz": "node scripts/generate-kb-viz.mjs",
```

and change the existing two lines:

```json
"prebuild": "node scripts/gen-framework-manifest.mjs && node scripts/gen-instance-stats.mjs && node scripts/generate-kb-viz.mjs",
"knowledge": "npm run compile:knowledge && npm run lint:knowledge && npm run generate:kb-viz",
```

- [ ] **Step 2: Run it and sanity-check the counts**

Run: `npm run generate:kb-viz`
Expected output line: `kb-viz: 10 types · 868 objects · <N> edges → …` — the object count MUST equal 722 + 146 = 868. Cross-check:

```bash
node packages/toolkit-framework/src/cli.mjs kb index --adapter repo-data --target . 2>/dev/null | tail -6
node packages/toolkit-framework/src/cli.mjs kb index --adapter kb-folder --target kb-handoff 2>/dev/null | tail -6
node -e "const g=require('./src/data/kb-schema-graph.json'); console.log(g.corpora, g.nodes.reduce((s,n)=>s+n.total,0))"
```
Expected: `{ articles: 722, handoff: 146 } 868` (matching the two `kb index` totals).

- [ ] **Step 3: Verify idempotency**

```bash
npm run generate:kb-viz && git add -N kb-graph src/data/kb-schema-graph.json && git diff --stat kb-graph src/data/kb-schema-graph.json | tail -1
npm run generate:kb-viz && git diff --stat kb-graph src/data/kb-schema-graph.json | tail -1
```
Expected: the two `git diff --stat` outputs are identical (second run changed nothing).

- [ ] **Step 4: Verify the main-branch simulation (no handoff corpus)**

```bash
mv kb-handoff /tmp/kb-handoff-parked
npm run generate:kb-viz
node -e "const g=require('./src/data/kb-schema-graph.json'); console.log(g.corpora)"
mv /tmp/kb-handoff-parked kb-handoff
npm run generate:kb-viz
```
Expected: middle output `{ articles: 722, handoff: 0 }`, no errors; last run restores the two-corpus state.

- [ ] **Step 5: Commit**

```bash
git add package.json src/data/kb-schema-graph.json kb-graph
git commit -m "viz: generate kb-schema-graph.json + kb-graph/ Obsidian notes from both corpora"
```

---

### Task 3: The `/convergence` page

**Files:**
- Create: `src/pages/convergence.astro`
- Modify: `src/pages/framework.astro` (one link near the top of the body)

- [ ] **Step 1: Write the page**

```astro
---
// The Convergence — web rendering of docs/CONVERGENCE.md.
// Plain page (non-Starlight, Page.astro layout) so it can never break the docs build.
// All data is build-time: src/data/kb-schema-graph.json (npm run generate:kb-viz).
// On main, kb-handoff/ doesn't exist → the graph is single-corpus automatically.
import Page from "../layouts/Page.astro";
import graph from "../data/kb-schema-graph.json";

const base = import.meta.env.BASE_URL;
const withBase = (p) => base + String(p).replace(/^\//, "");

// Validated categorical palette (dataviz six-checks vs #F4EEE0 / #10160F, 2026-07-15).
// Fixed order = TYPE_ORDER in scripts/generate-kb-viz.mjs. Identity is never color-alone:
// every node is direct-labeled and a table view follows the chart.
const TYPE_COLORS = {
  "resource":              ["#2E7D3E", "#3FA05F"],
  "source-system":         ["#3D6BC2", "#5F85DD"],
  "concept-lineage":       ["#C05A2A", "#D86C33"],
  "claim-evidence":        ["#008C7E", "#2FA89A"],
  "encyclopedia-entry":    ["#B43A6A", "#D66590"],
  "option-entry":          ["#6E7C1B", "#8A9C2E"],
  "public-use-boundary":   ["#7B4FB0", "#9A73DA"],
  "implementation-record": ["#9A6E00", "#B58D22"],
  "signal":                ["#A23F9C", "#C965C0"],
  "track":                 ["#8B4513", "#B5713A"],
};
const FALLBACK = ["#667080", "#9AA4B5"]; // any type outside the fixed list
const cvar = (t) => `var(--kb-${t}, ${ (TYPE_COLORS[t] ?? FALLBACK)[0] })`;
const cssVars = (i) => Object.entries(TYPE_COLORS)
  .map(([t, pair]) => `--kb-${t}: ${pair[i]};`).join(" ");

// Circular layout, precomputed at build. No client JS, no dependencies.
const W = 920, H = 600, CX = W / 2, CY = H / 2, R = 215;
const N = Math.max(1, graph.nodes.length);
const pos = Object.fromEntries(graph.nodes.map((n, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  return [n.type, { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }];
}));
const rOf = (n) => Math.max(9, Math.min(30, 4 + Math.sqrt(n.total) * 1.7));
const drawEdges = graph.edges.filter((e) => e.from !== e.to && pos[e.from] && pos[e.to]);
const maxEdge = Math.max(1, ...drawEdges.map((e) => e.count));
const labeledEdges = [...drawEdges].sort((a, b) => b.count - a.count).slice(0, 5);
const anchorOf = (t) => pos[t].x < CX - 12 ? "end" : pos[t].x > CX + 12 ? "start" : "middle";
const dxOf = (t, n) => anchorOf(t) === "end" ? -(rOf(n) + 8) : anchorOf(t) === "start" ? rOf(n) + 8 : 0;
const dyOf = (t, n) => anchorOf(t) === "middle" ? (pos[t].y < CY ? -(rOf(n) + 10) : rOf(n) + 20) : 5;

const totals = graph.nodes.reduce((s, n) => s + n.total, 0);
const rawTotal = graph.nodes.reduce((s, n) => s + n.raw, 0);
const reviewedTotal = graph.nodes.reduce((s, n) => s + n.reviewed, 0);
const hasHandoff = (graph.corpora?.handoff ?? 0) > 0;

const pipeline = [
  ["Sources", hasHandoff
    ? `Two corpora so far: the toolkit's own ${graph.corpora.articles}-object article corpus, and ${graph.corpora.handoff} objects from Matty's Canonical_DB slice.`
    : `The toolkit's own content — ${graph.corpora.articles} objects derived from the article corpus.`],
  ["Ingest", "The machine slices each source into work orders; agents draft typed candidate objects — always raw, always marked AI-assisted, origin attached."],
  ["Accept gate", "Every candidate is validated against the schemas and the kernel. Duplicates are guarded (B5); sensitive rows get a public-use boundary. Nothing enters unchecked."],
  ["The human gate", `review-promote: a named human moves objects past raw — honestly, never in bulk. ${rawTotal} raw · ${reviewedTotal} reviewed today.`],
  ["The commons", "Typed, provenance-tracked, reviewed objects — the shared substrate."],
  ["The render layer", "The public site (encyclopedia, tracks, journeys, explorers) renders what clears the gate."],
];
---
<Page title="The Convergence — Regen Web3 Toolkit"
      description="Three independent builds — the spec, the machine, the site — converging into one knowledge-commons loop.">
  <main class="wrap conv">
    <header class="conv-head">
      <p class="kicker">The Convergence</p>
      <h1>One system, three builds</h1>
      <p class="lede">
        A specification (the master doc's Database_Spec), a public knowledge site, and a tested
        framework were built largely independently — and converge on the same system. The spec is
        now a running machine; the site becomes the public rendering of a reviewed commons.
      </p>
    </header>

    <section class="conv-builds">
      <div class="build"><h3>The spec</h3><p>Production object model, migration zones (raw→canonical→reviewed→public), 8 status dimensions, preserve→normalize→review→publish.</p></div>
      <div class="build"><h3>The machine</h3><p>capture → accept gate → review-promote → store. Typed schemas, maturity ladder, idempotent ingestion. 110/110 tests. <a href={withBase("/framework/")}>The framework →</a></p></div>
      <div class="build"><h3>The site</h3><p>Encyclopedia, learning journeys, knowledge explorers — the render layer for whatever clears the human gate.</p></div>
    </section>

    <section>
      <h2>The loop</h2>
      <ol class="conv-pipeline">
        {pipeline.map(([name, blurb]) => (
          <li><strong>{name}</strong><span>{blurb}</span></li>
        ))}
      </ol>
    </section>

    <section>
      <h2>The commons, by type</h2>
      <p class="conv-sub">
        {totals} objects · {graph.nodes.length} types
        {hasHandoff ? ` · two corpora (articles ${graph.corpora.articles} / handoff ${graph.corpora.handoff})` : ""} ·
        edges are references observed in the objects themselves — sparse until relationship
        records land (the T4 gap, named honestly).
      </p>

      <figure class="conv-map">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
             aria-label={`Schema map: ${graph.nodes.length} object types with review-state counts`}>
          {drawEdges.map((e) => (
            <line x1={pos[e.from].x} y1={pos[e.from].y} x2={pos[e.to].x} y2={pos[e.to].y}
                  class="conv-edge" stroke-width={1 + 2.5 * (e.count / maxEdge)}>
              <title>{`${e.from} —${e.label}→ ${e.to} (${e.count})`}</title>
            </line>
          ))}
          {labeledEdges.map((e) => (
            <text x={(pos[e.from].x + pos[e.to].x) / 2} y={(pos[e.from].y + pos[e.to].y) / 2 - 4}
                  class="conv-edge-label" text-anchor="middle">{e.label}</text>
          ))}
          {graph.nodes.map((n) => (
            <g>
              <circle cx={pos[n.type].x} cy={pos[n.type].y} r={rOf(n)}
                      fill={cvar(n.type)} class="conv-node">
                <title>{`${n.type}: ${n.total} total · ${n.raw} raw · ${n.reviewed} reviewed`}</title>
              </circle>
              <text x={pos[n.type].x + dxOf(n.type, n)} y={pos[n.type].y + dyOf(n.type, n)}
                    text-anchor={anchorOf(n.type)} class="conv-label">{n.type}</text>
              <text x={pos[n.type].x + dxOf(n.type, n)} y={pos[n.type].y + dyOf(n.type, n) + 14}
                    text-anchor={anchorOf(n.type)} class="conv-count">{`${n.total} · ${n.raw} raw`}</text>
            </g>
          ))}
        </svg>
      </figure>

      <table class="conv-table">
        <thead><tr><th>type</th><th>total</th><th>raw</th><th>reviewed</th><th>articles</th><th>handoff</th></tr></thead>
        <tbody>
          {graph.nodes.map((n) => (
            <tr>
              <td><span class="chip" style={`background:${cvar(n.type)}`}></span>{n.type}</td>
              <td>{n.total}</td><td>{n.raw}</td><td>{n.reviewed}</td>
              <td>{n.byCorpus.articles}</td><td>{n.byCorpus.handoff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section>
      <h2>The evidence</h2>
      <ul class="conv-links">
        <li><a href={withBase("/self-ingestion/")}>/self-ingestion</a> — the toolkit's own articles through the machine</li>
        <li><a href={withBase("/handoff/")}>/handoff</a> — the Canonical_DB prototype slice through the machine</li>
        <li><a href="https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/reports/2026-07-15-framework-masterdoc-crosswalk.md">The §40 crosswalk</a> — framework ↔ Database_Spec, family by family</li>
        <li><a href="https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/reports/2026-07-15-definition-of-done-conformance.md">Definition-of-Done conformance</a> — 7✅/8🟡, gaps named</li>
        <li><a href="https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/CONVERGENCE.md">The full story</a> — docs/CONVERGENCE.md</li>
      </ul>
    </section>
  </main>
</Page>

<style is:global define:vars={{}}>
  :root { --kb-resource:#2E7D3E; --kb-source-system:#3D6BC2; --kb-concept-lineage:#C05A2A; --kb-claim-evidence:#008C7E; --kb-encyclopedia-entry:#B43A6A; --kb-option-entry:#6E7C1B; --kb-public-use-boundary:#7B4FB0; --kb-implementation-record:#9A6E00; --kb-signal:#A23F9C; --kb-track:#8B4513; }
  [data-theme="dark"] { --kb-resource:#3FA05F; --kb-source-system:#5F85DD; --kb-concept-lineage:#D86C33; --kb-claim-evidence:#2FA89A; --kb-encyclopedia-entry:#D66590; --kb-option-entry:#8A9C2E; --kb-public-use-boundary:#9A73DA; --kb-implementation-record:#B58D22; --kb-signal:#C965C0; --kb-track:#B5713A; }

  .conv { padding: 3rem 0 4rem; }
  .conv-head .kicker { text-transform: uppercase; letter-spacing: .08em; color: var(--moss-soft); font-weight: 600; font-size: .8rem; }
  .conv-head .lede { max-width: 46rem; color: var(--text-soft); font-size: 1.05rem; }
  .conv-builds { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 2rem 0; }
  .conv-builds .build { background: var(--bg-soft); border-radius: 10px; padding: 1rem 1.2rem; }
  .conv-builds h3 { margin: 0 0 .4rem; }
  .conv-pipeline { list-style: none; margin: 1rem 0; padding: 0; max-width: 46rem; counter-reset: step; }
  .conv-pipeline li { position: relative; padding: .55rem 0 .55rem 2.4rem; counter-increment: step; }
  .conv-pipeline li::before { content: counter(step); position: absolute; left: 0; top: .55rem; width: 1.6rem; height: 1.6rem; border-radius: 50%; background: var(--moss); color: var(--paper); font-weight: 600; font-size: .85rem; display: flex; align-items: center; justify-content: center; }
  .conv-pipeline li:not(:last-child)::after { content: ""; position: absolute; left: .78rem; top: 2.3rem; bottom: -.4rem; width: 2px; background: var(--paper-3); }
  .conv-pipeline strong { display: block; }
  .conv-pipeline span { color: var(--text-soft); font-size: .95rem; }
  .conv-sub { color: var(--text-soft); max-width: 46rem; }
  .conv-map svg { width: 100%; height: auto; }
  .conv-edge { stroke: var(--ink-faint); opacity: .45; }
  .conv-edge-label { fill: var(--ink-faint); font-size: 11px; }
  .conv-node { stroke: var(--paper); stroke-width: 2; }
  .conv-label { fill: var(--text); font-size: 13px; font-weight: 600; }
  .conv-count { fill: var(--ink-faint); font-size: 11px; }
  .conv-table { border-collapse: collapse; margin: 1rem 0 0; font-size: .92rem; }
  .conv-table th, .conv-table td { text-align: left; padding: .35rem .9rem .35rem 0; border-bottom: 1px solid var(--paper-3); }
  .conv-table .chip { display: inline-block; width: .7rem; height: .7rem; border-radius: 3px; margin-right: .5rem; }
  .conv-links li { margin: .35rem 0; }
</style>
```

Note for the implementer: if the Astro compiler complains about `define:vars={{}}` remove that attribute (it is not needed); `is:global` alone is required so `[data-theme="dark"]` selectors work.

- [ ] **Step 2: Link it from `/framework`**

In `src/pages/framework.astro`, find the first `<main>`/header section of the body (just after the page's opening heading block) and add:

```astro
<p class="conv-cta"><a href={withBase("/convergence/")}>See the convergence — spec ↔ machine ↔ site, with the live schema map →</a></p>
```

(`withBase` already exists in that file's frontmatter.)

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
ls dist/convergence/index.html
grep -o "868 objects\|722" dist/convergence/index.html | head -3
grep -c "conv-node" dist/convergence/index.html
```
Expected: build succeeds; the file exists; the object totals appear; ≥10 node marks. (Counts will differ if the KB changed — cross-check against `src/data/kb-schema-graph.json`, not this plan.)

- [ ] **Step 4: Render it and look at it** (dataviz step 7 — the validator checks color, not layout)

Run: `npm run preview` and open `/convergence/` in light AND dark mode. Check: no label collisions around the circle, edge labels legible, table aligned, nothing overflows on a narrow window.

- [ ] **Step 5: Commit**

```bash
git add src/pages/convergence.astro src/pages/framework.astro
git commit -m "viz: /convergence page — pipeline + schema map (validated palette), table view, framework link"
```

---

### Task 4: The machine canvas

**Files:**
- Create: `docs/canvases/the-machine.canvas`
- Modify: `docs/canvases/regen-knowledge-commons-toolkit-master.canvas` (append one link node)

- [ ] **Step 1: Write the canvas**

```json
{
	"nodes": [
		{ "id": "lane-sources", "type": "group", "label": "① SOURCES", "x": -1250, "y": -500, "width": 560, "height": 760, "color": "1" },
		{ "id": "lane-machine", "type": "group", "label": "② THE MACHINE (toolkit-framework · 110/110)", "x": -620, "y": -500, "width": 620, "height": 1060, "color": "4" },
		{ "id": "lane-gate", "type": "group", "label": "③ THE HUMAN GATE", "x": 80, "y": -500, "width": 540, "height": 620, "color": "3" },
		{ "id": "lane-commons", "type": "group", "label": "④ THE COMMONS → RENDER", "x": 700, "y": -500, "width": 560, "height": 900, "color": "2" },
		{ "id": "src-articles", "type": "text", "text": "**Toolkit articles**\n119 articles → 722 objects\n`data/kb/` (repo-data adapter)", "x": -1200, "y": -420, "width": 460, "height": 130 },
		{ "id": "src-handoff", "type": "text", "text": "**Matty's Canonical_DB** (July handoff)\nprototype slice: 127 rows → 146 objects\n`kb-handoff/` (kb-folder adapter)\nfull ingestion = T3b (~2,689 rows)", "x": -1200, "y": -250, "width": 460, "height": 160 },
		{ "id": "src-next", "type": "text", "text": "*Any source:* a doc, a spreadsheet,\na URL, a transcript — \"ingest this\"", "x": -1200, "y": -50, "width": 460, "height": 110 },
		{ "id": "m-ingest", "type": "text", "text": "**ingest prepare** → work orders\n(the machine slices the source)", "x": -570, "y": -420, "width": 520, "height": 110 },
		{ "id": "m-candidates", "type": "text", "text": "**Agents draft typed candidates**\nalways `raw` · always AI-flagged ·\norigin attached (provenance)", "x": -570, "y": -280, "width": 520, "height": 130 },
		{ "id": "m-gate", "type": "text", "text": "**ACCEPT GATE**\nschema + kernel validation ·\nB5 duplicate guard (caught Matty's 4 dup pairs) ·\npublic-use boundaries flagged at entry", "x": -570, "y": -120, "width": 520, "height": 160, "color": "4" },
		{ "id": "m-store", "type": "text", "text": "**Stored as `raw`** → review queue\nnothing skips review; idempotent re-runs", "x": -570, "y": 70, "width": 520, "height": 110 },
		{ "id": "m-files", "type": "file", "file": "packages/toolkit-framework/docs/GETTING-STARTED.md", "x": -570, "y": 220, "width": 520, "height": 60 },
		{ "id": "m-skills", "type": "file", "file": "packages/toolkit-framework/skills/review-promote/SKILL.md", "x": -570, "y": 300, "width": 520, "height": 60 },
		{ "id": "g-review", "type": "text", "text": "**review-promote** — a NAMED human\npromotes honestly, never in bulk.\nAI-assisted flag clears on human review.\n839 raw today (693 articles + 146 handoff)", "x": 130, "y": -420, "width": 440, "height": 180, "color": "3" },
		{ "id": "g-people", "type": "text", "text": "**Reviewers:** Luiz · Matty (curation lane) ·\nHeenal (editorial lane) · Durgadas (CSIS lens)", "x": 130, "y": -190, "width": 440, "height": 110 },
		{ "id": "g-boundary", "type": "text", "text": "**Public ≠ commons:** sensitive material\ncannot reach a public view without\na reviewed public-use decision", "x": 130, "y": -50, "width": 440, "height": 130 },
		{ "id": "c-commons", "type": "text", "text": "**The commons** — typed, provenance-tracked,\nreviewed objects (maturity ladder)", "x": 750, "y": -420, "width": 460, "height": 110 },
		{ "id": "c-site", "type": "text", "text": "**The site (render layer)** — encyclopedia,\ntracks, journeys, explorers · Layers 2+7\n`/convergence` `/handoff` `/self-ingestion`", "x": 750, "y": -270, "width": 460, "height": 140 },
		{ "id": "c-obsidian", "type": "text", "text": "**Obsidian graph** — `kb-graph/` companion\nnotes, one per object, clustered by type hubs", "x": 750, "y": -90, "width": 460, "height": 110 },
		{ "id": "c-story", "type": "file", "file": "docs/CONVERGENCE.md", "x": 750, "y": 60, "width": 460, "height": 60 },
		{ "id": "c-crosswalk", "type": "file", "file": "docs/reports/2026-07-15-framework-masterdoc-crosswalk.md", "x": 750, "y": 140, "width": 460, "height": 60 },
		{ "id": "note-convergence", "type": "text", "text": "**The convergence:** Matty's Database_Spec independently specifies this machine — his zones = the maturity ladder · his normalization = the crosswalk · his 87 dup-flags = the B5 guard. Where they diverge = the T4 roadmap (relationship records, person/org entity, 3 status dims).", "x": -1250, "y": 320, "width": 1180, "height": 150, "color": "6" }
	],
	"edges": [
		{ "id": "e1", "fromNode": "src-articles", "fromSide": "right", "toNode": "m-ingest", "toSide": "left" },
		{ "id": "e2", "fromNode": "src-handoff", "fromSide": "right", "toNode": "m-ingest", "toSide": "left" },
		{ "id": "e3", "fromNode": "src-next", "fromSide": "right", "toNode": "m-ingest", "toSide": "left", "label": "you: \"ingest this\"" },
		{ "id": "e4", "fromNode": "m-ingest", "fromSide": "bottom", "toNode": "m-candidates", "toSide": "top" },
		{ "id": "e5", "fromNode": "m-candidates", "fromSide": "bottom", "toNode": "m-gate", "toSide": "top" },
		{ "id": "e6", "fromNode": "m-gate", "fromSide": "bottom", "toNode": "m-store", "toSide": "top" },
		{ "id": "e7", "fromNode": "m-store", "fromSide": "right", "toNode": "g-review", "toSide": "left", "label": "review queue" },
		{ "id": "e8", "fromNode": "g-review", "fromSide": "right", "toNode": "c-commons", "toSide": "left", "label": "promoted" },
		{ "id": "e9", "fromNode": "g-boundary", "fromSide": "right", "toNode": "c-site", "toSide": "left", "label": "gates" },
		{ "id": "e10", "fromNode": "c-commons", "fromSide": "bottom", "toNode": "c-site", "toSide": "top" },
		{ "id": "e11", "fromNode": "c-commons", "fromSide": "bottom", "toNode": "c-obsidian", "toSide": "top" }
	]
}
```

- [ ] **Step 2: Link it from the master canvas**

Open `docs/canvases/regen-knowledge-commons-toolkit-master.canvas`, find the `"nodes"` array, and append (before the closing `]`, adding a comma to the previous element):

```json
{ "id": "link-the-machine", "type": "file", "file": "docs/canvases/the-machine.canvas", "x": -2400, "y": -1600, "width": 480, "height": 80, "color": "4" }
```

If `x:-2400,y:-1600` collides with existing content (check the nearest nodes' coordinates), shift it to free space above the top-left-most node.

- [ ] **Step 3: Verify both canvases parse and open**

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/canvases/the-machine.canvas','utf8')); JSON.parse(require('fs').readFileSync('docs/canvases/regen-knowledge-commons-toolkit-master.canvas','utf8')); console.log('both parse OK')"
```
Expected: `both parse OK`. Then open `the-machine.canvas` in Obsidian: 4 lanes read left→right, edges flow source → machine → gate → commons, file nodes resolve (not "file not found").

- [ ] **Step 4: Commit**

```bash
git add docs/canvases/the-machine.canvas docs/canvases/regen-knowledge-commons-toolkit-master.canvas
git commit -m "viz: the-machine canvas (sources → machine → human gate → commons/render) + master-canvas link"
```

---

### Task 5: Full verification pass (spec §Verification)

**Files:** none created — checks only.

- [ ] **Step 1: Framework + script tests still green**

```bash
( cd packages/toolkit-framework && npm test 2>&1 | grep -E 'pass |fail ' )
node --test scripts/generate-kb-viz.test.mjs 2>&1 | tail -3
```
Expected: `pass 110 / fail 0` and all kb-viz tests passing.

- [ ] **Step 2: Idempotency end-to-end**

```bash
npm run generate:kb-viz && git status --porcelain src/data/kb-schema-graph.json kb-graph | wc -l
```
Expected: `0` (regeneration over committed outputs changes nothing).

- [ ] **Step 3: Site build + page smoke test**

```bash
npm run build 2>&1 | tail -3
grep -c "conv-node" dist/convergence/index.html
```
Expected: build succeeds, ≥10 marks.

- [ ] **Step 4: Obsidian spot-check (operator, manual)**

Open the vault graph filtered to `path:kb-graph` — expect type-clustered constellations around the hubs; open one stub, check its local graph shows hub + related neighbors.

- [ ] **Step 5: Update the plan surface + commit anything outstanding**

Mark the checkboxes in this file; note completion in `docs/plans/convergence-visualization/2026-07-15-design.md` header (`status: implemented`).

```bash
git add docs/plans/convergence-visualization
git commit -m "viz: convergence-visualization plan executed — all verification steps green"
```

---

## Self-review notes (done at write time)

- **Spec coverage:** script (§1) → Tasks 1–2 · page (§2) → Task 3 · kb-graph (§3) → Tasks 1–2 · canvas (§4) → Task 4 · verification (§5) → Tasks 2 (steps 2–4) and 5. Follow-ons intentionally absent.
- **Consistency:** `TYPE_ORDER`/palette order match between script and page; `kb-hub-<type>` naming matches between `buildStub` and hub writer; JSON shape matches between `main()` and the page's consumption (`corpora`, `nodes[].byCorpus`, `edges[].label`).
- **Known judgment calls:** same-type edges are kept in the JSON but filtered from the SVG (documented in the test + page code). Hub wikilinks use bare `[[<id>]]`; if two objects in different types share an id, Obsidian resolves to one of them — rare, acceptable for v1, fix at drill-down time if it bites.
