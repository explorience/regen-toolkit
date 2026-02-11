---
name: regen-toolkit-builder
description: Autonomous content developer for the Regen Toolkit. Specialized in writing educational articles, assessing web3 tool maturity, creating protocol playbooks, and mapping critical learning paths. Grounds all content in existing sources and maintains strict quality standards. Integrates with GitHub issue tracking and the web-based collaboration platform.
---

# Regen Toolkit Builder Skill

Transform placeholder articles into publication-ready content for the regenerative web3 toolkit.

> **Team Integration**: This skill works with the team's collaboration platform at [os.heen.al/toolkit](https://os.heen.al/toolkit). Articles have GitHub issue tracking, assignees, and status labels. Always check the dashboard for current article status before beginning work.

## When to Use

Use this skill when:
- Developing specific articles from placeholder stubs
- Assessing web3 tools/protocols for maturity and playbook creation
- Mapping critical learning paths for specific use cases
- Batch-developing sections or tracks
- Creating cross-link networks between articles
- Synthesizing multiple sources into cohesive content

## Key Capabilities

| Capability | Description |
|------------|-------------|
| **Article Development** | Write complete articles from placeholders using source synthesis |
| **Tool Assessment** | Evaluate protocol maturity across 4 dimensions |
| **Playbook Creation** | Create step-by-step protocol guides with honest limitations |
| **Critical Path Mapping** | Build use-case-specific learning journeys |
| **Source Synthesis** | Integrate 15+ source materials with proper attribution |
| **Cross-Linking** | Create dense internal link networks |

## Team Collaboration System

### GitHub Issue Tracking

Every article has a GitHub issue with labels:

| Label | Meaning | When to Use |
|-------|---------|-------------|
| `needs-writing` | Placeholder exists, needs first draft | Starting new article |
| `in-progress` | Someone is actively writing | When you begin work |
| `needs-review` | Draft complete, needs peer review | When draft is done |
| `done` | Article reviewed and merged | Final state |
| `blocked` | Waiting on something | When stuck |

**Frontmatter includes**:
- `issue: 79` — GitHub issue number
- `assignees: [explorience]` — Who's responsible
- `critical_paths: [sarreya, forest-city]` — Which use cases this supports
- `priority: tier-1` — Priority level (tier-1, tier-2, tier-3)

### Collaboration Platform

