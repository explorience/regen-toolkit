---
title: "Source Systems: Knowledge That Outlives Turnover"
description: "How to treat the wikis, repos, and gardens you rely on as living source systems with stewards and credit, so your knowledge commons survives when people leave."
---

# Source Systems: Knowledge That Outlives Turnover

Your most knowledgeable contributor is leaving in three weeks. Half of what your project actually knows lives in her head, a few of her starred GitHub repos, and a forum thread nobody can find anymore. When she goes, that knowledge goes with her, and the next person rediscovers it the hard way.

This is the problem source systems solve. A **source system** is not a single document. It is a *living knowledge environment* you draw from over time, like a wiki, a code repository, a research database, a forum, or a digital garden, that has people tending it, keeps getting new material added, and has a way to credit back to where things came from. Treat your sources as systems rather than one-off links, and your knowledge commons can survive its own turnover.

## A Link List Is Not a Source System

Most teams keep a "resources" page: a flat list of URLs someone pasted in once and never touched again. Six months later, half the links are dead, nobody remembers why they were added, and no one owns keeping them current.

The Regen Knowledge Commons Toolkit draws a sharp line here. In its own reference docs, the Resource Graph layer is described as "**not a link list**" but "the place where the rest of the Toolkit stays grounded in reality" [RKC]. A link is a dead pointer. A source system is alive: it has a steward, it changes, and you can trace a claim back to its origin.

The test is simple. Ask of any source you depend on: *Who tends this? Is new material still being added? Can I trace it back and credit it?* If the answer to all three is yes, you have a source system. If not, you have a link, and links rot.

## Three Things Every Source System Needs

The Toolkit's reference material defines a source system by three properties that matter more than the format [RKC]:

- **A steward.** Someone (or some group) is responsible for the environment staying coherent. Wikipedia has editors. A GitHub repo has maintainers. Without a steward, a knowledge base silently decays.
- **Ongoing additions.** The environment is not frozen. People keep adding, correcting, and pruning. This is what separates a wiki from a PDF.
- **A return path to credit.** You can trace any piece back to where it came from and point others to it. The Toolkit treats this as a first-class principle: "Provenance and source lineage" and "Attribution and return paths" sit at the top of its cross-cutting rules [RKC].

> 💡 **Going Deeper:** The Toolkit separates the **Resource Graph** (the structured registry of what exists, with metadata and source lineage) from the **Ecosystem Atlas** (the interpretive map that lets you view that registry through different lenses, such as by tool, by concept, or by source system) [RKC]. You don't need that split on day one, but it's a useful idea once your registry grows past a few dozen entries: storage and interpretation are different jobs.

## Provenance Is the Part People Skip

**Provenance** means the recorded origin and history of a piece of knowledge: where it came from, who made it, and how it changed. In data work, provenance is distinguished from lineage by what it captures: lineage is the path data took through systems, while provenance is the historical record of origin, custody, and trust [SNOW]. For a knowledge commons, provenance answers the question your future teammate will ask: "Why do we believe this, and who said it first?"

Skipping provenance feels efficient right up until it isn't. When the original context is lost, knowledge decays into folklore: claims everyone repeats but no one can back up. Recording where something came from, every time, is the highest-leverage habit for a commons that needs to outlast its current members.

The Toolkit makes "Inclusion does not mean endorsement" an explicit rule: adding a source means it is "relevant enough to preserve, classify, review, route, or revisit," not that the project vouches for it [RKC]. That distinction only works if you can see *where each thing came from*. Provenance is what lets you keep messy, unverified material without it quietly becoming "true."

## Real Tools That Do This Today

You don't need to build a custom system. Several mature, named tools already encode these properties.

**For the knowledge environment itself**, local-first note tools give you stewardship and ongoing additions in plain files you own. **Obsidian** and **Logseq** both store notes as plain Markdown on your own disk and use bidirectional links, where linking note A to note B automatically shows the connection on both, so the knowledge graph builds itself as you write [GLU]. **TiddlyWiki** stores an entire personal wiki in a single HTML file, which makes it trivially portable and archivable [GLU]. Because all three keep human-readable files rather than locking content in a proprietary database, your commons can survive any one tool going away.

**For provenance and credit in code or data**, the **Citation File Format (`CITATION.cff`)** is a plain-text file you drop in the root of a GitHub repository. When you add it to the default branch, GitHub automatically shows a "Cite this repository" link in the sidebar and generates citations in APA and BibTeX formats [GHC]. It turns "who made this and how do I credit them" from a lost conversation into a machine-readable answer that travels with the repo.

**For the "why" behind decisions**, **Architecture Decision Records (ADRs)** capture an important decision together with its context and consequences in a short Markdown file kept in the repo [ADR]. The widely used **MADR** (Markdown Any Decision Records) template structures each record as context, decision, and consequences [ADR]. ADRs exist precisely for turnover: they "serve as a historical record, preserving the knowledge of past decisions and preventing knowledge loss when a key team member leaves or when new developers join" [MED].

## Tend the Garden, Don't Freeze It

