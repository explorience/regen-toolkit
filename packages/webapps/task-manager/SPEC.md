# Task Manager Webapp

## Purpose

Provide a simple, interactive interface for viewing and managing tasks across projects and meetings.

## Features

1. **Dashboard View**: Show all pending tasks from projects and meetings
2. **Filtering**: Filter by:
   - Project
   - Assignee
   - Priority
   - Due date
   - Status
3. **Task Management**: 
   - Mark tasks as complete
   - Update task status
   - Add new tasks (writes to data/projects.yaml)
4. **Integration**: Optional integration with GitHub Issues

## Data Sources

- `.well-known/projects.json` - Project tasks
- `.well-known/meetings.json` - Meeting action items
- GitHub Issues API (optional)

## Technology

- Vanilla JavaScript (no frameworks)
- LocalStorage for offline state
- GitHub API for syncing (optional)
- Uses organizational OS design system

## UI Components

1. **Task List**: Display tasks in a list/grid
2. **Filters**: Sidebar or top bar with filter controls
3. **Task Card**: Individual task display with:
   - Description
   - Assignee
   - Due date
   - Status badge
   - Project/meeting context
   - Action buttons
4. **Add Task Form**: Modal or inline form for adding tasks

## Data Flow

1. Load tasks from `.well-known/projects.json` and `.well-known/meetings.json`
2. Combine and normalize task data
3. Apply filters
4. Display filtered tasks
5. On task update, update LocalStorage
6. Optionally sync to GitHub Issues or data files

## Styling

- Use organizational OS CSS variables
- Responsive design (mobile-friendly)
- Dark/light theme support
- Accessible (WCAG AA)

## Future Enhancements

- Drag-and-drop task reordering
- Task dependencies
- Time tracking
- Notifications for due tasks
- Export to CSV/JSON
