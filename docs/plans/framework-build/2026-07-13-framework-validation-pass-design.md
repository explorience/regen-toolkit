---
id: framework-validation-pass-design
title: "Framework Validation Pass — self-ingestion + kernel fixes + the Jul 16 demo (design)"
status: design-approved
scope: regen-toolkit (instance) + packages/toolkit-framework (framework)
created: 2026-07-13
author: Luiz (operator)
supersedes_execution_of: [site-and-content-convergence, framework-instance-split, resource-db-v3-lift]
rescopes: [CONVERGENCE-PIPELINE (P2/P3 execution moves here)]
source_meeting: "260710 Regen Coordination Council Sync"
sibling_plan: "refi-dao-os/docs/agent-plans/kms-koi-pipeline.md (KOI-first; R-phases)"
validation_checkpoint: "2026-07-16 toolkit call (Thu)"
---

# Framework Validation Pass — design

> **One-line:** Run the current toolkit's real content through the 0.2 machine for the
> first time, land the non-controversial kernel fixes it needs, and put three concrete
> artifacts (+ a capital contribute-back proposal) in front of the team on **Thu Jul 16**.

## 1 · Context — where we are

The framework **build** is done. What is *not* done is the step everything now hinges on:

- `packages/toolkit-framework` **0.2 "the machine"** shipped 2026-07-04 (100/100 tests; work-order
  ingestion → accept-gate → review queue → storage adapters; extracted to the public repo).
- `@org-os/kms` binding shipped 2026-07-05 (44/44); promoted to canonical org-os `v0.5`.
- Ontology comparison landed 2026-07-05 → **HYBRID**: adopt the framework backbone, contribute the
  8 Forms of Capital back to the kernel. The 119 live articles **map** 1:1 (19 types, 0 unmapped).

