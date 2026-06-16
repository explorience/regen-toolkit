# Resource Database — Regen Knowledge Commons Resource DB V3 (2026-06-13)

Matty's authoritative resource aggregation, shared + walked through in the [2026-06-15 work session](../../docs/reports/2026-06-15-toolkit-worksession-matty-integration-report.md) and the [2026-06-04 biweekly](../../packages/operations/meetings/260604%20Regen%20Web3%20Toolkit%20Planning%20Call.md). This **supersedes** the April mechanical lift in [`../resources.yaml`](../resources.yaml) (738 entries from the old master doc) as the source of truth for the Resource Graph (Layer 3).

> **Status: staged, not yet integrated.** The data is preserved here in committable form. The structured lift into the org-os data model is a planned next step (see Integration plan below) — it was deliberately NOT done blind in the intake pass.

## Files

- `source/Regen-Knowledge-Commons-Resource-Database-V3-2026-06-13.xlsx` — the original workbook (1.1 MB, 28 sheets), as Matty shared it. Binary; the CSVs below are the diffable form.
- `csv/<sheet>.csv` — every sheet exported to UTF-8 CSV (12,456 rows total). Regenerate with the export step in `memory/2026-06-16.md`.

## What it is (from the workbook's own README)

> "Regen Knowledge Commons Raw Database **v0.3** — expansive typed workbook. **Raw, expansive, review-pending.** Inclusion means potentially relevant for routing/review, **not endorsement or public guidance.**"

Caveats the DB states about itself (these are load-bearing — carry them into any integration):
- **People/account rows are raw leads** — must not become public profiles without review.
- **Social signals are not endorsements** (much of it is parsed from a `tweets.js` X archive — retweets ≠ endorsement).
- **Podcast claims are not verified knowledge.**
- **Adjacent (AI-suggested) expansion** is marked raw / needs-verification and kept separate from explicit extraction.

## Sheet inventory (28 sheets, 12,456 rows)

**Index / crosswalk**
- `unified-index` (2,617) — search/discovery index across all typed tabs (`global_id`, `name`, `primary_type`, `tab_location`, `url`, `source_origin`, `source_signal_count`).
- `toolkit-layer-crosswalk` (2,617) — **the integration key.** Maps every unified-index entry to a `toolkit_route` + `review_status`. Distinct routes (cleaned): Resource Graph (1,744), Social Signal Review (622), People/Account Review (64), Source System Candidate (36), Media Source System Track (19), Option Library (15), Source System Card (13), Structural Integrity Review (5), Public Goods Builder Track (3), Implementation Memory Candidate (3), … *(some rows carry tweet-text noise in this column — clean during the lift).*
- `summary`, `readme`, `review-queues`, `expansion-map`.

**Typed entities**
- `resource-registry` (1,759) — the v0.2 registry preserved (`resource_id`, `category`, `resource_name`, `author_org`, `resource_type`, `url`, `priority`, `tags`).
- `people-accounts` (686) · `organizations-networks` (256) · `projects-initiatives` (702) · `tools-protocols-platforms` (288) · `funding-mechanisms-capital` (30) · `books-papers-articles` (294) · `podcasts-media-shows` (59) · `episodes-talks-recordings` (12) · `events-gatherings` (45) · `repositories-codebases` (36) · `datasets-maps-directories` (19) · `concepts-frameworks` (149).

**Layer-candidate sheets (map onto the architecture)**
- `source-system-candidates` (123) → **L3** source systems (need source-system cards: steward, attribution, reuse, return path).
- `concepts-frameworks` (149) → **L4** Concept & Idea Ecology.
- `option-library-candidates` (59) → **L5** Option Library.
- `track-candidates` (104) → **L7** Tracks & Composition.
- `implementation-candidates` (720) → **L8** Implementation & Learning Memory.
- `claims-evidence-leads` (8) · `white-spaces-research` (12) — review/research surfaces.

**Raw layers (kept separate, review-pending)**
- `social-signals-raw` (1,372) — X archive signals (not endorsements).
- `podcast-extraction-raw` (68) · `urls-domains-raw` (365) — repeated domains become source-system candidates.

## Review queues (the DB's own safeguard routing — maps to master-doc §16 + CSIS)

| Queue | Reason | Suggested route |
|---|---|---|
| People & Account Leads | public-profile caution | People Review |
| Podcast Claims | guest claims ≠ verified knowledge | Media Safeguards |
| **Indigenous / TEK / local knowledge** | needs consent/context, possibly Local Contexts review | **Public-Use Boundary** |
| Open-source tooling leads | license / repo activity / maintenance / security review | Builder Safeguards |
| Carbon/ReFi claims | high-risk impact/MRV claims need evidence | dMRV / Structural Integrity |
| AI-suggested adjacent expansion | separate from explicit extraction | Review Queue |
| Source-system candidates | need cards (steward, attribution, reuse, return path) | Source System Cards |

> The **Public-Use Boundary** + **Source System Card** queues line up directly with open [`docs/BACKLOG.md`](../../docs/BACKLOG.md) items — this DB is the data those tasks operate on.

## Integration plan (NOT done yet — proposed)

1. **Crosswalk-driven lift.** Use `toolkit-layer-crosswalk.csv` (`toolkit_route`) to route entries into the org-os data model: Resource Graph → `data/resources.yaml` (replacing/superseding the April lift); Source System Candidates → a new `data/source-systems.yaml` (L3); Option Library Candidates → cross-walk against `data/option-library.yaml` (L5); Concepts → L4; Tracks → `data/tracks.yaml` (L7); Implementation → L8.
2. **Carry the review state.** Preserve `review_status` + the review-queue routing as a `maturity`/`review` field; do NOT silently promote raw leads to clean entries. Honor the "not endorsement" caveats.
3. **Clean the crosswalk noise** (tweet text leaked into a few `toolkit_route` cells).
4. **De-dupe** against existing `data/resources.yaml` and the master doc §7 inventory.
5. **Brandon's curation pass** (long-standing HEARTBEAT item) operates on the lifted result, not the raw sheets.

This is sized as its own work session and is part of the **convergence** plan, not the intake. See `memory/2026-06-16.md` + the integration report.

---

_Staged 2026-06-16. Source: Matty's "Regen Knowledge Commons Resource Database V3 June 13th" (Google Sheet → xlsx)._
