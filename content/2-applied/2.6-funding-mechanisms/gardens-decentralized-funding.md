---
title: "Gardens Decentralized Funding: A Practical Guide"
description: "Complete guide to Gardens.fund mechanics, conviction voting, and the proposal process for ReFi DAO funding pools"
category: "Funding Mechanisms"
tags: ["funding", "gardens", "conviction-voting", "grants", "decentralized-governance", "refi-dao"]
author: "ReFi DAO (adapted)"
source: "ReFi DAO Garden Pools Setup, Mediterranean GG applications, Network Governance docs"
date: 2026-02-11
---

# Gardens Decentralized Funding: A Practical Guide

[Gardens](https://gardens.fund/) is a decentralized funding platform that enables communities to democratically allocate resources through **conviction voting**. This guide covers the mechanics of Gardens, how ReFi DAO uses it for funding Local Nodes and Network Initiatives, and how to participate effectively.

## What is Gardens?

Gardens is a web3-native funding platform designed specifically for communities working on public goods. It provides tools for:

- **Democratic resource allocation** through novel voting mechanisms
- **Transparent decision-making** with on-chain record keeping
- **Community coordination** through covenant-based membership
- **Sustainable funding** for long-term initiatives

Unlike traditional grant programs with centralized decision-making, Gardens distributes funding authority to the community while maintaining safeguards against spam and manipulation.

---

## Core Mechanism: Conviction Voting

### How Conviction Voting Works

Conviction voting is a novel decision-making mechanism that rewards **sustained, genuine support** over quick decisions:

**The Basics:**
- Members allocate voting power to proposals they believe in
- Support grows stronger over time (50% increase every 7 days)
- Proposals receive funding when they reach a conviction threshold
- Early supporters have more weight than late joiners

**Why It Matters:**

Traditional voting systems can be gamed by last-minute vote swings or whale dominance. Conviction voting:

- Prevents manipulation through "vote sniping"
- Rewards genuine community belief and early commitment
- Allows supporters to "vote with conviction" on multiple proposals
- Creates more stable, predictable funding flows

### Conviction Growth Formula

Your voting power for a proposal increases over time:

| Week | Conviction Multiplier |
|------|----------------------|
| Start | 1x (baseline) |
| Week 1 | 1.5x |
| Week 2 | 2.25x |
| Week 3 | 3.375x |
| Week 4 | 5.06x |

*Note: Conviction grows 50% every 7 days while support is maintained*

This means a supporter who commits early has significantly more influence than someone who joins at the last minute with the same token amount.

---

## ReFi DAO's Funding Pools

ReFi DAO currently maintains two primary funding pools on Gardens:

### Pool 1: Local Node Kickstarter Pool

**Purpose:** Seed funding for new Local Nodes to kickstart regenerative finance activities

**Pool Details:**
- **Total Funding**: 3,000 USDGLO
- **Maximum Request**: 500 USDGLO per proposal (16.7% of pool)
- **Use Cases**: Events, workshops, community building, initial operations

**Eligibility:**
- Must be a newly formed or recently launched Local Node
- Proposal creator must be a ReFi DAO Network Member (Garden member who signed Community Covenant)
- Activities must align with ReFi DAO's mission and values
- Clear plan for how funds will be used

**Pool Parameters:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Voting Token | USDGLO | Stable, impact-aligned currency |
| Voting Weight | Fixed (1 person, 1 vote) | Democratic participation |
| Minimum Conviction | 20% | Threshold for smallest proposals |
| Conviction Growth | 7 days | Time for support to accumulate |
| Collateral | 50 USDGLO | Spam prevention |
| Ruling Time | 7 days | Tribunal review period |
| Default Resolution | Rejected | If Tribunal doesn't rule |

> **Cross-link:** Learn the complete Local Node onboarding process in [[master-onboarding-guide|Master Onboarding Guide]]

### Pool 2: Network Initiatives Pool

**Purpose:** Fund community-led proposals advancing ReFi DAO's broader network goals

**Pool Details:**
- **Total Funding**: 3,000 USDGLO
- **Maximum Request**: 3,000 USDGLO per proposal (100% of pool)
- **Use Cases**: Platforms, research, content production, collaborative gatherings, tooling

**Eligibility:**
- Must directly benefit ReFi DAO network
- Led by a ReFi DAO Member (Core Steward, Contributor, Advisor, or Local Node Lead)
- Demonstrates clear value to network impact, tooling, or culture
- Collaboration focus preferred (showing synergy between members/nodes)

**Pool Parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Voting Token | USDGLO | Fixed weight voting |
| Spending Limit | 100% | Full pool available for major initiatives |
| Minimum Conviction | 20% | Proportionally higher for larger requests |
| Collateral | 67 CELO | Alternative collateral option |

### Funding Sources

ReFi DAO's pools are funded through:
- **Treasury allocations** from ReFi DAO's operational reserves
- **Matching grants** (e.g., 2,800 USDGLO from Gitcoin Gardens GG23 round)
- **Community contributions** and donations

Total initial funding: **5,800 USDGLO** across both pools

---

## The Proposal Process

### Step 1: Become a Network Member

Before creating or supporting proposals, you must:

1. **Join ReFi DAO's Garden**
   - Visit [ReFi DAO Garden](https://app.gardens.fund/gardens/42220/0x4f604735c1cf31399c6e711d5962b2b3e0225ad3/0x13e71c56c5b048e9b8b6a9dbb4a4f346b5dab986)
   - Connect your wallet
   - Sign the Community Covenant

2. **Activate Voting Rights**
   - Stake a minimal amount of USDGLO to enable voting
   - Must be on the allowlist (new members added regularly)
   - Contact Core Stewards if your address needs to be added

> **Cross-link:** Understand membership requirements in [[refi-dao-governance|ReFi DAO Governance Patterns]]

### Step 2: Create a Proposal

**Required Components:**

1. **Title & Summary**
   - Clear, descriptive title
   - One-paragraph summary of what you're proposing

2. **Team Information**
   - Bios of team members
   - Relevant skills and experience
   - Prior work or references

3. **Project Details**
   - What you will deliver
   - How it aligns with ReFi DAO's mission
   - Timeline for completion

4. **Budget Breakdown**
   - Detailed cost breakdown
   - Justification for requested amount
   - How funds will be used

5. **Supporting Materials**
   - Links to relevant work
   - Demos or prototypes
   - Community support or partnerships

**Local Node Proposal Template:**

```
Title: ReFi [City/Region] - Launch Events & Community Building

Summary: 
Request for [X] USDGLO to host 3 introductory ReFi events in [Region], 
establishing local community and educating stakeholders about regenerative finance.

Team:
- [Name]: [Background, relevant experience]
- [Name]: [Background, relevant experience]

Deliverables:
1. Host 3 community events (estimated 50 attendees total)
2. Establish Telegram community (target: 100 members)
3. Create local partnerships with 2+ environmental organizations
4. Publish event recap and learnings

Budget:
- Event costs (venue, refreshments): [X] USDGLO
- Materials and swag: [X] USDGLO
- Documentation: [X] USDGLO
- Buffer (10%): [X] USDGLO
Total: [X] USDGLO

Timeline: 3 months
```

### Step 3: Pay Collateral

To prevent spam, proposal creators must post collateral:
- **Local Node Pool**: 50 USDGLO
- **Initiatives Pool**: 67 CELO

**What happens to collateral:**
- **Returned** if proposal passes or is legitimately disputed and ruled valid
- **Slashed** if proposal is ruled invalid (spam, misalignment, fraud)

### Step 4: Gather Support

Once live, your proposal needs to reach the conviction threshold:

**Strategies for Success:**

1. **Build Early Support**
   - Share proposal in community channels before submitting
   - Get commitments from aligned members
   - Early supporters have exponentially more weight

2. **Communicate Clearly**
   - Explain the "why" behind your proposal
   - Connect to ReFi DAO's mission and values
   - Address potential concerns proactively

3. **Demonstrate Traction**
   - Share updates on progress
   - Highlight community support
   - Show momentum building

4. **Engage with Questions**
   - Respond to comments and concerns
   - Iterate based on feedback
   - Build trust with potential supporters

### Step 5: Receive Funding

When your proposal reaches the conviction threshold:

1. **Automatic Execution**: Funds are released on-chain
2. **Notification**: Community notified of successful funding
3. **Accountability**: Expected to deliver on proposal commitments
4. **Reporting**: Regular updates via Karma GAP or equivalent

---

## Dispute Mechanism

The Tribunal (ReFi DAO Core Stewards as signers) can dispute proposals that:
- Don't demonstrate authentic ReFi or community-building components
- Misuse the ReFi DAO brand or misrepresent the network
- Violate Community Covenant principles
- Appear to be spam or fraudulent

**Dispute Process:**

1. **Dispute Raised**: Tribunal disputes proposal with reasoning
2. **Ruling Period**: 7 days for Tribunal to rule
3. **Possible Outcomes**:
   - **Approved**: Proposal proceeds, collateral returned
   - **Rejected**: Proposal blocked, collateral slashed
   - **Default**: If no ruling, proposal automatically rejected

This safeguard ensures pool integrity while maintaining community control.

---

## Voting Dynamics

### Fixed-Weight Voting

ReFi DAO uses **one person, one vote** (fixed weight) rather than token-weighted voting:

- Each member has equal voting power
- Prevents whale dominance
- Aligns with democratic principles
- Currently uses USDGLO as the voting token with fixed weights

**Why Not Token-Weighted?**

Token-weighted voting can concentrate power among wealthy participants. Fixed-weight voting:
- Ensures equal voice for all members
- Rewards participation and alignment over wealth
- Builds more inclusive decision-making

### Managing Your Conviction

You can:
- **Support multiple proposals** simultaneously (conviction splits across them)
- **Adjust support** by adding or removing conviction from proposals
- **Track growth** watching your voting power increase over time

**Strategy Tips:**
- Spread support across proposals you believe in
- Keep conviction on proposals until they pass
- Removing support reduces your influence (conviction resets)

---

## Accountability & Reporting

### Milestone Tracking

Funded proposals are expected to:
- Deliver on stated objectives
- Provide regular progress updates
- Report challenges and learnings
- Maintain transparency in fund usage

### Karma GAP Integration

ReFi DAO uses [Karma GAP](https://gap.karmahq.xyz/) for impact tracking:
- Post project updates as "Project Activities"
- Track metrics and outcomes over time
- Build reputation through transparent reporting
- Demonstrate accountability to community

### Consequences of Non-Delivery

Consistently failing to deliver on proposals may result in:
- Reduced reputation in the network
- Lower likelihood of future funding
- Potential removal from funding eligibility
- Community discussion of accountability

---

## Comparison with Other Funding Mechanisms

| Mechanism | Decision Making | Speed | Best For | ReFi DAO Usage |
|-----------|----------------|-------|----------|----------------|
| **Gardens (Conviction Voting)** | Community, time-weighted | Medium | Ongoing community funding | Local Nodes, Initiatives |
| **Gitcoin Grants (QF)** | Community, quadratic | Periodic | Public goods funding | Quarterly rounds |
| **RetroPGF** | Retroactive, results-based | Slow | Proven impact | Future consideration |
| **Direct Grants** | Core Steward decision | Fast | Urgent, strategic needs | Special circumstances |
| **Token Swaps** | Negotiated | Variable | Partnerships | Strategic alliances |

> **Cross-link:** Explore other funding approaches in [[funding-landscape|Funding Landscape Overview]]

---

## Getting Started

**Quick Start Checklist:**

- [ ] Join [ReFi DAO Garden](https://app.gardens.fund/gardens/42220/0x4f604735c1cf31399c6e711d5962b2b3e0225ad3/0x13e71c56c5b048e9b8b6a9dbb4a4f346b5dab986)
- [ ] Sign the [Community Covenant](https://claim.hatsprotocol.xyz/42220/13.3.1)
- [ ] Review existing proposals for inspiration
- [ ] Prepare your proposal using the template
- [ ] Gather community feedback before submitting
- [ ] Submit with appropriate collateral
- [ ] Build support through community engagement

**Essential Resources:**

- [Gardens Documentation](https://docs.gardens.fund/)
- [Conviction Voting Explained](https://blog.giveth.io/conviction-voting-a-novel-continuous-decision-making-alternative-to-governance-aa746cfb9475)
- [ReFi DAO Garden Pools](https://www.notion.so/ReFi-DAO-Gardens-Funding-Pools-2082e7251f2f80778e47d12b39178132)

---

## Summary

Gardens provides ReFi DAO with a **community-governed funding mechanism** that:

- ✅ Democratizes resource allocation
- ✅ Rewards sustained conviction over speculation
- ✅ Prevents manipulation through time-weighted voting
- ✅ Maintains safeguards against spam
- ✅ Aligns with regenerative principles of participatory governance

Whether you're seeking funding for a new Local Node or supporting initiatives you believe in, Gardens offers a transparent, fair, and effective way to coordinate collective resources.

---

*This guide synthesizes ReFi DAO's Gardens documentation and implementation experience. For the latest pool parameters and processes, always check the [official ReFi DAO Garden](https://app.gardens.fund/gardens/42220/0x4f604735c1cf31399c6e711d5962b2b3e0225ad3/0x13e71c56c5b048e9b8b6a9dbb4a4f346b5dab986).*
