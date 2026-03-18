# Research Brief: Tokens as Coordination Tools

**Article:** Tokens as Coordination Tools  
**Target Audience:** Regenerative practitioners exploring Web3  
**Sources:** P (Bankless Academy), S (SuperBenefit Knowledge Garden + other sources)  
**Date:** 2026-02-27

---

## Key Concepts

### What Are Tokens in this Context?
- Tokens are digital assets on a blockchain that can represent ownership, voting rights, access, or value. In the context of coordination, they function as **mechanisms for collective decision-making and resource allocation** without traditional hierarchical leadership. [Source S]
- In DAO governance, tokenization determines users' rights to conditionally perform actions based on their ownership of an asset. These tokens function as transferable data elements on the blockchain. [Source S]
- Tokens turn users into "decentralized policymakers" — giving them direct stakes in organizational decisions. [Source S]

### Mechanisms of Coordination

#### 1. Signaling
- Token holdings can serve as signals of commitment or stake in a community's success
- Off-chain signaling tools like Snapshot allow token holders to express preferences before formal on-chain votes
- Signal strength typically correlates with token quantity, creating weighted preference expression

#### 2. Voting (Token-Weighted)
- **Voting power is typically proportional to token holdings** — more tokens = more influence on decisions
- Token holders can vote on proposals, changes, and governance matters
- Voting is recorded on-chain, providing transparent audit trails
- Common platforms: Tally (on-chain governance), Snapshot (off-chain)
- Proposal submission typically requires a threshold of tokens or community support

#### 3. Reputation Systems
- Reputation-Based Governance (RBG) uses contributions and participation history rather than just token wealth
- Members earn reputation points through contributions and engagement
- Higher reputation can lead to increased access, lower fees, or enhanced privileges
- Encourages active involvement and can mitigate risks of pure token concentration
- Examples: Colony (task management + reputation), DAOstack

#### 4. Incentives & Penalties
- **Incentives for participation**: rewards for voting, staking bonuses, access to exclusive features
- **Penalties for inactivity/malicious behavior**: reduced rewards, slashing (forced loss of tokens), loss of voting rights
- Aligns individual interests with collective ecosystem health
- Example: In MakerDAO, users stake ETH as collateral, and their incentive to avoid liquidation aligns with the protocol's stability goals

### Additional Coordination Mechanisms

#### Quadratic Voting
- A system where voting costs increase quadratically with the number of votes cast, reducing the influence of large token holders
- Designed to prevent plutocracy while still allowing expression of preference strength

#### Delegated Voting (Liquid Democracy)
- Token holders can delegate their votes to trusted representatives
- Allows passive members to have their voice heard without active participation
- MakerDAO example: proxy delegates can control significant voting power (9.16% individually)

#### Soulbound Tokens (SBTs)
- Non-transferable tokens tied to an identity
- Represent credentials, contributions, or memberships
- Can reduce "Sybil attacks" (fake identities manipulating governance)

---

## Examples of DAOs Using Tokens for Coordination

### MakerDAO
- **Purpose**: Lending protocol overseeing the DAI stablecoin
- **Token**: MKR (governance token)
- **Mechanism**: MKR holders vote on key parameters including stability fees, collateral requirements, and risk management strategies
- **Notable**: Overcollateralization model ensures users' incentives to avoid liquidation align with protocol stability goals
- **Concern**: Large holders (venture capital firms) have historically acquired significant MKR (6% by Andreessen Horowitz in 2018, 5.5% by Dragonfly/Paradigm in 2019)

### MolochDAO
- **Purpose**: Funding Ethereum public goods and infrastructure
- **Mechanism**: Token holders vote on grant proposals, collectively funding projects
- **Focus**: Areas where traditional venture capital doesn't invest — public goods

### SuperBenefit DAO
- **Purpose**: Researching and incubating web3 initiatives for systems transformation
- **Token**: $SPRB (fixed supply governance token)
- **Structure**: Organized into Circles (cells) with distinct purposes; $SPRB holders vote on strategic decisions
- **Notable**: Contributors receive tokens for work, aligning incentives with mission
- **Source**: [Source S]

### Gitcoin DAO
- **Purpose**: Funding open-source public goods through quadratic voting
- **Mechanism**: Uses quadratic funding to amplify small contributions, preventing large donors from dominating
- **Result**: Has funded millions in open-source developer grants

### KlimaDAO (Regenerative Context)
- **Purpose**: Accelerating climate action through tokenized carbon markets
- **Mechanism**: Tokens coordinate around carbon offset purchasing and retirement
- **Connection to Regeneration**: Aligns DeFi incentives with sustainability goals

### Aragon
- **Purpose**: Platform for creating and managing DAOs
- **Token**: ANT (Aragon Network Token)
- **Notable**: Enables anyone to spin up a DAO with customizable governance

---

## Quotes

### On Token-Based Governance & Plutocracy Risks
> "In token-based governance, voting power is typically proportional to token holdings. Early adopters or participants with more resources who acquired tokens at lower prices are more likely to gain disproportionate influence over governance decisions. This dynamic reinforces itself in a negative feedback loop, where those with more tokens can shape governance to favor policies that benefit them, further consolidating their power."
— [Source S - Frontiers in Blockchain, 2025]

