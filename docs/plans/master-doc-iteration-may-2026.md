# Plan — Master Doc Iteration (May 2026)

**Status:** queued (high-priority)
**Created:** 2026-05-06
**Sequencing:** Holds until **post-OpenCivics Swarm Pulse 1** (2026-05-09–10) so we don't refactor against a checkpoint that may shift again. Surfaced this week so the team has context for the 2026-05-07 biweekly.

## Context

Matty shared a substantially restructured + renamed master doc on 2026-05-06:

> "Got an updated iteration/master doc — tried to cook in all the feedback that was shared and advance things generally. Prob still has gaps/issues and some layers really need to be built out but def improved a lot from the previous version. **All very much a work in progress, def a nice checkpoint heading into the swarm.** There's a tab specifically about the swarm > 'Knowledge Commoning Swarm'."

The new iteration is the canonical [`docs/MASTER.md`](../MASTER.md). The previous iteration is archived at [`docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`](../archive/MASTER-2026-04-23-regen-web3-toolkit.md). The diff between iterations is captured in [`docs/MASTER-DOC-CHANGES.md`](../MASTER-DOC-CHANGES.md).

**The most material changes for the org-os overlay:**

1. **Rename:** "Regen Web3 Toolkit" → **"Regen Knowledge Commons Toolkit"** (~30 files reference the old name)
2. **Architecture:** Layer set is restructured — Tracks dropped, Concept & Idea Ecology added, Implementation Memory and Evolution split, Ontology promoted to Layer 1, Cross-Cutting Systems added as a peer concept
3. **Swarm framing:** New top-level section reframes the Toolkit as a "contribution artifact" to the broader Knowledge Commoning Swarm (see [`swarm-contribution-pack.md`](swarm-contribution-pack.md))

## Why hold

Matty's framing — "checkpoint heading into the swarm" — explicitly signals that the iteration may shift again post-Pulse 1. Wholesale renaming + layer restructuring across 30+ files NOW would create churn that has to be re-done. Better to:

1. Surface the changes clearly to the team this week ✅ (done: this plan + `MASTER-DOC-CHANGES.md` + iteration banners on `LAYERS.md` + `ORG-OS.md`)
2. Discuss at the 2026-05-07 biweekly + observe what gets validated at Pulse 1
3. Refactor as a single coherent pass post-Pulse-1 against a stabilized iteration

## Tasks

### Phase 1 — Surfacing (this week, before biweekly)

- [x] Save new master doc as canonical `docs/MASTER.md`; archive previous to `docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`
- [x] Write `docs/MASTER-DOC-CHANGES.md` capturing the iteration diff
- [x] Add iteration-checkpoint banners to `docs/LAYERS.md` and `docs/ORG-OS.md`
- [x] Create this plan + `docs/plans/swarm-contribution-pack.md`
- [x] Update `docs/plans/QUEUE.md` to surface both
- [x] **Walk the team through the diff at 2026-05-07 biweekly** (operator: Luiz) — *done 2026-05-07; iteration acknowledged as working checkpoint, no objections raised to the rename or layer restructure*

### Phase 2 — Reconciliation discussion (biweekly + Pulse 1 weekend)

**Status update — 2026-05-07 biweekly:** the call did not produce final answers on most reconciliation items (intentionally — the Pulse 1 observation window is meant to inform them). What did happen: the rename + layer restructure were not contested, OrgOS was adopted as the team's shared coordination layer, and a *new* Phase 2 reconciliation item was surfaced — Toolkit vs "Transformational Journeys" framing tension (Koi).

