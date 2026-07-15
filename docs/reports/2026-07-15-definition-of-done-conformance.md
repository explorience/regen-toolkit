# Definition-of-Done Conformance — the framework vs the Guide's first milestone

**Date:** 2026-07-15 · **For:** the Jul 16 toolkit call + Matty
**Source of the checklist:** `RKC_Handoff_July_2026_FINAL_VERIFIED/00_ReadMe/Guide.docx` §12 ("Definition of done for the first milestone")
**Companion:** [`docs/reports/2026-07-15-framework-masterdoc-crosswalk.md`](2026-07-15-framework-masterdoc-crosswalk.md)

> **The point.** The Guide's first-milestone checklist reads like a conformance test for the machine
> we already shipped. Scored honestly below: **most items are demonstrated with evidence from the
> 2026-07 framework-validation-pass** (722 objects ingested, the B5 guard, the human review pass); the
> rest are partials that map cleanly onto the planned framework evolution (T4) and the full Canonical_DB
> ingestion (T3b). Nothing here is a claim of certification — it's an honest "here's what runs today."

Legend: ✅ demonstrated · 🟡 partial (gap named) · ⬜ not yet.

| # | Guide §12 milestone criterion | Status | Evidence / gap |
|---|---|---|---|
| 1 | Re-running the same batch does not create duplicate canonical objects | ✅ | The **B5 idempotency guard**: `sameStoredObject` keys by id/content; re-store overwrites in place, distinct-but-same-title objects are preserved not clobbered. The full 119-article run caught **65 real collisions** (`framework(fix): B5 …`, 2026-07-14). |
| 2 | Original workbook values and source locators remain inspectable | ✅ | Every object carries `provenance.origin` (source path/URL) + `source_lineage`; born-rule enforced at the accept gate. |
| 3 | Source systems and their individual artifacts remain distinct | ✅ | `source-system` schema is separate from `resource`/artifact; the 21 registered source-systems were reviewed as distinct cards (2026-07-14). |
| 4 | A publication system can contain individual essay artifacts + linked concepts/claims/branches | 🟡 | `source-system` (type `blog`/`publication`) + `resource` artifacts + `relationships` express this; a first-class **publication-system → artifact containment** is a **T4 gap**. |
| 5 | Claims can have supporting, qualifying, and contradicting evidence | 🟡 | `claim-evidence` links claim↔evidence; supporting/qualifying/**contradicting** as a first-class evidence-stance enum is a **T4 gap** (currently expressed via relationships). |
| 6 | Relationships preserve source, time, confidence, review, and public-use state | 🟡 | `relationships` carry provenance + maturity; **confidence** and **currentness** per-edge are **T4 gaps** (Matty's status dims we don't model yet). |
| 7 | A person-affiliation candidate cannot become public automatically | ✅ | `review-promote` is the human gate; born-rules forbid raw→public; promotion beyond `raw` requires a named `--reviewer`. Demonstrated in the 2026-07-14 review pass. |
| 8 | A stale/discontinued source can leave current public views without being deleted | ✅ | The `deprecated` maturity state (used for the 6 duplicate source-systems, 2026-07-14) removes an object from current/review views without deletion; history retained. **Currentness** as its own dimension → T4. |
| 9 | A merge can be inspected, corrected, or reversed | ✅ | B5 preserves both sides + emits a `collisions` report; `review-promote` is per-object and reversible (demote to `raw`). The source-system merge (3→1, 4→1, 2→1) was inspectable + tombstoned, 2026-07-14. |
| 10 | A restricted artifact cannot enter a public track | ✅ | `public-use-boundary` tiers + the review gate; nothing raw/ai-assisted reaches a public view without a reviewed public-use decision. |
| 11 | An implementation case can update an option without overwriting prior evidence | 🟡 | `implementation-record` + `option-entry` are distinct object families; the append/guard model preserves prior evidence, but the explicit "case updates option, prior evidence retained" flow is exercised in **T3b**. |
| 12 | A branch can remain deferred with an explicit reopening trigger | 🟡 | Handled at doc level today (`docs/BACKLOG.md`); a first-class **branch/backlog/decision object family** with `reopening_trigger` is a **T4 gap**. |
| 13 | A public-use decision exposes only approved fields | ✅ | `public-use-boundary` tiers + Zone-D-style derived public views (the gated-page pattern proven in the ReFi DAO hub); public views are derived, not duplicate registries. |
| 14 | AI involvement, correction rate, and human review burden can be measured | 🟡 | `ai_assisted` flag on every object + `review_queue` counts + the 722-run stats give involvement + burden; a **correction-rate / review-burden dashboard** is not built yet (T4 / metrics). |
| 15 | Every canonical row has a destination, deferral, restriction, unresolved state, or exclusion reason | 🟡 | The framework's manifest/index accounts for every ingested item's destination; "every Canonical_DB row accounted" is proven only when the **full ingestion (T3b)** runs against the migration manifest. |

**Tally:** 7 ✅ · 8 🟡 · 0 ⬜. The partials are not unknowns — each names a concrete next step in T3b (full ingestion) or T4 (framework evolution: confidence/currentness/maintenance dimensions, branch/backlog/decision + publication-system families).

## The anti-goals also match (Guide §12 "Do not optimize for")

| Guide says do NOT optimize for | Framework posture |
|---|---|
| Maximum row count | Distinct families, review-gated; 722 objects all `raw`, nothing auto-published. |
| One universal resources table | Separate schemas per family; ingestion ≠ storage (adapter seam). |
| A public people/ecosystem-ranking graph | No ranking; relationships are sourced assertions, not scores. |
| Automated authority or trust scores | None; maturity is a human-gated K1 state, not a computed score. |
| Recommendation interfaces before cases/risk/public-use review exist | No recommendation UI; review-first. |
| Permanent governance before maintenance needs are understood | Functions-first; no fixed offices. |
| A polished website that hides unresolved data | The live pages show `raw`/`review-queue` counts honestly. |

## Bottom line for the call

The framework isn't *aligned with* the Guide's milestone — it largely **is** the milestone, running on 722 real objects. The honest gaps (evidence stances, per-edge confidence/currentness, branch objects, a burden dashboard, full-migration accounting) are a short, concrete list — the T4 + T3b agenda, not a redesign.
