# Convergence Pipeline — Regen Knowledge Commons Toolkit → Framework + Instances

> **Created:** 2026-06-16 · **Branch:** `regen-toolkit-os` (consolidated) · **Owner:** Luiz (operator)
> **Origin:** the 2026-06-15 Matty+Luiz session + the 0521/0604 biweeklies. This pipeline operationalizes the two strategic decisions — **(1) split the work into a domain-agnostic framework + the ReFi Web3 Toolkit as its first instance**, and **(2) house it under ReFi Commons** — and the convergence items from the [2026-06-16 integration report](../reports/2026-06-16-gap-fill-and-master-doc-intake-integration-report.md).

> **2026-07-15 re-anchor.** Execution has moved into two consolidated plans: [`framework-validation-pass`](framework-validation-pass.md) (the machine + self-ingestion, P1/P3 done) and [`handoff-integration`](handoff-integration.md) (Matty's July iteration — P2 resource lift → its Canonical_DB ingestion T3). This pipeline stays the **strategic map**; those plans carry the work.

## The spine (what we're actually building)

The Regen Knowledge Commons Toolkit is becoming a **framework** — a domain-agnostic system for building a regenerative knowledge commons (layers, flows, schemas, agent skills, a journey-based site generator, a contribution/review process) — with **instances** that fill it with domain content:

- **Instance 0 — ReFi Web3 Toolkit** (this repo): the first concrete instance + the reference implementation. Live site = `regen-web3-toolkit.vercel.app`.
- **Instance 1 — ReFi DAO** (`../refi-dao-os`): processes ReFi DAO podcasts + blog through the framework (pending for months — the framework makes it immediately useful).
- **Instance 2 — ReFi BCN** (`../refi-bcn-os`): bioregional/local-node instance.
- **Federation — RegenOS** (`regen-coordination-os`): the coordination layer above instances (upstream/downstream + knowledge-source vs organizational federation).

**Why a framework, not just a doc:** it's the *praxis of the group* already (Heenal's journeys, Matty's master doc, Durgadas's CSIS/frame-language, Koi's cells, Rather's ontology). Making it a concrete, instantiable framework turns "a 30k-line doc" into "something you can adopt and run" — and the **self-qualifying adoption** becomes the non-arbitrary federation filter.

**The deliverable that makes it graspable:** a working **prototype in `regen-toolkit-os`** — the live journey site + the org-os layer + the framework structure made explicit — presented to the group (Heenal, Matty, Durgadas, Koi, Rather, Afo) as something concrete, not a wall of text.

## Pipeline shape (waves)

```
WAVE 0 — Convergence groundwork ........................ ✅ DONE (2026-06-16)
   branch consolidation · v1 site merge · master-doc intake · resource-DB staging

WAVE 1 — Framework foundation (in regen-toolkit-os)
   D1 Architecture decision: Lifecycle vs 10-Layers  ──┐ (gates P1)
   P1 Framework / Instance Separation  ────────────────┤
   P2 Resource DB V3 Lift  ────────────────────────────┘ (fills the instance)

WAVE 2 — Make it concrete + grounded (prototype for the group)
   P3 Framework Prototype + Group Demo   (needs P1; shows P2)
   P4 Theory of Change + Problem Statement   (answers Durgadas; grounds P1)
   P5 CSIS Posture Revision   (informed-not-conformant; feeds P3 review)

WAVE 3 — Public + federation
   P6 RegenOS Documentation + Public Website   (needs P1; July target)
   P7 Hub Post / Public Invitation   (needs P3, P4)
   P8 Contribution Governance + Impact Vault   (ReFi Commons; needs P6)

WAVE 4 — Multi-instance deployment
   P9  Deploy framework → ReFi DAO instance (../refi-dao-os)   (needs P1, P2, P3)
   P10 Deploy → ReFi BCN + network availability (../refi-bcn-os)   (needs P9 learnings)
```

## Plans

