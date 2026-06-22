# Content Through Framework — Report

**Date started:** 2026-06-17
**Plan:** Site + Content Convergence (9 tasks)
**Status:** in progress
**Voice:** Internal engineering report. Factual, anti-promotional ("honest state" discipline). No marketing claims.

This report is **appended to** across the plan. Task 1 establishes the journey ↔ track mapping and the source-of-truth decision. Tasks 2–6 add processing counts; Task 6 adds a CSIS review summary. Sections below are stubbed for those later additions.

---

## Task 1 — Framework ↔ Site Mapping

### Sources read

| Source | Path | What it is |
|---|---|---|
| Site journeys | `src/data/journeys.js` | The live site's ordered journey definitions (3 journeys). Drives homepage, journey landing pages, Starlight sidebar. |
| Track schema | `packages/toolkit-framework/schemas/track.yaml` | Framework Layer 7 schema for a guided pathway (a "track"). Read-only package. |
| Encyclopedia-entry schema | `packages/toolkit-framework/schemas/encyclopedia-entry.yaml` | Framework Layer 2 schema for an explanatory article. |
| Frontmatter base | `packages/toolkit-framework/schemas/frontmatter.yaml` | K3 shared metadata base; `track` and `encyclopedia-entry` both `extends: frontmatter`. |
| Journey/site model | `packages/toolkit-framework/site/journey-model.md` | Generator-agnostic conceptual model bridging "site journey" ↔ "framework track". |

### The core claim (confirmed, with one correction)

The plan's claim — *a `journeys.js` journey = a framework `track`; each step's `slug` = an `encyclopedia-entry`* — holds, with one structural nuance that must be recorded honestly:

- **A journey IS a track**, rendered for the public. `journey-model.md` states this directly: a journey is "a **track rendered for the public** (Layer 7, Tracks & Composition)." The semantic backbone of a journey is a track.
- **Each step's `slug` IS an `encyclopedia-entry`** — the article. The step references a commons entry by id; it does not own the content. The `slug` is the article route (`/[slug]`) and the entry identifier.
- **Correction to the plan's shorthand ("chapters ≈ composition"):** the `track.yaml` schema has **no `chapters` field**. A track is a *flat* ordered composition expressed as `concepts` + `options` + `deployment_checks` + `failure_modes`. The journey's *chapters* are a **site-side presentation grouping** over that ordered composition — they have no direct field in the track schema. This is recorded as a divergence to preserve (see below), not a 1:1 field.

### Actual field shapes (verified against the files — no invented fields)

**Site journey object** (`src/data/journeys.js`):

- Journey level: `id`, `label`, `emoji`, `kicker`, `tagline`, `intro`, `outcome` (array of strings), `minutes`, `href`, `chapters[]`, and optional `badge` (only `knowledge-commons` carries `badge: "New"`).
- Chapter level: `label`, `steps[]`. (No `id`; no `lifecycle_phase`.)
- Step level: a **3-element tuple** `[slug, title, blurb]` — a positional array, **not** an object with named keys. `slug` = article route + entry id; `title` = display title; `blurb` = one-line description.
- Helpers: `journeyList` (ordered array) and `journeyStats(j)` (returns `{ count, minutes, chapters }`).

**Framework `track`** (`schemas/track.yaml`, `extends: frontmatter`):

- `required: [title, type, audience]`
- `fields`: `audience`, `starting_context`, `outcome`, `concepts` (array), `options` (array of option ids — compatibility-checked), `deployment_checks` (array), `failure_modes` (array), `maturity` (axis).
- Inherited from `frontmatter`: `title`, `type`, `maturity`, `public_use`, `lifecycle_state`, `ai_assisted`, `high_risk`, `domain`, `function`, `source_lineage`, `steward`, `review_needs`, `last_reviewed`, `notes`.

**Framework `encyclopedia-entry`** (`schemas/encyclopedia-entry.yaml`, `extends: frontmatter`):

- `required: [title, type, page_type]`
- `page_type` enum: `concept | framework | comparison | guide | case-linked | anti-pattern | frontier`.
- `fields`: `summary`, `audience`, `known_tensions`, `related_concepts`, `related_resources`, `maturity`, `public_use` — plus all `frontmatter` base fields.

### Field mapping — journey → track

| Site `journey` field | Framework `track` field | Notes |
|---|---|---|
| `id` | (entry id / filename of the track) | The track's identifier in `data/tracks.yaml`; not a `fields` entry — it's the record key. |
| `label` | `title` (via `frontmatter`) | Human-readable track title. |
| `intro` | `starting_context` | The narrative "where you are starting from" framing. Best semantic home; `starting_context` is free-form. |
| `outcome` (array of strings) | `outcome` (string) | Site lists multiple outcome bullets; track `outcome` is a single string. Join/summarize on derivation, or preserve the array site-side and flatten for the track. |
| `chapters[]` → `steps[]` (ordered) | `concepts` + `options` (ordered composition) | The flattened ordered list of step `slug`s becomes the track's ordered composition. Chapter grouping is **not** represented in the track schema (site-side only). |
| step `slug` | element of `concepts` (entry id) → resolves to an `encyclopedia-entry` | Each step references one article by id. See journey-step mapping below. |
| (audience — implicit in journey purpose) | `audience` (required) | Site does not carry an explicit `audience` string; it is implied by `kicker`/`tagline`/`intro`. Must be authored/derived for the track (required field). |
| — | `options` | Not present in current journeys (journeys are concept-only walks today). Empty / populated later when journeys reference Layer 8 options. |
| — | `deployment_checks` | Not present in journeys. Track-side concern; left empty until authored. |
| — | `failure_modes` | Not present in journeys. Closest site analogue is a "common pitfalls" step, but that is itself an entry, not structured failure-mode data. Left empty until authored. |
| — | `maturity` (axis) | Not in journeys. Honest-state axis; set on the track in the commons, not flattened by the site. |
| `emoji`, `kicker`, `tagline`, `minutes`, `href`, `badge` | — (no track field) | **Presentation-only.** Stay site-side. See divergences. |
| chapter `label` | — (no track field) | **Presentation grouping.** Stays site-side. |

### Field mapping — journey step → encyclopedia-entry

