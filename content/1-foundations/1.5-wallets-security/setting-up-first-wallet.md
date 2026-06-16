---
title: "Setting Up Your First Wallet"
description: "A calm, step-by-step guide to creating your first crypto wallet safely, written for community organisers and permaculturists who are brand new to crypto."
---

# Setting Up Your First Wallet

You've heard that a grant programme, a community fund, or a tree-planting project you admire "runs on-chain," and to take part you need a wallet. So you searched it, hit a wall of jargon and scam warnings, and quietly closed the tab. That hesitation is healthy. This guide walks you through setting one up the careful way, so you finish with a working wallet and the confidence that you didn't just hand your keys to a stranger.

A **crypto wallet** is a small app that lets you receive, hold, and send digital money and prove who you are online. It works like the key ring you use to get into the community garden: the wallet doesn't hold the soil, it holds the keys to your plot. Your funds live on a shared public ledger called a **blockchain** (think of a notebook every member can read but no single person can secretly rewrite). The wallet just holds your key to your row in it.

The single most useful thing to understand before you start: a wallet puts *you* in charge. There's no bank to phone if something goes wrong. That sounds scary, and the fear is reasonable, so this whole guide is built around making that responsibility small and manageable.

## Pick the right tool for a beginner

You don't need anything fancy. For your first wallet, use a **hot wallet** — a free app connected to the internet, like a trowel you keep by the back door because you reach for it daily. The most common one is **MetaMask** (a browser extension and phone app, used by tens of millions of people), but **Rainbow** and **Coinbase Wallet** are equally fine, friendly choices. They all do the same core job.

The other kind, a **cold wallet**, is a small physical device that stays offline, like seed stock you keep in a tin in the cellar for next season. Hardware wallets from **Ledger** (Nano S Plus, around $79) or **Trezor** (Safe 3, around $79) fall here. They're the right tool once you're holding meaningful money, but they're overkill for learning. Start with potted herbs before you fence the whole food forest.

This guide uses MetaMask because it's the most documented, but the steps map cleanly onto any of them.

## Get the real app, not a clone

The most common way newcomers lose money isn't hacking — it's downloading a fake. In April 2026, security researchers found 26 counterfeit wallet apps on the Apple App Store impersonating MetaMask, Ledger, Coinbase, and others, all built to steal your keys [HackerNews]. So before anything else:

- Type the official address yourself: **`metamask.io`**. Don't click a link from an email, a DM, an ad, or a search result you're unsure of.
- Download the browser extension only from that site, or the phone app only from the official listing linked there.
- Once installed, bookmark the real site so you never have to search again.

This one habit — go direct, never click — protects you from most scams you'll ever meet.

## Create the wallet, step by step

Open MetaMask and you'll see two paths. Take a breath; this takes about ten minutes.

1. **Click "Create a new wallet."** It may first ask whether to share anonymous usage data. Your choice — it doesn't affect safety.
2. **Choose how to secure it.** Since 2025, MetaMask offers two options [MetaMask-Social]:
   - **Secret Recovery Phrase** — the traditional route, where *you* hold the master backup. More on this below. This is the one to learn with.
   - **Social login** — sign in with a Google or Apple account and a password instead. Easier to start, but it leans on those accounts rather than teaching you key safety. Pick this only if a phrase feels too daunting today.
3. **Create a strong password.** This unlocks the app *on this device only* — it is not your master backup. Use something long and unique you've never used elsewhere.
4. **Reveal and write down your Secret Recovery Phrase.** This is the heart of the whole thing (next section).
5. **Pass the confirmation quiz.** MetaMask asks you to put a few words back in order, to prove you actually wrote them down. You did write them down, right?
6. **You're in.** You'll land on "Account 1" with a wallet address ready to use.

That's it. You now have a wallet.

## Your Secret Recovery Phrase: guard it like rare seed

When you set up, MetaMask shows you a **Secret Recovery Phrase** (also called a seed phrase or recovery phrase) — usually 12 plain English words like *garden, river, copper, lantern…* in a fixed order. This is the genetic code of your wallet. Anyone who has those words, in order, controls everything inside, from any device, forever. And if *you* lose them with no other access, the funds are gone — there is no reset link, no support line, no spare key under the mat.

So treat it exactly like the only viable seed of a rare heritage plant:

- **Write it on paper, by hand.** Never type it into a phone, a photo, a notes app, a password manager, or a cloud document. The whole point is that it never touches the internet.
- **Make two copies, store them in two safe places** — for example a locked drawer at home and a sealed envelope with someone you trust. If one is lost or damaged, the other survives.
- **For real money, upgrade to metal.** Stamped steel plates (brands like Cryptosteel or Billfodl) survive fire and flood the way paper won't.
- **Never share it. With anyone. Ever.** No legitimate company, support agent, or "verification" page will *ever* need it.

That last rule is not theoretical. In January 2026, someone lost more than $282 million after a scammer posing as Trezor support talked them into revealing their recovery phrase [Cointelegraph]. The lesson is simple and it never changes: **real support never asks for your phrase. The request itself is the scam.**

## Your wallet address: this part is meant to be public

Alongside the secret phrase, your wallet has an **address** — a long string starting with `0x`, like `0x7a25…f3b2`. This is the *opposite* of secret. It's how people send you funds, like posting your community garden's street address so neighbours can drop off compost. You can paste it in a chat, put it on a flyer, share it freely.

The easy mental model: your address is like your email address (share it), your recovery phrase is like your password (never). Mixing those two up is the one error that matters here.

## Gas fees are no longer the barrier they once were

To *do* anything — send money, vote in a community fund, claim a contribution — a blockchain charges a small **gas fee**, the network's running cost, a bit like the stamp on a letter. For years this was a real obstacle: a single action on Ethereum's main network could cost more than the thing you were doing.

That's changed. As of mid-2026, fees on Ethereum's main network sit at a small fraction of a cent in calm periods [Etherscan], and on faster side-networks called **Layer 2s** (such as **Base**, **Arbitrum**, and **Optimism** — extra lanes built on top of Ethereum to make it cheaper and quicker) a typical transaction costs well under a cent [Base-Docs]. Most regen and community projects now run on a Layer 2 for exactly this reason.

Practically: you'll still need a tiny amount of the network's coin (ETH) to cover fees, but "tiny" now means pennies, not a serious cost. If a project lives on Base or another Layer 2, your first transactions will likely cost less than a stamp.

## Try This

> **Start here:** Go directly to `metamask.io` (type it yourself), watch MetaMask's two-minute setup video, and bookmark the real site. You don't have to install anything yet — just learn to recognise the genuine front door so a fake never fools you.

> **Go deeper:** Install the wallet and create one, choosing the Secret Recovery Phrase option. Write the 12 words on paper by hand, store two copies in two places, and pass the confirmation quiz. Then receive a tiny test amount — grab free practice funds from the [Alchemy Sepolia faucet](https://www.alchemy.com/faucets/ethereum-sepolia) on a test network, where nothing is real money and mistakes cost nothing.

> **Stretch:** Send your wallet address to a friend who already uses crypto and ask them to send you a few cents on a Layer 2 like Base. Watch the fee, confirm the transaction, and send a small amount back. You'll have completed a full real-world round trip for less than the cost of a postage stamp — and you'll never feel intimidated by a wallet again.

## References

- [Create a new wallet — MetaMask Help Center](https://support.metamask.io/start/creating-a-new-wallet/) — official, current step-by-step setup, including the Secret Recovery Phrase and social-login options.
- [Introducing MetaMask social login — MetaMask](https://metamask.io/news/introducing-metamask-social-login) — how the Google/Apple sign-in option works and what it does (and doesn't) change about self-custody.
- [Securing your Secret Recovery Phrase — MetaMask Help Center](https://support.metamask.io/start/user-guide-secret-recovery-phrase-password-and-private-keys/) — official guidance on storing your phrase and why no one should ever ask for it.
- [26 FakeWallet apps on the App Store — The Hacker News (April 2026)](https://thehackernews.com/2026/04/26-fakewallet-apps-found-on-apple-app.html) — the counterfeit-app scam, and why you should only download from the official site.
- [$282M lost to a fake-support seed-phrase scam (January 2026)](https://www.gncrypto.news/news/crypto-holder-massive-seed-phrase-scam-bitcoin-litecoin/) — a real, recent case of why support never asks for your recovery phrase.
- [Ethereum Gas Tracker — Etherscan](https://etherscan.io/gastracker) — live Ethereum network fees, to see current costs for yourself.
- [Base network fees — Base Documentation](https://docs.base.org/base-chain/network-information/network-fees) — how cheap transactions are on a typical Layer 2.
- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) — free test funds so you can practise sending and receiving with zero real-money risk.
- [Ledger](https://www.ledger.com/) and [Trezor](https://trezor.io/) — official sites for hardware (cold) wallets, for when you're ready to protect larger amounts.
