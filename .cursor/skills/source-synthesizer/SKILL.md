---
name: source-synthesizer
description: Synthesize content from multiple sources into cohesive articles for the Regen Toolkit. Use when combining information from ReFi DAO Toolkit, Greenpill Guide, Bankless Academy, SuperBenefit, and other sources into unified, original content with proper attribution.
---

# Source Synthesizer

Transform multiple source materials into cohesive, original content while maintaining proper attribution and adding regenerative context.

## When to Use

Use this skill when:
- Writing articles that draw from multiple sources (e.g., Sources B + M + O)
- Combining philosophical frameworks with practical examples
- Merging technical documentation with case studies
- Creating content that bridges theory and practice
- Reframing existing content for the regenerative context

## Core Principle: Synthesize, Don't Copy

**Good synthesis:**
- Extracts key concepts from each source
- Identifies connections between sources
- Fills gaps with original analysis
- Reframes for regenerative context
- Adds new examples or applications

**Bad synthesis (avoid):**
- Copy-pasting paragraphs from sources
- Stringing together quotes without integration
- Missing attribution
- Losing source context
- Adding unsupported claims

## The Synthesis Process

### Step 1: Source Analysis

For each source, extract:

```markdown
## Source Analysis: [Source Code] - [Source Name]

### Core Concepts
- [Concept 1]: [Brief description]
- [Concept 2]: [Brief description]

### Key Arguments
1. [Primary argument with evidence]
2. [Secondary argument]

### Unique Value
- What this source adds that others don't: [Description]
- Target audience: [Who it's written for]
- Tone/style: [Technical/Philosophical/Practical]

### Limitations
- What's missing: [Gaps]
- Outdated information: [If any]
- Biases/perspectives: [What lens does it use?]

### Direct Quotes (for attribution)
- "[Quote]" — [Context]
- "[Quote]" — [Context]
```

### Step 2: Gap Analysis

Map what's covered and what's missing across all sources:

```markdown
## Coverage Matrix

| Topic | Source A | Source B | Source C | Gap Analysis |
|-------|----------|----------|----------|--------------|
| [Topic 1] | ✅ Covered | ⚠️ Brief | ❌ Missing | Need more depth |
| [Topic 2] | ❌ Missing | ✅ Covered | ✅ Covered | Well covered |
| [Topic 3] | ⚠️ Outdated | ❌ Missing | ✅ Current | Update needed |

### Synthesis Opportunities
1. **Combine A + B**: [Where they complement each other]
2. **Fill gaps**: [What's missing from all sources]
3. **Update**: [Outdated information to refresh]
4. **Reframe**: [How to add regenerative context]
```

### Step 3: Synthesis Strategy

Choose your approach based on source relationships:

#### Strategy A: Layered Approach (Theory → Application)

**Best for**: Sources with conceptual + practical content

**Structure**:
1. **Foundation** (from philosophical source)
   - Core concepts and frameworks
   - Why it matters
2. **Translation** (synthesis)
   - How concepts apply to regeneration
   - Bridging theory and practice
3. **Application** (from practical source)
   - Real-world implementation
   - Case studies and examples

**Example**: Source B (Greenpill philosophy) + Source O (case studies)

#### Strategy B: Comparative Approach (Multiple Perspectives)

**Best for**: Sources with different viewpoints on same topic

**Structure**:
1. **Introduction**: Topic overview
2. **Perspective 1** (Source X)
   - Key arguments
   - Evidence
3. **Perspective 2** (Source Y)
   - Different angle
   - Complementary evidence
4. **Synthesis**: How they fit together
   - Common ground
   - Tensions/resolutions
5. **Regenerative Context**: Application to our work

**Example**: Source D (Bankless technical) + Source C (CryptoAltruists nonprofit)

#### Strategy C: Gap-Filling Approach

**Best for**: Sources with complementary coverage

**Structure**:
1. **What's Well Covered**: Synthesize overlapping content
2. **What's Missing**: Original content for gaps
3. **Connections**: How pieces fit together
4. **Updated Context**: Current developments not in sources

**Example**: Source A (ReFi DAO playbooks) + NEW (current protocol updates)

### Step 4: Write Synthesized Content

#### Opening: Establish Frame

```markdown
## [Article Title]

This article brings together perspectives from [Source B] (philosophy), 
[Source M] (localism theory), and [Source O] (real-world examples) to 
explain [topic] for regenerative practitioners.
```

#### Body: Integrated Narrative

**Instead of**: "Source A says X. Source B says Y."

**Write**: "While [Source A] establishes that X, [Source B] extends this 
by demonstrating Y in practice. Together, they show that..."

