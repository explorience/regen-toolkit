# Architecture

## Overview

The Regen Toolkit is designed as a modular, monorepo-based architecture for coordinating regenerative finance activities.

## Core Principles

1. **Modularity** - Each package is independently deployable
2. **Type Safety** - Full TypeScript strict mode
3. **Agent-Native** - Built for AI agent orchestration
4. **Protocol-Based** - org-os for organization coordination

## Package Structure

```
packages/
├── toolkit-core/     # Core business logic
├── agent-bridge/     # Agent integration layer
└── org-os-adapter/   # org-os protocol implementation
```

## Entry Points

- `src/app/` - Orchestration entry points for agents
- `src/services/` - Toolkit orchestrator, agent coordinator
- `src/integrations/` - External system adapters

## Design Decisions

- CommonJS module output for Node.js compatibility
- Path aliases (`@/*`) for clean imports
- Strict TypeScript configuration
- Minimal runtime dependencies
