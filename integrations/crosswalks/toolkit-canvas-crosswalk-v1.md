# Toolkit–Canvas Crosswalk v1

Date: 2026-02-19  
Scope: Map regen-toolkit content sections to ecosystem-canvas node types and IDs for deep-linking and data enrichment.

## Notes

- Each row maps: toolkit path (or section), canvas node type, canvas node ID, deep-link URL pattern, sync status.
- Extend as content develops.

## Crosswalk table

| Toolkit section | Canvas node type | Canvas node ID | Deep-link URL pattern | Sync status |
|-----------------|------------------|----------------|------------------------|-------------|
| `3.1-protocol-playbooks/gnosis-safe.md` | InfraNode | safe | `/articles/gnosis-safe` | pending |
| `3.1-protocol-playbooks/hypercerts.md` | ProtocolNode | hypercerts | `/articles/hypercerts` | pending |
| `3.1-protocol-playbooks/gitcoin-grants.md` | ProtocolNode | gitcoin | `/articles/gitcoin-grants` | pending |
| `3.1-protocol-playbooks/giveth.md` | ProtocolNode | giveth | `/articles/giveth` | pending |
| `2.6-funding-mechanisms/gardens-decentralized-funding.md` | ProtocolNode | gardens | `/articles/gardens` | pending |
| `2.8-impact-measurement/*` (Karma GAP) | ProtocolNode | karma-gap | `/articles/karma-gap` | pending |
| `2.8-impact-measurement/*` (Hypercerts) | ProtocolNode | hypercerts | `/articles/hypercerts` | pending |
| `2.7-governance-frameworks/*` | ProtocolNode / InfraNode | varies | `/articles/<slug>` | pending |
| Case studies (Green Goods, local nodes) | ApplicationNode | green-goods, etc. | `/articles/case-studies/<slug>` | pending |

## Canvas node types reference

- **ProtocolNode**: Karma GAP, Hypercerts, Gardens, Octant, Hats, Unlock, RevNets
- **ApplicationNode**: Green Goods, Cookie Jar
- **InfraNode**: Gnosis Safe, EAS attestations, vaults
- **FunderNode**, **ProgramNode**, **ProjectNode**: Fund flows canvas
- **YieldVaultNode**, **StreamNode**, **DomainRoundNode**: Extended fund flows

## Implementation notes

- Deep-link URL pattern depends on Quartz/toolkit site structure.
- When canvas node is clicked, parent can use `ECOSYSTEM_NODE_CLICK` payload to navigate.
- Crosswalk should be updated when new protocol playbooks are added to toolkit.
