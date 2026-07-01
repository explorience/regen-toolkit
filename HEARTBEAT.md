# HEARTBEAT.md — Regen Web3 Toolkit Active Tasks

_A living checklist of active coordination tasks. Agents consult this on every session. Update regularly — mark done, add new, remove stale._

> **HEARTBEAT vs BACKLOG.** HEARTBEAT = active work for THIS cycle (in-flight + this-week). [`docs/BACKLOG.md`](docs/BACKLOG.md) = the triaged TODO surface (mirrors master doc §16, with status labels: `raw-note` · `needs-routing` · `needs-owner` · `candidate-integration` · `high-risk` · etc.). When an item gets picked up for active work, lift it from BACKLOG → HEARTBEAT. When something gets parked, push it down.

> **2026-05-15 iteration checkpoint.** Master doc updated to 2026-05-15 stabilization draft (10 layers; Tracks restored, Infrastructure added). Per-layer docs at [`docs/layers/`](docs/layers/); per-layer canvases at [`docs/canvases/layers/`](docs/canvases/layers/); master overview canvas at [`docs/canvases/regen-knowledge-commons-toolkit-master.canvas`](docs/canvases/regen-knowledge-commons-toolkit-master.canvas). Phase 3 refactor plan: [`docs/plans/master-doc-iteration-may-15-2026.md`](docs/plans/master-doc-iteration-may-15-2026.md).

---

## Active Tasks

> **2026-06-16 checkpoint.** Gap-fill (260521 + 260604 biweeklies) processed; **new master doc 2026-06-15 working iteration** is canonical (30,847 lines — integration pass, 10-layer core stable; see [`docs/MASTER-DOC-CHANGES-2026-06-15.md`](docs/MASTER-DOC-CHANGES-2026-06-15.md)); **resource DB V3** staged at [`data/resources/`](data/resources/). **Convergence is parked behind an operator checkpoint** (site merge, branch cleanup, framework/instance split, full resource lift) — see ⏸ section below.

### Convergence — IN PROGRESS _(2026-06-16)_

Branch consolidation + site merge **done**. Now driven by the [**convergence pipeline**](docs/plans/CONVERGENCE-PIPELINE.md) (D1 + P1–P10).

- [x] **Branch consolidation** — `feature/org-os-overlay` renamed → **`regen-toolkit-os`** (consolidated working branch). 7 stale/converged branches pruned (local + remote), all preserved as `archive/*` tags (pushed). Remote now: `main` + `regen-toolkit-os` only.
- [x] **Site convergence** — merged `main`'s live **3-journey v1** into `regen-toolkit-os` (119 curated articles + journeys + knowledge map) with all org-os work intact. `npm run build` passes (124 pages). Resolved a `docs/BACKLOG.md` case-collision → org-os backlog kept canonical; site content backlog → `docs/CONTENT-BACKLOG.md`. **Decision (2026-06-17): `regen-toolkit-os` stays a *parallel* branch — NOT promoted to `main`.** The live site keeps deploying from `main` (site team's lane); `regen-toolkit-os` is the consolidated org-os + framework lane. Pull from `main` periodically to keep the site current here.
- [ ] **Framework / instance split (P1)** — `framework/` scaffolded (`README.md` + `SEPARATION.md`). Active. **Gated on D1** (lifecycle vs 10-layers). → present prototype (P3) to the group.
- [ ] **Resource-DB V3 lift (P2)** — crosswalk-driven into the data model (`data/resources/csv/toolkit-layer-crosswalk.csv`). Ready.
- [ ] **Multi-instance deploy (P9/P10)** — framework → `../refi-dao-os` (podcasts/blog) → `../refi-bcn-os` → network.

> Full roadmap (waves, dependencies, skills-to-load per plan): [`docs/plans/CONVERGENCE-PIPELINE.md`](docs/plans/CONVERGENCE-PIPELINE.md).

### Share with Matty + group — the concrete startpoint _(NEW 2026-07-02)_

Framework built + content processed + site forked (2 pages) + GAPS + master-doc proposals all done (2026-06-23 sessions). Share pack ready: [`docs/reports/2026-07-02-toolkit-framework-share-pack.md`](docs/reports/2026-07-02-toolkit-framework-share-pack.md) — tailored to Matty's/Rather's 29 Jun asks (tooling, Resource-Graph-as-portable-DB, artifact interconnection, opinionated decisions).

