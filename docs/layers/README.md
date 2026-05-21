# Layers — Regen Knowledge Commons Toolkit

> **Index for the per-layer docs.** Each layer of the master doc (`docs/MASTER.md`) has a corresponding doc here + a corresponding Obsidian canvas under [`docs/canvases/layers/`](../canvases/layers/). Surface the layer canvas as the visual entry point; surface the layer doc as the structured read.

**Doc state:** 2026-05-15 stabilization draft. All layer docs derive from the master doc; treat as draft until reviewed.

## Core architecture (10 layers)

| # | Layer | Doc | Canvas | Master doc § | Owner |
|---|---|---|---|---|---|
| 1 | Ontology & Semantic Kernel | [01-ontology-and-semantic-kernel.md](01-ontology-and-semantic-kernel.md) | [01-ontology.canvas](../canvases/layers/01-ontology.canvas) | §5 (lines 2713–4862) | Matt + Rather + Luiz |
| 2 | Knowledge Commons / Encyclopedia | [02-knowledge-commons-encyclopedia.md](02-knowledge-commons-encyclopedia.md) | [02-encyclopedia.canvas](../canvases/layers/02-encyclopedia.canvas) | §6 (lines 4862–6734) | Heenal |
| 3 | Resource Graph & Ecosystem Atlas | [03-resource-graph-and-ecosystem-atlas.md](03-resource-graph-and-ecosystem-atlas.md) | [03-resource-graph.canvas](../canvases/layers/03-resource-graph.canvas) | §7 (lines 6734–10348) | Brandon + curator (TBD) |
| 4 | Concept & Idea Ecology | [04-concept-and-idea-ecology.md](04-concept-and-idea-ecology.md) | [04-concept-ecology.canvas](../canvases/layers/04-concept-ecology.canvas) | §8 (lines 10348–12073) | Matt (likely; confirm 2026-05-21) |
| 5 | Option Library | [05-option-library.md](05-option-library.md) | [05-option-library.canvas](../canvases/layers/05-option-library.canvas) | §9 (lines 12074–14099) | Luiz (currently) |
| 6 | Deployment & Structural Integrity | [06-deployment-and-structural-integrity.md](06-deployment-and-structural-integrity.md) | [06-deployment.canvas](../canvases/layers/06-deployment.canvas) | §10 (lines 14099–15454) | Luiz + Durgadas (CSIS-informed) |
| 7 | Tracks & Composition | [07-tracks-and-composition.md](07-tracks-and-composition.md) | [07-tracks.canvas](../canvases/layers/07-tracks.canvas) | §11 (lines 15454–17501) | Heenal (returning) |
| 8 | Implementation & Learning Memory | [08-implementation-and-learning-memory.md](08-implementation-and-learning-memory.md) | [08-implementation-memory.canvas](../canvases/layers/08-implementation-memory.canvas) | §12 (lines 17501–18873) | Koi (candidate — Bonfires substrate) |
| 9 | Evolution Layer | [09-evolution-layer.md](09-evolution-layer.md) | [09-evolution.canvas](../canvases/layers/09-evolution.canvas) | §13 (lines 18873–20239) | Koi (candidate) |
| 10 | Infrastructure & Substrate | [10-infrastructure-and-substrate.md](10-infrastructure-and-substrate.md) | [10-infrastructure.canvas](../canvases/layers/10-infrastructure.canvas) | §14 (lines 20239–21626) | Luiz (operator default) |

**Master overview canvas:** [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](../canvases/regen-knowledge-commons-toolkit-master.canvas)

## Core sequence

> Ontology → Knowledge → Resources → Options → Deployment → Tracks → Implementation → Evolution

Infrastructure (Layer 10) sits *under* the sequence, not in it.

## Core movement (the contributor's lens)

> Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve

| Move | What it means | Primary layers |
|---|---|---|
| Discover | Find resources, source systems, concepts, tools, communities, cases | 3 (Resource Graph) |
| Understand | Read concepts, frameworks, comparisons, explainers, guides | 2 (Encyclopedia) + 4 (Concept Ecology) |
| Connect | Ontology, relationships, source lineage, metadata, graph | 1 (Ontology) |
| Compose | Reusable options into tracks, pathways, configurations | 5 (Options) + 7 (Tracks) |
| Specify | What must be true before use — structural requirements | 6 (Deployment) |
| Implement | In a real context | 8 (Implementation Memory) |
| Learn | From what happened | 8 (Implementation Memory) |
| Evolve | Update the Toolkit based on signals, review, field experience | 9 (Evolution) |

