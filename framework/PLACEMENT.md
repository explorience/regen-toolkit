# Framework Review — Placement & Operation

> **Status:** review v2 (2026-06-17). **Supersedes the "profile-of-org-os" framing** with a **modular-package** model per operator direction: develop the framework as a standalone, **org-os-agnostic** package (usable anywhere), with org-os integration as a separate, **replaceable** module. Pairs with [`README.md`](README.md), [`SEPARATION.md`](SEPARATION.md), and [D1](../docs/plans/architecture-lifecycle-vs-layers.md).

---

## 1. Ground truth — topology (unchanged)

```
03 Libraries/
├─ regen-coordination-os/         ← the org-os framework (template + standards) + RegenOS
│  └─ repos/regen-toolkit/         ← WE ARE HERE = ReFi Web3 Toolkit instance
│     └─ packages/                 ← @org-os/* TS packages (koi-bridge, regen-agents, …)
├─ refi-dao-os/  refi-bcn-os/  …   ← sibling instances (P9/P10 targets)
```

Two facts from recon that shape this: **(a)** the upstream `org-os-template` dir is **empty** — the org-os substrate is currently *baked into* this repo, not a live dependency; **(b)** `packages/` is an established monorepo of `@org-os/*` TS packages with `src/`→`dist/` + CLIs. A framework package fits the existing convention.

## 2. What the framework IS — a modular, org-os-AGNOSTIC core (revised model)

The framework is **the toolkit's reusable core, extracted as a standalone package that does not depend on org-os.** org-os becomes *one* (replaceable) host. Inverted dependency, three modular layers:

```
┌─ packages/toolkit-framework   ★ THE FRAMEWORK — standalone, org-os-AGNOSTIC
│    The full master-doc framework as a portable, adoptable artifact:
│      · architecture: layers + lifecycle spine + mapping (D1)
│      · schemas / ontology / semantic kernel (the data model, portable)
│      · contribution + CSIS-informed review process + maturity states
│      · journey / site MODEL (generator-agnostic)
│      · AGENTIC SKILLS (work in ANY agent context — Claude Code, Cursor, Zed…)
│      · templates (instance skeleton) + a small CLI/API
│    → adoptable in ANY repo/context, WITH OR WITHOUT org-os
│
├─ org-os-kms                    ○ the org-os INTEGRATION — REPLACEABLE
│    "org-os Knowledge Management System": binds the framework into org-os —
│    setup, /initialize–/close lifecycle, registries, federation/RegenOS —
│    to create + manage toolkits and knowledge commons.
│    depends on: toolkit-framework + org-os. Swap it for a different host
│    (plain CLI, another OS, a SaaS) without touching the framework.
│
└─ INSTANCE                       (regen-toolkit, refi-dao-os, refi-bcn-os, …)
     consumes toolkit-framework (+ org-os-kms if using org-os) + domain content + identity
```

