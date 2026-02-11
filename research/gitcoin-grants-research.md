# Gitcoin Grants & Quadratic Funding: Deep Research Report

**Research Date**: 2026-02-11  
**Prepared For**: Regen Toolkit - Protocol Playbooks  
**Target Article**: content/3-playbooks/3.1-protocol-playbooks/gitcoin-grants.md  
**Issue**: #229

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Quadratic Funding Explained](#2-quadratic-funding-explained)
3. [Key Findings](#3-key-findings)
4. [Maturity Assessment](#4-maturity-assessment)
5. [Case Studies](#5-case-studies)
6. [Application Guide Outline](#6-application-guide-outline)
7. [Comparison to Traditional Grants](#7-comparison-to-traditional-grants)
8. [Source List](#8-source-list)

---

## 1. Executive Summary

Gitcoin Grants is the premier platform for quadratic funding (QF) in the Web3 ecosystem, having distributed over **$60M+ to 3,715+ projects** since 2017. Through its innovative matching mechanism, Gitcoin has empowered communities to fund public goods in a democratic way where many small donations outweigh a few large ones.

### Key Numbers

| Metric | Value |
|--------|-------|
| Total Distributed | $60M+ |
| Projects Funded | 3,715+ |
| Unique Supporters | 270,000+ |
| Total Donations | 4.2M+ |
| Fraud Prevented | $3M+ |
| Latest Round (GG24) | Oct 2025 |

### Status Update (2025)

**Major Transition**: Gitcoin sunset its Grants Stack technology on May 27, 2025, returning to its core mission as a funding program. The new Gitcoin 3.0 model introduces:

- **Domain-based allocation**: Problem-specific funding domains (Privacy, Developer Tooling, Interop, etc.)
- **Multi-mechanism approach**: QF, Retro Funding, MACI Private Voting, Conviction Voting
- **Partnership with Giveth**: New infrastructure for rounds
- **Migration to Open Source Observer**: Historical data preservation

### For ReFi Projects

Gitcoin Grants offers regen projects a unique opportunity to:
- Access matching funds from large pools ($200K+ per domain)
- Build community through participatory funding
- Gain visibility in the Ethereum ecosystem
- Leverage the Gitcoin Passport for identity verification

**Confidence Level**: ⭐⭐⭐⭐⭐ (5/5) - Highly recommended for established regen projects

---

## 2. Quadratic Funding Explained

### What is Quadratic Funding?

Quadratic Funding (QF) is a crowdfunding mechanism where the number of contributors matters more than the amount contributed. It democratizes funding by ensuring that broad community support generates significant matching funds—even from small individual donations.

### The Formula

**Matching Amount = (√Contribution₁ + √Contribution₂ + ... + √Contributionₙ)²**

In simpler terms:
- **Many small donations > Few large donations**
- 50 people giving $2 each generates more matching than 1 person giving $100

### How It Works

```
Scenario A: One wealthy donor
- 1 person donates $100
- Matching calculation: √100 = 10
- Matching received: $100

Scenario B: Broad community support
- 100 people donate $1 each
- Matching calculation: (√1 × 100)² = 100² = 10,000
- Matching received: $10,000
```

### Real Example from ReFi DAO

In the GG18 Local Node Beta Round:
- **Matching Pool**: $30,000 cUSD (sponsored by Celo Foundation, Celo Europe, CeLatam)
- **Donations**: 1,550+ contributions totaling $6,700+
- **18 new Local Nodes** received funding
- Top nodes: ReFi Medellín (109 contributions), ReFi Lagos (70), ReFi México (69)

### Why QF Matters for Regen Projects

1. **Democratizes Access**: Small communities can compete with well-funded projects
2. **Validates Demand**: Number of donors signals genuine community interest
3. **Builds Network**: Donors become stakeholders and advocates
4. **Multiplies Impact**: Small donations create outsized matching

---

## 3. Key Findings

### 3.1 Technical Mechanics

**Confidence: ⭐⭐⭐⭐⭐ (5/5)**

| Element | Description |
|---------|-------------|
| **Matching Pool** | Central fund distributed according to QF formula |
| **Crowdfunding** | Direct donations from community members |
| **Sybil Resistance** | Gitcoin Passport verification required |
| **Matching Cap** | Limits on max matching per project (varies by round) |
| **Min Donation** | Usually $1 equivalent to qualify for matching |

### 3.2 Passport Verification

**Confidence: ⭐⭐⭐⭐⭐ (5/5)**

Gitcoin Passport is essential for maximizing matching:

**How It Works**:
- Users verify identity through "Stamps" (verifiable credentials)
- Stamps include: KYC, social media, web3 activity, biometrics
- Minimum score threshold (typically 20+) to qualify for full matching
- Score increases matching weight

**Stamp Categories**:
- **Web3 Activity**: ENS, GitHub, Gitcoin contributions
- **Social**: Twitter, Lens, Farcaster verification
- **Biometrics**: Face uniqueness, liveness checks
- **KYC**: Government ID, phone verification
- **Web of Trust**: Connections to verified humans

**Practical Steps**:
1. Visit https://app.passport.xyz
2. Connect wallet
3. Complete stamp verifications
4. Push stamps onchain (optional but recommended)
5. Maintain score above threshold

### 3.3 Ecosystem Research

**Confidence: ⭐⭐⭐⭐ (4/5)**

#### Historical Rounds (GG1-GG24)

| Round | Era | Key Features |
|-------|-----|--------------|
| GG1-GG14 | Early Era | Quarterly rounds, core protocol |
| GG15-GG18 | Growth Era | Cause rounds, ecosystem expansion |
| GG19 | PGN Era | Public Goods Network launch |
| GG20-GG22 | Multi-chain Era | Optimism, Arbitrum integration |
| GG23 | Multi-mechanism | QF + Retro Funding + Grant Ships |
| GG24 | Domain Era | Domain Allocators, plural mechanisms |

#### ReFi Ecosystem Participation

ReFi DAO has been a consistent participant:

| Round | Participation | Results |
|-------|--------------|---------|
| Beta Round (Apr 2023) | Local Node Featured Round | $25K matching, 14 nodes funded |
| GG18 (Aug 2023) | Local Node Beta Cohort | $30K matching, 18 nodes funded |
| GG19 (Nov 2023) | Web3 Community & Education | Global + 11 Local Nodes |
| GG20+ | Core rounds | Ongoing participation |

**Key Partners**: Celo Foundation, Celo Europe DAO, CeLatam have provided consistent matching pool support.

#### Celo Public Goods Integration

Celo has been a major supporter of regen projects through Gitcoin:
- Sponsored ReFi Local Node rounds ($55K total)
- Supports carbon-negative financial infrastructure
- Funds climate solutions rounds
- Mobile-first focus aligns with emerging market access

### 3.4 Challenges & Mitigations

**Confidence: ⭐⭐⭐⭐ (4/5)**

| Challenge | Mitigation |
|-----------|------------|
| **Sybil Attacks** | Gitcoin Passport, COCM (Connection-Oriented Cluster Matching) |
| **Donor Friction** | Multi-chain checkout, Layer 2 integration (PGN) |
| **Concentration Risk** | Top 10% capture ~45-60% of funds (addressed through cohort design) |
| **Verification Issues** | GitHub linking, multi-sig support improvements |
| **Matching Calculation Complexity** | Real-time matching estimates in UI |

---

## 4. Maturity Assessment

### Platform Stability: ⭐⭐⭐⭐ (4/5)

**Strengths**:
- 7+ years of operation
- $60M+ distributed successfully
- Battle-tested sybil resistance
- Multi-chain infrastructure
- Strong ecosystem partnerships

**Recent Changes** (affecting stability assessment):
- Grants Stack sunset (May 2025) - transition to new infrastructure
- Gitcoin 3.0 model implementation
- Partnership with Giveth for round hosting

**Recommendation**: The platform is mature but undergoing transition. New applicants should verify current process for each round.

### Community Trust: ⭐⭐⭐⭐⭐ (5/5)

**Indicators**:
- 270K+ unique donors
- Major projects continue participation (Uniswap, Optimism origins)
- Transparent on-chain distribution
- Open source codebase
- Active governance (Gitcoin DAO)

### Alternatives Comparison

| Platform | Mechanism | Best For | Maturity |
|----------|-----------|----------|----------|
| **Gitcoin Grants** | QF + Retro | General purpose, OSS | ⭐⭐⭐⭐⭐ |
| **Clr.fund** | QF | Pure QF, curation | ⭐⭐⭐ |
| **Giveth** | QF + Direct | Nonprofits, causes | ⭐⭐⭐⭐ |
| **Optimism RetroPGF** | Retro | Proven impact | ⭐⭐⭐⭐ |
| **Avalanche Grants** | QF | Ecosystem specific | ⭐⭐⭐ |

### Future Roadmap

**Gitcoin 3.0 Direction** (from governance docs):
1. **Plural funding mechanisms**: QF, Retro, Conviction Voting, Peer-Reviewed
2. **Domain specialization**: Deep expertise in specific problem areas
3. **Ecosystem partnerships**: Delegated round management
4. **GTC utility expansion**: Staking, governance improvements

---

## 5. Case Studies

### 5.1 ReFi DAO Global

**Confidence: ⭐⭐⭐⭐⭐ (5/5)**

**Profile**: Hub for regenerative finance, global network of Local Nodes

| Metric | Value |
|--------|-------|
| **Total Raised (All Rounds)** | $100K+ |
| **Matching Sources** | Direct + Local Node support |
| **Key Outcomes** | 40+ Local Nodes, 75+ events, 60K+ podcast listeners |

**Strategy**:
- Applied to Web3 Community & Education rounds
- Coordinated Local Nodes for Featured Rounds
- Leveraged Celo partnerships for matching pools
- Built community through events and content

**Lessons Learned**:
- Community mobilization is key (many small donors > few large)
- Passport verification critical for matching
- Multi-round participation builds reputation
- Local Nodes amplify global impact

**Replication Guidance**:
1. Build community before applying
2. Coordinate with similar projects for Featured Rounds
3. Maintain consistent presence across rounds
4. Document impact metrics clearly

### 5.2 ReFi Medellín

**Confidence: ⭐⭐⭐⭐⭐ (5/5)**

**Profile**: Local Node in Colombia, community-building focus

**GG18 Results**:
- 109 contributions (highest among Local Nodes)
- Strong community mobilization
- Active local events and education

**Success Factors**:
- Local community engagement
- Consistent event programming
- Strong social media presence
- Multi-language outreach

### 5.3 Uniswap (Historical)

**Confidence: ⭐⭐⭐⭐ (4/5)**

**Profile**: DeFi protocol, early Gitcoin Grant recipient

**Journey**:
- Received early funding through Gitcoin Grants
- Used QF to bootstrap community
- Now major ecosystem pillar
- Gives back through matching pools

**Lessons**:
- QF effective for protocol bootstrapping
- Early community building pays dividends
- Gitcoin as launchpad for major projects

### 5.4 Optimism (Historical)

**Confidence: ⭐⭐⭐⭐ (4/5)**

**Profile**: Ethereum L2 scaling solution

**Journey**:
- Funded through Gitcoin Grants in early days
- Now major Ethereum infrastructure
- Runs own RetroPGF program (inspired by Gitcoin)

**Lessons**:
- QF complements traditional fundraising
- Can graduate to own funding mechanisms
- Gitcoin as ecosystem onboarding

### 5.5 Giveth (Ecosystem Partner)

**Confidence: ⭐⭐⭐⭐ (4/5)**

**Profile**: Zero-fee crypto donation platform

**Evolution**:
- Started as Gitcoin Grant recipient
- Now hosts Gitcoin rounds (GG24+)
- Runs own QF rounds
- Partners with Gitcoin on infrastructure

**Lessons**:
- QF can scale to platform level
- Ecosystem collaboration > competition
- Mission alignment enables partnerships

### 5.6 ReFi Barcelona

**Confidence: ⭐⭐⭐⭐ (4/5)**

**Profile**: Local Node in Catalonia, Spain

**Activities**:
- Regular community events
- Regenerant Catalunya program
- Integration with Local ReFi Toolkit
- Gitcoin participation for sustainability

**Strategy**:
- Local/regional focus with global connections
- Event-based community building
- Partnership with local institutions

---

## 6. Application Guide Outline

### 6.1 Pre-Application Checklist

**Before Applying**:
- [ ] Project has clear public goods mission
- [ ] Open source or transparent operations
- [ ] Active community (Discord, social media)
- [ ] GitHub repository (for OSS projects)
- [ ] Impact metrics documented
- [ ] Passport score > 20 (for team)

### 6.2 Application Process (GG24 Model)

**Step 1: Domain Selection**
- Review active domains at https://grants.gitcoin.co
- Identify alignment with project category
- Check eligibility requirements

**Step 2: Project Profile Creation**
- Create profile on Giveth.io (current platform)
- Add comprehensive description
- Link GitHub, website, social media
- Upload impact metrics

**Step 3: Round Application**
- Submit before deadline
- Choose correct category
- Provide detailed impact statements
- Link to previous work

**Step 4: Community Mobilization**
- Prepare community for donation round
- Create social media content
- Schedule reminder posts
- Coordinate with other projects

### 6.3 Maximizing Matching

**Key Strategies**:

1. **Broad Donor Base**
   - Target 100+ unique donors
   - Small amounts ($1-5) are effective
   - Quality over quantity (verified donors)

2. **Passport Optimization**
   - Ensure all donors have Passport
   - Stamps increase matching weight
   - Share Passport setup guide

3. **Timing**
   - Early donations create momentum
   - Final day pushes are common
   - Consistent engagement throughout round

4. **Communication**
   - Clear project description
   - Regular updates during round
   - Thank donors publicly
   - Share impact stories

### 6.4 Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Few large donors** | Focus on broad community outreach |
| **Unverified donors** | Educate about Passport verification |
| **Unclear impact** | Document specific metrics and outcomes |
| **Last-minute application** | Apply early, prepare in advance |
| **Wrong category** | Carefully review domain requirements |
| **No community** | Build community before applying |

---

## 7. Comparison to Traditional Grants

### 7.1 Traditional Grants Model

| Aspect | Traditional |
|--------|-------------|
| **Decision Maker** | Foundation/government committee |
| **Criteria** | Proposal quality, alignment, reputation |
| **Timeline** | 3-12 months application to decision |
| **Reporting** | Extensive, often burdensome |
| **Relationship** | One-way (funder → recipient) |
| **Flexibility** | Restricted to approved activities |
| **Scale** | Large amounts to few recipients |

### 7.2 Quadratic Funding Model

| Aspect | QF (Gitcoin) |
|--------|--------------|
| **Decision Maker** | Community of donors |
| **Criteria** | Community support, demonstrated impact |
| **Timeline** | 2-4 weeks rounds, instant distribution |
| **Reporting** | Light, on-chain transparency |
| **Relationship** | Two-way (community ↔ project) |
| **Flexibility** | Unrestricted use |
| **Scale** | Small-large amounts based on community |

### 7.3 When to Use Each

**Traditional Grants Better For**:
- Large capital requirements ($100K+)
- Established organizations with track record
- Projects requiring regulatory compliance
- Long-term program support

**QF Better For**:
- Community validation of new ideas
- Open source/public goods projects
- Building donor community
- Rapid iteration and experimentation
- Decentralized/autonomous projects

### 7.4 Complementary Approach

**Optimal Strategy for Regen Projects**:
1. Use QF for: Community building, validation, initial funding
2. Use Traditional for: Scale-up, compliance-heavy work, multi-year programs
3. Stack both: QF as leverage for traditional applications (demonstrated support)

---

## 8. Source List

### Official Sources

1. **Gitcoin Official Website**: https://gitcoin.co
2. **Gitcoin Blog**: https://www.gitcoin.co/blog
3. **Gitcoin Grants Handbook (GG24)**: https://www.gitcoin.co/blog/your-handbook-to-gitcoin-grants-24
4. **Gitcoin Governance Forum**: https://gov.gitcoin.co
5. **Gitcoin Grants Stack GitHub**: https://github.com/gitcoinco/grants-stack

### Passport & Identity

6. **Human Passport Docs**: https://docs.passport.xyz
7. **Passport API Reference**: https://docs.passport.xyz/building-with-passport/stamps/passport-api
8. **Passport App**: https://app.passport.xyz

### Technical & Educational

9. **Vitalik's Quadratic Payments Primer**: https://vitalik.eth.limo/general/2019/12/07/quadratic.html
10. **WTF is QF**: https://www.wtfisqf.com
11. **Quadratic Funding Paper (Buterin, Hitzig, Weyl)**: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3243656

### ReFi DAO Sources

12. **ReFi Local Nodes on Gitcoin**: Blog post (Nov 2023)
13. **Support ReFi DAO on GG19**: Blog post (Nov 2023)
14. **ReFi Deep Dive: Gitcoin**: Blog post (Aug 2022)
15. **Gitcoin Grants 21**: ReFi DAO blog coverage

### Round Results & Analysis

16. **GG23 Retro**: https://www.gitcoin.co/blog/gitcoin-grants-23-retro
17. **GG23 Results & Recap**: https://www.gitcoin.co/blog/gg23-results-recap
18. **Grants Stack Wind Down**: https://www.gitcoin.co/blog/grants-stack-winds-down--heres-whats-changing-and-what-to-expect

### Ecosystem Partners

19. **Giveth**: https://giveth.io
20. **Celo Foundation**: https://celo.org
21. **Open Source Observer**: https://opensource.observer

### Governance & Roadmap

22. **Gitcoin 3.0 Road to GG24**: https://gov.gitcoin.co/t/gitcoin-3-0-the-road-to-gigg24/20723
23. **Gitcoin 2025 Strategy**: https://www.gitcoin.co/blog/gitcoin-grants-2025-strategy

### Historical Data

24. **Gitcoin Results/Impact**: https://gitcoin.co/results
25. **Gitcoin Mission**: https://gitcoin.co/mission

---

## Appendices

### A. Key Terminology

| Term | Definition |
|------|------------|
| **QF** | Quadratic Funding - matching mechanism based on number of donors |
| **Matching Pool** | Central fund distributed according to QF formula |
| **Sybil Attack** | Fake accounts gaming the QF system |
| **COCM** | Connection-Oriented Cluster Matching - sybil resistance mechanism |
| **Passport** | Gitcoin's identity verification system |
| **Stamp** | Verifiable credential in Passport |
| **Retro Funding** | Rewards for proven impact (vs. promised impact) |
| **Domain** | Problem-specific funding category in GG24+ |

### B. ReFi DAO Gitcoin Timeline

| Date | Event | Details |
|------|-------|---------|
| Apr 2023 | Beta Round | $25K matching for Local Nodes |
| Aug 2023 | GG18 | $30K matching, 18 nodes funded |
| Nov 2023 | GG19 | Global + Local Nodes participation |
| 2024-2025 | Ongoing | Continued participation in core rounds |

### C. Confidence Level Legend

| Stars | Level | Meaning |
|-------|-------|---------|
| ⭐⭐⭐⭐⭐ | Certain | Verified, official sources |
| ⭐⭐⭐⭐ | High | Multiple sources, consistent |
| ⭐⭐⭐ | Medium | Some sources, may have gaps |
| ⭐⭐ | Low | Limited sources, preliminary |
| ⭐ | Speculative | Single source, unverified |

---

*Research compiled for Regen Toolkit Protocol Playbooks. This report synthesizes public information from official Gitcoin sources, ReFi DAO blog posts, and technical documentation as of February 2026.*
