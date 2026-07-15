# The Convergence — one system, three builds

**Date:** 2026-07-15 · **Audience:** the toolkit group (Matty, Heenal, Durgadas, Koi, Rather, Afo) · **Author:** Luiz (operator), agent-assisted
**Status:** draft-and-present · **Evidence:** every claim links to a verifiable artifact in this repo

> **The story in one sentence:** Matty specified a knowledge-commons production system, Heenal built
> its public face, and the framework built here turned the specification into a running machine —
> three independent builds that converge on the same system, now closing into one loop.

---

## 1 · What was built, and where

**The machine** lives at [`packages/toolkit-framework/`](../packages/toolkit-framework/) — a portable,
tested implementation of the capture → accept-gate → review-promote → store loop:

| Piece | Where | State |
|---|---|---|
| Core engine (ingest, review, storage, adapters, invariants) | `packages/toolkit-framework/src/` | ✅ **110/110 tests** |
| Object schemas (source-system, concept-lineage, option-entry, track, deployment, claim-evidence, …) | `packages/toolkit-framework/schemas/` | ✅ shipped |
| Agent skills (ingest, review-promote, register-source, map-ontology, capture-and-route, csis-review, compose-journey) | `packages/toolkit-framework/skills/` | ✅ shipped |
| Walkthrough with real output | [`GETTING-STARTED.md`](../packages/toolkit-framework/docs/GETTING-STARTED.md) | ✅ |

**Two corpora have already been fed through it** — both fully review-gated, nothing auto-promoted:

