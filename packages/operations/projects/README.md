# Projects Package

**Project tracking using IDEA framework (Integrate, Develop, Execute, Archive)**

## Overview

The Projects package implements the IDEA framework for project lifecycle management, providing templates and tools for tracking projects from initial concept through completion and knowledge capture.

## IDEA Framework

Projects progress through four stages:

1. **Integrate (I)**: Gathering context, requirements, and foundation
2. **Develop (D)**: Strategic planning, roadmap creation, and design
3. **Execute (E)**: Implementation, delivery, and real-world impact
4. **Archive (A)**: Reflection, evaluation, and knowledge distillation

## Features

- **IDEA Framework Templates**: Project templates following IDEA stages
- **Milestone Tracking**: Track project milestones
- **Task Management**: Track tasks within projects
- **Budget Integration**: Link projects to budgets
- **Schema Generation**: Automatic generation of EIP-4824 compliant `projects.json`

## Templates

### Project Template

Main project template with IDEA framework structure:

```markdown
---
id: project-id
type: project
name: "Project Name"
status: Integrate  # Integrate, Develop, Execute, Archive
lead: member-id
members:
  - member-id-1
startDate: YYYY-MM-DD
budget:
  allocated: 10000
  currency: USD
---
```

## Usage

1. **Create Project**: Create a new file in `content/projects/` using the template
2. **Fill Foundation**: Complete the Integrate section with context and requirements
3. **Plan**: Move to Develop stage, create milestones and architecture
4. **Execute**: Move to Execute stage, track tasks and progress
5. **Archive**: Move to Archive stage, document learnings and outcomes

## Task Format

Tasks use a specific format for automatic extraction:

```markdown
- [ ] Task description (@assignee) #task-id
```

- `@assignee`: Member ID of person assigned
- `#task-id`: Unique task ID (optional, auto-generated if missing)

## Milestone Format

Milestones use a specific format:

```markdown
- [ ] Milestone title (due: YYYY-MM-DD) #milestone-id
```

- `due: YYYY-MM-DD`: Due date
- `#milestone-id`: Unique milestone ID (optional, auto-generated if missing)

## Status Tracking

Projects have four statuses corresponding to IDEA stages:

- **Integrate**: Foundation gathering phase
- **Develop**: Planning and design phase
- **Execute**: Implementation phase
- **Archive**: Completed and archived

## Schema Generation

The package includes integration with schema generation that:

1. Reads project markdown files from `content/projects/`
2. Reads structured data from `data/projects.yaml`
3. Extracts tasks and milestones from content
4. Generates `projects.json` schema in `.well-known/` directory

## Integration

- **Meetings Package**: Projects can reference related meetings
- **Finances Package**: Projects can have budgets
- **Proposals**: Projects can reference related proposals
- **Task Manager Webapp**: Project tasks appear in task manager

## Related Documentation

- Framework: [`../../../../organizational-os/packages/framework/docs/03-operational-patterns/project-tracking.md`](../../../../organizational-os/packages/framework/docs/03-operational-patterns/project-tracking.md)
- Schema: [`../../../../organizational-os/packages/framework/schemas/projects.json-ld`](../../../../organizational-os/packages/framework/schemas/projects.json-ld)
- IDEA Framework: [`.cursor/rules/idea_planning.mdc`](../../../../.cursor/rules/idea_planning.mdc)
