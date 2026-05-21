---
layer: 1
name: Ontology & Semantic Kernel
master_doc_section: 5
master_doc_lines: "2713–4862"
canvas: ../canvases/layers/01-ontology.canvas
status: stabilization-draft
owners:
  - Matt (ops taxonomy)
  - Rather (adopted as standard 2026-04-23)
  - Luiz (architecture)
data_refs:
  - data/ontology/
related_layers:
  - "2 — Encyclopedia"
  - "3 — Resource Graph & Ecosystem Atlas"
  - "5 — Option Library"
  - "6 — Deployment & Structural Integrity"
related_skills:
  - schema-generator
---

# Layer 1 — Ontology & Semantic Kernel

> Defines types, relationships, metadata, classification layers, semantic structure, and interoperability questions.

## Purpose

The Ontology & Semantic Kernel defines the shared semantic structure of the Toolkit. It is the semantic backbone that allows the Resource Graph, Encyclopedia, Concept Ecology, Option Library, Deployment layer, Tracks, Implementation Memory, Evolution Layer, and Infrastructure layer to connect without collapsing into one flat database.

> "The goal is not to create a perfect ontology before use. The goal is to create enough shared meaning that people, tools, and future AI workflows can work together without silently inventing incompatible categories." — `docs/MASTER.md` §5.1

## Core questions

- What kinds of things exist in this system?
- How are those things related?
- Which labels are types and which are tags?
- What is a resource, concept, option, track, deployment, implementation, signal, claim, evidence, source system, or pattern?
- How can contributors classify things without creating semantic drift?
- How can the Toolkit stay interoperable with adjacent knowledge commons?
- How can the Toolkit become graph-compatible and AI-readable without prematurely locking into a final ontology?

## Function

The ontology IS for:

- building shared language
- structuring the Encyclopedia
- typing resources in the Resource Graph
- distinguishing source systems from ordinary links
- routing material into the correct layer
- connecting concepts, resources, options, tracks, deployments, implementations, signals, claims, and evidence
- making federated knowledge interoperable
- supporting graph-compatible and AI-readable knowledge systems

The ontology is **NOT** for:

- replacing local meaning-making
- prescribing one fixed organizational model
- maximizing conceptual complexity
- turning living practice into rigid bureaucracy
- making every useful word into a root type
- forcing all communities to use the same language
- pretending the Toolkit has a final semantic structure

## Subsections (master doc §5)

| Subsection | Lines | What |
|---|---|---|
| Purpose of this section | 2716 | Layer intro |
| Current ontology posture | 2755 | Working posture (small core, alignment, no premature lock-in) |
| What the ontology is for | 2786 | The IS / IS NOT split (above) |
| **Core design principles** | 2827 | 7 design principles (interop first, minimal+extensible, type/tag clarity, polycentric coherence, etc.) |
| **Two-layer ontology posture** | 2994 | ⭐ NEW — interoperable Octo/BKC core + Toolkit-specific extensions |
| Octo / BKC, CSIS, and Toolkit mapping logic | 3091 | Alignment posture across adjacent systems |
| **CSIS semantic overlay** | 3175 | ⭐ Reframed from "conformance" to "semantic overlay" |
| **Core entity type candidates** | 3249 | ~25 candidate types (Resource, Concept, Option, Deployment, Signal, plus Source System, Framework, Practice, Pattern, Tool, Protocol, Standard, Template, Organization, Network, Community, Person, Project, Event, Place, Track, Implementation, Claim, Evidence, Open Question, Failure Mode) |
| Relationship grammar | 4179 | Subject-predicate-object pattern |
| Relationship quality | 4326 | When a relationship is well-formed |
| Classification layers | 4356 | Types vs tags vs metadata |
| Minimum ontology rule | 4607 | The minimum-viable rule for this layer |
| Ontology governance | 4636 | How ontology changes get made |
| Open ontology questions | 4711 | Unresolved questions |
| **Practical v0.1 recommendation** | 4774 | What every entry needs (required / recommended / high-risk) |
| Working summary | 4831 | Layer summary |

## Two-layer ontology posture (key 2026-05-15 framing)

> Octo / BKC = candidate shared semantic base
> Regen Toolkit = applied extension layer
> CSIS = structural integrity overlay
> Toolkit ontology = bridge between knowledge commoning, regenerative practice, and implementation learning

— `docs/MASTER.md` §5.4 (lines 2848–2854)

This resolves the 2026-05-07 biweekly's open question about the 25 working object types: **the 5-object Minimum Operating Kernel** (Resource, Concept, Option, Deployment, Signal) is the v0.1 lens for contributors; the **25 candidate types** at §5.7 are the working set for ontology design.

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **2 Encyclopedia** | Ontology *structures meaning*; Encyclopedia *explains meaning.* |
| **3 Resource Graph** | Ontology defines what types of things go in the Graph; Graph holds the entries. |
| **4 Concept & Idea Ecology** | Ontology defines `Concept` as a type; Concept Ecology maps lineage, movement, tension. |
| **5 Option Library** | Ontology defines `Option` as a type; Library holds reusable options. |
| **8 Implementation Memory** | Ontology distinguishes `Implementation` from `Pattern` from `Case` from `Failure Mode`. |

## v0.1 recommendation (verbatim, master doc §5.16)

**Required for every entry:** title; object type; short description; source or origin; status / maturity; related concepts; related resources or source systems; notes / open questions.

**Recommended for higher-value entries:** steward / contributor; domain; function; audience; scale; context; tech surface; related options; related tracks; related implementations; review needs; public-use boundary.

**Required for high-risk entries:** claim-evidence separation; source lineage; reviewer or review need; uncertainty; public-use boundary; consent or representation notes (if relevant); ecological / governance / legal / token / privacy review flag (if relevant).

## Minimum rule

A type defines what something is. A tag describes how something may be classified, interpreted, filtered, or used. **Confusing tags with types creates ontology sprawl.** — `docs/MASTER.md` §5.4.3

## Cross-cutting principles most relevant

- #5 Claim-evidence discipline
- #10 Interoperability without forced uniformity
- #11 Type / tag discipline

## Status & next

- **Existing data:** `data/ontology/*.yaml` (4 yamls: relationships, concepts, options, processes) — generated 2026-04-25; reflects the 2026-04-23 master-doc iteration. Pre-Octo/BKC-alignment posture; pre-Two-Layer split.
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.1):**
  - Draft `data/ontology/kernel.yaml` (5-object Minimum Operating Kernel)
  - Reconcile `data/ontology/relationships.yaml` against §5.8 relationship grammar
  - Decide two-layer posture (Octo/BKC core vs Toolkit-specific extension) for each entity type
- **Open questions** (master doc §5.13): retained — read before Phase 3 work starts.
- **Coordination:** Matt + Rather + Luiz async, possibly surfaced at ~2026-05-21 biweekly's persona/skill-card session.

## Related

- **Canvas:** [`docs/canvases/layers/01-ontology.canvas`](../canvases/layers/01-ontology.canvas)
- **Skills:** [`skills/schema-generator/SKILL.md`](../../skills/schema-generator/SKILL.md)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.1
- **Decisions:** [`MEMORY.md`](../../MEMORY.md) — Rather's ontology adopted as standard (2026-04-23)
- **CSIS interface:** [`docs/CSIS.md`](../CSIS.md) + new `CSIS as semantic overlay` posture (§5.6 of master doc)
