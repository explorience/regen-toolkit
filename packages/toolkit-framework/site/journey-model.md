# The Journey / Site Model

The **generator-agnostic** model for the public front door of a knowledge commons. It describes *what a journey is* and *how it relates to the commons* — not how to build a particular site. Any static-site generator, CMS, or rendering layer can implement it.

## A journey is the front door, not the commons

The site is the **public front door**: a usable entry point with guided journeys, plain-language articles, and a knowledge map. It is "an evolving public-facing prototype, not the whole Toolkit." (Source: master doc *Outputs and Outcomes → outputs*.)

The defining rule:

> **The site pulls from the commons; it does not own it.**

The commons — resources, concepts, options, tracks, deployments, implementations, signals — lives in the [layers / data model](../architecture/layers.md). The site is a *view* over that data. The same resource or concept can appear in many journeys; it has one home in the commons and many surfacings on the front door. Nothing authored only in the site is canonical; canonical content is authored in the commons and rendered by the site.

## A journey is an ordered set of chapters → steps over the lifecycle

A **journey** is a guided path shaped like the [knowledge lifecycle](../architecture/operating-loop.md) — it walks a person from discovery toward action and learning, scoped to a purpose or audience.

```
Journey
  └─ Chapter        (a lifecycle phase, or a coherent stretch of it)
       └─ Step       (a single thing to read, do, compare, or decide)
            └─ pulls → a commons entry (Resource / Concept / Option / Track / Deployment / …)
```

- A **journey** is the whole path (e.g. an orientation path, a builder path, a reviewer path).
- A **chapter** is an *ordered* segment of the journey, typically aligned to a lifecycle phase (Discover → Understand → Connect → Compose → Specify → Implement → Learn → Evolve). Chapters give the journey its shape.
- A **step** is the smallest unit — one thing to read, compare, decide, or do. Each step **references** a commons entry by its identifier; it does not duplicate the content.

A journey is, in effect, a **track rendered for the public** (Layer 7, Tracks & Composition): an ordered composition of concepts, resources, options, and checks for a specific context. Journeys ARE lifecycles — which is why the lifecycle is the human-facing spine and the site can be validated as part of the framework rather than bolted on.

## What the model carries (generator-agnostic fields)

A journey definition is portable data — render it however you like. The shape, not the syntax:

- **Journey:** `id`, `title`, `audience`, `purpose`, `ordered chapters`.
- **Chapter:** `id`, `title`, optional `lifecycle_phase`, `ordered steps`.
- **Step:** `id`, `label`, a `ref` to a commons entry (by id), optional `action` (read / compare / decide / do), optional `maturity` / `public_use` surfaced from the referenced entry.

Because steps reference commons entries by id, the site inherits the commons' **maturity and public-use state** for free: a journey can refuse to surface, or can caveat, an entry whose `public_use` says it is not ready (see `../schemas/public-use-boundary.yaml` and `../schemas/review-maturity.yaml`). The front door never silently presents raw or unreviewed material as public guidance.

## What the journey model must NOT do

- **It must not become the source of truth.** If content lives only in the site, it has escaped review, provenance, and the lifecycle. Author in the commons; render in the site.
- **It must not flatten maturity.** A polished page is not a reviewed page; the site surfaces the commons' review state, it does not overwrite it.
- **It must not imply a single correct path.** Regenerative work is too diverse for one linear pathway — journeys are contextual entry points, not a universal curriculum.
- **It must not lock the commons to one generator.** The model is data; the renderer is replaceable.
