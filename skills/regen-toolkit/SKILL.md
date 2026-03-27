---
name: regen-toolkit
description: Write, review, and publish articles for the Regen Toolkit. Includes the full 5-stage editorial pipeline, contributor workflow, topic selection, and PR submission process. Use this skill for any content work on the regen-toolkit repo.
---

# Regen Toolkit Content Skill

Everything you need to contribute articles to the Regen Toolkit.

## Setup

```bash
git clone https://github.com/explorience/regen-toolkit.git
cd regen-toolkit
npm install
git checkout -b content/{your-name}/{slug}
npm run dev  # preview at http://localhost:4321
```

## Finding What to Write

### From GitHub Issues
Browse [open issues](https://github.com/explorience/regen-toolkit/issues) - each article has a file path and task checkboxes.

### From Stub Articles
```bash
grep -rl "status: not-started" src/content/docs/ | sort
```

### Propose New Topics
Open an issue describing the topic, audience, and why it matters. Wait for approval.

### Priority
1. Phase 2 (43 medium stubs) - partially outlined
2. Phase 3 (139 minimal stubs) - need research + writing
3. New topics from contributor feedback

## The Pipeline

Every article goes through 5 stages. Read the reference files for details on each.

### Stage 1: RESEARCH
Gather facts from real sources. No writing yet. Output to `working/{slug}-research.md`.
- Read the stub + 3-5 published articles for context
- Web search 3+ queries + check approved sources (→ `references/sources.md`)
- Quality gate: 3+ credible sources, no unsourced claims

### Stage 2: DRAFT
Write the full article from the research brief.
- Follow the style guide (→ `references/style-guide.md`)
- Follow the article structure (→ `references/article-structure.md`)
- Read 2-3 published articles for voice calibration (see Quality Reference below)
- Quality gate: 800-1800 words, all claims sourced, complete frontmatter

### Stage 3: FACT-CHECK
Verify every specific claim against sources. Output to `working/{slug}-factcheck.md`.
- ✅ Verified / ⚠️ Unverified (qualify or remove) / ❌ Incorrect (fix immediately)
- Quality gate: zero ❌, max 2 ⚠️ (qualified)

### Stage 4: EDIT
Polish for clarity and style compliance.
- Run through anti-patterns checklist (→ `references/style-guide.md`)
- Verify frontmatter tags (→ `references/tag-vocabulary.md`)
- Check all links work

### Stage 5: CRITIQUE
Final review for audience fit. Output to `working/{slug}-critique.md`.
- Read as Maya, the primary persona (→ `references/personas.md`)
- Would she understand without crypto knowledge? Clear action to take? Real examples?
- Verdict: PUBLISH / REVISE / REJECT

## Submitting Your Work

Full PR workflow with branch naming, commit template, and PR description: → `references/pr-workflow.md`

## Using OpenClaw

```
Write the article for slug: gas-fees
Use the skill at skills/regen-toolkit/SKILL.md
```

Batch: `Write articles for slugs: gas-fees, consensus-mechanisms, key-properties`

## Working Directory

Pipeline intermediate files go in `working/` at repo root:
```
working/
├── {slug}-research.md    # Stage 1
├── {slug}-factcheck.md   # Stage 3
└── {slug}-critique.md    # Stage 5
```

Gitignored from deploy, included in PRs for reviewer transparency.

## Quality Reference Articles

Read these before writing to calibrate voice and quality:
- `src/content/docs/what-is-blockchain.md` - Beginner/Foundations
- `src/content/docs/conflict-resolution.md` - Intermediate/Applied
- `src/content/docs/building-trust.md` - Community-Building
- `src/content/docs/silvi-protocol.md` - Case study
- `src/content/docs/voting-mechanisms.md` - Governance

## Reference Files

| File | Contents |
|------|----------|
| `references/style-guide.md` | Voice, anti-patterns, formatting, opening/closing patterns |
| `references/article-structure.md` | Frontmatter schema, article template, word counts |
| `references/tag-vocabulary.md` | Function, domain, systems, audience, maturity values |
| `references/personas.md` | Maya, Alex, Jordan persona cards |
| `references/sources.md` | Approved source list with descriptions |
| `references/pr-workflow.md` | Git commands, branch naming, PR template |
