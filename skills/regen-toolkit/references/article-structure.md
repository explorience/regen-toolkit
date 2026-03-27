# Article Structure

## Frontmatter Template

```yaml
---
title: "Clear Descriptive Title"
description: "One real sentence explaining what this covers and who it's for"
status: published
last_updated: 'YYYY-MM-DD'
sources:
  - Source Name (https://url)
tags:
  function: Education       # pick one from tag-vocabulary.md
  domain: Web3-Literacy     # pick one
  systems:                  # pick 1-3
    - Decentralization
    - Trust-Networks
audience: Individual        # pick one
maturity: Beginner          # pick one
related:                    # 2-4 slugs of related articles
  - related-slug-1
  - related-slug-2
---
```

## Body Template

```markdown
# Title

Opening: concrete scenario or problem the reader recognizes from their own life.

## Section 1
Short paragraphs. Define **jargon** in bold on first use with a plain-language explanation.

## Section 2
Real examples from actual projects (not hypothetical). Cite sources.

## Section 3 (if needed)
Keep sections focused on one main idea each.

## Try This
> **Beginner:** Simple first step anyone can take today
> **Intermediate:** Hands-on exercise requiring some setup
> **Advanced:** Deep implementation challenge

## References
- [Source Name](https://url) - brief description of what it covers
- [Source Name](https://url) - brief description
```

## Word Counts by Type

| Type | Words | Examples |
|------|-------|---------|
| Foundations (concepts, definitions) | 800-1200 | what-is-blockchain, what-is-dao |
| Implementation guides (how-to) | 1200-1800 | conflict-resolution, multisig-setup |
| Case studies (real examples) | 800-1500 | silvi-protocol |

## Rules

- One main idea per section
- Hook in first 2 sentences
- End sections with action or transition
- "Try This" exercises for all actionable content
- "How This Works" section (value → principle → practice) only for actionable frameworks, not definitions
- Weave systems concepts naturally into text - never create a standalone "Systems Patterns" section
