---
name: workspace-improver
version: 2.0.0
description: Autonomous improvement loop for org-os workspaces (autoresearch pattern)
triggers:
  - "improve workspace"
  - "autoresearch"
  - "autonomous improvement"
  - "find and fix gaps"
inputs:
  - MASTERPLAN.md (directions and activations)
  - HEARTBEAT.md (current tasks and metrics)
  - data/*.yaml (registries to check)
  - knowledge/ (knowledge coverage)
outputs:
  - Improved data/*.yaml entries
  - New knowledge/ pages
  - Updated HEARTBEAT.md
  - memory/YYYY-MM-DD.md experiment log
dependencies:
  - schema-generator
  - heartbeat-monitor
  - knowledge-curator
  - idea-scout
tier: core
---

# Workspace Improver

## When to Use

Activate for autonomous workspace improvement sessions. This skill implements the **autoresearch pattern** — agents iteratively improve the workspace through scoped experiments with clear metrics.

Activate when:
- Operator says "improve the workspace" or "run autoresearch"
- During scheduled autonomous sessions
- When MASTERPLAN.md activations list improvement areas
- As part of the ongoing learning phase (Phase 3 of bootstrapping)

## The Autoresearch Loop

Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch):

```
MASTERPLAN.md          = program.md     (human directions)
data/*.yaml + skills/  = train.py       (editable surface)
HEARTBEAT.md metrics   = val_bpb        (evaluation criteria)
memory/YYYY-MM-DD.md   = experiment log (results)
```

## Procedure

### Step 1: Read Directions

1. Read `MASTERPLAN.md` — understand current activations and research directions
2. Read `HEARTBEAT.md` — understand active tasks and priorities
3. Read `memory/` (last 3 days) — understand recent work and avoid repetition

### Step 2: Identify Improvement

Scan for improvement opportunities in priority order:

**Priority 1: MASTERPLAN Activations**
- Are there unchecked activations in MASTERPLAN.md?
- Pick the highest-priority one that can be scoped to a single session

**Priority 2: Data Gaps**
- Are there TBD, null, or placeholder values in data/*.yaml?
- Are any registries significantly incomplete?
- Are dates stale (last_updated > 7 days ago)?

**Priority 3: Knowledge Gaps**
- Run `npm run compile:knowledge` to refresh the knowledge extract and compiled pages
- Run `npm run lint:knowledge` — address any hard failures
- Check for domains with coverage: "none" or "partial" in `data/knowledge-manifest.yaml`
- Check for `<!-- LLM-SYNTHESIZE -->` markers — invoke knowledge-curator in Compilation Mode to synthesize
- Are there sources in data/sources.yaml that haven't been processed?
- After changes, run `npm run knowledge` to validate the full pipeline

**Priority 4: Schema Health**
- Does `npm run validate:schemas` pass?
- Are .well-known/ schemas current with data?

**Priority 5: HEARTBEAT Tasks**
- Are there pending tasks that the agent can complete?
- Can stale tasks be resolved or closed?

### Step 3: Measure Before

Record baseline metrics before making changes:

```markdown
## Improvement Attempt: [description]
**Before:**
- Schema validation: [pass/fail]
- HEARTBEAT pending count: [N]
- Knowledge domains coverage: [list with status]
- Data completeness: [percentage of non-null fields]
- Target metric: [specific metric for this improvement]
```

### Step 4: Make Scoped Change

Execute ONE improvement per cycle:

- Process a source into `knowledge/`
- Fill a data gap in `data/*.yaml`
- Create a skill draft in `skills/`
- Surface ideas via `idea-scout`
- Update stale entries with current information
- Resolve a HEARTBEAT task

**Scope constraint:** Each change should be completable in one session and independently reversible.

### Step 5: Evaluate After

Run validation and measure:

```bash
npm run generate:schemas
npm run validate:schemas
```

Record results:
```markdown
**After:**
- Schema validation: [pass/fail]
- HEARTBEAT pending count: [N]
- Knowledge domains coverage: [updated list]
- Data completeness: [updated percentage]
- Target metric: [updated value]
**Delta:** [improvement or regression]
```

### Step 6: Keep or Revert

- If metrics improved or stayed stable: **keep** the change
- If metrics regressed: **revert** and log why
- If unclear: **keep** but flag for human review

### Step 7: Log & Repeat

Write results to `memory/YYYY-MM-DD.md` and update `HEARTBEAT.md`.

If time and context allow, return to Step 2 for another cycle.

## Boundaries

### May Modify (Autonomous)
- `data/*.yaml` — Fill gaps, update stale records, correct errors
- `knowledge/` — Process new content, improve existing pages
- `memory/` — Log everything
- `skills/` — Draft new skill definitions (mark as draft)
- `ideas/` — Surface new ideas from knowledge analysis
- `.well-known/` — Regenerate schemas
- `HEARTBEAT.md` — Update task status, add discovered tasks

### Must NOT Modify (Requires Human)
- `SOUL.md` — Organization identity
- `IDENTITY.md` — Governance infrastructure
- `federation.yaml` — Network relationships
- `MASTERPLAN.md` — Strategic direction
- `package.json` — Dependencies and scripts
- `USER.md` — Operator profile

## Evaluation Metrics

| Metric | How to measure | Good direction |
|--------|---------------|----------------|
| Schema validation | `npm run validate:schemas` | Pass |
| HEARTBEAT pending | Count unchecked `- [ ]` items | Decreasing |
| Knowledge coverage | Domains with "comprehensive" in manifest | Increasing |
| Data freshness | last_updated within 7 days | Increasing |
| Idea pipeline | Active ideas (surfaced through developing) | Growing |
| Data completeness | Non-null required fields / total required fields | Increasing |

## Output Format

### Experiment Log (memory/YYYY-MM-DD.md)

```markdown
## Autoresearch Session [HH:MM]

### Improvement: [title]
**Direction:** [which MASTERPLAN activation or priority this addresses]
**Before:** [metric = value]
**Action:** [what was done]
**After:** [metric = value]
**Result:** Kept / Reverted
**Notes:** [any observations]
```

## Error Handling

- If `npm run validate:schemas` fails after a change, revert immediately
- If unsure whether a change is an improvement, flag in HEARTBEAT.md for human review
- Never make changes faster than you can evaluate them
- If no improvements are found, log "workspace is healthy" and suggest directions for MASTERPLAN.md

## Examples

**Example session:**

```
Cycle 1: Fill data gap
- Found: data/funding-opportunities.yaml has 3 entries with deadline: "TBD"
- Action: Researched current deadlines, updated 2 of 3 (1 genuinely TBD)
- Before: 3 TBD dates | After: 1 TBD date
- Result: Kept ✓

Cycle 2: Process knowledge source
- Found: data/sources.yaml lists "refi-blog" with last_synced: 2026-02-01
- Action: Processed 5 new blog articles into knowledge/regenerative-finance/
- Before: 8 knowledge pages | After: 13 knowledge pages
- Result: Kept ✓

Cycle 3: Resolve HEARTBEAT task
- Found: "Regenerate .well-known schemas after data updates" pending
- Action: Ran npm run generate:schemas
- Before: Schemas stale | After: Schemas current, validation passes
- Result: Kept ✓, marked HEARTBEAT task complete
```
