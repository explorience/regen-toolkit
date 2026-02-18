# INTEGRATIONS STATUS BOARD 260218

Date: 2026-02-18  
Scope: `/root/Zettelkasten/03 Libraries/regen-toolkit/integrations`

## Morning Handoff

### Completed overnight

- Added sync operating docs:
  - `sync/WEEKLY-SYNC-SOP-v1.md`
  - `sync/CANONICAL-OWNERSHIP-RULES-v1.md`
- Updated `ARTICLE-BACKLOG-260217.md` with:
  - Top 5 immediate articles (reason, effort, priority)
  - Production queue table with packet links and target folders
- Created 5 source packets in `sync/`:
  - `source-packet-01-bkc-toolkit-fit.md`
  - `source-packet-02-koi-toolkit-integration-paths.md`
  - `source-packet-03-governance-patterns.md`
  - `source-packet-04-taxonomy-tagging.md`
  - `source-packet-05-weekly-cross-repo-sync.md`
- Completed path-validity QA for files referenced by new docs.

### Next actions (morning)

1. Assign article owners from production queue and start Draft 1 for top 2 packet-ready items.
2. Run first weekly diff log using SOP template (`sync/WEEKLY-DIFF-LOG-<YYMMDD>.md`).
3. Validate taxonomy crosswalk against 10–15 representative docs and record adjustments.
4. Confirm Bioregional Knowledge Commons source status with maintainers; keep status `blocked` until markdown content is available.

---

## Integration target status summary

| Integration target | Status | Readiness (1-5) | Blockers | Next action | ETA |
|---|---|---:|---|---|---|
| Bioregional Knowledge Commons (`03 Libraries/bioregionalknowledgecommons`) | blocked | 1 | Local repo has no content docs (only git metadata observed). | Contact maintainers to confirm content source/replacement; rerun profile scan after first content commit. | Unknown (depends on external maintainers) |
| KOI ecosystem (`03 Libraries/koi-net`, `03 Libraries/koi-net-integration`) | prototype | 4 | Production hardening level per component is unknown. | Pick one MVP ingest→query slice and test end-to-end locally. | 1 week for MVP validation |
| Regen Coordination (`03 Libraries/Regen Coordination`) | mapping | 3 | Long-form narrative docs need consistent extraction template. | Run structured extraction pass (What/Why/How/Metrics) on 2 core docs. | 3–5 days |
| ReFi DAO (`03 Libraries/ReFi DAO`) | mapping | 3 | Potential drift between historical docs and current live process. | Build stable-vs-evolving section tags in governance/onboarding source set. | 3–5 days |
| Local ReFi Toolkit (`03 Libraries/Local-ReFi-Toolkit`) | prototype | 4 | Canonical ownership drift risk on overlapping artifacts. | Apply ownership rules during next sync and pilot one module transfer. | 1 week |
| Regen Toolkit Interface (`03 Libraries/regen-toolkit-interface`) | mapping | 3 | Index schema contract not yet explicitly versioned for expanded sources. | Draft content-index schema contract and add metadata validation gate before index build. | 1 week |

---

## Notes

- Status values aligned with integration README model: `planned`, `mapping`, `prototype`, `active`, `blocked`.
- Where evidence is incomplete, status or ETA fields are marked `unknown` rather than inferred.
