# KOI/OPAL Integration for Organizational OS

**Version:** 1.0.0  
**Date:** 2026-03-21  
**Status:** Active Implementation  
**Purpose:** Bridge AI-powered knowledge gardens (OPAL) with distributed knowledge graphs (KOI)

---

## Overview

This integration layer connects two complementary knowledge systems:

| System | Type | Role | Strength |
|--------|------|------|----------|
| **OPAL** | AI Librarian | Organization-level knowledge gardens | AI extraction, human-in-the-loop |
| **KOI** | Protocol | Network-scale knowledge graphs | Distributed federation, RID-based |

Together they enable **cosmo-local knowledge**: Local AI-powered gardens that federate into global knowledge networks.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Organizational OS Instance                                    │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │  OPAL Adapter       │    │  KOI Bridge         │             │
│  │  (TypeScript)       │◄──►│  (TypeScript)       │             │
│  │                     │    │                     │             │
│  │  /process meetings   │    │  RID generation     │             │
│  │  /review entities    │◄──►│  Event broadcast    │             │
│  │  /ask questions      │    │  State sync         │             │
│  └──────────┬──────────┘    └──────────┬──────────┘             │
│             │                          │                       │
│             └──────────────┬───────────┘                       │
│                            │                                  │
│                   ┌────────▼────────┐                         │
│                   │  Unified API    │                         │
│                   │  (knowledge-api)│                         │
│                   └────────┬────────┘                         │
└────────────────────────────┼──────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│   Local OPAL    │  │  KOI Network │  │  Org OS      │
│   Instance      │  │  Coordinator │  │  Knowledge/  │
│                 │  │              │  │  Data/*.yaml │
│  Markdown + AI  │  │  Python/RIDs │  │  Git-based   │
└─────────────────┘  └──────────────┘  └──────────────┘
```

---

## Integration Points

### 1. Knowledge Flow: OPAL → KOI

When OPAL extracts entities from meetings/documents:

```javascript
// OPAL extracts: "Sarah mentioned Participatory Budgeting"
const extraction = {
  person: "Sarah Chen",
  pattern: "Participatory Budgeting",
  organization: "Community Council"
};

// Convert to KOI RID
const rid = generateRID('pattern', 'participatory-budgeting', {
  source: 'opal-extraction',
  timestamp: '2026-03-21T10:00:00Z',
  content_hash: sha256(extraction)
});

// Broadcast to KOI network
koiBridge.broadcast({
  rid,
  event_type: 'NEW',
  manifest: { timestamp, sha256_hash },
  contents: extraction
});
```

### 2. Knowledge Flow: KOI → OPAL

When KOI network has relevant knowledge:

```javascript
// Query KOI for related patterns
const related = await koiBridge.query({
  type: 'pattern',
  related_to: 'participatory-budgeting',
  network_scope: 'federated'
});

// Ingest into OPAL for local context
opalAdapter.ingest({
  source: 'koi-network',
  entities: related,
  context: 'Cross-organizational patterns'
});
```

### 3. Org OS Data Bridge

Connect org-os data registries to both systems:

```yaml
# data/meetings.yaml → OPAL ingestion
meetings:
  - id: "governance-call-2026-03-21"
    transcript: "content/meetings/2026-03-21.md"
    opal_status: "pending_processing"
    koi_rid: "rid:koinet:meeting:regen-coord:2026-03-21"

# OPAL processes → Extracts entities → KOI broadcasts
# KOI syncs → Enriches local knowledge
```

---

## File Structure

```
packages/
├── egregore-core/           # Git-based AI memory (already integrated)
│
└── koi-opal-bridge/         # NEW: Integration layer
    ├── README.md            # This file
    ├── package.json         # NPM manifest
    ├── tsconfig.json        # TypeScript config
    │
    ├── src/
    │   ├── index.ts         # Main exports
    │   │
    │   ├── opal/            # OPAL integration
    │   │   ├── adapter.ts   # OPAL command wrapper
    │   │   ├── ingest.ts    # Ingest org-os data to OPAL
    │   │   └── extract.ts   # Extract entities for KOI
    │   │
    │   ├── koi/             # KOI integration
    │   │   ├── bridge.ts    # KOI-net HTTP client
    │   │   ├── rid.ts       # RID generation/validation
    │   │   └── events.ts    # Event broadcast/listen
    │   │
    │   └── unified/         # Unified API
    │       ├── knowledge-api.ts    # High-level API
    │       ├── entity-mapper.ts    # Cross-system entity mapping
    │       └── sync-orchestrator.ts # Bidirectional sync
    │
    ├── scripts/
    │   ├── setup-opal.ts    # Initialize OPAL in org-os
    │   ├── setup-koi.ts     # Connect to KOI network
    │   └── sync-loop.ts     # Continuous sync daemon
    │
    └── templates/
        ├── opal-config.yaml # OPAL configuration template
        └── koi-config.yaml  # KOI node configuration
```

---

## Setup Instructions

### Prerequisites

```bash
# 1. Org OS with knowledge commons enabled
# See: docs/SETUP-PATHS.md (Egregore-assisted or Hybrid path)

# 2. OPAL installed
# Already cloned to: 03 Libraries/opal
cd /root/Zettelkasten/03\ Libraries/opal
npm install

# 3. KOI network access
# Use existing koi-net-integration or connect to coordinator
```

### Installation

```bash
# Navigate to org-os instance
cd /root/Zettelkasten/03\ Libraries/org-os

# Install bridge package (when published)
npm install @org-os/koi-opal-bridge

# Or link from source
npm link ../packages/koi-opal-bridge
```

### Configuration

Add to `federation.yaml`:

```yaml
knowledge-commons:
  enabled: true
  
  # KOI/OPAL Integration
  koi-opal-bridge:
    enabled: true
    
    opal:
      enabled: true
      path: "../opal"  # Relative to org-os root
      profile: "regen"  # Use Regen template
      
    koi:
      enabled: true
      coordinator_url: "https://koi.regen.network/koi-net"
      node_type: "partial"  # partial or full
      
    sync:
      auto_process: true    # Auto-run /process on new content
      bidirectional: true     # OPAL ↔ KOI ↔ Org OS
      schedule: "*/15 * * * *"  # Every 15 minutes
