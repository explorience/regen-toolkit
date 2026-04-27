# MEMORY.md — Regen Web3 Toolkit Memory Index

_Lightweight index for persistent project memory. Detailed notes live in `memory/YYYY-MM-DD.md` as dated entries. Update this when key decisions are made._

---

## Quick Index

- **Master doc (source of truth):** `docs/MASTER.md` — the 7,500-line spec driving toolkit development (by Matt)
- **Identity:** `IDENTITY.md`
- **Values:** `SOUL.md`
- **Operator:** `USER.md`
- **Active Tasks:** `HEARTBEAT.md`
- **Session notes:** `memory/`
- **Work log (existing):** `memory/work-log/`
- **Project page:** `packages/operations/projects/regen-web3-toolkit.md`
- **Meeting notes:** `packages/operations/meetings/`
- **Backlog (from master doc):** `docs/BACKLOG.md`
- **CSIS reference:** `docs/CSIS.md` — structural integrity framework (Durgadas)

---

## Key Decisions

- [2026-04-26] **Resources lift (mechanical)** — 738 entries extracted from `MASTER.md` lines 1089–2668 into `data/resources.yaml` via `scripts/lift-resources.mjs`. Layer 1 (Resource Graph) now has a source-of-truth file. Pending Brandon's curation pass.
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

---

## Active Context

- [ongoing] Master-doc iteration — Matt pushing through one more pass before download/reupload + handoff
- [ongoing] Layer ownership — open invitation; Resources tab weakest, needs collaborative session
- [ongoing] Frame-language companion doc + AI prompts (Durgadas)
- [until ~2026-05-end] May hackathon outreach and prep

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
- **Open Civics Consortium** — applications review starting May.
- **Bread Co-op** — forthcoming org-os instance; research/sharing channel as eventual feedback-layer source.

---

_This file is read on every agent session. Keep it current. Write detailed notes to `memory/YYYY-MM-DD.md`._
