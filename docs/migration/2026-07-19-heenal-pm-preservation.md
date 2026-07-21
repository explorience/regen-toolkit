# Preserving Heenal's GitHub PM System Through the Repo Migration

**Date:** 2026-07-19 · **Author:** Luiz (agent-assisted) · **Status:** draft-and-present — read-only investigation, nothing on Heenal's repo was mutated.
**Scope:** make sure Heenal's project-management work survives the planned migration of the toolkit repo into the **Regen Coordination** GitHub org.

> **TL;DR** — The canonical PM repo is **`explorience/regen-toolkit`** (Heenal's user account), not `origin` in any other sense — `origin` already points there. It holds **234 open issues** (one per article), a **50-label taxonomy** (status / track / path / priority / source), **26 issue-comment threads**, **0 milestones**, **5 PRs**, and **one Projects v2 board — #2 "Regen Toolkit"** (public, 234 items). A GitHub repo transfer preserves the issues/labels/comments/PRs **automatically**. The **one artifact at real risk is the Projects v2 board** — it's owned by the *account*, not the repo, so it does **not** move in a transfer and must be migrated separately. A full metadata backup of issues + labels + PRs + **the board (items + field schema)** is saved locally as a safety net (§4).
>
> **Update 2026-07-19 (board confirmed):** after granting `read:project`, the board was enumerated. It has **one** board only, and its **Status field is all `Todo`, unchanged since 2026-03-26** — so the *live* article status lives in the `status:*` **labels** (which transfer with the repo), and the board's unique value is its **Section** field (curriculum sections 1.x/2.x/3.x). Both are now backed up.

---

## 1 · Where the PM work actually lives (owner confirmation)

The handoff prompt flagged an ambiguity ("`explorience/regen-toolkit` is `origin` but the meeting says the canonical is Heenal's account"). Resolved:

- **`origin` = `explorience/regen-toolkit` = Heenal's account.** These are the same repo. `explorience` is a **User** account (created 2021-12-07), and it authored **all 234 issues**. There is no separate "Heenal repo" elsewhere — `explorience` *is* it.
- It is a **root repository, not a fork** (`fork: false`, `parent: null`).
- It has **3 forks**, all with **0 issues** of their own:
  - `luizfernandosg/regen-toolkit` — Luiz's fork (the dev-instance / GitHub Pages deploy target).
  - `zhaog100/regen-toolkit`
  - `cauetomaz/regen-toolkit-gpbr`
- So **100% of the PM surface is on `explorience/regen-toolkit`.** Nothing PM-relevant is stranded on a fork.

## 2 · Inventory (as of 2026-07-19)

| Artifact | Count | Notes |
|---|---:|---|
| **Open issues** | **234** | One per article: body = `**File:** src/content/docs/<slug>.md` + Research/Write/Review/Publish checklist |
| Closed issues | 0 | Completion is tracked by the **`status:*` labels**, not by closing issues or by the (stale) board |
| **Issue comment threads** | 26 (27 comments) | The "issue logs" — includes contributions from `MattyCompost`, `ReFiDAO` |
| Open PRs | 1 | |
| Closed/merged PRs | 4 | |
| **Labels** | **50** | Full taxonomy below |
| Milestones | 0 | None in use |
| Classic Projects (repo) | 0 | REST returns 404 — none exist |
| **Projects v2 (board)** | **1** | Board **#2 "Regen Toolkit"** — public, 234 items, all issue-linked, last updated 2026-03-26. Status all-`Todo` (stale); Section field 1.x–3.x populated. **The one artifact that won't auto-transfer — see §5** |
| Assignees in use | `explorience` (6), `ReFiDAO` (4) | Minimal assignment |

**Label taxonomy (families, by issue coverage):**

- `status:*` (224 label-uses) — `placeholder` (220), `drafting`, `review`, `published`. **This is the real workflow-state field** (issues stay open regardless).
- `track:*` (223) — `1-foundations` (70), `2-applied` (85), `3-playbooks` (68).
- `path:*` (186) — the **5 critical paths**: `greenpill-london` (48), `huron-university` (42), `silvi-protocol` (40), `forest-city` (35), `sarreya` (21).
- `source:*` (404) — ~20 provenance labels (`source:original` 131, `refi-dao-local-refi-toolkit` 76, `bankless-academy` 40, …).
- `priority:*` (17) — `tier-1`/`tier-2` + `high`/`medium`/`low` (lightly used).
- Default GitHub labels (bug, enhancement, …) — mostly unused.
- Only **5 of 234 issues have no labels.**

This taxonomy **is** Heenal's PM system — losing it would lose the mapping of every article to its track, its critical path, its source provenance, and its production status.

## 3 · What a GitHub repo transfer preserves (and what it doesn't)

Transferring `explorience/regen-toolkit` → `regen-coordination/regen-toolkit` (User → Org) via GitHub's built-in **Settings → Transfer ownership**:

**Preserved automatically (moves with the repo — repo-owned data):**
- ✅ All **issues** + their bodies, **comments/logs**, **labels on each issue**, assignees*, timestamps, issue numbers.
- ✅ The **label taxonomy** itself (all 50 labels, colors, descriptions).
- ✅ **Milestones** (none here, but they would move).
- ✅ **Pull requests**, branches, commit history, tags, releases, wiki.
- ✅ **Redirects**: the old URL and `git remote` URLs redirect to the new location; existing clones keep working until re-pointed.
- ✅ Fork relationships are preserved (the network is re-pointed, not destroyed).

*\*Assignee caveat:* if an assignee is not a member of the destination org, GitHub may drop that assignment on transfer. `ReFiDAO` and `explorience` should be confirmed as members/collaborators of the RC org **before** transfer.

**NOT preserved automatically (must be handled separately):**
- ❌ **Projects v2 boards.** A Project (v2) is owned by the **user or org account**, *not by the repo*. Transferring the repo does **not** move any board that lives under `explorience`. The issues still exist after transfer, but a board under `explorience` will still be under `explorience` (and its items keep pointing at the now-redirected issues). To bring the board into the RC org you must **re-create or migrate it** (GitHub has no one-click "change project owner"). See §5.
- ⚠️ **Cross-account permissions:** the person performing the transfer needs **admin on the source repo** and **repo-creation rights in the destination org**. A repo of the same name must not already exist in the RC org, or the transfer is blocked.
- ⚠️ **Pages / deploy hooks / secrets** are not the subject here, but note the current live site deploys from Luiz's fork, independent of this transfer.

## 4 · Backup safety net (already created, local, read-only source)

Saved to **`docs/migration/heenal-pm-backup-2026-07-19/`** (in *this* repo, not Heenal's):

| File | Contents |
|---|---|
| `issues.json` | All 234 issues — number, title, **body**, state, labels, assignees, milestone, author, timestamps, url, **and all comment threads (with bodies)** |
| `labels.json` | All 50 labels — name, description, color (enough to fully **recreate the taxonomy** anywhere) |
| `pulls.json` | All 5 PRs — number, title, state, author, merge/close timestamps, labels |
| `project-2-items.json` | **Board #2** — all 234 items + field values (Status, Section, Priority, Size, dates) + issue linkage |
| `project-2-fields.json` | **Board #2** field schema — the 20 fields (Section 1.1–3.6, Status Todo/In progress/Done, Priority P0–P2, Size XS–XL, Iteration, dates) |

This is a point-in-time snapshot. It is a **safety net**, not the migration mechanism — the transfer (§3) is the mechanism; this backup is what lets us rebuild if anything goes wrong. Re-run the export commands in the backup `README.md` to refresh it just before the transfer.

## 5 · The Projects v2 board — confirmed, and the one thing to get right

**Confirmed (2026-07-19, via `read:project`):** `explorience` has exactly **one** board — **#2 "Regen Toolkit"** (`https://github.com/users/explorience/projects/2`), **public**, **234 items** (all linked to the repo's issues), created 2026-01-14, **last updated 2026-03-26**. Field schema (20 fields): standard GitHub fields + custom **Status** (Todo / In progress / Done), **Priority** (P0–P2), **Size** (XS–XL), **Estimate**, **Iteration**, **Start/Target date**, and **Section** (curriculum sections 1.1–1.10, 2.1–2.14, 3.1–3.6).

**Key nuance — the board is a structural container, not the live tracker:**
- Its **Status field is `Todo` for all 234 items** and the board hasn't been touched since **March 2026**. So earlier speculation that completion is tracked by moving cards is **wrong** — the *live* production status lives in the `status:*` **labels** (`placeholder`/`drafting`/`review`/`published`), which **transfer with the repo automatically**.
- The board's genuinely unique data is the **Section** field (1.x/2.x/3.x curriculum placement), which is **not** encoded in any label. That mapping is the thing worth preserving from the board specifically — and it's now captured in `project-2-items.json`.

**Why it still won't auto-transfer:** a Projects v2 board is owned by the **account** (`explorience`), not the repo. Transferring the repo leaves board #2 under `explorience`; its items keep pointing at the (redirected) issues, but the board itself stays on the personal account.

**Migration options (recommendation):**
1. **Recreate in the RC org + re-link items (recommended clean end-state).** `gh project copy 2 --owner explorience --target-owner regen-coordination --title "Regen Toolkit"` duplicates the *structure/fields* but **not items**; then a short GraphQL script re-adds the 234 transferred issues and sets their **Section** values from `project-2-items.json`. Do this *after* the repo transfer so the issues live in the org.
2. **Leave the board under `explorience`, add the org as collaborator.** Simplest, zero data loss, but governance stays on a personal account — defeats the migration intent.
3. **Rebuild fresh from labels.** Because the board is stale and Status/Priority are unused, the team may decide the **labels are the source of truth** and stand up a new org board seeded from label state, treating `project-2-items.json` only as the Section-mapping reference. Lightest ongoing maintenance.

There is no native "change project owner," so all paths are copy-structure + re-add-items — the backup makes any of them safe.

## 6 · Status of the earlier gap — CLOSED

The token gap flagged in the first pass is resolved: `read:project` was granted to the local `gh` (`luizfernandosg`), board #2 was enumerated and fully backed up (§4). No outstanding read is blocked. The **issues page** is public (anonymously readable); the **board page** required login (now read via the authorized token). Nothing on Heenal's account was modified — all reads.

## 7 · Carry-over runbook (do nothing destructive; Heenal drives the transfer)

**Pre-transfer**
1. ✅ **Backup taken** (§4) — issues, labels, PRs, **and board #2 (items + fields)**. Refresh right before the transfer (re-run export commands).
2. ✅ **Projects v2 board confirmed + backed up** — one board (#2 "Regen Toolkit"), captured in `project-2-items.json` / `project-2-fields.json`.
3. ☐ **Confirm destination**: RC org exists, no repo named `regen-toolkit` already there, and the transferrer has create-repo rights.
4. ☐ **Confirm collaborators** (`explorience`, `ReFiDAO`, and any assignees) are members of the RC org so assignments survive.
5. ☐ **Decide the board end-state** with Heenal (§5 option 1 recreate-in-org / 2 leave-as-is / 3 rebuild-from-labels). Given the board is stale and label-driven, option 1 or 3 is likely.

**Transfer (Heenal performs — it's her repo)**
6. ☐ Settings → **Transfer ownership** → destination = RC org. Issues, labels, comments, PRs, milestones, history + redirects move automatically.

**Post-transfer**
7. ☐ Verify issue count (234), label count (50), and comment threads (26) on the new repo match the backup.
8. ☐ **Migrate/relink board #2** per the chosen option (§5) — `gh project copy` the structure into the org, then re-add the transferred issues and restore **Section** values from `project-2-items.json`.
9. ☐ Re-point remotes: `origin` (and Luiz's `fork` upstream) to the new URL. Redirects keep old ones working, but update them.
10. ☐ Reconnect the production Pages/Vercel deploy to the new repo location (separate task, already on Heenal's asks list).
11. ☐ Sanity-check that the 3 forks (incl. Luiz's dev-instance fork) still track correctly.

---

**Bottom line for the team:** a repo transfer is safe for ~95% of Heenal's PM work — issues, the whole label taxonomy, comment logs, and PRs all carry over with redirects. The **only** thing that needs deliberate handling is a **Projects v2 board**, and we can't yet confirm it exists from this machine (token scope). One command or one question to Heenal closes that gap. The backup in `docs/migration/heenal-pm-backup-2026-07-19/` means that even in a worst case, the issue/label data is recoverable.
