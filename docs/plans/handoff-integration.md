---
id: handoff-integration
title: "Handoff Integration — Matty's July 2026 iteration ↔ the toolkit framework (master plan)"
status: in-progress
priority: 1
scope: regen-toolkit
created: 2026-07-14
updated: 2026-07-14
supersedes: [resource-db-v3-lift]
rescopes: [CONVERGENCE-PIPELINE]
design: docs/plans/handoff-integration/2026-07-14-handoff-integration-design.md
source: docs/RKC_Handoff_July_2026_FINAL_VERIFIED/
sibling_plan: framework-validation-pass
validation_checkpoint: "2026-07-16 toolkit call"
---

## Goal

Integrate Matty's July 2026 handoff (a structured current-state package that independently specifies
the system the framework already is): intake the iteration, produce the crosswalk + Definition-of-Done
conformance the Guide asks Luiz to return, feed a real slice of the curated Canonical_DB through the
machine, set Matty up to run the engine himself — and sequence the full ingestion + master-narrative
refactor after the Jul 16 call.

## The core finding

Matty's Database_Spec = the framework machine. Zones (raw→canonical→reviewed→public) = the maturity
ladder; his normalization layer = the `maps_to_core` crosswalk; his 87 dup-flags = the B5 guard;
Definition-of-Done #1 = the idempotency we demonstrated. §40 of the target master IS the crosswalk the
Guide asks for; §35 names `toolkit-framework` + `regen-toolkit-os`. **The framework is Part VI.**

## Phases (T = track)

| Phase | What | When | Status |
|---|---|---|---|
| **T1 — Intake & orient** | register iteration · save/archive MASTER · `HANDOFF-CHANGES-2026-07.md` · annexes-are-redundant note | Jul 15 | ▶ |
| **T2 — Crosswalk + DoD conformance** | §40 crosswalk (framework ↔ Database_Spec) + scored 15-item Definition-of-Done report + gap list | Jul 15 | |
| **T3a — Ingestion slice (Jul 16)** | Guide §8 "first prototype corpus": 67 source-system cards + sample of 5 families + 1 merge pilot → machine → `data/kb/` + page | Jul 15–16 | |
| **T5 — Fit + the call** | re-anchor CONVERGENCE-PIPELINE · capital proposal → decision #5 · **agent-setup for Matty** | Jul 15–16 | |
| **T3b — Full Canonical_DB ingestion** | 2,689 curated rows via the machine (Database_Spec Phases 0–10) + Discovery_Pool promotion | after Jul 16 | ⏳ |
| **T4 — Framework evolution from gaps** | +currentness/confidence/maintenance dims · branch/backlog/decision families · publication-system↔artifact | after Jul 16 | ⏳ |
| **Master narrative** | 6-Part/§0–43 refactor (Luiz's technical §35–42 + Matty's editorial) — **awaits Matty's next review cycle** | after Matty's handoff | ⏳ |

**Jul 16 needs: T1 + T2 + T3a + T5.** Full ingestion (T3b), framework changes (T4), and the master
refactor are sequenced after.

## Division of labor (Guide §10)

- **Matty / editorial:** 6-Part master transformation, raw-notes routing, source waves. Another review
  cycle before final handoff → **we do not restructure the master narrative now.**
- **Luiz / technical (this plan):** ingestion prototype, the §40 crosswalk, migration manifest +
  decision ledger, unresolved-decisions report, public-safe view, AI metrics, implementation memory.

## Decision log

| Date | Decision | Source |
|---|---|---|
| 2026-07-14 | Convergence, not migration: feed Matty's curated rows through the machine that already implements his spec | inventory + Database_Spec read |
| 2026-07-14 | Annexes A03–A14 are redundant checkpoint snapshots of Canonical_DB → skip/archive | inventory |
| 2026-07-14 | Jul 16 = crosswalk + DoD + real ingestion slice + agent-setup; full ingestion after | operator |
| 2026-07-14 | One master plan spawning T2/T3 sub-plans | operator |
| 2026-07-14 | Master narrative NOT restructured now — await Matty's next review cycle (his editorial lane) | operator (assumed; flag to veto) |

## Absorbed / superseded

- **resource-db-v3-lift** — the real resource DB is Canonical_DB + Database_Spec; T3 is the lift done right.
- **CONVERGENCE-PIPELINE P2** → T3; P1 (framework/instance split) done; P6 (RegenOS docs) threads with Master_Spec §36.
- **V4 capital `update-proposal`** → the schema side of Master_Spec decision #5 (8 Forms of Capital adopted).

## Guard rails

`docs/MASTER.md` is Matt's — derive, don't restructure. Handoff package is read-only source. Public/
private caveat (Matty): nothing from the handoff reaches a public view without the review-promote gate
(Zone D). All external artifacts + comms draft-and-present.

## Sub-plans

- Jul-16 executable: `docs/plans/handoff-integration/2026-07-15-jul16-implementation.md`
- T3b full ingestion: (to write after Jul 16)
