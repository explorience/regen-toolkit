# Handoff Slice Diff — Matty's Canonical_DB through the machine

**Date:** 2026-07-15 · **For:** the Jul 16 toolkit call + Matty
**Source:** `RKC_Handoff_July_2026_FINAL_VERIFIED/02_Core/Canonical_DB.xlsx` (6 canonical-input sheets)
**Stored to:** `kb-handoff/` (kb-folder adapter) — kept **distinct** from the 722-object article corpus (`data/kb/`), per Database_Spec's "do not collapse into one universal table."
**Companions:** [crosswalk](2026-07-15-framework-masterdoc-crosswalk.md) · [Definition-of-Done conformance](2026-07-15-definition-of-done-conformance.md)

> **What this is.** A bounded **"first prototype corpus"** (Guide §8) of Matty's *own curated database*
> run through the framework machine — not the full 2,689-row migration (that's T3b). 127 canonical
> rows across 5 families → **146 typed objects**, each preserving Matty's text + source lineage, all
> `raw` and review-gated. It proves the convergence on real data: his object families ingest cleanly,
> his normalization config guides typing, and his curated duplicate-flags and the machine's automatic
> guard **agree**.

## 1 · Before → after

| | typed objects | source |
|---|---|---|
| **Before** | **0** | `kb-handoff/` did not exist |
| **After** | **146** | 127 Canonical_DB rows → typed objects (+ 4 high-risk boundary companions, + family splits) |

By family: source-system 67 · resource 25 · option-entry 15 · claim-evidence 15 · implementation-record 15 · concept-lineage 5 · public-use-boundary 4. All `raw`; **146 in the review queue; 0 promoted.**

## 2 · The convergence moment — curated flags vs the automatic guard

Matty's `Normalization Flags` sheet hand-flagged **4 duplicate pairs** among the source-system cards
(DUP-SO-26/50/51/52). Ingesting all 67 cards, the machine's **B5 overwrite guard caught the same 4
automatically** — preserving both sides of each (hash-suffixed) instead of clobbering:
`mutual-aid-disaster-relief` · `anamuri` · `fensuagro-iala-maria-cano` · `organizacion-boricua-de-agricultura-ecologica`. His curated dedup and the framework's deterministic guard **agree on his own data** — complementary mechanisms (his catches alias/fuzzy matches too; the guard is automatic + title-level) reaching the same answer here.

## 3 · The public/private caveat, handled at the gate

Matty flagged (2026-07-12) that the handoff wasn't reeled in for public/private. Unprompted, the machine
raised **4 `public-use-boundary` objects** (tier `public-with-caveat`) on exactly the sensitive rows —
Indigenous/Achuar territory + carbon claims (Biocultural Jaguar Credits), gender-violence case data
(Data Against Feminicide), a children's publication (Revista Sem Terrinha), a named settlement
(Assentamento Che Guevara). Nothing sensitive can reach a public view without the review gate (Zone D).

## 4 · What running his data taught us — honest gaps (→ T4)

The ingestion is itself a conformance test of the crosswalk. Real gaps surfaced:

1. **No Person/Organization entity** — 8/30 new-object rows are people or orgs/networks (Ellie Rennie, Buckminster Fuller Institute, ATC Nicaragua…); mapped to `resource` with `original_object_type` preserved. This is the crosswalk's "Entities = GAP" made concrete. **T4.**
2. **Relationships parked** — the 20 Relationship Leads were *not* forced into a schema. The framework has a predicate vocabulary but no first-class per-edge **sourced-assertion record** (Database_Spec Core Decision #3). Left staged to show the gap honestly. **T4 (the flagship gap).**
3. **`implementation-record` assumes a case happened** — Matty's Implementation Memory rows are mostly *prospective candidates to study*; the agents left `what_worked`/`what_failed` empty rather than invent outcomes. His family is closer to a candidate/backlog than a completed case. **T4 semantic-fit note.**
4. **`option-entry` needs a `category`** Matty's sheet doesn't carry — inferred per row (human spot-check flagged).
5. **`source-system.type` has no `organization`/`movement` value** — ~35/67 cards defaulted to `directory` (the largest category is movement/org homepages). **T4 enum add.**

None of these blocked ingestion — every family accepted on the first pass. They're the concrete T4 agenda + curation calls, already named in the [crosswalk §6](2026-07-15-framework-masterdoc-crosswalk.md).

## 5 · Caveats (nothing overclaimed)

- **A prototype slice, not the migration.** 127 of ~2,689 curated rows; the full Canonical_DB ingestion + Discovery_Pool promotion is T3b.
- **All `raw`.** Nothing reviewed or published; the human `review-promote` pass is owed.
- Annexes A03–A14 skipped (redundant snapshots of Canonical_DB).
- The counts preserve Matty's exact field text + canonical/source lineage — this is his data, typed, not re-synthesized.

## 6 · Pointers

- Slice manifest: [`data/kb/_handoff-slice-manifest.yaml`](../../data/kb/_handoff-slice-manifest.yaml)
- Live page: `/handoff/`
- The machine: [`/self-ingestion/`](../../src/pages/self-ingestion.astro) (the 722-object article run) · [framework page](../../src/pages/framework.astro)
