---
title: DAO Governance Models
description: An overview of the main governance models DAOs use to make decisions
  — token voting, quadratic voting, reputation systems, and more.
section: '1.8'
track: 1
status: published
author: unknown
sources: []
target_audience: []
estimated_words: 1050
created: '2026-03-11T09:43:43.151Z'
last_updated: '2026-03-26'
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
tags:
  function: Governance
  domain: Governance
  systems:
    - Polycentric-Governance
    - Decentralization
    - Subsidiarity
audience: DAO-Operator
maturity: Intermediate
related:
  - voting-mechanisms
  - what-is-dao
  - daos-vs-traditional
  - is-dao-right
---

# DAO Governance Models

A Decentralized Autonomous Organization — DAO — operates through smart contracts on a blockchain. Unlike traditional organizations with hierarchical structures and centralized leadership, DAOs distribute decision-making authority among their members, who participate collectively in shaping the organization's direction. When consensus is reached, actions are automatically executed by smart contracts, eliminating the need for intermediaries and ensuring that agreed-upon rules are enforced impartially.

Every vote and transaction is recorded publicly on the blockchain, creating transparency and making manipulation significantly more difficult.

---

## The Five Main Governance Models

### 1. Token-Weighted Voting

This is the most widely used model. Each governance token equals one vote — the more tokens a member holds, the more voting power they possess. This ties financial investment to decision-making authority.

**Pros:**
- Simple to implement and understand
- Encourages investment and long-term engagement

**Cons:**
- Can lead to whale dominance, where a few large holders control outcomes
- Wealth translates directly into power, which can undermine democratic ideals

**Example:** ENS DAO uses this model for managing Ethereum Name Service decisions.

### 2. Quadratic Voting

Quadratic voting counters the whale problem by allowing multiple votes per person but at an increasing cost. Casting additional votes requires burning exponentially more tokens, creating diminishing returns that prevent wealthy participants from dominating.

**Pros:**
- Fairer representation for smaller holders
- Reduces vote monopolization by wealthy participants

**Cons:**
- More complex to understand and implement
- Requires user familiarity with the underlying mathematics

**Example:** CityDAO uses this model to encourage balanced participation in land acquisition decisions.

### 3. Reputation-Based Governance

In this model, voting power is earned through meaningful contributions rather than simple token ownership. Reputation points accumulate based on activity, value delivered, and demonstrated commitment to the DAO's mission.

**Pros:**
- Rewards active contributors and domain experts
- Encourages engagement over passive holding

**Cons:**
- Measuring reputation is inherently subjective
- Harder to automate and verify on-chain

**Example:** MakerDAO uses reputation scores to prioritize contributor funding and grant allocations.

### 4. Multi-Signature Governance

Decisions are made by a select group of representatives called signers. A predefined threshold of signers must approve actions before execution. This model functions like a board of directors, providing efficiency while maintaining some decentralization.

**Pros:**
- Highly efficient for small-to-medium DAOs
- Reduces centralization risks through built-in checks and balances

**Cons:**
- Can centralize power if signers are not rotated or diversified
- Does not scale well for large communities

**Example:** SafeDAO uses a multi-sig model to coordinate treasury management and protocol upgrades.

### 5. Hybrid Governance

Hybrid models combine elements of multiple governance types. A DAO might use token voting for some decisions while employing reputation-based systems for others, or layer quadratic voting on top of multi-sig structures.

**Pros:**
- Flexibility to adapt over time as needs evolve
- Captures the best elements of multiple systems

**Cons:**
- Can be complex to manage and communicate to members
- Risk of inefficiencies if not well structured

**Example:** Decentraland DAO mixes token voting, reputation, and multi-sig elements to balance flexibility with fairness.

---

## Choosing a Governance Model

The best governance model depends on several factors:

- **Purpose of the DAO:** Mission-driven DAOs may prioritize reputation-based systems that reward aligned contributions.
- **Community size:** Smaller groups can sustain direct democracy; larger communities need scalable mechanisms.
- **Desired level of decentralization:** Some DAOs prioritize radical decentralization while others accept more centralized structures for efficiency.
- **Need for speed versus fairness:** Fast decisions may sacrifice inclusivity; democratic processes take longer but build broader consensus.
- **Scalability:** Will the model work when the community grows from dozens to hundreds of members?

Smaller DAOs might do well with token or multi-sig models that prioritize efficiency, while larger, more diverse communities may need hybrid or quadratic models to ensure fair representation.

---

## Why DAOs Matter

DAOs represent a shift in how organizations are governed:

- **No single point of control:** No single point of failure means no single point of failure
- **Collective decision-making:** Power is shared among members rather than concentrated in executives
- **Automated operations:** Rules are enforced programmatically through smart contracts
- **Broad inclusion:** Anyone with governance tokens or reputation can participate regardless of background

DAOs remove traditional barriers to participation, allowing members to contribute based on merit and participation rather than hierarchical position.

---

## Key Concerns to Keep in Mind

Power concentration remains a concern across all models. Token-weighted voting can unintentionally give all control to a few wealthy participants, sometimes called whales. Even reputation-based systems can become captured by established members who define what counts as valuable contribution. The right governance model should reflect your DAO's specific mission and help maintain appropriate balance.

Emerging mechanisms continue to develop, including quadratic voting, Soulbound Tokens — non-transferable tokens representing earned credentials — and conviction voting, where voting power increases the longer you have participated in a decision. These aim to enhance democratic participation while addressing vulnerabilities to plutocracy, voter apathy, and collusion.

---

## Try This

Think about a decision your community recently made. Who made the final call? How did everyone else have a say? What voting system would have made that decision fairer and more transparent?

Use that reflection to think about which governance model might work for your group — or whether a DAO is even the right tool.

---

## References

- ENS DAO Governance Documentation: docs.ens.domains
- CityDAO Governance Model: citydao.io
- MakerDAO Governance Framework: docs.makerdao.com
- SafeDAO Multi-Sig Governance: safe.global
- Decentraland DAO Structure: dao.decentraland.org
- Quadratic Voting Explained — Essays in Power: essaysinpower.com
- Soulbound Tokens and Reputation Systems — Vitalik Buterin: vitalik.ca
- DAO Governance Best Practices — Overview and models: notion.so
- Conviction Voting: A Novel Continuous Decision-Making Alternative — Giveth: medium.com/giveth
