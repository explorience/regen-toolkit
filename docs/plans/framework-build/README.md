# Framework Build — Plan Set

> **Created 2026-06-17.** The build plan for `packages/toolkit-framework` (+ `org-os-kms`) — to encompass the **full** master-doc framework, grown dialectically. Grounded in [`framework/COVERAGE.md`](../../framework/COVERAGE.md) (the master-doc↔package map + keystones K1–K8 + reconciliations R1–R10) and [`framework/FEEDBACK-LOOPS.md`](../../framework/FEEDBACK-LOOPS.md). Part of the [convergence pipeline](../CONVERGENCE-PIPELINE.md) (this is the detailed expansion of **P1**).

## Progress

- ✅ **SP-DEC** — R1/R3/R7 resolved ([`framework/RECONCILIATIONS.md`](../../framework/RECONCILIATIONS.md)).
- ✅ **SP0** — `packages/toolkit-framework` scaffolded (zero-build ESM + YAML + markdown; `js-yaml` only); validator + CLI; **12/12 tests green**.
- ✅ **SP1** — shared-schema keystones: K1 `review-maturity` (3-axis state model), K3 `frontmatter`, K2 `source-system` (return-path), K5 `contribution-record` (reciprocity hook), + `signal`/`provenance`/`public-use-boundary`.
- ✅ **SP2** — semantic kernel: `core-entities` (15, frozen Layer A) + `extension-entities` (31, each `maps_to_core`) + `relationships` (unified grammar, separable CSIS module — R9 ✅) + `kernel-profile` (MOK-5) + JSON-LD context generator + fork-compat validator + `architecture/{ontology-posture,fork-compatibility,type-tag-discipline}.md`. **19/19 tests green; `kernel-check` ✓.**
- ✅ **SP3** — 10 layer entry schemas (resource, option-entry, track, deployment, implementation-record, claim-evidence, evolution-record, concept-lineage, encyclopedia-entry, update-proposal).
- ✅ **SP4** — compatibility engine (`src/compatibility.mjs`): option incompatibilities · deployment 6-component validity · track composition. One engine, three callers.
- ✅ **SP6** — agentic skills (`skills/capture-and-route`, `compose-journey`, `csis-review`).
- ✅ **SP7** — resource lift ETL (`src/lift.mjs` + CLI `lift`); runs against the real V3 crosswalk (2,617 rows); raw leads never auto-promoted.
- ✅ **SP9** — architecture docs (`architecture/{README,layers,operating-loop,kernel-objects,problems-and-theory-of-change,invariants}.md`; R4/R5 resolved) + `site/journey-model.md`.
- 🔄 **SP5** — process docs (in progress).
- ⏭ **Remaining: SP8** (wire invariants → src validators), **SP10** (`org-os-kms` module + profile), **SP11** (first ReFi DAO adoption — the dialectic). **31/31 tests green.**

## Build strategy

1. **Keystone-first, then dialectical.** Build K1–K8 (the shared base everything depends on) as a minimal-but-real spine; grow the rest by metabolizing reconciliations (R1–R10) + adoptions (ReFi DAO/BCN). **No "finish then ship"** (FEEDBACK-LOOPS).
2. **Reconcile-as-you-build.** Each R1–R10 is resolved when its artifact is built, logged in `framework/RECONCILIATIONS.md`, and fed back to the master doc as a draft-and-present proposal (Loop 2). The build IS the master doc's editor.
3. **TDD throughout.** Schemas get validation tests (valid/invalid fixtures); the compatibility engine + CLI + skills get behavior tests. No production code without a failing test first (`superpowers:test-driven-development`).
4. **Self-contained + agnostic.** `toolkit-framework` has zero org-os dependency; org-os coupling lives only in `org-os-kms`.

## Execution model

Each sub-plan (SP*) below is a **scoped spec**. To execute one:
1. `superpowers:using-git-worktrees` → isolated worktree off `regen-toolkit-os`.
2. `superpowers:writing-plans` → expand the SP into a full bite-sized TDD plan (`docs/plans/framework-build/<SP>.md`).
3. `superpowers:subagent-driven-development` → fresh subagent per task + two-stage review (spec, then quality).
4. `superpowers:verification-before-completion` + `/run` → verify; then `superpowers:finishing-a-development-branch`.

