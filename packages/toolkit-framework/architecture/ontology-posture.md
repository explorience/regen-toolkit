# Ontology Posture — Two Layers + Align-and-Map

The framework's semantic kernel is **two layers**:

- **Layer A — interoperable core** (`schemas/core-entities.yaml`): the minimal shared type set (~15) every fork inherits **unchanged**. This is the **federation contract** — the base guideline that keeps a network of forked commons interoperable + graph/AI-readable. **Frozen + versioned (semver); changes are breaking.**
- **Layer B — operational extensions** (`schemas/extension-entities.yaml`): the opinionated Toolkit types (~31). Each **declares `maps_to_core`** (a Layer-A type) so any consuming node can downgrade an unfamiliar local type to its nearest core type and still ingest the graph.

## Interoperability posture: align-and-map, not adopt-as-base (R7)

The framework **defines its own kernel** and ships **crosswalks** to external ontologies (Octo/BKC, SuperBenefit, CSIS). It does **not** adopt any external ontology as its root. Per the master doc: *"Align where useful. Extend where necessary. Preserve attribution. Avoid premature lock-in."* `maps_to` hints are **optional** — "map where clean alignment exists."

## CSIS is a separable overlay

The `governance_csis` predicate group in `relationships.yaml` is marked `optional: true`. A fork can run the entire core graph with **zero CSIS edges**. CSIS is *informed*, not *conformant* — adopt its constructs only with CSIS-literate review.

## Serialization

Authoring is in **YAML** (human-friendly); the **JSON-LD `@context`** is *generated* from the kernel (`toolkit-framework context`) for graph/AI-readable interchange. Author once, generate the graph form.

See also: [`type-tag-discipline.md`](type-tag-discipline.md) · [`fork-compatibility.md`](fork-compatibility.md) · `../docs/meta/RECONCILIATIONS.md` (R3, R7, R9).
