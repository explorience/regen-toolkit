**DRAFT for Matt — to shape together on the Jul 16 call. Not applied to the master doc.**

# Update Proposal — 8 Forms of Capital as a Layer-B Extension

`type: update-proposal` (`packages/toolkit-framework/schemas/update-proposal.yaml`) · `target: packages/toolkit-framework kernel (Layer A/B)` · `maturity: raw` · `review_status: open` · `decision: open`

**Provenance:** Loop-4 contribute-back item from `docs/reports/2026-07-05-ontology-comparison.md` §8 ("8 Forms of Capital → kernel," ranked flagship, owner "framework maintainer + Matt"). This document turns that backlog line into a concrete, discussable schema shape.

---

## 1 · The gap

The 2026-07-05 ontology comparison (`docs/reports/2026-07-05-ontology-comparison.md`) diffed Heenal's Regen Toolkit build against the toolkit-framework kernel across 19 entity types and 9 classification layers. Its headline finding (§1, §4, §8): **the kernel has no capital-accounting axis and no capital-flow predicates.** Heenal's build carries the 8 Forms of Capital (`financial, social, cultural, intellectual, experiential, natural, built, spiritual` — `data/ontology/regen-toolkit-classification.yaml:57-66`) plus three capital predicates (`creates_capital`, `depends_on_capital`, `impacts_capital`, same file:423-433), and `core-entities.yaml` / `extension-entities.yaml` have nothing that maps to it. The report calls this "the flagship contribute-back, not something to drop" and the 2026-07-05 decision was **HYBRID**: adopt the framework as the operational/interop backbone, keep the capital model as a namespaced extension, and feed it back to the kernel rather than let it die at the fork boundary.

One thing worth noting for Matt directly: **the master doc already carries this idea narratively.** `docs/MASTER.md` has a "Forms of capital" subsection (~L3521) and a dedicated "8 Forms of Capital lens" section (~L19732) with the exact same 8 forms (financial / material-built / living-natural / social / intellectual / experiential / cultural / spiritual) and the same posture we're proposing here: *"These should be used as classification fields, not root entity types… They should not become a rigid metric system."* So this proposal isn't introducing a new idea to the master doc — it's proposing to **formalize an idea the master doc already states in prose** into an actual namespaced schema in `packages/toolkit-framework/schemas/`, where it can be validated, queried, and inherited by forks.

**Being honest about what's NOT yet evidence:** the 2026-07-14 self-ingestion slice (19 articles, `data/kb`, all typed `raw`) did not surface 8-forms-of-capital language strongly — those 19 articles skewed crypto-financial (stablecoins, treasury, capital allocation mechanisms), not the ecological/social/spiritual capital forms. So this proposal is **not** backed by a fresh content signal from that slice. It rests entirely on (a) the 2026-07-05 ontology comparison's structural finding and (b) the master doc's own existing prose — not on a demonstrated gap in live toolkit content. Flagging this so the Jul 16 conversation doesn't overstate the evidence base.

---

## 2 · The proposal

Add a namespaced Layer-B extension — **not** a change to the frozen Layer-A core (`core-entities.yaml` stays untouched; version stays 0.1.0; no breaking bump).

**a) A `capital_form` classification** (not a new entity type — per the master doc's own posture above):

```yaml
# packages/toolkit-framework/schemas/extensions/regen-toolkit/capital-form.yaml (proposed, new file)
id: regen-toolkit/capital-form
version: 0.1.0
layer: B
namespace: regen-toolkit
description: >
  A classification axis (not an entity type) marking which of the 8 Forms of
  Capital an entity creates, depends on, converts, strengthens, depletes,
  protects, or makes visible. Attaches to existing entities via a field, not
  a new type.
maps_to_core: null   # classification axis, not an entity — no core mapping needed
values:
  - living        # soil, biodiversity, water, ecological health
  - material       # tools, infrastructure, land, equipment, energy
  - financial      # grants, treasuries, payments, funding flows
  - social         # trust, relationships, networks, mutual aid
  - intellectual   # knowledge, concepts, research, methods
  - experiential   # practice, field learning, implementation memory
  - spiritual      # meaning, purpose, reciprocity, regenerative obligation
  - cultural       # stories, rituals, language, norms, belonging
```

**b) A small predicate set** for capital *relationships* (the flow between an entity and a capital form), namespaced so they sit alongside — not inside — `relationships.yaml`'s existing groups (`core_interop / practice_pattern / discourse / governance_csis / source_lineage`):

```yaml
# packages/toolkit-framework/schemas/extensions/regen-toolkit/capital-predicates.yaml (proposed, new file)
id: regen-toolkit/capital-predicates
version: 0.1.0
layer: B
namespace: regen-toolkit
group: capital_flow   # a new relationship group, additive to relationships.yaml
predicates:
  regenerates:    { description: "Entity restores/strengthens a capital form.", inverse: regenerated_by }
  depletes:       { description: "Entity draws down/erodes a capital form.", inverse: depleted_by }
  converts-to:    { description: "Entity transforms one capital form into another (e.g. social → financial via a grant).", from_field: capital_form, to_field: capital_form }
  depends-on:     { description: "Entity requires a capital form as input to function.", inverse: enables }
```