1. **The toolkit's own content** — 119 articles → **722 typed objects** in [`data/kb/`](../data/kb/)
   (693 in the review queue). Live view: [`/self-ingestion`](https://luizfernandosg.github.io/regen-toolkit/self-ingestion/).
2. **A prototype slice of Matty's Canonical_DB** — 127 curated rows → **146 objects** in
   [`kb-handoff/`](../kb-handoff/). Live view: [`/handoff`](https://luizfernandosg.github.io/regen-toolkit/handoff/).
   The machine's duplicate guard independently caught the same 4 duplicate pairs Matty had hand-flagged;
   his sensitive rows were boundary-flagged at the gate.

**The coordination instance** is this repo on the `regen-toolkit-os` branch — the org-os overlay
(memory, heartbeat, plans, skills) that wraps team work around the master doc.

## 2 · The convergence — why this matters

Three builds happened largely independently, and they turn out to be **the same system**:

- **Matty's Database_Spec** (July handoff) specifies a production object model, migration zones
  (raw → canonical → reviewed → public), an 8-dimension status model, and a preserve → normalize →
  review → publish operating rule.
- **The toolkit-framework** implements typed object families, a maturity ladder, orthogonal status
  axes, a human-gated promotion pipeline, and idempotent ingestion — built before reading his spec.
- **Heenal's knowledge site** (67 articles live at
  [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app), 254-article inventory,
  5 learning paths, Knowledge + Tag Explorers) renders the commons publicly — Layers 2
  (Encyclopedia) and 7 (Tracks & Composition).

The receipts, point by point:

- His zones = the framework's maturity ladder — [crosswalk §4](reports/2026-07-15-framework-masterdoc-crosswalk.md)
- His normalization layer = the `maps_to_core` crosswalk
- His 87 hand-flagged duplicates = the machine's B5 idempotency guard
- His Definition of Done, scored honestly: **7 ✅ / 8 🟡** — [DoD conformance](reports/2026-07-15-definition-of-done-conformance.md)
- His §40 ("the schema-to-master-architecture crosswalk" the Guide asks Luiz to return) **is** the
  [crosswalk report](reports/2026-07-15-framework-masterdoc-crosswalk.md) + [`data/crosswalks/handoff-database-spec.yaml`](../data/crosswalks/handoff-database-spec.yaml)

Where the builds *diverge*, the divergence is the roadmap, not noise: first-class relationship
records, a person/organization entity schema, and 3 missing status dimensions
(currentness / confidence / maintenance) — tracked as T4 in
[`plans/handoff-integration.md`](plans/handoff-integration.md).

## 3 · The loop that now closes

```
   Matty's framework & curated data          the toolkit's own articles
        (Database_Spec, Canonical_DB)             (119 articles, 254 inventory)
                    │                                      │
                    └────────────┬─────────────────────────┘
                                 ▼
                    THE MACHINE  (toolkit-framework)
              ingest → typed objects → accept gate → stored as `raw`
                    provenance kept · duplicates guarded · boundaries flagged
                                 │
                                 ▼
                    THE HUMAN GATE  (review-promote)
              named reviewers promote honestly, never in bulk
              AI-assisted flag clears only on human review
                                 │
                                 ▼
                    THE COMMONS  (reviewed, provenance-tracked objects)
                                 │
                                 ▼
                    HEENAL'S SITE  (the public render layer)
              encyclopedia · tracks · journeys · explorers
```

Before: the site's content was hand-maintained and the master doc was a 24,700-line specification.
After: **the site becomes the public rendering of a reviewed commons**, and the master doc's
specification is a running, tested machine. Content work stops being copy-editing pages and becomes
**tending the review queue** — which is exactly where editorial judgment belongs.

## 4 · The content pipeline, kickstarted

**839 objects are awaiting review** (693 from the articles + 146 from the handoff slice) — the
framework's review queue. Most are explicitly `raw`; the rest are unclassified pending a first
pass. The review pass is the standing workflow from here on:

- **Tool:** `review promote <ref> --maturity <v> --reviewer "<name>"` — guided by the
  [review-promote skill](../packages/toolkit-framework/skills/review-promote/SKILL.md)
- **Done so far:** slice 1 (source-systems)
- **Priority order:** high-risk public-use boundaries → person/org fallbacks → inferred option
  categories (all flagged for review at ingest)
- **Who:** any named reviewer — this is where Heenal's editorial lane and Matty's curation lane plug
  directly into the machine

## 5 · Who holds what

| Person | Lane | Interface to the machine |
|---|---|---|
| **Matty** | Editorial — master narrative (6-Part transform), raw-notes routing, Canonical_DB curation | Feeds curated rows in; reviews handoff-derived objects; [operates the agents](onboarding/operate-the-toolkit-agents.md) |
| **Heenal** | Layers 2 + 7 — encyclopedia, tracks, the public site | Reviews content objects; site renders what clears the gate |
| **Luiz** | Technical — the machine, ingestion, crosswalks, instance ops | Runs ingestion; evolves the framework (T4); keeps 110/110 green |
| **Durgadas** | CSIS / frame-language review lens | `csis-review` skill — a lens at the gate, never a conformance claim |
| **Everyone** | Named reviewer | The review queue |

## 6 · What happens next

1. **Jul 16 call** — walk the convergence live, shape the capital proposal, set Matty up to operate
   the agents ([call brief](briefings/2026-07-16-toolkit-call-brief.md)).
2. **Consolidation** — `regen-toolkit-os` becomes the dev branch, `main` the prod branch; PR to
   [`explorience/regen-toolkit`](https://github.com/explorience/regen-toolkit) `main`, then migration
   to the Regen Coordination GitHub org. Raw `kb-handoff/` objects stay on dev until reviewed.
3. **T4** — framework evolution from the crosswalk gaps (relationship records first).
4. **T3b** — full Canonical_DB ingestion (~2,689 rows) once Matty green-lights family priority.
5. **Review pass** — the standing pipeline of §4, continuing from source-systems.
6. **Contributor onboarding** — the Matty setup generalized so any contributor can clone, initialize,
   and operate.

---

*Verified today (2026-07-15): framework tests green · 722 objects indexed in `data/kb/` (693
review-queued) · 146 in `kb-handoff/` (146 review-queued) → 839 awaiting review. Every number in this
page is re-derivable from the repo — `npm test` in `packages/toolkit-framework`, and
`kb index --adapter repo-data` / `--adapter kb-folder --target kb-handoff` for the corpora (their
`review_queue` fields sum to 839). The `/convergence` schema map's per-type raw/reviewed counts derive
from `src/data/kb-schema-graph.json` (`npm run generate:kb-viz`).*