**Why this is better than "profile of org-os":** it makes the framework **independently adoptable** (the master doc's whole point — "somebody not even related to us could structure it this way"). org-os stops being a *requirement* and becomes a *convenience host*. High modularity: every layer is replaceable.

**This answers "usable without org-os":** adopt `toolkit-framework` + its skills alone → you have a working knowledge-commons method. Add `org-os-kms` only when you want the full org-os management/federation.

## 3. WHERE it lives — develop as a package; mirror to a repo

**Both of the operator's options, sequenced:**
- **Develop as `packages/toolkit-framework`** (in this monorepo) — matches the `@org-os/*` convention, immediately consumable by this instance, versioned, low-friction iteration. *(Scope: NOT `@org-os/` — it must be agnostic. Proposed `@regen-commons/toolkit-framework` or `@knowledge-commons/framework` — naming is a decision.)*
- **Mirror/publish to its own repo** when stable — the public artifact external orgs adopt (npm package + GitHub repo). The package *is* the repo; mirroring is a publish step, not a fork.
- **`org-os-kms`** → `packages/org-os-kms` (`@org-os/kms`) to start; it naturally homes in the org-os framework (`regen-coordination-os`) later, since it's an org-os concern.

So: **package-first, repo-when-ready.** You get modularity now and a clean adoptable artifact later, without committing to repo overhead prematurely (Matty: "not necessarily its own repo yet").

## 4. Proposed package layout

```
packages/toolkit-framework/              @regen-commons/toolkit-framework  (agnostic)
  package.json   README.md               ← the adoption front door (the "artifact")
  src/{ index.ts, cli.ts }               ← programmatic API + CLI: init|validate|capture|route|review|compose|build
  architecture/                          ← the master-doc framework, distilled + operational
    ARCHITECTURE.md (layers+lifecycle+mapping, D1) · layers/ · lifecycle/ ·
    minimum-operating-kernel.md · cross-cutting-principles.md (18)
  schemas/                               ← portable data model (JSON Schema / YAML)
    ontology · resource · source-system · concept · option · track ·
    deployment · implementation · signal · review-state · contribution-record
  process/                               ← contribution intake · review queues ·
    csis-safeguards · maturity-states (CSIS-informed; P5)
  site/                                  ← journey/site MODEL (generator-agnostic) + journey.schema
  skills/                                ← AGENTIC skills, org-os-agnostic
    knowledge-commons-init · capture-and-route · review · compose-journey
  templates/instance/                    ← instance skeleton (data/, identity, config slots)

packages/org-os-kms/                     @org-os/kms  (replaceable integration)
  src/{ cli.ts, bind.ts }                ← kms create|manage; wires framework→org-os
  (binds: schemas→org-os registries · lifecycle→/initialize–/close · federation→RegenOS)
```

**Maps to the master doc 1:1** — every framework section of `docs/MASTER.md` (System Overview, Ontology, Resource Graph + Source Systems, Concept Ecology, Option Library, Deployment, Tracks, Implementation, Evolution, Infrastructure, Contributor Roles + the CSIS map) lands in `architecture/` + `schemas/` + `process/`. The package is the **operational distillation** of the 30k-line doc — you adopt the package, you don't read the doc.

## 5. HOW it operates

The framework runs its **lifecycle loop** via its **own** skills/CLI — no org-os required:

```
toolkit-framework init        → scaffold an instance from templates/
CAPTURE      skill: capture-and-route   (source → typed object → layer)
RELATE       schemas + ontology         (the semantic kernel)
COMPOSE/SPECIFY  options/tracks/deployment models
REVIEW       skill: review              (CSIS-informed queues; maturity/not-endorsement)   ← P5
INTEROPERATE toolkit-framework build    (journey site model → site)
```

`org-os-kms` then *adds* (optionally): `/initialize`–`/close` sync, the org-os registries/dashboard, branch-per-collaborator, Notion/Obsidian, and **RegenOS federation** (self-qualifying adoption). Remove `org-os-kms` → the framework still works, just without the org-os management/federation niceties.

- **Framework ↔ RegenOS:** the framework is *what you adopt*; RegenOS (via `org-os-kms`) is *how an org-os-hosted instance federates*. A non-org-os adopter uses the framework standalone and can federate later by adding `org-os-kms`.

## 6. How the current repo refactors into this (the real P1 work)

This is what "framework/instance split" concretely becomes:

| Current (in `regen-toolkit`) | → moves to |
|---|---|
| `skills/{knowledge-curator, meeting-processor, schema-generator, research, idea-scout}` (agnostic versions) | `packages/toolkit-framework/skills/` |
| `skills/{org-os-init, heartbeat-monitor, workspace-improver}` | `packages/org-os-kms/` (org-os-coupled) |
| `schemas/`, `data/ontology/` shapes, option-library/deployment/feedback *schemas* | `packages/toolkit-framework/schemas/` |
| `docs/layers/`, `docs/MASTER.md` framework sections (distilled) | `packages/toolkit-framework/architecture/` |
| journey site *generator* (`src/data/journeys.js` shape, `start/[journey]`) | `packages/toolkit-framework/site/` (model) + instance keeps the impl |
| `scripts/{generate-schemas, validate-structure, lift-resources, gen-graph}` | `toolkit-framework` CLI commands |
| ReFi content (`src/content/docs`, the V3 resource DB, the 3 journeys, `data/*` entries) | **stays in the instance** |
| `IDENTITY/SOUL/MEMORY/HEARTBEAT/federation.yaml` | **stays in the instance** (filled from `templates/instance/`) |

`framework/` (this dir) stays as the **spec/manifest** during extraction, then becomes the package's `README` + `architecture/`.

## 7. Decisions for you / the group
1. **Confirm the modular model** — standalone `toolkit-framework` package + replaceable `org-os-kms`? (vs my earlier profile-of-org-os.)
2. **Package name/scope** — `@regen-commons/toolkit-framework`? `@knowledge-commons/framework`? (must NOT be `@org-os/`.)
3. **`org-os-kms` home** — `packages/org-os-kms` here, or develop it in `regen-coordination-os` (the org-os framework) and consume it? (it's an org-os concern.)
4. **Skills in the framework** — confirm shipping agentic skills *inside* `toolkit-framework/skills/` (for agnostic adoption), with org-os-specific skills in `org-os-kms`.
5. **Repo mirror timing** — package now, public repo when stable (recommended) vs own repo immediately.
6. **Scope of "fully developed"** — encompass *all* master-doc framework sections in v1, or land the spine (architecture + schemas + 1–2 skills) first and grow? (recommend spine-first, then completeness.)

## 8. Deferred
- D1 (lifecycle spine) still gates `architecture/`.
- ReFi Commons stewardship of the framework artifact → P8 (may shift naming/branding).
- The actual build is a substantial multi-session effort → re-scope **P1** around this package (see below).

---

_One line: **develop the framework as a standalone, org-os-agnostic `packages/toolkit-framework` (the full master-doc framework + agentic skills, adoptable anywhere), with a separate replaceable `org-os-kms` integration module; package-first, mirror to a public repo when stable.**_