A contributor does not need to walk every move. Many will only add resources, or only explain a concept, or only review claims, or only maintain infrastructure.

## Minimum Operating Kernel (v0.1)

Five working objects, enough for one useful contribution without grasping the whole system:

| Object | Meaning | Main question |
|---|---|---|
| **Resource** | Something found | What exists? |
| **Concept** | Something explained | What does it mean? |
| **Option** | Something reusable | What can be selected, adapted, or combined? |
| **Deployment** | Something specified for use | What must be explicit before this is used in practice? |
| **Signal** | Something learned or flagged | What happened, what changed, or what needs attention? |

The 25 candidate entity types (Source System, Framework, Practice, Pattern, Tool, Protocol, Standard, Template, Organization, Network, Community, Person, Project, Event, Place, Track, Implementation, Claim, Evidence, Open Question, Failure Mode, plus the 5 kernel) live at master doc §5.7 (lines 3249–4179). The kernel is the v0.1 lens; the candidates remain available.

## Cross-cutting principles (18)

These apply across **every** layer. They are not isolated sections; they should appear wherever relevant. See master doc §4 (lines 1769–2710) for full text.

| # | Principle | What it protects |
|---|---|---|
| 1 | Provenance and source lineage | Source attribution; return paths to original context |
| 2 | Attribution and return paths | Credit; relationship to source community |
| 3 | Maturity and review state | Trust state; readiness; review needs |
| 4 | Public-use boundaries | High-risk material (ecological claims, funding claims, governance recommendations) |
| 5 | Claim-evidence discipline | Separation of claim, evidence, interpretation, uncertainty, review state |
| 6 | Review should scale with risk | Right-sized care, not bureaucracy |
| 7 | Regenerative obligation | Reciprocity; anti-extractive practice; local context |
| 8 | Consent, privacy, and representation | People, communities, locations, sensitive data |
| 9 | Anti-extractive synthesis ⭐ NEW | Helpful synthesis vs extractive summarization |
| 10 | Interoperability without forced uniformity | Portable data without imposed schemas |
| 11 | Type / tag discipline | What is a type vs what is a tag |
| 12 | Pattern humility ⭐ NEW | No rapid generalization from single cases |
| 13 | Local and ecological care | Place-based stewardship |
| 14 | AI-assisted but human-governed | AI helps; humans review and steward |
| 15 | Infrastructure should serve workflows | No premature tech lock-in |
| 16 | Living systems health ⭐ NEW | Energy, trust, contribution flow, maintenance capacity |
| 17 | Compost, archive, and memory ⭐ NEW | Preserve outdated material without confusing readers |
| 18 | Contribution should be legible | Clear contribution paths |

⭐ = new in the 2026-05-15 iteration.

## Minimum structural rule

> A layer should not absorb the function of another layer unless the interface is explicit.

Examples (from master doc §3.16):

- A raw link list should not be treated as Encyclopedia content.
- A concept page should not be treated as an Option entry.
- A funding mechanism should not be treated as a valid Deployment.
- A Track should not be treated as an Implementation.
- A Case should not be treated as a Pattern too quickly.
- A Signal should not be treated as a Conclusion.
- A tag should not be treated as an ontology type.
- AI synthesis should not be treated as reviewed knowledge unless reviewed.

## How to use these docs

- **Operators + new team members:** Start with the **master overview canvas**, then drop into any layer canvas, then read the layer doc when you need depth.
- **Contributors adding content:** Find the layer whose core question matches what you're adding. Read the **boundary rules** in that layer's doc (what this layer is NOT). Use the Minimum Operating Kernel as a default if unsure. **Unsure where it goes?** Check the master doc §16 routing table or the [`docs/BACKLOG.md`](../BACKLOG.md) `needs-routing` queue.
- **Reviewers:** Use the cross-cutting principles (§4 of master doc) as the review lens. Pay particular attention to #5 (claim-evidence), #6 (review scales with risk), #9 (anti-extractive synthesis), #12 (pattern humility).
- **Picking up TODO work:** [`docs/BACKLOG.md`](../BACKLOG.md) is the triaged surface. Items are labeled by status (`raw-note` · `needs-routing` · `needs-owner` · `candidate-integration` · `high-risk` · etc.). When you take one on, lift it to [`HEARTBEAT.md`](../../HEARTBEAT.md) under your layer's section.
- **Phase 3 refactor work:** See [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md).

---

_Doc set generated 2026-05-15 against `docs/MASTER.md` (stabilization draft). Drift expected; refresh after the next biweekly._
