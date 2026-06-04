---
title: "What Is a Knowledge Commons?"
description: "A plain-language guide to building a shared knowledge base that survives team turnover, for small teams comfortable with docs and GitHub."
---

# What Is a Knowledge Commons?

Your most senior person just gave notice, and you realize half of how your project actually works lives only in their head. The Notion page is three reorgs out of date, the real decisions happened in Discord threads nobody can find, and the new hire's first question ("wait, why do we do it this way?") has no written answer.

That gap is the problem a **knowledge commons** is built to solve. A knowledge commons is a shared pool of knowledge that a group creates, governs, and maintains together: owned by the group, not by any one person, and structured to keep being useful as people come and go.

## The "commons" part is the important part

Plenty of teams have a wiki. Far fewer have a *commons*. The difference is governance.

The economist **Elinor Ostrom** spent decades studying how communities manage shared resources (fisheries, forests, irrigation systems) without either privatizing them or letting them collapse. In *Governing the Commons* (1990) she distilled eight design principles that successful commons share: clearly defined boundaries, rules that fit local conditions, the people affected get a say in the rules, monitoring, graduated sanctions for bad behavior, accessible conflict resolution, the right to self-organize, and, for bigger systems, nested layers of governance ([Ostrom, P2P Foundation Wiki](https://wiki.p2pfoundation.net/Elinor_Ostrom%E2%80%99s_Eight_Commons_Governance_Design_Principles)).

She later turned that lens directly onto information. In *Understanding Knowledge as a Commons* (Hess & Ostrom, MIT Press, 2007), knowledge is treated as a shared resource with the same vulnerabilities as a fishery: it can be enclosed, neglected, or polluted ([Hess & Ostrom, framework chapter, Syracuse SURFACE](https://surface.syr.edu/sul/21/)). The book's core warning is **enclosure**: knowledge that was once shared getting locked behind paywalls, dead logins, or one person's laptop.

For you, the practical translation is blunt. A knowledge commons needs *rules about who can edit, who reviews, and what happens when something is wrong*, not just a place to dump pages. A wiki with no agreement about how it's tended is just a slower mess.

## Why turnover is the real test

Most documentation dies quietly. It's written once, never updated, and slowly drifts from reality until people stop trusting it, at which point they go back to asking the one person who knows.

A commons designed to outlive turnover does three things that a normal wiki doesn't.

**It writes down decisions, not just procedures.** The Regen Toolkit's own guidance on documentation distinguishes *process docs* (how to do X) from *historical docs* (why we decided X, what we tried that failed) ([Regen Toolkit, "Documentation for Local Nodes"](https://regen-toolkit-site.vercel.app/)). The "why" is what walks out the door with people. Capture decisions as they happen; a dated one-line entry is enough.

**It assigns ownership without centralizing the work.** Ostrom's principles include monitoring and self-organization for a reason: if everyone owns the docs, no one does. Name a steward whose job is to keep the system healthy, not to write everything, but to make sure stale pages get flagged and gaps get filled.

**It makes contribution legible.** People only maintain what they can easily edit and clearly see the value of. If updating a page takes a Slack request to an admin, your commons will rot.

## Real commons you can learn from

You don't need to invent this. Three working examples sit at different scales.

**Wikipedia** is the largest knowledge commons on earth, and its durability is not an accident. It's licensed **CC BY-SA** (Creative Commons Attribution-ShareAlike), a "copyleft" license meaning anyone can reuse the content as long as they credit it and share derivatives under the same terms, adopted across Wikimedia projects since 2009 ([Creative Commons](https://creativecommons.org/2009/06/22/wikipedia-cc-by-sa-free-culture-win/)). The license *guarantees* the knowledge can never be re-enclosed. Every page has a visible edit history and talk page: Ostrom's monitoring and conflict-resolution principles, made into software.

> 💡 **Going Deeper:** The license is a governance decision disguised as legal boilerplate. **CC BY 4.0** lets anyone reuse and adapt your work, even commercially, as long as they credit you; **CC BY-SA** adds the "share-alike" requirement that keeps derivatives open too ([Creative Commons licenses](https://creativecommons.org/share-your-work/cclicenses/)). Picking an open license up front is the single cheapest insurance against your commons being locked away later.

**The SuperBenefit Knowledge Garden** is a small-team commons you can actually copy. It's a shared knowledge base for a Web3 ecosystem, organized into docs, a lexicon of definitions, a curated links library, and reusable patterns ([knowledge.superbenefit.org](https://knowledge.superbenefit.org/)). Under the hood it's plain Markdown files edited in **Obsidian** and published with **Quartz** (a static-site generator for digital gardens), with the whole thing in a public, MIT-licensed GitHub repo ([github.com/superbenefit/knowledge-garden](https://github.com/superbenefit/knowledge-garden)). That stack means the knowledge is portable text, version-controlled, and survives any single tool: exactly the anti-lock-in property you want.

**GravityDAO** shows the governance half. It's a group that brings conflict management and trust creation to DAOs, offering alternative dispute resolution rather than top-down arbitration ([gravitydao.org](https://gravitydao.org/)). The lesson for a knowledge commons: the hard maintenance problems are rarely technical. They're disagreements about what's true, what's settled, and who decides, and a commons that lasts has an agreed, low-drama way to handle those.

## A "digital garden" is a knowledge commons that admits it's unfinished

You'll hear the term **digital garden**: a knowledge base that's deliberately grown over time rather than published once and frozen ([Maggie Appleton, digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)). Notes are planted rough, tended, and linked to each other, with their maturity shown openly.

This is the right posture for an outlive-turnover commons. The enemy of a living knowledge base is the belief that pages must be perfect before they're useful. Mark a page "rough draft" and publish it; a flagged half-answer beats a missing one.

The tooling for this is mature and mostly free. **Obsidian** and **Logseq** both store your notes as local Markdown files with bidirectional links, so your knowledge isn't trapped in a vendor's database. Obsidian is file-first and plugin-rich; Logseq is fully open-source and outliner-style ([Glukhov, PKM tools](https://www.glukhov.org/knowledge-management/)). **TiddlyWiki** packs an entire wiki into a single HTML file you can email or archive. For docs you already keep in **GitHub**, a static-site generator like **Quartz** publishes the same Markdown to a browsable website.

## Don't build the ontology first

One trap, stated plainly because you said you're not an ontologist and don't want to become one: resist the urge to design a perfect category system before you have content. An **ontology** (a formal map of how all your concepts relate) is genuinely valuable at scale, but built too early it becomes a cage that nobody fits their actual notes into.

Start with three buckets that map to how knowledge actually leaves a team: **decisions** (what we chose and why), **how-to** (repeatable procedures), and **reference** (definitions, links, the lexicon). Add structure only when a real pile of notes tells you what's missing. Structure should follow the content, never the reverse.

## Try This

> **Start here:** Open a fresh doc and write one decision your team made in the last month (what you chose, what you rejected, and why) in five sentences. Date it. That single dated entry is the seed of a commons; the format is the whole technique.

> **Go deeper:** Stand up a real garden. Create an Obsidian vault or a GitHub repo of Markdown files, make three folders (`decisions/`, `how-to/`, `reference/`), and move your five most load-bearing pieces of tribal knowledge into them. Add a `CONTRIBUTING.md` naming one steward and one rule: every page shows its status (`rough` / `reviewed`).

> **Stretch:** Make it a true commons. Put the repo under an open license (CC BY 4.0 for content), publish it with Quartz so it's readable by anyone on your team without a login, and write down your governance: who can edit, who reviews, and how you resolve disagreements about what's correct. Then test it: ask someone who didn't write the docs to onboard using only the commons, and fix every gap they hit.

## References

- [Elinor Ostrom's Eight Commons Governance Design Principles, P2P Foundation Wiki](https://wiki.p2pfoundation.net/Elinor_Ostrom%E2%80%99s_Eight_Commons_Governance_Design_Principles), the eight design principles from *Governing the Commons*, in summary form.
- [A Framework for Analyzing the Knowledge Commons, Hess & Ostrom (open-access chapter from *Understanding Knowledge as a Commons*, MIT Press, 2007)](https://surface.syr.edu/sul/21/), the foundational text treating knowledge itself as a shared resource subject to enclosure.
- [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/), a live, small-team knowledge commons organized into docs, lexicon, links, and patterns.
- [SuperBenefit knowledge-garden on GitHub](https://github.com/superbenefit/knowledge-garden), the MIT-licensed source: Markdown maintained in Obsidian, published with Quartz.
- [Creative Commons licenses](https://creativecommons.org/share-your-work/cclicenses/), how CC BY and CC BY-SA work, and why an open license is governance, not paperwork.
- [Wikipedia + CC BY-SA, Creative Commons](https://creativecommons.org/2009/06/22/wikipedia-cc-by-sa-free-culture-win/), why the world's largest knowledge commons chose a copyleft license.
- [GravityDAO](https://gravitydao.org/), conflict management and trust creation for DAOs; a model for the governance side of a commons.
- [Digital Gardeners, Maggie Appleton](https://github.com/MaggieAppleton/digital-gardeners), resources on the digital-garden practice of growing knowledge in public over time.
- [Murmurations Protocol](https://murmurations.network/), an open, JSON-Schema-based way for separate commons to share and federate their data across the regenerative economy.