**Pattern for synthesis**:
```
[Core concept from Source A] + [Application from Source B] + 
[Case study from Source O] = [Synthesized insight with regenerative framing]
```

#### Example Integration

**Sources**:
- Source B (Greenpill): "Public goods are non-excludable and non-rivalrous"
- Source M (Eth Localism): "Local communities can steward public goods effectively"
- Source O (Reimagining Power): "Case: Community land trust in Portland"

**Synthesis**:
```markdown
Public goods—resources that are open to all and not depleted by use—
form the foundation of regenerative economics (Greenpill Local Regen Guide). 
However, the challenge lies in stewardship: how do communities manage these 
resources without centralized control? Eth Localism theory suggests that 
local, place-based governance structures are uniquely positioned to maintain 
public goods through direct accountability and contextual knowledge.

This theory translates into practice through models like community land 
trusts. In Portland, a neighborhood collective used blockchain-based 
voting to steward a shared garden space, demonstrating how decentralized 
tools can support local public goods management (Reimagining Power Case Studies).

For regenerative practitioners, this means...
```

### Step 5: Attribution

#### Frontmatter

```yaml
sources:
  - code: "B"
    contribution: "Philosophical framework and public goods theory"
  - code: "M"  
    contribution: "Localism theory and governance patterns"
  - code: "O"
    contribution: "Real-world case study from Portland"
  - code: "NEW"
    contribution: "Regenerative context and practitioner guidance"
```

#### In-Text Citations

**When paraphrasing:**
```markdown
Public goods theory identifies two key characteristics: non-excludability 
and non-rivalry (Greenpill Local Regen Guide).
```

**When building on ideas:**
```markdown
Building on Greenpill's public goods framework, localist theory suggests 
that community-scale stewardship addresses the free-rider problem through 
social accountability (Eth Localism Book).
```

**When using specific examples:**
```markdown
The Portland Community Land Trust demonstrates this in practice, using 
quadratic voting to allocate resources among 150 members (Reimagining 
Power Case Studies).
```

**When adding original analysis:**
```markdown
For regenerative practitioners, this model suggests that blockchain tools 
are most effective when they enhance—rather than replace—existing social 
coordination mechanisms. [Original synthesis]
```

## Synthesis Patterns by Article Type

### Foundational Articles (Track 1)

**Goal**: Make complex concepts accessible to beginners

**Pattern**:
1. **Source B/D** (accessible explanations) → Core concept
2. **Source M** (deeper theory) → Add depth selectively
3. **Source O** (case studies) → Concrete examples
4. **Original** → Plain-language reframing

**Example flow**:
```
Bankless explains wallets simply 
→ We add security best practices from CryptoAltruists 
→ Include a real mistake story from case studies
→ Reframe for nonprofit context
```

### Applied Guides (Track 2)

**Goal**: Practical implementation guidance

**Pattern**:
1. **Source A** (ReFi DAO playbooks) → Step-by-step process
2. **Source E** (SuperBenefit patterns) → Governance considerations
3. **Source O** (case studies) → Real challenges and solutions
4. **Original** → Updated tools and current best practices

**Example flow**:
```
ReFi DAO's local node playbook 
→ SuperBenefit's governance patterns for coordination
→ Case study showing actual challenges
→ Updated with new tools (Hypercerts, etc.)
```

### Protocol Playbooks (Track 3.1)

**Goal**: Complete tool assessment and guide

**Pattern**:
1. **Official docs** → Technical specifications
2. **Source A** → How ReFi communities use it
3. **Community research** → Current sentiment and issues
4. **Original** → Maturity assessment and alternatives

**Example flow**:
```
Gitcoin's official documentation
→ ReFi DAO's integration guide
→ Recent community feedback (Discord/Forums)
→ Honest assessment of limitations + alternatives
```

### Case Studies (Track 3.3-3.4)

**Goal**: Real-world examples with lessons

**Pattern**:
1. **Source O** (SuperBenefit case studies) → Structure and depth
2. **Source A** (ReFi DAO context) → Ecosystem connections
3. **Original research** → Updates, outcomes, new insights
4. **Cross-reference** → Link to relevant playbooks

**Example flow**:
```
SuperBenefit's case study structure
→ ReFi DAO's context on the community
→ Follow-up research on what happened since
→ Connect to "Starting a Local Node" playbook
```

## Common Synthesis Challenges

### Challenge 1: Conflicting Sources

**When sources disagree:**

```markdown
Different approaches to [topic] reflect varying contexts and priorities. 
[Source A] emphasizes [approach], which works well for [situation]. 
However, [Source B] argues for [different approach], particularly suited 
to [different situation].

For regenerative practitioners, the choice depends on [factors]. 
[Source A's approach] may be preferable when [condition], while 
[Source B's approach] fits better when [condition].
```

