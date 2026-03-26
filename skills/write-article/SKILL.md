# Regen Toolkit Article Writing Skill

Write publication-ready articles for the Regen Toolkit using a 5-stage editorial pipeline.

## What This Skill Does

Takes an article slug (e.g. `gas-fees`) and runs it through 5 stages to produce a complete, fact-checked, properly formatted article. Works on any OpenClaw install with no external dependencies beyond web search.

## Quick Start

```
Write the article for slug: gas-fees
Use the skill at skills/write-article/SKILL.md
```

Or batch:
```
Write articles for these slugs: gas-fees, consensus-mechanisms, key-properties
Use the skill at skills/write-article/SKILL.md
```

## Prerequisites

- OpenClaw with web search enabled
- Clone of `github.com/explorience/regen-toolkit`
- Articles live in `src/content/docs/{slug}.md`

## The Pipeline

### Stage 1: RESEARCH

**Goal:** Gather factual material from real sources. No writing yet.

1. Read the stub article at `src/content/docs/{slug}.md` to understand the topic
2. Read 3-5 existing published articles in the same domain for voice/quality reference (check `related:` fields and articles with similar `tags.function`)
3. Web search for the topic using 3+ queries
4. Consult approved sources (see Source List below)
5. Output a research brief to `working/{slug}-research.md` containing:
   - Key facts and concepts (with source URLs)
   - Real-world examples and case studies
   - Common misconceptions to address
   - Gaps where information is weak

**Quality gate:** At least 3 credible sources. No unsourced claims.

### Stage 2: DRAFT

**Goal:** Write the first draft from the research brief.

1. Read the research brief at `working/{slug}-research.md`
2. Read the Style Guide (below) carefully
3. Read 2-3 published articles for voice calibration
4. Write the full article following the Article Structure (below)
5. Save to `src/content/docs/{slug}.md` (overwrite the stub)

**Quality gate:** 800-1800 words (depending on type). All claims sourced. Correct frontmatter.

### Stage 3: FACT-CHECK

**Goal:** Verify every specific claim against sources.

1. Read the draft article
2. Read the research brief
3. For each specific claim (statistics, dates, project names, how things work):
   - Mark ✅ if verified against a source
   - Mark ⚠️ if plausible but unverified
   - Mark ❌ if incorrect or unsourced
4. Web search to verify any ⚠️ claims
5. Output to `working/{slug}-factcheck.md`
6. If any ❌: fix the article directly. Max 3 revision cycles.

**Quality gate:** Zero ❌ claims. Maximum 2 ⚠️ unverified claims.

### Stage 4: EDIT

**Goal:** Polish for clarity, style consistency, and actionability.

1. Read the article
2. Check against the Style Guide anti-patterns (below)
3. Check frontmatter is complete and correct
4. Verify all links work (web search to confirm URLs)
5. Edit the article in place

**Checklist:**
- [ ] No AI slop phrases
- [ ] Active voice throughout
- [ ] Jargon defined on first use
- [ ] Short paragraphs (1-3 sentences)
- [ ] "Try This" exercises included (if actionable content)
- [ ] References section with live links
- [ ] Description is a real sentence (not "Learn about X in this article")

### Stage 5: CRITIQUE

**Goal:** Final review for audience fit and strategic alignment.

1. Read the finished article as if you are Maya (see Personas below)
2. Ask:
   - Would Maya understand this without prior crypto knowledge?
   - Does it answer "why should I care?" in the first 2 paragraphs?
   - Are the examples grounded in real community work?
   - Is there a clear action the reader can take?
3. Output verdict to `working/{slug}-critique.md`:
   - **PUBLISH** - ready to go
   - **REVISE** - specific issues listed
   - **REJECT** - fundamental problems

4. If PUBLISH: update frontmatter `status: published`, `stage: published`
5. If REVISE: fix issues and re-critique (max 2 cycles)

---

## Style Guide

