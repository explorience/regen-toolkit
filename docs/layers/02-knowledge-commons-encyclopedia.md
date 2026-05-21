---
layer: 2
name: Knowledge Commons / Encyclopedia
master_doc_section: 6
master_doc_lines: "4862–6734"
canvas: ../canvases/layers/02-encyclopedia.canvas
status: stabilization-draft
owners:
  - Heenal (encyclopedia + learning paths)
data_refs:
  - data/knowledge-manifest.yaml
  - src/content/docs/ (live site articles)
related_layers:
  - "1 — Ontology"
  - "3 — Resource Graph & Ecosystem Atlas"
  - "4 — Concept & Idea Ecology"
  - "7 — Tracks & Composition"
---

# Layer 2 — Knowledge Commons / Encyclopedia

> Explains concepts, frameworks, domains, comparisons, guides, anti-patterns, and open questions.

## Purpose

The Knowledge Commons / Encyclopedia is the explanatory and educational layer of the Toolkit. It turns fragmented exposure into structured understanding. It moves people from scattered links to coherent learning; from isolated terms to shared vocabulary; from abstract ideas to applied interpretation; from web3 jargon to usable coordination literacy.

It is NOT the raw resource aggregation layer (that's L3); NOT the ontology (L1); NOT the Option Library (L5); NOT the Deployment layer (L6); NOT the implementation repository (L8); NOT the technical substrate (L10). **It is the place where concepts, frameworks, comparisons, guides, domains, anti-patterns, and open questions are explained.**

## Core questions

- What does this concept mean?
- Why does it matter?
- What is it often confused with?
- What frameworks help explain it?
- What domains does it belong to?
- What should someone read first?
- How does this idea relate to resources, options, tracks, deployments, implementations, and open questions?

## Function

The Encyclopedia exists to make the broader ecosystem intelligible without flattening it.

Functions:
- defining important concepts
- explaining frameworks
- comparing adjacent ideas
- organizing knowledge into domains
- supporting multiple audiences (Grounded Regen / Curious Degen / On-Chain Regen)
- reducing repeated explanatory labor
- helping contributors share vocabulary
- preserving plural perspectives where needed
- distinguishing settled knowledge from exploratory knowledge
- supporting tracks, options, deployments, and implementation review

It should function as **both a reference system and a navigable learning system**.

## Subsections (master doc §6)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 4865 | Layer intro |
| Current status | 4911 | Living knowledge architecture; structured draft |
| Function | 4935 | Reference + navigable learning |
| Layer relations | 4970 | Inputs from / outputs to other layers |
| Boundary rule | 5015 | Must not become resource list / ontology / option catalog / etc. |
| Core page types | 5064 | Concept pages, framework pages, comparison pages, domain overviews, learning paths, guides, glossary, anti-patterns, frontier pages |
| Entry metadata | 5307 | Frontmatter / metadata schema |
| Knowledge posture | 5346 | How to write encyclopedia content |
| **Core knowledge domains (14)** | 5392–6603 | The 14 domains — *the largest single block in the doc* |
| Distinctions from adjacent layers | 6604 | Encyclopedia vs Resource Graph vs Option Library vs Ontology |
| Minimum rule for this layer | 6673 | Layer minimum rule |
| Working summary | 6705 | Layer summary |

## The 14 Core Knowledge Domains

The master doc §6.10 enumerates 14 domains that organize all encyclopedia content (~5,490 lines).

| # | Domain | Lines | Theme |
|---|---|---|---|
| 0 | Meta-foundation and orientation | 5407 | How to read the encyclopedia |
| 1 | Concept spine | 5447 | Core regenerative + commons + web3 concepts |
| 2 | Systems thinking and complexity | 5627 | Living systems, feedback loops, emergence |
| 3 | Economics, value, and capital | 5683 | Value forms, exchange, capital types |
| 4 | Web3 and digital infrastructure | 5744 | Blockchain, DAOs, tokens, on-chain primitives |
| 5 | Governance, coordination, power, and institutional design | 5822 | Decision systems, accountability, power |
| 6 | Funding, allocation, treasury, and incentive systems | 5928 | Public goods funding, mechanism design |
| 7 | Knowledge systems, ontology, and documentation | 6015 | Knowledge commons, documentation discipline |
| 8 | Social systems, culture, narrative, and community infrastructure | 6088 | Culture, story, social coordination |
| 9 | Impact, evidence, verification, and measurement | 6143 | MRV, impact assessment, evidence |
| 10 | Environmental, local, and bioregional systems | 6203 | Bioregional design, place-based stewardship |
| 11 | AI, intelligence infrastructure, and machine-supported coordination | 6269 | AI in commons, agent design |
| 12 | Practical orientations and learning pathways | 6399 | Audience-specific entry points |
| 13 | Failure, resilience, and anti-patterns | 6510 | What goes wrong, why, how to avoid |
| 14 | Frontier questions and unresolved areas | 6559 | Open research, unsettled debates |

## Core page types (master doc §6.6)

- **Concept pages** — single concept explained
- **Framework pages** — interconnected frameworks
- **Comparison pages** — adjacent-concept clarification
- **Domain overviews** — entry points to a domain
- **Learning paths** — multi-page guided sequences
- **Guides** — practical how-to
- **Glossary entries** — short definitions
- **Anti-pattern explainers** — what not to do, why
- **Frontier / open-question pages** — unresolved
- **Case-linked knowledge pages** — concept + real implementation

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **1 Ontology** | Ontology *structures* meaning; Encyclopedia *explains* meaning. |
| **3 Resource Graph** | Graph maps what exists; Encyclopedia explains what it means. |
| **4 Concept Ecology** | Encyclopedia explains concepts; Concept Ecology maps lineage, movement, tensions. |
| **5 Option Library** | Encyclopedia explains; Library organizes reusable choices. |
| **7 Tracks** | Encyclopedia is the reference; Tracks compose encyclopedia material into pathways. |

## Minimum rule

The Encyclopedia must not absorb the function of Resource Graph, Ontology, Option Library, Deployment, or Implementation Memory. Each layer should remain distinguishable. **Polished writing is not automatically reviewed knowledge.** (Cross-Cutting Principle #3 — Maturity and Review State applies heavily here.)

## Cross-cutting principles most relevant

- #3 Maturity and review state
- #4 Public-use boundaries (high-risk: ecological claims, funding claims, governance recommendations)
- #5 Claim-evidence discipline
- #9 Anti-extractive synthesis (NEW — distinguishes helpful synthesis from extractive)
- #12 Pattern humility (NEW — no single-case generalization)

## Status & next

- **Existing site:** 67 of 254 articles live at [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app) (Astro/Starlight); 5 learning paths.
- **Article inventory:** roughly maps to the 14 domains; explicit domain ↔ article mapping is missing.
- **Phase 3 work:**
  - `data/knowledge-manifest.yaml` — currently empty / pre-iteration. Should index the 14 domains.
  - Article ↔ domain mapping for 67 published drafts + 187 remaining inventory items.
  - 4-article feedback application (Matt's notes on scams, seed phrases, wallet comparison, key terms — Heenal carryover from `HEARTBEAT.md`).
- **Phase 2 — expand 43 medium articles through the 5-stage editorial pipeline** (carryover from HEARTBEAT).
- **Coordination:** Heenal as layer owner; cross-link with Tracks layer (L7) since tracks compose encyclopedia content.

## Related

- **Canvas:** [`docs/canvases/layers/02-encyclopedia.canvas`](../canvases/layers/02-encyclopedia.canvas)
- **Live site:** [`astro.config.mjs`](../../astro.config.mjs) + [`src/content/docs/`](../../src/content/docs/)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.5 (LAYERS.md rewrite) + Phase G (site implications)
- **Writing system:** [`docs/writing-system.md`](../writing-system.md)
- **Heenal-side branch:** `content-updates/heen-ai/*` (Phase 4 reconciliation)
