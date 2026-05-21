---
id: report-2026-05-07-regen-web3-toolkit-planning-call
title: "2026-05-07 Regen Web3 Toolkit Planning Call — Integration Report"
date: 2026-05-07
type: meeting-integration-report
meeting_ref: meeting-20260507-regen-web3-toolkit-planning
source: packages/operations/meetings/260507 Regen Web3 Toolkit Planning Call.md
status: draft
prepared_on: 2026-05-09
---

# 2026-05-07 Regen Web3 Toolkit Planning Call — Integration Report

## 1. Executive Summary

The biweekly that landed **between the 2026-05-06 master-doc iteration intake and Knowledge Commoning Swarm Pulse 1 (2026-05-09–10, starting today)**. The 2026-05-06 rename ("Regen Web3 Toolkit" → "Regen **Knowledge Commons** Toolkit") and 8-layer restructure were not contested by the team — the iteration is treated as the working checkpoint heading into Pulse 1. Beyond that quiet ratification, the call produced **three concrete adoptions** (OrgOS as the team's shared task-management surface, Obsidian Canvas as the visual-architecture-map tool, persona/game format for the next biweekly), surfaced **one new framing tension** (Koi: Toolkit → "Transformational Journeys," pulling against the "Knowledge Commons Toolkit" naming the rename just landed), and **explicitly recognized Bonfires (Caue "Koi" Mtomaz's KOI-stack platform) as both methodological model AND live infrastructure** for the Evolution layer — pulling federation-style integration via the `mcp__regen-koi__*` toolset already running in this instance into scope.

**Critical path through Pulse 1:** (1) Matty closes the master-doc push before Friday noon (Philadelphia wedding hard deadline). (2) Luiz stands up the shared-task-management surface (HEARTBEAT + Task Manager webapp + a short Telegram-able onboarding line), sketches the toolkit-architecture canvas at sketch-level (polished version waits for post-Pulse-1 stability), and joins the OpenCivics planning call same-day for Pulse 1 logistics. (3) Pre-Pulse-1 swarm-pack drafting limited to the two pure-synthesis deliverables: `00-README.md` + `05-tool-option-pattern-protocol-deployment-case.md` + `07-six-affordances-translation.md`.

**Operational debt fixed (registry backfill):** the **260423 biweekly was missing from `data/meetings.yaml`** — the processed meeting note existed at `packages/operations/meetings/260423 Regen Web3 Toolkit Planning Call.md` since the 2026-04-26 vault-bootstrap pass, but the registry entry had been skipped. Backfilled inline with the 260507 add so the registry stays coherent for downstream consumers (`.well-known/meetings.json` regenerates at 7 entries instead of 6).

**Notable identifications applied:**
- **"Koi" = Caue Mtomaz** (`caue.mtomaz@gmail.com`). The body's "Koi advocates…", "Koi proposes…", and "Koi: Develop research framework…" all map to the same person; the Bonfires references + the regen-koi MCP integration this operator already runs make the identification unambiguous. Recorded as `Caue "Koi" Mtomaz` in the participant list.
- **Frame-language and CSIS lenses still active in absentia.** Durgadas was on the email/attendee list but is not visibly quoted in the body; the call did not advance the frame-language companion doc or the CSIS standards-review encoding tasks. They remain on HEARTBEAT carryover.

**Macro signals worth tracking:**
- **Iteration-checkpoint posture is holding.** The 2026-05-06 plan to defer wholesale rename + structural refactor until post-Pulse-1 was validated by the team's lack of churn at the biweekly. Sequencing is sound.
- **The "Knowledge Commons" rename and Koi's "Transformational Journeys" pull in different directions.** Both are framing moves; both are unresolved. Both will be informed by what Swarm Pulse 1 actually surfaces this weekend.
- **Bonfires/regen-koi crosses from "research reference" to "candidate substrate."** The Brazil AI-audit project is the methodology; Bonfires itself (Telegram bot + entity mapping + cross-platform knowledge graph + real-time indexing) is live infrastructure already integrated via MCP. This shifts `04-implementation-memory.md` of the swarm pack from "draft a schema" to "co-author with Koi against an existing substrate."
- **Layer ownership debt is growing, not shrinking.** Tracks dropped (Heenal displaced); Concept & Idea Ecology added (no owner); Implementation Memory + Evolution split (both unowned). The persona/skill-card format adopted for ~2026-05-21 is the team's mechanism for resolving this — not a side discussion.