**Example**:
```markdown
Different perspectives on DAO formation reflect varying risk tolerances 
and organizational contexts. Bankless Academy presents a streamlined 
approach focused on rapid deployment, which works well for experimental 
projects with small, aligned teams. However, SuperBenefit's Knowledge 
Garden advocates for more thorough governance design upfront, particularly 
suited to communities managing significant shared resources.

For regenerative practitioners, the choice depends on resource scale and 
community maturity. The streamlined approach may be preferable when 
testing new coordination patterns with limited stakes, while thorough 
design fits better when establishing long-term infrastructure for 
community assets.
```

### Challenge 2: Outdated Sources

**When source information is old:**

```markdown
[Source X] (2022) established foundational principles for [topic], 
including [key concepts]. Since then, the field has evolved significantly. 
[Recent development] has shifted [aspect], making [original recommendation] 
less relevant. Current best practice (as of [date]) suggests [updated approach].
```

### Challenge 3: Technical vs. Accessible Balance

**When sources vary in technical depth:**

```markdown
At its core, [concept] involves [simple explanation] (Bankless Academy). 
For those interested in technical details, this works through [mechanism] 
(SuperBenefit Knowledge Garden). The key takeaway for practitioners: 
[actionable insight].
```

### Challenge 4: Filling Major Gaps

**When sources don't cover important aspects:**

```markdown
While existing resources thoroughly cover [covered topic], they largely 
address [gap topic]. This section provides original guidance on [gap], 
drawing on [related principles] and [practitioner experience].

**Note**: This section synthesizes available sources with original analysis 
to address a documented gap in current resources.
```

## Quality Standards

### Synthesis Checklist

- [ ] All sources properly attributed in frontmatter
- [ ] In-text citations for specific claims
- [ ] No copy-pasted paragraphs
- [ ] Concepts integrated into flowing narrative
- [ ] Regenerative context added
- [ ] Gaps identified and filled appropriately
- [ ] Conflicting sources addressed fairly
- [ ] Outdated information updated
- [ ] New examples relevant to audience
- [ ] Cross-links to related articles included

### Attribution Density

**Minimum**: One attribution per paragraph that draws on sources
**Ideal**: Multiple sources woven together throughout
**Format**: Natural integration, not footnotes

### Example: Good vs. Bad Synthesis

**BAD** (stringing quotes):
```markdown
Source A says "blockchain is decentralized." Source B says "decentralization 
helps communities." Source C shows an example. [No integration]
```

**GOOD** (synthesized):
```markdown
Blockchain technology enables community-level coordination without 
centralized control (Bankless Academy). This decentralization proves 
particularly valuable for regenerative communities managing shared 
resources, as it allows collective decision-making while maintaining 
local autonomy (Eth Localism Book). The Green Bronx project demonstrates 
this in practice: a neighborhood collective uses a simple multi-signature 
wallet to manage their community garden fund, with decisions made through 
quadratic voting rather than relying on a single administrator (Reimagining 
Power Case Studies).

For practitioners starting similar initiatives, this suggests that...
```

## Tools for Synthesis

### Analysis Tools

**Compare sources side-by-side:**
```markdown
| Aspect | Source A | Source B | Source C | My Synthesis |
|--------|----------|----------|----------|--------------|
| Definition | X | Y | Z | Combined: ... |
| Best for | A | B | C | Context-dependent |
| Limitations | L1 | L2 | L3 | Mitigated by... |
```

### Mapping Tools

**Concept map before writing:**
```
[Core Concept from A]
    ↓ connects to
[Application from B] → [Real example from C]
    ↓ extends to
[Regenerative insight - original]
```

## Integration with Regen Toolkit

### File Organization

```
content/
├── [track]/[section]/
│   ├── article.md          # Synthesized content
│   └── .synthesis/         # (optional) Working notes
│       ├── source-analysis.md
│       └── synthesis-strategy.md
```

### Versioning Synthesis

When updating synthesized content:

```markdown
---
# ... other frontmatter ...
synthesis_version: 2
synthesis_date: 2026-02-11
source_versions:
  - code: "B"
    version_checked: "v2.1"
  - code: "O"
    version_checked: "latest"
---

## Synthesis Notes

**Version 2** (2026-02-11): Updated with new Hypercerts integration examples.
**Version 1** (2026-01-15): Initial synthesis from Sources B, M, O.
```

## See Also

- `web3-tool-assessor` — For evaluating tools before synthesis
- `academic-deep-research` — For deep research when sources are insufficient
- `regen-toolkit-builder` — Agent that uses this skill for content creation
