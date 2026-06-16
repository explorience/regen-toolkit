# D1 — Architecture Decision: Knowledge Lifecycle vs 10 Layers

> **Status:** decision memo (expanded 2026-06-16) · **Wave:** 1 (gates P1) · **Owner:** Luiz + group
> **Skills to develop:** `superpowers:brainstorming` (resolve the open questions) · `deep-research` already done over `docs/MASTER.md`
> Part of the [convergence pipeline](CONVERGENCE-PIPELINE.md). **Blocks P1's tree shape.** This memo is the artifact to take to the next biweekly.

---

## 1. The decision, precisely

The framework needs **one organizing spine**. The 2026-06-15 master doc carries two candidate spines and recommends combining them. We must decide what `framework/`, the per-layer docs, the canvases, the `data/` registries, and the site IA are organized *around*:

- **(A) The 10 Layers** — the *structure* view. What kinds of things exist.
- **(B) The Knowledge Lifecycle** — the *movement* view. How a thing moves from capture to evolution.
- **(C) Both, mapped** — lifecycle as the human/process spine; layers as the structural/data model.

This is **not** a question of which is "right" — the master doc shows they are **two projections of the same system**. It's a question of which is the *primary organizing axis* (and therefore the directory tree, the doc structure, the site navigation), with the other as the secondary view.

## 2. What each is (grounded in the master doc)

### (A) The 10 Layers — `docs/MASTER.md` §"Layer stack" + `docs/layers/`
The *noun* structure — what kinds of things exist and how they relate:

1. Ontology & Semantic Kernel · 2. Knowledge Commons / Encyclopedia · 3. Resource Graph & Ecosystem Atlas (+ Source-System Registry) · 4. Concept & Idea Ecology · 5. Option Library · 6. Deployment & Structural Integrity · 7. Tracks & Composition · 8. Implementation & Learning Memory · 9. Evolution Layer · 10. Infrastructure & Substrate.

Already materialized in this repo: `docs/layers/01..10`, `docs/canvases/layers/`, and the `data/` registries (`ontology/`, `option-library.yaml`, etc.). **This is the structure the org-os data model already speaks.**

### (B) The Knowledge Lifecycle — `docs/MASTER.md` §"Knowledge Lifecycle" (Next Working Draft, §10–20)
The *verb* sequence — how knowledge moves. Master doc: *"Explain how knowledge moves through the Toolkit. A single thing can enter as a link, podcast episode, tool, forum post, grant report, GitHub repo, tweet, call transcript, implementation story, or question."*

**Capture → Understand → Relate → Compose → Specify → Implement → Learn → Evolve → Steward → Interoperate** (10 stages).

The master doc's two shorthands for the same movement:
- **Core movement** (§4): `Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve`
- **Object movement** (§4): `Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution`

And the **Minimum Operating Kernel** (5 objects that carry the movement): **Resource · Concept · Option · Deployment · Signal**.

## 3. The reconciliation (the key insight)

**The master doc already does both, deliberately.** §4 gives the *movement* (verbs) AND the *layer stack* (nouns) AND a *cross-layer mapping* between them, on the same page. The lifecycle "replaces the old Resource Graph and Social Signal sections as the first lifecycle phase" (§11) — i.e., the lifecycle **re-groups the layers into phases**; it doesn't delete them.

So: **lifecycle = how it moves; layers = what it's made of.** They are complementary, not competing. The honest mapping (below) is *mostly* 1:1 with a few many-to-one joins — which is itself the argument for keeping both views rather than forcing one.

### Mapping table (lifecycle stage → layers → kernel object)

| Lifecycle stage (verb) | Contains (master doc) | Layer(s) (noun) | Kernel object |
|---|---|---|---|
| **Capture** | resources, social signals, media, repos, source systems | L3 Resource Graph + Source-System Registry | Resource |
| **Understand** | encyclopedia, concepts, glossary, learning paths | L2 Encyclopedia | Concept |
| **Relate** | ontology, metadata, source lineage, claims, evidence | **L1 Ontology** (spans all) | — (semantic kernel) |
| **Compose** | options, mechanisms, patterns, templates, design choices | L5 Option Library (+ L4 Concept & Idea Ecology) | Option |
| **Specify** | tracks, deployments, compatibility, structural constraints | L6 Deployment + L7 Tracks | Deployment |
| **Implement** | pilots, local nodes, campaigns, rounds, tools, cases | L8 Implementation | — |
| **Learn** | implementation memory, feedback, failure, third-party signals | L8 Implementation Memory (+ feedback) | Signal |
| **Evolve** | revision, versioning, signals, adaptive loops | L9 Evolution | Signal |
| **Steward** | review, attribution, consent, restricted memory, future rewards | *cross-cutting* (Contributor Roles + CSIS) | — |
| **Interoperate** | infrastructure, schemas, publishing, AI workflows, federation | L10 Infrastructure & Substrate | — |

