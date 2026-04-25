# Meetings Package

**Meeting management, notes, and action item tracking**

## Overview

The Meetings package provides templates and tools for managing organizational meetings, tracking decisions, and following up on action items.

## Features

- **Meeting Templates**: Standard templates for different meeting types
- **Action Item Tracking**: Extract and track action items from meetings
- **Decision Logging**: Document decisions made during meetings
- **Schema Generation**: Automatic generation of EIP-4824 compliant `meetings.json`

## Templates

### Meeting Template

Standard meeting template for regular team meetings:

```markdown
---
id: meeting-YYYYMMDD-HHMM
type: meeting
title: "Meeting Title"
date: YYYY-MM-DDTHH:MM:00Z
participants:
  - member-id-1
status: planned
---
```

### Standup Template

Quick daily standup template:

```markdown
---
id: standup-YYYYMMDD
type: standup
title: "Daily Standup - YYYY-MM-DD"
date: YYYY-MM-DDTHH:MM:00Z
---
```

### Retrospective Template

Retrospective template for team retrospectives:

```markdown
---
id: retro-YYYYMMDD
type: retrospective
title: "Retrospective - YYYY-MM-DD"
date: YYYY-MM-DDTHH:MM:00Z
---
```

## Usage

1. **Create Meeting Notes**: Create a new file in `content/meetings/` using a template
2. **Fill in Details**: Add agenda, notes, decisions, and action items
3. **Generate Schema**: Run `npm run generate:schemas` to update `meetings.json`
4. **Track Action Items**: Action items are automatically extracted and tracked

## Action Item Format

Action items use a specific format for automatic extraction:

```markdown
- [ ] Action item description (@assignee, due: YYYY-MM-DD) #action-id
```

- `@assignee`: Member ID of person assigned
- `due: YYYY-MM-DD`: Due date (optional)
- `#action-id`: Unique action item ID (optional, auto-generated if missing)

## Decision Format

Decisions use a specific format:

```markdown
- [ ] Decision description #decision-id
```

- `#decision-id`: Unique decision ID (optional, auto-generated if missing)

## Schema Generation

The package includes a script that:

1. Reads all meeting markdown files from `content/meetings/`
2. Extracts frontmatter (id, title, date, participants, etc.)
3. Parses action items and decisions from content
4. Generates `meetings.json` schema in `.well-known/` directory

## Integration

- **Projects Package**: Action items can reference projects
- **Proposals**: Decisions can reference proposals
- **Task Manager Webapp**: Action items appear in task manager

## Related Documentation

- Framework: [`../../../../organizational-os/packages/framework/docs/03-operational-patterns/meetings-management.md`](../../../../organizational-os/packages/framework/docs/03-operational-patterns/meetings-management.md)
- Schema: [`../../../../organizational-os/packages/framework/schemas/meetings.json-ld`](../../../../organizational-os/packages/framework/schemas/meetings.json-ld)
