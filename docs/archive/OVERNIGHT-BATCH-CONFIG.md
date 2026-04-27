# Overnight Batch Production Configuration

**Model**: GPT-4o (optimal for content quality/cost balance)  
**Target**: 10-15 "easier win" articles overnight  
**Estimated Cost**: $2-5 (depending on output length)  
**Runtime**: 6-8 hours  

---

## Model Selection Rationale

| Model | Quality | Cost | Best For |
|-------|---------|------|----------|
| GPT-5.3-codex | ⭐⭐⭐⭐⭐ | $$$$ | Complex technical content, code |
| GPT-4o | ⭐⭐⭐⭐☆ | $$ | **Content generation** (selected) |
| GPT-4o-mini | ⭐⭐⭐☆☆ | $ | Quick drafts, simple content |
| Kimi k2.5 | ⭐⭐⭐⭐☆ | $$ | Alternative, good for long context |

**Why GPT-4o for overnight batch:**
- ✅ High quality for educational content
- ✅ Fast token generation (~60-80 tok/sec)
- ✅ Cost-effective ($0.005/1K input, $0.015/1K output)
- ✅ Good at following templates and structure
- ✅ Reliable source synthesis

---

## "Easier Win" Article Selection

### Criteria for Overnight Batch
1. **Shorter word count** (800 words vs 1200)
2. **Simpler template** (Foundational > Playbook)
3. **Clear sources** (Sources B, D, G have good coverage)
4. **ReFi DAO overlap** (Existing content to leverage)
5. **Lower complexity** (Concepts > Technical implementation)

### Tier 1: Easiest (Develop First)

| # | Article | Track | Words | Sources | Why Easy |
|---|---------|-------|-------|---------|----------|
| 1 | why-regens-interested.md | 1.1 | 800 | B, M, NEW | ✅ DONE - Template proven |
| 2 | coordination-transparency.md | 1.1 | 800 | B, NEW | Similar to #1, Source B rich |
| 3 | common-concerns.md | 1.1 | 800 | B, C, NEW | FAQ format, Source C (CryptoAltruists) |
| 4 | what-web3-can-cant-do.md | 1.1 | 800 | B, NEW | Balanced view, Source B |
| 5 | relates-to-existing-work.md | 1.1 | 800 | A, B, NEW | Comparison format |
| 6 | stories-regens-leap.md | 1.1 | 800 | O, NEW | Case study format, Source O |
| 7 | what-is-decentralization.md | 1.2 | 800 | B, D, NEW | Core concept, Bankless (D) covers |
| 8 | trust-transparency.md | 1.2 | 800 | B, E, NEW | Conceptual, SuperBenefit (E) |
| 9 | what-is-wallet.md | 1.5 | 800 | G, NEW | Foundation (G) has wallet basics |
| 10 | setting-up-first-wallet.md | 1.5 | 800 | G, A, NEW | Step-by-step, Foundation + ReFi DAO |

### Tier 2: Moderate (If Time Permits)

| # | Article | Track | Words | Sources | Notes |
|---|---------|-------|-------|---------|-------|
| 11 | what-is-dao.md | 1.8 | 800 | E, A, NEW | SuperBenefit (E) has DAO content |
| 12 | dao-vs-traditional.md | 1.8 | 800 | E, NEW | Comparison format |
| 13 | what-is-local-node.md | 2.1 | 800 | A, NEW | ReFi DAO (A) rich content |
| 14 | why-local-matters.md | 2.1 | 800 | B, M, NEW | Eth Localism (M) |
| 15 | how-nodes-connect.md | 2.1 | 800 | A, NEW | Network effects, ReFi DAO |

---

## Batch Production Script

### Configuration File: `.cursor/batch-config.json`

