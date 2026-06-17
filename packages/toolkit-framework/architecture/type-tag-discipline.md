# Type / Tag Discipline — Don't Sprawl the Ontology

The anti-drift rule that keeps Layer A small and forks compatible (master doc Principle 11).

**Add a new TYPE only when it changes one of:** routing, relationships, review needs, templates, permissions, deployment logic, or interface behavior.

**Otherwise use a TAG** (a `classification` value) or a metadata field.

## The four-way distinction

- **Metadata** — descriptive fields on an object (`domain`, `function`, `steward`…). Cheap; add freely.
- **Tags** — flexible discovery labels. No structural weight.
- **Taxonomy** — a hierarchy of tags/categories.
- **Ontology** — a *typed* model: entities + relationships + constraints. Structural; changes routing/review/relations.

## The minimum structural rule

> A layer (or type) should not absorb the function of another unless the interface is explicit.

A raw link list is not an Encyclopedia; a funding mechanism is not a valid Deployment; a Track is not an Implementation; a tag is not an ontology type. These distinctions are enforced as invariants (SP8, `architecture/invariants.md`).

**Practical effect on this package:** the kernel stays at ~15 core + ~31 extension types. New domain needs become **tags/metadata** or **fork-local extensions that `maps_to_core`** — not new Layer-A types — unless they genuinely change structure and pass governed review.
