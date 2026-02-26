# Research Brief: How Transactions Work

**Article:** how-transactions-work.md  
**Target Audience:** Maya (Grounded Regen) - permaculture teacher, no tech/crypto background  
**Sources:** Bankless Academy (P), Ledger Academy, Fireblocks Academy (S)

---

## Key Concepts

### What is a Blockchain Transaction?

A blockchain transaction is when one person transfers a digital asset they own to another person. The transaction always includes: the amount, the destination of the funds, and a signature to prove its authenticity. [Source S]

Blockchain is a distributed ledger with data stored on every computer in the system rather than a server. Its primary purpose is as a method of peer-to-peer transfer—allowing people across the world to send digital assets without a central entity. [Source S]

### Transaction Lifecycle

1. **Creation** - Transaction starts as "intent" in a crypto wallet, showing details before approval (sender's address, destination address, amount, any conditions) [Source S]

2. **Signing** - User approves and signs with their private key, proving ownership and agreement with transfer conditions [Source S]

3. **Broadcasting** - Signed transaction is distributed to crypto nodes, entering the mempool (waiting room) [Source S]

4. **Verification** - Nodes validate: check sender has sufficient funds, verify signature using public key [Source S]

5. **Block Creation** - Block creators (miners/validators) select transactions from mempool and propose a block [Source S]

6. **Consensus** - Network nodes verify the block; if valid, it's added to the chain [Source S]

7. **Confirmation** - Transaction becomes finalized and immutable once included in a block [Source S]

---

## Signing Transactions

### Public Key Cryptography

Accounts work using public and private key pairs:

- **Private key**: Has power to control entire account, used to sign transactions. Must be kept secret. [Source S]
- **Public key**: Derived from private key but safe to share. Used to receive assets. [Source S]
- **Blockchain address**: Simply a hashed version of the public key—the address used to receive crypto. [Source S]

"When you approve a transaction, you sign it with your private key. This proves that you own the account you intend to send money from and agree with the conditions of the transfer." [Source S]

Since the public key is included in any transaction signed with the private key, all participants can check validity. Nodes just check that the signer has the corresponding public key. [Source S]

---

## Broadcasting & The Mempool

### What is the Mempool?

The mempool is a "waiting room" for transactions. It's where unconfirmed transactions wait before being added to a block. [Source S]

Important details:
- Each node has its own mempool
- Mempools may validate transactions in different order
- Some mempools are private (block creators may only process their own transactions) [Source S]

"Once created, the transaction is broadcasted to the network of nodes. Each node receives the transaction and temporarily stores it in a pool of pending transactions, often referred to as the 'mempool.'" [Source S]

### Transaction Verification in Mempool

Nodes categorize transactions as either "queued" (yet to be validated) or "pending." To validate:
1. Check if sender has sufficient funds
2. Verify signature validity using public key
3. If valid, pass to next node [Source S]

---

## Block Creation & Consensus

### Who Creates Blocks?

Most blockchains have special nodes that add new blocks:

- **Proof-of-work** (Bitcoin): Miners create blocks by solving complex math problems requiring specialized equipment and energy [Source S]
- **Proof-of-stake**: Validators lock up cryptocurrency to create blocks; chosen by voting mechanism or who has most "stake" (coins locked up) [Source S]

Gas fees compensate block creators for the financial burden of creating a block. [Source S]

### Consensus Mechanism

"Consensus is reached when the majority of nodes reach the same conclusion: If the proposed block is valid, the nodes agree to add it to the ledger." [Source S]

Each block is sealed with a hash including all transaction information. Once included in a block, transactions become immutable—part of blockchain's permanent history. [Source S]

---

## Confirmation

Once a transaction is included in a block, it is considered confirmed. The number of confirmations increases as more blocks are added on top, enhancing finality and security. [Source S]

"Unlike in the mempool, nodes must all receive validated blocks in the same order. Once the transaction is included in a block, it becomes an immutable part of the blockchain's history." [Source S]

On Bitcoin, the version of the chain with the longest valid chain of transactions is the "true copy" because it prioritizes the version with the most work completed. [Source S]

---

## Direct Quotes Worth Including

> "A blockchain transaction is when one person transfers a digital asset they own to another person. The transaction itself will always include; the amount, the destination of the funds and a signature to prove its authenticity." [Source S]

> "Your private key has the power to control your entire account. This allows you to make decisions on the blockchain, or in other words, sign transactions." [Source S]

> "Since your public key is included in any transaction you sign with your private key, all participants on a blockchain can check the validity of a transaction." [Source S]

> "Consensus is reached when the majority of nodes reach the same conclusion: If the proposed block is valid, the nodes agree to add it to the ledger." [Source S]

> "Once the transaction is included in a block, it becomes an immutable part of the blockchain's history." [Source S]

---

## Examples Maya Would Understand

### The Bus Station Analogy (from Source S)

**Block size is like the bus**: Each bus represents a block going on the blockchain. Each person represents a transaction waiting to be processed. Each bus can only hold a certain number of people.

**Ticket officer is consensus**: Just like a ticket officer checks passengers have correct tickets, the consensus mechanism lets nodes verify if a transaction is valid.

**First class passengers**: Some participants pay higher fees to get their transaction processed first—just like paying for a first-class ticket to board before others.

### Simple Garden Exchange Analogy

Imagine you and neighbors keep a shared notebook of who gave whom vegetables from their garden. Everyone has a copy. When you give tomatoes to a neighbor:
1. You write in the notebook: "Maya gives 5 tomatoes to Jose"
2. You sign it (your special marker only you can use)
3. All neighbors verify it's really your signature
4. Everyone agrees it's valid and adds it to their copy
5. Once recorded, it can't be erased—it's permanent

This is how blockchain transactions work: distributed record-keeping where everyone verifies and keeps a copy.

---

## Links & Resources

- Bankless Academy - Blockchain Basics: https://app.banklessacademy.com/lessons/blockchain-basics [Source P]
- Ledger Academy - How Does a Blockchain Transaction Work: https://www.ledger.com/academy/how-does-a-blockchain-transaction-work [Source S]
- Fireblocks Academy - Transaction Approval and Validation Flows: https://www.fireblocks.com/academy/blockchain-architecture/transaction-approval-and-validation-flows [Source S]
- Ledger Academy - What is a Mempool: https://www.ledger.com/academy/what-is-a-mempool [Source S]

---

## Gaps: What Sources DON'T Cover

1. **Specific fees and timing** - Sources mention fees exist but don't give concrete numbers or typical wait times (ranges vary wildly by network conditions)

2. **How to actually do a transaction** - No step-by-step guide for using a wallet interface for the first time

3. **Environmental impact details** - Sources mention proof-of-work uses energy but don't deeply explore the environmental tradeoffs

4. **Transaction failures** - Only Fireblocks mentions rebroadcasting failed transactions; other sources don't cover what happens when transactions "stuck" or fail

5. **Private/permissioned blockchains** - Sources focus primarily on public blockchains; private chains work differently

6. **Smart contract transactions** - Mentioned briefly but not deeply explained (these are more complex transactions beyond simple transfers)

7. **Recovery options** - No information on what happens if you send to wrong address or lose private keys

8. **Real-world examples of current transaction volumes/usage** - Sources are conceptual, not data-driven

9. **Layer 2 solutions** - Not covered (these are secondary protocols that process transactions faster/cheaper)

10. **Historical context** - No background on who invented this system or why

---

## Notes for Writing

- Bankless Academy is the primary source but their lesson page didn't load full content—Ledger Academy provided most detailed explanation
- Fireblocks Academy adds good technical depth on validation flows
- For Maya, use the bus station or garden exchange analogy—avoid technical jargon where possible
- Emphasize the "no central authority" aspect—this is key to understanding why blockchain is different from banks
- Transaction confirmation is not instant—emphasize waiting time as important practical knowledge
