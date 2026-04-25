---
name: research
version: 1.0.0
description: Deep research workflows powered by Feynman — investigation briefs, literature reviews, source comparisons, autoresearch loops, and topic monitoring. Outputs to docs/research/ with provenance tracking.
triggers:
  - "research"
  - "deep research"
  - "literature review"
  - "lit review"
  - "compare sources"
  - "autoresearch"
  - "watch topic"
  - /deepresearch
  - /lit
  - /compare
  - /autoresearch
  - /watch
inputs:
  - User topic or research question
  - data/projects.yaml (active project context)
  - data/funding-opportunities.yaml (funding landscape)
  - data/ideas.yaml (existing ideas to avoid duplication)
  - knowledge/ (existing knowledge base)
outputs:
  - docs/research/briefs/*.md (deep research)
  - docs/research/lit-reviews/*.md (literature reviews)
  - docs/research/comparisons/*.md (source comparisons)
  - docs/research/experiments/*.md (autoresearch logs)
  - docs/research/watches/*.md (topic monitoring baselines)
  - docs/research/session-logs/*.md (session logs)
  - *.provenance.md sidecars (citation tracking)
dependencies:
  - knowledge-curator
  - idea-scout
  - funding-scout
tier: core
feynman:
  skills_path: .agents/skills/feynman
  version: "0.2.16"
---

# Research

## Overview

This skill integrates [Feynman](https://www.feynman.is) research workflows into the org-os. Feynman dispatches specialized agents (researcher, reviewer, writer, verifier) to produce source-heavy research artifacts with inline citations and provenance tracking.

All outputs land in `docs/research/` organized by workflow type.

## When to Use

- Operator asks to research a topic, ecosystem, funding opportunity, or technology
- Before major strategic decisions (cooperative formation, partnership evaluation, funding applications)
- To survey academic or industry literature on ReFi, ESS, cooperative governance, regenerative finance
- To compare tools, frameworks, platforms, or approaches
- To set up ongoing monitoring of a research area or competitor landscape
- During autoresearch loops for iterative optimization

## Workflows

### Deep Research — `/deepresearch <topic>`

Multi-source investigation producing a structured brief with inline citations.

```
feynman deepresearch "Current approaches to cooperative governance in Web3 DAOs"
```

Output: `docs/research/briefs/YYYY-MM-DD-<slug>.md` + `.provenance.md`

**Use for:** Funding application background research, ecosystem analysis, strategic investigations.

### Literature Review — `/lit <topic>`

Academic-focused review with consensus, disagreements, and open questions.

```
feynman lit "Regenerative finance mechanisms and their measured impact on local economies"
```

Output: `docs/research/lit-reviews/YYYY-MM-DD-<slug>.md` + `.provenance.md`

**Use for:** Grant applications requiring academic grounding, knowledge commons contributions.

### Source Comparison — `/compare <topic>`

Compare multiple sources, tools, or approaches with an agreement/disagreement matrix.

```
feynman compare "Gnosis Safe vs Aragon vs DAOhaus for cooperative treasury management"
```

Output: `docs/research/comparisons/YYYY-MM-DD-<slug>.md`

**Use for:** Tool selection, platform evaluation, partnership due diligence.

### Autoresearch — `/autoresearch <goal>`

Iterative experiment loop that optimizes toward a goal.

```
feynman autoresearch "Optimize ReFi BCN grant application success factors"
```

Output: `docs/research/experiments/YYYY-MM-DD-<slug>.md`

**Use for:** Prompt optimization, strategy refinement, parameter tuning.

### Watch — `/watch <topic>`

Set up recurring monitoring on a topic.

```
feynman watch "New ReFi funding rounds and grant programs in Europe"
```

Output: `docs/research/watches/YYYY-MM-DD-<slug>.md` (baseline survey)

**Use for:** Funding pipeline monitoring, ecosystem tracking, competitive intelligence.

### Session Log — `/log`

Capture research session progress, findings, and next steps.

Output: `docs/research/session-logs/YYYY-MM-DD.md`

## Procedure

### Step 1: Context Gathering

Before running any Feynman workflow, gather org context:

1. Read `data/projects.yaml` — active projects that may relate to the research topic
2. Read `data/funding-opportunities.yaml` — funding deadlines that may motivate the research
3. Read `data/ideas.yaml` — existing ideas to connect with or avoid duplicating
4. Check `docs/research/` — prior research on the same or related topics

### Step 2: Execute Workflow

Run the appropriate Feynman command. The Feynman skills at `.agents/skills/feynman/` are available repo-locally.

For CLI execution:
```bash
feynman deepresearch "<topic>"
feynman lit "<topic>"
feynman compare "<sources>"
feynman autoresearch "<goal>"
feynman watch "<topic>"
```

For agent execution, invoke the corresponding Feynman skill from `.agents/skills/feynman/`.

### Step 3: File Output

Move or save the Feynman output to the appropriate `docs/research/` subdirectory:

| Workflow | Directory |
|----------|-----------|
| `/deepresearch` | `docs/research/briefs/` |
| `/lit` | `docs/research/lit-reviews/` |
| `/compare` | `docs/research/comparisons/` |
| `/autoresearch` | `docs/research/experiments/` |
| `/watch` | `docs/research/watches/` |
| `/log` | `docs/research/session-logs/` |

Name files as `YYYY-MM-DD-<slug>.md`. Include the `.provenance.md` sidecar when generated.

### Step 4: Integration

After research completes, feed findings into the org-os:

1. **Ideas** — Surface opportunities to `data/ideas.yaml` via idea-scout
2. **Funding** — Add discovered opportunities to `data/funding-opportunities.yaml` via funding-scout
3. **Knowledge** — Curate key findings into `knowledge/` via knowledge-curator
4. **Tasks** — Add research-driven action items to `HEARTBEAT.md`
5. **Memory** — Log the research session to `memory/YYYY-MM-DD.md`

### Step 5: Session Log

Write a brief entry to `docs/research/session-logs/YYYY-MM-DD.md`:

```markdown
## Research Session — [HH:MM]

**Workflow:** /deepresearch
**Topic:** [topic]
**Output:** docs/research/briefs/YYYY-MM-DD-<slug>.md

### Key Findings
- [finding 1]
- [finding 2]

### Actions Triggered
- [ ] [follow-up action]

### Sources
- [N] sources analyzed, [M] cited in brief
```

## ReFi BCN Research Priorities

When suggesting research topics, prioritize:

1. **Cooperative governance** — ESS/cooperative structures, DAO governance, hybrid models
2. **Regenerative finance** — ReFi mechanisms, impact measurement, token economics
3. **Funding landscape** — Grant programs, public goods funding, EU programs (LIFE, Horizon)
4. **Local economy** — Barcelona/Catalunya ecosystem, SSE policy, community currencies
5. **Knowledge commons** — Open knowledge systems, decentralized publishing, IPFS/Ceramic
6. **Federation** — Inter-org coordination, network governance, data sovereignty
