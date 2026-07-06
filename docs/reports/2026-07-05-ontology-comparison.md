# Ontology Comparison — Heenal's Regen Toolkit build ↔ toolkit-framework kernel

**Date:** 2026-07-05
**Plan:** `docs/plans/2026-07-05-ontology-comparison-plan.md` (Approach C — reuse June's framework reprocess as "framework view v1", add the formal crosswalk + this comparison, re-run content only where June was thin)
**Backbone:** `data/crosswalks/regen-toolkit.yaml` (the type/classification/relationship crosswalk, `map-ontology@0.2.0`)
**Structured diff:** `data/crosswalks/comparison.yaml` (this doc is its narrative companion)
**Voice:** Internal engineering report. Honest-state discipline; no promotion. Every count cites a file.

---

## 1 · TL;DR

- **Moving Heenal → framework is a net-richer, lossy-in-one-place trade.** Heenal's 19 knowledge types map with **0 unmapped** (14 direct, 5 lossy-near); the framework adds ~26 operational types (deployment / implementation / review / evolution) Heenal never modelled, plus a real three-axis state model. The direction of adoption is clear: the framework is the stronger *operational and interoperability* backbone.
- **The one big loss is capital.** Heenal's **8 Forms of Capital** + its three capital predicates (`creates_capital` / `depends_on_capital` / `impacts_capital`) have **no framework home at all** — the kernel has no capital-accounting axis. This is the flagship contribute-back, not something to drop.
- **The operational-richness gain is large.** The framework ships the K1 state model (3 orthogonal axes — maturity · public_use · lifecycle_state — + `ai_assisted`/`high_risk` flags), the **source-system** federation/return-path primitive, **bioregion** as a first-class type, and CSIS-informed structural integrity — none of which exist in Heenal's knowledge-typing-focused ontology.
- **A corpus-normalization side-effect falls out for free.** Running Heenal's content through the framework forces honest state: all **119** live articles pinned to `draft` / `source-linked-unreviewed` / `ai_assisted:true`, 34 high-risk pages given a `public_use_boundary`, and 698 noisy resource rows honestly held out — a discipline Heenal's inconsistent frontmatter never enforced (the census shows the capital layer populated **0/119**).
- **Decision — HYBRID (adopt-with-contribute-back), agreed 2026-07-05.** Adopt the framework as the operational + interop backbone, keep Heenal's capital accounting + `stage`/`scale`/`context` as a namespaced extension, and contribute the 8 Forms of Capital back to the kernel. Pure-adopt would delete the regenerative heart; keep-both forfeits interop and duplicates work. (§8 lists what this opens for the group.)

---

## 2 · The two ontologies side-by-side

| Dimension | Heenal's build (`data/ontology/*.yaml`) | toolkit-framework kernel |
|---|---|---|
| **Entity model** | 19 core types, Octo-anchored, SuperBenefit-crosswalked; knowledge-typing focused | 15 frozen core (Layer A) + 31 opinionated extension (Layer B), 10 structural layers; operationally rich |
| **Framing** | "resource is ⚠ NOT a primary type"; capital is a first-class extension | `resource` is a centered L3 primitive; **no** capital model |
| **Classification** | 9 attribute-layers (domain, function, audience, maturity, scale, context, stage, tech_surface, **forms_of_capital**) | frontmatter fields (domain/function free-form) + K1 axes; **no** scale/context/stage/capital classification |
| **Maturity / state** | 1 ladder: seed → experimental → emerging → proven → canonical (5 rungs) | 3 orthogonal axes (maturity 9-value · public_use 10-value · lifecycle_state 10-value) + `ai_assisted`/`high_risk` flags |
| **Relationships** | 5 predicate groups incl. **capital_predicates** | `relationships.yaml` groups (core_interop / practice_pattern / discourse / governance_csis[optional] / source_lineage); **no** capital group |
| **Federation** | none native (no return-path / peer primitive) | `source-system` = the federation primitive (steward, return_path, reuse conditions); extension `maps_to_core` = the fork-compat contract |
| **Posture** | CSIS-aligned typing | align-and-map, never conform-or-reject; CSIS-**informed**, not conformant (flags, doesn't certify) |

**Net:** the framework is *materially richer on the operational side (L5–L10) and on state/federation*, and *poorer on capital accounting*. Heenal is *richer on capital + learner-journey/scale/context classification*, and *thinner operationally*.

---

## 3 · Type-by-type disposition (19 types)

**Counts by relation quality:** 14 **direct**, 5 **near** (lossy), 0 **unmapped**. (By target layer: 15 to core, 4 to extension.) Full rows in `data/crosswalks/regen-toolkit.yaml § type_mappings`.

### Direct to core (11) — clean 1:1
`concept · person · practice · pattern · protocol · playbook · case_study(→case-study) · question · claim · evidence · artifact`. These are the shared primitives; the framework only *strengthens* two (`pattern` gains a review gate + pattern-humility; `person` gains a consent constraint). No loss.

### Direct to extension (3) — clean, but note the emphasis flip
- **`mechanism`** → extension `mechanism` (maps_to_core: pattern). Clean name/meaning — **but** Heenal's Pattern/**Protocol** dual collapses to `pattern`; the protocol/rules half is dropped at the core downgrade.
- **`tool`** → extension `tool` (maps_to_core: artifact). Clean.
- **`resource`** → extension `resource`. **Status inversion:** Heenal warns it's "⚠ not a primary type"; the framework centers it (first-class L3, **1616** objects in the June reprocess). Same name, opposite emphasis.

### Near — lossy (5) — the losses to call out
- **`group`** → core `group` — **split, not 1:1.** The umbrella maps, but Heenal's subtypes (organization/team/**network**/community/working-group) become *distinct framework extension types* (`network`/`node`/`cell`/`partner-org`). The framework types what Heenal kept as `group.subtypes`.
- **`place`** → core `place` — **split + axis-shift.** Heenal's `bioregion` subtype is **promoted to a first-class framework core type**; Heenal's `local node` subtype shifts axis to extension `node` (which maps_to_core: **group**, not place — org vs place).
- **`gathering`** → core `practice` — **event distinction lost.** No first-class event/gathering type; the time-bound event sense (meeting/workshop/residency/conference) flattens into generic practice. `2-applied/2.5-gatherings-events` is a whole content section, so this is material. → candidate extension `regen-toolkit/gathering`.
- **`story`** → core `case-study` — **speculative sense lost.** `case-study` is strictly "what HAPPENED"; Heenal's `story` also covers "what MAY happen / is IMAGINED" — that future/speculative narrative has no framework home. → candidate extension `regen-toolkit/story`.
- **`framework`** → extension `framework` — **anchor flip.** Name-identical, but Heenal anchors `framework`→**Concept** while the extension anchors maps_to_core: **pattern**. A naive downgrade lands it in `pattern`, not `concept`.

### Inverse — framework has, Heenal lacks
`bioregion` (first-class core; only a place *subtype* in Heenal) and `source-system` (the L3a return-path/anti-extraction federation primitive — absent from Heenal entirely). Heenal would need both to federate. See `crosswalk § summary.target_only_additions`.

---

## 4 · Classification disposition (9 attribute-layers)

**5 mapped, 4 unmapped.** Full rows in `crosswalk § classification_mappings`.

| Heenal layer | Disposition | Where it lands |
|---|---|---|
| `domain` | direct | `frontmatter.domain` (uncontrolled string) |
| `function` | direct | `frontmatter.function` — ⚠ **value/type collision** (see §7) |
| `audience` | near | per-schema (`track.audience` required; encyclopedia/option optional) — not a universal attribute |
| `maturity` | near | **K1 maturity axis** — the *strongest* mapping; the framework ships the crosswalk itself (`review-maturity.yaml § crosswalks.legacy_ontology`: seed→raw … canonical→pattern-generating) |
| `tech_surface` | partial | **only** `AI-assisted` → K1 `ai_assisted` flag; onchain/offchain/Ethereum/L2/multi-chain have no home |
| `scale` | **unmapped** | re-encoded structurally (type hierarchy + `part_of`), not a per-item tag — *accept-loss* |
| `context` | **unmapped** | ad-hoc tags only; partial overlaps but no single home — *accept-loss* |
| `stage` | **unmapped** | learner-journey progression; K1 has no journey axis; closest is a Layer-7 track *position* |
| **`forms_of_capital`** | **unmapped** | **NO framework home — the flagship contribute-back** |

### Spotlight: the 8 Forms of Capital
`[financial, social, cultural, intellectual, experiential, natural, built, spiritual]`, carried via the capital predicates. **The kernel has no capital-accounting axis and no capital-flow predicates.** Heenal itself marks it `octo:extension` / `superbenefit:not_native` — it is a genuine Regen extension. This is the clearest ontology-feedback item for the master doc (Loop 4 / update-proposal).

**Reality check (from the census, `snapshot-2026-07-05/frontmatter-census.yaml`):** the classification is largely *aspirational*. Across the 119 live articles, `scale`/`context`/`tech_surface`/`forms_of_capital` appear on **0/119**; `maturity` (41 articles) uses a Beginner/Intermediate/Advanced **difficulty** scale (0/41 matching the declared seed…canonical vocab); `stage` (44) is a build/draft **editorial pipeline flag**, not the explore…sustain journey. So most of the "loss" is loss of a *declared-but-empty* structure — but the capital layer is exactly the richly-declared one that is never populated, which is why the contribute-back matters more than the live gap suggests.

---

## 5 · Content reprocess (June) — coverage & thin spots (Phase 3)

Reused view: `data/encyclopedia.yaml` (119) + `concepts.yaml` (8) + `tracks.yaml` (3) + `resources.yaml` (1616) + `source-systems.yaml` (89) + salvaged (144 + 4). Source report: `docs/reports/2026-06-17-content-through-framework-report.md`.

### 119 ↔ 119 reconciliation — **PERFECT 1:1**
`comm -3` of the live-doc slugs (`src/content/docs/*.md`) against the encyclopedia ids returns **empty** — 0 missing, 0 extra. Every entry carries `source_lineage: src/content/docs/<slug>.md`; regeneration is byte-identical (deterministic, sorted by slug). No article dropped, no entry invented.

### Quality spot-check — **plausible-as-draft, not authored**
Read ~15 entries across page_types (distribution: `concept 44 · case-linked 40 · guide 17 · comparison 12 · framework 3 · anti-pattern 2 · frontier 1` — matches the June report exactly).
- **Clean catches:** title-keyword-driven types are defensible — `comparison` (centralized-vs-decentralized), `anti-pattern` (common-pitfalls, common-scams), `guide` (setting-up-first-wallet, first-90-days, proposal-writing), `case-linked` (case-studies-nonprofits).
- **Three thin spots:** (a) **`framework` (3) is a catch-all** for pattern/reference titles because the enum has no `pattern` value — "The Gatherings Pattern" is typed `framework`, `token-standards` typed `framework`; (b) the **title-anchored heuristic misses body-signaled guides** — `building-in-public` and `building-internal-capacity` are typed `concept` even though their summaries literally read "Guide to…"; (c) **32 entries carry stub-boilerplate summaries** ("Learn about X in this Regen Toolkit article"), signalling thin source content where any page_type is a default guess (→ mostly `concept`).
- **K1 state honesty — clean.** 119/119 `maturity: draft`, 119/119 `public_use: source-linked-unreviewed`, 119/119 `ai_assisted: true`; **0** reviewed overclaims. `review_done:true` in frontmatter is explicitly kept at `draft`; the `HUMAN_REVIEWED` allowlist is empty. 0 invariant violations across all 1983 objects (June Task 6). **The state is the floor, honestly.**

### `b_candidates` — where a surgical B re-run is warranted
Each is opt-in per section (`comparison.yaml § b_candidates` carries the command sketches):

1. **concept-lineage** — 8/10 (2 guide-titled `what-is/are-*` skipped: `what-are-tokens`, `what-is-ethereum`), and all 8 stubs omit `source_traditions`/`adjacent_meanings`/`important_distinctions` by design. → `ingest prepare --path 'src/content/docs/what-{is,are}-*.md' → accept → store --type concept-lineage → map-ontology`.
2. **page_type re-inference** — re-infer from **full body** (not title) to fix the `framework` catch-all, the body-signaled guides, and the 32 stub defaults. → `ingest prepare --path 'src/content/docs/*.md' --full-body → accept → store --type encyclopedia-entry → map-ontology`.
3. **tracks chapter structure** — chapters dropped + outcome array flattened. **Blocked on a kernel change** (`track.outcome:array` + optional chapters, June gap #3) *then* re-derive.
4. **held resource rows (698)** — no typed home. **Blocked on a kernel change** (review-queue / signal-review state, June gap #5), then `ingest … --routes 'Social Signal Review,People/Account Review' → store --type signal-review`.
5. **salvaged-vs-live merge** — 27 published survivors overlap live entries (gitcoin-grants ~ gitcoin-grants-qf, dao-governance ~ dao-governance-models, local-currency-design ~ local-currency, …). Human-guided merge; retype/compost the 112 not-started stubs.
6. **source-system enrichment** — 60/89 fell back to `type: database`; steward/return_path are UNKNOWN placeholders. Widen the enum, then re-classify + identify stewards/return paths.

---

## 6 · Gaps & contribute-back

Merged from the crosswalk's `gaps` block + June's 6 framework gaps, deduped and ranked (`comparison.yaml § gaps`).

**What the framework should absorb from Heenal (contribute-back):**
1. **Forms of Capital + capital predicates** — *high.* The flagship. No kernel home; a Loop-4 update-proposal to `docs/MASTER.md`.
2. **Held / review-queue lifecycle state** — *high.* 698 rows counted-but-homeless (June gap #5). Blocks b_candidate #4.
3. **`stage` learner-journey axis** — *medium.* Model as a track-position or add a `stage` field.
4. **`gathering` + `story` as namespaced extensions** — *medium.* `regen-toolkit/gathering` (→ practice), `regen-toolkit/story` (→ case-study) — restore the event + speculative-narrative senses lost at downgrade.

**Framework schema fixes surfaced (not ontology-mapping per se, but adoption-blocking):**
- `track.outcome` scalar → array (June gap #3); first-class `public_use_boundary` field (June gap #4); standardize salvage/provenance (June gap #6); widen the `source-system` type enum.

**Tooling gaps:** CLI can't validate a collection file (June gap #1); the framework package can't import into a Vite/Astro build (June gap #2). Both have working workarounds.

**What Heenal loses that's acceptable (accept-loss):** `scale` (re-encoded structurally via type hierarchy + `part_of`), `context` (ad-hoc tags; 0/119 populated), the chain/substrate half of `tech_surface` (Layer 10 reasons structurally; 0/119 populated), a handful of edge relationship predicates (`practiced_in`, `suggests`, `funded_by`, `serves_function`, exact `informs`), and the mechanism-protocol / framework-anchor divergences. None of these are populated in live content, so the practical loss today is ~zero.

**Inverse (Heenal must add to federate):** `source-system` and first-class `bioregion` — a framework *gain* Heenal lacks, not a loss.

---

## 7 · Recommendation

**HYBRID — adopt-with-contribute-back.**

Adopt the framework as the **operational + interoperability backbone**: it is materially richer on L5–L10 (deployment / implementation / review / evolution — ~26 types Heenal doesn't model), it ships the **K1 three-axis state model** (Heenal has only a 5-rung ladder), and it carries the **federation primitives** (`source-system` return paths, `bioregion`, the `maps_to_core` fork-compat contract) that let this instance federate via RegenOS. Keep Heenal's **capital accounting** and its `stage`/`scale`/`context` classification as a **namespaced extension**, and **contribute the 8 Forms of Capital back to the kernel** as the flagship Loop-4 proposal.

- **Why not pure-adopt?** It would delete the regenerative heart (capital accounting) and flatten the event/speculative-narrative senses with no recovery path.
- **Why not keep-both?** It forfeits interop, duplicates the type system, and leaves the honest-state discipline (which the framework enforces and Heenal doesn't) unowned.

**Two things that need a human before any adoption re-run:**
1. **The `function` value/type collision (curation fix).** Heenal's function *values* `pattern` and `case study` are also framework core *types*. Per type-tag-discipline these belong as types, not classification tags — a curation pass must reconcile the overlap so a value isn't simultaneously a type and a tag.
2. **Maturity / stage normalization.** Live frontmatter uses a **Beginner/Intermediate/Advanced difficulty** scale for `maturity` and a **build/draft pipeline** flag for `stage` — *neither* matches the declared ontology vocab (0/41 and near-0 respectively, per the census). A human must decide the canonical mapping (difficulty is arguably a *reader-level* tag, orthogonal to K1 maturity; the pipeline flag maps to `lifecycle_state`, not `maturity`) before content is re-typed.

---

## 8 · Open items — what's decided, what needs the group

**Decided (2026-07-05):** HYBRID — adopt the framework backbone; keep + contribute back Heenal's capital accounting. The comparison below is settled; what remains is development + a few human calls.

**Needs the group / to be developed:**

| Item | What it is | Kind | Best owner |
|---|---|---|---|
| **8 Forms of Capital → kernel** | The flagship gap: the framework has no capital-accounting axis or predicates. Propose adding them. | Loop-4 `update-proposal` to `docs/MASTER.md` | framework maintainer + Matt |
| **`held` / review-queue state** | 698 resource rows are counted-but-homeless (no lifecycle state for "held for review"). Blocks a clean resource import. | kernel state addition | framework maintainer |
| **Schema fixes** | `track.outcome` scalar→array; first-class `public_use_boundary` field; widen the `source-system` type enum (60/89 fell back to `database`). | framework PRs | framework maintainer |
| **`gathering` + `story` extensions** | Restore the event + speculative-narrative senses lost when they downgrade to `practice`/`case-study`. | namespaced extension schemas | ontology |
| **`function` value/type collision** | Heenal uses `pattern` and `case study` as *both* classification values *and* entity types — must reconcile per type-tag discipline. | curation call | content curator |
| **Maturity / stage normalization** | Live frontmatter uses a Beginner/Intermediate/Advanced *difficulty* scale and a build/draft *pipeline* flag — neither matches the ontology or K1. Set the canonical mapping. | curation call | content curator |
| **Salvaged-vs-live merge** | 27 published salvaged survivors overlap live entries; decide merge-vs-keep + retype the 112 not-started stubs. | human-guided merge | content curator |

**Ready to run now (opt-in, per-section):** the 6 `b_candidates` (§5) — surgical framework re-runs where June's heuristic was thin. Cheapest high-value one: **page_type re-inference from full body** (fixes the `framework` catch-all + the mis-typed guides).

**Nothing here blocks adoption** — the framework is the backbone today; these are the develop-forward items.

---

## 9 · Appendix — pointers

- **Snapshot (Heenal v1, frozen):** `data/ontology/snapshot-2026-07-05/` — `frontmatter-census.yaml` (field frequency + value vocab across the 119, with divergence notes), `content-structure.md` (3 journeys / 14 chapters / 52 steps; the 254-article legacy taxonomy), + the 4 frozen ontology `*.yaml`.
- **Crosswalk (the backbone):** `data/crosswalks/regen-toolkit.yaml` — 19 type rows, 9 classification rows, 5 relationship-group rows, an explicit `gaps` block, and a `summary` with the count reconciliation (19 not 21).
- **Structured diff (companion to this doc):** `data/crosswalks/comparison.yaml`.
- **June's framework view v1:** `data/{encyclopedia,concepts,tracks,resources,source-systems}.yaml` + `-salvaged`; methodology + honest-state notes + the 6 framework gaps in `docs/reports/2026-06-17-content-through-framework-report.md`.
- **Kernel:** `packages/toolkit-framework/schemas/{core-entities,extension-entities,encyclopedia-entry,review-maturity}.yaml`; `packages/toolkit-framework/architecture/layers.md` (the 10 layers).
