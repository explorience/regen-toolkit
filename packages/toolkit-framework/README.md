# @regen-commons/toolkit-framework

The **Regen Knowledge Commons Toolkit framework** — a portable, **org-os-agnostic** system for building a federated, interoperable knowledge commons. It is the *operational distillation* of the [master doc](../../docs/MASTER.md): **adopt the package, not the 30,000-line doc.**

> **Status: v0.1.0-beta.1 — try-able beta.** Semantic kernel + 21 schemas + compatibility engine + 3 agentic skills + lift ETL + full architecture/process docs, now with a knowledge base ([`docs/`](docs/README.md)), one validating [`examples/`](examples/) instance per object-schema, Appendix A–H instance [`templates/`](templates/instance/), and a gaps register ([`docs/meta/GAPS.md`](docs/meta/GAPS.md)). Tests green. Grows dialectically through adoption (first: ReFi DAO). Design: [`docs/meta/`](docs/meta/) · [build plan](../../docs/plans/framework-build/README.md).

## Why it exists

A federated network of knowledge commons that can be **forked and adapted** but stay **interoperable** (compatible ontologies, shared base guidelines) — "interoperability without forced uniformity." This package is the shared base every instance (ReFi Web3 Toolkit, ReFi DAO, ReFi BCN, …) adopts. org-os is *one* (replaceable) host via `org-os-kms`; the framework itself needs **no build step and no org-os** — schemas are YAML, skills are markdown, the validator is runnable `.mjs`.

## Install / use

Zero-build. Requires `js-yaml`.

```bash
node src/cli.mjs list-schemas
node src/cli.mjs check-state maturity reviewed         # validate against the canonical state model
node src/cli.mjs validate source-system my-card.yaml   # validate an object against a schema
npm test                                               # node --test
```

**New here? Start with the [knowledge base](docs/README.md)** → [`GETTING-STARTED`](docs/GETTING-STARTED.md) · [`WORKED-EXAMPLE`](docs/WORKED-EXAMPLE.md) · [`GLOSSARY`](docs/GLOSSARY.md).

Programmatic:

```js
import { loadSchema, isValid, validateObject } from '@regen-commons/toolkit-framework';

isValid('maturity', 'reviewed');           // true  (K1 canonical state model)
isValid('maturity', 'canonical');          // false (old vocab, deliberately rejected — see RECONCILIATIONS R1)
validateObject('source-system', card);     // { valid, errors }
```

## What's here (the keystones)

**Shared schemas** (`schemas/`) — the keystones every entry type builds on:
- **`review-maturity`** (K1) — the canonical state model: three orthogonal axes (`maturity` · `public_use` · `lifecycle_state`) + `ai_assisted`/`high_risk` flags + crosswalks. *Resolves the master doc's ~7 conflicting maturity ladders.*
- **`frontmatter`** (K3) — the metadata base every entry `extends`.
- **`source-system`** (K2) — the **federation primitive** (the `return_path` field = the contribute-back / reciprocity hook). Source systems are peers, not extractable link pools.
- **`contribution-record`** (K5) — durable contribution attestation (the `source_system_reciprocity` hook for federated contribute-back).
- `signal` · `provenance` · `public-use-boundary` — the cross-cutting supporting schemas.

**Validator + CLI** (`src/`) — schema loading, object validation (with `extends` inheritance + K1-axis enforcement), and a zero-dep CLI.

## What's built (full)

- **Semantic kernel** — `core-entities` (15 frozen Layer-A) + `extension-entities` (31, each `maps_to_core`) + `relationships` (unified, CSIS separable) + `kernel-profile` (MOK-5) + JSON-LD `context` generator + fork-compatibility validator.
- **10 layer schemas** — resource · option-entry · track · deployment · implementation-record · claim-evidence · evolution-record · concept-lineage · encyclopedia-entry · update-proposal.
- **Compatibility engine** (`src/compatibility.mjs`) + **invariants** (`src/invariants.mjs`) + **lift ETL** (`src/lift.mjs`, CLI `lift`).
- **3 agentic skills** — `capture-and-route`, `compose-journey`, `csis-review`.
- **Docs** — `architecture/` (layers, operating-loop, kernel-objects, problems-ToC, invariants, ontology-posture, fork-compatibility, type-tag-discipline), `process/` (8: principles, review, contribution, csis-safeguards, federation, roles, evolution-loop, ontology-change-process), `site/journey-model.md`.

## Next — the dialectic (not framework-building)

First adoption: **ReFi DAO** (via `@org-os/kms` profile) — process podcasts/blog, contribute back → framework v0.1.x. Then ReFi BCN + network.

## Design note

This package deliberately uses **zero-build ESM + YAML + markdown** (not the repo's TypeScript convention) so it is adoptable in any context by cloning — no compile. See [`docs/meta/PLACEMENT.md`](docs/meta/PLACEMENT.md).
