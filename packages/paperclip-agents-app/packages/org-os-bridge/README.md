# @org-os/org-os-bridge

Bridge package for org-os integration with Paperclip. Provides auto-discovery, loading, and bidirectional synchronization of org-os instances.

## Features

- **Auto-discovery**: Find org-os instances by walking the directory tree
- **Federation loading**: Parse `federation.yaml` for organization metadata
- **Agent parsing**: Extract agents from `AGENTS.md`
- **Skill indexing**: Index skills from `skills/` directory
- **File watching**: Monitor for changes in real-time
- **Bidirectional sync**: Pull from and push to org-os instances

## Installation

```bash
npm install @org-os/org-os-bridge
```

## Usage

### Discover Organizations

```typescript
import { OrgOsAdapter } from '@org-os/org-os-bridge';

// Auto-discover org-os instances
const orgs = await OrgOsAdapter.discoverOrganizations('/path/to/search');

// List all organizations with federation.yaml
const discovered = await OrgOsAdapter.listDiscoveredOrganizations();
```

### Load Organization

```typescript
import { OrgOsAdapter } from '@org-os/org-os-bridge';

// Load a specific organization
const org = OrgOsAdapter.loadOrganization('/path/to/org-os');

console.log(org.name);           // "ReFi Barcelona"
console.log(org.agents);         // [{ id, name, runtime, capabilities }]
console.log(org.skills);         // [{ id, name, description, path }]
```

### Sync Service

```typescript
import { OrgOsAdapter, SyncService } from '@org-os/org-os-bridge';

// Load organization
const org = OrgOsAdapter.loadOrganization('/path/to/org-os');

// Create sync service
const sync = new SyncService(org, {
  autoPullAgents: true,
  autoPullSkills: true,
  autoPushTasks: false,
});

// Pull data from org-os
const pullResult = await sync.pull();
console.log(`Pulled ${pullResult.pulled} items`);

// Push data to org-os
const pushResult = await sync.push();
console.log(`Pushed ${pushResult.pushed} items`);

// Full bidirectional sync
const result = await sync.sync();
```

### File Watching

```typescript
import { OrgOsAdapter } from '@org-os/org-os-bridge';

const org = OrgOsAdapter.loadOrganization('/path/to/org-os');

// Watch for changes
const cleanup = OrgOsAdapter.watchOrganization(org.path, (change) => {
  console.log(`File ${change.type}: ${change.path}`);
  // Handle: create, update, delete events
});

// Later: stop watching
cleanup();
```

## API Reference

### OrgOsAdapter

| Method | Description |
|--------|-------------|
| `discoverOrganizations(path?)` | Find all org-os instances starting from path |
| `loadOrganization(path)` | Load single organization from path |
| `loadAgents(path)` | Parse AGENTS.md |
| `indexSkills(path)` | Index skills from skills/ directory |
| `readMemory(path)` | Read memory files for context |
| `watchOrganization(path, callback)` | Watch for file changes |
| `listDiscoveredOrganizations(path?)` | List all discovered orgs with metadata |
| `validateOrgPath(path)` | Validate path for security |

### SyncService

| Method | Description |
|--------|-------------|
| `pull()` | Pull all configured data from org-os |
| `push(items?)` | Push updates back to org-os |
| `sync()` | Full bidirectional sync |
| `getHistory(limit?)` | Get sync history |
| `hasPendingChanges()` | Check for pending changes |

## Type Definitions

### OrgOsOrganization

```typescript
interface OrgOsOrganization {
  name: string;
  identifier: string;
  uri: string;
  path: string;
  agents: OrgOsAgent[];
  skills: OrgOsSkill[];
  config?: OrgOsConfig;
}
```

### OrgOsAgent

```typescript
interface OrgOsAgent {
  id: string;
  name: string;
  runtime: string;
  capabilities: string[];
  budget?: number;
  description?: string;
  skills?: string[];
  channels?: string[];
}
```

### OrgOsSkill

```typescript
interface OrgOsSkill {
  id: string;
  name: string;
  description: string;
  path: string;
  category?: string;
}
```

## Configuration

### SyncService Options

```typescript
interface SyncConfig {
  autoPullAgents: boolean;      // Default: true
  autoPullSkills: boolean;     // Default: true
  autoPushTasks: boolean;      // Default: false
  conflictResolution: 'prefer-local' | 'prefer-remote' | 'manual';
  dryRun: boolean;              // Default: false
  targets?: ('agent' | 'skill' | 'task' | 'memory' | 'config' | 'federation')[];
}
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Test
npm run test

# Lint
npm run lint
```

## License

MIT
