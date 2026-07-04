# Framework | Instance — Separation Manifest

> **Status:** draft for group review (2026-06-16). Plan [P1](../../../../docs/plans/framework-instance-split.md). This is the **design contract**: every significant repo area mapped to **framework** (domain-agnostic, reusable), **instance** (ReFi Web3 content), or **both** (framework-shaped but currently holding ReFi content). **Mark, don't move** (P1 Phase 3) — physical extraction happens only after the prototype validates the boundary.

Legend: 🟦 framework · 🟨 instance · 🟩 both (mechanism = framework, content = instance)

## Repo areas

| Area | Class | Notes / extraction direction |
|---|---|---|
| `framework/` | 🟦 | the framework home (this dir) |
| `docs/MASTER.md` | 🟩 | Matty's working doc = framework architecture *spec source* + the instance's domain reasoning. Derive `framework/ARCHITECTURE.md` from it; don't move it. |
| `docs/layers/` (10 per-layer docs) | 🟩 | layer *definitions* = framework; ReFi examples within = instance. Distill the definitions into `framework/`. |
| `docs/canvases/` | 🟩 | the canvas-per-layer *pattern* = framework; the ReFi content = instance |
| `docs/CSIS.md`, structural-integrity model | 🟦 | framework (the review discipline). See P5. |
| `docs/BACKLOG.md` (org-os triaged) | 🟩 | the backlog *mechanism* = framework; ReFi items = instance |
| `docs/CONTENT-BACKLOG.md` (119 article stubs) | 🟨 | instance (ReFi article topics) |
| `data/ontology/*.yaml` | 🟩 | schema shape = framework; ReFi entity instances = instance |
| `data/option-library.yaml`, `deployment-requirements.yaml`, `feedback-process.yaml` | 🟩 | structure = framework; ReFi content = instance |
| `data/resources.yaml` + `data/resources/` (V3 DB) | 🟨 | instance (ReFi resource graph). The *schema* + review-queue model = framework. See P2. |
| `data/meetings.yaml`, `members.yaml`, `projects.yaml` | 🟩 | org-os registries (framework mechanism) holding instance data |
| `skills/` (meeting-processor, knowledge-curator, idea-scout, schema-generator, research, workspace-improver, heartbeat-monitor, org-os-init) | 🟦 | framework — these are the domain-agnostic agent skills. Candidate **upstream** to org-os-template. |
| `scripts/` (initialize, generate/validate schemas, lift-resources, knowledge compile) | 🟦 | framework tooling |
| `src/` (Astro/Starlight + `journeys.js` + `start/[journey]` + knowledge map) | 🟩 | the **journey site generator** = framework; the 3 ReFi journeys + 119 articles = instance |
| `src/content/docs/*.md` (119 articles) | 🟨 | instance (ReFi content) |
| `src/data/journeys.js` | 🟩 | the journey *data shape* = framework; the 3 ReFi journeys = instance |
| `packages/` (operations, webapps/task-manager, koi-bridge, regen-agents, dashboard) | 🟩 | org-os packages (framework mechanism); instance config inside |
| `IDENTITY.md`, `SOUL.md`, `USER.md`, `MEMORY.md`, `HEARTBEAT.md`, `federation.yaml` | 🟨 | instance identity/state (every instance has its own; the *file set* is framework) |
| `MASTERPLAN.md`, `AGENTS.md`, `CLAUDE.md` | 🟩 | structure = framework; ReFi specifics = instance |
| org-os overlay mechanism (`/initialize`, `/close`, branch-per-collaborator, Notion/Obsidian sync) | 🟦 | framework |
| RegenOS federation (`regen-coordination-os` upstream) | 🟦 | framework (the coordination layer) |

## The clean cut (target)

- **A new instance needs to supply only the 🟨 rows** + fill the content slots in the 🟩 rows.
- **The 🟦 rows + the mechanism of the 🟩 rows = the framework** an org adopts.
- **org-os-template** already holds many 🟦 mechanisms; the framework = org-os-template + the knowledge-commons-specific 🟦 items (layer/lifecycle architecture, journey site generator, resource-graph/source-system model, CSIS-informed process).

## Open questions for the group (Heenal, Matty, Durgadas, Koi, Rather)
1. Is the **journey site generator** (Heenal's work) framework or instance? → proposed: generator = framework, journeys = instance. (Heenal to confirm.)
2. Which 🟦 skills/scripts flow **upstream** to org-os-template vs stay toolkit-specific? (Luiz + org-os.)
3. Does **CSIS** sit in the framework as a required layer or an optional overlay? (Durgadas; see P5.)
4. Where does the **resource-graph + source-system schema** live — framework schema, instance data? → proposed: schema = framework, the V3 DB = instance.
5. Lifecycle vs layers as the framework spine? → [D1](../../../../docs/plans/architecture-lifecycle-vs-layers.md).

---

_Fill this in during P1 brainstorming. It is the contract the extraction follows. Review with the group before any file moves._
