# Roles

> Source: master doc **§15 "Working roles"** (12), **§"Evolution roles"** (11), **§17
> "Contributor roles, review, and stewardship"** (17). This file **resolves
> reconciliation R8**: those three overlapping lists become **one reconciled role
> registry**.
>
> Roles describe **kinds of stewardship labor**, not formal positions. One person may
> hold several roles early on. **Roles should be scoped — no role should automatically
> make someone authoritative over the whole commons.** Naming roles makes hidden labor
> visible.

## R8 — one reconciled role registry

The master doc's three lists overlap heavily (e.g. "source-system steward" appears in all
three; "knowledge gardener" / "documentation editor" / "editorial steward" are the same
labor under different names). The superset below de-duplicates them and **scopes each role**
to its surface. The "Appears in" column traces provenance back to the three source lists.

| Role | Scope (what it stewards) | Appears in |
|---|---|---|
| **Contributor** | Adds one useful thing through any of the 10 contribution doors; not authoritative over anything. | §17 |
| **Knowledge Gardener** | Routing, structure, crosslinks, duplicates, composting, section coherence; "what is this / where does it belong / what next?". (= documentation editor / editorial steward for routing.) | §15, §13.9, §17 |
| **Editorial Steward** | Public readability, tone, navigation, removing duplication, checking that public pages don't overclaim for their review state. | §15, §17 |
| **Source-System Steward** | Source System Cards, currentness, attribution, reuse conditions, return paths; prevents extractive aggregation. | §15, §13.9, §17 |
| **Concept Steward / Editor** | Definitions, comparison pages, conceptual plurality, overloaded terms, local-vs-shared meaning. | §15, §17 |
| **Ontology Steward** | The semantic kernel: type-vs-tag, relationship grammar, mappings/crosswalks, new-type proposals, deprecations, versioning. (Careful, not controlling.) | §15, §13.9, §17 |
| **Resource Scout** | Surfaces resources and leads into intake. | §17 |
| **Option Steward / Gardener** | Option entries, use cases, dependencies, failure modes, examples, maturity from implementation, high-risk flags. | §15, §13.9, §17 |
| **Track Designer / Steward** | Pathways: composes concepts + options for an audience; routes user feedback. | §13.9, §17 |
| **Deployment Reviewer** | Decision systems, information requirements, power/control points, accountability, failure detection, fixed/configurable/experimental boundaries; routes high-risk deployments to domain review. | §15, §13.9, §17 |
| **Implementation Scribe / Memory Steward** | Records what actually happened; separates plan from reality, claim from evidence; extracts signals; preserves context. | §15, §13.9, §17 |
| **Domain Reviewer** | Specialized accuracy (ecology/MRV, governance, funding, legal/tax, token, AI, privacy, local/bioregional, technical). Scales with risk. | §15, §13.9, §17 |
| **Community Reviewer / Connector** | Representation, consent, local context, misrepresentation, sensitive info; ensures affected people can correct or respond. | §15, §13.9, §17 |
| **Public-Use Reviewer** | Whether material is safe to expose publicly (the `public_use` axis); applies public-use boundaries. | §17 |
| **AI Workflow Reviewer / Maintainer** | AI-generated outputs, source-lineage preservation, hallucination detection, marking AI-assisted content, keeping human-review boundaries, improving prompts. | §15, §13.9-implied, §17 |
| **Technical Maintainer** | Repos, site deploy, schemas, exports, builds, databases, AI retrieval, backups/raw archives; tooling support. | §15, §13.9, §17 |
| **Evolution Steward** | The update process and the Evolution Log; turning signals into interventions and memory. | §13.9 |
| **Conflict / Restricted-Memory Steward** | Sensitive, unresolved, or consent-bound material; restricted-memory tiers; allegations and reputational risk. | §17 |
| **Public Forum Facilitator** | Open contribution and review flows; convening reviewers. | §17 |

> **Scoping rule (master doc §17):** every role is bounded to its surface. Authority does
> not transfer between surfaces — being an Option Steward does not make someone an authority
> over ontology, public-use, or community representation.

These roles map to the `role`, `steward`, and `contributor` **extension entities**
(`extension-entities.yaml`), all of which `maps_to_core` to `concept`/`person`.

## Role-failure safeguards

> **The Toolkit should expect role failure and design for it** — incompetence, malice, or
> bias (master doc §17 "What if someone in a role is incompetent, malicious, or biased?").

The safeguards, grouped:

**Separation of powers**
- **Separation of contribution, review, and publication** — the contributor of an item is
  not its sole reviewer or publisher; *contribution can be raw, publication needs stronger
  care* (see [`contribution.md`](contribution.md), [`review.md`](review.md)).
- **Multiple reviewers for high-risk sections** (no single reviewer gates high-risk content).
- **Domain review for high-risk claims** (the right expertise, not just any reviewer).

**Transparency**
- **Conflict-of-interest disclosure.**
- **Review status visible** + **change history** + **issue tracking** (the work is auditable).
- **Source-lineage preservation** (`provenance.yaml`) — credit and origin can't be quietly erased.
- **Visible uncertainty instead of false consensus** (Principle 9).

**Recovery**
- **Appeal / challenge paths** (a decision can be contested).
- **Revert / rollback ability** (git history is the substrate; a bad change is reversible).
- **Role rotation where appropriate** (avoid entrenched control).

**Containment**
- **Scoped permissions** (the scoping rule above).
- **Public-use boundaries** (`public-use-boundary.yaml`) + **restricted memory for sensitive
  issues** (see [`evolution-loop.md`](evolution-loop.md)) — limit blast radius of a bad actor
  or a bad call.

These safeguards are not bureaucracy; they are the structural conditions that let the commons
**stay open and contributor-friendly without becoming capturable.** They connect directly to
the CSIS *structural power* prompts (see [`csis-safeguards.md`](csis-safeguards.md)).
