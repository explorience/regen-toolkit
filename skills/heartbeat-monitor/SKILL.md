---
name: heartbeat-monitor
version: 1.0.0
description: Monitor organizational health, deadlines, and operational load across HEARTBEAT.md, local data files, and ReFi BCN Notion task/project systems
author: organizational-os
category: infrastructure
metadata:
  openclaw:
    requires:
      env: []
      bins: []
      config: []
---

# Heartbeat Monitor

## What This Is

Proactively monitors `HEARTBEAT.md` and organizational data for tasks requiring attention, system health checks, and upcoming deadlines. The heartbeat keeps the organization from dropping important balls.

For ReFi BCN operations, include Notion workload signals from:
- Projects (`1386ed08-45cb-8185-a48b-000bc4a72d53`)
- Tasks (`1386ed08-45cb-8142-801b-000b2cb5c615`)
- Notes & Documents (`1386ed08-45cb-81ed-b055-000ba5b70a6b`)

## When to Use

- On a schedule (proactive — check `federation.yaml` heartbeat_interval)
- At the start of every session (part of startup sequence in `AGENTS.md`)
- When explicitly asked "what's pending?" or "any alerts?"
- Before a coordination call: "what should we discuss today?"

## Core Functions

### 1. Task Review

Read `HEARTBEAT.md` and categorize pending tasks by urgency:
- **Critical**: Due today or overdue
- **Urgent**: Due within 7 days
- **Upcoming**: Due within 30 days
- **Ongoing**: No deadline, but active

Report format:
```markdown
## Heartbeat Report — YYYY-MM-DD

### Critical (action needed today)
- [x/y] Task description (due: DATE)

### Urgent (this week)
- [ ] Task description (due: DATE)

### Upcoming (next 30 days)
- [ ] Task description (due: DATE)

### System Health
- Agent status: OK
- Last schema generation: [date]
- Last hub sync: [date]
```

### 2. Notion Workload Snapshot (ReFi BCN)

Query Notion project/task status counts and include them in heartbeat reports.

Current known status taxonomies:
- Projects: `Backlog`, `Planning`, `In Progress`, `On-going`, `Paused`, `Done`, `Canceled`
- Tasks: `Backlog`, `Not Started`, `Icebox`, `In Progress`, `Done`, `Archived`
- Notes: `Not Started`, `In Progress`, `Done`, `Archived`

Flag conditions:
- Task load risk if `In Progress` is high for team capacity (default watch threshold: 25+)
- Planning debt if `Backlog + Icebox + Not Started` grows above 15
- Meeting processing lag if Notes `Not Started + In Progress` remains high without local sync updates

### 3. Deadline Detection

Scan `data/funding-opportunities.yaml` for upcoming deadlines:
- If deadline within 30 days → add to `HEARTBEAT.md` if not already there
- If deadline within 7 days → flag as urgent in heartbeat report
- If deadline passed → mark as expired; remove from active list

### 4. System Health Checks

Check:
- `.well-known/` schemas last modified (alert if > 7 days without update when data changed)
- `memory/` has recent entries (alert if > 3 days since last memory write)
- `MEMORY.md` key decisions section has been updated recently
- Notion integration still authenticated (when used in current workflow)

### 5. Action Item Aging

Scan:
- local meeting notes in `packages/operations/meetings/`
- Notion Tasks for stale active items

Flag:
- Items without owner: assignment needed
- Items > 14 days old without status update: review needed
- Blocked chains (`Blocked by`/`Blocking`) with no movement: escalation candidate

### 6. Proactive Alerts

In messaging channels (if configured), surface:
- Upcoming funding deadlines
- Overdue/blocked action items
- Governance/accounting blockers
- Notion workload anomalies requiring replanning

**Only send alerts when proactive mode is enabled in `federation.yaml`.**

## Heartbeat Schedule

Configure in `federation.yaml`:
```yaml
agent:
  proactive: true
  heartbeat_interval: "30m"  # or "1h", "6h", cron expression
```

For OpenClaw: heartbeat runs on this interval; agent checks `HEARTBEAT.md` and sends alerts to configured channels.

For Cursor: heartbeat runs manually at session start.

## Writing to HEARTBEAT.md

When adding new tasks from detected conditions:
```markdown
### [Category]
- [ ] [Task description] — detected [date], due: [DATE if known]
```

When marking tasks complete:
```markdown
### Recently Completed
- [x] [Task description] — completed [date]
```

Archive completed tasks to "Recently Completed" section; remove after 30 days.

## Notes

- Default mode is lightweight (local files), but ReFi BCN mode also checks Notion status snapshots when access is available.
- Run it first to understand what needs attention, then activate other skills.
- The `HEARTBEAT.md` file is the organizational nervous system — keep it current.
- Delete stale tasks ruthlessly: a bloated HEARTBEAT is useless.