```json
{
  "batch_name": "overnight-tier1-foundations",
  "model": "openai/gpt-4o",
  "settings": {
    "temperature": 0.7,
    "max_tokens": 2000,
    "thinking": "off"
  },
  "articles": [
    {
      "path": "content/1-foundations/1.1-why-web3/coordination-transparency.md",
      "issue": null,
      "template": "foundational",
      "sources": ["B", "NEW"],
      "target_words": 800,
      "priority": 1
    },
    {
      "path": "content/1-foundations/1.1-why-web3/common-concerns.md",
      "issue": null,
      "template": "foundational",
      "sources": ["B", "C", "NEW"],
      "target_words": 800,
      "priority": 2
    },
    {
      "path": "content/1-foundations/1.1-why-web3/what-web3-can-cant-do.md",
      "issue": null,
      "template": "foundational",
      "sources": ["B", "NEW"],
      "target_words": 800,
      "priority": 3
    },
    {
      "path": "content/1-foundations/1.1-why-web3/relates-to-existing-work.md",
      "issue": null,
      "template": "foundational",
      "sources": ["A", "B", "NEW"],
      "target_words": 800,
      "priority": 4
    },
    {
      "path": "content/1-foundations/1.1-why-web3/stories-regens-leap.md",
      "issue": null,
      "template": "foundational",
      "sources": ["O", "NEW"],
      "target_words": 800,
      "priority": 5
    },
    {
      "path": "content/1-foundations/1.2-decentralization/what-is-decentralization.md",
      "issue": null,
      "template": "foundational",
      "sources": ["B", "D", "NEW"],
      "target_words": 800,
      "priority": 6
    },
    {
      "path": "content/1-foundations/1.2-decentralization/trust-transparency.md",
      "issue": null,
      "template": "foundational",
      "sources": ["B", "E", "NEW"],
      "target_words": 800,
      "priority": 7
    },
    {
      "path": "content/1-foundations/1.5-wallets-security/what-is-wallet.md",
      "issue": null,
      "template": "foundational",
      "sources": ["G", "NEW"],
      "target_words": 800,
      "priority": 8
    },
    {
      "path": "content/1-foundations/1.5-wallets-security/setting-up-first-wallet.md",
      "issue": null,
      "template": "foundational",
      "sources": ["G", "A", "NEW"],
      "target_words": 800,
      "priority": 9
    }
  ],
  "quality_checks": {
    "min_word_count": 750,
    "max_word_count": 900,
    "required_sections": ["In This Article", "The Core Idea", "Next Steps"],
    "cross_link_minimum": 3
  }
}
```

---

## Execution Plan

### Phase 1: Pre-Production (10 min)

```bash
# 1. Verify model
openclaw status  # Should show GPT-4o

# 2. Check source availability
ls content/sources/*.md  # Verify B, C, D, E, G, O, A exist

# 3. Backup current state
git add .
git commit -m "WIP: Before overnight batch production"

# 4. Create batch log
mkdir -p logs
touch logs/overnight-batch-$(date +%Y%m%d).log
```

### Phase 2: Batch Execution (6-8 hours)

**Approach**: Sequential processing with validation

```bash
# For each article in batch-config.json:
for article in batch_articles; do
  # 1. Spawn subagent for single article
  sessions_spawn(
    task="Develop article: $article",
    model="openai/gpt-4o",
    timeout=600  # 10 min per article
  )
  
  # 2. Validate output
  check_word_count($article)
  check_required_sections($article)
  check_sources_cited($article)
  
  # 3. Log result
  echo "$article: $status" >> logs/overnight-batch-$(date +%Y%m%d).log
  
  # 4. If success, git commit
  if [ $status == "success" ]; then
    git add $article
    git commit -m "Add: $article (overnight batch)"
  fi
done
```

### Phase 3: Post-Production (Morning)

```bash
# 1. Pull any remote changes
git pull origin main

# 2. Review batch log
cat logs/overnight-batch-$(date +%Y%m%d).log

# 3. Update dashboard
# Manually update os.heen.al/toolkit for completed articles

# 4. Create summary report
echo "## Overnight Batch Results" > OVERNIGHT-RESULTS.md
echo "- Completed: X articles" >> OVERNIGHT-RESULTS.md
echo "- Failed: Y articles" >> OVERNIGHT-RESULTS.md
echo "- Total words: Z" >> OVERNIGHT-RESULTS.md
```

---

## Monitoring & Fail-Safes

### Progress Tracking

