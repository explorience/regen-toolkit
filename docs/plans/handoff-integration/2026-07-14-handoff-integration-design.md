---
id: handoff-integration-design
title: "Handoff Integration — Matty's July 2026 iteration ↔ the toolkit framework (design)"
status: design-approved
scope: regen-toolkit (instance + framework + master doc)
created: 2026-07-14
author: Luiz (operator)
source: docs/RKC_Handoff_July_2026_FINAL_VERIFIED/ (Matty's July 2026 current-state handoff package)
validation_checkpoint: "2026-07-16 toolkit call (Thu)"
threads: [framework-validation-pass, CONVERGENCE-PIPELINE, capital-update-proposal]
---

# Handoff Integration — design

> **One-line:** Matty's July 2026 handoff independently specifies the system the framework already
> is. Integration = intake his iteration, produce the crosswalk + Definition-of-Done conformance he
> asks for, feed a real slice of his curated database through the machine, and set him up to run the
> engine himself — with the full Canonical_DB ingestion sequenced after the Jul 16 call.

## 1 · What arrived

`docs/RKC_Handoff_July_2026_FINAL_VERIFIED/` — not a single Google Doc anymore, but a structured
**current-state handoff package**. Authority hierarchy (from `00_ReadMe/Guide.docx`, which governs):

1. **Canonical_DB.xlsx** — canonical staging source (ingestion identity).
2. **Database_Spec.docx** — production object model, pipelines, promotion gates, acceptance tests.
3. **Master_Spec.docx** — target 6-Part / §0–43 master-document architecture.
4. **Future_Packet.docx** — routing, source-system waves, tracks, visuals, open decisions.
5. **Master_Draft.docx** — current master architecture + raw intake corpus (19.7k lines).
6. **Discovery_Pool.xlsx** — broad lead pool (promotion-gated).
7. **Annexes A03–A14** — research context.

**What's settled** (Guide): the 10-layer architecture; the 6-Part narrative reorg; 8 status
dimensions kept separate; Canonical_DB as staging truth; Discovery_Pool as lower-review leads; AI
carries reversible/inspectable work, consequential decisions gated; **Eight Forms of Capital adopted
as shared language** (Master_Spec decision #5). **What's not settled**: final vocabulary, governance
structure, auto-promotion scope, CSIS conformance (never claimed).

## 2 · The core finding — this is a convergence, not a migration

Matty's Database_Spec describes the framework machine we shipped. The mapping is near 1:1:

| Matty's handoff | The framework (already built) |
|---|---|
| Migration zones: Raw discovery → Canonical working → Reviewed operational → Public-use views | maturity ladder: `raw` → `candidate`/`reviewed` → public-use-boundary tiers |
| Operating rule: preserve → normalize → review → publish | the ingest → accept-gate → review-promote → store pipeline |
| Boundary invariants ("AI-assisted ≠ human-reviewed", "Claim ≠ evidence", "Public ≠ commons") | born-rules + K1 axes |
| Discovery_Pool → Canonical_DB promotion | ingest → review-promote (human gate) |
| Normalization layer (Object-Type Crosswalk, Predicate Map, Controlled Vocabularies) | the `maps_to_core` crosswalk + relationships schema |
| 87 duplicate/conflict flags (`Normalization Flags`) | the **B5 silent-overwrite guard** (65 collisions caught 2026-07-14) |
| 6 canonical families (Source-System Cards, New Objects, Options, Claims/Cautions, Impl Memory, Relationship Leads) | schemas: source-system, resource, option-entry, claim-evidence, implementation-record, relationships |
| 8 status dimensions (processing/maturity/review/public-use/currentness/confidence/maintenance/AI) | 3 axes + 2 flags — **3 dimensions short** (currentness, confidence, maintenance) → T4 |
| **Definition of Done #1**: "re-running the same batch does not create duplicate canonical objects" | **the idempotency guard, demonstrated** |

The Guide's **Definition of Done (15 items)** reads as a framework conformance checklist — the machine
already demonstrates most (idempotent re-run, inspectable/reversible merges, restricted-can't-enter-
public, public-use exposes only approved fields, AI-involvement measurable, every row has a
destination). **§40 of the target master ("Architecture/Framework/Data/AI/Interface Crosswalk") is
exactly the "schema-to-master-architecture crosswalk" the Guide (§10) asks Luiz to return — and §35
names `toolkit-framework` + `regen-toolkit-os` directly. The framework is Part VI of the master doc.**

## 3 · The data (Track C target, from the inventory)

- **Canonical_DB.xlsx** — 119 sheets, but its own `Sheet Role Registry` marks **6 as import targets**:
  Source-System Cards (67) · New Objects (878) · Option Candidates (345) · Claims & Cautions (504) ·
  Implementation Memory (341) · Relationship Leads (554) = **~2,689 curated rows.** Plus a 9-sheet
  normalization layer (crosswalk/predicate-map/vocab/dup-flags) that **configures the ingestion
  mapper**. Canonical IDs are type-prefixed (`org:`, `tool:`, `source-system:`, `person:`).
- **Discovery_Pool.xlsx** — 4,951-row `All Objects Registry` (`RKC-#####` IDs, full status columns +
  candidate-routing flags), explicitly upstream of Canonical_DB (Zone A leads, promotion-gated).
- **Annexes A03–A14** — **no new data**; superseded checkpoint snapshots of Canonical_DB. **Skip/archive.**

## 4 · Division of labor (from the Guide §10)

- **Matty / editorial:** the 6-Part / §0–43 master transformation, raw-notes routing, source-system
  waves. He said he'll run *another review cycle* before final handoff. **We do not restructure the
  master narrative now** — intake it as reference; the 6-Part refactor waits for his final.
- **Luiz / technical (this plan):** ingestion prototype + config, the §40 crosswalk, migration
  manifest + decision ledger, unresolved-decisions report, public-safe view, AI-quality/review-burden
  metrics, implementation memory. **Most already exists from the framework-validation-pass.**

## 5 · The plan — 5 tracks under one master plan (`handoff-integration`)

- **T1 · Intake & orient** — register the iteration; save/archive current `MASTER.md`; write
  `HANDOFF-CHANGES-2026-07.md` (authority hierarchy · 6-Part/§0–43 target · settled/open decisions ·
  the convergence map). Archive the redundant annexes note. *No master-narrative restructure.*
- **T2 · Crosswalk + Definition-of-Done conformance (flagship, Jul 16)** — the §40 crosswalk
  (framework schemas/axes/agents ↔ Database_Spec families/status/zones) + a scored DoD conformance
  report (15 items, evidence from the 722-object run + the Jul-14 review pass) + the gap list. This is
  the Guide's requested return, and it's mostly synthesis of what exists.
- **T3 · Real ingestion slice (Jul 16) → full Canonical_DB (after)** — feed a bounded "first prototype
  corpus" (Guide §8) through the machine now; sequence the full 2,689-row ingestion + Discovery_Pool
  promotion after. **Supersedes `resource-db-v3-lift`.**
- **T4 · Framework evolution from the gaps** — add the 3 missing status dimensions
  (currentness/confidence/maintenance), branch/backlog/decision object families, publication-system ↔
  artifact distinction. Folds into the post-demo framework round + the 7-item feedback harvest.
- **T5 · Fit + the call** — re-anchor `CONVERGENCE-PIPELINE`; roll the V4 capital `update-proposal`
  into Master_Spec decision #5; **set Matty up with coding agents** (his ask — free 10:30–11:30 EST,
  flexible Thu). Draft-and-present all external/comms.

## 6 · Jul 16 scope (2 days) — operator-approved

Ship for the call: **T1 orientation doc · T2 crosswalk + DoD conformance · T3 real ingestion slice ·
T5 agent-setup for Matty.** The slice (Guide §8 "first prototype corpus"): all **67 Source-System
Cards** + a bounded sample from each of the other 5 families + **one worked merge pilot** (GAIAI or
OpenCivics from Canonical_DB) → run through the framework machine → typed objects in `data/kb/` →
extend the `/self-ingestion/` page (or a new `/handoff/` page) with the before/after. Honest framing:
a *prototype corpus*, not the full 2,689-row migration (that's the phase after).

**Out of scope for Jul 16:** full Canonical_DB ingestion · Discovery_Pool promotion · the master
narrative 6-Part refactor · T4 framework changes · annex diffing.

## 7 · How it fits / updates existing plans

- **Supersedes** `resource-db-v3-lift` (already archived under framework-validation-pass) — the real
  resource DB is now Canonical_DB + its spec; T3 is the lift, done right.
- **Re-anchors** `CONVERGENCE-PIPELINE` — P2 (resource lift) → T3; the framework/instance split (P1)
  is done; RegenOS docs (P6) thread with Master_Spec §36.
- **Rolls in** the V4 capital `update-proposal` → the schema side of Master_Spec decision #5.
- **Feeds** the framework feedback round (T4 + the 7-item harvest).
- **Threads with** the ReFi DAO `kms-koi-pipeline` — same machine, same crosswalk discipline.

## 8 · Open decisions to surface at the call (from Guide §11 / Master_Spec §34)

Final root/subtype vocabulary · auto-promotion scope · publication-system vs community-of-practice
refinement · review labels + approval authority · named governance roles · CSIS/CROPS intake scope ·
public interface exposure. Record defaults, reopen on trigger — do not block implementation.

## 9 · Guard rails

- `docs/MASTER.md` is Matt's — do not restructure; derive. The handoff package is read-only source.
- Public/private caveat (Matty): the handoff wasn't reeled in for public/private; the framework's
  public-use-boundary + high-risk flagging handles this at ingest — **nothing from the handoff goes to
  a public view without review** (Zone D discipline = the review-promote gate).
- Everything external (the crosswalk shared with Matty, the agent-setup, any comms) stays
  draft-and-present.
