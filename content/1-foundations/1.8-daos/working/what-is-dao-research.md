# Research Brief: What is a DAO?

**Topic:** What is a DAO?  
**Target Audience:** 🔄 Jordan (On-Chain Regen / Practitioner)  
**Sources:** A, B, G (Coordinape), H (Snapshot)  
**Format:** Key concepts [Source X], examples, gaps

---

## Key Concepts

### Definition & Core Characteristics
- **DAO (Decentralized Autonomous Organization):** An organization run by code and collective decision-making rather than traditional hierarchical management [Source A]
- Governed by smart contracts and token-based voting [Source H]
- Enables transparent, permissionless participation [Source A]

### Governance Models
- **Token-based voting:** Members vote proportionally to token holdings [Source H]
- **Multi-sig governance:** Small group of key holders can execute decisions [Source A]
- **Quadratic voting:** Votes weighted by square root of tokens/votes to reduce whale influence [Source H]
- **Hybrid models:** Combining cooperative principles with Web3 tools [Source A]

### DAO Structure Components
- **Treasury:** On-chain funds controlled by governance [Source A]
- **Proposals:** Formalized decision-making requests [Source H]
- **Voting mechanisms:** Various systems for aggregating preferences [Source H]
- **Smart contracts:** Automated execution of ratified decisions [Source A]

---

## Source-Specific Details

### Source A: ReFi DAO Local ReFi Toolkit
- DAOs as coordination mechanism for place-based regenerative projects
- Cooperative Web3 Governance Framework combining cooperative principles with Web3 tools [Source A]
- Community-driven governance structures for local nodes
- Case studies: Costa Rica (cooperative structure), Tanzania (community verification), Barcelona (innovative governance)
- Focus on governance that serves local communities while maintaining decentralization benefits

### Source B: Greenpill Local Regen Guide
- DAOs as organizational tool for local regeneration chapters
- Coordination mechanism for community-led initiatives
- Network effects from connecting local chapters globally

### Source G: Coordinape Docs
- **Gift Circles:** Core feature allowing DAO contributors to decentralize payment by identifying each other's value [Source G]
- **Circles:** Teams of people working together within an organization [Source G]
- **Epochs:** Defined time periods when contributions and allocations are tracked [Source G]
- **GIVE:** Internal token for peer-to-peer reward allocation [Source G]
- **Vouching:** Community mechanism for adding new members - if vouched for by enough existing contributors, they join the circle [Source G]
- **Organizations:** Higher-level structure containing multiple circles [Source G]
- Compensation distribution through Disperse App, Gnosis Safe, or Parcel [Source G]

### Source H: Snapshot Docs
- **Gasless voting:** Create proposals and vote without paying gas fees [Source H]
- **Spaces:** Organization profiles where proposals and votes live [Source H]
- **Flexible voting strategies:** Custom voting power calculation using ERC20s, NFTs, or other contracts [Source H]
- **Proposal validation:** Custom logic to define who can create proposals [Source H]
- **Voting validation:** Define who can cast votes (e.g., minimum token balance) [Source H]
- **Multiple voting systems:** Single choice, approval voting, quadratic voting, weighted voting [Source H]
- **Signed messages:** Votes cast through verifiable signed messages [Source H]
- **Custom branding:** Spaces can use their own branding and domain [Source H]
- Fully open-source with MIT license [Source H]

---

## Direct Quotes Worth Including

> "Snapshot is an off-chain gasless multi-governance client which results are easy to verify and hard to contest." [Source H]

> "Coordinape's core feature is the Gift Circle, which allows a group of DAO contributors to decentralize the payment process, identifying each other's value to the organization to create a compensation map." [Source G]

> "DAOs enable communities to coordinate resources and make decisions without traditional hierarchical structures." [Source A]

---

## Examples/Case Studies

### ReFi DAO Network
- Global regenerative economy rooted in local communities [Source A]
- Place-based nodes and initiatives using Web3 to restore ecosystems
- Local ReFi Toolkit with implementation guides and case studies

### Coordinape
- Originally spun out of Yearn Finance
- Used by numerous DAOs for contributor compensation
- Enables peer-to-peer recognition without manager approval

### Snapshot Spaces
- Used by major DeFi protocols (Uniswap, Aave, Compound)
- NFT communities (Bored Ape Yacht Club)
- Grant programs (Gitcoin)

---

## Tools Mentioned

| Tool | Purpose | Source |
|------|---------|--------|
| Snapshot | Off-chain gasless voting | H |
| Coordinape | Compensation & contribution tracking | G |
| Gnosis Safe | Multi-sig treasury management | G |
| Disperse App | Bulk token distribution | G |
| Parcel | Payment infrastructure | G |

---

## Gaps: What Sources DON'T Cover

1. **Legal entity formation:** None of the sources address how DAOs integrate with legal frameworks (DAOs as LLCs, foundations, etc.)

2. **Tax implications:** No guidance on tax treatment of DAO governance tokens or treasury

3. **Dispute resolution:** No mention of mechanisms for resolving internal conflicts

4. **Offboarding/exit mechanisms:** How members exit with their share of treasury

5. **KYC/AML compliance:** No discussion of regulatory requirements for DAO participation

6. **Onboarding UX:** Limited guidance on making DAO tools accessible to non-technical members

7. **Scalability challenges:** How governance works as DAOs grow beyond ~100 active members

8. **Treasury management best practices:** Only mentioned in passing, no detailed playbooks

9. **Forking/continuation:** What happens when DAO members want to fork to a new contract

10. **Insurance/risk management:** No coverage of protecting treasury from hacks or losses

---

## Additional Notes for Writer

- **Audience context:** Jordan knows web3 basics, has attended ETH Denver, works with ReFi protocols, wants to start local chapter
- **Focus:** Practical patterns, playbooks, governance models they can implement
- **Tone:** Skip fundamentals like "what is a smart contract" - they know this
- **Emphasis:** How DAOs actually work in practice for regenerative projects
- **Key differentiation:** Emphasize gasless tools (Snapshot) and peer-reward systems (Coordinape) as accessible entry points
