# Regen Toolkit Subagent Plan

## Executive Summary

This document outlines the creation of a specialized subagent for the **Regen Toolkit** (formerly Local ReFi Toolkit) — an open-source educational content repository focused on regenerative web3 knowledge. The subagent will autonomously develop content, assess tools, map critical paths, and synthesize sources into the 138-article framework.

---

## Project Context

### What is the Regen Toolkit?

A comprehensive, modular educational framework that synthesizes existing ReFi resources while filling critical gaps. It creates clear learning pathways for three distinct audiences entering Web3 from regenerative contexts.

**Repository**: `03 Libraries/regen-toolkit`  
**Current State**: Structure complete (138 placeholder articles), content at 0%  
**License**: CC BY-SA 4.0  
**Collaborators**: ReFi DAO, Greenpill Network, Regen Commons, SuperBenefit

### Three-Track Architecture

| Track | Purpose | Sections | Articles | Status |
|-------|---------|----------|----------|--------|
| **Track 1: Foundations** | Web3 basics for complete beginners | 10 | ~72 | 🔄 0% |
| **Track 2: Applied Web3** | Practical implementation guides | 14 | ~66 | 🔄 0% |
| **Track 3: Playbooks** | Protocol guides, patterns, case studies | 6 | ~50 | 🔄 0% |

### Target Audiences

1. **🌱 Grounded Regen**: Permaculturists, organizers, nonprofit workers new to crypto
2. **💰 Curious Degen**: Crypto-native folks seeking impact opportunities
3. **🔄 On-Chain Regen**: Practitioners wanting to start local initiatives

### Source Ecosystem (15 Sources, A-O)

Key sources include ReFi DAO Toolkit (A), Greenpill Guide (B), Bankless Academy (D), SuperBenefit Knowledge Garden (E), CryptoAltruists (C), and others — each with specific attribution codes and integration priorities.

---

## Subagent Definition

### Name
**`regen-toolkit-builder`** (or `rtb` for short)

### Purpose
Autonomous content developer and knowledge synthesizer for the Regen Toolkit. Transforms placeholder articles into publication-ready content by synthesizing source materials, assessing tool maturity, and mapping critical learning paths.

### Core Responsibilities

1. **Content Development**: Write articles from placeholders using source synthesis
2. **Tool Assessment**: Evaluate protocol maturity and create playbooks
3. **Critical Path Mapping**: Build use-case-specific learning journeys
4. **Source Integration**: Properly attribute and synthesize from 15+ sources
5. **Cross-Linking**: Create dense internal link networks between articles
6. **Progress Tracking**: Update development status and coordination documents

---

## Activation Triggers

Invoke the subagent when:

- [ ] User requests specific article development (e.g., "write the Gitcoin Grants playbook")
- [ ] User specifies a priority section (e.g., "focus on Track 1.5 Wallets & Security")
- [ ] User describes a use case needing critical path development (e.g., "map the university governance class path")
- [ ] User requests tool maturity assessment (e.g., "assess Sylvey protocol readiness")
- [ ] User wants source synthesis from specific sources (e.g., "integrate SuperBenefit DAO patterns")
- [ ] Batch content generation is needed for a priority section
- [ ] Content review and cross-linking is required across multiple articles

---

## Operational Workflow

### Phase 1: Context Gathering

Upon activation, the subagent MUST:

1. **Read Core Documentation**:
   - `AGENTS.md` — Project overview and structure
   - `README.md` — Three-track system, audience definitions
   - `REQUIREMENTS.md` — Questionnaire framework (9 sections)
   - `DEVELOPMENT-WORKFLOW.md` — 6-phase development process
   - `DEVELOPMENT.md` — Current progress and coordination

2. **Analyze Target Area**:
   - Identify specific article(s) or section(s) to develop
   - Check existing placeholder content and frontmatter
   - Review source attribution in article frontmatter
   - Examine related articles for cross-linking opportunities

3. **Map Source Dependencies**:
   - Read relevant source documents from `content/sources/`
   - Identify which sources are tagged for the target article(s)
   - Assess source content availability and quality

### Phase 2: Development Execution

Based on the development type, execute the appropriate workflow:

#### Workflow A: Single Article Development

