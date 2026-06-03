---
title: "Review and Maturity: Labelling What Your Knowledge Can Be Trusted To Do"
description: "How to mark which pages in your knowledge commons are battle-tested and which are still drafts, so the project survives turnover without losing trust — for small teams building docs that must outlive their authors."
---

# Review and Maturity: Labelling What Your Knowledge Can Be Trusted To Do

A new teammate opens your wiki, finds a confident-looking page on how you handle treasury payouts, follows it to the letter, and gets it wrong. The page was a half-finished draft someone wrote in a hurry eight months ago, and nobody ever flagged it as such. Now you have lost an afternoon, and they have lost some trust in everything else you have written.

That failure is not about writing quality. It is about **maturity and review state** — a visible signal of how trustworthy a piece of knowledge is and how thoroughly it has been checked. A page can be beautifully written and completely unreviewed. Your readers cannot tell the difference unless you tell them. This article is about how to tell them, cheaply, in a way that holds up when the people who wrote the docs move on.

## The trap: polished writing reads as trusted knowledge

The Regen Web3 Toolkit's own design names this directly. One of its cross-cutting principles is *Maturity and review state*, and the warning attached to it is blunt: **"Polished writing is not automatically reviewed knowledge."** A clean paragraph and a fact-checked claim feel identical to a reader. The formatting does the persuading; the review never happened.

This is the quiet killer for a commons that has to outlive its founders. Knowledge concentrated in one head has what engineers call a **bus factor** — the number of people who would have to disappear before the project stalls. A bus factor of one means a single departure breaks you. When your one expert leaves, their drafts stay behind looking just as authoritative as your reviewed pages, and nobody left can tell which is which.

Maturity labelling is how you lower that risk without writing more. You make the *trust state* of each page legible, so the knowledge survives the person.

## Borrow a maturity ladder that already works

You do not need to invent a scheme. Three battle-tested ones already exist, and you can copy whichever fits.

**Wikipedia's content assessment scale** rates every article from Stub → Start → C → B, then up through Good Article (GA) and Featured Article (FA). The lower rungs are deliberately loose and self-assigned, but GA and FA require an actual review by other editors before the label can be applied. That split is the whole point: anyone can claim "draft," but "reviewed" is a status someone else grants you.

**Architecture Decision Records (ADRs)** — short documents recording a single decision and why — use a tiny lifecycle: *Proposed → Accepted → Deprecated / Superseded*. The widely used **MADR** template (Markdown Architectural Decision Records) bakes this status field in. The discipline is that once a decision is Accepted it stays put; if you change your mind, you write a new record that supersedes the old one rather than quietly editing history.

**Kubernetes** labels every feature *Alpha → Beta → Stable*. Alpha "might be buggy" and "may be dropped at any time without notice"; Beta is "well tested" and safe to rely on; Stable carries a commitment not to break it. The label tells you exactly how much weight to put on the thing.

> 💡 **Going Deeper:** Notice the shared shape. Each ladder separates *self-claimed* states (Stub, Proposed, Alpha — "I wrote this") from *granted* states (Featured, Accepted, Stable — "someone else checked this"). That boundary is the entire mechanism. If a contributor can promote their own work to "trusted," the label means nothing. Put the promotion gate on the granted tiers and leave the draft tiers frictionless.

## A four-rung ladder you can ship this week

Pick the smallest scheme that captures your real risk. For most small commons, four rungs are plenty:

- **Draft** — written, not checked. Anyone can create or edit. Default for everything new.
- **Reviewed** — a second person has read it for accuracy and agreed it is correct. Requires someone other than the author.
- **Maintained** — reviewed *and* someone owns keeping it current, with a review date attached.
- **Deprecated** — kept for history, but no longer the way to do things. Carries a pointer to what replaced it.

Store the rung in the page's frontmatter (the small block of metadata at the top of a Markdown file), so it travels with the content and shows up in search and listings:

```yaml
status: reviewed
reviewed_by: amara
last_reviewed: 2026-05-30
```

That is the entire system. No new tool, no database. If your docs live in Git, the review *itself* is just a pull request approved by a second person — version control already records who checked what and when, which is exactly the granted-state evidence Wikipedia's GA tier asks for.

> 🔧 **For Practitioners:** Render the status as a visible badge at the top of each page, not just buried metadata. A grey "Draft — unreviewed" banner does more for trust than any disclaimer in the footer. In a Starlight or Docusaurus site, read the frontmatter `status` field in your page template and emit a coloured callout. In a plain wiki, a one-line header convention (`> Status: Draft`) works. The label has to be where the reader's eyes already are.

