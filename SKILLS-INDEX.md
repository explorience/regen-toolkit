# Regen Toolkit — Skills Index

**Complete reference for all skills available to the Regen Toolkit subagent ecosystem.**

---

## Quick Reference

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `regen-toolkit-builder` | Content development | Writing articles, playbooks, paths |
| `web3-tool-assessor` | Tool evaluation | Assessing protocol maturity |
| `source-synthesizer` | Content synthesis | Combining multiple sources |
| `cross-link-validator` | Link maintenance | Auditing/fixing article links |
| `research-orchestrator` | Deep research | Investigating protocols/cases |

---

## Ecosystem Capacity Mapping

The toolkit serves **real projects, local nodes, and Greenpill chapters**. Skills should be applied with organizational capacity in mind:

### Content → Capacity Mapping

| Toolkit Content | Node/Chapter Capacity | Skill Application |
|-----------------|----------------------|-------------------|
| **Track 1.5 (Wallets)** | Onboarding capacity | `regen-toolkit-builder` + beginner focus |
| **Track 2.1-2.3 (Local Nodes)** | Organizational development | `source-synthesizer` for node patterns |
| **Track 2.6 (Funding)** | Resource mobilization | `web3-tool-assessor` for funding tools |
| **Track 2.7 (Governance)** | Decision-making capacity | `research-orchestrator` for DAO research |
| **Track 3.1 (Protocol Playbooks)** | Technical implementation | `web3-tool-assessor` for maturity |
| **Track 3.3-3.4 (Case Studies)** | Peer learning | `source-synthesizer` for case adaptation |

### Node Maturity Levels

When using skills, consider node maturity:

| Maturity | Age | Priority Content | Skill Focus |
|----------|-----|------------------|-------------|
| **Emerging** | 0-6 months | Track 1 + 2.1 | Foundational, onboarding |
| **Developing** | 6-18 months | Track 2 + 3.2 | Applied tools, patterns |
| **Mature** | 18+ months | Track 3 + deep-dives | Advanced implementation |

### Chapter Type Considerations

**University chapters**: Governance (1.8, 2.7) + Education (1.1-1.3)  
**Community land projects**: Funding (2.6) + Local currencies (2.9)  
**Impact DAOs**: Governance (2.7) + Impact measurement (2.8)  
**Climate collectives**: Tools (3.1) + Regional case studies (3.3)

**Tag content with**: `[[Local Node Starter]]`, `[[Impact DAO]]`, `[[University Chapter]]`

---

## Project-Specific Skills (`.cursor/skills/`)

### 1. regen-toolkit-builder
**File**: `.cursor/skills/regen-toolkit-builder/SKILL.md`

**Purpose**: Autonomous content developer for the 138-article Regen Toolkit.

**Capabilities**:
- Write articles from placeholder stubs
- Assess web3 tool maturity
- Create protocol playbooks
- Map critical learning paths
- Build cross-link networks

**Activation Examples**:
```
"regen-toolkit-builder: Write article 1.1.1 on why regeneratives are interested in blockchain"
"regen-toolkit-builder: Assess Gitcoin Grants and create playbook"
"regen-toolkit-builder: Develop Track 1.5 Wallets & Security as P0 priority"
"regen-toolkit-builder: Map the Somaliland project critical path"
```

**Workflow**:
1. Read core documentation (AGENTS.md, README.md, workflows)
2. Research assigned sources
3. Write content following type templates
4. Add cross-references
5. Update progress tracking
6. Report completion

**Output**: Publication-ready articles with proper frontmatter, cross-links, and status updates

**See Also**: Agent definition at `.cursor/agents/regen-toolkit-builder.md`

---

### 2. web3-tool-assessor
**File**: `.cursor/skills/web3-tool-assessor/SKILL.md`

**Purpose**: Structured assessment framework for evaluating web3 tools, protocols, and applications.

**The 4 Dimensions**:
1. **Technical Accessibility** — Wallet vs email login, onboarding complexity, docs quality
2. **Nonprofit Readiness** — Legal clarity, accounting support, compliance, help desk
3. **Community Adoption** — Active usage, case studies, community health, updates
4. **Integration Ecosystem** — API availability, connected tools, data portability

**Rating Scale**: ⭐ (Experimental) to ⭐⭐⭐⭐⭐ (Enterprise-Ready)

