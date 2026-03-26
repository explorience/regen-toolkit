---
name: regen-toolkit
description: Write, review, and publish articles for the Regen Toolkit. Includes the full 5-stage editorial pipeline, contributor workflow, topic selection, and PR submission process. Use this skill for any content work on the regen-toolkit repo.
---

# Regen Toolkit Content Skill

Everything you need to contribute articles to the Regen Toolkit - from picking a topic to submitting a PR.

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/explorience/regen-toolkit.git
cd regen-toolkit

# 2. Install dependencies (for local preview)
npm install

# 3. Create a working branch
git checkout -b content/{your-name}/{slug}

# 4. Preview locally
npm run dev
# Site runs at http://localhost:4321
```

If using OpenClaw, point your agent at this skill file and it handles everything.

---

## Finding What to Write

### Option 1: Pick from GitHub Issues

Browse [open issues](https://github.com/explorience/regen-toolkit/issues) - each article has its own issue with:
- File path (`src/content/docs/{slug}.md`)
- Task checkboxes (Research, Write, Review, Publish)
- Current status

Filter by label or search for topics you know.

### Option 2: Pick from Stub Articles

```bash
# List all stub articles (not yet written)
grep -rl "status: not-started" src/content/docs/ | sort
```

Each stub has a title and basic metadata. Pick one that matches your expertise.

### Option 3: Propose a New Topic

If something's missing:
1. Open an issue describing the topic and why it matters
2. Wait for maintainer approval
3. Create the article file at `src/content/docs/{slug}.md`

### Priority Order

1. **Phase 2 articles** (43 medium-length stubs) - partially outlined, need full writing
2. **Phase 3 articles** (139 minimal stubs) - need research + writing from scratch
3. **New topics** - gaps identified through contributor feedback

---

## The Editorial Pipeline

Every article goes through 5 stages. You can do all stages yourself or hand off between stages.

### Stage 1: RESEARCH

**Goal:** Gather factual material from real sources. No writing yet.

1. Read the stub at `src/content/docs/{slug}.md` to understand the topic
2. Read 3-5 published articles in the same domain for voice/quality reference
3. Web search for the topic using 3+ queries
4. Check the Approved Sources list (below)
5. Create `working/{slug}-research.md` containing:
   - Key facts and concepts (with source URLs)
   - Real-world examples and case studies
   - Common misconceptions to address
   - Gaps where information is weak

**Quality gate:** At least 3 credible sources. No unsourced claims. Never hallucinate a source.

### Stage 2: DRAFT

**Goal:** Write the full article from the research brief.

1. Read the research brief at `working/{slug}-research.md`
2. Read the Style Guide (below) carefully
3. Read 2-3 published articles for voice calibration (especially ones like `what-is-blockchain.md`, `conflict-resolution.md`, `building-trust.md`)
4. Write the article following the Article Structure (below)
5. Save to `src/content/docs/{slug}.md` (overwrite the stub)

**Quality gate:** 800-1800 words depending on type. All claims sourced. Complete frontmatter.

### Stage 3: FACT-CHECK

**Goal:** Verify every specific claim against sources.

1. Read the draft and the research brief
2. For each specific claim:
   - ✅ Verified against a source
   - ⚠️ Plausible but unverified - qualify with "reportedly" or remove
   - ❌ Incorrect or unsourced - fix immediately
3. Web search to verify any ⚠️ claims
4. Save report to `working/{slug}-factcheck.md`
5. Fix any issues directly in the article

**Quality gate:** Zero ❌ claims. Maximum 2 ⚠️ claims (and those must be qualified).

### Stage 4: EDIT

**Goal:** Polish for clarity, style consistency, and actionability.

1. Run through the Style Guide anti-patterns checklist
2. Verify frontmatter is complete and correct
3. Check all links work
4. Edit in place

**Checklist:**
- [ ] No AI slop phrases (see Anti-Patterns below)
- [ ] Active voice throughout
- [ ] Jargon defined on first use
- [ ] Short paragraphs (1-3 sentences)
- [ ] "Try This" exercises (if actionable content)
- [ ] References section with live links
- [ ] Description is a real sentence (not "Learn about X in this article")
- [ ] Opening paragraph starts with concrete scenario, not a definition

### Stage 5: CRITIQUE

**Goal:** Final review for audience fit.

1. Read the article as Maya (see Personas below)
2. Ask: Would she understand this without prior crypto knowledge?
3. Ask: Is there a clear action the reader can take?
4. Ask: Are examples grounded in real community work?
5. Save verdict to `working/{slug}-critique.md`: PUBLISH, REVISE, or REJECT

If PUBLISH: update frontmatter to `status: published`

---

## Submitting Your Work

### As a Pull Request

```bash
# 1. Make sure you're on your branch
git checkout content/{your-name}/{slug}

