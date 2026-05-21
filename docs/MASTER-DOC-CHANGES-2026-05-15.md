# MASTER.md — Iteration Changes 2026-05-15

> **Stabilization draft.** The 2026-05-15 iteration of `docs/MASTER.md` (Matty, shared 2026-05-15 via Telegram with the message "OK ALL YOU LUIZ"). This document captures the diff against the 2026-05-06 iteration (archived at `docs/archive/MASTER-2026-05-06-knowledge-commons-toolkit.md`). The 2026-04-23 pre-rename iteration sits one further archive layer deep (`docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`).

## Headline

- **Length:** ~13,737 lines → **24,776 lines** (~1.8× growth — second consecutive ~1.8× jump from a ~7.5k baseline)
- **Layer count:** 8 → **10**
- **Self-description:** "stabilization draft" — explicitly *not* settled. Matty's framing: "a lot was lost from the previous iteration. Still reworking it but feel free to run with what's in there and maybe cross reference the last doc too."
- **Implication:** This is the working surface for Pulse 1 retro + the two-month hackathon. Phase 3 structural refactor (deferred in `master-doc-iteration-may-2026.md`) now has its target.

## Layer-set diff

### Restored / re-added

- **Layer 7 — Tracks & Composition.** Tracks was dropped in the 2026-05-06 iteration (folded into Encyclopedia learning paths + Option Library compositions, per our reading). The new iteration re-introduces it as a first-class layer with 10 explicit track candidates (Newcomer Orientation, Community Organizer, Local Node Builder, Public Goods Funding Round, Knowledge Commons Builder, Governance Deep Dive, Environmental Impact, Bioregional Coordination, AI-Assisted Knowledge Garden, Implementation Reviewer). **This is the largest "what was lost" recovery Matty referred to.**

### Added (genuinely new)

- **Layer 10 — Infrastructure & Substrate.** Compares technical foundations (Markdown, GitHub, Astro/Starlight, Quartz, Notion, Obsidian, MediaWiki, JSON-LD, LinkML, Schema.org, RAG/GraphRAG, decentralized storage, attestations). Was nowhere as a top-level layer before. Sits *under* the system, not in the workflow.

### Unchanged in name and position

- Layer 1 — Ontology & Semantic Kernel
- Layer 2 — Knowledge Commons / Encyclopedia
- Layer 3 — Resource Graph & Ecosystem Atlas
- Layer 4 — Concept & Idea Ecology
- Layer 5 — Option Library
- Layer 6 — Deployment & Structural Integrity
- Layer 8 — Implementation **& Learning** Memory *(name expanded — "& Learning" added)*
- Layer 9 — Evolution Layer

### Rejected / not present

- **"Cross-Cutting Systems"** is no longer a peer concept at the architecture-table level; it's been promoted to a full top-level section **§4. Cross-Cutting Principles** with **18 enumerated principles** (was implicit / scattered in 2026-05-06). This is a clearer move.

## Major conceptual additions

### 1. Minimum Operating Kernel (§3, lines 1144–1186)

A v0.1 entry point: **5 core working objects**.

| Object | Meaning | Main question |
|---|---|---|
| Resource | Something found | What exists? |
| Concept | Something explained | What does it mean? |
| Option | Something reusable | What can be selected, adapted, or combined? |
| Deployment | Something specified for use | What must be explicit before this is used in practice? |
| Signal | Something learned or flagged | What happened, what changed, or what needs attention? |

**Why it matters:** The 2026-05-06 iteration enumerated 25 working ontology object types. The new iteration says: a contributor should be able to add one useful thing without understanding the entire system. Five-object kernel is the operational answer to ontology sprawl. **The 25-type list still exists as candidates** (§5.7 "Core entity type candidates", lines 3249–4179) — but the kernel is the v0.1 lens.

### 2. Core Movement (§3, lines 1092–1140)

> **Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve**

8-step sequence framing the Toolkit as a movement, not just an architecture. Maps to the layer sequence: Ontology → Knowledge → Resources → Options → Deployment → Tracks → Implementation → Evolution.

