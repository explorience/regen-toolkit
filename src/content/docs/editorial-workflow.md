---
title: "An Editorial Workflow Your Commons Won't Outgrow"
description: "How a small team can move knowledge from rough draft to trusted, maintained page, with real tools and a review process that survives turnover."
---

# An Editorial Workflow Your Commons Won't Outgrow

Someone on your team writes a brilliant explainer in a Google Doc. Six months later they leave, three people have edited it, nobody knows if it's still accurate, and a newcomer copies the outdated version into a grant application. That's not a writing problem. It's a missing editorial workflow.

An **editorial workflow** is the agreed path a piece of knowledge travels from "rough idea" to "trusted, published, maintained page": who drafts it, who checks it, how it gets marked as ready, and who keeps it alive after that. Your commons needs one for the same reason it needs version control, so that quality and trust don't depend on any single person still being around.

This guide gives you a concrete, opinionated workflow built from how working knowledge teams actually operate. You don't need to be an ontologist. If you can use Google Docs and have seen a GitHub pull request, you have enough.

## Name the stages before you name the tools

The most common mistake is jumping straight to "what platform should we use." Decide the stages first. A workflow that survives turnover usually has five.

- **Draft**: someone writes a first version. Messy is fine.
- **Review**: someone other than the author reads it for accuracy and clarity.
- **Approve**: a person with the authority to do so marks it ready.
- **Publish**: it goes live where readers can find it.
- **Maintain**: it gets revisited on a schedule, updated, or retired.

The Regen Knowledge Commons reference docs make a sharp point here: *polished writing is not automatically reviewed knowledge.* A well-written page can still be wrong. The whole purpose of the Review and Approve stages is to keep "reads nicely" and "has been checked" as separate facts.

Each stage answers a different question. Draft asks "what do we want to say?" Review asks "is it true and clear?" Approve asks "do we stand behind it?" Maintain asks "is it still true?" Skip any one and you get the Google Doc failure above.

## Make the trust state visible on every page

Here's the single highest-leverage habit: every page should wear its **maturity** (its trust state) out loud. A reader should never have to guess whether a page is a half-finished sketch or vetted, sign-off material.

The Regen reference docs treat this as a core principle: maturity and review state are tracked explicitly, and review should scale with risk. A glossary tweak needs a glance. A claim about a funding mechanism or an ecological outcome needs real scrutiny, because someone might act on it.

Two proven ways to show state:

- **Status field in frontmatter.** This site uses a `status` field (`placeholder`, `drafting`, `review`, `published`) at the top of each file. It's boring and it works. The state lives with the content and travels with it.
- **Digital-garden growth labels.** Many public knowledge gardens mark notes as 🌱 seedling (rough), 🌿 budding (developing), or 🌳 evergreen (stable and maintained), a convention popularized by writers like Maggie Appleton. It's the same idea in friendlier language.

Pick one vocabulary and use it everywhere. The point isn't the emoji; it's that "this is unreviewed" is never a secret.

## Keep claims and evidence in separate boxes

A knowledge commons lives or dies on whether people can trust it later. The discipline that makes that possible is simple to say and hard to skip: **separate the claim from the evidence.**

The Regen docs call this claim-evidence discipline: keep the assertion, the source for it, your interpretation, and your uncertainty as distinct things. In practice this means every factual claim carries an inline source, and your reviewer can actually check it.

Wikipedia's Good Article process is the clearest real-world model. To pass, an article must cite reliable sources inline for anything that could reasonably be challenged, and the reviewer does a **spot-check**: they sample the citations and confirm each source actually supports the sentence it's attached to [Wikipedia GA]. That spot-check is the part most teams skip, and it's exactly the part that catches the confident-but-wrong claim.

Build it into your Review stage. A reviewer's job isn't to admire the prose. It's to pull three citations and verify they say what the page claims they say.

## Use pull requests as the review container, even for non-coders

You need a place where a proposed change sits *next to* the current version, gets discussed, and only goes live once someone approves. In software this is the **pull request** (a proposal to merge changes, with a diff and a comment thread). It's the best editorial container ever built, and you don't have to be an engineer to use it.

If your content lives in a GitHub repo (this toolkit does: Markdown files in Git), you get review for free:

- A **CODEOWNERS** file maps file paths to the people responsible for them, so the right reviewer is requested automatically when a matching file changes. You can require a code owner's approval before anything merges [GitHub Docs].
- The diff view shows exactly what changed, and the comment thread keeps the reasoning attached to the change forever.

