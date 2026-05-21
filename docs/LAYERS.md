# LAYERS.md — Per-Layer Status

> **2026-05-15 iteration checkpoint.** Matty's 2026-05-15 master-doc revision (the **stabilization draft** at `docs/MASTER.md`, ~24,776 lines) **restored the Tracks layer** (dropped 2026-05-06) and **added Infrastructure & Substrate as Layer 10**. The layer set is now 10. **Authoritative per-layer reads live at [`docs/layers/`](layers/) — one doc per layer, one canvas per layer, plus the master overview canvas at [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](canvases/regen-knowledge-commons-toolkit-master.canvas).** This file is the per-layer **status table**; the deep reads have moved.

**Iteration history:**
- 2026-04-23 — 8 layers (Resource Graph · Encyclopedia · Ontology · Option Library · Deployment · Tracks · Implementations · Feedback) — archived at [`archive/MASTER-2026-04-23-regen-web3-toolkit.md`](archive/MASTER-2026-04-23-regen-web3-toolkit.md)
- 2026-05-06 — 8 layers (Ontology promoted; Tracks dropped; Concept & Idea Ecology added; Implementation Memory + Evolution split) — archived at [`archive/MASTER-2026-05-06-knowledge-commons-toolkit.md`](archive/MASTER-2026-05-06-knowledge-commons-toolkit.md)
- **2026-05-15 — 10 layers (Tracks restored; Infrastructure & Substrate added)** — canonical at [`MASTER.md`](MASTER.md). Diff: [`MASTER-DOC-CHANGES-2026-05-15.md`](MASTER-DOC-CHANGES-2026-05-15.md). Plan: [`plans/master-doc-iteration-may-15-2026.md`](plans/master-doc-iteration-may-15-2026.md).

**Status legend:** `stub` · `partial` · `active` · `mature` · `new` (added in latest iteration)

## Architecture (10 layers)

| # | Layer | Owner | Status | Doc | Canvas |
|---|---|---|---|---|---|
| 1 | Ontology & Semantic Kernel | Matt + Rather + Luiz | partial | [doc](layers/01-ontology-and-semantic-kernel.md) | [canvas](canvases/layers/01-ontology.canvas) |
| 2 | Knowledge Commons / Encyclopedia | Heenal | active | [doc](layers/02-knowledge-commons-encyclopedia.md) | [canvas](canvases/layers/02-encyclopedia.canvas) |
| 3 | Resource Graph & Ecosystem Atlas | Brandon + curator (TBD) | partial | [doc](layers/03-resource-graph-and-ecosystem-atlas.md) | [canvas](canvases/layers/03-resource-graph.canvas) |
| 4 | Concept & Idea Ecology | Matt (likely; confirm) | stub | [doc](layers/04-concept-and-idea-ecology.md) | [canvas](canvases/layers/04-concept-ecology.canvas) |
| 5 | Option Library | Luiz (currently) | stub-to-partial | [doc](layers/05-option-library.md) | [canvas](canvases/layers/05-option-library.canvas) |
| 6 | Deployment & Structural Integrity | Luiz + Durgadas | partial | [doc](layers/06-deployment-and-structural-integrity.md) | [canvas](canvases/layers/06-deployment.canvas) |
| 7 | Tracks & Composition ♻ | Heenal (returning) | restored — partial | [doc](layers/07-tracks-and-composition.md) | [canvas](canvases/layers/07-tracks.canvas) |
| 8 | Implementation & Learning Memory | Koi (candidate) | stub — Bonfires substrate | [doc](layers/08-implementation-and-learning-memory.md) | [canvas](canvases/layers/08-implementation-memory.canvas) |
| 9 | Evolution Layer | Koi (candidate) | stub | [doc](layers/09-evolution-layer.md) | [canvas](canvases/layers/09-evolution.canvas) |
| 10 | Infrastructure & Substrate ⭐ | Luiz (operator default) | new — partial (overlay stack live) | [doc](layers/10-infrastructure-and-substrate.md) | [canvas](canvases/layers/10-infrastructure.canvas) |

⭐ = new layer in 2026-05-15 iteration · ♻ = restored from earlier iteration

**Core sequence:** Ontology → Knowledge → Resources → Options → Deployment → Tracks → Implementation → Evolution (Infrastructure sits *under* this sequence).

**Core movement:** Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve.

## Cross-cutting principles (18)

See master doc §4 + [`docs/layers/README.md`](layers/README.md#cross-cutting-principles-18) for the full enumeration. **Four are new in this iteration:** #9 Anti-extractive synthesis · #12 Pattern humility · #16 Living systems health · #17 Compost, archive, and memory.

## Minimum Operating Kernel (v0.1)

Five working objects, enough for one useful contribution without grasping the whole architecture:

> **Resource · Concept · Option · Deployment · Signal**

The full 25-object candidate set lives at master doc §5.7; the kernel is the v0.1 lens.

## Phase 3 refactor work

See [`docs/plans/master-doc-iteration-may-15-2026.md`](plans/master-doc-iteration-may-15-2026.md) for the full plan. Phase 3 (structured refactor against the new iteration) covers:

- `data/ontology/*.yaml` against new §5 structure + Two-Layer posture
- `data/option-library.yaml` cross-walk against §9 (9 categories matched)
- `data/feedback-process.yaml` split → L8 + L9
- `data/resources.yaml` re-lift against new §7
- **New** `data/tracks.yaml` (Tracks layer restored)
- LAYERS.md (this file) ↔ `docs/layers/` cross-link consistency
- IDENTITY.md ownership refresh (post-2026-05-21 biweekly persona/skill-card session)
- ORG-OS.md one-pager rewrite
- Root-MD rename pass (~30 files; "Regen Web3 Toolkit" → "Regen Knowledge Commons Toolkit")

## How to contribute to a layer

1. Open the layer's **canvas** for visual context: [`docs/canvases/layers/`](canvases/layers/)
2. Read the layer's **doc** for structured detail: [`docs/layers/`](layers/)
3. Drop into the master doc for full depth: [`MASTER.md`](MASTER.md) (read the section the layer doc references)
4. Find the right **data file** for structured contribution: `data/*.yaml`
5. Tag your contribution with one of the **Minimum Operating Kernel** object types if unsure of finer ontology.
6. Open a PR or surface the contribution to the layer owner.

---

_Last updated: 2026-05-15. The 8-layer status pages from prior iterations are preserved in git history if needed; the canonical per-layer reads are now in `docs/layers/`._
