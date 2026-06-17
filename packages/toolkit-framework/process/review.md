# Review

> Source: master doc **§4.6 "Review should scale with risk"**, **§15 "Review
> workflows"**, **§"Deployment review types"**. This file is the operational
> expansion of Principle 6.
>
> **The goal is not gatekeeping.** It is to prevent weakly-reviewed material from
> being used beyond its readiness.

## Review scales with risk (Principle 6)

The Toolkit does **not** apply the same review to everything. A raw resource link
can be added immediately; a public ecological or funding claim needs strong review.
Review intensity scales with:

- public visibility;
- practical consequences;
- ecological / financial / governance risk;
- privacy, identity, or community-representation risk;
- dependency / infrastructure risk;
- likelihood of misinterpretation;
- use in funding, decision-making, or implementation.

Two machine hooks make this actionable:

- **`high_risk` flag** (`schemas/review-maturity.yaml`) — set when any of the above apply;
  triggers the high-risk workflow below.
- **`maturity` + `public_use` axes** (same schema) — review *advances* an item along these,
  it does not skip steps. Review is **not** a fourth state axis; it is the activity that
  moves an item across the three axes (see [`contribution.md`](contribution.md) on the axes).

> A contribution can be raw. **Publication requires stronger care.** Keep contribution
> open while protecting public trust — separate *contributing* from *publishing*
> (a role-failure safeguard; see [`roles.md`](roles.md)).

## The 12 review types

Each review type answers a different question. Tag an item with the review type(s) it
needs (`frontmatter.review_needs`); high-risk items often need several.

| # | Review type | Use for |
|---|---|---|
| 1 | **Source review** | Links, citations, provenance, attribution, currentness. |
| 2 | **Domain review** | Accuracy in a specific field. |
| 3 | **Structural review** | Roles, obligations, power, decision paths, failure modes. |
| 4 | **Community review** | Representation of people, groups, networks, or local contexts. |
| 5 | **Place-based review** | Local, ecological, cultural, or bioregional context. |
| 6 | **Ecological / MRV review** | Biodiversity, carbon, restoration, soil, water, monitoring, environmental claims. |
| 7 | **Governance review** | Decision systems, authority, legitimacy, accountability, conflict pathways. |
| 8 | **Legal / tax review** | Jurisdiction-sensitive structures or claims. |
| 9 | **Token / incentive review** | Token systems, incentives, markets, rewards, gaming risks. |
| 10 | **AI review** | AI-assisted synthesis, classification, recommendations, automation. |
| 11 | **Privacy / consent review** | People, locations, identity, credentials, profiles, sensitive mapping. |
| 12 | **Implementation review** | Accuracy and generalizability of practical lessons or case claims. |

(The Deployment layer uses the same families under domain-specific names — e.g. *funding
review*, *technical review* — per master doc §"Deployment review types". Treat those as
specializations of the 12, not a separate vocabulary.)

## The four review workflows

### Lightweight review workflow
For ordinary contributions (raw resources, concept stubs, loose leads, draft options, open
questions):

1. Contributor adds raw item.
2. Knowledge Gardener routes it.
3. Maturity status is added.
4. Source or context is noted.
5. Related layer is linked.
6. Item is improved over time.

### High-risk review workflow
For high-risk content (ecological/funding claims, governance recommendations, identity
systems, community representation, AI-generated public guidance, legal/tax material, token
systems, sensitive maps):

1. Contributor adds item or claim.
2. Maturity marked `raw` / needs review.
3. **Public-use boundary added** (`public_use` axis / `public-use-boundary.yaml`).
4. Relevant reviewer identified.
5. **Evidence separated from claim** (Principle 5 / `claim-evidence.yaml`).
6. Domain or community review happens.
7. Status updated.
8. Public content revised or held back.
9. Evolution Log records the decision if important (an **evolution-record**; see [`evolution-loop.md`](evolution-loop.md)).

### Source-system review workflow
For source systems (wikis, repos, maps, directories, forums, knowledge gardens, docs hubs,
community libraries):

1. Identify possible source system.
2. Create a minimal **Source System Card** (`schemas/source-system.yaml`).
3. Note steward / maintainer.
4. Note scope and domain.
5. Check attribution / reuse conditions (`how_to_credit`, `reuse_conditions`).
6. **Add return-path note** (`return_path` — the federation hook; see [`federation.md`](federation.md)).
7. Mark currentness.
8. Route to Resource Graph, Encyclopedia, Option Library, or Tracks as needed.
9. Revisit periodically.

### Implementation review workflow
For implementation records (pilots, rounds, campaigns, local nodes, workshops, tool
deployments, governance experiments, ecological reporting):

1. Record what happened.
2. Preserve context.
3. Separate plan from reality.
4. Capture evidence.
5. Capture signals.
6. Identify public-use boundary.
7. Route lessons to Toolkit layers.
8. Create update proposals if needed (`schemas/update-proposal.yaml`).
9. Mark whether this is a **case**, a **repeated signal**, or a **pattern candidate**
   (Principle 12 — pattern humility; do not promote a case to a pattern without review).

## Review cadence (master doc §"Review and cadence")

Continuous where possible, periodic where useful. *A lightweight review that actually
happens beats a perfect process nobody maintains.* Cadence should match capacity.

| What | Suggested cadence |
|---|---|
| Broken links / resource currentness | Monthly or quarterly |
| Source System Registry review | Quarterly |
| Ontology review | Quarterly or when major ambiguity appears |
| Option / track maturity review | After use or quarterly |
| Deployment template review | After each major implementation |
| Public-use / high-risk claims | Before publication and periodically |
| Implementation Memory review | After each pilot, round, or campaign |
| Backlog / compost review | Monthly or quarterly |

## Reviewer prompts and CSIS

For the CSIS-informed review-prompt bank, the 3-level model (principle / review prompt /
enforceable standard), and the "flag, never certify" posture, see [`csis-safeguards.md`](csis-safeguards.md).
Reviewer roles and the safeguards against reviewer failure are in [`roles.md`](roles.md).
