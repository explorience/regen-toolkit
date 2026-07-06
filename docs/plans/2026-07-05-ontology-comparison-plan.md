# Ontology Comparison Plan — Heenal's build ↔ toolkit-framework

**Date:** 2026-07-05
**Status:** Planned (awaiting go)
**Approach:** **C** — treat June's already-generated framework-typed objects as "framework view v1," add the formal `map-ontology` crosswalk + the comparison, re-run content only where June was thin. **Expandable to B** (full re-run through the 0.2 "machine") per-section, surgically.
**Output:** both — **data artifacts** (snapshot + crosswalk + comparison) **and** a **narrative doc**.

## Why this shape

The reprocess was already run once (`docs/reports/2026-06-17-content-through-framework-report.md`, generator `scripts/process-content.mjs`), emitting framework-typed YAML into `data/` (encyclopedia 119, concepts 8, tracks 3, resources 1616, source-systems 89, + salvaged; honest K1 state; 0 invariant violations across 1,983 objects). What's *missing* is the formal ontology crosswalk (Heenal's model → the framework kernel) and a real side-by-side. That's what this plan builds. The June output is reused as the framework corpus so we don't re-ingest 119 articles just to compare; B fills gaps surgically where June's heuristic typing is too thin.

## Inputs (all confirmed present)

- **Heenal's ontology:** `data/ontology/{regen-toolkit-classification,regen-toolkit-entities,regen-toolkit-octo-mapping,regen-toolkit-relationships}.yaml` (21 core types anchored to Octo/SuperBenefit; 9 attribute-layers; capital predicates).
- **Heenal's content:** `src/content/docs/*.md` (119 live), `src/data/journeys.js` (3 journeys), `content/{1-foundations,2-applied,3-playbooks}/` (254-article taxonomy).
- **Framework:** `packages/toolkit-framework/schemas/*.yaml` (15 core + 31 extension kernel, K1 state model, 22 object schemas), `architecture/layers.md` (10 layers), `skills/map-ontology/SKILL.md` (the crosswalk procedure).
- **June framework view (reused):** `data/{encyclopedia,concepts,tracks,resources,source-systems}.yaml` + `-salvaged` + `data/kb/`.
- **Crosswalk seeds:** `regen-toolkit-octo-mapping.yaml` (RT↔Octo↔SuperBenefit); `review-maturity.yaml` `crosswalks.legacy_ontology` (seed→raw … canonical→pattern-generating); `extension-entities.yaml` `maps_to_core`; the June report's "6 framework gaps."

## Deliverables

**Data artifacts:**
1. `data/ontology/snapshot-2026-07-05/` — frozen baseline of Heenal's ontology: the 4 `*.yaml` copied verbatim + `frontmatter-census.yaml` (field frequency + value vocabularies across the 119) + `content-structure.md` (journeys(3) + the 254 taxonomy). Freezes "version 1" before comparison.
2. `data/crosswalks/regen-toolkit.yaml` — the formal ontology crosswalk (per `map-ontology` output format): type mappings (direct / near / extension / unmapped), classification mappings (9 attribute-layers → 10 structural-layers + K1 axes + surviving frontmatter fields), maturity crosswalk (reused), relationship mappings, and an explicit `gaps` block.
3. `data/crosswalks/comparison.yaml` — the structured diff: per-type disposition + counts, per-attribute-layer disposition, content coverage (Heenal 119 ↔ June encyclopedia 119), and `b_candidates` (sections where June's typing is thin enough to warrant a machine re-run).

**Doc:**
4. `docs/reports/2026-07-05-ontology-comparison.md` — narrative synthesis: what the framework model gains / loses / restructures vs Heenal's; the crosswalk explained in prose; the gap analysis (what the framework didn't cleanly absorb); recommendations (adopt / keep-both / hybrid); and the B-expansion decision points with exact commands.

## Phases

