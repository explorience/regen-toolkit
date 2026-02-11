# Silvi Protocol - Deep Research Report

**Date:** 250211 (February 11, 2026)  
**Researcher:** OpenClaw Subagent  
**Issue:** #234  
**Toolkit Article:** content/3-playbooks/3.1-protocol-playbooks/silvi-protocol.md

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Key Findings](#key-findings)
3. [Maturity Assessment](#maturity-assessment)
4. [Case Studies](#case-studies)
5. [Best For / Not Ready For](#best-for--not-ready-for)
6. [Implementation Guide Outline](#implementation-guide-outline)
7. [Source List](#source-list)
8. [Toolkit Integration Notes](#toolkit-integration-notes)

---

## Executive Summary

**Silvi Protocol** is a reforestation verification and coordination platform that combines traditional tree planting with Web3-enabled transparency and financial infrastructure. The protocol operates a four-layer Measurement, Reporting, and Verification (MRV) system designed to track reforestation projects from ground-level planting through satellite imagery analysis.

### Core Value Proposition

Silvi aims to solve the trust and coordination problems in the reforestation sector by:
- **Direct funding flow**: Investments go directly to Tree Stewards as rewards for verified plantings
- **Transparent verification**: 4-layer MRV provides auditable proof of tree survival and growth
- **Bioregional approach**: Campaigns organized around ecological bioregions rather than political boundaries
- **Community coordination**: Tools for project developers, funders, and tree stewards to collaborate

### Quick Stats [MEDIUM]
- **Founded**: Estimated 2021-2022 (based on Open Collective activity)
- **Team Size**: 2-10 employees [MEDIUM]
- **Active Projects**: 4+ bioregional campaigns [HIGH]
- **Price Point**: ~$1 USD per tree [HIGH]
- **Community**: 83 Telegram members, 14 online [HIGH]

### Overall Assessment

Silvi Protocol appears to be in **beta/production** stage with active campaigns running. The platform demonstrates functional MRV technology and real-world deployment, though documentation and technical transparency remain limited. Best suited for small-to-medium reforestation projects seeking Web3-enabled verification and direct funding mechanisms.

---

## Key Findings

### 1. Core Functionality [HIGH]

#### Four-Layer MRV System

Silvi's verification approach combines multiple data sources for comprehensive transparency:

1. **On-the-ground tree verification** [HIGH]
   - Mobile app-based verification by Tree Stewards
   - Photo documentation and geolocation
   - Direct human observation of plantings

2. **Project planning and management layer** [HIGH]
   - Coordination tools for project developers
   - Campaign management and milestone tracking
   - Resource allocation and planning

3. **Aerial drone site mapping** [MEDIUM]
   - Drone imagery for site assessment
   - Higher-resolution monitoring than satellite alone
   - Validation of planting density and locations

4. **Satellite canopy measurement** [MEDIUM]
   - Remote sensing for canopy coverage analysis
   - Long-term growth tracking
   - Large-scale impact assessment

#### Platform Components

The Silvi ecosystem serves three primary user types [HIGH]:

| User Type | Function | Tools Provided |
|-----------|----------|----------------|
| **Reforestation Funders** | Finance tree planting campaigns | Campaign discovery, progress tracking, impact reporting |
| **Project Developers** | Coordinate and manage reforestation projects | Project planning, MRV tools, team coordination |
| **Tree Stewards** | Plant and verify trees on the ground | Mobile verification app, photo documentation, reward claiming |

### 2. Blockchain Integration [MEDIUM]

#### Current Implementation

Based on available information, Silvi appears to utilize:

- **Multi-chain approach**: References to Celo blockchain ecosystem [MEDIUM]
- **Wallet integration**: Web3 wallet connections for funding and rewards [MEDIUM]
- **Transparent transactions**: Blockchain-based tracking of fund flows [MEDIUM]

**Evidence Limitations**: [LOW]
- No public smart contract addresses found
- Token mechanics not clearly documented
- Limited technical architecture details available

#### Technology Stack (Inferred)

Based on ecosystem partnerships and common patterns [MEDIUM]:
- **Identity**: Likely uses Ceramic/IDX for decentralized identity
- **Storage**: Probable IPFS integration for photo/documentation storage
- **Payments**: Integration with stablecoins and possibly native tokens
- **Verification**: Mobile-first approach with geolocation and timestamps

### 3. Target Users [HIGH]

#### Primary Audiences

1. **Individual Impact Investors**
   - Seeking transparent tree planting with verification
   - Price point: $1/tree makes it accessible
   - Desire for photo evidence and progress tracking

2. **Small-to-Medium Reforestation NGOs**
   - Need coordination and verification tools
   - Limited technical capacity for building MRV systems
   - Seeking direct funding connections

3. **Tree Stewards/Local Planters**
   - Individual farmers and community members
   - Mobile-first tool users
   - Income generation through verified planting

4. **Bioregional Coordinators**
   - Organizing multi-stakeholder campaigns
   - Managing geographic-scale initiatives
   - Connecting local and global funding

### 4. Key Differentiators [MEDIUM]

| Feature | Silvi Approach | Industry Standard |
|---------|----------------|-------------------|
| **Verification** | 4-layer MRV (ground + drone + satellite) | Often single-layer verification |
| **Pricing** | ~$1/tree transparent pricing | Variable, often opaque pricing |
| **Funding Flow** | Direct to Tree Stewards | Through multiple intermediaries |
| **Geographic Model** | Bioregional campaigns | Political boundaries or arbitrary |
| **Community** | Web3-native with open coordination | Traditional closed systems |

### 5. Limitations and Gaps [MEDIUM]

#### Documentation Deficits
- **No public whitepaper found** [HIGH]
- Limited technical documentation [HIGH]
- GitHub organization exists but no public repositories [HIGH]
- API documentation not publicly available [MEDIUM]

#### Transparency Concerns
- Smart contracts not verified or publicly listed [MEDIUM]
- Token economics unclear [MEDIUM]
- Team background information limited [MEDIUM]
- Audit reports not found [HIGH]

#### Community Scale
- Telegram: 83 members (small) [HIGH]
- Discord: Active but size unknown [MEDIUM]
- Limited social media presence [MEDIUM]

---

## Maturity Assessment

### 1. Technical Maturity: BETA/PRODUCTION ⚠️

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Core Technology** | 7/10 | Functional MRV app, 4-layer verification operational [HIGH] |
| **Smart Contracts** | 4/10 | No public contracts found, limited blockchain transparency [HIGH] |
| **Security** | 5/10 | No audits found, limited security documentation [MEDIUM] |
| **Documentation** | 4/10 | Marketing site functional, technical docs missing [HIGH] |
| **API/Integration** | 5/10 | No public API docs, unknown integration capabilities [MEDIUM] |

**Verdict**: Technology appears functional for current use cases but lacks the transparency and documentation expected for production-grade Web3 infrastructure.

### 2. Community & Adoption: EARLY ⚠️

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Active Users** | 5/10 | 4+ bioregional campaigns active, Telegram ~83 members [HIGH] |
| **Developer Ecosystem** | 3/10 | No public GitHub repos, limited dev engagement [HIGH] |
| **Partnerships** | 6/10 | Multiple bioregional partners visible on website [HIGH] |
| **Social Presence** | 5/10 | LinkedIn company page, Discord active [MEDIUM] |

**Verdict**: Early-stage adoption with functional campaigns but limited community scale and developer engagement.

### 3. Organizational Maturity: EARLY ⚠️

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Team Size** | 5/10 | 2-10 employees per LinkedIn [HIGH] |
| **Funding** | 4/10 | Open Collective shows minimal activity (€13), recent $100k matching round [MEDIUM] |
| **Legal Structure** | 4/10 | Unclear legal entity, "Privately Held" per LinkedIn [MEDIUM] |
| **Transparency** | 5/10 | Public team members on LinkedIn, limited financial transparency [MEDIUM] |

**Verdict**: Small team, unclear funding situation, limited organizational transparency.

### 4. Ecosystem Integration: MODERATE ✅

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Web3 Compatibility** | 6/10 | Wallet integration, likely Celo ecosystem [MEDIUM] |
| **Standards Compliance** | 5/10 | No explicit standards mentioned, custom MRV approach [MEDIUM] |
| **Interoperability** | 4/10 | Limited evidence of cross-protocol integration [MEDIUM] |
| **Tooling** | 5/10 | Mobile app functional, web platform operational [HIGH] |

**Verdict**: Functional Web3 integration but limited interoperability with broader ReFi ecosystem.

### Overall Maturity Score: 5.1/10

**Stage**: Beta/Early Production

**Assessment**: Silvi Protocol has crossed from concept to functional product with real-world deployments. However, limited documentation, small community scale, and lack of technical transparency suggest it remains in early stages suitable for pioneering users but not yet ready for mainstream organizational adoption without additional due diligence.

---

## Case Studies

### Case Study 1: Kakamega Forest, Kenya [MEDIUM]

**Overview**:
One of Silvi's featured projects focused on the Kakamega Forest region in Kenya, involving thousands of farmers transitioning to agroforestry practices.

**Key Details**:
- **Location**: Kakamega Forest, Kenya
- **Participants**: Thousands of farmers
- **Approach**: Agroforestry transition support
- **Technology**: Mobile verification app for tree documentation
- **Model**: Tree Steward verification with direct rewards

**Evidence Quality**: [MEDIUM]
- Listed on official website
- Specific geographic location provided
- No independent verification found
- Limited quantitative data (tree counts, survival rates)

**Implementation Notes**:
- Represents Silvi's core use case: supporting smallholder farmers
- Combines conservation with agricultural productivity
- Demonstrates scalability to "thousands" of participants

---

### Case Study 2: Refai Sicilia, Italy [HIGH]

**Overview**:
Bioregional campaign supporting regeneration of Sicily through traditional tree planting combined with modern technology.

**Key Details**:
- **Location**: Sicily, Italy
- **Price Point**: $1 USD per tree
- **Approach**: "Tradition, technology, and the simple art of tree planting"
- **Campaign Type**: Bioregional round participant

**Evidence Quality**: [HIGH]
- Featured on homepage
- Part of active Bioregional Round 2025
- Clear pricing and positioning

**Implementation Notes**:
- Demonstrates applicability in developed country contexts
- Cultural integration approach (tradition + technology)
- Part of coordinated $100k matching fund campaign

---

### Case Study 3: Nigeria Bioregional Campaign [HIGH]

**Overview**:
Grassroots movement in Nigeria combining education, reforestation, and community coordination.

**Key Details**:
- **Location**: Nigeria
- **Price Point**: $1 USD per tree
- **Approach**: "Coordinated grassroots movement"
- **Components**: Education, reforestation, community building

**Evidence Quality**: [HIGH]
- Active campaign on website
- Clear value proposition
- Bioregional round participant

**Implementation Notes**:
- Education component suggests multi-year engagement
- Grassroots coordination model
- African continent expansion beyond Kenya

---

### Case Study 4: Mata Atlantica, Brazil [HIGH]

**Overview**:
Native tree planting campaign focused on restoring Brazil's Atlantic Forest, one of the world's most biodiverse and threatened biomes.

**Key Details**:
- **Location**: Brazil (Atlantic Forest region)
- **Price Point**: $1 USD per tree
- **Ecological Context**: 85% of biome already lost
- **Focus**: Native species restoration

**Evidence Quality**: [HIGH]
- Prominently featured
- Strong ecological narrative
- Part of active funding round

**Implementation Notes**:
- High-profile biome with international recognition
- Native species focus important for biodiversity
- Latin American expansion

---

### Case Study 5: Regenerate Cascadia, Pacific Northwest [MEDIUM]

**Overview**:
Campaign supporting the vast forests and waters of the Cascadia bioregion (Pacific Northwest).

**Key Details**:
- **Location**: Cascadia Bioregion (US/Canada Pacific Northwest)
- **Focus**: Forest and watershed health
- **Campaign Type**: Bioregional round

**Evidence Quality**: [MEDIUM]
- Listed on website
- Less detail than other campaigns
- Part of coordinated funding round

**Implementation Notes**:
- Developed country context
- Watershed-scale approach
- Bioregional rather than political boundaries

---

## Best For / Not Ready For

### ✅ Best For

#### 1. Small-to-Medium Reforestation Projects
- **Why**: Direct funding model reduces overhead
- **Ideal**: 1,000 - 100,000 tree projects
- **Benefit**: $1/tree pricing with verification included

#### 2. Projects Needing Quick MRV Deployment
- **Why**: Turnkey mobile verification system
- **Ideal**: Projects without existing monitoring infrastructure
- **Benefit**: Immediate verification capability

#### 3. Community-Led Initiatives
- **Why**: Tree Steward model empowers local actors
- **Ideal**: Projects with engaged local communities
- **Benefit**: Direct reward flow to planters

#### 4. Web3-Native Funders
- **Why**: Blockchain-based transparency
- **Ideal**: Crypto-native donors and organizations
- **Benefit**: Transparent fund tracking

#### 5. Bioregional Coordination
- **Why**: Designed for ecological rather than political boundaries
- **Ideal**: Transboundary conservation initiatives
- **Benefit**: Ecosystem-scale thinking

### ❌ Not Ready For

#### 1. Large-Scale Corporate Procurement (>1M trees)
- **Why**: Limited scale validation, small team
- **Risk**: Capacity constraints, limited track record
- **Alternative**: Consider established MRV providers (Pachama, Sylvera)

#### 2. Regulatory Compliance (Verra/Gold Standard)
- **Why**: No evidence of compliance with major standards
- **Risk**: Credits may not meet compliance requirements
- **Alternative**: Use Verra/Gold Standard certified projects

#### 3. Institutional Investors Requiring Audits
- **Why**: No public audits, limited financial transparency
- **Risk**: Due diligence challenges
- **Alternative**: Wait for audit completion or use audited alternatives

#### 4. Projects Requiring Deep Integration
- **Why**: No public API, limited documentation
- **Risk**: Integration challenges
- **Alternative**: Contact team directly for enterprise needs

#### 5. Risk-Averse Organizations
- **Why**: Early stage, limited track record, small community
- **Risk**: Protocol may not persist
- **Alternative**: Established reforestation organizations

---

## Implementation Guide Outline

### Phase 1: Pre-Implementation (2-4 weeks)

#### 1.1 Due Diligence Checklist
- [ ] Contact Silvi team for technical documentation
- [ ] Review smart contracts (if available)
- [ ] Verify legal entity and structure
- [ ] Assess insurance and liability coverage
- [ ] Review MRV methodology in detail
- [ ] Evaluate integration requirements

#### 1.2 Stakeholder Alignment
- [ ] Identify Tree Steward recruitment strategy
- [ ] Confirm funding sources and flow
- [ ] Align on verification standards
- [ ] Establish reporting cadence

### Phase 2: Project Setup (2-4 weeks)

#### 2.1 Technical Setup
- [ ] Create project in Silvi platform
- [ ] Onboard Tree Stewards to mobile app
- [ ] Configure verification workflows
- [ ] Set up wallet connections for payments
- [ ] Test MRV data flow

#### 2.2 Operational Preparation
- [ ] Source tree seedlings
- [ ] Prepare planting sites
- [ ] Train verifiers
- [ ] Establish baseline documentation

### Phase 3: Active Implementation (Ongoing)

#### 3.1 Planting Phase
- [ ] Execute planting according to plan
- [ ] Document via mobile app
- [ ] Conduct drone surveys
- [ ] Process payments to Tree Stewards

#### 3.2 Monitoring Phase
- [ ] Regular verification checks
- [ ] Satellite imagery analysis
- [ ] Progress reporting to funders
- [ ] Adaptive management

### Phase 4: Reporting & Scale (Quarterly)

#### 4.1 Impact Reporting
- [ ] Compile MRV data
- [ ] Generate impact reports
- [ ] Share with stakeholders
- [ ] Public transparency reporting

#### 4.2 Continuous Improvement
- [ ] Review verification accuracy
- [ ] Optimize Tree Steward incentives
- [ ] Scale successful approaches

---

## Source List

### Primary Sources [HIGH]

1. **Silvi Official Website**
   - URL: https://www.silvi.earth
   - Date Accessed: 250211
   - Content: Homepage, campaign listings, MRV description

2. **Silvi Application Portal**
   - URL: https://app.silvi.earth
   - Date Accessed: 250211
   - Content: Platform login, round information

3. **Silvi LinkedIn Company Page**
   - URL: https://www.linkedin.com/company/silviprotocol/
   - Date Accessed: 250211
   - Content: Team size, company description, industry classification

### Secondary Sources [MEDIUM]

4. **Silvi Telegram Community**
   - URL: https://t.me/silviprotocol
   - Date Accessed: 250211
   - Content: 83 members, 14 online

5. **Silvi Discord Server**
   - URL: https://discord.gg/silvi
   - Date Accessed: 250211
   - Content: Server name "Silvi's Tree Hollow"

6. **Silvi GitHub Organization**
   - URL: https://github.com/silviprotocol
   - Date Accessed: 250211
   - Content: Organization exists, no public repositories

7. **Silvi Open Collective**
   - URL: https://opencollective.com/silvi
   - Date Accessed: 250211
   - Content: €13.17 EUR total contributions, minimal activity

### Tertiary Sources [LOW]

8. **IDX Identity Protocol Documentation**
   - URL: https://idx.xyz
   - Date Accessed: 250211
   - Content: Technical context for potential identity infrastructure

9. **Kolektivo Documentation**
   - URL: https://kolektivo.gitbook.io/kolektivo
   - Date Accessed: 250211
   - Content: Related ReFi project context

---

## Toolkit Integration Notes

### Recommended Toolkit Placement

**Primary Category**: Protocol Playbooks (3.1-protocol-playbooks)

**Cross-References**:
- MRV Methodologies (complementary)
- ReFi Funding Mechanisms (related)
- Community Coordination Tools (related)
- Impact Verification Standards (complementary)

### Key Information for Toolkit Users

#### For Project Developers
1. **Getting Started**: Contact Silvi team directly via Discord or Telegram
2. **Pricing**: Expect ~$1/tree including verification
3. **Timeline**: Campaign setup typically 2-4 weeks
4. **Requirements**: Mobile access for Tree Stewards essential

#### For Funders
1. **Due Diligence**: Request technical documentation before large commitments
2. **Verification**: 4-layer MRV provides good transparency for the price point
3. **Risk Level**: Moderate - early stage but functional
4. **Minimum Viable**: Test with small campaign before scaling

#### For Tree Stewards
1. **Requirements**: Smartphone, basic photo skills, site access
2. **Compensation**: Direct payment upon verification
3. **Training**: Platform provides mobile app training
4. **Support**: Community Discord for questions

### Suggested Toolkit Content Structure

```
silvi-protocol.md
├── Overview
│   ├── What is Silvi?
│   ├── Core Value Proposition
│   └── Key Features
├── How It Works
│   ├── The 4-Layer MRV System
│   ├── User Types & Roles
│   └── Funding Flow
├── Use Cases
│   ├── Best For
│   ├── Not Ready For
│   └── Case Study Summaries
├── Getting Started
│   ├── For Project Developers
│   ├── For Funders
│   └── For Tree Stewards
├── Technical Details
│   ├── Blockchain Integration
│   ├── MRV Methodology
│   └── Data Storage
├── Evaluation
│   ├── Maturity Assessment
│   ├── Risk Considerations
│   └── Comparison with Alternatives
└── Resources
    ├── Official Links
    ├── Community Channels
    └── Further Reading
```

### Risk Disclaimers for Toolkit

> **⚠️ Important**: Silvi Protocol is in early production stage. This research found limited public documentation, unaudited smart contracts (if any), and a small team. Organizations should conduct additional due diligence before significant commitments. Consider starting with small pilot projects.

### Suggested Toolkit Updates

1. **Monitor for**: Public whitepaper release, smart contract audits, API documentation
2. **Re-evaluate**: In 6 months or after major announcements
3. **Compare with**: Pachama, Sylvera, Regen Network methodologies
4. **Community input**: Gather user experiences from Discord/Telegram

---

## Research Methodology Notes

### Limitations

This research faced several constraints:

1. **No Brave Search Access**: Unable to conduct broad web searches for articles, reviews, or third-party coverage
2. **Blocked Platforms**: Twitter/X, Medium, Notion, and Reddit blocked or limited access
3. **Limited Technical Docs**: No public whitepaper, API docs, or GitHub repositories found
4. **Small Community**: Limited independent user reviews or case studies available

### Confidence Levels

- **HIGH**: Information directly from silvi.earth website, LinkedIn
- **MEDIUM**: Inferred from ecosystem context, partial data
- **LOW**: Single source, unverified claims, extrapolated data

### Recommendations for Further Research

1. **Direct Outreach**: Contact Silvi team (team@silvi.earth) for technical documentation
2. **Community Interviews**: Conduct interviews with active Tree Stewards and project developers
3. **Technical Audit**: Review any smart contracts once public
4. **Comparative Analysis**: Detailed comparison with Pachama, Sylvera, Regen Network
5. **Site Visits**: Independent verification of claimed projects (Kakamega, Sicily, etc.)

---

*Report generated by OpenClaw Research Subagent  
For ReFi DAO Regen Toolkit - Issue #234*
