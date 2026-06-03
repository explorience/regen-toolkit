---
title: "Stewardship Roles for a Knowledge Commons That Outlives You"
description: "How to name, assign, and hand off the stewardship roles that keep a community knowledge commons alive through turnover, for small teams comfortable with docs and GitHub."
---

# Stewardship Roles for a Knowledge Commons That Outlives You

Your wiki has 400 pages. Two are about how the wiki works, and you wrote both. When a new contributor asks "who decides what gets merged?" the honest answer is "me, in my head, based on vibes." That answer is a single point of failure wearing a hoodie.

A knowledge commons is not a pile of documents. It is a living system that needs tending, and tending needs people in named roles who know what they are responsible for. The pile survives turnover. The tending does not, unless you make it survive on purpose.

## Stewardship is a verb before it is a title

**Stewardship** means caring for something you do not personally own so it stays healthy for the people who come after you. In a knowledge commons, the thing being cared for is shared knowledge, and the danger is not that someone steals it. The danger is that it quietly rots while everyone assumes someone else is watching.

The Regen Knowledge Commons Toolkit treats this as a first-class concern. One of its cross-cutting principles is **living systems health**: paying attention to "energy, trust, contribution flow, maintenance capacity" across the whole commons, not just whether the docs are technically correct ([Regen Toolkit, Cross-cutting principles](https://regen-toolkit-site.vercel.app)). A page can be accurate and still be dying, because nobody is updating it, nobody is linking to it, and nobody feels responsible for it.

Roles make that responsibility legible. A role answers, in advance, the question "whose job is this?" before the moment when nobody knows and the thing breaks.

## The minimum role set: five jobs, not five people

You do not need an org chart. On a small team, one person holds several of these roles, and that is fine. What is not fine is leaving them unnamed. Here are the five jobs a knowledge commons actually needs covered.

**The Editor decides what is true enough to publish.** Someone has to hold the bar for "is this accurate, is it sourced, is it ready?" The Regen Toolkit calls this **claim-evidence discipline**: keeping the claim, the evidence, the interpretation, and the review state separate, so a guess never gets shelved next to a verified fact ([Regen Toolkit, Cross-cutting principles](https://regen-toolkit-site.vercel.app)). Review should scale with risk: a typo fix needs no ceremony, a funding or ecological-impact claim needs a careful read.

**The Curator decides what belongs and where.** New material arrives constantly. Without a Curator, your commons becomes a junk drawer. This role routes incoming notes, prunes duplicates, and handles what the Toolkit calls **compost, archive, and memory**: preserving outdated material without letting it confuse current readers ([Regen Toolkit, Cross-cutting principles](https://regen-toolkit-site.vercel.app)). Old pages do not get deleted in a panic. They get composted, with a tombstone pointing to what replaced them.

**The Facilitator handles disagreement.** When two contributors disagree about a page, that is the system working, not a bug. Someone has to hold the conversation so it resolves in the open instead of in DMs. Gravity DAO, a conflict-management collective from the Token Engineering Commons, built its practice on this: treating friction as "transformational opportunities" and helping parties reach good-faith compromise rather than ruling for one side ([Gravity DAO](https://gravitydao.org/)). You do not need a DAO. You need one named person who knows the disagreement is theirs to host.

**The Maintainer keeps the lights on.** Links break, the build fails, the search index goes stale, the backup silently stops. Unglamorous, and the role that actually keeps the commons usable day to day.

**The Onboarder makes the next contributor possible.** This role owns the two pages you wrote about how the wiki works, and the answer to "how do I help?" The Toolkit's principle here is that **contribution should be legible**: clear, documented paths in, not tribal knowledge ([Regen Toolkit, Cross-cutting principles](https://regen-toolkit-site.vercel.app)).

> 💡 **Going Deeper:** These map cleanly onto roles open source already uses. GitHub's permission model splits "triage" (manage issues and labels, no code write) from "maintainer" (merge and configure), so you can hand someone the Curator job without handing them the keys. Ben Balter's open source governance guide recommends exactly this graduated trust as the way to grow a contributor base safely ([Ben Balter, "Five practical tips"](https://ben.balter.com/2021/06/14/open-source-governance/)).

## Measure your fragility before you feel it

Here is the uncomfortable number. Open the contribution history of your commons and ask: how many people would have to leave before half the work stops getting done? If the answer is "one," you have a problem you cannot see yet, because right now that one person is still here.

This has a name and a formula. The CHAOSS project (Community Health Analytics in Open Source Software, a Linux Foundation effort) defines the **Contributor Absence Factor**, formerly called the Bus Factor: "the smallest number of contributors responsible for 50% of total contributions" ([CHAOSS](https://chaoss.community/kb/metric-contributor-absence-factor/)). You sort contributors by volume, add them up until you cross 50%, and count how many it took. A factor of 1 or 2 means your commons lives or dies with one or two people.

You can compute this by hand from your commit log or wiki revision history in ten minutes. The number itself is not the point. The point is that "who does half the work here?" becomes a question you ask on a calendar, not a discovery you make in a crisis when that person burns out.

## Wire the roles into the tools you already use

Sol, this is where it gets concrete. Roles written in a Notion page that nobody opens are decoration. Roles enforced by the tooling are real. Three named mechanisms, all free, all things you can turn on this week.

**CODEOWNERS turns the Editor role into a merge rule.** A `CODEOWNERS` file lives in your repo's `.github/`, root, or `docs/` directory. Each line is a path pattern plus one or more owners, and "code owners are automatically requested for review when someone opens a pull request that modifies code that they own" ([GitHub Docs](https://docs.github.com/articles/about-code-owners)). Point `docs/funding/` at your finance-literate Editor and `docs/ecology/` at your ecology Editor, flip on "require review from code owners" in branch protection, and the right reviewer is pulled in automatically. The Editor role stops being a person you remember to ping and becomes a gate the system enforces.

**all-contributors turns recognition into a habit.** The hardest part of stewardship is that the work is invisible: the person who triages issues or fixes typos rarely shows up in a contributor graph. The all-contributors specification exists to fix exactly this, recognizing "all contributors, not just the ones who push code," with a bot and an emoji key covering doc writing, review, event organizing, mentoring, and maintenance ([all-contributors on GitHub](https://github.com/all-contributors/all-contributors)). Comment `@all-contributors please add @sol for review, maintenance` on an issue and the bot updates your README. Visible recognition is what keeps Curators and Onboarders from quietly quitting.

**A `GOVERNANCE.md` turns roles into a contract.** One plain markdown file at your repo root, listing each role, who holds it today, and how it gets handed off. This is the single highest-leverage document in your commons and almost nobody writes it. It is what lets a new contributor answer "who decides what gets merged?" by reading a file instead of guessing.

> 🔧 **For Practitioners:** Two real systems show role-separation at scale. Wikimedia **stewards** are globally elected and deliberately barred from using their powers on wikis where they are active local editors, keeping the role about the commons rather than home-turf power ([Wikimedia Stewards](https://meta.wikimedia.org/wiki/Stewards)). Ethereum's **Protocol Guild** funds 180-plus core maintainers across 29 teams through an onchain registry while keeping funding strictly separate from protocol decisions, so getting paid never buys a vote ([Protocol Guild](https://protocol-guild.readthedocs.io/en/latest/01-membership.html)). Both encode the rule the Toolkit states plainly: a layer should not quietly absorb the function of another unless the interface is explicit.

## Succession is the whole point

A role you cannot hand off is not a role, it is a hostage situation. The test of every role above is simple: if the person holding it vanished tomorrow, could someone else pick it up from what is written down?

The Regen Toolkit's Implementation and Learning Memory layer exists partly for this reason: it records "what worked, what failed, what adapted" so knowledge of how the commons actually runs lives in the commons, not in one founder's head ([Regen Toolkit, Layer 8](https://regen-toolkit-site.vercel.app)). Your `GOVERNANCE.md`, your CODEOWNERS file, and your onboarding pages are that memory in practice. Write the handoff before you need it, while the person who knows the job is still around to write it well.

## Try This

> **Start here:** Open your commons' history and compute your Contributor Absence Factor by hand. Sort contributors by volume, add until you cross 50% of total contributions, count the people. If it is 1 or 2, you now know your most urgent risk by name.
>
> **Go deeper:** Add a `GOVERNANCE.md` to your repo listing the five roles (Editor, Curator, Facilitator, Maintainer, Onboarder), who holds each today, and one sentence on how each gets handed off. Then add a `CODEOWNERS` file routing your two highest-risk content areas to their Editors and turn on required code-owner review.
>
> **Stretch:** Install the all-contributors bot, backfill recognition for everyone who has done non-code work, and run a real handoff drill: pick one role, have its holder document it for a day, then have someone else operate it from the docs alone while the holder stays silent. Whatever breaks is your real succession gap.

## References

- [CHAOSS — Contributor Absence Factor](https://chaoss.community/kb/metric-contributor-absence-factor/) — the Linux Foundation metric (formerly Bus Factor) for measuring how few people do half the work.
- [GitHub Docs — About code owners](https://docs.github.com/articles/about-code-owners) — official spec for the CODEOWNERS file that auto-requests the right reviewer.
- [all-contributors](https://github.com/all-contributors/all-contributors) — bot and specification for recognizing non-code contributions like docs, review, and mentoring.
- [Ben Balter — Five practical tips for governing your open source project](https://ben.balter.com/2021/06/14/open-source-governance/) — graduated permissions (triage vs maintainer) and documenting governance.
- [Gravity DAO](https://gravitydao.org/) — conflict-management and trust-creation collective from the Token Engineering Commons; model for the Facilitator role.
- [Wikimedia Stewards](https://meta.wikimedia.org/wiki/Stewards) — globally elected stewardship role with explicit conflict-of-interest guardrails.
- [Protocol Guild — Membership](https://protocol-guild.readthedocs.io/en/latest/01-membership.html) — onchain registry funding 180+ Ethereum core maintainers while separating funding from decision power.
