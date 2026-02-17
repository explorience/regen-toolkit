# KOI-net Integration Stack (first pass)

## What it is
- Combined stack from:
  - `koi-net` (protocol + Python node implementation)
  - `koi-net-integration` (TypeScript bridge packages + Python coordinator/processors/sensors)
- `koi-net-integration` includes:
  - TS packages: `koi-bridge`, `rid-utils`, `knowledge-api`
  - Python node roles: coordinator, sensors, processors (graph/vector/schema)
  - Deployment references: Docker Compose/Kubernetes docs.

## Why it matters for regen-toolkit
- Offers both protocol and practical integration tooling, reducing custom glue code.
- Matches regen-toolkit needs across ingestion, search, graph relationships, and AI context generation.
- Can support federation patterns across ReFi DAO / Regen Coordination / Toolkit repos.

## Integration modes
- **Content:** ingest markdown artifacts through sensor-like flows into searchable stores.
- **Taxonomy:** standardize identifiers with `rid-utils` and schema mappings.
- **Workflow:** use event-driven updates from repository changes to processor pipeline.
- **Technical:** connect interface/API layer to `knowledge-api` and KOI coordinator endpoints.

## Suggested sync cadence
- **Near-real-time** for event ingestion (or hourly batching initially).
- **Weekly** topology/schema review.
- **Monthly** processor performance and relevance tuning.

## Candidate article topics
1. From markdown repos to federated knowledge graph: KOI integration stack walkthrough.
2. Designing RID types for ReFi governance, playbooks, and case studies.
3. Graph + vector hybrid retrieval for regenerative knowledge assistants.
4. Practical federation policy patterns for multi-organization knowledge sharing.
5. Docker-first local deployment for KOI-enabled toolkit workflows.

## Risks/blockers
- Architecture in docs is broad; production hardening level must be validated per component.
- Operational complexity (multiple services: coordinator/processors/stores).
- Schema and sharing-policy drift across participating repositories.

## Next actions
1. Select a narrow MVP slice (one repo family + one query use case).
2. Implement RID mapping spec for 5–8 core artifact types.
3. Stand up local docker stack and validate one full ingest → query cycle.
4. Document governance for sharing policies (public/federated/private).
