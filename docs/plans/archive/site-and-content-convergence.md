> **⛔ SUPERSEDED 2026-07-14** by [`framework-validation-pass`](../framework-validation-pass.md).
> Its live scope is absorbed there (V2/V3 for content-through-framework + the site page; the resource
> lift is post-Jul-16, gated on the `held` state). Kept as historical record — do not execute.

# Process Toolkit Content Through the Framework + Public Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. **Run in a dedicated session** (this plan was prepared in a planning session).

**Goal:** Run the current toolkit content (Heenal's live v1 site + other branches + the V3 resource DB) **through the framework** so the ReFi Web3 instance becomes a real, populated framework instance — and **fork/extend Heenal's website** with two new public pages (one for the **framework**, one for the **regen-toolkit-os instance**), all on the `regen-toolkit-os` branch.

**Architecture:** Heenal's Astro/Starlight journey site (`src/`, already on `regen-toolkit-os`) is the **reference implementation of the framework's site model** (`packages/toolkit-framework/site/journey-model.md`). This plan (a) maps the site's content onto framework-typed objects in the instance's `data/` (dogfooding the framework on its own reference instance — effectively SP11 applied to ReFi Web3 *before* ReFi DAO), and (b) adds two top-level pages so the public site surfaces the **framework/instance split** itself. The site keeps deploying from `main` (Heenal's); `regen-toolkit-os` carries the framework-aware fork (own preview deploy optional).

**Tech stack:** Astro 6 + Starlight 0.38 (the site); `@regen-commons/toolkit-framework` (zero-build ESM + YAML, `node --test`) + `@org-os/kms`; `js-yaml`; Node 23. Content sources: `src/content/docs/*.md` (119), `src/data/journeys.js` (3 journeys), `src/data/knowledge-graph.json`, `data/resources/` (V3 DB, 28 CSVs), legacy `content/`, and the `archive/*` git tags (other branches' content, read-only via `git show`).

---

## Pre-flight (do first, every session)

- [ ] **Step 0.1 — vault snapshot.** From the parent vault: `npm run vault:snapshot -- "before site+content convergence"`. (Large content + site edits ahead.)
- [ ] **Step 0.2 — confirm baseline green.** `cd packages/toolkit-framework && npm test` → 34/34. `cd ../.. && npm run build` → site builds (124 pages). `npm run validate:schemas` → passes.
- [ ] **Step 0.3 — branch.** Confirm on `regen-toolkit-os`. Work additively (new `data/*.yaml`, new `src/pages/*`); do not delete the 119 articles.

## File structure (what this plan creates / touches)

- Create: `data/encyclopedia.yaml`, `data/tracks.yaml`, `data/concepts.yaml`, `data/source-systems.yaml` — instance content as framework objects
- Modify: `data/resources.yaml` — replace the April lift with the V3 crosswalk lift
- Create: `scripts/process-content.mjs` — drives the framework skills/ETL over the site content
- Create: `src/pages/framework.astro`, `src/pages/regen-toolkit-os.astro` — the two public pages
- Modify: `astro.config.mjs` — add the two pages to the sidebar ("About" group)
- Create: `src/content/docs/framework.md` + `src/content/docs/regen-toolkit-os.md` *(alternative if standalone .astro pages fight Starlight routing — see Task 6)*
- Create: `docs/reports/<date>-content-through-framework-report.md` — what was processed + counts

---

## Phase 1 — Reconcile the framework with the site

### Task 1: Map journeys.js ↔ the framework track schema

**Files:** Read `packages/toolkit-framework/site/journey-model.md`, `packages/toolkit-framework/schemas/track.yaml`, `src/data/journeys.js`. Create: `docs/reports/<date>-content-through-framework-report.md` (start it).

- [ ] **Step 1.1:** Confirm the mapping: a `journeys.js` journey (`id,label,intro,outcome,chapters[].steps[][slug,title,blurb]`) = a framework `track` (audience, outcome, concepts/options, chapters≈composition). Each step's `slug` = an `encyclopedia-entry` (the article). Write the field mapping into the report.
- [ ] **Step 1.2:** Note the divergences to preserve (the site has presentation fields — emoji, kicker, minutes — that the `track` schema doesn't; keep them site-side; the framework track is the semantic backbone). Decide: journeys.js stays the site's source of truth; `data/tracks.yaml` is the derived framework view (generated from journeys.js in Task 4), kept in sync.

## Phase 2 — Process content through the framework

### Task 2: Lift the V3 resource DB → instance Resource Graph

**Files:** Create/modify `data/resources.yaml`, `data/source-systems.yaml`. Use `packages/toolkit-framework` CLI `lift` (SP7).

- [ ] **Step 2.1:** Run the lift on the crosswalk: `node packages/toolkit-framework/src/cli.mjs lift data/resources/csv/toolkit-layer-crosswalk.csv > /tmp/lifted.yaml`. Inspect counts.
- [ ] **Step 2.2:** Route by `toolkit_route`: rows routed "Source System Candidate"/"Source System Card" → `data/source-systems.yaml` (validate each against `source-system` — needs `return_path`; leave a `needs: return_path` marker where unknown, maturity `raw`); the rest → `data/resources.yaml`. Carry `review_status` → `maturity`/`public_use` (raw stays raw — never auto-promote).
- [ ] **Step 2.3:** Validate: every emitted object passes `node packages/toolkit-framework/src/cli.mjs validate <schema> <file-per-entry>` (or a batch loop). De-dupe against the old `data/resources.yaml` (April lift) and replace it. Record counts in the report.
- [ ] **Step 2.4 — commit:** `git add data/resources.yaml data/source-systems.yaml && git commit -m "data: lift V3 resource DB through the framework (Resource Graph + source systems)"`

### Task 3: Process the 119 articles → encyclopedia entries + extracted concepts

**Files:** Create `scripts/process-content.mjs`, `data/encyclopedia.yaml`, `data/concepts.yaml`. Skill: `skills/capture-and-route` logic.

- [ ] **Step 3.1 (test-first):** Write `scripts/process-content.test.mjs` asserting: given an article with frontmatter `{title}` + body, the processor emits a valid `encyclopedia-entry` (title, type, page_type inferred, maturity `reviewed` ONLY if human-reviewed else `draft`/`source-linked`, public_use honest) and extracts candidate `concept` references. Run → fail.
- [ ] **Step 3.2:** Implement `scripts/process-content.mjs`: read each `src/content/docs/*.md`, parse frontmatter (gray-matter or a minimal parser), infer `page_type` (concept/guide/comparison/anti-pattern/frontier from title+content heuristics), set `maturity` from a human-review allowlist (default `draft` — these are AI-pipeline drafts per the master doc; do NOT mark `reviewed` wholesale), emit `encyclopedia-entry` objects to `data/encyclopedia.yaml`. Validate each via the framework API (`validateObject`). Run test → pass.
- [ ] **Step 3.3:** Extract concept candidates (the recurring defined terms / "what is X" articles) → `data/concepts.yaml` as `concept-lineage` objects (maturity `draft`, source_lineage = the article). Don't over-extract; cap at the clear ones.
- [ ] **Step 3.4 — commit.**

### Task 4: Derive tracks from journeys.js → data/tracks.yaml

**Files:** Create `data/tracks.yaml`, extend `scripts/process-content.mjs`.

- [ ] **Step 4.1 (test-first):** Assert the 3 journeys map to 3 valid `track` objects (audience, outcome, options/concepts = the step slugs), each validating against `schemas/track.yaml`. Run → fail.
- [ ] **Step 4.2:** Implement: import `journeys.js`, map each journey → a `track` object (audience from `kicker`/`intro`, outcome from `outcome`, the chapter step-slugs → `concepts`/related entries), maturity `field-informed` (the journeys are Heenal's reviewed v1). Emit `data/tracks.yaml`. Run → pass.
- [ ] **Step 4.3 — commit.**

### Task 5: Harvest other-branch + legacy content (dedupe, salvage)

**Files:** read-only `git show archive/*`; append to `data/encyclopedia.yaml` / `data/resources.yaml`.

- [ ] **Step 5.1:** Enumerate other-branch content via tags: `git show archive/heen-ai-tier-1-articles:<path>` (the ~12 tier-1/2 articles in the old `content/` pipeline — stablecoins, wallets, scams, seed-phrases, DAOs, ReFi, funding, glossary) + `git ls-tree -r archive/heen-ai-tier-1-articles --name-only | grep content/`. Also the legacy `content/` dir + the research dumps in `archive/luizfernando-refidao` (`research/*.md`: gitcoin, gnosis-safe, silvi, refi-dao inventory).
- [ ] **Step 5.2:** For each, check if it's already covered by one of the 119 live articles (by slug/topic). **Salvage only what's NOT superseded** (most heen-ai articles are superseded by the v1 119). Route survivors through `process-content.mjs` → `encyclopedia-entry` (maturity `draft`, flag `ai_assisted` if from the pipeline). Research dumps → `resource` entries (maturity `raw`).
- [ ] **Step 5.3:** Record in the report what was salvaged vs dropped-as-superseded (no silent loss — name the dropped set). **Commit.**

### Task 6: CSIS review pass on the processed content

**Files:** `skills/csis-review` logic; annotate the emitted `data/*.yaml`.

- [ ] **Step 6.1:** Run `checkInvariants` + the `csis-review` checklist over the emitted objects: nothing raw is `public_use: reviewed-for-*`; AI-pipeline articles aren't `maturity: reviewed`; high-risk topics (token/funding/security articles) carry a `public-use-boundary`. Fix violations (downgrade state, don't relabel content). Record the review summary in the report. **Commit.**

## Phase 3 — Fork/extend Heenal's site with the two pages

### Task 7: The framework page

**Files:** Create `src/pages/framework.astro` (or `src/content/docs/framework.md` — see Step 7.3). Modify `astro.config.mjs`.

- [ ] **Step 7.1:** Build a `/framework` page using the site's layout (`src/layouts/Page.astro`). Content (derive from `packages/toolkit-framework/README.md` + `packages/toolkit-framework/docs/meta/PLACEMENT.md`): what the framework is (the reusable, org-os-agnostic core), the kernel + layers, that it's **forkable + interoperable** (the base guideline), how to adopt (the `@org-os/kms` profile). Anti-hype, jargon-free (match Heenal's voice).
- [ ] **Step 7.2 (live data option):** At build time, import the framework API and render the **live schema list + kernel-check status**: `import { listSchemas, validateKernel } from '../../packages/toolkit-framework/src/index.mjs'` → show the 21 schemas + "kernel consistent ✓". (Verify Astro can import the sibling ESM package; if the relative path is awkward, copy a generated `framework-manifest.json` via a prebuild step instead.)
- [ ] **Step 7.3 (routing):** If a standalone `.astro` page conflicts with Starlight's content routing, instead author `src/content/docs/framework.md` (a Starlight doc) + add it to the sidebar under a new "About the system" group. Pick whichever builds cleanly.
- [ ] **Step 7.4:** `npm run build` → the `/framework` (or `/framework/`) page renders. **Commit.**

### Task 8: The regen-toolkit-os (instance) page

**Files:** Create `src/pages/regen-toolkit-os.astro` (or `src/content/docs/regen-toolkit-os.md`). Modify `astro.config.mjs`.

- [ ] **Step 8.1:** Build a `/regen-toolkit-os` page: what **this instance** is — the org-os coordination overlay + the first concrete framework instance (ReFi Web3); how it operates (`/initialize`–`/close`, the `data/` registries now populated by Phase 2, the layers, federation via RegenOS). Derive from `MASTERPLAN.md` / `docs/ORG-OS.md` / `IDENTITY.md`. Cross-link to the framework page ("this instance runs the framework →").
- [ ] **Step 8.2 (live data option):** Render instance stats from the now-populated `data/` (e.g., # resources, # source-systems, # tracks, # encyclopedia entries) at build time.
- [ ] **Step 8.3:** Add both pages to `astro.config.mjs` sidebar under an "About the system" group (Framework · This instance). `npm run build` → both render. **Commit.**

### Task 9: Site identity + cross-links

**Files:** `astro.config.mjs`, `src/pages/index.astro`.

- [ ] **Step 9.1:** On the homepage, add a short "What is this?" link row → the framework page + the instance page (so the front door exposes the framework/instance split). Keep Heenal's journeys primary.
- [ ] **Step 9.2:** Decide the `astro.config` `site:` URL for this fork (a distinct preview deploy vs leaving `regen-toolkit-site.vercel.app`). Note it; don't change the live deploy. **Commit.**

## Verification (run before claiming done)

- [ ] `cd packages/toolkit-framework && npm test` → 34/34 (framework untouched/green)
- [ ] `npm run build` → site builds; `/framework` + `/regen-toolkit-os` pages present in `dist/`
- [ ] Every emitted `data/*.yaml` object validates against its framework schema (loop the CLI `validate`)
- [ ] `npm run validate:schemas` → org-os instance schemas still pass
- [ ] CSIS review pass clean: no raw→public, no AI-draft mislabeled `reviewed`, high-risk topics bounded
- [ ] The report (`docs/reports/<date>-content-through-framework-report.md`) records: counts processed (articles→entries, journeys→tracks, V3→resources/source-systems, salvaged vs dropped), the review summary, and the framework↔site mapping
- [ ] Nothing deleted: the 119 articles + 3 journeys intact; processing was additive (`data/`) + the 2 new pages

## Self-review checklist (planner)

- **Spec coverage:** reconcile framework↔site (Phase 1) ✓; process live + branches + V3 through the framework (Phase 2, Tasks 2–6) ✓; fork Heenal's site with framework + instance pages on regen-toolkit-os (Phase 3) ✓.
- **No silent loss:** Task 5 names dropped-as-superseded content; processing is additive; the 119 articles preserved.
- **Honest state:** Tasks 3/6 forbid wholesale `reviewed` on AI-pipeline drafts (master doc: "don't present polished writing as reviewed"); raw never auto-promoted.
- **Framework integrity:** the framework package is consumed read-only; instance content lands in `data/` + `src/`, never inside `packages/toolkit-framework/`.

## Notes / open decisions for the executing session

1. **"Fork" interpretation:** extend Heenal's site in-place on `regen-toolkit-os` (recommended) vs a separate deploy. Confirm the `site:` URL / preview deploy with the operator.
2. **Live deploy unchanged:** `main` keeps serving Heenal's site; this branch is the framework-aware version.
3. **This is the dialectic in miniature:** processing ReFi Web3's own content through the framework is the first real adoption (SP11 rehearsal) — capture the framework gaps it surfaces into `packages/toolkit-framework/docs/meta/RECONCILIATIONS.md` + new Update Proposals (FEEDBACK-LOOPS Loop 4) before doing ReFi DAO.
4. **frontmatter parser:** prefer `gray-matter` if already a dep; else a minimal frontmatter splitter (no new dep) consistent with the framework's zero-build ethos.
