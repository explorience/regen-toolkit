# Design — Live dev instance: reprocessed KB as browsable content

**Date:** 2026-07-21 · **Author:** Luiz (+ agent) · **Status:** approved design, pre-plan
**Origin:** `docs/plans/SESSION-HANDOFF-2026-07-19.md` Prompt 1 (MAIN) · 2026-07-16 meeting plan (staging site to review framework-processed content side-by-side before any PR to `main`)
**Branch:** `regen-toolkit-os` (dev) · **Deploy:** GitHub Pages from the personal fork (`luizfernandosg`), never `main`/prod, never `origin`.

---

## 1 · Problem & goal

Today the live site renders the **119 source articles** (`src/content/docs/*.md`, Starlight) plus five **summary** pages (`convergence`, `self-ingestion`, `handoff`, `framework`, `regen-toolkit-os`) that show *counts and diffs* of the reprocessed knowledge base. It does **not** render the reprocessed content itself.

The framework machine has produced two `raw` KB corpora:

- **`data/kb/`** — the 119 articles reprocessed → **722 typed objects** (repo-data adapter; one YAML file per type, objects under an `entries:` map keyed by slug).
- **`kb-handoff/`** — Matty's Canonical_DB slice → **146 objects** (kb-folder adapter; one YAML file per object under `objects/<type>/<slug>.yaml`).

**Goal:** a **live URL on the fork** where the team can browse all **868** reprocessed objects as content — by type, by layer, and via an interactive graph — each object showing its provenance and its raw/under-review status, with the 119 source articles still present for side-by-side comparison. This is the **review surface** the 2026-07-16 meeting asked for, shipped now, independent of Heenal's repo migration.

**Non-goals:** promoting/publishing any object; mutating the KB; touching `docs/MASTER.md` or the read-only handoff package; the comparison/validation analysis (Prompt 2); full Canonical_DB ingestion (Prompt 3, T3b).

---

## 2 · Verified starting state (2026-07-21)

- Framework: **125 tests green**. `kb index --adapter repo-data` → **722** (encyclopedia-entry 116, concept-lineage 143, resource 226, claim-evidence 146, public-use-boundary 34, signal 33, source-system 21, track 3; 671 raw / 693 review-queue). `kb-handoff/index.json` → **146** (source-system 67, resource 25, claim-evidence 15, implementation-record 15, option-entry 15, concept-lineage 5, public-use-boundary 4).
- Branch `regen-toolkit-os` is 8 commits ahead of `origin`; working tree clean except `.obsidian/workspace.json` (UI state, excluded from all commits here).
- Remotes: `origin` = `explorience/regen-toolkit`, `fork` = `luizfernandosg/regen-toolkit`. Fork Pages wired via `.github/workflows/deploy-pages.yml`, deploys on push to `regen-toolkit-os`.

### Key facts that shape the design

- **Astro output is `static`** (no adapter) → every dynamic route must use `getStaticPaths()`. Good fit.
- **Base handling:** `GITHUB_PAGES=true` → `base: '/regen-toolkit/'`, `site: 'https://explorience.github.io'` (hardcoded). Base is what makes links/assets resolve, so the fork site *works*; only canonical/sitemap origin is wrong for the fork. → we make `site` env-driven (§7).
- **`in-*` CSS classes are NOT global** — they are scoped inside `regen-toolkit-os.astro`; `self-ingestion`/`handoff` render mostly unstyled. Only `theme.css` helpers (`wrap`, `eyebrow`, `btn`, `chip`, `card`, `reveal`) are truly global. → we ship our own `src/styles/kb.css`.
- **YAML is never imported into a page** — the repo convention is a prebuild step that converts YAML → JSON in plain Node, written to `src/data/`, then imported. Three generators already run in the `prebuild` npm hook.
- **Tested loaders already exist** in `scripts/generate-kb-viz.mjs`, exported and import-safe: `loadArticlesCorpus(kbDir)`, `loadHandoffCorpus(objDir)`, `pickDescription(data)`, `safeName(id)`, `deriveEdges(...)`, `buildSchemaGraph(...)`. Co-located test: `scripts/generate-kb-viz.test.mjs`.
- **Non-Starlight `Page.astro`** is the convention for all data-driven pages ("so it can never break the docs build"), with the `withBase` pattern (`base + String(p).replace(/^\//,'')`).
- Object shape: **no `id` field** — identity is the `entries:` slug key (or the filename in kb-handoff); `title` (or `name`) is the display field; `provenance` = `{ origin, transformation, authorship }` (+ sometimes `source_lineage`); `maturity` is the raw/status axis; edges are bare slug arrays (`related_concepts`, `related_resources`, `related_options`, `concepts`, `options`); in-band layer hint via `toolkit_route` / `affected_layer` slug.

