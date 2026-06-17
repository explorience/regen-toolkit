# P1 — Framework / Instance Separation

> **Status:** active · **Wave:** 1 · **Owner:** Luiz · **Branch:** `regen-toolkit-os`
> **Depends on:** D1 (architecture: lifecycle vs 10-layers) for the final tree shape
> **Skills to load when executing:** `superpowers:brainstorming` (design) → `superpowers:writing-plans` → `superpowers:subagent-driven-development`; `superpowers:using-git-worktrees` for isolated work
> **This is the spine of the [convergence pipeline](CONVERGENCE-PIPELINE.md)** and the core of the 2026-06-15 "framework/instance split" decision.

## Goal

Extract the **domain-agnostic framework** into a **standalone, org-os-agnostic package** — `packages/toolkit-framework` — that encompasses the full master-doc framework + agentic skills and is adoptable in any context (with or without org-os), plus a separate **replaceable `org-os-kms`** integration module. So that (a) any org can adopt the framework as a portable artifact, (b) it's usable without org-os, and (c) the group grasps it as a concrete, runnable package rather than a 30k-line doc.

> **Architecture (per [`framework/PLACEMENT.md`](../../framework/PLACEMENT.md) v2):** modular, inverted dependency — `packages/toolkit-framework` (agnostic core: architecture · schemas · process · site model · skills · CLI) ← `org-os-kms` (replaceable org-os integration) ← instances. The concrete current→package refactor map is **PLACEMENT §6**.

## Context

Decided 2026-06-15 (Matty + Luiz): *"the ReFi web3 toolkit is just the application of this in a specific domain."* Surfaced earlier by Koi (2026-05-21): *"are we building the toolkit or the knowledge? They are not the same thing."* The master doc conflates the two. The 2026-06-15 master doc's "Next Working Draft" + "Structure Options" already gesture at a reusable architecture.

This is **already the praxis of the group** — Heenal's journey site (the framework's site generator), Matty's master doc (the framework's architecture spec), Durgadas's CSIS/frame-language (the framework's structural-integrity layer), Koi's cells/Bonfires (the framework's evolution substrate), Rather's ontology (the framework's semantic kernel). The work is to **name and separate** these into a framework, not invent something new.

## What is framework vs instance (working definition — refine in brainstorming)

| Concern | **Framework** (domain-agnostic) | **Instance** (ReFi Web3) |
|---|---|---|
| Architecture | The layer/lifecycle model, flows, the Minimum Operating Kernel, cross-cutting principles | which layers are populated, in what order |
| Data model | The schemas: ontology shape, resource/option/track/deployment/implementation registries, review/maturity states | the actual ReFi entries (resource DB V3, articles) |
| Site generator | The journey-based Astro/Starlight structure (`journeys.js` shape, `start/[journey]`, knowledge map) | the 3 ReFi journeys + 119 ReFi articles |
| Agent skills | `meeting-processor`, `knowledge-curator`, `idea-scout`, `schema-generator`, `research`, etc. (org-os skills) | ReFi-specific prompts/config |
| Process | contribution intake, review pipelines, CSIS-informed safeguards, maturity labels | who reviews what; ReFi review queues |
| Federation | RegenOS upstream/downstream + self-qualifying adoption | this instance's peers |
| Org-os overlay | the overlay *mechanism* (initialize/close, branch-per-collaborator, Notion/Obsidian sync) | this instance's `data/`, `MEMORY.md`, `HEARTBEAT.md` |

