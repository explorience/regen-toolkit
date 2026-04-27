---
title: "Resources Lift — MASTER.md → data/resources.yaml"
project: regen-toolkit
date: 2026-04-26
status: completed
completed: 2026-04-26
related:
  - docs/plans/contributions-pipeline.md  # promoted from Tier 1 #1
  - docs/LAYERS.md                        # Layer 1 — Resource Graph
methodology:
  - "superpowers:executing-plans"
---

# Plan F — Resources Lift (mechanical extraction)

> **Status: completed 2026-04-26.** 738 entries extracted from `MASTER.md` lines 1089–2668 into `data/resources.yaml` (285 URL-bearing, 453 text-only, 50 domain headings). Pending Brandon's curation pass — flagged in `HEARTBEAT.md`.

> Promoted from `contributions-pipeline.md` Tier 1 #1.

**Goal:** Lift the unstructured resource lists from `docs/MASTER.md` into a structured `data/resources.yaml` so Brandon (Layer 1 owner) has clean material to curate, and so the Encyclopedia / Tracks / etc. can cross-reference resources by id.

**Why now:** Layer 1 (Resource Graph) is the weakest documented layer ("weird mishmash of papers and books and links" — Matt, 2026-04-23). The lifting is mechanical, not curatorial — it doesn't require Brandon's bandwidth, it produces material *for* his bandwidth.

**Strategy:** Pure mechanical extraction. Don't curate, deduplicate, or judge what's in or out — preserve everything that has a discernible title (and optionally a URL) so Brandon's curation pass has the full corpus.

---

## Scope (in MASTER.md)

Lines **1089–2668**. Specifically:

- **§ Resources - Full** (1089–2167) — `## **DOMAIN**` headers with `### **subcategory**` bullets; many entries with URLs, some text-only.
- **§ Resource Graph + Local ReFi link aggregation** (2168–2376) — `# CATEGORY` headers with bullet lists; mostly URL-bearing.
- **§ Full Resource List (raw aggregation)** (2376–2668) — `## DOMAIN` headers with bullet lists; URL-bearing.

Stop at line 2668 (`# Encyclopedia` — different layer).

**Out of scope:** Anything outside lines 1089–2668. Curation, dedupe by title (URL-dedupe is fine), tag-inference beyond simple domain.

---

## Schema for `data/resources.yaml`

```yaml
schema_version: "1.0"
resources:
  - id: <kebab-case slug from title>
    title: <text>
    url: <url or null>
    domain: <most-recent H1 or H2 above the entry>
    subcategory: <most-recent H3 above the entry, or null>
    source_lines: [<start>, <end>]
    notes: <optional descriptive trailing text or sub-bullets>
```

**ID generation:** kebab-case slug from `title`. On collision, append `-2`, `-3`, etc.
**URL normalization:** strip tracking params (`?utm_*`); preserve everything else verbatim.
**Domain attribution:** the most-recent H1 (`# `) or H2 (`## `) heading (excluding `# Resources - Full` and `# Full Resource List` which are super-section labels — use the next-deepest heading instead).

---

## Tasks

### Task 1: Build extraction script

- [ ] **1.1** Write `scripts/lift-resources.mjs` — Node script that reads `docs/MASTER.md`, scans lines 1089–2668, tracks current heading state, parses bullet entries (`* Title` ± `[url](url)` continuation line).
- [ ] **1.2** Emit canonical entries per the schema above.
- [ ] **1.3** Use `js-yaml` to serialize (already in `node_modules` — used by `validate-identity.mjs`).

### Task 2: Run + spot-check

- [ ] **2.1** `node scripts/lift-resources.mjs` — emit `data/resources.yaml`.
- [ ] **2.2** Spot-check: count entries; sample 10 entries across different domains; verify URL extraction; flag obviously broken entries (e.g., empty title, malformed URL).
- [ ] **2.3** Light mechanical cleanup only (no curatorial calls).

### Task 3: Validate

- [ ] **3.1** YAML parse: `node -e "require('js-yaml').load(require('fs').readFileSync('data/resources.yaml','utf8'))"` — exit 0.
- [ ] **3.2** Run `npm run validate:schemas` — expect existing schemas still pass (resources.yaml is new, won't yet have a schema validator).
- [ ] **3.3** Run `npm run dev` smoke (5s) — site still builds.

### Task 4: Cross-link + flag for curation

- [ ] **4.1** Update `docs/LAYERS.md` Layer 1 section: add `data/resources.yaml` to "Source of truth" + add "Initial mechanical lift completed 2026-04-26 — N entries; pending Brandon's curation pass" to Current state.
- [ ] **4.2** Add to `HEARTBEAT.md` "Active Tasks → Resource Graph (Layer 1)": `- [ ] Brandon — curation pass on data/resources.yaml (N entries, mechanically lifted from MASTER.md)`.
- [ ] **4.3** Add to `MEMORY.md` "Recently Completed" or equivalent: dated entry referencing this plan.

### Task 5: Commit + close out

- [ ] **5.1** Commit script + YAML + LAYERS update + HEARTBEAT update + MEMORY in 1–2 cohesive commits.
- [ ] **5.2** Mark plan completed in frontmatter; update toolkit `QUEUE.md` and regen-coord cross-instance table.
- [ ] **5.3** Push.

---

## Acceptance criteria

- [ ] `data/resources.yaml` exists, valid YAML, body > 100 entries (most URL-bearing bullets in 1089–2668)
- [ ] Each entry has at minimum `id`, `title`, `domain`, `source_lines`
- [ ] Most entries have a URL (text-only bullets retained but flagged via missing URL)
- [ ] `docs/LAYERS.md` Layer 1 references `data/resources.yaml`
- [ ] `HEARTBEAT.md` flags the Brandon-curation handoff
- [ ] No site-build regression
- [ ] Existing schema validation still passes

---

## Out of scope

- Curating which resources stay or go (Brandon's call)
- Deduping by title (URL-dedupe is fine; same resource might appear with different framings under different domains)
- Tag inference beyond `domain` + `subcategory` (full tagging is curatorial)
- Generating an EIP-4824 schema for `resources.yaml` (deferred)

---

## Estimated effort

- Script: 1h
- Run + spot-check: 30min
- Cross-linking + commits: 30min
- **Total: ~2h**
