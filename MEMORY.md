# MEMORY.md — Regen Web3 Toolkit Memory Index

_Lightweight index for persistent project memory. Detailed notes live in `memory/YYYY-MM-DD.md` as dated entries. Update this when key decisions are made._

---

## Quick Index

- **Master doc (source of truth):** `docs/MASTER.md` — the 7,500-line spec driving toolkit development (by Matt)
- **Identity:** `IDENTITY.md`
- **Values:** `SOUL.md`
- **Operator:** `USER.md`
- **Active Tasks:** `HEARTBEAT.md` (this cycle's in-flight work)
- **Triaged TODO Backlog:** `docs/BACKLOG.md` (mirrors master doc §16 — status labels + routing table; refreshed 2026-05-15)
- **Session notes:** `memory/`
- **Work log (existing):** `memory/work-log/`
- **Project page:** `packages/operations/projects/regen-web3-toolkit.md`
- **Meeting notes:** `packages/operations/meetings/`
- **Per-layer docs:** `docs/layers/` (one doc per layer, 1–10)
- **Per-layer canvases:** `docs/canvases/layers/` (Obsidian Canvas)
- **Master overview canvas:** `docs/canvases/regen-knowledge-commons-toolkit-master.canvas`
- **CSIS reference:** `docs/CSIS.md` — structural integrity framework (Durgadas)

---

## Key Decisions

- [2026-05-15] **Master doc 2026-05-15 stabilization draft accepted as canonical** — Matty's second iteration in 9 days. ~24,776 lines (1.8× the 2026-05-06 doc). **Layer count 8 → 10**: Tracks restored (Layer 7); Infrastructure & Substrate added (Layer 10). 18 cross-cutting principles enumerated (4 new: Anti-Extractive Synthesis, Pattern Humility, Living Systems Health, Compost/Archive/Memory). Minimum Operating Kernel (Resource · Concept · Option · Deployment · Signal) introduced as v0.1 lens. CSIS reframed from "conformance" to "semantic overlay." See [`docs/MASTER-DOC-CHANGES-2026-05-15.md`](docs/MASTER-DOC-CHANGES-2026-05-15.md). Previous iteration archived at [`docs/archive/MASTER-2026-05-06-knowledge-commons-toolkit.md`](docs/archive/MASTER-2026-05-06-knowledge-commons-toolkit.md).
- [2026-05-15] **Per-layer documentation + canvas-per-layer structure established** — 10 layer docs at [`docs/layers/`](docs/layers/), 10 layer canvases at [`docs/canvases/layers/`](docs/canvases/layers/), master overview canvas at [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](docs/canvases/regen-knowledge-commons-toolkit-master.canvas). Operator commitment from 2026-05-07 biweekly (Obsidian Canvas as visual architecture map) operationalized. Each layer doc derives from master doc — no synthesis ahead of preservation.
- [2026-05-07] **OrgOS adopted as the team's shared task management + contribution-tracking layer** — the existing org-os overlay on `feature/org-os-overlay` becomes the team's coordination surface. Process: compile to-dos → allocate among team → execute through Kanban pipeline. `HEARTBEAT.md` + `packages/webapps/task-manager/` are the working surface; KOI-bridge is the upgrade path once refi-dao Wave 2 ships.
- [2026-05-07] **Obsidian Canvas adopted as visual architecture mapping tool** — Barcelona bioregional garden as the worked example. Demoed live during the 2026-05-07 biweekly. Sharing limitation acknowledged (requires local Obsidian); web-based canvas remains exploratory carryover.
- [2026-05-07] **Persona / meta-game format adopted for next planning call (~2026-05-21)** — granular skill cards ("I can build a graph") over broad specialist titles. Intent: relational positioning over credentials, fun-first design philosophy.
- [2026-05-07] **Toolkit vs "Transformational Journeys" framing tension surfaced (Koi)** — pulls in different direction from the 2026-05-06 "Knowledge Commons Toolkit" rename. Not resolved on call. Folded into `master-doc-iteration-may-2026` Phase 2 reconciliation.
- [2026-05-07] **Bonfires (KOI stack, Brazil) recognized as methodological model + live infrastructure for the Evolution layer** — Caue Mtomaz ("Koi") demoed: design science research where participants are study subjects, multiple tracks per hypothesis, AI-audit data collection (NotebookLM, GPT, Bonfires), Telegram bot + entity mapping + cross-platform knowledge graph. Tight integration opportunity via the `mcp__regen-koi__*` toolset already running in this instance.
- [2026-05-06] **Master doc 2026-05-06 iteration is the working checkpoint** — replaced canonical `docs/MASTER.md` (now ~13.7k lines, renamed "Regen **Knowledge Commons** Toolkit"); previous saved at `docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`. Wholesale overlay rename + structural refactor sequenced post-Pulse-1 (`master-doc-iteration-may-2026.md`).
- [2026-04-26] **Resources lift (mechanical)** — 738 entries extracted from `MASTER.md` lines 1089–2668 into `data/resources.yaml` via `scripts/lift-resources.mjs`. Layer 1 (Resource Graph) now has a source-of-truth file. Pending Brandon's curation pass. *Note: re-lift against new MASTER.md scheduled for Phase 3.*
- [2026-04-24] **Org-os overlay landed** — toolkit now operates as its own org-os instance, co-located with the master doc. Framework sourced from upstream/main of `regen-coordination/org-os-template` (v3.0). See commit on `feature/org-os-overlay`.
- [2026-04-23] **Master doc handoff phase** — Matt one push from completing current iteration, then team takes ownership of individual layers. Resources tab weakest; dedicated organization session TBD.
- [2026-04-23] **Rather's ontology adopted as standard** for the toolkit ontology layer.
- [2026-04-23] **CSIS ↔ OrgoS alignment confirmed** — CSIS strict in Deployment layer, secondary in Feedback. Compatibility was the basis for bringing org-os in.
- [2026-04-23] **Frame language critique integrated** (Durgadas) — current docs use Frame 1 (extractive/hierarchical) language to describe regenerative processes. Next iteration to apply frame-language decomposition (Frame 3 → 2 → 1 with a ladder back up).
- [2026-04-23] **May hackathon target communities:** Geo Protocol (geobrowser.io — confirmed interest), Ethereum Localism (via Rather's Telegram outreach), Open Civics Consortium (Luiz to join chat).
- [2026-03-27] **Astro/Starlight site deployed** at regen-toolkit-site.vercel.app; 67 articles live out of 254-article inventory.

---

## Organizational History

- **[2026-01-15]** Project kickoff (Greenpill Toolkit Planning Call) — biweekly cadence established. Initial team: Matt, Trinity, Heenal, Monty, Luiz. Three target audiences agreed (university/governance education; communities needing onboarding e.g. Somaliland project; normie nonprofits). Built on prior Local ReFi Toolkit work from ReFi DAO.
- **[2026-01-29]** GitHub workflow established. 229 article placeholders created, tagged, prioritized into Tier 1/2 by audience overlap. Custom front-end planned for non-technical navigation.
- **[2026-02-12]** Content development workflow ratified — AI-assisted drafting, GitHub branch strategy, Artisan funding application planning.
- **[2026-02-14]** February consolidated action items report (`Zettelkasten/260214 February Meetings Action Items Report.md`) — 25+ actions for Luiz across ReFi BCN, ReFi DAO, Regen Coordination, and the toolkit; major themes captured.
- **[2026-02-25]** Restructure decision: tag-based architecture replaces track-based. 10 modules proposed. Rather's ontology entered the picture as a candidate standard. AI pipeline 5-stage live with 5 pilot articles.
- **[2026-03-12]** Artisan funding application strategy: single Region Coordination profile covering toolkit + knowledge gardening. AI pipeline hit blockers (broken + credit issues). Co-op browser extension idea floated by Luiz (foreshadows Coop PL Genesis).
- **[2026-03-26]** Astro/Starlight site migrated into monorepo (PR #304). 67 articles published out of 254-article inventory; 5 learning paths live.
- **[2026-04-23]** Frame-language critique introduced (Durgadas). Master doc handoff phase begins. CSIS × org-os alignment posture established. May hackathon target communities locked in.
- **[2026-04-25]** Org-os overlay landed on `feature/org-os-overlay` branch. Toolkit operates as its own org-os instance, co-located with master doc, structured registries, agent skills.
- **[2026-04-26]** Meeting history bootstrapped from personal vault into `packages/operations/meetings/`.
- **[2026-05-06]** Master doc 2026-05-06 iteration intake: rename to "Regen Knowledge Commons Toolkit", layer set restructured (Tracks dropped, Concept & Idea Ecology added, Implementation Memory + Evolution split, Ontology promoted to Layer 1), Knowledge Commoning Swarm reframing introduced. Wholesale rename refactor sequenced for post-Pulse-1.
- **[2026-05-07]** Biweekly planning call: OrgOS adopted as shared task management; Obsidian Canvas adopted as visual architecture map; persona/game format adopted for next call; Bonfires (KOI stack) recognized as Evolution-layer methodological model; Toolkit vs Transformational Journeys framing tension surfaced.
- **[2026-05-09–10]** OpenCivics Knowledge Commoning Swarm Pulse 1 (partial team attendance — Matty in Philadelphia). Retro still owed.
- **[2026-05-15]** Master doc 2026-05-15 stabilization draft landed. 10-layer architecture (Tracks restored, Infrastructure added). 18 cross-cutting principles. Per-layer documentation + Obsidian canvas-per-layer structure established. Phase 3 structured refactor sequenced post-2026-05-21 biweekly.

---

## Active Context

- [this week 2026-05-15+] Phase E + Phase F of `master-doc-iteration-may-15-2026` — `data/ontology/` + `data/option-library.yaml` + `data/feedback-process.yaml` refactor; `data/tracks.yaml` creation; new `scripts/lift-*.mjs` per layer; root-MD rename pass; IDENTITY.md + ORG-OS.md updates
- [~2026-05-21 biweekly] Persona / meta-game format — team brings role/skill cards. **Surface 10-layer canvases as visual entry point. Resolve layer ownership** against new candidates (Koi for L8 + L9; Matt for L4; Heenal returning to L7).
- [owed] Pulse 1 retro (2026-05-09–10) — feeds Swarm Contribution Pack v0.1 scope adjustment + Toolkit-vs-Journeys framing decision
- [ongoing] Layer ownership debt — Heenal returns to L7 Tracks (restored); Koi candidate for L8 + L9; Matt candidate for L4 Concept & Idea Ecology; L10 Infrastructure default to Luiz
- [ongoing] Frame-language audit (Durgadas) — now has dedicated home at master doc §16.8 (Backlog) + architectural home at L4
- [ongoing] Toolkit vs "Transformational Journeys" framing tension (Koi) — *not addressed by 2026-05-15 iteration*; surface to Matty + Koi async; observe Pulse 1 framing language
- [ongoing] Brandon's curation pass on `data/resources.yaml` — gated on Phase 3 re-lift completion
- [until ~2026-05-end] May hackathon outreach and prep — Pulse 1 + 2-month hackathon now overlapping

---

## Relationship Map

### Network & Peers
- **Regen Coordination Network** — parent network; toolkit is a project node.
- **regen-coordination-os** — peer instance (canonical trust); coordinates the broader network hub.
- **ReFi BCN** — local chapter / origin of some toolkit contributors (Luiz).

### Upstream
- **org-os-template** (`github.com/regen-coordination/org-os-template`) — framework source; overlay target.

### Community Ties
- **Geo Protocol** (geobrowser.io) — knowledge-focused web3 project; confirmed interest in hackathon.
- **Ethereum Localism** — target community for hackathon invite via Rather.
- **Open Civics Consortium** — Knowledge Commoning Swarm host; Pulse 1 on 2026-05-09–10; applications review starting May.
- **Bread Co-op** — forthcoming org-os instance; research/sharing channel as eventual feedback-layer source.
- **Bonfires / regen-koi** (Caue "Koi" Mtomaz, Brazil) — KOI stack: Telegram bot + entity mapping + cross-platform knowledge graph; demoed 2026-05-07 as methodological model for Evolution layer. Already integrated via `mcp__regen-koi__*` toolset.

---

_This file is read on every agent session. Keep it current. Write detailed notes to `memory/YYYY-MM-DD.md`._
