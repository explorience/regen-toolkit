---
id: framework-validation-pass
title: "Framework Validation Pass — self-ingestion + kernel fixes + Jul 16 demo (master plan)"
status: in-progress
priority: 1
scope: regen-toolkit
created: 2026-07-14
updated: 2026-07-14
supersedes: [site-and-content-convergence, framework-instance-split, resource-db-v3-lift]
rescopes: [CONVERGENCE-PIPELINE]
spec: docs/plans/framework-build/2026-07-13-framework-validation-pass-design.md
implementation: docs/plans/framework-build/2026-07-14-framework-validation-pass-implementation.md
sibling_plan: "../../refi-dao-os/docs/agent-plans/kms-koi-pipeline.md"
validation_checkpoint: "2026-07-16 toolkit call"
---

## Goal

Run the current toolkit's real content through the 0.2 machine for the first time,
land the non-controversial kernel fixes it needs, and put three concrete artifacts
(+ a capital contribute-back proposal) in front of the team on Thu Jul 16.

## Phases

| Phase | What | When | Status |
|---|---|---|---|
| **V0 — Consolidate** | Master plan · stale plans archived · QUEUE/HEARTBEAT reconciled | Jul 14 | ▶ |
| **V1 — Kernel fixes** | source-system enum · `held` state · `track.outcome`→array · **B5 overwrite guard** | Jul 14 | |
| **V1-intake — Jul 14 feedback** | Fold ReFi DAO post-R3 `route: toolkit-framework` items (confirm/extend V1) | Jul 14 | |
| **V2 — Slice self-ingestion** | ~15–20 articles → real `ingest` pipeline → `data/kb/` | Jul 15 | |
| **V3 — Three artifacts** | Live page · Obsidian canvas · diff report | Jul 15–16 | |
| **V4 — Capital proposal** | 8 Forms of Capital as a staged `update-proposal` (draft-only) | Jul 15 | |
| **Post-demo** | Full 119 self-ingestion · repo migration · OS→main · V3 resource lift | after Jul 16 | |

**V1.4 (overwrite guard) is the gate before any real `store`.** The Jul 16 demo needs V2 + V3.

## Decision log

| Date | Decision | Source |
|---|---|---|
| 2026-07-05 | HYBRID — adopt framework backbone, contribute 8 Forms of Capital | ontology comparison |
| 2026-07-10 | Reprocess a subset → visual concrete diff before the next demo | 260710 council |
| 2026-07-13 | Option B (demo + kernel fixes), slice-then-full ingestion | brainstorm |
| 2026-07-14 | `public_use_boundary` already first-class (schema exists) — dropped from fix list | exploration |
| 2026-07-14 | Real run targets `data/kb/` (repo-data per kms.yaml); root `kb/` is a stale kb-folder run | exploration |

## Absorbed backlog (from superseded plans)

- **site-and-content-convergence** — "process content through the framework + fork the site" IS V2/V3 (now against the real 0.2 machine). Its site-fork idea → the V3 live page.
- **framework-instance-split** — the split is real (package extracted); residual conceptual items: none blocking.
- **resource-db-v3-lift** — the 698-row lift is post-demo, gated on V1's `held` state. Crosswalk detail preserved at `data/resources/csv/toolkit-layer-crosswalk.csv`.
- **Full 119 self-ingestion** — the phase that resumes after Jul 16 once V1 fixes are confirmed.

## Out of scope for Jul 16 (sequenced after)

Full 119 self-ingestion · repo migration → RC GitHub org · OS-overlay → `main` (needs a written proposal) · Resource-DB V3 full lift.

## Deferred to the group (surfaced Jul 16, not mechanical fixes)

`gathering`/`story` extension restoration · `function` value-vs-type collision · maturity/stage
normalization · salvaged-vs-live merge (ontology-comparison §8).
