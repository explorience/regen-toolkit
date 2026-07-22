# Named-Reviewer Checklist — Reprocessed Content Sign-Off

**What this is.** The per-page review instrument the 2026-07-16 biweekly specified: before any
reprocessed content goes public, a **named reviewer signs off on each page**, over a **~2–4 week**
window, on a staging site shown **side-by-side against the current live build**. This checklist is
that sign-off. It is the gate that moves objects `raw → reviewed` and clears content for a PR to
`main`.

> **The path (2026-07-16):** staging site (side-by-side vs the current build) → **this checklist +
> named-reviewer sign-off (~2–4 wks)** → push to `main` → forum post. Skip the soft
> "tap-on-shoulders" stage; go to broader public share once signed off. **Hard privacy gate:** the
> name-flagging/removal feature must be verified working before any public release.

**Unit of review = one source article and all objects derived from it.** There are 119 articles →
722 objects (mean 6/article, range 2–13). Reviewing per-article keeps the source and its reprocessed
objects together for side-by-side judgement. Use the per-article worksheet
(`docs/reviews/reviewer-tracking-sheet.csv`) to assign and track all 119.

---

## Roles

- **Named reviewer** — the person accountable for a page's sign-off. One per page (co-review allowed;
  one signs). Named in the tracking sheet.
- **Reviewer lead** — owns the tracking sheet, assigns pages, runs the ~2–4 wk cadence, escalates FAILs.
- **Privacy owner** — verifies the name-flagging/removal feature and clears the privacy gate for the batch.
- **Framework maintainer** — receives systematic issues (a bug affecting many pages → fix upstream, re-ingest).

## Per-page checklist (tick every box, or route to Fix/Hold)

For the article **`<article>.md`** and its derived objects:

**A · Faithfulness** (run the [faithfulness spot-check](faithfulness-spot-check-protocol.md) dimensions on each object)
- [ ] **Meaning preserved** — every object represents what the source says; no distortion/overstatement.
- [ ] **Provenance correct** — each object's `provenance.origin` resolves to this article; `transformation` accurate.
- [ ] **No hallucinated relationships** — `related_concepts`/`related_resources`/edges are real or fairly implied.
- [ ] **Completeness** — no material source content dropped (esp. for low-yield "thinned" pages).

**B · Publication safety** (the public-use gate)
- [ ] **Public-use boundaries correct** — sensitive content (cultural/Indigenous attribution, funding
      figures, insinuated relationships) is flagged; nothing sensitive is mis-tiered as public.
- [ ] **Privacy / names** — no person is named in a way they haven't consented to; the
      name-flagging/removal feature has been exercised on this page. **(Hard gate — blocks publish.)**
- [ ] **Claims sourced** — figures/quotes in `claim-evidence` trace to the source or a cited primary source; no `sources: []` claim goes public.

**C · Frame & voice**
- [ ] **Frame-language clean** — no Frame 1 (extractive/hierarchical) language misrepresenting a
      regenerative source (per `docs/CSIS.md`, Durgadas 2026-04-23).

**D · Decision** (exactly one)
- [ ] **PROMOTE** — all boxes ticked → run `review promote <ref>` (raw → reviewed); page cleared for the `main` PR.
- [ ] **FIX** — minor issues; note them below, fix, re-tick, then promote.
- [ ] **HOLD** — a FAIL (unfaithful, unsafe, or privacy) → route back for rework; do **not** promote.

**Sign-off**
```
Article:        <article>.md
Objects:        <n>  (types: … )
Reviewer:       <name>
Date:           <YYYY-MM-DD>
Decision:       PROMOTE | FIX | HOLD
Privacy gate:   PASS | FAIL   (name-flagging exercised: yes/no)
Notes / fixes:  …
Framework bug?: <link to feedback item, if systematic>
```

---

## Cadence (~2–4 weeks)

> **Reviewer lead: TBD — to be assigned at the next call** (decision 2026-07-21). The instruments
> below are ready; the ~2–4 wk window starts once the lead is named and pages are assigned.

- **Week 0:** reviewer lead assigns all 119 pages (tracking sheet); privacy owner verifies the
  name-flagging feature (batch-level gate).
- **Weeks 1–3:** reviewers sign off pages. Prioritise by risk — start with the high-yield and
  high-risk pages (claim-heavy, funding-figure, named-people pages); the [spot-check audit](faithfulness-spot-check-protocol.md)
  says where risk concentrates.
- **Rolling:** PROMOTE pages accumulate; systematic FAILs pause and route to the framework maintainer
  (fix once, re-ingest, re-review the affected stratum — don't fix 30 pages by hand).
- **Gate to `main`:** a page is PR-eligible only when signed **PROMOTE** and the batch privacy gate is PASS.

## Definition of Done — the "shareable initial version" checkpoint
_(Both 2026-07-16 meetings flagged that this checkpoint needs a concrete DoD. Here it is.)_

The reprocessed content is shareable/publishable when **all** of:
1. **Coverage** — every article accounted for (0 dropped; see coverage map). ✔ already true (119/119).
2. **Faithfulness** — spot-check audit ≥ 95% faithful with **0 FAILs in claim-evidence or
   public-use-boundary strata**; all audited FAILs resolved.
3. **Per-page sign-off** — every page in the intended public set signed **PROMOTE** by a named reviewer.
4. **Privacy gate** — name-flagging/removal feature verified; no non-consented person named in any promoted page.
5. **Promotion** — promoted objects moved `raw → reviewed` via `review promote`; the review queue for
   the public set is empty.
6. **Honest staging** — until 1–5 hold, the dev instance carries an unmistakable *raw / under-review* badge and lives on the fork, not `main`.

Meeting 5 or fewer of these = **not shareable yet**; name which are open.

---
_Tracking sheet: [`reviewer-tracking-sheet.csv`](reviewer-tracking-sheet.csv) (all 119 articles, object
counts, assignment + sign-off columns). Coverage evidence: `data/validation/coverage-map.yaml`.
Gate mechanism: `review promote` CLI._