- [ ] **Deploy `regen-toolkit-os` to a Vercel preview** — the one thing that makes the 2 pages (`/framework`, `/regen-toolkit-os`) clickable for Matty/Heenal. *(Top priority for shareability.)*
- [ ] **Send the 3 messages** (Matty DM · group · Rather) from the share pack — draft-and-present done; review + send
- [ ] **Sync with Rather** — hand him the schema/JSON-LD substrate for knowledge-graphing/retrieval (piece 1) so he builds on it, not parallel; his website-UI/pluggable-content (piece 2) slots into `data/`
- [ ] **Group — ratify the top-5 decisions** (R1, R7, R8, R3, D1) — async or on the call
- [ ] **Full iteration next week** — sync the framework's `problems-and-theory-of-change.md` to Matty's **v3 ToC update (26 Jun)**; deepen the 3 skills; run the **V3 resource review pass** (human review before publishing lifted resources); then the hub post
- [ ] **Schedule the call** end of next week (ratify structure + opinionated decisions)

### Framework Build — `packages/toolkit-framework` _(0.1.0-beta.1 — BUILT)_

Executing the [framework build plan](docs/plans/framework-build/README.md) (SP0–SP11). The framework = a standalone, org-os-agnostic package (zero-build ESM + YAML + markdown) seeding a federated network of forkable-but-interoperable commons. Gap analysis + reconciliations: [`framework/COVERAGE.md`](framework/COVERAGE.md) · [`framework/RECONCILIATIONS.md`](framework/RECONCILIATIONS.md) · [`framework/FEEDBACK-LOOPS.md`](framework/FEEDBACK-LOOPS.md).

- [x] **SP-DEC** — R1 (3-axis canonical state model) / R3 (kernel = ontology subset) / R7 (Octo-candidate, CSIS-informed) resolved
- [x] **SP0** — package scaffolded; validator + CLI; **12/12 tests green**
- [x] **SP1** — shared-schema keystones K1 (review-maturity) · K2 (source-system / return-path) · K3 (frontmatter) · K5 (contribution-record) + signal/provenance/public-use-boundary
- [x] **SP2** — semantic kernel: 15 frozen core types + 31 extensions (all `maps_to_core`) + unified relationships (R9 ✅) + MOK-5 + JSON-LD generator + fork-compat
- [x] **SP3/SP4** — 10 layer entry schemas + the compatibility engine (option/track/deployment)
- [x] **SP5** — 8 process docs (R6/R8/R10 ✅) · **SP6** — 3 agentic skills (capture-and-route, compose-journey, csis-review) · **SP7** — resource lift ETL · **SP8** — invariants validators · **SP9** — architecture + site docs (R4/R5 ✅)
- [x] **SP10** — `packages/org-os-kms` (module + org-os profile, framework pre-loaded; replaceable)
- [x] **✅ FRAMEWORK FULLY BUILT (SP0–SP10):** toolkit-framework **34/34 tests**, 21 schemas, 3 skills; org-os-kms 2/2. All R1–R10 resolved.
- [ ] **★ Process toolkit content through the framework + public site** — plan ready: [`docs/plans/site-and-content-convergence.md`](docs/plans/site-and-content-convergence.md). Run Heenal's live v1 + other branches + the V3 DB through the framework → populate the instance `data/`; fork/extend Heenal's site with a **framework page** + a **regen-toolkit-os page** on `regen-toolkit-os`. **For a dedicated session.** (The first real adoption — SP11 rehearsal on the reference instance.)
- [ ] **SP11 — first ReFi DAO adoption** (the dialectic / pipeline P9): instantiate the profile, process podcasts/blog, contribute back → framework v0.1. *After the reference-instance rehearsal above.*
- [ ] **Batch the R1–R10 master-doc proposals** for Matty (Loop 2 — draft-and-present) + confirm with Durgadas/Rather at the biweekly

### Master Doc 2026-06-15 Iteration _(NEW 2026-06-16)_

