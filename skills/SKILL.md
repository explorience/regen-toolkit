---
name: regen-toolkit-article
description: Write high-quality, non-hallucinated educational articles for the Regen Toolkit using a multi-agent pipeline. Use when writing or revising articles for the regen-toolkit GitHub repo (248 placeholder articles across 3 tracks).
---

# Regen Toolkit Article Pipeline Skill

Write high-quality, non-hallucinated educational articles for the Regen Toolkit using a multi-agent pipeline.

## When to Use

Use this skill when writing or revising articles for `regen-coordination/regen-toolkit` (GitHub repo with 248 placeholder markdown files across 3 tracks).

## Pipeline Overview

```
Request → Research (Luz) → Draft (Rupa) → Fact-Check (Satya) → Edit (Sakshi) → Critique → Final
```

Each agent has ONE job. No agent tries to do everything.

---

## Agent Roles

### 1. Luz (Researcher)
**Job:** Extract facts from sources. NO writing.

**Inputs:**
- Article topic + GitHub file path
- Source codes (e.g., A, B, E, P) - see reference table
- Access to source materials

**Output:** Research brief with:
- Key concepts (source-cited)
- Direct quotes worth including
- Examples/case studies
- Links/resources mentioned
- Gaps: what sources DON'T cover

**Rules:**
- ONLY extract from provided sources
- Flag if sources don't cover topic
- No synthesis, no opinions
- **CITATION FORMAT:** Use `[Source A]`, `[Source D]`, `[Source S]` - NOT full source names like "[Source: Starknet]" or "[Source: AWS]"

### 2. Rupa (Writer)
**Job:** Write first draft from research brief.

**Inputs:**
- Research brief from Luz
- Article template
- Style guide (below)
- Target audience (🌱/🔄/💰)
- Word count target

**Output:** First draft with:
- Clear structure (intro, sections, conclusion)
- Inline citations [Source X]
- Practical examples
- Action items / next steps

**Rules:**
- ONLY use facts from research brief
- Every claim = source citation in `[Source X]` format
- Match language to audience
- Include "Try This" exercises
- **Preserve source codes from research brief** - don't expand them

### 3. Satya (Fact-Checker)
**Job:** Verify every claim. Catch hallucinations.

**Inputs:**
- Draft from Rupa
- Research brief
- Access to source materials

**Output:** Fact-check report:
- ✅ Verified claims
- ⚠️ Unverified (not in sources)
- ❌ Incorrect (contradicts sources)
- 🔍 Needs external verification

**Rules:**
- Be paranoid
- Check URLs exist
- Verify protocol/DAO/tool names
- Flag "sounds plausible but unverified"

**Gate:** >2 ❌ or >5 ⚠️ → return to Rupa

**IMPORTANT:** Even if gate is passed (≤2 ❌ and ≤5 ⚠️), ALL ⚠️ claims must be addressed:
- Remove the claim, OR
- Qualify with "reportedly", "estimates suggest", "approximately", OR
- Change to generic statement if specific stats can't be verified

Include fact-check notes in article frontmatter listing any fixes made.

### 4. Sakshi (Editor)
**Job:** Polish for clarity, consistency, actionability.

**Inputs:**
- Fact-checked draft
- Style guide
- Glossary

**Output:** Edited draft:
- Consistent terminology
- Simplified jargon (for 🌱)
- Improved flow
- Stronger hook
- Clearer action items

**Rules:**
- Don't add new facts
- Cut fluff ruthlessly

### 5. Persona Critique
**Job:** Read as target user.

**Inputs:**
- Edited draft
- Target persona (Maya/Alex/Jordan)

**Output:** SHIP IT or NEEDS WORK with:
- What confused me?
- What's still unclear?
- What's missing?
- Did this respect my time?

### 6. Final Check
**Job:** Format + metadata.

**Output:**
- Correct frontmatter
- Status: placeholder → draft
- Commit-ready

---

## Style Guide

### Voice & Tone
- Friendly but not condescending
- Practical over theoretical
- "Here's how" over "Here's why" (for 🌱)
- Acknowledge complexity without drowning

### Structure
- Hook in first 2 sentences
- One main idea per section
- End sections with action or transition
- 800-1200 words (foundations), 1500-2000 (applied)

### Language Rules
- Define jargon on first use
- No unexplained acronyms
- "You" not "one" or "users"
- Active voice
- Short paragraphs (3-4 sentences max)

### What to Avoid
- "In this article, we will..."
- "It's important to note that..."
- Hedge words: "somewhat", "relatively", "fairly"
- Unsourced superlatives: "best", "most popular"

### Citation Format
- Inline: `[Source A]`
- Full refs in frontmatter `sources:`

---

