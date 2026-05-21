---
layer: 8
name: Implementation & Learning Memory
master_doc_section: 12
master_doc_lines: "17501–18873"
canvas: ../canvases/layers/08-implementation-memory.canvas
status: stabilization-draft
owners:
  - Koi / Caue Mtomaz (candidate — Bonfires substrate)
  - Luiz (operator default)
data_refs:
  - data/feedback-process.yaml (currently combined L8 + L9; to be split)
related_layers:
  - "5 — Option Library"
  - "6 — Deployment & Structural Integrity"
  - "7 — Tracks & Composition"
  - "9 — Evolution Layer"
federation_hooks:
  - "Bonfires / regen-koi MCP (mcp__regen-koi__*)"
---

# Layer 8 — Implementation & Learning Memory

> Records pilots, campaigns, funding rounds, governance experiments, local nodes, failures, adaptations, signals, and lessons. **Makes the Toolkit accountable to use.**

## Purpose

Implementation & Learning Memory records what actually happens when ideas, options, tracks, deployments, tools, funding mechanisms, governance systems, local nodes, knowledge workflows, or ecological practices are used in the world.

> The Toolkit should not only organize knowledge before action. It should also learn from action.
>
> A deployment is the specified structure. An implementation is what happened in reality. Learning Memory is how the Toolkit preserves the difference. — `docs/MASTER.md` §12.1

## Core questions

- What was attempted? Implemented? Who participated?
- What context mattered? What assumptions were tested?
- What changed from the original deployment?
- What worked? What failed? What adapted?
- What evidence was produced? What signals emerged?
- What should update the Toolkit? What should not be generalized?
- What could become a reusable pattern later?

## Why this layer matters (master doc §12.3)

Without Implementation Memory, the Toolkit risks becoming:
- a theory archive
- a polished knowledge base disconnected from practice
- a list of options with no evidence of use
- a set of tracks with no feedback
- a deployment framework with no field testing
- an AI-generated synthesis layer without reality checks

**Implementation Memory makes the Toolkit accountable to use.**

## Existing implementation context (master doc §12.2)

Implementation learning already exists across the ecosystem, even if undocumented in this format:
- GreenPill Brasil activities
- Regen Rio
- GreenGoods
- Gitcoin Grants Garden
- Cookie Jar Research Raid planning
- Gardens v2 usage
- Karma GAP reporting
- CIDS-style impact updates
- local chapter onboarding
- public goods funding rounds
- knowledge commons drafting
- AI-assisted documentation workflows
- ecological data and reporting pilots
- community workshops
- governance experiments
- bounties and contribution tracking
- resource mapping and source-system organization

This material lives in docs, chats, Charmverse, GitHub, Karma GAP, forum posts, grant applications, spreadsheets, field notes. **The purpose of this layer is not to rewrite all of it immediately. The purpose is to create a structure so future implementation learning can be captured and routed back.**

## Subsections (master doc §12)

| Subsection | Lines | What |
|---|---|---|
| Purpose | 17504 | Layer intro |
| Current status | 17543 | Major future value layer |
| Why this layer matters | 17583 | Accountability to use |
| Implementation vs adjacent layers | 17621 | Implementation vs Deployment vs Track vs Pattern |
| What belongs in Implementation Memory | 17718 | Inclusion criteria |
| Implementation record template | 17758 | Structured shape |
| Implementation maturity | 17806 | Maturity states |
| **9 Types of implementation records** | 17834–18159 | The 9 record types |
| Signal capture | 18159 | How signals are extracted |
| Learning loop | 18210 | The Implementation → Learning cycle |
| Claim-evidence records in implementation | 18262 | Evidence discipline |
| Public-use boundaries in implementation | 18311 | High-risk handling |
| Pattern generation | 18366 | When a case becomes a pattern (rare; per §4.12 Pattern Humility) |
| Implementation Memory and source systems | 18408 | Interface with L3 |
| Implementation Memory and AI | 18451 | AI's role + boundaries |
| Example implementation records | 18508 | 4 worked examples |
| **7 Implementation Memory practices** | 18653 | Working practices |
| Minimum rule for this layer | 18769 | Layer minimum rule |
| Practical v0.1 recommendation | 18799 | v0.1 guidance |
| Working summary | 18837 | Layer summary |

## The 9 Implementation Record Types (master doc §12.10)

1. Pilot record
2. Campaign record
3. Funding round record
4. Governance implementation record
5. Local node record
6. Knowledge commons implementation record
7. Ecological / MRV implementation record
8. Event / workshop record
9. Failure case record

## The 7 Implementation Memory Practices (master doc §12.20)

1. Record the gap between plan and reality
2. Preserve context
3. Document failures without blame
4. Separate claims from evidence
5. Route signals (into Evolution layer)
6. Do not generalize too quickly *(pattern humility — cross-cut #12)*
7. Feed the commons

## Bonfires / KOI federation hook (2026-05-07 biweekly decision)

Caue "Koi" Mtomaz demoed **Bonfires** at the 2026-05-07 biweekly as both methodological model AND live substrate for this layer:

- **Methodology** — Brazil Bonfires AI audit project: design science research, multiple tracks per hypothesis, AI-audit data collection (NotebookLM, GPT, Bonfires).
- **Substrate** — Telegram bot + entity mapping (user/project/general) + cross-platform knowledge graph (Discord/Telegram) + real-time indexing.

This operator's overlay **already runs `mcp__regen-koi__*` integration**. Federation hook is live — needs only co-authoring + attribution arrangement.

**Implication for the swarm-contribution-pack:** `04-implementation-memory.md` becomes a co-authoring effort with Koi, referencing Bonfires-as-substrate, not just presenting a generic schema. See [`docs/plans/swarm-contribution-pack.md`](../plans/swarm-contribution-pack.md) stream #4.

## Adjacent layers

| Adjacent | Distinction |
|---|---|
| **6 Deployment** | A deployment is specified for use; an implementation is what happens in reality. |
| **7 Tracks** | A track prepares people for action; an implementation records what they did. |
| **9 Evolution** | Implementation generates signals; Evolution interprets and routes them. |

## Minimum rule

A single case is not a pattern. Implementation Memory records what happened; pattern generation requires repeated evidence or clear transferability conditions. *(See cross-cut #12 Pattern Humility — NEW.)*

## Cross-cutting principles most relevant

- #3 Maturity and review state
- #5 Claim-evidence discipline
- #6 Review should scale with risk
- #12 Pattern humility (NEW)
- #16 Living systems health (NEW)

## Status & next

- **Existing data:** `data/feedback-process.yaml` — combined L8 + L9; pre-iteration.
- **Phase 3 work (per [`master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.3):**
  - Decide split: `data/implementation-memory.yaml` + `data/evolution.yaml`, or single yaml with two sections?
  - Add Bonfires substrate reference + co-authoring arrangement with Koi
  - Map the 9 implementation record types to schema entries
- **Layer owner:** Koi candidate (raised 2026-05-07 biweekly). Confirm at ~2026-05-21 via persona/skill-card session.

## Related

- **Canvas:** [`docs/canvases/layers/08-implementation-memory.canvas`](../canvases/layers/08-implementation-memory.canvas)
- **Data:** [`data/feedback-process.yaml`](../../data/feedback-process.yaml) (to be split)
- **Plans:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E.3 + [`docs/plans/swarm-contribution-pack.md`](../plans/swarm-contribution-pack.md) stream #4
- **Bonfires:** Caue Mtomaz's KOI stack — `mcp__regen-koi__*` MCP tools active in this instance