- [ ] **Revise CSIS posture** (`docs/CSIS.md`) → "CSIS-Informed, Not CSIS-Conformant" + the 3-level model (Principles / Review prompts / Enforceable standards) + minimum enforceable safeguards. The new master doc formalizes this — resolves the long-standing "posture revision pending" flag.
- [ ] **Track the Knowledge-Lifecycle-vs-10-layers decision** — the new doc offers a Capture→…→Interoperate lifecycle spine as a *candidate* (Structure Options recommends "Small Core, Large Appendices + Lifecycle spine"). Don't pre-empt; surface at biweekly. **Do not rebuild the 10 per-layer docs/canvases until decided.**
- [ ] **Derive a Theory-of-Change artifact** from the new master doc's Problem/ToC section (now first-class) — 10-problem + updated 14-problem versions.
- [ ] **Layer-by-layer review** of the new iteration (Matty's recommended method — review by layer, not whole-system rewrite).

### Theory of Change / Revised Problem Statement _(NEW 2026-05-21 — still open)_

From Durgadas's "theory of build vs theory of change" challenge (260521). The new master doc answers much of it; the team-authored piece remains.

- [ ] **Author a revised problem + mission statement** (group; Heenal proposed) — derive ToC from Green Pill + ReFi DAO rather than invent fresh (Afo)
- [ ] Durgadas — circulate the **Idea Processor** (MELT-strategy) + the theory-of-build article
- [ ] Consider a tradeoff-triangle prioritization exercise to find the highest-leverage thing

### V1 Public Site (Heenal) _(NEW 2026-06-04)_

Heenal's simplified 3-journey site — **landed + live** at regen-web3-toolkit.vercel.app (merged main / PR #311). The usable "front door" of the three-artifact model.

- [ ] **Heenal — design the feedback / contribution pathway** for V1 (currently "not easy") — operationalizes "public ≠ commons"
- [ ] Heenal — continue page-by-page human review; keep it usable/practical
- [ ] Consider an **operational-contributor journey** (Rather — teams forming, picking up tools, acting; beyond "newcomer")
- [ ] **Matty — draft the hub/forum post** (pairs with V1; invites use + co-stewardship, not just announces)
- [ ] Reconcile V1 with the master-doc layers (Heenal flagged layers ~2 + 7; vertical mapping later)

### Resource Database V3 _(NEW 2026-06-16)_

Matty's V3 resource DB (June 13) staged at [`data/resources/`](data/resources/) — 28 sheets / 12,456 rows. Supersedes the April `data/resources.yaml` lift.

- [ ] **Full structured lift** (in Convergence above) — crosswalk-driven routing into the data model
- [ ] Clean tweet-text noise in `toolkit-layer-crosswalk` `toolkit_route` cells
- [ ] Wire the DB's **review queues** → master-doc safeguards (Public-Use Boundary, Source System Cards, Builder/Media safeguards) — these match open `docs/BACKLOG.md` items
- [ ] **Brandon — curation pass** now operates on the lifted V3 result (not the old April lift)

### Greenpill Network + Andrea / RegenOS _(NEW 2026-06-04)_

- [ ] **Afo — translate toolkit into the Greenpill Network site** ("garden → house" flow); link Greenpill → Toolkit; consider agent-skills for AI to reference the toolkit
- [ ] **Schedule the Andrea + RegenOS conversation** (Luiz) — bioregional knowledge (bioregioning.org / Recover) → contribution-governance + compensation protocols
- [ ] Luiz — share bioregioning.org + the maturity-index/stewardship excerpt to Telegram

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

### RegenOS Documentation + Public Website _(NEW 2026-06-15)_

From the Matty + Luiz work session: RegenOS (the coordination layer above OrgOS instances — essentially what `regen-coordination-os` is) is only vaguely referenced in the master doc and needs a concrete written description + an approachable public surface. Target: **July**. See plan [`docs/plans/regen-os-documentation.md`](docs/plans/regen-os-documentation.md).

- [ ] **Luiz — draft RegenOS documentation** (what it is; coordination layer above OrgOS instances; upstream/downstream repo mapping; knowledge-source vs organizational federation as two distinct mechanisms; self-qualifying adoption as the federation filter). Target July.
- [ ] **Luiz — build a simple public website for RegenOS/OrgOS** (clean, non-manipulative, human-readable; could share the Astro repo). Target July.
- [ ] **Luiz — draft RegenOS description for the master-doc meeting-notes tab** (handful of sentences) — *external edit to Matty's Google Doc; draft-and-present before sending.*
- [ ] **Luiz — add the OrgOS overlay GitHub link** next to the RegenOS reference in the master doc — *external edit; editor access requested on the call.*
- [ ] **Luiz — write up RegenOS ↔ COOP / Geo Browser / COI / infra stack** for the new "More Opinionated Infrastructure" sub-tab — *external edit; draft-and-present.*

### Framework / Instance Split _(NEW 2026-06-15 — strategic)_

Decision (in principle) to formally split the work into a domain-agnostic **framework** (layers system, flows, processes, IA) + the **ReFi Web3 Toolkit as the first concrete instance**. Reshapes how the master doc + repos are organized. **Surface with the wider team — not executed unilaterally.**

- [ ] **Surface the framework/instance split to the team** at the next biweekly (reshapes master-doc + repo organization; ties to the eventual ~3 structural variants)
- [ ] Scope what "framework" vs "instance" means concretely for `docs/MASTER.md` + this repo (conceptual separation first; own-repo question deferred)
- [ ] **ReFi DAO as immediate use case** — use the framework to process ReFi DAO podcast episodes + blog posts (pending for months); output feeds back into the toolkit (Luiz)

### Infra Stack & Federation _(NEW 2026-06-15)_

Stack as discussed: OrgOS (foundational file system + agent instructions) → Radicle (P2P Git; planned) → COOP (intake/tagging, needs review pipeline) → COI (heavier; OrgOS covers many use cases foundationally) → visualization (Obsidian canvases for operators; Kumu from GitHub; static public website). Agreed: **simplify first, layer complexity later — don't settle on-chain now.**

- [ ] **Luiz — review Geo Browser** (geobrowser.io) — flagged as not-yet-reviewed; assess fit + slot into the infra write-up
- [ ] Radicle integration (P2P decentralized Git) — planned, not yet done (exploratory; Luiz keen)
- [ ] Fix the **maturity/confidence rating system** for tasks — addresses the known bug where agents pick up passing meeting mentions as high-priority follow-ups (raised again 2026-06-15)
- [ ] Repair the regen-coordination **Notion sync** — broke on the Notion CLI release (API change); affects `/initialize` DB sync

### ReFi Commons + Standards + Funding _(NEW 2026-06-15 — strategic)_

Coordination model: small bites (fundable working groups), not a big merger. Standards stack drives funding flows. Scale to high-trust orgs, not open calls.

- [ ] **Open the ReFi Commons home conversation** (Luiz + Matty) — coordinate with Green Pill IP roll-in
- [ ] **Identify the first working group both orgs agree is worth funding** (the "small bite" entry point)
- [ ] **Advance the standards stack** — CIDS + DAO IP5 (needs more figuring-out) + impact accounting/measurement tied to funding flows (specific, academically rigorous)
- [ ] **Map a path to seed an Impact Vault** ("Oct and Vault") from funding the master-doc work earns — Matty's compensation preference; reciprocity/acknowledgement thread (details in Matty's handoff doc)
- [ ] Scale outreach — ~5–7 existing high-trust orgs / known people (not open chapter calls) — *slow-burn; pairs with Matty*

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
- [x] **Toolkit vs "Transformational Journeys" framing tension — largely resolved toward journeys** (Koi raised 2026-05-07; reinforced 2026-05-21). Heenal's v1 site IS journey-based (3 onboarding journeys live). The "Knowledge Commons Toolkit" name persists for the master doc; the *public* surface is journey-framed. See V1 Public Site section.

