# Voting Mechanisms Research

**Topic:** DAO Voting Mechanisms  
**Target:** Maya  
**Sources:** Bankless Academy (Primary), Various Original Sources (Secondary)  
**Output:** Research document for voting-mechanisms.md

---

## Overview

DAO voting mechanisms are the protocols that determine how decisions are made within decentralized autonomous organizations. These mechanisms range from simple token-weighted votes to sophisticated systems like conviction voting and holographic consensus. Each approach represents different trade-offs between speed, decentralization, inclusivity, and resistance to manipulation.

This research covers the primary voting mechanisms used in DAOs, drawing from Bankless Academy educational content and authoritative sources in the DAO governance space.

---

## 1. Token-Based Quorum Voting

**Description:**  
Quorum voting is the most fundamental mechanism used in DAOs. A proposal passes only when a predetermined threshold of voters casts votes in favor. The quorum must be reached for the vote to be valid.

**How It Works:**
- A minimum percentage of total voting power must participate
- Of those participating, a majority (or supermajority) must vote "yes" for passage
- Common implementations use 4% quorum + 51% majority

**Key Characteristics:**
- **Simplicity:** Easy to understand and implement
- **Token-weighted:** Voting power correlates directly with token holdings
- **Predictable:** Clear pass/fail outcomes once quorum is met

**Challenges:**
- Low participation rates (often below 10% on major platforms)
- Wealth concentration: Token hoarders have disproportionate influence
- Vulnerable to vote buying and bribery
- Risk of last-minute manipulation (flash loan attacks)

**Example from Source P (Bankless):**  
Bankless Academy demonstrates Moloch DAO voting where founders sign with their ETH accounts to vote on proposals. The system uses capital-weighted voting where token holdings determine voting power.

---

## 2. Quadratic Voting (QV)

**Description:**  
Quadratic voting is a mechanism designed to reduce the influence of wealth in decision-making while still allowing voters to express the intensity of their preferences.

**How It Works:**
- Voters "pay" credits to cast votes on proposals
- The cost of additional votes increases quadratically
- Voting power = (number of votes)²
- Example: 1 vote = 1 power, 2 votes = 4 power, 3 votes = 9 power

**Key Characteristics:**
- Limits wealth-based manipulation
- Allows expression of preference intensity
- Reduces plutocratic tendencies

**Challenges:**
- Still favors wealthier participants (contradicts "one-person-one-vote" ideals)
- Complex to implement and understand
- Credit allocation can be arbitrary

**Use Cases:**  
Used by Gitcoin and various DAO governance frameworks to balance influence.

---

## 3. Conviction Voting

**Description:**  
Conviction voting is a continuous, non-time-boxed mechanism where the weight of a vote increases the longer it remains unchanged. It's specifically designed for funding allocation decisions.

**How It Works:**
- Voters express preferences for proposals at any time
- Conviction accumulates over time following a half-life decay curve
- When collective conviction exceeds a threshold, the proposal passes
- Changing votes sacrifices accumulated conviction

**Key Characteristics:**
- **Time-weighted influence:** Long-term community members have more influence
- **Last-minute attack resistant:** Cannot swing votes at the last moment
- **Continuous:** No fixed voting periods
- **Sybil-resistant:** Difficult to manipulate with multiple accounts

**Mathematical Basis:**  
Derived from Dr. Michael Zargham's "Social Sensor Fusion" research. Conviction grows according to decay curves, similar to how action potentials work in neurons.

**Challenges:**
- Slower decision-making
- Complex to simulate and predict outcomes
- May disadvantage quick responders to new proposals

**Source:** Giveth/Commons Stack research papers

---

## 4. Holographic Consensus

**Description:**  
Holographic consensus aims to solve the scalability-resilience dilemma by using prediction markets to surface the most representative proposals.

**How It Works:**
- DAO members stake tokens on proposals they believe will pass
- Proposals with high "staked confidence" can be fast-tracked
- Successful proposal backers earn rewards
- The system optimizes for achieving "global opinion" with minimum participation

**Key Characteristics:**
- **Scalable:** Reduces need for full DAO participation on every proposal
- **Resilient:** Prediction market mechanics surface quality proposals
- **Self-incentivizing:** Rewards align with good outcomes

