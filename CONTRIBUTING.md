# Contributing to the Regen Toolkit

Thanks for your interest. This project is currently in active development with a small team, so contributions go through a review process.

## How to Contribute

### Review existing articles
The most helpful thing right now is reading published articles and flagging issues:
- Factual errors or outdated information
- Unclear explanations or missing context
- Broken links
- Missing perspectives (especially from practitioners in the Global South)

Open an issue with specific feedback - the more concrete, the better.

### Suggest new topics
If you think something important is missing, open an issue describing:
- What the topic is and why it matters
- Who would benefit from it
- Any good source material you know of

### Write or improve articles
If you want to write or substantially improve an article:
1. Check the [open issues](https://github.com/explorience/regen-toolkit/issues) for existing topics
2. Comment on the issue to express interest
3. Wait for a go-ahead from a maintainer
4. Fork the repo, write your content, submit a PR

## Content Standards

Full content creation guide: [docs/writing-system.md](docs/writing-system.md)

### Quick summary:
- **Voice:** Friendly, practical, active voice ("you" not "one")
- **Audience:** Community practitioners, many new to web3
- **Structure:** Clear intro, short paragraphs, "Try This" exercises, References section
- **No AI slop:** Avoid "let's explore", "navigate", "journey", "landscape", "robust", "seamless"
- **Define jargon** on first use
- **Include real examples** - cite actual projects, not hypothetical ones

### Article location
All articles live in `src/content/docs/` as flat markdown files with YAML frontmatter. See any existing article for the frontmatter format.

### Frontmatter tags
Every article should have structured tags. See the [Tag Explorer](https://regen-toolkit-site.vercel.app/tags/) for the current vocabulary:
- `tags.function` - What problem it solves (Education, Governance, Security, etc.)
- `tags.domain` - Knowledge domain (Web3-Literacy, Community, Technical, etc.)
- `tags.systems` - Cross-cutting systems concepts (Decentralization, Trust-Networks, etc.)
- `audience` - Target reader level
- `maturity` - Complexity level (Beginner, Intermediate, Advanced)
- `related` - 2-4 slugs of related articles

## Editorial Pipeline

Articles go through a multi-stage review process before publication:

1. **Research** - Verify claims and identify gaps
2. **Writing** - Draft or expand content to meet standards
3. **Fact-checking** - Verify technical accuracy
4. **Editing** - Style consistency and clarity
5. **Critique** - Strategic alignment and ethical review

Sprint process documentation: [docs/process/](docs/process/)

## Code of Conduct

Be kind, be respectful, be regenerative. Assume good intentions, welcome newcomers, give constructive feedback.

## Questions?

Open an issue or reach out to the maintainers.
