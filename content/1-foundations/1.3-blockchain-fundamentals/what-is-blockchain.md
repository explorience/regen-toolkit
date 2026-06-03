---
title: "What Is a Blockchain?"
description: "A plain-language, no-hype introduction to blockchains for community organisers and growers new to crypto, with real regenerative examples and an honest look at the costs."
---

# What Is a Blockchain?

You run a seed swap. Somebody brought twenty tomato seedlings in spring, someone else owes them a share of the autumn harvest, and by the time the squash comes in, nobody can agree on who promised what. There's one shared notebook, and whoever holds it gets to decide what's true.

A blockchain is what you'd get if every family kept their own copy of that notebook, and you all agreed to keep them in sync. That's the whole idea. The rest is detail.

## A Notebook the Whole Village Keeps

Picture your community's record kept the old way: one trusted person writes everything down. That works until they lose the book, make an honest mistake, or quietly cross out a line. Everyone has to trust that one person completely.

Now flip it. Every household keeps its own copy. When Maria gives Jamal her seedlings, she says so out loud, and every family writes it in their book. Once a week you compare notes. If most books agree, that's the official record.

That shared, copied-everywhere record is a **blockchain**: a digital notebook that many computers keep identical copies of. The computers holding those copies are called **nodes**, and they're scattered across the world. They're run by volunteers, companies, and enthusiasts, paid in the network's own currency for the electricity and effort. You don't have to run one. Almost nobody does. You just use the network the way you use email without running a mail server.

## Pages That Lock to Each Other

Each page of the village notebook is a **block**: one batch of records, like a week of swaps bundled together.

Here's the clever bit. Every new page carries a short summary of the page before it, called a **hash**: a fingerprint of the previous block's exact contents, produced by a fixed mathematical recipe. Change a single comma on an old page and its fingerprint changes completely, so the next page's "previous-page summary" no longer matches. The mismatch is glaring, and every node spots it at once.

That's why people call blockchains **immutable**: once a record is settled and buried under newer blocks, rewriting it would mean redoing every page since and persuading the majority of nodes worldwide to accept your version simultaneously. Not impossible in theory; wildly impractical in practice. The history holds.

## Trust You Don't Have to Extend

You'll hear blockchains called **trustless**, which sounds cold. It means the opposite of what it sounds like. You don't have to *place your trust* in any single keeper, because everyone can check everyone else.

This quietly solves an old problem: **double-spending**, the digital version of promising the same thing twice. In the garden, that's Maria pledging her one batch of seedlings to both Jamal *and* Carlos. With one notebook she might get away with it. With everyone holding a copy, the second promise contradicts the first the moment she makes it, and the network simply refuses to write it down. No referee needed; the records referee themselves.

## What This Looks Like in Real Communities

This isn't only theory or speculation. Communities use it now.

**Grassroots Economics** runs the Sarafu Network in Kenya: local "community asset vouchers" that let people trade goods and services even when national-currency cash is scarce. It runs on the Celo blockchain, and crucially, people join over basic feature phones using simple text-message codes, no smartphone or internet plan required. The network reports more than 26,000 people across roughly 290 communities (as of early 2026).

**Regen Network** pays farmers for measurable ecological work, like restored soil or biodiversity, by recording verified ecological data on a blockchain and issuing credits buyers can purchase. The shared, checkable record is what lets a buyer half a world away trust that the regeneration actually happened.

For comparison, large companies use the same idea privately. **Walmart** traces leafy greens through **Hyperledger Fabric** (an enterprise blockchain framework now stewarded by the Linux Foundation's Decentralized Trust group) so a contamination scare can be tracked to its source in seconds instead of days.

## The Honest Part: Costs, Limits, Energy

Here's what the hype usually skips.

**Energy.** The fear is real but out of date for most of the space. **Bitcoin** still secures itself by burning electricity on purpose, a method called **proof of work**, using roughly 138 terawatt-hours a year (Cambridge, 2025), comparable to a mid-sized country. But in September 2022, **Ethereum**, the network behind most regenerative projects, switched to **proof of stake**, which secures the chain through deposited funds rather than raw computing, and cut its energy use by about 99.95% overnight. Celo, where Sarafu lives, is also proof of stake. So "blockchain wastes energy" is true of old Bitcoin and false of nearly everything a regenerative community would actually use.

**It's permanent, which cuts both ways.** Immutability is great for trust and unforgiving for mistakes. A wrong entry or a payment sent to the wrong address usually can't be undone. Many public chains are also fully visible, so think before putting sensitive community information on one.

**It doesn't resolve disagreement.** A blockchain records what was agreed; it doesn't help you agree. The hard human work of facilitation, conflict, and care still belongs to you.

A blockchain is a shared, tamper-evident notebook that many people keep in sync, so a group can keep honest records without crowning one keeper. It started with digital money. It's growing into tools that help communities trade, fund regeneration, and prove what they've done, without expensive middlemen. Whether it fits *your* work is a question worth asking slowly, and the rest of this toolkit is built to help you answer it.

## Try This

> **Start here:** Tell the village-notebook story out loud to one person, in your own words, until it flows. If you can explain it over tea, you understand it, and you've inoculated yourself against anyone who tries to dazzle you with jargon.
>
> **Go deeper:** Take the free, no-wallet-required "Blockchain Basics" lesson on [Bankless Academy](https://app.banklessacademy.com/lessons). It's interactive and costs nothing. Notice which words finally click and which still feel slippery.
>
> **Stretch:** Open a public block explorer like [Etherscan](https://etherscan.io) and watch real transactions arrive live. Then read how [Grassroots Economics](https://www.grassrootseconomics.org/pages/sarafu-network) structures its community vouchers, and write one paragraph on whether a shared record could help a specific record-keeping headache in your own community, and where it plainly wouldn't.

## References

- [Bankless Academy](https://app.banklessacademy.com/) — Free, open-source, interactive Web3 lessons for beginners; no wallet needed to start.
- [Ledger Academy: What Is Blockchain?](https://www.ledger.com/academy/what-is-blockchain) — Clear beginner explainer of blocks, hashes, and nodes.
- [Grassroots Economics: Sarafu Network](https://www.grassrootseconomics.org/pages/sarafu-network) — Live community-currency network in Kenya; usage figures and how feature-phone access works.
- [Regen Network](https://www.regen.network/) — Blockchain platform issuing science-backed ecological credits that pay for regenerative land work.
- [Ethereum.org: The Merge](https://ethereum.org/roadmap/merge/) — Official account of Ethereum's 2022 switch to proof of stake and the ~99.95% energy drop.
- [Cambridge Bitcoin Electricity Consumption Index](https://ccaf.io/cbnsi/cbeci) — Independent, regularly updated estimate of Bitcoin's proof-of-work energy use, maintained by the University of Cambridge.
- [LF Decentralized Trust: Walmart case study](https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study) — How Walmart traces food on Hyperledger Fabric.