A source system is never finished, and that is a feature. The **digital garden** ethos, articulated by designer Maggie Appleton, treats published notes as plants at different stages of growth: 🌱 *seedling* for rough early ideas, 🌿 *budding* for clarified work, and 🌳 *evergreen* for reasonably complete pieces, where "even evergreen posts continue to be tended over time" [MAG].

Two of her principles map directly onto a resilient commons. First, **topography over timelines**: a garden connects notes "through related themes, topics, and shared context" rather than burying them in reverse-chronological order, so there are "many entry points but no prescribed pathways" [MAG]. A blog hides last year's knowledge; a garden keeps it findable. Second, **learning in public**: you publish work-in-progress honestly instead of perfecting it in private, which lets others build on it sooner [MAG]. Marking maturity honestly is also baked into the Toolkit's posture: "Add broadly. Classify lightly. Mark maturity honestly" [RKC].

## Stewardship Is Governance, Not Just Tidying

A source system that no one is allowed to govern eventually gets trashed or abandoned. This is where commons thinking earns its keep. Elinor Ostrom won the Nobel Prize in Economics for showing how communities sustainably govern shared resources without a central authority, through a set of design principles that include **clearly defined boundaries** (who may use and change the resource) and **graduated sanctions** (proportionate responses to rule-breaking, starting with a warning, not a ban) [P2P].

These are not abstractions for a knowledge commons. "Clearly defined boundaries" is your answer to *who can edit, who can add, who can delete*. "Graduated sanctions" is how you handle a contributor who keeps adding unsourced claims without driving them away. The Token Engineering Commons built its "Cultural Build" explicitly on Ostrom's eight principles from *Governing the Commons* [TEC]. Gravity DAO, which grew out of that community, focuses on conflict management and trust creation so coordination doesn't collapse under disagreement; its operations lead, Durgadas, works on exactly this relational layer [GRAV]. The lesson for you: the structure that keeps a source system healthy is social, not technical. Tools store the knowledge; stewards keep it trustworthy.

## Try This

> **Start here:** Open your team's "resources" page right now and run the three-question test on the top five entries: Who tends this? Is it still being added to? Can you trace it back to its origin? Delete or flag every link that fails all three. You'll likely cut the list in half and trust what remains.

> **Go deeper:** Pick one repo or knowledge base you maintain and add provenance scaffolding. Drop a `CITATION.cff` in the root so GitHub shows a "Cite this repository" link, and start an `adr/` folder with one MADR-format decision record explaining a choice your team made recently. Now your "why" survives the next handover.

> **Stretch:** Stand up a real source system for your commons in Obsidian or Logseq. Give every source note three fields, steward, maturity (seedling/budding/evergreen), and origin link, and write a one-page governance note defining who can add, edit, and remove, with graduated responses to bad contributions. Onboard one new person using only that system, and watch where they get stuck. The gaps are your roadmap.

## References

- [Regen Knowledge Commons Toolkit, Resource Graph & Ecosystem Atlas (reference docs)](https://github.com/) - The project's own definition of source systems, provenance, attribution, and the "add broadly, mark maturity honestly" posture. [RKC]
- [Citation File Format on GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files) - How `CITATION.cff` produces a "Cite this repository" link and APA/BibTeX citations. [GHC]
- [Citation File Format project](https://citation-file-format.github.io/) - The plain-text standard for machine-readable software and dataset citation. [CFF]
- [Architecture Decision Records (adr.github.io)](https://adr.github.io/) - The ADR and MADR templates for capturing decisions with context and consequences. [ADR]
- [A Guide to ADRs (Medium, Jugurtha Aitoufella)](https://medium.com/@jugurtha.aitoufella/documenting-your-development-process-a-guide-to-architecture-decision-records-with-markdown-and-b428ba091ffa) - Why ADRs prevent knowledge loss during team turnover. [MED]
- [A Brief History & Ethos of the Digital Garden, Maggie Appleton](https://maggieappleton.com/garden-history) - Seedling/budding/evergreen maturity, tending over time, and topography over timelines. [MAG]
- [Eight Design Principles for Common Pool Resources, P2P Foundation](https://wiki.p2pfoundation.net/Eight_Design_Principles_for_Common_Pool_Resource_Systems) - Ostrom's principles, including clearly defined boundaries and graduated sanctions. [P2P]
- [The Cultural Build, TEC Handbook](https://token-engineering-commons.gitbook.io/tec-handbook/what-is-the-tec/the-cultural-build) - How the Token Engineering Commons builds on Ostrom's eight principles. [TEC]
- [Gravity DAO, About Us](https://gravitydao.org/about-us/) - Conflict management and trust creation for web3 commons; Durgadas as operations lead. [GRAV]
- [Data Lineage vs. Provenance, Snowflake](https://www.snowflake.com/en/fundamentals/data-lineage/lineage-vs-provenance/) - The distinction between lineage (the path) and provenance (origin, custody, trust). [SNOW]
- [Knowledge Management in 2026, Rost Glukhov](https://www.glukhov.org/knowledge-management/) - Local-first, bidirectional-linking note tools: Obsidian, Logseq, TiddlyWiki. [GLU]