| Site step tuple element | Framework `encyclopedia-entry` field | Notes |
|---|---|---|
| `slug` (tuple[0]) | entry id (record key) + `/[slug]` route | The reference from track composition to the article. One article = one home in the commons, surfaced in many journeys. |
| `title` (tuple[1]) | `title` (via `frontmatter`) | Display title of the article. |
| `blurb` (tuple[2]) | `summary` | One-line description / summary of the article. |
| — | `page_type` (required) | Not in journeys; authored per-article (`concept`/`guide`/`comparison`/…). |
| — | `audience`, `known_tensions`, `related_concepts`, `related_resources`, `maturity`, `public_use` | Entry-side fields; not carried by the journey step. |

### Step 1.2 — Divergences to preserve, and the source-of-truth decision

**Divergences (site has them, the framework `track`/`encyclopedia-entry` schemas do not):**

1. **Presentation fields** — `emoji`, `kicker`, `tagline`, `minutes`, `href`, `badge` exist only on the site journey. They are display/UX concerns with no semantic place in the track schema. **Keep them site-side.**
2. **Chapter grouping** — `chapters[]` (with chapter `label`) is a site-side ordering/segmentation of steps. The track schema is a flat ordered composition; it has no chapter field. **Keep chapter structure site-side**; derive the flattened ordered composition for the track.
3. **Outcome cardinality** — site `outcome` is an array of strings; track `outcome` is a single string. Preserve the array site-side; flatten/summarize when deriving the track.
4. **`intro` vs `starting_context`** — naming differs; `intro` maps to `starting_context`. Preserve `intro` site-side (it is the rendered prose).
5. **Step shape** — site steps are positional `[slug, title, blurb]` tuples; the framework uses named entry fields (`title`, `summary`) plus a typed id reference. Tuple form stays in `journeys.js`; the derivation maps positionally.
6. **Fields the framework has that journeys lack** — `audience` (required on track), `options`, `deployment_checks`, `failure_modes`, `maturity`, `public_use`, `page_type`. These are authored in the commons, not invented from the site. The site inherits `maturity`/`public_use` *from* the commons (per `journey-model.md`), never the reverse.

**Decision (recorded):**

- **`src/data/journeys.js` remains the site's source of truth** for the public front door (rendering, ordering, presentation). It is what the live site reads today; that is not changing.
- **`data/tracks.yaml` is the *derived* framework view** — the semantic backbone, generated *from* `journeys.js` in Task 4 and kept in sync. It carries the track-shaped projection (audience, outcome, ordered concept composition) and the framework-only fields (maturity, public_use, etc.) layered on.
- This respects the framework's governing rule from `journey-model.md`: **"The site pulls from the commons; it does not own it."** In this convergence the relationship is bootstrapped in reverse for *content already authored in the site* — journeys.js is the existing authored content, and `data/tracks.yaml` is generated to bring it into the commons' shape. Going forward, the commons holds the canonical semantic state (maturity, public_use, review), and the site renders it; the site never overwrites the commons' review/maturity state.
- **Anti-promotion / honest-state:** the derived track must not flatten maturity. A polished journey page is not a reviewed track. `maturity` and `public_use` live on the commons entries/track and gate what the front door surfaces — the derivation never auto-promotes content to "public-ready."

### Task 1 outcome

Mapping confirmed and documented. One correction to the plan's shorthand: the track schema has no `chapters` field — chapters are site-side presentation grouping over the track's flat ordered composition. No code or schema emitted in this task (analysis + documentation only). `data/tracks.yaml` generation is deferred to Task 4.

---

## Processing Counts

_Populated by Tasks 2–6 as content is processed through the framework._

### Task 2 — V3 Resource Lift

**Source:** `data/resources/csv/toolkit-layer-crosswalk.csv` (the V3 resource DB crosswalk).
**ETL:** framework SP7 lift (`packages/toolkit-framework/src/lift.mjs` — `parseCsv`, `liftRow`), consumed read-only by the reproducible instance script `scripts/lift-v3-resources.mjs`.
**Outputs replaced/created:** `data/resources.yaml` (replaces the April lift — superseded shape) and `data/source-systems.yaml` (new).

#### Row accounting (no silent loss)

| Bucket | Count | Destination |
|---|---|---|
| CSV file lines (minus header) | 2820 | — (raw file) |
| **Parsed rows** (framework `parseCsv`) | **2617** | — (multi-line quoted `notes` fields collapse 2820 → 2617 records) |
| → **Resources** (Resource Graph) | **1616** emitted (+214 de-duped) = 1830 routed | `data/resources.yaml` |
| → **Source systems** | **89** emitted (+0 de-duped) | `data/source-systems.yaml` |
| → **Held** (review-queue rows, not lifted) | **698** | recorded below; rows stay in the CSV |
| Unrouted (could not classify) | 0 | — |
| Skipped as noise (route has `http` or len > 60) | 0 | — |

Reconciliation: 1830 (resource-routed) + 89 (source-system) + 698 (held) = **2617** = all parsed rows. Nothing dropped.

> **Note on the "368 empty routes" / "2985 rows" figures from the naive survey:** those were artifacts of comma-splitting the CSV without honoring quoted `notes` fields (which contain commas and embedded newlines). The framework's `parseCsv` is authoritative: **2617** real records, **0** truly-empty routes. The compound-route counts (e.g. `Media Source System Track; Source System Card`) push the "Source System" total to 89, higher than the single-route distribution implied.

#### Held (not lifted — review-queue rows)

These were **counted and recorded, not written** into `resources.yaml`. The rows remain in the CSV for a future review pass. Held by route:

| Route | Count |
|---|---|
| Social Signal Review | 622 |
| People/Account Review | 64 |
| Structural Integrity Review | 5 |
| Tooling; Deployment Safeguards | 1 |
| Ontology; Review Model | 1 |
| Social Signal Layer | 1 |
| Automated Curation | 1 |
| Media Safeguards | 1 |
| Social Signal Strategy | 1 |
| Builder Safeguards | 1 |
| **Total held** | **698** |

Rationale: the plan's loose "the rest → resources.yaml" would have dumped 622 raw social-signal mentions + 64 person/account-review rows into the Resource Graph as noise, contradicting the crosswalk's own routing column. Held rows are review-queue destinations (signal review, account review, structural-integrity review, safeguards, automated-curation) — not curated artifacts.

