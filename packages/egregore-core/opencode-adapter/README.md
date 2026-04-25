# Egregore Opencode Adapter

**Version:** 1.0.0  
**Status:** Active integration  
**Purpose:** Make egregore compatible with OpenCode (and other `/`-command based AI interfaces)

---

## Background

Egregore was originally designed for Claude Code, which uses different slash command patterns than OpenCode:

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Ask AI | No prefix or `@` | `/ask` |
| Review | `/review` | `/review` |
| Commands | Various `/` commands | Various `/` commands |
| Git integration | Native | Via plugins |

This adapter provides compatibility mapping so egregore works seamlessly across both runtimes.

---

## Command Mapping

### Core Egregore Commands

| Egregore Intent | Claude Code | OpenCode Equivalent |
|-----------------|-------------|---------------------|
| Reflect (capture insights) | `/reflect` | `/ask "Reflect: [your insight]"` + commit |
| Handoff (team notes) | `/handoff` | `/ask "Handoff: [context for team]"` + commit |
| Quest (exploration) | `/quest` | `/ask "Quest: [research topic]"` |
| Ask team | `/ask` | `/ask` (native) |
| Activity | `/activity` | `/ask "Show recent activity"` + git log |
| Save | `/save` | Git commit + push (standard) |

### Implementation

```javascript
// opencode-to-egregore.js
const opencodeCommands = {
  '/reflect': async (args) => {
    // 1. Capture reflection via /ask
    const reflection = await opencode.ask(`Reflect: ${args}`);
    // 2. Stage to egregore memory
    await egregore.stageReflection(reflection);
    // 3. Git commit
    await git.commit('egregore: reflection captured');
  },
  
  '/handoff': async (args) => {
    // 1. Capture handoff via /ask
    const handoff = await opencode.ask(`Handoff: ${args}`);
    // 2. Write to handoffs/YYYY-MM-DD-HHMM.md
    await egregore.writeHandoff(handoff);
    // 3. Git commit + optional push
    await git.commit(`egregore: handoff from ${user}`);
  },
  
  '/quest': async (args) => {
    // Create or continue quest
    const quest = await egregore.createQuest(args);
    // Return quest ID for continuation
    return { questId: quest.id, status: 'active' };
  }
};
```

---

## Installation

### For OpenCode Users

1. **Install egregore-core** (as git submodule or npm package):
```bash
git submodule add https://github.com/Curve-Labs/egregore-core.git packages/egregore-core
cd packages/egregore-core
npm install
```

2. **Install opencode adapter**:
```bash
cd packages/egregore-core/opencode-adapter
npm install  # Install adapter dependencies
```

3. **Configure OpenCode integration**:
Add to your `.opencode/config.json` or equivalent:
```json
{
  "egregore": {
    "enabled": true,
    "adapter": "./packages/egregore-core/opencode-adapter",
    "memoryRepo": "./egregore-memory",
    "commands": {
      "/reflect": "egregore:reflect",
      "/handoff": "egregore:handoff",
      "/quest": "egregore:quest"
    }
  }
}
```

### For Organizational OS Users

If you selected the **egregore** package during `npm run setup`, the adapter is automatically available:

```bash
# The opencode-adapter is included in packages/egregore-core/
# Just ensure your agent runtime is configured correctly in federation.yaml
```

---

## Compatibility Matrix

| Feature | Claude Code | OpenCode | Notes |
|---------|-------------|----------|-------|
| `/reflect` | ✅ Native | ✅ Via adapter | Both capture to Git |
| `/handoff` | ✅ Native | ✅ Via adapter | Both create handoff files |
| `/quest` | ✅ Native | ✅ Via adapter | Quest ID portability |
| `/ask` | ✅ Native | ✅ Native | Direct mapping |
| `/activity` | ✅ Native | ⚠️ Via `/ask` | Git log + dashboard |
| `/save` | ✅ Native | ✅ Git standard | No adapter needed |
| Git persistence | ✅ Native | ✅ Native | Both use Git |
| Knowledge graph | ✅ Via egregore.xyz | ✅ Via egregore.xyz | Dashboard works for both |

