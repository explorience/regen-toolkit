---
title: "Human Review Boundaries for a Knowledge Commons"
description: "How to decide what gets human review before it enters your shared knowledge base, so the commons survives staff turnover without drowning your reviewers. For teams stewarding a wiki, digital garden, or knowledge base."
---

# Human Review Boundaries for a Knowledge Commons

A volunteer pushes forty pages of meeting notes into your shared wiki on her last day before moving across the country. Six months later nobody can tell which of those pages are decisions the team actually agreed to, and which are her private musings she dumped in the same folder. The knowledge is technically "captured." It's also useless, because no one drew a line between what was reviewed and what was just deposited.

That line is the whole game. A knowledge commons that must outlive its current staff lives or dies on one question you probably haven't asked out loud: **what has to be looked at by a human before it counts as part of the commons, and what doesn't?**

This article is about drawing that line on purpose. Not "review everything" — that buries your reviewers and the garden goes stale. Not "review nothing" — that's how you get the forty-page dump. Somewhere in between is a boundary that fits your actual team.

## Why "review everything" and "review nothing" both fail

The two easy answers are both traps.

**Review everything** means every typo fix, every rough note waits in a queue for a human to approve it. In a five-person volunteer team, that human is you. You become the bottleneck, the queue grows, contributors stop bothering, and within a quarter the commons is a graveyard of pending changes. Heavy gatekeeping feels safe but quietly kills participation — and participation is the only thing that keeps a commons alive after you leave.

**Review nothing** means anything anyone writes is instantly "the truth." This is how a wiki rots: contradictory pages, abandoned drafts presented as policy, one person's half-formed opinion sitting next to a ratified decision with no way to tell them apart. The commons loses the one property that made it worth building — that you can trust what's in it.

The fix is not a dial you set once. It's a **review boundary**: an explicit, written rule about which kinds of content cross which kind of gate. The same garden can have a wide-open gate for raw notes and a tight, human-reviewed gate for anything that claims to be a decision or a definition.

## Sort your content by consequence, not by volume

The instinct is to review the big stuff and wave through the small stuff. Wrong axis. Review by **consequence** — how much damage a wrong or misleading entry does if it sits there unchallenged.

