---
title: "Gitcoin Grants and Quadratic Funding"
description: "How quadratic funding distributes a matching pool by counting people, not dollars, and how to run a round for your local node without burning out."
---

# Gitcoin Grants and Quadratic Funding

You've got a community garden, a reforestation crew, or a local repair café, and you need a few thousand dollars to keep it going. One wealthy backer could write the cheque, but then you're beholden to one person's whims. What if 300 neighbours each giving $5 could unlock far more than $1,500?

That is exactly what quadratic funding is built to do. This article explains the mechanism, shows you a real regen round that used it, and gives you a path to running one for your own node without setting yourself on fire.

## What quadratic funding actually is

**Quadratic funding (QF)** is a way to split a shared pot of money — a **matching pool** — across many projects based on *how many people* back each project, not how much each person gives. The number of contributors matters more than the size of any single contribution.

The mechanism comes from a 2018 paper, "Liberal Radicalism," by Vitalik Buterin, Zoë Hitzig, and Glen Weyl. The idea: democratic communities systematically underfund shared goods because no single person captures the full benefit. QF corrects for that by amplifying broad support.

Here is the formula in one line. For each project, take the square root of every individual donation, add those roots together, then square the total. That squared number is the project's share of the matching pool.

## Why the math rewards breadth, not whales

Run two projects through the formula and the design becomes obvious.

Project A gets 100 people giving $1 each. The square root of $1 is 1, summed 100 times is 100, squared is **10,000**.

Project B gets one person giving $100. The square root of $100 is 10, summed once is 10, squared is **100**.

Both raised $100 in direct donations. But Project A's matching weight is 100 times larger, because 100 people chose to back it. The square root step shrinks the influence of any one big cheque; the squaring step restores scale only when many people show up. Small donations from many people beat large donations from few — which is the whole point for public goods that lots of people quietly rely on.

For you as an organiser, the strategic lesson is blunt: your job before a round is to grow the *number* of supporters who will donate, even $1, not to chase one big donor.

## A real regen round you can study

In GG24 — the round Gitcoin ran from October 14–28, 2025, as the first round of its "Gitcoin 3.0" relaunch — there was a **Bioregional Reforestation Round** with a $100,000 matching pool spread across nine bioregions, including Nigeria, Kenya/Uganda, Cascadia, and the Mediterranean Coast. Roughly 1,286 unique donors made about 3,042 donations through QF, and co-funders topping up the pool included CeloPG, the Ethereum Foundation, the Climate Coordination Network, and the BioFi Project.

This matters for you because it's proof QF already routes real money to on-the-ground regenerative work, not just to crypto infrastructure. Across its whole history, Gitcoin reports distributing over $60 million to more than 3,700 projects. A local node running tree-planting, food sovereignty, or watershed work is squarely the kind of public good QF was built to fund.

> 💡 **Going Deeper:** GG24 also marked a shift away from one-size-fits-all QF. It ran six mechanisms side by side — Quadratic Funding, Deep Funding, MACI private voting, Conviction Voting, Retroactive Funding, and peer-reviewed Hypercerts — across themed domains. QF is now one tool in a plural toolkit, not the only game in town.

## The sybil problem, and how rounds defend against it

QF's strength is also its weakness. If "more donors equals more match," then faking donors pays off. A **sybil attack** is one person spinning up many wallets to look like a crowd — say, 50 wallets each sending $1 to their own project to fabricate broad support.

Rounds defend against this in two main ways, and you should understand both before you run one.

First, **proof of personhood**. Gitcoin Passport — acquired by the Holonym Foundation in February 2025 and now called **Human Passport** — lets a donor collect verifiable credentials ("stamps") and build a score. A round can require a minimum score before a donation counts toward matching, raising the cost of faking a crowd.

Second, **post-round correction**. **Connection-Oriented Cluster Matching (COCM)** looks at how connected your donors are to each other. If a project's support comes from one tight cluster that always co-donates, COCM dials down its match; if support comes from genuinely diverse, unconnected people, the match holds. It treats overlapping social groups as a signal, not a crime, and corrects for the extra power that pre-existing coordination would otherwise buy.

