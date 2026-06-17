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

---

## Review Summary

_TODO — CSIS review summary added by Task 6._
