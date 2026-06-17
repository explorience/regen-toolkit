# The Minimum Operating Kernel — the Contributor Front Door

The **Minimum Operating Kernel (MOK)** is the small set of working objects that make the framework usable for a single useful contribution **without grasping the whole system.** For v0.1 a contributor works with five objects; the system refines them into fuller types over time. (Source: master doc *System Overview & Core Movement → Minimum operating kernel*.)

> These five objects **do not replace the full architecture.** They are the simplest working surface — enough to add one useful thing and let the system route it.

## The five objects

| Object | Meaning | Primary question |
|---|---|---|
| **Resource** | Something found. Grounds the commons in real projects, tools, people, and sources. | What exists? |
| **Concept** | Something explained. Meaning, frameworks, comparisons, common confusions. | What does it mean? |
| **Option** | Something reusable. A design choice made visible, comparable, composable. | What can be selected, adapted, or combined? |
| **Deployment** | Something specified for use. Roles, authority, decisions, risks, review. | What must be explicit before this is used in practice? |
| **Signal** | Something learned or flagged. Feedback, failures, tensions, lessons. | What happened, what changed, or what needs attention? |

## The kernel is a curated subset of the ontology, not a parallel type system (R3)

The five kernel objects are a **curated authoring profile — a "front door" — over the single entity ontology.** They are **not** separate types living alongside the ~45-type ontology. Each kernel object **points at its real core or extension type**, and the schema for an object (e.g. Resource) is the same whether it was reached through the kernel or through the full ontology.

- A contributor uses **5**; the system refines into the fuller set of types over time.
- The kernel is the **most-used types promoted as the v0.1 entry surface** — the usage layer, not a second model.
- This resolves the apparent mismatch between "5 objects" and "~45 ontology types": there is one ontology; the kernel is a view onto it.

The kernel is encoded as a `kernel: true` marker plus a profile that lists the five and their backing types. See [`../schemas/kernel-profile.yaml`](../schemas/kernel-profile.yaml), which maps each kernel object to its core/extension entity, and [`ontology-posture.md`](ontology-posture.md) for the two-layer ontology the kernel draws from.

## Why these five

They are the five objects that carry the [operating loop](operating-loop.md): a **Resource** is discovered, a **Concept** explains it, an **Option** makes a reusable choice visible, a **Deployment** specifies what must be true before acting, and a **Signal** carries what was learned back into the commons. Track and Implementation also appear in the full object shorthand (`Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution`) but are *not* in the v0.1 kernel — they are reached once a contributor moves past the front door.
