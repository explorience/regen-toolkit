---
id: framework-validation-pass
title: "Framework Validation Pass — self-ingestion + kernel fixes + Jul 16 demo (master plan)"
status: complete
priority: 1
scope: regen-toolkit
created: 2026-07-14
updated: 2026-07-19
completed: 2026-07-19
supersedes: [site-and-content-convergence, framework-instance-split, resource-db-v3-lift]
rescopes: [CONVERGENCE-PIPELINE]
spec: docs/plans/framework-build/2026-07-13-framework-validation-pass-design.md
implementation: docs/plans/framework-build/2026-07-14-framework-validation-pass-implementation.md
sibling_plan: "../../refi-dao-os/docs/agent-plans/kms-koi-pipeline.md"
validation_checkpoint: "2026-07-16 toolkit call"
---

> **✅ COMPLETE 2026-07-19.** V0–V4 all done (722 objects in `data/kb/`, kernel fixes 100→110 tests,
> three artifacts live, capital proposal drafted; consolidated report published). Post-demo items
> redistributed: **feedback harvest (7 items)** → `handoff-integration.md` T4 remainder ·
> **human review pass** → the review gate in [`dev-instance-build.md`](dev-instance-build.md) ·
> **repo migration + OS→main** → [`publish-pipeline/2026-07-16-design.md`](publish-pipeline/2026-07-16-design.md)
> + Heenal asks (sent 2026-07-19) · **V3 resource lift** → superseded by T3b full Canonical_DB ingestion.

## Goal

Run the current toolkit's real content through the 0.2 machine for the first time,
land the non-controversial kernel fixes it needs, and put three concrete artifacts
(+ a capital contribute-back proposal) in front of the team on Thu Jul 16.

## Phases

| Phase | What | When | Status |
|---|---|---|---|
| **V0 — Consolidate** | Master plan · stale plans archived · QUEUE/HEARTBEAT reconciled | Jul 14 | ✅ done |
| **V1 — Kernel fixes** | source-system enum · `held` state · `track.outcome`→array · **B5 overwrite guard** | Jul 14 | ✅ done (110/110 tests) |
| **V1-intake — Jul 14 feedback** | Fold ReFi DAO post-R3 `route: toolkit-framework` items (confirm/extend V1) | Jul 14 | ⏳ pending Monty deep-dive (non-blocking) |
| **V2 — Self-ingestion** | slice (19) validated → **full 119** → real `ingest` pipeline → `data/kb/` | Jul 14 | ✅ done (**722 objects**, total 1→722; 65 B5 collisions preserved) |
| **V3 — Three artifacts** | Live page · Obsidian canvas · diff report | Jul 14 | ✅ built (deploy = draft-and-present gate) |
| **V4 — Capital proposal** | 8 Forms of Capital as a staged `update-proposal` (draft-only) | Jul 14 | ✅ drafted (to shape w/ Matt) |
| **Post-demo** | Human review pass (`review promote`, merge dup collisions) · **feedback harvest fixes (below)** · repo migration · OS→main · V3 resource lift | after Jul 16 | ⏳ queued |

**V1.4 (overwrite guard) was the gate before any real `store` — cleared.** The Jul 16 demo has V2 + V3.

## Framework-feedback harvest (from the V2 self-ingestion run, 2026-07-14)

The self-ingestion generated the next round of framework fixes — the loop working on the toolkit
itself, mirroring the ReFi DAO testbed. All `route: toolkit-framework`; queued for the post-demo round:

1. `source-system.type` has no `platform`/`dapp` value (Gitcoin → `docs-site`, imperfect) — extends the enum item.
2. `public-use-boundary` doesn't `extends: frontmatter` → exempt from the maturity born-rule (the 146-vs-155 `by_maturity` gap).
3. `public-use-boundary.tier` enum lacks a "requires domain review" value (caused the one accept-rejection).
4. `list-schemas` doesn't distinguish ingestible vs structural schemas — wants a `--ingestible` flag.
5. `ingest prepare` should stamp the resolved `source_path` (bare filenames collide with stale `content/` drafts).
6. `classifySource` misclassifies prose as `transcript` on colon-terminated lead-ins.
7. No top-level `case-study` schema (resolved via `encyclopedia-entry` + `page_type: case-linked`).

## Decision log

| Date | Decision | Source |
|---|---|---|
| 2026-07-05 | HYBRID — adopt framework backbone, contribute 8 Forms of Capital | ontology comparison |
| 2026-07-10 | Reprocess a subset → visual concrete diff before the next demo | 260710 council |
| 2026-07-13 | Option B (demo + kernel fixes), slice-then-full ingestion | brainstorm |
| 2026-07-14 | `public_use_boundary` already first-class (schema exists) — dropped from fix list | exploration |
| 2026-07-14 | Real run targets `data/kb/` (repo-data per kms.yaml); root `kb/` is a stale kb-folder run | exploration |
| 2026-07-14 | V2 run: 19-article slice → 154 objects; B5 guard fired real (decentralization/obsidian preserved); V1.1 enum used (blog/publication) | self-ingestion run |
| 2026-07-14 | Slice "capital-heavy" articles were crypto-financial, not 8-forms — capital gap stands on the ontology comparison, not this run | self-ingestion run |
| 2026-07-14 | MASTER already describes 8 Forms as prose ("classification fields, not root types") — proposal formalizes his own stated design, not a new idea | V4 grep of MASTER |
| 2026-07-14 | V1-intake: Monty deep-dive not yet held; V1 stands on its own; fold the batch as confirmation when it lands | operator |
| 2026-07-14 | Full 119 self-ingestion pulled forward (ahead of the call): 722 objects; 65 B5 collisions preserved; 7-item feedback harvest reconfirmed at scale | operator request |

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