### Phase 1 — Snapshot Heenal's ontology (baseline freeze)
- Copy `data/ontology/*.yaml` → `data/ontology/snapshot-2026-07-05/` verbatim.
- Generate `snapshot-2026-07-05/frontmatter-census.yaml` — for the 119 `src/content/docs/*.md`: field-frequency table + the actual value vocabularies used (`category`, `track`, `stage`, `maturity`, `audience`, `tags.*`), noting where they diverge from `classification.yaml`'s own vocab.
- Record `snapshot-2026-07-05/content-structure.md` — the 3 journeys + the 254 `content/` section-numbered taxonomy.
- *Artifact: a versioned, immutable "Heenal ontology v1."*

### Phase 2 — Build the ontology crosswalk (the core intellectual work)
Follow the `map-ontology` skill (survey → map types → map states → emit crosswalk). Produce `data/crosswalks/regen-toolkit.yaml`:
- **2a Type mapping** — each of Heenal's 21 types → framework core (15) or extension (31), tagged `direct` / `near` / `extension` / `unmapped`. Seed from `octo-mapping` + `maps_to_core`. Surface the asymmetries: framework-promoted-to-core (`bioregion`, `source-system`) absent in Heenal; Heenal extras (`story`, `gathering`, `playbook`, `mechanism`, `tool`, `framework`, `pattern`) → their framework extension homes; `resource` (Heenal's "⚠ not a primary type") ↔ framework's first-class L3 `resource`.
- **2b Classification mapping** — Heenal's 9 attribute-layers → framework model: `maturity`→K1 `maturity` axis (legacy crosswalk); `domain`/`function`→`frontmatter` fields; `audience`→`track.audience`; `stage`→(framework has none — flag); `scale`/`context`/`tech_surface`→frontmatter-or-dropped; **`forms_of_capital` (8 capitals)** → the framework's capital predicates *if any*, else flagged as a **Heenal extension the framework lacks** (a candidate upstream contribution).
- **2c Relationship mapping** — Heenal's 5 predicate groups → `relationships.yaml` groups; flag `capital_predicates` (creates/depends_on/impacts_capital) as a Heenal extension vs framework's `source_lineage`/`governance_csis`.
- **2d** Validate the crosswalk against the kernel (`validateKernel`, `isForkCompatible` for any Heenal-derived extension type). Every one of the 21 types + 9 layers must have a disposition.

### Phase 3 — Assess June's content reprocess (coverage + B-triggers)
- Reconcile Heenal's 119 live articles ↔ June's `data/encyclopedia.yaml` (119): confirm 1:1, spot-check `page_type` inference quality + K1-state honesty.
- Flag thin areas: mis-inferred `page_type`, `concept-lineage` only 8/10, `tracks` dropped chapters, the 698 held resource rows, the salvaged-vs-live overlap. These become `b_candidates`.
- Produce the coverage table into `comparison.yaml`.

### Phase 4 — Generate the comparison artifacts
- `data/crosswalks/comparison.yaml` (structured diff: type coverage stats, attribute disposition, content coverage, gap list, `b_candidates`).
- `docs/reports/2026-07-05-ontology-comparison.md` (the narrative).

### Phase 5 — Recommendations + B-expansion hooks
- Recommend a disposition (adopt framework view / keep both / hybrid) with rationale.
- For each `b_candidate`, give the exact surgical B command (`ingest prepare` on that source subset → `accept` → `store` → `map-ontology`), so B runs section-by-section without re-doing everything.
- List framework-upstream gaps to contribute back (unmapped Heenal structures — esp. the 8-capitals — + June's 6 gaps).

## Validation / definition of done
- Crosswalk passes `validateKernel`; every Heenal type (21) and attribute-layer (9) has an explicit disposition (mapped or flagged-unmapped).
- Comparison numbers reconcile (119=119; 21 types + 9 layers accounted for; resource/source-system counts match June).
- The doc lets a reader see, at a glance, what changes moving from Heenal's ontology to the framework's, and what the framework can't yet express.

## Notes
- **Nothing destructive:** Phase 1 copies (never moves) the ontology files; the June `data/*.yaml` are read, not rewritten. New artifacts land under `data/ontology/snapshot-*/`, `data/crosswalks/`, and `docs/reports/`.
- **B-expansion is opt-in per section** — the plan produces the *triggers*, not an automatic full re-ingest.
