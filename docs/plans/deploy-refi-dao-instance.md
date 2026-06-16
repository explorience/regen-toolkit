# P9 — Deploy Framework → ReFi DAO Instance

> **Status:** queued · **Wave:** 4 (the proof) · **Owner:** Luiz · **Target instance:** `../refi-dao-os`
> **Skills:** `superpowers:subagent-driven-development`; `superpowers:using-git-worktrees`; `superpowers:executing-plans`
> Part of the [convergence pipeline](CONVERGENCE-PIPELINE.md). **Depends on:** P1 (framework), P2 (lift pattern), P3 (validated prototype).

## Goal
Instantiate the framework for **ReFi DAO** in `../refi-dao-os` — process ReFi DAO's **podcasts + blog posts** into a knowledge commons — proving the framework is genuinely reusable (a framework no one else can instantiate isn't a framework) and delivering work ReFi DAO has been **waiting months** for.

## Context
- Luiz (2026-06-15): if the framework splits out, ReFi DAO could **use it right now** to process podcast episodes + blog posts (pending for months); output **feeds back into the toolkit** + federates into the commons.
- ReFi DAO already runs an org-os instance (`refi-dao-os`) — the framework layers on top.
- The resource DB V3 already contains heavy **podcast synthesis** (Green Pill, ReFi DAO, Crypto Altruists, Blockchain Socialist) — overlap to reconcile.
- **First external test of self-qualifying adoption** (RegenOS federation filter).

## Phases
1. **Dry-run the instantiation procedure** (P1 Phase 5) in a worktree of `refi-dao-os` — surfaces gaps in the framework's reusability (feeds back to P1).
2. **Set up the ReFi DAO instance slots** — identity, domain config, the layer/lifecycle scaffold.
3. **Process ReFi DAO sources** — run the framework's skills (knowledge-curator, meeting-processor-style ingestion, resource lift) over ReFi DAO podcasts + blog. Honor review state (raw → reviewed).
4. **Generate the ReFi DAO journey site** (the framework's site generator, ReFi-DAO content).
5. **Federate** — declare `refi-dao-os` ↔ `regen-toolkit-os` upstream/downstream in RegenOS (P6); output feeds back to the toolkit commons.

## Deliverables
- A running ReFi DAO knowledge-commons instance on the framework.
- Processed podcast/blog knowledge (ReFi DAO's long-pending deliverable).
- A **reusability report** — what worked / what the framework was missing (→ P1 hardening).

## Definition of done
- `refi-dao-os` runs the framework with ReFi DAO content; ReFi DAO podcasts/blog are processed; federation declared; gaps fed back to P1.

## Interrelations
- The **first proof** of P1. Hardens the framework. Precedes P10 (ReFi BCN reuses the proven procedure). Activates RegenOS federation (P6) + makes the contribution/compensation model (P8) concrete across orgs.