### Voice & Tone
- Friendly but not condescending
- Practical over theoretical
- "Here's how" over "Here's why" (for beginners)
- Acknowledge complexity without drowning in it
- Active voice: "You can set up" not "One can set up"
- Direct: "This creates" not "This may potentially lead to"

### Anti-Patterns (NEVER use these)
- "Let's explore" / "Let's dive in" / "Let's unpack"
- "Navigate" (unless literally about maps)
- "Journey" / "Landscape" / "Ecosystem" (unless literal)
- "Paradigm shift" / "Game-changer" / "Revolutionary"
- "Leverage" (unless talking about actual financial leverage)
- "Robust" / "Seamless" / "Groundbreaking" / "Cutting-edge"
- "In today's rapidly evolving..." / "In the world of..."
- Exclamation marks for cheerleading
- Emoji in body text
- "Web3 is transforming..." / "Blockchain will revolutionize..."
- Starting paragraphs with "It's important to note that..."
- "[Source X]" markers in body text

### Formatting
- Use `##` headings for main sections
- Use `>` blockquotes for tiered exercises
- Use `-` bullet lists for key points
- Use spaced hyphens ` - ` instead of em dashes
- No markdown tables in body (use lists instead)
- One blank line between sections

### Opening Pattern
Start with a concrete scenario, problem, or question that the reader recognizes from their own experience. NOT with a definition or history lesson.

**Good:** "Have you ever tried to keep track of who owes what in a community garden project?"
**Bad:** "Blockchain technology is a distributed ledger system that..."

### Closing Pattern
End with a "Try This" section (tiered exercises) and/or a References section. No summary paragraphs that just repeat what was said.

---

## Article Structure

```markdown
---
title: "Clear Descriptive Title"
description: "One real sentence explaining what this article covers"
status: published
last_updated: 'YYYY-MM-DD'
sources:
  - Source Name (URL)
tags:
  function: Education|Community-Building|Security|Governance|Coordination|Impact-Measurement|Economic-Design|Funding|Identity|Infrastructure
  domain: Web3-Literacy|Community|Technical|Ecosystem|Governance|Economics|Personal
  systems:
    - Pick 1-3 from: Decentralization, Trust-Networks, Resilience, Emergence, Feedback-Loops, Commons, Polycentric-Governance, Circular-Economy, Mutual-Aid, Subsidiarity, Fractals, Thresholds
audience: Individual|Community-Steward|Local-Organizer|DAO-Operator|Researcher
maturity: Beginner|Intermediate|Advanced
related:
  - 2-4 slugs of related articles
---

# Title

Opening paragraph: concrete scenario or problem the reader recognizes.

## First Major Section
Content with short paragraphs. Define jargon on first use.

## Second Major Section
Real examples from actual projects (not hypothetical).

## Try This
> **Beginner:** Simple first step anyone can take
> **Intermediate:** Hands-on exercise requiring some setup
> **Advanced:** Deep implementation challenge

## References
- [Source Name](https://url) - brief description of what it covers
```

### Article Types and Word Counts
- **Foundations** (concepts, definitions): 800-1200 words
- **Implementation Guides** (how-to): 1200-1800 words
- **Case Studies** (real examples): 800-1500 words

---

## Personas

### Maya (Primary - "Grounded Regen")
- 28, permaculture teacher in Somaliland
- Has a smartphone, uses mobile money (M-Pesa)
- No crypto experience whatsoever
- Cares about: food sovereignty, community resilience, women's education
- Needs: everything explained from scratch, no assumed knowledge
- Analogies that work: nature, community, market stalls, family

### Alex ("Curious Degen")
- Has traded crypto, understands DeFi basics
- Wants to do something meaningful with skills/capital
- Needs: legitimacy signals, concrete impact data, technical details OK
- Watch for: they'll skip anything that feels too basic

### Jordan ("On-Chain Regen")
- Works in ReFi, knows web3 basics
- Wants: patterns, playbooks, governance frameworks, operational detail
- Needs: depth, not intro-level explanations

