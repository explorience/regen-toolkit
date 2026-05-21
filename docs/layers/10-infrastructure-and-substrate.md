---
layer: 10
name: Infrastructure & Substrate
master_doc_section: 14
master_doc_lines: "20239–21626"
canvas: ../canvases/layers/10-infrastructure.canvas
status: stabilization-draft-NEW
notes: "NEW layer in 2026-05-15 iteration — promoted from 'discussed in passing' to a first-class layer."
owners:
  - Luiz (operator default — coordination layer)
data_refs:
  - .well-known/
  - package.json
  - astro.config.mjs
related_layers:
  - "All layers" (Infrastructure supports each)
---

# Layer 10 — Infrastructure & Substrate

> Compares the technical and organizational foundations that can support the Toolkit. **Sits under the system, not in the workflow.** *New in the 2026-05-15 iteration.*

## ⭐ New layer

The 2026-04-23 + 2026-05-06 iterations folded infrastructure discussion into other sections. The 2026-05-15 iteration **promotes it to a first-class layer (§14)** with explicit substrate-by-need mapping. This recognizes that infrastructure choices shape the commons in non-obvious ways.

## Purpose

The Infrastructure & Substrate layer defines the technical and organizational foundations that can support the Toolkit.

> This layer should support the commons without prematurely defining it. The Toolkit should not choose infrastructure before workflows are clear. A tool can make a workflow easier. A tool can also distort the commons around its own assumptions. **Infrastructure should serve the work.** — `docs/MASTER.md` §14.1

## Core questions

- Where should the Toolkit live?
- What should remain in documents? Move into tables? Become structured data? Be graph-native? Become public site content?
- What should remain private, internal, or review-gated?
- What tools can support contribution, review, search, publishing, versioning, AI workflows, and interoperability?
- What should be human-readable? Machine-readable? Substrate-agnostic until workflows are clearer?

## Core principle (master doc §14.3)

> **Infrastructure should follow function.** Before choosing a tool, ask: *What work does this part of the Toolkit need to do?*

| Toolkit need | Better substrate |
|---|---|
| Architectural explanation | Markdown / document |
| Longform reasoning | Document / essay / markdown page |
| Public guide | Documentation site |
| Resource inventory | Spreadsheet / database / structured table |
| Source-system registry | Structured table + Source System Cards |
| Option Library | Structured entries + markdown explanations |
| Ontology | YAML / JSON / LinkML / JSON-LD / Markdown frontmatter |
| Relationships | Graph database / graph files / linked metadata |
| Implementation Memory | Case records + structured metadata |
| Evolution Log | Table / issue tracker / changelog |
| Review workflow | GitHub issues, forms, status fields, or task system |
| AI retrieval | Structured corpus + metadata + source lineage |
| Public navigation | Site, tags, search, index pages, track pages |
| Contributor workflow | Low-friction forms, docs, templates, or issue flows |

> **No single tool needs to do everything.** The Toolkit may need a hybrid substrate.

## The 12 Substrate Types (master doc §14.4–14.15)

| # | Substrate | Lines |
|---|---|---|
| 1 | Master documents | 20378 |
| 2 | Markdown | 20415 |
| 3 | Google Docs | 20465 |
| 4 | GitHub | 20501 |
| 5 | Static documentation site (Astro / Starlight) | 20550 |
| 6 | Spreadsheets and structured tables | 20613 |
| 7 | Databases | 20682 |
| ... | (Notion, Obsidian, JSON-LD, LinkML, graph DBs, RAG/GraphRAG, decentralized storage, attestations) | 20682+ |

## Subsections (master doc §14)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 20242 | Layer intro |
| Current status | 20280 | Moving from document-based to structured |
| Core infrastructure principle | 20333 | Infrastructure should follow function |
| **Substrate types (12)** | 20378–20997 | Each substrate's strengths + weaknesses |
| Infrastructure by Toolkit layer | 20997 | What substrate fits which layer |
| Suggested infrastructure stack by phase | 21346 | Phased adoption guidance |
| Possible tool map | 21480 | Tool ↔ function mapping |
| Contributor interface | 21512 | Low-friction contribution paths |
| Public / private / internal boundaries | 21557 | What's visible to whom |
| AI-readable metadata | 21592 | Metadata for AI workflows |

