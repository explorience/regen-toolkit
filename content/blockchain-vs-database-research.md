# Blockchain vs Traditional Database

## Overview

At their core, both store and retrieve data—but they differ fundamentally in *how* they do so, and those differences create different tradeoffs. Understanding when each makes sense helps you evaluate Web3 claims critically.

## Traditional Databases

A **database** is managed by a single entity (company, organization). They control who reads, writes, and modifies data. Think MySQL, PostgreSQL, or Google Sheets.

**Strengths:**
- **Speed**: Millions of transactions per second
- **Privacy**: You control who sees what (private databases)
- **Flexibility**: Easy to edit or delete data when needed
- **Cost**: Cheap to store large amounts of data

**Weaknesses:**
- **Single point of failure**: If the company goes down or gets hacked, data is lost or compromised
- **Trust dependent**: You must trust the database operator to be honest and competent
- **No native transparency**: Users can't independently verify what happened

## Blockchains

A **blockchain** is a distributed ledger—copies exist across many computers (nodes) worldwide. No single party controls it. Changes require consensus.

**Strengths:**
- **Decentralized trust**: You don't need to trust a single entity—math and economics enforce honesty
- **Transparency**: Anyone can verify transactions
- **Censorship resistance**: Extremely hard for one party to block or reverse transactions
- **Programmability**: Smart contracts execute code automatically when conditions are met

**Weaknesses:**
- **Speed**: Much slower than centralized databases (though improving)
- **Cost**: Every operation has a fee (gas) paid to the network
- **Privacy**: Public by default—hard to hide data
- **Irreversibility**: Mistakes are hard to undo (both a feature and bug)

## When to Use Which?

| Use Case | Better Choice |
|----------|---------------|
| Social media posts | Traditional database |
| Tracking food supply chain | Blockchain (for verification) |
| Storing user passwords | Traditional database |
| Recording financial transactions | Either (depends on trust model) |
| Gaming inventory | Either (blockchain for true ownership) |

## Practical Example for Maya

Imagine tracking donations to a charity:
- **Traditional database**: You donate, they record it in their system. You trust their accounting.
- **Blockchain**: You donate on-chain. Anyone can verify the total received. The charity can show their wallet address. Donors see exactly what happened—no trust required.

For internal employee records? Traditional database—private, editable, fast.

## Citations

[Source A] IBM Blockchain. "Blockchain vs. Database." ibm.com
[Source B] Ethereum Foundation. "What Is a Blockchain?" ethereum.org