Do **not** pre-expand all SPs to TDD now — expand each as its wave begins (dialectical; later SPs reshape as adoptions teach).

## Waves & sub-plans

### Wave 0 — Scaffold + gating decisions
**SP0 — Package scaffold.** `packages/toolkit-framework/{package.json (neutral scope, NOT @org-os),tsconfig,src/{index,cli},test setup}` + CI (`build`, `test`, `validate`). First TDD: `toolkit-framework --version` / `validate` no-op. **DoD:** `npm test` + `npm run build` green in the package. Skills: TDD. Depends: —.
**SP-DEC — Resolve gating reconciliations** (decision work, draft-and-present to Matty + group): **R1** (one canonical maturity/state vocab + crosswalks), **R3** (kernel-5 vs entity-ontology relationship), **R7** (Octo-candidate / CSIS-informed posture — relax the YAML). Output → `framework/RECONCILIATIONS.md` + master-doc proposals. **Gates K1, K4.** Skills: brainstorming + deep-research. Depends: —.

### Wave 1 — Shared base (keystones K1–K5, K8)
**SP1 — Shared schemas (build-once).** K1 `review-maturity.yaml` · K3 `frontmatter.schema` · K2 `source-system.schema` (return-path) · K5 `contribution-record.schema` · `public-use-boundary.schema` · `provenance.schema` · `signal.schema`. TDD: valid + invalid fixtures per schema. **DoD:** every schema validates fixtures; R1/R2 resolved + logged. Depends: SP0, SP-DEC(R1).
**SP2 — Semantic kernel (K4).** `core-entities.yaml` (12–15, frozen+semver) · `extension-entities.yaml` (~33, each `maps_to_core`) · `relationships.yaml` (~70, CSIS/governance as separable module) · `crosswalks/{octo,superbenefit,csis}.yaml` · `context.jsonld` + YAML→JSON-LD/RDF generator (`src/cli generate`) · `architecture/{ontology-posture,type-tag-discipline,fork-compatibility}.md`. Reconcile `data/ontology/*` (R7, R9). TDD: generator output + `maps_to_core` completeness + fork round-trip. **DoD:** kernel generates valid JSON-LD; a mock fork extends + maps back; R3/R7/R9 resolved. Depends: SP0, SP-DEC.
**SP8 — Invariants (K8).** The 16 distinctions + minimum structural rule → `architecture/invariants.md` + `src/cli validate` rules (e.g. "Track must not carry Deployment structural fields"). TDD: each distinction = a failing-then-passing validator test. **DoD:** `validate` enforces all schema-enforceable distinctions; the rest documented as review-only. Depends: SP1, SP2.

### Wave 2 — Layer schemas + compatibility engine
**SP3 — Layer entry schemas + templates (Appendices A–I).** `schemas/{resource,encyclopedia-entry,concept-lineage,tension-map,option-entry,track,deployment,implementation-record,evolution-record,update-proposal,claim-evidence}.schema` + `templates/instance/*` (the Appendix A–I field lists, already written in the master doc → encode). New `data/tracks.yaml`; enrich `data/{option-library,deployment-requirements}.yaml`. TDD: fixtures per schema. **DoD:** all layer objects validate; templates scaffold cleanly; readiness/maturity enums reference K1. Depends: SP1 (K1/K3), SP2.
**SP4 — Compatibility engine (K6).** `src/compatibility/` — one validator for option×option incompatibility, track composition, deployment validity (consumes option/track/deployment schemas). TDD: known compatible/incompatible fixtures. **DoD:** 3 callers (option, track, deploy) use one engine; closes `option-library.yaml` `csis_integration_gap`. Depends: SP3.

