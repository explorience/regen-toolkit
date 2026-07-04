# Framework Coverage Map — Master Doc ↔ `toolkit-framework`

> **Generated 2026-06-17** from a systematic 6-reader gap analysis of `docs/MASTER.md` (~30,847 lines). This is the **authoritative coverage contract**: every framework section of the master doc → where it lands in `packages/toolkit-framework` → build status. It is also the **feedback substrate** — the reconciliations below are the highest-value gaps AND the items that feed back to the master doc (see [`FEEDBACK-LOOPS.md`](FEEDBACK-LOOPS.md)).
>
> Status legend: 🟥 net-new · 🟧 partial (asset exists, needs work) · 🟩 covered. Priority: ★ keystone · ◆ spine · ○ later.

## A. The keystones (build these first — everything depends on them)

| # | Artifact | Package home | Why keystone | Status |
|---|---|---|---|---|
| K1 | **`schemas/review-maturity.yaml`** — ONE canonical maturity/review/public-use state model + crosswalks | `schemas/` | **5+ divergent maturity ladders exist** (see R1). Every schema/skill consumes this. Build it first or everything drifts. | 🟥 |
| K2 | **`schemas/source-system.schema`** — source-system card w/ `return_path`, `reuse_conditions`, `attribution` | `schemas/` | **The federation primitive.** Reused by L3/L8/L10/§18/§19. Return-path = the contribute-back hook. | 🟧 (data staged) |
| K3 | **`schemas/frontmatter.schema`** — shared AI-readable metadata base every entry extends | `schemas/` | The substrate of federated search + exportable schemas. | 🟥 |
| K4 | **Semantic kernel** — `schemas/core-entities.yaml` (12–15) + `extension-entities.yaml` (`maps_to_core`) + `relationships.yaml` + crosswalks + JSON-LD context | `schemas/` + `architecture/ontology-posture.md` | **The interoperability base guideline.** Layer A frozen+versioned = the fork-compatibility contract. | 🟧 (`data/ontology/*` precedent, needs reconciliation) |
| K5 | **`schemas/contribution-record.schema`** — who/what/lineage/`source_system_reciprocity` | `schemas/` | **Central to contribute-back.** Capture now, reward later. | 🟥 |
| K6 | **Compatibility engine** (`src/`) — one validator for option×option, track, deployment validity | `src/` | Named in `data/option-library.yaml` as its own `csis_integration_gap`. 3 callers, 1 impl. | 🟥 |
| K7 | **`skills/capture-and-route`** — raw lead → typed objects → layer (deep intake) | `skills/` | The flagship adoption surface; runs the dialectical loop. | 🟥 |
| K8 | **The 16 distinctions + minimum structural rule → `architecture/invariants.md` + `src` validators** | `architecture/` + `src/` | The most testable content in the framework; the package's conformance suite. | 🟥 |

## B. Coverage by layer / section (distilled)

### Orientation, principles, system overview (Reader 1)
| Master-doc section | → package | Status | Pri |
|---|---|---|---|
| Working Orientation, core diagnosis ("knowledge coordination friction"), preserved-commitments | `architecture/README.md` + `architecture/invariants.md` | 🟧 | ★/◆ |
| 18 Cross-Cutting Principles (provenance, attribution, maturity, public-use, claim-evidence, review-scales-with-risk, regenerative obligation, consent, anti-extractive synthesis, interoperability, type/tag, pattern humility, local/ecological, AI-but-human-governed, infra-serves-workflows, living-systems health, compost, contribution-legible) | `process/principles.md` + schema field-blocks | 🟧 mostly 🟥 | ★ |
| Problems / Theory of Change / **regeneration-claim boundary** / outcomes / learning signals | `architecture/problems-and-theory-of-change.md` | 🟥 | ★/◆ |
| 10-layer stack + core movement + **Minimum Operating Kernel (5 objects)** + cross-layer mapping + 16 distinctions + minimum structural rule | `architecture/{layers,operating-loop,kernel-objects,invariants}.md` | 🟧 | ★ |
| Contribution model + **deep intake (one thing → many entries)** + contribution states + intake forms | `skills/capture-and-route` + `process/contribution-intake.md` | 🟥 | ★ |

### Ontology / semantic kernel — THE KEYSTONE (Reader 2)
| Two-layer posture (interoperable core + extensions); 12–15 core types; ~33 extension types w/ `maps_to_core`; ~70 relationship predicates (incl. separable CSIS/governance module); Octo/BKC/SuperBenefit/CSIS crosswalks (**align-and-map, NOT adopt-as-base**); classification dimensions; type/tag discipline; ontology change process; provenance/epistemic-status fields; JSON-LD/RDF serialization (author YAML → generate graph); fork-compatibility (frozen versioned Layer A + namespaced local extensions + `maps_to_core` + crosswalks) | `schemas/` + `architecture/{ontology-posture,type-tag-discipline,fork-compatibility}.md` + `src/cli` generator | 🟧 (strong `data/ontology/*` precedent) | ★ |

