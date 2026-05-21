---
layer: 9
name: Evolution Layer
master_doc_section: 13
master_doc_lines: "18873–20239"
canvas: ../canvases/layers/09-evolution.canvas
status: stabilization-draft
owners:
  - Koi / Caue Mtomaz (candidate — research framework)
  - Luiz (operator default)
data_refs:
  - data/feedback-process.yaml (to be split — currently combined L8 + L9)
related_layers:
  - "8 — Implementation & Learning Memory"
  - "1 — Ontology"
  - "All layers" (Evolution can update any layer)
---

# Layer 9 — Evolution Layer

> Converts signals, review findings, tensions, implementation learning, and ecosystem changes into updates. **Protects the Toolkit from both stagnation and reactive overcorrection.**

## Purpose

The Evolution Layer defines how the Toolkit learns, updates, corrects itself, and adapts over time.

> A living knowledge commons cannot remain static. But it also cannot change randomly every time someone has feedback. The Evolution Layer helps the Toolkit update with care. — `docs/MASTER.md` §13.1

> Feedback is input. Evolution requires interpretation, routing, decision, integration, and memory.

## Core adaptive loop (master doc §13.3)

> **Signal → Sensemaking → Balance Assessment → Intervention → Integration → Memory**

| Step | Lines | What |
|---|---|---|
| 1. Signal | 19019 | Something happened, was learned, broke, or surprised |
| 2. Sensemaking | 19070 | What does it mean? Is it isolated, repeated, structural, contextual? |
| 3. Balance Assessment | 19110 | Is the system drifting toward regenerative or extractive dynamics? |
| 4. Intervention | 19157 | What should be reinforced, constrained, rebalanced, probed, redesigned, preserved as unresolved? |
| 5. Integration | 19200 | What layer should be updated? |
| 6. Memory | 19234 | How is the change preserved? |

## Core questions

- What signals are being received?
- What do those signals mean?
- Which are isolated, repeated, structural, or contextual?
- What should be updated? Preserved as open question? Deprecated, archived, or composted?
- What should trigger review?
- What should become a new concept, option, track, deployment check, or pattern candidate?
- How does the Toolkit avoid both stagnation and reactive overcorrection?

## The 10 Signal Types (master doc §13.4)

| # | Signal type | Lines |
|---|---|---|
| 1 | Content signal | 19280 |
| 2 | Ontology signal | 19309 |
| 3 | Resource signal | 19338 |
| 4 | Option signal | 19369 |
| 5 | Deployment signal | 19398 |
| 6 | Track signal | 19428 |
| 7 | Implementation signal | 19458 |
| 8 | Public-use signal | 19488 |
| 9 | Source-system signal | 19517 |
| 10 | Infrastructure signal | 19547 |

**Each signal type routes to a different layer-update path.** This is the routing table for the adaptive loop.

## Archive, compost, deprecation (master doc §13.7)

The new iteration introduces explicit handling of outdated material:

| Action | Lines | Meaning |
|---|---|---|
| **Archive** | 19706 | Preserve as historical record; not active |
| **Compost** | 19721 | Break down; reuse parts elsewhere |
| **Deprecate** | 19736 | Marked obsolete; warning to readers |
| **Remove** | 19753 | Deleted (rare; preferred is compost or archive) |

These map directly to **Cross-Cutting Principle #17 Compost, archive, and memory (NEW)**.

## The 8 Common Evolution Failures (master doc §13.10)

| # | Failure | Lines |
|---|---|---|
| 1 | Reactive overcorrection | 19844 |
| 2 | Stagnation | 19859 |
| 3 | Overgrowth | 19873 |
| 4 | Silent drift | 19887 |
| 5 | AI-driven false coherence | 19901 |
| 6 | Review bottleneck | 19916 |
| 7 | Public overconfidence | 19930 |
| 8 | Memory loss | 19945 |

Each of these is a *meta-signal* to the Evolution Layer about itself.

## Subsections (master doc §13)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 18876 | Layer intro |
| Current status | 18918 | Working adaptive process |
| Why this layer matters | 18964 | Reason this layer exists |
| **Core evolution loop (6 steps)** | 19019 | The adaptive loop |
| **Signal types (10)** | 19274 | Signal routing taxonomy |
| Evolution records | 19577 | Structured shape |
| Update proposal template | 19611 | Template for proposing changes |
| Pattern candidate process | 19649 | When a case → pattern |
| Archive, compost, and deprecation | 19697 | Outdated-material handling |
| Review and cadence | 19776 | When evolution happens |
| Evolution roles | 19808 | Who reviews what |
| **Common evolution failures (8)** | 19838 | Anti-patterns |
| Example evolution records | 19963 | 4 worked examples |
| Minimum rule for this layer | 20147 | Layer minimum rule |
| Practical v0.1 recommendation | 20173 | v0.1 guidance |
| Working summary | 20203 | Layer summary |

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **8 Implementation Memory** | Implementation produces signals; Evolution interprets and routes. |
| **All layers** | Evolution can update any layer — but only through the 6-step loop. |
| **1 Ontology** | An ontology signal updates ontology only after the loop completes. |

## Minimum rule

A signal is not a conclusion. Feedback should not automatically become change. **A signal should be interpreted, reviewed, routed, and integrated before it modifies the commons.**

## Cross-cutting principles most relevant

- #3 Maturity and review state
- #6 Review should scale with risk
- #14 AI-assisted but human-governed
- #16 Living systems health (NEW)
- #17 Compost, archive, and memory (NEW)

## Status & next

- **Existing data:** `data/feedback-process.yaml` — combined L8 + L9. Currently models feedback states (intake → review → close), pre-iteration framing.
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.3):**
  - Split `data/feedback-process.yaml` → `data/evolution.yaml` (or single yaml with sections)
  - Map the 6-step loop as state transitions in schema
  - Map the 10 signal types as routing categories
  - Encode the 4 outdated-material actions (archive / compost / deprecate / remove)
- **Coordination:** Koi candidate for layer ownership (raised 2026-05-07 biweekly + Bonfires methodology demo); Koi's research framework document (committed action item from that biweekly) directly populates this layer.

## Related

- **Canvas:** [`docs/canvases/layers/09-evolution.canvas`](../canvases/layers/09-evolution.canvas)
- **Data:** [`data/feedback-process.yaml`](../../data/feedback-process.yaml) (to be split)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.3
- **Koi's research framework** — committed at 2026-05-07 biweekly; not yet delivered. Will populate this layer.
- **Cross-cuts:** Principles #16 + #17 are NEW in 2026-05-15 iteration and live primarily through this layer.
