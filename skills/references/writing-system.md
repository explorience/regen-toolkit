# Toolkit Writing System

## The Problem

Writing 200+ educational articles with AI has risks:
- **Hallucination** - Making up facts, protocols, or advice that doesn't exist
- **Generic fluff** - Vague content that sounds good but doesn't help anyone
- **Inconsistency** - Different voice, terminology, depth across articles
- **Wrong audience** - Too technical for beginners, too basic for experts
- **Missing actionability** - Theory without practical steps

## The Solution: Multi-Agent Pipeline

Each agent has ONE job. No agent tries to do everything. Work flows through stages with quality gates.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARTICLE REQUEST                              │
│  Input: Article title, section, target audience, source codes   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 1: RESEARCHER                                            │
│                                                                 │
│  Job: Extract facts from sources. NO writing.                   │
│                                                                 │
│  Inputs:                                                        │
│  - Article topic                                                │
│  - List of source codes (e.g., A, B, E, P)                      │
│  - Access to source materials                                   │
│                                                                 │
│  Outputs:                                                       │
│  - Research brief with:                                         │
│    • Key concepts (with source citations)                       │
│    • Direct quotes worth including                              │
│    • Examples/case studies from sources                         │
│    • Links/resources mentioned in sources                       │
│    • Gaps: what sources DON'T cover                             │
│                                                                 │
│  Rules:                                                         │
│  - ONLY extract from provided sources                           │
│  - Flag if sources don't cover topic well                       │
│  - No synthesis, no opinions, just extraction                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 2: WRITER                                                │
│                                                                 │
│  Job: Write first draft from research brief.                    │
│                                                                 │
│  Inputs:                                                        │
│  - Research brief from Agent 1                                  │
│  - Article template                                             │
│  - Style guide                                                  │
│  - Target audience (🌱 🔄 💰)                                    │
│  - Word count target                                            │
│                                                                 │
│  Outputs:                                                       │
│  - First draft with:                                            │
│    • Clear structure (intro, sections, conclusion)              │
│    • Inline source citations [Source A]                         │
│    • Practical examples                                         │
│    • Action items / next steps                                  │
│                                                                 │
│  Rules:                                                         │
│  - ONLY use facts from research brief                           │
│  - Every claim must have a source citation                      │
│  - Match language to audience level                             │
│  - Include "Try This" practical exercises                       │
│  - No unsourced claims allowed                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 3: FACT-CHECKER                                          │
│                                                                 │
│  Job: Verify every claim. Catch hallucinations.                 │
│                                                                 │
│  Inputs:                                                        │
│  - Draft from Agent 2                                           │
│  - Original research brief                                      │
│  - Access to source materials                                   │
│                                                                 │
│  Outputs:                                                       │
│  - Fact-check report:                                           │
│    • ✅ Verified claims (with source confirmation)              │
│    • ⚠️ Unverified claims (not in sources)                      │
│    • ❌ Incorrect claims (contradicts sources)                  │
│    • 🔍 Claims needing external verification                    │
│                                                                 │
│  Rules:                                                         │
│  - Be paranoid - assume hallucination until proven              │
│  - Check URLs actually exist                                    │
│  - Verify protocol names, DAO names, tool names                 │
│  - Flag any "sounds plausible but unverified"                   │
│                                                                 │
│  Gate: If >2 ❌ or >5 ⚠️, return to Agent 2 for rewrite         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 4: EDITOR                                                │
│                                                                 │
│  Job: Polish for clarity, consistency, and actionability.       │
│                                                                 │
│  Inputs:                                                        │
│  - Fact-checked draft                                           │
│  - Style guide                                                  │
│  - Glossary of terms                                            │
│  - Example "gold standard" articles                             │
│                                                                 │
│  Outputs:                                                       │
│  - Edited draft with:                                           │
│    • Consistent terminology                                     │
│    • Simplified jargon (for 🌱 audience)                        │
│    • Improved flow and transitions                              │
│    • Stronger opening hook                                      │
│    • Clearer action items                                       │
│                                                                 │
│  Rules:                                                         │
│  - Don't add new facts (only rephrase)                          │
│  - Flag if article is too long/short                            │
│  - Ensure every section earns its place                         │
│  - Cut fluff ruthlessly                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 5: CRITIC (Target Persona)                               │
│                                                                 │
│  Job: Read as the target user. Find gaps and confusion.         │
│                                                                 │
│  Inputs:                                                        │
│  - Edited draft                                                 │
│  - Target persona description                                   │
│  - Persona's goals and context                                  │
│                                                                 │
│  Outputs:                                                       │
│  - Critique from persona's POV:                                 │
│    • "What confused me?"                                        │
│    • "What's still unclear?"                                    │
│    • "What would I do next?" (is it clear?)                     │
│    • "What's missing that I'd need?"                            │
│    • "Did this respect my time?"                                │
│    • Overall: SHIP IT or NEEDS WORK                             │
│                                                                 │
│  Rules:                                                         │
│  - Embody the persona fully                                     │
│  - Be honest, not nice                                          │
│  - Focus on usefulness, not polish                              │
│                                                                 │
│  Gate: If NEEDS WORK, return to Agent 4 (or Agent 2 if major)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AGENT 6: FINAL CHECK                                           │
│                                                                 │
│  Job: Format check and metadata.                                │
│                                                                 │
│  Outputs:                                                       │
│  - Final article with correct frontmatter                       │
│  - Updated status: placeholder → draft                          │
│  - Summary for PR/commit message                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        READY TO SHIP
```

---

## Quality Gates

### Gate 1: Research Completeness
- [ ] At least 3 source citations
- [ ] Key concepts extracted
- [ ] Gaps identified

### Gate 2: Draft Quality
- [ ] All claims have citations
- [ ] Matches word count target (±20%)
- [ ] Has intro, body, conclusion
- [ ] Has practical action items

### Gate 3: Fact-Check Pass
- [ ] Zero ❌ (incorrect claims)
- [ ] Max 2 ⚠️ (unverified claims)
- [ ] All URLs verified

### Gate 4: Edit Quality
- [ ] Passes style guide check
- [ ] Consistent terminology
- [ ] No fluff paragraphs

### Gate 5: Persona Approval
- [ ] Critic says "SHIP IT"
- [ ] No major confusion flags
- [ ] Clear next steps

---

## Supporting Documents Needed

### 1. Style Guide
```markdown
## Voice & Tone
- Friendly but not condescending
- Practical over theoretical
- "Here's how" over "Here's why" (for 🌱)
- Acknowledge complexity without drowning in it

