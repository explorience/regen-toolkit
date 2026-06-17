# The 18 Cross-Cutting Principles

> Source: master doc **§4 "Cross-Cutting Principles"**. These are the framework's
> standing commitments — they shape how every layer, schema, skill, and review
> behaves. They are not a layer; they appear wherever relevant.
>
> **The goal is not bureaucracy. The goal is appropriate care.** A raw link should
> not need the same process as a public ecological claim.

## How principles are encoded (R6 — encode once)

The master doc states this content **twice**: as the 18 principles in §4, and as
a 9-row **"Cross-cutting systems"** table earlier in the System Overview. These are
the same content at two grains. **This file is the single home.** The 9-row table is
a coarser rollup of the 18 principles; do not maintain it as a competing list.

| §"Cross-cutting systems" row | Principles it rolls up |
|---|---|
| Provenance & Attribution | 1, 2 |
| Review & Maturity | 3, 6 |
| Privacy, Consent & Identity | 8 |
| Standards & Interoperability | 10, 11 |
| Discovery & Affinity | (interface concern; not a process principle) |
| Interface & Navigation | 11, 18 |
| Synthesis & Sensemaking | 9 |
| Regenerative Obligation | 7, 13 |
| Claim-Evidence Discipline | 5 |

Principles that have no row in the rollup (4 public-use, 12 pattern humility,
14 AI-but-human-governed, 15 infra-serves-workflows, 16 living-systems-health,
17 compost) are first-class here regardless.

Many principles **are already enforced in schema fields** — those pointers are noted
inline so a contributor or agent knows where the principle becomes machine-checkable.

---

## The principles

### 1. Provenance and source lineage
Preserve where knowledge came from. Don't only ask *"can we use this?"* — also ask
*where did it come from, who stewarded it, what context does it carry, how should it
be credited, and what should flow back?* Provenance is relational, not just citation.
→ Encoded in `schemas/provenance.yaml` (`origin`, `surfaced_by`, `adapted_from`,
`transformation`, `authorship`) and `frontmatter.source_lineage`.

### 2. Attribution and return paths
Attribution is more than naming a source. When the commons builds on a source system,
community, dataset, or project, preserve a **return path** (link back, credit the
steward, send corrections upstream, share improvements, invite review). Especially
important for living source systems and community/Indigenous/ecological/local knowledge.
→ Encoded in `schemas/source-system.yaml` (`how_to_credit`, `return_path`,
`reuse_conditions`) and the `requires_attribution` / `has_return_path` predicates.

### 3. Maturity and review state
Not all material has the same trust level. Make **maturity** visible wherever it
matters — without shaming rough work; the point is to help people use things responsibly.
→ This is the `maturity` axis in `schemas/review-maturity.yaml` (the canonical
state model). Do **not** invent a competing ladder.

### 4. Public-use boundaries
Some material is useful internally but not safe to present publicly as guidance or
endorsed knowledge (ecological/MRV claims, people/community profiles, sensitive locations,
token models, AI matching, unresolved conflict). **High-risk does not mean remove — it
means handle with care.** A clear boundary beats a false sense of readiness.
→ The `public_use` axis in `schemas/review-maturity.yaml` + `schemas/public-use-boundary.yaml`
(visibility tiers).