---

## 3 · Architecture

One-way data flow, three isolated units:

```
data/kb/*.yaml  +  kb-handoff/objects/**        (the commons — read-only source of truth)
        │
        ▼   scripts/gen-kb-pages.mjs   (prebuild, plain Node)
src/data/kb-objects.json  +  src/data/kb-graph.json    (the frozen JSON contract)
        │                              │
        ▼ getStaticPaths (static)      ▼ client canvas island
  content routes under /kb/       interactive force graph
```

- **The site is a view over the commons; it does not own it** (`packages/toolkit-framework/site/journey-model.md`). Canonical content stays in the KB; the site renders it and **surfaces — never flattens — maturity/review state**.
- Each unit has one job and a well-defined interface (the JSON contract). They can be built and tested independently.

---

## 4 · Unit A — Data snapshot (`scripts/gen-kb-pages.mjs`)

Joins the existing `prebuild` chain in `package.json`. Reuses the exported loaders from `generate-kb-viz.mjs` (no reimplementation of YAML reading). Emits two deterministic (no-timestamp) JSON files under `src/data/`.

### 4.1 `src/data/kb-objects.json`

An array; one entry per object across both corpora. Normalized shape:

```jsonc
{
  "key": "articles:encyclopedia-entry:what-is-decentralization", // corpus:type:slug — collision-safe identity
  "corpus": "articles",              // "articles" (data/kb) | "handoff" (kb-handoff)
  "type": "encyclopedia-entry",
  "id": "what-is-decentralization",  // the slug key
  "layer": 2,                        // derived (see 4.3)
  "layerSlug": "layer-2-knowledge-commons",
  "title": "What Is Decentralization?",
  "description": "…",                // via pickDescription()
  "maturity": "raw",
  "public_use": "source-linked-unreviewed",
  "ai_assisted": true,
  "high_risk": false,
  "provenance": { "origin": "src/content/docs/what-is-decentralization.md", "transformation": "summarized", "authorship": "ai-assisted" },
  "sourceArticle": "/what-is-decentralization/",  // set iff origin matches src/content/docs/<slug>.md, else null
  "related": [ { "field": "related_concepts", "type": "concept-lineage", "id": "decentralization", "key": "articles:concept-lineage:decentralization", "resolved": true } ],
  "fields": { /* remaining raw fields, for honest full display */ }
}
```

- **`layer`** derived from the in-band slug (`toolkit_route` / `affected_layer` / `signal_type`) parsed to a layer number; fallback to the **type→layer table** (4.3). Every object gets a layer (cross-cutting types default per 4.3).
- **`sourceArticle`** — when `provenance.origin` matches `src/content/docs/<slug>.md`, resolve to `/<slug>/`; else `null`.
- **`related`** — flatten the `related_*` / `concepts` / `options` slug arrays. Resolve each target **within the same corpus** to a `key`; mark `resolved: false` for danglers (kept for honest display, counted in the report).
- **`fields`** — everything not already hoisted, so the object page can show the full raw record without hiding anything.

### 4.2 `src/data/kb-graph.json`

```jsonc
{
  "nodes": [ { "key": "articles:encyclopedia-entry:what-is-decentralization", "type": "encyclopedia-entry", "corpus": "articles", "layer": 2, "maturity": "raw", "degree": 5, "x": 123.4, "y": -88.1 } ],
  "edges": [ { "source": "<key>", "target": "<key>", "kind": "related_concepts" } ]
}
```

