---
title: "Federation and Portability: Building a Commons That Outlives Its Tools"
description: "How to keep a small team's knowledge commons portable across people, platforms, and time, for leads who live in docs and GitHub but aren't ontologists."
---

# Federation and Portability: Building a Commons That Outlives Its Tools

Your team has been building a knowledge commons for two years. It lives in one tool, two of the three people who set it up have moved on, and the renewal invoice just tripled. You open the export menu and find a ZIP of files you can't actually read. That sinking feeling is the whole problem in one screen.

This article is about avoiding that screen. **Portability** means your knowledge can move, between tools, between people, between organizations, without rotting on the way. **Federation** means separate groups can share knowledge without merging into one big database. Both protect the same thing: a commons that survives turnover.

## Lock-in Is a Trust Problem, Not Just a Tech Problem

When a tool stores your knowledge in a format only it can read, you don't own the knowledge, you rent access to it. The day the company shifts pricing, gets acquired, or shuts down, your commons is a hostage.

This is the failure mode plain-text advocates have warned about for years: most note tools store data in opaque databases or proprietary schemas, which makes migration painful or impossible when features change, prices shift, or the company folds. The fix is boring and durable. Plain text is readable in any editor, searchable with `grep`, diffable in version control, and convertible to PDF, HTML, or EPUB without depending on a vendor.

This is exactly why the Regen Knowledge Commons Toolkit writes its own substrate in Markdown files in a Git repository. Its infrastructure layer states the rule directly: "Infrastructure should serve the work" and "Do not choose infrastructure before workflows are clear." The point isn't that Markdown is fashionable. It's that a tool can quietly distort a commons around its own assumptions, so the commons should sit on a substrate it can leave.

## Markdown plus Git: The Portability Floor

If you take one concrete decision from this article, make it this: keep the canonical copy of your commons in plain Markdown, tracked in Git.

**Markdown** is a plain-text format for writing structured documents (headings, lists, links) that any editor can open. **Git** is the version-control system most of your team already touches through GitHub. Together they give you four things no single app offers natively: full history, branch-based experimentation, line-by-line attribution (`git blame`, so you know who wrote what and why), and rollback to any point in your project's life.

**Obsidian** makes this tangible for a non-technical team. It's a notes app whose entire database is just Markdown files in folders on your own machine, nothing proprietary. Obsidian's own manifesto promises notes that are "yours" (stored locally), "durable" (open formats, no lock-in), and "private" (no telemetry). If Obsidian disappeared tomorrow, your vault would still open in TextEdit. That's the test for any tool you adopt: *if this vendor vanished, could I still read everything?*

> 💡 **Going Deeper:** Frontmatter, the small YAML block at the top of a Markdown file, is where portability gets real. The Toolkit tags each file with `title`, `tags`, `audience`, and source lineage. Because that metadata lives inside the plain-text file, it travels with the content into any tool that reads YAML. Put your structure in the files, not in the app's hidden database.

## Federation: Sharing Without Merging

Portability handles moving *your* commons. Federation handles connecting it to *other people's*, the partner co-op, the regional network, the funder's registry, without everyone surrendering their setup to one master database.

The cleanest model here is **KOI** (Knowledge Organization Infrastructure), an open protocol from BlockScience built with Metagov and RMIT. KOI lets diverse groups indicate what they know and voluntarily share it "without forcing them into a single unified database, closed-source software, or sacrificing control over sensitive information." That last clause is the whole reason federation beats consolidation.

The trick is a small idea with a big payoff: the **RID** (Reference Identifier). An RID is like a library call number, a stable label that points *to* a knowledge object (a doc, a message, a record) without handing over the object itself. As BlockScience's Michael Zargham and Ilan Ben-Meir put it, "a stable concept of a reference as something distinct from (but referring to) an underlying referent is thus the mechanism that enables organizations to interoperate while retaining (and securing) their respective boundaries." You share the label; you keep the content and the access rules.