### Wave 3 — Process + agentic skills (the operating surface)
**SP5 — Process docs.** `process/{principles,maturity-states,public-use-boundaries,review-types,contribution-intake,contribution-states,csis-safeguards/*,structural-integrity-posture,frame-language-audit,federation,ai-workflow-boundaries,role-failure-safeguards,ontology-change-process,working-practices}.md` + `schemas/{contributor-role,integrity-level,csis-construct-status,safeguards/*}` + `data/review-prompts.yaml`. Reconcile R6 (9-table vs 18 principles → once), R8 (roles), R10 (evolution loop). Route the 7 open CSIS decisions → `docs/BACKLOG.md`. **DoD:** principles/process encoded once; R6/R8/R10 resolved. Depends: SP1.
**SP6 — Agentic skills.** K7 `skills/capture-and-route` (deep intake: raw lead → typed objects → layer, high-risk triggers, review state) · `skills/compose-journey` (assemble track via K6) · `skills/csis-review` (apply §21 prompts + 3-level grading + safeguard checks; **flag, never certify**) · `skills/review`. TDD via fixtures (input lead → expected routed objects). **DoD:** capture-and-route round-trips a real ReFi resource; skills are agent-agnostic. Depends: SP3, SP4, SP5.

### Wave 4 — ETL + site + architecture docs
**SP7 — Resource DB lift v2 (ETL).** `src/cli lift-resources` — crosswalk-driven (`data/resources/csv/toolkit-layer-crosswalk.csv` → schemas), carry review-state, clean tweet-noise, de-dupe; supersede `scripts/lift-resources.mjs`. Output = instance data (`data/resources.yaml`, new `data/source-systems.yaml`). TDD: sample rows → expected typed entries + preserved provenance. **DoD:** V3 DB lifts validating against SP3 schemas; no raw lead silently promoted. (= pipeline P2.) Depends: SP3, SP6.
**SP9 — Site model + architecture docs.** `architecture/{README,layers,operating-loop,problems-and-theory-of-change,02..10,federation,contributor-roles}.md` (lift+re-anchor `docs/layers/*`; resolve R4 layers-vs-11, R5 ordering) + `site/journey-model.md` + `site/journey.schema`. **DoD:** architecture/ is instance-agnostic; journeys map to lifecycle (D1). Depends: SP2; D1 decision.

### Wave 5 — Integration + first adoption (the dialectic)
**SP10 — `org-os-kms` (module + profile).** `packages/org-os-kms` (`@org-os/kms`) binds toolkit-framework → org-os (setup, `/initialize`–`/close`, registries, RegenOS federation); + the **profile** (ready-to-run org-os config with framework **pre-loaded**). Move org-os-coupled skills here. **DoD:** instantiating the profile yields a running commons. Depends: SP6, SP9.
**SP11 — First adoption: ReFi DAO (Loop 4).** Instantiate for ReFi DAO (`refi-dao-os`); process a real slice (podcast episodes + blog) via the skills; capture framework gaps → contribute-back → `framework v0.1`. **DoD:** a second instance runs the framework; reusability report → reconciliations. (= pipeline P9.) Depends: SP10.

## Dependency graph (critical path)

```
SP0 ─┬─ SP-DEC(R1,R3,R7) ─┬─ SP1 ─┬─ SP3 ─┬─ SP4 ─ SP6 ─┬─ SP7
     │                    └─ SP2 ─┴─ SP8   │            └─ SP10 ─ SP11
     │                            └─ SP5 ──┘   SP9 ─────────┘
```
**Keystone critical path:** SP0 → SP-DEC → SP1 → SP2 → SP3 → SP4 → SP6 (= a runnable, agnostic framework that can capture + compose). Everything else hangs off this.

## Coverage guarantee

[`framework/COVERAGE.md`](../../framework/COVERAGE.md) lists every master-doc framework section → its SP. As each SP completes, its rows move 🟥→🟩 in COVERAGE, and its reconciliations resolve in `framework/RECONCILIATIONS.md` + flow to the master doc (Loop 2). **The build is "done" for an iteration when COVERAGE has no 🟥 keystones and the open reconciliations are either resolved or routed to BACKLOG.**

## What we DON'T build (per master doc)

- The **reward/contribution mechanism** — design-seed doc only (`architecture/reward-economy-seed.md`); CSIS-gated; "do not make it sound like a settled protocol."
- On-chain/decentralized substrate (Radicle/IPFS/EAS) — later infra layer; keep GitHub+agents.
- Broad public contribution flows — "not until routing is less confusing" (master doc Appendix I).

---

_Next concrete step: **SP0 (scaffold)** can start now; **SP-DEC** (R1/R3/R7) should go to the next biweekly in parallel (it gates the schemas). Expand each SP to full TDD via `writing-plans` as its wave begins._
