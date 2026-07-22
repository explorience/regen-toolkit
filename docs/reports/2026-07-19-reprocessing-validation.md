# Reprocessing Validation — the review gate

**Date:** 2026-07-19 · **Status:** analysis + process (no ingest, no deploy, nothing promoted).
**Compares:** the framework-reprocessed KB (`data/kb/`, **722 typed objects**) against the current
live **119-article** Starlight build (`src/content/docs/*.md`).
**Purpose:** the review gate the 2026-07-16 biweekly specified — *coverage, graph shift, faithfulness,
and a named-reviewer sign-off* — **before any PR to `main`/prod.**

> **Everything reprocessed is `raw` and un-reviewed** (`review_queue: 693`). This report does not
> promote anything; it is the instrument that decides *whether* content is ready to promote.

**Deliverables (this report ties them together):**
1. **Coverage map** — §1 · data: `data/validation/coverage-map.{yaml,csv}`
2. **Relationship / graph-view diff** — §2 · data: `data/validation/graph-diff.yaml`
3. **Faithfulness spot-check protocol + worked round** — §3 · protocol: `docs/reviews/faithfulness-spot-check-protocol.md`
4. **Named-reviewer checklist** — §4 · `docs/reviews/named-reviewer-checklist.md` + `reviewer-tracking-sheet.csv`
5. **Definition of Done** for the "shareable initial version" checkpoint — §5

Reproduce §1–§2: `node scripts/validation/reprocessing-coverage.mjs` (read-only).

---

## 1 · Coverage map — did anything get dropped?

