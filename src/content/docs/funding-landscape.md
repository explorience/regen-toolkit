---
title: "The Funding Landscape"
description: "A map of web3 and ReFi-native funding mechanisms for local node builders: how each works, what signals legitimacy, and where the traps are."
---

# The Funding Landscape

Your node is forming. People are showing up, the work is real, and then someone asks the question that empties the room: *how do we pay for any of this?* You have heard of Gitcoin and RetroPGF, maybe hypercerts, but they blur into one noisy pile of acronyms. This is the map.

This is the overview, not the manual. Each mechanism below has its own deep-dive elsewhere in the toolkit; here you get the lay of the land, enough to know which paths fit your node and which ones will quietly eat your weekends. If you are still at the "free tools and member contributions" stage, start with [Funding Your Local Node](/funding-your-node/) first. This piece assumes you are ready to look at the on-chain mechanisms.

## Two families: before and after

Almost every web3 funding mechanism falls into one of two families, divided by *when* the money arrives relative to the work.

**Prospective funding** pays for work *before* it happens. You describe what you plan to do, and money arrives to make it possible. Grants and quadratic funding live here.

**Retrospective funding** rewards work *after* its impact is shown. You do the thing first, then funders look back and pay for what actually mattered. Optimism's Retro Funding and hypercerts live here.

The logic behind retrospective funding is plain: outcomes are easier to judge than predictions, so it is easier to reward a project that has already been useful than to bet on an untested one. That single distinction organises everything else. Prospective money helps you start; retrospective money rewards you for finishing. Most healthy nodes end up using both.

## Quadratic funding: breadth beats wealth

**Quadratic funding (QF)** is crowdfunding with a matching pool, where your match grows with the *number* of distinct backers rather than the dollars they give. A hundred people giving $1 each pulls a far larger match than one person giving $100. It runs on the Constrained Liberal Radicalism algorithm, proposed in a 2018 paper by Vitalik Buterin, Zoë Hitzig, and E. Glen Weyl.

Think of it as a vote you cast with a small donation. The whole point, in Gitcoin's words, is that funding outcomes favour "broad participation over concentrated spending." For a local node, that is exactly the signal you want: it measures whether real people care, not whether one whale does.

**Gitcoin Grants** is the largest QF program: more than $60 million distributed to thousands of public-goods projects, with matching pools of roughly $3 million per quarter, rounds each September, December, March, and June, and a donor minimum as low as $1. **Giveth** also runs QF rounds, with zero platform fee on donations as its core differentiator.

> 🔧 **For Practitioners:** Your QF result is mostly decided *before* the round opens. The match rewards unique contributors, so the node with 200 warm community members who will each chip in $5 beats the node with a better project and no list. Build that list now. Treat a QF round as a turnout exercise, not a grant application.

## Retroactive funding: reward what already worked

**Retroactive Public Goods Funding (RetroPGF, now "Retro Funding")** flips the timing. Instead of pitching a plan, you ship the work, and a later round looks back and pays the projects that proved useful. The **Optimism Collective** runs the largest version: 850 million OP tokens, 20% of total supply, reserved for public goods, with over 60 million OP already distributed to hundreds of projects and contributors across rounds since 2021.

For a node, retro funding is both a relief and a risk. The relief: no proposal-writing theatre, no promising outcomes you cannot guarantee. The risk: you fund yourself out of pocket first and hope a future round notices you. It rewards track records, so it suits nodes already producing visible, attributable work, not brand-new ones.

## Hypercerts: the receipt for impact

How does a retro round *know* what you did? That is the gap **hypercerts** fill. A hypercert is a structured, verifiable record of a piece of impact work: it captures who contributed, what they did, over what time period, and in what scope, along with measurements and supporting evidence. Independent evaluators add their assessments, and funders read the record to decide what to reward. The standard can be tokenized on-chain so funders can buy and hold fractions of a claim, and that on-chain tokenization is part of the design.

If retro funding is the cheque, a hypercert is the receipt that makes the cheque legible. The **Hypercerts Foundation** maintains the standard, and real adopters include Gitcoin, Protocol Labs, and Funding the Commons. For a node doing measurable on-the-ground work, such as trees planted or waste collected, a hypercert turns that work into something a future funder can actually point at and pay for.

