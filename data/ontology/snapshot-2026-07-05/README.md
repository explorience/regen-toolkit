# Heenal ontology v1 — immutable snapshot (frozen 2026-07-05)

This directory is the **frozen baseline of Heenal's Regen Toolkit ontology, version 1**, captured on 2026-07-05 for Phase 1 of the [ontology comparison plan](../../../docs/plans/2026-07-05-ontology-comparison-plan.md) (Heenal's build ↔ toolkit-framework). It preserves the ontology and the shape of the live content *before* the framework crosswalk and comparison are built, so the "version 1" state is recoverable and the diff has a fixed reference point. **Nothing in this directory should be edited** — it is a verbatim, point-in-time record.

## Manifest

| File | What it is |
|------|------------|
| `regen-toolkit-classification.yaml` | Verbatim copy of `data/ontology/regen-toolkit-classification.yaml` — the 9 cross-cutting classification layers (domain, function, audience, maturity, scale, context, tech_surface, stage, 8-forms-of-capital). |
| `regen-toolkit-entities.yaml` | Verbatim copy of `data/ontology/regen-toolkit-entities.yaml` — the 21 core entity types (Octo-anchored, CSIS-aligned) + safe-core subset + CSIS principles. |
| `regen-toolkit-octo-mapping.yaml` | Verbatim copy of `data/ontology/regen-toolkit-octo-mapping.yaml` — the Regen Toolkit ↔ Octo ↔ SuperBenefit interop mapping. |
| `regen-toolkit-relationships.yaml` | Verbatim copy of `data/ontology/regen-toolkit-relationships.yaml` — the 5 relationship/predicate groups (structural, practice-and-design, discourse, operational, capital predicates). |
| `frontmatter-census.yaml` | Machine-generated census of the frontmatter across all 119 live `src/content/docs/*.md` articles: field frequency, value vocabularies for the key classification fields, and hand-authored `divergence_notes` where the article vocab does not match `regen-toolkit-classification.yaml`'s declared vocab. |
| `content-structure.md` | The 3 journeys (`src/data/journeys.js`) and the 254-article section-numbered `content/` taxonomy (3 tracks + section file-counts), plus a note on how the 254 legacy tree relates to the 119 live articles. |

The four `*.yaml` files are byte-identical copies of their sources (verified by sha256); the two derived files (`frontmatter-census.yaml`, `content-structure.md`) are generated from the live content and reconcile to the source counts.
