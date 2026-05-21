# Plan — Swarm Contribution Pack v0.1

**Status:** queued
**Created:** 2026-05-06
**Sequencing:** Active during OpenCivics Swarm Pulse 1 (2026-05-09–10) and the surrounding two-month hackathon. Coordinates with [`master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md).

## Context

Matty's 2026-05-06 master doc iteration introduces the **Knowledge Commoning Swarm** as a top-level section (~2,500 lines, line 11189–end). The reframing is significant:

> "The Regen Toolkit may turn out to be highly useful. It may also be partially absorbed, renamed, simplified, broken apart, or scrapped. **That is acceptable.** The goal is not to defend the master doc as a final product. **The goal is to contribute useful distinctions, resources, patterns, warnings, and regenerative context to the shared knowledge commons effort.**" (`docs/MASTER.md`)

The Swarm is organized around **4 shared outputs** — Map, Assembly Wizard, Instructional Guide, Component Index — and **6 functional affordances** (Store, Contribute, Find, Govern, Connect, Evolve) used as a translation layer for cross-community legibility.

The master doc explicitly carves out a **Swarm Contribution Pack v0.1** as Priority 7 (line 685–698). This plan operationalizes it.

## Goal

Decompose the Regen Knowledge Commons Toolkit into **discrete, swappable contributions** that plug into the Swarm's shared outputs. The Toolkit enters as a contribution artifact, not as an architecture seeking adoption.

## Six contribution streams

Per `docs/MASTER.md` Section 3 of the Swarm tab, the Toolkit can offer:

### 1. Domain-specific atlas

A mapped view of resources from regenerative web3, ReFi, local coordination, public goods funding, bioregionalism, ecological MRV, civic infrastructure, knowledge gardening, regenerative design, and implementation learning. **Feeds Swarm Map + Component Index.**

**Status:** Mechanical lift exists at `data/resources.yaml` (738 entries from previous master doc). Pending Brandon's curation pass + re-lift from new master doc.

### 2. Source-system & provenance discipline

The distinction between "a link" and "a source system as a stewarded context" — wikis, repos, maps, forums, knowledge gardens, research databases. **Feeds Swarm Govern, Connect, Evolve.**

**Status:** Concept embedded in Layer 1 work; not yet packaged as a standalone contribution.

### 3. Structural integrity lens (CSIS questions)

The CSIS question battery — "Who is represented? Who is absent? Who can correct this? Who maintains it? Who benefits from visibility? Who may be exposed by visibility? What claims need review? What source lineage is missing? What risks travel with this component? What happens if this gets reused in another context?" **Feeds Swarm Govern + Assembly Wizard.**

**Status:** Embedded in `docs/CSIS.md` and `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md`. Strong alignment opportunity — Durgadas is a Swarm-relevant collaborator.

### 4. Implementation Memory pattern

The pattern of capturing — for any deployment — what was attempted, by whom, in what context, what worked, what failed, what surprised, what risks appeared, what should be updated, what should NOT be generalized, what pattern (if any) emerged. **Feeds Swarm Evolve.**

**Status:** Concept. Schema not yet captured (deferred from Layer 7 work in previous iteration). *2026-05-07 biweekly clarification:* Bonfires (KOI stack, Caue Mtomaz) is the live infrastructure candidate — design science research methodology + Telegram bot + entity mapping + cross-platform knowledge graph + real-time indexing. Co-author with Koi rather than build a parallel schema.

### 5. Tool / Option / Pattern / Protocol / Deployment / Case distinction

A 6-tier vocabulary that prevents confusing component lists with assembly guidance. **Helps Swarm Assembly Wizard avoid menu-style design.**

**Status:** Articulated in new master doc (line ~11290+). Maps imperfectly to existing `data/option-library.yaml` (9 categories). Cross-walk in [`master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md) Phase 2.

### 6. Anti-patterns + cautions

Catalogued anti-patterns: aggregation without attribution, visibility without consent, AI synthesis without source lineage, mapping without stewardship, platform adoption without export paths, openness without care, metrics without meaning, funding claims without evidence, tool-first thinking, local context erased by global patterns, polished content mistaken for reviewed knowledge. **Feeds Swarm Govern, Connect, Evolve.**

**Status:** Embedded across `MASTER.md` (new iteration) and `docs/CSIS.md`. Worth packaging as a standalone short doc.

## Deliverables for v0.1

The pack should be **light, self-contained, and reusable**. Target: 7 short docs + a top-level index, all under `packages/operations/comms/swarm-contribution-pack/` (new directory).

