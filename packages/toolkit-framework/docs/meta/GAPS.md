# GAPS — what the framework covers, what it doesn't, and what the group needs to decide

This register is the artifact Matty + the group review. It is derived from `framework/COVERAGE.md` (the master-doc↔package map), `framework/RECONCILIATIONS.md` (R1–R10), `framework/FEEDBACK-LOOPS.md` (the co-evolution loops), and gaps surfaced while building the 0.1.0-beta.1 knowledge base. **Cadence:** these batch into the next master-doc iteration as **draft-and-present proposals** — we never edit `docs/MASTER.md` directly (that's Loop 2: framework→master-doc feedback). Each item is framed as a concrete question + our recommendation so it's easy to decide.

---

## (a) Coverage — what the framework covers vs the master doc

The authoritative map is `framework/COVERAGE.md`. Summary of the eight keystones (status as of 0.1.0-beta.1):

- **K1 `review-maturity`** — the canonical state model (3 orthogonal axes + 2 flags + crosswalks). **Built** (`schemas/review-maturity.yaml`). Resolves the master doc's ~7 divergent maturity ladders (R1).
- **K2 `source-system`** — the federation primitive, with the `return_path` reciprocity hook. **Built**.
- **K3 `frontmatter`** — the shared metadata base every entry `extends`. **Built**.
- **K4 semantic kernel** — `core-entities` (Layer A) + `extension-entities` (each `maps_to_core`) + `relationships` + `kernel-profile` + JSON-LD `context` generator + fork-compatibility validator. **Built** (the V3 resource lift still needs the real human review pass).
- **K5 `contribution-record`** — durable contribution attestation + `source_system_reciprocity` hook. **Built**.
- **K6 compatibility engine** (`src/compatibility.mjs`) — option×option / track / deployment validity. **Built**.
- **K7 `capture-and-route` skill** — raw lead → typed objects → layer routing. **Built** (skill spec; not yet exercised at scale).
- **K8 the 16 distinctions + minimum structural rule** — `architecture/invariants.md` + `src/invariants.mjs`. **Built** (the package's conformance surface).

**All 8 keystones exist and pass tests (38/38). What remains is depth, real-content exercise, and the group's ratification of the reconciliations below.**

---

## (b) Contradictions in the master doc that need the group's call

These are the R1–R10 reconciliations restated as plain-language decisions. For each: the contradiction, our resolution, the decision we need, and who owns it.

### R1 (the big one) — Maturity vocabulary

**Contradiction:** ~7+ divergent maturity/state ladders across the doc (ontology 5, master-doc 13, Encyclopedia 8, Resource-Graph 13, Option 9, Track 7, Deployment L0–L6, Concept 9, Implementation 9, contribution 10, public-use 10).

**Our resolution:** Three orthogonal axes — `maturity` (9), `public_use` (10), `lifecycle_state` (10) — plus two boolean flags (`ai_assisted`, `high_risk`); every per-layer ladder crosswalks to `maturity`.

**Decision needed:** Ratify collapsing the scattered ladders into these three named axes in Cross-Cutting Principles + each layer section.

**Who:** Matt (+ Durgadas on the public_use tiers). *Biggest single feedback item.*

---

### R2 — Three trust axes conflated

**Contradiction:** maturity-state vs public-use-status vs contribution-lifecycle-state used interchangeably.

**Our resolution:** Model as independent fields (resolved with R1).

**Decision needed:** Ratify keeping them orthogonal.

**Who:** Matt.

---

### R3 — Kernel vs ontology

**Contradiction:** The 5-object kernel reads as separate from the ~45-type ontology.

**Our resolution:** The Minimum Operating Kernel is a curated authoring profile ("front door"), not a parallel type system — the 5 most-used entity types promoted as the v0.1 entry surface.

**Decision needed:** State explicitly that the MOK is a usage-layer subset.

**Who:** Matt.

---

### R4 — 10 vs 11 layers

**Contradiction:** The next working draft splits the Source-System Registry into its own layer; the canonical table folds it into L3.

**Our resolution:** 10 layers; Source-System Registry = sub-layer L3a.

**Decision needed:** Confirm 10 layers. (No master-doc edit strictly required — the architecture doc clarifies.)

**Who:** Matt/Heenal.

---

### R5 — Layer sequence vs object loop ordering

**Contradiction:** "Deployment → Tracks" (layer sequence) vs "Track → Deployment" (the object / Compose→Specify loop).

**Our resolution:** Lifecycle is the human spine, the layer sequence is the data-model view; a bridge table reconciles them (`architecture/operating-loop.md`).

**Decision needed:** Accept both views + document the bridge.

**Who:** Heenal/Matt.

---

### R6 — Cross-cutting stated twice

**Contradiction:** The 9-row cross-cutting-systems table ≈ the 18 principles.

**Our resolution:** Encode once — the 18 principles are the home; the 9-row table is a coarser rollup.

**Decision needed:** Accept.

**Who:** Matt.

---

### R7 — CSIS/Octo posture mismatch

**Contradiction:** `data/ontology/*.yaml` hardcodes "MUST resolve to Octo base" + a firm `csis_requirement`, but the master doc softened to "Octo candidate, CSIS-informed not conformant."

**Our resolution:** Adopt the master-doc posture — the framework defines its own kernel + ships crosswalks; `maps_to_core` is encouraged but optional; CSIS is a separable optional overlay.

**Decision needed:** Ratify CSIS-informed-not-conformant as the standing posture.

**Who:** Durgadas.

---

### R8 — Role lists

**Contradiction:** §15 (12 roles), §13.9 (11), §17 (17) diverge.

**Our resolution:** One reconciled superset — 19 scoped roles with an "appears in" provenance column (`process/roles.md`).

**Decision needed:** Adopt the single role registry.

**Who:** Matt.

---

### R9 — Two relationship grammars

**Contradiction:** `data/ontology/relationships.yaml` (formal-semantic) vs master §6.3 (contributor-facing).

**Our resolution:** Unify into one `relationships.yaml` — `core_interop` + domain groups + a separable optional `governance_csis` module.

**Decision needed:** Unify the two grammars.

**Who:** Matt/Durgadas.

---

### R10 — Wrong feedback loop

**Contradiction:** `data/feedback-process.yaml` (Capture/Classify/Review/Update/Communicate/Version) vs the master-doc adaptive loop.

**Our resolution:** Adopt the canonical adaptive loop — Signal→Sensemaking→Balance→Intervention→Integration→Memory (`process/evolution-loop.md`); retire the old one.

**Decision needed:** Codify the canonical loop.

**Who:** Matt.

---

## (c) Points-to-develop — what's a stub/scaffold vs done

_Status refreshed 2026-07-05 at 0.2.0 (the "machine" iteration: work-order pipeline, storage adapters, init/federate, 7 skills, 100/100 tests)._

Concrete next-steps with our recommendation:

- **`org-os-kms` is still a scaffold** (module + profile, 2/2 tests) — the real org-os binding is pending the first adoption. **Recommendation:** develop it against the ReFi DAO adoption (Loop 3, week 1 of the machine plan).
- **Crosswalks** (`octo` / `superbenefit` / `csis`) are **starters** — they need a real mapping pass. The new `map-ontology` skill now defines the crosswalk workflow (`crosswalks/<source>.yaml`), but no schema/validator backs that format yet. **Recommendation:** fill them during the V3 lift review; add a crosswalk schema when the first real one (Gen Brasil) lands.
- **The lift ETL ran, but the resource DB needs the real V3 review pass** (28 CSVs / 12,456 rows; raw is never auto-promoted). The `review-promote` skill + `review` CLI now exist to run that pass. **Recommendation:** schedule the human review pass before publishing lifted resources.
- **Reward-economy is design-seed only.** **Recommendation:** keep it as a design-seed until an instance needs it.
- **Skills are now 7** (`ingest`, `register-source`, `review-promote`, `map-ontology` + the original 3) and the pipeline was **exercised on real content** (the 2026-07-02 planning call → 10 typed objects, first-pass accept). `capture-and-route`/`compose-journey` remain unexercised at scale. **Recommendation:** the toolkit self-ingestion + ReFi DAO adoption (week 1) are the scale test.
- **The lift ETL is now one source type** (`csv-crosswalk`) of the general ingest pipeline — `prepare` classifies transcripts, documents, csv, url-lists.
- **`data/option-library.yaml` is a 9-category stub; `data/sources.yaml` is mis-shaped** (do not build on it). **Recommendation:** enrich the option library to 10 real entries (already a backlog item); reshape sources to the `source-system` schema.

---

## (d) Open questions surfaced by building

Each framed as a question + our recommendation:

- **D1 — architecture spine:** the 10 layers OR the Knowledge Lifecycle as the framework's primary spine? **Recommendation** (per the master doc's Structure Options): lifecycle as the spine, layers as the data-model view — both documented via the bridge table. Decide before deepening `architecture/`.
- **Layer-A core membership: 12 vs 15?** The kernel currently freezes 15 core types. **Recommendation:** keep 15 for the beta; treat any reduction as a governed Layer-A change (breaking).
- **Schema serialization format:** YAML now; do we also ship JSON Schema / SHACL for external consumers? **Recommendation:** keep YAML as the source of truth + generate the JSON-LD `@context` (already supported via `node src/cli.mjs context`); add a JSON Schema export only if an adopter needs it (YAGNI).
- **Steward: phase or cross-cut?** Is "Steward" a lifecycle phase or a cross-cutting role? **Recommendation:** a cross-cutting role (it appears across phases) — encoded in `process/roles.md`.
- **Package name/scope + `org-os-kms` home + repo-mirror timing** (PLACEMENT.md §8). **Recommendation:** keep `@regen-commons/toolkit-framework`, develop `org-os-kms` here, mirror to a public repo when stable.
- **Journey site generator: framework or instance?** (SEPARATION.md). **Recommendation:** generator = framework, the 3 ReFi journeys = instance. Heenal to confirm.

---

## Top 5 decisions we need from the group

1. **R1 — adopt the three-axis maturity model** (`maturity` · `public_use` · `lifecycle_state` + flags), collapsing the ~7 scattered ladders. *Rec: yes.*
2. **R7 — ratify CSIS-informed, not CSIS-conformant** as the standing posture; CSIS as a separable optional overlay. *Rec: yes.*
3. **R8 — adopt the single 19-role registry** (with provenance) over the three divergent role lists. *Rec: yes.*
4. **R3 — state that the Minimum Operating Kernel is a curated subset** (front door), not a parallel type system. *Rec: yes.*
5. **D1 — make the Knowledge Lifecycle the spine, the 10 layers the data-model view** (both, bridged). *Rec: yes.*