### 5. Claim-evidence discipline
Distinguish **claim** (assertion) from **evidence** (what supports/complicates it),
from **interpretation** (meaning drawn), from **uncertainty** (what's unresolved), from
**review state** (confidence). A claim does not become public guidance just because it is
written clearly. Critical for impact/ecological/funding/governance/AI/community claims.
→ Encoded in `schemas/claim-evidence.yaml`; entities `claim` + `evidence` in `core-entities.yaml`.

### 6. Review should scale with risk
Don't apply the same review to everything. A raw link is added quickly; a public
ecological or funding claim needs strong review. Review scales with public visibility,
practical consequences, ecological/financial/governance/privacy/representation/dependency
risk, likelihood of misinterpretation, and use in funding or decisions.
→ See [`review.md`](review.md), which is the operational expansion of this principle.
The `high_risk` flag in `review-maturity.yaml` is the machine hook.

### 7. Regenerative obligation
When the commons draws value from people, communities, source systems, places, or
ecological knowledge, ask what form of return is appropriate. The return should be
**non-fungible** (match the kind of value taken), **proximate** (reach those who carried
the cost), and **embedded** (stay connected to the relationship). Returns can be
attribution, payment, invitation, review, correction, collaboration, upstream contribution,
consent, or *not publishing* sensitive material.
→ Encoded as the `obligation` extension type and the `source_system_reciprocity` field
in `schemas/contribution-record.yaml`; ties to federation (see [`federation.md`](federation.md)).

### 8. Consent, privacy, and representation
*Not everything that can be mapped should be mapped publicly.* Ask consent/representation
questions for people/community profiles, local maps, exact locations, vulnerable or
Indigenous communities, contribution histories, reputation systems, AI-assisted matching,
and unresolved conflict. Protect context — don't merely extract information from it.
→ The `person` core entity defaults to non-public; `schemas/public-use-boundary.yaml`
carries `consent_note`; tier `never-publish-without-consent`.

### 9. Anti-extractive synthesis
Synthesis becomes extractive when it erases source lineage, removes uncertainty, collapses
disagreement into false consensus, turns local knowledge into generic claims, presents
unreviewed material as authoritative, or over-polishes weak evidence. Anti-extractive
synthesis **preserves** attribution, uncertainty, dissent, maturity state, public-use
boundary, source context, and what should not be generalized. *Regenerative clarity is not
extractive simplification.*

### 10. Interoperability without forced uniformity
Support interoperability **without** requiring every community to use the same words,
structures, tools, or ontologies. The goal is **translatability**, not uniformity:
preserve a shared semantic kernel, allow local language, map terms across systems, avoid
ontology sprawl, support export/migration, and avoid locking knowledge into one platform.
→ Encoded as the frozen Layer-A `core-entities.yaml` + namespaced `extension-entities.yaml`
(each `maps_to_core`); see `architecture/fork-compatibility.md`.

### 11. Type / tag discipline
A **type** defines what something *is*; a **tag** describes how it may be grouped,
filtered, or interpreted. The minimum rule: **add a new type only when it changes routing,
relationships, review needs, templates, permissions, deployment logic, or interface
behavior** — otherwise use a tag, subtype, field, or note. Protects against ontology sprawl.
→ See `architecture/type-tag-discipline.md` and [`ontology-change-process.md`](ontology-change-process.md).

### 12. Pattern humility
Don't declare universal patterns too quickly. One case → a **signal**; a few similar cases
→ a **pattern candidate**; repeated across contexts → **pattern-generating**; reviewed and
transferable → a stronger reusable pattern. Implementation learning must preserve context.
*A case should not become a pattern just because the story is compelling.*
→ `pattern-generating` is the **ceiling** of the `maturity` axis (review-maturity.yaml);
the `pattern` core entity is "reviewed, transferable abstraction generalized from multiple cases."

### 13. Local and ecological care
Special care for local maps, field observations, ecological monitoring, restoration/
biodiversity/carbon/soil claims, watershed data, agroforestry, civic partnerships,
community science, and bioregional identity. A practice that works in one place may not
transfer; a map may reveal sensitive locations. **Support local action without flattening
place into generic data.**
→ `bioregion` is a first-class core entity; place-based review is a review type ([`review.md`](review.md)).

### 14. AI-assisted but human-governed
AI can summarize, classify, route, extract, detect relationships, draft, compare, and find
duplicates/gaps — **but it should not become the authority of the commons.** AI-assisted
material stays reviewable. The more public/practical/high-risk/community-representational
the content, the more human review matters.
→ Encoded as the **orthogonal** `ai_assisted` flag (NOT a maturity state) in
`review-maturity.yaml`, and `authorship` enum in `provenance.yaml`. See [`csis-safeguards.md`](csis-safeguards.md) §6.2.

### 15. Infrastructure should serve workflows
Don't choose infrastructure before workflows are clear. Different substrates serve
different functions; **infrastructure follows the actual needs of the commons.** Ask: who
maintains it, who can contribute, what must be human/machine-readable, what needs version
control/review-state/export/preservation, what's the maintenance burden, what happens if
maintainers disappear. *Do not let the tool define the commons too early.*

### 16. Living systems health
Track not only content quality but the **health of the commons as a living system**:
energy, relationship, trust, memory, reciprocity, adaptation, coherence, contribution flow,
maintenance/review capacity, learning, care, compost. Notice abandoned sections, stale
source systems, broken links, repeated confusion, contributor burnout, review bottlenecks,
hidden maintenance labor. *The goal is not completeness; the goal is aliveness.*
→ Surfaces as **signals** in the Evolution loop (see [`evolution-loop.md`](evolution-loop.md)).

### 17. Compost, archive, and memory
Not everything outdated should be deleted. **Compost** preserves outdated/failed/superseded
material so it feeds future learning without confusing current readers (why was it replaced,
what did it teach, what should not be repeated). *Compost is old material transformed into
memory; clutter is unresolved material blocking clarity.*
→ `compost` is the terminal `lifecycle_state`; `archived`/`deprecated` are `maturity` states.

### 18. Contribution should be legible
A contributor should not need to understand the whole Toolkit to make one useful
contribution. Provide simple entry points ("I found a resource", "I want to flag a risk",
"I want to correct a claim"). A contribution doesn't need to be perfect to be useful, but it
should become clearer over time: what kind of object it is, where it belongs, what it relates
to, how mature it is, what review it needs, whether it can be used publicly, what happens next.
→ This is the contract behind the `capture-and-route` skill; see [`contribution.md`](contribution.md).

---

## Working summary (master doc §4)

The Toolkit should be **structured but not rigid · open but not careless · clear but not
over-polished · interoperable but not uniform · AI-assisted but human-governed · useful for
action but honest about uncertainty.**
