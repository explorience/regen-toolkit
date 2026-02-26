---
title: Stablecoins explained
section: '1.4'
track: 1
status: draft
author: Regen Toolkit Team
sources:
audience:
created: 2026-01-15T00:00:00.000Z
priority: tier-2
---

# Stablecoins Explained

Stablecoins are crypto tokens designed to maintain a fixed value—typically $1. Unlike bitcoin or ether where your holdings swing wildly, 1,000 USDC is always worth roughly $1,000. They're the bridge between fiat and DeFi: ERC-20 tokens that let you move between traditional currency and crypto without leaving the blockchain. [Source P]

This matters. The DeFi ecosystem reached $140 billion in stablecoin supply at its 2022 peak, settling around $7 trillion in transaction value that year. That's ~0.3% of global USD settlement. [Source P]

For builders and degens looking to deploy capital meaningfully, stablecoins aren't optional—they're infrastructure.

## Why Hold Stablecoins?

**Stability.** Park value in a self-custody wallet without exposure to crypto volatility. When markets crash, your stablecoins stay stable. [Source P]

**Flexibility.** Swap instantly between dollars and any token. Need to move into a yield protocol? Done in seconds. No bank transfers, no waiting for settlement. [Source P]

**Yield access.** This is the draw. Lend your USDC on Aave or Curve and earn 4-8% annually—far above bank rates. Risks are real (smart contract bugs, liquidity crises), but the returns are accessible to anyone with a wallet. [Source P]

**Self-custody.** Your keys, your coins. Cryptography makes it extremely difficult for attackers to capture or forge transactions. No bank can freeze your account. [Source P]

## Three Stablecoin Types

Each maintains its peg differently—with distinct trade-offs.

### 1. Fiat-Backed

Real-world fiat reserves back these. For every 1 USDC in circulation, Circle holds $1 in reserve. [Source P]

**Examples:** USDC (Circle), USDT (Tether)

**How they work:** Issuer locks up fiat, mints tokens to match demand. Redeem tokens, supply decreases. [Source P]

**Revenue:** Reserves invested in short-term US Treasuries, plus transaction fees. [Source P]

**ReFi angle:** Glo Dollar directs interest from reserves to basic income programs for people in extreme poverty—a stablecoin with embedded philanthropy. [Source P]

**Risks:**
- **Transparency:** USDC gets regular audits. USDT's reserves? Less clear. [Source P]
- **Censorship:** Both can freeze addresses deemed "disagreeable"—even non-custodial wallets. [Source P]

### 2. Crypto-Collateralized

Crypto assets deposited in DeFi protocols back these. Overcollateralized (often 200%+) to absorb volatility. [Source P]

**Example:** MakerDAO's Dai (DAI)

**How it works:** Deposit ETH, BTC, or other assets into Maker. Generate DAI against your collateral. If collateral value drops, liquidation kicks in. [Source P]

**Transparency:** All collateral on-chain 24/7. Verify backing anytime at daistats.com. [Source P]

**Risks:**
- **Volatility:** Even with 200% backing, a major crash could stress the system. DAI survived a 20% ETH drop, but cascading crashes are possible. [Source P]
- **Counterparty:** You're exposed to whatever assets back the stablecoin. [Source P]
- **Governance:** MakerDAO voters manage DAI. Human error or capture is a risk. [Source P]

### 3. Algorithmic

Code maintains the peg—no fiat reserves, no crypto collateral. An algorithm automatically adjusts token supply based on price. [Source P]

**Examples:** Liquity (LUSD), Frax (FRAX)

**How it works:** Price below $1? Algorithm burns tokens to reduce supply. Above $1? New tokens minted. Fully automated, public code anyone can audit. [Source P]

**The pitch:** No central issuer, no reserves, no governance overhead. Near-zero counterparty risk. [Source P]

**Risks:**
- **Dynamic holdings:** Your token count fluctuates with supply adjustments. Dollar value stays constant, but it's confusing for newcomers. [Source P]
- **Technical:** You need to understand the mechanism to assess risk. Not set-and-forget. [Source P]
- **Smart contracts:** Newer, less battle-tested. Terra's collapse (May 2022) showed catastrophic failure is possible. Only use audited protocols. [Source P]

## Choosing Your Stablecoin

| Type | Best For | Main Risks |
|------|----------|------------|
| Fiat-backed | Conventional on/off ramps | Opaque reserves, freeze capability |
| Crypto-collateralized | Transparency, DeFi integration | Crypto volatility, governance |
| Algorithmic | Self-sovereignty, decentralization | Smart contract bugs |

For ReFi projects? Crypto-collateralized and algorithmic align better with decentralization values.

## Where to Get Them

**CEXs:** Coinbase, Kraken—easy fiat on-ramp for USDC/USDT. [Source P]

**DEXs:** Uniswap, Curve, or MetaMask Buy for crypto-collateralized and algorithmic tokens. [Source P]

## Earning Yield

Two main paths:

1. **CeFi lending:** Some exchanges pay you to hold stablecoins on their platform
2. **DeFi lending:** Aave, Curve connect lenders and borrowers. Annual yields 4-8% are common. Smart contract risk, but accessible to anyone. [Source P]

Start small. Test with amounts you can afford to lose.

## Peg Stability: When Things Break

Stablecoins aren't always stable:

- **Minor swings:** +/- 2% during peak hours is normal. Arbitrage corrects quickly. [Source P]
- **Major depegs:** USDC had a scare in March 2023 but recovered. Terra collapsed permanently in May 2022. [Source P]
- **Redemption:** USDC offers 1:1 fiat redemption—but crisis behavior is unknown. [Source P]

## Try This

1. **Get some stablecoins.** Set up a wallet, buy $20-50 USDC on a CEX, withdraw to your wallet. Feel self-custody.
2. **Check the reserves.** Visit defillama.com/stablecoins for real-time market caps and backing data. [Source P]
3. **Explore yield.** Try a testnet DeFi protocol first. Understand the mechanics before committing real funds.

---

**Sources:**
- Bankless Academy: Understanding Stablecoins (https://app.banklessacademy.com/lessons/understanding-stablecoins) [Source P]
- ReFi DAO Local ReFi Toolkit (https://refidao.github.io/local-refi-toolkit/) [Source A]
