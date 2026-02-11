---
name: web3-tool-assessor
description: Assess web3 protocol and tool maturity for nonprofit/organizational readiness. Use when evaluating blockchain tools, DeFi protocols, DAO infrastructure, or regenerative web3 applications for the Regen Toolkit. Provides structured 4-dimension assessment framework.
---

# Web3 Tool Assessor

Structured assessment framework for evaluating web3 tools, protocols, and applications — specifically designed for regenerative practitioners and nonprofit contexts.

## When to Use

Use this skill when:
- Evaluating a new protocol for the Regen Toolkit playbook
- Assessing tool maturity before recommending to nonprofits
- Comparing multiple tools for similar use cases
- Documenting limitations and alternatives
- Creating "readiness ratings" for organizational adoption

## Assessment Framework

### The 4 Dimensions

Every tool is assessed across four dimensions using a 5-star rating system:

#### 1. Technical Accessibility ⭐⭐⭐⭐⭐

**Questions to investigate:**
- **Login Method**: Does it require a crypto wallet, or allow email/password?
- **Onboarding Complexity**: How long to first meaningful action?
  - Simple: < 5 minutes
  - Medium: 5-15 minutes
  - Complex: > 15 minutes
- **Documentation Quality**: Comprehensive / Basic / Poor / None
- **Error Recovery**: Clear guidance when things go wrong?
- **Mobile Support**: Full / Partial / None

**Rating Guide:**
- ⭐: Requires deep crypto knowledge, complex setup, poor docs
- ⭐⭐⭐: Wallet required, good docs, moderate complexity
- ⭐⭐⭐⭐⭐: Email login, excellent onboarding, comprehensive docs

#### 2. Nonprofit Readiness ⭐⭐⭐⭐⭐

**Questions to investigate:**
- **Legal Clarity**: Clear terms for organizational use?
- **Accounting Support**: Exportable transaction history? Reporting tools?
- **Compliance Features**: KYC/AML options? Tax documentation?
- **Support Channels**: Email support? Response time?
- **Organizational Features**: Multi-user? Permissions? Admin controls?

**Rating Guide:**
- ⭐: No org features, unclear terms, no support
- ⭐⭐⭐: Basic org support, some compliance features
- ⭐⭐⭐⭐⭐: Full organizational suite, legal clarity, dedicated support

#### 3. Community Adoption ⭐⭐⭐⭐⭐

**Questions to investigate:**
- **Active Usage**: Number of active organizations/projects
- **Success Stories**: Documented case studies? Testimonials?
- **Community Size**: Active Discord/forum? Regular engagement?
- **Update Frequency**: Regular improvements? Bug fix velocity?
- **Ecosystem Presence**: Known in ReFi/regen circles?

**Rating Guide:**
- ⭐: Experimental, few users, no case studies
- ⭐⭐⭐: Growing community, some documented uses
- ⭐⭐⭐⭐⭐: Mass adoption, many case studies, vibrant community

#### 4. Integration Ecosystem ⭐⭐⭐⭐⭐

**Questions to investigate:**
- **API Availability**: REST/GraphQL? Documentation quality?
- **Connected Tools**: Integrations with popular platforms?
- **Data Portability**: Easy export? Standard formats?
- **Composability**: Works with other web3 protocols?
- **No-Code Options**: Zapier/Make integrations? Webhooks?

**Rating Guide:**
- ⭐: Standalone only, no API, vendor lock-in
- ⭐⭐⭐: Basic API, some integrations
- ⭐⭐⭐⭐⭐: Rich API, many connections, full data portability

## Assessment Process

### Step 1: Initial Research (30 min)

```bash
# Primary sources
web_fetch [official-docs-url]
web_fetch [github-repo-url]

# Community research  
web_search "[tool-name] tutorial" "getting started"
web_search "[tool-name] case study" "success story"
web_search "[tool-name] review" "experience"
```

**Document:**
- Primary purpose and functionality
- Target audience
- Key features
- Pricing/cost structure

### Step 2: Hands-On Evaluation (60 min)

**Create test accounts and document:**
- Onboarding flow (screenshots if possible)
- First-action complexity
- UI/UX quality
- Error messages and recovery

**Test organizational features:**
- Team/organization setup
- Permission systems
- Export functionality

### Step 3: Community Research (30 min)

