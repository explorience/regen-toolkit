---
name: map-ontology
version: 0.2.0
description: Derive a foreign corpus's implicit ontology and map it onto the semantic kernel — reuse existing types where they fit, propose namespaced extensions with maps_to_core where they don't, and emit a crosswalk. How external knowledge bases join without being shoehorned.
framework: toolkit-framework
agnostic: true
---

# map-ontology

Run BEFORE bulk-ingesting any source with its own type system (an external KB,
a protocol document, an app's data model). The kernel is align-and-map, never
conform-or-reject (`architecture/ontology-posture.md`).

## Steps

1. **Survey the corpus.** List the kinds of things it talks about (its implicit
   entity types), the relationships it draws, and its vocabulary for states/
   maturity. Real reading before any mapping.
2. **Map each foreign type** against the kernel, in order of preference:
   a. **Direct fit** → an existing core type (`schemas/core-entities.yaml`) or
      extension type (`schemas/extension-entities.yaml`).
   b. **Near fit** → existing type + the foreign name recorded in `notes`/tags.
   c. **Genuinely new** → propose a namespaced extension
      `<source-slug>/<type-name>` with a REQUIRED `maps_to_core` naming a real
      Layer-A core type (check `core-entities.yaml` — extension types like
      `resource` do NOT qualify as mapping targets). Verify mechanically:
      `node <framework>/src/cli.mjs federate check <your-proposed-extensions.yaml>`.
3. **Map the state vocabulary** to K1's three axes (`maturity` / `public_use` /
   `lifecycle_state`, `schemas/review-maturity.yaml`). Foreign ladders
   crosswalk; they don't replace (R1).
4. **Emit the crosswalk file** `crosswalks/<source-slug>.yaml`:

   ```yaml
   source: <source-slug>          # matches the source-system card
   version: 0.1.0
   types:
     <foreign-type>: { to: <kernel-type>, via: direct|near|extension, notes: … }
   states:
     <foreign-state>: { axis: maturity, to: <k1-value> }
   ```

5. **Proposed extensions are candidates too** — emit an `update-proposal`
   candidate through the normal work-order flow (governed change process,
   `process/ontology-change-process.md`); never edit
   `schemas/extension-entities.yaml` unilaterally.
6. **Report** to the operator: N direct, M near, K proposed extensions, plus
   anything that resisted mapping — that residue is ontology feedback for the
   master doc (Loop 2).

## First real cases

Gen Brasil Commons (conflict-mediation protocol → likely extension under
`gen-brasil/…`) · Proof of Coordination (Durgadas) · Koi's two Portuguese apps
(services / digital-tools analyses) feeding the schemas via Geo Protocol.
