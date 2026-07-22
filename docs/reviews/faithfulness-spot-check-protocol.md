# Faithfulness Spot-Check Protocol

**Purpose.** The review gate before any reprocessed content is promoted `raw → reviewed`
and before any PR to `main`/prod. It answers one question: **do the typed objects faithfully
preserve the meaning of their source article?** Reprocessing is AI-assisted; this protocol is
the human check that catches distortion, overstatement, hallucinated relationships, and
frame-language drift before anything reaches a public view.

**Status of the material being checked.** All 722 objects in `data/kb/` are `maturity: raw`,
`ai_assisted: true`, and in the review queue (`review_queue: 693`). Nothing is promoted. See
`data/validation/coverage-map.yaml` for the per-article object inventory.

**Two instruments, one gate.**
- **This protocol (audit / sampling):** a fast, stratified quality audit that tells you *how
  trustworthy the batch is* and *where the risk concentrates*. Run it first, and again after fixes.
- **The [named-reviewer checklist](named-reviewer-checklist.md) (census / per-page):** the
  full per-article sign-off that actually moves objects through the promote gate. The audit tunes
  where the census spends its attention.

---

## 1 · Scope & sampling

- **Population:** 722 objects across 119 articles (`src/content/docs/*.md` → `data/kb/*.yaml`).
  (Matty's `kb-handoff/` 146-object corpus is a *separate* source — Canonical_DB, not the 119
  articles — and gets its own pass; out of scope here.)
- **Audit sample size:** ≥ 12 objects per audit round, **stratified** so every object type and
  both dominant transformations (`summarized`, `extracted`) appear. Weight the sample toward the
  higher-risk strata (see §3). Re-sample fresh objects each round; don't re-audit the same ones.
- **Mandatory inclusions each round:**
  - ≥ 1 object from a **thinned (low-yield) article** (`data/validation/coverage-map.yaml →
    thinned_bottom_decile`) — to test for dropped content.
  - ≥ 2 **claim-evidence** objects — the highest-risk type (a claim can be subtly overstated).
  - ≥ 1 **public-use-boundary** object touching cultural/Indigenous attribution or funding figures.
  - ≥ 1 object carrying `related_concepts`/`related_resources` — to test for hallucinated edges.

## 2 · The five dimensions (score each PASS / MINOR / FAIL)

| Code | Dimension | The check |
|------|-----------|-----------|
| **M** | Meaning preserved | Does the object represent what the source *says* — no distortion, no overstatement, no invented nuance? |
| **P** | Provenance correct | Does `provenance.origin` point at an article that actually contains this content? Does `transformation` match what was done? |
| **R** | No hallucinated relationships | Are `related_concepts` / `related_resources` / implied connections actually present or fairly implied in the source? (**Matty's caveat, 2026-07-12:** the AI may insinuate relationships the source never stated.) |
| **F** | Frame-language clean | No extractive/hierarchical ("Frame 1") language misrepresenting a regenerative source; tone and framing faithful. (See `docs/CSIS.md`.) |
| **C** | Completeness (article-level) | For thinned-article picks: was material source content **dropped** — captured by no object? |

**Per-object verdict:**
- **faithful** — all dimensions PASS → eligible to promote.
- **minor-issue** — one or more MINOR, no FAIL → fix-then-promote (log the fix).
- **unfaithful** — any FAIL → **hold**; route back for rework, do not promote.

## 3 · Risk-weighting (where to look hardest)

Order of scrutiny, highest first — grounded in the object model and the 07-16 privacy gate:

1. **claim-evidence** — overstatement / unsupported figures. Verify every number/quote against source text.
2. **public-use-boundary** — under- or over-flagging sensitivity; the privacy/name-flagging gate lives here.
3. **relationship edges** (`related_*`, `relationship-record`) — hallucinated or insinuated connections.
4. **resource** — invented tool↔article relationships; dead/incorrect URLs.
5. **signal** — mis-attributed gaps/caveats.
6. **encyclopedia-entry / concept-lineage / source-system / track** — generally summarization; check for drift and dropped nuance.

## 4 · Procedure (per object)

1. Open the object in `data/kb/<type>.yaml` (find by key).
2. Open its `provenance.origin` article in `src/content/docs/`.
3. Score M, P, R, F (and C for thinned picks). **Default to flagging when uncertain.**
4. Record the row: `type | key | source-article | M | P | R | F | verdict | note`.
5. For any MINOR/FAIL, capture the **source quote vs object text** so the fix is unambiguous.

**Stratify effort by `provenance.transformation` (calibrated on the 2026-07-19 worked round):**
- `summarized` / `extracted` → **~3–5 min**, verbatim-checkable (grep a distinctive phrase in the source).
- `synthesized` / `inferred` (typically `track`, `signal`, `public-use-boundary`) → **~3× longer**;
  the object is a claim about the *whole* article's shape, so it must be read end-to-end. **This is
  where distortion hides — budget the human minutes here.**
- **R (hallucinated relationships) is the slowest and highest-value dimension.** Treat every
  `related_*` list as guilty-until-verified. Provenance (P), by contrast, was never wrong in the
  worked round — safe to sample rather than check exhaustively.

**Automated pre-pass (cheap, run first):** `scripts/validation/reprocessing-coverage.mjs` emits a
`reference_integrity` block flagging every `related_*` reference that doesn't resolve to a promoted
object (naming-drift vs truly-dangling). Feed reviewers the flagged list so they don't hand-hunt dead
links — the worked round found **only ~60% of references resolve exactly**, so this is a large,
mechanical slice of the R check that should never cost human time.

## 5 · Batch decision (audit → gate)

After a round, compute verdict counts and read them against thresholds:

| Audit result | Read | Action |
|---|---|---|
| ≥ 95% faithful, 0 FAIL in high-risk strata | batch is trustworthy | proceed to per-page census + promote |
| minor issues clustered in one type/transform | systematic reprocessing bug | fix at the framework/prompt level, re-ingest that stratum, re-audit |
| any FAIL in claim-evidence or public-use-boundary | publication risk | **block promotion of that stratum**; full census on it before any promote |

Feed systematic findings back to `toolkit-framework` (the same feedback loop that produced the
7 items in `docs/reports/2026-07-13-self-ingestion-diff.md §4`).

## 6 · Outputs

- A filled sample table + findings per round → append to `docs/reviews/spot-check-log.md`
  (or the round's report). The **first worked round** is in
  `docs/reports/2026-07-19-reprocessing-validation.md §3`.
- Systematic issues → framework feedback items (route to `toolkit-framework`).

---
_Ties to: `review promote` CLI (the human gate, raw→reviewed) · the 2026-07-16 content-review path
(staging → checklist + named-reviewer sign-off ~2–4 wks → PR to `main` → merge → forum) · the
privacy/name-flagging gate that must pass before public release._