## Structure
- Hook in first 2 sentences
- One main idea per section
- End sections with action or transition
- Total: 800-1200 words for foundations, 1500-2000 for applied

## Language Rules
- Define jargon on first use
- No unexplained acronyms
- "You" not "one" or "users"
- Active voice
- Short paragraphs (3-4 sentences max)

## What to Avoid
- "In this article, we will..."
- "It's important to note that..."
- "As we discussed above..."
- Hedge words: "somewhat", "relatively", "fairly"
- Unsourced superlatives: "best", "most popular", "leading"
```

### 2. Persona Cards

**🌱 Grounded Regen**
```
Name: Maya
Background: Permaculture teacher, community garden organizer
Tech comfort: Uses smartphone, basic apps, no crypto experience
Goals: "I want to understand if this web3 stuff can help my community"
Fears: Getting scammed, looking stupid, wasting time on hype
Language: No jargon. Explain everything. Use analogies to nature/community.
```

**💰 Curious Degen**
```
Name: Alex
Background: Software dev, has traded crypto, understands DeFi
Tech comfort: Very high, runs own node, uses multiple wallets
Goals: "I want to do something meaningful with my skills and capital"
Fears: Getting rugged by fake impact projects, greenwashing
Language: Can use technical terms. Focus on legitimacy signals, due diligence.
```

**🔄 On-Chain Regen**
```
Name: Jordan
Background: Works at a ReFi protocol, attended ETH Denver
Tech comfort: High, but gaps in governance/coordination theory
Goals: "I want to start a local chapter and bring others in"
Fears: Burning out, building something that doesn't matter
Language: Can assume web3 basics. Focus on patterns, playbooks, connections.
```

### 3. Source Access Protocol

For each source (A-S), we need:
- Full text or structured extracts
- Quick reference of what it covers
- Citation format

Example:
```yaml
source: A
name: ReFi DAO Local ReFi Toolkit
url: https://refidao.github.io/local-refi-toolkit/
covers:
  - Local node operations
  - Protocol playbooks
  - Regional case studies
cite_as: "[ReFi DAO Toolkit]"
```

---

## Implementation Options

### Option A: Manual Pipeline (Start Here)
Run each agent as a separate prompt, manually passing outputs.
- Pro: Full control, can adjust
- Con: Slow, manual work

### Option B: Skill-Based Automation
Create a `/write-article` skill that orchestrates the pipeline.
- Pro: Repeatable, consistent
- Con: Need to build it

### Option C: Background Agent System
Spin up agents in parallel/sequence automatically.
- Pro: Fast, scalable
- Con: Complex to build, harder to debug

**Recommendation:** Start with Option A for first 5-10 articles to refine the process, then build Option B.

---

## Iteration Protocol

When an article fails a gate:

1. **Minor issues** (style, clarity) → Agent 4 fixes directly
2. **Fact issues** (unverified claims) → Return to Agent 2 with specific fixes
3. **Major gaps** (missing context) → Return to Agent 1 for more research
4. **Fundamental problems** (wrong angle) → Human review, restart

Max iterations: 3 before human review required.

---

## Metrics to Track

Per article:
- [ ] Time from start to ship
- [ ] Number of iteration loops
- [ ] Fact-check pass rate
- [ ] Critic approval rate

Across toolkit:
- [ ] Articles completed vs. total
- [ ] Average quality score
- [ ] Most common failure modes

---

## Next Steps

1. [ ] Write the Style Guide (full version)
2. [ ] Create Persona Cards (detailed)
3. [ ] Set up Source Access (structured extracts)
4. [ ] Test pipeline on 3 pilot articles
5. [ ] Refine based on learnings
6. [ ] Build `/write-article` skill
