# Regen Toolkit

A modular toolkit for regenerative finance coordination and agent orchestration.

## Quick Start

```bash
npm install
npm run dev
```

## Structure

```
├── src/           # Source code
│   ├── app/       # Orchestration entry points
│   ├── components/# UI component stubs
│   ├── integrations/# External adapters (GitHub, egregore, org-os)
│   ├── services/  # Agent coordinator, toolkit orchestrator
│   ├── types/    # TypeScript type definitions
│   └── utils/    # Helpers and constants
├── packages/      # Monorepo packages
│   ├── toolkit-core/
│   ├── agent-bridge/
│   └── org-os-adapter/
└── docs/          # Documentation
```

## Development

```bash
npm run build  # Compile TypeScript
npm run test   # Run tests
npm run dev    # Run in development mode
```

## Packages

- **@regen-toolkit/core** - Core logic and types
- **@regen-toolkit/agent-bridge** - Agent integration layer
- **@regen-toolkit/org-os-adapter** - org-os protocol implementation

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Integration Guide](./docs/INTEGRATION.md)
- [Quick Start](./docs/QUICKSTART.md)
- [Roadmap](./docs/ROADMAP.md)