**The gap:** the current toolkit content has never been run *through the 0.2 machine's `ingest`
pipeline*. The June `data/{encyclopedia,concepts,…}.yaml` "framework view" was produced by v0.1
heuristics; the ontology comparison only *maps* the 119 — it does not *re-ingest* them. The
2026-07-10 share-pack is honest about this ("they haven't been re-ingested through the machine yet
— that's queued"), and `HEARTBEAT.md` still marks `★ Process toolkit content through the framework`
as `[~]`.

In convergence-pipeline terms we sit at the **P2 → P3 seam**: framework foundation built, but the
"run real content through it → concrete artifact for the group" step is open. That artifact is what
the 260710 meeting calls the *"visual, concrete diff"* Luiz owes before the next demo.

## 2 · The validation point — Thu Jul 16

The 260710 council sync names it: *"Reprocess a subset of Heenal's existing repo content with the
new framework specs → produce a visual, concrete diff before the next demo. Dedicate focused time
next week."* Timeline this week:

| Day | Event | Role |
|---|---|---|
| **Mon Jul 13** (today) | This planning + V0/V1 start | — |
| **Tue Jul 14** | ReFi DAO KOI deep-dive w/ Monty (R3 gate) | **feedback source** (non-blocking) |
| **Thu Jul 16** | Toolkit call | **validation checkpoint** |

The ReFi DAO instance is the *live testbed* generating framework feedback (routed ledger:
`refi-dao-os/docs/kms/FRAMEWORK-FEEDBACK.md`). Post-R3 it dispatches a batch **to toolkit-framework
+ regen-toolkit**. We fold that in as confirmation — the Jul 16 demo is **never** gated on Monty's
call landing on time.

## 3 · Approach — Option B (demo + kernel fixes), slice-then-full

Chosen over demo-minimal (A) and full-convergence (C):

- **A (demo-minimal)** — only the visual diff, capital + schema as talk-only. Rejected: leaves the
  ingestion needing fixes it doesn't have; weaker "concrete to validate" story.
- **B (demo + kernel fixes)** — self-ingestion diff **+** the non-controversial fixes the ingestion
  actually needs **+** capital staged as a concrete proposal. **Chosen.**
- **C (full convergence)** — B + repo migration + OS→`main` merge + full V3 resource lift. Rejected
  for a 3-day window; migration and the main-merge are their own open decisions.

Ingestion scope: **slice-then-full (Option 3)** — a representative ~15–20-article slice for Jul 16;
full 119 resumes after the demo, once V1 fixes are confirmed by the Jul 14 feedback. Mirrors the
ReFi DAO freeze-and-validate discipline (don't scale ingest before the architecture's confirmed).

## 4 · The plan shape — V-phases (symmetric to ReFi DAO R-phases)

One consolidated master plan, `docs/plans/framework-validation-pass.md`, absorbing the stale plans
(§7). Phases:

### V0 — Consolidate the plan surface
Write the master plan. Supersede + archive with pointer banners: `site-and-content-convergence`,
`framework-instance-split`, `resource-db-v3-lift`, the `framework-build/` follow-on items. Re-scope
`CONVERGENCE-PIPELINE` (keep it as the strategic map; note P2/P3 *execution* now lives in this
plan). Update `docs/plans/QUEUE.md` and `HEARTBEAT.md`. Live items from the superseded plans move
into an "Absorbed backlog" section (sweep-and-verify, don't drop).

### V1 — Kernel fixes the ingestion needs (non-controversial)
All in `packages/toolkit-framework`, TDD, **100/100 must stay green**. From ontology-comparison §8
+ the ReFi DAO ledger:

| Fix | Source | Why now |
|---|---|---|
| `held` / review-queue maturity state | §8 | 698 resource rows are counted-but-homeless; blocks clean import |
| `track.outcome` scalar → array | §8 | schema correctness |
| First-class `public_use_boundary` field | §8 | master-doc safeguard; currently ad-hoc |
| Widen `source-system` type enum (+ `blog`/`publication`) | §8 + ReFi DAO A1 | 60/89 fell back to `database`; blog enum missing |
| **B5 silent-overwrite guard** (distinct-title rule + collision probe) | **ReFi DAO ledger B5 🔴** | **real data-loss-at-scale bug**; our slice run could hit it — fix before any real ingest |

B5 is the flagship feedback-loop story for Thursday: the ReFi DAO testbed found a real framework
bug → fixed in the framework → the toolkit's own self-ingestion benefits. Concrete proof the
federation feedback loop works.

**Explicitly deferred from V1** (need the group / a curation call, not a mechanical fix):
`gathering`/`story` extension restoration · `function` value-vs-type collision · maturity/stage
normalization · salvaged-vs-live merge. These stay in the plan's backlog, surfaced Thursday.

### V2 — Representative-slice self-ingestion
Select ~15–20 articles (from the 119) deliberately covering **every object type** and the **known
edges**: a capital-heavy article, a `pattern`/`case-study` `function`-collision case, a
source-system enum-fallback case, and a title-collision case that would trigger B5. Run through the
**real 0.2 `ingest` pipeline** (`init --existing` → `ingest` → review gate) → typed objects land in
the instance `data/kb/`. Selection rationale recorded so the diff can honestly say "representative
subset, chosen to exercise X/Y/Z."

### V3 — The three artifacts
1. **Live page** (primary, shareable) — a `regen-toolkit-os` page: raw article → the typed objects
   the machine produced, per-type counts + the 1:1 crosswalk, rendered live from `kb/index.json`.
   Deploys via the existing GitHub Pages flow (`git push fork regen-toolkit-os`). Doubles as the
   convergence-pipeline **P3** "prototype for the group."
2. **Obsidian canvas** — agent-generated: the ingestion flow + before/after object graph, for the
   working session (accepts the local-Obsidian limitation for live collaboration).
3. **Backing report** — `docs/reports/2026-07-13-self-ingestion-diff.md`: honest per-type deltas,
   what the machine caught that June's heuristic missed, what the slice *didn't* cover.

### V4 — Capital update-proposal (staged, draft-and-present)
8 Forms of Capital as a concrete `update-proposal` to `docs/MASTER.md` — a capital-accounting axis +
predicates for the kernel. **Drafted for Matty to shape, not applied** (it's his doc; CLAUDE.md
rule). The flagship contribute-back; the piece Luiz wants to shape *with* Matty on the call.

### Jul-14 intake (gate, non-blocking)
After the ReFi DAO R3 deep-dive, fold its post-R3 feedback dispatch batch into V1's fix-list as
confirmation/extension. If it surfaces a new non-controversial fix in scope, add it; otherwise note
it in the backlog. Never blocks V2/V3.

## 5 · Out of scope for Jul 16 (captured, sequenced after)

- **Full 119 self-ingestion** — the phase that resumes post-demo, once V1 fixes are confirmed.
- **Repo migration → RC GitHub org** — own decision + runbook (meeting action; no hard deadline).
- **OS-overlay → `main`** — the meeting left this open; needs a written proposal, not a rushed merge.
- **Resource-DB V3 full lift** (698 rows) — needs V1's `held`/review state to have a home first.

## 6 · Success criteria (Jul 16)

1. V1 fixes merged in `packages/toolkit-framework`, tests still 100/100 green.
2. A representative slice ingested through the **real** 0.2 pipeline into `data/kb/` (not heuristic).
3. Three artifacts exist and are shareable: live page deployed, canvas openable, report committed.
4. Capital `update-proposal` drafted (not sent) and ready to walk Matty through.
5. The B5 fix and the Jul-14 feedback intake are visible in the plan as the working feedback loop.
6. Honest framing throughout: "representative subset," "full run resumes next," nothing overclaimed.

## 7 · Plan refactor — what this supersedes

| Plan | Disposition |
|---|---|
| `site-and-content-convergence` | **Superseded** — its "process content through the framework + fork the site" scope IS V2/V3 (now against the real 0.2 machine). Archive + banner; absorb live items. |
| `framework-instance-split` | **Superseded (execution)** — the split is real (framework extracted as a package); remaining conceptual items absorbed. |
| `resource-db-v3-lift` | **Superseded (sequencing)** — gated behind V1's `held` state; the lift itself is post-Jul-16 (see §5). Absorb the crosswalk detail. |
| `framework-build/` follow-ons | **Absorbed** — SP11 self-ingestion + the master-doc-proposal batching land as V2 + V4. |
| `CONVERGENCE-PIPELINE` | **Kept as strategic map** — P2/P3 execution pointer → this plan; D1/P1 already resolved by the extracted package. |

## 8 · Interfaces / isolation

- **Framework vs instance boundary is respected:** V1 edits live in `packages/toolkit-framework`
  (the framework); V2/V3 edits live in the instance (`data/kb/`, site pages, reports). The capital
  proposal (V4) targets `docs/MASTER.md` but is *draft-only* — no cross-boundary write.
- **The 0.2 machine is used as-is** through its CLI (`init`/`ingest`/review) — V2 is a *consumer* of
  the machine, not a modification of it. Only V1 changes the framework, and only via TDD'd schema/
  guard additions that keep the 100/100 suite green.
- **Each artifact is independently reviewable:** the report stands alone; the live page renders from
  `kb/index.json`; the canvas is a static file. No shared hidden state.

## 9 · Pointers

- Sibling plan (ReFi DAO): `../../refi-dao-os/docs/agent-plans/kms-koi-pipeline.md`
- Ontology comparison + §8 open items: `docs/reports/2026-07-05-ontology-comparison.md`
- ReFi DAO feedback ledger (feeds Jul-14 intake): `../../refi-dao-os/docs/kms/FRAMEWORK-FEEDBACK.md`
- Machine spec + sprint plan: `docs/plans/framework-build/2026-07-04-machine-*.md`
- Convergence pipeline (strategic map): `docs/plans/CONVERGENCE-PIPELINE.md`
- Share-pack (already shared w/ Matty): `docs/reports/2026-07-10-share-pack.md`
- 260710 meeting: `packages/operations/meetings/260710 Regen Coordination Council Sync.md`
