# Plan Queue — Toolkit (instance plans)

> Last updated: 2026-05-15
>
> **2026-05-15 iteration checkpoint.** Matty shared a second master-doc iteration (stabilization draft, ~24,776 lines, 10 layers). Tracks restored; Infrastructure & Substrate added. Per-layer docs + canvases scaffolded. See [`docs/MASTER-DOC-CHANGES-2026-05-15.md`](../MASTER-DOC-CHANGES-2026-05-15.md) for the diff and [`master-doc-iteration-may-15-2026.md`](master-doc-iteration-may-15-2026.md) for the integration plan (supersedes May 6 Phase 3).
>
> **Pulse 1 happened 2026-05-09–10.** Retro still owed. Phase 3 refactor now unblocked AND retargeting to the 2026-05-15 iteration, not 2026-05-06.
>
> **TODO triage.** [`docs/BACKLOG.md`](../BACKLOG.md) is the parked/queued TODO surface (mirrors master doc §16). Plans here = sequenced multi-step work. Single-task backlog items live in BACKLOG. **Suggested triage rhythm** (per master doc §16.13): monthly triage · quarterly deeper review · review before each public site release · review before each AI-assisted synthesis pass. Promote BACKLOG → HEARTBEAT when an item enters active work.

Toolkit-instance work plans. Strategic / network-level plans live in `regen-coordination-os/docs/plans/`.

## Active

1. [master-doc-iteration-may-15-2026](master-doc-iteration-may-15-2026.md) — **ACTIVE 2026-05-15.** Integrate the 2026-05-15 stabilization-draft iteration. Phase A (save + archive) done. Phase B (10 per-layer docs) done. Phase C (10 layer canvases) done. Phase D (master canvas) done. Phase E (structured refactor against new iteration) + Phase F (repo dev infrastructure) sequenced post-2026-05-21 biweekly. Phase G (site IA) deferred.

## Pending operator action

_(none currently — sharing pack sent 2026-05-06)_

## Queued — high-priority

1. [swarm-contribution-pack](swarm-contribution-pack.md) — **NEW 2026-05-06.** v0.1 contribution pack for the Knowledge Commoning Swarm. Pulse 1 happened 2026-05-09–10 (retro owed). 7 short deliverables packaging Toolkit distinctions. Realistic v0.1 scope: 3–4 deliverables. **Stream #4 (Implementation Memory) now co-authored with Koi (Bonfires substrate).**

## Superseded

1. ~~[master-doc-iteration-may-2026](master-doc-iteration-may-2026.md)~~ — **SUPERSEDED 2026-05-15 by [`master-doc-iteration-may-15-2026.md`](master-doc-iteration-may-15-2026.md).** Phase 1 (surfacing) + Phase 2 reconciliation work fold into the new plan. The May 6 iteration's 8-layer model has been replaced by the 2026-05-15 10-layer model.

## Queued — pre-iteration batch (2026-04-25, partially superseded)

3. [contributions-pipeline](contributions-pipeline.md) — Original tier-1 catalog (Resources lift to Layer 1, frame-language audit, CSIS conformance posture, ontology V1+V2b overlay, KOI-ready frontmatter, case studies, feedback instrumentation, KOI consumer install). **Several items now superseded by `master-doc-iteration-may-2026.md`** (resources lift, ontology, feedback) — re-triage post-Pulse-1.

## Cross-branch reconciliation flags (surfaced 2026-05-06)

These don't have plan files yet — folded into [`master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md) Phase 4:

- **`luizfernando-refidao` branch:** stale `docs/HACKMD-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/ops/TOOLKIT-MASTER-PLAN.md` (dated 2026-02-18, pre-overlay). Decide: archive, partial backport (HACKMD-WORKFLOW for contributor onboarding), or close branch.
- **`content-updates/heen-ai/add-planning-docs` branch:** `docs/content-style-guide.md` (3 personas, article structure, voice/tone) overlaps with overlay's `docs/writing-system.md`. Decide: cross-link, merge, or supersede.

## Recommended sequencing