```

---

## Usage

### Command-Line Interface

```bash
# Setup OPAL in current org-os instance
npx koi-opal setup --opal-path ../opal --template regen

# Process pending content through OPAL
npx koi-opal opal process

# Review extracted entities (human-in-the-loop)
npx koi-opal opal review

# Sync to KOI network
npx koi-opal koi sync

# Unified query across both systems
npx koi-opal ask "What governance patterns do we use?"

# Status check
npx koi-opal status
```

### Programmatic API

```typescript
import { KoiOpalBridge } from '@org-os/koi-opal-bridge';

const bridge = new KoiOpalBridge({
  orgOsPath: '/root/Zettelkasten/03 Libraries/org-os',
  opalPath: '/root/Zettelkasten/03 Libraries/opal',
  koiCoordinator: 'https://koi.regen.network/koi-net'
});

// Process meeting through OPAL
await bridge.opal.process('content/meetings/2026-03-21.md');

// Review and approve
const pending = await bridge.opal.getPending();
for (const entity of pending) {
  console.log(`Proposed: ${entity.name} (${entity.type})`);
  // Human approves/rejects
}

// Sync to KOI
await bridge.koi.sync();

// Unified search
const results = await bridge.unified.search({
  query: 'participatory budgeting',
  sources: ['opal', 'koi', 'orgos'],
  include_related: true
});
```

---

## Workflows

### Workflow 1: Meeting Knowledge Capture

```
Meeting ends
  ↓
[Org OS] Save transcript to content/meetings/YYYY-MM-DD.md
  ↓
[OPAL] /process extracts entities (people, patterns, decisions)
  ↓
[OPAL] /review human approves entities
  ↓
[KOI] Broadcast approved entities as RIDs to network
  ↓
[KOI] Other nodes receive → enrich their knowledge
  ↓
[Org OS] Update data/meetings.yaml with koi_rid references
```

### Workflow 2: Cross-Organizational Research

```
Researcher in ReFi BCN asks:
"What funding models work for bioregional projects?"
  ↓