**Activation Examples**:
```
"web3-tool-assessor: Evaluate Giveth for nonprofit readiness"
"web3-tool-assessor: Compare Gitcoin vs Giveth for funding mechanisms"
"web3-tool-assessor: Assess Sylvey Protocol maturity"
```

**Assessment Process**:
1. Initial research (30 min) — docs, website, GitHub
2. Hands-on evaluation (60 min) — test accounts, UX testing
3. Community research (30 min) — Discord, reviews, case studies
4. Synthesize ratings with justification
5. Document alternatives and limitations

**Output**: Maturity assessment report with 4-dimension ratings, use case recommendations, and alternatives

**Overall Maturity Levels**:
- 4.0-5.0 = Enterprise-Ready
- 3.0-3.9 = Production-Ready
- 2.0-2.9 = Beta
- 1.0-1.9 = Alpha
- < 1.0 = Experimental

---

### 3. source-synthesizer
**File**: `.cursor/skills/source-synthesizer/SKILL.md`

**Purpose**: Transform multiple source materials into cohesive, original content while maintaining proper attribution.

**Core Principle**: Synthesize, don't copy.

**Synthesis Strategies**:
- **Layered**: Theory → Translation → Application (Sources B+M+O)
- **Comparative**: Multiple perspectives on same topic
- **Gap-filling**: Complementary coverage across sources

**Activation Examples**:
```
"source-synthesizer: Synthesize Sources B, M, and O for article 1.1.1"
"source-synthesizer: Combine Bankless technical content with CryptoAltruists nonprofit guidance"
"source-synthesizer: Create unified guide from conflicting sources"
```

**Synthesis Process**:
1. Analyze each source (extract concepts, arguments, unique value, limitations)
2. Map coverage (what's covered, what's missing, gaps)
3. Choose synthesis strategy based on source relationships
4. Write integrated narrative (not string of quotes)
5. Attribute properly (frontmatter + in-text citations)

**Output**: Cohesive article with flowing narrative, multiple source integration, proper attribution

**Attribution Format**:
```yaml
sources:
  - code: "B"
    contribution: "Philosophical framework"
  - code: "O"
    contribution: "Case study from Portland"
  - code: "NEW"
    contribution: "Regenerative context and practitioner guidance"
```

---

### 4. cross-link-validator
**File**: `.cursor/skills/cross-link-validator/SKILL.md`

**Purpose**: Validate and maintain dense cross-link networks across 138 articles.

**Link Types**:
1. **Sequential**: Previous → Current → Next (Track progression)
2. **Conceptual**: Related ideas across tracks
3. **Prerequisite**: Dependencies (Before this, understand...)
4. **Application**: Theory → Practice (Track 1/2 → Track 3)
5. **Source**: Attribution to source materials

**Activation Examples**:
```
"cross-link-validator: Audit all links in Track 1 Foundations"
"cross-link-validator: Find orphaned articles with no incoming links"
"cross-link-validator: Validate the University Governance critical path"
"cross-link-validator: Check link density across all articles"
```

**Validation Checks**:
1. All articles have ≥ 3 outgoing links
2. No orphaned articles (≥ 1 incoming link)
3. No broken links
4. Critical paths fully connected
5. Link density targets met

**Target Link Density**:
- Hub/Index articles: 10+ incoming, 8+ outgoing
- Core concepts: 5-8 incoming, 5-7 outgoing
- Specific guides: 3-5 incoming, 4-6 outgoing
- Case studies: 3-5 incoming, 3-5 outgoing

**Output**: Audit report with orphaned articles, broken links, missing critical path connections, and recommended fixes

---

### 5. research-orchestrator
**File**: `.cursor/skills/research-orchestrator/SKILL.md`

**Purpose**: Conduct rigorous, multi-cycle research on web3 protocols and regenerative projects.

**Research Types**:
1. **Protocol Deep Dive** — Comprehensive understanding of specific web3 protocol
2. **Case Study Investigation** — Document real-world implementation with lessons
3. **Ecosystem Trend Analysis** — Understand broader patterns
4. **Source Verification** — Validate and update existing sources

