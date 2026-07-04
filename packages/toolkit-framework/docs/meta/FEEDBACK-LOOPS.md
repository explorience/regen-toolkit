# Framework Feedback Loops — Continuous Co-Development

> **Generated 2026-06-17.** The framework, the master doc, and the instances must **co-develop**, not version in isolation. This doc specifies the loops + the mechanisms that carry them, so that building `toolkit-framework` continuously improves `docs/MASTER.md`, and adopting it continuously improves the framework. Pairs with [`COVERAGE.md`](COVERAGE.md).

## The four loops

```
        ┌──────────────────── (1) DISTILL ─────────────────────┐
        ↓                                                       │
  ┌───────────┐   (2) RECONCILE / FEED BACK   ┌──────────────────┐
  │ MASTER DOC │ ←───────────────────────────  │ toolkit-framework │
  │ (Matty)    │ ───────────────────────────→  │  (package)        │
  └───────────┘        (1) DISTILL              └──────────────────┘
                                                  ↓ (3) ADOPT   ↑ (4) CONTRIBUTE BACK
                                          ┌──────────────────────────┐
                                          │ INSTANCES (ReFi DAO, BCN, │
                                          │ …) — self-contained repos │
                                          └──────────────────────────┘
                                                  ↕ (4b) PEER FEDERATION
```

### Loop 1 — Master doc → framework (DISTILL)
New/changed master-doc material becomes framework artifacts.
- **Trigger:** a new master-doc iteration (like the 2026-06-15 intake) or a section update.
- **Mechanism:** re-run the gap analysis (the 6-reader sweep) → update [`COVERAGE.md`](COVERAGE.md) (🟥/🟧/🟩 per section) → build/refresh the affected `schemas/`·`architecture/`·`process/`·`skills/`.
- **Rule:** the framework is the **operational distillation** of the master doc, never a verbatim copy. Derive; don't restate (per CLAUDE.md master-doc edit rules).

### Loop 2 — Framework → master doc (RECONCILE / FEED BACK) ← the engine
Building the framework **forces** resolving the master doc's internal inconsistencies, and those resolutions flow back.
- **Trigger:** every reconciliation in COVERAGE §C (R1–R10) + any gap/contradiction a builder hits.
- **Mechanism:** each resolution is logged in `framework/RECONCILIATIONS.md` (decision + rationale) → distilled into a **draft-and-present** edit proposal for Matty's master doc (e.g. "R1: adopt one canonical maturity vocab; here's the proposed §-edit"). **Never edit `docs/MASTER.md` directly** — propose, Matty integrates (his working doc).
- **Why it matters:** the master doc has ≥7 conflicting maturity vocabularies (R1), 3 role lists (R8), two relationship grammars (R9), etc. The framework *can't be built* without picking one each — so the build is the master doc's editor. This is the co-evolution.
- **Cadence:** batch reconciliations into the next master-doc iteration (Matty's "AI-native draft → group feedback → checkpoint" rhythm).

### Loop 3 — Framework → instance (ADOPT)
An instance is born by adopting the framework.
- **Mechanism:** `org-os-kms` profile (framework pre-loaded) or `toolkit-framework init` → scaffold from `templates/instance/` → fill domain slots → run skills over the domain's sources.
- **Versioning:** an instance pins a framework version (Layer A semver — the frozen interoperable core). Layer-A changes are breaking; Layer-B/local changes are not.

### Loop 4 — Instance → framework (CONTRIBUTE BACK) ← the dialectic
Adoption develops the framework. **The framework's v1 is the residue of the first adoptions.**
- **Trigger:** an instance hits "the framework can't handle X" (a missing type, a domain pattern, a new option, a signal kind) OR produces a reusable pattern.
- **Mechanism:** the instance emits a **`contribution-record`** (COVERAGE K5) + an **Update Proposal** (the ontology change process) carrying: the gap/pattern, an **ontology extension** (`maps_to_core`-conformant, namespaced), provenance + attribution. Routed via git (PR / federation) to the framework as a **Signal**.
- **Governance:** CSIS-informed review (the `csis-review` skill + human review) decides whether a local extension is promoted into Layer A (the shared base) or stays local. Promotion is deliberate, versioned, reviewed — never silent (COVERAGE R7's "avoid premature lock-in").
- **Anti-extraction:** peers, not absorbed (master doc L404). Contribute-back is reciprocal + attributed (the `source_system_reciprocity` field, K5).

### Loop 4b — Instance ↔ instance (PEER FEDERATION)
Instances stay interoperable + share directly.
- **Mechanism:** the shared frozen Layer-A kernel (K4) + `source-system.schema` return-paths/reciprocal-links (K2) + crosswalk files (node-to-node mappings) + federated search over exportable schemas. RegenOS (via `org-os-kms`) declares upstream/downstream.
- **Rule:** "interoperability without forced uniformity" — local language preserved as long as `maps_to_core` holds.

## The carrying mechanisms (build these so the loops actually run)

| Mechanism | Loop(s) | Where |
|---|---|---|
| **`COVERAGE.md`** (the living master-doc↔package map) | 1, 2 | `framework/` (maintained every iteration) |
| **`RECONCILIATIONS.md`** (decision log for R1–R10 + new ones) | 2 | `framework/` (net-new — create as reconciliations resolve) |
| **Draft-and-present master-doc edit proposals** | 2 | `docs/reports/` or a `framework/master-doc-proposals/` dir |
| **`contribution-record.schema`** (K5) | 4 | `schemas/` |
| **Ontology change process + `Update Proposal` type** | 4 | `process/ontology-change-process.md` + `schemas/update-proposal` |
| **`csis-review` skill** (promotion gate) | 4 | `skills/csis-review` |
| **Frozen, versioned Layer-A kernel** (K4) + crosswalks | 4, 4b | `schemas/core-entities.yaml` (semver) |
| **`source-system.schema` return-paths** (K2) | 4b | `schemas/` |
| **Signal schema + evolution loop** (the adaptive loop) | 2, 4 | `schemas/signal` + `architecture/09-evolution-layer.md` |

## Cadence (when each loop fires)

- **Per master-doc iteration** → Loop 1 (re-run gap analysis, refresh COVERAGE) + Loop 2 (propose the batched reconciliations back).
- **Per adoption** (ReFi DAO, ReFi BCN, …) → Loop 3 + Loop 4 (capture gaps → contribute back). **This is the primary development driver** — the framework grows fastest here.
- **Per biweekly** → review the open reconciliations (R1–R10) + Update Proposals with the group (Heenal/Matty/Durgadas/Koi/Rather).
- **Continuous** → Loop 4b federation as instances come online.

## The honest sequencing implication

Because Loop 4 (adoption) is the main driver and Loop 2 (reconciliation) is forced by building, the framework is built **deliberately minimal-but-real first** (the keystones K1–K8), then grown by: (a) resolving reconciliations as you hit them, (b) metabolizing what ReFi DAO/BCN adoption teaches. There is no "finish then ship." The build plan ([`docs/plans/framework-build/`](../../../../docs/plans/framework-build/README.md)) is sequenced accordingly.

---

_These loops are what make "the master doc and the framework get continuously developed" real. Loop 2 is the one most people forget — building the framework is the master doc's most rigorous editor._
