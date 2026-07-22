# Canonical_DB Migration Manifest — T3b Full Ingestion

> **Date:** 2026-07-21 · **Plan:** [`handoff-integration`](../plans/handoff-integration.md) T3b · sub-plan [`2026-07-15-t3b-full-ingestion.md`](../plans/handoff-integration/2026-07-15-t3b-full-ingestion.md)
> **Guide return deliverable:** §10 migration manifest + Definition-of-Done #15 (every canonical row accounted).
> **Status:** all objects `raw` / review-gated. Nothing promoted or published.

The full curated Canonical_DB (Matty's July handoff) run through the framework machine — the real
migration behind the T3a prototype slice, now on the T4 schemas (`relationship-record`, `person`,
`organization`). Deterministic crosswalk-driven ETL (the framework's own `lift.mjs` pattern +
Matty's normalization config as lookup tables), validated by the framework's accept gate.

**Source (read-only):** `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/02_Core/Canonical_DB.xlsx` · `Discovery_Pool.xlsx`
**Target:** `kb-handoff/` (kb-folder adapter) — kept distinct from the 722-object article corpus (`data/kb/`) per Matty's Database_Spec ("do not collapse into one universal table").
**Work orders:** `.workorders-handoff-full/` (isolated from the T3a slice + the self-ingestion WOs, for clean row→object accounting).
**Pipeline:** `export-handoff-full.py` → `map-handoff-full.mjs` → `ingest prepare/accept` → `store` → `map-discovery-priority.mjs`.

---

## 1 · Row → object accounting (DoD #15: every row has a destination)

### Canonical_DB — 6 import families (2,689 rows → 2,957 objects)

| Family | Rows | → Primary schema(s) | Objects | Paired boundaries |
|---|---:|---|---:|---:|
| Source-System Cards | 67 | `source-system` (67) | 67 | 16 |
| New Objects | 878 | `resource` 591 · `concept-lineage` 111 · `person` 110 · `organization` 66 | 878 | 163 |
| Option Candidates | 345 | `option-entry` (345) | 345 | 20 |
| Claims and Cautions | 504 | `claim-evidence` (504) | 504 | 32 |
| Implementation Memory | 341 | `implementation-record` (341, `record_stage: prospective`) | 341 | 18 |
| Relationship Leads | 554 | `relationship-record` (554) | 554 | 19 |
| **Total** | **2,689** | | **2,689 primary** | **268** |

**Every canonical row → exactly one primary object (1:1). None dropped, deferred, or excluded.**
Boundaries are *paired* objects (persons → consent gate; high-risk content → domain-review gate), not row substitutes.

New Objects typing follows Matty's **Object Type Crosswalk** (549 rows) → canonical class → framework
schema: Person→`person`, Organization/Network→`organization`, Concept→`concept-lineage`,
Claim→`claim-evidence`, Option→`option-entry`, everything else (Tool/Program/Source-System/Case/
Governance-Mechanism/Publication)→`resource`. 72 rows had an object type not in the crosswalk →
keyword-inferred + flagged `review_needs`.

### Discovery_Pool — bounded promotion (Zone A, promotion-gated)

Matty's curated **Priority Working Set** (114 rows) only — **NOT** the 4,951-row `All Objects Registry`
(intentionally left as Zone A leads, not bulk-ingested).

| Disposition | Rows | Note |
|---|---:|---|
| Promoted → typed objects | 98 | `source-system` 35 · `claim-evidence` 22 · `option-entry` 20 · `resource` 8 · `concept-lineage` 6 · `implementation-record` 4 · `person` 3 (+ 3 boundaries) |
| Deferred — already canonical | 11 | matched an existing canonical title (e.g. Gitcoin/Giveth/Octant) — not re-promoted (the "match" step) |
| Excluded — workbook-meta | 5 | extraction packages / expansion batches / workbook updates — process rows, not knowledge content |
| **Priority Working Set total** | **114** | |
| Remaining pool (Zone A) | 4,837 | deferred by design — promotion-gated, not ingested |

### Grand total

**`kb-handoff/` = 3,058 objects** — 2,787 primary `raw` (2,689 canonical + 98 discovery) + 271 public-use-boundaries. 3,058 files on disk = 3,058 objects (zero loss).

---

## 2 · B5 overwrite guard vs Matty's 87 normalization flags

The framework's **B5 guard** (same title-slug + different content → never clobber; write hash-suffixed
+ report) ran automatically over the corpus:

- **42 title-level collision sets** (90 objects; 50 B5-suffixed files) caught in the canonical corpus.
- Example: `mutual-aid-disaster-relief ×2`, `fensuagro ×2`, `cloc-la-vía-campesina ×2` — these **are**
  Matty's hand-flagged exact duplicates (`DUP-SO-26` rows 26/68, etc.). **The machine independently
  re-derived the duplicates Matty flagged by hand.**

**Matty's 87 flags** break down as: 31 *exact normalized duplicate* · 50 *schema repair* · 6 other
(classification / dedup / maturity / predicate / type / architecture). **98 objects** carry a
`normalization_flag: <ID>` annotation (linked back to Matty's flag + normalized identity).

**Divergence (documented, not merged):**
- **B5 (title-slug, exact):** catches same-normalized-title collisions across the whole corpus,
  including pairs Matty didn't flag.
- **Matty (alias/fuzzy + schema-repair):** catches semantic duplicates with *different* surface titles
  (B5 can't see these) and non-dedup repairs (schema/classification).
- **Neither is a superset.** Both preserved; collisions are hash-suffixed (not merged) and left for the
  human review-promote gate. No automatic merging — Matty's rule (§Duplicate Conflict Workflow: "merge
  only after review") is honored.

---

## 3 · Born-rules, provenance, safety (Principles 1, 8, 14)

- **Born-rules on every primary object:** `maturity: raw` · `ai_assisted: true` · `provenance.origin =
  Canonical_DB.xlsx#<Sheet>!row<N>` (or `Discovery_Pool.xlsx#Priority Working Set!<RKC-ID>`). Enforced
  by the accept gate — all 3,058 passed.
- **Matty's exact text preserved** verbatim in description/notes/claim/evidence fields; canonical IDs +
  source URLs retained as `source_lineage`.
- **Review burden surfaced honestly:** 1,146 objects carry `review_needs` (inferred types/categories,
  the 248 `review_needed` predicate-map sentinels normalized from the original verb, source-verify
  prompts). 168 objects flagged `high_risk`.
- **Public/private discipline (Matty's caveat + Principle 8):** 271 `public-use-boundary` objects —
  **every named `person` → `never-publish-without-consent`**; genuinely sensitive content
  (surveillance / indigenous data / at-risk communities / activists / …) → `requires-domain-review`.
  **Nothing from the handoff reaches a public view without the review-promote gate.**
- **Relationships (Matty's Core Decision #3, the T3a parked gap):** all 554 Relationship Leads now land
  as first-class `relationship-record` edges (subject–predicate–object + evidence/scope/direction),
  predicate via Matty's Predicate Map; the 248 `review_needed` sentinels keep the original verb as the
  edge + a review flag.

---

## 4 · Reproducibility (Matty's Definition-of-Done #1)

The whole migration is a **deterministic, idempotent** re-run (unlike a hand-authored pass): the export
script + mapper regenerate byte-stable candidates from the read-only workbook; the accept gate is the
validator; `store` is idempotent (identical content → no-op; changed content → B5-guarded). Re-running
reproduces the corpus. This *is* DoD #1, demonstrated at full scale.

**Re-run:**
```
python3 scripts/validation/export-handoff-full.py
node packages/toolkit-framework/src/cli.mjs ingest prepare .tmp/handoff-full/families --dir .workorders-handoff-full
node scripts/validation/map-handoff-full.mjs --wo-dir .workorders-handoff-full
#   claim → fulfill → accept each WO; then:
node packages/toolkit-framework/src/cli.mjs store --dir .workorders-handoff-full --adapter kb-folder --target kb-handoff
#   Discovery promotion:
node packages/toolkit-framework/src/cli.mjs ingest prepare .tmp/handoff-full/discovery --dir .workorders-handoff-full
node scripts/validation/map-discovery-priority.mjs --wo-dir .workorders-handoff-full
```

---

## 5 · Out of scope / next

- **Human review pass** (2,787 raw objects) — the review-promote gate; operator/team-gated (the named-reviewer checklist, ~2–4 weeks).
- **Master-narrative refactor** — Matty's editorial lane; awaits his next review cycle.
- **The 4,837-row Discovery_Pool remainder** — Zone A; promote selectively in later bounded batches.
- **Annexes A03–A14** — redundant checkpoint snapshots; not ingested.
- **Rendering** — surfacing this corpus as browsable content is the `dev-instance-build` plan (Prompt 1), not this migration.
