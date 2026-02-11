---
name: cross-link-validator
description: Validate and maintain cross-link networks in the Regen Toolkit. Use when checking link integrity, finding orphaned articles, identifying linking opportunities, or ensuring dense knowledge graph connectivity across 138 articles.
---

# Cross-Link Validator

Maintain dense, navigable connections between articles in the Regen Toolkit knowledge graph.

## When to Use

Use this skill when:
- Checking link integrity across the toolkit
- Finding orphaned articles with no incoming links
- Identifying cross-linking opportunities after writing new content
- Validating that critical paths are properly connected
- Auditing link density and distribution
- Fixing broken or stale links
- Optimizing navigation between related concepts

## Why Cross-Links Matter

**Knowledge Graph Density**: Articles should have 3-7 incoming links and 3-7 outgoing links on average.

**Critical Path Navigation**: Learning paths (1.1 → 1.2 → 1.8 → 2.7 → 3.4) must have clear "Next Step" links.

**Discovery**: Readers find related content through links, not search.

**Authority**: Well-linked articles signal importance and centrality.

## Link Types

### Type 1: Sequential Links (Track Progression)

**Purpose**: Guide reader through learning path
**Pattern**: Previous → Current → Next
**Format**: `[[previous-article]]` ← You are here → `[[next-article]]`

**Example in article**:
```markdown
## Next Steps

Now that you understand why regeneratives are interested in blockchain, 
explore [[1.2.1-what-is-decentralization|what decentralization means]] 
in practice.

Or jump ahead to [[1.8.1-what-are-daos|DAOs]] to see how decentralized 
organizations work.
```

### Type 2: Conceptual Links (Related Ideas)

**Purpose**: Connect related concepts across tracks
**Pattern**: Concept A ↔ Concept B
**Format**: `[[related-concept]]` embedded in text

**Example**:
```markdown
Setting up a [[1.5.1-wallet-basics|wallet]] is the first step before 
you can participate in [[2.6.1-funding-mechanisms|funding mechanisms]] 
or join a [[2.1.1-what-are-local-nodes|local node]].
```

### Type 3: Prerequisite Links (Dependencies)

**Purpose**: Signal required background knowledge
**Pattern**: Prerequisite → Advanced
**Format**: "Before this, understand [[prerequisite]]"

**Example**:
```markdown
## Prerequisites

Before diving into DAO governance, ensure you understand:
- [[1.2.2-consensus-mechanisms|Consensus mechanisms]]
- [[1.8.1-what-are-daos|DAO basics]]
- [[1.5.3-security-best-practices|Security fundamentals]]
```

### Type 4: Application Links (Theory → Practice)

**Purpose**: Connect foundations to applied content
**Pattern**: Track 1/2 → Track 3
**Format**: "Apply this with [[playbook]]" or "Learn more in [[case-study]]"

**Example**:
```markdown
## Apply This

Ready to implement? See the [[3.1.1-gitcoin-grants|Gitcoin Grants Playbook]] 
for step-by-step guidance.

For inspiration, check out how [[3.3.1-green-bronx|Green Bronx]] used 
this approach.
```

### Type 5: Source Links (Attribution)

**Purpose**: Connect to source materials
**Pattern**: Article → Source document
**Format**: "Detailed documentation: [[source-a|ReFi DAO Toolkit]]"

**Example**:
```markdown
## Source Materials

This article synthesizes:
- [[content/sources/b-greenpill-local-regen-guide|Greenpill Guide]] for philosophy
- [[content/sources/o-reimagining-power|Reimagining Power]] for case studies
```

## Validation Process

### Step 1: Map Current Links

**Extract all links from article:**
```bash
# Pattern to find WikiLinks
grep -oE '\[\[([^\]]+)\]\]' article.md

# Pattern to find aliased links
grep -oE '\[\[[^\]]+\|[^\]]+\]\]' article.md
```

**Document link structure:**
```markdown
## Article: [Title]
**Path:** `content/track/section/article.md`

### Outgoing Links (X total)
| Link | Type | Target Track | Status |
|------|------|--------------|--------|
| [[1.2.1-...]] | Sequential | 1 | ✅ Valid |
| [[2.6.1-...]] | Conceptual | 2 | ✅ Valid |
| [[3.1.1-...]] | Application | 3 | ⚠️ Broken |

### Incoming Links (from X articles)
| Source Article | Context |
|----------------|---------|
| [[1.1.1-...]] | "Next step" |
| [[1.2.2-...]] | "Related concept" |
```

### Step 2: Identify Issues

**Orphaned Articles** (no incoming links):
```markdown
## Orphaned Articles (Need Incoming Links)

| Article | Track | Suggested Link Sources |
|---------|-------|------------------------|
| [[2.8.3-oracle-problem]] | 2 | [[1.3.4-smart-contracts]], [[2.8.1-impact-verification]] |
| [[3.4.2-refi-latam]] | 3 | [[2.1.1-local-nodes]], [[3.3.1-global-cases]] |
```