# 2. Add your files
git add src/content/docs/{slug}.md
git add working/{slug}-*.md  # Include pipeline working files

# 3. Commit with a clear message
git commit -m "Add article: {title}

- Completed 5-stage pipeline (research, draft, fact-check, edit, critique)
- Sources: [list key sources]
- Word count: ~{N}"

# 4. Push and create PR
git push origin content/{your-name}/{slug}
# Then open a PR on GitHub targeting main branch
```

### PR Description Template

```markdown
## Article: {Title}

**Slug:** `{slug}`
**Stage:** Ready for review (all 5 pipeline stages complete)
**Word count:** ~{N}
**Target audience:** {Maya/Alex/Jordan}

### Sources used
- [Source 1](url)
- [Source 2](url)

### Pipeline files included
- `working/{slug}-research.md` - research brief
- `working/{slug}-factcheck.md` - fact-check report
- `working/{slug}-critique.md` - final critique

### Checklist
- [ ] All claims verified against sources
- [ ] No AI slop language
- [ ] Frontmatter complete (tags, audience, maturity, related)
- [ ] "Try This" exercises included
- [ ] References section with live links
```

### Using OpenClaw

If you have OpenClaw set up, you can automate the whole pipeline:

```
Write the article for slug: gas-fees
Use the skill at skills/write-article/SKILL.md
```

For batch processing:
```
Write articles for these slugs: gas-fees, consensus-mechanisms, key-properties
Use the skill at skills/write-article/SKILL.md
```

---

## Style Guide

### Voice & Tone
- Friendly but not condescending
- Practical over theoretical
- "Here's how" over "Here's why" (for beginners)
- Acknowledge complexity without drowning in it
- Active voice: "You can set up" not "One can set up"
- Direct: "This creates" not "This may potentially lead to"

### Anti-Patterns (NEVER use)
- "Let's explore" / "Let's dive in" / "Let's unpack"
- "Navigate" (unless literally about maps)
- "Journey" / "Landscape" / "Ecosystem" (unless literal)
- "Paradigm shift" / "Game-changer" / "Revolutionary"
- "Leverage" (unless actual financial leverage)
- "Robust" / "Seamless" / "Groundbreaking" / "Cutting-edge"
- "In today's rapidly evolving..."
- Exclamation marks for cheerleading
- Emoji in body text
- "Web3 is transforming..." / "Blockchain will revolutionize..."
- "It's important to note that..."
- Starting with definitions or history

### Opening Pattern
Start with a concrete scenario, problem, or question from the reader's experience.

**Good:** "Have you ever tried to keep track of who owes what in a community garden project?"
**Bad:** "Blockchain technology is a distributed ledger system that..."

### Formatting
- `##` headings for main sections
- `>` blockquotes for tiered exercises
- `-` bullet lists for key points
- Spaced hyphens ` - ` instead of em dashes
- No markdown tables in body
- Short paragraphs (1-3 sentences)

---

## Article Structure

```yaml
---
title: "Clear Descriptive Title"
description: "One real sentence explaining what this covers"
status: published
last_updated: 'YYYY-MM-DD'
sources:
  - Source Name (URL)
tags:
  function: # pick one (see Tag Vocabulary)
  domain:   # pick one
  systems:  # pick 1-3
    - Concept1
    - Concept2
audience: # pick one
maturity: # pick one
related:  # 2-4 slugs
  - related-slug-1
  - related-slug-2
---

# Title

Opening: concrete scenario or problem the reader recognizes.

## Section 1
Short paragraphs. Define jargon on first use.

## Section 2
Real examples from actual projects.

## Try This
> **Beginner:** Simple first step
> **Intermediate:** Hands-on exercise
> **Advanced:** Deep implementation challenge

## References
- [Source](url) - what it covers
```

