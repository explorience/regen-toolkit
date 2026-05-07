# Regen Knowledge Commons Toolkit — Master Doc Briefing

**Date**: 2026-05-07
**Source**: `docs/MASTER.md` (2026-05-06 iteration; previous iteration archived at `docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`)
**For**: Luiz Fernando (personal briefing) + the planning-call team

> Personal briefing on Matty's 2026-05-06 master doc iteration — what's new, what shifted, what stayed. Complements `docs/MASTER-DOC-CHANGES.md` (structural diff) and the queued `docs/plans/master-doc-iteration-may-2026.md` (refactor plan). Prep for the 2026-05-07 biweekly + OpenCivics Swarm Pulse 1 (2026-05-09–10). The companion briefing for the previous iteration is `260423 Regen Web3 Toolkit - Master Doc Briefing.md`.

**Doc**: `docs/MASTER.md` — 13,737 lines, ~1.8× the previous iteration. Matty's framing: *"All very much a work in progress, def a nice checkpoint heading into the swarm."*

---

## 1. The headline shifts

1. **Renamed.** "Regen Web3 Toolkit" → **"Regen Knowledge Commons Toolkit."** Web3 is now a domain the Toolkit covers, not its core identity. The project is reframed as a *knowledge commons + coordination framework* with web3 as one substrate.

2. **Posture loosened.** From "build the toolkit" to "contribute pieces to a broader effort." Explicit text from the new doc: *"The Regen Toolkit may turn out to be highly useful. It may also be partially absorbed, renamed, simplified, broken apart, or scrapped. That is acceptable. The goal is not to defend the master doc as a final product."* This is a major softening of the previous iteration's "defend the architecture" stance.

3. **New top-level section: 🐝 Knowledge Commoning Swarm.** ~2,500 lines (line 11189–end) framing the Toolkit as a contribution artifact to OpenCivics' broader Swarm. Introduces a translation layer (the 6 functional affordances — Store, Contribute, Find, Govern, Connect, Evolve) for legibility across communities that don't share Toolkit terminology.

4. **Layer set restructured.** Tracks dropped from top-level. Concept & Idea Ecology added. Implementation Memory and Evolution split into separate layers. Ontology promoted from Layer 3 to Layer 1 because it cross-cuts everything.

---

## 2. The new 8 Core Layers

| #   | Layer                                | What's new vs previous                                                |
| --- | ------------------------------------ | --------------------------------------------------------------------- |
| 1   | **Ontology**                         | Promoted from Layer 3 (still cross-cuts everything)                   |
| 2   | **Encyclopedia**                     | (unchanged role)                                                      |
| 3   | **Resource Graph & Ecosystem Atlas** | Renamed (was "Resource Graph"); scope expanded                        |
| 4   | **Concept & Idea Ecology**           | **NEW** — maps lineages, paradigms, frameworks, tensions, movement language |
| 5   | **Option Library**                   | Tool / Option / Pattern / Protocol / Deployment / Case distinction added |
| 6   | **Deployment & Structural Integrity** | Renamed; structural-integrity questions now explicit                   |
| 7   | **Implementation Memory**            | Split from old "Implementations + Feedback"                            |
| 8   | **Evolution**                        | Split from old "Implementations + Feedback"                            |

**Cross-Cutting Systems** (line 2610) added as a peer concept covering Provenance & Attribution, Review & Maturity, Contributor Workflow, Source Systems.

**Tracks**: gone from top-level. Probably absorbed into Encyclopedia learning paths or Option Library compositions — needs Matt's confirmation at the biweekly. Heenal's previous "Tracks owner" role is displaced.

---

## 3. The Swarm framing (key conceptual shift)

The Toolkit reframes from "the project" to "a contribution artifact to a larger effort." The Swarm has 4 shared outputs:

- **Map** — living canvas of components organized by function
- **Component Index** — structured, searchable archive of components with metadata
- **Assembly Wizard** — guided tool for composing a knowledge commons in context
- **Instructional Guide** — conceptual entry point explaining what a knowledge commons is

How the Toolkit slots into them:
- Resource Graph & Ecosystem Atlas → Map + Component Index
- Option Library + Deployment & Structural Integrity → Assembly Wizard
- Encyclopedia + Contributor Guide → Instructional Guide

The **6 functional affordances** (Store, Contribute, Find, Govern, Connect, Evolve) are a translation layer — *"what does this help people Store / Contribute / Find / Govern / Connect / Evolve?"* — useful for talking to other communities without making them learn Toolkit terminology first.

---

## 4. Six contribution streams the Toolkit can offer the Swarm

Per Section 3 of the Swarm tab. These become the Swarm Contribution Pack v0.1 deliverables (see `docs/plans/swarm-contribution-pack.md`):

1. **Domain-specific atlas** — regenerative web3, ReFi, local coordination, public goods, bioregionalism, ecological MRV, civic infrastructure, knowledge gardening
2. **Source-system & provenance discipline** — the distinction between "a link" and "a stewarded knowledge environment"
3. **Structural integrity lens** — CSIS questions (Who is represented? Who is absent? Who maintains it? Who may be exposed by visibility?) — this is Durgadas's contribution territory
4. **Implementation Memory pattern** — capture lessons from real use, not just resources
5. **Tool / Option / Pattern / Protocol / Deployment / Case distinction** — 6-tier vocabulary preventing the "menu of components" assembly-trap
6. **Anti-patterns + cautions** — aggregation without attribution, AI synthesis without source lineage, platform adoption without export paths, polished content mistaken for reviewed knowledge, etc.

---

## 5. Ontology — new working object types