(This collapses Heenal's three predicates — `creates_capital` / `depends_on_capital` / `impacts_capital` — into four verbs that are more precise about direction: `impacts` was doing double duty for both "regenerates" and "depletes," which the crosswalk itself treats as opposite outcomes worth distinguishing.)

**c) Attachment points** — how it hooks onto entities that already exist, with no core changes:

| Entity | Attachment | Notes |
|---|---|---|
| `resource` (`resource.yaml`) | add optional field `capital_forms: { type: array, items: capital_form }` | resources are the highest-volume typed object (1616 in the June reprocess) and the most natural place to start populating this |
| `signal` (`signal.yaml`) | add `capital_form` to `signal_type` enum options, or a parallel optional field `affected_capital: { type: array }` | signals already track "what changed" (`affected_layer`); capital is a compatible axis |
| `claim` / claim-evidence (core) | relationship only, via `capital_flow` predicates — no field added to the frozen core | keeps Layer A untouched; the predicate group lives in the extension layer |
| `option`, `mechanism`, `implementation` (extension-entities) | same optional field pattern as `resource` | these are exactly where Heenal's `creates_capital`/`depends_on_capital` were densest (Practice→Social/Natural, Mechanism→Financial) |

`maps_to_core` for the classification itself is `null` — it's a classification axis, not an entity, so there's nothing to downgrade to (consistent with how `frontmatter.domain`/`function` work today: uncontrolled/optional fields, not typed entities). A fork that doesn't recognize `regen-toolkit/capital-form` simply ignores the field and loses nothing structural — the fork-compatibility contract (`validateKernel`) stays intact.

---

## 3 · Why contribute-back, not conform

The 2026-07-05 decision (ontology-comparison §7) was explicit: pure-adopt (drop Heenal's capital model to match the kernel as-is) "would delete the regenerative heart." Keep-both (run two parallel ontologies) "forfeits interop and duplicates work." The chosen path — HYBRID — takes the framework's operational and federation backbone (K1 state model, `source-system` return paths, `bioregion`) as the shared substrate, and feeds the one piece the toolkit build had that the kernel didn't back into the kernel as an extension, with an eye toward eventual promotion to core if capital accounting proves broadly useful across other forks (the `update-proposal.yaml` schema's own `decision: promoted-to-core` state exists for exactly this).

This is the flagship of the HYBRID path because it's the one place where "align to the framework" would otherwise mean quietly deleting the thing that makes this toolkit *regenerative* rather than just *operational*. Contributing it back — as a namespaced, optional, non-breaking extension — keeps both properties: the kernel's federation guarantees, and the toolkit's capital lens.

---

## 4 · What it unlocks

- **Capital accounting across every instance's typed objects** — resources, options, mechanisms, implementations, signals can all carry a `capital_forms` tag once the field exists, giving the toolkit a queryable answer to "what does this strengthen or deplete?"
- **A shared axis for ReFi DAO ↔ toolkit federation** — if both instances adopt the same namespaced extension, capital becomes one of the things that federates cleanly (via `source-system` return paths) rather than something each fork reinvents locally.
- **Formalizes what the master doc already asks for** — turns the "8 Forms of Capital lens" (MASTER ~L19732) from a suggested template field into an actual, validatable schema, without touching MASTER.md itself.
- **A path to promotion** — if the extension gets used broadly across forks, `update-proposal.decision: promoted-to-core` gives it a lifecycle to eventually join Layer A, without forcing that decision now.

---

## 5 · Open questions for Matt (Jul 16)

1. **Axis vs. object.** Does capital live as a *field on every entry* (the `capital_forms: array` approach above) or as a *standalone `capital-flow` object* (its own typed record connecting an entity, a capital form, and a predicate, more like how `metric` or `signal` work)? The field approach is cheaper to adopt; the object approach is more expressive for multi-hop flows (e.g., a grant that converts social capital → financial capital → material capital across three steps).
2. **Which predicates are core vs. extension.** Should `regenerates` / `depletes` join the frozen core's relationship vocabulary (since "something regenerates or depletes X" is arguably domain-general, not toolkit-specific), or should the whole `capital_flow` group stay Layer-B/namespaced indefinitely?
3. **Reconciling the vocab with MASTER's own naming.** MASTER (~L4454-4461, ~L19738) uses `material / built` and `living / natural` as combined labels; Heenal's ontology YAML (`data/ontology/regen-toolkit-classification.yaml:59`) uses `built` and `natural` as the atomic labels. This draft uses `material` and `living` (closer to Fullerton's original 8-capitals language and to what the task brief specified) — which naming does Matt want as canonical before this goes into a schema file people will actually type against?
4. **Relationship to MASTER's "Capital forms affected" template field.** MASTER (~L19753) already proposes a suggested template field of that name for resources/options/deployments/implementations/claims. Is this proposal meant to *implement* that exact field, or does Matt see it evolving differently once it's a real schema rather than a prose suggestion?
5. **Scope of the first cut.** Given the 2026-07-14 slice showed 0/19 articles populating this axis, should the extension ship now (schema-first, populate later) or wait for a content pass that actually needs it — i.e., is this a "build the shelf" or "wait for the book" call?

---

**Status:** raw / open — for discussion, not for merge. Nothing in this document has been applied to `docs/MASTER.md` or to any schema file; the YAML blocks above are proposed shapes for a conversation, not committed schemas.
