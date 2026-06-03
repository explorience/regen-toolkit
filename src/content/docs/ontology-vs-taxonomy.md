---
title: "Ontology vs Taxonomy: Which One Does Your Commons Need?"
description: "A plain-language guide for teams building a knowledge commons: when a simple taxonomy is enough, when you need an ontology, and the named tools to use for each."
---

# Ontology vs Taxonomy: Which One Does Your Commons Need?

Your wiki has 400 pages and three people who know where everything lives. Two of them are leaving this year, and the third just labelled the same project "funding," "grants," and "money" in three different docs. That drift is the exact problem taxonomies and ontologies are built to solve, and picking the wrong one wastes months.

This is for someone leading a small team building a knowledge commons that has to outlive its founders. You're comfortable in docs and GitHub. You are not an ontologist, and you don't want to become one. Here's how to choose.

## A taxonomy is a labelled filing cabinet

A **taxonomy** is a hierarchy of categories you use to file and find things. Each item sits under a broader category, which sits under a broader one still. Think folders inside folders, or the way a library shelves books.

The formal version adds a little discipline. A taxonomy concept has one **preferred label** (the official name) and any number of **alternate labels** (synonyms that point back to it). So "grants," "funding," and "money" all redirect to one agreed term, and the drift in your wiki stops. Concepts link upward and downward with **broader** and **narrower** relations, and sideways with a loose "related" link [HEDDEN].

That's roughly the limit of what a taxonomy says about your world: *this thing is a narrower kind of that thing.* It's about classification and navigation, not meaning [SGKG]. And that limit is a feature. Non-technical teammates can read, extend, and argue about a taxonomy without training, which is exactly what you want when the people maintaining it keep changing.

## An ontology is a map of how things actually relate

An **ontology** describes the *kinds of things* in your domain and the *specific relationships* between them, in a form a computer can reason over. Where a taxonomy says "Grant is a narrower term than Funding," an ontology says "a Grant is *awarded by* a Funder *to* a Project *during* a Period, and *requires* a Report."

The technical difference is that ontologies separate **classes** (types, like Grant or Project) from **individuals** (actual instances, like your March seed grant), and let you define named, typed relationships and rules between them rather than a single generic hierarchy [HEDDEN]. Those rules enable **inference**: state that every Grant requires a Report and that your March grant is a Grant, and the system can flag that a report is missing without anyone hand-tagging it. Taxonomies can't do that.

Ontologies are what power knowledge graphs, semantic search, and the structured data behind AI systems, because there relationships matter as much as the things themselves [SGKG].

## They are not rivals; one extends the other

The honest answer to "ontology or taxonomy" is usually "taxonomy first, ontology later, if at all." A taxonomy gives you the foundation; an ontology builds on top of it when you genuinely need machine-readable relationships and inference [SGKG]. Most knowledge commons never need the second step, and that's fine.

The Regen Toolkit's own internal reference makes the same call. Its ontology layer states the goal plainly: "not to create a perfect ontology before use," but "enough shared meaning that people, tools, and future AI workflows can work together without silently inventing incompatible categories" [REGENKC]. Start small. Extend only when reality forces you to.

> 💡 **Going Deeper:** The cleanest bridge between the two is **SKOS** (Simple Knowledge Organization System), a W3C standard published on 18 August 2009 for representing taxonomies, thesauri, and controlled vocabularies as linked data [SKOS]. SKOS gives you `prefLabel`, `altLabel`, `broader`, `narrower`, and `related` out of the box, and it's compatible with the heavier ontology standards (RDF, RDF Schema, and OWL, the Web Ontology Language) so you can grow into them later without throwing work away [HEDDEN]. Build your taxonomy in SKOS and you've kept the door to an ontology open for free.

## The trap: calling a tag a type

The most expensive mistake here isn't choosing wrong. It's letting the two blur together until nobody trusts the structure. The Regen Toolkit reference draws the line in one sentence: "A type defines what something is. A tag describes how something may be classified, interpreted, filtered, or used. Confusing tags with types creates ontology sprawl" [REGENKC].

