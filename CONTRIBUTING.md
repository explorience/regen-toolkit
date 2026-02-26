# Contributing to the Regen Toolkit

Thank you for your interest in contributing to the Regen Toolkit! This is a community-driven project, and we welcome contributions from practitioners, educators, and builders around the world.

## Ways to Contribute

### 1. Claim an Existing Article

Most articles already exist as placeholder issues in the [project board](https://github.com/users/explorience/projects/2). This is the easiest way to start contributing.

**To claim an article:**
1. Browse the [open issues](https://github.com/explorience/regen-toolkit/issues) or [project board](https://github.com/users/explorience/projects/2)
2. Find an article labeled `status:placeholder` that matches your expertise
3. Assign yourself to the issue
4. Write the content in the corresponding markdown file under `content/`
5. Submit a pull request linking to the issue

### 2. Write New Content

If you want to propose an article that doesn't have an existing issue:

**To propose a new article:**
1. Open an issue using the [Article template](.github/ISSUE_TEMPLATE/article.md)
2. Wait for feedback/approval
3. Write the content
4. Submit a pull request

### 3. Improve Existing Content

- Fix typos and improve clarity
- Add examples and case studies
- Update outdated information
- Improve accessibility

### 4. Add Case Studies

We especially need case studies from:
- Different geographic regions
- Various project types (environmental, social, economic)
- Different scales (local, regional, global)

### 5. Create Protocol Playbooks

Step-by-step guides for using specific protocols:
- Gitcoin Grants
- Giveth
- Hypercerts
- Optimism RetroPGF
- And more...

### 6. Translate Content

Help make this toolkit accessible to non-English speakers.

### 7. Review and Feedback

- Review pull requests
- Test exercises and tutorials
- Provide feedback on clarity and accuracy

## Content Guidelines

### Target Audience Awareness

Remember our three personas when writing:

- **Grounded Regen**: Avoid jargon, explain Web3 concepts clearly
- **Curious Degen**: Focus on practical regenerative applications
- **On-Chain Regen**: Provide implementation details and patterns

### Article Structure

Each article should include:

1. **Overview** - What this article covers and why it matters
2. **Key Concepts** - Core ideas explained clearly
3. **Practical Application** - How to apply this in regenerative work
4. **Exercises** (optional) - Hands-on activities
5. **Resources** - Links for further learning

### Writing Style

- Use clear, accessible language
- Define technical terms when first used
- Include real-world examples
- Be inclusive and welcoming
- Avoid hype and speculation

### Formatting

- Use Markdown for all content
- Include descriptive alt text for images
- Use headings to organize content
- Keep paragraphs concise

## Submission Process

### For Small Changes

1. Fork the repository
2. Make your changes
3. Submit a pull request with a clear description

### For New Articles or Major Changes

1. Open an issue first to discuss
2. Wait for feedback
3. Fork and create a feature branch
4. Write your content
5. Submit a pull request
6. Respond to review feedback

## Code of Conduct

Be kind, be respectful, be regenerative. We're all here to learn and build together.

- Assume good intentions
- Welcome newcomers
- Give constructive feedback
- Celebrate diverse perspectives

## AI-Assisted Writing Pipeline

This project uses a multi-agent AI pipeline to write high-quality, sourced articles. The pipeline ensures factual accuracy through independent fact-checking and persona-based critique.

### The Pipeline

```
Request → Research (Luz) → Draft (Rupa) → Fact-Check (Satya) → Edit (Sakshi) → Critique → Final
```

Each agent has ONE job:
- **Luz (Researcher)**: Extract facts from sources, no writing
- **Rupa (Writer)**: Write first draft from research brief
- **Satya (Fact-Checker)**: Verify every claim against sources
- **Sakshi (Editor)**: Polish for clarity and actionability

### Setting Up the Pipeline Locally

#### 1. Clone the Repo

```bash
git clone https://github.com/explorience/regen-toolkit.git
cd regen-toolkit
```

#### 2. Install Dependencies

You need Node.js 18+ and Python 3.10+.

```bash
# Install OpenClaw (for agent orchestration)
npm install -g openclaw

# Or install sub-agent dependencies individually
npm install
```

#### 3. Configure Model Access

The pipeline uses these models by default:

| Agent | Model | Provider |
|-------|-------|----------|
| Luz (Research) | MiniMax M2.5 | Direct (api.minimax.io) |
| Rupa (Draft) | Trinity | OpenRouter (free) |
| Satya (Fact-Check) | MiniMax M2.5 | Direct |
| Sakshi (Edit) | MiniMax M2.5 | Direct |
| Critique | MiniMax M2.5 | Direct |

**MiniMax Setup:**
```bash
# Get API key from https://platform.minimax.io/
export MINIMAX_API_KEY="your-key-here"
```

**OpenRouter Setup (for Trinity):**
```bash
# Get free API key from https://openrouter.ai/
export OPENROUTER_API_KEY="your-key-here"
```

#### 4. Set Up Sub-Agent Context

Create `memory/sub-agent-context.md` in your workspace:

```markdown
# Sub-Agent Context

## Project: Regen Toolkit Article Pipeline

**Repo:** /path/to/regen-toolkit
**Skill:** skills/regen-toolkit-article.md

## Current Focus
- Writing educational articles about Web3/regenerative finance
- Target audience: 🌱 Maya (grounded regen - no crypto background)

## Quality Standards
- All claims must be sourced
- No hallucinations - fact-check every specific claim
- Accessible language for non-technical readers
- Practical examples and action items

## Pipeline Stages
1. RESEARCH - Gather facts from sources
2. DRAFT - Write first draft with citations
3. VERIFY - Fact-check against sources
4. REVIEW - Edit for clarity
5. CRITIQUE - Persona-based feedback
6. PUBLISH - Format and commit
```

### Running the Pipeline

#### Option 1: Using the Skill Directly

The pipeline is packaged as an OpenClaw skill. To invoke it:

1. Place the skill in your OpenClaw skills directory
2. Reference `skills/SKILL.md` and `skills/INVOKE.md` for usage
3. Set up your model API keys (MiniMax for research/fact-check, Trinity for drafting)

#### Option 2: Manual Step-by-Step

```bash
# Step 1: Research (Luz)
openclaw spawn-agent --name luz --task "Research article: what-is-ethereum. Output to working/what-is-ethereum-research.md"

# Step 2: Draft (Rupa)
openclaw spawn-agent --name rupa --task "Draft article from research brief at working/what-is-ethereum-research.md. Output to content/1-foundations/1.6-ethereum-smart-contracts/what-is-ethereum.md"

# Step 3: Fact-Check (Satya)
openclaw spawn-agent --name satya --task "Fact-check article at content/1-foundations/1.6-ethereum-smart-contracts/what-is-ethereum.md against working/what-is-ethereum-research.md. Output to working/what-is-ethereum-factcheck.md"

# Step 4: Edit (Sakshi)
openclaw spawn-agent --name sakshi --task "Edit article at content/1-foundations/1.6-ethereum-smart-contracts/what-is-ethereum.md for clarity. Update in place."

# Step 5: Critique
openclaw spawn-agent --name critique --task "Persona critique for Maya (grounded regen). Read article, output to working/what-is-ethereum-critique.md"

# Step 6: Final
# Update frontmatter: status: placeholder → status: draft
```

#### Option 3: Direct Prompt (Simplest)

```bash
openclaw spawn-agent \
  --model minimax \
  --task "Run the full regen-toolkit-article pipeline for 5 articles. Use skills/regen-toolkit-article.md. Start with articles that have status:placeholder in content/. Report progress every 10 minutes."
```

### Using Without OpenClaw

If running agents manually:

```python
# Example: Running Luz (research) with MiniMax
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MINIMAX_API_KEY"],
    base_url="https://api.minimax.io/v1"
)

# Load skill and research brief
with open("skills/regen-toolkit-article.md") as f:
    skill = f.read()

prompt = f"""
{skill}

TASK: Research article at content/1-foundations/1.1-why-web3/why-regens-interested.md

1. Read the placeholder article to understand topic
2. Research using sources: Bankless Academy, academic papers
3. Output to working/why-regens-interested-research.md
"""

response = client.chat.completions.create(
    model="MiniMax-M2.5",
    messages=[{"role": "user", "content": prompt}]
)
```

### Quality Gates

| Gate | Criteria |
|------|----------|
| Research | ≥3 sources, key concepts documented, gaps flagged |
| Draft | All claims cited, word count ±20%, has intro/body/conclusion |
| Fact-Check | Zero ❌ claims, ≤2 ⚠️ unverified, URLs work |
| Edit | Style guide pass, no fluff, clear action items |
| Critique | "SHIP IT" from persona |

### Output Structure

```
content/{section}/{subsection}/
├── {article-slug}.md              # Final article
└── working/
    ├── {article-slug}-research.md # Luz's research brief
    ├── {article-slug}-factcheck.md # Satya's verification
    └── {article-slug}-critique.md  # Persona feedback
```

### Persona Cards

When writing, target one of three audiences:

- **🌱 Maya (Grounded Regen)**: Permaculture teacher, no crypto. Needs everything explained. Analogies: nature, community.
- **💰 Alex (Crypto-Active)**: Has traded crypto, understands DeFi. Wants legitimacy signals, technical details OK.
- **🔄 Jordan (On-Chain Regen)**: Works in ReFi, knows web3 basics. Wants patterns, playbooks, governance.

### State Management

The pipeline tracks progress in `.pipeline-state.json`:

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-26T14:30:00Z",
  "queue": [{"slug": "what-is-ethereum", "stage": "VERIFY"}],
  "completed": [{"slug": "why-regens-interested", "completedAt": "2026-02-26T13:45:00Z"}]
}
```

### Troubleshooting

**Fact-check fails:** Return to Rupa with specific feedback. Max 3 retries.

**Missing sources:** Flag in research. Don't hallucinate - note gaps.

**Persona says "NEEDS WORK":** Address specific concerns, re-run critique.

---

## Questions?

Open an issue with your question, or reach out to the maintainers.

---

*Thank you for helping build Web3 knowledge for the regenerative movement!*