```bash
# Discord/Telegram sentiment
web_search "[tool-name] discord" "community feedback"

# Documentation quality
web_fetch [docs-url]  # Sample key pages

# Case studies
web_search "[tool-name] case study" "nonprofit" OR "impact"
```

**Document:**
- Community size and activity
- Real-world usage examples
- Common complaints/praise
- Support quality

### Step 4: Synthesize Ratings

For each dimension, assign rating and justify:

```markdown
| Dimension | Rating | Justification |
|-----------|--------|---------------|
| Technical Accessibility | ⭐⭐⭐⭐☆ | Email login available, 10-min onboarding, good docs |
| Nonprofit Readiness | ⭐⭐☆☆☆ | Limited accounting exports, no dedicated support |
| Community Adoption | ⭐⭐⭐⭐☆ | 500+ active projects, strong ReFi presence |
| Integration Ecosystem | ⭐⭐⭐☆☆ | API available, few native integrations |
```

### Step 5: Overall Maturity Assessment

**Calculate overall rating:**
```
Total stars / 4 dimensions = Average

4.0-5.0 = Enterprise-Ready
3.0-3.9 = Production-Ready  
2.0-2.9 = Beta
1.0-1.9 = Alpha
< 1.0 = Experimental
```

## Assessment Output Template

```markdown
## [Tool Name] Maturity Assessment

**Assessment Date:** [YYYY-MM-DD]  
**Assessed By:** [Name/Agent]  
**Tool Version:** [Version at assessment]

---

### Quick Summary

| Dimension | Rating | Score |
|-----------|--------|-------|
| Technical Accessibility | ⭐⭐⭐⭐☆ | 4/5 |
| Nonprofit Readiness | ⭐⭐☆☆☆ | 2/5 |
| Community Adoption | ⭐⭐⭐⭐☆ | 4/5 |
| Integration Ecosystem | ⭐⭐⭐☆☆ | 3/5 |
| **OVERALL** | **Production-Ready** | **3.25/5** |

---

### Detailed Assessment

#### Technical Accessibility (⭐⭐⭐⭐☆)

**Login Method:** [Wallet/Email/Both]

**Onboarding Complexity:** [Simple/Medium/Complex]
- Time to first action: [X minutes]
- Steps required: [Number]

**Documentation Quality:** [Comprehensive/Basic/Poor]
- Strengths: [What's good]
- Gaps: [What's missing]

**Error Recovery:** [Good/Moderate/Poor]
- Example error message: [Quote]
- Recovery guidance: [Description]

#### Nonprofit Readiness (⭐⭐☆☆☆)

**Legal Clarity:** [Clear/Ambiguous/Concerning]
- Terms for org use: [Summary]

**Accounting Support:** [Full/Partial/None]
- Export formats: [CSV/PDF/API]
- Transaction history: [Description]

**Compliance Features:** [Comprehensive/Limited/None]
- KYC/AML: [Available/Not available]
- Tax docs: [Available/Not available]

**Support Channels:** [Email/Chat/Forum/None]
- Response time: [Observed/Reported]

#### Community Adoption (⭐⭐⭐⭐☆)

**Active Usage:**
- Organizations: [Number or estimate]
- Transactions/volume: [If available]

**Success Stories:**
- [Case study 1]
- [Case study 2]

**Community Health:**
- Discord/Telegram: [Size and activity]
- Update frequency: [Regular/Sporadic/Stagnant]

#### Integration Ecosystem (⭐⭐⭐☆☆)

**API Availability:** [Full/Partial/None]
- Documentation: [Link/quality]
- Rate limits: [If applicable]

**Connected Tools:**
- Native integrations: [List]
- Zapier/Make: [Yes/No]

**Data Portability:** [Easy/Moderate/Difficult]
- Export formats: [List]
- Migration path: [Description]

---

### Best For

- ✅ [Use case where tool shines]
- ✅ [Another ideal use case]

### Not Ready For

- ❌ [Use case where tool struggles]
- ❌ [Another problematic use case]

### Alternatives to Consider

| Tool | Better For | Trade-off |
|------|------------|-----------|
| [Alt 1] | [Use case] | [What's different] |
| [Alt 2] | [Use case] | [What's different] |

---

### Assessment Notes

**Key Limitations:**
- [Limitation 1 with context]
- [Limitation 2 with context]

**Recent Changes:**
- [New feature/improvement]
- [Deprecation/concern]

**Confidence Level:** [High/Medium/Low]
- [Explanation of confidence]

---

### Re-assessment Trigger

Re-assess this tool when:
- [ ] Major version release
- [ ] New organizational features announced
- [ ] 6 months pass
- [ ] User reports significant change

**Next Scheduled Assessment:** [Date]
```