A compact alternative: **Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution.**

A shorter loop: **Ontology → Knowledge → Deployment → Evolution → Ontology** (the learn-from-use loop).

### 3. Two-Layer Ontology Posture (§5, lines 2994–3091)

Distinguishes:
- An **interoperable semantic core** aligned with Octo / BKC (Brian Knutson Commons?) — small, shared, portable.
- **Toolkit-specific operational extensions** — larger, opinionated, internal to the commons.

Resolves the "do we adopt their ontology vs build ours" tension by saying: both, with a clear interface.

### 4. CSIS as Semantic Overlay (not Conformance) (§5, lines 3175–3249)

Important framing shift. The 2026-04-23 iteration positioned CSIS as **strict conformance in Deployment, secondary in Feedback**. The new iteration positions CSIS as a **semantic overlay** — its concepts (Dunbar scaling, six-directional responsibility, decision/info/power/accountability/failure structures) inform the ontology and deployment templates, but **conformance is not automatic**. Closer to "CSIS-informed posture" than "CSIS adoption."

**Implication for `docs/CSIS.md` + the alignment report:** the existing CSIS × org-os Alignment Report needs a posture revision. Durgadas was flagged for this in the 2026-05-07 biweekly (Phase 2 reconciliation item); now there's specific master-doc text to react to.

### 5. Cross-Cutting Principles — 18 enumerated (§4, lines 1769–2710)

1. Provenance and source lineage
2. Attribution and return paths
3. Maturity and review state
4. Public-use boundaries
5. Claim-evidence discipline
6. Review should scale with risk
7. Regenerative obligation
8. Consent, privacy, and representation
9. **Anti-extractive synthesis** (NEW)
10. Interoperability without forced uniformity
11. Type / tag discipline
12. **Pattern humility** (NEW — no rapid generalization from single cases)
13. Local and ecological care
14. AI-assisted but human-governed
15. Infrastructure should serve workflows
16. **Living systems health** (NEW — monitor energy, trust, contribution flow, maintenance capacity)
17. **Compost, archive, and memory** (NEW — preserve outdated material without confusing current readers)
18. Contribution should be legible