```
1. Read placeholder article frontmatter
2. Read assigned sources (from frontmatter 'sources' array)
3. Research additional context if needed (web search, source URLs)
4. Synthesize content following article type guidelines
5. Write full article with proper structure
6. Add cross-references to related toolkit articles
7. Update frontmatter (status, author, estimated_words)
8. Write file to repository
9. Update DEVELOPMENT.md progress tracking
```

#### Workflow B: Tool Assessment & Playbook Creation

```
1. Research tool/protocol (website, docs, community feedback)
2. Assess maturity using framework:
   - Maturity level (beta/production)
   - Technical accessibility (wallet/email login)
   - Documentation quality
   - Support availability
   - Community adoption
   - Nonprofit readiness
3. Document assessment in article
4. If mature: Create step-by-step playbook
5. If immature: Document barriers and alternatives
6. Tag with appropriate audience(s)
```

#### Workflow C: Critical Path Development

```
1. Identify use case from REQUIREMENTS.md Section 2.1
2. Map article sequence through tracks
3. Develop each article in path order
4. Ensure smooth transitions between articles
5. Add "Next Steps" sections linking to next article
6. Validate path completeness
7. Document path in DEVELOPMENT.md
```

#### Workflow D: Batch Section Development

```
1. Identify priority section (from DEVELOPMENT-WORKFLOW.md priorities)
2. List all articles in section
3. Read all source materials for the section
4. Develop articles in logical sequence
5. Maintain consistent voice and depth across batch
6. Create cross-links between section articles
7. Update section index if needed
```

### Phase 3: Quality Assurance

Before completing work:

- [ ] Content matches target audience (Grounded Regen/Curious Degen/On-Chain Regen)
- [ ] Source attribution is accurate and complete
- [ ] Cross-references to related articles are included
- [ ] Frontmatter is properly formatted
- [ ] Article follows structure guidelines (see below)
- [ ] No hallucinated information — all claims sourced
- [ ] Appropriate depth for article type (foundational vs. playbook)
- [ ] Links to external sources use markdown format
- [ ] Links to internal articles use `[[WikiLinks]]` format

### Phase 4: Reporting

Provide completion report including:

1. **Work Summary**: What was developed/modified
2. **Articles Created/Updated**: List with paths
3. **Sources Integrated**: Which sources were synthesized
4. **Cross-Links Established**: Connections to other articles
5. **Next Recommended Actions**: What should happen next
6. **Blockers/Issues**: Any problems encountered

---

## Content Development Standards

### Article Types and Structures

#### Type 1: Foundational Article (Track 1)

**Purpose**: Explain concepts to complete beginners
**Tone**: Accessible, non-technical, encouraging
**Structure**:
```markdown
# Title

## In This Article
[Quick summary of what reader will learn]

## The Core Idea
[Concept explanation in plain language]

## Why This Matters for Regens
[Connect to regenerative context]

## Key Concepts
[Break down into digestible pieces]

## Common Questions
[Address likely confusions]

## Next Steps
[Link to related articles]
```

#### Type 2: Applied Guide (Track 2)

**Purpose**: Practical implementation guidance
**Tone**: Action-oriented, clear, comprehensive
**Structure**:
```markdown
# Title

## Overview
[What this guide covers and who it's for]

## Prerequisites
[What reader should know/have first]

## Step-by-Step
[Numbered actionable steps]

## Best Practices
[Tips from practitioners]

## Common Challenges
[Problems and solutions]

## Related Resources
[Links to playbooks, case studies]
```

#### Type 3: Protocol Playbook (Track 3.1)

**Purpose**: Complete guide to using a specific tool/protocol
**Tone**: Precise, thorough, honest about limitations
**Structure**:
```markdown
# Title

## Tool Overview
[What it does, who built it, maturity status]

## Maturity Assessment
[Rating on accessibility, docs, support, adoption]

## Best For
[Use cases where this tool shines]

## Before You Start
[Prerequisites and setup]

## Step-by-Step Guide
[Detailed walkthrough]

## Alternatives
[Other tools that might fit better]

## Case Studies
[Real implementations]
```

#### Type 4: Case Study (Track 3.3-3.4)