Notes on the seams (honest, not clean):
- **L1 Ontology = "Relate" but spans all** — it's the semantic kernel, not a phase. Stays cross-cutting in both views.
- **"Steward" has no layer** — it's the governance/CSIS cross-cut. Argues against lifecycle-only (you'd invent a layer) and for keeping CSIS/roles cross-cutting.
- **"Specify" joins two layers** (Deployment + Tracks); **L4 Concept & Idea Ecology** folds under Compose/Understand. Minor many-to-one.

## 4. The three options + trade-offs

| | (A) Layers spine | (B) Lifecycle spine | (C) Both — lifecycle spine + layers as structure |
|---|---|---|---|
| **Human legibility** | medium (nouns; "where does X go?") | **high** (verbs; matches journeys + "add one useful thing") | **high** |
| **Data-model fit** | **high** (org-os `data/` already speaks layers) | low (would need re-keying registries) | **high** (layers stay the data model) |
| **Site/journey fit** | medium | **high** (journeys are lifecycles) | **high** |
| **Matches master doc rec** | no | partial | **yes** ("Small Core, Large Appendices, Lifecycle spine" + dedicated layer sections) |
| **Migration cost** | none (status quo) | high (rebuild layer docs/canvases) | **low** (add a spine view; keep layer docs) |
| **Risk** | stays noun-heavy; harder for newcomers | breaks the data model; "Steward" orphaned | minor (must maintain the mapping) |

## 5. Recommendation

**Adopt (C): the Knowledge Lifecycle is the human-facing spine; the 10 Layers are the structural/data model. Ontology and Stewardship/CSIS stay cross-cutting.**

Concretely:
- **Public + framework narrative** → organized by **lifecycle** (Capture→…→Interoperate). This is what a newcomer, a journey, and the hub post follow. It matches the Core Movement and "add one useful thing → the system routes it."
- **`data/` registries + per-layer docs/canvases** → stay organized by **layer** (the nouns). No re-keying. The org-os data model is unchanged.
- **The mapping table (§3) is the bridge** — maintained as a first-class artifact (`framework/ARCHITECTURE.md`) so the two views never drift.
- **Ontology (L1)** and **Stewardship/CSIS** are explicitly **cross-cutting**, not phases/layers.

This is exactly the master doc's own recommendation ("Small Core, Large Appendices, with Knowledge Lifecycle as the architecture spine and dedicated sections for Tracks, Source Systems, and Structural Integrity"). It also lets **Heenal's journey site** (lifecycle-shaped) and **the org-os registries** (layer-shaped) coexist without either being retrofitted.

## 6. Consequences for the framework (feeds P1 + the framework review)

- **`framework/ARCHITECTURE.md`** = the lifecycle spine + the mapping table + the cross-cutting Ontology/CSIS. The instantiable spec is lifecycle-shaped.
- **`framework/` tree** is organized by lifecycle phase at the top; each phase points to its layer(s)/registries.
- **The journey site generator** is validated as framework (journeys ARE lifecycles).
- **The `data/` model is NOT rebuilt** — layers stay. This de-risks P1 (mark-don't-move holds).
- **Per-layer docs/canvases are NOT thrown away** — they become the "structure" reference under the lifecycle spine.

## 7. What this does NOT change
- The `data/` registries, `.well-known/` schemas, the existing `docs/layers/` + canvases (they remain the structural reference).
- The Minimum Operating Kernel (5 objects) — it's the lifecycle's payload.
- The live v1 site (already journey/lifecycle-shaped — confirms the direction).

## 8. Open questions for the group (next biweekly)
1. **Confirm (C)** — lifecycle spine + layers as structure? (Heenal's journeys + Matty's master doc both point this way.)
2. **"Steward" placement** — cross-cutting governance, or promote to a visible phase? (Durgadas — CSIS/structural integrity lives here; P5.)
3. **L4 Concept & Idea Ecology** — keep as a layer, or fold into Understand+Compose? (affects the count: 10 layers vs ~8 phases.)
4. **Naming** — do we expose "lifecycle stages" or "Core Movement" to the public? (verbs people recognize.)
5. **The mapping table's authority** — `framework/ARCHITECTURE.md` as the canonical bridge; who maintains it.

## 9. How to proceed
1. `superpowers:brainstorming` over Q1–Q5 (Luiz; optionally with Durgadas on Q2).
2. Take this memo + the mapping table to the next biweekly (Heenal, Matty, Durgadas, Koi, Rather).
3. On confirmation → unblock **P1** (build `framework/ARCHITECTURE.md` on the lifecycle spine; tree follows).

## Definition of done
- (C) confirmed (or an alternative chosen); the mapping table ratified; `framework/ARCHITECTURE.md` can be written; P1 unblocked.
