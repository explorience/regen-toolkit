# @regen-commons/toolkit-framework

The **Regen Knowledge Commons Toolkit framework** — a portable, **org-os-agnostic** system for building a federated, interoperable knowledge commons. It is the *operational distillation* of the [master doc](../../docs/MASTER.md): **adopt the package, not the 30,000-line doc.**

> **Status: v0.0.1 — keystone foundation.** The shared state model + core schemas + CLI are in place and tested. Built dialectically (grows through adoption — see [build plan](../../docs/plans/framework-build/README.md)). Design: [`framework/`](../../framework/) (PLACEMENT, COVERAGE, FEEDBACK-LOOPS, RECONCILIATIONS).

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

Programmatic:

```js
import { loadSchema, isValid, validateObject } from '@regen-commons/toolkit-framework';

isValid('maturity', 'reviewed');           // true  (K1 canonical state model)
isValid('maturity', 'canonical');          // false (old vocab, deliberately rejected — see RECONCILIATIONS R1)
validateObject('source-system', card);     // { valid, errors }
```

## What's here (v0.0.1)

**Shared schemas** (`schemas/`) — the keystones every entry type builds on:
- **`review-maturity`** (K1) — the canonical state model: three orthogonal axes (`maturity` · `public_use` · `lifecycle_state`) + `ai_assisted`/`high_risk` flags + crosswalks. *Resolves the master doc's ~7 conflicting maturity ladders.*
- **`frontmatter`** (K3) — the metadata base every entry `extends`.
- **`source-system`** (K2) — the **federation primitive** (the `return_path` field = the contribute-back / reciprocity hook). Source systems are peers, not extractable link pools.
- **`contribution-record`** (K5) — durable contribution attestation (the `source_system_reciprocity` hook for federated contribute-back).
- `signal` · `provenance` · `public-use-boundary` — the cross-cutting supporting schemas.

**Validator + CLI** (`src/`) — schema loading, object validation (with `extends` inheritance + K1-axis enforcement), and a zero-dep CLI.

## Roadmap (next, per the [build plan](../../docs/plans/framework-build/README.md))

- **SP2** — the **semantic kernel** (`core-entities` + `extension-entities` w/ `maps_to_core` + relationships + crosswalks + JSON-LD + fork-compatibility). The interoperability contract.
- **SP3/SP4** — layer schemas (resource/option/track/deployment/implementation) + the compatibility engine.
- **SP6** — agentic skills (`capture-and-route`, `compose-journey`, `csis-review`) for agnostic adoption.

## Design note

This package deliberately uses **zero-build ESM + YAML + markdown** (not the repo's TypeScript convention) so it is adoptable in any context by cloning — no compile. See [`framework/PLACEMENT.md`](../../framework/PLACEMENT.md).