#### Routing rules applied

- **→ source-systems.yaml** (transformed to `source-system` objects): any row whose `toolkit_route` contains "Source System" (case-insensitive), including compound routes (`Media Source System Track`, `Tooling; Source System Card`, `Events; Source System`, …). Checked **first**, so a curated-artifact route wins over a co-tagged safeguard (`Source System Candidate; Public-use caution` → source system).
- **→ resources.yaml** (`resource` objects, lift kept verbatim): `Resource Graph` plus clearly-resource destinations (`Books Papers Articles*`, `Datasets/Maps`, `Projects Initiative(s)`, `Tooling`, `Concept Entry`, `Option Library`, `Implementation Memory*`, `Infrastructure*`, `Public Goods Builder Track`, `Resource Lead`, `Encyclopedia`, `Ontology`, `Repositories/Codebases`, `Podcasts/Media Shows`, `Events`, `Funding Mechanisms`, `Claims/Evidence`, `dMRV Track`, etc.).
- **HELD** (not lifted): review-queue routes (see table above).
- **Precedence: source-system wins over held; held wins over resource.** Routes are checked in that fixed order, so a compound route like `Tooling; Deployment Safeguards` is HELD even though `Tooling` is itself a resource keyword — safety-first (a co-tagged safeguard route is never silently lifted into the Resource Graph).

#### Source-system transform

