# Paperclip Agents App for org-os

**Paperclip as the Agents Application of org-os** - Auto-discovers organizations, loads agents, indexes skills, and provides a coordination dashboard.

## Quick Start

### Setup (First Time)
```bash
npm install @org-os/paperclip-agents-app
npm run setup
```

**What it does:**
- ✅ Detects federation.yaml (organization)
- ✅ Parses AGENTS.md (agent definitions)
- ✅ Indexes skills/ (available capabilities)
- ✅ Reads memory/ (operational context)
- ✅ Creates .paperclip/ config
- ✅ Ready to run!

### Start Server
```bash
npm run dev
```

Opens **http://localhost:3100** with:
- Paperclip dashboard
- All agents visible
- All skills indexed
- Real-time coordination

## Zero-Config Recognition

Paperclip automatically recognizes:

```
federation.yaml         ← Organization metadata
AGENTS.md              ← Agent definitions (parsed automatically)
skills/                ← Skills indexed automatically
memory/                ← Recent decisions loaded for context
.well-known/org.json   ← Organization identity
```

**No configuration needed.** Just install and run `npm run setup`.

## Features

- 🎯 Auto-discover org-os instances
- 🤖 Parse agents from AGENTS.md
- 🎨 Index skills from skills/ directory
- 📝 Read organizational memory
- 💼 Full Paperclip dashboard
- 🔄 Bidirectional sync (org-os ↔ Paperclip)
- 📊 Cost tracking per agent
- ⚙️ Plugin management
- 🔐 Role-based access control

## Architecture

```
refi-bcn-os/
├── federation.yaml      ← org-os instance
├── AGENTS.md
├── skills/
└── memory/

    ↓ (auto-discovered)

@org-os/paperclip-agents-app
├── org-os bridge (reads everything)
├── Fastify server (API + dashboard)
├── PostgreSQL database (state)
└── Plugin system (native Paperclip)
```

## API

```bash
# Get organization
curl http://localhost:3100/api/org

# List agents
curl http://localhost:3100/api/agents

# List skills
curl http://localhost:3100/api/skills

# Health check
curl http://localhost:3100/health
```

## Configuration

Edit `.paperclip/config.yaml` after setup to customize:
- Database connection
- Server port/host
- Sync behavior
- Plugin settings

## Multi-Org Support

Works for any org-os instance:
```bash
cd refi-bcn-os && npm run setup && npm run dev
cd refi-dao-os && npm run setup && npm run dev
cd regen-coordination-os && npm run setup && npm run dev
```

Each has its own isolated Paperclip instance.

## Production

For production deployments:
```bash
# Build
npm run build

# Run
npm run start

# With PostgreSQL
docker-compose up -d postgres
npm run start
```

## License

MIT
