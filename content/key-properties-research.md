# Key Properties of Blockchain

## Overview

Blockchains aren't just databases—they're designed with specific properties that enable trustless coordination. Understanding these properties helps you evaluate what blockchains can (and can't) do.

## 1. Immutability

Once data is confirmed on the blockchain, it's extremely difficult to change. This is called **immutability**. Why it matters:
- Past transactions can't be reversed (no chargebacks, but also no tampering)
- Historical record is permanent
- Creates strong accountability

**Note**: "Extremely difficult" not "impossible"—51% attacks can theoretically revert chains, but expensive on major networks.

## 2. Decentralization

No single entity controls the network. Instead, many independent nodes maintain copies of the blockchain. Benefits:
- No single point of failure
- Harder to censor
- Trust distributed among many participants

**Degrees matter**: Ethereum is highly decentralized; a network with 3 validators is less so.

## 3. Transparency

Public blockchains let anyone:
- View all transactions (ever)
- Verify the current state (balances, smart contract code)
- Run a node to independently verify everything

This transparency enables **verifiable trust**—you don't need to trust a party, you can check yourself.

## 4. Security (Cryptographic)

Blockchains use:
- **Public-key cryptography**: Your wallet has a private key (secret) and public address (shareable)
- **Hashing**: Each block contains a "fingerprint" of the previous block—tampering breaks the chain
- **Digital signatures**: Only you can authorize transactions from your address

## 5. Programmability (Smart Contracts)

Smart contracts are programs that automatically execute when conditions are met. They're:
- **Deterministic**: Same input = same output
- **Autonomous**: No middleman needed
- **Transparent**: Code is visible on-chain

This enables DeFi, NFTs, DAOs, and countless other applications.

## 6. Censorship Resistance

Because no single entity controls the network, it's extremely hard for governments or companies to block transactions. This has tradeoffs (illegal activity is harder to stop) but protects free speech and financial access.

## Practical Example for Maya

**A community lending circle** on blockchain:
- **Immutability**: Meeting records can't be changed
- **Decentralization**: Not dependent on one person's computer
- **Transparency**: Everyone sees contributions
- **Security**: Only the member can move their funds
- **Programmability**: Smart contract auto-distributes funds when conditions met
- **Censorship-resistant**: No bank can freeze the account

## Citations

[Source A] Ethereum Foundation. "Blockchain Basics." ethereum.org
[Source B] a16z crypto. "Crypto Canon." a16zcrypto.com