A useful way to sort, drawn from how SuperBenefit structures its [Knowledge Garden](https://knowledge.superbenefit.org/) into tiers (raw notes, working documents, and refined "artifacts"):

- **Ephemeral / personal** — rough notes, scratch pages, a half-drafted idea. Consequence of error: near zero. **No human gate.** Let people write freely.
- **Working / shared** — a process doc, a how-to, a meeting summary. Consequence: moderate. A wrong entry wastes someone's afternoon. **Light gate** — one peer skims it.
- **Canonical / load-bearing** — a recorded decision, a definition the team will cite, a governance rule, anything labeled "the way we do X." Consequence: high. A wrong entry here corrupts everything built on top of it. **Hard gate** — a named human reviews and signs off before it's marked canonical.

Notice the boundary follows the *claim the content makes*, not its length or its author. A two-line decision ("we're dropping the Tuesday standup") is load-bearing. A forty-page brainstorm is ephemeral. Sort by what breaks if it's wrong.

## A "review boundary" is something you write down and put in the repo

Here's the part most teams skip: the boundary has to be **legible** — written down somewhere a stranger can find and follow it — or it isn't a boundary, it's a habit in your head that dies when you do.

The economist **Elinor Ostrom**, who won the Nobel for studying how communities govern shared resources without central control, found that long-lived commons share a handful of traits. Two apply directly here: **clearly defined boundaries** (everyone knows what's inside the resource and what isn't) and **rules made by the people who use the resource**. A review boundary your team didn't help write, and can't find when they need it, is neither.

So write a short `CONTRIBUTING.md` (or a top-level page in the garden itself) that answers, in plain language:

- What are the tiers, and how do I tell which tier a page belongs to? (Use a folder, a frontmatter field like `status: draft / reviewed / canonical`, or a tag — pick one and be consistent.)
- What gets a human gate, and what doesn't?
- Who can sign off on a canonical entry, and how do they mark it?

This document *is* the boundary. Everything else is enforcement.

## Let the tool enforce the gate so a person doesn't have to

You don't want to police the boundary by remembering to. Make the mechanics do it.

The cheapest durable setup, and a genuinely good one: keep your commons as **Markdown** (plain-text files with simple `# heading` and `**bold**` formatting) in a **GitHub** repository, edited in **[Obsidian](https://obsidian.md/)** (a local Markdown notes app with backlinks). Publish it with **[Quartz](https://quartz.jzhao.xyz/)** — an open-source generator that turns an Obsidian vault into a public digital garden — or with **[Astro Starlight](https://starlight.astro.build/)** for a more structured docs site.

The gate falls out of how Git already works:

- The **`main` branch is the commons.** What's on `main` is, by definition, what the community has accepted.
- Raw notes and drafts live on `main` in a clearly-marked `drafts/` folder or with `status: draft` frontmatter — written freely, no gate, but unmistakably *not yet canonical*.
- Promoting something to canonical happens through a **pull request** (a proposed change someone has to approve before it merges). The PR *is* the human-review event: the reviewer reads the diff, asks questions in the comments, and merges when satisfied. GitHub records who approved it and when — your audit trail comes for free.

This is exactly the workflow the digital-garden community already uses: changes land as PRs, a preview builds, a human merges. You're not inventing process; you're labeling the gate that's already there and deciding which tier has to pass through it.

If you're on **Notion** instead, the same boundary maps to a `Status` property (Draft → In Review → Published) plus a rule that only certain people can flip a page to Published. Less tamper-evident than Git — Notion won't show you a clean diff of who changed what — but workable for a non-technical team. Just know you're trading the audit trail for the lower learning curve.

## Make the reviewer's job small, or it won't get done

A boundary only holds if the human gate is *cheap to pass through*. If reviewing a canonical entry takes an hour, no volunteer will do it twice.

Shrink the job:

- **Review diffs, not documents.** A PR shows only what changed. The reviewer reads three changed lines, not the whole page.
- **Give reviewers a three-question checklist**, not a vibe. For a canonical entry: *Is this actually agreed, or one person's view? Does it contradict anything already canonical? Will a newcomer in two years understand it without you in the room?* That last question is the entire point of a commons that outlives turnover.
- **Name the reviewers explicitly** and rotate the role. Ostrom's research is blunt on this: if everyone is responsible, no one is. Two or three named people who can sign off on canonical changes beats a vague "the team reviews it."

This is where Knowledge Organization Infrastructure (**KOI**) — the BlockScience / Metagov / RMIT research effort into how knowledge objects move between systems — points somewhere most small teams aren't ready for yet: giving each knowledge object a stable identifier and tracking its state as it flows. You almost certainly don't need that machinery on day one. The transferable idea is humbler: **a knowledge object should carry, on its face, what review state it's in** — draft, reviewed, canonical — so a stranger can trust it without asking you.

## Revisit the boundary; don't carve it in stone

The first boundary you draw will be wrong, and that's fine. Maybe you gated too much and the drafts folder is empty because contributing felt like a job interview. Maybe you gated too little and a bad "decision" page slipped through. Ostrom's healthy commons all have **cheap, fast ways to change their own rules** and to surface violations early.

Put a recurring 30-minute review of the *boundary itself* on the calendar — quarterly is plenty. Ask: What got stuck in review and shouldn't have? What slipped through and shouldn't have? Then move the line and update `CONTRIBUTING.md`. The boundary is a living agreement, not a monument.

## Try This

> **Start here:** Open your current wiki or shared drive and label every top-level area as one of three tiers — *ephemeral*, *working*, or *canonical*. Just the labels, today. You'll immediately see where load-bearing content is sitting un-gated next to scratch notes. That gap is your first problem to fix.

> **Go deeper:** Write a one-page `CONTRIBUTING.md` that states your tiers, says which tier needs a human gate, and names two people who can sign off on canonical entries. Add a `status:` frontmatter field (`draft` / `reviewed` / `canonical`) to your ten most-cited pages so their review state is visible on their face.

> **Stretch:** Move your commons into a GitHub repo edited with Obsidian and published with Quartz or Astro Starlight. Set a branch-protection rule so changes to canonical pages require one pull-request approval before merging, while a `drafts/` folder stays open for anyone to write in. Run it for a month, then hold a 30-minute retrospective on what got stuck and what slipped through, and move the boundary accordingly.

## References

- [SuperBenefit — Knowledge Garden](https://knowledge.superbenefit.org/) — A live, working knowledge commons built on tiered content (raw notes → working docs → refined "artifacts"). The clearest real-world example of sorting content by review state; the three-tier model in this article is adapted from how it's structured.
- [Quartz](https://quartz.jzhao.xyz/) — Open-source static-site generator that publishes an Obsidian vault as a public digital garden. The practical tool for running a Git-backed, PR-reviewed commons.
- [Obsidian](https://obsidian.md/) — Local-first Markdown notes app with backlinks; the editing surface for a Git-backed knowledge garden.
- [Astro Starlight](https://starlight.astro.build/) — Documentation-site framework, a more structured alternative to Quartz when you want a docs feel over a garden feel.
- [Elinor Ostrom — Governing the Commons (Wikipedia overview)](https://en.wikipedia.org/wiki/Elinor_Ostrom) — The Nobel-winning research on long-lived commons. Her design principles (clear boundaries, locally-made rules, cheap conflict resolution) are the governance backbone of this whole approach.
- [KOI & The Unicorn — BlockScience](https://blog.block.science/koi-and-the-unicorn/) — Introduction to Knowledge Organization Infrastructure, the BlockScience / Metagov / RMIT research effort on how knowledge objects carry state and move between systems. Heavier machinery than most small teams need, but the source of the "each object carries its own review state" idea used here.
