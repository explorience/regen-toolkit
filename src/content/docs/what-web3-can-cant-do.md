---
title: "What Web3 Can and Can't Do"
description: "A plain-language honest look at where blockchain genuinely helps community and regenerative work, and where it just adds cost and risk."
---

# What Web3 Can and Can't Do

Someone at your last organising meeting said the project should "put it on the blockchain," and the room nodded like that settled something. You weren't sure whether to be excited or to quietly leave. Was that a real answer, or just a buzzword wearing a lab coat?

This is the article that answers that honestly. **Web3** is shorthand for a wave of internet tools built on **blockchains**: shared digital record-books that thousands of independent computers keep at once, so no single company owns the copy or can quietly edit it. That design is genuinely useful for a few specific jobs. For most jobs, a normal website or spreadsheet is still the right tool. Knowing the difference saves you money, time, and the embarrassment of building something nobody needed.

Think of it like choosing between a community seed library and a bank vault. The vault is brilliant for the rare thing that must be tamper-proof and shared. You would not store your whole garden in it.

## What Web3 Genuinely Does Well

### It moves value across borders without a gatekeeper

You can send money or digital tokens to anyone, anywhere, at any hour, without a bank or a service like Western Union deciding whether you are allowed. A **token** is just a digital unit of value recorded on a blockchain, the way a poker chip stands in for cash at a table.

This is not theoretical. **Grassroots Economics**, a Kenyan nonprofit, runs **Sarafu**, a community currency that over 50,000 people have used to trade food, goods, and services in places where regular cash and banking are scarce. It works on basic phones over USSD (the same dial-a-code menus used for mobile money like M-Pesa), and the transaction record lives on a public blockchain so the community, not a bank, governs it. For mutual-aid networks and local economies, that is a real capability that ordinary banking cannot match.

### It lets anyone build without asking permission

Public blockchains are open. No app store reviews your project for 30 days, no platform takes a 30% cut, no central authority can say "no" to your face. A developer in Nairobi can launch a tool that someone in Buenos Aires uses an hour later, with no corporation in between.

For regen work in regions where the financial system is broken or exclusionary, that open door matters. It is the same spirit as a community kitchen that anyone can cook in, rather than a franchise that must approve your recipe.

### It makes certain records public and hard to fake

Every transaction on a public blockchain is visible and permanent. Anyone can check it, and no one can quietly delete it later. For work that runs on trust, that is powerful:

- **Donations:** a backer can see that the money actually moved to the project's wallet.
- **Shared funds:** your collective's treasury balance is checkable by every member, not just the treasurer.
- **Governance:** when a group votes on-chain, everyone can see the count was honest.

> 💡 **Going deeper:** This is why people get excited about **DAOs** (decentralised autonomous organisations: groups that coordinate money and decisions through shared on-chain rules instead of a single boss) and **DeFi** (decentralised finance: lending, saving, and trading run by open code rather than a bank). Both lean entirely on this public, tamper-resistant record.

### It is hard to censor or shut down

Once information is on a public blockchain, no single government or company can easily erase it. A community's funding history and records can survive even if a hostile authority would rather they vanished. Your work persists.

## What Web3 Cannot Do (At Least Not Yet)

This is the part the hype skips, and the part that protects you from wasting a year.

### It cannot handle huge volumes cheaply on the main chain

Bitcoin's main network settles only about 7 transactions per second, and Ethereum's base layer manages roughly 15 to 30. Visa's network, by comparison, is built to handle tens of thousands per second. You cannot run a global video platform or a busy social app directly on a main blockchain.

The honest update: newer **Layer 2** networks (faster lanes built on top of Ethereum, like Base, Arbitrum, and Optimism) now push fees to a cent or less and handle far more traffic, especially since Ethereum's 2024 Dencun upgrade. That makes small community payments practical. It still does not make blockchains a good home for streaming video or storing thousands of photos.

### It cannot replace your spreadsheet or your normal database

Most information simply does not need a blockchain. Your member list, your event photos, your meeting notes, your email all work better in ordinary tools that are cheaper, faster, and private by default. Putting them on-chain adds cost and complexity for no benefit.

A blunt rule of thumb: only reach for a blockchain when multiple parties who don't fully trust each other need to share one record that none of them can secretly change. Otherwise a shared spreadsheet wins.

### It cannot verify the real world for you

A blockchain can prove a token moved. It cannot prove a tree was actually planted, a house was legally signed over, or a tonne of carbon was genuinely removed. The chain only knows what someone told it.

The clearest cautionary tale is carbon credits. **Toucan Protocol** moved carbon credits onto the blockchain so they could be traded openly. But in May 2022, **Verra**, the world's largest carbon-credit registry, ruled that the specific credits being used (already-retired ones) should not be tokenised that way, and blocked the practice. The code worked perfectly. The off-chain reality and the rules around it did not cooperate. Tools called **oracles** (services that feed outside data to a blockchain) help bridge this gap, but someone still has to be trusted to report the truth in the first place.

### It cannot keep your activity private by default

Public blockchains are public. Anyone can see the amounts and the wallet addresses involved. Your name is not attached automatically, but with enough analysis, addresses can often be linked back to real people. For sensitive work like refugee aid, health data, or the locations of endangered species, that exposure is a serious risk. Privacy tools are improving, but "private by default" is not how these systems work.

## A Quick Cheat Sheet

- **Good fit:** sending value across borders, a shared treasury everyone can audit, transparent on-chain voting, a local community currency, proving a donation moved.
- **Bad fit:** storing photos or videos, running a real-time chat or game, holding private personal data, or anything a trusted spreadsheet already does fine.

You don't have to be for or against Web3. You just have to match the tool to the task. It is good at moving value, coordinating in the open, and keeping shared records nobody can fake. It is poor at storage, speed, and privacy. The strongest regen projects use it exactly where it helps and reach for ordinary tools everywhere else, the same way you would not use a chainsaw to prune a seedling.

## Try This

> **Start here:** Pick one thing your group wants to "put on the blockchain." Ask the single screening question: *do multiple parties who don't fully trust each other need to share one record none of them can secretly change?* If the answer is no, you have just saved yourself months. Write down your answer.
>
> **Go deeper:** Visit a free block explorer like [Etherscan](https://etherscan.io) and look up any public wallet or transaction. Seeing real, live, public records makes "transparent and permanent" concrete, and it shows you exactly how little privacy a public chain offers.
>
> **Stretch:** Take a real project you care about (a reforestation fund, a mutual-aid pool, a local currency) and write a one-page "right tool" plan. List what truly belongs on-chain, what stays in normal tools, and where you would need an oracle or a human to verify real-world facts. Share it with your group and let them poke holes in it.

## References

- [Grassroots Economics: Sarafu Network](https://www.grassrootseconomics.org/sarafu-network) - The Kenyan community-currency project, showing real blockchain use for local economies.
- [ethereum.org: Scaling](https://ethereum.org/developers/docs/scaling/) - Plain explanation of Layer 2 networks and why they exist.
- [Toucan: Response to Verra's announcement](https://blog.toucan.earth/response-to-verras-announcement/) - Toucan's own account of Verra's May 2022 decision to halt tokenisation of retired carbon credits, a clear case of on-chain code meeting off-chain rules.
- [ethereum.org: Oracles](https://ethereum.org/developers/docs/oracles/) - What oracles are and why the "trust the bridge to the real world" problem is hard.
- [Etherscan](https://etherscan.io) - A public block explorer for seeing exactly how visible and permanent on-chain records are.