25 working types enumerated (vs the previous V1's 18):

**Concept · Framework · Practice · Pattern · Tool · Protocol · Standard · Template · Resource · Source System · Organization · Network · Community · Person · Project · Event · Place · Option · Deployment · Implementation · Claim · Evidence · Signal · Open Question · Failure Mode**

Notes:
- New types worth flagging: **Standard, Template, Source System, Signal, Open Question, Failure Mode** — none of these were first-class in V1.
- Maps imperfectly to the previous V1/V2a/V2b set. The "type vs tag vs metadata" decision moves to Phase 2 reconciliation.
- The previous V2b's "CSIS-optimized semantic overlay" idea is implicitly there — Failure Mode and Open Question as types directly support CSIS-style structural visibility.

---

## 6. New maturity language

Nine explicit states the doc proposes for any artifact:

**raw · to-place · draft · candidate · reviewed · field-informed · pattern-generating · deprecated · open question**

Stronger and more articulate than the previous iteration's casual `stub / partial / active / mature` used in `LAYERS.md`. Worth adopting as canonical and back-mapping the existing `status` fields in `data/*.yaml`.

---

## 7. Strengthened structural integrity emphasis (CSIS direction confirmed)

The new Working Posture section explicitly catalogues structural-integrity questions: *"Who is represented? Who is absent? Who can correct this? Who maintains it? Who benefits from visibility? Who may be exposed by visibility?"* — that's essentially the CSIS question battery.

The previous iteration had a more tentative CSIS posture (*"not a CSIS implementation… increasingly informed by CSIS"*). The new iteration makes structural integrity a load-bearing concept across the doc, not just a Layer 5/Deployment concern. This is good news for the alignment-report direction — CSIS isn't a side-quest, it's part of the spine now.

The new master doc also adds anti-patterns that map directly to CSIS principles:
- *aggregation without attribution* → power legibility
- *visibility without consent* → safe disagreement
- *AI synthesis without source lineage* → clarity over volume
- *polished content mistaken for reviewed knowledge* → distinguish abstraction levels

---

## 8. What stayed roughly the same

- **Encyclopedia layer** — still the public-facing knowledge garden via Astro/Starlight
- **Heenal's editorial pipeline** — 67 articles live, 5-stage Research → Writing → Fact-checking → Editing → Critique
- **Brandon's mapping infrastructure** — still the canonical sources framework
- **The doc's 8-layer ambition** — not abandoned, just restructured (8 layers in, 8 layers out, but a different 8)
- **Ontology cross-cutting principle** — still the structural backbone (now more explicit by being Layer 1)

---

## 9. What's still open / still flagged

- **No validation/enforcement in Deployment Layer** — same gap as previous iteration. New iteration adds more questions but not yet runnable checks.
- **Tracks layer dropped without explicit fate** — needs Matt's call: absorbed into Encyclopedia learning paths? Option Library compositions? A new sublayer?
- **Concept & Idea Ecology** has no owner yet. Adjacent to Ontology (Matt) and Encyclopedia (Heenal); could go either way.
- **Implementation Memory + Evolution split** is a structural improvement but doubles the unowned-layer count.
- **Tool/Option/Pattern/Protocol/Deployment/Case** distinction lands but doesn't yet refactor the existing `data/option-library.yaml` 9-category scaffold.
- **Resources tab** is still flagged as the weakest layer (Matt, 2026-04-23). Mechanical lift exists in `data/resources.yaml` (738 entries from previous iteration); pending Brandon's curation pass + re-lift from new MASTER.md.

---

## 10. Implications for the org-os overlay (in 1 paragraph)

Most of the overlay still applies — the canonical-layout / session-lifecycle / skills / federation principles are layer-agnostic. What needs to change post-Pulse-1: the rename across ~30 files (Regen Web3 Toolkit → Regen Knowledge Commons Toolkit), the layer table in `LAYERS.md` and `IDENTITY.md` (drop Tracks, add Concept & Idea Ecology, split Implementation Memory + Evolution, promote Ontology to Layer 1), the structured extractions in `data/ontology/` (cross-walk against new 25 object types + 9 maturity states), the Option Library cross-walk (against tool/option/pattern/protocol/deployment/case), and the re-run of the resources lift against the new MASTER.md. Sequenced as Phase 3 of `docs/plans/master-doc-iteration-may-2026.md` — explicitly held until post-Pulse-1 since Matty called this "a checkpoint heading into the swarm" and the iteration may shift again.

---

## 11. One-line takeaway

The previous iteration was *"defend the toolkit's structural integrity."* The new iteration is *"contribute the toolkit's structural integrity questions to a broader effort that may absorb, remix, or compost it."* The substance hasn't weakened — the posture has loosened. Good move heading into Pulse 1.

---

## See also

- [`MASTER.md`](../MASTER.md) — the doc itself (current iteration)
- [`MASTER-DOC-CHANGES.md`](../MASTER-DOC-CHANGES.md) — structural diff vs previous iteration
- [`archive/MASTER-2026-04-23-regen-web3-toolkit.md`](../archive/MASTER-2026-04-23-regen-web3-toolkit.md) — previous iteration
- [`plans/master-doc-iteration-may-2026.md`](../plans/master-doc-iteration-may-2026.md) — overlay refactor plan, sequenced post-Pulse-1
- [`plans/swarm-contribution-pack.md`](../plans/swarm-contribution-pack.md) — Swarm Contribution Pack v0.1 plan
- [`260423 Regen Web3 Toolkit - Master Doc Briefing.md`](260423%20Regen%20Web3%20Toolkit%20-%20Master%20Doc%20Briefing.md) — previous personal briefing