- [ ] **Layer ownership:** Heenal owned "Tracks" — that layer is gone. Confirm Heenal moves to Encyclopedia + learning-path lead, or absorbs Tracks into a different layer (Heenal + Matt at biweekly). *Not addressed on 2026-05-07 — defer to ~2026-05-21 biweekly's persona/skill-mapping session.*
- [ ] **Concept & Idea Ecology layer:** Identify owner. Possibly Matt (it's lineage/paradigm/framework mapping — adjacent to ontology work). *Not addressed 2026-05-07.*
- [ ] **Implementation Memory + Evolution split:** Currently both unowned. Discuss whether to keep two unowned slots or pursue one combined caretaker role. *Adjacent: Koi committed (2026-05-07) to drafting a research framework document for Evolution — partial coverage if Koi takes Evolution.*
- [ ] **CSIS alignment:** New master doc emphasizes structural integrity questions ("Who is represented? Who is absent? Who maintains it?") — Durgadas to confirm whether the existing CSIS × org-os Alignment Report covers these or needs supplementing.
- [ ] **Tool/Option/Pattern/Protocol/Deployment/Case distinction:** New master doc proposes this 6-tier distinction for the Option Library. Cross-walk against existing `data/option-library.yaml` 9-category scaffold.
- [ ] **Ontology object types:** New master enumerates 25 working types. Decide which are root types vs tags vs metadata.
- [ ] **Maturity language:** New master proposes 9 states (`raw`, `to-place`, `draft`, `candidate`, `reviewed`, `field-informed`, `pattern-generating`, `deprecated`, `open question`). Adopt as canonical or map to existing `status` fields.
- [ ] **Toolkit vs "Transformational Journeys" framing tension** *(NEW 2026-05-07, Koi)*: pulls in different direction from the 2026-05-06 "Knowledge Commons Toolkit" rename. Koi's three concerns: (1) "toolkit" reads as backpack/inventory/repository ambiguously; (2) tools imply transactional interactions, but the goal is relational + continuous learning; (3) navigation between layers is the core feature, more than documentation. **Decision question:** keep the 2026-05-06 rename ("Knowledge Commons Toolkit") and absorb Koi's critique into framing copy, OR consider a deeper rename (e.g., "Knowledge Commons Journeys" or similar). **Defer to:** Matty's response post-Pulse-1 + observation of Swarm framing language during Pulse 1 itself.

### Phase 3 — Structured refactor (post-Pulse 1)

- [ ] **Re-run resources lift** from new `docs/MASTER.md` (current `data/resources.yaml` was lifted from the previous iteration). `scripts/lift-resources.mjs` is idempotent — verify line ranges still match before running.
- [ ] **Refactor `data/ontology/*.yaml`** to align with new object types + maturity states. Coordinate with Matt + Rather.
- [ ] **Cross-walk `data/option-library.yaml`** against new tool/option/pattern/protocol/deployment/case distinction.
- [ ] **Re-evaluate `data/feedback-process.yaml`** as Implementation Memory + Evolution split — possibly two yaml files.
- [ ] **Update `docs/LAYERS.md`** to new layer structure + ownership.
- [ ] **Update `docs/IDENTITY.md`** ownership table.
- [ ] **Update `docs/ORG-OS.md`** one-pager to use new name + new architecture.
- [ ] **Update root MDs** (`MASTERPLAN.md`, `IDENTITY.md`, `MEMORY.md`, `SOUL.md`, `CLAUDE.md`, `AGENTS.md`, `TOOLS.md`, `USER.md`, `HEARTBEAT.md`, `dashboard.yaml`, `federation.yaml`, `package.json`) — replace "Regen Web3 Toolkit" with "Regen Knowledge Commons Toolkit" (~30 files; do as a single coherent commit).
- [ ] **Regen schemas + validate:** `npm run generate:schemas && npm run validate:schemas` after data/ refactor.

### Phase 4 — Cross-branch reconciliation

Surface from the 2026-05-06 plan survey across branches:

- [ ] **`luizfernando-refidao` branch** has stale planning docs (`docs/HACKMD-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/ops/TOOLKIT-MASTER-PLAN.md`, dated 2026-02-18, pre-overlay). Decide: archive to `docs/archive/`, backport useful parts (HACKMD-WORKFLOW for contributor onboarding looks worth keeping), or close the branch.
- [ ] **`content-updates/heen-ai/add-planning-docs` branch** has `docs/content-style-guide.md` (3 personas: Grounded Regen / Curious Degen / On-Chain Regen; article structure; tone/voice/markdown standards) — overlaps with overlay's `docs/writing-system.md`. Decide: cross-link, merge, or supersede.

## Cross-cutting context

- **Sequencing rationale:** The new master doc is explicitly "a checkpoint heading into the swarm." Pulse 1 (2026-05-09–10) is the next stabilizing event. Refactoring before then risks doing the work twice.
- **Master doc edit rights:** Matt's working document. Phase 3 changes to `MASTER.md` itself stay paused unless Matt explicitly requests them.
- **Coordination:** All Phase 2 and Phase 3 decisions should land in `MEMORY.md` as dated entries.

## Related

- [`docs/MASTER-DOC-CHANGES.md`](../MASTER-DOC-CHANGES.md) — full iteration diff
- [`docs/plans/swarm-contribution-pack.md`](swarm-contribution-pack.md) — Swarm-facing v0.1 contribution package plan
- [`docs/plans/contributions-pipeline.md`](contributions-pipeline.md) — original tier-1 contribution catalog (some items now superseded by this plan)
