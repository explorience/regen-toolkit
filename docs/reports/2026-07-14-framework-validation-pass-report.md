# Framework Validation Pass — Consolidated Report

**Date:** 2026-07-14 · **Author:** Luiz (operator) · **For:** the Jul 16 toolkit call + the team
**Scope:** `regen-toolkit` instance + `packages/toolkit-framework` · **Branch:** `regen-toolkit-os`
**Plans:** [master](../plans/framework-validation-pass.md) · [design](../plans/framework-build/2026-07-13-framework-validation-pass-design.md) · [implementation](../plans/framework-build/2026-07-14-framework-validation-pass-implementation.md)

---

## 1 · Executive summary

Since the 2026-07-10 council, the toolkit went from *"the machine is built"* to *"the toolkit has been
run through its own machine."* In one focused pass we:

- **Consolidated the plan surface** — one master plan (`framework-validation-pass`) now governs the arc; three overlapping plans were archived.
- **Landed the four kernel fixes** the ingestion needed — including the **B5 silent-overwrite guard**, the real data-loss-at-scale bug the ReFi DAO run surfaced. Framework tests: **100 → 110, all green.**
- **Ran the toolkit's own content through the real 0.2 pipeline** — a validated 19-article slice produced **154 typed objects**; the **full 119-article run is underway** (see §4).
- **Produced three shareable artifacts** — a live web page, an Obsidian canvas, and an honest diff report — plus a **staged 8-Forms-of-Capital contribute-back proposal** for Matt.
- **Deployed the live page** to the GitHub Pages preview.

The through-line for the call: **the feedback loop is now visibly closed.** The ReFi DAO run found a
framework bug → we fixed it in the framework → the toolkit's own self-ingestion is the first
beneficiary. And running real content generated the *next* round of framework fixes. The method
improves itself.

## 2 · The plan (V0) — one master plan, symmetric to ReFi DAO

`docs/plans/framework-validation-pass.md` now consolidates the framework arc, mirroring the ReFi DAO
`kms-koi-pipeline` consolidation. Superseded + archived with pointer banners:
`site-and-content-convergence`, `framework-instance-split`, `resource-db-v3-lift`. `CONVERGENCE-PIPELINE`
stays the strategic map; its P2/P3 execution now lives here. QUEUE + HEARTBEAT reconciled.

## 3 · The kernel fixes (V1) — TDD, framework 110/110 green

| Fix | Why | Evidence it mattered |
|---|---|---|
| `source-system` enum +`blog` +`publication` | 60/89 sources fell back to `database` | Real run typed 3 sources as `blog`/`publication` (greenpill, chainalysis, cryptoaltruists) |
| `held` maturity state | ~700 resource rows had no "held for review" home | Added + counts in the review queue |
| `track.outcome` scalar→array + real `type: array` enforcement in the validator | schema correctness; the validator never checked `type` | 2 tracks produced with array outcomes |
| **B5 silent-overwrite guard** (both storage adapters) | **distinct objects sharing a title-slug silently clobbered** — real knowledge loss | **Fired on real data** — `decentralization` + `obsidian` each appeared twice; both preserved |

Origin: the ontology-comparison §8 + the ReFi DAO routed feedback ledger (B5). All TDD; the subagents
also corrected three wrong assumptions in the plan (real validator returns `{valid, errors}`;
`isAwaitingReview`/`hashContent` live elsewhere; the real bug-encoding test was in `adapters.test.mjs`).

## 4 · The self-ingestion (V2)

**Validated slice (committed):** 19 of 119 articles, chosen to exercise every object type + four edge
cases, run through the real `ingest` pipeline (capture → accept-gate → store) into `data/kb/`:

- **`total: 1 → 155`** (154 new typed objects). All `raw`, all in the review queue, **nothing promoted.**
- By type: resource 48 · claim-evidence 33 · concept-lineage 30 · encyclopedia-entry 18 · public-use-boundary 9 · signal 9 · source-system 6 · track 2.
- Edge cases landed: the B5 guard preserved same-title collisions; the widened enum typed real blogs/publications; the machine unprompted flagged `public-use-boundary` objects for cultural/Indigenous attribution and `signal` objects for missing return-paths and unsourced figures.
- Full detail: [`docs/reports/2026-07-13-self-ingestion-diff.md`](2026-07-13-self-ingestion-diff.md).