## Persona Cards

### 🌱 Maya (Grounded Regen)
- Background: Permaculture teacher, community garden organizer
- Tech: Smartphone + basic apps, no crypto
- Goals: "Can this web3 stuff help my community?"
- Fears: Scams, looking stupid, wasting time
- Language: No jargon, explain everything, nature/community analogies
- Public label: `beginner`

### 💰 Alex (Crypto-Active)
- Background: Dev, has traded crypto, understands DeFi
- Tech: Very high, runs own node, multiple wallets
- Goals: "I want to do something meaningful with my skills and capital"
- Fears: Rugged by fake impact projects, greenwashing
- Language: Technical OK, focus on legitimacy signals
- Public label: `intermediate`

### 🔄 Jordan (On-Chain Regen)
- Background: ReFi protocol work, attended ETH Denver
- Tech: High but gaps in governance/coordination
- Goals: "I want to start a local chapter and bring others in"
- Fears: Burning out, building something pointless
- Language: Assume web3 basics, focus on patterns/playbooks
- Public label: `practitioner`

---

## Source Codes

| Code | Source |
|------|--------|
| A | ReFi DAO Local ReFi Toolkit |
| B | Greenpill Local Regen Guide |
| C | Gitcoin Alpha Grange |
| D | 1Hive Wiki |
| E | Superfluid Documentation |
| F | SourceCred docs |
| G | Coordinape docs |
| H | Snapshot docs |
| I | Discourse |
| J | Radicle |
| K | BrightID |
| L | POAP |
| M | Gitcoin Grants Program |
| N |clr.fund |
| O | Juicebox |
| P | Bankless/TokenTerminal |
| Q | Bankr docs |
| R | Various blog posts |
| S | Original/research |

---

## Status Reporting Format

**Update frequency:** Every 10 minutes during active pipeline sessions.

Provide status in a visual board format — one column per stage, one row per article:

### Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REGEN ARTICLE PIPELINE STATUS                             │
│            Session: {session-id} | Batch: {n}/{total} | @ {time}          │
├─────────────────────┬────────┬────────┬────────┬─────────┬────────┬────────┤
│ Article             │RESEARCH│ WRITE  │VERIFY  │ REVIEW  │ CRITIQ │PUBLISH │
├─────────────────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ {slug-1}           │   ✅   │   🔄   │   ⏳   │    ⏳    │   ⏳   │   ⏳   │
│ {slug-2}           │   ✅   │   ✅   │   🔄   │    ⏳    │   ⏳   │   ⏳   │
│ {slug-3}           │   ✅   │   ✅   │   ✅   │    ✅    │   ✅   │   ⏳   │
│ ...                 │        │        │        │         │        │        │
└─────────────────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Progress: {completed} completed | {in_progress} in progress | {pending} pending
```

### Example (10-article batch)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REGEN ARTICLE PIPELINE STATUS                             │
│            Session: abc-123 | Batch: 10/20 | @ 00:15:30                    │
├─────────────────────┬────────┬────────┬────────┬─────────┬────────┬────────┤
│ Article             │RESEARCH│ WRITE  │VERIFY  │ REVIEW  │ CRITIQ │PUBLISH │
├─────────────────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ what-is-ethereum    │   ✅   │   ✅   │   ✅   │    ✅    │   ✅   │   🔄   │
│ why-regens-interstd │   ✅   │   ✅   │   🔄   │    ⏳    │   ⏳   │   ⏳   │
│ decentralization     │   ✅   │   🔄   │   ⏳   │    ⏳    │   ⏳   │   ⏳   │
│ blockchain-fundmnts  │   ⏳   │   ⏳   │   ⏳   │    ⏳    │   ⏳   │   ⏳   │
│ ...                 │        │        │        │         │        │        │
└─────────────────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Progress: 3 completed | 2 in progress | 5 pending
Next: Starting fact-check on why-regens-interested
```

### Legend

| Icon | Meaning |
|------|---------|
| ✅ | DONE — stage completed |
| 🔄 | IN PROGRESS — currently working on this stage |
| ⏳ | PENDING — waiting to enter this stage |
| ❌ | FAILED — needs revision (noted below) |

### What to Include

1. **Header line** with session ID, batch progress, and elapsed time
2. **One row per article** — use short slug (max 18 chars)
3. **One column per stage** — RESEARCH, WRITE, VERIFY, REVIEW, CRITIQ, PUBLISH
4. **Progress summary** at bottom — completed / in progress / pending counts
5. **Next action** — what you're about to do next
6. **Any failures** — list articles that failed with reasons

### When to Report

- **Every 10 minutes** — minimum during active pipeline
- **After each stage completion** — can also report then
- **At batch end** — final summary with all completed
- **On failure** — immediately if an article fails a gate

