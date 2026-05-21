---
layer: 4
name: Concept & Idea Ecology
master_doc_section: 8
master_doc_lines: "10348–12073"
canvas: ../canvases/layers/04-concept-ecology.canvas
status: stabilization-draft
owners:
  - Matt (likely; confirm 2026-05-21)
data_refs:
  - data/ontology/concepts.yaml
related_layers:
  - "1 — Ontology"
  - "2 — Encyclopedia"
  - "4 — Concept & Idea Ecology"
  - "16 — Backlog (Frame Language Audit)"
---

# Layer 4 — Concept & Idea Ecology

> Maps lineages, paradigms, metaphors, tensions, conceptual clusters, and unresolved relationships. Prevents the Toolkit from flattening living ideas into static definitions.

## Purpose

The Concept & Idea Ecology layer helps the Toolkit understand where ideas come from, how they move, what they carry, what they conflict with, and how they change across communities.

- The **Encyclopedia** explains concepts.
- The **Ontology** defines types and relationships.
- The **Resource Graph** maps real-world sources and entities.
- The **Concept & Idea Ecology** maps the living movement of ideas.

> Many important terms in this project — regeneration, commons, governance, public goods, coordination, localism, impact, value, capital, intelligence, autonomy, federation, decentralization, stewardship, legitimacy, and knowledge commons — are not neutral. They come from histories, movements, disciplines, communities, and conflicts. The Concept & Idea Ecology keeps that context visible. — `docs/MASTER.md` §8.1

## Core questions

- Where did this idea come from? Which traditions/communities/source systems shaped it?
- What assumptions does it carry? What metaphors does it use?
- What adjacent ideas does it overlap with?
- What tensions or contradictions should remain visible?
- What ideas are being merged too quickly? Flattened by translation / AI synthesis?
- What concepts are stable enough to define, and which should remain open?
- What paradigms are influencing the Toolkit's architecture?

## Why this layer exists (master doc §8.2)

The Toolkit brings together many fields (regenerative design, web3, public goods, commons theory, localism, bioregionalism, civic infrastructure, ecological stewardship, governance, funding mechanisms, organizational design, systems thinking, AI, knowledge commons, source-system stewardship, implementation learning) — and these fields **do not always use the same words in the same way**.

Examples the master doc highlights:
- **"Commons"** — Ostrom-style governance / open-source software / Creative Commons / web3 public goods / local mutual aid / land stewardship / knowledge commoning / digital infrastructure
- **"Decentralization"** — crypto infrastructure / political theory / organizational design / local governance / networks of local nodes / data architecture / identity systems
- **"Regeneration"** — ecological restoration / regenerative agriculture / regenerative development / ReFi / local community work / movement narrative / tokenized ecological finance

> If the Toolkit ignores these differences, it will create false clarity. If it preserves them well, it can become a stronger commons.

## Subsections (master doc §8)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 10351 | Layer intro |
| Why this layer exists | 10396 | Multi-tradition tension framing |
| Function | 10469 | What this layer does |
| Layer relations | 10498 | Inputs from / outputs to other layers |
| Core objects in this layer | 10612 | Concept lineage; tension map; paradigm; metaphor; semantic drift record |
| Concept lineage template | 10788 | Template for tracing where an idea came from |
| Tension map template | 10819 | Template for surfacing genuine contradictions |
| **Core concept clusters (10)** | 10847 | The 10 clusters — see below |
| Important conceptual distinctions | 11371 | 15 distinctions (Resource vs Source System; Ontology vs Taxonomy; etc.) |
| Concept Ecology practices | 11762 | 7 working practices |
| Concept Ecology entry examples | 11891 | Worked examples |
| Working summary | 12045 | Layer summary |

## The 10 Core Concept Clusters (master doc §8.8)

| # | Cluster | Lines |
|---|---|---|
| 1 | Knowledge commons cluster | 10859 |
| 2 | Regeneration cluster | 10912 |
| 3 | Public goods and commons cluster | 10960 |
| 4 | Governance, coordination, and power cluster | 11007 |
| 5 | Funding, value, and incentives cluster | 11061 |
| 6 | Web3 infrastructure cluster | 11114 |
| 7 | Localism and bioregional coordination cluster | 11166 |
| 8 | Impact, evidence, and verification cluster | 11216 |
| 9 | AI and intelligence infrastructure cluster | 11266 |
| 10 | Infrastructure and substrate cluster | 11316 |

## Important conceptual distinctions (master doc §8.9 — 15)

Resource vs Source System · Ontology vs Taxonomy · Concept vs Framework · Practice vs Pattern · Protocol vs Playbook · Option vs Deployment · Track vs Deployment · Deployment vs Implementation · Implementation vs Pattern · Signal vs Metric · Claim vs Evidence · Public Goods vs Commons · Decentralization vs Federation vs Local Autonomy · Regeneration vs Sustainability vs Restoration · AI-assisted vs Human-reviewed

## Concept Ecology practices (master doc §8.10 — 7)

1. Preserve overloaded terms
2. Create comparison pages
3. Track conceptual drift
4. Preserve tensions
5. Treat metaphors carefully
6. Mark frontier concepts
7. Connect concepts to implementation

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **1 Ontology** | Ontology defines `Concept` as a type; Ecology maps the social/historical movement of concepts. |
| **2 Encyclopedia** | Encyclopedia explains; Ecology maps lineages, metaphors, tensions. |
| **§16 Backlog / Frame Language Audit** | Frame Language Audit (Durgadas's framing critique) lives here architecturally — though §16.8 is the master doc home. |

## Minimum rule

Living ideas should not be flattened into static definitions. Where a term has multiple living meanings across traditions, both definitions and the tension between them should be visible. **Confused or merged-too-quickly ideas create false clarity.**

## Cross-cutting principles most relevant

- #5 Claim-evidence discipline
- #9 Anti-extractive synthesis (NEW)
- #11 Type / tag discipline
- #12 Pattern humility (NEW)

## Status & next

- **Existing data:** `data/ontology/concepts.yaml` — generated 2026-04-25; pre-iteration; reflects an earlier framing. Needs rework.
- **Frame Language critique (Durgadas)** — partially mapped here architecturally (the "metaphors / tension" piece) but lives at §16.8 in the master doc. Cross-link.
- **Phase 3 work:**
  - Map the 10 Core Concept Clusters into `data/ontology/concepts.yaml` (or new `data/concept-clusters.yaml`)
  - Lift the 15 conceptual distinctions as a `data/distinctions.yaml` (machine-readable disambiguation registry)
  - Coordinate with Matt on owner / framing (per Phase 2 reconciliation)
- **Coordination:** Matt as likely owner (lineage/paradigm/framework adjacency to ontology). Confirm at ~2026-05-21 biweekly via persona/skill-card session.

## Related

- **Canvas:** [`docs/canvases/layers/04-concept-ecology.canvas`](../canvases/layers/04-concept-ecology.canvas)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.1 + §E.9 (Frame Language Audit)
- **CSIS:** [`docs/CSIS.md`](../CSIS.md) — frame-language critique partially encoded
- **2026-04-23 biweekly memory:** [`MEMORY.md`](../../MEMORY.md) — Frame 1 / Frame 2 / Frame 3 typology