**Headline: full coverage, no drops.** All **722** objects trace to a `provenance.origin`, and those
origins resolve to exactly **119 distinct articles** — i.e. **every one of the 119 live articles
produced at least one typed object; zero articles were dropped; zero orphan objects** (no object
claims a source that isn't a real article).

| Metric | Value |
|---|---|
| Source articles | 119 |
| Typed objects | 722 |
| Distinct origin articles | **119 / 119** |
| Articles producing **0** objects (dropped) | **0** |
| Orphan objects (origin not a real article) | **0** |
| Objects per article | mean **6.07**, range **2–13** |

**By object type** (schema family — matches `data/kb/index.json`):

| Type | Count | | Type | Count |
|---|---:|---|---|---:|
| resource | 226 | | public-use-boundary | 34 |
| claim-evidence | 146 | | signal | 33 |
| concept-lineage | 143 | | source-system | 21 |
| encyclopedia-entry | 116 | | track | 3 |

_(The 21 source-system objects carry granular subtypes — `blog`, `publication`, `repo`, `docs-site`,
`directory`, `convening`, `forum`, `knowledge-garden`, `database` — the widened enum from the
validation pass. Grouped as one family here, as `index.json` does.)_

### "Thinned" pages — low yield relative to length (review, don't alarm)

11 articles sit in the bottom decile of objects-per-1000-words. Low yield is **expected** for
reference/glossary and process pages (they define terms or describe a workflow rather than assert
many discrete claims/resources) — but they're the **first place to check for dropped content**, so
they're flagged priority-1 on the tracking sheet:

`key-terms-a-z.md` (3 obj / 1525w) · `conflict-resolution.md` (5/1902) · `building-momentum.md`
(4/1492) · `human-review-boundaries.md` (5/1813) · `why-local-matters.md` (5/1752) ·
`why-regens-interested.md` (4/1386) · `is-community-ready.md` (5/1677) · `local-currency.md`
(6/1937) · `multisig-setup.md` (5/1612) · `editorial-workflow.md` (5/1608) · `common-pitfalls.md`
(5/1601).

> `key-terms-a-z.md` is the one to eyeball: a glossary yielding only 3 objects almost certainly means
> individual term definitions weren't each captured. That's a **coverage question for the reviewer**,
> not necessarily a defect — see §3 completeness check.

### An incidental finding: the old build's metadata is uneven

Only **67 / 119** articles carry rich frontmatter (faceted tags / curated `related:` / category);
**52 are bare** (title + description only). The reprocessing gives **all 119** uniform typed
structure — so one real gain is *evening out* a half-tagged corpus (see §2).

---

## 2 · Relationship / graph-view diff — what connections does the framework surface?

This is the question the 07-16 staging demo turns on: *shown side-by-side, what does the typed graph
reveal that the flat article set didn't?* The two builds connect articles in **different kinds** of
edge, so this is not a single ratio — it's a resolution-and-coverage story.

### Old build — connectivity today

| Layer | Edges | Notes |
|---|---:|---|
| Curated `related:` frontmatter | 113 | editor-authored article→article links — **but only on 41 / 119 articles** |
| Shared `systems:` tag facet | 610 | from just **12 distinct** system tags — coarse (any two "Decentralization"-tagged articles count as linked) |
| Inline markdown links | ~2 | negligible |
| **Union** | **666** | |

The 666 looks large, but **610 of it is low-resolution** — a dozen broad buckets — and the curated,
high-trust part (113 edges) covers **barely a third of the corpus**. The other 78 articles are
weakly connected or not at all.

### New build — connectivity after reprocessing

| Measure | Value |
|---|---:|
| Object-level typed reference-edges (`related_concepts` / `related_resources` / `concepts`) | **656** |
| Distinct concepts referenced | **191** |
| Distinct resources referenced | **183** |
| Article pairs connected via a **shared specific concept** | 49 |
| Article pairs connected via a **shared specific resource** | 123 |
| **Article pairs connected (total)** | **161** |

The typed graph anchors every edge in a **named, specific** concept or resource (374 distinct
anchors vs 12 coarse tags), and it does so **uniformly across all 119 articles** — not just the 41
that happened to get curated `related:` lists.

### The diff — 139 emergent connections

Of the 161 typed article-pairs, **139 are emergent**: connected in the framework graph with **no
curated `related:` link and no shared `systems:` facet** in the old build. Only 22 overlap. These
are connections a reader of the flat site could not have followed. Real examples (from
`graph-diff.yaml → emergent_samples`):

- `case-studies-nonprofits.md` ↔ `setting-up-receive-crypto.md` ↔ `why-accept-crypto.md` — all linked
  by the shared resource **The Giving Block**. A reader learning *how to receive crypto* is now one
  hop from *real nonprofit case studies using the same tool*. No `related:` link joined them before.
- `common-concerns.md` ↔ `what-is-blockchain.md` — via the concept **proof-of-work-vs-proof-of-stake**.
- `common-pitfalls.md` ↔ `first-90-days.md` — via the concept **local-node**.
- `building-founding-team.md` ↔ `building-trust.md` — via the resource **Safe (multisig wallets)**.
- A knowledge-tooling cluster (`ai-community-tools`, `archive-compost`, `knowledge-gardens`,
  `knowledge-tools-directory`) — via the resource **Quartz**.

**Read:** the framework doesn't just add more edges — it trades a dozen coarse tags + a partial
curated graph for a **high-resolution, uniformly-applied, provenance-named** graph, surfacing ~139
real cross-article relationships the current site can't express. That is the graph-view payoff for
the staging demo.

> **Caveat — the graph is not build-ready yet.** Emergent edges are only as good as the underlying
> `related_*` arrays, and today **only 60.4% of those references resolve exactly** (≈85% with an
> alias layer; ~15% dangle). §3 quantifies this. The payoff is real *potential*; shipping the graph
> view needs a reference-normalization pass first.

---

## 3 · Faithfulness spot-check — does the typed content preserve the source's meaning?

**Protocol:** `docs/reviews/faithfulness-spot-check-protocol.md` — a stratified, risk-weighted audit
scoring each object on **M**eaning / **P**rovenance / **R**elationships (no hallucination) /
**F**rame-language / **C**ompleteness, with a per-object verdict (faithful / minor-issue / unfaithful)
and a batch decision that gates promotion.

### Worked first round — 12-object stratified sample

12 objects across all 8 types + a thinned-page completeness check. Scored M / P / R / F.

| type | object | source | M | P | R | F | verdict |
|---|---|---|:-:|:-:|:-:|:-:|---|
| encyclopedia-entry | what-is-decentralization | what-is-decentralization.md | ✔ | ✔ | ✔ | ✔ | faithful |
| encyclopedia-entry | key-terms-a-z | key-terms-a-z.md | ✔ | ✔ | ⚠ | ✔ | faithful |
| concept-lineage | decentralization | what-is-decentralization.md | ✔ | ✔ | ✔ | ✔ | faithful |
| concept-lineage | 5p-gathering-framework | gatherings-pattern.md | ✔ | ✔ | ✔ | ✔ | faithful |
| claim-evidence | toucan-85%-carbon-volume | what-is-refi.md | ✔ | ✔ | ✔ | ✔ | faithful |
| claim-evidence | top-50-dao-treasuries-$15b | treasury-management.md | ✔ | ✔ | ✔ | ✔ | faithful |
| resource | snapshot (snapshot.org) | what-is-decentralization.md | ✔ | ✔ | ✔ | ✔ | faithful |
| resource | toucan-protocol | what-is-refi.md | ✔ | ✔ | ✔ | ✔ | faithful |
| public-use-boundary | 5p cultural/Indigenous attribution | gatherings-pattern.md | ✔ | ✔ | ✔ | ✔ | faithful |
| signal | treasury figures uncited (`sources: []`) | treasury-management.md | ✔ | ✔ | ✔ | ✔ | faithful |
| source-system | greenpill-network | what-is-refi.md | ⚠ | ✔ | ✔ | ✔ | **minor-issue** |
| track | mvn-8-week-roadmap | minimum-viable-node.md | ✔ | ✔ | ✔ | ✔ | faithful |

**Result: 11 faithful · 1 minor · 0 unfaithful.** Every high-priority claim-evidence object was
**verbatim or near-verbatim** from its source, each carrying an honest `uncertainty`/`evidence` field
naming the missing citation. **No hallucinated or overstated claims. No Frame-1 language** — objects
actively *reinforce* frame discipline (the Tokenomics concept and the ReFi glossary entry both
cross-reference `docs/CSIS.md` to warn against conflating "on-chain" with "regenerative").

**Two minor findings:**
- **Type-slot misfit (`greenpill-network`).** Typed `source-system.type: blog`, but the article and
  the card's own `what_it_curates` call it "a global network of local, place-based regenerative-crypto
  chapters." A network/community, not a blog. Meaning fine; controlled-vocab **type** wrong.
- **Dangling relationship refs (`key-terms-a-z`).** `related_concepts` lists DAO & Layer 2, which
  were never promoted to concept objects. Not hallucination (both terms are in the glossary) — an
  *unresolvable* ref. This one example turned out to be systemic — quantified below.

**Thinned-page completeness (`key-terms-a-z.md`, an ~85-term glossary → 3 objects):** the whole
glossary was captured as **1 encyclopedia-entry + 2 concept objects** — a defensible thinning
decision (the entry's `notes` says so openly, and `known_tensions` names "glossary brevity vs.
accuracy"). **But ~83 term definitions are not individually retrievable as objects**, and a
title-collision hazard surfaced: the glossary's "Snapshot" (a point-in-time holdings record) is a
*different* meaning from the `snapshot-snapshot-org` voting-tool resource — a reviewer object-ifying
glossaries later must not merge them.

### Automated companion check — reference integrity (the dangling-ref finding, quantified)

The worked round's dangling-ref finding motivated an automated pass over **all** relationship
references (`scripts/validation/reprocessing-coverage.mjs → reference_integrity`). Across **649**
`related_concepts`/`related_resources` references:

| Resolution | Refs | % | Meaning |
|---|---:|---:|---|
| **Exact** | 392 | **60.4%** | ref matches an object key/title as-is |
| **Naming-drift** | 162 | 25.0% | object exists under a *qualified/reordered* key (`portability` → `portability-knowledge-commons`; `reference-identifier-rid` → `rid-reference-identifier`) — resolvable **only with an alias layer** |
| **Truly dangling** | 95 | 14.6% | no object at all (`koi-net`, `hypercerts`, `SKOS`, `The World Café`, `polycentric-governance`…) — target never promoted |

**~40% of the typed graph's links do not resolve as-emitted; ~85% become resolvable with a light
alias/normalization layer; ~15% point at genuinely unpromoted targets.** This is the honest
counter-weight to §2: the emergent-connection *potential* is real, but **the graph is not
build-ready until reference IDs are normalized** (an alias/canonical-ID layer) and the ~95 dangling
targets are either promoted or dropped. This is a concrete framework-feedback item (route to
`toolkit-framework`), not a content-review item.

### Aggregate read & top failure modes for reviewers

Reprocessing faithfulness is **high**: claims grounded, provenance always resolved, and the machine is
**self-aware about its weaknesses** (records missing citations in `uncertainty`, flags MRV/carbon and
Indigenous-attribution content as `high_risk` with matching boundary objects). The three failure
modes a human reviewer should watch for (grounded in what the sample actually showed):

1. **Uncertainty stripped downstream.** The risk isn't the objects — it's that figures ($15B, 85%,
   1,286 donors) sit in `claim` with the hedge quarantined in a separate `uncertainty`/`evidence`
   field. **Anything rendering `claim` alone republishes uncited numbers as fact.** Gate: claim +
   uncertainty must travel together.
2. **Controlled-vocab type misfits** on source-system/resource cards (Greenpill=`blog`). Sanity-check
   every `type` slot against the object's own description.
3. **Silent thinning + reference integrity** on low-yield pages → unresolvable refs (14.6% dangling)
   and title-collision hazards (two "Snapshot"s). Validate every relationship key resolves before
   graph-building.

**Protocol calibration** (from the worked round — folded into the protocol doc): `summarized`/
`extracted` objects are fast (~3–5 min) and verbatim-checkable; **`synthesized`/`inferred` objects
(track, signal, public-use-boundary) need the whole source read and take ~3× longer** — that's where
distortion would hide. The **R (hallucinated-relationship) dimension is the slowest and most
valuable**; treat every `related_*` list as guilty-until-verified, and let the automated
reference-integrity pass pre-flag the unresolvable ones. Provenance was never wrong in the sample —
safe to sample rather than check exhaustively.

---

## 4 · Named-reviewer checklist — the sign-off gate

**Instrument:** `docs/reviews/named-reviewer-checklist.md` + per-article worksheet
`docs/reviews/reviewer-tracking-sheet.csv` (all 119 articles, object counts, risk flags, sign-off
columns). It implements the 2026-07-16 path: **staging (side-by-side vs current build) → per-page
checklist + named-reviewer sign-off (~2–4 wks) → PR to `main` → merge → forum**, with the
**name-flagging/removal privacy gate** as a hard blocker.

Unit of review = **one article + all its objects** (keeps source and reprocessed output together).
The tracking sheet pre-sorts the 119 pages into review-priority tiers:

| Tier | Pages | Why first |
|---|---:|---|
| **1 — sensitivity / completeness** | 43 | has a `public-use-boundary` object **or** is a thinned page |
| **2 — claim-sourcing** | 67 | has `claim-evidence` objects (figures/quotes to verify) |
| **3 — standard** | 9 | summarization only |

A page is PR-eligible only when signed **PROMOTE** (which runs `review promote`, raw→reviewed) and
the batch privacy gate is **PASS**.

---

## 5 · Definition of Done — "shareable initial version"

Both 07-16 meetings flagged that this checkpoint needs a concrete DoD. Full version in the
[checklist](../reviews/named-reviewer-checklist.md#definition-of-done--the-shareable-initial-version-checkpoint);
in brief, the reprocessed content is shareable when **all** hold:

1. **Coverage** — every article accounted for (0 dropped). ✔ **already true (119/119, §1).**
2. **Faithfulness** — audit ≥ 95% faithful, **0 FAILs in claim-evidence or public-use-boundary**; audited FAILs fixed.
3. **Per-page sign-off** — every page in the public set signed **PROMOTE** by a named reviewer.
4. **Privacy gate** — name-flagging/removal verified; no non-consented person named in a promoted page.
5. **Promotion** — promoted objects moved `raw → reviewed`; the public set's review queue is empty.
6. **Honest staging** — until 1–5, the dev instance stays fork-only with an unmistakable *raw / under-review* badge.

**Where we stand today:** #1 ✔ done. #2 first audit round in §3. #3–#5 open (the ~2–4 wk reviewer
window, not yet started). #6 is Prompt 1's job (the fork dev instance). **Not shareable yet — #3, #4,
#5 are the remaining gate.**

---

## Pointers

- **Browsable review-gate dashboard:** `/validation` (`src/pages/validation.astro`) — renders this
  report's coverage / graph-diff / faithfulness / reference-integrity + the DoD from
  `data/validation/validation-summary.json`. Fork/dev only, `raw` badge — **not prod.** Follows the
  `/self-ingestion` summary-page pattern.
- Coverage data: [`data/validation/coverage-map.yaml`](../../data/validation/coverage-map.yaml) · [`.csv`](../../data/validation/coverage-map.csv)
- Graph diff data: [`data/validation/graph-diff.yaml`](../../data/validation/graph-diff.yaml)
- Analysis script (read-only, reproducible): [`scripts/validation/reprocessing-coverage.mjs`](../../scripts/validation/reprocessing-coverage.mjs)
- Faithfulness protocol: [`docs/reviews/faithfulness-spot-check-protocol.md`](../reviews/faithfulness-spot-check-protocol.md)
- Reviewer checklist + tracking sheet: [`docs/reviews/named-reviewer-checklist.md`](../reviews/named-reviewer-checklist.md) · [`reviewer-tracking-sheet.csv`](../reviews/reviewer-tracking-sheet.csv)
- Complementary counts narrative (before→after): [`docs/reports/2026-07-13-self-ingestion-diff.md`](2026-07-13-self-ingestion-diff.md)
- Meeting context: `memory/2026-07-16.md` (content-review path) · handoff prompt `docs/plans/SESSION-HANDOFF-2026-07-19.md` (Prompt 2)
