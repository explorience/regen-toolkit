# Layer 2 Solutions - Research Document

## Overview

Layer 2 (L2) solutions are scaling protocols built on top of Ethereum that process transactions offchain while inheriting Ethereum's security. They address Ethereum's limitations of high fees and low throughput by moving computation and state storage off the main blockchain.

---

## What Are Layer 2 Solutions?

Layer 2 solutions are protocols that operate on top of Ethereum (Layer 1) to increase transaction throughput and reduce costs. They process transactions offchain but periodically commit batches of transactions to the Ethereum mainnet. This approach maintains Ethereum's security guarantees while significantly improving performance.

**Key characteristics:**
- Execute transactions offchain (Layer 2)
- Post transaction data to Ethereum as calldata or blobs
- Inherit security from Ethereum's base layer
- Can achieve 10-100x improvements in scalability

---

## Types of Layer 2 Solutions

### 1. Optimistic Rollups

Optimistic Rollups execute transactions offchain and assume they are valid by default. They only publish transaction data to Ethereum without cryptographic proofs of validity.

**How they work:**
- Bundle multiple offchain transactions into batches
- Submit batched transaction data to Ethereum as calldata
- Operate on an "optimistic" assumption—transactions are presumed valid unless challenged
- Include a challenge period (typically 7 days) during which anyone can submit a fraud proof

**Fraud proof mechanism:**
- Validators can challenge incorrect transactions by computing a fraud proof
- If successful, the incorrectly executed transaction is re-executed
- The sequencer responsible receives a penalty (stake slashing)
- If unchallenged after the challenge period, the batch is accepted as valid

**Examples:** Optimism, Arbitrum, Base

**Key features:**
- EVM compatibility—existing Ethereum applications can migrate easily
- Lower latency compared to ZK-Rollups
- Simpler implementation

### 2. Zero-Knowledge Rollups (ZK-Rollups)

ZK-Rollups use cryptographic validity proofs (zero-knowledge proofs) to verify the correctness of offchain transactions before committing them to Ethereum.

**How they work:**
- Bundle transactions into batches
- Execute transactions offchain
- Generate a validity proof (ZK-SNARK or ZK-STARK) proving the batch is correct
- Submit the compressed transaction data and validity proof to Ethereum
- The L1 contract verifies the proof before accepting the batch

**Key advantages:**
- Immediate finality—funds can be withdrawn once the proof is verified
- No challenge period needed
- Better data compression than Optimistic Rollups
- Higher theoretical scalability

**Validity proof types:**
- **ZK-SNARK**: Smaller proof sizes, constant-time verification, requires trusted setup
- **ZK-STARK**: No trusted setup required, scalable, quantum-resistant, but larger proof sizes

**Examples:** zkSync Era, Starknet, Scroll, Polygon zkEVM

---

## Layer 2 Business Model & Economics

### Revenue Sources

Layer 2 rollups generate revenue from two primary sources:

1. **Transaction fees**: Users pay gas fees to use the L2. These fees are lower than L1 but still cover operational costs.

2. **MEV (Maximal Extractable Value)**: Rollup sequencers can extract value by reordering transactions within a batch.

### Cost Structure

Rollups incur several costs passed to users:
- Computational resources for transaction execution
- Fraud proof verification (Optimistic) or zero-knowledge proof generation/verification (ZK)
- Publishing calldata to L1—the largest cost component (data availability problem)

### Value Accrual

**Profit mechanism**: Rollups charge a "premium"—the spread between user transaction fees and the cost of purchasing L1 blockspace. Optimism implements a "fee scalar" targeting ~10% sequencer profit margin.

**Token utility**: L2 tokens can accrue value through:
- Governance (voting on protocol upgrades)
- Staking for sequencer selection
- Capturing transaction fees and MEV revenue
- Decentralizing the sequencer role

---

## Layer 2 and Ethereum

### Security Model

Layer 2 solutions are "hybrid scaling solutions"—they operate as separate protocols but derive security from Ethereum:

- **Data availability**: Transaction data is posted to Ethereum, allowing anyone to verify the L2 state
- **Settlement**: Ethereum verifies validity proofs (ZK) or fraud proofs (Optimistic)
- **Censorship resistance**: Users can submit transactions directly to L1 if censored by the L2 operator

### Mainnet Interaction

| Aspect | Description |
|--------|-------------|
| **Data posting** | Transaction data published to Ethereum as calldata or blobs |
| **State commitment** | L2 state root (Merkle root) stored in L1 contract |
| **Finality** | L2 transactions finalize once L1 accepts the proof/batch |
| **Settlement** | Ethereum acts as settlement layer for disputes |

---

## Major Layer 2 Networks

| Network | Type | Token | Notable Features |
|---------|------|-------|------------------|
| **Optimism** | Optimistic Rollup | OP | EVM-equivalent, retroactive public goods funding |
| **Arbitrum** | Optimistic Rollup | ARB | EVM-compatible, Fair Ordering |
| **Base** | Optimistic Rollup | None (yet) | Built by Coinbase, OP Stack |
| **zkSync Era** | ZK-Rollup | ZK | EVM-compatible, account abstraction |
| **Starknet** | ZK-Rollup | STRK | STARK proofs, Cairo language |
| **Scroll** | ZK-Rollup | SCR | EVM-equivalent, ZK proofs |
| **Polygon zkEVM** | ZK-Rollup | MATIC | EVM-equivalent ZK-Rollup |

---

## Key Concepts

### Data Availability Problem

The cost of publishing and storing transaction data on Ethereum (L1) is the primary expense for L2s. Solutions include:
- Calldata compression
- Danksharding / Proto-danksharding (EIP-4844)
- Dedicated data availability layers (e.g., Celestia)

### MEV Approaches

- **Offensive (Optimism)**: Captures MEV through auctions, uses revenue for public goods
- **Defensive (Arbitrum)**: Implements Fair Ordering to minimize MEV extraction

### Sequencer

The entity responsible for:
- Ordering, batching, and submitting transactions to L1
- Executing transactions and producing L2 blocks
- Currently centralized on most L2s
- Plans for decentralization via proof-of-stake

---

## Sources

- **Primary**: Bankless Academy
- **Secondary**: Ethereum.org (ethereum.org/en/layer-2/)
