# D1 — Architecture Decision: Knowledge Lifecycle vs 10 Layers

> **Status:** decision-needed · **Wave:** 1 (gates P1) · **Owner:** Luiz + group · **Skills:** `superpowers:brainstorming`; `deep-research` over `docs/MASTER.md`
> Part of the [convergence pipeline](CONVERGENCE-PIPELINE.md). **Blocks P1 Phase 0–2.**

## The decision

The 2026-06-15 master doc carries **two architectures** and recommends combining them:
- **10 Layers** (current `docs/layers/` + canvases): Ontology → Encyclopedia → Resource Graph → Concept & Idea Ecology → Option Library → Deployment → Tracks → Implementation → Evolution → Infrastructure.
- **Knowledge Lifecycle** (master doc "Next Working Draft"): Capture → Understand → Relate → Compose → Specify → Implement → Learn → Evolve → Steward → Interoperate.
- **Structure Options recommendation:** *"Small Core, Large Appendices, with Knowledge Lifecycle as the architecture spine"* + layers/tracks/source-systems as dedicated sections.

## Why it gates P1
The `framework/` tree shape, the per-layer docs, the canvases, and the site IA all hang off this choice. Building the framework on layers and then switching to lifecycle = double work. **Decide before extracting.**

## Options
1. **Layers as spine** (status quo) — keep the 10-layer docs/canvases; lifecycle is a reading lens.
2. **Lifecycle as spine** (master doc rec) — reorganize around the 10 lifecycle stages; layers become appendices/cross-sections.
3. **Both** — lifecycle = public/reader spine (verbs, intuitive); layers = the structural/data model (nouns). Map 1:1 where possible.

## Recommendation to take to the group
Option 3, leaning master-doc: **lifecycle as the spine for humans** (it maps onto the journeys + the Core Movement Discover→…→Evolve), **layers as the data/structural model** (they map onto `data/` registries). The two are complementary (verbs over nouns), not competing. This also lets Heenal's journey site (lifecycle-ish) and the org-os data model (layers) coexist.

## Deliverables
- A 1-page decision memo + a lifecycle↔layers mapping table.
- Surface at the next biweekly (Heenal, Matty, Durgadas, Koi, Rather).

## Definition of done
- The spine is chosen; the mapping table exists; P1 can build the tree.

## Dependencies
- Input: `docs/MASTER.md` §"Next Working Draft" + §"Structure Options". Output: unblocks P1, informs P3/P6 site IA.
