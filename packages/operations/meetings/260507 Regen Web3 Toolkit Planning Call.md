---
id: "meeting-20260507-regen-web3-toolkit-planning"
type: planning
date: "2026-05-07"
title: "Regen Web3 Toolkit Planning Call"
participants:
  - Matty (Mattycompost)
  - Drew Simon
  - Monty Bryant
  - Trinity Morphy
  - Afo
  - Heenal
  - Imaginationhealer
  - Rathermercurial
  - Caue "Koi" Mtomaz
  - TokenJedi
  - Durgadas
  - Civilmonkey
  - Luiz Fernando
projects:
  - "[[regen-web3-toolkit]]"
related:
  - knowledge-commoning-swarm
  - bonfires
  - csis
  - org-os-overlay
signals:
  - master-doc-iteration
  - knowledge-commons-toolkit-rename
  - swarm-pulse-1
  - shared-task-management
  - obsidian-canvas
  - opencode-go
  - bonfires-koi
  - transformational-journeys-vs-toolkit
  - persona-game
  - research-framework
source_file: "260507 Regen Web3 Toolkit Planning Call.md"
transcript_url: "https://notes.granola.ai/t/f40075ea-ffd6-4048-83e1-059aa63a68a5-00demib2"
---

# Regen Web3 Toolkit Planning Call

**Date:** 2026-05-07 (Thursday)
**Type:** Planning (recurring biweekly)
**Next:** Two weeks (~2026-05-21) — but **OpenCivics Swarm Pulse 1** lands in the gap (2026-05-09–10)

## Key Decisions