### Encyclopedia + Resource Graph + Social Signal (Reader 3)
| Encyclopedia layer + 7 page types + entry schema + publishing standards + domain map | `architecture/02-*` + `schemas/encyclopedia-entry` + `templates/` | 🟧/🟥 | ◆ |
| Resource Graph (5-layer raw→public pipeline) + resource schema (min+normalized, provenance fields) + type/domain/function vocabs + routing logic + review/maturity + high-risk triggers + 8 views + MVP form | `architecture/03-*` + `schemas/resource.schema` + `process/resource-routing.md` | 🟧 (V3 DB = instance data) | ★/◆ |
| **Source System Registry + Card** (return-path) | `schemas/source-system.schema` + `templates/source-system-card` | 🟧 | ★ (=K2) |
| Social Signal Scan (retweets≠endorsements; no public person-nodes) + schema + safeguards | `schemas/social-signal.schema` + `process/social-signal-safeguards.md` | 🟧 (1,372 rows staged) | ◆/○ |
| **`skills/capture-and-route` + crosswalk-driven lift ETL** | `skills/` + `src/cli lift-resources` (v2) | 🟥 (old `scripts/lift-resources.mjs` superseded) | ★ |

### Concept / Option / Track / Deployment (Reader 4)
| Concept & Idea Ecology (7 object types, lineage + tension-map schemas, concept maturity, Frame Language Audit/Idea Processor [Durgadas]) | `architecture/04-*` + `schemas/{concept-lineage,tension-map}` + `process/frame-language-audit.md` | 🟧/🟥 | ◆/○ |
| Option Library (9 categories + **option-entry schema/template** + ~80 seed options + **compatibility logic**) | `architecture/05-*` + `schemas/option-entry` + `data/option-library.yaml` (enrich) + K6 | 🟧/🟥 | ★ |
| Tracks & Composition (**track schema/template** + 5 seed tracks + track compatibility) | `schemas/track` + **new `data/tracks.yaml`** + K6 | 🟥 (no tracks data exists) | ★ |
| Deployment & Structural Integrity (6-component integrity check + **deployment schema/template** + 3-level structural use + minimum enforceable safeguards + falsifiability + readiness levels L0–L6 + CSIS construct-handling map) | `schemas/deployment` + `process/structural-integrity-posture.md` + `data/deployment-requirements.yaml` (enrich) | 🟧 | ★ |
| **`skills/compose-journey`** (assemble track/journey via the compatibility engine) | `skills/compose-journey` | 🟥 | ★ |

### Implementation / Evolution / Infrastructure / Roles / Reward / Source-systems (Reader 5)
| Implementation & Learning Memory (record schema + 9 types + maturity + `source_position` + "what returns to commons") | `architecture/08-*` + `schemas/implementation-record` | 🟥 (doc exists) | ★/◆ |
| Evolution Layer (Signal→Sensemaking→Balance→Intervention→Integration→Memory; signal types 10/kinds 21; response verbs; evolution-record + update-proposal schemas; **restricted-memory tiers**) | `architecture/09-*` + `schemas/{signal,evolution-record,update-proposal,public-use-boundary}` | 🟥/🟧 | ★/◆ |
| Infrastructure & Substrate + AI-workflow boundaries + **FEDERATION (interconnecting gardens, return-paths, exportable schemas, federated search, forkable/localized)** + infra candidates + frontmatter schema | `architecture/10-*` + `architecture/federation.md` + `process/ai-workflow-boundaries.md` + K3 | 🟥/🟧 | ★/◆ |
| Contributor Roles (reconcile 12+11+17 role lists; **role-failure safeguards**: separation of contribution/review/publication; reviewer process + prompts; 10 contribution types) | `architecture/contributor-roles.md` + `process/role-failure-safeguards.md` + `schemas/{contributor-role,contribution}` | 🟥 | ★/◆ |
| **Reward & contribution economy** — DESIGN SEED ONLY, do NOT build the mechanism (recognition→attribution→…→retroactive; regenerative obligation; CSIS-gated) | `architecture/reward-economy-seed.md` | 🟥 | ○ |
| Source-systems starter (~9 clusters; de-dupe vs `data/resources.yaml`) | `schemas/source-system` + `templates/` | 🟧 | ◆ |

