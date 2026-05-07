# MASTER.md — Iteration Diff

> **Updated 2026-05-06.** Matty shared a substantially restructured + renamed master doc as a "checkpoint heading into the [Knowledge Commoning] Swarm." This file captures what changed between the 2026-04-23 iteration and the 2026-05-06 iteration so contributors don't need to re-read 13.7k lines to get oriented.

## Summary of changes

| Aspect | 2026-04-23 (archived) | 2026-05-06 (current) |
|---|---|---|
| **Name** | Regen Web3 Toolkit | **Regen Knowledge Commons Toolkit** |
| **Length** | ~7,500 lines | ~13,700 lines (~1.8x) |
| **Architecture** | 8 layers (1: Resource Graph → 8: Feedback & Evolution) | 8 layers (reordered) + Cross-Cutting Systems + Knowledge Commoning Swarm tab |
| **Framing** | "Knowledge site + ops overlay for ReFi/web3 coordination" | "Modular knowledge commons + coordination framework, contributing to broader Swarm" |

The previous version is preserved at [`archive/MASTER-2026-04-23-regen-web3-toolkit.md`](archive/MASTER-2026-04-23-regen-web3-toolkit.md).

---

## What's new

### 1. Rename: Regen Web3 Toolkit → Regen Knowledge Commons Toolkit

The whole project is reframed as a **knowledge commons + coordination framework**, not a web3-first toolkit. Web3 is now a domain the toolkit covers, not its core identity.

### 2. New top-level section: 🐝 Knowledge Commoning Swarm

A dedicated section (~2,500 lines) framing the Toolkit as a **contribution artifact** to the broader Knowledge Commoning Swarm — "may be reused, remixed, simplified, absorbed into shared Swarm outputs, or partially composted." The Toolkit is no longer trying to be the center; it's pooling its work into a larger effort.

The Swarm introduces:
- **4 shared outputs**: Map, Assembly Wizard, Instructional Guide, Component Index
- **6 functional affordances** (translation layer for talking to the broader Swarm): Store, Contribute, Find, Govern, Connect, Evolve

Matty: "There's a tab specifically about the swarm > 'Knowledge Commoning Swarm'. The OpenCivics swarm pulse 1 is Friday/Saturday."

### 3. Restructured Core Layers

Old (8 layers, flat sequence):
1. Resource Graph → 2. Encyclopedia → 3. Ontology → 4. Option Library → 5. Deployment → 6. Tracks → 7. Implementations → 8. Feedback & Evolution

New (8 layers, with Cross-Cutting Systems and a different sequence):
1. **Ontology** (was Layer 3 — promoted to Layer 1 because it cross-cuts everything)
2. **Encyclopedia**
3. **Resource Graph & Ecosystem Atlas** (was Layer 1; renamed; expanded scope)
4. **Concept & Idea Ecology** ← **NEW** (maps lineages, paradigms, frameworks, tensions, movement language)
5. **Option Library**
6. **Deployment & Structural Integrity**
7. **Implementation Memory** (split from old Layer 7+8 "Implementations + Feedback")
8. **Evolution** (split from old Layer 8 "Feedback & Evolution")

