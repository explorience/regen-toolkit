---
layer: 3
name: Resource Graph & Ecosystem Atlas
master_doc_section: 7
master_doc_lines: "6734–10348"
canvas: ../canvases/layers/03-resource-graph.canvas
status: stabilization-draft
owners:
  - Brandon (curation lead)
  - curator (TBD)
data_refs:
  - data/resources.yaml
  - data/sources.yaml
related_layers:
  - "1 — Ontology"
  - "2 — Encyclopedia"
  - "5 — Option Library"
  - "8 — Implementation & Learning Memory"
scripts:
  - scripts/lift-resources.mjs
---

# Layer 3 — Resource Graph & Ecosystem Atlas

> Maps real-world entities and source systems. The Toolkit's *reality layer*: where concepts, frameworks, options, and design patterns are connected back to actual people, tools, communities, infrastructures, source systems, and cases.

## Purpose

The Resource Graph & Ecosystem Atlas maps the real-world people, projects, organizations, tools, protocols, events, maps, datasets, source systems, publications, communities, and implementation examples that shape the Toolkit. **It is not a link list.** It is the place where the rest of the Toolkit stays grounded in reality.

> Working posture: **Add broadly. Classify lightly. Mark maturity honestly. Route carefully.** — `docs/MASTER.md` §7.0

> **Inclusion does not mean endorsement.** Inclusion means a resource may be relevant enough to preserve, classify, review, route, or revisit. — `docs/MASTER.md` §7.0

## ⚠ Handoff note — preservation discipline

The master doc opens §7 with an explicit handoff note (lines 6734–6790):

> **Do not replace this section with a shorter synthesized version until the full resource inventory has been extracted, routed, and intentionally reviewed.** Recent cleanup attempts have shown that summarized versions can accidentally drop useful links and concrete references…
>
> Before compressing, deleting, or replacing any part of this section, future contributors should first create a structured inventory…
>
> **Prefer preservation over compression.**

This directly validates the 2026-04-26 mechanical lift approach (`scripts/lift-resources.mjs` → `data/resources.yaml` with 738 entries). **Don't synthesize before lifting.**

## Core distinction (master doc §7.1)

| | What |
|---|---|
| **Resource Graph** | The structured registry. Stores entries, metadata, relationships, source lineage, review status, routing notes, maturity state. |
| **Ecosystem Atlas** | The interpretive map. Helps people view the graph through different lenses (entity / function / concept / source-system / tool / option / implementation / place / risk-maturity / relationship / Swarm-component view). |

## Core questions

- What exists? Who made it? Who stewards it?
- What does it help people do?
- What concepts does it carry?
- What source systems should be credited?
- What tools, standards, or frameworks can be reused?
- What communities are adjacent or aligned?
- What examples can be learned from?
- What remains unmapped, unclear, outdated, sensitive, or under-reviewed?
- What should become an Encyclopedia page, Option Library entry, Deployment template, Infrastructure candidate, Implementation Memory case, or Open Question?

## What belongs here (master doc §7.2)

organizations · networks · communities · people · tools · protocols · platforms · maps · datasets · articles · papers · books · events · projects · local nodes · **source systems** · standards · repositories · knowledge gardens · implementation cases · infrastructure candidates · failure cases · open questions · loose leads

## What does NOT primarily belong here (master doc §7.3)

| Item | Primary home |
|---|---|
| Concept explanation | Encyclopedia / Concept & Idea Ecology |
| Reusable design choice | Option Library |
| Operational checklist | Deployment & Structural Integrity |
| Retrospective or case analysis | Implementation Memory |
| Formal schema definition | Ontology |
| Feedback from use | Evolution |
| Unresolved research question | Open Questions / Research Backlog |
| Full infrastructure evaluation | Infrastructure & Substrate |
| High-risk claim review | Review & Maturity / Claim-Evidence Record |
| Low-context lead | Loose Leads / Parking Lot |

> The Resource Graph **points to** these layers. It does not **replace** them.

## Subsections (master doc §7)

| Subsection | What |
|---|---|
| Handoff note | Preservation-over-compression directive |
| Purpose | Layer intro |
| Core distinction | Graph vs Atlas |
| What belongs | Inclusion criteria |
| What does NOT belong | Routing table |
| **7.1 Resource Graph v0.1 Schema** | Minimum + recommended fields for the working registry |
| Plus extensive raw resource lists (~3,000 lines) | The actual material — 10+ domain URL lists from earlier iterations |

## v0.1 Schema (master doc §7.4)

**Minimum fields:** Category · Resource (name) · Link / reference · …

**Recommended fields:** Steward · Source system origin · Concepts carried · Function · Maturity · Public-use boundary · Suggested route · …

(Schema is more elaborate than the lift currently captures — Phase 3 work refines.)

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **1 Ontology** | Ontology defines the entry-type schema; Graph holds the entries. |
| **2 Encyclopedia** | Graph maps what exists; Encyclopedia explains what it means. |
| **5 Option Library** | A resource may *support* an option; the option lives in the Library. |
| **8 Implementation Memory** | A case is referenced from the Graph but lives in Memory. |

## Source Systems (special category)

A **Source System** is not a single artifact (book, paper) — it is a *living knowledge environment* (a wiki, repo, map, forum, knowledge garden, research database) with stewards, ongoing additions, and a return-path to credit. Source Systems get their own metadata pattern (Source System Cards — see master doc §7 subsections + Cross-Cutting Principle #1 Provenance).

## Cross-cutting principles most relevant

- #1 Provenance and source lineage
- #2 Attribution and return paths
- #3 Maturity and review state
- #6 Review should scale with risk
- #7 Regenerative obligation
- #17 Compost, archive, and memory (NEW — preservation discipline)

## Status & next

- **Existing data:** `data/resources.yaml` — 738 entries lifted 2026-04-26 from `MASTER.md` (2026-04-23 iteration) lines 1089–2668. 285 URL-bearing; 50 domains. Pending Brandon's curation pass.
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.4):**
  - **Refactor `scripts/lift-resources.mjs`** — anchor by section heading (`## 7. Resource Graph & Ecosystem Atlas`) instead of line numbers, so it's iteration-stable.
  - **Re-lift against new MASTER.md §7** (~3,615 lines of source material; the new doc is roughly the same volume but reorganized).
  - **Diff against existing 738 entries** — decide overwrite vs merge per entry.
  - **Brandon curation pass** — still gated.
- **Source System Cards** — not yet created. Master doc identifies this as a Phase priority. Consider Source Systems → `data/sources.yaml` (currently empty).
- **Coordination:** Brandon as curation lead; Luiz on the mechanical lift; team triage of "raw lead" items.

## Related

- **Canvas:** [`docs/canvases/layers/03-resource-graph.canvas`](../canvases/layers/03-resource-graph.canvas)
- **Scripts:** [`scripts/lift-resources.mjs`](../../scripts/lift-resources.mjs)
- **Data:** [`data/resources.yaml`](../../data/resources.yaml) (738 entries) · [`data/sources.yaml`](../../data/sources.yaml) (empty — Source Systems)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.4
- **Bonfires / KOI federation hook** — Caue's stack does entity mapping (user/project/general); potential federation with Source Systems (raised 2026-05-07 biweekly)
