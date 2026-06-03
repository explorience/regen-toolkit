---
title: "Metadata That Matters"
description: "How to design a small, durable set of metadata fields so your knowledge commons stays findable and trustworthy after the people who built it move on."
---

# Metadata That Matters

A volunteer who held half your knowledge base in her head just left. Now someone opens a folder of 300 markdown files, has no idea which ones are current, who wrote them, or whether the funding numbers in that 2024 grant doc were ever checked, and quietly gives up. The files survived. The knowledge did not.

This is the gap metadata is supposed to close. Done well, a handful of fields at the top of each document lets a newcomer answer "is this current, who made it, can I trust it?" without finding the person who wrote it. Done badly, metadata becomes busywork that nobody fills in and nobody reads. This article is about getting the first outcome.

## The Problem You Are Actually Solving

In a 2018 study of more than 1,000 US workers, Panopto and YouGov found that 42% of institutional knowledge is unique to the individual, acquired for their current role and shared by none of their coworkers. When that person leaves, their colleagues cannot do 42% of the job [Panopto].

A knowledge commons built to outlive turnover is a direct bet against that statistic. Your goal is to move knowledge *out* of heads and into documents that explain themselves. **Metadata** is data about your data, the structured labels (author, date, status, topic) that describe a document so it can be found, sorted, and trusted without opening it. It is the part of a document that answers questions a stranger would ask.

## Types Versus Tags: The One Distinction to Get Right

The fastest way to wreck a metadata system is to confuse two different jobs and pour everything into one messy pile of labels.

A **type** says what something *is*: a guide, a meeting note, a decision, a funding record, a person. A document has exactly one type. A **tag** says how something might be *classified or filtered*: `governance`, `solar`, `draft`, `needs-review`. A document can have many tags. The Regen Web3 Toolkit's own internal architecture makes this its eleventh cross-cutting principle, "type / tag discipline," and warns plainly that "confusing tags with types creates ontology sprawl" [ToolkitOntology].

Sprawl is the failure mode you are guarding against. Without it, one person tags a doc `governance`, another writes `gov`, a third uses `decision-making`, and six months later your filter for governance docs misses half of them. The fix is not more rules up front. It is a short, agreed list of types and a *controlled vocabulary* for the tags that matter, a fixed set of approved values rather than free-for-all tagging. Research on collaborative tagging is consistent here: unmoderated tags drift into inconsistency, while light vocabulary control keeps data usable without killing contribution [Folksonomy].

## Start Tiny: The Fields Every Entry Needs

The temptation is to design the perfect schema before anyone writes anything. Resist it. The Toolkit's own working rule is "add broadly, classify lightly, mark maturity honestly," and its v0.1 recommendation lists a deliberately small required set for every entry: title, type, a short description, source or origin, status or maturity, related concepts, related resources, and open questions [ToolkitResources][ToolkitOntology].

Notice what that list is doing. **Title** and **description** make it findable. **Type** routes it. **Source or origin** and **status or maturity** are the trust fields, the ones that let a stranger decide whether to rely on the document. That last point is the heart of "metadata that matters": the fields that protect trust earn their place; decorative fields do not.

A concrete starting schema for a small team, expressed as the YAML **frontmatter** (the block of key-value metadata fenced by `---` at the very top of a markdown file) that tools like Obsidian, Astro, and Jekyll all read:

```yaml
---
title: "Treasury multisig setup"
type: guide              # one of: guide, note, decision, record, person
status: review           # draft | review | current | archived
owner: "amara"           # who maintains this, not just who typed it
updated: 2026-06-01      # when it was last verified, not just edited
source: "internal"       # or a URL / origin if lifted from elsewhere
tags: [treasury, governance]
---
```

Six or seven fields. A new contributor can fill them in ninety seconds, and a newcomer can read them at a glance. You can always add fields later. You can almost never remove them once people depend on them, so spend the field budget carefully.

## Don't Invent Field Names: Borrow Proven Ones

Before you name a field, check whether a long-lived standard already named it. Reusing established names buys you tooling, documentation, and interoperability for free.

The **Dublin Core** metadata set is the obvious reference: fifteen broad, generic properties (Title, Creator, Date, Subject, Description, Type, Source, Rights, and seven more) standardized internationally as ISO 15836 and maintained since the 1990s [DublinCore]. You will not use all fifteen, and you should not. But when you need a field for "who made this" or "what is this about," Creator and Subject are battle-tested names that other systems already understand.