In practice: "Project" is a type, because it defines what the thing *is*. "Urgent," "vegan," or "2026" are tags, because they describe how you might *filter* a project. Promote every useful adjective into a structural type and your model balloons until maintaining it becomes its own full-time job, which is the opposite of outliving turnover.

This is a coordination problem before it's a technical one. GravityDAO, which treats conflict management and trust as public infrastructure for web3 communities [GRAVITY], exists because shared structure breaks down when meaning quietly forks between people. A knowledge commons fails the same way: not in a crash, but in slow semantic drift until two contributors mean different things by the same word and neither notices. The fix is cheap and human: agree your handful of types out loud, write them down, and treat everything else as a tag.

## How to choose, concretely

Ask one question: **does anything need to reason over your relationships, or do humans just need to find things?**

If people only need to browse, filter, and find, build a **taxonomy**. Real examples of taxonomy thinking at scale: Wikipedia's category system, which organises millions of articles into browsable hierarchies, and Schema.org, the shared vocabulary Google, Microsoft, Yahoo, and Yandex launched in 2011, rooted in a single top type, "Thing" [SCHEMA].

If you need software to *derive* facts (missing reports, eligible projects, conflicting claims), you're heading toward an **ontology**. Wikidata is the reference example: a crowd-maintained knowledge graph where items and the properties linking them are first-class objects, so machines can traverse and query the relationships, not just read the labels [WIKIDATA].

For a team your size, the strong default is: ship a SKOS taxonomy now, and only reach for an ontology when a specific, recurring task can't be done by hand.

## Try This

> **Start here:** Open your wiki or repo and write down the five to seven *types* of thing it actually contains (Project, Person, Resource, Decision, Event). Just types, not tags. If you argue about whether something is a type or a tag, you've found exactly where your structure is drifting.

> **Go deeper:** Take one of those types and build a small SKOS taxonomy for it in a spreadsheet: a `prefLabel` column, an `altLabel` column for synonyms, and a `broader` column for the parent. Filling in the synonym column alone will kill most of your label drift, and you can export it to standard SKOS later.

> **Stretch:** Install **Protégé**, the free, open-source ontology editor from Stanford that supports OWL 2 and ships with reasoners like HermiT [PROTEGE], and model one real relationship from your commons end to end, for example "Grant *requires* Report." Run the reasoner against three real records and see whether it correctly flags the one missing a report. That single loop tells you whether an ontology earns its keep for you, before you commit a quarter to building one.

## References

- [Taxonomies vs. Ontologies — Hedden Information Management](https://www.hedden-information.com/taxonomies-vs-ontologies/) — a working taxonomist's precise breakdown of what each model adds, with the SKOS/OWL standards landscape. `[HEDDEN]`
- [Ontology vs Taxonomy: Choosing the Right Knowledge Organisation Model — SGKG](https://sgkg.org/blog/2026-03-21-ontology-vs-taxonomy-knowledge-organisation/) — clear framing of taxonomy-as-classification vs ontology-as-relationships, and how they layer. `[SGKG]`
- [SKOS Simple Knowledge Organization System — W3C](https://www.w3.org/2004/02/skos/) — the official home of the 2009 W3C standard for taxonomies and controlled vocabularies as linked data. `[SKOS]`
- [Protégé — Stanford University](https://protege.stanford.edu/) — the free, open-source OWL 2 ontology editor to use if and when you graduate to an ontology. `[PROTEGE]`
- [Schema.org](https://schema.org/) — a real, widely used vocabulary showing a "Thing"-rooted type hierarchy in production. `[SCHEMA]`
- [Wikidata — Wikipedia](https://en.wikipedia.org/wiki/Wikidata) — a live, crowd-maintained knowledge graph; the reference example of an ontology-style commons at scale. `[WIKIDATA]`
- [GravityDAO](https://gravitydao.org/about-us/) — treats conflict management and trust as public infrastructure for web3 communities; useful framing for why shared structure is a coordination problem. `[GRAVITY]`
- Regen Toolkit, internal Knowledge Commons reference (Layer 1 — Ontology & Semantic Kernel; Layer 4 — Concept & Idea Ecology) — the project's own posture on minimal ontologies and the type/tag distinction. `[REGENKC]`