### On Capture-Resistant Governance
> "We must come up with methods of managing shared resources with significantly lower risk of capture. Blockchains and smart contracts have revealed a new trust model for governance over shared resources that relies instead on a combination of cryptography and wide distribution of power. This model makes possible a new category of governance, called capture-resistant governance."
— [Source S - Anticapture Framework, SuperBenefit Knowledge Garden]

### On Regenerative Alignment
> "DAOs like KlimaDAO and Regen Network [are] emerging experiments to align decentralized finance with sustainability goals."
— [Source S - Frontiers in Blockchain, 2025]

### On Decentralized Governance Potential
> "A DAO is an organization that is run by smart contracts on a blockchain, allowing for automated and decentralized decision-making. Key characteristics include: decentralization (no central authority), autonomy (operates independently once deployed), transparency (all transactions recorded on-chain), and token-based governance."
— [Source S - Rapid Innovation]

---

## Useful Links

### Primary Sources
- **SuperBenefit Knowledge Garden (Anticapture Framework)**: https://knowledge.superbenefit.org/links/Anticapture — Comprehensive framework for designing capture-resistant governance systems [Source S]
- **SuperBenefit Official Site**: https://superbenefit.org/ — DAO researching web3 for systems transformation [Source S]
- **Frontiers in Blockchain (2025)**: https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2025.1538227/full — Academic analysis of DAO governance vs Ostrom's principles

### Governance Tools
- **Tally**: https://tally.xyz/ — On-chain governance platform for DAOs
- **Snapshot**: https://snapshot.org/ — Off-chain voting/signing platform
- **Boardroom**: https://boardroom.io/ — Governance monitoring

### Educational
- **Bankless Academy**: https://app.banklessacademy.com/ — Free web3 education platform [Source P]
- **DAOstack**: https://daostack.io/ — Framework combining governance and funding

### Regenerative/ReFi Specific
- **Regen Network**: https://www.regen.network/ — Blockchain for ecological regeneration
- **KlimaDAO**: https://www.klimadao.finance/ — Tokenized carbon markets

---

## Gaps & Contested Areas

### 1. Voter Apathy
- **Problem**: Across 30,000 DAOs analyzed, 53% were inactive (no proposals in 6 months), and voter turnout decreases as DAO size increases
- **Specific data**: In Decentraland, average voter participation was 0.79%, median participation 0.16%
- **Contested**: Whether delegation, quadratic voting, or reputation systems solve this remains debated

### 2. Plutocracy vs Democracy
- **Problem**: Token-weighted voting inherently favors the wealthy
- **Contested**: 
  - Some argue this is "skin in the game" alignment
  - Others advocate for reputation-based or quadratic voting as more democratic alternatives
  - Hybrid models are emerging but not yet proven at scale

### 3. Centralization Disguised as Decentralization
- **Problem**: Many "DAOs" concentrate power in multisig signers or small groups despite token voting
- **Note**: SuperBenefit's Anticapture framework specifically addresses this "governance capture" risk [Source S]

### 4. Short-Term vs Long-Term Incentives
- **Problem**: Major token holders with short-term investment horizons may push for policies that maximize immediate token value at the expense of ecosystem health
- **Concern**: Can lead to "shareholder primacy" models rather than sustainable commons management

### 5. Legal & Regulatory Uncertainty
- **Problem**: Lack of clear legal frameworks for DAOs creates uncertainty and risk
- **Contested**: Whether DAOs should seek legal incorporation, remain informal, or develop new legal wrappers

### 6. Environmental Costs
- **Acknowledged gap**: Blockchain infrastructure has significant energy costs (especially Proof-of-Work)
- **Note**: Regenerative DAOs like KlimaDAO explicitly aim to offset this, but the tension remains

### 7. Global Inequality & Neo-Colonial Dynamics
- **Gap**: Blockchain expansion could replicate financial colonialism in the Global South
- **Contested**: Whether web3 tools can truly enable financial inclusion or perpetuate existing inequalities

### 8. Identity & Sybil Attacks
- **Problem**: One person can create multiple wallet addresses to gain disproportionate voting power
- **Contested**: Solutions like proof-of-personhood, Soulbound Tokens, or reputation systems are still developing

---

## Summary for Regenerative Practitioners

Tokens as coordination tools offer powerful new ways for regenerative communities to:

1. **Align incentives** across distributed participants
2. **Enable transparent decision-making** on resource allocation
3. **Fund public goods** (like climate projects) through mechanisms like quadratic funding
4. **Create capture-resistant governance** through the Anticapture framework

**Key caution**: Token-based governance alone is not a silver bullet. The regenerative space must thoughtfully address plutocracy risks, voter apathy, and ensure governance designs genuinely distribute power rather than replicating old hierarchies.

**Further exploration**: The SuperBenefit Knowledge Garden's Anticapture framework provides particularly relevant guidance for designing regenerative DAOs that resist capture and sustain mission alignment over time.

---

*Research note: Further investigation into Bankless Academy specific content on tokens/coordination is recommended, as their platform content was not fully accessible during this research period.*
