# Gas Fees - Research Document

**Target:** 🌱 Maya  
**Output Path:** `content/1-foundations/1.4-cryptocurrency-essentials/working/gas-fees-research.md`  
**Sources:** Bankless Academy (Primary), Original/Technical Sources (Secondary)

---

## Overview

Gas fees are the essential costs of conducting transactions and executing operations on a blockchain network. Every time a user conducts a transaction on a blockchain—such as sending cryptocurrency, executing a smart contract, or minting an NFT—computational power is required. The cost of these resources is paid in the form of gas fees. [Source P], [Source S]

Gas fees serve several critical functions:
- **Compensate validators/miners** for the computational work, transaction validation, and network security maintenance
- **Control network activity** by creating economic barriers against spam and abuse
- **Allocate scarce block space** through market-based pricing [Source S]

---

## Key Gas Concepts

### What is Gas?

Gas is a measurement of how much computational work (computational resources) a certain task requires on a blockchain. While Ether (ETH) is the currency that fuels Ethereum, gas is a specific unit used to measure the "work" a transaction needs. [Source S]

### Gas Price vs. Gas Fee

These terms are often confused but refer to different things:
- **Gas Price:** The cost per unit of gas (typically measured in gwei)
- **Gas Fee:** The total cost of a transaction = Gas Units Used × Gas Price [Source S]

### Gwei

Gwei (short for "giga-wei") is the smallest unit of Ether:
- 1 gwei = 0.000000001 ETH (10⁻⁹ ETH)
- 1 ETH = 1,000,000,000 gwei [Source S]

---

## How Gas Fees Work on Ethereum

### EIP-1559: The Current Pricing Model

Ethereum uses a dynamic pricing system introduced in the EIP-1559 upgrade (August 2021), which replaced the old auction-style model. Gas prices now comprise two parts: [Source S]

#### Base Fee
- A reserve price set by the Ethereum protocol
- Represents the minimum amount of gas needed to include a transaction
- **Automatically burned** (removed from circulation)—this is a key difference from the old model
- Fluctuates based on network congestion
- If blocks are more than 50% full, the base fee increases; if less than 50% full, it decreases [Source S]

#### Priority Fee (Tip)
- An optional fee paid directly to validators to incentivize them to prioritize your transaction
- Users can set this to 0, but transactions may be delayed during busy periods
- Replaces the old "miner tip" system [Source S]

#### Total Gas Fee Formula
```
Gas Fee = Gas Units Used × (Base Fee + Priority Fee)
```

### Gas Limit

The gas limit is the maximum amount of gas units a user is willing to spend on a transaction:
- **Simple ETH transfers:** 21,000 gas units (fixed)
- **Smart contract interactions:** Varies based on complexity
- **NFT mints:** Can require 50,000-200,000+ gas units
- **Block gas limit:** Currently 15 million units per block [Source P]

If the gas limit is set too low, the transaction fails—but you still pay for the gas consumed. If set higher than needed, the unused gas is refunded. [Source S]

---

## Factors Affecting Gas Fees

### Network Demand
Gas fees fluctuate based on:
- **Time of day:** Peak usage hours = higher fees
- **Day of week:** Weekdays typically have higher activity
- **Market events:** Major price movements, NFT drops, or protocol launches can cause gas spikes [Source P]

### Transaction Complexity
- Simple ETH transfer: ~21,000 gas
- ERC-20 token transfer: ~65,000 gas
- Swapping on DEXs (e.g., Uniswap): ~150,000-300,000 gas
- Complex smart contracts: Can require millions of gas units [Source S]

### Block Space
- Each block has a limited amount of space (gas limit)
- When demand exceeds capacity, users compete by raising their priority fees
- This creates a fee market—users who pay more get included faster [Source S]

---

## Gas on Other Blockchains

While Ethereum is the most prominent example, gas fees exist on many blockchains:

### EVM-Compatible Chains
- **BNB Chain:** Similar gas model to Ethereum
- **Polygon:** Low fees (often fractions of a cent)
- **Avalanche:** Native token (AVAX) used for fees
- **Arbitrum & Optimism (L2s):** Significantly lower fees than Ethereum mainnet [Source S]

### Non-EVM Chains
- **Solana:** Transaction fees are fixed and very low (~$0.00025)
- **Bitcoin:** Transaction fees based on byte size, not computational work
- **Cardano:** Fixed fees plus variable component based on load [Source S]

---

## Layer 2 Solutions and Gas Fees

Layer 2 (L2) solutions significantly reduce gas costs by processing transactions off the main Ethereum chain:

### Rollups
- **Optimistic Rollups (Optimism, Arbitrum):** Process transactions in batches, post to Ethereum mainnet
- **ZK-Rollups (zkSync, Starknet):** Use cryptographic proofs for validity
- **Savings:** Can reduce fees by 90-99% compared to mainnet [Source P]

### When L2 Fees Apply
- Moving assets to L2: One mainnet transaction
- Transactions on L2: Very low fees (often cents)
- Withdrawing to mainnet: One mainnet transaction [Source P]

---

## Tips for Managing Gas Fees

### Timing
- **Off-peak hours:** Early morning (UTC) or weekend transactions typically cost less
- **Avoid major events:** Stay clear of NFT drops, protocol launches, and market volatility periods [Source P]

### Fee Settings
- **Wallets include calculators:** Most wallets automatically estimate appropriate fees
- **Adjust priority fee:** Lower priority = cheaper but slower
- **Use max fee setting:** Protects against sudden spikes (unused is refunded) [Source S]

### Layer 2 Usage
- For frequent DeFi interactions, consider using L2 networks
- Bridge assets during low-gas periods [Source P]

---

## Summary Table

| Concept | Description |
|---------|-------------|
| Gas | Unit measuring computational work required for a transaction |
| Gas Price | Cost per unit of gas (in gwei) |
| Gas Fee | Total cost = Gas Used × (Base Fee + Priority Fee) |
| Base Fee | Minimum fee set by protocol; burned automatically |
| Priority Fee | Optional tip to validators for faster inclusion |
| Gas Limit | Maximum gas units authorized for a transaction |
| Gwei | Smallest ETH unit = 0.000000001 ETH |

---

## Key Takeaways

1. **Gas fees are mandatory** for any blockchain operation—there's no way to avoid them
2. **EIP-1559 made fees more predictable** by introducing the base fee mechanism and burning a portion
3. **Fees fluctuate with demand**—network congestion directly impacts costs
4. **Gas limits vary by transaction type**—simple transfers are cheap; complex contracts are expensive
5. **Layer 2 solutions offer relief**—for frequent users, L2s can dramatically reduce costs
6. **Wallets handle fee calculation**—most users don't need to manually set fees
7. **Unused gas is refunded**—but failed transactions still consume gas [Source P], [Source S]

---

## Sources

- **Primary:** Bankless Academy - Ethereum Gas Fees Guide (bankless.com)
- **Primary:** Bankless Academy - 6 Ways to Save on Ethereum Gas Fees
- **Secondary/Original:** Ledger Academy - What is Gas Fee in Crypto
- **Secondary/Original:** Binance Academy - Gas Glossary
- **Secondary/Original:** Ethereum EIP-1559 Specification (eips.ethereum.org)
