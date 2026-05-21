---
layer: 6
name: Deployment & Structural Integrity
master_doc_section: 10
master_doc_lines: "14099–15454"
canvas: ../canvases/layers/06-deployment.canvas
status: stabilization-draft
owners:
  - Luiz (architecture)
  - Durgadas (CSIS semantic overlay)
data_refs:
  - data/deployment-requirements.yaml
related_layers:
  - "5 — Option Library"
  - "7 — Tracks & Composition"
  - "8 — Implementation & Learning Memory"
related_docs:
  - docs/CSIS.md
  - docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md
---

# Layer 6 — Deployment & Structural Integrity

> Defines roles, authority, consent, decision paths, risks, obligations, failure modes, and review needs. **Where structural integrity matters most.** The Toolkit's responsibility translation point.

## Purpose

The Deployment & Structural Integrity layer defines what must be explicit before an option, track, tool, process, governance model, funding mechanism, knowledge workflow, or implementation design is used in practice.

> A good idea is not the same as a valid deployment. A concept may be useful. An option may be promising. A tool may be powerful. A track may be well-designed. A previous implementation may be inspiring. But none of those are automatically safe or coherent in a new context. **Deployment is where choices become operational.** — `docs/MASTER.md` §10.1

> A deployment is valid only if all required structures are explicitly defined and visible. — preserved core principle from previous iterations

## Core questions

- What exactly is being deployed? In what context? By whom? For whom?
- Who decides? Who participates? Who holds authority?
- Who controls infrastructure, funds, data, or access?
- What information is required?
- What risks are visible? What obligations exist? What failure modes are expected?
- What is fixed, configurable, or experimental?
- What review is required before this can be treated as ready?

## Subsections (master doc §10)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 14102 | Layer intro |
| Current status | 14146 | Stabilization priority |
| What deployment means | 14189 | Definition |
| Why this layer matters | 14249 | Concrete domains needing this layer |
| Structural integrity | 14282 | Core principle |
| **6 Minimum deployment integrity checks** | 14311–14609 | The 6 mandatory checks |
| Deployment entry template | 14656 | Structured shape |
| Deployment classification | 14701 | Type · Scale · Context · Maturity · Risk |
| Deployment review types | 14805 | Review patterns |
| **6 High-risk deployment areas** | 14835 | Funding · Tokens · Governance · Ecological/MRV · AI · Community mapping |
| CSIS-informed deployment posture | 15004 | ⭐ Reframed — CSIS-informed, not CSIS-conformant |
| Deployment validity levels | 15052 | Validity states |
| Example deployment checks | 15077 | 4 worked examples |
| Deployment and tracks | 15271 | Interface |
| Deployment and implementation | 15325 | Interface |
| Minimum rule for this layer | 15356 | Layer minimum rule |
| **Practical v0.1 recommendation** | 15379 | v0.1 guidance |
| Working summary | 15421 | Layer summary |

## The 6 Minimum Deployment Integrity Checks

Per master doc §10.6, every deployment must specify:

| # | Check | Lines |
|---|---|---|
| 1 | Decision system | 14314 |
| 2 | Information requirements | 14371 |
| 3 | Power structure | 14429 |
| 4 | Accountability system | 14491 |
| 5 | Failure detection system | 14550 |
| 6 | Fixed / configurable / experimental boundaries | 14609 |

**This is the structural-integrity minimum.** A deployment without all 6 explicit is not a valid deployment.

## The 6 High-Risk Deployment Areas (master doc §10.13)

| # | Area | Lines |
|---|---|---|
| 1 | Funding mechanisms | 14841 |
| 2 | Token and incentive systems | 14870 |
| 3 | Governance systems | 14898 |
| 4 | Ecological / MRV systems | 14924 |
| 5 | AI-assisted systems | 14950 |
| 6 | Community mapping and representation | 14976 |

These get heavier review than other deployments.

## CSIS as semantic overlay (key 2026-05-15 framing shift)

The 2026-04-23 iteration positioned CSIS as "strict conformance in Deployment, secondary in Feedback." The 2026-05-15 iteration **reframes CSIS as a semantic overlay** (§5.6 + §10.12) — its concepts (Dunbar scaling, six-directional responsibility, decision/info/power/accountability/failure structures) inform the ontology and deployment templates, but **conformance is not automatic**. Posture is "CSIS-informed," not "CSIS-adopted."

> **Implication for `docs/CSIS.md` + the alignment report:** the existing alignment report needs a posture revision. Durgadas was flagged for this at the 2026-05-07 biweekly (Phase 2 reconciliation item); now there's specific master-doc text to react to.

## Worked deployment-check examples (master doc §10.16)

- Public goods funding round deployment
- Local node deployment
- AI-assisted knowledge workflow deployment
- Ecological reporting deployment

Each shows the 6 minimum checks + applicable high-risk-area considerations applied to a concrete deployment archetype.

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **5 Option Library** | An option is selectable; a deployment specifies how it will be used. |
| **7 Tracks** | A track is a guided pathway; a deployment is a specific configuration. |
| **8 Implementation Memory** | A deployment is specified for use; an implementation happens in reality. |

## Minimum rule

A deployment is valid only if all required structural conditions are explicitly defined and visible. **Don't encourage people to copy mechanisms, governance models, funding systems, documentation workflows, local node structures, AI workflows, or ecological reporting processes without making the structural conditions visible.**

## Cross-cutting principles most relevant

- #4 Public-use boundaries
- #5 Claim-evidence discipline
- #6 Review should scale with risk
- #7 Regenerative obligation
- #8 Consent, privacy, and representation
- #14 AI-assisted but human-governed

## Status & next

- **Existing data:** `data/deployment-requirements.yaml` — generated earlier; aligned to previous iteration. Reconcile against §10.6 (the 6 minimum checks) and §10.13 (the 6 high-risk areas).
- **Phase 3 work:**
  - Update `data/deployment-requirements.yaml` schema to the 6-checks structure
  - Add high-risk-area annotations to relevant entries
  - Revise `docs/CSIS.md` posture: "semantic overlay" (not "conformance")
  - Update `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md` accordingly (sync with Durgadas)
- **Worked-example templates** — lift §10.16's 4 examples into `data/deployment-examples.yaml` as starter material.
- **Coordination:** Luiz (architecture) + Durgadas (CSIS posture). The Frame Language critique (Durgadas) interacts with this layer through the structural-integrity questions in the cross-cutting principles.

## Related

- **Canvas:** [`docs/canvases/layers/06-deployment.canvas`](../canvases/layers/06-deployment.canvas)
- **Data:** [`data/deployment-requirements.yaml`](../../data/deployment-requirements.yaml)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.6 (CSIS posture revision) + §E.6 (IDENTITY.md ownership refresh)
- **CSIS:** [`docs/CSIS.md`](../CSIS.md) + alignment report
- **Plans:** Pulse 1 retro (still owed) — Pulse 1 surfaced what Swarm participants considered "ready"
