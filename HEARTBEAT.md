# HEARTBEAT.md — Regen Web3 Toolkit Active Tasks

_A living checklist of active coordination tasks. Agents consult this on every session. Update regularly — mark done, add new, remove stale._

> **HEARTBEAT vs BACKLOG.** HEARTBEAT = active work for THIS cycle (in-flight + this-week). [`docs/BACKLOG.md`](docs/BACKLOG.md) = the triaged TODO surface (mirrors master doc §16, with status labels: `raw-note` · `needs-routing` · `needs-owner` · `candidate-integration` · `high-risk` · etc.). When an item gets picked up for active work, lift it from BACKLOG → HEARTBEAT. When something gets parked, push it down.

> **2026-05-15 iteration checkpoint.** Master doc updated to 2026-05-15 stabilization draft (10 layers; Tracks restored, Infrastructure added). Per-layer docs at [`docs/layers/`](docs/layers/); per-layer canvases at [`docs/canvases/layers/`](docs/canvases/layers/); master overview canvas at [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](docs/canvases/regen-knowledge-commons-toolkit-master.canvas). Phase 3 refactor plan: [`docs/plans/master-doc-iteration-may-15-2026.md`](docs/plans/master-doc-iteration-may-15-2026.md).

---

## Active Tasks

### Master Doc 2026-05-15 Iteration _(NEW)_

- [ ] **Surface master overview canvas + per-layer canvases to team** via Telegram (Luiz — pre-2026-05-21 biweekly)
- [ ] **Layer ownership resolution** at ~2026-05-21 biweekly's persona/skill-card session:
  - L4 Concept & Idea Ecology — Matt (likely)
  - L7 Tracks & Composition — Heenal (returning; was Heenal pre-2026-05-06 drop)
  - L8 Implementation & Learning Memory — Koi (candidate; Bonfires substrate)
  - L9 Evolution Layer — Koi (candidate)
  - L10 Infrastructure & Substrate — Luiz (operator default)
- [ ] **Phase E.1 (`data/ontology/*.yaml` refactor)** — coordinate with Matt + Rather (post-2026-05-21)
- [ ] **Phase E.2 (`data/option-library.yaml` cross-walk)** — verify 9 categories align with new §9
- [ ] **Phase E.3 (`data/feedback-process.yaml` split)** — co-author with Koi for Bonfires substrate reference
- [ ] **Phase E.4 (`data/resources.yaml` re-lift)** — refactor `scripts/lift-resources.mjs` to use section anchors (iteration-stable); then re-lift against new §7
- [ ] **Phase E.6 (IDENTITY.md ownership refresh)** — post-2026-05-21 biweekly
- [ ] **Phase E.7 (ORG-OS.md one-pager rewrite)** — against 10-layer model + new core movement
- [ ] **Phase E.8 (Root-MD rename pass, ~30 files)** — single coherent commit, post-team-review
- [ ] **Phase F.1–F.4 (New lift scripts)** — `lift-options.mjs`, `lift-tracks.mjs`, `lift-concepts.mjs` + refactor `lift-resources.mjs`
- [ ] **Phase F.5 (`data/tracks.yaml` registry)** — new file (Tracks layer restored)
- [ ] **Pulse 1 retro** — write to `memory/2026-05-10.md` (still owed)

