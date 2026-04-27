# Source Packet 06: Canvas Visualization

Date: 2026-02-19  
Source: `03 Libraries/ecosystem-canvas`  
Purpose: Extracted points from ecosystem-canvas for article production.

---

## Extracted points

1. **How React Flow is used for ecosystem mapping**
   - Canvas uses @xyflow/react with custom node/edge types.
   - Two main views: Integrations (protocol relationships) and Fund Flows (funder → program → project).
   - Expand/collapse on node click reveals sub-relationships (e.g., Karma GAP → EAS, Octant → DAI/ETH vaults).

2. **Integration patterns between protocols (Green Goods as hub)**
   - Green Goods integrates with: Karma GAP, Hypercerts, Gardens, Octant, Hats, Cookie Jar, Unlock, RevNets.
   - Gardens and Octant both integrate with Gnosis Safe.
   - Karma GAP attestations flow to Hypercerts for impact certificates.

3. **Fund flow visualization design patterns**
   - Multi-level: funders (Artisan, Octant, Impact Stake, Bread Co-op) → programs/rounds (Gardens, domain rounds) → projects → deliverables.
   - Yield vaults (Octant DAI/ETH), streams (Superfluid), domain rounds (waste, agroforestry).
   - Impact Stake 3-way split: ReFi DAO, Greenpill, Bloom.

4. **Embeddable miniapp architecture for knowledge commons**
   - PostMessage API for iframe embedding in non-React sites.
   - Events: ECOSYSTEM_READY, ECOSYSTEM_NODE_CLICK.
   - Commands: ECOSYSTEM_SET_THEME.
   - Embed URLs: /embed/integrations, /embed/fund-flows.

5. **Deep-linking between visual and textual knowledge**
   - Canvas node click can trigger navigation to toolkit article.
   - Crosswalk maps node IDs to toolkit paths (see `toolkit-canvas-crosswalk-v1.md`).

---

## Article candidates (from this packet)

| Article | Target folder | Priority |
|---------|---------------|----------|
| Ecosystem Integration Mapping: Green Goods as a Case Study | `content/3-playbooks/3.3-case-studies/` | tier-1 |
| Fund Flow Visualization: Making Regenerative Finance Legible | `content/2-applied/2.6-funding-mechanisms/` | tier-1 |
| Yield-Based Funding Mechanisms (Octant, Impact Stake, Superfluid) | `content/2-applied/2.6-funding-mechanisms/` | tier-1 |
| Visual Knowledge Commons: From Static Docs to Interactive Maps | `content/2-applied/2.14-practical-action-planning/` | tier-2 |
| Protocol Interoperability Patterns in ReFi | `content/3-playbooks/3.2-implementation-patterns/` | tier-2 |
| Embeddable Miniapps for Ecosystem Transparency | `content/2-applied/2.10-marketing-outreach/` | tier-3 |
