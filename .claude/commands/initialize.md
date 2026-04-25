---
description: Open org-os session — sync, gather state, render dashboard, plan work
---

You are opening a new org-os session. Follow these steps exactly:

## Step 1: Sync

Run this command to pull latest changes (handles embedded repos gracefully):

```bash
TOPLEVEL=$(git rev-parse --show-toplevel 2>/dev/null)
if [ "$TOPLEVEL" = "$(pwd)" ]; then
  git pull --rebase --quiet 2>&1 || echo "sync: no remote or offline — continuing with local state"
else
  echo "sync: embedded repo — skipping pull"
fi
```

## Step 2: Gather State + Render Dashboard

Run the initialize script with markdown output. This produces the complete pre-rendered dashboard:

```bash
node scripts/initialize.mjs --format=markdown
```

If the script fails (missing dependencies, node not found), try `npm install` first, then retry. If it still fails, read the key files manually: `HEARTBEAT.md`, `federation.yaml`, `data/projects.yaml`, `data/funding-opportunities.yaml`, `data/events.yaml`, recent files in `memory/`, and `docs/plans/QUEUE.md`.

## Step 3: Output Dashboard

**Output the script result verbatim.** Do not re-render, reformat, or add sections. The script handles all visual formatting, section visibility, and `dashboard.yaml` configuration.

Check stderr output for any warnings (Notion API errors, parse failures) and mention them briefly if relevant.

## Step 4: Wait for Operator

End with the session prompt (already included in the script output). Wait for the operator to pick what to work on. Then transition to **Phase 2: PLAN** — load context, analyze, and present a tight work plan (5-7 steps max). Then execute.

Read `skills/org-os-init/SKILL.md` for Phases 2-4 (PLAN, EXECUTE, CLOSE) guidance.

$ARGUMENTS
