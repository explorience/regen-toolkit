---
name: register-source
version: 0.2.0
description: Register a knowledge source as a first-class federation peer — create its source-system card (return path, reuse conditions, crediting, currentness), wire the provenance chain, and enforce referencing discipline before any content is ingested from it. Sources are peers, not link pools.
framework: toolkit-framework
agnostic: true
---

# register-source

Every ingestion starts here. Content objects reference their source system;
the card must exist BEFORE the content does.

## Steps

1. **Identify the source system** behind the artifact: the living environment
   (wiki, repo, podcast, forum, newsletter, dataset, convening…) — not the file.
   A PDF someone sent is not the source system; the community that maintains it is.
2. **Draft the card** (`schemas/source-system.yaml` — check the `type` enum):
   required: `title`, `type`, `steward`, **`return_path`** (the reciprocity
   primitive: how corrections/contributions flow BACK). Fill honestly:
   `reuse_conditions` (license/permission — if unknown, say unknown and set
   `high_risk: true`), `how_to_credit`, `currentness`, `update_rhythm`, `url`.
3. **No return path?** That's a finding, not a blank — write `return_path:
   "none known — flag to steward"` and raise a `signal` candidate proposing
   outreach. Extraction without reciprocity is the pattern this framework
   exists to break.
4. **Born-rules apply**: `maturity: raw`, `ai_assisted: true`, `provenance`
   with `origin` (where YOU learned of this source).
5. **Referencing discipline** for everything ingested from this source:
   claims become `claim-evidence` candidates citing the source card's slug —
   never naked assertions in prose fields.
6. **Emit** as a candidate in the current work order (or via capture-and-route
   for a standalone registration), then validate:
   `node <framework>/src/cli.mjs validate source-system <file>`.

## In the pilots

Self-ingestion registers the toolkit site + the master doc as source systems;
ReFi DAO registers its podcast + blog; ReFi BCN its knowledge commons. The
federation triangle (design spec §6a) is these cards pointing at each other.
