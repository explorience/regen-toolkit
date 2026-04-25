---
name: idea-scout
version: 2.0.0
description: Scan knowledge commons for ecosystem gaps and surface ideas
triggers:
  - "scout ideas"
  - "find ecosystem gaps"
  - "what ideas can we surface"
  - "scan knowledge for opportunities"
inputs:
  - knowledge/ directory (processed knowledge pages)
  - data/knowledge-manifest.yaml (domain coverage)
  - data/ideas.yaml (existing ideas to avoid duplicates)
  - data/projects.yaml (active projects for context)
outputs:
  - data/ideas.yaml entries (status: surfaced)
  - docs/docs/ideas/[slug].md detailed descriptions
  - memory/YYYY-MM-DD.md log of scouting session
dependencies:
  - knowledge-curator
tier: core
---

# Idea Scout

## When to Use

Activate after knowledge processing (blog posts, podcast episodes, meeting insights have been added to `knowledge/`). Run periodically to surface new ecosystem gaps and opportunities.

Also activate when:
- Operator asks "what gaps exist in our ecosystem?"
- After processing a batch of new content
- During autoresearch improvement loops
- When MASTERPLAN.md activations include idea scouting

## Procedure

### Step 1: Read Current State

1. Read `data/knowledge-manifest.yaml` — understand which domains exist and their coverage
2. Read `data/ideas.yaml` — understand existing ideas to avoid duplicates
3. Read `data/projects.yaml` — understand active work to identify adjacencies
4. Read `data/relationships.yaml` — understand partner capabilities

### Step 2: Scan Knowledge for Patterns

For each knowledge domain in `knowledge/`:
1. Read the `_index.yaml` for domain overview
2. Scan topic pages for:
   - **Gaps mentioned**: "there is no...", "missing...", "need for..."
   - **Repeated themes**: Topics appearing across multiple sources
   - **Unmet needs**: Problems described without solutions
   - **Emerging trends**: New patterns not yet addressed by projects
   - **Cross-domain opportunities**: Insights from combining domains

### Step 3: Evaluate Candidates

For each potential idea, evaluate:
- **Novelty**: Is this already in ideas.yaml or projects.yaml?
- **Relevance**: Does it align with the org's mission (SOUL.md)?
- **Feasibility**: Can the org's skills and network address this?
- **Evidence**: How many sources mention this gap?
- **Impact**: How significant would filling this gap be?

### Step 4: Surface Ideas

For ideas that pass evaluation:

1. Create entry in `data/ideas.yaml`:
```yaml
- id: "idea-[incremental]"
  title: "[Descriptive title]"
  status: "surfaced"
  source: "knowledge/[domain]/[topic].md"
  submitted_by: "agent"
  champions: []
  ecosystem_gap: "[One-sentence gap description]"
  description: "[2-3 sentence description]"
  hatched_repo: null
  skills_needed: ["[skill-1]", "[skill-2]"]
  resources:
    - "knowledge/[domain]/[related-topic].md"
  compensation:
    model: null
    pool: null
  created: "[today]"
  updated: "[today]"
  votes: 0
  comments: []
```

2. Create `docs/ideas/[slug].md` with detailed description:
```markdown
# [Title]

## Ecosystem Gap
[What's missing and why it matters]

## Evidence
- [Source 1]: [What it says about this gap]
- [Source 2]: [What it says about this gap]

## Proposed Approach
[How this could be addressed]

## Skills Needed
- [Skill 1]
- [Skill 2]

## Related Knowledge
- [Link to knowledge page 1]
- [Link to knowledge page 2]

## Related Projects
- [Existing project that's adjacent]

---
_Surfaced by idea-scout on [date] from knowledge/[domain]/_
```

### Step 5: Log Results

Write to `memory/YYYY-MM-DD.md`:
```markdown
## Idea Scouting Session
- Scanned [N] knowledge domains
- Found [M] potential ideas
- Surfaced [K] new ideas: [list titles]
- Skipped [J] (duplicates or low relevance)
- Domains with most gaps: [list]
```

## Output Format

### ideas.yaml entry
See Step 4 above for the complete schema.

### docs/ideas/[slug].md
See Step 4 above for the detailed description format.

## Idea Lifecycle (for reference)

```
surfaced → proposed → approved → developing → hatched → archived
   ↑          ↑          ↑           ↑           ↑
 agent    community   council    developers  repo created
```

- `surfaced`: Agent-detected, needs human review
- `proposed`: Human champion has formally proposed
- `approved`: Council/community has approved for development
- `developing`: Active development underway
- `hatched`: Spawned as independent repo with org-os workspace
- `archived`: Completed, abandoned, or superseded

## Error Handling

- If `knowledge/` is empty, report "No knowledge to scout from" and suggest running knowledge-curator first
- If all found gaps already exist in ideas.yaml, report "No new gaps found" and log domains scanned
- Never surface ideas that duplicate existing active projects

## Examples

**Example scouting output:**

After processing 15 ReFi Blog articles and 8 podcast episodes:
```
Surfaced 3 ideas:
1. "Open-Source MRV Toolkit for Smallholders" — Gap: No accessible carbon verification tools for small-scale farmers. Evidence from 4 blog posts and 2 podcast episodes discussing MRV barriers.
2. "Regenerative Finance Education Platform" — Gap: No structured learning path for ReFi newcomers. Evidence from 6 sources mentioning onboarding difficulties.
3. "Cross-Bioregion Impact Data Standard" — Gap: No interoperable format for sharing impact metrics across local nodes. Evidence from 3 meeting summaries and 2 blog posts.
```
