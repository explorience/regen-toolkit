# T3b — Full Canonical_DB Ingestion (implementation plan)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Checkbox steps.
> **Sequenced:** after the Jul 16 call + operator go. Depends on T4 (done — `relationship-record`, `person`, `organization` schemas + status axes now exist, so nothing needs parking).

**Goal:** Ingest the full curated Canonical_DB (~2,689 rows across 6 families) through the framework machine into `kb-handoff/`, guided by Matty's normalization sheets — the real migration behind the T3a prototype slice. Then selectively promote from Discovery_Pool. All `raw`/review-gated.

**Working dir:** `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit`. ⚠️ Vault safety; scoped `git add`; never touch `docs/RKC_Handoff_…/` (read-only) or `docs/MASTER.md`.

**Precedent:** the T3a slice (`data/kb/_handoff-slice-manifest.yaml`, the 4 T3a runners, `docs/reports/2026-07-15-handoff-slice-diff.md`). Same method, full row counts, plus the two schemas T4 added.

**Source (read-only):** `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/02_Core/Canonical_DB.xlsx` — 6 import sheets per its `Sheet Role Registry`; normalization config sheets guide typing + dedup; annexes A03–A14 are redundant → skip.

---

## Phase 0 — Extract + manifest

- [ ] **Export the 6 canonical-input sheets (full) to CSV** via python+openpyxl → `.tmp/handoff-full/families/`: Source-System Cards (67) · New Objects (878) · Option Candidates (345) · Claims and Cautions (504) · Implementation Memory (341) · Relationship Leads (554). Export the normalization config (Object Type Crosswalk 549, Relationship Predicate Map 340, Controlled Vocabularies 44, Normalization Flags 87) → `.tmp/handoff-full/_norm/`. (Reuse the T3a export script shape.)
- [ ] **Write `data/kb/_handoff-full-manifest.yaml`** — full row counts, target `kb-handoff/` (append to the 146 already there OR a fresh rebuild — decide + record; recommend fresh: clear `.workorders` handoff WOs first or use new WOs), the schema mapping per family (now incl. Relationship Leads → `relationship-record`, person/org New-Object rows → `person`/`organization`).

## Phase 1 — Prepare + ingest by family (subagent-driven)

- [ ] **`ingest prepare .tmp/handoff-full/families`** → 6 work orders. Verify.
- [ ] **Dispatch runners** (partition big families across several runners each — New Objects 878 is the largest; ~5 runners of ~175, or chunk). Each runner maps rows → typed candidates guided by the config:
  - Source-System Cards → `source-system` (use the new `organization`/`movement`/`platform` type values where they fit — no more defaulting everything to `directory`).
  - New Objects → typed via Object Type Crosswalk: Concept→`concept-lineage`; Tool/Resource/Project→`resource`; **Person→`person`; Organization/Network→`organization`** (T4 schemas); Publication/Media→`resource`; Claim→`claim-evidence`; Option→`option-entry`.
  - Option Candidates → `option-entry` (infer `category`; flag inferred ones for review).
  - Claims and Cautions → `claim-evidence` (preserve caution/safe-working-language; set `evidence_stance` where the row implies supporting/qualifying/contradicting).
  - Implementation Memory → `implementation-record` with `record_stage: prospective` for candidate rows (T4 field).
  - **Relationship Leads → `relationship-record`** (subject/predicate/object; predicate via the Relationship Predicate Map; evidence/scope from Evidence/Scope; `source_lineage` = Source URL; confidence + review honored). No longer parked.
  - Born-rules on every object (raw · ai_assisted · provenance.origin = `Canonical_DB.xlsx#<sheet>!row<N>`). Preserve Matty's exact text + canonical/RKC IDs. High-risk rows → `high_risk: true` + a paired `public-use-boundary` (`requires-domain-review` tier now available).
  - Honor `Normalization Flags` (87 dup-flags) — let the B5 guard preserve collisions + report them; note where B5 (title-level) and Matty's flags (alias/fuzzy) diverge.
- [ ] **Verify** all work orders `accepted`; re-dispatch any stuck with `error_notes`.

## Phase 2 — Store + reconcile

- [ ] **`store --adapter kb-folder --target kb-handoff`**; verify the index jump (~2,689+ objects) + the B5 collision count (vs Matty's 87 flags). Commit `kb-handoff/` + `.workorders/`.
- [ ] **Migration manifest** — write `docs/reports/<date>-canonical-migration-manifest.md`: every family's row-count → object-count, the collisions, the high-risk/boundary count, and (Guide DoD #15) confirm every canonical row has a destination/deferral/exclusion reason. This is a Guide §10 return deliverable.
- [ ] **Refresh `/handoff` page** numbers + push (draft-and-present before deploy).

## Phase 3 — Discovery_Pool (Zone A, promotion-gated)

- [ ] **Discovery_Pool** (`All Objects Registry`, 4,951 leads, `RKC-#####` IDs) is Zone A — do NOT bulk-ingest. Use the candidate-routing flags (`source_system_candidate`, `option_library_candidate`, etc.) + the Priority Working Set to select a first promotion batch (Guide §8 sequence step 9). Promote selectively: match → classify → source-verify → route → ingest. Keep it small + reviewed.

## Out of scope
The master-narrative refactor (Matty's lane) · the human review pass (separate, operator-gated) · annexes (redundant).

## Definition of done
Every Canonical_DB row from the 6 families accounted for (ingested / deferred / excluded-with-reason) in the migration manifest; `kb-handoff/` holds the full typed corpus, all `raw`; the B5-vs-Matty-flags reconciliation is documented; a bounded Discovery_Pool promotion batch is in.
