# Regen Toolkit Agent Guide

Educational content repository for regenerative finance knowledge.

## Quick Facts
- **Type**: Content/educational repository (markdown-only)
- **Purpose**: Transform scattered ReFi knowledge into interconnected ecosystem
- **Status**: Structure complete (138 placeholder articles), content development in progress
- **Audience**: Three personas (Grounded Regen, Curious Degen, On-Chain Regen)

## Structure
```
content/
├── 1-foundations/ (46 files)      # Track 1: Foundations (10 sections, 72 articles)
├── 2-applied/ (92 files)          # Track 2: Applied Web3 for Impact (14 sections, 66 articles)
├── 3-playbooks/ (6 subsections)   # Track 3: Playbooks, Patterns & Case Studies
└── sources/ (15 source documents) # Source attribution system (A-O)
```

## Cursor AI Resources

### Project-Specific Resources

**Skills**:
- `regen-toolkit-builder` - Autonomous content developer for articles, playbooks, and tool assessments ([`.cursor/skills/regen-toolkit-builder/SKILL.md`](.cursor/skills/regen-toolkit-builder/SKILL.md))
- `web3-tool-assessor` - 4-dimension maturity assessment framework for web3 protocols ([`.cursor/skills/web3-tool-assessor/SKILL.md`](.cursor/skills/web3-tool-assessor/SKILL.md))
- `source-synthesizer` - Synthesize multiple sources into cohesive content ([`.cursor/skills/source-synthesizer/SKILL.md`](.cursor/skills/source-synthesizer/SKILL.md))
- `cross-link-validator` - Validate and maintain cross-link networks ([`.cursor/skills/cross-link-validator/SKILL.md`](.cursor/skills/cross-link-validator/SKILL.md))
- `research-orchestrator` - Deep research with academic rigor for web3 topics ([`.cursor/skills/research-orchestrator/SKILL.md`](.cursor/skills/research-orchestrator/SKILL.md))

**Agents**:
- `regen-toolkit-builder` - Specialized subagent for content development, tool maturity assessment, and critical path mapping ([`.cursor/agents/regen-toolkit-builder.md`](.cursor/agents/regen-toolkit-builder.md))

**Rules**: None (follows root-level rules)

**Master Plans**:
- `SUBAGENT-PLAN.md` - Complete subagent architecture and implementation plan
- `SKILLS-INDEX.md` - Comprehensive index of all skills and their usage patterns
- `REQUIREMENTS.md` - Project intake questionnaire (9 sections)
- `DEVELOPMENT-WORKFLOW.md` - Systematic workflow guide (6 phases)
- `DEVELOPMENT.md` - Coordination hub with progress tracking
- `docs/collaboration-platform.md` - Team workflow and GitHub issue tracking
- `docs/writing-system.md` - Multi-agent AI pipeline specification
- `docs/canvases/regen-toolkit-master.canvas` - Visual master plan (Obsidian Canvas)
- `docs/canvases/regen-toolkit-architecture.canvas` - Architecture visualization
- `docs/canvases/regen-toolkit-content-structure.canvas` - Content map
- `docs/canvases/regen-toolkit-dev-workflow.canvas` - Development process visualization

### Team Collaboration Infrastructure

**GitHub Issue Tracking**: Every article has an issue with labels:
- `needs-writing` → `in-progress` → `needs-review` → `done` → `blocked`