1. ~~**2026-05-07 biweekly** — walk team through `MASTER-DOC-CHANGES.md` + the two new plans.~~ *Done 2026-05-07. Iteration acknowledged. Phase 2 reconciliation items mostly deferred to ~2026-05-21 biweekly's persona/skill-mapping session, Pulse 1 observation, and Matty's response post-travel. New reconciliation item: Toolkit vs "Transformational Journeys" framing tension.*
2. **Pre-Pulse-1 (2026-05-08)** — Luiz: stand up shared task management surface (HEARTBEAT + Task Manager webapp + Telegram-able onboarding line); sketch Obsidian Canvas of toolkit architecture (new 8-layer KCT model).
3. **2026-05-09–10 Pulse 1** — partial team attendance (Matty in Philadelphia for wedding); observation posture. Observe what Swarm participants gravitate toward; adjust Swarm Contribution Pack v0.1 scope. Capture framing language (Toolkit vs Journeys).
4. **~2026-05-21 biweekly** — persona/game format. Team brings role/skill cards; assign post-Pulse-1 deliverables (Swarm Pack items 1–4 + 6) to actual people. Heenal's layer reassignment + Concept & Idea Ecology owner question best addressed here.
5. **Post-Pulse-1, week 1** — start Phase 3 of `master-doc-iteration-may-2026` (re-run resources lift; refactor `data/ontology/`; cross-walk `data/option-library.yaml`; update `LAYERS.md`; update `IDENTITY.md`).
6. **Post-Pulse-1, week 2** — root-MD rename pass (~30 files, single coherent commit). Validate schemas + structure. Decide Toolkit-vs-Journeys framing if Matty + Pulse 1 input has surfaced direction.
7. **Hackathon mid-point** — Swarm Contribution Pack v0.1 packaged + shared.

## Completed

- ~~[public-sharing-pack](public-sharing-pack.md)~~ — **2026-05-06.** Sent via Telegram following Matty's master doc share. Three primary docs (Master Doc Briefing 260423, CSIS × org-os Alignment 260423, KOI Integration Design) + branch entry + iteration-rename acknowledgement.
- ~~[vault-bootstrap](vault-bootstrap.md)~~ — **2026-04-26.** 6 toolkit meetings backfilled into `packages/operations/meetings/`; 2 `docs/meeting-notes/*.md` migrated with redirect stubs; `data/meetings.yaml` populated; HEARTBEAT carryovers reconciled; schemas regenerate + validate clean.
- ~~[onepager-and-layers](onepager-and-layers.md)~~ — **2026-04-26.** `docs/ORG-OS.md` (operator one-pager, body <500 words) + `docs/LAYERS.md` (per-layer status for all 8 layers); README, MASTERPLAN, IDENTITY cross-linked.
- ~~[resources-lift](resources-lift.md)~~ — **2026-04-26.** Promoted from contributions-pipeline Tier 1 #1. 738 entries from MASTER.md lines 1089–2668 → `data/resources.yaml` via `scripts/lift-resources.mjs` (285 URL-bearing, 50 domains). Pending Brandon's curation pass. **Note 2026-05-06:** lift was from the previous master doc iteration; re-run scheduled in `master-doc-iteration-may-2026.md` Phase 3 against new MASTER.md.

---

## Cross-cutting context

- **Org-os overlay** — landed on the working branch `feature/org-os-overlay`. Operating from the branch directly (PR #310 closed without merge — the team's not gated on a review pass). All plans here assume the overlay is the working state.
- **Master doc** — `docs/MASTER.md` is the canonical source (now: 2026-05-06 Knowledge Commons Toolkit iteration; previous archived at `docs/archive/MASTER-2026-04-23-regen-web3-toolkit.md`). Plans here support development against it; they don't supersede it. Per CLAUDE.md, MASTER.md is Matt's working document — derive from it, don't modify directly without authorization.
- **KOI federation** (gated on refi-dao-os) — Plans use manual `meeting-processor` for now; designed for KOI swap once refi-dao Wave 2 ships and extracts to `org-os/packages/koi/`. See `docs/from-refi-dao/` for the design.
- **CSIS posture** — Strict in Layer 5 (Deployment), secondary in Layer 8 (Feedback). See `docs/CSIS.md` and the alignment report at `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md`. The new master doc's structural-integrity emphasis strengthens the CSIS alignment opportunity (Phase 2 reconciliation).
- **OpenCivics Swarm** — Toolkit reframed as a contribution artifact to the broader Knowledge Commoning Swarm (new master doc Section 🐝). Pulse 1: 2026-05-09–10. Two-month hackathon follows.