**What disappeared:** **Layer 6 "Tracks"** is no longer a top-level layer. (Tracks may be absorbed into Encyclopedia learning paths or Option Library compositions — needs Matt's confirmation.)

**What's added/expanded:**
- **Cross-Cutting Systems** section (line 2610) — covers Provenance & Attribution, Review & Maturity, Contributor Workflow, Source Systems
- **Concept & Idea Ecology** as a distinct layer
- **Implementation Memory** and **Evolution** are now separate layers, not one combined layer

### 4. New ontology object types

The new Ontology layer enumerates working object types — useful as a target for `data/ontology/` updates:
- Concept, Framework, Practice, Pattern, Tool, Protocol, Standard, Template, Resource, Source System, Organization, Network, Community, Person, Project, Event, Place, Option, Deployment, Implementation, Claim, Evidence, Signal, Open Question, Failure Mode

### 5. Maturity language

Explicit maturity states are now defined: `raw`, `to-place`, `draft`, `candidate`, `reviewed`, `field-informed`, `pattern-generating`, `deprecated`, `open question`. These should map to the toolkit's existing `status` fields in registries.

### 6. Anti-patterns + structural integrity emphasis

A more developed catalog of anti-patterns ("aggregation without attribution," "visibility without consent," "AI synthesis without source lineage," "platform adoption without export paths") and structural integrity questions ("Who is represented? Who is absent? Who maintains it? Who may be exposed by visibility?"). This dovetails directly with Durgadas's CSIS work — the alignment opportunity is stronger than in the previous iteration.

---

## What this implies for the org-os overlay

The overlay (`feature/org-os-overlay`) was built around the **previous** iteration. **This iteration is a checkpoint, not a finalized restructure** — Matty: "All very much a work in progress, def a nice checkpoint heading into the swarm." Concrete impacts:

| Artifact | Status | Action |
|---|---|---|
| `data/resources.yaml` | Mechanically lifted from old MASTER.md (lines 1089–2668) | **Re-run lift** post-iteration-stabilization. Defer until after Pulse 1 |
| `data/ontology/*.yaml` | Based on previous 15-entity ontology | **Refactor** to align with new object types + maturity states. Coordinate w/ Matt |
| `data/option-library.yaml` | Old 9-category scaffold | Cross-walk to new "tool / option / pattern / protocol / deployment / case" distinction |
| `data/deployment-requirements.yaml` | CSIS-aligned | **No urgent change** — new structural-integrity emphasis confirms direction |
| `data/feedback-process.yaml` | 5-step loop | **Re-evaluate** as Implementation Memory + Evolution split |
| `docs/LAYERS.md` | 8-layer table reflects old architecture | **Update** to new layer structure (deferred until iteration stabilizes) |
| `docs/IDENTITY.md` | Layer ownership table reflects old model | **Update**: re-assign owners against new layer set; "Tracks" owner (Heenal) now an Encyclopedia/learning-path role |
| `docs/ORG-OS.md` | One-pager references old name | **Add banner** acknowledging rename; full update post-stabilization |
| `MASTERPLAN.md` | "Regen Web3 Toolkit" framing | **Add banner**; full update post-stabilization |
| `CLAUDE.md` (instance + framework) | "Regen Web3 Toolkit" mentions | **Add banner**; replace name once stabilized |
| `packages/operations/comms/` | 2026-04-26 sharing pack | Already drafted/sent |

See `docs/plans/master-doc-iteration-may-2026.md` for the structured refactor plan.

---

## What this implies for the Swarm

The new master doc explicitly carves out a **Swarm Contribution Pack v0.1** (master doc Priority 7, line 685–698). Six contribution streams the Toolkit can offer the Swarm:

1. **Domain-specific atlas** (regenerative web3, ReFi, local coordination, public goods, bioregionalism, ecological MRV, civic infrastructure, knowledge gardening) → feeds Swarm's Map + Component Index
2. **Source-system and provenance discipline** → feeds Swarm's Govern, Connect, Evolve
3. **Structural integrity lens** (CSIS questions) → feeds Swarm's Govern + Assembly Wizard
4. **Implementation Memory pattern** → feeds Swarm's Evolve
5. **Option vs tool vs pattern vs protocol vs deployment vs case distinction** → assembly clarity
6. **Anti-patterns and cautions** → defensive design

See `docs/plans/swarm-contribution-pack.md` for the structured plan.

---

## Cross-references

- New canonical: [`MASTER.md`](MASTER.md) (this doc points to it)
- Previous: [`archive/MASTER-2026-04-23-regen-web3-toolkit.md`](archive/MASTER-2026-04-23-regen-web3-toolkit.md)
- Refactor plan: [`plans/master-doc-iteration-may-2026.md`](plans/master-doc-iteration-may-2026.md)
- Swarm contribution plan: [`plans/swarm-contribution-pack.md`](plans/swarm-contribution-pack.md)
