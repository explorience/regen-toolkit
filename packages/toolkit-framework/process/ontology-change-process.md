# Ontology Change Process

> Source: master doc **§6 "Ontology and semantic kernel" → "Change triggers" /
> "Change process"** and **Principle 11 (type/tag discipline)**. This is how the
> kernel evolves **without silent drift** — lightweight enough to use, explicit
> enough to stay reviewable.

## What it governs

Changes to the **semantic kernel**: adding/changing/deprecating an entity type, a
relationship predicate, a field, or a crosswalk mapping. It applies to both
`core-entities.yaml` (Layer A — frozen, breaking changes require a major semver bump) and
`extension-entities.yaml` (Layer B — local, additive). It is the *same machinery* a peer uses
to **contribute back** an extension (see [`federation.md`](federation.md), FEEDBACK-LOOPS Loop 4).

## Change triggers

Consider an ontology change when:

- repeated ambiguity blocks coordination;
- multiple contributors use the same term differently;
- a source system cannot be mapped cleanly;
- a deployment requires a distinction that does not exist;
- AI workflows repeatedly misclassify an object;
- review needs differ across object types;
- a tag is being used like a type;
- an implementation generates a new reusable distinction;
- an external ontology offers a better mapping;
- a term becomes obsolete, misleading, or harmful.

## The 10-step change process

A lightweight, explicit process (master doc §6 "Change process"):

1. **Surface** the issue or ambiguity.
2. **Name** the affected object, type, relationship, or field.
3. **Check if it's a tag** — can it be solved with a tag, subtype, or metadata field instead
   of a new type? (Principle 11 — see the decisive rule below.) If yes, stop here.
4. **Check alignment** — does it align with the crosswalk targets (Octo / BKC / SuperBenefit
   / CSIS) and adjacent schemas? Mapping is **encouraged but optional** — *map where clean
   alignment exists* (R7); do not force a fit.
5. **Assess complexity cost** — does it add avoidable sprawl?
6. **Assess deployment / review usefulness** — does it actually change routing, relationships,
   review needs, templates, permissions, deployment logic, or interface behavior?
7. **Propose** the change (as an **update-proposal**; see below).
8. **Review** with relevant stewards (Ontology Steward + the affected domain reviewers —
   [`roles.md`](roles.md)).
9. **Decide** — accept, revise, reject, or **preserve as an open question**.
10. **Version** the change. (Layer-A changes are breaking → major bump; Layer-B additions are
    not breaking.)

> **The decisive type/tag rule (Principle 11):**
> **Add a new type only when it changes routing, relationships, review needs, templates,
> permissions, deployment logic, or interface behavior.** Otherwise use a tag, subtype, field,
> or note. A new type is justified only if it improves routing, interoperability, graph
> structure, review, deployment clarity, implementation learning, AI-readable retrieval,
> semantic precision, or contributor experience. This protects against ontology sprawl.

## The `update-proposal` type

Every proposed change is carried by an **update-proposal**
([`schemas/update-proposal.yaml`](../schemas/update-proposal.yaml)) — the vehicle that makes
evolution explicit and reviewable rather than silent. Key fields:

- `target` — what it proposes to change;
- `rationale` + `proposed_change`;
- `maps_to_core` — required if proposing a **new Layer-B extension type** (the
  fork-compatibility contract: the new type must declare its nearest Layer-A core type);
- `review_status` — tracked on the `lifecycle_state` axis (the canonical state model, K1);
- `decision` — `open · accepted · rejected · deferred · promoted-to-core`.

The `promoted-to-core` decision is the **gate from a local extension into the frozen Layer-A
kernel**. Promotion is deliberate, versioned, and reviewed — **never silent** (R7: avoid
premature lock-in). Most local extensions stay local; only proven, broadly useful ones are
promoted.

## Stewardship

> The ontology is **open to broad input but not edited casually as canonical structure.**

Anyone can propose additions, changes, mappings, deprecations, or open questions. **Canonical
changes must be reviewed** (Ontology Steward + Technical Schema Reviewer + relevant Domain /
Implementation / AI-Workflow reviewers — [`roles.md`](roles.md)). The Ontology Steward's role
is *careful, not controlling*.

## Where a change ends up

- A type/tag clarification or a relationship tweak → an **evolution-record** if it's an
  in-place fix (see [`evolution-loop.md`](evolution-loop.md)).
- A new/changed type, predicate, field, or crosswalk → an **update-proposal**, reviewed and
  versioned per the 10 steps above.
- A peer's contributed extension → the same update-proposal path, arriving as a federated
  **Signal** ([`federation.md`](federation.md)).