---

## Usage

### Manual Pipeline

1. **Pick article** from GitHub issues or repo
2. **Run Luz** (research) → get brief
3. **Run Rupa** (draft) → get first draft
4. **Run Satya** (fact-check) → verify
5. **Run Sakshi** (edit) → polish
6. **Persona critique** → approve/reject
7. **Final check** → format + commit

### Quality Gates

| Gate | Criteria |
|------|----------|
| 1. Research | ≥3 sources, key concepts, gaps flagged |
| 2. Draft | All claims cited, word count ±20%, has intro/body/conclusion |
| 3. Fact-Check | Zero ❌, ≤2 ⚠️, URLs verified |
| 4. Edit | Style guide pass, no fluff |
| 5. Critique | "SHIP IT" from persona |

---

## Output Location

Write articles to the repo clone at `/root/workspace/regen-toolkit/`. Use the `working/` folder for process docs.

**Structure:**
```
content/{section}/{subsection}/
├── {article-slug}.md              # Final article
└── working/
    ├── {article-slug}-research.md
    ├── {article-slug}-factcheck.md
    └── {article-slug}-critique.md
```

**Example:** For `content/1-foundations/1.1-why-web3/why-regens-interested.md`:
```
content/1-foundations/1.1-why-web3/
├── why-regens-interested.md
└── working/
    ├── why-regens-interested-research.md
    ├── why-regens-interested-factcheck.md
    └── why-regens-interested-critique.md
```

**Workflow:**
1. Write final article to `{article-slug}.md`
2. Write working docs to `working/` folder
3. PR entire folder (article + working docs) to `github.com/regen-coordination/regen-toolkit`

Working docs stay in the repo - collaborators can see the process!

---

## Model Routing

| Agent | Model | Provider |
|-------|-------|----------|
| Luz (Research) | MiniMax M2.5 | Direct |
| Rupa (Draft) | Trinity | OpenRouter |
| Satya (Fact-Check) | MiniMax M2.5 | Direct |
| Sakshi (Edit) | MiniMax M2.5 | Direct |
| Critique | Sonnet 4.6 | Anthropic Direct |
| Final | Haiku | OpenRouter |

---

## Invocation Prompts

### Start Fresh Pipeline

Use this when starting a new batch from scratch:

```
Run the Regen Toolkit Article pipeline for [10/20/50] articles.

Skill: /mnt/storage/workspace/skills/regen-toolkit-article/SKILL.md
Repo: /root/workspace/regen-toolkit/

1. Scan the content/ directory for placeholder articles (status: placeholder)
2. Pick the next [N] articles that have NOT been started
3. For each article in order:
   a. Research (Luz) → save to working/{slug}-research.md
   b. Draft (Rupa) → save to {slug}.md draft
   c. Fact-Check (Satya) → save to working/{slug}-factcheck.md
   d. Edit (Sakshi) → update {slug}.md
   e. Critique → save to working/{slug}-critique.md
   f. Final → update frontmatter, status: draft
4. Use model routing from skill (Luz=MiniMax, Rupa=Trinity, etc.)
5. Provide status table update every 10 minutes
6. Save state to /root/workspace/regen-toolkit/.pipeline-state.json after each article

Start now.
```

### Resume Interrupted Pipeline

Use this when resuming after interruption:

```
Resume the Regen Toolkit Article pipeline.

1. Load state from /root/workspace/regen-toolkit/.pipeline-state.json
2. Identify the last article being worked on
3. Check the working/ directory for that article to see what stage was completed:
   - Has {slug}-research.md but no draft → start Draft
   - Has draft but no factcheck → start Fact-Check
   - Has factcheck but no critique → start Critique
   - Has critique but not final → complete Final
4. Continue with the remaining articles in the queue
5. Provide status table update every 10 minutes
6. Update state file after each stage completion

Resume now.
```

### Single Article Pipeline

Use this for one article at a time:

```
Run the full pipeline for article: {slug}
Location: content/{section}/{subsection}/{slug}.md

1. Read the article placeholder to get topic + target audience
2. Run Research (Luz) → working/{slug}-research.md
3. Run Draft (Rupa) → {slug}.md
4. Run Fact-Check (Satya) → working/{slug}-factcheck.md
5. Run Edit (Sakshi) → update {slug}.md
6. Run Critique → working/{slug}-critique.md
7. Final → update frontmatter, status: draft

Use model routing from skill. Report when complete.
```

---

## State Management

### State File Location

`/root/workspace/regen-toolkit/.pipeline-state.json`

