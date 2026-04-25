/**
 * API Reference
 * 
 * Complete endpoint documentation for org-os Agents App
 */

## Base URL
```
http://localhost:3100/api
```

## Endpoints

### Organization

#### GET /api/org
Returns full organization data from federation.yaml

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "ReFi Barcelona",
    "identifier": "refi-bcn",
    "uri": "https://refibcn.cat/.well-known/org.json",
    "agents": [...],
    "skills": [...],
    "upstream": [...]
  }
}
```

**Status Codes:**
- 200: Success
- 500: Failed to load organization

---

### Agents

#### GET /api/agents
List all agents with runtime status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "refi-bcn-coordinator",
      "name": "ReFi BCN Coordinator",
      "runtime": "openclaw",
      "capabilities": ["coordination", "governance"],
      "budget": 300,
      "status": "idle",
      "lastHeartbeat": "2026-03-29T20:00:00Z"
    }
  ]
}
```

#### GET /api/agents/:id
Get single agent details

**Parameters:**
- `id` (path): Agent ID

**Response:** Single agent object

#### POST /api/agents
Create new agent

**Body:**
```json
{
  "id": "new-agent",
  "name": "New Agent",
  "runtime": "openclaw",
  "capabilities": ["..."],
  "budget": 200
}
```

---

### Tasks

#### GET /api/tasks
List all tasks (synced from org-os)

**Query Parameters:**
- `status` (optional): Filter by status (backlog, in-progress, review, done)
- `agent` (optional): Filter by assigned agent
- `limit` (optional): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-1",
      "title": "Set up cooperative",
      "status": "in-progress",
      "assignedAgents": ["refi-bcn-legal-advisor"],
      "estimatedCost": 150,
      "actualCost": 85,
      "progress": 60,
      "dueDate": "2026-04-15"
    }
  ]
}
```

#### GET /api/tasks/:id
Get single task details

#### POST /api/tasks
Create new task

**Body:**
```json
{
  "title": "New task",
  "description": "...",
  "assignedAgents": ["agent-id"],
  "estimatedCost": 100,
  "dueDate": "2026-04-01",
  "priority": "medium"
}
```

**Response:** Created task object with ID

#### PATCH /api/tasks/:id
Update task (status, assignments, etc.)

**Body:** Partial task object to update

---

### Costs & Budgets

#### GET /api/costs
Cost summary and budget tracking

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2026-03",
    "agents": [
      {
        "id": "agent-1",
        "name": "Agent 1",
        "budget": 300,
        "spent": 245,
        "remaining": 55,
        "percentUsed": 82
      }
    ],
    "total": {
      "budget": 1500,
      "spent": 1205,
      "remaining": 295
    },
    "alerts": [
      {
        "agent": "agent-1",
        "level": "warning",
        "message": "Agent 1 at 82% of monthly budget"
      }
    ]
  }
}
```

#### GET /api/costs/forecast
Forecast spending based on current burn rate

---

### Synchronization

#### POST /api/sync
Manually trigger org-os ↔ Paperclip sync

**Response:**
```json
{
  "success": true,
  "data": {
    "tasksPushed": 5,
    "tasksPulled": 3,
    "conflicts": [],
    "duration": "125ms"
  }
}
```

#### GET /api/sync/status
Get last sync status

---

## WebSocket Events

### Connection
```
ws://localhost:3100/ws/agents
```

**Events:**

```json
{
  "type": "init",
  "message": "Connected to agent stream"
}

{
  "type": "agent-status-update",
  "agentId": "refi-bcn-coordinator",
  "status": "working",
  "currentTask": "task-1",
  "timestamp": "2026-03-29T20:00:00Z"
}

{
  "type": "task-update",
  "taskId": "task-1",
  "status": "in-progress",
  "progress": 75,
  "costSoFar": 85
}

{
  "type": "cost-alert",
  "level": "warning",
  "message": "Agent X at 80% of budget"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common Codes:**
- `ORG_NOT_FOUND` — No organization loaded
- `AGENT_NOT_FOUND` — Agent ID not found
- `TASK_NOT_FOUND` — Task ID not found
- `INVALID_REQUEST` — Bad request body
- `CONFLICT` — Data conflict during sync
- `DATABASE_ERROR` — Database operation failed
- `UNAUTHORIZED` — Request lacks required permissions

---

## Rate Limits

- 100 requests per minute per IP
- 1000 WebSocket messages per minute per connection

---

## Testing

### Quick Test (curl)
```bash
# Get organization
curl http://localhost:3100/api/org

# List agents
curl http://localhost:3100/api/agents

# List tasks
curl http://localhost:3100/api/tasks

# Create task
curl -X POST http://localhost:3100/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","estimatedCost":100}'
```

### WebSocket Test
```bash
# Using websocat or similar
websocat ws://localhost:3100/ws/agents
```
