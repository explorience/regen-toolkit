# P2 — Resource DB V3 Lift

> **Status:** ready · **Wave:** 1 · **Owner:** Luiz (+ Brandon curation) · **Skills:** `superpowers:test-driven-development`; data engineering
> Part of the [convergence pipeline](CONVERGENCE-PIPELINE.md). **Depends on:** P1 (target schema = framework). **Source:** [`data/resources/README.md`](../../data/resources/README.md).

## Goal
Lift Matty's **Resource DB V3** (28 sheets / 12,456 rows, staged at `data/resources/`) into the org-os data model — the instance's Resource Graph (Layer 3) and adjacent layers — superseding the April mechanical lift in `data/resources.yaml`, while preserving the DB's review-state discipline.

## Context
The resource/option library is the master doc's acknowledged gap (Matty, 2026-06-04: "bottomless"). V3 is the authoritative aggregation, and it's **self-routing**: `csv/toolkit-layer-crosswalk.csv` maps every entry to a `toolkit_route` + `review_status`, and `csv/review-queues.csv` maps to CSIS/master-doc safeguards (Public-Use Boundary, Source System Cards, Builder/Media safeguards).

## Phases
1. **Clean the crosswalk** — strip tweet-text noise from `toolkit_route` cells; normalize routes.
2. **Define target schemas** (from P1 framework): `data/resources.yaml` (Resource Graph), new `data/source-systems.yaml` (L3 source-system cards), cross-walk into `data/option-library.yaml` (L5), `data/concepts.yaml` (L4), `data/tracks.yaml` (L7), `data/implementation.yaml` (L8).
3. **Crosswalk-driven lift** (TDD: write the route→file mapping tests first) — route each row by `toolkit_route`; carry `review_status` as a `maturity`/`review` field.
4. **Honor caveats** — raw leads stay `raw`/`needs-review`; "not endorsement"; podcast claims unverified; Indigenous/TEK → Public-Use Boundary queue.
5. **De-dupe** against the existing `data/resources.yaml` + master doc §7 inventory.
6. **Regenerate + validate** schemas; **Brandon's curation pass** operates on the lifted result.

## Deliverables
- Lifted `data/*.yaml` registries with provenance + review state.
- A `scripts/lift-resource-db.mjs` (reusable for future DB versions).
- De-dup report + curation handoff.

## Definition of done
- Every routed row lands in the right registry with its review state; `npm run validate:schemas` passes; no raw lead silently promoted to clean/endorsed.

## Interrelations
- Populates the **instance** side of P1. The schema is **framework**. Feeds P3 (prototype shows real data) + P9 (the lift pattern repeats per instance).
