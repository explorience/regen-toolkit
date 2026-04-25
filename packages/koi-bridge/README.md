# KOI Bridge for Organizational OS

**Status:** 🟡 Skeleton Ready, Needs Testing  
**Package:** `packages/koi-bridge/`  
**Source:** BlockScience/Metagov/RMIT KOI-net  
**Type:** Distributed Knowledge Graph

---

## Overview

Standalone KOI integration for org-os — connects to distributed knowledge networks.

---

## Quick Start

```bash
cd packages/koi-bridge
npm install
npm run build

# Setup (requires KOI coordinator URL)
npx koi-bridge setup --coordinator https://koi.regen.network/koi-net

# Sync with network
npx koi-bridge sync

# Query federated knowledge
npx koi-bridge query "regenerative agriculture"
```

---

## Architecture

```
Git Repo ←→ KOI Bridge ←→ KOI Coordinator ←→ Other Nodes
   ↓           ↓                ↓                  ↓
knowledge/  Events        Routing Table      Git Repos
```

---

## Implementation Status

| Module | Status | Lines |
|--------|--------|-------|
| `bridge.ts` | ✅ HTTP client | ~150 |
| `rid.ts` | ✅ RID handling | ~90 |
| `events.ts` | ✅ Event system | ~120 |
| `git-sync.ts` | ✅ Git hooks | ~180 |
| `index.ts` | ✅ Main class | ~80 |
| `cli.ts` | ✅ CLI | ~70 |

**Total:** ~700 lines TypeScript

---

## Next Steps

1. **Configure coordinator URL** in `federation.yaml`
2. **Test against real KOI network**
3. **Implement missing CLI commands**
4. **Add test suite**

---

*KOI bridge skeleton ready — needs coordinator connection for full operation*