**Activation Examples**:
```
"research-orchestrator: Deep research on Hypercerts protocol"
"research-orchestrator: Investigate case study: Green Bronx community land trust"
"research-orchestrator: Analyze trends in quadratic funding adoption"
"research-orchestrator: Verify current status of Source A (ReFi DAO Toolkit)"
```

**Research Methodology**:
- 2-cycle minimum per theme
- Evidence hierarchy (systematic reviews > case studies > opinions)
- Multi-source validation
- Contradiction documentation
- Confidence annotations [HIGH] / [MEDIUM] / [LOW]

**Output**: Research report with key findings, evidence quality assessment, contradictions, practical implications, and toolkit integration recommendations

**Evidence Hierarchy**:
1. [HIGHEST] Systematic reviews / meta-analyses
2. [HIGH] Multiple converging case studies
3. [HIGH] Official documentation + verified usage
4. [MEDIUM] Single detailed case study
5. [MEDIUM] Expert practitioner interviews
6. [MEDIUM] Community sentiment
7. [LOW] Single anecdote
8. [LOWEST] Marketing materials

---

## Inherited Skills (Root-Level)

### refi-content-generation
**Location**: `.cursor/skills/refi-content-generation/SKILL.md` (root-level)

**Purpose**: Generate content for ReFi ecosystem organizations using exact terminology.

**When to Use**:
- Creating strategic docs for ReFi DAO/Regen Coordination/ReFi BCN
- Meeting documentation
- Partnership materials
- Any content requiring ReFi-specific terminology

**Key Directories Referenced**:
- `250701 ReFi DAO/`
- `250701 Regen Coordination/`
- `250701 ReFi BCN/`
- `03 Libraries/ReFi DAO/`
- `03 Libraries/Regen Coordination/`

**Terminology Standards**:
- "ReFi DAO" (not ReFiDAO)
- "Greenpill Network"
- "Regenerant Catalunya" (not translated)
- "Local ReFi Toolkit" (proper capitalization)

---

### quick-push
**Location**: `.cursor/skills/quick-push/SKILL.md` (root-level)

**Purpose**: Quick git workflow operations.

**When to Use**:
- Committing changes
- Pushing to remote
- Quick git status checks
- Simple branch operations

---

### knowledge-curator
**Location**: `.cursor/agents/knowledge-curator.md` (root-level agent)

**Purpose**: Deep research and synthesis specialist for Zettelkasten knowledge management.

**When to Use**:
- Complex research across multiple sources
- Creating comprehensive knowledge artifacts
- Building thematic threads
- Cross-project synthesis

**Research Protocol**:
1. Source identification (target dir → libraries → legacy → meetings)
2. Information extraction
3. Synthesis (What/Why/How/Now/Next)
4. Artifact creation with dense [[WikiLinks]]

---

## Inherited Skills (User-Level)

### academic-deep-research
**Location**: `~/.cursor/skills/academic-deep-research/SKILL.md`

**Purpose**: Transparent, rigorous research with full methodology — not a black-box API wrapper.

**Key Features**:
- Mandated 2-cycle research per theme
- APA 7th citations
- Evidence hierarchy
- 3 user checkpoints (stop points)
- Self-contained using native OpenClaw tools

**When to Use**:
- Literature reviews
- Competitive intelligence
- Research requiring academic rigor
- "Tell me everything about X" questions

**Research Phases**:
1. **Initial Engagement** — Clarifying questions (STOP POINT)
2. **Research Planning** — Present plan, wait for approval (STOP POINT)
3. **Mandated Research Cycles** — Execute fully (NO STOPS)
4. **Final Report** — Present findings (STOP POINT)

**Output Format**: Academic narrative prose with integrated citations, no bullet points, proper paragraphs

---

### weekly-synthesis
**Location**: `~/.cursor/skills/weekly-synthesis/SKILL.md`

**Purpose**: Create comprehensive synthesis of week's work and thinking.

**When to Use**:
- End-of-week reviews
- Pattern recognition across work
- Project progress assessment
- Identifying themes and insights

**Output Format**:
- Week at a Glance
- Key Themes
- Major Insights
- Progress by Project
- Questions Emerged
- Energy Audit
- Connections Made
- Next Week's Intentions

---

## Skill Selection Decision Tree

