---
title: Gas Fees
description: Learn about gas fees in this Regen Toolkit article.
section: '1.4'
track: 1
status: published
author: unknown
sources:
- l
- i
- s
- t
audience:
- grounded-regen
estimated_words: 516
created: '2026-03-11T09:43:43.211Z'
last_updated: '2026-03-11T09:43:43.211Z'
research_done: true
draft_done: true
factcheck_done: true
review_done: true
critique_done: true
published_flag: true
issue: 0
date: '2026-03-11'
category: foundations
stage: build
---

# Understanding Gas Fees in Cryptocurrency

*Quick read: 3 minutes*

Gas fees are the costs to transact on a blockchain. Every time you send crypto, swap tokens, or mint an NFT—you pay gas. Here's what you need to know.

## What Are Gas Fees?

Think of gas like gasoline for your car. You need it to make things move. On blockchains, gas pays for the computational work to process your transaction.

**Why gas fees exist:**
- **Pay validators** who secure the network
- **Prevent spam** by making abuse expensive
- **Allocate space** during busy times

## Key Terms (Simplified)

| Term | What it means |
|------|---------------|
| **Gas** | The units of work your transaction needs |
| **Gas price** | Cost per unit (quoted in gwei) |
| **Gas fee** | Total cost: gas used × gas price |
| **Gwei** | Tiny fraction of ETH (1 gwei = 0.000000001 ETH) |

## How Ethereum Fees Work

### The Base Fee + Tip Model (EIP-1559)

Since 2021, Ethereum fees have two parts:

**Base fee:** The minimum price, automatically adjusts with demand. When networks busy → fees go up. When quiet → fees go down. *This part gets burned (deleted forever).*

**Priority fee (tip):** Extra you pay to jump the queue. During busy times, higher tip = faster transaction. Set to zero = wait longer.

**Formula:** `Gas Fee = Gas Used × (Base Fee + Tip)`

### Gas Limits by Transaction Type

| Transaction | Gas needed |
|--------------|------------|
| Simple ETH send | 21,000 |
| Token transfer | ~65,000 |
| Token swap | 150,000-300,000 |
| NFT mint | 50,000-200,000+ |

Set limit too low = transaction fails (you still pay). Set higher = unused gas refunded.

## What Drives Fees Up or Down?

**Network demand is the #1 factor:**
- US/European business hours = peak fees
- Weekends = lower fees
- Big NFT drops or market swings = spikes

**Transaction complexity:** Simple transfers cost less. Complex DeFi swaps cost more.

## Save Money: Use Layer 2 Networks

Layer 2 (L2) networks like Arbitrum and Optimism process transactions off main Ethereum, then bundle them together. 

**Result:** Fees drop 90-99%. A $5 swap on mainnet might cost $0.05 on Arbitrum.

**How L2s work:**
1. Move assets to L2 (one mainnet transaction)
2. Transact cheaply on L2 (cents)
3. Withdraw to mainnet when needed

## 5 Ways to Save on Gas

1. **Transact early morning UTC or weekends** — fees are lowest
2. **Avoid big NFT drops and market volatility** — that's when fees spike
3. **Use wallet fee estimators** — most wallets calculate for you
4. **Use Layer 2** — dramatically cheaper for frequent use
5. **Set max fees** — wallets let you cap spending; unused refunds

## Key Takeaways

- Gas fees are unavoidable — budget for them
- Fees fluctuate with demand — timing matters
- Layer 2 can cut costs 90%+
- Your wallet handles the math — you just approve transactions
- Start on L2 networks to learn without spending much

---

*Next up: [1.5 Wallets and Custody](/content/1-foundations/1.5-wallets-and-custody/wallets-and-custody.md)*