**Full 119 run:** **underway as of this report** — the remaining 100 articles are prepared as work
orders and being ingested by parallel runners; the numbers above will grow to the full corpus. (This
was originally sequenced post-demo; pulled forward at the operator's request so the call sees the
whole corpus, not just the slice. All objects remain `raw` and review-gated — the human review pass is
still owed and un-bypassed.)

## 5 · The artifacts (V3) + capital proposal (V4)

- **Live page** — `/self-ingestion/`, rendered from real `data/kb/index.json`, base-aware, reuses the site's design system. **Deployed** to the GitHub Pages preview (`explorience.github.io/regen-toolkit/self-ingestion/`).
- **Obsidian canvas** — `docs/canvases/self-ingestion-diff.canvas`, a 3-lane INPUT → MACHINE → OUTPUT flow with the B5-guard callout.
- **Diff report** — `docs/reports/2026-07-13-self-ingestion-diff.md`, the honest per-type before/after + caveats.
- **Capital proposal** — `docs/proposals/2026-07-13-capital-update-proposal.md`, an `update-proposal` adding the 8 Forms of Capital as a namespaced Layer-B extension (`capital_form` classification + a small `capital_flow` predicate group), core untouched. **Draft only — MASTER not modified.** Notably, MASTER *already* describes the 8 forms as prose ("classification fields, not root entity types"), so the proposal **formalizes Matt's own stated design** rather than introducing a new idea.

## 6 · The framework-feedback harvest (7 items)

Running real content generated the next round of framework fixes — the loop working on the toolkit
itself. All `route: toolkit-framework`, queued for the post-demo round (see the master plan):

1. `source-system.type` has no `platform`/`dapp` value (Gitcoin → `docs-site`, imperfect).
2. `public-use-boundary` doesn't inherit the maturity born-rule (the 146-vs-155 `by_maturity` gap).
3. `public-use-boundary.tier` lacks a "requires domain review" value (caused the one accept-rejection).
4. `list-schemas` doesn't mark ingestible vs structural schemas (wants `--ingestible`).
5. `ingest prepare` should stamp the resolved `source_path` (bare filenames collide with stale drafts).
6. `classifySource` misclassifies colon-terminated prose as `transcript`.
7. No top-level `case-study` schema (resolved via `encyclopedia-entry` + `page_type: case-linked`).

## 7 · Verification

- Framework: `cd packages/toolkit-framework && npm test` → **110 pass / 0 fail.**
- Instance KB: `data/kb/index.json` produced by the real `store` (repo-data adapter), not by hand.
- `docs/MASTER.md`: untouched (capital proposal is draft-only).
- Plan surface: 3 plans archived with banners; QUEUE + HEARTBEAT reconciled.
- Site: `npm run build` green (both default and `GITHUB_PAGES=true`); page live on the preview.

## 8 · What's next

**Before / at the Jul 16 call:**
- Full 119 self-ingestion completes → store → refresh the page/canvas/report numbers.
- Walk the team through the live page + canvas; shape the capital proposal *with* Matt.

**Post-demo (queued in the master plan):**
- The 7 feedback-harvest fixes → the next framework round.
- **V1-intake:** fold the ReFi DAO post-Monty-deep-dive feedback batch as confirmation.
- A **human review pass** over the raw KB (`review promote`, never in bulk).
- Repo migration to the RC GitHub org; the OS-overlay → `main` written proposal; the V3 resource lift (now that the `held` state exists).

## 9 · Pointers

- Master plan: [`docs/plans/framework-validation-pass.md`](../plans/framework-validation-pass.md)
- Diff report: [`docs/reports/2026-07-13-self-ingestion-diff.md`](2026-07-13-self-ingestion-diff.md)
- Capital proposal: [`docs/proposals/2026-07-13-capital-update-proposal.md`](../proposals/2026-07-13-capital-update-proposal.md)
- Live page: `/self-ingestion/` · Canvas: [`docs/canvases/self-ingestion-diff.canvas`](../canvases/self-ingestion-diff.canvas)
- Ontology comparison (the HYBRID + capital basis): [`docs/reports/2026-07-05-ontology-comparison.md`](2026-07-05-ontology-comparison.md)
- Sibling (ReFi DAO): `../../refi-dao-os/docs/agent-plans/kms-koi-pipeline.md`
