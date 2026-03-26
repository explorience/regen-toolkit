# Regen Toolkit Taxonomy Migration Plan

Updated based on 2026-03-26 discussion with Heenal.

## Goal
Align the Regen Toolkit's structure and content with Matt's taxonomy/ontology while preserving the integrity of each article.

## Core Principles
- **No forced fit**: Schema elements apply only when they add value
- **Content-first**: Structure follows substance, not template
- **Progressive enhancement**: Add depth where it matters, don't uniformize
- **Respect the soul**: Preserve each article's unique purpose and flow

## Phase 1: Frontmatter Enrichment

Add structured metadata to all 46 published articles.

### New Fields
```yaml
tags:
  domain: Community    # Primary category from Matt's taxonomy
  function: Governance   # What problem it solves
  systems:
    - Feedback Loops     # Cross-cutting systems concepts (when relevant)
    - Thresholds
value_chain:
  - value: "Strengthen community trust"
  - principle: "Shared decision-making"
  - practice: "Running consent-based meetings"
sources_used:
  - restor.org/project/keystone-research-center
  - weavers.network/project/solar-community-co-op
```

### Implementation
- Script to batch-inject basic tags based on current categories
- Manual refinement for edge cases and value chains
- Sources added per article based on actual research used

### Scope
All 46 Phase 1 articles

### Timeline
Tonight (2026-03-26)

## Phase 2: Adaptive Structural Enhancement

Enhance articles **only when schema elements add value**, not universally.

### Rules for Application

#### `## How This Works` (value → principle → practice)
- **Apply to**: Actionable frameworks and behavior patterns (~80% of guides)
- **Do not apply to**: Foundational pieces, definitions, lists, tool comparisons
- **Format**:
  ```markdown
  ## How This Works
  - **Value:** Community sovereignty over exchange
  - **Principle:** Closed-loop mutual credit
  - **Practice:** Weekly exchange reconciliation at local markets
  ```

#### Systems Concepts (Fractals, Thresholds, Feedback Loops)
- **Apply to**: Articles where the concept is genuinely relevant
- **Do not apply to**: Every article
- **Format**: Weave naturally into existing sections — **do not create a standalone "Systems Patterns" section**
- **Rule**: Mention in context, not as a checklist item

#### Tiered Exercises (`## Try This`)
- **Apply to**: All actionable content
- **Format**: Use blockquotes with clear progression:
  ```markdown
  ## Try This
  > **Beginner:** Map local producers who might accept local currency  
  > **Intermediate:** Prototype a simple exchange agreement
  > **Advanced:** Design a feedback loop for currency circulation
  ```
- **Rule**: Keep within `## Try This` — no additional heading

## Phase 3: Navigation & Discovery

After structural updates are complete.

### Immediate Steps
1. Build hierarchical filters using the 5-axis system:
   - Domain → Function → Audience → Maturity → Systems
2. Create guided pathways:
   - "Local Organizer → Intermediate → Governance"
   - "DAO Operator → Beginner → Funding"
3. Implement cross-tag discovery:
   - "Articles about Feedback Loops in Funding"
   - "Beginner guides for Conflict Transformation"

### Long-Term
- Add tag glossary with definitions and examples
- Enable user-customized views ("Show me AI + Governance + Beginner")

## Phase 4: Gap Analysis & Expansion

Use Matt's "Knowledge Integration" matrix to identify missing content.

### Top Priority Gaps
- Conflict transformation (linked to "Fractals" and "Thresholds")
- Threshold detection in community growth
- Feedback loop design for local currencies
- AI-augmented governance patterns

### Action
- Generate 3–5 new articles targeting highest-impact gaps
- Use Restor, Hylo, and P2P Foundation as primary source material

## Execution

tej will:
1. Complete Phase 1 tonight — inject tags into all 46 articles
2. Apply Phase 2 enhancements selectively during next editorial pass
3. Hold Phase 3 until structural updates are stable
4. Begin Phase 4 gap analysis after meeting your bi-weekly deadline

This adaptive approach honors both the power of Matt's taxonomy and the unique purpose of each article.