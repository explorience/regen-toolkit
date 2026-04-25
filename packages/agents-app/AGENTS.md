# Agents Application for ReFi Barcelona

This is the Paperclip-based agent orchestration layer for ReFi Barcelona.

## Purpose

Replaces the Telegram bot and CLI commands with a visual dashboard for:
- Managing agent tasks and workflows
- Monitoring agent status and costs  
- Coordinating cooperative formation work
- Visualizing the ReFi BCN organization

## Quick Commands

```bash
# Start the dashboard
pnpm agents:dev

# Sync with org-os
pnpm agents:sync

# View agent status
pnpm agents:status
```

## Configuration

See `federation.yaml` for agent settings.

## Structure

- `agents/` — Agent definitions
- `skills/` — Available capabilities
- `memory/` — Egregore memory (synced)

## Dashboard Access

- Local: http://localhost:3100
- Production: https://agents.refibarcelona.org (when deployed)

---

Managed by: ReFi Barcelona Tech Team