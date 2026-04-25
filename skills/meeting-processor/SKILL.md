---
name: meeting-processor
version: 1.0.0
description: Process meeting transcripts and Notion meeting notes into structured organizational records, action items, and memory updates for ReFi BCN operations
author: organizational-os
category: operations
metadata:
  openclaw:
    requires:
      env: []
      bins: []
      config: []
---

# Meeting Processor

## What This Is

Processes meeting transcripts (from Granola, Google Meet, Otter.ai, Zoom, or manual notes) into structured meeting notes following Organizational OS conventions. Extracts action items, updates project pages, and writes entries to organizational memory.

For ReFi BCN operations, this skill is also used to process records from Notion `Notes & Documents` into local structured artifacts.

## When to Use

- When you receive a raw meeting transcript or recording
- When someone pastes meeting notes to be formatted and filed
- When asked to "process", "clean up", or "file" meeting notes
- After a meeting: "can you take these notes and process them?"

## When NOT to Use

- For informal chat logs → use knowledge-curator instead
- For async decisions (no meeting) → write directly to project page
- For very short exchanges (< 5 min) → add directly to memory

## ReFi BCN Notion Defaults

When no transcript file is provided, check Notion first:

- Root page: `ReFi Barcelona` (`1386ed08-45cb-80d9-9ab8-e7de7ad5fb16`)
- Notes data source: `Notes & Documents` (`1386ed08-45cb-81ed-b055-000ba5b70a6b`)

Prioritize records tagged or titled like:
- weekly ops sync
- work session
- kickoff / planning

## Usage

### Step 1: Receive Input

Accept any of:
- Raw transcript text (paste or file)
- Pre-formatted notes to standardize
- File path to a transcript file

### Step 2: Extract Structure

From the transcript, identify:
- **Date**: Look for explicit date, or infer from "today", "this morning", etc.
- **Participants**: Speaker labels, names mentioned in greetings, @mentions
- **Key decisions**: "we decided", "agreed to", "confirmed", "going with", "approved", "final call"
- **Action items**: "will [do X]", "[Name] to [do X]", "by [date]", "- [ ]", "next step", "follow up"
- **Main topics**: What were the major themes discussed?
- **Related projects**: Which projects were discussed? (cross-reference `data/projects.yaml`)
- **Next steps / follow-ups**: Anything time-bound or explicitly mentioned as next

### Step 3: Write Meeting Note

Save to: `packages/operations/meetings/YYMMDD [Meeting Title].md`

Use this template:
```markdown
---
categories: [Meetings]
projects:
  - "[[YYMMDD Project Name]]"
date: YYYY-MM-DD
attendees: [Name1, Name2, Name3]
type: sync | council | standup | workshop | retrospective | coordination
---
# Meeting Title

## Key Decisions
- Decision 1 (brief context if needed)
- Decision 2

## Action Items
- [ ] Task description (Owner — due: YYYY-MM-DD if mentioned)
- [ ] Another task (Owner)

## Discussion Summary
Brief synthesis of main topics. Not a transcript — extract insights and context.
Keep to 3-7 bullet points or a short paragraph per major topic.

## Next Steps
- Next meeting date (if set)
- Any follow-ups not captured in action items
```

### Step 4: Update Meeting Registry

Add or update a structured entry in `data/meetings.yaml` with:
- stable local meeting id (e.g., `meeting-refibcn-weekly-ops-YYMMDD`)
- participants using local member IDs when available
- key outcomes (2-5 bullets)
- source refs including Notion page ID or source document

### Step 5: Update Memory

Append to `memory/YYYY-MM-DD.md`:
```markdown
## Meeting: [Title]
- Key decisions: [brief list]
- Action items created: [count]
- Related projects: [names]
- Notion source: [page title / page id if applicable]
```

### Step 6: Update HEARTBEAT.md

For each action item with urgency or a due date, add to `HEARTBEAT.md` under the appropriate section.

### Step 7: Update Project Pages

For any action item linked to a specific project, add `- [ ]` task to the project page in `packages/operations/projects/`.

## Terminology Standards

- Apply org-specific names from `IDENTITY.md` (exact organization name, key terms)
- Apply voice from `SOUL.md` (plain language, no hype)
- Correct obvious misspellings; preserve original meaning
- Common names: check `data/members.yaml` for correct spellings

## Error Handling

| Situation | Action |
|-----------|--------|
| Transcript unclear or truncated | Note gaps explicitly; don't infer |
| Attendees can't be determined | Note "Partial — see transcript" |
| Projects can't be determined | Leave `projects:` empty, add note |
| Date not specified | Use file date or ask operator |

## Notes

- This skill writes to `packages/operations/meetings/` — check that directory exists
- Meeting types: `sync`, `council`, `standup`, `workshop`, `retrospective`, `coordination`, `one-on-one`
- Do not include raw transcript text in the meeting note — synthesize only
- After processing, run schema-generator skill if meetings package is configured for schema generation