| ID | Plan | File | Status | Depends on | Skills to load when developing |
|----|------|------|--------|-----------|-------------------------------|
| D1 | Architecture: Lifecycle vs 10-Layers | [`architecture-lifecycle-vs-layers.md`](architecture-lifecycle-vs-layers.md) | decision-needed | — | brainstorming; (research master doc §Next-Working-Draft + Structure-Options) |
| **P1** | **Framework / Instance Separation** | [`framework-instance-split.md`](framework-instance-split.md) | **active** | D1 | brainstorming → writing-plans → subagent-driven-development; using-git-worktrees |
| P2 | Resource DB V3 Lift | [`resource-db-v3-lift.md`](resource-db-v3-lift.md) | ready | P1 (target schema) | test-driven-development; (data eng) |
| P3 | Framework Prototype + Group Demo | [`framework-prototype-demo.md`](framework-prototype-demo.md) | ready | P1, P2 | verification-before-completion; run/verify |
| P4 | Theory of Change + Problem Statement | [`theory-of-change.md`](theory-of-change.md) | ready | — (parallel) | brainstorming; deep-research (CSIS, frame language) |
| P5 | CSIS Posture Revision | [`csis-posture-revision.md`](csis-posture-revision.md) | ready | P4 | brainstorming; deep-research |
| P6 | RegenOS Documentation + Public Website | [`regen-os-documentation.md`](regen-os-documentation.md) | queued (exists) | P1 | writing-plans; frontend-design; deep-research |
| P7 | Hub Post / Public Invitation | [`hub-post-public-invitation.md`](hub-post-public-invitation.md) | ready | P3, P4 | brainstorming; (drafting — draft-and-present) |
| P8 | Contribution Governance + Impact Vault | [`contribution-governance-impact-vault.md`](contribution-governance-impact-vault.md) | ready | P6 | brainstorming; deep-research (ReFi Commons, DAO IP5, CIDS) |
| P9 | Deploy → ReFi DAO instance | [`deploy-refi-dao-instance.md`](deploy-refi-dao-instance.md) | queued | P1, P2, P3 | subagent-driven-development; using-git-worktrees |
| P10 | Deploy → ReFi BCN + network | [`deploy-refi-bcn-network.md`](deploy-refi-bcn-network.md) | queued | P9 | subagent-driven-development |

## How to develop each plan (the "fully developed individually" step)

Each plan file is a **cohesive scope**, not yet a bite-sized TDD plan. To execute one:
1. `cd` into `regen-toolkit-os` (or a worktree via `superpowers:using-git-worktrees` for isolated/parallel work).
2. Load the skills listed for that plan (start with `superpowers:brainstorming` for design-heavy ones).
3. Expand the scope into a full implementation plan with `superpowers:writing-plans` (bite-sized TDD steps).
4. Execute via `superpowers:subagent-driven-development` (fresh subagent per task) or `superpowers:executing-plans`.
5. Verify with `superpowers:verification-before-completion` + `/run` or `/verify`.
6. Use `deep-research` for the research-flagged plans (CSIS lineage, DAO IP5, ReFi Commons legal wrappers, frame language).

## Interrelation notes (why these are one pipeline, not ten projects)

- **D1 gates P1's structure.** Don't build the framework directory tree until the layers-vs-lifecycle question is answered (the master doc offers both; Structure Options recommends a lifecycle spine *over* the layers as appendices).
- **P1 is the hub.** P2 (resource lift) targets the instance side of P1's split; P3 (prototype) demonstrates P1; P6/P9/P10 all instantiate P1.
- **P4 (Theory of Change) grounds everything** — it's Durgadas's open challenge and the master doc's new Problem/ToC section. Without it the framework is "a thing in search of a problem." It can proceed in parallel (no code dependency) and should land before P7 (the hub post needs a clear problem frame).
- **P3 (prototype) is the milestone.** It's the "present to the group" gate. Everything in Wave 1 + P4/P5 feeds it. After P3 lands and the group engages, Wave 3/4 unlock.
- **P9/P10 prove the framework.** A framework no one else can instantiate isn't a framework. ReFi DAO is the first external test (and was already waiting for knowledge processing). Self-qualifying adoption (RegenOS) starts here.
- **CSIS (P5), frame language (P4), Bonfires/KOI (P3 evolution), the resource DB review queues (P2)** all carry the *anti-extractive / structural-integrity* discipline through the pipeline — they are not separate concerns, they are how the framework stays honest.

## Definition of done (pipeline)

The framework is real when: (a) `regen-toolkit-os` cleanly separates `framework/` from instance content; (b) a second instance (`refi-dao-os`) runs on it with its own content; (c) the group has seen + engaged the prototype; (d) RegenOS documents how instances federate; (e) the public can find a door in (v1 site + hub post). Wave 4 completion = "available to the network(s)/community."

---

_This pipeline is the operator's roadmap. Each row is a plan to be developed + executed individually. Update statuses here as plans move._
