# TOOLS.md — Local Tool Notes

_Skills define how tools work. This file is for your specifics — the setup unique to this node. Never put credentials here — reference where they're stored._

---

## API Endpoints

_(Self-hosted or custom services)_

```markdown
### Safe Transaction Service

- Gnosis Chain: https://safe-transaction-gnosis.gateway.gnosis.io
- Ethereum: https://safe-transaction-mainnet.gnosis.io

### RPC Nodes

- Gnosis Chain: https://rpc.gnosis.gateway.fm
- Ethereum: https://eth.llamarpc.com
```

---

## Communication Channels

_(Channel IDs, group names, bot handles — no tokens here)_

```markdown
### Telegram

- Council group: @[council_group_handle]
- Public group: @[public_group_handle]
- Bot handle: @[bot_username]

### GitHub

- Org: github.com/[org-name]
- Hub: github.com/regen-coordination/hub
```

---

## On-Chain Addresses

_(Quick reference — canonical source is IDENTITY.md)_

```markdown
### Gnosis Safe

- Primary: 0x... (Gnosis Chain, 2-of-3)
- Operational: 0x... (Ethereum mainnet)

### Governance

- Hats Tree: [tree-id]
- Gardens DAO: 0x...
```

---

## Node Infrastructure

_(Where this node runs — no passwords, just references)_

```markdown
### Agent Runtime

- Runtime: openclaw | cursor | none
- Host: depin | vps | local
- Workspace path: /opt/[org]/workspace

### Monitoring

- Uptime check: [URL or note]
```

---

## Notion Integration

_(Configure Notion API for richer dashboard data in `/initialize`)_

```markdown
### Configuration

- API Key env var: NOTION_API_KEY
- Workspace URL: https://notion.so/[workspace-name]

### Database IDs

- Projects: [32-char-database-id]
- Tasks: [32-char-database-id]
- Meetings: [32-char-database-id]
- Members: [32-char-database-id]

### Page URLs

- Dashboard: https://notion.so/[page-id]
- Heartbeat: https://notion.so/[page-id]
```

_Set `NOTION_API_KEY` as an environment variable (never in this file). Database IDs are found in Notion URLs: `notion.so/workspace/[database-id]?v=...`. The `/initialize` command uses these to fetch live data from Notion and merge it with local YAML/markdown files._

---

## Funding Platform Accounts

_(Which platforms we have active presence on)_

```markdown
### Active Platforms

- Artisan: [profile URL]
- Octant: [project URL]
- Superfluid: [campaign URL]
- Karma Gap: [project URL]
```

---

_Skills are shared across deployments. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure._
