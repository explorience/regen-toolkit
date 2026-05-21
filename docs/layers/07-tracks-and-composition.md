---
layer: 7
name: Tracks & Composition
master_doc_section: 11
master_doc_lines: "15454–17501"
canvas: ../canvases/layers/07-tracks.canvas
status: stabilization-draft
restored: 2026-05-15
notes: "Layer dropped in 2026-05-06 iteration; restored in 2026-05-15 iteration. Largest 'what was lost' recovery per Matty's 2026-05-15 note."
owners:
  - Heenal (returning; was Heenal pre-2026-05-06 drop)
data_refs:
  - data/tracks.yaml (new — to be created)
related_layers:
  - "2 — Encyclopedia"
  - "3 — Resource Graph"
  - "5 — Option Library"
  - "6 — Deployment & Structural Integrity"
  - "8 — Implementation & Learning Memory"
---

# Layer 7 — Tracks & Composition

> Guided pathways through the Toolkit. Composes concepts, resources, options, tools, checks, and cases into pathways for a specific audience or purpose.

## ♻ Restored layer

This layer was **dropped in the 2026-05-06 master-doc iteration** and **restored in the 2026-05-15 iteration**. Matty's 2026-05-15 note ("a lot was lost from the previous iteration") most directly refers to this layer.

If reading historical context, consult both the 2026-04-23 archive (where Tracks was Layer 6) and the new §11 — content is partially regenerated, partially recovered.

## Purpose

Tracks are guided pathways through the Toolkit. They help a person, group, node, project, or partner move through relevant concepts, resources, options, examples, tools, and deployment checks for a specific purpose.

> Without tracks, the Toolkit can become a rich but overwhelming archive. With tracks, people can move through the commons according to their context, role, and intention.

> Tracks **prepare** people for action. Deployments **specify** action. Implementations **record** what actually happened.

## Core questions

- Where should someone start?
- What should they understand first?
- What resources are most relevant?
- Which options should they compare?
- What tools or templates may help?
- What risks should they notice?
- What deployment checks are required before action?
- What implementation examples or failure cases should inform their work?
- What should they document and feed back into the Toolkit?

## What a track IS (master doc §11.4)

A curated pathway across Toolkit layers. May include: concepts · encyclopedia pages · source systems · resource graph entries · option library entries · tools · templates · examples · case studies · anti-patterns · failure cases · deployment checks · reflection prompts · implementation memory prompts · open questions.

## What a track is **NOT** (master doc §11.5)

- a final curriculum
- a finished implementation plan
- a universal playbook
- a deployment specification
- a certification process
- a substitute for local judgment
- a claim that one pathway works everywhere
- a promise that listed options are safe to use

## The 10 Core Track Candidates (master doc §11.10)

| # | Track | Lines | Audience |
|---|---|---|---|
| 1 | Newcomer Orientation | 15858 | First-touch users |
| 2 | Community Organizer | 15976 | Existing community lead |
| 3 | Local Node Builder | 16103 | Starting a local node |
| 4 | Public Goods Funding Round | 16234 | Running a funding round |
| 5 | Knowledge Commons Builder | 16373 | Building a knowledge garden / commons |
| 6 | Governance Deep Dive | 16512 | Governance design |
| 7 | Environmental Impact | 16648 | Ecological reporting / MRV |
| 8 | Bioregional Coordination | 16783 | Multi-node bioregional work |
| 9 | AI-Assisted Knowledge Garden | 16911 | AI-augmented commons |
| 10 | Implementation Reviewer | 17039 | Reviewing implementations |

Each track has: status · audience · prerequisites · concepts pulled · options pulled · deployment checks · suggested tools · common failures · maturity.

## Subsections (master doc §11)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 15457 | Layer intro |
| Current status | 15502 | Flexible; v0.1 = small number of useful tracks |
| What a track is | 15539 | Definition + composition |
| What a track is not | 15590 | Boundary rules |
| Track vs adjacent layers | 15616 | Encyclopedia vs Track; Deployment vs Track; etc. |
| Track template | 15732 | Structured shape |
| Track maturity | 15770 | 5-state maturity (Draft / Pilot / Active / Field-informed / Reviewed-or-deprecated) |
| Track composition logic | 15796 | How to compose a track |
| **10 Core track candidates** | 15846–17161 | The 10 tracks (above) |
| Track composition examples | 17161 | 4 worked examples |
| Track lifecycle | 17238 | 5 lifecycle states |
| Track governance and stewardship | 17322 | Who owns a track |
| Track review questions | 17364 | Review checklist |
| Minimum rule for this layer | 17389 | Layer minimum rule |
| Practical v0.1 recommendation | 17415 | v0.1 guidance |
| Working summary | 17464 | Layer summary |

## Track Maturity (master doc §11.7 — 5 states)

1. **Draft** — sketch
2. **Pilot** — used by someone
3. **Active** — used by multiple, working
4. **Field-informed** — multiple uses + learning fed back
5. **Reviewed or deprecated** — formally signed off, or removed

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **2 Encyclopedia** | Tracks compose Encyclopedia pages; Encyclopedia is the source material. |
| **5 Option Library** | Tracks reference options; options are reusable, tracks select + sequence them. |
| **6 Deployment** | A track is a guided pathway; a deployment is a specific configuration. |
| **8 Implementation** | A track is preparation; an implementation is the actual attempt. |

## Minimum rule

> A track is not a deployment. A track is not an implementation. A track should not pretend to solve a context automatically — it should help someone **prepare better**.

## Cross-cutting principles most relevant

- #3 Maturity and review state
- #4 Public-use boundaries
- #6 Review should scale with risk
- #12 Pattern humility (NEW)

## Status & next

- **Existing data:** None. The previous overlay's `data/tracks.yaml` was retired when the 2026-05-06 iteration dropped the layer.
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §F):**
  - **Create `data/tracks.yaml`** — new registry. Schema mirrors §11.6 Track template.
  - **Add `scripts/lift-tracks.mjs`** — lifts the 10 core track candidates from §11.10 into `data/tracks.yaml`.
  - **Field-test priorities:** Newcomer Orientation + Local Node Builder + Knowledge Commons Builder are the most operationally-ready candidates given the existing site material (67 articles, 5 learning paths).
  - **Coordinate with site IA** (Phase G) — Track pages on the live site become possible once `data/tracks.yaml` exists.
- **Coordination:** Heenal as layer owner (returning role). The 5 existing learning paths on the live site partially map to tracks; **diff that mapping** at the persona/skill-card session 2026-05-21.

## Related

- **Canvas:** [`docs/canvases/layers/07-tracks.canvas`](../canvases/layers/07-tracks.canvas)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §F (`scripts/lift-tracks.mjs` + `data/tracks.yaml`)
- **Site:** `src/content/docs/` (existing 5 learning paths)
- **Restoration context:** [`docs/MASTER-DOC-CHANGES-2026-05-15.md`](../MASTER-DOC-CHANGES-2026-05-15.md) (this layer is the largest "restored from previous iteration" recovery)
