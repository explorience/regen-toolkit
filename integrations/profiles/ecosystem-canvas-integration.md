# Ecosystem Canvas Integration

## What it is

- React Flow visualization library (monorepo) for ecosystem mapping, fund flows, integrations, and embeddable miniapps.
- Located at `03 Libraries/ecosystem-canvas` in the Zettelkasten.
- Packages: `@ecosystem/canvas-core`, `@ecosystem/canvas-react`, `@ecosystem/canvas-integrations`, `@ecosystem/canvas-fund-flows`, `@ecosystem/canvas-data`, `@ecosystem/canvas-widget`.

## Why it matters for regen-toolkit

- Makes protocol relationships and fund flows from toolkit content visually navigable.
- Transforms static playbook/protocol content into interactive, explorable graphs.
- Enables embedding visual maps in websites where toolkit content is referenced (ReFi DAO, Regen Coordination).

## Integration modes

- **Content → Canvas**: Toolkit protocol playbooks (Gnosis Safe, Hypercerts, Gitcoin, Giveth, Gardens, etc.) provide domain knowledge that canvas nodes represent; the canvas visualizes relationships between protocols documented in the toolkit.
- **Canvas → Content**: Clicking a canvas node could deep-link to the corresponding toolkit article (e.g., Gardens node → `content/2-applied/2.6-funding-mechanisms/gardens-decentralized-funding.md`).
- **Taxonomy alignment**: Canvas node types (Protocol, Application, Infrastructure) map to toolkit content types (playbooks, applied guides, case studies).
- **Data enrichment**: Toolkit metadata (maturity assessment scores) can feed into canvas node rendering (e.g., showing maturity level on protocol nodes).

## Sync cadence

- Per ecosystem-canvas release: update integration profile and article backlog.
- When new protocol playbooks are added to toolkit: add corresponding nodes to canvas data adapters.

## Candidate article topics

1. Ecosystem Integration Mapping: Green Goods as a Case Study
2. Visual Knowledge Commons: From Static Docs to Interactive Maps
3. Fund Flow Visualization: Making Regenerative Finance Legible
4. Yield-Based Funding Mechanisms (Octant, Impact Stake, Superfluid)
5. Protocol Interoperability Patterns in ReFi
6. Embeddable Miniapps for Ecosystem Transparency

## Risks/blockers

- Canvas depends on accurate protocol relationship data; toolkit content must stay current.
- Karma GAP API shape and rate limits need ongoing validation for live data.

## Next actions

1. Create content-to-node crosswalk (`integrations/crosswalks/toolkit-canvas-crosswalk-v1.md`).
2. Add ecosystem-canvas to integrations status board.
3. Map toolkit section paths to canvas node IDs for deep-linking.
