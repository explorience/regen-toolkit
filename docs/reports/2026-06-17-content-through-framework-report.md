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

_TODO — populated by Tasks 2–6 (article/entry counts as content is processed through the framework)._

---

## Review Summary

_TODO — CSIS review summary added by Task 6._