- Edges = resolved `related` links (both endpoints real nodes). Unresolved endpoints dropped and **counted** in the script's stdout report (no silent loss).
- **Layout is precomputed at build time** with `d3-force` (build-only dependency) — the script runs the simulation to convergence in Node and bakes `x`/`y` into each node. The client ships a static layout: instant first paint, crisp interaction at 868 nodes, and zero runtime physics risk.

### 4.3 Type → layer table (canonical, from the schema headers)

| type | layer | notes |
|---|---|---|
| encyclopedia-entry | 2 | Knowledge Commons / Encyclopedia |
| resource | 3 | Resource Graph & Ecosystem Atlas |
| source-system | 3 | Layer 3a sub-registry (routed to 10 via `toolkit_route` when present) |
| concept-lineage | 4 | Concept & Idea Ecology |
| option-entry | 5 | Option Library |
| track | 7 | Tracks & Composition |
| implementation-record | 8 | Implementation & Learning Memory |
| signal | 9 | feeds the Evolution loop (via `affected_layer`) |
| claim-evidence | cross-cutting → grouped under "Stewardship / evidence" (display layer 0) |
| public-use-boundary | cross-cutting → grouped under "Stewardship / boundaries" (display layer 0) |
| relationship-record | cross-cutting → "Stewardship / relationships" (display layer 0) — no instances yet |

In-band `toolkit_route`/`affected_layer` slugs override the table when present (e.g. a source-system routed to `layer-10-infrastructure-and-substrate`).

### 4.4 Tests — `scripts/gen-kb-pages.test.mjs`

- total = 868; per-type counts equal `data/kb/index.json` + `kb-handoff/index.json`.
- every object: has `key`, `id`, a `title` (graceful `untitled-*` fallback), and either a `provenance` block or an explicit no-provenance flag.
- every graph edge resolves to two real nodes; node/edge counts internally consistent.
- every object has a `layer`; `sourceArticle`, when set, matches an existing `src/content/docs/*.md`.

---

## 5 · Unit B — Content routes (Astro, static)

All under `/kb/`, all built on `Page.astro` via a thin **`KbLayout.astro`** wrapper that imports `src/styles/kb.css` and renders the honesty banner (§6) + a KB sub-nav. `withBase` on every internal href.

| Route | getStaticPaths source | Renders |
|---|---|---|
| `src/pages/kb/index.astro` | — | Hub: honesty banner, interactive graph (Unit C), corpus/layer/type overview with counts, entry links |
| `src/pages/kb/layer/[layer].astro` | distinct layers | All objects mapped to the layer (both corpora, corpus-labeled), grouped by type |
| `src/pages/kb/type/[type].astro` | distinct types | All objects of the type (both corpora), each a card: title, description, maturity, corpus, layer |
| `src/pages/kb/[corpus]/[type]/[slug].astro` | every object | **Object page** (generic template) |

**Object page** shows: title; **raw/maturity badge**; `ai_assisted` + `high_risk` flags; `public_use` tier; **corpus label**; **provenance block** (origin + transformation + authorship + `source_lineage`); the full `fields` record (honest, nothing hidden); a **Related** list (linked where `resolved`, shown-but-flat where dangling); and a **"Compare to source article →"** link to `sourceArticle` when set. Route is keyed `[corpus]/[type]/[slug]` because a `resource` slug can exist in both corpora.

`src/styles/kb.css` ships real styling (grid cards, badges, layer color tokens from `theme.css`, provenance block). The 119 Starlight articles are untouched — they remain the comparison baseline.

---

## 6 · Unit C — Interactive graph + honesty

### 6.1 Graph island — `src/components/KbGraph.astro`

A `<canvas>` + client script reading `src/data/kb-graph.json`:

- **Render:** nodes colored by **layer** (palette tokens from `theme.css`), sized subtly by `degree`; edges as faint lines. Baked layout → instant paint.
- **Interact:** pan (drag), zoom (wheel), hover (tooltip: title · type · corpus · maturity), click → navigate to the object page (`withBase`).
- **Filters:** by corpus (articles / handoff), by layer, by maturity (spotlight the 693 raw); non-matching nodes dim.
- **Robustness:** canvas (not SVG/DOM) for 868 nodes; reduced-motion respected; if JS is off, the `/kb/` index content below the graph is fully usable (progressive enhancement).

