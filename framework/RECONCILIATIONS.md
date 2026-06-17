# Reconciliations — Resolved Master-Doc Inconsistencies

> The decision log for the master-doc inconsistencies that building `toolkit-framework` forces us to resolve (COVERAGE §C, R1–R10). Each resolved item flows back to Matty's master doc as a **draft-and-present** proposal (FEEDBACK-LOOPS Loop 2) — we do **not** edit `docs/MASTER.md` directly. Status: ✅ decided · ⏳ open.

---

## R1 — Maturity/state vocabulary → THREE orthogonal axes ✅ (2026-06-17)

**Problem:** ≥7 divergent maturity/state ladders across the doc + a direct contradiction in `data/ontology/*.yaml` (`seed/experimental/emerging/proven/canonical`).

**Decision:** There is no single ladder because the doc conflates **three orthogonal axes** (this also resolves R2). The framework defines one canonical enum per axis; every per-layer ladder crosswalks to them.

1. **`maturity`** — how developed/trustworthy the content is (9): `raw · draft · candidate · source-linked · reviewed · field-informed · pattern-generating · deprecated · archived`.
2. **`public_use`** — whether it's safe to expose publicly (10): `internal-only · raw-lead · ok-with-caveat · source-linked-unreviewed · reviewed-for-explanation · reviewed-for-guidance · requires-community-consent · requires-domain-review · not-public-yet · deprecated`.
3. **`lifecycle_state`** — where it sits in the intake→compost pipeline (10): `raw-lead · routed · extracted · source-linked · ai-synthesis · human-reviewed · field-informed · public-candidate · mature · compost`.

Plus two **orthogonal boolean flags** (not states): `ai_assisted`, `high_risk`.

**Per-layer ladders crosswalk to `maturity`:** Option(9)/Track(7)/Concept(9)/Implementation(9) → `maturity`; **Deployment readiness L0–L6** stays a deployment-specific field with an explicit crosswalk to `maturity`. Encoded in `schemas/review-maturity.yaml` (K1) with a `crosswalks:` block.

**→ Master-doc feedback:** propose collapsing the scattered ladders into these three named axes in §"Cross-Cutting Principles" 3 & 4 + the layer sections.

## R3 — Kernel (5 objects) vs entity ontology ✅ (2026-06-17)

**Problem:** The Minimum Operating Kernel (Resource·Concept·Option·Deployment·Signal) doesn't map onto the ~45-type entity ontology.

**Decision:** The 5 kernel objects are a **curated authoring profile (a "front door")**, NOT separate types. They are the 5 most-used entity types, promoted as the v0.1 entry surface. The schema for each (e.g. Resource) is the same whether reached via the kernel or the full ontology. Encoded as a `kernel: true` marker + a `kernel-profile.yaml` listing the 5, over the single `core-entities.yaml`. A contributor uses 5; the system refines into fuller types over time.

**→ Master-doc feedback:** state explicitly that the MOK is a usage-layer subset of the ontology, not a parallel type system.

## R7 — Octo/BKC + CSIS posture → align-and-map, not adopt-as-base ✅ (2026-06-17)

**Problem:** `data/ontology/*.yaml` hardcodes "every type MUST resolve to an Octo base" + firm `csis_requirement`; the 2026-06-15 master doc softened to "Octo is a *candidate*, CSIS-*informed* not conformant, avoid premature lock-in."

**Decision:** Adopt the master-doc posture. The framework **defines its own kernel and ships crosswalks** (`schemas/crosswalks/{octo,superbenefit,csis}.yaml`). `maps_to_core` (the generalized `octo_base`) is **encouraged but optional** — "map where clean alignment exists." CSIS is a **separable optional overlay module** (predicates + per-type constraints); a fork can run the core kernel with zero CSIS edges. When lifting `data/ontology/*.yaml`, relax the mandatory mapping rule to advisory.

**→ Master-doc feedback:** none needed (the master doc already holds this posture); the feedback is to the *existing YAML*, which the kernel build (SP2) corrects.

---

## Open (resolve as their wave begins)
- **R4** (10 vs 11 layers — source-system registry) ⏳ → SP9
- **R5** (Deployment→Tracks vs Track→Deployment ordering) ⏳ → SP9
- **R6** (9-row cross-cutting table vs 18 principles — encode once) ⏳ → SP5
- **R8** (role lists 12+11+17 → one registry) ⏳ → SP5
- **R9** (two relationship grammars → unify) ✅ (2026-06-17, SP2) → unified into one `relationships.yaml` grammar: `core_interop` + domain groups (`practice_pattern`, `discourse`, `source_lineage`) + a **separable optional `governance_csis` module** (R7). The old `data/ontology/relationships.yaml` becomes a lift-source to reconcile against this.
- **R10** (`feedback-process.yaml` wrong loop → adopt Signal→Sensemaking→Balance→Intervention→Integration→Memory) ⏳ → SP5

---

_R1, R3, R7 resolved 2026-06-17 to unblock the schema keystones (SP1/SP2). Master-doc proposals batch into the next iteration._