**Default to Maya.** If the article is Track 2 or Track 3, consider Alex/Jordan but still define jargon.

---

## Tag Vocabulary

### Function (pick one)
| Tag | Use for |
|-----|---------|
| Education | Explains a concept or teaches understanding |
| Community-Building | Strengthening groups, relationships, coordination |
| Security | Protecting assets, identity, data |
| Governance | Decision-making, voting, proposals, DAOs |
| Coordination | Organizing people and resources |
| Impact-Measurement | Tracking, verifying, reporting outcomes |
| Economic-Design | Token design, currency systems, incentives |
| Funding | Grants, donations, fundraising, treasury |
| Identity | Credentials, verification, reputation |
| Infrastructure | Technical setup, tooling, platforms |

### Domain (pick one)
| Tag | Use for |
|-----|---------|
| Web3-Literacy | Core blockchain/crypto concepts |
| Community | Local organizing, community dynamics |
| Technical | Implementation details, code, protocols |
| Ecosystem | ReFi landscape, projects, networks |
| Governance | DAO structures, voting, decision-making |
| Economics | Tokenomics, currencies, funding models |
| Personal | Individual skills, security, wallets |

### Systems Concepts (pick 1-3)
Decentralization, Trust-Networks, Resilience, Emergence, Feedback-Loops, Commons, Polycentric-Governance, Circular-Economy, Mutual-Aid, Subsidiarity, Fractals, Thresholds

Only apply concepts that are genuinely relevant to the article. Do not force-fit.

---

## Approved Sources

Use these for research. Cite specific pages/projects, not just the homepage.

| Source | Best For |
|--------|----------|
| [Bankless Academy](https://app.banklessacademy.com/) | Beginner web3 education |
| [ReFi DAO Local Toolkit](https://refidao.github.io/local-refi-toolkit/) | Playbooks, local node patterns |
| [Greenpill Network](https://greenpill.network/) | Philosophy, public goods |
| [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/) | DAO patterns, governance |
| [Open Civics](https://opencivics.co) | Civic innovation frameworks |
| [P2P Foundation Wiki](https://p2pfoundation.net) | Governance patterns, cooperatives |
| [Restor](https://restor.org) | Ecological restoration projects |
| [Hylo](https://hylo.com) | Grassroots community initiatives |
| [Weavers Network](https://weavers.network) | Community trust-building |
| [Second Renaissance](https://secondrenaissance.com) | Regenerative ecosystem map |
| [Mango Research](https://mangoresearch.co) | Blockchain/DLT research |
| [CryptoAltruists Toolkit](https://cryptoaltruists.com/toolkit) | Nonprofit web3 onboarding |
| [Ethereum Localism Book](https://greenpill.network/pdf/ethereum-localism.pdf) | Localism theory |
| [BioFi Project](https://biofi.earth) | Bioregional finance |

**Rule:** Never hallucinate a source. If you can't find it, say so in the research brief.

---

## Working Directory

The pipeline creates intermediate files in `working/` at the repo root:

```
working/
├── {slug}-research.md    # Stage 1 output
├── {slug}-factcheck.md   # Stage 3 output
└── {slug}-critique.md    # Stage 5 output
```

These are gitignored and not deployed. They exist for auditability.

---

## Example: Running the Pipeline

For a single article:

```
1. Read src/content/docs/gas-fees.md (the stub)
2. Research: web search "ethereum gas fees explained", check Bankless Academy, check existing articles like what-is-cryptocurrency.md and what-is-ethereum.md for voice
3. Write research brief to working/gas-fees-research.md
4. Draft the article (800-1200 words, Beginner, Maya persona)
5. Fact-check every claim
6. Edit for style compliance
7. Critique as Maya - would she understand this?
8. Set status: published in frontmatter
9. Commit
```

For batch processing, repeat for each slug. Read 2-3 published articles ONCE at the start for voice calibration, then reuse that understanding.