[Unified API] Query across:
  - Local OPAL (ReFi BCN's knowledge)
  - KOI network (patterns from other nodes)
  - Org OS data (funding-opportunities.yaml)
  ↓
[KOI] Returns patterns from ReFi DAO, Regen Coordination nodes
  ↓
[OPAL] Ingests patterns with local context
  ↓
[Researcher] Gets synthesized answer with citations
```

### Workflow 3: Federation Governance

```
ReFi DAO proposes new governance pattern
  ↓
[Org OS] data/governance.yaml updated
  ↓
[OPAL] /process extracts pattern details
  ↓
[OPAL] /review by ReFi DAO council
  ↓
[KOI] Broadcast NEW event to federation
  ↓
[ReFi BCN] Receives → local OPAL ingests
[Regen Coord] Receives → aggregates to hub knowledge
  ↓
Cross-node notification via Telegram/GitHub
```

---

## Entity Mapping

### OPAL Entities → KOI RIDs

| OPAL Entity | KOI RID Type | Example RID |
|-------------|--------------|-------------|
| Person | `rid:orgos:person` | `rid:orgos:person:sarah-chen` |
| Pattern | `rid:orgos:pattern` | `rid:orgos:pattern:participatory-budgeting` |
| Organization | `rid:orgos:org` | `rid:orgos:org:community-council` |
| Meeting | `rid:orgos:meeting` | `rid:orgos:meeting:regen-coord:2026-03-21` |
| Project | `rid:orgos:project` | `rid:orgos:project:regenerant-catalunya` |
| Decision | `rid:orgos:decision` | `rid:orgos:decision:regen-coord:42` |

### Org OS Data → OPAL/KOI

| Org OS File | OPAL Ingest | KOI Broadcast |
|-------------|-------------|---------------|
| `data/members.yaml` | People entities | Member RIDs |
| `data/projects.yaml` | Project entities | Project RIDs |
| `data/meetings.yaml` | Meeting + extracted entities | Meeting RIDs + extracted |
| `content/meetings/*.md` | Full text + entities | Meeting RID |
| `docs/*.md` | Concepts + references | Document RIDs |

---

## Integration with Regen Agency

Regen Agency specifies knowledge gardens as the foundation for Agent Dojo training. This integration enables:

1. **Knowledge Gardens** → OPAL provides AI-powered knowledge management
2. **Network Coordination** → KOI provides cross-organizational knowledge sharing
3. **Agent Training** → Well-maintained gardens (via OPAL/KOI) train better agents
4. **Federation** → KOI enables cosmo-local knowledge (local gardens + global network)

### CopyFair Mechanism Integration

Both OPAL and KOI support attribution tracking:
- OPAL: Git history + extraction provenance
- KOI: RID-based attribution, consent-based sharing

Together enable CopyFair: contributions tracked, attribution preserved, value flows to contributors.

---

## Development

### Running Locally

```bash
# 1. Start KOI coordinator (if testing locally)
cd ../koi-net-integration/services
docker-compose up

# 2. Run bridge in dev mode
cd packages/koi-opal-bridge
npm run dev

# 3. Test with org-os instance
cd ../../../org-os
npm link ../org-os/packages/koi-opal-bridge
npx koi-opal status
```

### Testing

```bash
# Unit tests
npm test

# Integration tests (requires KOI coordinator)
npm run test:integration

# Test specific workflow
npm run test:workflow meeting-capture
```

---

## Troubleshooting

### "OPAL commands not found"
- Check: Is OPAL installed? `ls ../opal`
- Check: Did you run `npm install` in opal directory?
- Fix: `cd ../opal && npm install`

### "KOI connection failed"
- Check: Is coordinator URL correct in federation.yaml?
- Check: Is KOI coordinator accessible? `curl https://koi.regen.network/koi-net/status`
- Fix: Update coordinator_url or start local coordinator

### "Sync not working"
- Check: Are both OPAL and KOI enabled in federation.yaml?
- Check: `npx koi-opal status` for component health
- Fix: Run `npx koi-opal setup` to reconfigure

### "Entities not appearing in KOI"
- Check: Did you `/review` and approve in OPAL?
- Check: Are RIDs being generated? `npx koi-opal koi debug`
- Fix: Manual sync with `npx koi-opal koi sync --force`

---

## Roadmap

### Phase 1: Foundation (Complete)
- ✅ OPAL cloned and documented
- ✅ KOI bridge analyzed
- ✅ Architecture designed
- ✅ This specification written

### Phase 2: Core Implementation (In Progress)
- 🔄 TypeScript bridge implementation
- 🔄 Unified API development
- 🔄 Org OS data adapter

### Phase 3: Integration (Pending)
- ⏳ GitHub Actions for auto-sync
- ⏳ Agent Dojo training pipeline
- ⏳ Federation governance integration

### Phase 4: Scale (Future)
- ⏳ Multi-node KOI network
- ⏳ Cross-instance OPAL federation
- ⏳ CopyFair value tracking

---

## References

- **OPAL Repository:** `/root/Zettelkasten/03 Libraries/opal`
- **KOI-net:** `/root/Zettelkasten/03 Libraries/koi-net`
- **KOI-net Integration:** `/root/Zettelkasten/03 Libraries/koi-net-integration`
- **Regen Agency:** `/root/Zettelkasten/260101 Regen Coordination/260321 Regen Agency.md`
- **Org OS Setup Paths:** `docs/SETUP-PATHS.md`

---

*Integrated 2026-03-21 — Bridging AI knowledge gardens with distributed knowledge graphs*