---

## Usage Examples

### OpenCode + Egregore Workflow

```bash
# 1. Start a quest (research session)
/ask "Quest: How does quadratic funding work for local communities?"

# 2. Work on the quest...
# ... research, read files, make notes ...

# 3. Capture reflection
/ask "Reflect: Found that small communities struggle with QF due to funding pool size. Need alternative models."
→ Egregore stages: reflections/2026-03-21-QF-research.md
→ Git commits: "egregore: reflection on QF models"

# 4. Handoff to team
/ask "Handoff: Research on QF models incomplete. Key blocker: need data on pool sizes < 10k. Assign to @giulio."
→ Egregore creates: handoffs/2026-03-21-QF-handoff.md
→ Git commits: "egregore: handoff from luiz"

# 5. Check activity
/ask "Show recent egregore activity"
→ Displays: Recent reflections, handoffs, quest status

# 6. Save (standard git)
git add . && git commit -m "egregore: quest progress" && git push
```

### Hybrid: Claude Code + OpenCode Team

Both team members can use egregore:

- **Alice** uses Claude Code → Native `/reflect`, `/handoff`
- **Bob** uses OpenCode → `/ask "Reflect: ..."` via adapter
- **Result**: Same Git repo, shared memory, both perspectives captured

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Claude Code    │     │   Egregore Core  │     │    OpenCode     │
│                 │     │                  │     │                 │
│ /reflect        │────→│                  │←────│ /ask "Reflect:" │
│ /handoff        │────→│  Git-based       │←────│ /ask "Handoff:" │
│ /quest          │────→│  shared memory   │←────│ /ask "Quest:"   │
│ /ask            │────→│                  │←────│ /ask (native)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               ↓
                    ┌─────────────────────┐
                    │   Shared Git Repo   │
                    │  (egregore-memory)  │
                    └─────────────────────┘
```

---

## Configuration Reference

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `EGREGORE_MEMORY_REPO` | Path to git memory repo | `./egregore-memory` |
| `EGREGORE_USER` | Username for handoffs | Git config user.name |
| `EGREGORE_ADAPTER_DEBUG` | Enable debug logging | `false` |

### Adapter Options

```javascript
// opencode-adapter/config.js
module.exports = {
  // Command prefixes (customize if needed)
  prefixes: {
    reflect: 'Reflect:',
    handoff: 'Handoff:',
    quest: 'Quest:'
  },
  
  // Auto-commit settings
  autoCommit: true,
  commitPrefix: 'egregore:',
  
  // Handoff formatting
  handoffTemplate: './templates/handoff.md',
  
  // Integration with org-os
  orgOsPath: '../../..'  // Relative to adapter
};
```

---

## Troubleshooting

### "Reflect not capturing"
- Check: Is `EGREGORE_MEMORY_REPO` set correctly?
- Check: Does the memory repo exist? (`git init` if needed)
- Check: Are auto-commits enabled in config?

### "Handoffs not showing in activity"
- Handoffs are committed to Git, not instantly broadcast
- Run `/ask "Show recent commits"` to see Git activity
- Dashboard sync happens on push to shared remote

### "Quest ID not recognized"
- Quest IDs are portable across Claude Code and OpenCode
- Ensure both users point to the same `EGREGORE_MEMORY_REPO`
- Check: `ls quests/` in the memory repo

---

## Future Enhancements

- [ ] Native `/reflect`, `/handoff` commands in OpenCode (requires upstream support)
- [ ] Real-time sync via WebSocket (alternative to Git polling)
- [ ] Plugin marketplace for OpenCode integration
- [ ] Mobile companion for quest continuity

---

## References

- **Egregore Core:** [github.com/Curve-Labs/egregore-core](https://github.com/Curve-Labs/egregore-core)
- **Service:** [egregore.xyz](https://egregore.xyz)
- **Organizational OS:** See `../../README.md`
- **OpenCode:** Provider documentation for `/`-commands

---

*Integrated 2026-03-21 — Making AI memory portable across runtimes*
