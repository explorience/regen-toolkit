# docs/from-refi-dao/

Mirrored documents from the **refi-dao-os** instance (private repo).
Brought into the public toolkit repo so the toolkit team can read the
KOI integration strategy without needing access to refi-dao-os.

## Contents

| File | Original location | Purpose |
|---|---|---|
| `koi-integration-design.md` | `refi-dao-os/docs/superpowers/specs/2026-04-25-koi-integration-design.md` | Joint design spec covering Phase 1.5 (Quick Wins) + Phase 4 (Sovereign Sensor MVP). The architectural reference. |
| `koi-integration-wave-1-plan.md` | `refi-dao-os/docs/superpowers/plans/2026-04-25-koi-integration-wave-1.md` | Step-by-step Wave 1 execution plan (regen-koi-mcp consumer install + personal-koi-mcp local node + one-pager). |
| `koi-integration-7-phase-plan.md` | `refi-dao-os/docs/agent-plans/koi-integration.md` | Canonical 7-phase strategic plan (the umbrella plan). |
| `koi-integration-research-overview.md` | `refi-dao-os/docs/research/koi-integration-overview.md` | Research index — pointers to deeper KOI protocol/comparison research. |

## Why these are here

The toolkit will eventually be a **KOI consumer** (querying the federation via MCP) and may run a **sovereign KOI node** when refi-dao-os Wave 2 ships and the package is extracted to `org-os/packages/koi/`. These docs are the strategic context for that future integration — read them now so when KOI lands in the toolkit it's not a surprise.

## Provenance

- **Source:** `refi-dao-os` (private repo). Mirrored 2026-04-25.
- **Authority:** refi-dao-os is the canonical owner. If these copies drift from upstream, the upstream wins. Check the original source before quoting these as authoritative.
- **License:** inherits the source repo's license (currently no explicit license file in refi-dao-os; treat as "all rights reserved by the contributors").

## How this affects the toolkit

See `docs/MASTER.md` (master doc) for the toolkit's 8-layer architecture. KOI federation is most relevant to:

- **Layer 1 (Resource Graph)** — KOI as the federation substrate for resource graph entries
- **Layer 8 (Feedback & Evolution)** — KOI bundles as the carrier for the 5-step feedback loop across instances
- **Cross-cutting (Ontology)** — KOI's RID schema (per design spec §2) as the addressing layer

For the toolkit's planned integration steps, see `docs/plans/contributions-pipeline.md` Tier 3 items #10–#11.