## Special Cases

### Brand New Tools (< 6 months)

For very new tools, add:
- **Team background**: Who built it? Track record?
- **Funding status**: Bootstrapped? VC-backed? Grant-funded?
- **Longevity risk**: Likely to survive 2+ years?

Reduce ratings accordingly and flag as **Experimental** regardless of quality.

### Deprecated/Legacy Tools

If tool is being sunset:
- Document migration path
- Suggest alternatives
- Mark for removal from toolkit

### Rapidly Evolving Tools

If tool changes frequently:
- Note assessment date prominently
- Suggest more frequent re-assessment
- Document version at time of assessment

## Comparison Framework

When comparing multiple tools for similar use cases:

```markdown
## Tool Comparison: [Use Case]

| Tool | Overall | Tech Access | Nonprofit | Community | Integration | Best For |
|------|---------|-------------|-----------|-----------|-------------|----------|
| Tool A | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆☆ | Beginners |
| Tool B | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐☆ | Organizations |
| Tool C | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ | ⭐⭐☆☆☆ | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | Budget-conscious |

### Recommendation Matrix

| Scenario | Recommended Tool | Rationale |
|----------|------------------|-----------|
| New to web3 | Tool A | Best onboarding |
| Established nonprofit | Tool B | Full org features |
| Limited budget | Tool C | Free tier sufficient |
```

## Integration with Regen Toolkit

When creating assessments for the toolkit:

1. **Save to**: `content/3-playbooks/3.1-protocol-playbooks/[tool-name].md`
2. **Cross-link**: Connect to relevant Track 2 articles
3. **Tag audiences**: Mark which personas it's appropriate for
4. **Update DEVELOPMENT.md**: Add to tool assessment table
5. **Set re-assessment date**: 6 months from assessment

## Example Assessments

### High Maturity Example: Giveth

```markdown
**Overall**: ⭐⭐⭐⭐☆ Production-Ready

**Technical Accessibility**: ⭐⭐⭐⭐☆
- Email login available
- 8-minute average onboarding
- Excellent documentation with video guides
- Good error messaging

**Nonprofit Readiness**: ⭐⭐⭐⭐☆
- Clear terms for organizational use
- Exportable donation history
- Tax receipt generation
- Responsive email support

**Community Adoption**: ⭐⭐⭐⭐⭐
- 1000+ verified projects
- Strong ReFi ecosystem presence
- Active Discord (10k+ members)
- Regular feature updates

**Integration Ecosystem**: ⭐⭐⭐☆☆
- Basic API available
- Limited native integrations
- Data exportable in standard formats
```

### Low Maturity Example: Experimental Protocol

```markdown
**Overall**: ⭐⭐☆☆☆ Beta

**Technical Accessibility**: ⭐⭐⭐☆☆
- Wallet-only login
- 20-minute complex onboarding
- Sparse documentation
- Poor error recovery

**Nonprofit Readiness**: ⭐☆☆☆☆
- No organizational features
- Unclear legal terms
- No support channels

**Community Adoption**: ⭐⭐⭐☆☆
- ~50 active users
- No documented case studies
- Small but engaged Discord
- Infrequent updates

**Integration Ecosystem**: ⭐⭐☆☆☆
- No API yet
- No integrations
- Limited export options
```

## Quality Checklist

Before finalizing assessment:

- [ ] Tested onboarding personally (or found detailed review)
- [ ] Reviewed official documentation
- [ ] Checked community sentiment (Discord/Reddit)
- [ ] Found at least 2 real-world use cases
- [ ] Documented specific limitations honestly
- [ ] Suggested appropriate alternatives
- [ ] Rated all 4 dimensions with justification
- [ ] Set re-assessment date
- [ ] Cross-checked ratings against rubric

## See Also

- `academic-deep-research` skill — For deep protocol research
- `source-synthesis` skill — For synthesizing multiple sources
- `regen-toolkit-builder` agent — For creating playbook content
