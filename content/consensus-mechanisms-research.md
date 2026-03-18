# Consensus Mechanisms

## Overview

How do thousands of computers agree on what's "true" in a trustless system? **Consensus mechanisms**—the rules that let decentralized networks agree on a single version of history without trusting each other.

## Proof of Work (PoW)

Miners compete to solve complex mathematical puzzles. First to solve gets to add the next block—and receives cryptocurrency rewards.

**Used by**: Bitcoin, (formerly) Ethereum

**Pros**:
- Extremely secure (attack requires huge computational power)
- Battle-tested over 15+ years

**Cons**:
- Energy-intensive
- Slower throughput
- Rewards favor large mining operations

## Proof of Stake (PoS)

Validators put up cryptocurrency as collateral ("stake"). They're randomly selected to propose blocks, but can be penalized ("slashed") for misbehavior.

**Used by**: Ethereum (after The Merge), Cardano, Solana

**Pros**:
- Much more energy-efficient than PoW
- Lower barriers to participation
- Faster block times

**Cons**:
- Rich get richer (more stake = more rewards)
- Complex to implement securely
- Newer, less battle-tested

## Other Mechanisms

**Delegated Proof of Stake (DPoS)**: Token holders vote for validators. Used by EOS, Tron. Faster but more centralized.

**Proof of Authority (PoA)**: Identity-based (you stake your reputation). Used by some private/enterprise chains.

**Proof of History (PoH)**: Creates a cryptographic record of time. Used by Solana as part of its consensus.

## How It Affects You

| Mechanism | Speed | Energy | Security |
|-----------|-------|--------|----------|
| PoW | Slow | High | Very High |
| PoS | Medium | Low | High |
| DPoS | Fast | Low | Medium |

**Transaction fees**: Higher demand = higher fees, regardless of mechanism. Ethereum fees are often high; Solana/Polygon typically cheaper.

**Environmental concerns**: PoW uses significant energy; PoS uses ~99% less.

## Practical Example for Maya

**Bitcoin (PoW)**: You send BTC. Miners compete to include your transaction in the next block. This secures the network but takes ~10 minutes for confirmation.

**Ethereum (PoS)**: You send ETH. Random validators propose and confirm blocks. Faster (~12 seconds) and much more energy-efficient.

**For a community project**: Choose based on:
- Budget sensitivity → PoS networks (lower fees)
- High value transactions → Bitcoin (most secure)
- Speed priority → Solana/Polygon

## Citations

[Source A] Ethereum Foundation. "Proof of Stake." ethereum.org
[Source B] Bitcoin Wiki. "Proof of Work." bitcoinwiki.org
