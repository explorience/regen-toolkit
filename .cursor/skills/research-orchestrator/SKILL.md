---
name: research-orchestrator
description: Orchestrate deep research for the Regen Toolkit. Combines academic-deep-research rigor with web3-specific knowledge. Use when researching protocols, tools, case studies, or ecosystem developments that require exhaustive investigation and source validation.
---

# Research Orchestrator for Regen Toolkit

Conduct rigorous, multi-cycle research on web3 protocols, regenerative projects, and ecosystem developments — specifically designed for toolkit content needs.

## When to Use

Use this skill when:
- Researching a new protocol for Track 3.1 (Protocol Playbooks)
- Investigating case studies for Track 3.3-3.4
- Deep-diving on tool maturity before assessment
- Synthesizing ecosystem trends for Track 1.9 (ReFi Landscape)
- Verifying claims made in source materials
- Finding current developments not covered in existing sources
- Researching nonprofit/organizational adoption of web3 tools

## Research Methodology

This skill combines **academic-deep-research** rigor with **web3-specific** research patterns:

- **2-cycle minimum** per research theme
- **Evidence hierarchy** (systematic reviews > case studies > opinions)
- **Multi-source validation** (documentation + community + usage data)
- **Contradiction documentation**
- **Confidence annotations** [HIGH] / [MEDIUM] / [LOW]

## Research Types

### Type 1: Protocol Deep Dive

**Goal**: Comprehensive understanding of a specific web3 protocol

**Research Questions**:
- What problem does it solve?
- How does it work technically?
- Who uses it in practice?
- What are known issues/limitations?
- How mature is it for nonprofit use?

**Research Plan**:
```markdown
## Research Plan: [Protocol Name]

### Cycle 1: Landscape Analysis
1. **Official sources**:
   - Documentation (whitepaper, docs, GitHub)
   - Website and marketing materials
   - Team background and funding

2. **Community research**:
   - Discord/Telegram sentiment
   - Forum discussions
   - Twitter/X community

3. **Usage data**:
   - TVL / user metrics (if available)
   - Transaction volume
   - Active projects

4. **Initial synthesis**:
   - Core functionality
   - Target users
   - Key differentiators
   - Obvious limitations

### Cycle 2: Deep Investigation
1. **Technical validation**:
   - Smart contract audits
   - Security history
   - Technical reviews

2. **Real-world usage**:
   - Case studies (3-5 minimum)
   - User interviews/reviews
   - Implementation challenges

3. **Ecosystem context**:
   - Competitive landscape
   - Integration possibilities
   - Future roadmap

4. **Nonprofit assessment**:
   - Organizational use cases
   - Legal/compliance considerations
   - Support availability

### Deliverable**: Comprehensive protocol report with maturity assessment
```

### Type 2: Case Study Investigation

**Goal**: Document real-world implementation with lessons learned

**Research Questions**:
- What was the context and challenge?
- What solution did they implement?
- What were the results?
- What would they do differently?
- What can others learn?

**Research Plan**:
```markdown
## Research Plan: [Project/Community Name] Case Study

### Cycle 1: Information Gathering
1. **Public sources**:
   - Project website/documentation
   - Published articles/blog posts
   - Social media presence
   - GitHub repositories

2. **Media coverage**:
   - News articles
   - Podcast appearances
   - Conference presentations
   - Academic papers (if any)

3. **Ecosystem mentions**:
   - References in other case studies
   - Mentions in tool documentation
   - Community discussions

### Cycle 2: Validation & Detail
1. **Direct outreach** (if possible):
   - Contact project leaders
   - Interview participants
   - Verify claims

2. **Cross-reference**:
   - Multiple sources for key claims
   - Verify timeline and outcomes
   - Check for updates since publication

3. **Critical analysis**:
   - What worked and why?
   - What failed and why?
   - Selection bias considerations
   - Generalizability assessment

### Deliverable**: Detailed case study with critical analysis
```

### Type 3: Ecosystem Trend Analysis

**Goal**: Understand broader patterns in regenerative web3

**Research Questions**:
- What trends are emerging?
- What challenges are widespread?
- What innovations are gaining traction?
- How is the field evolving?