The **Murmurations** protocol shows why shared names matter in a network of communities. It maintains a public *field library* of pre-defined, reusable fields, and its documentation is blunt about discipline: when you reuse a field, "use the name it was given (`longitude`) and not rename it (`long`) in your schema" [Murmurations]. One project writing `latitude`/`longitude` while another writes `lat`/`long` is exactly the sprawl that breaks shared maps and directories. Borrowing the canonical name is the cheapest interoperability you will ever buy, and it matches the Toolkit's principle of "interoperability without forced uniformity" [ToolkitOntology].

## Make the Computer Enforce It

A schema that lives in someone's memory decays the moment that someone leaves. The durable move is to write the rules down in a file the computer checks on every change, so consistency does not depend on anyone remembering.

If your commons is a docs site built with **Astro** (the framework behind Starlight, a common choice for knowledge bases), you can define a content collection schema with **Zod**, a validation library, so frontmatter errors are caught at build time rather than discovered by a confused reader months later [Astro]:

```js
import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    type: z.enum(["guide", "note", "decision", "record", "person"]),
    status: z.enum(["draft", "review", "current", "archived"]),
    updated: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});
```

If you are in a plain markdown repository, `remark-lint-frontmatter-schema` does the same job against a JSON Schema, validating types, required fields, and *enums* (a fixed list of allowed values), with inline warnings in VS Code and auto-fix suggestions [RemarkLint]. The `enum` on `status` and `type` is your controlled vocabulary made unbreakable: a typo like `reviewed` instead of `review` fails the check instead of silently splitting your data.

This is where metadata stops being a hopeful convention and becomes structural. A schema enforced in continuous integration is a contract your knowledge base keeps with its own future contributors, long after the people who wrote it are gone. It is the same instinct that groups like GravityDAO bring to community coordination: treat the things that protect trust, conflict process for them, schemas for you, as basic infrastructure rather than an afterthought [Gravity].

## The Trust Fields Are Non-Negotiable

If you keep only three fields under pressure, keep the trust fields: **status**, **owner**, and **source**.

Status tells a reader whether to rely on a document or treat it as a sketch. Owner tells them who to ask and who is on the hook to keep it current, a person, not a passive "last edited by." Source tells them where a claim came from, which is the difference between "the grant covered $40k" and "someone typed $40k once and nobody ever checked." The Toolkit codifies this for higher-risk material as claim-evidence separation and source lineage [ToolkitOntology], and the principle scales down cleanly: for anything load-bearing, record where it came from and whether it has been verified, separately from the claim itself.

These fields are the metadata that actually matters, because they are the ones a stranger uses to decide whether your knowledge commons is trustworthy. Everything else is convenience.

## Try This

> **Start here:** Open your knowledge base and pick five fields, no more. Title, type, status, owner, updated. Add them to the three most important documents by hand. Notice how much faster a newcomer could now judge those three.

> **Go deeper:** Define a controlled vocabulary. Write the allowed values for `type` and `status` into a `SCHEMA.md` in your repo, then audit twenty existing docs against it. Every mismatch you find (`gov` vs `governance`, `done` vs `current`) is sprawl you just caught before it spread.

> **Stretch:** Turn the schema into a check. Add `remark-lint-frontmatter-schema` (markdown repo) or an Astro/Zod content collection (docs site) and wire it into CI so a pull request fails when frontmatter breaks the rules. Now your metadata enforces itself, and survives the next round of turnover.

## References

- [Panopto: Inefficient Knowledge Sharing Costs Large Businesses $47 Million Per Year](https://www.panopto.com/company/news/inefficient-knowledge-sharing-costs-large-businesses-47-million-per-year/) - The 2018 YouGov study finding 42% of institutional knowledge is unique to the individual.
- [DCMI: Dublin Core Metadata Element Set, Version 1.1](https://www.dublincore.org/specifications/dublin-core/dces/) - The fifteen standard, internationally ratified metadata elements (ISO 15836).
- [Murmurations Protocol: Create a Schema](https://docs.murmurations.network/guides/create-a-schema.html) - How a regen-adjacent network builds interoperable schemas from a shared field library.
- [Astro Docs: Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) - Defining and validating markdown frontmatter with Zod schemas at build time.
- [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) - Validate markdown frontmatter against a JSON Schema, with enums, required fields, and editor integration.
- [Folksonomy (Wikipedia)](https://en.wikipedia.org/wiki/Folksonomy) - Why uncontrolled tags drift, and why light vocabulary control keeps tagged data usable.
- [Gravity DAO](https://gravitydao.org/about-us/) - Treating conflict process, and by analogy trust-protecting structure, as basic community infrastructure.