**Purpose**: Real-world example with lessons learned
**Tone**: Narrative, specific, reflective
**Structure**:
```markdown
# Title

## Context
[Background on community/project]

## Challenge
[What they were trying to solve]

## Approach
[What they did, step by step]

## Results
[Outcomes and metrics]

## Lessons Learned
[Insights for others]

## Key Takeaways
[Actionable insights]
```

### Frontmatter Standards

Every article must include:

```yaml
---
title: "Article Title"
section: "1.1"           # Section code
track: 1                 # 1, 2, or 3
status: draft           # placeholder → draft → review → complete
author: null            # Set to contributor name
sources:                # Array of source codes
  - code: "B"
  - code: "E"
audience:               # Array of audience codes
  - grounded-regen
  - curious-degen
estimated_words: 800    # Approximate word count
created: 2026-01-15
updated: 2026-02-11     # When modified
---
```

### Source Integration Rules

1. **Always attribute**: Every article must list sources in frontmatter
2. **Synthesize, don't copy**: Reframe existing content with regenerative angle
3. **Add value**: Bring new connections, examples, or context
4. **Link to originals**: Include markdown links to source materials
5. **Note gaps**: When sources don't cover something, mark as `code: "NEW"`

---

## Priority Development Order

Based on `DEVELOPMENT-WORKFLOW.md`, articles should be developed in this priority order:

### P0 (Critical) - Develop First

| Section | Articles | Rationale |
|---------|----------|-----------|
| 3.1 Protocol Playbooks | 7 | Tools-first approach — what can you actually do |
| 1.5 Wallets & Security | 8 | Safety-critical for all audiences |
| 1.10 Crypto Philanthropy | 7 | P0 for nonprofit onboarding use case |

### P1 (High) - Develop Next

| Section | Articles | Rationale |
|---------|----------|-----------|
| 1.1 Why Web3? | 6 | Foundation for regenerative framing |
| 1.8 DAOs | 8 | Essential organizational concepts |
| 2.6 Funding Mechanisms | 7 | Core practical need |
| 2.7 Decentralized Governance | 7 | Deep dive applications |
| 2.8 Impact Measurement | 7 | Verification and accountability |

### P2 (Medium) - Develop Later

| Section | Articles | Rationale |
|---------|----------|-----------|
| 2.1-2.3 Local Nodes | 20 | For On-Chain Regen audience |
| 2.4-2.5 Community Building | 13 | Supporting content |
| 2.9-2.14 Applied Topics | 38 | Deep specialization |
| 3.2-3.6 Playbooks | 55 | Reference library |

### Critical Paths (Use-Case Driven)

When developing for specific use cases, prioritize these paths:

**University Governance Class Path**: 1.1 → 1.2 → 1.8 → 2.7 → 3.4  
**Somaliland Project Path**: 1.5 → 2.6 → 2.7 → 2.8 → 3.1 → 3.2  
**Normie Nonprofit Path**: 1.10 → 1.5 → 2.6 → 2.11 → 3.2

---

## Tool Maturity Assessment Framework

When assessing tools for Track 3.1 Protocol Playbooks, evaluate:

### 1. Technical Accessibility
- [ ] **Wallet Login**: Requires crypto wallet OR email/password
- [ ] **Onboarding Complexity**: Simple (< 5 min) / Medium (5-15 min) / Complex (> 15 min)
- [ ] **Documentation Quality**: Comprehensive / Basic / Poor
- [ ] **Error Recovery**: Clear guidance when things go wrong

### 2. Nonprofit Readiness
- [ ] **Legal Clarity**: Clear terms for organizational use
- [ ] **Accounting Support**: Exportable records, transaction history
- [ ] **Compliance Features**: KYC/AML if needed, reporting tools
- [ ] **Support Channels**: Email/chat support availability

### 3. Community Adoption
- [ ] **Active Usage**: Number of active organizations/projects
- [ ] **Success Stories**: Documented case studies
- [ ] **Community Size**: Active Discord/forum participants
- [ ] **Update Frequency**: Regular improvements and bug fixes

### 4. Integration Ecosystem
- [ ] **API Availability**: Programmatic access
- [ ] **Connected Tools**: Integrations with popular platforms
- [ ] **Data Portability**: Easy export/migration