**Three (#9, #12, #16, #17) are new principles**; the rest formalize implicit moves from prior iterations.

### 6. Layer Boundary Matrix (§3, lines 1637–1666)

16 distinctions made explicit (Resource vs Concept; Source vs Source System; Tool vs Option; Track vs Deployment; Implementation vs Pattern; Type vs Tag; Polished vs Reviewed; AI-assisted vs Human-reviewed; etc.). The "minimum structural rule" (§3, lines 1710–1733): **a layer should not absorb the function of another layer unless the interface is explicit.**

### 7. Knowledge Commoning Swarm — §2 expanded (lines 436–981)

The Swarm framing remains (introduced 2026-05-06) but is now substantially elaborated:
- "Swarm posture" (§2.4)
- "Swarm moves and Toolkit translation" (§2.5)
- "What the Toolkit can contribute" (§2.6 — 6 contribution streams, mapped to Swarm functions Store/Contribute/Find/Govern/Connect/Evolve)
- "Possible Swarm-facing outputs" (§2.7)
- "Adjacent commons and source systems" (§2.9)
- "What the Toolkit should avoid in relation to the Swarm" (§2.10)

The **6 contribution streams** match the `docs/plans/swarm-contribution-pack.md` v0.1 we drafted post-2026-05-06 — confirming that plan against the new iteration. The Bonfires / Implementation Memory co-authoring opportunity (raised 2026-05-07 with Koi) is even more clearly framed.

## Layer detail expansion

Approximate per-layer line counts in the new iteration vs the 2026-05-06 archive (very rough — based on section start lines):

| Layer | 2026-05-06 | 2026-05-15 | Δ |
|---|---|---|---|
| 1 — Ontology & Semantic Kernel | ~1,000 | **~2,150** | +1.15× |
| 2 — Knowledge Commons / Encyclopedia | ~600 | **~5,490** | +8× ⚠ (most growth) |
| 3 — Resource Graph & Ecosystem Atlas | ~3,500 | **~3,615** | flat |
| 4 — Concept & Idea Ecology | ~500 | **~1,725** | +3.5× |
| 5 — Option Library | ~1,000 | **~2,025** | +2× |
| 6 — Deployment & Structural Integrity | ~600 | **~1,355** | +2.25× |
| 7 — Tracks & Composition | (dropped) | **~2,047** | restored |
| 8 — Implementation & Learning Memory | ~400 | **~1,370** | +3.4× |
| 9 — Evolution Layer | ~400 | **~1,365** | +3.4× |
| 10 — Infrastructure & Substrate | (folded) | **~1,385** | promoted to layer |
| §15 — Contributor Roles & Working Practices | (scattered) | **~1,250** | new section |
| §16 — Backlog, Notes, Appendices | (scattered) | **~1,820** | consolidated |

The **biggest content jump is Layer 2 (Encyclopedia)** — at ~5,490 lines, it's nearly a quarter of the doc. Subdivided into 14 core knowledge domains (Concept spine; Systems thinking; Economics; Web3; Governance; Funding; Knowledge systems; Social systems; Impact/evidence; Environmental/bioregional; AI; Practical orientations; Failure/anti-patterns; Frontier questions). This is approximately the 254-article inventory finally getting structural homes.

**Layer 7 (Tracks) at ~2,047 lines** — that's where most of the "what was lost" content from prior iterations seems to have been recovered.

## What "a lot was lost" likely refers to

Cross-referencing the 2026-04-23 archive (which had Tracks at Layer 6) with the 2026-05-06 archive (which dropped Tracks), the dropped content appears to have been:
- Tracks layer entirely
- Per-track composition examples
- Per-track audience framing

All of these are now back in §11 (Tracks & Composition) with **10 fully-defined track candidates**, each with structure (concepts pulled, options pulled, deployment checks, tools, implementation pathway, common failure patterns). Matty's "still reworking" suggests not all prior-iteration tracks language has been recovered yet.

**Action:** When refactoring, **diff Tracks (now §11) against the 2026-04-23 Tracks layer** rather than against 2026-05-06 (which doesn't have it). The new content + 2026-04-23 content together form the working surface for Tracks restoration.

## What the new iteration explicitly *avoids*

(§16, lines 24659–24686 "What to avoid in the next pass") — preserved here because it directly shapes how we should integrate:

- Do not collapse layers prematurely.
- Do not finalize ontology before resources, concepts, and options are populated.
- Do not present polished writing as reviewed knowledge.
- Do not strip frame language without preserving Frame 1 / Frame 2 / Frame 3 distinction.
- Do not declare a pattern from a single case.
- Do not over-engineer infrastructure before workflows are clear.
- Do not let AI synthesis bypass review.

The fifth and sixth bullets are direct echoes of Pattern Humility (cross-cutting #12) and Infrastructure-serves-Workflows (cross-cutting #15).

## Implications for the overlay refactor

The `master-doc-iteration-may-2026.md` plan (created 2026-05-06) was sequenced as:
- Phase 1 — Surfacing (done 2026-05-06–07)
- Phase 2 — Reconciliation discussion (in-progress through ~2026-05-21 biweekly + Pulse 1)
- Phase 3 — Structured refactor (post-Pulse-1)
- Phase 4 — Cross-branch reconciliation

**Pulse 1 just happened (2026-05-09–10). Phase 3 is now unblocked. AND a new master-doc iteration just landed.** So the Phase 3 work now refactors against the 2026-05-15 iteration, not the 2026-05-06 one.

A new plan — `docs/plans/master-doc-iteration-may-15-2026.md` — supersedes the May 6 plan's Phase 3 and adds the per-layer documentation + canvas work the operator requested in the 2026-05-15 message.

---

_End of changes doc. See `docs/plans/master-doc-iteration-may-15-2026.md` for the integration plan._