**Key insight:** the **org-os framework already IS** much of this (it's the template→instance pattern). The Regen Knowledge Commons Toolkit framework = org-os + the knowledge-commons layer architecture + the journey site generator + the contribution/review process. So the separation is partly *recognizing* what's already framework (org-os, schemas, skills, site generator) vs instance (ReFi content).

## Phases

### Phase 0 — Resolve D1 (architecture decision) first
The framework tree shape depends on whether the spine is the **10 layers** (current per-layer docs) or the **Knowledge Lifecycle** (Capture→…→Interoperate, recommended by the master doc's Structure Options as "Small Core, Large Appendices + Lifecycle spine"). **Do not build the tree until D1 is decided.** See [`architecture-lifecycle-vs-layers.md`](architecture-lifecycle-vs-layers.md). Surface at the next biweekly with the group.

### Phase 1 — Separation manifest (the design artifact)
Produce `framework/SEPARATION.md` (started in the scaffold): an explicit line-item mapping of every significant repo area → framework | instance | both. This is the brainstorming output and the contract for the extraction. Get Matty/Heenal/Durgadas eyes on it before moving files.

### Phase 2 — Scaffold `packages/toolkit-framework` (agnostic core)
Create the package skeleton per PLACEMENT §4: `package.json` (neutral scope, minimal deps), `src/{index,cli}`, `architecture/` · `schemas/` · `process/` · `site/` · `skills/` · `templates/instance/`. Populate `architecture/ARCHITECTURE.md` from the master doc framework sections (distilled, NOT a copy) once **D1** sets the spine. Ship the first **agentic skill** (`knowledge-commons-init` or `capture-and-route`) to prove agnostic operation.

### Phase 3 — Extract per the refactor map (PLACEMENT §6)
Move framework-grade assets into the package, leaving instance content in place: agnostic `skills/*` → `toolkit-framework/skills/`; `schemas/` + `data/` schema shapes → `toolkit-framework/schemas/`; the journey site *model* → `toolkit-framework/site/`; framework scripts → CLI commands. **Mark-don't-move first** (annotate in `SEPARATION.md`), then physically move once the boundary is validated (P3). Don't break `npm run build` / `validate:schemas`.

### Phase 3b — Scaffold `org-os-kms` (replaceable integration)
Create `packages/org-os-kms` (`@org-os/kms`): binds `toolkit-framework` → org-os (setup, `/initialize`–`/close`, registries, RegenOS federation). Move org-os-coupled skills (`org-os-init`, `heartbeat-monitor`) here. The instance consumes `toolkit-framework` + `org-os-kms`.

### Phase 4 — Instance clarity
Make the ReFi instance content explicit and bounded: the resource DB V3 (P2), the 119 articles + 3 journeys, the ReFi-specific `data/` entries. Document "to make a new instance, replace these."

### Phase 5 — Make it instantiable (the proof)
Define the **instantiation procedure**: how `refi-dao-os` adopts the framework (clone/template, fill the instance slots, run the skills). This is the bridge to P9. Likely: the framework lives referenceable (a `framework/` dir + the org-os-template upstream); an instance = framework + `data/` + content + identity files.

### Phase 6 — Prototype for the group (→ P3)
Hand off to [`framework-prototype-demo.md`](framework-prototype-demo.md): the runnable demo (live journey site + org-os layer + the framework structure made visible) presented to the group.

## Deliverables
- `framework/README.md` — what the framework is + how to instantiate (scaffolded)
- `framework/SEPARATION.md` — the framework|instance manifest (scaffolded; to be filled in brainstorming)
- `framework/ARCHITECTURE.md` — distilled instantiable architecture spec (from MASTER.md)
- `framework/templates/` — instance skeleton
- `framework/INDEX.md` — pointer map to in-place framework assets
- Updated `IDENTITY.md` / `MASTERPLAN.md` reflecting the framework/instance distinction

## Dependencies & interrelations
- **D1** (architecture) gates Phase 0–2.
- Feeds **P3** (prototype), **P6** (RegenOS docs reference the framework), **P9/P10** (deployment instantiates it).
- **P2** (resource lift) populates the instance side.
- Coordinate with **org-os upstream** (`regen-coordination-os`): the framework is partly an org-os superset — decide what flows upstream to the template vs stays toolkit-specific.

## Definition of done
- `framework/` cleanly describes the domain-agnostic system; a reader can tell framework from instance.
- The separation manifest is reviewed by ≥1 of Matty/Heenal/Durgadas.
- The instantiation procedure is written + dry-run-able (→ P9 executes it for real).
- `npm run build` + `npm run validate:schemas` still pass (don't break the instance).

## Open decisions (resolve in brainstorming, surface to group)
1. **D1** — lifecycle spine vs 10 layers (or both: lifecycle as spine, layers as appendices per Structure Options).
2. **Package now, repo when stable** — RESOLVED: develop as `packages/toolkit-framework`; mirror/publish to its own public repo when stable (PLACEMENT v2 §3).
3. **Framework name / scope** — must be org-os-agnostic (NOT `@org-os/`). Proposed `@regen-commons/toolkit-framework` or `@knowledge-commons/framework`. *(open)*
4. **Relationship to org-os** — RESOLVED: the framework is **agnostic** (does not depend on org-os); org-os integration is a separate **replaceable** `org-os-kms` module that consumes the framework (PLACEMENT v2 §2). org-os becomes a host, not a requirement.
5. **ReFi Commons home** — if the toolkit moves under ReFi Commons (2026-06-15), does the framework's stewardship/branding shift? Keep `framework/` thin until that settles.
