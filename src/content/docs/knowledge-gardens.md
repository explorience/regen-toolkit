---
title: "Knowledge Gardens"
description: "How to build a community knowledge garden that survives turnover, using real tools like Obsidian, Quartz, and the SuperBenefit garden as a model."
---

# Knowledge Gardens

Your best contributor just left. With them went the reasons behind half your decisions, the password to the analytics dashboard, and the unwritten rule about how proposals actually get approved. Nobody wrote it down, because writing it down felt like overhead until the moment it was gone.

A **knowledge garden** is the fix: a living, linked collection of notes that a community tends together over time, so the group's understanding outlives any individual member. Unlike a wiki you fill once and forget, a garden is designed to be revisited, pruned, and grown. The name is deliberate. You don't "finish" a garden. You keep it alive.

## A garden is not a document dump

Most teams already have a pile of docs: a shared drive, a Notion workspace, a Discord pinned-messages graveyard. That pile is not a garden. It's a compost heap nobody turns.

The difference is three habits, not three tools:

- **Linking over filing.** Notes connect to each other by meaning, not by folder. A note on "treasury multisig" links to "who holds keys" links to "what happens if a signer disappears." You move by following ideas, not by remembering where you filed something.
- **Growth stages, openly marked.** A note can be a rough sketch or a settled answer, and you say which. The convention popularized by writer **Maggie Appleton** uses three: 🌱 *seedling* (a half-formed thought), 🌿 *budding* (cleaned up, still evolving), and 🌳 *evergreen* (reliable, maintained). Marking maturity lets readers trust the right things and lets contributors publish before perfect.
- **Tending, not just adding.** Someone goes back. They merge duplicates, fix dead links, and update what's stale. A garden with no gardener becomes a pile again within a year.

The metaphor traces to Mike Caulfield's 2015 talk *The Garden and the Stream*, which contrasted the chronological "stream" of feeds and chat with the slowly-cultivated "garden" of linked, revisited knowledge. Your Discord is the stream. The garden is where you move the parts worth keeping.

## A real one to copy: SuperBenefit

You don't have to invent the structure. **SuperBenefit**, a DAO researching web3 systems-change, runs a public [Knowledge Garden](https://knowledge.superbenefit.org/) you can study and borrow from directly. It organizes everything into four section types:

- **Docs**: finished, reviewed explanations and guides.
- **Lexicon**: short definitions of the terms the community uses, so "cell" or "stewardship" means one thing to everyone.
- **Links**: a curated library of external resources, annotated with why they matter.
- **Patterns**: reusable solutions to recurring problems (governance, decision-making, knowledge management).

That last category is the clever part. SuperBenefit even has a published "Knowledge Gardens" pattern that describes the practice it uses on itself: community members act as gardeners, hold regular sensemaking sessions, and run seasonal reviews to prune and update. The garden documents how to garden.

Steal this shape. Most small teams need exactly four buckets: settled answers, shared vocabulary, useful external links, and repeatable how-tos. Everything else is a variation.

## Picking your tools (and why markdown wins)

Here is the opinionated part. **Use plain markdown files in a Git repository as your source of truth.** Markdown is just text with light formatting; Git is version control that records every change and who made it. This combination is the single most important decision for outliving turnover, because it means your knowledge is not trapped in one company's database.

A practical stack that real communities run:

