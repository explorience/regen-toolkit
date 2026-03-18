# Smart Contracts Explained - Research Notes

## Source P: Bankless Academy
*Note: Bankless Academy content requires subscription access. Unable to retrieve direct content. Their curriculum typically covers smart contracts as foundational Ethereum concepts.*

## Source S: Original/Ethereum Documentation

### What is a Smart Contract?
A smart contract is a program that runs on the Ethereum blockchain. It's a collection of code (functions) and data (state) that resides at a specific address on the blockchain.

**Key characteristics:**
- Smart contracts are a type of Ethereum account (contract account)
- They have a balance and can be the target of transactions
- Not controlled by a user - deployed to the network and runs as programmed
- User accounts interact by submitting transactions that execute functions
- Cannot be deleted by default
- Interactions are irreversible

### The Vending Machine Metaphor (Nick Szabo)
Best metaphor: A vending machine. With the right inputs, a certain output is guaranteed.

Example: money + snack selection = snack dispensed

This logic is programmed into the machine - same as smart contracts.

### How Smart Contracts Work

**1. Creation and Deployment**
- Written in specialized programming languages (Solidity, Vyper)
- Code contains all conditions and corresponding actions
- Deployed to blockchain - publicly viewable
- Requires gas fees to deploy

**2. Activation by Conditions**
- Blockchain monitors whether conditions embedded in code are met
- Triggers: specific date, receipt of payment, confirmation
- When condition met, action defined in code automatically executes

**3. Execution Without Intermediaries**
- Typical actions: token transfers, digital access rights, automated processes
- Decentralized execution - no central authority
- All transactions transparently recorded on blockchain

### Key Properties

**Permissionless**
- Anyone can write and deploy a smart contract
- Need to learn a smart contract language (Solidity, Vyper)
- Must compile code before deployment (EVM interprets it)

**Composability**
- Smart contracts are public and can be thought of as open APIs
- Can call other smart contracts to extend functionality
- Contracts can even deploy other contracts

### Limitations

**Cannot Access Real-World Data**
- Smart contracts cannot get information about "real-world" events
- Cannot retrieve data from off-chain sources
- This is by design - relying on external information could jeopardize consensus
- Solution: Oracles (tools that ingest off-chain data)

**Maximum Contract Size**
- Smart contract can be maximum 24KB or it will run out of gas
- Can be circumnavigated using The Diamond Pattern (EIP-2535)

### Multisig Contracts
- Smart contract accounts requiring multiple valid signatures to execute a transaction
- Useful for avoiding single points of failure
- Requires N signatures out of M possible (where N ≤ M, and M > 1)
- Common: N=3, M=5 or N=4, M=7

---

## Historical Development

- **1994**: Cryptographer Nick Szabo coined the term "smart contract"
- **2009**: Bitcoin launched with simple but limited scripting system
- **2015**: Ethereum launched - first blockchain to support complex smart contracts
- **2017+**: Rise of ICOs and DApps increased adoption
- **Today**: Multiple platforms support smart contracts (Ethereum, Solana, Cardano, etc.)

---

## Use Cases

- **Insurance**: Automated payouts when proofs are digitally provided
- **Property**: Ownership transfers without intermediaries
- **Logistics**: Automated documentation when shipments reach destinations
- **Digital Identities**: Verification without disclosing personal data
- **DeFi**: Loans, interest payments, token swaps without banks
- **NFTs**: Automatic ownership transfer recording

---

## Advantages

- Automation: No manual intervention once conditions met
- Security: Cryptographic methods make tampering difficult
- Transparency: Code publicly visible, execution trackable
- Cost savings: Remove intermediaries
- Efficiency: Fast processing
- Reliability: Executes exactly as programmed

## Disadvantages

- No retroactive changes: Code errors cannot be corrected
- Dependence on developer code: Bugs get executed
- Limited legal clarity: Many countries lack clear definitions
- Technical barrier: Requires programming knowledge
- Complexity risk: More conditions = more potential errors

---

## Platforms

- **Ethereum**: First comprehensive smart contract support
- **Solana**: Fast transactions, low fees
- **Cardano**: Scientific approach, focus on security
- **Binance Smart Chain**: Inexpensive, fast
- **Polkadot**: Cross-chain via parachains