## Let maturity drive how hard you review

Reviewing everything to the same standard is how small teams burn out and quietly stop reviewing at all. The Toolkit's design answers this with another principle: **review should scale with risk.** A glossary entry and a page telling people how to move treasury funds do not deserve the same scrutiny.

So tie your effort to the stakes, not to a fixed checklist:

- **Low-stakes** (definitions, link lists, opinion): a single second reader is enough to reach Reviewed.
- **High-stakes** (anything touching money, legal exposure, ecological claims, or governance instructions): require two reviewers and an explicit owner before it can reach Maintained.

This keeps the gate meaningful where it matters and frictionless where it does not. The goal is right-sized care, not bureaucracy.

## Maturity is also a maintenance signal, not just a launch label

The hardest problem in a long-lived commons is not unreviewed drafts — it is reviewed pages that *silently rot*. The world changes, the page does not, and because it once carried a "Reviewed" badge, everyone keeps trusting it.

The Toolkit's Evolution Layer names this exact failure as **silent drift**, sitting alongside its opposite, **stagnation** (never updating) and **reactive overcorrection** (rewriting everything the moment one person complains). Its governing rule is worth memorising: **"A signal is not a conclusion."** Feedback should be interpreted and routed before it becomes a change — but a page going stale *is* a signal, and ignoring it is its own failure.

Two cheap habits keep maturity honest over time:

1. **Expiry by date, not by vibe.** A `last_reviewed` field plus a rule — "Maintained pages older than six months drop to Reviewed until re-checked" — means stale content demotes itself automatically. You can script this in a few lines against your frontmatter.
2. **Compost instead of delete.** When something is wrong but historically useful, mark it Deprecated and point to its replacement rather than erasing it. The Toolkit distinguishes *archive* (preserve as record), *compost* (break down and reuse the good parts), *deprecate* (mark obsolete with a warning), and *remove* (rare). Deletion loses the lesson; deprecation keeps it visible without misleading anyone.

GravityDAO, the Web3 conflict-resolution group whose operations Durgadas helps run, treats a system's capacity to surface tension, learn from it, and evolve as a marker of whether that system is sustainable at all. A maturity scheme is how a knowledge commons does that on purpose, in public, where the next person can see it.

## Try This

> **Start here:** Open the three most important pages in your wiki right now and add one line to the top of each — `Status: Draft`, `Status: Reviewed`, or `Status: Deprecated` — honestly. Most teams discover their "official" docs are mostly unreviewed drafts. That realisation alone is worth the five minutes.

> **Go deeper:** Adopt the four-rung ladder (Draft / Reviewed / Maintained / Deprecated) as a `status` field in your page frontmatter, and make "Reviewed" require a pull-request approval from someone other than the author. Run one real page through it end to end and write down where the process snagged.

> **Stretch:** Render the status as a visible badge on every page, then write a small script that scans `last_reviewed` dates and automatically demotes any "Maintained" page older than your chosen window back to "Reviewed." Now your commons flags its own rot without anyone remembering to look — the maintenance loop runs whether or not the original author is still around.

## References

- [Regen Web3 Toolkit — Evolution Layer](https://regen-toolkit-site.vercel.app/) — The project's own design for how a living commons updates without stagnating or overcorrecting; source of the "a signal is not a conclusion" rule and the archive/compost/deprecate/remove model.
- [Wikipedia: Content assessment](https://en.wikipedia.org/wiki/Wikipedia:Content_assessment) — The Stub → Start → C → B → GA → FA quality scale, and why GA/FA require review by other editors rather than self-assignment.
- [MADR — Markdown Architectural Decision Records](https://adr.github.io/madr/) — A tiny decision-record template with a built-in status field (proposed / accepted / deprecated / superseded); a working example of granted-vs-self-claimed states.
- [Diátaxis](https://diataxis.fr/) — Daniele Procida's documentation framework (adopted by Gatsby and Cloudflare); useful for deciding what *kind* of page you are reviewing before you rate its maturity.
- [Kubernetes: Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) — The Alpha / Beta / Stable maturity ladder, with explicit promises attached to each stage.
- [Bus factor (Wikipedia)](https://en.wikipedia.org/wiki/Bus_factor) — The knowledge-concentration risk metric; why a commons with a bus factor of one breaks when one person leaves.
- [Gravity DAO — About Us](https://gravitydao.org/about-us/) — Web3 conflict-management and trust-creation group; team page lists Regis (Durgadas) as Operations Manager. Its practice treats surfacing and processing tension as a sign of a healthy, sustainable system.
