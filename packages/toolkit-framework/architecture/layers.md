# The 10 Layers — Structural / Data Model

The layers are the **noun structure** of the framework: what kinds of things exist and how they relate. They are the data model — the registries and schemas speak in layers. (The **verb** view — how knowledge moves — is the lifecycle; see [`operating-loop.md`](operating-loop.md).)

The layers are **distinct but not isolated.** A resource can support an encyclopedia page; an encyclopedia page can explain an option; an option can be composed into a track; a track can guide a deployment; a deployment can become an implementation; an implementation generates signals; signals can update any layer. The point of keeping them distinct is captured in one rule (the *minimum structural rule*): **a layer must not absorb another's function unless the interface is explicit.** Each layer below therefore carries a "must NOT become" line. (Source: master doc *System Overview & Core Movement* + the per-layer sections.)

> **Cross-cutting, not layers.** Two concerns span the whole stack and are deliberately *not* phases: the **Ontology / Semantic Kernel** (Layer 1, which structures all the others) and **Stewardship / Structural Integrity** (review, attribution, consent, CSIS). They appear wherever relevant.

---

## 1 · Ontology & Semantic Kernel

- **Core question:** What kinds of things exist, and how do they relate?
- **Role:** Defines types, relationships, metadata, classification layers, semantic structure, and interoperability. The semantic backbone that lets every other layer connect without collapsing into one flat database. Authored small and extensible — "enough shared meaning that people, tools, and AI workflows can work together without silently inventing incompatible categories."
- **Must NOT become:** a maximal, finished ontology that replaces local meaning-making, prescribes one organizational model, or turns every useful word into a root type. It is cross-cutting — it structures the others; it is not a phase.

See [`ontology-posture.md`](ontology-posture.md) and [`type-tag-discipline.md`](type-tag-discipline.md).

## 2 · Knowledge Commons / Encyclopedia

- **Core question:** What does this mean?
- **Role:** Explains concepts, frameworks, domains, comparisons, guides, anti-patterns, and open questions. Turns fragmented exposure into structured understanding — both a reference system and a navigable learning system.
- **Must NOT become:** a raw resource list, the ontology, or an option catalog. **Polished writing is not automatically reviewed knowledge** — maturity and review state apply heavily here.

## 3 · Resource Graph & Ecosystem Atlas

- **Core question:** What exists in the world?
- **Role:** Maps real-world projects, people, organizations, tools, protocols, datasets, maps, events, cases, and **source systems**. The reality layer — where the rest of the commons stays grounded. Working posture: *add broadly, classify lightly, mark maturity honestly, route carefully.* The Graph is the structured registry; the Atlas is the interpretive map (viewing the graph through different lenses).
- **Must NOT become:** a link list, or a public recommendation list. **Inclusion does not mean endorsement.** It points to other layers; it does not replace them.

### 3a · Source-System Registry (named sub-layer)

Resolving **R4 (10 layers vs 11):** the Source-System Registry is **folded into Layer 3 as a named sub-layer, not promoted to an 11th layer.** A *resource* is a useful item that has been surfaced (an article, tool, dataset, link). A *source system* is a **living knowledge environment** — a wiki, repository, documentation site, maintained map, community knowledge garden, research database, forum, or curated directory — that curates and transmits knowledge over time. Source systems get their own metadata pattern (a source-system card) because they carry **stewardship, update rhythms, attribution needs, reuse conditions, and a return path**. They are peers, **not extractable link pools.** This is the federation primitive: the return path is the contribute-back hook.

## 4 · Concept & Idea Ecology

- **Core question:** Where did these ideas come from, and how do they relate?
- **Role:** Maps lineages, paradigms, metaphors, tensions, conceptual clusters, and unresolved relationships. Where the Encyclopedia *explains* a concept and the Ontology *types* it, this layer keeps visible the living movement of ideas — that terms like *commons*, *decentralization*, and *regeneration* mean different things across traditions.
- **Must NOT become:** a place that flattens living ideas into static definitions. Where a term has multiple living meanings, both definitions and the tension between them stay visible. Merging ideas too quickly creates false clarity.

