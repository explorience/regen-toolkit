---
title: "A Tools Directory for Knowledge That Outlives Turnover"
description: "An opinionated, named-tool guide to building a team knowledge commons that survives people leaving, for small teams who live in docs and GitHub, not ontologists."
---

# A Tools Directory for Knowledge That Outlives Turnover

Your most knowledgeable contributor announces they are leaving in three weeks. Half of what they know lives in their head, the other half is scattered across a Notion workspace only they really understand. You open it and find orphaned pages, a database nobody else can read, and a "temp" doc that turned out to be load-bearing.

This is the test every knowledge commons eventually fails or passes: can it survive the people who built it walking out the door? The tools you pick now decide that. This is a directory of real, named ones, chosen for durability, not features.

## The one principle that should drive every choice

Before comparing tools, borrow a rule from the Regen Knowledge Commons Toolkit's own infrastructure layer: **infrastructure should follow function.** Before choosing a tool, ask what work this part of your commons needs to do (explain a concept, inventory resources, track decisions, publish a guide) and pick the substrate that fits *that*, not the tool with the nicest landing page.

> "A tool can make a workflow easier. A tool can also distort the commons around its own assumptions. Infrastructure should serve the work."
>, Regen Knowledge Commons Toolkit, Layer 10 (Infrastructure & Substrate)

The corollary matters just as much: **no single tool needs to do everything.** A healthy commons is usually a *hybrid*: plain documents for reasoning, structured tables for inventories, a published site for the public face. Trying to force all of it into one app is the most common way commons rot.

## The portability test: would your knowledge survive the tool dying?

Here is the question that separates durable choices from comfortable ones. If your tool vendor doubled its price tomorrow, or shut down, could you take your knowledge somewhere else without rebuilding it by hand?

For **plain-text Markdown** (a simple, readable text format where `**bold**` and `# headings` are written as visible characters) the answer is yes. A Markdown file opens in any editor, on any machine, in twenty years. Put those files in **Git** (the version-control system behind GitHub, which records every change as a permanent, attributed history) and you also get a durable record of *who* changed *what* and *why*. That is institutional memory you cannot accidentally delete.

Compare that to **Notion**, the polished block-based workspace many teams start in. It is genuinely good for collaboration, but its export is lossy: databases come out as flat CSV snapshots that drop every view, filter, relation, and rollup; callouts export as raw HTML; nested pages produce filenames stuffed with 32-character IDs. After a few years, leaving Notion means manually reconstructing anything more complex than a plain page.

> 💡 **Going Deeper:** Even **Logseq**, long loved for keeping notes as local Markdown, shipped a new SQLite-backed "DB version" in 2025-2026 to fix performance limits on large graphs. It is faster, but data now lives in a database schema rather than portable text, and the two formats are not interoperable. The lesson is not "avoid Logseq." It is that *file-on-disk* is a property you have to keep checking for, not assume.

The rule of thumb: **own your source-of-truth in plain text and Git; use everything else as a publishing or collaboration layer on top.**

## The directory: pick by the job you're doing

The Toolkit's infrastructure layer maps needs to substrates. Here is that map made concrete with tools you can actually deploy.

### Job: a knowledge base your whole team writes in

**BookStack** is a free, MIT-licensed, self-hosted wiki that organizes content into a clear hierarchy of shelves → books → chapters → pages. It runs on ordinary PHP/MySQL hosting, so it survives on modest infrastructure, and the structure makes it hard for content to sprawl into chaos. Good default when you want order without much fiddling.

**Outline** is the most polished self-hosted option. It feels like a private Notion, with slash commands, nested docs, and real-time editing. The trade-off: it has no built-in username/password login, so you must wire it to an identity provider (Google, Slack, or any OIDC source) before anyone can sign in. Worth it if matching the Notion mental model keeps your team writing.

**Wiki.js** suits more technical teams: a Node.js wiki that can **sync its content to a Git repository**, giving you the wiki UI *and* the plain-text-in-Git backup in one move. If you want non-technical people to edit comfortably but engineers to keep a versioned copy, this bridges both.

### Job: notes and thinking that a few people maintain

**Obsidian** keeps everything as Markdown files in a folder you own, a "vault" you fully control, with a graph view, backlinks, and a large plugin ecosystem. It is built for individuals and small teams who think in linked notes. Because the files are just Markdown on disk, you can hand the whole vault to the next maintainer with zero migration.

### Job: a public site the world can read

When the knowledge is reviewed and ready to share, you want a **static site generator**: software that turns a folder of Markdown into a fast website with no database to maintain.

