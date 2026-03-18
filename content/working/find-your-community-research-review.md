# Fact-Check Report: find-your-community-research

**Date:** 2026-03-11  
**Verifier:** Satya (Fact-Checking Agent)  
**Status:** NEEDS REVISION

---

## Executive Summary

This verification examined the research brief at `/root/workspace/regen-toolkit/content/find-your-community-research.md`. The research contains well-sourced information about finding regenerative communities, but there are several issues that require attention before the article can proceed to REVIEW stage.

---

## Source Verification Results

| Source | URL | Status | Notes |
|--------|-----|--------|-------|
| A | https://greenpill.network/pdf/local-regen-guide.pdf | ✅ VERIFIED | Document exists; search confirms "Local Regen Guide is focused on teaching engaging new ways to regenerate your local community" |
| B | https://www.refidao.com/ | ✅ VERIFIED | Site active; confirmed "A Network Society to Regenerate the Earth" |
| C | https://mirror.xyz/refidao.eth/pzwS5ape0Zqu5mnqKM60eIqMfBtLjQ18UEy1jiDeAHU | ⚠️ PARTIAL | Mirror.xyz returns 402 error; content exists on blog.refidao.com |
| D | http://fieldguide.capitalinstitute.org/finance.html | ✅ VERIFIED | Bendigo Community Bank model documented; $416M reinvested |
| E | https://rsfsocialfinance.org/news/how-regenerative-finance-can-build-community-wealth/ | ✅ VERIFIED | Article active; confirms regenerative finance framework |

---

## Verification by Claim

### ✅ VERIFIED Claims

1. **"ReFi DAO's Local Nodes are prime examples of place-based communities actively driving regeneration through Web3 and localized action"**
   - Evidence: Search confirmed "In 2023, ReFi DAO Global's network of ReFi Local Nodes spread to more than 20 countries"
   - Confidence: HIGH

2. **"The Bendigo Community Bank model in Australia demonstrates a TradFi approach to recirculating capital into local economies"**
   - Evidence: Field Guide confirms model; Bendigo Bank reports $416 million reinvested into local communities
   - Confidence: HIGH

3. **"Greenpill Local Regen Guide emphasizes engaging new ways to regenerate local communities"**
   - Evidence: Search result confirms exact phrasing
   - Confidence: HIGH

4. **"RSF Social Finance discusses regenerative finance and community wealth"**
   - Evidence: Article "How regenerative finance can build community wealth" is active and contains relevant content
   - Confidence: HIGH

---

## Issues Found

### Issue 1: Source URL for Mirror.xyz Needs Updating
**Severity:** Low | **Line:** N/A (Sources section)

The Mirror.xyz URL (Source C) returns a 402 payment required error when fetched directly. The content exists at:
- **Working URL:** https://blog.refidao.com/refi-local-nodes-impact-2023/

**Recommendation:** Update Source C citation to point to blog.refidao.com or verify mirror.xyz works.

---

### Issue 2: Content Gap - No Actual Draft Article
**Severity:** HIGH | **Location:** `/root/workspace/regen-toolkit/content/1-foundations/1.9-refi-landscape/find-your-community.md`

The actual article file at `1-foundations/1.9-refi-landscape/find-your-community.md` contains only:
```
---
title: Finding your community
...
---
# Finding your community

<!-- STATUS: Placeholder -->

[Content to be written]
```

This is a placeholder with no actual content. The research brief exists but no draft has been written from it.

**Recommendation:** The WRITE stage should produce actual article content before this file can be fact-checked.

---

### Issue 3: Pipeline State Path Mismatch
**Severity:** Medium

The pipeline state shows:
- `"path": "key-projects-protocols-research.md"` for slug `find-your-community-research`

This appears to be a configuration error - the actual research file is `find-your-community-research.md`.

---

## Summary Assessment

| Criterion | Result |
|-----------|--------|
| Sources cited are accessible | ⚠️ 4/5 (Mirror.xyz needs update) |
| Claims match cited sources | ✅ PASS |
| Factual accuracy | ✅ PASS |
| Draft article exists | ❌ FAIL (placeholder only) |

---

## Recommendation

**Status: NEEDS REVISION**

The research brief is well-sourced and factually accurate. However:

1. **Update Source C URL** to working mirror or blog.refidao.com
2. **Write the actual draft article** - the placeholder has no content to verify
3. **Fix pipeline state** path mismatch

Once the draft article is written, a new fact-check cycle should be performed on the actual article content.