**Research Plan**:
```markdown
## Research Plan: [Trend/Topic] Analysis

### Cycle 1: Broad Scan
1. **Literature review**:
   - Academic papers (Google Scholar)
   - Industry reports
   - Ecosystem surveys
   - State of [topic] reports

2. **Key voices**:
   - Thought leaders
   - Practitioner perspectives
   - Critical voices/dissent
   - Cross-disciplinary views

3. **Data sources**:
   - On-chain metrics
   - Usage statistics
   - Funding flows
   - Community growth

### Cycle 2: Pattern Synthesis
1. **Theme identification**:
   - Recurring patterns
   - Common challenges
   - Divergent approaches
   - Emerging consensus

2. **Contradiction analysis**:
   - Conflicting claims
   - Different methodologies
   - Competing frameworks
   - Unresolved debates

3. **Implications**:
   - For practitioners
   - For the field
   - For the toolkit
   - Future directions

### Deliverable**: Trend analysis with evidence-based conclusions
```

### Type 4: Source Verification

**Goal**: Validate and update existing source materials

**Research Questions**:
- Is this information still current?
- Have there been major changes?
- Are claims supported by evidence?
- What gaps exist?

**Research Plan**:
```markdown
## Research Plan: Source [Code] Verification

### Cycle 1: Current State Assessment
1. **Check for updates**:
   - New versions/releases
   - Documentation changes
   - Roadmap progress
   - Team changes

2. **Community health**:
   - Activity levels
   - Support quality
   - User sentiment
   - Recent issues

3. **Ecosystem position**:
   - Adoption trends
   - Competitive shifts
   - Integration updates
   - Deprecation risks

### Cycle 2: Gap & Update Identification
1. **New developments**:
   - Features added
   - Use cases discovered
   - Partnerships formed
   - Challenges emerged

2. **Outdated content**:
   - Changed procedures
   - Deprecated features
   - Updated pricing
   - Revised recommendations

3. **Synthesis with toolkit**:
   - What needs updating?
   - What should be added?
   - What can be removed?
   - Confidence in current content

### Deliverable**: Source verification report with update recommendations
```

## Research Execution

### Phase 1: Planning [STOP POINT]

Present research plan to user:

```markdown
## Research Plan: [Topic]

### Research Questions
1. [Primary question]
2. [Secondary question]
3. [Tertiary question]

### Themes to Investigate
| Theme | Key Questions | Expected Sources |
|-------|---------------|------------------|
| [Theme 1] | [Q1, Q2] | [Types of sources] |
| [Theme 2] | [Q3, Q4] | [Types of sources] |

### Research Approach
- **Cycle 1**: [Broad scan strategy]
- **Cycle 2**: [Deep dive strategy]

### Expected Deliverable
- Format: [Report type]
- Length: [Estimated]
- Citations: [Style/standard]

**Awaiting approval to proceed.**
```

### Phase 2: Execution [NO STOPS]

Execute both research cycles:

```bash
# Cycle 1: Broad landscape
web_search "[topic]" count=20
web_fetch [official-docs]
web_fetch [key-articles]

# Analysis and gap identification

# Cycle 2: Deep investigation
web_search "[topic] case study" "[topic] review"
web_fetch [technical-docs]
web_fetch [community-discussions]
web_search "[topic] nonprofit" "[topic] impact"
```

**Document analysis between each step**:
- Connect findings to previous results
- Show evolution of understanding
- Highlight contradictions
- Identify patterns

### Phase 3: Synthesis [STOP POINT]

Present findings:

```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 paragraphs with key findings]

## Key Findings

### Finding 1: [Title]
[Detailed finding with evidence and citations]

### Finding 2: [Title]
[Detailed finding with evidence and citations]

## Evidence Quality

| Claim | Evidence Level | Confidence | Sources |
|-------|----------------|------------|---------|
| [Claim 1] | [Systematic review/RCT/etc] | [HIGH] | [N sources] |
| [Claim 2] | [Case studies] | [MEDIUM] | [N sources] |
| [Claim 3] | [Expert opinion] | [LOW] | [N sources] |

## Contradictions & Uncertainties

### Contradiction 1
- **Source A claims**: [X]
- **Source B claims**: [Y]
- **Analysis**: [Why they differ, which is more reliable]

### Unresolved Questions
- [Question 1]: [Why we don't know]
- [Question 2]: [What would help resolve]

## Practical Implications

### For Practitioners
- [Actionable insight 1]
- [Actionable insight 2]

### For the Toolkit
- [Content recommendation 1]
- [Content recommendation 2]

## Sources

### Primary Sources
- [List with full citations]

### Secondary Sources
- [List with full citations]

### Sources Consulted but Not Cited
- [List with reason for exclusion]

## Confidence Summary

- **[HIGH confidence claims]**: [List]
- **[MEDIUM confidence claims]**: [List]
- **[LOW confidence claims]**: [List]

## Recommendations for Toolkit Integration

1. **Create/Update**: [Specific articles]
2. **Emphasize**: [Key points to highlight]
3. **Caution**: [Limitations to note]
4. **Monitor**: [Areas needing ongoing tracking]
```

