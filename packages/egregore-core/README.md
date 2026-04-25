# Egregore Integration Package

**Status:** IDEA: Integrate  
**Source:** [github.com/Curve-Labs/egregore-core](https://github.com/Curve-Labs/egregore-core)

---

## What is Egregore?

A **shared intelligence layer for Claude Code teams** by Curve Labs:

- Git-based persistent memory across Claude Code sessions
- Async handoffs between team members
- Accumulated knowledge across sessions and people
- No servers/accounts required — everything local via Git

## Key Commands

| Command | Purpose |
|---------|---------|
| `/reflect` | Capture decisions, patterns, insights |
| `/handoff` | Leave notes for others/future self |
| `/quest` | Start/contribute to explorations |
| `/ask` | Ask questions routed to team |
| `/activity` | See team activity |
| `/save` | Commit and push contributions |

## Architecture

- **Memory**: Git-based shared knowledge repo
- **Commands**: Slash commands for common workflows
- **Repos**: Managed repos cloned alongside instance
- **Sessions**: Independent work with knowledge flowing via handoffs

## Integration Pattern

### In org-os (this package)

```bash
# As git submodule (recommended)
git submodule add https://github.com/Curve-Labs/egregore-core.git packages/egregore-core

# Or as npm dependency (future)
npm install @curve-labs/egregore-core
```

### Downstream (refi-bcn-os)

```bash
# Install via org-os federation
git submodule add https://github.com/luizfernandosg/org-os.git packages/org-os

# Egregore becomes available as transitive dependency
# Or install directly:
git submodule add https://github.com/Curve-Labs/egregore-core.git packages/egregore-core
```

## Synergies with Organizational OS

| org-os Feature | Egregore Enhancement |
|----------------|----------------------|
| `memory/YYYY-MM-DD.md` | Persistent across team, not just individual |
| `HEARTBEAT.md` | `/activity` dashboard view |
| `MEMORY.md` | `/reflect` auto-captures to shared repo |
| `AGENTS.md` handoffs | `/handoff` native command |
| Notion sync | Alternative lightweight path (Git-only) |

## Use Cases

### 1. Team Memory (No Notion Required)
- Small teams can use Egregore as lightweight alternative
- All context in Git, no external SaaS dependency
- Works offline, full history

### 2. Agent Federation
- AI agents across different runtimes share state via Git
- `/handoff` between Cursor, Claude Code, OpenClaw sessions
- Knowledge persists across machine restarts

### 3. Async Coordination
- Contributors leave `/handoff` notes for others
- No need for synchronous meetings
- Context carries forward automatically

## Installation

```bash
# 1. Add as submodule
git submodule add https://github.com/Curve-Labs/egregore-core.git packages/egregore-core

# 2. Bootstrap
cd packages/egregore-core
npm install
npx create-egregore@latest --local

# 3. Link to org-os context
echo "egregore-core/" >> .gitignore  # Exclude from main repo
```

## Configuration

### Dual Runtime Support

| Runtime | Installation | Commands | Notes |
|---------|--------------|----------|-------|
| **Claude Code** | Native | `/reflect`, `/handoff`, `/quest` | Zero config |
| **OpenCode** | Adapter included | `/ask "Reflect: ..."` | See `opencode-adapter/` |

### In org-os package.json (optional wrapper)

```json
{
  "name": "@org-os/egregore",
  "version": "1.0.0",
  "scripts": {
    "egregore:setup": "cd packages/egregore-core && npx create-egregore@latest --local",
    "egregore:reflect": "cd packages/egregore-core && npx egregore reflect",
    "egregore:handoff": "cd packages/egregore-core && npx egregore handoff",
    "egregore:adapter-test": "cd packages/egregore-core/opencode-adapter && npm test"
  }
}
```

## Documentation

- **Upstream:** [github.com/Curve-Labs/egregore-core](https://github.com/Curve-Labs/egregore-core)
- **Service:** [egregore.xyz](https://egregore.xyz) (for knowledge graph, dashboard, Telegram)

---

## OpenCode Compatibility

Egregore now works with OpenCode via the included adapter:

```bash
# OpenCode users: use the adapter
cd packages/egregore-core/opencode-adapter
# See README.md for OpenCode-specific setup
```

**Command Mapping:**
- `/ask "Reflect: Your insight"` → Egregore reflection
- `/ask "Handoff: Context"` → Egregore handoff
- `/ask "Quest: Topic"` → Egregore quest

*Integrated 2026-03-21 via org-os package system — Now with dual-runtime support for Claude Code + OpenCode*
