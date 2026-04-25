---
description: Close org-os session — summarize, write memory, commit, push
---

You are closing the current org-os session. Read `skills/org-os-init/SKILL.md` Phase 4 for the full close protocol, then execute these steps:

## 1. Summarize

List everything accomplished this session using visual indicators:
- `✓` completed items
- `▸` files updated
- `◆` items still open

Render as a `─── Session Summary ───` panel.

## 2. Write Memory

Append a session entry to `memory/YYYY-MM-DD.md` (today's date). Create the file if it doesn't exist. Format:

```markdown
## Session — [HH:MM]

**Focus:** [What was worked on]

### Key Decisions
- [Decision 1]

### Actions Taken
- [x] [What was done]

### Next
- [ ] [What remains]
```

## 3. Update HEARTBEAT.md

Move completed tasks to "Recently Completed" with today's date. Add any new tasks that emerged.

## 4. Update MEMORY.md

If key decisions were made, append to the Key Decisions section (most recent first).

## 5. Update Plan Queue

If any plan in `docs/plans/` changed status (started, completed, new tasks checked off), update the plan file and `docs/plans/QUEUE.md`.

## 6. Commit

Stage all changed files and commit:

```bash
git add memory/ HEARTBEAT.md MEMORY.md data/ docs/plans/
git commit -m "session: [concise description of what was done]"
```

## 7. Push

```bash
git push
```

If push fails (offline, no remote), note the commit is saved locally.

Render the session summary, confirm the commit and push status.

$ARGUMENTS
