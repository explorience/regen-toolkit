---
name: knowledge-curator
version: 1.0.0
description: Aggregate, organize, and share knowledge from channels and operational activity
author: organizational-os
category: knowledge
metadata:
  openclaw:
    requires:
      env: []
      bins: []
      config: []
---

# Knowledge Curator

## What This Is

Monitors organizational channels (Telegram, GitHub, meeting notes) for meaningful knowledge, organizes it by domain, and produces curated summaries for the workspace and federation commons. Turns the constant flow of shared links and discussions into navigable organizational knowledge.

## When to Use

- When asked "what do we know about [topic]?"
- When Telegram groups have accumulated links and updates to process
- After meetings where domain knowledge was discussed
- Weekly: scheduled curation of accumulated knowledge
- When preparing a thematic report or discussion

## When NOT to Use

- For individual meeting processing → use meeting-processor skill
- For financial tracking → use capital-flow skill
- For raw transcript processing → use meeting-processor skill

## Inputs

- Telegram channel messages (if channel access is configured in `TOOLS.md`)
- Meeting notes in `packages/operations/meetings/`
- GitHub activity from monitored repos (configured in `TOOLS.md`)
- Direct content pasted by operator

## Outputs

| Output | Location | Format |
|--------|----------|--------|
| Domain curation | `knowledge/<domain>/YYYY-MM-DD.md` | Markdown |
| Hub contribution | Sync to hub `knowledge/` | Markdown |
| Weekly digest | `memory/YYYY-MM-DD.md` | Markdown |
| Memory index update | `MEMORY.md` | Markdown |

## What Gets Curated

### High Value (always curate)
- Funding opportunities and platform mechanics
- Partner organization updates (new projects, launches, pivots)
- Governance decisions from ecosystem protocols
- Technical developments relevant to org domains
- Strategic insights from discussions

### Medium Value (curate if distinct)
- Shared links with substantive context
- Questions with useful answers
- Project status updates from network

### Low Value (skip)
- Social chat without informational content
- Duplicate information already in knowledge base
- Highly ephemeral content (memes, reactions)

## Domain Organization

Organize by domains declared in `federation.yaml`:
```
knowledge/
├── regenerative-finance/
│   └── YYYY-MM-DD-curation.md
├── local-governance/
│   └── YYYY-MM-DD-curation.md
└── agroforestry/
    └── YYYY-MM-DD-curation.md
```

## Curation Format

```markdown
# Knowledge Curation — [Domain]
**Period:** YYYY-MM-DD → YYYY-MM-DD
**Curated by:** [node name from IDENTITY.md]

## Key Developments

### [Sub-topic]
- [Insight] — Source: [meeting/channel/date]
- [Insight] — Source: [URL or reference]

## Partner Updates
- [Partner name]: [What's happening] — Source: [...]

## Funding Landscape
- [Opportunity or development] — Source: [...]

## Resources
- [Description] — [URL]
```

## Curation Principles

1. **Synthesize, don't copy** — extract insights, not raw text
2. **Source everything** — always note where info came from
3. **Domain-tag everything** — every item belongs to at least one domain
4. **Distinguish signal from noise** — only what has durable value
5. **Apply org voice** — match terminology from `SOUL.md`

## Channel Configuration

Check `TOOLS.md` for configured channels:
```markdown
## Telegram Channels to Monitor
- @channel_handle — Description
```

## Privacy Handling

- Only curate from authorized channels
- Synthesize ideas, not quotes of individuals
- Personal names appear only when relevant and public
- Apply `SOUL.md` boundaries: "Open by default, private by exception"

## Knowledge Commons Publishing

If `federation.yaml` has `knowledge-commons.publish.meetings: true`:
- After curation, copy to hub sync location
- Follow hub contribution format in `federation.yaml`

## ReFi BCN Implementation Runbook (Operational)

### Weekly execution checklist

1. **Collect sources (last 7 days):**
   - `packages/operations/meetings/`
   - `docs/` updates (especially process and system-map docs)
   - Notion Notes & Documents database (`1386ed08-45cb-81ed-b055-000ba5b70a6b`) when accessible
   - High-signal channel updates mapped in `docs/CHANNELS-AND-SYSTEMS-MAP.md`
2. **Extract durable knowledge only:**
   - Funding mechanisms and eligibility logic
   - Governance/process decisions with operational consequences
   - Partner and ecosystem shifts affecting ReFi BCN priorities
3. **Publish curated artifact:**
   - `knowledge/<domain>/YYYY-MM-DD-curation.md`
4. **Operationalize key items:**
   - If actionable in <30 days → add/refresh in `HEARTBEAT.md`
   - If strategic/long-lived decision → update `MEMORY.md`
   - Log execution summary in `memory/YYYY-MM-DD.md`

### Quality gate (must pass)
- [ ] Every key claim has a source ref (meeting/doc/url/date)
- [ ] No duplicate of already-curated insight
- [ ] At least one clear “so what” action or implication per section
- [ ] Terminology aligned with ReFi BCN core docs (`SOUL.md`, `IDENTITY.md`, `README.md`)

## Compilation Mode

After running `npm run compile:knowledge`, compiled pages contain `<!-- LLM-SYNTHESIZE: description -->` markers where prose synthesis is needed.

### When to use

- After `npm run compile:knowledge` generates skeleton pages
- When `npm run lint:knowledge` reports pages with LLM-SYNTHESIZE markers
- During workspace-improver Priority 3 (Knowledge Gaps) cycles

### Procedure

1. Run `npm run compile:knowledge` to ensure pages are current
2. For each page with `<!-- LLM-SYNTHESIZE -->` markers:
   a. Read the page — structured data is already filled in (meeting outcomes, project status, funding details)
   b. Read the marker description — it tells you what to synthesize
   c. Replace the marker with 2-3 paragraphs of prose that synthesize the structured data
   d. Follow curation principles: synthesize (don't copy), source everything, apply org voice
3. After synthesis, run `npm run lint:knowledge` to verify no markers remain
4. Log synthesis work to `memory/YYYY-MM-DD.md`

### Example

Before:
```markdown
## Summary

<!-- LLM-SYNTHESIZE: Write a 2-3 paragraph synthesis of the key themes across all 15 meetings related to Regenerative Finance. -->
```

After:
```markdown
## Summary

ReFi BCN's engagement with regenerative finance has evolved from exploratory discussions about Gitcoin participation into a structured multi-track funding strategy. Early meetings focused on understanding quadratic funding mechanics and Celo ecosystem requirements, while later sessions shifted toward strategic decisions about cooperative treasury management via Safe and multi-sig governance.

The funding landscape has expanded significantly, with the team tracking 14+ opportunities across Celo Public Goods, EU LIFE programs, and community rounds. Key decisions include the Celo-first chain strategy and the separation of operational treasury from program-specific funds through Regenerant Catalunya.
```

### Quality gate

- [ ] No `<!-- LLM-SYNTHESIZE -->` markers remain in the page
- [ ] Synthesized text references specific meetings/dates where possible
- [ ] Tone matches SOUL.md (plain, grounded, bridge-building)
- [ ] No speculative claims — only what the source data supports

## Notes

- This skill creates `knowledge/` directories if they don't exist
- Curations are cumulative — each file covers a specific period
- After curation, update `MEMORY.md` if key insights warrant it
