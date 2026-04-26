# Plan Queue — Regen Web3 Toolkit (instance plans)

> Last updated: 2026-04-25

Toolkit-instance work plans. Strategic / network-level plans live in `regen-coordination-os/docs/plans/`.

## Active

_(none — pick one of the queued plans below to activate)_

## Queued — 2026-04-25 batch (post-overlay polish)

1. [vault-bootstrap](vault-bootstrap.md) — Bootstrap toolkit meeting history from personal vault (5 toolkit meetings) + migrate the 2 pre-overlay records in `docs/meeting-notes/` into the canonical `packages/operations/meetings/` layout. ~1.5h.

2. [onepager-and-layers](onepager-and-layers.md) — Write `docs/ORG-OS.md` (operator one-pager: what is org-os, how to `/initialize`, where to go deeper) + `docs/LAYERS.md` (per-layer status, owners, source-of-truth files, gaps). 2–3h.

3. [public-sharing-pack](public-sharing-pack.md) — Three publicly-accessible links (Master Doc Briefing, CSIS × org-os Alignment Report, KOI integration design spec) + draft sharing message for the team. Decisions resolved (docs are mirrored in this repo). ~30min.

4. [contributions-pipeline](contributions-pipeline.md) — Brainstorm catalog of other valuable contributions (Resources lift to Layer 1, frame-language audit, CSIS conformance posture, ontology V1+V2b overlay, KOI-ready frontmatter, case studies, feedback instrumentation, KOI consumer install). Triage → promote to named plans as bandwidth allows.

## Recommended sequencing

1. Plan 1 (vault-bootstrap) — fill in the meeting history
2. Plan 2 (onepager-and-layers) — make the structure usable
3. Plan 3 (public-sharing-pack) — bring the team in
4. Plans from Plan 4's Tier 1 inventory, in the order it recommends

---

## Cross-cutting context

- **Org-os overlay** — landed on the working branch `feature/org-os-overlay`. Operating from the branch directly (PR #310 closed without merge — the team's not gated on a review pass). All plans here assume the overlay is the working state.
- **Master doc** — `docs/MASTER.md` is the canonical source. Plans here support development against it; they don't supersede it.
- **KOI federation** (gated on refi-dao-os) — Plans use manual `meeting-processor` for now; designed for KOI swap once refi-dao Wave 2 ships and extracts to `org-os/packages/koi/`. See `docs/from-refi-dao/` for the design.
- **CSIS posture** — Strict in Layer 5 (Deployment), secondary in Layer 8 (Feedback). See `docs/CSIS.md` and the alignment report at `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md`.