### Persona / Game-Based Format _(SUPERSEDED 2026-05-21)_

~~Next planning call (~2026-05-21) restructured around persona/role cards + granular skill mapping.~~ **The 2026-05-21 call diverged into Durgadas's theory-of-change strategic check-in; the persona/skill-card game did not happen.** Folded into the Theory of Change / Revised Problem Statement workstream above.

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

- [x] 2026-06-16 — **Gap-fill + master-doc intake**: 2026-05-21 + 2026-06-04 biweeklies processed (notes + registry, now 10 meetings); **new master doc 2026-06-15 working iteration saved canonical** (30,847 lines; 2026-05-15 archived; raw preserved; `MASTER-DOC-CHANGES-2026-06-15.md` diff); **resource DB V3 staged** (`data/resources/` — xlsx + 28 CSVs / 12,456 rows + manifest). Stale threads resolved (persona-game superseded; journeys tension resolved; v1 site landed). Convergence (site merge, branch cleanup, framework/instance, full resource lift) parked behind operator checkpoint. Integration report: `docs/reports/2026-06-16-gap-fill-and-master-doc-intake-integration-report.md`.
- [x] 2026-06-16 — **2026-06-15 Matty + Luiz work session processed** (refi-bcn-os `meeting-processor` pipeline): source note frontmatter fixed + processed pointer; synthesized note at `packages/operations/meetings/260615 Toolkit Work Session with Matty.md`; `data/meetings.yaml` +1 (`mtg-20260615-toolkit-worksession-matty`); `memory/2026-06-16.md` written; MEMORY.md (Key Decisions +5, History +1, Active Context + Relationship Map refreshed); HEARTBEAT 4 new sections (RegenOS docs, framework/instance split, infra stack, ReFi Commons/standards); new plan `docs/plans/regen-os-documentation.md` + QUEUE updated; integration report at `docs/reports/2026-06-15-toolkit-worksession-matty-integration-report.md`. Notion phases N/A (sync broken + toolkit doesn't run Notion as primary); operator weekly/monthly distribution offered (not auto-written).
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

_Last updated: 2026-06-16_