### Word Counts by Type
- **Foundations** (concepts): 800-1200 words
- **Implementation guides** (how-to): 1200-1800 words
- **Case studies** (examples): 800-1500 words

---

## Tag Vocabulary

### Function (pick one)
Education, Community-Building, Security, Governance, Coordination, Impact-Measurement, Economic-Design, Funding, Identity, Infrastructure

### Domain (pick one)
Web3-Literacy, Community, Technical, Ecosystem, Governance, Economics, Personal

### Systems Concepts (pick 1-3, only if genuinely relevant)
Decentralization, Trust-Networks, Resilience, Emergence, Feedback-Loops, Commons, Polycentric-Governance, Circular-Economy, Mutual-Aid, Subsidiarity, Fractals, Thresholds

### Audience (pick one)
Individual, Community-Steward, Local-Organizer, DAO-Operator, Researcher

### Maturity (pick one)
Beginner, Intermediate, Advanced

---

## Personas

### Maya (Primary - "Grounded Regen")
- 28, permaculture teacher in Somaliland
- Smartphone, mobile money, no crypto experience
- Cares about: food sovereignty, community resilience, women's education
- Needs: everything explained from scratch
- Analogies: nature, community, market stalls, family

### Alex ("Curious Degen")
- Has traded crypto, understands DeFi
- Wants meaningful impact, not just returns
- Technical details OK, needs legitimacy signals

### Jordan ("On-Chain Regen")
- Works in ReFi, knows web3 basics
- Wants: patterns, playbooks, governance frameworks
- Needs depth, not intro-level material

**Default to Maya** unless the topic is explicitly advanced.

---

## Approved Sources

| Source | Best For |
|--------|----------|
| [Bankless Academy](https://app.banklessacademy.com/) | Beginner web3 education |
| [ReFi DAO Local Toolkit](https://refidao.github.io/local-refi-toolkit/) | Playbooks, local node patterns |
| [Greenpill Network](https://greenpill.network/) | Philosophy, public goods |
| [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/) | DAO patterns, governance |
| [Open Civics](https://opencivics.co) | Civic innovation frameworks |
| [P2P Foundation Wiki](https://p2pfoundation.net) | Governance, cooperatives |
| [Restor](https://restor.org) | Ecological restoration |
| [Hylo](https://hylo.com) | Grassroots communities |
| [Weavers Network](https://weavers.network) | Trust-building models |
| [Second Renaissance](https://secondrenaissance.com) | Regenerative ecosystem map |
| [Mango Research](https://mangoresearch.co) | Blockchain/DLT research |
| [CryptoAltruists](https://cryptoaltruists.com/toolkit) | Nonprofit web3 onboarding |
| [Ethereum Localism](https://greenpill.network/pdf/ethereum-localism.pdf) | Localism theory |
| [BioFi Project](https://biofi.earth) | Bioregional finance |

**Rule:** Never invent a source. If you can't find information, say so.

---

## Working Directory

Pipeline intermediate files go in `working/` at the repo root:

```
working/
├── {slug}-research.md    # Stage 1: research brief
├── {slug}-factcheck.md   # Stage 3: verification report
└── {slug}-critique.md    # Stage 5: final verdict
```

These are gitignored from the deployed site but included in PRs so reviewers can see the process.

---

## Quality Reference

To calibrate quality, read these published articles before writing:

- `src/content/docs/what-is-blockchain.md` - good Beginner/Foundations example
- `src/content/docs/conflict-resolution.md` - good Intermediate/Applied example
- `src/content/docs/building-trust.md` - good Community-Building example
- `src/content/docs/silvi-protocol.md` - good case study example
- `src/content/docs/voting-mechanisms.md` - good Governance example

Match the voice, depth, and structure of these articles.