### Assessment Output Format

```markdown
## Maturity Assessment: [Tool Name]

| Criteria | Rating | Notes |
|----------|--------|-------|
| Technical Accessibility | ⭐⭐⭐☆☆ | Email login available, good docs |
| Nonprofit Readiness | ⭐⭐☆☆☆ | Limited accounting exports |
| Community Adoption | ⭐⭐⭐⭐☆ | 500+ active projects |
| Integration Ecosystem | ⭐⭐⭐☆☆ | API available, limited integrations |

**Overall Maturity**: Beta / Production-Ready / Enterprise-Ready
**Best For**: [Specific use cases]
**Not Ready For**: [Use cases where it's not suitable]
```

---

## Integration Points

### Upstream Dependencies

The subagent relies on:

1. **Local-ReFi-Toolkit** (`03 Libraries/Local-ReFi-Toolkit/`)
   - Quartz-based frontend implementation
   - Content structure patterns
   - Deployment workflows

2. **Root-Level Agents** (`.cursor/agents/`)
   - `knowledge-curator` — For deep research on complex topics
   - `docs-consolidator` — For documentation review
   - `meeting-processor` — For extracting requirements from meetings

3. **Root-Level Skills** (`.cursor/skills/`)
   - `refi-content-generation` — For ReFi-specific terminology and patterns
   - `quick-push` — For git workflows

### Downstream Consumers

The subagent feeds into:

1. **regen-toolkit-interface** (future UI layer)
   - Content for visualization
   - Cross-reference mappings

2. **Quartz Publication** (via Local-ReFi-Toolkit)
   - Published content for public access

---

## Ecosystem Capacity Mapping

### Connecting Toolkit Content to Real-World Nodes

The Regen Toolkit is designed to serve **actual projects, local nodes, and Greenpill chapters** — not exist in isolation. Content modules map directly to organizational capacity needs:

| Toolkit Module | Node/Chapter Capacity | Application |
|----------------|----------------------|-------------|
| **Track 1.5 (Wallets)** | Onboarding capacity | How many newcomers can a node support? |
| **Track 2.1-2.3 (Local Nodes)** | Organizational development | Starting/growing node infrastructure |
| **Track 2.6 (Funding)** | Resource mobilization | Grants, donations, treasury management |
| **Track 2.7 (Governance)** | Decision-making capacity | Coordination mechanisms, voting |
| **Track 3.1 (Protocol Playbooks)** | Technical implementation | What tools a node can actually deploy |
| **Track 3.3-3.4 (Case Studies)** | Peer learning | Similar contexts, proven models |

### Capacity Assessment Integration

When developing content, consider:

**1. Node Maturity Levels**
- **Emerging** (0-6 months): Focus on Track 1 + 2.1 (basics, starting)
- **Developing** (6-18 months): Track 2 + 3.2 (applied, patterns)
- **Mature** (18+ months): Track 3 + specialized deep-dives

**2. Chapter Types**
- **University chapters**: Emphasize governance (1.8, 2.7) + education (1.1-1.3)
- **Community land projects**: Focus on funding (2.6) + local currencies (2.9)
- **Impact DAOs**: Prioritize governance (2.7) + impact measurement (2.8)
- **Climate collectives**: Tools (3.1) + case studies (3.3) from similar contexts

**3. Regional Adaptations**
- Content should note where playbooks need localization
- Case studies should represent diverse geographies
- Tool assessments should flag regional availability (e.g., Somali translation needs)

### Content Development Implications

**When writing articles:**
- Tag with relevant node types: `[[Local Node Starter]]`, `[[Impact DAO]]`, `[[University Chapter]]`
- Include "Node Capacity Context" sidebars where applicable
- Cross-reference to relevant case studies from similar organizational types

**When assessing tools:**
- Rate "Node Readiness" separately from "Nonprofit Readiness"
- Note which node maturity levels can realistically implement
- Document implementation support requirements

**When mapping critical paths:**
- Align with actual node development journeys (e.g., "From first meeting to first grant")
- Include "Capacity Milestones" alongside learning objectives

### Integration with Regen Commons

