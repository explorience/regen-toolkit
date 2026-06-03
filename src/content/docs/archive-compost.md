---
title: "Archive or Compost: Handling Outdated Knowledge Without Losing the Plot"
description: "A practical guide to retiring stale documents in a knowledge commons without deleting your memory or confusing readers, for teams stewarding docs that must outlive turnover."
---

# Archive or Compost: Handling Outdated Knowledge Without Losing the Plot

A new teammate searches your wiki for "onboarding," finds a confident-looking page, and follows it step by step. Halfway through they hit a tool you stopped using eight months ago. The page was never wrong on purpose. Nobody decided to keep it. It just outlived its truth, and the search bar served it up like fresh bread.

This is the failure mode every knowledge commons hits once it's old enough to have a past. The question is not "how do we stop writing things that go stale" (you can't). It's "what do we do with a page once it goes stale, on purpose, with a record."

## The four moves you actually have

When a document stops being true, you have four options, not two. The Regen Knowledge Commons Toolkit names them directly in its Evolution Layer, which exists to keep a living commons from "both stagnation and reactive overcorrection."

- **Archive** — preserve it as a historical record. Not active, but findable, with a clear "this is history" label.
- **Compost** — break it down and reuse the good parts elsewhere. The page dies; its nutrients feed newer pages.
- **Deprecate** — mark it obsolete with a warning to readers, usually because something replaces it.
- **Remove** — actually delete it. The Toolkit treats this as rare; the preferred move is compost or archive.

Most teams only know two verbs: keep and delete. That's the trap. Keep, and the wiki silently rots. Delete, and you lose the memory of why you ever did it that way. The other two verbs are where the craft lives.

> 💡 **Going Deeper:** In the Toolkit's framing, this set of actions is one of eighteen cross-cutting principles — #17, "Compost, archive, and memory" — meaning it's supposed to show up in every layer, not live in a tidy corner. The principle it protects: "preserve outdated material without confusing readers."

## Deprecate first, delete almost never

The software documentation world solved a version of this years ago, and you can borrow their playbook wholesale.

**Deprecate** means: this still exists and still resolves, but we're telling you it's on the way out and pointing you somewhere better. Read the Docs, the open-source documentation host, recommends adding a warning banner at the top of a stale page rather than pulling it, because deleting "will break existing links, and you don't necessary want to make the content inaccessible." When you do remove a page, they say to "create redirects to similar replacement content rather than letting links break."

Grafana's writers' toolkit draws the line even more sharply. Deprecation means a thing is "planned for removal in a future release." Removal means it "is removed and no longer supported." They notify users *two minor releases in advance* before anything disappears, with a stock notice: "Starting with [release], [feature] is deprecated. It will be removed in a future release."

The pattern for your commons is the same minus the version numbers. A deprecated page gets a banner — most wiki tools call these **admonitions** (colored callout boxes), and Markdown-based tools support them natively — that says, in plain words: *"This page describes how we did X before [date]. We now do it differently — see [link]."* You leave the page up. You break no links. You confuse no one, because the first thing they read is the warning.

## Archive means "history," not "trash"

Archiving is the move people get wrong by treating it as a slower delete. A real archive is a *labeled, intact record you can return to*.

Wikipedia is the canonical example of doing this at scale. It almost never destroys anything. Old versions of every page live in the page history; talk-page discussions get moved to dated archive subpages rather than erased; even deleted pages keep their text in the database so that, as one editor put it, "in 100 years when historians want to study this incident, they can." Page history is not clutter. It is the institutional memory that lets a thousand strangers trust the current version.

For your team, archiving looks like: move the file into an `/archive/` folder (or tag it `archived`), add one line at the top — *"Archived [date]. Kept for historical reference; not maintained"* — and exclude it from the default search and navigation so it doesn't ambush newcomers. The content survives. The trust survives. The confusion does not.

## Compost is the one nobody does, and the one that matters most

Here's the move that separates a tended garden from a tidy graveyard. **Compost** means you don't preserve the old page whole — you harvest its still-good parts into living pages, then let the husk go.

A dead onboarding doc might have three paragraphs that were never about the deprecated tool at all: your team's working agreements, a good explanation of *why* you structure things the way you do, a hard-won list of gotchas. Composting means you lift those paragraphs into the pages where they belong now, credit where they came from, and retire the original. Nothing nutritious is lost; nothing stale is preserved as if it were fresh.

