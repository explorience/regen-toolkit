# Regen Toolkit Content Creation System

This document defines the process, structure, and standards for creating and maintaining content in the Regen Toolkit.

## Core Principles

- **Clarity over cleverness**: Prioritize direct, action-oriented language
- **No AI slop**: Avoid phrases like "let's explore", "navigate", "journey", "landscape"
- **Voice**: Friendly, practical, active voice
- **Audience**: Young women and community leaders in Somaliland/East Africa
- **Tone**: Warm, grounded, no exclamation cheerleading
- **Avoid**: Emoji in bodies, [Source X] markers, unexplained jargon

## Audience & Purpose

Each article should answer:
- Who is this for?
- What problem does it solve?
- What will they be able to do after reading?

## Article Types

### Foundations (800–1200 words)
- Explain core concepts, values, and frameworks
- Define key terms on first use
- Include historical context where relevant

### Implementation Guides (1200–1800 words)
- Step-by-step processes for setting up systems
- Emphasize community context and adaptation
- Include common pitfalls and how to avoid them

### Case Studies (800–1500 words)
- Real-world examples of regenerative practices
- Highlight challenges, adaptations, and outcomes
- Focus on transferable lessons

## Article Structure

```markdown
---
title: "Local Currency Setup"
description: "How to create a community-based local currency system"
audience: "Local Organizer"
maturity: "Intermediate"
status: "published"
last_updated: '2026-03-26'
draft: false
sources_used:
  - restor.org/project/keystone-research-center
  - weavers.network/project/solar-community-co-op
tags:
  function: "Funding"
  domain: "Community"
  systems:
    - "Feedback Loops"
    - "Thresholds"
value_chain:
  - value: "Community sovereignty over exchange"
  - principle: "Closed-loop mutual credit"
  - practice: "Weekly exchange reconciliation at local markets"
---

## Try This
> **Beginner:** Map local producers who might accept local currency  
> **Intermediate:** Prototype a simple exchange agreement between two businesses  
> **Advanced:** Integrate with Timebank hours and design a feedback loop for currency circulation

<!-- Only include if applicable -->
## How This Works
- **Value:** Community sovereignty over exchange
- **Principle:** Closed-loop mutual credit
- **Practice:** Weekly exchange reconciliation at local markets

## References
- [Keystone Research Center Local Currency Project](https://restor.org/project/keystone-research-center)
- [Solar Community Co-op Model](https://weavers.network/project/solar-community-co-op)
```

## Frontmatter Standards

### Required Fields
- `title`: Clear, descriptive title
- `description`: One-sentence summary
- `status`: "published" or "draft"
- `last_updated`: ISO date in quotes

### Recommended Fields
- `audience`: One of: Individual, Local Organizer, DAO Operator, Community Steward, Researcher
- `maturity`: One of: Beginner, Intermediate, Advanced, Implementation Ready
- `sources_used`: Array of key sources used in research

### Schema-Driven Tags

#### Primary Axes (from Matt's taxonomy)
- `function`: What problem it solves (Governance, Funding, Security, etc.)
- `domain`: Primary category (Community, Ecosystem, Personal)

#### Cross-Cutting Themes
- `systems`: Relevant systems concepts (Fractals, Thresholds, Feedback Loops)

#### Value Chain
- `value_chain`: Array with value → principle → practice progression

## Writing Process

1. **Research**
   - Consult primary sources (Restor, Hylo, P2P Foundation, ReFi Ecosystem)
   - Use Matt's taxonomy spreadsheet for categorization
   - Extract real examples and case studies

2. **Draft**
   - Start with clear problem statement
   - Use short paragraphs (1–3 sentences)
   - Address reader as "you"
   - Define all jargon on first use

3. **Structure**
   - Add `## Try This` with tiered exercises when applicable
   - Include `## How This Works` only for actionable frameworks
   - Weave systems concepts naturally—do not force a dedicated section

4. **Reference**
   - End with hand-curated References section
   - No [Source X] markers in body
   - Include live links to projects, tools, and datasets

## Content Sourcing

### Approved Source Maps
These provide validated examples and case studies:
- **[Restor](https://restor.org)**: Verified ecological restoration projects
- **[Hylo](https://hylo.com)**: Grassroots community initiatives
- **[P2P Foundation Wiki](https://p2pfoundation.net)**: Governance patterns, open cooperatives
- **[ReFi Ecosystem](https://refivc.com)**: Regenerative finance projects and DAOs
- **[Weavers Network](https://weavers.network)**: Community trust-building models
- **[Second Renaissance Ecosystem Map](https://secondrenaissance.com)**: Regenerative projects and orgs

### Integration
- Cite specific projects in `sources_used` frontmatter
- Use examples naturally in body text
- Link to projects in References

## Style Guide

### Voice & Tone
- Use active voice: "You can set up" not "One can set up"
- Be direct: "This creates" not "This may potentially lead to"
- Keep sentences short and clear

### Formatting
- Use ## headings for main sections
- Use > blockquotes for tiered exercises
- Use - bullet lists for key points
- No em dashes — use spaced hyphens - like this

## Review & Publication

1. Verify all links are live
2. Confirm frontmatter is complete
3. Ensure no AI slop language
4. Check for clear value proposition
5. Set `status: published` and `last_updated`

## Maintenance

- Review articles quarterly for outdated information
- Update `last_updated` date on substantial changes
- Add new case studies as they emerge from partner networks

This system enables consistent, high-quality content that serves community practitioners while honoring the complexity of regenerative work.