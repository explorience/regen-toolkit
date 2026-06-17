# Contribution

> Source: master doc **§5 "Contribution model and deep intake"** and **§15 "Basic
> contribution types"**. This is the front door of the commons.

## Core contribution principle (Principle 18)

> **A contributor should be able to add one useful thing without understanding the
> whole system.**

A contribution may begin as a resource, concept, option, deployment note, implementation
note, signal, source-system lead, correction, question, template, review comment, or raw
link. The Toolkit's job is to **route it, preserve its source lineage, mark its status, and
help it become more useful over time.**

Contributors enter through different doors and contribute at their level. The system routes
useful material into the right layer — *do not force contributors to choose the perfect
category up front.*

## Deep intake — one thing → many entries

A single submitted object often decomposes into **multiple** Toolkit objects. Example:
someone shares a report. That one report may be:

- a **Resource** (it exists and should be indexed);
- a **source** for several **Concepts**;
- **evidence** for a **Claim**;
- inspiration for an **Option**;
- a candidate **Implementation** record;
- a **Signal** (if it reveals risk, failure, tension, or an open question);
- part of a **Source System** (if it belongs to a living knowledge environment);
- a **public-use-boundary case** (if it carries sensitive claims, local knowledge,
  allegations, or unresolved conflict).

**Deep-intake questions** (ask on submission): What is the object as a whole? Where did it
come from? Who created/maintains it? What URLs, people, orgs, projects, tools, and source
systems does it reference? What concepts does it explain? What options/mechanisms does it
contain? What claims does it make and what evidence does it cite? Does it describe an
implementation? Does it surface a signal/risk/failure/open question? Does anything require
consent, review, anonymization, or restricted access? What should be extracted now, and what
can stay a raw lead?

> **The `capture-and-route` skill** (`skills/capture-and-route/`, framework keystone K7) runs
> this deep-intake loop: raw lead → typed objects → layer routing, drafting provenance
> (`provenance.yaml`) and proposing maturity/public-use/lifecycle states + `high_risk`/
> `ai_assisted` flags for human confirmation. AI **proposes**; a human governs (Principle 14).

## The contribution lifecycle (states)

The lifecycle is **one of the three orthogonal axes** of the canonical state model — do not
restate it as a competing ladder. It is the `lifecycle_state` axis in
[`schemas/review-maturity.yaml`](../schemas/review-maturity.yaml):

```
raw-lead → routed → extracted → source-linked → ai-synthesis
        → human-reviewed → field-informed → public-candidate → mature → compost
```

These run **independently** of `maturity` (how developed the content is) and `public_use`
(whether it's safe to expose) — an item can be `mature` in lifecycle yet `internal-only`
in public-use. See [`principles.md`](principles.md) (3, 4) and the schema's `axes` block.

Master-doc state names map onto this axis 1:1 (e.g. "Routed lead" → `routed`, "AI-assisted
synthesis" → `ai-synthesis`, "Public-use candidate" → `public-candidate`, "Mature guidance"
→ `mature`). The `contribution-record.schema` captures *who did the labor* (`labor_kind`),
distinct from the *state of the item*.

## The 10 contribution types

Each is a lightweight entry point with minimum fields and a routing target. (Master doc
§15 "Basic contribution types".)

| # | "I want to…" | Minimum fields | Routes toward |
|---|---|---|---|
| 1 | **Add a resource** | title; link; why it matters; rough category; status `raw-lead` | Resource Graph · Source System Registry · Encyclopedia · Option Library · Track |
| 2 | **Add a source system** | name; link; steward; what it contains; reuse/attribution questions | Source System Card (`source-system.yaml`) · Resource Graph |
| 3 | **Improve a concept** | concept name; definition/clarification; source; related concepts; known confusions; open questions | Encyclopedia · Concept Ecology · Ontology |
| 4 | **Add an option** | option name; category; use case; dependencies; risks; related resources; deployment checks | Option Library |
| 5 | **Add a deployment note** | purpose; context; decisions; roles; power; accountability; failure detection | Deployment layer |
| 6 | **Add an implementation record** | what happened; context; evidence; lessons; signals; update implications | Implementation Memory |
| 7 | **Add a signal** | what was noticed; source; affected layer; risk; suggested route | Evolution layer (`signal.yaml`) |
| 8 | **Add a failure case** | what failed; context; early signals; affected parties; what can be learned; what not to generalize | Implementation Memory · Failure Case Library · Encyclopedia anti-patterns |
| 9 | **Add a review note** | what was reviewed; review type; reviewer; decision/concern; recommended action; public-use implication | maturity update · public-use boundary · Evolution Log |
| 10 | **Add an update proposal** | proposed change; reason; affected layers; alternatives; risks; review needs; decision status | Evolution layer · ontology/editorial/governance review (`update-proposal.yaml`) |

> Each contribution must be **routable**, not perfect. The same form fields seed the
> `frontmatter` schema every entry extends, so AI-assisted expansion can suggest likely
> type(s), candidate concepts, source-system candidates, extracted links, public-use
> cautions, and review needs without the contributor needing to understand the ontology.

## What this protects

Contribution stays **open** (low barrier, many doors, AI assistance) without becoming
**chaotic** (everything is typed, source-linked, status-marked, and routed over time). It
keeps the dividing line between *contributing* (can be raw) and *publishing* (needs review)
— see [`review.md`](review.md) and the role-failure safeguards in [`roles.md`](roles.md).