Worried this is too technical for the non-writers whose sign-off you need? Tools have solved this. **GitBook's** "change request" workflow mirrors a pull request but gives reviewers a visual review link, so a program lead or legal reviewer can approve without ever touching Git [GitBook Docs]. The container is the same; the door is friendlier.

> 💡 **Going Deeper:** Add **Vale**, an open-source prose linter, as a GitHub Action. It checks every pull request against your style rules (banned hype words, heading conventions, terminology) and posts inline comments on the changed lines before a human even looks [Vale]. It lets contributors fix their own style issues, so human review time goes to accuracy, not nitpicks.

## Sort pages by type so reviewers know what "good" means

A reviewer can't judge a page until they know what kind of page it's trying to be. The **Diátaxis** framework, by Daniele Procida, splits documentation into four types: tutorials (learning by doing), how-to guides (solving a real task), reference (dry, accurate facts), and explanation (understanding) [Diátaxis]. Mixing them is the most common cause of confusing docs.

This maps neatly onto a commons. The Regen Encyclopedia layer already distinguishes concept pages, framework pages, comparison pages, guides, glossary entries, and anti-pattern explainers. Tag each page with its type, and your Review stage gets sharper: you review a how-to for "can someone follow this and succeed?" and a reference page for "is every fact exactly right?" Different questions, different rigor.

## Maintenance is a stage, not an afterthought

Most teams nail Draft through Publish and then let everything rot. The Regen docs are blunt about why this matters: a knowledge base disconnected from reality becomes a theory archive. Pages need to stay accountable to what's actually true and useful.

Make maintenance a real, owned activity:

- **Assign an owner per area**, not per page. One person makes sure the system stays healthy; they don't write everything.
- **Set a review-by date** in each page's metadata. When it lapses, the page's trust state drops back to "needs review", ideally in a query you can run, not just in someone's head.
- **Compost, don't delete.** The Regen principles call for preserving outdated material without confusing readers: archive it with a clear label rather than leaving a stale page masquerading as current.

## Disagreement is part of the workflow, not a failure of it

A real editorial process will surface conflict: two contributors disagree on a claim, or a reviewer rejects a page the author loves. That's not the system breaking. That's the system doing its job.

How you handle that disagreement *is* trust infrastructure. **GravityDAO**, which grew out of the Token Engineering Commons, argues that smart contracts alone can't build healthy communities: you also need ways to process conflict, and they lean on nonviolent communication, describing experiences and needs without assigning blame [GravityDAO]. Bring that posture into reviews. Comment on the claim, not the person. The goal is a more trustworthy page, and everyone is on the same side of that.

## Try This

> **Start here:** Open your three most-used documents and add one line at the top of each: a status (`draft`, `reviewed`, or `published`) and a "last checked" date. You've just made trust state visible, the single highest-leverage habit, in under ten minutes.

> **Go deeper:** Move one document into a GitHub repository as a Markdown file. Add a `.github/CODEOWNERS` file naming yourself as owner, then make an edit through a pull request and approve it. You now have a working review container with a permanent record of who changed what and why.

> **Stretch:** Define your five-stage workflow on a single page, pick a status vocabulary, and add a **Vale** GitHub Action plus a Diátaxis page-type tag to your frontmatter. Then run your next ten contributions through it and tune the friction. You'll have a workflow that holds even when half the team turns over.

## References

- [Wikipedia: Good Article criteria](https://en.wikipedia.org/wiki/Wikipedia:Good_article_criteria), a battle-tested editorial review standard, including the reviewer source spot-check.
- [GitHub Docs: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), how CODEOWNERS auto-assigns reviewers and enforces required approval.
- [GitBook: Change requests](https://gitbook.com/docs/collaboration/change-requests), pull-request-style review with visual links for non-technical reviewers.
- [Vale](https://vale.sh/docs), open-source prose linter that enforces a style guide on every pull request.
- [Diátaxis](https://diataxis.fr/), the four-type documentation framework (tutorial, how-to, reference, explanation).
- [GravityDAO: Conflict management and trust creation in Web3](https://gravitydao.medium.com/gravity-conflict-management-and-trust-creation-in-web3-3afa66e43707), why processing disagreement well is core community infrastructure.
- [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/), a real ReFi knowledge commons (Astro, GitHub-backed) organized by content type.