Create `logs/overnight-progress.log`:
```
[2026-02-11 23:00] Started: coordination-transparency.md
[2026-02-11 23:08] Completed: coordination-transparency.md (820 words)
[2026-02-11 23:09] Started: common-concerns.md
[2026-02-11 23:17] Completed: common-concerns.md (795 words)
...
```

### Fail-Safe Rules

1. **If article fails validation**: Log error, skip to next, retry later
2. **If rate limit hit**: Pause 60 seconds, retry
3. **If source missing**: Log blocker, skip article
4. **If context window full**: Summarize and continue

### Emergency Stop

```bash
# Create stop file to halt batch
touch .stop-batch

# Check at start of each iteration
if [ -f .stop-batch ]; then
  echo "Emergency stop triggered"
  exit 0
fi
```

---

## Cost Estimation

### Per Article (GPT-4o)

| Component | Tokens | Cost |
|-----------|--------|------|
| Input (sources + template) | ~3,000 | $0.015 |
| Output (800 word article) | ~1,200 | $0.018 |
| **Total per article** | ~4,200 | **~$0.033** |

### Batch Total (10 articles)

| Item | Cost |
|------|------|
| 10 articles × $0.033 | $0.33 |
| Validation checks | $0.05 |
| Error retries (10%) | $0.04 |
| **Total estimated** | **~$0.42** |

### Cost Optimization

- ✅ Use GPT-4o (not GPT-5.3-codex) — 10x cheaper
- ✅ Process sequentially (not parallel) — avoids rate limits
- ✅ Validate before commit — reduces rework
- ✅ Start with 800-word articles — shorter = cheaper

---

## Quality Assurance

### Automated Checks (Per Article)

```python
def validate_article(path):
  content = read_file(path)
  frontmatter = parse_frontmatter(content)
  
  checks = {
    "word_count": 750 <= count_words(content) <= 900,
    "has_intro": "## In This Article" in content,
    "has_core_idea": "## The Core Idea" in content,
    "has_regen_context": "## Why This Matters for Regens" in content,
    "has_next_steps": "## Next Steps" in content,
    "sources_cited": frontmatter["sources"] is not None,
    "cross_links": count_wiki_links(content) >= 3,
    "status_updated": frontmatter["status"] == "draft"
  }
  
  return all(checks.values()), checks
```

### Morning Review Checklist

- [ ] All articles 750-900 words
- [ ] Proper frontmatter (status, sources, assignee)
- [ ] Cross-links added (3+ per article)
- [ ] No hallucinated claims (sample check)
- [ ] Consistent tone across batch
- [ ] Git commits clean and organized

---

## Launch Command

### Start Overnight Batch

```bash
cd "/root/Zettelkasten/03 Libraries/regen-toolkit"

# 1. Switch to GPT-4o
openclaw session model openai/gpt-4o

# 2. Verify
openclaw status  # Confirm GPT-4o

# 3. Start batch (via cron or manual)
nohup ./scripts/overnight-batch.sh > logs/overnight-$(date +%Y%m%d).log 2>&1 &

# 4. Monitor
tail -f logs/overnight-$(date +%Y%m%d).log
```

### Alternative: Manual Trigger

Activate subagent for batch:
```
"regen-toolkit-builder: Run overnight batch for Tier 1 Foundation articles (9 articles). 
Use GPT-4o. Target: 800 words each. Focus on articles with sources B, C, D, E, G, O, A. 
Sequential processing with validation. Log all results."
```

---

## Expected Output (Morning)

**9 Articles Completed:**
1. ✅ coordination-transparency.md (Track 1.1)
2. ✅ common-concerns.md (Track 1.1)
3. ✅ what-web3-can-cant-do.md (Track 1.1)
4. ✅ relates-to-existing-work.md (Track 1.1)
5. ✅ stories-regens-leap.md (Track 1.1)
6. ✅ what-is-decentralization.md (Track 1.2)
7. ✅ trust-transparency.md (Track 1.2)
8. ✅ what-is-wallet.md (Track 1.5)
9. ✅ setting-up-first-wallet.md (Track 1.5)

**Stats:**
- Total words: ~7,200
- Cost: ~$0.42
- Time: ~6 hours
- Status: All `draft`, ready for review

---

**Ready to launch?** Run the setup commands and start the batch.