**Quartz** publishes an Obsidian vault straight to the web for free, with client-side full-text search and a graph view, and is the most common free alternative to the paid **Obsidian Publish** add-on ($10/site/month, or $8/month billed annually). If your team already lives in Obsidian, Quartz is the shortest path from private notes to public garden.

**Astro Starlight** is the heavier-duty choice for a real documentation site: sidebar navigation generated from your file structure, dark mode, and built-in full-text search powered by Pagefind that runs entirely at build time, with **no external service, no API key, and no monthly fee**. (The Regen Toolkit's own site runs on Starlight.) Pick it when the public commons needs to look and behave like proper docs.

> 🔧 **For Practitioners:** **GitBook** has a free tier and is free for open-source and nonprofit projects, with GitHub/GitLab sync. But custom domains and team collaborators require a paid plan. Fine for a polished public handbook; check the boundary before you depend on a feature that lives behind the paywall.

## Draw the public / internal / private line on purpose

The single most useful thing the Toolkit's infrastructure layer adds is naming three visibility tiers, and matching each to a substrate instead of dumping everything in one place:

- **Public**, reviewed guides and resources anyone can read. *Substrate: a static site like Starlight or Quartz.*
- **Internal**, working drafts, half-formed notes, contributor-only material. *Substrate: a private Git repo or a team wiki like BookStack or Outline.*
- **Private**, high-risk or sensitive material: unverified claims, personal data, anything that could harm a community if published wrong. *Substrate: access-controlled notes, never the public layer.*

Most knowledge disasters are a tier mismatch: a private contact list ending up on the public site, or a reviewed decision buried where no contributor can find it. Decide which tier each space is *before* you fill it, and the rest of your tool choices fall out almost automatically.

## A note on the human layer

Tools preserve knowledge; they do not preserve trust. When a commons survives turnover, it is usually because someone owned the *practice* of writing things down, not because the software was clever. The conflict-management collective **GravityDAO**, which grew out of the Token Engineering Commons to offer dispute resolution for Web3 projects, is a reminder that the durability of a commons rests on coordination and care as much as substrate. Pick durable tools, then make documenting part of someone's actual role, not an afterthought.

## Try This

> **Start here:** Open whatever tool holds your most important knowledge and run its export. Look at the output. If a database came out as broken CSV or links are dead, you have just found your portability risk. Write it down before you forget.
>
> **Go deeper:** Create a free Git repository (GitHub or Codeberg), move three of your most-referenced internal docs into it as Markdown files, and make a commit. You now have a versioned, attributed, vendor-proof copy of your most load-bearing knowledge.
>
> **Stretch:** Stand up a static-site pipeline. Put your reviewed public docs in a repo, deploy them with Astro Starlight or Quartz, and connect it so a Git push republishes the site. You will have separated your public tier from your working tier with a clear, automated boundary between them.

## References

- [Regen Toolkit, Infrastructure & Substrate (Layer 10)](https://regen-toolkit.superbenefit.dev) - the project's own "infrastructure follows function" principle and the substrate-by-need map this directory builds on.
- [BookStack](https://www.bookstackapp.com/) - free, MIT-licensed, self-hosted wiki with a shelves/books/chapters/pages hierarchy.
- [Outline](https://www.getoutline.com/) - polished self-hosted, Notion-like team knowledge base (requires an external identity provider for login).
- [Wiki.js](https://js.wiki/) - self-hosted Node.js wiki that can sync content to a Git repository.
- [Obsidian](https://obsidian.md/) - local-first, Markdown-vault note tool you fully own; see [Obsidian Publish](https://obsidian.md/publish) for the paid web option.
- [Quartz](https://quartz.jzhao.xyz/) - free static-site generator that publishes an Obsidian vault to the web with search and graph view.
- [Astro Starlight](https://starlight.astro.build/) - documentation framework with build-time full-text search (Pagefind), no external service or API key.
- [GitBook](https://www.gitbook.com/pricing) - hosted docs with GitHub/GitLab sync; free for open-source and nonprofits, paid for custom domains and teams.
- [Notion, exporting your content](https://www.notion.com/help/export-your-content) - read this before depending on Notion, to understand the lossy export limits.
- [Logseq](https://logseq.com/) - open-source, local-first notes; note the 2025-2026 shift toward a database format over plain-text files.
- [GravityDAO](https://gravitydao.org/) - conflict-management and trust-building collective from the Token Engineering Commons; the human layer beneath any durable commons.
