# T04 Package Spec

Package: Quartz Multi-Site Publishing Package  
Owner: Luiz (lead)  
Priority: P0  
Date: 2026-03-08

## Scope

### Audience
- Local node/initiative leads setting up new Quartz sites
- Developers maintaining existing ReFi DAO Quartz sites
- Coordination team standardizing cross-site publishing

### Use cases
1. New node wants to launch a website — needs standardized setup from template
2. Existing site needs update/sync with template improvements — needs migration guide
3. Multi-site content change — needs batch deployment workflow

### In-scope artifacts
- Standardized deployment recipe (setup → build → deploy)
- Cross-site configuration parity checklist
- Shared content/frontmatter conventions doc
- Template sync procedure (how to pull upstream changes)
- Multi-site build automation options

### Out-of-scope
- Custom theme development (assume use of refi-template defaults)
- Non-Quartz site setups
- Deep infrastructure/DevOps beyond standard Quartz deploy

## Target implementation
- regen-toolkit/integrations SOP for Quartz publishing
- Reusable scripts/configs in `quartz-refi-template` packages

## Acceptance criteria
- [ ] Reproducible from docs only (anyone can spin up a new site following the recipe)
- [ ] All referenced config files validated against actual repos
- [ ] Metrics defined: setup time, build success rate, sync frequency
- [ ] Tested on at least one new site creation