- **[Obsidian](https://obsidian.md/)** for writing and linking. It's a free desktop app that edits a folder of markdown files on your own machine. It gives you wikilinks (`[[like this]]`), backlinks (every note shows what links *to* it), and a graph view, with no account required. Your notes are just files in a folder you control.
- **[Quartz](https://quartz.jzhao.xyz/)** to publish that folder as a website. It's a free, open-source (MIT-licensed) static-site generator, currently on version 4, built for Obsidian vaults. It carries the wikilinks, backlinks, graph, and full-text search straight to the public site. SuperBenefit ran this exact Obsidian-plus-Quartz pairing before migrating to a custom Astro build.
- **GitHub** to store the files, accept edits via pull requests, and host the published site for free with GitHub Pages.

If you'd rather pay to skip setup, **Obsidian Publish** turns your vault into a hosted site for $8/month billed annually (or $10 month-to-month), priced per site. It's the lowest-friction route, but you trade the open Git workflow for a closed one.

> Why not Notion? Notion is genuinely good for collaboration and you can absolutely start there. The risk is lock-in: your knowledge lives in Notion's database, and exports degrade links and formatting. If your garden must outlive your team, keep the source of truth in markdown and Git, and treat any prettier tool as a window onto it, not the vault itself.

## The one role that makes it work: the gardener

Tools don't tend gardens. People do. The most common failure is "everyone owns the docs," which means no one does.

Name a **gardener**: one person (rotating is fine) responsible not for writing everything, but for making sure the system stays healthy. Their job is small and specific:

- Merge duplicate notes and fix broken links.
- Promote good 🌱 seedlings toward 🌿 budding and 🌳 evergreen, and demote or archive what's gone stale.
- Run a short **garden party**, a recurring session (monthly or per sprint) where the team reviews recent activity and decides what's worth keeping. SuperBenefit uses exactly this rhythm.

This is stewardship work, and it's worth taking seriously as its own discipline. Communities like **GravityDAO**, which provides [conflict management](https://gravitydao.org/conflict-management/) and trust-building for DAOs, exist precisely because the soft infrastructure of a commons (shared meaning, maintained agreements, surfaced tension) needs active care, not just a place to store files. Your garden is part of that soft infrastructure. Budget time for tending it the way you'd budget time for a real plot of soil.

## Start small, on purpose

The temptation is to design the perfect taxonomy first. Resist it. A garden grows from a seed, not a blueprint.

Begin with the four notes you'd most regret losing if your key person vanished tomorrow: how decisions actually get made, who holds what access, your community agreements, and where the important things live. Write them rough, mark them 🌱, link them to each other, and publish. You can prune later. A garden that exists and is messy beats a perfect one that's still being planned.

## Try This

> **Start here:** Open a free [Obsidian](https://obsidian.md/) vault today and write four notes: *How we decide*, *Who holds access*, *Our agreements*, and *Where things live*. Link them to each other with `[[wikilinks]]`. That's a garden, planted.

> **Go deeper:** Push your vault to a GitHub repo and publish it with [Quartz](https://quartz.jzhao.xyz/) on GitHub Pages. Add growth-stage tags (🌱/🌿/🌳) to each note so readers can tell a sketch from a settled answer. Browse the [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/) and copy its four-section shape.

> **Stretch:** Name a gardener and schedule a recurring garden party. Migrate your team's scattered docs into the garden over three sessions, merging duplicates and marking maturity as you go. Write your own "how we garden" note so the practice survives the gardener.

## References

- [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/): A live, public community garden built in the open; study its Docs, Lexicon, Links, and Patterns structure and its own "Knowledge Gardens" pattern.
- [Obsidian](https://obsidian.md/): Free local-first markdown editor with wikilinks, backlinks, and graph view; the writing end of most garden stacks. ([Pricing](https://obsidian.md/pricing) for Publish and Sync.)
- [Quartz](https://quartz.jzhao.xyz/): Free, open-source static-site generator (v4, MIT) that publishes an Obsidian vault as a linked website with search and graph view.
- [The Garden and the Stream: A Technopastoral](https://hapgood.us/2015/10/17/the-garden-and-the-stream-a-technopastoral/): Mike Caulfield's 2015 talk that framed the garden-versus-stream distinction this article builds on.
- [A Brief History & Ethos of the Digital Garden](https://maggieappleton.com/garden-history): Maggie Appleton's explainer on digital gardens and the seedling/budding/evergreen growth-stage convention.
- [GravityDAO, Conflict Management](https://gravitydao.org/conflict-management/): Trust-building and dispute resolution for DAOs; context for why tending a commons' soft infrastructure is real work.
- [ReFi DAO Local Node Toolkit](https://refidao.com/local-nodes): Playbooks and resources for local regenerative nodes, the originating context for documenting community knowledge.