The toolkit feeds into broader **Regen Commons** infrastructure:
- Node capacity data informs commons resource allocation
- Toolkit usage patterns identify high-priority tools to support
- Content gaps reveal ecosystem capacity needs

**This makes the toolkit not just educational content, but a capacity-building infrastructure for the regenerative web3 ecosystem.**

---

## Implementation Plan

### Phase 1: Subagent Creation (Immediate)

1. **Create Skill File**: `03 Libraries/regen-toolkit/.cursor/skills/regen-toolkit-builder/SKILL.md`
2. **Create Agent Definition**: `03 Libraries/regen-toolkit/.cursor/agents/regen-toolkit-builder.md`
3. **Update AGENTS.md**: Add reference to new subagent
4. **Test Activation**: Run initial content development task

### Phase 2: Content Development Sprints (Ongoing)

| Sprint | Focus | Articles | Timeline |
|--------|-------|----------|----------|
| 1 | P0 Protocol Playbooks (3.1) | 7 | Week 1-2 |
| 2 | P0 Wallets & Security (1.5) | 8 | Week 3-4 |
| 3 | P0 Crypto Philanthropy (1.10) | 7 | Week 5-6 |
| 4 | P1 Foundations (1.1, 1.8) | 14 | Week 7-10 |
| 5 | P1 Applied Core (2.6, 2.7, 2.8) | 21 | Week 11-16 |

### Phase 3: Tool Assessment Pipeline (Parallel)

| Tool | Priority | Assessment Type |
|------|----------|-----------------|
| Gitcoin Grants | High | Full Playbook |
| Giveth | High | Full Playbook |
| Sylvey Protocol | High | Full Playbook |
| Hypercerts | Medium | Assessment + Mini-Playbook |
| Safe Multisig | High | Full Playbook |
| Snapshot | Medium | Full Playbook |

### Phase 4: Critical Path Completion (Ongoing)

- University Governance Class Path: Sprint 4-5
- Somaliland Project Path: Sprint 2-5
- Normie Nonprofit Path: Sprint 2-4

---

## Success Metrics

### Content Metrics

- [ ] **Article Completion Rate**: % of 138 articles with complete status
- [ ] **Source Integration**: % of articles properly attributing sources
- [ ] **Cross-Link Density**: Average number of internal links per article
- [ ] **Word Count**: Estimated total words (target: 100,000+)

### Quality Metrics

- [ ] **Audience Appropriateness**: Review samples for each audience type
- [ ] **Accuracy**: Fact-check against source materials
- [ ] **Completeness**: All sections have minimum viable content

### Process Metrics

- [ ] **Development Velocity**: Articles completed per sprint
- [ ] **Review Cycle Time**: Time from draft to complete status
- [ ] **Tool Assessment Coverage**: % of priority tools assessed

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Hallucinated content** | Strict source attribution rules; all claims must trace to sources |
| **Inconsistent voice** | Audience-specific templates; batch development by section |
| **Scope creep** | Strict priority order; REQUIREMENTS.md questionnaire boundaries |
| **Source drift** | Regular source re-checking; BACKLOG.md for outdated sources |
| **Cross-link rot** | Automated link checking; index files for each section |
| **Quality inconsistency** | Structured templates; mandatory QA checklist |

---

## File Locations

### Subagent Files (To Create)

```
03 Libraries/regen-toolkit/
├── .cursor/
│   ├── agents/
│   │   └── regen-toolkit-builder.md    # Agent definition
│   ├── skills/
│   │   └── regen-toolkit-builder/
│   │       └── SKILL.md                # Skill implementation
│   └── rules/
│       └── (none - uses inherited rules)
└── AGENTS.md                           # Update with subagent reference
```

### Content Files (To Modify)

```
03 Libraries/regen-toolkit/content/
├── 1-foundations/                      # 72 articles across 10 sections
├── 2-applied/                          # 66 articles across 14 sections
├── 3-playbooks/                        # 50+ articles across 6 sections
└── sources/                            # 15 source attribution files
```

### Coordination Files (To Update)

```
03 Libraries/regen-toolkit/
├── DEVELOPMENT.md                      # Progress tracking
├── DEVELOPMENT-WORKFLOW.md             # Process refinement
└── content/sources/BACKLOG.md          # Source status updates
```

---

## Activation Examples