| # | Deliverable | Source | Owner | Status |
|---|---|---|---|---|
| 0 | `README.md` (index + Swarm-output mapping table) | this plan | Luiz | not started |
| 1 | `01-domain-atlas.md` (overview + link to `data/resources.yaml`) | Layer 1 work | Brandon (lead) + Luiz (package) | not started |
| 2 | `02-source-systems.md` (concept + source registry pattern) | Layer 3 / Cross-Cutting | Luiz | not started |
| 3 | `03-structural-integrity-lens.md` (CSIS questions, abridged) | `CSIS.md` + alignment report | Durgadas (lead) + Luiz (package) | not started |
| 4 | `04-implementation-memory.md` (pattern + minimal schema) | new MASTER.md Layer 7 + 8 | Luiz | not started |
| 5 | `05-tool-option-pattern-protocol-deployment-case.md` (distinction) | new MASTER.md Swarm tab | Luiz | not started |
| 6 | `06-anti-patterns.md` (catalog) | new MASTER.md Working Posture + Swarm tab | Luiz | not started |
| 7 | `07-six-affordances-translation.md` (Toolkit ↔ Store/Contribute/Find/Govern/Connect/Evolve mapping) | new MASTER.md Swarm tab | Luiz | not started |

**Constraints (per master doc):**
- Each deliverable should be readable on its own (no required prior context from the Toolkit).
- Each should preserve source lineage (where the distinction comes from — Toolkit, CSIS, OpenCivics, P2P Foundation, etc.).
- The pack should not be presented as one large object — Swarm participants should be able to take any single piece.
- Maturity state per item should be marked (`draft`, `candidate`, `reviewed` per the new master doc's maturity language).

## Sequencing

- **Pre-Pulse 1 (this week):** Draft README + draft of `05-tool-option-pattern-protocol-deployment-case.md` + `07-six-affordances-translation.md` — both are pure synthesis from the new master doc, no other-layer dependencies.
- **During Pulse 1 (2026-05-09–10):** Observe what Swarm participants ask for. Adapt deliverable list based on real demand signals. **Attendance posture (per 2026-05-07 biweekly):** partial — Matty in Philadelphia for wedding (leaves Friday noon); ~half the swarm attendee list is already Toolkit team. Treat Pulse 1 as observation + offer-side contribution, not capture.
- **Post-Pulse 1, weeks 1–2 of hackathon:** Draft remaining items 1–4 + 6.
- **Hackathon mid-point (week 4):** v0.1 packaged + shared with Swarm via OpenCivics channel.

## 2026-05-07 biweekly — clarifications

The biweekly added two structural inputs that affect how the pack should be assembled:

1. **Bonfires (KOI stack) is the live infrastructure for #4 (Implementation Memory) — not just a methodological reference.** Caue "Koi" Mtomaz demoed a working Telegram bot + entity mapping (user/project/general) + cross-platform knowledge graph (Discord/Telegram) + real-time indexing. The Brazil Bonfires AI audit project is the *methodology* (design science research, multiple tracks per hypothesis, AI-audit data collection); Bonfires itself is the *substrate*. The operator's instance already has `mcp__regen-koi__*` integration. **Implication:** `04-implementation-memory.md` should reference Bonfires-as-substrate explicitly, not just present a generic schema. Coordinate with Koi on a co-authoring or attribution arrangement.

2. **Toolkit vs "Transformational Journeys" framing tension is unresolved.** The pack title and framing copy ("Toolkit decomposes into discrete contributions") inherits the rename's "Knowledge Commons Toolkit" naming. If the team re-opens the framing decision post-Pulse-1, the pack's voice may need a pass. **Posture:** draft the pack against current naming, but flag this as a known framing-revisit item in the README so reuse downstream isn't locked to a name that may change.

3. **Persona / skill-card format adopted for ~2026-05-21 biweekly.** Not directly a Swarm Pack input, but team will arrive at next biweekly with concrete capability cards — useful for assigning the post-Pulse-1 deliverables (items 1–4 + 6) to actual people rather than the placeholder "Luiz" lead.

## Risks

- **Contribution shape may shift.** What the Swarm actually wants from the Toolkit will become clearer at Pulse 1. v0.1 should be small enough to discard or pivot.
- **Attribution discipline.** Several deliverables synthesize work from CSIS (Durgadas), P2P Foundation, OpenCivics, etc. — provenance must be explicit, not just signaled.
- **Capacity.** This plan adds work during a period that already includes the 2026-05-07 biweekly + the broader iteration refactor. Realistic v0.1 scope is 3–4 deliverables, not all 7. Adjust on the fly.

## Related

- [`docs/MASTER.md`](../MASTER.md) — Knowledge Commoning Swarm section (line 11189–end)
- [`docs/MASTER-DOC-CHANGES.md`](../MASTER-DOC-CHANGES.md) — what changed in the new iteration
- [`docs/plans/master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md) — overlay refactor plan (this plan's parent)
- [OpenCivics Swarm Pulse 1 lu.ma event](https://luma.com/q7kefkl7?tk=rzZUB9)
