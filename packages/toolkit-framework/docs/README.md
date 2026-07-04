# Knowledge Base — @regen-commons/toolkit-framework

The operational distillation of the [master doc](../../../docs/MASTER.md): **adopt the
package, not the 30k-line doc.** This is the map. New here? Read top to bottom; you'll
have the whole framework in ~20 minutes.

## Start here (3 docs)
1. [`GETTING-STARTED.md`](GETTING-STARTED.md) — install + use in 5 minutes (CLI tour).
2. [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md) — one real input → typed objects → a track, end to end.
3. [`../architecture/README.md`](../architecture/README.md) — the framework in one shot: the problem, the values, the spine.

## The five-object kernel (the front door)
[`../architecture/kernel-objects.md`](../architecture/kernel-objects.md) — Resource ·
Concept · Option · Deployment · Signal. The Minimum Operating Kernel. See also
[`GLOSSARY.md`](GLOSSARY.md).

## Architecture (what exists + how it relates)
- [`problems-and-theory-of-change.md`](../architecture/problems-and-theory-of-change.md) — the diagnosis + the regeneration-claim boundary.
- [`layers.md`](../architecture/layers.md) — the 10-layer data model (what exists, what each layer must NOT do).
- [`operating-loop.md`](../architecture/operating-loop.md) — the 8-move Core Movement + the lifecycle↔layer bridge (reconciles R5).
- [`invariants.md`](../architecture/invariants.md) — the 16 distinctions that keep the system coherent (the conformance surface).
- [`type-tag-discipline.md`](../architecture/type-tag-discipline.md) — when to add a TYPE vs a TAG (anti-sprawl).
- [`ontology-posture.md`](../architecture/ontology-posture.md) — the two-layer semantic kernel (Layer A frozen + Layer B `maps_to_core`).
- [`fork-compatibility.md`](../architecture/fork-compatibility.md) — how forks stay interoperable.

## Process (how it learns + stays trustworthy)
- [`principles.md`](../process/principles.md) — the 18 cross-cutting commitments (the ethos, encoded in schemas).
- [`contribution.md`](../process/contribution.md) — the contributor front door + the 10 contribution types.
- [`review.md`](../process/review.md) — review scales with risk (12 review types, 4 workflows).
- [`roles.md`](../process/roles.md) — the 19 stewardship roles + role-failure safeguards.
- [`evolution-loop.md`](../process/evolution-loop.md) — Signal→Sensemaking→Balance→Intervention→Integration→Memory.
- [`ontology-change-process.md`](../process/ontology-change-process.md) — how the kernel changes without silent drift.
- [`csis-safeguards.md`](../process/csis-safeguards.md) — CSIS-informed, not conformant (R7).
- [`federation.md`](../process/federation.md) — interconnect gardens, don't centralize (return paths, contribute-back).

## Skills (the agentic machinery)
- [`capture-and-route`](../skills/capture-and-route/SKILL.md) — one input → many typed objects (deep intake).
- [`compose-journey`](../skills/compose-journey/SKILL.md) — assemble a track + run the compatibility engine.
- [`csis-review`](../skills/csis-review/SKILL.md) — structural-integrity review (flags, never certifies).

## Meta (package ↔ master-doc analysis)
The docs that map this package to `docs/MASTER.md` and track its own build health —
not needed to *use* the framework, but the record of *why it's shaped this way*.
- [`meta/COVERAGE.md`](meta/COVERAGE.md) — master-doc ↔ package coverage map (every section → package home + status; keystones K1–K8; reconciliations R1–R10).
- [`meta/GAPS.md`](meta/GAPS.md) — open gaps, contradictions, and questions — the artifact the group reviews.
- [`meta/RECONCILIATIONS.md`](meta/RECONCILIATIONS.md) — how each R1–R10 contradiction was resolved.
- [`meta/FEEDBACK-LOOPS.md`](meta/FEEDBACK-LOOPS.md) — how master-doc ↔ framework ↔ instances co-develop (the 4 loops + mechanisms + cadence).
- [`meta/PLACEMENT.md`](meta/PLACEMENT.md) — where the framework lives + how it operates (modular package model; federation + co-evolution).
- [`meta/SEPARATION.md`](meta/SEPARATION.md) — the framework | instance line-item manifest (superseded in detail by COVERAGE).

## Reference
- **Schemas** (`../schemas/`) — 21 total: 16 object-schemas + 5 structural. Full table below.
- **Examples** ([`../examples/`](../examples/)) — one validating instance per object-schema.
- **Templates** ([`../templates/instance/`](../templates/instance/)) — Appendix A–H fill-in forms.
- **Glossary** ([`GLOSSARY.md`](GLOSSARY.md)) — the load-bearing terms.
- **Site model** ([`../site/journey-model.md`](../site/journey-model.md)) — generator-agnostic front-door model.

### Schema reference (every schema, its example, its keystone)
| schema | kind | keystone | example |
|---|---|---|---|
| `review-maturity` | structural | K1 | — (canonical state model) |
| `frontmatter` | object | K3 | [example](../examples/frontmatter.example.yaml) |
| `source-system` | object | K2 | [example](../examples/source-system.example.yaml) |
| `contribution-record` | object | K5 | [example](../examples/contribution-record.example.yaml) |
| `core-entities` | structural | K4 | — (Layer A) |
| `extension-entities` | structural | K4 | — (Layer B) |
| `relationships` | structural | K4 | — (predicate vocab) |
| `kernel-profile` | structural | K4 / R3 | — (MOK-5 front door) |
| `resource` | object | L3 | [example](../examples/resource.example.yaml) |
| `option-entry` | object | L4 | [example](../examples/option-entry.example.yaml) |
| `track` | object | L7 | [example](../examples/track.example.yaml) |
| `deployment` | object | L5 | [example](../examples/deployment.example.yaml) |
| `implementation-record` | object | L6 | [example](../examples/implementation-record.example.yaml) |
| `claim-evidence` | object | — | [example](../examples/claim-evidence.example.yaml) |
| `evolution-record` | object | — | [example](../examples/evolution-record.example.yaml) |
| `concept-lineage` | object | — | [example](../examples/concept-lineage.example.yaml) |
| `encyclopedia-entry` | object | L2 | [example](../examples/encyclopedia-entry.example.yaml) |
| `update-proposal` | object | — | [example](../examples/update-proposal.example.yaml) |
| `signal` | object | — | [example](../examples/signal.example.yaml) |
| `provenance` | object | — | [example](../examples/provenance.example.yaml) |
| `public-use-boundary` | object | — | [example](../examples/public-use-boundary.example.yaml) |

> **Status:** v0.1.0-beta.1. Gaps, contradictions, and open questions are tracked in
> [`meta/GAPS.md`](meta/GAPS.md) — that's the artifact the group reviews.
