# Master Doc Changes — 2026-06-15 iteration

> Diff of `docs/MASTER.md` from the **2026-05-15 stabilization draft** (24,776 lines) to the **2026-06-15 working iteration** (30,847 lines, ~1.25×).
> Source: Matty's Google Doc ("Regen Knowledge Commons Toolkit"), exported 2026-06-15 — the doc he walked Luiz through in the [2026-06-15 work session](reports/2026-06-15-toolkit-worksession-matty-integration-report.md).
> Previous canonical archived at [`docs/archive/MASTER-2026-05-15-stabilization-draft.md`](archive/MASTER-2026-05-15-stabilization-draft.md). Raw GDocs export (escaped) preserved at [`docs/MASTER-2026-06-15-iteration-raw.md`](MASTER-2026-06-15-iteration-raw.md).

## Headline

**This is an integration pass, not a re-architecture.** The 10-layer core (Ontology → Encyclopedia → Resource Graph → Concept & Idea Ecology → Option Library → Deployment → Tracks → Implementation → Evolution → Infrastructure) is **stable** — unchanged from 2026-05-15. The ~6k new lines are: (1) the long-missing **Problem / Theory of Change** framing, (2) the **three-artifact model** + "public ≠ commons," (3) **CSIS reframed as informed-not-conformant**, (4) a **candidate reorganization** (Knowledge Lifecycle spine) offered *without committing to it*, and (5) preserved working materials (Matty's GPT handoff docs, the 13-option Structure Options doc, the resource DB dump, and the June 15 meeting notes).

Matty's own instruction inside the doc (§14 of Handoff Doc 2): *"The next task is not a full conceptual rewrite. It is an integration pass that connects the strong existing master doc architecture with the clearer problem frame, theory of change, v1 site, and public invitation strategy."*

## What's new (vs 2026-05-15)

### 1. Problems / Theory of Change / Outputs / Outcomes — NEW, formalized (two versions)
Directly answers **Durgadas's "theory of build vs theory of change" critique** from the 2026-05-21 biweekly. Two versions are present:
- A **10-problem** version (shared knowledge hard to find/use; coordination capacity uneven; field too complex to hold alone; aligned people not discoverable; orgs need documentation/memory; knowledge not connected to action; systems thinking inaccessible; trust/maturity unclear; implementation learning lost; structural integrity named more than practiced).
- An **UPDATED 14-problem** version adding: public-goods builders rebuild without shared context; high-signal conversations/media not becoming shared memory; regenerative media ecosystems under-connected; automated curation still too manual/biased.
- Plus **Theory of Change**, **Outputs & Outcomes** (short/medium/long-term), **First Practical Tests**, **Lightweight Learning Signals**.

### 2. Three-artifact model + "Public is not the same as commons" — NEW
Explicit framing (from the 2026-06-04 biweekly): **(1)** Heenal's simplified **v1 public site** (the usable front door — now live at regen-web3-toolkit.vercel.app); **(2)** the **master doc** (the deeper operating system behind it); **(3)** a **hub/forum post** that invites use, critique, contribution, co-stewardship. Heenal's insight: something being public doesn't make it a commons — it becomes one when people use/correct/contribute/steward it.

### 3. CSIS reframed → "CSIS-Informed, Not CSIS-Conformant" — formalized
The 2026-05-15 reframe ("conformance" → "semantic overlay") is now a full **Structural Integrity Alignment Map**: a **three-level model** (Level 1 Principles · Level 2 Review prompts · Level 3 Enforceable standards), "from visibility toward falsifiability," and **minimum enforceable safeguards** (source/evidence status, AI-synthesis status, resource review status, link status, source-system care, deployment review-readiness, implementation-learning boundary). 7 open CSIS decisions enumerated for the next iteration. *(Resolves the long-standing `docs/CSIS.md` "posture revision pending" flag toward informed-not-conformant.)*

### 4. "Next Working Draft" — NEW candidate architecture (Knowledge Lifecycle spine)
A GPT-Pro-generated alternative organization built on a **Knowledge Lifecycle** spine: **Capture → Understand → Relate → Compose → Specify → Implement → Learn → Evolve → Steward → Interoperate**. This is a *proposal*, not a decision — it maps onto (does not replace) the 10 layers. Includes its own contribution model ("deep intake: one shared thing can become many entries"), Social Signal Scan schema, and full appendix set (source-system card, registry schema, deep-intake template, option/deployment/implementation templates, glossary).

### 5. Structure Options — NEW (13 options + recommendation)
A standalone doc evaluating 13 ways to structure the master doc (Reader-First, System Architecture, Knowledge Lifecycle, Commons Governance, Two-Doc, Living Commons, Operating System, Field Intelligence, Builder Commons, Source-System Atlas, Review-First/CSIS, Journey-Based, Three-Books-in-One). **Recommendation: "Small Core, Large Appendices" with the Knowledge Lifecycle as the architecture spine** + dedicated Tracks / Source Systems / Structural Integrity sections. Sequencing guidance: keep the current draft as the raw architecture layer, add addenda at the end, keep the resource DB separate, create a shorter public orientation, prototype two tracks, review by layer.

### 6. Resource Graph + Source Systems — expanded; DB design corrected
- A **resource database design correction**: separate **Normalized Registry · Source Systems · Options/Mechanisms · Social Signal Scan · Podcast Sources · Podcast Episode Leads · Forum Surfaces · Project Directories** (rather than one flat list). This corresponds to the **"Regen Knowledge Commons Resource Database V3" spreadsheet** (June 13) — see [`data/resources/README.md`](../data/resources/README.md).
- **Social Signal Scan / Twitter-X curation layer** — NEW (retweets are signals, not endorsements; thematic clusters from the X archive).
- **Media source systems / podcast knowledge graph** — NEW (Green Pill, Crypto Altruists, The Blockchain Socialist; podcast sources + episode leads; "media as living field memory").
- **Carbon Copy ReFi projects**, forum/governance archive surfaces, Allo note.

### 7. Contributor Roles & Working Practices — formalized section
Contributor role families; reviewer prompts; "what if someone in a role is incompetent/malicious/biased"; initial contributor/reviewer process; **reward & contribution economy future seed** (contribution records now → possible future reward layers → regenerative obligation). *(Connects to the 2026-06-15 Impact Vault + contribution-governance threads.)*

### 8. Preserved working materials (provenance)
- **Two GPT Handoff Docs** — Matty's deep-conversation context, preserved verbatim (the "two handoff docs" he described on June 15).
- **June 15 meeting notes tab** ("Matt Luiz June 15th" — RegenOS, Coop, tech stack, Heenal V1, source-material expansion) — the raw notes from the [1-on-1 already processed](reports/2026-06-15-toolkit-worksession-matty-integration-report.md).
- **"Better Resources Aggregation"** raw resource/links dump + triage queue.

## What did NOT change
- **The 10-layer architecture** (and therefore the per-layer docs at `docs/layers/` + canvases at `docs/canvases/layers/`). The Knowledge Lifecycle is a *candidate spine offered alongside*, not a replacement. **Do not rebuild the layer docs/canvases on this intake** — the architecture is explicitly mid-decision.
- The **Minimum Operating Kernel**, **18 cross-cutting principles**, **Two-Layer Ontology Posture**, **Core Movement** (Discover→…→Evolve) — carried forward.
- The **Swarm Context** section.

## Implications for the org-os instance
- **No per-layer doc/canvas rebuild this intake** (architecture in transition; Matty recommends layer-by-layer *review*, not rewrite).
- **CSIS posture** (`docs/CSIS.md`) should be revised to "CSIS-Informed, Not CSIS-Conformant" + the 3-level model. *(Queued, not done this intake.)*
- **Theory of Change** is now a first-class master-doc element → worth a derived `docs/` artifact + surfacing the revised problem/mission statement work (2026-05-21 action item) as a tracked thread.
- **Resource DB V3** supersedes the April mechanical lift in `data/resources.yaml` → see staging + integration plan in [`data/resources/README.md`](../data/resources/README.md).
- **Knowledge Lifecycle spine** is a live architectural decision (lifecycle vs 10 layers) → track as a HEARTBEAT/BACKLOG item; do not pre-empt.
- **Three-artifact model** clarifies the site question: the live v1 site (Heenal) is artifact #1; the org-os overlay site needs to converge with it (see convergence plan).

---

_Generated 2026-06-16 as part of the gap-fill + master-doc intake session. See `memory/2026-06-16.md`._