```
What do you need to do?
│
├── Write content for the toolkit
│   ├── From multiple sources
│   │   └── source-synthesizer → regen-toolkit-builder
│   ├── About a web3 tool/protocol
│   │   ├── Need assessment first?
│   │   │   └── web3-tool-assessor
│   │   └── Ready to write?
│   │       └── regen-toolkit-builder
│   └── General article
│       └── regen-toolkit-builder
│
├── Research something
│   ├── Deep protocol investigation
│   │   ├── Academic rigor required?
│   │   │   ├── Yes → academic-deep-research
│   │   │   └── No → research-orchestrator
│   │   └── Then assess → web3-tool-assessor
│   ├── Case study
│   │   └── research-orchestrator
│   └── Cross-project synthesis
│       └── knowledge-curator (root agent)
│
├── Evaluate/Assess
│   ├── Web3 tool maturity
│   │   └── web3-tool-assessor
│   ├── Source verification
│   │   └── research-orchestrator
│   └── Content quality
│       └── cross-link-validator
│
├── Maintain/Fix
│   ├── Link integrity
│   │   └── cross-link-validator
│   ├── Git workflow
│   │   └── quick-push
│   └── Content updates
│       └── regen-toolkit-builder
│
└── Generate ReFi-specific content
    └── refi-content-generation
```

---

## Skill Integration Workflows

### Workflow 1: New Protocol → Playbook

```
1. research-orchestrator
   └─→ Deep research on protocol
       └─→ Research report
           └─→ 2. web3-tool-assessor
               └─→ Maturity assessment
                   └─→ Assessment doc
                       └─→ 3. regen-toolkit-builder
                           └─→ Protocol playbook
                               └─→ 4. cross-link-validator
                                   └─→ Link to related articles
```

### Workflow 2: Multiple Sources → Article

```
1. Read sources
   └─→ Source documents
       └─→ 2. source-synthesizer
           └─→ Synthesis strategy
               └─→ 3. regen-toolkit-builder
                   └─→ Write article
                       └─→ 4. cross-link-validator
                           └─→ Validate links
```

### Workflow 3: Case Study Research

```
1. research-orchestrator
   └─→ Case study investigation
       └─→ Detailed case report
           └─→ 2. regen-toolkit-builder
               └─→ Create case study article
                   └─→ 3. cross-link-validator
                       └─→ Link to related playbooks
```

---

## Skill Development Guidelines

### Creating New Skills

Follow the skill-creator best practices:

1. **Concise is key** — Only add context Codex doesn't already have
2. **Set degrees of freedom** — Match specificity to task fragility
3. **Use progressive disclosure** — Metadata → SKILL.md → References
4. **Test with real use cases** — Iterate based on feedback

### Skill Structure

```
.cursor/skills/[skill-name]/
├── SKILL.md              # Required: Instructions and workflows
├── QUICKSTART.md         # Optional: Quick reference
├── scripts/              # Optional: Executable code
├── references/           # Optional: Documentation
└── assets/               # Optional: Templates, files
```

### SKILL.md Template

```markdown
---
name: skill-name
description: Clear description including when to use this skill
---

# Skill Title

## When to Use

Specific triggers for this skill.

## Core Structure/Workflow

Step-by-step process.

## Examples

Concrete activation examples.

## Output

What the skill produces.

## See Also

Related skills or resources.
```

---

## Skill Quality Standards

All skills should meet these standards:

- [ ] **Clear triggering** — Description makes when to use obvious
- [ ] **Concise** — Under 500 lines, essential info only
- [ ] **Actionable** — Clear steps, not just concepts
- [ ] **Tested** — Works with real inputs
- [ ] **Integrated** — References related skills/resources
- [ ] **Documented** — Examples show expected usage

---

## Maintenance

### Regular Reviews

- **Monthly**: Check skill effectiveness
- **Quarterly**: Review for updates needed
- **Before major releases**: Validate all skills work correctly

### Versioning

When updating skills:
1. Document changes in SKILL.md
2. Test with real use cases
3. Update SKILLS-INDEX.md if needed
4. Notify team of significant changes

---

## See Also

- `AGENTS.md` — Project overview and agent definitions
- `SUBAGENT-PLAN.md` — Complete subagent architecture
- `DEVELOPMENT-WORKFLOW.md` — Content development process
- `/usr/lib/node_modules/openclaw/skills/skill-creator/SKILL.md` — Skill creation guide
