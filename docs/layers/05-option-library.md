---
layer: 5
name: Option Library
master_doc_section: 9
master_doc_lines: "12073–14099"
canvas: ../canvases/layers/05-option-library.canvas
status: stabilization-draft
owners:
  - Luiz (currently — open for reassignment)
data_refs:
  - data/option-library.yaml
related_layers:
  - "1 — Ontology"
  - "2 — Encyclopedia"
  - "6 — Deployment & Structural Integrity"
  - "7 — Tracks & Composition"
  - "8 — Implementation & Learning Memory"
---

# Layer 5 — Option Library

> Organizes mechanisms, methods, workflows, templates, patterns, protocols, tools, and design components — the Toolkit's reusable design layer.

## Purpose

The Option Library organizes reusable choices. It treats options as **selectable components that may later be composed into tracks or specified into deployments**. It is not a conceptual explainer (that's L2) and not a deployment plan (that's L6).

> An option becomes useful when its context, dependencies, risks, failure modes, and structural requirements are visible. The Option Library should help people choose with care, compose with context, and learn from implementation. — `docs/MASTER.md` §9 working summary

## Core questions

- What design choices are available?
- What governance, coordination, funding, documentation, measurement, incentive, infrastructure, or operational patterns can be reused?
- What are the tradeoffs?
- What conditions are required?
- What failure modes are common?
- What options are compatible or incompatible?
- What should be compared before choosing?

## Subsections (master doc §9)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 12077 | Layer intro |
| Current status | 12121 | Living design library |
| What counts as an option | 12171 | Definition + boundary |
| Layer relations | 12243 | Encyclopedia ↔ Library ↔ Deployment ↔ Tracks |
| Option entry template | 12277 | The structured shape of an entry |
| Option maturity | 12319 | Maturity states |
| Option review and risk | 12350 | Risk-scaled review |
| **9 Core option categories** | 12410–13697 | The 9 categories — see below |
| Cross-category compositions | 13697 | Worked composition examples (5) |
| Option classification fields | 13880 | Fields for entries |
| Distinctions from adjacent layers | 13914 | Option vs Tool vs Deployment vs Implementation |
| Minimum rule for this layer | 14000 | Layer minimum rule |
| **Practical v0.1 recommendation** | 14023 | What to do for v0.1 |
| Working summary | 14064 | Layer summary |

## The 9 Core Option Categories

| # | Category | Lines |
|---|---|---|
| 1 | Governance Options | 12410 |
| 2 | Coordination Options | 12563 |
| 3 | Organizational Structure Options | 12718 |
| 4 | Funding and Capital Options | 12874 |
| 5 | Token and Incentive Options | 13040 |
| 6 | Knowledge and Documentation Options | 13185 |
| 7 | Impact and Measurement Options | 13324 |
| 8 | Implementation and Operations Options | 13459 |
| 9 | Experimentation Options | 13590 |

**This 9-category structure matches the existing `data/option-library.yaml` 9-category scaffold** from earlier work. Cross-walk in Phase 3 is mostly a verification — naming alignment and entry granularity, not category restructure. **The Tool / Option / Pattern / Protocol / Deployment / Case 6-tier proposal from 2026-05-06 is dropped** — the new doc's simpler boundary matrix (Option vs Tool vs Deployment vs Implementation vs Pattern) supersedes it.

## Cross-category compositions (master doc §9.10 — 5 worked examples)

- Local Node Model
- Participatory Allocation System
- Knowledge Garden Network
- Ecological Impact Reporting Flow
- AI-Assisted Knowledge Commons Workflow

Each composition combines options from 3–6 categories. These compositions are the *raw material* for Tracks (L7) and Deployments (L6).

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **2 Encyclopedia** | Encyclopedia *explains*; Library *organizes reusable choices*. |
| **6 Deployment** | An option is selectable; a deployment specifies how it will be used. |
| **7 Tracks** | An option is a component; a track is a composition of options + concepts + resources. |
| **8 Implementation Memory** | Options inform implementations; implementations update option maturity over time. |

## v0.1 recommendation (verbatim, master doc §9.13)

For the next iteration, do not attempt to complete every option entry. Instead:

1. Preserve the nine major option categories.
2. Create 2–3 example entries in each category.
3. Mark raw options as candidates.
4. Add failure modes and deployment checks to high-risk options first.
5. Link priority options to Encyclopedia pages and Resource Graph references.
6. Route options into relevant Tracks later.
7. Use implementation cases to update maturity over time.

**Priority example options for v0.1:** local node model · source-system card · claim-evidence record · consent-based decision-making · multisig treasury · quadratic funding · milestone-based grants · attestation-based evidence record · knowledge garden workflow · implementation retrospective · safe-to-fail probe · AI-assisted source classification

## Minimum rule

> An option is not a deployment. An option becomes useful when its context, dependencies, risks, failure modes, and structural requirements are visible.

## Cross-cutting principles most relevant

- #3 Maturity and review state
- #5 Claim-evidence discipline
- #6 Review should scale with risk
- #12 Pattern humility (NEW)

## Status & next

- **Existing data:** `data/option-library.yaml` — 9 categories scaffold; entries thin.
- **Phase 3 work:**
  - Add `option entry template` (§9.5) as schema in YAML frontmatter or schema file
  - Add `option maturity` states to existing entries
  - Lift 5 cross-category compositions (§9.10) as starting Track candidates (L7)
  - Add 2–3 example entries per category (12 priority examples listed above)
- **Coordination:** Layer owner currently Luiz (operator default); consider reassignment at ~2026-05-21 biweekly via persona/skill-card session.

## Related

- **Canvas:** [`docs/canvases/layers/05-option-library.canvas`](../canvases/layers/05-option-library.canvas)
- **Data:** [`data/option-library.yaml`](../../data/option-library.yaml)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.2
- **Lift script:** to be created — [`scripts/lift-options.mjs`](../../scripts/lift-options.mjs) (Phase F)