## Direct grants: the workhorse

For all the cleverness above, the most common path is still the plainest. **Direct grants** are application-based capital from protocol treasuries, such as Optimism, Arbitrum, and Celo, and from ReFi-aligned DAOs. Lowest learning curve, most familiar shape: you apply, you report, you deliver.

This is where most local nodes actually get their first money. **ReFi DAO** distributed over $236,000 to grassroots communities, including its Local Nodes, through 2024 funding rounds, and ran a Local Node Incubator that put more than 100 participants through a 13-session program. Real nodes funded and supported this way include **ReFi Costa Rica** (its "Crypto Cantinas" equip communities with the tools to join the ReFi movement), **ReFi Lagos** (reforestation and "Project Osisi," a tool for tracking regenerative activity transparently), **ReFi Barcelona** (built on a cooperative structure), **ReFi Tanzania** (tackling urban waste), and **ReFi Sicilia** (reforestation).

## Streaming and recurring: the cure for feast-or-famine

Here is the pattern that speaks directly to burnout. Lumpy competitive rounds force you into a cycle of frantic applications followed by months of silence. **Streaming and recurring funding** replaces that with a steady drip. Streaming QF (Gitcoin and Geo Web, via Superfluid) matches donations in real time at a flow-rate; recurring donations (Giveth, also via Superfluid) give builders a predictable monthly amount instead of a one-off lump.

ReFi DAO names the underlying problem plainly: "Maintaining long-term engagement among contributors is a shared difficulty, as many nodes operate without sufficient funding to fully compensate their teams." A predictable monthly stream, even a modest one, keeps people from drifting away between rounds. If burnout is your fear, this family is the antidote, and the deeper playbook lives in [Building a Sustainable Funding Mix](/sustainable-funding-mix/).

## Yield-based funding: give the harvest, keep the tree

The most structurally sustainable pattern gives away returns rather than principal. **Yield-based ("evergreen") funding** invests a pool and donates only what it earns. **Octant**, run by the Golem Foundation, staked 100,000 ETH and directs the bulk of each epoch's staking yield to public goods: over 2,340 ETH to more than 80 projects across its first eight epochs, and now into its ninth (the "Ethereum Stories" cohort) as of early 2026. **Glo Dollar's** AutoPGF routes the investment revenue from its stablecoin reserves to causes.

The gardening logic: you keep the tree and give away the fruit, year after year. For a node that can build even a small endowment, this turns one-time capital into a renewable stream. It is the long game, not the starting move.

## Conviction voting: slow, steady signal

**Conviction voting** lets community members continuously stake governance tokens behind the projects they back. The longer and larger the stake, the stronger the signal, and because conviction builds over time, it resists the snapshot gaming that catches other mechanisms. **1Hive** pioneered it, and Gitcoin used it as one of the mechanisms inside GG24.

## The pitfall you most need to hear

Your fear of central overreach is well founded, and quadratic funding is where it bites hardest. QF is structurally vulnerable to **Sybil attacks** (one person creating many fake identities to fake "breadth") and **collusion** (real users secretly coordinating to game the match). Gitcoin's early rounds saw enough of both to force a pivot toward identity verification, most visibly **Gitcoin Passport** (now Human Passport), an aggregator that scores how likely each donor is to be a real, unique person. That scoring cut Sybil influence by roughly 90%, but it also introduced acknowledged points of centralisation, including a reliance on Gitcoin's own identity tooling.

That is the trade you cannot escape: every fix for Sybil resistance trades away some decentralisation for integrity. Know which way you are trading before you run a round. The same caution applies to newer mechanisms. Glo Dollar's AutoPGF, for instance, "poses some centralization and speculation risks," in the words of the Decentralization Research Centre.

And the deeper structural pitfall, the one that distorts missions, is simpler still: grant money is lumpy, and it carries expectations. As [Funding Your Local Node](/funding-your-node/) puts it, "external funding often means external priorities entering your community space." The defence is not to avoid funding. It is to blend it, so no single funder sets your direction.

The whole landscape is converging on that point. GG24 (October–November 2025) distributed over $1.8 million, roughly $1.175 million from Gitcoin plus about $632,500 from partners, using six funding mechanisms in a single cycle, because no one mechanism fits every kind of work. A diversified, blended mix is not just safer for your sanity; it is where the best-run rounds are already heading.