## Infrastructure by Toolkit Layer (master doc §14.16)

Per-layer substrate guidance for *this* Toolkit. (The current overlay's choices are noted below in brackets.)

| Layer | Suggested substrate | Current overlay |
|---|---|---|
| 1 Ontology | YAML / JSON-LD / Markdown frontmatter | `data/ontology/*.yaml` ✅ |
| 2 Encyclopedia | Markdown + static site | Astro / Starlight ✅ |
| 3 Resource Graph | Structured table → graph | `data/resources.yaml` ✅ (lift step) |
| 4 Concept Ecology | Markdown + structured concept clusters | `data/ontology/concepts.yaml` (partial) |
| 5 Option Library | Structured entries + Markdown | `data/option-library.yaml` ✅ |
| 6 Deployment | Templates + checklists in Markdown | `data/deployment-requirements.yaml` ✅ |
| 7 Tracks | Markdown + structured track entries | `data/tracks.yaml` ⏳ (to create) |
| 8 Implementation Memory | Case records (Markdown + metadata) | `data/feedback-process.yaml` (split pending) |
| 9 Evolution | Issue tracker / changelog / structured log | `data/feedback-process.yaml` (split pending) |
| 10 Infrastructure | This layer (Markdown + metadata) | This doc + canvases |

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **All layers** | Infrastructure supports each layer; never defines them. |
| **1 Ontology** | Ontology defines what *can* be modeled; Infrastructure decides *where* it's stored. |

## Minimum rule

> Do not choose infrastructure before workflows are clear.

## Cross-cutting principles most relevant

- #10 Interoperability without forced uniformity
- #14 AI-assisted but human-governed
- #15 Infrastructure should serve workflows
- #16 Living systems health (NEW)
- #18 Contribution should be legible

## Public / private / internal boundaries (master doc §14.20)

The new iteration explicitly raises this:
- **Public** — knowledge site content, public Resource Graph entries
- **Internal** — working documents, draft entries, contributor-only material
- **Private** — high-risk material, sensitive community data, unreviewed claims

Different substrates suit different visibility tiers (public site / GitHub / private notes / etc.).

## Status & next

- **Existing substrate stack:**
  - **Master doc:** Google Doc (Matty's authoring) → mirrored to `docs/MASTER.md`
  - **Public site:** Astro / Starlight, Vercel-deployed at regen-toolkit-site.vercel.app
  - **Coordination overlay:** This `feature/org-os-overlay` branch + npm scripts + `.well-known/` schemas
  - **Resource Graph:** `data/resources.yaml` (lifted from master doc)
  - **Knowledge graph (potential):** Bonfires (regen-koi) via `mcp__regen-koi__*` MCP integration
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §F):**
  - Refactor `scripts/lift-*.mjs` to anchor by section heading, not line numbers (iteration-stable)
  - Add `scripts/lift-options.mjs`, `lift-tracks.mjs`, `lift-concepts.mjs`
  - Update `data/knowledge-manifest.yaml` to index §6's 14 domains
  - Add `data/tracks.yaml` registry
- **Coordination:** Luiz as operator default (coordination layer); consider whether infrastructure choices need broader team sign-off (especially private-vs-public boundary decisions per §14.20).

## Related

- **Canvas:** [`docs/canvases/layers/10-infrastructure.canvas`](../canvases/layers/10-infrastructure.canvas)
- **Stack:** [`package.json`](../../package.json), [`astro.config.mjs`](../../astro.config.mjs), [`.well-known/`](../../.well-known/)
- **Federation:** [`federation.yaml`](../../federation.yaml), `mcp__regen-koi__*` MCP integration
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §F (Phase F — Repo development infrastructure)
- **Site:** [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app)