**Broken Links** (target doesn't exist):
```markdown
## Broken Links

| Source Article | Broken Link | Suggested Fix |
|----------------|-------------|---------------|
| [[1.5.1-wallets]] | [[1.5.5-hardware-wallets]] | Create article OR link to [[1.5.2-wallet-types]] |
```

**Missing Critical Path Links**:
```markdown
## Critical Path Gaps

**Path**: 1.1 → 1.2 → 1.8 → 2.7 → 3.4

| Gap | Missing Link | Action |
|-----|--------------|--------|
| 1.2 → 1.8 | No connection | Add "Next: DAOs" section to 1.2 articles |
| 2.7 → 3.4 | No case study link | Add case study references in 2.7 |
```

**Low Link Density** (< 3 outgoing links):
```markdown
## Low Link Density Articles

| Article | Current | Target | Opportunities |
|---------|---------|--------|---------------|
| [[1.4.2-crypto-basics]] | 2 links | 5 links | Link to [[1.5.1-wallets]], [[2.6.1-funding]] |
```

### Step 3: Generate Link Recommendations

**Based on content analysis, suggest links:**

```markdown
## Link Opportunities for [[1.1.1-why-web3]]

### Sequential (Required)
- [ ] Add → [[1.1.2-common-concerns]]
- [ ] Add → [[1.1.3-stories]]
- [ ] Add → [[1.2.1-decentralization-intro]]

### Conceptual (Recommended)
- [ ] Link "public goods" → [[1.9.2-refi-ecosystem]]
- [ ] Link "local communities" → [[2.1.1-local-nodes]]
- [ ] Link "impact" → [[2.8.1-impact-measurement]]

### Application (Optional)
- [ ] Case study link → [[3.4.1-regen-success-stories]]
```

### Step 4: Implement Fixes

**Add missing links:**
```markdown
## Before
[Article content with no links]

## After
[Article content with [[relevant-links]] integrated naturally]

## Next Steps
Ready to explore? Continue to [[1.2.1-what-is-decentralization|decentralization]] 
or jump to [[1.8.1-what-are-daos|DAOs]].
```

**Fix broken links:**
```markdown
## Before
[[1.5.5-hardware-wallets]]  # Broken

## After
[[1.5.2-wallet-types|wallet types]]  # Valid alternative
```

## Automated Validation Checks

### Check 1: All Articles Have Minimum Links

```python
# Pseudocode for validation
for article in all_articles:
    outgoing = count_outgoing_links(article)
    incoming = count_incoming_links(article)
    
    if outgoing < 3:
        flag_low_outgoing(article)
    
    if incoming == 0:
        flag_orphaned(article)
```

### Check 2: Critical Paths Are Connected

```python
critical_paths = [
    ["1.1.1", "1.1.2", "1.1.3", "1.2.1", "1.2.2", "1.8.1", "1.8.2", "2.7.1", "2.7.2", "3.4.1"],  # University
    ["1.5.1", "1.5.2", "2.6.1", "2.6.2", "2.7.1", "2.8.1", "3.1.1", "3.2.1"],  # Somaliland
    ["1.10.1", "1.10.2", "1.5.1", "2.6.1", "2.11.1", "3.2.1"],  # Nonprofit
]

for path in critical_paths:
    for i in range(len(path) - 1):
        if not has_link(path[i], path[i+1]):
            flag_missing_critical_link(path[i], path[i+1])
```

### Check 3: No Broken Links

```python
for article in all_articles:
    for link in extract_links(article):
        if not article_exists(link.target):
            flag_broken_link(article, link)
```

## Link Density Guidelines

### By Track

| Track | Min Outgoing | Target Outgoing | Max Outgoing |
|-------|--------------|-----------------|--------------|
| 1 (Foundations) | 3 | 5 | 8 |
| 2 (Applied) | 4 | 6 | 10 |
| 3 (Playbooks) | 3 | 5 | 8 |

### By Article Type

| Type | Incoming Target | Outgoing Target |
|------|-----------------|-----------------|
| Hub/Index | 10+ | 8+ |
| Core Concept | 5-8 | 5-7 |
| Specific Guide | 3-5 | 4-6 |
| Case Study | 3-5 | 3-5 |

## Critical Path Specifications

### University Governance Class Path

**Sequence**: 1.1 → 1.2 → 1.8 → 2.7 → 3.4

**Required Links**:
- Each article must link to next in sequence
- Each article should link to 1-2 related concepts
- Final article (3.4) links to "further exploration"

**Validation**:
```markdown
## Path Validation: University Governance

| From | To | Link Present | Quality |
|------|----|--------------|---------|
| 1.1.1 | 1.2.1 | ✅ | "Next: Decentralization" |
| 1.1.2 | 1.2.1 | ✅ | "Continue to..." |
| 1.2.1 | 1.8.1 | ❌ | MISSING - Add required |
| 1.8.1 | 2.7.1 | ✅ | "Deep dive into..." |
| 2.7.1 | 3.4.1 | ✅ | "See real examples" |

**Status**: ⚠️ Partial — Add 1.2 → 1.8 link
```

### Somaliland Project Path

**Sequence**: 1.5 → 2.6 → 2.7 → 2.8 → 3.1 → 3.2

**Required Links**:
- Sequential progression links
- Tool-specific cross-references
- Case study connections

### Normie Nonprofit Path

**Sequence**: 1.10 → 1.5 → 2.6 → 2.11 → 3.2

**Required Links**:
- Safety-first progression
- Tool alternatives
- Risk mitigation resources

## Fixing Common Issues

### Issue: Orphaned Article

**Problem**: Article exists but nothing links to it

**Solution**:
1. Identify articles on related topics
2. Add contextual links in those articles
3. Add to section index

**Example**:
```markdown
# Article: [[2.8.3-oracle-problem]] (Orphaned)

## Link Sources Added:
1. [[1.3.4-smart-contracts]] → "For oracle challenges, see..."
2. [[2.8.1-impact-verification]] → "Related: oracle problem"
3. Section index updated
```

### Issue: Broken Link

**Problem**: Link points to non-existent article

**Solution**:
1. Check if article was moved/renamed
2. If planned but not written: Remove link or add placeholder note
3. If typo: Fix path
4. If merged: Link to combined article

### Issue: Low Link Density

**Problem**: Article has < 3 outgoing links

**Solution**:
1. Identify related concepts mentioned in text
2. Add inline links: `[[related-concept]]`
3. Add "See Also" or "Next Steps" section
4. Link to prerequisites if advanced content

### Issue: Missing Critical Path Link

**Problem**: Sequential articles don't connect

**Solution**:
1. Add explicit "Next Steps" section at end
2. Use consistent language: "Continue to...", "Next:", "Up next:"
3. Include brief preview of what reader will learn

## Reporting Format

### Link Audit Report

```markdown
# Cross-Link Audit Report
**Date:** 2026-02-11  
**Scope:** Full Toolkit (138 articles)

## Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total Articles | 138 | — |
| Articles with Good Link Density | 89 | ✅ |
| Orphaned Articles | 12 | ⚠️ |
| Broken Links | 3 | ❌ |
| Missing Critical Path Links | 5 | ⚠️ |

## Orphaned Articles (12)

| Article | Track | Recommended Actions |
|---------|-------|---------------------|
| [[2.8.3-oracle-problem]] | 2 | Link from 1.3.4, 2.8.1 |
| [[3.4.2-refi-latam]] | 3 | Link from 2.1.1, 3.3.1 |
| ... | ... | ... |

## Broken Links (3)

| Source | Broken Target | Fix |
|--------|---------------|-----|
| [[1.5.1-wallets]] | [[1.5.5-hardware]] | Change to [[1.5.2]] |
| ... | ... | ... |

## Critical Path Gaps (5)

| Path | Missing Link | Priority |
|------|--------------|----------|
| University | 1.2 → 1.8 | High |
| Somaliland | 2.8 → 3.1 | Medium |
| ... | ... | ... |

## Recommendations

1. **High Priority**: Fix 5 missing critical path links
2. **Medium Priority**: Add incoming links to 12 orphaned articles
3. **Low Priority**: Increase link density on 45 articles with < 3 outgoing links

## Action Items

- [ ] Fix broken links (3)
- [ ] Add critical path links (5)
- [ ] Link to orphaned articles (12)
- [ ] Re-audit in 2 weeks
```

## Integration with Regen Toolkit

### During Article Creation

When `regen-toolkit-builder` creates content:
1. Add outgoing links to related articles
2. Ensure incoming links from existing content
3. Connect to sequential articles in track
4. Link to sources in `content/sources/`

### Periodic Maintenance

**Monthly**: Quick audit of new articles
**Quarterly**: Full link audit and optimization
**Before Release**: Validate all critical paths

### Tools

Create utility scripts in `.cursor/skills/cross-link-validator/scripts/`:
- `audit_links.py` — Full link audit
- `find_orphans.py` — Find orphaned articles
- `validate_paths.py` — Check critical paths
- `suggest_links.py` — Suggest link opportunities

## Quality Checklist

- [ ] All articles have ≥ 3 outgoing links
- [ ] No orphaned articles (≥ 1 incoming link)
- [ ] No broken links
- [ ] Critical paths fully connected
- [ ] Links use consistent formatting
- [ ] Aliased links are descriptive
- [ ] "Next Steps" sections exist on sequential articles
- [ ] Prerequisites linked on advanced content
- [ ] Sources properly linked in attribution
- [ ] Cross-track connections established

## See Also

- `regen-toolkit-builder` — Creates content with proper linking
- `source-synthesizer` — Links to sources during synthesis
- Critical path specs in `DEVELOPMENT-WORKFLOW.md`
