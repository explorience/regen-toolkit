# Glossary — load-bearing terms

The terms this framework treats as load-bearing. Definitions trace the master doc
(Appendix H, lines 28945–28974) and the framework's own schemas/docs. When a term
maps to a schema or architecture doc, the **In the framework** line points there.

## The five kernel objects (the Minimum Operating Kernel)

- **Resource** — *something found that may be useful.* A link, article, tool, paper, map, organization, event, or project. A resource entry is **not** automatically endorsed. — In the framework: `schemas/resource.yaml`, `architecture/kernel-objects.md`.
- **Concept** — *something explained.* Helps people understand meaning, context, frameworks, comparisons, common confusions. — In the framework: `schemas/concept-lineage.yaml` / `schemas/encyclopedia-entry.yaml`.
- **Option** — *something reusable.* A governance, coordination, funding, documentation, measurement, incentive, or operational pattern that can be reused. An option is **not** automatically a deployment. — In the framework: `schemas/option-entry.yaml`.
- **Deployment** — *a specified configuration for use.* Makes roles, authority, decisions, risks, obligations, and review conditions explicit. Valid **only if** the required structures are explicitly defined and visible. A deployment is **not** automatically an implementation. — In the framework: `schemas/deployment.yaml`.
- **Signal** — *something learned or flagged.* Feedback, observation, failure, risk, correction, or learning that may update the commons — interpreted before it modifies anything. — In the framework: `schemas/signal.yaml`, `process/evolution-loop.md`.

## Core distinctions

- **Source** vs **Source system** — a *source* may be one artifact; a **source system** is a *living knowledge environment* (wiki, forum, directory, repo, map, podcast archive, governance forum, knowledge garden) that curates/maintains knowledge over time. Treated as a **peer, not an extractable link pool**; return paths + attribution are essential. — In the framework: `schemas/source-system.yaml` (K2).
- **Track** vs **Deployment** — a **track** is a *guided pathway* across resources, concepts, options, and templates (tracks *prepare*); a **deployment** is a *specific configuration in a real context* (deployments *specify*). — In the framework: `schemas/track.yaml`, `schemas/deployment.yaml`.
- **Deployment** vs **Implementation** — a deployment is the *specified structure*; an **implementation** is *what actually happened in practice*, including the gap between plan and reality. An implementation case is **not** automatically a reusable pattern. — In the framework: `schemas/implementation-record.yaml`.
- **Signal** vs **Metric** — a signal is an *observed indicator that something may need interpretation* (can be qualitative, weak, ambiguous, early); a metric is a *formalized measure*. — In the framework: `process/evolution-loop.md`.

## State & trust vocabulary (K1 — three orthogonal axes)

- **Maturity** — how developed/trustworthy the content itself is: raw → draft → candidate → source-linked → reviewed → field-informed → pattern-generating (ceiling) → deprecated → archived. Maturity is **not** for shaming rough work; it tells people how to use something responsibly. — In the framework: `schemas/review-maturity.yaml` axis `maturity`.
- **Public-use boundary** — whether something is safe to expose: public · public-with-caveat · restricted-working-notes · private-steward-memory · anonymized-lessons · composted-patterns · never-publish-without-consent. — In the framework: `schemas/public-use-boundary.yaml` + `review-maturity.yaml` axis `public_use`.
- **Lifecycle state** — where an item sits in the intake→compost pipeline: raw-lead → routed → extracted → source-linked → ai-synthesis → human-reviewed → field-informed → public-candidate → mature → compost. — In the framework: `review-maturity.yaml` axis `lifecycle_state`.
- **ai_assisted / high_risk** — orthogonal boolean **flags**, not states (Principle 14). — In the framework: `review-maturity.yaml` `flags`.

## Ontology terms

- **Layer A / core entity** — the *smallest safe shared base*: ~15 broadly-useful entity types every fork inherits unchanged, kept stable + interoperable (aligned with Octo/BKC where feasible). The fork-compatibility contract. — In the framework: `schemas/core-entities.yaml`, `architecture/ontology-posture.md`.
- **Layer B / extension entity** — opinionated Toolkit types, each declaring `maps_to_core` back to a Layer-A type; locally extensible without breaking interop. — In the framework: `schemas/extension-entities.yaml`.
- **Minimum Operating Kernel (MOK)** — the five core working objects (Resource · Concept · Option · Deployment · Signal) as a v0.1 *authoring front door*. NOT a separate type system — a curated usage-layer subset of the full ontology (R3). — In the framework: `schemas/kernel-profile.yaml`, `architecture/kernel-objects.md`.

## Integrity & governance

- **CSIS-informed** — *influenced by CSIS concerns and language without claiming conformance.* — In the framework: `process/csis-safeguards.md` (R7).
- **CSIS-conformant** — *assessed against the actual CSIS standards, dependencies, enforcement logic, and violation-detection criteria.* The framework is CSIS-**informed**, not conformant; CSIS is a **separable optional overlay**. — In the framework: `process/csis-safeguards.md`.
- **Knowledge coordination friction** — the difficulty of finding, understanding, verifying, reusing, adapting, and connecting knowledge to action across fragmented systems (the problem the toolkit addresses). — In the framework: `architecture/problems-and-theory-of-change.md`.
- **Knowledge commons** — shared knowledge infrastructure maintained through use, contribution, correction, attribution, stewardship, and learning. — In the framework: `architecture/README.md`.

> **Term not here?** If a term changes routing, relationships, review, templates, permissions, or logic, it likely deserves a **type** (and an entry); otherwise it's a **tag**. See `architecture/type-tag-discipline.md`.
