# Plan Queue — Regen Web3 Toolkit (instance plans)

> Last updated: 2026-04-26

Toolkit-instance work plans. Strategic / network-level plans live in `regen-coordination-os/docs/plans/`.

## Active

_(none — pick one of the queued plans below to activate)_

## Pending operator action

- [public-sharing-pack](public-sharing-pack.md) — **Drafted 2026-04-26** at `packages/operations/comms/2026-04-26-team-sharing-pack.md` (commit `492f83a`). Telegram + email variants. Send pending operator approval; push 4 unpushed commits first so bonus URLs resolve.

## Queued — 2026-04-25 batch (post-overlay polish)

1. [contributions-pipeline](contributions-pipeline.md) — Brainstorm catalog of other valuable contributions (Resources lift to Layer 1, frame-language audit, CSIS conformance posture, ontology V1+V2b overlay, KOI-ready frontmatter, case studies, feedback instrumentation, KOI consumer install). Triage → promote to named plans as bandwidth allows.

## Recommended sequencing

1. Operator: send sharing pack (or course-correct the draft)
2. Plan 1 (contributions-pipeline) — once sharing-pack is in flight

## Completed

- ~~[vault-bootstrap](vault-bootstrap.md)~~ — **2026-04-26.** 6 toolkit meetings backfilled into `packages/operations/meetings/`; 2 `docs/meeting-notes/*.md` migrated with redirect stubs; `data/meetings.yaml` populated; HEARTBEAT carryovers reconciled; schemas regenerate + validate clean.
- ~~[onepager-and-layers](onepager-and-layers.md)~~ — **2026-04-26.** `docs/ORG-OS.md` (operator one-pager, body <500 words) + `docs/LAYERS.md` (per-layer status for all 8 layers); README, MASTERPLAN, IDENTITY cross-linked.

---

## Cross-cutting context

- **Org-os overlay** — landed on the working branch `feature/org-os-overlay`. Operating from the branch directly (PR #310 closed without merge — the team's not gated on a review pass). All plans here assume the overlay is the working state.
- **Master doc** — `docs/MASTER.md` is the canonical source. Plans here support development against it; they don't supersede it.
- **KOI federation** (gated on refi-dao-os) — Plans use manual `meeting-processor` for now; designed for KOI swap once refi-dao Wave 2 ships and extracts to `org-os/packages/koi/`. See `docs/from-refi-dao/` for the design.
- **CSIS posture** — Strict in Layer 5 (Deployment), secondary in Layer 8 (Feedback). See `docs/CSIS.md` and the alignment report at `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md`.
