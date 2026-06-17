# Invariants — the Preserved Distinctions

These are the framework's **"preserve distinctions" rules**: the conceptual boundaries that must hold throughout a commons for it to stay coherent. They are the most **testable** content in the framework — each is a check an entry either passes or fails. (Source: master doc *Concept & Idea Ecology → conceptual distinctions* + *System Overview → minimum structural rule* + the *Problems* section's "trust and maturity" list.)

> **These become `src` validators in a later wave (SP8).** Today they are the conformance *specification*; the validators that enforce them against real entries are built later. Where a structural check already exists, it is noted inline.

## The 16 distinctions

| # | Distinction | Rule |
|---|---|---|
| 1 | **Resource ≠ Concept** | A resource is something *found* (an article, tool, dataset, link). A concept is something *explained* (a meaning). Surfacing an item is not explaining what it means. |
| 2 | **Source ≠ Source-System** | A *source* is a single artifact a claim cites. A *source system* is a **living knowledge environment** (wiki, repo, garden, forum, maintained map) with stewards, update rhythms, attribution needs, reuse conditions, and a **return path**. Source systems are peers, not extractable link pools. |
| 3 | **Ontology ≠ Encyclopedia** | The ontology *structures* meaning (types + relationships + constraints). The Encyclopedia *explains* meaning (prose for a reader). A typed model is not an explainer, and an explainer is not a type system. |
| 4 | **Tool ≠ Option** | A tool is a concrete artifact. An option is a *design choice made reusable* — context, dependencies, risks, and failure modes visible. Naming a tool is not the same as offering a comparable, composable option. |
| 5 | **Option ≠ Deployment** | An option is *selectable*. A deployment *specifies how it will be used* in a context. An option is not a deployment. |
| 6 | **Track ≠ Deployment** | A track is a *guided pathway* that prepares someone. A deployment is a *specific configuration* with explicit structural conditions. A track prepares; a deployment specifies. |
| 7 | **Deployment ≠ Implementation** | A deployment is the *specified structure*. An implementation is *what actually happened in reality*. Learning Memory preserves the difference. |
| 8 | **Implementation ≠ Pattern** | A single implementation (case) is not a pattern. A pattern is a reusable abstraction derived from **repeated** evidence or clear transferability conditions — generated rarely, with care (pattern humility). |
| 9 | **Signal ≠ Conclusion** | A signal is *something learned or flagged*. It must be interpreted, reviewed, routed, and integrated before it changes the commons. Feedback does not automatically become change. |
| 10 | **Type ≠ Tag** | A *type* defines what something **is** (and changes routing, relationships, review needs, templates, permissions, or deployment logic). A *tag* describes how something may be classified, filtered, or interpreted. Confusing tags with types creates ontology sprawl. See [`type-tag-discipline.md`](type-tag-discipline.md). |
| 11 | **Claim ≠ Evidence** | A claim, the evidence behind it, the interpretation, the uncertainty, and the review state must stay separable — never collapsed into a single confident statement. |
| 12 | **Polished ≠ Reviewed** | Polished writing is not automatically reviewed knowledge. Fluent prose carries no review status of its own. |
| 13 | **AI-assisted ≠ Human-reviewed** | AI synthesis must not be treated as reviewed knowledge unless a human has reviewed it. AI helps; humans review and steward. |
| 14 | **Practice ≠ Pattern** | A practice is something people *do*. A pattern is a reusable abstraction across multiple practices/cases. A single practice should not become a pattern too quickly. |
| 15 | **Concept ≠ Framework** | A concept is a meaningful idea or term. A framework is a structured interpretive model that carries assumptions — it must not be treated as a neutral definition. |
| 16 | **Inclusion ≠ Endorsement** | Presence in the Resource Graph or registry means an item may be relevant enough to preserve, classify, review, or revisit — **not** that it is endorsed or public-ready. (Equivalently: *visible structure ≠ structurally sound structure* — fields being filled in is not integrity.) |

These compress into a single discipline: **distinguish what something *is* from what it *appears to be*** — found vs explained, selectable vs specified, prepared vs done, one case vs a pattern, flagged vs concluded, polished vs reviewed, present vs endorsed.

## The minimum structural rule

> **A layer must not absorb the function of another layer unless the interface is explicit.**

This is the one rule the 16 distinctions all serve. Concretely, the master doc's worked examples:

- A raw link list must not be treated as Encyclopedia content.
- A concept page must not be treated as an Option entry.
- A funding mechanism must not be treated as a valid Deployment.
- A Track must not be treated as an Implementation.
- A Case must not be treated as a Pattern too quickly.
- A Signal must not be treated as a Conclusion.
- A tag must not be treated as an ontology type.
- AI synthesis must not be treated as reviewed knowledge unless reviewed.

When one layer *does* need to draw on another's function, the interface must be **named** (e.g. a track *references* deployment checks; a resource *supports* an option) rather than silently merged. Explicit interfaces are what keep the [layers](layers.md) distinct without making them isolated.