> 🔧 **For Practitioners:** Don't promise applicants an exact payout before the round closes. Final allocations are adjusted by Passport eligibility and COCM after donations end, so the live "estimated match" number will move. Set that expectation up front to avoid angry messages later.

## Running your own round on Grants Stack

You don't have to wait for Gitcoin's flagship rounds. **Grants Stack** is Gitcoin's open tooling for running your own QF round end to end. The setup flow on Grants Stack runs roughly like this:

1. Pick the chain you'll run on, then create or select a **program** (the umbrella for your rounds).
2. Click create round and choose Quadratic Funding.
3. Set the basics: round name, a real support contact, application window, and donation window.
4. Choose your payout token (such as DAI or ETH, depending on the chain) and set the matching pool amount.
5. Optionally set a matching cap and a minimum donation, and optionally require Human Passport for donor eligibility.
6. Write clear eligibility rules and application questions, then launch with an on-chain transaction.

The hard part isn't the software. It's everything around it: raising a real matching pool, recruiting genuine projects, and — the part that decides whether QF works at all — getting enough real humans to donate during a short window.

## Protecting yourself from burnout

You came here worried about burnout and ineffective effort. Both are real risks with QF, so build in guardrails from day one.

Scope small. A first round with a $2,000–$5,000 pool and five to ten local projects teaches you more than an ambitious round you can't staff. Cap the matching pool to what you can actually raise and the time window to one to two weeks so the push has a clear end.

Recruit help before you launch, not during. Donations cluster in the final 48 hours, and chasing them alone is how organisers burn out. Spread the asks: each applicant rallies their own supporters, which is also what makes the QF math work.

Be honest that this is a coordination tool, not free money. QF rewards projects that already have community. If your node hasn't built relationships yet, fix that first — a round amplifies a community, it doesn't conjure one.

## Try This

> **Beginner:** Browse a live or recent round at [grants.gitcoin.co](https://grants.gitcoin.co/) and donate $1 to a project you believe in. Watch the estimated match move — you'll feel the mechanism better than any explanation can teach.
>
> **Intermediate:** Take ten imaginary projects with different donor counts and dollar totals, run each through the QF formula (sum the square roots, then square), and rank them by match. Seeing whales lose to crowds turns the concept into intuition.
>
> **Advanced:** Open Grants Stack on a testnet, configure a mock QF round with a small pool, a Human Passport threshold, and a one-week window, and walk three friends through donating. You'll surface every real-world friction — wallet setup, gas, Passport scores — before any real money is on the line.

## References

- [Quadratic Funding — Gitcoin](https://gitcoin.co/mechanisms/quadratic-funding) - the mechanism, the formula, and Gitcoin's cumulative distribution figures.
- [WTF is Quadratic Funding?](https://qf.gitcoin.co/) - plain-language explainer with an interactive calculator.
- [Liberal Radicalism: A Flexible Design for Philanthropic Matching Funds](https://www.microsoft.com/en-us/research/publication/liberal-radicalism-a-flexible-design-for-philanthropic-matching-funds/) - the original 2018 QF paper by Buterin, Hitzig, and Weyl.
- [Gitcoin Grants 24 (GG24)](https://gitcoin.co/campaigns/gitcoin-grants-24-gg24) - the 2025 "Gitcoin 3.0" round, its domains, and its six funding mechanisms.
- [Bioregional Reforestation Round](https://gov.gitcoin.co/t/bioregional-reforestation-round/24927) - a real regenerative QF round with a $100K pool across nine bioregions.
- [Leveling the Field: Connection-Oriented Cluster Matching](https://www.gitcoin.co/blog/leveling-the-field-how-connection-oriented-cluster-matching-strengthens-quadratic-funding) - how COCM defends QF against collusion.
- [Human Passport (formerly Gitcoin Passport)](https://human.tech/blog/from-gitcoin-passport-to-human-passport-we-re-now-part-of-human-tech) - the proof-of-personhood tool used for sybil resistance.
- [Set Up a Round on Grants Stack](https://roundoperations.gitcoin.co/round-operations/round-setup/setup-on-grants-stack) - step-by-step round operator documentation.