### Master Doc & Handoff
- [ ] Matty — final master-doc push before Swarm participation (Friday noon hard deadline; Philadelphia wedding travel) — *carryover from 2026-04-23, reaffirmed 2026-05-07*
- [ ] Coordinate handoff — announce to team when the download/reupload is happening (avoid concurrent edits)
- [ ] Apply frame-language critique to master doc sections (Durgadas — next iteration)
- [ ] Resources tab (weakest layer) — dedicated collaborative organization session, timing TBD
- [ ] Team — individual layer ownership declarations (open invitation; see `IDENTITY.md` for current state — Tracks layer dropped in 2026-05-06 iteration; Heenal's ownership needs reassignment, Concept & Idea Ecology needs an owner)

### OrgOS Rollout — shared task management _(NEW 2026-05-07)_

Team adopted OrgOS (the existing org-os overlay on `feature/org-os-overlay`) as the team's shared task / contribution-tracking layer. Process: compile to-dos → allocate among team → execute through Kanban pipeline.

- [ ] **Luiz — stand up the shared task management surface.** Write a short onboarding note pointing team to `HEARTBEAT.md` + `packages/webapps/task-manager/` (Task Manager visual board); send to Telegram group.
- [ ] Add per-task owner field to `HEARTBEAT.md` items where missing (so Task Manager surfaces ownership cleanly)
- [ ] Decide: Task Manager web app vs upgrading to KOI-bridge once refi-dao Wave 2 ships

### Visual Architecture — Obsidian Canvas _(NEW 2026-05-07)_

Team adopted Obsidian Canvas as visual architecture mapping tool (Barcelona bioregional garden as worked example). Sharing limitation acknowledged (requires local Obsidian); web-based canvas remains exploratory carryover from 260212.

- [ ] **Luiz — sketch the toolkit architecture canvas** (new 8-layer Knowledge Commons Toolkit model: Ontology → Encyclopedia → Resource Graph & Atlas → Concept & Idea Ecology → Option Library → Deployment & Structural Integrity → Implementation Memory → Evolution + Cross-Cutting Systems). Land at `docs/canvases/toolkit-architecture.canvas`. Sketch-level pre-Pulse-1; polished version post-Pulse-1 once iteration stabilizes.
- [ ] Update outdated canvases (architecture / content structure / development workflow / master overview) — historic carryover from 260212; align with new master doc structure as part of Phase 3
- [ ] Web-based canvas visualization (no Obsidian required) — exploratory (raised 260212; still open)

### Knowledge Commoning Swarm _(NEW 2026-05-07)_

Pulse 1: 2026-05-09–10. Two-month hackathon follows. Toolkit reframed as a *contribution artifact* in the new master doc.

- [ ] **Luiz — join OpenCivics planning call** (today, post-biweekly — 2026-05-07) for Pulse 1 logistics
- [ ] Team — attend Pulse 1 (partial attendance acceptable; Matty out for Philadelphia wedding)
- [ ] Pre-Pulse-1: draft `00-README.md` + `05-tool-option-pattern-protocol-deployment-case.md` + `07-six-affordances-translation.md` for the Swarm Contribution Pack v0.1 (pure synthesis from new master doc)
- [ ] Pulse 1: observe what Swarm participants gravitate toward; adjust Swarm Contribution Pack v0.1 scope
- [ ] **Resolve Toolkit vs "Transformational Journeys" framing tension** (Koi raised 2026-05-07; pulls in different direction from "Knowledge Commons Toolkit" rename — Phase 2 reconciliation)

### Persona / Game-Based Format _(NEW 2026-05-07)_

Next planning call (~2026-05-21) restructured around persona/role cards + granular skill mapping. All team members bring a card.

- [ ] **All team — prepare persona/role concept + granular skill mapping** for ~2026-05-21 biweekly
- [ ] Luiz — operator's own card + a light prompt for team (drop into Telegram a few days before next call)

### Research Framework — Evolution Layer _(NEW 2026-05-07)_

- [ ] **Koi — develop research framework document** (umbrella hypothesis + secondary questions + methodology + AI-audit data collection — modeled on Brazil Bonfires AI audit project)
- [ ] Cross-reference Bonfires (KOI stack) federation hook with `swarm-contribution-pack.md` Layer 7+8 deliverables — entity mapping (user/project/general) + cross-platform knowledge graph (Discord/Telegram) suggests a tight integration opportunity

### Knowledge Site (Layer 2 — Encyclopedia)
- [ ] Apply Matt's feedback on 4 articles: scams, seed phrases, wallet comparison, key terms (Heenal)
- [ ] Phase 2 — expand 43 medium articles through the 5-stage editorial pipeline
- [ ] Human review of all 67 published drafts
- [ ] Add real-world examples from approved source maps (Restor, Hylo, P2P Foundation, ReFi Ecosystem, Weavers, Second Renaissance)

### CSIS Integration (Layer 5/6 — Deployment & Structural Integrity)
- [ ] Encode Dunbar-number scaling research into next CSIS standards review (Durgadas)
- [ ] Encode six-directional responsibility model into next CSIS standards review (Durgadas)
- [ ] Make compressive vs generative standards explicit in Deployment Layer
- [ ] Define conformance posture (partial adoption vs full conformance) assessment framework
- [ ] Confirm whether existing CSIS × org-os Alignment Report covers new master doc's structural-integrity questions ("Who is represented? Who is absent? Who maintains it? Who may be exposed by visibility?") or needs supplementing (Durgadas — Phase 2)

### Hackathon — May (cross-layer)
- [ ] Invite Ethereum Localism folks via Telegram (Rather)
- [ ] Join Open Civics Consortium chat via website; coordinate hackathon invite (Luiz)
- [ ] Confirm Geo Protocol participation and format
- [ ] Set the hackathon date and format (knowledge-swarming hack)

### Ontology (now Layer 1 in new master doc — promoted from Layer 3)
- [ ] Formalize Rather's ontology as toolkit standard (adopt and propagate through metadata)
- [ ] Resolve V1 vs V2a vs V2b — implement doc recommendation (V1 base + V2b overlay)
- [ ] Reconcile new master doc's 25 working ontology object types with existing `data/ontology/*.yaml` (Phase 2 reconciliation)
- [ ] Adopt or map new master doc's 9 maturity states (`raw`, `to-place`, `draft`, `candidate`, `reviewed`, `field-informed`, `pattern-generating`, `deprecated`, `open question`) against existing `status` fields (Phase 2)

### Resource Graph (now Layer 3 — Resource Graph & Ecosystem Atlas)
- [x] Lift the 11+ domain URL lists from master doc into structured `data/resources.yaml` (mechanical pass — 2026-04-26; 738 entries, 285 URL-bearing, 50 domains)
- [ ] **Brandon — curation pass on `data/resources.yaml`** (dedupe, drop tag-as-resource bullets, fill URLs, classify)
- [ ] Re-run `scripts/lift-resources.mjs` against new `docs/MASTER.md` (Phase 3 — post-Pulse-1; idempotent — verify line ranges first)
- [ ] Clarify taxonomy vs ontology distinction (master doc line 181 flag)

### Tool / Option / Pattern / Protocol / Deployment / Case _(NEW 2026-05-07 master-doc-derived)_
- [ ] Cross-walk new master doc's 6-tier vocabulary against existing `data/option-library.yaml` 9-category scaffold (Phase 2 reconciliation)

### Historic carryovers (from backfilled meetings — needs team triage)

These surfaced from the meeting bootstrap (2026-04-26). Status of each is unclear; team should triage on next planning call:

- [ ] Drew Simon — share knowledge commons starter links + details in group chat (raised 260212; status unclear)
- [ ] Hub post about knowledge commons / federation collaboration (Afo — raised 260225; never confirmed sent)
- [ ] Bright community collaboration — concrete ideas + connection to toolkit (Luiz to discuss with Rather; raised 260212)
- [ ] Onboarding guides refresh: Local Node Onboarding + Network Initiative Onboarding (raised 260312; unclear status)
- [ ] Integrate Safe (smart wallet) content into the toolkit (raised 260312; unclear status)
- [ ] Style guide derived from ReFi DAO 200+ blog posts (raised 260212; partial existence — see `docs/writing-system.md`; cross-reference w/ `content-updates/heen-ai/add-planning-docs` branch's `content-style-guide.md` per Phase 4 reconciliation)

---

## System Health

### Site
- [ ] `npm run build` passes
- [ ] Live site reachable at regen-toolkit-site.vercel.app

### Data Integrity
- [ ] `data/ontology/` YAMLs align with master doc (now flagged for Phase 3 refactor)
- [ ] `data/option-library.yaml` reflects current 9 categories (cross-walk against new 6-tier vocabulary in Phase 2)
- [ ] `.well-known/` schemas match current data (run `npm run generate:schemas` after changes)

### Federation
- [ ] Last sync with upstream (see `federation.yaml`)
- [ ] Peer sync with regen-coordination-os
- [ ] Bonfires / KOI federation hook (Caue's stack) — explore tight integration via `mcp__regen-koi__*` for Evolution layer (raised 2026-05-07)

---

## Recently Completed

- [x] 2026-05-15 — **Master doc 2026-05-15 stabilization-draft iteration processed**: new MASTER.md saved canonical (24,776 lines); 2026-05-06 archived; `MASTER-DOC-CHANGES-2026-05-15.md` diff written; integration plan at `docs/plans/master-doc-iteration-may-15-2026.md`; 10 per-layer docs at `docs/layers/`; 10 per-layer Obsidian canvases at `docs/canvases/layers/`; master overview canvas at `docs/canvases/regen-knowledge-commons-toolkit-master.canvas`; LAYERS.md rewritten against 10-layer model; MEMORY.md + HEARTBEAT.md + QUEUE.md refreshed; `memory/2026-05-15.md` written.
- [x] 2026-05-07 — 2026-05-07 biweekly processed: source note fixed (frontmatter populated, Concluded → true), structured note at `packages/operations/meetings/260507 Regen Web3 Toolkit Planning Call.md`, `data/meetings.yaml` updated (260507 added + 260423 backfilled), `MEMORY.md` updated, plans + queue reflected.
- [x] 2026-05-06 — Master doc 2026-05-06 iteration intake: new MASTER.md (renamed Knowledge Commons Toolkit, ~13.7k lines) saved canonical; previous archived; `MASTER-DOC-CHANGES.md` written; iteration-checkpoint banners on `LAYERS.md` + `ORG-OS.md`; sharing pack sent to Telegram; two new plans queued (`master-doc-iteration-may-2026`, `swarm-contribution-pack`).
- [x] 2026-04-26 — Resources lift: 738 entries extracted from `MASTER.md` (lines 1089–2668) into `data/resources.yaml` via `scripts/lift-resources.mjs`. Layer 1 source-of-truth file now exists; Brandon-curation handoff queued.
- [x] 2026-04-26 — `docs/ORG-OS.md` (operator one-pager, <500 words) + `docs/LAYERS.md` (per-layer status for all 8 layers); README, MASTERPLAN, IDENTITY cross-linked.
- [x] 2026-04-26 — Meeting history backfilled from personal vault (5 meetings: 260115, 260129, 260212, 260225, 260312) into canonical `packages/operations/meetings/` layout; MEMORY.md "Organizational History" populated
- [x] 2026-04-25 — CSIS + KOI design specs mirrored into toolkit (`docs/from-regen-coord/`, `docs/from-refi-dao/`); toolkit-side plan queue established
- [x] 2026-04-24 — org-os overlay landed on `feature/org-os-overlay` (this instance now operates as its own org-os)
- [x] 2026-04-23 — Rather's ontology adopted as toolkit standard; biweekly processed.
- [x] 2026-03-26 — Astro site migrated into monorepo (PR #304)
- [x] Ontology extracted to `data/ontology/` (4 YAMLs)

---

_Last updated: 2026-05-15_
