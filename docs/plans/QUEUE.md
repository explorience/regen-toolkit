# Plan Queue — Toolkit (instance plans)

> Last updated: 2026-05-06
>
> **Iteration checkpoint:** Toolkit was renamed "Regen Knowledge Commons Toolkit" in the 2026-05-06 master doc iteration. See [`MASTER-DOC-CHANGES.md`](../MASTER-DOC-CHANGES.md). The wholesale rename across overlay docs is sequenced into [`master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md) Phase 3 (post-Swarm-Pulse-1).

Toolkit-instance work plans. Strategic / network-level plans live in `regen-coordination-os/docs/plans/`.

## Active

_(none — pick one of the queued plans below to activate)_

## Pending operator action

_(none currently — sharing pack sent 2026-05-06)_

## Queued — high-priority

1. [master-doc-iteration-may-2026](master-doc-iteration-may-2026.md) — **NEW 2026-05-06.** Refactor overlay against Matty's substantially restructured + renamed master doc (Tracks layer dropped, Concept & Idea Ecology added, Implementation Memory + Evolution split, Ontology promoted to Layer 1). Phase 1 surfacing complete; Phase 2 reconciliation discussion at 2026-05-07 biweekly + Pulse 1 weekend; Phase 3 structural refactor post-Pulse-1.
2. [swarm-contribution-pack](swarm-contribution-pack.md) — **NEW 2026-05-06.** v0.1 contribution pack for the Knowledge Commoning Swarm (Pulse 1: 2026-05-09–10). 7 short deliverables packaging Toolkit distinctions (atlas, source-systems, structural integrity, implementation memory, tool/option/pattern/protocol/deployment/case, anti-patterns, six-affordances translation) for cross-community reuse. Realistic v0.1 scope: 3–4 deliverables, not all 7.

## Queued — pre-iteration batch (2026-04-25, partially superseded)

3. [contributions-pipeline](contributions-pipeline.md) — Original tier-1 catalog (Resources lift to Layer 1, frame-language audit, CSIS conformance posture, ontology V1+V2b overlay, KOI-ready frontmatter, case studies, feedback instrumentation, KOI consumer install). **Several items now superseded by `master-doc-iteration-may-2026.md`** (resources lift, ontology, feedback) — re-triage post-Pulse-1.

## Cross-branch reconciliation flags (surfaced 2026-05-06)

These don't have plan files yet — folded into [`master-doc-iteration-may-2026.md`](master-doc-iteration-may-2026.md) Phase 4:

- **`luizfernando-refidao` branch:** stale `docs/HACKMD-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/ops/TOOLKIT-MASTER-PLAN.md` (dated 2026-02-18, pre-overlay). Decide: archive, partial backport (HACKMD-WORKFLOW for contributor onboarding), or close branch.
- **`content-updates/heen-ai/add-planning-docs` branch:** `docs/content-style-guide.md` (3 personas, article structure, voice/tone) overlaps with overlay's `docs/writing-system.md`. Decide: cross-link, merge, or supersede.

## Recommended sequencing

1. **2026-05-07 biweekly** — walk team through `MASTER-DOC-CHANGES.md` + the two new plans. Surface Phase 2 reconciliation questions (layer ownership, owner for Concept & Idea Ecology, Implementation Memory + Evolution split, Tool/Option/Pattern/Protocol/Deployment/Case cross-walk, ontology object types, maturity language).
2. **2026-05-09–10 Pulse 1** — observe what Swarm participants gravitate toward; adjust Swarm Contribution Pack v0.1 scope.
3. **Post-Pulse-1, week 1** — start Phase 3 of `master-doc-iteration-may-2026` (re-run resources lift; refactor `data/ontology/`; cross-walk `data/option-library.yaml`; update `LAYERS.md`; update `IDENTITY.md`).
4. **Post-Pulse-1, week 2** — root-MD rename pass (~30 files, single coherent commit). Validate schemas + structure.
5. **Hackathon mid-point** — Swarm Contribution Pack v0.1 packaged + shared.

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
