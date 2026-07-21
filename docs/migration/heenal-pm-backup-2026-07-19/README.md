# Backup — Heenal's GitHub PM system (`explorience/regen-toolkit`)

**Snapshot date:** 2026-07-19 · **Source:** `explorience/regen-toolkit` (read-only; nothing on the source repo was modified).
**Purpose:** safety net before the repo migration to the Regen Coordination org. See the full analysis + runbook in [`../2026-07-19-heenal-pm-preservation.md`](../2026-07-19-heenal-pm-preservation.md).

## Contents

| File | What it is | Count |
|---|---|---:|
| `issues.json` | All issues — body, state, labels, assignees, milestone, author, timestamps, url, **+ full comment threads (bodies)** | 234 |
| `labels.json` | Full label taxonomy — name, description, color | 50 |
| `pulls.json` | All pull requests — number, title, state, author, merge/close dates, labels | 5 |
| `project-2-items.json` | Projects v2 board **#2 "Regen Toolkit"** — all items + field values (Status, Section, Priority, Size, dates) + issue linkage | 234 |
| `project-2-fields.json` | Board #2 field schema — the 20 fields incl. the Section (1.1–3.6) and Status (Todo/In progress/Done) single-selects | 20 |

**Projects v2 status (captured 2026-07-19, after granting `read:project`):** `explorience` has exactly **one board — #2 "Regen Toolkit"** (public, 234 items, all linked to issues, last updated 2026-03-26). Its **Status field is all `Todo` and stale since March** — the *live* production status lives in the `status:*` **labels**, not the board. The board's unique value is the **Section** field (curriculum sections 1.x/2.x/3.x), which is not encoded in labels.

## How to refresh this snapshot (run just before the transfer)

```bash
cd <repo-root>
BK="docs/migration/heenal-pm-backup-2026-07-19"
gh issue list --repo explorience/regen-toolkit --state all --limit 1000 \
  --json number,title,body,state,labels,assignees,milestone,author,createdAt,updatedAt,closedAt,url,comments \
  > "$BK/issues.json"
gh label list --repo explorience/regen-toolkit --limit 200 \
  --json name,description,color > "$BK/labels.json"
gh pr list --repo explorience/regen-toolkit --state all --limit 200 \
  --json number,title,state,author,createdAt,mergedAt,closedAt,url,labels > "$BK/pulls.json"
# Projects v2 board #2 (needs read:project scope: gh auth refresh -s read:project)
gh project item-list 2 --owner explorience --format json --limit 500 > "$BK/project-2-items.json"
gh project field-list 2 --owner explorience --format json --limit 100 > "$BK/project-2-fields.json"
```

## How to restore, if ever needed

- **Labels** into any repo:
  ```bash
  python3 -c "import json;[print(l['name']+'\t'+l['color']+'\t'+(l['description'] or '')) for l in json.load(open('labels.json'))]" | \
  while IFS=$'\t' read -r name color desc; do
    gh label create "$name" --color "$color" --description "$desc" --repo <target> 2>/dev/null || \
    gh label edit "$name" --color "$color" --description "$desc" --repo <target>
  done
  ```
- **Issues**: prefer the native repo **transfer** (keeps numbers, comments, history, redirects). Recreating from `issues.json` loses original numbers/authorship and should only be a last resort.
