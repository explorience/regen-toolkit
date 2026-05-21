---
id: report-2026-05-15-master-doc-iteration-team
title: "2026-05-15 Master Doc Iteration — Team Report"
date: 2026-05-15
type: team-facing-report
audience: planning-call group (Telegram)
status: draft
related:
  - docs/MASTER.md
  - docs/MASTER-DOC-CHANGES-2026-05-15.md
  - docs/plans/master-doc-iteration-may-15-2026.md
  - docs/layers/
  - docs/canvases/layers/
  - docs/canvases/regen-knowledge-commons-toolkit-master.canvas
---

# 🌿 Regen Knowledge Commons Toolkit — 2026-05-15 Iteration Integration

Hey team — quick update on Matty's 2026-05-15 master-doc push and what landed in the overlay repo this week.

## TL;DR

Matty shared a [new master-doc iteration](https://docs.google.com/document/d/1LPLqR51zUvvUDRFm8OqYNBj1LuWkrV-lCFH0YZCvBqg/edit?usp=sharing) on 2026-05-15 — the **stabilization draft** (~24,800 lines, 1.8× the 2026-05-06 doc). Architecture moved from 8 layers to **10 layers** with **Tracks restored** (Layer 7) and **Infrastructure & Substrate added** (Layer 10). I've integrated it into the repo: new canonical MASTER.md, archived the previous, scaffolded per-layer documentation, and built an Obsidian canvas per layer + a master overview canvas — so the architecture is navigable visually for next biweekly.

**Next biweekly (~2026-05-21) is where we resolve layer ownership** against the new 10-layer set using the persona/skill-card format we agreed on at 2026-05-07.

---

## What changed in the master doc

**Layers: 8 → 10.**

| # | Layer | Status vs prior iteration |
|---|---|---|
| 1 | Ontology & Semantic Kernel | Unchanged in position; deeper detail |
| 2 | Knowledge Commons / Encyclopedia | Unchanged; **largest content jump** (14 core knowledge domains, ~5,500 lines) |
| 3 | Resource Graph & Ecosystem Atlas | Unchanged; explicit "preserve before compress" handoff note |
| 4 | Concept & Idea Ecology | Unchanged; 10 core concept clusters + 15 distinctions enumerated |
| 5 | Option Library | Unchanged; 9 categories match existing scaffold |
| 6 | Deployment & Structural Integrity | Unchanged; CSIS reframed as **semantic overlay** (not conformance) |
| 7 | **Tracks & Composition** | ♻ **RESTORED** — was dropped in 2026-05-06. Largest "what was lost" recovery. 10 track candidates fully defined. |
| 8 | Implementation & Learning Memory | Unchanged; 9 record types + Bonfires substrate framing |
| 9 | Evolution Layer | Unchanged; adaptive loop + 10 signal types + 8 failure modes |
| 10 | **Infrastructure & Substrate** | ⭐ **NEW** layer. 12 substrate types compared. |

**Key new conceptual moves:**

- **Minimum Operating Kernel** (v0.1 lens): Resource · Concept · Option · Deployment · Signal — five working objects, enough for one useful contribution without grasping the whole architecture.
- **Core movement:** Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve.
- **18 Cross-Cutting Principles** explicitly enumerated (§4). Four are new this iteration: Anti-Extractive Synthesis · Pattern Humility · Living Systems Health · Compost/Archive/Memory.
- **Two-Layer Ontology Posture:** Octo/BKC interoperable core + Toolkit-specific extensions. Resolves the "do we adopt their ontology or build ours" question.
- **CSIS reframed** from "strict conformance in Deployment" → "CSIS-informed semantic overlay." Durgadas — the existing alignment report needs a posture revision.
- **§16 Backlog (1,820 lines)** consolidated — Frame Language Audit now has explicit master-doc home (§16.8).

**Full diff:** [`docs/MASTER-DOC-CHANGES-2026-05-15.md`](../MASTER-DOC-CHANGES-2026-05-15.md).

---

## What was integrated this week

### 1. Per-layer documentation (10 layer docs)

One doc per layer at [`docs/layers/`](../layers/). Each derives content **from the master doc** (no synthesis ahead of preservation) — purpose, core questions, subsections with line refs, adjacent-layer distinctions, v0.1 recommendations, cross-cutting principles relevant, status, related artifacts. Plus a layer-index `README.md`.

These are the **structured read** entry point. Open the layer doc when you want depth on one layer.

### 2. Per-layer Obsidian canvases (10 layer canvases)

One canvas per layer at [`docs/canvases/layers/`](../canvases/layers/). Each canvas shows the layer's center + boundaries + subsections + adjacent layers + cross-cutting principles + file links to the layer doc, data file, and scripts.

These are the **visual read** entry point. Open in Obsidian to navigate spatially. (Sharing limitation acknowledged — requires local Obsidian; web-based canvas remains the exploratory carryover from prior calls.)

### 3. Master overview canvas

[`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](../canvases/regen-knowledge-commons-toolkit-master.canvas) connects all 10 layers + the core movement + Minimum Operating Kernel + 16 critical distinctions + 18 cross-cutting principles + minimum structural rule + Swarm context + integration-plan pointer.

**Start here.** Open the master canvas to see the whole system; drill into individual layer canvases for depth.

### 4. TODO backlog refreshed + wired into the dashboard

[`docs/BACKLOG.md`](../BACKLOG.md) is the **triaged TODO surface for the overlay**. Refreshed against master doc §16 (was stale on 2026-04-23 line refs + old "Regen Web3 Toolkit" name). It now uses the master doc's own status labels (`raw-note` · `needs-routing` · `needs-owner` · `candidate-integration` · `high-risk` · `compost` etc.) and routing table (§16.12 — "if the item is… → route to…"). Also preserved §16.14 "What to avoid in the next pass" and §16.16 "Suggested AI instruction" as guard-rails for anyone (human or AI) working on the doc.

**Roles:**

| Surface | Scope |
|---|---|
| `HEARTBEAT.md` | In-flight work this cycle |
| `docs/BACKLOG.md` | Triaged + queued + parked items |
| `docs/MASTER.md` §16 | Constitutional read — 1,820 lines of canonical backlog material |
| `docs/plans/QUEUE.md` | Multi-step plans, not single tasks |

**Wired into the dashboard.** `npm run initialize` now surfaces a `Backlog` section with open count + status-label breakdown + top-priority items + pointer to BACKLOG.md. So you see it on every session open.

### 5. Other overlay updates

- **`docs/MASTER.md`** — replaced with 2026-05-15 iteration; previous archived to `docs/archive/MASTER-2026-05-06-knowledge-commons-toolkit.md`
- **`docs/LAYERS.md`** — rewritten against 10-layer model; per-layer status table points to `docs/layers/` and `docs/canvases/layers/`
- **`docs/plans/master-doc-iteration-may-15-2026.md`** — full integration plan, supersedes May 6 plan's Phase 3
- **`HEARTBEAT.md`** + **`MEMORY.md`** + **`docs/plans/QUEUE.md`** + **`MASTERPLAN.md`** + **`CLAUDE.md`** — refreshed; HEARTBEAT vs BACKLOG roles made explicit; BACKLOG added to MEMORY's Quick Index
- **`docs/layers/README.md`** — "How to use these docs" section now routes contributors through BACKLOG for unclear items
- **`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`** — added BACKLOG node + file links to BACKLOG + HEARTBEAT
- **`scripts/initialize.mjs`** — new `loadBacklog()` function + dashboard render section
- **`memory/2026-05-15.md`** — daily session log

**Schemas regenerate clean** (meetings.json + 9 others). Canvas JSON validates.

---

## What I held off (intentionally)

These need **team input** at the next biweekly — they're sequenced post-2026-05-21 in the plan:

- **`data/ontology/*.yaml` refactor** — Two-Layer Ontology Posture decision (Matt + Rather)
- **`data/option-library.yaml` cross-walk** — verify 9-category alignment
- **`data/feedback-process.yaml` split** — L8 + L9 separation; Bonfires substrate (Koi)
- **`data/resources.yaml` re-lift** — gated on `scripts/lift-resources.mjs` refactor to use section anchors (so future iterations don't break the lift)
- **`data/tracks.yaml` new registry** — Tracks layer restored, registry to be created
- **IDENTITY.md ownership refresh** — needs the persona/skill-card session
- **Root-MD rename pass (~30 files)** — "Regen Web3 Toolkit" → "Regen Knowledge Commons Toolkit". The new iteration confirms the rename; ready to execute post-team-review, single coherent commit.
- **ORG-OS.md one-pager rewrite** — against new 10-layer model

---

## Direction(s) to follow

### Before next biweekly (~2026-05-21)

1. **Skim the master overview canvas + your layer's canvas.** They're the fastest read. Open in Obsidian; if you don't use Obsidian, the layer doc is the alternate path.
2. **Identify which layer(s) you want to own or co-steward.** Per 2026-05-07's adopted persona/skill-card format, bring a card naming what you can carry granularly ("I can build a graph"; "I can curate the Tools section"). Layer ownership we need to land:
   - L4 Concept & Idea Ecology — open
   - L7 Tracks & Composition — Heenal (returning?)
   - L8 Implementation & Learning Memory — Koi (Bonfires substrate?)
   - L9 Evolution Layer — Koi (research framework?)
   - L10 Infrastructure & Substrate — Luiz (default)
3. **Read your layer's "v0.1 recommendation"** from the layer doc — that's the realistic scope for the next few weeks, not "complete the layer."
4. **Skim [`docs/BACKLOG.md`](../BACKLOG.md)** for items in your layer. ~27 open items right now. Status labels (`needs-owner`, `needs-review`, `candidate-integration`, `high-risk`) tell you what kind of attention each needs. If you see one you want to pick up, flag it at biweekly and we'll lift it to HEARTBEAT.

### At the biweekly itself

1. **Resolve layer ownership** using the canvases as visual entry point.
2. **CSIS posture revision** — Durgadas, the new iteration reframes CSIS from "strict conformance" to "semantic overlay" (§5.6 + §10.12). The existing CSIS × org-os Alignment Report needs a quick revision to match.
3. **Toolkit vs "Transformational Journeys"** framing tension (Koi raised 2026-05-07) — **not addressed by the new iteration**. The "Knowledge Commons Toolkit" rename is reinforced. We should make a call: keep the rename and absorb Koi's critique into framing copy, or open a deeper rename conversation? *Defer until Matty's back from travel; surface for discussion.*
4. **Pulse 1 retro** — we owe ourselves a quick retro of 2026-05-09–10. What did Swarm participants gravitate toward? What framing language did they use? This feeds the Swarm Contribution Pack v0.1 scope.
5. **Confirm Phase E + Phase F sequencing** (data refactors, lift scripts, registries) — see [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md) §E + §F.

### Following two weeks (post-biweekly)

- **Phase 3 structured refactor** against the new iteration (gated on ownership decisions)
- **Root-MD rename** as a single coherent commit (post-team confirmation)
- **Site IA implications** — separate scope; the live site (regen-toolkit-site.vercel.app, 67 articles, 5 learning paths) still uses the prior structure. Touch only after iteration stabilizes.

### Hackathon mid-point (~week 4)

- Swarm Contribution Pack v0.1 packaged + shared (per [`docs/plans/swarm-contribution-pack.md`](../plans/swarm-contribution-pack.md))

---

## Constraints we should respect

Master doc §16.14 enumerates explicit "do not" rules for the next pass. Worth carrying forward:

- **Don't collapse layers prematurely** — each one earns its place
- **Don't finalize ontology before resources, concepts, and options are populated**
- **Don't treat polished writing as reviewed knowledge** (cross-cut #3)
- **Don't strip frame language** without preserving Frame 1 / Frame 2 / Frame 3
- **Don't declare a pattern from a single case** (cross-cut #12 — Pattern Humility ⭐ NEW)
- **Don't over-engineer infrastructure** before workflows are clear (cross-cut #15)
- **Don't let AI synthesis bypass review** (cross-cut #14)

Plus §16.16's 17-point "Suggested AI instruction" if anyone uses AI to work on the doc — preserved verbatim in `docs/BACKLOG.md`.

---

## Where to find things

- **Master doc:** [`docs/MASTER.md`](../MASTER.md)
- **Diff vs previous:** [`docs/MASTER-DOC-CHANGES-2026-05-15.md`](../MASTER-DOC-CHANGES-2026-05-15.md)
- **Integration plan:** [`docs/plans/master-doc-iteration-may-15-2026.md`](../plans/master-doc-iteration-may-15-2026.md)
- **Per-layer docs:** [`docs/layers/`](../layers/) — start with [`README.md`](../layers/README.md)
- **Per-layer canvases:** [`docs/canvases/layers/`](../canvases/layers/)
- **Master overview canvas:** [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](../canvases/regen-knowledge-commons-toolkit-master.canvas)
- **Layer status table:** [`docs/LAYERS.md`](../LAYERS.md)
- **🆕 TODO Backlog:** [`docs/BACKLOG.md`](../BACKLOG.md) — triaged surface mirroring master doc §16; status labels + routing table; auto-surfaced on dashboard
- **Active tasks (in-flight this cycle):** [`HEARTBEAT.md`](../../HEARTBEAT.md)
- **Plan queue (multi-step plans):** [`docs/plans/QUEUE.md`](../plans/QUEUE.md)

**The three TODO surfaces, in order of read:**

1. **`HEARTBEAT.md`** — what's in flight RIGHT NOW
2. **`docs/BACKLOG.md`** — what's triaged and queued (lift items to HEARTBEAT when picked up)
3. **`docs/MASTER.md` §16** — the constitutional read (1,820 lines of canonical backlog material + the 17-point "Suggested AI instruction" + the 16-point "What to avoid in the next pass")

---

## Telegram-able one-liner

> **2026-05-15 Knowledge Commons Toolkit iteration integrated.** New canonical MASTER.md (24.7k lines, 10 layers — Tracks restored, Infrastructure added). 10 per-layer docs + 10 Obsidian canvases + master overview canvas scaffolded for next biweekly's persona/skill-card session. Open `docs/canvases/regen-knowledge-commons-toolkit-master.canvas` to navigate. TODO surface refreshed at `docs/BACKLOG.md` (mirrors §16, ~27 open items, dashboard auto-surfaces top priority + status counts). Full plan: `docs/plans/master-doc-iteration-may-15-2026.md`. Layer ownership + CSIS posture + Toolkit-vs-Journeys framing are the open team-decisions for ~2026-05-21.

---

_Prepared 2026-05-15. Drift expected; refresh after the next biweekly's ownership decisions land._