**Challenges:**
- Complex mechanism
- Can be undemocratic for those who can't afford to stake
- Requires active prediction market participants

**Source:** DAOStack research

---

## 5. Multi-Signature Voting

**Description:**  
Multi-sig (multi-signature) voting involves a predetermined group of key holders who must reach consensus to execute decisions.

**How It Works:**
- A set of wallets (e.g., 3-of-5, 6-of-9) are authorized to make decisions
- Transactions require a minimum number of signatures to execute
- Can be combined with other voting mechanisms for different proposal types

**Key Characteristics:**
- **Fast execution:** No waiting for full community votes
- **Emergency response:** Enables quick action during crises
- **Trusted group:** Reduces attack surface for routine decisions

**Use Cases:**
- Treasury management
- Protocol parameter updates
- Emergency security responses
- Day-to-day operational decisions

**Challenges:**
- Centralization risk
- Potential for key holder collusion
- Requires trusted individuals

**Source:** Various DAO implementations including Lido, MakerDAO

---

## 6. Off-Chain Voting (Snapshot)

**Description:**  
Snapshot is an off-chain voting system that allows token-weighted voting without requiring gas fees for each vote.

**How It Works:**
- Votes are signed messages (not submitted on-chain)
- Results are aggregated off-chain
- Quorum and majority rules still apply
- Can be combined with on-chain execution

**Key Characteristics:**
- **No gas costs:** Free to vote
- **Flexible:** Supports various voting configurations
- **Popular:** Used by major DAOs including Uniswap, Yearn, Balancer

**Types:**
- Basic (single choice)
- Approval (multiple choices)
- Quadratic
- Ranked choice

---

## 7. Relative Quorum Voting

**Description:**  
A variation where proposals pass when a majority (e.g., 51%) of participating voters vote in favor, regardless of total participation.

**How It Works:**
- No minimum quorum requirement
- Simple majority of votes cast determines outcome
- Faster than absolute quorum systems

**Challenges:**
- Vulnerable to low participation manipulation
- MakerDAO BProtocol flash loan attack (Oct 2020) exploited this mechanism

---

## Comparative Summary

| Mechanism | Speed | Decentralization | Manipulation Resistance | Complexity |
|-----------|-------|-------------------|------------------------|------------|
| Token Quorum | Medium | Low | Low | Low |
| Quadratic Voting | Medium | Medium | Medium | Medium |
| Conviction Voting | Slow | High | High | High |
| Holographic Consensus | Fast | Medium | Medium | Very High |
| Multi-Sig | Very Fast | Low | Medium | Low |
| Snapshot (Off-chain) | Fast | Medium | Low | Low |

---

## Key Takeaways

1. **No perfect mechanism exists** — each involves trade-offs between speed, inclusivity, and security
2. **Many DAOs combine mechanisms** — using multi-sig for operations, conviction voting for funding, and quorum for major decisions
3. **Participation is a persistent challenge** — most DAO voting systems struggle with low turnout
4. **Attack vectors are well-documented** — flash loans, vote buying, and sybil attacks are known risks
5. **Bankless Academy demonstrates** practical implementation through Moloch DAOs with capital-weighted voting

---

## Sources

### Primary (P): Bankless Academy
- "How to create a bankless DAO" — Bankless.com (2023)
- Demonstrates Moloch DAO voting with ETH signature voting

### Secondary (S): Original/Authoritative Sources
- DAOStack: Voting Options in DAOs; Holographic Consensus research
- Giveth/Commons Stack: Conviction Voting explainers
- MakerDAO governance documentation
- Peaka.com: "The Most Common Voting Mechanisms Used by DAOs"
- Wikipedia: Quadratic voting
- Medium publications from governance researchers

---

## Areas for Further Research

- Reputation-based voting systems (Snapshot + Orange)
- Federated voting models
- Rage quit mechanisms and their interaction with voting
- Cross-chain DAO voting coordination
- Legal wrapper considerations for DAO voting validity

---

*Research completed: 2026-02-26*  
*Word count: ~1,100 words (research)*  
*For: voting-mechanisms.md*