> 🔧 **For Practitioners:** KOI-net, the network protocol and Python framework that implements this, hit public beta in May 2025 and is MIT-licensed and actively maintained (`koi-net` on GitHub, v2.0.7 as of May 2026). Nodes play roles: *sensors* ingest from a source like GitHub or HackMD, *processors* transform, *coordinators* handle discovery and registration. Networks can nest, one KOI-net becoming a node inside a larger one. The Regen Toolkit already wires a `regen-koi` integration into its repo, treating its layout as "sensor-friendly today" so federation can switch on later without a rewrite.

## You Don't Need a Protocol to Start Federating

KOI is the serious end of the spectrum. The accessible end is already running in the social web, and it shows what federation costs in practice.

The Fediverse, Mastodon and other **ActivityPub** servers, is a working federation of independent servers. When you move accounts, the protocol's `Move` activity carries your followers to the new home. But here's the honest caveat: as of 2025, your *posts* don't move automatically yet. Mastodon migration brings your followers and (via exported CSV) your follows; the actual content portability is still being specified through work like the W3C Social Web Community Group's data-portability draft and the LOLA proposal.

The lesson for your commons is sharp. Federation is mostly a *governance* and *naming* problem, not a tooling problem. Decide what's public, what's internal, and what's private (the Toolkit splits exactly these three tiers), give shared things stable names, and you can federate by hand, an agreed folder of public Markdown that two teams both sync, long before you need KOI.

## The Order That Saves You

Do these in sequence and turnover stops being existential:

1. **Substrate first.** Canonical copy in Markdown + Git. Everything else is a view onto it.
2. **Structure in the files.** Metadata in frontmatter, not in an app's database.
3. **Boundaries named.** Mark public / internal / private explicitly, so federation never leaks what it shouldn't.
4. **Federate by reference.** Share stable labels (links, IDs, eventually RIDs) to what you keep, not copies you lose track of.

A person leaving should cost you their judgment, not your knowledge. Build so the second one never walks out the door.

## Try This

> **Start here:** Open your main knowledge tool and find the export button. Export everything, then open the result in a plain text editor. If you can read and search it, you're portable. If you can't, you've found your single biggest risk, and your next project.

> **Go deeper:** Move one section of your commons into a Git repo of Markdown files (Obsidian over a GitHub-synced folder is the gentlest on-ramp). Add YAML frontmatter to each file for title, tags, and source. Make three commits over a week and run `git log` to see your history become an asset.

> **Stretch:** Pick one external partner and federate one shared resource by reference. Agree on stable names for the shared items, expose a public folder each side syncs read-only, and write down the public/internal/private boundary. When that's stable, read the KOI-net docs and map which of your sources would become sensors.

## References

- [A Preview of the KOI-net Protocol](https://blog.block.science/a-preview-of-the-koi-net-protocol/) - BlockScience's introduction to KOI-net, RIDs, and node types (sensor/processor/coordinator).
- [A Language for Knowledge Networks](https://blog.block.science/a-language-for-knowledge-networks/) - Zargham and Ben-Meir on sharing knowledge across organizations without merging databases.
- [BlockScience/koi-net (GitHub)](https://github.com/BlockScience/koi-net) - The MIT-licensed Python implementation of the KOI-net protocol; check releases for current version.
- [KOI resources hub (GitHub)](https://github.com/BlockScience/koi) - Jumping-off point for the KOI project (BlockScience / Metagov / RMIT), linking the protocol versions and the RID library that gives every knowledge object a stable reference.
- [Moving or leaving accounts (Mastodon docs)](https://docs.joinmastodon.org/user/moving/) - What account migration actually transfers in ActivityPub today, and what it doesn't.
- [Data Portability in ActivityPub (W3C SWICG draft)](https://swicg.github.io/activitypub-data-portability/) - Ongoing community work to make federated content, not just followers, portable.
- [Obsidian](https://obsidian.md/) - Local-first notes app whose database is plain Markdown files you fully own.
- [Use Git and Markdown to store your team's documentation and decisions (Xebia)](https://xebia.com/blog/use-git-and-markdown-to-store-your-teams-documentation-and-decisions/) - Practical case for the Markdown-plus-Git portability floor.