## Evidence Hierarchy

When evaluating sources, prioritize:

1. **[HIGHEST]** Systematic reviews / meta-analyses
2. **[HIGH]** Multiple converging case studies
3. **[HIGH]** Official documentation + verified usage
4. **[MEDIUM]** Single detailed case study
5. **[MEDIUM]** Expert practitioner interviews
6. **[MEDIUM]** Community sentiment (Discord/forums)
7. **[LOW]** Single anecdote / unverified claim
8. **[LOWEST]** Marketing materials without verification

## Confidence Annotations

Use in research outputs:

- **[HIGH]** — Multiple high-quality sources agree
- **[MEDIUM]** — Limited sources or some disagreement
- **[LOW]** — Single source, preliminary, or needs verification
- **[SPECULATIVE]** — Hypothesis or emerging area

## Citation Standards

### For Toolkit Content

Use inline citations with source codes:
```markdown
Research indicates that [finding] (Source A, 2024; Source B, 2023).

A case study from Portland demonstrates [example] (Reimagining Power 
Case Studies, 2024).
```

### For Research Reports

Use full citations:
```markdown
Greenpill Network. (2024). *Local Regen Guide*. Retrieved from 
https://greenpill.network/pdf/local-regen-guide.pdf

Smith, J., & Jones, A. (2023). "Decentralized Coordination in Practice." 
*Journal of Regenerative Finance*, 12(3), 45-67. https://doi.org/10.xxxx
```

## Integration with Toolkit Workflow

### Research Triggers Content Creation

1. **Research identifies protocol** → Use `web3-tool-assessor` to evaluate
2. **Assessment shows maturity** → Use `regen-toolkit-builder` to create playbook
3. **Playbook created** → Use `cross-link-validator` to connect to related content

### Research Validates Sources

1. **Source seems outdated** → Research current state
2. **New version released** → Research changes
3. **Community sentiment shifts** → Research why

### Research Informs Synthesis

1. **Multiple sources on topic** → Research for additional context
2. **Gaps in source coverage** → Research to fill gaps
3. **Conflicting information** → Research to resolve

## Research Ethics

- **Transparency**: Disclose limitations and uncertainties
- **Balance**: Present competing viewpoints fairly
- **Recency**: Prioritize current sources unless historical context needed
- **Verification**: Flag unverified claims
- **Scope**: Stay within requested boundaries
- **Intellectual honesty**: Report contradictory findings

## Quality Checklist

- [ ] Research plan approved before execution
- [ ] Minimum 2 cycles completed
- [ ] Multiple sources per major claim
- [ ] Contradictions addressed explicitly
- [ ] Confidence levels assigned
- [ ] Sources properly cited
- [ ] Practical implications clear
- [ ] Toolkit integration recommendations provided
- [ ] Limitations acknowledged
- [ ] Re-assessment triggers identified

## Example Research Outputs

### Example 1: Protocol Research (Gitcoin Grants)

**Research Questions**:
1. How does Gitcoin Grants work technically?
2. Who uses it and for what?
3. What's required to participate?
4. What are known limitations?

**Key Findings**:
- **[HIGH]** Gitcoin Grants uses quadratic funding mechanism
- **[HIGH]** 500+ projects have received funding
- **[MEDIUM]** Setup requires ETH wallet + some technical knowledge
- **[MEDIUM]** Recent shift to Gitcoin Passport for sybil resistance

**Toolkit Integration**:
- Create playbook in Track 3.1
- Link from Track 2.6 (Funding Mechanisms)
- Note complexity for beginners

### Example 2: Case Study Research (Green Bronx)

**Research Questions**:
1. What was the community context?
2. What web3 tools did they use?
3. What were the outcomes?
4. What lessons for others?

**Key Findings**:
- **[HIGH]** Community garden fund managed via Gnosis Safe
- **[MEDIUM]** 150 members using quadratic voting
- **[MEDIUM]** Challenges: onboarding, technical support
- **[LOW]** Long-term sustainability unclear

**Toolkit Integration**:
- Create case study in Track 3.3
- Link to multi-sig playbook
- Highlight onboarding challenges

## See Also

- `academic-deep-research` — Underlying methodology
- `web3-tool-assessor` — For tool evaluation after research
- `source-synthesizer` — For integrating research into content
- `regen-toolkit-builder` — Agent that uses research outputs
