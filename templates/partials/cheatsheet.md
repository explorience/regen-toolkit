## Common operations

| Command | Purpose |
|---|---|
| `npm run initialize` | Open a session (sync + dashboard + plan) |
| `/initialize` (Claude Code / Zed / OpenCode) | Same as above, via slash command |
| `/close` | Wrap up: write memory, commit, push |
| `npm run validate:structure` | Check instance against canonical spec |
| `npm run validate:schemas` | Validate EIP-4824 + identity schemas |
| `npm run analyze:instances` | Cross-instance drift report (framework only) |
| `npm run selftest` | Run full reliability suite |
| `npm run vault:snapshot -- "<reason>"` | Capture working tree to refs/snapshots/ before any risky git op |
| `npm run vault:audit` | Verify no content lost since last snapshot |
| `npm run check:divergence` | Compare instance scripts against framework canonical |
| `/skills` | List skills across workspace + user + plugin sources |