### CSIS / process / templates (Reader 6)
| Structural Integrity Posture + **CSIS-Informed-Not-Conformant (4 handling modes)** + **3-level model** (principle/prompt/standard) + **visibility→falsifiability** + **7 minimum enforceable safeguards** + CSIS construct-handling map (8 constructs) + 7 open CSIS decisions + source-lineage enforcement | `process/csis-safeguards/*` + `schemas/{integrity-level,csis-construct-status,safeguards/*}` + route open decisions → `docs/BACKLOG.md` | 🟧/🟥 | ★/◆ |
| **Review-prompt bank (§21, audience-segmented incl. Durgadas)** | `process/review-prompts/` + `data/review-prompts.yaml` → `skills/csis-review` | 🟥 | ★ |
| **Appendices A–I = ready-made templates/schemas** (source-system card, resource registry, deep intake, option entry, deployment, implementation memory, social-signal fields, glossary, next-steps) | `schemas/*.schema` + `templates/instance/*` | 🟧 (field lists written; not encoded) | ★/◆ |
| **`skills/csis-review`** (apply prompts + grade against 3-level model + run safeguard checks; flag, never certify) | `skills/csis-review` | 🟥 | ★ |

## C. Critical reconciliations (the highest-value gaps = the master-doc feedback items)

Building the framework **forces** resolving these master-doc internal inconsistencies. Each resolution flows back to Matty's master doc (see FEEDBACK-LOOPS). **These are not blockers to flag-and-wait — they are the co-evolution work itself.**

- **R1 — Maturity/state vocabulary fragmentation (THE #1).** ≥7 divergent ladders: ontology-classification `seed/experimental/emerging/proven/canonical` (5) · master-doc maturity (13) · Encyclopedia (8) · Resource-Graph status (13) · Option (9) · Track (7) · Deployment readiness L0–6 · Concept (9) · Implementation (9) · contribution-states (10) · public-use status (10). **→ K1: one canonical base enum + per-layer extensions + crosswalks.** *Biggest single feedback item to the master doc.*
- **R2 — Three orthogonal trust axes conflated:** maturity-state vs public-use-status vs contribution-lifecycle-state. Must model as **independent** fields, not collapse.
- **R3 — Kernel (5 objects) ≠ entity ontology.** The MOK (Resource/Concept/Option/Deployment/Signal) is a usage-layer front-door; the ontology has ~45 types. Define kernel-as-curated-subset vs separate schemas.
- **R4 — 10 layers vs 11.** Next Working Draft splits Source-System Registry into its own layer; the canonical table folds it into L3. Pick one.
- **R5 — Layer-sequence ordering conflict.** "Deployment → Tracks" (layer sequence) vs "Track → Deployment" (object loop / Compose→Specify movement). Reconcile.
- **R6 — Cross-cutting content stated twice:** the 9-row cross-cutting-systems table ≈ the 18 principles. Encode once.
- **R7 — CSIS/Octo posture mismatch.** Existing `data/ontology/*.yaml` hardcodes "every type MUST resolve to an Octo base" + firm `csis_requirement`; the 2026-05-15 master doc softened to "Octo is a *candidate*, CSIS-*informed* not conformant." **Relax the YAML to match.**
- **R8 — Role lists:** §15 (12) + §13.9 (11) + §17 (17) → one superset role registry.
- **R9 — Two relationship grammars** (`data/ontology/relationships.yaml` vs master §6.3) → unify (formal-semantic layer vs contributor-facing layer).
- **R10 — Wrong loop in `data/feedback-process.yaml`** (Capture/Classify/Review/Update/Communicate/Version) vs the master-doc adaptive loop (Signal→Sensemaking→Balance→Intervention→Integration→Memory). Adopt the master-doc loop.

## D. Existing assets — lift / reconcile / discard

- **Lift + re-anchor (good prose, stale line refs):** `docs/layers/01..10` → `architecture/`; `docs/CSIS.md` → `process/csis-safeguards/` (posture reframe pending).
- **Enrich, don't replace:** `data/option-library.yaml` (9-cat stub), `data/deployment-requirements.yaml` (6-component check + `relations` block — the best existing artifact, prototype for per-layer `relations`), `data/ontology/*` (kernel precedent — reconcile per R1/R7).
- **Instance data (NOT framework):** `data/resources/` (V3 DB, 28 CSVs) — lifted *into* the schemas via K7's ETL, stays instance-side.
- **Mis-shaped / superseded — do NOT build on:** `data/sources.yaml` (empty org-os blog/podcast stub — wrong shape for source systems), `data/resources.yaml` (April mechanical lift, superseded by V3), `scripts/lift-resources.mjs` (old line-anchored lift).
- **Caveat:** most `data/*.yaml` derive from the OLDER `Web3 Toolkit.md` iteration — re-validate vocab against the 2026-06-15 master doc before lifting (this is R1/R7/R9).

---

_This map is maintained as the framework is built — each artifact moves 🟥→🟧→🟩, and each reconciliation (R1–R10), when resolved, updates both this map and (via draft-and-present) the master doc. See [`FEEDBACK-LOOPS.md`](FEEDBACK-LOOPS.md)._
