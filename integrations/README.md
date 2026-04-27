# Integrations

Purpose: map and operationalize integrations between the Regen Toolkit and external knowledge repositories/systems.

## What goes here

- Integration profiles (what system, why integrate, how, status)
- Data/content sync plans (manual, semi-automated, automated)
- Crosswalks (taxonomy/tag mappings)
- Article opportunity queues generated from each integration

## Core files

- `INTEGRATIONS-WORKPLAN-260217.md` — execution plan and milestones
- `ARTICLE-BACKLOG-260217.md` — article backlog from integration mapping

## Integration targets (priority-tiered)

### P0 — Active collaboration / high leverage

| System | Local Path / Source | Profile |
|--------|---------------------|---------|
| Bioregional Knowledge Commons | `03 Libraries/bioregionalknowledgecommons` | [bioregionalknowledgecommons-integration](profiles/bioregionalknowledgecommons-integration.md) |
| KOI ecosystem | `03 Libraries/koi-net`, `03 Libraries/koi-net-integration` | [koi-net-integration](profiles/koi-net-integration.md), [koi-net-integration-stack](profiles/koi-net-integration-stack.md) |
| Greenpill Network | `content/sources/` (B, H, I, M, P, S) + external | [greenpill-network-integration](profiles/greenpill-network-integration.md) |
| SuperBenefit Knowledge Garden | `content/sources/` (E, O) + knowledge.superbenefit.org | [superbenefit-integration](profiles/superbenefit-integration.md) |
| OpenCivics / Regen Commons | `content/sources/` (R) + OpenCivics GitHub | [opencivics-regen-commons-integration](profiles/opencivics-regen-commons-integration.md) |
| Regenerant Catalunya | `03 Libraries/Regenerant-Catalunya` | [regenerant-catalunya-integration](profiles/regenerant-catalunya-integration.md) |
| Regen Coordination docs | `03 Libraries/Regen Coordination` | [regen-coordination-integration](profiles/regen-coordination-integration.md) |
| ReFi DAO docs | `03 Libraries/ReFi DAO` | [refi-dao-integration](profiles/refi-dao-integration.md) |
| Local ReFi Toolkit | `03 Libraries/Local-ReFi-Toolkit` | [local-refi-toolkit-integration](profiles/local-refi-toolkit-integration.md) |
| Regen Toolkit Interface | `03 Libraries/regen-toolkit-interface` | [regen-toolkit-interface-integration](profiles/regen-toolkit-interface-integration.md) |
| Ecosystem Canvas | `03 Libraries/ecosystem-canvas` | [ecosystem-canvas-integration](profiles/ecosystem-canvas-integration.md) |

### P1 — Content sources / operational tools

| System | Local Path / Source | Profile |
|--------|---------------------|---------|
| ReFi DAO Blog (Ghost) | blog.refidao.com + `03 Libraries/ReFi-DAO-Website` | [refi-dao-blog-integration](profiles/refi-dao-blog-integration.md) |
| Bloom Network | External (no local repo yet) | [bloom-network-integration](profiles/bloom-network-integration.md) |
| BioFi Project | `content/sources/` (Q) + biofi.earth | [biofi-project-integration](profiles/biofi-project-integration.md) |
| Quartz Publishing Layer | `03 Libraries/quartz-refi-template` | [quartz-publishing-layer-integration](profiles/quartz-publishing-layer-integration.md) |

## Status model

- `planned`
- `mapping`
- `prototype`
- `active`
- `blocked`
