# Architecture — Regen Knowledge Commons Toolkit Framework

This directory is the **architecture documentation** for the framework: the operational distillation of the master doc into a portable, instance-agnostic specification. It is the *concept layer* — the schemas in `../schemas/`, the validators in `../src/`, and the skills in `../skills/` are the *implementation* of what is described here.

## What the framework is

The framework is a **portable system for building a federated, interoperable knowledge commons**. Any community can adopt it, fork it, and run a local commons that still interoperates with the wider network — "interoperability without forced uniformity."

It is the operational distillation of the master doc (the long-form development spec). You adopt the package, not the document. The master doc holds the full rationale, examples, and domain material; this architecture is the part you actually build on.

## The core diagnosis: knowledge coordination friction

> "The core problem we are addressing is **knowledge coordination friction**." — master doc, *Problems, Theory of Change, Outputs, and Outcomes*

Useful knowledge — tools, relationships, stories, case studies, theories of change, frameworks, implementation lessons — already exists. But it is scattered across calls, chats, documents, wikis, repositories, podcasts, social media, local contexts, forums, governance archives, project directories, and people's memories.

That scattering makes it harder for people to orient, for contributors to level up, for aligned people to find one another, for organizations to document themselves, for initiatives to learn from each other, and for the field to build shared capacity over time.

The framework exists to **reduce that friction** — to help knowledge become more findable, understandable, source-aware, review-aware, context-aware, action-connected, and capable of learning from practice. See [`problems-and-theory-of-change.md`](problems-and-theory-of-change.md).

## The design ethos: open-source values for a knowledge commons

The framework translates open-source software values into a **knowledge commons**:

- **Build from what exists** instead of starting from scratch.
- Make knowledge **inspectable, reusable, adaptable, attributable, improvable**, and easy to maintain.
- Support **many contributors, many maintainers, many local adaptations, and many pathways** into the work.
- Treat **provenance, attribution, review, stewardship, correction, and collective learning** as first-class — not afterthoughts.

It is called a **commons** because it is concerned with shared memory, source lineage, attribution, review, stewardship, correction, and collective learning. It is called a **toolkit** because the goal is not only to collect knowledge but to help people *use* it: orient, compare, compose, decide, deploy, document, review, and improve.

Three commitments give the ethos teeth:

- **Source systems are peers, not extractable link pools.** A living knowledge environment carries stewardship, attribution needs, reuse conditions, and a return path. The framework preserves those.
- **Review scales with risk.** Care is right-sized, not bureaucratic — but high-risk material (ecological claims, funding, governance, identity, AI synthesis) gets heavier review.
- **The commons learns from use.** Knowledge is not just published; implementation signals flow back and the system evolves.

## The architecture spine (Decision D1)

The framework carries **two complementary projections of the same system**, with a deliberate division of labor:

- The **knowledge lifecycle** is the **human-facing spine** — how a thing moves from capture to evolution (Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve). This is what a newcomer, a journey, and a contributor follow.
- The **10 layers** are the **structural / data model** — the kinds of things that exist and how they relate (Ontology, Encyclopedia, Resource Graph, …).
- **Ontology** and **Stewardship / Structural Integrity (CSIS)** are **cross-cutting**, not phases or stages — they span the whole system.

Lifecycle = how it moves; layers = what it's made of; the **mapping table** is the bridge that keeps the two views from drifting. See [`operating-loop.md`](operating-loop.md).

## Map of these docs

| Doc | What it covers |
|---|---|
| [`README.md`](README.md) | This orientation: what the framework is, the core diagnosis, the design ethos, the spine. |
| [`problems-and-theory-of-change.md`](problems-and-theory-of-change.md) | The problems targeted, the theory of change, the regeneration-claim boundary, outputs/outcomes, the first practical test, learning signals. |
| [`layers.md`](layers.md) | The 10 layers — each with its core question, role, and what it must NOT become. |
| [`operating-loop.md`](operating-loop.md) | The Core Movement + object shorthand + cross-layer mapping + the lifecycle↔layer bridge table. |
| [`kernel-objects.md`](kernel-objects.md) | The Minimum Operating Kernel (5 objects) — the curated contributor front door over the ontology. |
| [`invariants.md`](invariants.md) | The 16 "preserve distinctions" rules + the minimum structural rule. The package's conformance surface. |
| [`ontology-posture.md`](ontology-posture.md) | Two-layer semantic kernel + align-and-map (interoperable core + extensions; crosswalks, not adopt-as-base). |
| [`type-tag-discipline.md`](type-tag-discipline.md) | When something is a type vs a tag — the anti-sprawl rule that keeps the core small. |
| [`fork-compatibility.md`](fork-compatibility.md) | How a forked commons stays interoperable (frozen core + namespaced extensions that map back). |

Related: the public **journey/site model** lives at [`../site/journey-model.md`](../site/journey-model.md).