### 6.2 Honesty (review-gate discipline)

- **Site-wide banner** on every `/kb/` page (persistent strip, warning token, not dismissible): *"Reprocessed content · dev instance · raw, under review. AI-assisted extractions from the framework machine. Nothing here is reviewed or published — this is the review surface, not the site."*
- **Per-object:** maturity badge, `ai_assisted`, `high_risk`, `public_use`, corpus label. Never flatten maturity (`journey-model.md`).
- **Nav:** add `/kb/` to the `Page.astro` header nav ("Reprocessed (dev)"); add a Starlight **sidebar group** `"Reprocessed content (dev · raw, under review)"` in `astro.config.mjs` linking to `/kb/` + key indexes (uses `link:`, never `slug:`, so a missing route can't break the build).

---

## 7 · Config fix — env-driven `site`

In `astro.config.mjs`, when on Pages, read the Pages origin from an env var (`PAGES_ORIGIN`), defaulting to the current `https://explorience.github.io` so **prod/origin builds are unchanged**. The fork's `deploy-pages.yml` sets `PAGES_ORIGIN=https://luizfernandosg.github.io`. `base` logic is untouched. This makes fork canonical/sitemap URLs correct without affecting prod.

---

## 8 · Deploy & verification

- Local: `npm run build` (default base `/`) **and** `GITHUB_PAGES=true npm run build` (base `/regen-toolkit/`) both exit clean; prebuild snapshot runs in both. Spot-check `dist/kb/index.html`, one object page, one type + one layer index exist.
- **Push to `fork regen-toolkit-os` only.** Never `main`/prod, never `origin`. Scoped `git add` (new `scripts/`, `src/`, `src/data/*.json`, `astro.config.mjs`, `.github/workflows/deploy-pages.yml`, this spec, the plan) — never `.obsidian/workspace.json`.
- Confirm live at `https://luizfernandosg.github.io/regen-toolkit/` and `/regen-toolkit/kb/`. Report the URL + a rendered-vs-stubbed summary.

---

## 9 · Build sequencing (subagent-driven)

1. **Unit A first (sequential):** `gen-kb-pages.mjs` + snapshot + `.test.mjs`, wired into `prebuild`. Its test must pass before fan-out — everything depends on the JSON contract.
2. **Parallel (contract frozen):** A = content routes (`KbLayout`, `kb.css`, 3 indexes + object template); B = graph island + d3-force baked-layout step; C = honesty/nav wiring + `astro.config.mjs` `site` fix.
3. **Integrate:** assemble `/kb/` hub, run both builds, fix cross-unit seams.
4. **Deploy:** push to `fork`, verify live, report.

---

## 10 · Risks & mitigations

| Risk | Mitigation |
|---|---|
| d3-force adds a dependency | Build-only (`devDependencies`); layout baked → no runtime dep. If undesired, fall back to a tiny in-script force sim. |
| 868-node graph perf | Precomputed layout + canvas + reduced-motion + progressive enhancement. |
| Slug collisions across corpora | Identity key `corpus:type:slug`; routes keyed the same way. |
| Missing fields (e.g. `public-use-boundary` has no `type`/`maturity`; some `untitled-*`) | Template + snapshot handle absent fields gracefully; `by_maturity` may not sum to total (4 handoff PUB objects) — display "unlabeled" rather than dropping. |
| Breaking the live docs build | All new pages are non-Starlight `Page.astro`; sidebar uses `link:` not `slug:`; both builds verified before any push. |
| Accidentally touching prod | Push only to `fork regen-toolkit-os`; `site` fix defaults preserve prod; scoped `git add`. |

---

## 11 · Definition of done

A live URL on the fork where you can browse the reprocessed content **by type and by layer**, an **interactive graph** overview, each object showing **provenance + raw status**, the **119 articles still present** for comparison, cross-links from objects to their source article, deployed **from the fork** (not prod), both builds green — with a report of what rendered vs anything stubbed.