**Web Dashboard**: [os.heen.al/toolkit](https://os.heen.al/toolkit) — Visual article management, filtering, real-time collaborative editing

**Article Frontmatter Now Includes**:
- `issue: 79` — GitHub issue number
- `assignees: [explorience]` — Who's responsible
- `critical_paths: [sarreya, forest-city]` — Use case alignment
- `priority: tier-1` — tier-1, tier-2, or tier-3

### Inherited Resources

**From Root-Level** (`.cursor/` in Zettelkasten root):
- `refi-content-generation` - Generate ReFi ecosystem content
- `quick-push` - Quick git workflow operations
- `knowledge-curator` - Deep research and synthesis
- `meeting-processor` - Process meeting transcripts
- `docs-consolidator` - Consolidate documentation
- `project-reviewer` - Analyze project status

**From User-Level** (`~/.cursor/skills/`):
- `idea-planning` - Apply IDEA Framework
- `knowledge-synthesis` - Curate and synthesize content
- `meeting-notes` - Process meeting transcripts
- `academic-deep-research` - Rigorous multi-cycle research methodology
- `weekly-synthesis` - Pattern recognition across week's work

## Context Gathering

### Essential Reading (First Pass)
1. This `AGENTS.md` file
2. `README.md` - Project overview, three-track structure, source references
3. `REQUIREMENTS.md` - Project intake questionnaire
4. `DEVELOPMENT-WORKFLOW.md` - Systematic workflow guide
5. `SKILLS-INDEX.md` - Available skills and when to use them

### Ecosystem Capacity Mapping

The toolkit serves **real projects, local nodes, and Greenpill chapters**:

| Node Type | Priority Content | Capacity Focus |
|-----------|------------------|----------------|
| **Emerging Nodes** (0-6mo) | Track 1 + 2.1 | Onboarding, starting |
| **Developing Nodes** (6-18mo) | Track 2 + 3.2 | Applied tools, patterns |
| **Mature Nodes** (18mo+) | Track 3 + deep-dives | Advanced implementation |
| **University Chapters** | 1.8, 2.7, 1.1-1.3 | Governance, education |
| **Community Land Projects** | 2.6, 2.9, 3.1 | Funding, local currencies |
| **Impact DAOs** | 2.7, 2.8, 3.1 | Governance, impact verification |

**Content tags to use**: `[[Local Node Starter]]`, `[[Impact DAO]]`, `[[University Chapter]]`

### Architecture Understanding
- Content structure: 3 tracks (Foundations, Applied Web3, Playbooks)
- Source attribution: `content/sources/` (15 sources A-O)
- Dual-repo architecture: Main (stable) + Dev (active development with Quartz)

### Planning Context
- `REQUIREMENTS.md` - Intake questionnaire (9 sections)
- `DEVELOPMENT-WORKFLOW.md` - 6-phase workflow (Priority Mapping → Translation)
- `DEVELOPMENT.md` - Progress tracking and coordination
- Priority order: P0 (Protocol Playbooks, Wallets & Security, Crypto Philanthropy)

### Code Navigation
- **Content**: `content/1-foundations/`, `content/2-applied/`, `content/3-playbooks/`
- **Sources**: `content/sources/` (source attribution system)
- **Documentation**: `docs/` (canvases, workflows, inspiration)

### Search Patterns
**When looking for content structure**: Check `README.md` three-track system  
**When working on articles**: See `DEVELOPMENT-WORKFLOW.md` 6-phase process  
**When mapping sources**: Reference `content/sources/` attribution system  
**When choosing skills**: See `SKILLS-INDEX.md` skill selection guide

### Integration Points
- Depends on: Local-ReFi-Toolkit (Quartz implementation)
- Used by: regen-toolkit-interface (UI visualization)
- Shares patterns with: Local-ReFi-Toolkit (content structure, IDEA framework)

**For Complete Context**: See root `CONTEXT-GATHERING-GUIDE.md` for regen-toolkit section.

---

## Skills at a Glance

### Content Development Skills

| Skill | Use When | Output |
|-------|----------|--------|
| `regen-toolkit-builder` | Creating articles, playbooks, critical paths | Publication-ready content |
| `source-synthesizer` | Combining multiple sources (B+M+O) | Integrated narrative |
| `web3-tool-assessor` | Evaluating protocol maturity | 4-dimension assessment |

### Research Skills

| Skill | Use When | Output |
|-------|----------|--------|
| `research-orchestrator` | Deep research on protocols/cases | Research report with evidence |
| `academic-deep-research` | Exhaustive investigation | Academic-style report |
| `knowledge-curator` (root) | Cross-project synthesis | Knowledge artifacts |

### Quality & Maintenance Skills

| Skill | Use When | Output |
|-------|----------|--------|
| `cross-link-validator` | Checking link integrity | Audit report + fixes |
| `refi-content-generation` | ReFi-specific content | Org-aligned materials |

---

## Using the Regen Toolkit Builder Subagent

The `regen-toolkit-builder` subagent is available for autonomous content development.

### Before You Start

**Check the dashboard first**: [os.heen.al/toolkit](https://os.heen.al/toolkit)
- See if article is already assigned
- Check current status label (`needs-writing`, `in-progress`, etc.)
- Don't duplicate work already in progress

### Activation Examples

**Develop a specific article**:
```
"regen-toolkit-builder: Write article 1.1.1 'Why are regeneratives interested in blockchain?'"
```

**Assess a tool for playbook**:
```
"regen-toolkit-builder: Assess Gitcoin Grants maturity and create protocol playbook"
```

**Map a critical path**:
```
"regen-toolkit-builder: Map and develop the Somaliland project critical path"
```

**Batch develop a section**:
```
"regen-toolkit-builder: Develop Track 1.5 Wallets & Security as P0 priority"
```

### What the Subagent Does

1. **Checks dashboard** — Verifies article status at os.heen.al/toolkit
2. **Reads context** — AGENTS.md, README.md, workflows, collaboration-platform.md
3. **Researches sources** — From content/sources/ and external materials
4. **Writes content** — Following type templates (Foundational, Applied, Playbook, Case Study)
5. **Updates frontmatter** — Includes issue number, assignees, critical_paths, priority
6. **Assesses tools** — Using 4-dimension maturity framework (when applicable)
7. **Creates cross-links** — Dense internal link networks
8. **Updates tracking** — Progress in DEVELOPMENT.md + GitHub issue labels
9. **Reports completion** — With next actions and dashboard updates needed

### Priority Development Order

**P0 (Critical)**: Track 3.1 Protocol Playbooks, 1.5 Wallets & Security, 1.10 Crypto Philanthropy  
**P1 (High)**: Track 1.1, 1.8, 2.6, 2.7, 2.8  
**P2 (Medium)**: Remaining tracks

See `SUBAGENT-PLAN.md` for complete architecture.

---

## Skill Selection Guide

### "I need to research a new protocol..."
→ Use `research-orchestrator` for deep research, then `web3-tool-assessor` for evaluation

### "I need to write an article from multiple sources..."
→ Use `source-synthesizer` for synthesis, then `regen-toolkit-builder` for article creation

### "I need to check if articles are properly linked..."
→ Use `cross-link-validator` for audit and link optimization

### "I need to assess if a tool is ready for nonprofits..."
→ Use `web3-tool-assessor` for structured 4-dimension evaluation

### "I need exhaustive research with academic rigor..."
→ Use `academic-deep-research` for 2-cycle systematic investigation

### "I need to create content that matches ReFi DAO style..."
→ Use `refi-content-generation` (inherited) for terminology and patterns

---

## Development

Content-only repository. No build system configured. Follows dual-repository architecture with Local-ReFi-Toolkit.

### Skill Development

New skills can be added to `.cursor/skills/` following the skill-creator best practices:

1. Create skill directory: `.cursor/skills/[skill-name]/`
2. Write `SKILL.md` with frontmatter and instructions
3. Add optional `scripts/`, `references/`, `assets/` as needed
4. Update `AGENTS.md` and `SKILLS-INDEX.md`
5. Test with real use cases
6. Iterate based on feedback

See `/usr/lib/node_modules/openclaw/skills/skill-creator/SKILL.md` for detailed guidance.

---

## Integration

Part of ReFi ecosystem knowledge infrastructure. Links to Local-ReFi-Toolkit for Quartz implementation.

### Skill Ecosystem Integration

The regen-toolkit skills form a cohesive ecosystem:

```
research-orchestrator → web3-tool-assessor → regen-toolkit-builder
         ↓                      ↓                      ↓
    Deep research         Maturity eval         Article creation
         ↓                      ↓                      ↓
    Evidence report       Assessment doc        Published content
                                                        ↓
                                              cross-link-validator
                                                        ↓
                                                Link audit/fixes
```

All skills integrate with inherited resources from root and user levels.
