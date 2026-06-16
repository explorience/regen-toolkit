# Regen Knowledge Commons Toolkit — Framework

> **Status:** scaffold (2026-06-16). The framework/instance separation is plan [P1](../docs/plans/framework-instance-split.md) in the [convergence pipeline](../docs/plans/CONVERGENCE-PIPELINE.md). This directory is the home of the **domain-agnostic framework**, separated from the **ReFi Web3 instance** content in the rest of the repo.

## What this is

The **framework** is a reusable system for building a **regenerative knowledge commons**: an architecture (layers + lifecycle), a data model, a journey-based public site generator, agent skills, and a contribution + review process — all **independent of any specific domain**.

The **instance** is what you get when you fill the framework with a domain's content. The first instance is the **ReFi Web3 Toolkit** (this repo's `src/content/`, `data/`, the 3 journeys, the resource DB). Other instances: **ReFi DAO** (`../../refi-dao-os`), **ReFi BCN** (`../../refi-bcn-os`).

> **One line:** *the framework is the toolkit; the ReFi Web3 Toolkit is its first instance.* (Matty, 2026-06-15: "the ReFi web3 toolkit is just the application of this in a specific domain.")

## Why separate them

1. **Reusability** — any org can adopt the framework and structure their knowledge the same way (Matty: "somebody who's not even related to us could be like, I'm gonna structure it this way — that's awesome").
2. **Self-qualifying federation** — adopting the framework + running its process is the *non-arbitrary filter* for deeper federation via [RegenOS](../docs/plans/regen-os-documentation.md). No gatekeeping.
3. **Graspability** — "a framework you can instantiate" is concrete; "a 30,000-line master doc" is not. The group can hold the former.
4. **Immediate utility** — ReFi DAO has been waiting months to process its podcasts/blog into a knowledge commons; the framework makes that a fill-in-the-blanks job (plan [P9](../docs/plans/deploy-refi-dao-instance.md)).

## How it relates to org-os

The framework is **org-os + the knowledge-commons architecture**. `org-os` already gives the instance pattern (template → instances), the overlay mechanism (`/initialize`, `/close`, branch-per-collaborator, Notion/Obsidian sync), the data registries, and agent skills. The Regen Knowledge Commons Toolkit framework adds: the **layer/lifecycle knowledge architecture**, the **journey-based site generator**, the **resource-graph + source-system model**, and the **CSIS-informed contribution/review process**. Generic pieces should flow **upstream** to `org-os-template`; knowledge-commons-specific pieces live here.

## Contents (as this fills out — see P1)

- `README.md` — this file
- `SEPARATION.md` — the framework | instance line-item manifest (the design contract; **review with the group**)
- `ARCHITECTURE.md` — the distilled, instantiable architecture spec (derived from `docs/MASTER.md`, not a copy) — *to write*
- `INDEX.md` — pointer map to framework-grade assets that live in place (schemas, skills, site generator) — *to write*
- `templates/` — the instance skeleton an org fills in — *to write*

## Architecture (pending D1 decision)

The architecture spine is an **open decision** ([D1](../docs/plans/architecture-lifecycle-vs-layers.md)): the **10 layers** (Ontology → Encyclopedia → Resource Graph → Concept & Idea Ecology → Option Library → Deployment → Tracks → Implementation → Evolution → Infrastructure) **or** the **Knowledge Lifecycle** (Capture → Understand → Relate → Compose → Specify → Implement → Learn → Evolve → Steward → Interoperate). The master doc's Structure Options recommends *both*: lifecycle as the spine, layers as appendices. **Resolve before building the tree.**

## How to instantiate (target procedure — see P1 Phase 5 + P9)

_Draft — the real procedure is defined in P1 and proven in P9._
1. Start from the framework (this dir + the org-os-template upstream).
2. Create the instance's identity files (`IDENTITY.md`, `SOUL.md`, `data/`).
3. Fill the instance slots: domain resources, concepts, options, tracks, journeys, articles.
4. Run the framework's agent skills (meeting-processor, knowledge-curator, resource lift) over the domain's sources.
5. Generate the public journey site.
6. Federate via RegenOS (declare upstream/downstream).

---

_This scaffold makes the framework concrete enough to start. The full separation is plan P1; the group prototype is P3._
