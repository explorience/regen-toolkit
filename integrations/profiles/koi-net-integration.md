# KOI-net Integration (first pass)

## What it is
- `koi-net` is a Python implementation of the KOI protocol for interoperable knowledge exchange via RIDs, manifests, bundles, and events.
- It defines event/state communication endpoints (`/events/broadcast`, `/events/poll`, `/rids|manifests|bundles/fetch`) and full/partial node patterns.

## Why it matters for regen-toolkit
- Provides a protocol-native path for cross-repo knowledge portability instead of ad-hoc copy/paste.
- Gives a formal way to propagate updates (`NEW/UPDATE/FORGET`) between toolkit-related knowledge systems.

## Integration modes
- **Content:** index toolkit artifacts as KOI knowledge objects (playbooks, case studies, guides).
- **Taxonomy:** align toolkit metadata with RID types and manifest metadata.
- **Workflow:** trigger event emission when key markdown artifacts change.
- **Technical:** prototype a small KOI full node for toolkit content and test fetch/broadcast flows.

## Suggested sync cadence
- **Daily event sync** for changed artifacts.
- **Weekly integrity checks** (RID validity + manifest/hash consistency).

## Candidate article topics
1. KOI protocol fundamentals for regenerative knowledge systems.
2. RID + manifest design for toolkit content portability.
3. Event-driven documentation sync: NEW/UPDATE/FORGET in practice.
4. Full vs partial node patterns for community knowledge infrastructures.

## Risks/blockers
- Requires protocol and schema discipline to avoid inconsistent RID generation.
- Adds operational overhead (node lifecycle, monitoring, retries).
- Team onboarding needed for KOI concepts before production use.

## Next actions
1. Define a minimal RID scheme for regen-toolkit content classes.
2. Pilot event emission from one content subset (e.g., Track 2 guides).
3. Validate end-to-end retrieval of manifests/bundles for changed docs.
