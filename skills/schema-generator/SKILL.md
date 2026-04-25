---
name: schema-generator
version: 1.0.0
description: Auto-generate EIP-4824 schemas from operational data
author: organizational-os
category: infrastructure
metadata:
  openclaw:
    requires:
      env: []
      bins: ["node"]
      config: []
---

# Schema Generator

## What This Is

Regenerates the EIP-4824 compliant JSON-LD schemas in `.well-known/` from the workspace's operational data (`data/*.yaml`) and package content (`packages/operations/`). Keeps machine-readable organizational identity current with actual data.

## When to Use

- After updating `data/members.yaml` (member changes)
- After updating `data/projects.yaml` (project changes)
- After updating `data/finances.yaml` (financial changes)
- After adding new meeting notes
- On a schedule (daily or weekly)
- When `HEARTBEAT.md` has a "regenerate schemas" task

## When NOT to Use

- Just to check schema content (read `.well-known/*.json` directly)
- If no data has changed

## Usage

Run the generation script:
```bash
node scripts/generate-all-schemas.mjs
```

Or trigger via npm:
```bash
npm run generate:schemas
```

To validate after generation:
```bash
npm run validate:schemas
```

## What Gets Generated

| Source | Generates | Location |
|--------|-----------|----------|
| `IDENTITY.md` + `federation.yaml` | `dao.json` | `.well-known/dao.json` |
| `data/members.yaml` | `members.json` | `.well-known/members.json` |
| `data/projects.yaml` + project markdown | `projects.json` | `.well-known/projects.json` |
| `data/finances.yaml` | `finances.json` | `.well-known/finances.json` |
| `packages/operations/meetings/*.md` | `meetings.json` | `.well-known/meetings.json` |

## Schema Verification

After generation, verify:
1. `dao.json` has correct `daoURI` matching `IDENTITY.md`
2. `members.json` has all active members from `data/members.yaml`
3. `projects.json` reflects current project statuses
4. `.well-known/` is accessible at the deployed URL

## HEARTBEAT Integration

After successful regeneration:
- Note in `memory/YYYY-MM-DD.md`: "Schemas regenerated — [date]"
- If automated, check GitHub Actions ran successfully

## ReFi BCN Implementation Runbook (Operational)

### When data changes (required sequence)

1. Confirm changed sources:
   - `data/*.yaml`
   - `packages/operations/meetings/`
   - `packages/operations/projects/`
2. Run generation + validation:
   ```bash
   npm run generate:schemas
   npm run validate:schemas
   ```
3. Verify critical parity:
   - `.well-known/dao.json` aligns with `IDENTITY.md`
   - `.well-known/members.json` reflects current member scope
   - `.well-known/projects.json` reflects latest project statuses
4. Record run outcome in `memory/YYYY-MM-DD.md` (success/failure + affected files)
5. If failure, open/refresh a blocker in `HEARTBEAT.md` with exact error and owner.

### Quality gate (must pass)
- [ ] Validation succeeded after generation
- [ ] Generated files are included in working tree for commit
- [ ] Any schema drift is documented with corrective action
- [ ] Update summary added to memory log

## Notes

- Schemas follow EIP-4824 standard (see framework docs: `docs/02-standards/eip-4824-integration.md`)
- `dao.json` is the entry point — it references all other schema URIs
- GitHub Actions auto-run this on data changes (see `.github/workflows/generate-schemas.yml`)
- If running manually: make sure to commit generated files to git