Each source-system row was transformed from the lift's resource shape to a `source-system` object:
- `title` ← name; `url`, `original_source`, `toolkit_route` carried over; `notes` ← `review_status`.
- `type` ← best-fit enum inferred from `primary_type`/route (podcast/media → `podcast`; repo/codebase → `repo`; dataset → `dataset`; convening/event → `convening`; garden/pattern-library → `knowledge-garden`; forum, docs-site, library, etc.). **Fallback `database`** when no confident match (60 of 89; these are `organization/*`, `platform/*`, `domain/source-system candidate`, `white-space/research prompt` rows that don't map cleanly to the narrow enum).
- `steward` = `"UNKNOWN — needs identification"`, `return_path` = `"UNKNOWN — needs return_path"` (the `needs: return_path` marker — required field, so a non-empty placeholder), `review_needs` = `"steward, return_path, type confirmation"`.
- State: `maturity: raw`, `public_use: raw-lead`, `lifecycle_state: raw-lead`, `extraction_status: raw-lead`. **Nothing auto-promoted.**

Emitted source-system `type` distribution: database 60, podcast 16, convening 6, knowledge-garden 3, repo 1, forum 1, docs-site 1, library 1.

#### De-dupe + replace

- De-duped by normalized title (stable key; falls back to `global_id`). **214** duplicate resources dropped; **0** duplicate source systems.
- `data/resources.yaml` (April lift; `schema_version 1.0`, `generated_from docs/MASTER.md`) **fully replaced** by the V3 lift (`schema_version 2.0`). The old April-lift shape is superseded.

#### Validation (honest-state confirmation)

Every emitted object was validated **in a batch loop** via the framework API `validateObject(schemaName, obj)` (`packages/toolkit-framework/src/index.mjs`) before any file write — schema `resource` for 1616 objects, `source-system` for 89. The script **refuses to write** if any object fails. Result: **1616/1616 resources valid, 89/89 source systems valid** (0 failures). No object exceeds `raw` / `raw-lead` state; `review_status` is preserved in `notes` but never used to promote.

### Task 3 — 119 Articles → Encyclopedia + Concepts

**Source:** `src/content/docs/*.md` (the live v1 site's article corpus — AI-pipeline drafts).
**Processor:** `scripts/process-content.mjs` (test-first; `scripts/process-content.test.mjs`, 16/16 pass). Reads each article, parses frontmatter (`gray-matter`), infers `page_type` by ordered title/body heuristics, emits `encyclopedia-entry` objects, and conservatively extracts `concept-lineage` candidates. Every object is validated via the framework API before any write; the script **refuses to write** on any failure.
**Outputs:** `data/encyclopedia.yaml` (119 `encyclopedia-entry` objects) and `data/concepts.yaml` (8 `concept-lineage` objects).

#### Article → entry reconciliation (no silent loss)

| Bucket | Count | Destination |
|---|---|---|
| Articles on disk (`src/content/docs/*.md`) | 119 | — (source) |
| → **Encyclopedia entries** (one per article) | **119** | `data/encyclopedia.yaml` |
| Articles WITHOUT an entry | 0 | — |
| Entries WITHOUT a source article (orphans) | 0 | — |

Reconciliation: **119 articles = 119 entries**, one-to-one by `id` (the slug). No article was dropped and no entry was invented. Each entry carries `source_lineage: src/content/docs/<slug>.md` — round-trippable provenance back to the article. Regeneration is **byte-identical** to the committed `data/encyclopedia.yaml` (deterministic; sorted by slug), so the artifact is reproducible from the source corpus.

#### `page_type` distribution (heuristic output)

The processor infers one of the seven schema enum values (`concept | framework | comparison | guide | case-linked | anti-pattern | frontier`) from ordered title/body heuristics, defaulting to `concept` (the most defensible default — an explanatory page about a thing) when ambiguous:

| `page_type` | Count |
|---|---|
| concept | 44 |
| case-linked | 40 |
| guide | 17 |
| comparison | 12 |
| framework | 3 |
| anti-pattern | 2 |
| frontier | 1 |
| **Total** | **119** |

This is a **draft classification**, not an authored one — the heuristic's output is recorded honestly as a starting point for a human curation pass (Layer 2 owner), not as a reviewed taxonomy.

#### Concept extraction (conservative — did NOT over-extract)

**Rule:** extract a `concept-lineage` only for unambiguous defined-term articles — slug `what-is-…` / `what-are-…` (or title "What is/are X"), **excluding** any whose title also reads as a how-to / comparison / pitfall / guide / playbook. The intent is to capture the clear "what is X" concepts, not to turn all 119 articles into lineage stubs.

Result: **8 `concept-lineage` objects** — Blockchain, Cryptocurrency, DAO, Decentralization, Knowledge Commons, Local Node, ReFi, Crypto Wallet.

There are **10** `what-is/are-` slugs on disk; the rule extracted **8**. The two deliberately skipped are **`what-are-tokens`** ("What Are Tokens? A Beginner's **Guide** to Digital Assets") and **`what-is-ethereum`** ("What is Ethereum? A Friendly **Guide** for Regenerative Community Builders") — both titles self-describe as a *guide*, which the conservative exclusion filter (`\bguide\b`) catches. This is the anti-over-extraction rule working as designed; both remain encyclopedia entries (`what-are-tokens` → `concept`, `what-is-ethereum` → `guide`), so no content is lost — only the lineage-stub promotion is withheld pending a human lineage pass. Each concept stub carries the article's description as `short_description` and its `source_lineage`; `source_traditions` / `adjacent_meanings` / `important_distinctions` are **intentionally omitted** (not fabricated — a Layer 4 lineage owner fills these in).

#### Honest-state confirmation

These articles are **AI-pipeline drafts** that happen to be live on the v1 site. Per `docs/MASTER.md` ("Do not treat AI synthesis as human-reviewed"; "human review is still needed for published AI-assisted drafts"), the pipeline's own `review_done: true` is a **pipeline-stage flag** (research → draft → factcheck → review → critique), **not** independent human sign-off. So:

- **Every entry `maturity: draft`** — 0 marked `reviewed`. The `HUMAN_REVIEWED` allowlist is **empty** (no evidence any of the 119 has had independent human sign-off), so nothing is promoted. An entry with `review_done: true` in its frontmatter is explicitly tested to stay `draft`.
- **Every entry `public_use: source-linked-unreviewed`** — 0 carry a `reviewed-*` value. This is the honest rung: written/published, below `reviewed-for-explanation` / `reviewed-for-guidance` on the `public_use` axis (`packages/toolkit-framework/schemas/review-maturity.yaml`).
- **Every entry `ai_assisted: true`** — 119/119.
- **Concepts likewise** — all 8 `maturity: draft`, `ai_assisted: true`, 0 `reviewed`.

Nothing was auto-promoted. The state recorded is the floor (draft / unreviewed), never an overclaim.

#### Validation

Every emitted object was validated **in a batch loop** via the framework API `validateObject(schemaName, obj)` — schema `encyclopedia-entry` (required `[title, type, page_type]`) for 119 objects, `concept-lineage` (required `[title, type]`) for 8. Result: **119/119 encyclopedia-entry valid, 8/8 concept-lineage valid** (0 failures). The processor itself runs this same validation before writing and exits non-zero on any invalid object. (Note: the framework *CLI* `validate` reads a YAML file as a single object and so reports "invalid" against the wrapped `{ entries: [...] }` list shape — the per-object `validateObject` loop is the authoritative path for these list files.)

Baseline preserved: framework package tests 34/34 pass; Task 3 tests 16/16 pass.

### Task 4 — Journeys → Tracks

**Source:** `src/data/journeys.js` (the live site's 3 ordered journey definitions — Heenal's curated v1 pathways).
**Processor:** `scripts/process-content.mjs`, extended with `journeyToTrack(journey)` + `deriveTracks(journeysMap)` (test-first; `scripts/process-content.test.mjs` grew 16 → 24 tests, all pass). The script imports `journeys` from `journeys.js` (a real ES module — read-only) and emits `data/tracks.yaml`. Every track is validated via the framework API before any write; the script **refuses to write** on any failure (same gate as entries/concepts).
**Output:** `data/tracks.yaml` — 3 `track` objects (Layer 7). Source-of-truth decision from Task 1 stands: **`journeys.js` stays the site source of truth; `data/tracks.yaml` is the derived framework view** (the site is not made to read tracks.yaml).

#### Journey → track reconciliation (no silent loss)

| Bucket | Count | Destination |
|---|---|---|
| Journeys in `journeys.js` | 3 | — (source) |
| → **Tracks** (one per journey) | **3** | `data/tracks.yaml` |
| Journeys WITHOUT a track | 0 | — |
| Tracks WITHOUT a source journey | 0 | — |

Reconciliation: **3 journeys = 3 tracks**, one-to-one by `id`. Each track carries `source_lineage: src/data/journeys.js#<id>` — round-trippable provenance back to the journey.

#### Field mapping applied

| Site `journey` field | Framework `track` field | Transform |
|---|---|---|
| `id` | `id` (record key + traceability) | verbatim slug. |
| `label` | `title` (required) | verbatim. |
| — | `type` | constant `"track"`. |
| `kicker` (the "If you're …" line) | `audience` (required) | trimmed string. Non-empty for all 3. |
| `intro` (fallback `tagline`) | `starting_context` | trimmed prose. |
| `outcome` (**array** of strings) | `outcome` (**string**) | **collapsed** — joined with `"; "`. Schema's `outcome` is a string; the journey's is an array, so it MUST be flattened. Every bullet survives into the joined string (asserted in tests). |
| `chapters[].steps[][0]` (step slugs) | `concepts` (array) | **flattened, ordered** across all chapters. Chapter grouping is site-side only (Task 1 divergence) — not represented on the track. |
| — | `options` | left `[]` — journeys carry no option ids; **not fabricated**. |
| — | `maturity` | `field-informed` (see below). |
| — | `ai_assisted` | `false` — these journeys are hand-authored by Heenal, not AI-drafted (unlike the article corpus). |
| `emoji`, `tagline`, `minutes`, `href`, `badge`, chapter `label` | — | presentation-only; stay site-side (Task 1 divergences 1–2). |

#### Maturity value chosen (no substitution)

`maturity: field-informed` for all 3 tracks. **No substitution was needed** — `field-informed` ("informed by real implementation") is a valid value on the K1 maturity axis (`packages/toolkit-framework/schemas/review-maturity.yaml`, verified via `isValid('maturity','field-informed') === true`). It honestly reflects "Heenal's curated, reviewed v1 journeys": more mature than the AI-draft articles (`draft`), but not over-claimed as `reviewed` editorial copy. The tests assert `maturity === 'field-informed'` and `!== 'reviewed'`.

#### Concepts count per track

| Track | `id` | Concepts (step slugs) |
|---|---|---|
| Newcomer Orientation | `newcomer` | 16 |
| Local Node Builder | `local-node` | 22 |
| Knowledge Commons Builder | `knowledge-commons` | 14 |
| **Total** | | **52** |

(`newcomer`'s concepts include `what-is-blockchain`, ordered first as `why-regens-interested` — both asserted in tests.)

#### Validation

Each emitted track validated via the framework API `validateObject('track', t)` (required `[title, type, audience]`). Result: **3/3 tracks valid** (0 failures). The processor runs this same gate before writing `data/tracks.yaml` and exits non-zero on any invalid object.

Baseline preserved: framework package tests 34/34 pass; processor tests 24/24 pass (16 prior + 8 new); `npm run build` builds (124 pages) — `journeys.js` was read-only, not modified. `data/encyclopedia.yaml` / `data/concepts.yaml` regenerate byte-identical (no drift).

### Task 5 — Salvage (Other-Branch + Legacy Content)

**Sources harvested (read-only):**
- Legacy `content/` working-tree articles under `1-foundations/`, `2-applied/`, `3-playbooks/` (the old AI-pipeline corpus — the "254-article inventory"), **excluding** every `working/` subdir (pipeline intermediates: `*-research.md`, `*-factcheck.md`, `*-critique.md`, `*-review.md`) and `content/archive-pipeline-v1/` (a nested archive — superseded by definition).
- The refidao research dumps in the read-only archive tag `archive/luizfernando-refidao` (`research/*.md`), read via `git show`.

**Processor:** `scripts/process-content.mjs`, extended with a `harvest()` pass (test-first; `scripts/process-content.test.mjs` grew 24 → 32 tests, all pass). New exported functions: `tolerantFrontmatter`, `articleToSalvagedEntry`, `researchDumpToResource`, `readSalvageCandidates`, `liveSlugs`, `readResearchDumps`. Every emitted object is validated via the framework API before any write; the harvest **refuses to write** on any failure (same gate as the canonical pass).

#### Deviation from the plan letter (separate files — recorded)

The plan said "append to `data/encyclopedia.yaml` / `data/resources.yaml`." The controller overrode this, and the salvage is instead emitted to **separate new files**:
- `data/encyclopedia-salvaged.yaml` (survivor articles → `encyclopedia-entry`)
- `data/resources-salvaged.yaml` (research dumps → `resource`)

**Rationale:** (a) Appending would break Task 3's verified invariant — *119 articles = 119 entries, byte-identical regeneration* — by polluting the canonical encyclopedia with unreviewed `draft` stubs; and (b) the canonical files are regenerated by `process-content.mjs`, so an appended salvage would be **clobbered** on the next run. Separate files keep the harvest **idempotent** (re-running produces byte-identical salvaged files) and leave `data/encyclopedia.yaml`, `data/concepts.yaml`, `data/tracks.yaml`, and `data/resources.yaml` **untouched** (confirmed: their SHAs are unchanged after the harvest runs).

#### Dedup accounting (no silent loss)

| Bucket | Count |
|---|---|
| Candidate `content/` article files (the 3 dirs, minus `working/`) | 254 files |
| → unique **candidate leaf-slugs** | 242 |
| **Live slugs** (the canonical superseded set, `src/content/docs/*.md`) | 119 |
| → **Dropped as superseded** (candidate leaf-slug ∈ live set) | **98** |
| → **Survivors** (candidate leaf-slug ∉ live set) | **144** |
| Duplicate-path survivors deduped (same leaf-slug in >1 path; first sorted path wins) | 5 |
| Research dumps salvaged | 4 |

Reconciliation: 242 unique candidate leaf-slugs = 98 dropped + 144 survivors. (The 242 unique slugs come from 254 files because 12 files share a leaf-slug with another file across directories — 5 of those duplicated slugs are on the survivor side, the rest on the dropped/live side.) Every candidate is accounted for — either dropped-as-superseded (named in full below) or salvaged.

> **⚠ Survivor count exceeds the plan's STOP threshold (>40) — investigated, dedup verified correct.**
> The plan flagged ">40 survivors suggests the slug-match is wrong." It is **not** wrong here: I verified that survivors (`gitcoin-grants`, `consensus-mechanisms`, `snapshot`, `hypercerts`, `sarafu`, `public-vs-private`, …) are genuinely **absent** from `src/content/docs/`. The large number reflects reality: the legacy `content/` pipeline authored ~242 unique articles, but only **119** were promoted to the live site. The 144 survivors are the **unpublished remainder**, exactly the "legacy `content/` dir" the plan's Step 5.1 names as a salvage source. **Honest caveat:** **112 of the 144 survivors are `status: not-started` stubs** (mostly < 150 words of pipeline boilerplate) — they are salvaged as `maturity: draft` / `ai_assisted: true` with the legacy status in `notes`, NOT as finished content. This is not "bad salvage" (re-adding superseded content as if new/reviewed) — they are honestly labeled drafts the framework already gates as unreviewed.

#### Survivors salvaged (144) → `data/encyclopedia-salvaged.yaml`

All 144 → `encyclopedia-entry` with `maturity: draft`, `public_use: source-linked-unreviewed`, `ai_assisted: true`, `salvaged_from` = the `content/…` path, and `notes: "legacy pipeline status: <status>"`. **Legacy-status split** (honest, for human triage): `not-started` 112, `published` 27, `none` 3, `draft` 2.

The **27 `published`-status survivors** (the real, non-stub content a human should prioritize for review/merge): `avoiding-hype`, `benefits-participation`, `choosing-starting-point`, `delivery-models`, `event-follow-up`, `events-conferences`, `governance-attacks`, `hosting-first-event`, `impact-metrics`, `inflation-model`, `iterating-learning`, `joining-process`, `key-management`, `local-currency-design`, `local-node-ecosystem`, `local-node-setup`, `local-nodes-and-dao`, `operational-security`, `partnering-projects`, `program-design`, `reporting-frameworks`, `scam-prevention`, `setup-first-wallet`, `token-supply`, `treasury-best-practices`, `voting-systems-compared`, `wallet-security`.

Full survivor slug list (144): `acronym-decoder`, `africa-kenya-sarafu`, `ai-assistants-coordination`, `ai-web3-intersection`, `analytics-dashboards`, `asia-crypto-garden`, `avoiding-hype`, `avoiding-impact-washing`, `balancing-online-irl`, `benefits-of-participation`, `benefits-participation`, `blockchain-terms`, `blockchain-vs-database`, `building-relationships`, `cash-transfers-aid`, `choosing-starting-point`, `climate-environment`, `commitment-pooling`, `communication-platforms`, `community-currencies`, `community-energy`, `community-platforms-comparison`, `community-vs-audience`, `conceptual-frameworks`, `conducting-token-airdrop`, `connecting-impact-funding`, `consensus-mechanisms`, `creating-community-token`, `creating-poap-event`, `dao-governance`, `dao-governance-terms`, `dao-tooling-guide`, `dao-tooling-landscape`, `delivery-models`, `denver-ecosystem`, `designing-token-incentives`, `discord-telegram-tools`, `emerging-tools`, `essential-tools-directory`, `ethical-considerations`, `europe-regens-unite`, `event-follow-up`, `events-conferences`, `existing-local-nodes`, `federated-knowledge-commons`, `finding-local-node`, `fiscal-bridge-pattern`, `funding-platforms`, `funding-platforms-comparison`, `gitcoin-grants`, `gitcoin-public-goods`, `giveth`, `global-cross-regional`, `global-network-coordination`, `gnosis-safe`, `governance-attacks`, `governance-decision-making`, `governance-tools`, `grants-daos-foundations`, `greenpill-chapters`, `greenpill-movement`, `hosting-first-event`, `how-nodes-connect`, `humanitarian-aid`, `hypercerts`, `hypercerts-impact-certificates`, `impact-metrics`, `incident-response`, `indigenous-led`, `inflation-model`, `insurance-risk`, `iterating-learning`, `joining-a-local-node`, `joining-process`, `karma-gap`, `key-management`, `key-management-policies`, `key-projects-protocols`, `key-properties`, `knowledge-management-rag`, `land-stewardship`, `latin-america-refi-latam`, `learning-resources`, `limitations-tradeoffs`, `local-currency-design`, `local-node-ecosystem`, `local-node-setup`, `local-nodes-and-dao`, `local-nodes-refi-dao`, `lurker-to-leader`, `mapping-resources`, `middle-east-emerging`, `multisig-management`, `north-america-colorado`, `oceania-australia-nz`, `onboarding-processes`, `operational-security`, `partnering-projects`, `program-design`, `progressive-adoption`, `progressive-web3-adoption`, `public-goods-funding`, `public-vs-private`, `real-world-asset-tokenization`, `realistic-goals`, `receiving-crypto-donations`, `refi-barcelona`, `refi-costa-rica`, `refi-kenya-sarafu`, `refi-lagos`, `refi-lisbon`, `refi-medellin`, `refi-nyc`, `refi-tanzania`, `refi-terms`, `regenerative-agriculture`, `regulatory-considerations`, `reimagining-power`, `reporting-frameworks`, `rpgf`, `running-community-vote`, `sarafu`, `sarafu-case-study`, `scam-prevention`, `setting-up-bounty-program`, `setting-up-multisig-treasury`, `setup-first-wallet`, `snapshot`, `supply-chain-transparency`, `sustainable-funding-mix`, `sustaining-community`, `token-economics-basics`, `token-gated-communities`, `token-supply`, `tokenomics-mistakes`, `treasury-best-practices`, `urban-regeneration`, `voting-systems-compared`, `wallet-options`, `wallet-security`, `ways-to-contribute`, `web3-culture-terms`, `what-to-expect`, `when-blockchain-right-tool`.

#### Dropped as superseded (98) — named in full (no silent loss)

**Rule:** candidate leaf-slug ∈ the 119 live set → already covered by a live article → dropped (NOT salvaged). The 98 dropped slugs:

`ai-community-tools`, `bitcoin-history`, `building-founding-team`, `building-in-public`, `building-internal-capacity`, `building-momentum`, `building-trust`, `centralized-vs-decentralized`, `common-concerns`, `common-pitfalls`, `common-scams`, `conflict-resolution`, `cooperative-commons`, `creating-buying-earning`, `credentials-certifications`, `custodial-vs-noncustodial`, `dao-governance-models`, `dao-tooling`, `daos-vs-traditional`, `decentralization-resilience`, `decentralization-spectrum`, `delegation-representation`, `dmrv`, `documentation-knowledge`, `ethereum-ecosystem`, `examples-impact-daos`, `find-your-community`, `finding-support-mentorship`, `finding-your-people`, `first-90-days`, `funding-gatherings`, `funding-landscape`, `funding-your-node`, `gas-fees`, `gatherings-pattern`, `gitcoin-grants-qf`, `giveth-donations`, `governance-mechanism-design`, `hot-vs-cold`, `how-to-get-crypto`, `how-transactions-work`, `identity-verification`, `impact-certificates-hypercerts`, `inclusive-practices`, `is-community-ready`, `is-dao-right`, `is-web3-right`, `key-terms-a-z`, `knowledge-gardens`, `layer-2s`, `leadership-development`, `legal-structures`, `local-currency`, `local-node-model`, `local-nodes-and-daos`, `minimum-viable-node`, `multisig-setup`, `nfts-beyond-art`, `onboarding-members`, `onchain-attestations`, `other-chains`, `planning-web3-events`, `proposal-writing`, `recovery-planning`, `refi-vs-defi-tradfi`, `security-best-practices-orgs`, `seed-phrases`, `setting-up-first-wallet`, `silvi-protocol`, `smart-contracts-explained`, `social-tokens-creator`, `stablecoins`, `tax-implications`, `token-standards`, `tokens-coordination-tools`, `tokens-real-world-assets`, `treasury-management`, `trust-transparency`, `types-of-gatherings`, `voting-mechanisms`, `wallet-comparison-guide`, `what-are-tokens`, `what-is-blockchain`, `what-is-cryptocurrency`, `what-is-dao`, `what-is-decentralization`, `what-is-ethereum`, `what-is-local-node`, `what-is-refi`, `what-is-wallet`, `what-web3-can-cant-do`, `what-you-can-do-ethereum`, `which-chain-right`, `why-accept-crypto`, `why-local-matters`, `why-measurement-matters`, `why-regens-interested`, `writing-grant-proposals`.

#### Dedup-within-survivors (5 leaf-slugs in >1 path; first sorted path kept, the other recorded)

| Leaf slug | Kept | Discarded duplicate |
|---|---|---|
| `choosing-starting-point` | `content/2-applied/2.1-local-nodes/…` | `content/2-applied/2.14-web3-action-plan/…` |
| `commitment-pooling` | `content/2-applied/2.9-tokenomics-community-currencies/…` | `content/3-playbooks/3.2-implementation-patterns/…` |
| `community-currencies` | `content/2-applied/2.9-tokenomics-community-currencies/…` | `content/3-playbooks/3.4-case-studies-theme/…` |
| `operational-security` | `content/2-applied/2.11-operational-security/…` | `content/2-applied/2.11-web3-safety-security/…` |
| `wallet-security` | `content/2-applied/2.10-blockchain-program-delivery/…` | `content/2-applied/2.11-web3-safety-security/…` |

These discarded duplicates are recorded (not lost) — a human can pick the better source per slug.

#### Topically-close survivors (flag for human merge — slug differs, topic overlaps a live/sibling article)

These are survivors by the slug rule, but a human should review whether to merge them into an existing entry rather than keep as a distinct draft:
- `gitcoin-grants` ~ live `gitcoin-grants-qf`
- `dao-governance` ~ live `dao-governance-models`
- `dao-tooling-guide` ~ live `dao-tooling`
- `local-nodes-and-dao` ~ live `local-nodes-and-daos`
- `local-currency-design` ~ live `local-currency`
- Within the survivor set: `setup-first-wallet` ~ dropped `setting-up-first-wallet`; `benefits-participation` ~ `benefits-of-participation`; `hypercerts` / `hypercerts-impact-certificates` (vs dropped `impact-certificates-hypercerts`); `sarafu` / `sarafu-case-study` / `africa-kenya-sarafu` / `refi-kenya-sarafu` (overlapping Sarafu region case studies); `joining-a-local-node` / `joining-process`.

#### Research dumps salvaged (4) → `data/resources-salvaged.yaml`

All 4 → `resource` objects with `resource_type: research-dump`, `maturity: raw`, `public_use: raw-lead`, `ai_assisted: true`, `salvaged_from` = `archive/luizfernando-refidao:research/…`. Kept **raw** (deep-research artifacts, 2,500–3,900 words each — never auto-promoted):
- `gitcoin-grants-research` ← `research/gitcoin-grants-research.md`
- `gnosis-safe-research` ← `research/gnosis-safe-research.md`
- `refi-dao-content-inventory` ← `research/refi-dao-content-inventory.md`
- `silvi-protocol-research` ← `research/silvi-protocol-research.md`

#### Archive tags skipped (recorded — no silent omission)

The plan named the working-tree `content/` + the refidao research dumps as the **canonical** salvage sources; the other archive tags were optional spot-checks (default = skip). **Skipped** (not harvested): `archive/critiq-generator`, `archive/heen-ai-add-planning-docs`, `archive/heen-ai-tier-1-articles`, `archive/merge-astro-site`, `archive/onboarding-journeys-v1`, `archive/org-os-overlay-pre-converge`. Note on `archive/heen-ai-tier-1-articles` specifically: it carries the old `content/` tier-1/2 pipeline, which is the **same lineage** as the working-tree `content/` tree already harvested here (the working tree is the later, more complete state of that pipeline), so it would be a subset/superset overlap, not new content — skipped as redundant. If a future pass wants the other tags, they remain available read-only via `git show <tag>:<path>`.

#### Validation

Every emitted object validated **in the harvest gate** via the framework API `validateObject` — `encyclopedia-entry` for 144 salvaged entries, `resource` for 4 research dumps. Result: **144/144 entries valid, 4/4 resources valid** (0 failures). The harvest refuses to write on any failure and exits non-zero.

Baseline preserved: framework package tests 38/38 pass (package consumed read-only, untouched — `git status` clean); processor tests 32/32 pass (24 prior + 8 new); `npm run build` builds (124 pages); the canonical `data/encyclopedia.yaml` / `data/concepts.yaml` / `data/tracks.yaml` / `data/resources.yaml` regenerate **byte-identical** (SHAs unchanged) — the salvage is fully additive and idempotent.

---

## Review Summary

### Task 6 — CSIS review pass (structural-integrity audit of the processed content)

A CSIS-informed (not CSIS-conformant — `skills/csis-review` SKILL R7: *flags for review, does not certify*) review pass over **every object this plan emitted**: `data/encyclopedia.yaml` (119 `encyclopedia-entry`), `data/concepts.yaml` (8 `concept-lineage`), `data/tracks.yaml` (3 `track`), `data/resources.yaml` (1616 `resource`), `data/source-systems.yaml` (89 `source-system`), `data/encyclopedia-salvaged.yaml` (144 salvaged entries), `data/resources-salvaged.yaml` (4 salvaged resources) — **1983 objects total**.

#### `checkInvariants` — mechanically-enforceable invariants (SP8)

Ran the framework's `checkInvariants` (`packages/toolkit-framework/src/invariants.mjs`, exported from `src/index.mjs`) over all 1983 emitted objects. It enforces the schema-mechanical subset of the 16 distinctions: **Track ≠ Deployment** (a track must not carry the 6 Deployment structural fields), **AI-assisted ≠ Human-reviewed** (`ai_assisted: true` + `maturity: reviewed` is forbidden), and **raw ≠ reviewed / Inclusion ≠ Endorsement** (a `maturity: raw` or `lifecycle_state: raw-lead` item cannot be `public_use: reviewed-for-*`).

**Result: 0 violations across all 1983 objects** (clean). Nothing required downgrading. This corroborates the earlier task-level honest-state discipline: tracks carry no deployment fields; no AI-assisted object claims `reviewed`; no raw resource/source-system overclaims a `reviewed-*` public_use.

#### Check #1 — nothing raw claims review

No object with `maturity: raw` (or `lifecycle_state: raw-lead`) carries a `public_use: reviewed-for-*`. Audited resources + source-systems specifically (the lift output, where this risk lives): `data/resources.yaml` is uniformly `maturity: raw` / `public_use: raw-lead` (1616/1616), `data/source-systems.yaml` uniformly `raw` / `raw-lead` (89/89), `data/resources-salvaged.yaml` uniformly `raw` / `raw-lead` (4/4). **Result: 0 violations — clean.** No downgrade needed (Task 2's lift was strict — `review_status` is preserved in `notes` but never used to promote). No lift-script edit was required.

#### Check #2 — AI-pipeline articles aren't `maturity: reviewed`

Programmatic count over both encyclopedia files: `data/encyclopedia.yaml` — **0 of 119** entries `maturity: reviewed` (0 `ai_assisted + reviewed`); `data/encyclopedia-salvaged.yaml` — **0 of 144** `maturity: reviewed` (0 `ai_assisted + reviewed`). The `HUMAN_REVIEWED` allowlist remains empty (no evidence of independent human sign-off on any of the AI-pipeline drafts). **Result: clean — every encyclopedia entry stays `draft`.**

#### Check #3 — high-risk topics carry a `public-use-boundary` (the main new work)

CSIS check §5 (*"high-risk content carries a public-use-boundary"*). **High-risk** = financial-instrument / custody / security guidance whose **error can cause real loss** (funds drained, keys compromised, tax/legal exposure) — not merely a page that mentions money.

**Keyword rule** (matched on `id` + `title`, implemented as `isHighRisk` in `scripts/process-content.mjs`): `wallet(s)` · `seed-phrase` · `multisig`/`multi-sig` · `treasury`/`treasuries` · `custod*` · hot/cold-storage · `scam(s)` · `key-management`/`private-key` · `airdrop` · `stablecoin` · `gas-fee` · `tax`/`tax-implications` · org-security (`security best practices` / `operational security` / `incident response` / `security basics`) · token design/economics (`token incentive`/`economics`/`supply`/`airdrop`, `tokenomics`, `community token`, `social tokens`) · `insurance`/`risk management` · `recovery-planning`. **Deliberately NOT classified** (anti-over-classification): general explainers (`what-is-dao`) and grant/fundraising-**strategy** pages (`funding-landscape`, `funding-your-node`, `writing-grant-proposals`, `gitcoin-grants-qf`, `rpgf`, `public-goods-funding`, `grants-daos-foundations`, `sustainable-funding-mix`, …) — these carry *program* risk, not custody/security risk — and pure-concept token explainers (`what-are-tokens`, `token-standards`, `tokens-coordination-tools`). All of the plan's explicitly named in-set examples are caught (`setting-up-multisig-treasury`, `seed-phrases`, `common-scams`, `conducting-token-airdrop`, `tax-implications`, `stablecoins`, `gas-fees`, `treasury-best-practices`, `key-management`, `wallet-security`); all named not-high-risk cases are excluded (asserted in tests).

**Boundary attached** (lightweight idiomatic form): a `public_use_boundary` sub-object on the entry — `{ tier: public-with-caveat, review_type: "high-risk: financial/security guidance — needs human review before relied upon (CSIS check #3)" }`. `encyclopedia-entry extends frontmatter` (open model), so the extra field is permitted and the entry still validates; the sub-object itself validates against `schemas/public-use-boundary.yaml` (`required: [tier]`, tier ∈ enum). **Tier = `public-with-caveat`** (not `restricted-*`): these pages **are** published on the live v1 site, so they're public — but they carry real risk and need human review before relied upon. The boundary **flags** for review; it does not certify.

**34 high-risk entries matched** (15 canonical + 19 salvaged):

- `data/encyclopedia.yaml` (15): `common-scams`, `custodial-vs-noncustodial`, `gas-fees`, `hot-vs-cold`, `multisig-setup`, `recovery-planning`, `security-best-practices-orgs`, `seed-phrases`, `setting-up-first-wallet`, `social-tokens-creator`, `stablecoins`, `tax-implications`, `treasury-management`, `wallet-comparison-guide`, `what-is-wallet`.
- `data/encyclopedia-salvaged.yaml` (19): `setup-first-wallet`, `wallet-security`, `operational-security`, `incident-response`, `insurance-risk`, `key-management-policies`, `key-management`, `multisig-management`, `scam-prevention`, `treasury-best-practices`, `designing-token-incentives`, `token-economics-basics`, `token-supply`, `tokenomics-mistakes`, `gnosis-safe`, `conducting-token-airdrop`, `creating-community-token`, `setting-up-multisig-treasury`, `wallet-options`.

#### Idempotent-generator note (no hand-edited generated files)

The boundary attachment is implemented **in the generator** (`scripts/process-content.mjs` — `isHighRisk` + `highRiskBoundary`, attached during both the canonical `articleToEntry` and the salvaged `articleToSalvagedEntry` passes), **not** hand-edited into the YAML (which would be clobbered on the next run). The encyclopedia files were then **regenerated**. Re-running the generator twice produces **byte-identical** output (md5-verified), so the artifacts remain reproducible and idempotent. This **intentionally** changes `data/encyclopedia.yaml` from its Task-3 byte-identical state: it now carries `public_use_boundary` sub-objects on the 15 high-risk canonical entries (and 19 salvaged). All other emitted files (`concepts.yaml`, `tracks.yaml`, `resources.yaml`, `source-systems.yaml`, `resources-salvaged.yaml`) regenerate unchanged. New tests added to `scripts/process-content.test.mjs` (6) assert the classifier (`seed-phrases` → boundary; `what-is-dao` → none), boundary validity, and that high-risk entries still validate as `encyclopedia-entry`.

#### Tests / build / counts

Processor tests **38/38** pass (32 prior + 6 new); framework package tests **38/38** pass (consumed read-only, untouched); `npm run build` builds **124 pages**; canonical counts intact — **119** encyclopedia entries, **8** concepts, **3** tracks (plus 144 salvaged entries, 4 salvaged resources, unchanged). Post-regeneration validation: 34 boundaries, **0 invalid boundaries, 0 invalid entries, 0 invariant violations**.

#### Honest-state attestation

**Raw was never promoted** (resources + source-systems stay `raw`/`raw-lead`; 0 reviewed overclaims). **AI-drafts were never marked `reviewed`** (0 of 263 encyclopedia entries claim `reviewed`; `HUMAN_REVIEWED` allowlist empty). **High-risk financial/security topics are now bounded** (34 entries carry a `public-with-caveat` `public_use_boundary` flagging them for human review before relied upon). The review **flags, it does not certify** — escalate to a human (and, for CSIS constructs, a CSIS-literate reviewer) before any of this content is treated as reviewed.
