# Self-Ingestion Diff — the toolkit run through its own machine

**Date:** 2026-07-14 · **For:** the Jul 16 toolkit call · **Plan:** [`framework-validation-pass`](../plans/framework-validation-pass.md)
**Status:** real run, committed. Everything below is `raw` and in the review queue — **nothing promoted**.

> **What this is.** For the first time, the current toolkit's *own* content was run through the 0.2
> machine's real `ingest` pipeline (capture → accept-gate → store) — not the June v0.1 heuristic, not
> a mapping exercise. This is a **representative slice: 19 of the 119 live articles**, deliberately
> chosen to exercise every object type + four known edge cases. The full 119 run resumes next, once
> the kernel fixes below are confirmed. The honest word is *slice* — see §5.

## 1 · Before → after

| | typed objects | source |
|---|---|---|
| **Before** (`data/kb/_baseline-index.json`) | **1** | just the `regen-toolkit` self source-system card |
| **After** (`data/kb/index.json`) | **155** | self-card + **154 new objects** from the 19-article slice |

All 154 are `maturity: raw`, `ai_assisted: true`, each with `provenance.origin`. **155 in the review
queue; 0 promoted** — a human reviews before anything is published (that's a separate `review promote`
session, by design).

## 2 · Per-type breakdown (what the machine produced)

| count | type | real examples from the run |
|---:|---|---|
| 48 | resource | 1Hive · Snapshot (snapshot.org) · Obsidian |
| 33 | claim-evidence | "Decentralization is a spectrum, not a binary switch" · "KOI-net reached public beta in May 2025" |
| 30 | concept-lineage | Decentralization · Infrastructure Follows Function · the 5P gathering framework |
| 18 | encyclopedia-entry | What Is Decentralization? · A Tools Directory… · The Gatherings Pattern |
| 9 | public-use-boundary | "cultural/Indigenous attribution in the 5P framework" · "GG24 Bioregional Round figures" |
| 9 | signal | "Greenpill Network card has no known return path" · "treasury figures carry `sources: []`" |
| 6 | source-system | regen-toolkit · KOI-net (BlockScience/Metagov/RMIT) · Greenpill Network |
| 2 | track | "Building a Minimum Viable Node (8-week roadmap)" · "First 90 Days: Local Node Playbook" |

**19 work orders, all accepted through the machine's gate** (one — `treasury-management` — was rejected
once for an out-of-enum `public-use-boundary.tier` value, fixed, and re-accepted; the gate working as
designed). Ingestion ran as 4 parallel agents over the 19 sources.

## 3 · The edge cases — what the machine caught that a heuristic wouldn't

- **The overwrite guard (B5) fired on real data.** `what-is-decentralization` and
  `decentralization-spectrum` *both* produced a "Decentralization" `concept-lineage`; `Obsidian`
  appeared as a resource from two articles. The store keys them by title-slug — so **before this
  week's fix, the second would have silently clobbered the first: real, invisible knowledge loss.**
  The guard preserved both (`decentralization-ae8ffd00`, `obsidian-256b900d`) and reported the
  collision. This bug was surfaced by the **ReFi DAO run at scale**, fixed in the framework this week,
  and the toolkit's own self-ingestion is the first beneficiary — the federation feedback loop working
  end to end.
- **Source typing used the widened enum.** Three sources landed as first-class `blog`/`publication`
  types — `Greenpill Network → blog`, `Chainalysis Crypto Crime Report → publication`,
  `CryptoAltruists Web3 Impact Toolkit → publication` — where before this week's enum fix they'd have
  fallen back to a generic `database`. (`Gitcoin → docs-site` — an imperfect fit; see §4.)
- **The boundary + signal discipline is real, not decorative.** Unprompted, the machine flagged
  `public-use-boundary` objects for cultural/Indigenous attribution (the 5P gathering framework) and
  for specific funding figures, and raised `signal` objects like "Greenpill Network card has no known
  return path" and "treasury figures carry `sources: []`". This is exactly the review-worthy,
  provenance-honest surfacing the whole point of the machine is to produce.

## 4 · The run generated 7 fresh framework-feedback items

Running real content through the machine produced the next round of framework fixes — the loop working
on the toolkit itself, mirroring the ReFi DAO testbed. All route to `toolkit-framework`:

1. **`source-system.type` has no fit for a funding *platform*/dapp** (Gitcoin → `docs-site`, imperfect). Extends the enum item — a `platform`/`dapp` value is wanted.
2. **`public-use-boundary` doesn't inherit the maturity born-rule** (doesn't `extends: frontmatter`). Visible in the data: `by_maturity` counts 146 but the queue is 155 — the 9-object gap is exactly the boundary objects.
3. **`public-use-boundary.tier` enum lacks a "requires domain review" value** (the `treasury-management` rejection; nearest fit was `public-with-caveat`).
4. **`list-schemas` doesn't distinguish ingestible vs structural schemas** — agents learn the rule only at accept-time. A `--ingestible` flag would help.
5. **`ingest prepare` should stamp the resolved `source_path`** — bare filenames collide with stale drafts under `content/`; each agent had to resolve the canonical path itself.
6. **`classifySource` misclassifies prose as `transcript`** when short lead-ins end in `":"` (hit on `common-scams`).
7. **No top-level `case-study` schema** — resolved via `encyclopedia-entry` + `page_type: case-linked`; the skill docs could point there directly.

These become the post-demo fix round and feed the Jul-14 ReFi DAO architecture conversation.

## 5 · Honest caveats (nothing overclaimed)

- **It's a slice, not the corpus.** 19 of 119 articles. The full 119 self-ingestion is the next phase,
  gated on confirming the fixes above. The counts here are a representative sample, not the whole.
- **The "capital-heavy" articles weren't 8-forms-of-capital.** `treasury-management` and
  `funding-landscape` turned out crypto-financial (stablecoins, treasury, lending), not the
  regenerative 8-forms language. So this slice does **not** vividly demonstrate the capital gap — that
  gap is a **kernel/ontology-level finding from the 2026-07-05 ontology comparison** (§8), and the
  capital contribute-back proposal stands on *that* evidence, not this run. See
  [`docs/proposals/2026-07-13-capital-update-proposal.md`](../proposals/2026-07-13-capital-update-proposal.md).
- **Everything is `raw`.** Not reviewed, not published. The value is a structured, provenance-tracked,
  review-ready commons — the human gate is intact and un-bypassed.
- **The root `kb/` folder is a *different, earlier* run.** The 10 objects at repo-root `kb/objects/`
  are from the 2026-07-02 planning call via the `kb-folder` adapter. **The canonical instance KB is
  `data/kb/`** (repo-data adapter, per `kms.yaml`) — that's what this diff and the live page read.

## 6 · Pointers

- Slice manifest (the 19 + coverage rationale): [`data/kb/_slice-manifest.yaml`](../../data/kb/_slice-manifest.yaml)
- Live page: `/self-ingestion/` (rendered from `data/kb/index.json`)
- Canvas: [`docs/canvases/self-ingestion-diff.canvas`](../canvases/self-ingestion-diff.canvas)
- Kernel fixes this enabled: `framework-validation-pass` V1 — source-system enum · `held` state · `track.outcome`→array · **B5 overwrite guard**
- The ontology comparison behind the HYBRID + capital decision: [`docs/reports/2026-07-05-ontology-comparison.md`](2026-07-05-ontology-comparison.md) §8
