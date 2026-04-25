# @org-os/agents-app

**Paperclip-based Agents Application for org-os**

Dashboard UI for operating AI agents on top of your org-os filesystem.

## Quick Start

### Existing org-os? (Zero-config)

```bash
cd /path/to/your-org-os
npm add @org-os/agents-app
npm run agents:setup    # Auto-detects your org
npm run agents:dev      # Dashboard at http://localhost:3100
```

That's it. No prompts, no config needed.

### New organization?

```bash
npx @org-os/agents-app setup
# Choose "Create new org-os" and follow the wizard
```

## Features

- 🎯 **Organization-First** — Reads from federation.yaml, AGENTS.md, skills/
- 📊 **Dashboard** — Visual org chart, task board, agent monitor
- ⚡ **Real-Time** — WebSocket updates for live agent status
- 🔄 **Sync** — Bidirectional sync with org-os filesystem
- 💾 **Persistent** — Remembers org selection in localStorage
- 🎨 **Dark UI** — Built for operational focus

## Setup Commands

```bash
npm run agents:setup    # Zero-config or interactive setup
npm run agents:validate # Validate org-os structure
npm run agents:dev      # Start dashboard + API server
npm run agents:build    # Build for production
npm run agents:sync     # Manual sync org-os → Paperclip
```

## How It Works

```
federation.yaml ──┐
AGENTS.md ────────┼→ Setup detects org automatically
skills/ ──────────┘
     ↓
  .paperclip/ directory (API config)
     ↓
  Paperclip reads org-os files
     ↓
  React Dashboard (UI)
     ↓
  Team operates agents
```

No database. Single source of truth: **your org-os filesystem**.

## API Endpoints

See `docs/API_REFERENCE.md` for complete endpoint documentation.

Quick reference:
- `GET /api/org` — Organization data from federation.yaml
- `GET /api/agents` — Agents from AGENTS.md
- `GET /api/tasks` — Tasks synced from memory/
- `POST /api/sync` — Manual sync trigger
- `ws://localhost:3100/ws/agents` — Live agent updates

## Loading & Setup

### Setup Process (scripts/setup.mjs)

1. **Detect org-os** in 3 ways:
   - `federation.yaml` present
   - `AGENTS.md` present
   - `.well-known/org.json` present

2. **Zero-config flow** (if org detected):
   - Creates `.paperclip/` if missing
   - Validates federation.yaml
   - No prompts, just "✅ Setup complete!"

3. **Fallback wizard** (if no org):
   - Create new org-os
   - Point to existing org-os
   - Exit gracefully

### Loading Process (src/ui/hooks/useOrgOsLoader.ts)

1. **Parallel load** all at once:
   - Organization metadata
   - Agents list
   - Skills directory
   - Recent tasks

2. **Smart caching**:
   - Saves to localStorage for instant load
   - Background refresh every 30s
   - Falls back to cache if API unavailable

3. **Error handling**:
   - Error boundaries for safe failure
   - Graceful degradation
   - Clear error messages

## Components

- **Dashboard** — Overview with stats
- **OrgChart** — Visual organization structure
- **TaskBoard** — Kanban-style task management
- **AgentMonitor** — Live agent status
- **LoadingState** — Skeleton loaders + error boundaries

## Development

```bash
# Install
pnpm install

# Dev (API on 3100, UI on 5173)
pnpm dev

# Build
pnpm build

# Type check
pnpm tsc --noEmit
```

## Configuration

Edit `.paperclip/config.yaml` for runtime settings:

```yaml
database:
  type: embedded
  path: ./.paperclip/db

server:
  port: 3100
  host: 0.0.0.0

sync:
  interval: 300000  # 5 minutes
```

## Validation

Check your org-os structure:

```bash
npm run agents:validate
```

This checks for:
- federation.yaml present and valid
- AGENTS.md with proper format
- Directory structure
- Common mistakes

Provides actionable fixes for issues.

## Next Steps (P1)

- PostgreSQL integration for persistent storage
- Full task sync with conflict resolution
- Egregore memory integration
- Team testing and feedback

See `docs/IMPLEMENTATION_CHECKLIST.md` for complete P1/P2 roadmap.

## License

MIT