### State Schema

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-26T14:30:00Z",
  "sessionId": "abc-123",
  "queue": [
    {
      "slug": "what-is-ethereum",
      "path": "content/1-foundations/1.6-ethereum-smart-contracts/what-is-ethereum.md",
      "status": "draft",
      "stage": "VERIFY",
      "startedAt": "2026-02-26T14:00:00Z",
      "completedAt": null,
      "researchFile": "working/what-is-ethereum-research.md",
      "factcheckFile": "working/what-is-ethereum-factcheck.md",
      "critiqueFile": "working/what-is-ethereum-critique.md",
      "issues": []
    }
  ],
  "completed": [
    {
      "slug": "why-regens-interested",
      "path": "content/1-foundations/1.1-why-web3/why-regens-interested.md",
      "status": "draft",
      "completedAt": "2026-02-26T13:45:00Z",
      "stagesCompleted": ["RESEARCH", "DRAFT", "VERIFY", "EDIT", "CRITIQUE", "FINAL"]
    }
  ],
  "failed": [
    {
      "slug": "some-article",
      "reason": "Fact-check gate failed: 3 incorrect claims",
      "retryCount": 2,
      "lastAttempt": "2026-02-26T12:00:00Z"
    }
  ],
  "stats": {
    "totalProcessed": 15,
    "completed": 12,
    "failed": 1,
    "inProgress": 2
  }
}
```

### State Update Rules

1. **Update after each stage** — Save state file after Research, Draft, Fact-Check, Edit, Critique, and Final
2. **Atomic writes** — Write to temp file then rename to prevent corruption
3. **Track failures** — Log failed articles to `failed` array with reason
4. **Session ID** — Include session ID to detect stale state from old sessions

---

## Recovery Procedures

### Scenario 1: Interrupted Mid-Article

**Detection:** State shows `stage` != "PUBLISH" and no `completedAt`

**Recovery:**
1. Load state file
2. Check working/ directory for existing files
3. Determine last completed stage by checking which files exist
4. Resume from next stage

### Scenario 2: State File Missing

**Detection:** `.pipeline-state.json` doesn't exist

**Recovery:**
1. Scan content/ directory recursively
2. Find all articles with `status: placeholder`
3. Find all with `status: draft` to determine completed
4. Rebuild state from filesystem

### Scenario 3: Stale Session

**Detection:** State file sessionId doesn't match current session

**Recovery:**
1. Treat as fresh resume (Scenario 1)
2. Or prompt user to confirm: "Found state from previous session. Resume or start fresh?"

### Scenario 4: Fact-Check Gate Failed

**Detection:** `failed` array contains article with reason mentioning gate

**Recovery:**
1. Increment `retryCount`
2. If `retryCount` < 3: return to Draft stage with fact-check feedback
3. If `retryCount` >= 3: mark as permanently failed, move to next article

---

## Batch Handling

### Queue Selection

1. **Scan** content/ for `status: placeholder` files
2. **Sort** by file path (alphabetical) for predictability
3. **Slice** next N articles for batch
4. **Mark** as "in progress" in state before starting

### Parallel vs Sequential

- **Research** can run in parallel (up to 5 articles)
- **Draft** should be sequential (one at a time per session)
- **Fact-Check/Edit/Critique** sequential

### Batch Progress Reporting

Every 10 minutes, output:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    REGEN ARTICLE PIPELINE STATUS                           │
│                    Session: abc-123 | Batch: 10/20                        │
│                         @ 00:15:30 into session                          │
├─────────────────────┬────────┬────────┬────────┬─────────┬────────┬────────┤
│ Article             │ SPEC   │ WRITE  │ VERIFY │ REVIEW  │ CRITIQ │PUBLISH │
├─────────────────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ 1.1-why-web3       │ ✅ DONE│ ✅ DONE │ ✅ DONE │ ✅ DONE  │ ✅ DONE│ ✅ DONE │
│ 1.2-decentralizati │ ✅ DONE│ ✅ DONE │ 🔄 CHECK│ ⏳ PEND  │ ⏳ PEND │ ⏳ PEND │
│ 1.3-blockchain-fund │ ✅ DONE│ 🔄 DRAFT│ ⏳ PEND │ ⏳ PEND  │ ⏳ PEND │ ⏳ PEND │
│ ...                 │        │        │        │         │        │        │
└─────────────────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Progress: 5 completed, 2 in progress, 3 pending
Next: Starting research on 1.4-impacts at 00:16:00
```

---

## Environment

| Item | Value |
|------|-------|
| Repo | `/root/workspace/regen-toolkit/` |
| Skill | `/mnt/storage/workspace/skills/regen-toolkit-article/SKILL.md` |
| State File | `/root/workspace/regen-toolkit/.pipeline-state.json` |
| Working Dir | `content/{section}/{subsection}/working/` |