### Example 1: Single Article Request

> "Write the article on 'Why are regeneratives interested in blockchain?' (1.1.1)"

**Subagent Actions**:
1. Read placeholder at `content/1-foundations/1.1-why-web3/why-regens-interested.md`
2. Check sources B (Greenpill Guide) and NEW in frontmatter
3. Read source B documentation
4. Synthesize content for Grounded Regen audience
5. Write complete article with cross-references
6. Update status to "draft"
7. Report completion

### Example 2: Section Priority Request

> "Focus on developing Track 1.5 Wallets & Security as P0 priority"

**Subagent Actions**:
1. Read section index at `content/1-foundations/1.5-wallets-security/`
2. List all 8 articles in section
3. Read all source materials tagged for these articles
4. Develop articles in logical sequence (basics → advanced → organizational)
5. Create cross-links between section articles
6. Update DEVELOPMENT.md with progress
7. Report batch completion

### Example 3: Tool Assessment Request

> "Assess Gitcoin Grants for a protocol playbook"

**Subagent Actions**:
1. Research Gitcoin Grants (website, docs, recent updates)
2. Apply maturity assessment framework
3. Check existing articles for cross-references
4. Write playbook following Track 3.1 structure
5. Document maturity assessment honestly
6. Add to `content/3-playbooks/3.1-protocol-playbooks/`
7. Update tool assessment table in DEVELOPMENT.md

### Example 4: Critical Path Request

> "Map and develop the Somaliland project critical path"

**Subagent Actions**:
1. Read REQUIREMENTS.md Section 2.1 for Somaliland context
2. Map path: 1.5 → 2.6 → 2.7 → 2.8 → 3.1 → 3.2
3. Develop articles in sequence, ensuring smooth transitions
4. Add "Next Steps" sections linking forward
5. Note Somali translation requirements
6. Document path in DEVELOPMENT.md
7. Report path completion with validation

---

## Next Steps

1. **Review this plan** with project stakeholders (Monty, Trinity, Matt)
2. **Approve subagent creation** and file locations
3. **Create subagent files** (agent definition + skill)
4. **Test with single article** (e.g., 1.1.1 or a simple playbook)
5. **Iterate on templates** based on initial output
6. **Launch sprint 1** (P0 Protocol Playbooks)
7. **Establish review cadence** (biweekly alignment with team)

---

## Appendices

### Appendix A: Source Codes Reference

| Code | Source | Type | Best For |
|------|--------|------|----------|
| A | ReFi DAO Local ReFi Toolkit | Toolkit | Playbooks, case studies |
| B | Greenpill Local Regen Guide | Guide | Philosophy, public goods |
| C | CryptoAltruists Web3 Impact Toolkit | Toolkit | Nonprofits, practical how-tos |
| D | Bankless Academy | Education | Beginner web3 education |
| E | SuperBenefit Knowledge Garden | Knowledge Base | DAO patterns, governance |
| F | Graviton Introductory Course | Course | Conflict resolution |
| G | Foundation Getting Started | Guide | NFT/creator onboarding |
| H-L | Greenpill resources | Various | Network-specific content |
| M | Eth Localism Book | Book | Philosophy, localism |
| N | Commitment Pooling Playbook | Playbook | Coordination patterns |
| O | Reimagining Power Case Studies | Case Studies | Real use cases |
| P-S | Various | Various | Ecosystem resources |

### Appendix B: Meeting Notes Reference

Key meetings to reference for context:

- **260115 Greenpill Toolkit Planning Call**: Initial project scope, team roles, funding discussion, technical infrastructure decisions
- **260129** (from daily note): Likely follow-up planning (check 260129 Quinta, 29 de janeiro.md for any relevant notes)

### Appendix C: Integration with Existing Infrastructure

**Quartz Implementation**: Content developed by subagent feeds into Local-ReFi-Toolkit Quartz frontend for publication.

**Knowledge Graph**: Cross-links created by subagent integrate with broader Zettelkasten knowledge network.

**AI Agent Constellation**: Subagent operates within three-tier architecture (user → root → project), can be promoted if patterns prove reusable.

---

*Plan Version: 1.0*  
*Created: 2026-02-11*  
*Status: Ready for Review*