## 2. Integration changes applied

| File | Change |
|---|---|
| `Zettelkasten/260507 Regen Web3 Toolkit Planning Call.md` | Frontmatter populated (date, projects, all 13 attendees with emails, type, transcript_url, processed_to pointer); `Concluded` → `true`; processed-pointer note added at top of body; raw Granola export preserved |
| `packages/operations/meetings/260507 Regen Web3 Toolkit Planning Call.md` | New synthesized meeting note (8 key decisions, action items by owner, 7-topic discussion summary, next steps) |
| `data/meetings.yaml` | Added `mtg-20260507-regen-web3-toolkit-planning` (7 decisions, 8 action items, 11 tags); **backfilled `mtg-20260423-regen-web3-toolkit-planning`** (was missing despite processed note existing) |
| `.well-known/meetings.json` | Regenerated — 7 entries (was 5; +260507 +260423) |
| `memory/2026-05-07.md` | New file — session log, decisions taken in processing, files-changed manifest, deferred/out-of-scope, next steps |
| `MEMORY.md` | 6 new key-decision entries (2026-05-07 + back-fill of 2026-05-06 from yesterday's intake); Organizational History +2 entries; Active Context refreshed for the pre-/during-/post-Pulse-1 timeline; Bonfires/regen-koi added to Community Ties |
| `HEARTBEAT.md` | 5 new sections (OrgOS Rollout, Visual Architecture, Knowledge Commoning Swarm, Persona/Game-Based Format, Research Framework — Evolution Layer) + targeted updates to existing sections (Master Doc & Handoff, CSIS Integration, Ontology, Resource Graph, Federation, Tool/Option/Pattern/…); footer date bumped 2026-04-26 → 2026-05-07 |
| `docs/plans/master-doc-iteration-may-2026.md` | Phase 1 walk-through marked done; Phase 2 status-update block added (which items addressed today vs deferred); **new Phase 2 reconciliation item — Toolkit vs "Transformational Journeys" framing tension (Koi)** |
| `docs/plans/swarm-contribution-pack.md` | Stream #4 (Implementation Memory) annotated with Bonfires-as-substrate clarification; `## 2026-05-07 biweekly — clarifications` block added (3 structural inputs: Bonfires substrate, framing-tension caveat, persona-card sequencing); Pulse 1 attendance posture noted |
| `docs/plans/QUEUE.md` | Header `Last updated` bumped to 2026-05-07 + "biweekly outcomes" block; Recommended Sequencing rewritten 5 steps → 7 steps (Pulse 1 attendance posture, ~2026-05-21 persona biweekly, framing decision after Pulse 1 + Matty's input) |
| `docs/reports/2026-05-07-regen-web3-toolkit-planning-call-integration-report.md` | This file (creates `docs/reports/` directory in this instance — first integration report for the Toolkit overlay) |

**Not touched this run (intentionally):**
- `IDENTITY.md` ownership table — Heenal's Tracks → ? reassignment is a Phase 2 decision, not yet made.
- `data/ontology/*.yaml` — refactor against new 25 working object types is Phase 3 (post-Pulse-1).
- `data/option-library.yaml` — cross-walk against Tool/Option/Pattern/Protocol/Deployment/Case is Phase 2 input + Phase 3 implementation.
- `data/feedback-process.yaml` — Implementation Memory + Evolution split refactor is Phase 3.
- `docs/canvases/toolkit-architecture.canvas` — sketch-level canvas is on HEARTBEAT, not done in this processing pass.
- `data/members.yaml` — registry remains a stub (only an example block); team-wide DID/identity work hasn't started.
- Vault operator weekly/monthly notes — the operator's own surfaces in `Zettelkasten/` were not updated. The source meeting note's frontmatter is the operator-side anchor. Surface to the operator at `/close` if a per-day distribution is wanted.

## 3. Key decisions

| # | Decision | Rationale | Owner |
|---|---|---|---|
| 1 | Master-doc 2026-05-06 iteration accepted as working checkpoint | First time the doc "feels coherent"; rename + restructure not contested | Matty (lead) + team |
| 2 | OrgOS adopted as the team's shared task-management + contribution-tracking layer | This overlay (`feature/org-os-overlay`) becomes the team's coordination surface. HEARTBEAT.md is the Kanban; `packages/webapps/task-manager/` is the visual board. KOI-bridge is the upgrade path post-refi-dao-Wave-2. | Luiz (set up); team |
| 3 | Obsidian Canvas adopted as visual architecture mapping tool | Demoed live (Barcelona bioregional garden); connects sections + opens markdown pages directly. Sharing limitation acknowledged; web-based canvas remains exploratory. | Luiz (sketch); team |
| 4 | Persona / meta-game format adopted for next biweekly (~2026-05-21) | Granular skill cards over broad specialist titles. Intent: relational positioning over credentials, fun-first design. Mechanism for resolving layer-ownership debt. | All team |
| 5 | Bonfires (KOI stack) recognized as methodological model + live infrastructure for Evolution layer | Brazil AI-audit project = methodology (design science research, multiple tracks per hypothesis, AI-audit data collection). Bonfires platform = substrate (Telegram bot + entity mapping + cross-platform knowledge graph + real-time indexing) — already integrated via `mcp__regen-koi__*`. | Koi (lead); Luiz (federation hook) |
| 6 | Pulse 1 attendance is partial / observation-posture | Matty in Philadelphia wedding (leaves Fri noon); ~half attendees already team; Saturday 1PM-7PM conflicts with prior weekend feedback. Treat as observation + offer-side contribution, not capture. | Team |
| 7 | Toolkit vs "Transformational Journeys" framing tension flagged unresolved | Pulls against the 2026-05-06 "Knowledge Commons Toolkit" rename. Three Koi concerns: (a) "toolkit" reads ambiguously (backpack/inventory/repository); (b) tools imply transactional, goal is relational + continuous learning; (c) navigation between layers is the core feature, more than documentation. **Decision deferred** — informed by Matty's response post-travel + Pulse 1 framing-language observation. | Phase 2 reconciliation — to-do |
| 8 | AI-tooling cost guidance shared (operating principle) | OpenCode Go ($5/$10), DeepSeek v4 flash for cheap research / link-evaluation, DeepSeek Pro for chat + docs, shared-account patterns, LLM gateway concept. Frames cost ceiling for any agent work the toolkit operationalizes. | Team |

## 4. Action items — consolidated tracker

### Pre-Pulse-1 (today + tomorrow, 2026-05-09)
- [ ] **Luiz** — Stand up shared task-management surface: short README pointing to `HEARTBEAT.md` + `packages/webapps/task-manager/`; Telegram-able onboarding line for the planning-call group
- [ ] **Luiz** — Sketch toolkit-architecture canvas at `docs/canvases/toolkit-architecture.canvas` (new 8-layer KCT model — sketch-level only; polished version waits for post-Pulse-1 stability)
- [ ] **Luiz** — Pre-Pulse-1 Swarm Pack drafting: `00-README.md` + `05-tool-option-pattern-protocol-deployment-case.md` + `07-six-affordances-translation.md` (pure synthesis from new master doc, no other-layer dependencies)
- [x] **Luiz** — Join OpenCivics planning call (Pulse 1 logistics) — *2026-05-07, completed*
- [ ] **Matty** — Final master-doc push before Friday noon Philadelphia departure

### During Pulse 1 (2026-05-09–10)
- [ ] **Team** — Attend Pulse 1 (partial attendance acceptable; Matty out)
- [ ] **Operator/team** — Observe Swarm participants' framing language (Toolkit vs Journeys) and gravitation across the 6 functional affordances (Store / Contribute / Find / Govern / Connect / Evolve); capture for Pulse-1-debrief
- [ ] **Operator/team** — Note which Toolkit distinctions Swarm participants actually ask for vs surface as offer (drives v0.1 deliverable list adjustment)

### By next biweekly (~2026-05-21)
- [ ] **All team** — Prepare persona/role concept + granular skill mapping ("I can build a graph") for the persona/game-format session
- [ ] **Luiz** — Operator's own card + a light prompt for team (drop into Telegram a few days before next call)
- [ ] **Koi** — Develop research framework document with hypothesis grounding + prior-work references (umbrella hypothesis + secondary questions + AI-audit methodology)

### Phase 2 reconciliation (carry into ~2026-05-21 + post-Pulse-1)
- [ ] **Heenal + Matt** — Heenal layer reassignment (Tracks dropped → Encyclopedia + learning-path lead, or other?)
- [ ] **Matt (likely)** — Take Concept & Idea Ecology layer ownership (lineage/paradigm/framework adjacency to ontology work)
- [ ] **Team** — Implementation Memory + Evolution: combined caretaker vs two unowned slots? (Koi's research-framework draft partial coverage if Koi takes Evolution)
- [ ] **Durgadas** — Confirm CSIS × org-os Alignment Report covers new master doc's structural-integrity questions ("Who is represented? Who is absent? Who maintains it?") or supplement
- [ ] **Team** — Cross-walk Tool/Option/Pattern/Protocol/Deployment/Case (new 6-tier) against existing `data/option-library.yaml` (9 categories)
- [ ] **Team** — Decide which of new master doc's 25 ontology object types are root types vs tags vs metadata
- [ ] **Team** — Adopt or map the 9 maturity states (`raw`/`to-place`/`draft`/`candidate`/`reviewed`/`field-informed`/`pattern-generating`/`deprecated`/`open question`) against existing `status` fields
- [ ] **Team — Matty (lead)** — Resolve Toolkit vs "Transformational Journeys" framing decision after Pulse 1

### Post-Pulse-1, weeks 1–2 of hackathon
- [ ] **Phase 3 of `master-doc-iteration-may-2026`** — Re-run resources lift; refactor `data/ontology/`; cross-walk `data/option-library.yaml`; re-evaluate `data/feedback-process.yaml` as Implementation Memory + Evolution; update `LAYERS.md`, `IDENTITY.md`, `ORG-OS.md`; root-MD rename pass (~30 files, single coherent commit)
- [ ] **Swarm Contribution Pack** — Draft remaining items 1–4 + 6 (Domain Atlas, Source Systems, Structural Integrity Lens, Implementation Memory **co-authored with Koi**, Anti-Patterns)

### Slow-burn / pending external
- [ ] **Rather** — Invite Ethereum Localism via Telegram (May hackathon)
- [ ] **Luiz** — Confirm Geo Protocol participation; set hackathon date and format
- [ ] **Durgadas** — Encode Dunbar-number scaling + six-directional responsibility model into next CSIS standards review
- [ ] **Brandon** — Curation pass on `data/resources.yaml` (gated on Phase 3 re-lift)
- [ ] **Team** — Triage historic carryovers (Drew Simon knowledge-commons starter links, Afo hub post, Onboarding guides refresh, Safe content integration, ReFi-DAO style guide)

## 5. Follow-ups & open threads

- **Toolkit vs "Transformational Journeys" framing tension** — Koi's critique is genuine and unresolved. The 2026-05-06 rename committed to "Knowledge Commons Toolkit" without anticipating this critique. The honest read: Matty was already in motion on the rename when Koi raised the deeper concern. **Action:** Matty + Koi async after Matty's wedding return; observation during Pulse 1 of Swarm participants' own framing language; team decision before Phase 3 root-MD rename pass (no point doing the rename pass twice).
- **Layer ownership debt** — Tracks dropped (Heenal displaced); Concept & Idea Ecology no owner; Implementation Memory + Evolution unowned. The ~2026-05-21 persona biweekly is the team's mechanism for resolution. If that session under-delivers on ownership, Phase 3 needs a different unblock.
- **Bonfires federation hook** — Tight integration opportunity for Layer 8 via `mcp__regen-koi__*`. Coordinate with Koi: co-author of `04-implementation-memory.md`, attribution arrangement, possible Bonfires entity-mapping export of Toolkit ontology. **Action:** Luiz raises with Koi async this week.
- **CREAF-style STT failure modes** — None caught in this transcript pass, but the Granola export uses curly quotes uniformly and "Luizfernando" as a single string (vs "Luiz Fernando"). Future processing should normalize to the registry naming.
- **Durgadas absent-from-quote but on attendee list** — frame-language companion doc + AI prompts not advanced today. Open thread; not regressing, just not progressing.
- **Hackathon May still in pipeline** — Geo Protocol / Ethereum Localism / Open Civics Consortium outreach was not a focus of this call (Swarm Pulse 1 dominated). Carry forward to next biweekly's persona-game session — possibly a layer-ownership-adjacent allocation question.
- **Operator weekly/monthly note distribution** — refi-bcn-os Phase M pattern (per-day distribution into `Zettelkasten/<weekly note>.md` + thematic block in `<monthly note>.md`) was not executed for the toolkit. This is intentional: toolkit's operator-anchor lives in `memory/2026-05-07.md` already, not in the personal vault calendar. Surface as `/close`-time question if the operator wants it.

## 6. Macro context

- **Sequencing discipline holds.** The 2026-05-06 plan to defer wholesale rename + structural refactor until post-Pulse-1 was validated by the team's lack of churn at the biweekly. Pulse 1 (today + tomorrow) is the next stabilizing event; the structural refactor begins after, against a settled iteration. This is the second consecutive cycle where holding-not-acting was the right call.
- **OrgOS adoption is the punchline of three weeks of overlay work.** 2026-04-23 ratified OrgoS as the consolidation framework. 2026-04-25 landed the overlay on `feature/org-os-overlay`. 2026-04-26 backfilled meeting history and built the structural docs. 2026-05-06 surfaced the master-doc iteration cleanly via the new infrastructure. **2026-05-07 is the moment the team explicitly says: this is our shared task layer.** That arc is the through-line.
- **Bonfires elevation matters more than the bullet count suggests.** The Toolkit had no Layer 8 (Evolution) substrate before today — the layer was conceptual. Bonfires is now a candidate substrate for both methodology AND infrastructure. If the federation hook lands, Layer 8 stops being aspirational. The MCP integration this operator already has makes the development loop tight.
- **Swarm-contribution framing protects against irrelevance.** The new master doc's "may be reused, remixed, simplified, absorbed into shared Swarm outputs, or partially composted" stance is the right posture for an artifact entering an open commons. The team is operating from that posture, not defending the doc as a final product.
- **Framing tension as feature, not bug.** Koi's "Transformational Journeys" critique landing the same week as the "Knowledge Commons Toolkit" rename is awkward but useful — it surfaces a deeper question (tech-product framing vs social-transformation framing) before the rename is locked into 30+ files. Better now than mid-Phase-3.
- **Cost discipline articulated.** Andrea's "well-mapped context + cheaper/open-source models > frontier reliance" framing from 260505 in the BCN context, plus today's OpenCode Go / DeepSeek / shared-account guidance, set a consistent operating principle across both org-os instances this operator runs. Worth surfacing to the framework upstream.

## 7. Verification checklist

- [x] Source note frontmatter fixed (date, projects, attendees, transcript_url, processed_to pointer); `Concluded` → `true`
- [x] Processed meeting note exists at `packages/operations/meetings/260507 Regen Web3 Toolkit Planning Call.md`
- [x] `data/meetings.yaml` has the new entry (`mtg-20260507-regen-web3-toolkit-planning`)
- [x] `data/meetings.yaml` 260423 backfill applied (`mtg-20260423-regen-web3-toolkit-planning`)
- [x] `memory/2026-05-07.md` written (new file, no overwrite)
- [x] `MEMORY.md` Key Decisions + Organizational History + Active Context + Community Ties updated
- [x] `HEARTBEAT.md` has 5 new sections + targeted existing-section updates; footer date bumped
- [x] Plans updated: `master-doc-iteration-may-2026.md` Phase 1 done + Phase 2 status-update + new framing-tension item; `swarm-contribution-pack.md` Bonfires-substrate clarification + biweekly-clarifications block; `QUEUE.md` 7-step recommended sequencing
- [x] Integration report at `docs/reports/2026-05-07-regen-web3-toolkit-planning-call-integration-report.md` (this file; creates the directory)
- [x] `npm run generate:schemas` → meetings.json regenerates 7 entries
- [x] `npm run validate:schemas` → passes (3 pre-existing structural failures + 7 warnings unchanged from before this run; not introduced by today's changes)
- [ ] Toolkit-architecture canvas sketch (HEARTBEAT item; deferred)
- [ ] Operator weekly/monthly note distribution (intentionally skipped — see §5)

## 8. Cross-instance / federation notes

This is a regen-coordination-os peer instance. No Notion DB push/pull deferral applies (toolkit doesn't run Notion as primary task DB). Federation surfaces:

- **Upstream framework** (`org-os-template`) — Last sync: 2026-04-24. Today's adoptions (OrgOS as team task layer, Obsidian Canvas as architecture map, persona/game biweekly format) are instance-level decisions, not framework-level. Worth surfacing upstream if the pattern proves out across instances.
- **Peer instance** (`regen-coordination-os`) — No sync action this run.
- **Bonfires / regen-koi** — New federation hook surfaced today. Not yet wired beyond the `mcp__regen-koi__*` tooling already running. Action: Luiz raises co-authoring + entity-mapping export with Koi async this week.
- **refi-dao-os Wave 2** — KOI-bridge upgrade path for shared task management; no movement this week. Toolkit continues on `meeting-processor` skill + manual HEARTBEAT for now (per existing plan-queue note).

---

_End of report._
