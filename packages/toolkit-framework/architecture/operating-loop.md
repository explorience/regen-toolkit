# The Operating Loop — Movement, Objects, and the Lifecycle↔Layer Bridge

The framework carries **two projections of the same system**: a *movement* (verbs — how knowledge flows) and a *structure* (nouns — the 10 layers). This doc holds the movement, its object shorthand, and the bridge between the two views.

> The movement exists so the commons does not become a pile of content. It gives the commons a way to **learn** — to preserve the path from knowledge to responsible action and back into learning. (Source: master doc *System Overview & Core Movement*.)

## The Core Movement (the human spine)

> **Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve**

1. **Discover** resources, source systems, concepts, tools, communities, cases, and open questions.
2. **Understand** what they mean through concepts, frameworks, comparisons, explainers, and guides.
3. **Connect** them through ontology, relationships, source lineage, metadata, and graph structure.
4. **Compose** reusable options into tracks, pathways, or possible configurations.
5. **Specify** what must be true before use through deployment checks and structural requirements.
6. **Implement** in a real context.
7. **Learn** from what happened.
8. **Evolve** the commons based on signals, review, field experience, and changing conditions.

No contributor must walk every move. Some only add resources, some only improve explanations, some only refine ontology, some only review claims, some only document implementation learning, some only maintain infrastructure. The movement is the shape of the whole; any single contribution is a step within it.

## The object shorthand

> **Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution**

The compact version of the same movement, expressed in the objects that carry it. The five most-used of these objects form the **Minimum Operating Kernel** (see [`kernel-objects.md`](kernel-objects.md)).

## Cross-layer mapping (movement → layers)

| Move | What it means | Primary layer(s) |
|---|---|---|
| Discover | Find resources, source systems, concepts, tools, communities, cases | L3 Resource Graph (+ Source-System Registry) |
| Understand | Read concepts, frameworks, comparisons, explainers, guides | L2 Encyclopedia (+ L4 Concept & Idea Ecology) |
| Connect | Ontology, relationships, source lineage, metadata, graph | L1 Ontology *(cross-cutting)* |
| Compose | Reusable options into tracks, pathways, configurations | L5 Option Library (+ L7 Tracks) |
| Specify | What must be true before use — structural requirements | L6 Deployment & Structural Integrity |
| Implement | In a real context | L8 Implementation & Learning Memory |
| Learn | From what happened | L8 Implementation & Learning Memory |
| Evolve | Update the commons from signals, review, field experience | L9 Evolution |

## The lifecycle ↔ layer bridge

The full **knowledge lifecycle** is the human-facing spine — the master doc's recommended "architecture spine." It has ten stages (it adds **Capture** discovery framing, **Relate**, **Steward**, and **Interoperate** to the Core Movement). The lifecycle re-groups the layers into phases; it does not delete them. **Lifecycle = how it moves; layers = what it's made of; this table is the bridge.**

| Lifecycle stage (verb) | Contains | Layer(s) (noun) | Kernel object |
|---|---|---|---|
| **Capture** | resources, social signals, media, repos, source systems | L3 Resource Graph + Source-System Registry | Resource |
| **Understand** | encyclopedia, concepts, glossary, learning paths | L2 Encyclopedia | Concept |
| **Relate** | ontology, metadata, source lineage, claims, evidence | **L1 Ontology** *(spans all)* | — (semantic kernel) |
| **Compose** | options, mechanisms, patterns, templates, design choices | L5 Option Library (+ L4 Concept & Idea Ecology) | Option |
| **Specify** | tracks, deployments, compatibility, structural constraints | L6 Deployment (+ L7 Tracks) | Deployment |
| **Implement** | pilots, local nodes, campaigns, rounds, tools, cases | L8 Implementation | — |
| **Learn** | implementation memory, feedback, failure, third-party signals | L8 Implementation Memory (+ feedback) | Signal |
| **Evolve** | revision, versioning, signals, adaptive loops | L9 Evolution | Signal |
| **Steward** | review, attribution, consent, restricted memory, future rewards | *cross-cutting* (Contributor Roles + CSIS) | — |
| **Interoperate** | infrastructure, schemas, publishing, AI workflows, federation | L10 Infrastructure & Substrate | — |

Honest seams (not a clean 1:1):

- **L1 Ontology = "Relate" but spans all.** It is the semantic kernel, not a phase — it stays cross-cutting in both views.
- **"Steward" has no layer.** It is the governance / structural-integrity cross-cut (Contributor Roles + CSIS). This is exactly why those stay cross-cutting rather than becoming a layer.
- **"Specify" joins two layers** (Deployment + Tracks); **L4 Concept & Idea Ecology** folds under Compose/Understand. Minor many-to-one joins — themselves the argument for keeping both views rather than collapsing one into the other.

## Reconciling the two orderings (R5)

The layer sequence and the object loop disagree on one edge:

- **Layer sequence** (data-model view): *Deployment → Tracks.* You specify the structural requirements, then compose pathways over them.
- **Object loop / Compose→Specify** (human view): *Track → Deployment.* You assemble a pathway of options, then specify what must be true before use.

**Resolution:** these are **two readings of the same relationship, not a contradiction.**

- The **lifecycle is the human spine** — and on the human spine, **Compose (tracks) precedes Specify (deployment)**: a person assembles a candidate pathway and *then* specifies the structural conditions for acting on it.
- The **layer sequence is the data-model view** — and there it is convenient to define Deployment (the structural-integrity contract) before Tracks (which reference deployment checks).
- The **mapping table above is the bridge.** Both views agree that Tracks and Deployment are adjacent and mutually referencing; they differ only in which they list first, for different audiences. The framework keeps both and treats the table as the canonical reconciliation so the views never silently drift.