## Try This

> **Start here:** Pick one mechanism from each family, one prospective (a direct grant or QF round) and one retrospective (a hypercert for work you have already done). Write one sentence for each on whether your node could realistically use it this quarter.

> **Go deeper:** Build your contributor list before you need it. Set up a simple way to collect 50 community email addresses or wallet addresses. A QF round's outcome depends on turnout, so this list is your single highest-leverage funding asset.

> **Stretch:** Document your first completed piece of work as a hypercert. Define the scope of work, the scope of impact, and the time period, then add your evidence. You will turn invisible past effort into something a future retro round can actually reward.

## References

- [Gitcoin — Quadratic Funding](https://gitcoin.co/mechanisms/quadratic-funding) — how QF works, the CLR algorithm, and why breadth beats wealth.
- [Gitcoin — Quadratic Funding = Wisdom of the Crowds](https://www.gitcoin.co/blog/quadratic-funding) — cumulative totals, quarterly pool size, round cadence, and the $1 donor minimum.
- [Gitcoin — Retroactive Funding](https://gitcoin.co/mechanisms/retroactive-funding) — the "reward past usefulness" premise behind RetroPGF.
- [Gitcoin — GG24 / Gitcoin 3.0 case study](https://gitcoin.co/case-studies/gg24-first-funding-round-of-gitcoin-3-0) — the six-mechanism blended round and its $1.8M distribution.
- [Gitcoin — How to Attack and Defend Quadratic Funding](https://www.gitcoin.co/blog/how-to-attack-and-defend-quadratic-funding) — Sybil attacks and collusion, the core QF threat model.
- [Gitcoin — Sybil Resistance in Quadratic Funding](https://gitcoin.co/research/quadratic-funding-sybil-resistance) — Passport, cluster-matching, and the ~90% Sybil-influence reduction.
- [Optimism RetroPGF (via Gitcoin apps)](https://gitcoin.co/apps/optimism-retropgf) — the 850M OP reserve (20% of supply) and 60M+ OP distributed.
- [Hypercerts Documentation — What is a Hypercert](https://docs.hypercerts.org/core-concepts/what-is-hypercerts) — the impact-record primitive: contributors, scope, time, measurements, evaluators.
- [Protocol Labs — Hypercerts: a new primitive for public goods funding](https://www.protocol.ai/blog/hypercert-new-primitive/) — why hypercerts underpin retroactive funding (creators, funders, evaluators).
- [Giveth](https://giveth.io/) — zero-fee crypto donations, QF rounds, and recurring donation streams via Superfluid.
- [Octant (OAK Research)](https://oakresearch.io/en/reports/protocols/octant-decentralized-platform-financing-public-goods-golem-foundation-glm) — yield-funded public goods: the 100,000 ETH stake and the epoch/yield model.
- [Decentralization Research Centre — Public Goods Funding Beyond RetroPGF and QF](https://dcfoundation.io/public-goods-funding-beyond-retropgf-and-qf/) — streaming, conviction voting, and the Glo Dollar / AutoPGF centralization-risk note.
- [Crypto Altruism — Web3 PGF innovations infographic](https://www.cryptoaltruism.org/blog/infographic-web3-innovations-in-public-goods-funding) — a visual mechanism map of the landscape.
- [ReFi DAO — Local Nodes Showcase 2024](https://blog.refidao.com/refi-local-nodes-showcase-2024/) — named nodes, the $236K distributed, the incubator, and the funding/burnout lessons.
- [Onchain Magazine — Best Web3 Grants 2025](https://onchain.org/magazine/best-grants-for-web3-founders-projects-in-2025/) — a survey of direct grant programs across ecosystems.
- [ReFi DAO Local ReFi Toolkit](https://refidao.github.io/local-refi-toolkit/) — the node-builder's operational toolkit and regional case studies.
- [Ethereum Localism](https://greenpill.network/pdf/ethereum-localism.pdf) — the place-based framing behind local-node funding.
- [Mechanism Institute Library](https://mechanism.institute/library) — reference library on funding and governance mechanisms.
