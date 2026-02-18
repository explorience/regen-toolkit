# Weekly Sync SOP v1

Date: 2026-02-18  
Scope: `/root/Zettelkasten/03 Libraries/regen-toolkit/integrations`  
Purpose: run a repeatable weekly integration sync across regen-toolkit, Local-ReFi-Toolkit, ReFi DAO, Regen Coordination, KOI stack, and related artifacts.

---

## Weekly cadence and roles

- Sync day: every Tuesday (UTC).
- Facilitator: integration lead (assigned in weekly planning).
- Contributors: content owner(s), crosswalk owner, QA reviewer.
- Output gate: all updates land in this `integrations/` folder before merge.

---

## 0) Pre-flight (5–10 min)

- Confirm working folder exists and is current:
  - `/root/Zettelkasten/03 Libraries/regen-toolkit/integrations`
- Confirm required files exist:
  - `ARTICLE-BACKLOG-260217.md`
  - `crosswalks/taxonomy-crosswalk-v1.md`
  - `profiles/*.md`
- Open current status board:
  - `INTEGRATIONS-STATUS-BOARD-260218.md`

---

## 1) Source scan

Goal: identify new/changed source material in connected repositories.

### Repositories to scan

- `/root/Zettelkasten/03 Libraries/regen-toolkit`
- `/root/Zettelkasten/03 Libraries/Local-ReFi-Toolkit`
- `/root/Zettelkasten/03 Libraries/ReFi DAO`
- `/root/Zettelkasten/03 Libraries/Regen Coordination`
- `/root/Zettelkasten/03 Libraries/koi-net`
- `/root/Zettelkasten/03 Libraries/koi-net-integration`
- `/root/Zettelkasten/03 Libraries/bioregionalknowledgecommons`
- `/root/Zettelkasten/03 Libraries/regen-toolkit-interface`

### Scan checklist

- New docs added this week
- Existing docs changed this week
- Deleted/renamed docs that break references
- Integration blockers resolved or newly introduced

---

## 2) Diff capture

Goal: capture meaningful deltas for integration decisions.

For each integration target, record:

- `changed-files`: exact path list
- `change-type`: added / updated / deleted / renamed
- `impact`: taxonomy / article / workflow / technical
- `action-needed`: yes/no + concrete action

Store in weekly notes file:

- `sync/WEEKLY-DIFF-LOG-<YYMMDD>.md`

Minimum section template:

```md
## <Integration Target>
- changed-files:
  - <exact path>
- change-type: <added|updated|deleted|renamed>
- impact: <taxonomy|article|workflow|technical>
- action-needed: <clear action>
```

---

## 3) Crosswalk update

Goal: keep shared taxonomy and metadata mappings current.

Update:

- `crosswalks/taxonomy-crosswalk-v1.md`

Checklist:

- Add newly observed terms only when source-backed.
- Keep canonical concept names stable unless a breaking issue is found.
- If a term conflict appears, add note in conflict section and link exact source docs.
- Mark unknowns explicitly as `unknown`.

---

## 4) Article backlog update

Goal: keep production queue aligned with latest source changes.

Update:

- `ARTICLE-BACKLOG-260217.md`

Checklist:

- Re-rank top-priority articles by readiness + impact.
- Update reason/effort/priority for immediate articles.
- Update queue status (`planned`, `packet-ready`, `drafting`, `review`, `merged`).
- Ensure each queue item points to a valid source packet file and target folder.

---

## 5) QA pass

Goal: ensure publish-ready internal docs.

### QA checks

- All referenced file paths resolve.
- No invented facts; unknowns are labeled `unknown`.
- Wording is concise and action-oriented.
- Status/readiness fields are consistent across profile, backlog, and status board.
- Markdown is clean (headings/tables render correctly).

### Quick QA script (optional)

Use shell checks for path validity before merge:

```bash
# Example pattern; adapt the path list each week
for p in \
  "/root/Zettelkasten/03 Libraries/ReFi DAO/ReFi_DAO_2.0_Specifications_Implementation.md" \
  "/root/Zettelkasten/03 Libraries/Regen Coordination/Regen Coordination Docs/ai-impactqf-regen-coordination-retrospective.md"; do
  test -e "$p" || echo "Missing: $p"
done
```

---

## 6) Merge flow

Goal: merge only after integration docs are internally consistent.

1. Final reviewer signs off QA checklist.
2. Confirm updated files:
   - `sync/` (SOP, ownership rules, weekly diff log, source packets as needed)
   - `crosswalks/`
   - `ARTICLE-BACKLOG-260217.md`
   - `INTEGRATIONS-STATUS-BOARD-260218.md`
3. Merge integration updates to main working branch following team git workflow.
4. Post-merge: trigger article drafting for all `packet-ready` queue items.

---

## Definition of done (weekly sync)

A weekly sync is complete when:

- Source scan and diff log are updated.
- Crosswalk updates are source-backed.
- Article backlog and production queue are current.
- Status board reflects current blockers and next actions.
- QA is passed with no unresolved broken paths.