## 5 · Option Library

- **Core question:** What reusable choices are available?
- **Role:** Organizes mechanisms, methods, workflows, templates, patterns, protocols, tools, and design components as **selectable components** that can later be composed into tracks or specified into deployments. An option becomes useful when its context, dependencies, risks, failure modes, and structural requirements are visible.
- **Must NOT become:** a deployment plan or a conceptual explainer. **An option is not a deployment.**

## 6 · Deployment & Structural Integrity

- **Core question:** What must be explicit before something is used in practice?
- **Role:** Defines roles, authority, consent, decision paths, risks, obligations, failure modes, and review needs. Where choices become operational — the responsibility-translation point. A deployment is valid only when its required structures are explicitly defined and visible. Structural integrity is **CSIS-informed, not CSIS-conformant**: the framework flags, it does not certify.
- **Must NOT become:** a place that treats a structure as sound just because its fields are filled in. A good idea, a promising option, or an inspiring past implementation is **not automatically a valid deployment.**

## 7 · Tracks & Composition

- **Core question:** What pathway should someone follow for a specific context?
- **Role:** Composes concepts, resources, options, tools, checks, and cases into guided pathways for a specific audience or purpose. Without tracks, the commons becomes a rich but overwhelming archive. Tracks **prepare** people for action.
- **Must NOT become:** a deployment specification, an implementation, a certification, a universal playbook, or a substitute for local judgment. **A track is not a deployment and not an implementation** — it helps someone prepare better.

## 8 · Implementation & Learning Memory

- **Core question:** What actually happened?
- **Role:** Records pilots, campaigns, funding rounds, governance experiments, local nodes, failures, adaptations, signals, and lessons. Makes the commons accountable to use, not just a theory archive. *A deployment is the specified structure; an implementation is what happened in reality; Learning Memory preserves the difference.*
- **Must NOT become:** a pattern factory. **A single case is not a pattern** — pattern generation requires repeated evidence or clear transferability conditions (pattern humility).

## 9 · Evolution Layer

- **Core question:** How does the commons update itself?
- **Role:** Converts signals, review findings, tensions, implementation learning, and ecosystem changes into updates — through an adaptive loop (Signal → Sensemaking → Balance Assessment → Intervention → Integration → Memory). Protects the commons from both stagnation and reactive overcorrection. Handles archive, compost, deprecate, and remove for outdated material.
- **Must NOT become:** a place where feedback automatically becomes change. **A signal is not a conclusion** — it must be interpreted, reviewed, routed, and integrated before it modifies the commons.

## 10 · Infrastructure & Substrate

- **Core question:** What tools and technical foundations can support this?
- **Role:** Compares the substrates that can carry the commons — documents, markdown, sites, schemas, graphs, databases, AI workflows, storage, publishing pipelines. **Infrastructure should follow function:** ask what work a part of the commons needs to do before choosing a tool. No single tool needs to do everything; a hybrid substrate is expected.
- **Must NOT become:** a premature lock-in. **Do not choose infrastructure before workflows are clear.** It sits *under* the system, not in the workflow — supporting layers, never defining them.

---

## The compact sequence

> Ontology → Knowledge → Resources → Options → Deployment → Tracks → Implementation → Evolution

A shorter learning loop: **Ontology → Knowledge → Deployment → Evolution → Ontology.** Infrastructure (Layer 10) sits under the sequence, not in it. Ontology (Layer 1) and Stewardship/CSIS are cross-cutting.

> **Note on ordering.** The *layer sequence* reads Deployment → Tracks (the data-model view: you specify structure, then compose pathways over it). The *object loop* reads Track → Deployment (the human/Compose→Specify view: you assemble a pathway, then specify what must be true before use). These are two valid readings of the same edge; the reconciliation is in [`operating-loop.md`](operating-loop.md) (R5).