This is exactly the ethic behind **evergreen notes** — a practice popularized by Andy Matuschak, who defines them as notes "written and organized to evolve, contribute, and accumulate over time, across projects." Maggie Appleton's widely-copied digital-garden taxonomy makes the maturity visible by labeling notes **seedling → budding → evergreen**, so a reader can see at a glance whether they're looking at a rough sketch or a settled idea. Tools like the open-source static-site generator **Quartz**, which turns an Obsidian or Markdown folder into a published site, let you carry a `publish` or maturity flag in each note's frontmatter — so the same growth state that helps you also signals trust to your readers.

Composting is undervalued because it's the only one of the four moves that requires *judgment* — you have to read the dying page and decide what's worth keeping. Archiving and deprecating can be near-mechanical. Composting is gardening.

## The rule that keeps this from becoming chaos

The Evolution Layer offers one discipline that prevents "someone thinks this is stale" from instantly becoming "the page is gone": **a signal is not a conclusion.** A flag that a page looks outdated should be "interpreted, reviewed, routed, and integrated before it modifies the commons."

In practice: anyone can flag a page as possibly stale (a signal). One named person — a steward — decides which of the four moves applies, and does it on the record. That single gate is what stops both rot (nobody ever acts) and thrash (everybody acts, constantly, in opposite directions). It scales review to risk: a typo fix needs no ceremony; deleting your governance doc needs a second pair of eyes.

There's a broader health this protects. GravityDAO, a group that emerged from the Token Engineering Commons to bring "Trust Creation & Conflict Management to DAOs," treats trust in a commons as something you maintain on purpose, not something you assume. Your archive policy is part of that maintenance. A wiki nobody can trust to be current is a wiki nobody uses, and an unused commons is already dead — it just hasn't noticed yet.

## Try This

> **Start here:** Open your team's wiki search and type the name of one tool or process you stopped using. Find the top stale result and add a single banner line to the top of that page: *"Outdated as of [date] — we now do this differently. See [link or 'ask in #channel']."* One page, five minutes. You've just deprecated something correctly.

> **Go deeper:** Add four states to your docs. Create an `/archive/` folder excluded from search, agree on a one-line banner format for "deprecated," and write a `STEWARDSHIP.md` that defines what archive / compost / deprecate / remove each mean for *your* commons and who's allowed to do them. Run one real page through each of the four moves.

> **Stretch:** Stand up a published knowledge base with maturity built in. Put your docs in a Quartz or Obsidian-published site, add a `maturity` field to every page's frontmatter (`seedling` / `budding` / `evergreen`), surface it as a visible badge, and write a lightweight monthly "compost review" — one steward reads the oldest untouched pages and routes each to a move. That cadence is what makes the commons outlive whoever started it.

## References

- **Regen Knowledge Commons Toolkit — Evolution Layer** (`docs/reference-kc/09-evolution-layer.md` in the Toolkit repo) — the project's own model for how a living commons updates itself, including the archive / compost / deprecate / remove actions and the "a signal is not a conclusion" rule.
- [How to deprecate content — Read the Docs](https://docs.readthedocs.com/platform/stable/guides/deprecating-content.html) — concrete steps for warning banners, redirects, and why deleting breaks links.
- [Deprecate or remove content — Grafana Writers' Toolkit](https://grafana.com/docs/writers-toolkit/write/deprecate-remove/) — the precise difference between deprecating and removing, with stock notices and advance-notice timing.
- [Help:Page history — Wikipedia](https://en.wikipedia.org/wiki/Help:Page_history) — how a massive commons preserves every prior version so the current one can be trusted.
- [Help:Archiving a talk page — Wikipedia](https://en.wikipedia.org/wiki/Help:Archiving_a_talk_page) — the convention of moving old discussion to dated archive subpages instead of deleting it.
- [Evergreen notes — Andy Matuschak](https://notes.andymatuschak.org/Evergreen_notes) — notes "written and organized to evolve, contribute, and accumulate over time."
- [Growing the Evergreens — Maggie Appleton](https://maggieappleton.com/evergreens) — the seedling → budding → evergreen maturity taxonomy for visible note growth.
- [Quartz](https://quartz.jzhao.xyz/) — open-source static-site generator for publishing Markdown/Obsidian notes, with per-note frontmatter you can use to carry maturity and publish state.
- [GravityDAO](https://gravitydao.org/) — conflict-management and trust-creation practice for DAOs and Web3 commons, emerged from the Token Engineering Commons.