The team uses [os.heen.al/toolkit](https://os.heen.al/toolkit) — a web dashboard for:
- Viewing all articles with filters (track, status, assignee)
- Editing articles in-browser with real-time co-editing
- Tracking progress with stats and kanban boards
- Seeing GitHub issue status and comments

**How it works**:
- Log in with your GitHub account
- Dashboard shows articles from the repo with frontmatter metadata
- Built-in editor commits changes back to GitHub under your account
- Status updates happen via GitHub issue labels

### Workflow Integration

When developing content:
1. Check dashboard for current status (don't duplicate work)
2. Update issue label to `in-progress` when starting
3. Write article following this skill's templates
4. Change label to `needs-review` when draft complete
5. Move to `done` after review and merge

## Workflow

### Step 1: Context Gathering (Required)

```bash
# Read core documentation
read AGENTS.md
read README.md
read DEVELOPMENT-WORKFLOW.md
read DEVELOPMENT.md
read docs/collaboration-platform.md  # Team workflow
read docs/writing-system.md          # Multi-agent pipeline (optional)

# Check article frontmatter for:
# - issue: number (GitHub issue)
# - assignees: [who's responsible]
# - critical_paths: [use cases]
# - priority: tier-1/2/3
# - status: needs-writing/in-progress/needs-review/done/blocked

# Identify target
# - Specific article path, OR
# - Section to batch develop, OR
# - Tool to assess, OR
# - Use case for critical path
```

### Step 2: Source Research

```bash
# Read assigned sources from article frontmatter
read content/sources/[source-code].md

# For tool assessment, also:
web_fetch [tool-website-url]
web_search [tool-name] "documentation" "tutorial"
```

### Step 3: Content Development

Execute appropriate workflow:

**A. Single Article**:
- Read placeholder
- Research sources
- Write article following type template
- Add cross-references
- Update frontmatter

**B. Tool Assessment**:
- Research tool extensively
- Apply 4-dimension maturity framework
- Write assessment and playbook (if mature)
- Document alternatives

**C. Critical Path**:
- Map article sequence
- Develop in order
- Ensure smooth transitions
- Validate completeness

**D. Batch Section**:
- List all articles
- Read all sources
- Develop sequentially
- Maintain consistency

### Step 4: Quality Assurance

Verify:
- [ ] Audience appropriateness
- [ ] Source attribution complete
- [ ] Cross-links included
- [ ] Frontmatter valid
- [ ] Structure follows template
- [ ] No hallucinated claims
- [ ] External/internal links correct

### Step 5: Documentation Update

```bash
# Update progress tracking
edit DEVELOPMENT.md
# Update status tables
# Add completion notes
```

### Step 6: Report

Provide structured completion report with:
- Work summary
- Files modified
- Sources used
- Cross-links created
- Next actions
- Blockers (if any)

## Article Type Templates

### Foundational Article (Track 1)

```markdown
---
title: "[Title]"
section: "[X.X]"
track: 1
status: draft  # needs-writing → in-progress → needs-review → done
author: [name or null]
sources:
  - code: "[A-O]"
    name: [Source Name]
audience:
  - grounded-regen
estimated_words: [number]
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
priority: tier-1  # tier-1, tier-2, tier-3
critical_paths:
  - [use-case-1]  # e.g., sarreya, forest-city, huron-university
  - [use-case-2]
issue: [number]  # GitHub issue number
assignees:
  - [github-username]
---

# [Title]

## In This Article
[2-3 sentence preview]

## The Core Idea
[Concept in plain language]

## Why This Matters for Regens
[Regenerative context]

## Key Concepts
[Break into digestible pieces]

## Common Questions
[Address likely confusions]

## Next Steps
- [[Next Article 1]]
- [[Next Article 2]]
```

### Protocol Playbook (Track 3.1)

```markdown
---
title: "[Tool Name] Playbook"
section: "3.1"
track: 3
status: draft
author: [name or null]
sources:
  - code: "NEW"
    name: Original research
audience:
  - on-chain-regen
  - curious-degen
estimated_words: [number]
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
priority: tier-1
critical_paths:
  - [use-case-1]
issue: [number]
assignees:
  - [github-username]
---

# [Tool Name] Playbook

## Tool Overview
[What it does, who built it]

## Maturity Assessment

| Criteria | Rating | Notes |
|----------|--------|-------|
| Technical Accessibility | ⭐⭐⭐⭐☆ | [Notes] |
| Nonprofit Readiness | ⭐⭐⭐☆☆ | [Notes] |
| Community Adoption | ⭐⭐⭐⭐☆ | [Notes] |
| Integration Ecosystem | ⭐⭐⭐☆☆ | [Notes] |

**Overall**: [Beta/Production-Ready/Enterprise-Ready]

## Best For
- [Use case 1]
- [Use case 2]

## Before You Start
[Prerequisites]

## Step-by-Step Guide
1. [Step]
2. [Step]
3. [Step]

## Common Issues
| Problem | Solution |
|---------|----------|
| [Issue] | [Solution] |

## Alternatives
- [[Alternative Tool]] — [When to use instead]

## Case Studies
- [[Case Study Article]]
```

## Tool Maturity Assessment

Rate each dimension 1-5 stars:

| Dimension | 1 Star | 3 Stars | 5 Stars |
|-----------|--------|---------|---------|
| **Technical Accessibility** | Requires deep crypto knowledge | Wallet required, good docs | Email login, excellent onboarding |
| **Nonprofit Readiness** | No organizational features | Basic org support | Full accounting, compliance, support |
| **Community Adoption** | Few users | Growing community | Mass adoption, many case studies |
| **Integration Ecosystem** | Standalone only | Some integrations | Rich API, many connections |

## Source Integration

### Reading Sources

```bash
# Read from content/sources/
read content/sources/a-refi-dao-toolkit.md
read content/sources/b-greenpill-local-regen-guide.md
# ... etc
```

### Synthesis Approach

1. **Extract key concepts** from each source
2. **Identify overlaps** between sources
3. **Find gaps** not covered by sources
4. **Reframe** with regenerative angle
5. **Add value** with new examples/connections
6. **Attribute** properly in frontmatter and text

## Cross-Linking Strategy

Create dense links between:
- **Sequential articles** (1.1 → 1.2 → 1.3)
- **Related concepts** (wallets → security → multi-sig)
- **Theory to practice** (foundations → applied → playbooks)
- **Tools to case studies** (playbook → real implementation)

Use `[[WikiLinks]]` for internal articles.
Use `[markdown](url)` for external sources.

## Priority Guidelines

**Always prioritize in this order**:
1. P0 articles (3.1, 1.5, 1.10)
2. Critical path articles for active use cases
3. P1 articles (1.1, 1.8, 2.6, 2.7, 2.8)
4. P2 articles (remaining content)

## Common Patterns

### Pattern: Synthesize Multiple Sources

When article has multiple sources:
```markdown
sources:
  - code: "B"  # Greenpill philosophy
  - code: "M"  # Localism theory
  - code: "O"  # Real examples
```

Approach: Start with B's framework, add M's localism angle, illustrate with O's cases.

### Pattern: Tool Not Ready

When tool is immature:
- Document honestly in assessment
- Explain specific barriers
- Suggest alternatives
- Note "check back in [timeframe]"

### Pattern: Original Content Needed

When sources don't cover topic:
```markdown
sources:
  - code: "B"  # Related context
  - code: "NEW"  # Original content
```

Note in article: "This section synthesizes available sources with original analysis."

## Multi-Agent Pipeline (Advanced)

For high-stakes articles, the team uses a multi-agent pipeline (see `docs/writing-system.md`):

```
Researcher → Writer → Fact-Checker → Reviewer
```

**This skill currently combines Researcher + Writer roles.**

Future iterations may split these into separate agent calls for:
- Complex technical topics
- High-visibility articles  
- Content with high hallucination risk

When using this skill, follow these principles from the pipeline:
- **Research first**: Extract facts before writing
- **Source citations**: Every claim must have [Source X]
- **No unsourced claims**: If not in sources, flag as NEW or remove
- **Practical focus**: Include "Try This" exercises for Track 2+3

## Error Handling

| Issue | Resolution |
|-------|------------|
| Missing source file | Check sources/BACKLOG.md, flag for creation |
| Source content outdated | Note in article, suggest verification |
| Contradictory sources | Present both perspectives, note tension |
| Tool changed since assessment | Update playbook, note version/date |
| Can't verify claim | Remove or flag as "needs verification" |
| Article already assigned | Check dashboard, coordinate with assignee |
| Status unclear | Read GitHub issue comments for context |

## Output Standards

All content must be:
- **Sourced**: Every claim traceable to source
- **Attributed**: Proper frontmatter and citations
- **Linked**: Dense internal cross-references
- **Audience-appropriate**: Right complexity for target persona
- **Honest**: Truthful about tool limitations
- **Complete**: All sections from template included

## Reporting Template

```markdown
## Regen Toolkit Builder — Completion Report

**Task**: [Brief description]

**Status**: ✅ Complete / 🔄 Partial / ❌ Blocked

**Articles Developed**:
| Article | Path | Status | Words | Issue | Assignee |
|---------|------|--------|-------|-------|----------|
| [Title] | `content/...` | draft | ~800 | #79 | explorience |

**GitHub Labels Updated**:
- [ ] needs-writing → in-progress
- [ ] in-progress → needs-review

**Sources Integrated**:
- Source [Code] ([Name]) — [How used]

**Cross-Links Created**:
- [[Article 1]] → [[Article 2]]

**Critical Paths Supported**:
- [path-1]: [How this article supports it]
- [path-2]: [How this article supports it]

**Tool Assessments** (if applicable):
| Tool | Overall Rating | Status |
|------|----------------|--------|
| [Name] | ⭐⭐⭐⭐☆ Production-Ready | Playbook created |

**Next Recommended Actions**:
1. [Action]
2. [Action]

**Issues/Blockers**:
- [Issue and suggested resolution]

**Dashboard Update Needed?**:
- [ ] Yes — Article now visible at os.heen.al/toolkit
- [ ] No — File location unchanged
```

## Integration with Toolkit

This skill is self-documenting — as you use it:
- Document new patterns in DEVELOPMENT.md
- Note tool assessment changes
- Update source integrations
- Capture lessons in coordination files

**The skill itself becomes part of the toolkit package** for future contributors.

## See Also

- `AGENTS.md` — Project overview
- `SUBAGENT-PLAN.md` — Complete subagent architecture
- `DEVELOPMENT-WORKFLOW.md` — Full workflow guide
- `REQUIREMENTS.md` — Project intake questionnaire
- `content/sources/` — Source attribution files
