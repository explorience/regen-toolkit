---
title: "Regen Web3 Toolkit — Vault Context Bootstrap + Repo Meeting Integration"
project: regen-toolkit
date: 2026-04-25
status: completed
completed: 2026-04-26
related:
  - "../../../regen-coordination-os/docs/plans/regen-coord-vault-bootstrap.md"  # parallel plan for regen-coord
  - docs/plans/onepager-and-layers.md  # toolkit follow-up docs
  - https://github.com/explorience/regen-toolkit/pull/310  # the org-os overlay
methodology:
  - "superpowers:writing-plans (this doc)"
  - "superpowers:executing-plans (when run)"
  - "skills/meeting-processor"
---

# Plan B — Vault → Toolkit Bootstrap + Repo Meeting Integration

> **Status: completed 2026-04-26.** Executed directly on `feature/org-os-overlay` (PR #310 was closed without merge; the team operates from the branch). See completion summary at the bottom of this file.

> **Run after** PR #310 (`feature/org-os-overlay`) is merged into `explorience/regen-toolkit:main`. Either run on a follow-up branch from `main`, or extend PR #310 with these commits if reviewers prefer a single landing.

**Goal:** Make the toolkit's `packages/operations/meetings/` the canonical record of toolkit-related meetings. Source from two places:

1. **Personal vault** — toolkit-specific meetings (planning calls, check runs, kickoff)
2. **Repo's existing `docs/meeting-notes/`** — `2026-02-25.md`, `2026-03-12.md` (different format, pre-overlay)

**Why now:** The toolkit just got an org-os instance (PR #310). Without historical meetings imported, the instance starts blind to its own past — Matt's iteration cycles, Heenal's editorial decisions, Brandon's mapping infra discussions. Importing makes the dashboard, the project page, and the `MEMORY.md` reflect actual project history.

**Strategy:**
- Treat repo's existing `docs/meeting-notes/*.md` as authoritative for those dates (don't re-process from vault — they're already curated). **Migrate** them into the canonical org-os format.
- For vault-only toolkit meetings, run them through `meeting-processor` per the per-meeting workflow.
- Preserve `docs/meeting-notes/` as a redirect README (one-line "moved to packages/operations/meetings/") so existing links don't break.

**KOI integration note:** Same as Plan A. Once refi-dao Wave 2 ships sovereign sensors, the toolkit instance can run its own. This plan's outputs are RID-friendly to make sensor extraction trivial.

---

## Source meetings (inventory, 2026-04-25)

**Personal vault — toolkit-specific**
- [x] `260424 Regen Web3 Toolkit Planning Call.md` → already processed, in PR #310
- [ ] `260101 Regen Web3 Toolkit.md` (kickoff / earliest)
- [ ] `260212 Regen Web3 Toolkit Planning Call.md`
- [ ] `260312 Regen Web3 Toolkit Planning Call.md`
- [ ] `260425 Regen Web3 Toolkit Check Pack.md` (latest — post-overlay)
- [ ] `260425 Regen Web3 Toolkit Check Run.md` (latest — post-overlay)

**Repo's existing `docs/meeting-notes/`** (migrate, don't re-process)
- [ ] `2026-02-25.md` → `packages/operations/meetings/260225 <reconstructed-title>.md`
- [ ] `2026-03-12.md` → `packages/operations/meetings/260312 <reconstructed-title>.md`

  > Note: `260312` collides with the vault's "Planning Call" of the same date. **Compare both first** — likely the repo file IS the planning call (Heenal/Matt may have authored it after the meeting). If so, the vault file is duplicate raw input — keep the repo's curated version, archive the vault one with `processed_to: ...` pointing at the canonical record.

---

## Pre-flight

- [ ] **Confirm working directory:** `pwd` must be `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit`.

- [ ] **Confirm PR #310 status.** If still open, branch this work from `feature/org-os-overlay`. If merged, branch from `main`. New branch name: `feature/bootstrap-meetings-from-vault`.

- [ ] **Confirm clean git state:** `git status --short packages/operations/ docs/meeting-notes/ data/meetings.yaml memory/ MEMORY.md`.

- [ ] **Verify meeting-processor skill loaded:** `cat skills/meeting-processor/SKILL.md | head -20`.

- [ ] **Decide on the 260312 collision** (see source inventory note). Read both files, compare, present finding to operator before merging.

---

## Task 1: Migrate `docs/meeting-notes/2026-02-25.md`

- [ ] **1.1** Read `docs/meeting-notes/2026-02-25.md`. Extract: actual title (from H1 or context), date, participants, decisions, action items.
- [ ] **1.2** Write canonical record at `packages/operations/meetings/260225 <reconstructed-title>.md` per the meeting-processor template. Reference original via `source_file: docs/meeting-notes/2026-02-25.md`.
- [ ] **1.3** Add registry entry to `data/meetings.yaml`.
- [ ] **1.4** Replace `docs/meeting-notes/2026-02-25.md` with a one-line redirect: `> Moved to [packages/operations/meetings/260225 <title>.md](../../packages/operations/meetings/260225%20<title>.md). The full canonical record lives there per the org-os layout.`
- [ ] **1.5** Update project page `packages/operations/projects/regen-web3-toolkit.md` with this meeting in "Recent meetings" if recent.

## Task 2: Migrate `docs/meeting-notes/2026-03-12.md`

(Same workflow as Task 1, with the 260312 collision check from pre-flight applied.)

- [ ] **2.1–2.5** Same steps as Task 1, file path adjusted.

## Task 3: Process `260101 Regen Web3 Toolkit.md` from vault (kickoff)

- [ ] **3.1** Read source file from vault path `~/Desktop/Workspaces/Zettelkasten/260101 Regen Web3 Toolkit.md`.
- [ ] **3.2** Fix source frontmatter (`processed: true`, `processed_to: ...`).
- [ ] **3.3** Write canonical record at `packages/operations/meetings/260101 <title>.md`.
- [ ] **3.4** Add registry entry to `data/meetings.yaml`.
- [ ] **3.5** This is likely the project kickoff — update `MEMORY.md` "Organizational History" section with `[2026-01-01] Project kickoff: ...` line.
- [ ] **3.6** Append to `memory/2026-04-25.md` (or current daily log) — "Backfilled: 260101 Toolkit kickoff" entry.

## Task 4: Process `260212 Regen Web3 Toolkit Planning Call.md` from vault

(Same per-meeting workflow as Task 3.)

## Task 5: Process `260312 Regen Web3 Toolkit Planning Call.md` (if not collided with Task 2)

(Skip if Task 2's pre-flight collision check determined the repo's `2026-03-12.md` IS this planning call.)

## Task 6: Process `260425 Regen Web3 Toolkit Check Pack.md` from vault

- [ ] **6.1** Read source. Note: this is post-overlay (after PR #310).
- [ ] **6.2** Process per-meeting workflow.
- [ ] **6.3** Cross-link in `memory/2026-04-25.md` if same day.

## Task 7: Process `260425 Regen Web3 Toolkit Check Run.md` from vault

(Same as Task 6.)

## Task 8: Update HEARTBEAT.md with newly-discovered active items

- [ ] Walk through the newly-imported meeting action items. Any that are still active (not yet closed) → add to `HEARTBEAT.md` under the appropriate layer section. Avoid duplicating items already there from PR #310.

## Task 9: Regenerate schemas + validate

- [ ] **9.1** `npm run generate:schemas`
- [ ] **9.2** `npm run validate:schemas`
- [ ] **9.3** `npm run dev` quick smoke — site still builds (no Astro changes expected, but confirm)

## Task 10: Commit + PR

- [ ] **10.1** Single commit if cohesive, or one commit per logical batch (migrate / vault-import / heartbeat).
- [ ] **10.2** Push branch.
- [ ] **10.3** Open PR with title: `feat: bootstrap toolkit meeting history from vault + repo meeting-notes`. Body links to this plan + lists files added.

---

## Acceptance criteria

- [ ] All 5 vault toolkit meetings processed (or flagged as duplicates with explicit decision logged)
- [ ] Both `docs/meeting-notes/*.md` files migrated to canonical location with redirects
- [ ] `data/meetings.yaml` reflects all imported meetings
- [ ] Project page has accurate "Recent meetings" history
- [ ] `MEMORY.md` "Organizational History" reflects project kickoff and major iterations
- [ ] HEARTBEAT.md has any newly-discovered active items
- [ ] Schemas regenerate, validation passes
- [ ] PR opened (or commits added to PR #310 if not yet merged)

---

## Out of scope

- Re-curating the existing `docs/meeting-notes/` records — they stay as they are; only their *location* in the canonical layout changes.
- Backfilling pre-2026-01 meetings — toolkit project effectively starts then.
- Building a meeting search UI — separate plan if desired.

---

## Estimated effort

- 5 vault meetings (avg 10 min) + 2 repo migrations (15 min each) + heartbeat reconciliation (15 min) = **~1.5 hours**

---

## References

- Plan A (parallel): `docs/plans/regen-coord-vault-bootstrap.md`
- Skill: `skills/meeting-processor/SKILL.md`
- Pattern: `packages/operations/meetings/260423 Regen Web3 Toolkit Planning Call.md`
- PR: https://github.com/explorience/regen-toolkit/pull/310
- KOI gate: `memory/koi_intake_blocked_on_refi_dao.md`

---

## Completion summary (2026-04-26)

**Processed into `packages/operations/meetings/`:**
- `260115 Greenpill Toolkit Planning Call (Kickoff).md` *(beyond original inventory — actual project kickoff)*
- `260129 Greenpill Toolkit Planning Call (GitHub Workflow).md` *(beyond inventory)*
- `260212 Regen Web3 Toolkit Planning Call.md`
- `260225 Regen Toolkit Restructure + AI Pipeline Sync.md` *(migrated from `docs/meeting-notes/2026-02-25.md`)*
- `260312 Regen Toolkit — Funding + Pipeline Sync.md` *(merged `docs/meeting-notes/2026-03-12.md` with vault `260312 Regen Web3 Toolkit Planning Call.md` — collision resolved by treating repo file as canonical curated record; vault retained as raw transcript reference per its redirect note)*
- `260423 Regen Web3 Toolkit Planning Call.md`

**Migrated with redirect stubs:**
- `docs/meeting-notes/2026-02-25.md` → one-line redirect
- `docs/meeting-notes/2026-03-12.md` → one-line redirect

**Inventory deviations:**
- `260101 Regen Web3 Toolkit.md` — NOT a meeting; it's a project status/roadmap doc. Skipped.
- `260425 Regen Web3 Toolkit Check Pack.md` and `260425 Regen Web3 Toolkit Check Run.md` — these files do not exist in the vault. Skipped.

**Verifications:**
- `data/meetings.yaml` — registry entries present (5 meetings reported by `generate-all-schemas`)
- `npm run generate:schemas` — re-run idempotently (no diff)
- `npm run validate:schemas` — passes
- `HEARTBEAT.md` — historic carryovers from backfilled meetings surfaced under "Active Tasks → Historic carryovers" + 2026-04-26 backfill entry under Recently Completed
- `MEMORY.md` — Organizational History reflects project kickoff and major iterations

**Acceptance:** All criteria met (vault meetings processed or flagged; both `docs/meeting-notes/*.md` migrated with redirects; `data/meetings.yaml` populated; project page has "Recent meetings" history; MEMORY.md updated; HEARTBEAT.md reconciled; schemas pass validation).