- **Master doc iteration accepted as the working checkpoint.** Matty's 2026-05-06 iteration (now `docs/MASTER.md`, ~13,700 lines, renamed "Regen Knowledge Commons Toolkit") is "first time the doc feels coherent" — skeleton has meat, but deployment processes + organizational guidance are AI-generated and need human validation; Concept & Idea Ecology requires community input.
- **Swarm Pulse 1 attendance is partial, not full.** Saturday 1PM–7PM format conflicts with weekend feedback; Matty travelling to Philadelphia wedding (leaves Friday noon); ~half the listed attendees are already team. Team treats Pulse 1 as observation/contribution, not capture.
- **OrgOS becomes the team's shared task and contribution-tracking layer.** Adopted explicitly over building a new tracker — Luiz to set up the Kanban pipeline (compile to-dos → allocate among team → execute) using the existing org-os overlay on `feature/org-os-overlay`.
- **Obsidian Canvas adopted as the visual architecture mapping tool.** Demonstrated via Barcelona bioregional garden mapping; canvas connects sections + markdown pages directly; 3D layer visualization (layers as vertical structures) raised as concept; sharing limitation (requires local Obsidian) acknowledged — web-based canvas remains exploratory carryover.
- **Toolkit vs "Transformational Journeys" framing tension surfaced (Koi).** Koi advocates shifting from "toolkit" (static resource collection) to "transformational journeys" (continuous learning process). Not resolved — flagged as Phase 2 reconciliation item alongside the Knowledge Commons Toolkit rename. Tension sits at: technical-product framing vs social-transformation framing; deliverables vs experiences.
- **Persona / meta-game approach adopted for next planning call.** Team members will arrive with role/persona concepts mapping concrete granular skills ("I can build a graph," "I can create pitch decks") rather than broad specialist positioning. Intent: encourage relational positioning over credentials, keep design process playful.
- **Bonfires (Koi's KOI-stack platform) recognized as methodological model for the Evolution layer.** Brazil Bonfires AI audit project (smart farming automation impact on rural communities) demoed: design science research where participants are study subjects, multiple tracks each testing a hypothesis, data collection via AI auditing (NotebookLM, GPT, Bonfires). Plus live Bonfires demo: Telegram bot, entity mapping (user/project/general), cross-platform knowledge graph (Discord/Telegram/etc.), real-time indexing. Suggests umbrella research hypothesis + secondary questions structure for the evolution layer.
- **AI tooling cost guidance shared.** OpenCode Go ($5 first month / $10 ongoing, includes Kimi k2.5/k2.6 and similar OSS-tuned models; workspaces allow multiple introductory cycles); DeepSeek v4 flash for cheap research/link evaluation, DeepSeek Pro for chat + documentation; Brazil-team practice of shared GPT account with single Google login; LLM gateway suggested for unified account management. Feynman research agent skills shared as additional resource.

## Action Items

### Luiz Fernando (operator)
- [ ] **Process current meeting notes + previous meeting documentation** (this very task — covers 2026-05-07 + reconciles 2026-04-23 backfill into `data/meetings.yaml`)
- [ ] **Update overlay repo with latest Google Doc developments** — done 2026-05-06 (master doc iteration intake) + ongoing during Phase 3 of `master-doc-iteration-may-2026`
- [ ] **Create Obsidian Canvas visual representation of toolkit architecture** — new deliverable. Reference: Barcelona bioregional garden canvas pattern. Land at `docs/canvases/toolkit-architecture.canvas` (alongside existing canvases). Include 8-layer structure (new Knowledge Commons Toolkit model: Ontology → Encyclopedia → Resource Graph & Atlas → Concept & Idea Ecology → Option Library → Deployment & Structural Integrity → Implementation Memory → Evolution + Cross-Cutting Systems peer concept).
- [ ] **Set up shared to-do / Kanban system for team coordination** — use `HEARTBEAT.md` + `data/tasks.yaml` + the org-os Task Manager webapp (`packages/webapps/task-manager/`). Surface to team at next biweekly with onboarding path.
- [ ] **Join OpenCivics planning call** (scheduled few hours post-meeting today — 2026-05-07) for additional Pulse 1 details.

### Matty
- [ ] **Complete final document update push before swarm participation** (carryover from 2026-04-23 — reaffirmed today; constrained by Friday noon Philadelphia departure)

### Koi (Caue Mtomaz)
- [ ] **Develop research framework document with hypothesis grounding and prior work references** — for the Evolution layer. Pattern modeled on Brazil Bonfires AI audit project: umbrella hypothesis + secondary questions + methodology + AI-audit data collection.

### All team members
- [ ] **Prepare persona/role concepts + granular skill mapping for the next planning call's game-based session** (target: ~2026-05-21 biweekly)
- [ ] **Attend OpenCivics Knowledge Commons Swarm Pulse 1 (2026-05-09–10)** for external input + collaborative opportunities (partial attendance acceptable; Matty out)

## Discussion Summary

### Master Doc Status (Matty)

Matty's framing: the 2026-05-06 iteration is the "first time the document feels coherent." Skeleton structure now has natural fill-in ("meat and potatoes"). Architecture tab (~14 pages) added as core reference; cross-cutting systems and resource graph components are defined; infrastructure/interoperability tab (KOI / GeoBrowser focus) is new. Option library and Deployment & Structural Integrity tabs are present but less mature. **AI-generated content dominates deployment processes and organizational guidance** — implementation details need human validation. **Concept & Idea Ecology requires community input.** Persistent uncertainty: practical utility vs theoretical framework. (Reconciles with `docs/MASTER-DOC-CHANGES.md` from 2026-05-06.)

### Knowledge Commons Swarm Pulse 1 Logistics

Multiple conflicts surfaced:
- **Saturday 1PM–7PM** conflicts with prior community feedback that weekends don't work
- **Matty unavailable** — Philadelphia wedding, leaves Friday noon
- **June 12–13 follow-up** also Friday–Saturday
- ~half of swarm attendee list is already current team; remainder largely known to group — **questions about whether this limits fresh-perspective opportunities**
- Format unclear: kickoff vs full collaborative session; breakout streams vs continuous group work

OpenCivics planning call later today expected to clarify. Team's posture: attend for observation + offer-side contribution; do not over-invest given the iteration is itself a checkpoint.

### Technical Implementation & Workflow (Luiz)

Luiz proposed using **OrgOS as the team's shared task management system** — leverages existing overlay on `feature/org-os-overlay`. Process: compile to-dos → allocate among team → execute through Kanban pipeline. The "working notes" tab in the master doc exists but lacks functionality.

**Obsidian Canvas demoed for visual architecture mapping** — Barcelona bioregional garden as worked example. Canvas connects thoughts/sections + opens linked markdown pages directly. Discussed 3D layer visualization (layers as actual vertical structures). Acknowledged sharing limitation (requires local Obsidian + file access) — historic carryover for "web-based canvas visualization (no Obsidian required)" remains in HEARTBEAT.

### AI Tools & Cost Management

Shared as practical team-tooling guidance:
- **OpenCode Go** — $5 first month / $10 ongoing; bundles Kimi k2.5/k2.6 and similar OSS-tuned models; multi-workspace creation enables multiple introductory cycles
- **DeepSeek v4 flash** — cheapest credible research / link-evaluation tier
- **DeepSeek Pro** — best for chat consistency + documentation writing
- **Brazil team pattern**: shared GPT account behind single Google login (parent-onboarding model); LLM gateway suggested for unified billing across accounts
- **Feynman research agent skills** referenced as additional shared resource

### Bonfires + Research Framework (Koi)

Koi (Caue Mtomaz) demoed the **Brazil Bonfires AI audit project** as both methodological model and live infrastructure:

**Methodology** — design science research where participants are simultaneously study subjects. Domain: smart farming automation impact on rural communities and inequality. Structure: multiple research tracks, each addressing a specific hypothesis. Data collection via AI auditing (NotebookLM, GPT, Bonfires). Suggests the **Evolution layer** of the Toolkit needs:
- An umbrella research hypothesis with secondary questions
- Methodology + hypothesis-testing substrate
- Priority knowledge + references to ground hypotheses (current "open questions" tab lacks this)

**Bonfires platform capabilities** —
- Telegram bot integration for community support + knowledge graph updates
- Entity mapping (user / project / general entity categorization)
- Cross-platform connectivity (Discord, Telegram, others) feeding a unified knowledge graph
- Real-time project indexing + search

This is the **regen-koi** stack the operator is already integrated with via MCP (`mcp__regen-koi__*` tools). Suggests a tight federation opportunity for the Toolkit's Layer 8.

### Toolkit vs Transformational Journeys (Koi)

Koi raised a foundational naming/framing tension: **"toolkit"** implies a static collection of resources; **"transformational journeys"** centers ongoing adaptation and evolution. Three concerns:

1. **Conceptual clarity** — "toolkit" reads as backpack/inventory, knowledge repository, OR system depending on the listener; deliverables become misaligned.
2. **Tech vs social product** — tools imply transactional interactions; the actual goal is relational, with continuous learning and adaptation embedded.
3. **Navigation as core feature** — between layers, more than comprehensive documentation.

Note: this lands during the 2026-05-06 master doc iteration that already renamed the project to "Regen **Knowledge Commons** Toolkit" — Koi's critique pulls in a different direction ("journeys" rather than "commons"). Not resolved on call. **Folded as Phase 2 reconciliation item** in `master-doc-iteration-may-2026`.

### Persona / Meta-Game (Koi)

Proposal for next planning call's structure: team members arrive having declared roles/personas with specific skills + capabilities. Granular skill mapping ("I can build a graph," "I can create pitch decks") rather than broad specialist positioning. Philosophy:

- **Building something fun requires having fun during design.** Brazil community used as example of creative energy and project proliferation.
- **Avoid over-structuring** that kills creativity and accessibility.
- **Relational positioning over professional credentials** — collaborators, not specialists. Create experiences within tracks rather than information delivery.

Adopted as next-meeting structure.

## Next Steps

- **2026-05-07 (today, later):** Luiz on the OpenCivics planning call for Pulse 1 logistics
- **2026-05-09–10:** OpenCivics Swarm Pulse 1 (partial team attendance — observation posture; Matty in Philadelphia)
- **~2026-05-21:** Next planning call — **persona / meta-game format**; team brings role/skill cards
- **Pre-Pulse-1 (this week):** Matty closes the master-doc iteration push. Luiz drafts the Obsidian Canvas (toolkit architecture) and stands up the shared-task-management surface (`HEARTBEAT.md` + Task Manager webapp + brief team-onboarding note).
- **Post-Pulse-1:** Phase 3 of `master-doc-iteration-may-2026` (resources re-lift; ontology / option-library / feedback-process refactor; LAYERS / IDENTITY / one-pager updates; root-MD rename pass).
- **Open carryovers:** Hackathon (May) outreach (Geo Protocol, Ethereum Localism, Open Civics Consortium); historic 260212/260225/260312 action-item triage; "transformational journeys" framing decision (Phase 2 reconciliation).

## Source

- **Source file:** `Zettelkasten/260507 Regen Web3 Toolkit Planning Call.md` (raw Granola export with frontmatter fixed)
- **Transcript:** https://notes.granola.ai/t/f40075ea-ffd6-4048-83e1-059aa63a68a5-00demib2
