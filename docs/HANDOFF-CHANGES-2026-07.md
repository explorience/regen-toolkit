# Handoff Changes — Matty's July 2026 Iteration

**Date received:** 2026-07-14 · **Source:** `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/` (Matty's complete current-state handoff package; also on Google Drive)
**Status:** intake + orientation map. **This is a map, not the new canonical master** — it points at the authoritative files. `docs/MASTER.md` (2026-06-15) remains canonical until Matty completes his next review cycle and hands off the final. **Do not restructure the master narrative from this** — the 6-Part transform is Matty's editorial lane (see §6).

Integration plan: [`docs/plans/handoff-integration.md`](plans/handoff-integration.md).

---

## 1 · What arrived — a package, not a doc

The iteration is no longer a single Google Doc (previous: 2026-06-15, ~30.8k lines). It's a structured **current-state handoff package** with an authority hierarchy (from `00_ReadMe/Guide.docx`, the governing entry point):

| # | File | Governs |
|---|---|---|
| 1 | `02_Core/Canonical_DB.xlsx` | Canonical staging source — ingestion identity |
| 2 | `01_Specs/Database_Spec.docx` | Production object model, pipelines, promotion gates, acceptance tests |
| 3 | `01_Specs/Master_Spec.docx` | Target 6-Part / §0–43 master-document architecture |
| 4 | `01_Specs/Future_Packet.docx` | Routing, source-system waves, tracks, visuals, open decisions |
| 5 | `02_Core/Master_Draft.docx` | Current master architecture + raw intake corpus (19.7k lines) |
| 6 | `02_Core/Discovery_Pool.xlsx` | Broad lead pool (promotion-gated) |
| 7 | `03_Annex/A03–A14.xlsx` | Research annexes |

**Conflict rule (Guide §2):** preserve first — prefer the canonical workbook for ingestion identity, primary sources for facts, visible crosswalks for architecture; preserve unresolved conflicts rather than flattening.

## 2 · What's settled vs open (Guide §1)

**Settled:** the 10-layer architecture; the 6-Part narrative reorg; 8 status dimensions kept separate; Canonical_DB as staging truth; Discovery_Pool as lower-review leads; AI carries reversible/inspectable work with consequential decisions gated; **the Eight Forms of Capital adopted as shared language** (Master_Spec decision #5); one coherent current-state package (no version-history maze).

**Open (record defaults, reopen on trigger — do not block):** final public wording + visual identity; final root/subtype vocabulary; governance/stewardship structure; which low-risk AI outputs auto-promote; which branches get stewarded/federated first; any CSIS conformance claim (never claimed).

## 3 · The convergence — Matty's spec ≈ the framework machine

The central finding (full crosswalk: [`docs/reports/2026-07-15-framework-masterdoc-crosswalk.md`](reports/2026-07-15-framework-masterdoc-crosswalk.md)):

| Matty's handoff | The framework (built, shipped 2026-07) |
|---|---|
| Zones: raw discovery → canonical → reviewed → public-use views | maturity ladder + public-use-boundary tiers |
| Rule: preserve → normalize → review → publish | ingest → accept-gate → review-promote → store |
| Boundary invariants (AI-assisted ≠ human-reviewed; Claim ≠ evidence; Public ≠ commons) | born-rules + K1 axes |
| Discovery_Pool → Canonical_DB promotion | ingest → review-promote (human gate) |
| Normalization layer (crosswalk, predicate map, controlled vocab) | `maps_to_core` crosswalk + relationships |
| 87 duplicate/conflict flags | the **B5 overwrite guard** (65 collisions caught 2026-07-14) |
| 6 canonical families | schemas: source-system, resource, option-entry, claim-evidence, implementation-record, relationships |
| **Definition of Done #1** (idempotent re-run) | the **idempotency guard, demonstrated** |

**§40 of the target master ("Architecture/Framework/Data/AI/Interface Crosswalk") is exactly the "schema-to-master-architecture crosswalk" the Guide (§10) asks Luiz to return; §35 names `toolkit-framework` + `regen-toolkit-os`. The framework is Part VI.** Definition-of-Done conformance: [`docs/reports/2026-07-15-definition-of-done-conformance.md`](reports/2026-07-15-definition-of-done-conformance.md).

## 4 · Target master structure (Master_Spec) — reference only

10 layers intact; narrative reorganized into **6 Parts / §0–43**:
- **Part I** — Orientation, Purpose, Context, Boundaries (§0–6)
- **Part II** — System Architecture, Meaning, Sensemaking, Epistemics (§7–14)
- **Part III** — Source Ecology, Field Intelligence, Expansion (§15–20)
- **Part IV** — From Knowledge to Deployment, Implementation, Learning (§21–26)
- **Part V** — Structural Floors, Generative Capacities, Commons Governance, Evolution (§27–34)
- **Part VI** — AI-Assisted Technical Realization and Working Toolkit (§35–43)

New first-class sections include Concept & Idea Ecology (§11), System Models/Leverage (§12), Evidence Pluralism & Communities of Practice (§13), Ontology/Classification Governance (§14), Publications (§18), and the technical realization set (§35–42). Full current→target section map in `Master_Spec.docx` §6.

## 5 · The data (inventory 2026-07-14)

- **Canonical_DB.xlsx** — 119 sheets; its own `Sheet Role Registry` marks **6 as import targets**: Source-System Cards (67) · New Objects (878) · Option Candidates (345) · Claims & Cautions (504) · Implementation Memory (341) · Relationship Leads (554) = **~2,689 curated rows.** Plus a 9-sheet normalization layer (type crosswalk, predicate map, controlled vocab, 87 dup-flags) that configures the ingestion mapper. Type-prefixed canonical IDs (`org:`, `tool:`, `source-system:`, `person:`).
- **Discovery_Pool.xlsx** — 4,951-row `All Objects Registry` (`RKC-#####` IDs, full status columns + candidate-routing flags), upstream of Canonical_DB (Zone A leads).
- **Annexes A03–A14** — **no new data**; superseded checkpoint snapshots of Canonical_DB as it grew. **Skip/archive** (byte-identical sheet-name prefixes; row counts converge to Canonical_DB's).

## 6 · Division of labor (Guide §10)

- **Matty / editorial:** the 6-Part / §0–43 master transformation, raw-notes routing, source-system waves. He's running **another review cycle before final handoff** — so we do **not** restructure the master narrative now.
- **Luiz / technical (the [handoff-integration](plans/handoff-integration.md) plan):** ingestion prototype + config, the §40 crosswalk, migration manifest + decision ledger, unresolved-decisions report, public-safe view, AI-quality/review-burden metrics, implementation memory. **Most already exists from the [framework-validation-pass](plans/framework-validation-pass.md).**

## 7 · Guard rails

- The handoff package is **read-only source**. `docs/MASTER.md` is Matt's — derive, don't restructure.
- **Public/private caveat (Matty, 2026-07-12):** the handoff wasn't reeled in for public/private; the AI may be wrong about insinuated relationships. The framework's **public-use-boundary + high-risk flagging** handles this at ingest — **nothing from the handoff reaches a public view without the review-promote gate** (Zone D discipline).
- The 12 annex files are redundant → not committed / not ingested.
