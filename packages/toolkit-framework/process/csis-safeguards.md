# CSIS Safeguards — Structural Integrity Posture

> Source: master doc **§"CSIS-Informed, Not CSIS-Conformant"**, **§"From visibility
> toward falsifiability"**, **§"Three levels of structural use"**, **§"Minimum
> enforceable safeguards"**, **§"CSIS construct handling map"**.
>
> CSIS = Comprehensive Structural Integrity Suite — a structural-integrity reference
> the Toolkit borrows from. This file encodes **how to borrow without overclaiming**.

## Posture: CSIS-Informed, Not CSIS-Conformant (R7)

The Toolkit is **structurally integrity-oriented, but not structurally integrity-certified.**
It is **CSIS-informed, not CSIS-conformant.** It borrows CSIS language, questions, and
concerns — it does **not** claim to have preserved CSIS's enforcement machinery.

This matches reconciliation **R7** (`../docs/meta/RECONCILIATIONS.md`): CSIS is a **candidate**
and a **separable, optional overlay**, not a mandatory base. A fork can run the core kernel
with **zero CSIS edges** — the `governance_csis` predicate group in
[`schemas/relationships.yaml`](../schemas/relationships.yaml) is marked `optional: true`.
Adopt CSIS constructs **only** with CSIS-literate review, **construct by construct.**

> Avoid reproducing simplified versions of CSIS constructs in a way that implies the
> original enforcement logic, dependencies, and violation-detection criteria are intact.

## The 4 handling modes

Where a CSIS construct is referenced, handle it in exactly one of these ways — and say which:

1. **Cited reference** — point to the original CSIS construct without restating or
   implementing it.
2. **Review prompt** — use a simplified question *inspired by* the construct, clearly marked
   as a prompt, not a standard.
3. **Toolkit-native adaptation** — create the Toolkit's own standard/practice inspired by
   CSIS, without claiming it *is* the CSIS construct.
4. **Adopted standard** — adopt the construct in **enforceable form**, including its
   dependencies, criteria, disqualifiers, and violation-detection logic.

At this stage **most CSIS material should be cited reference or review prompt.** Full
adoption happens construct by construct, reviewed by people who understand the source standard.

## Visibility → falsifiability

> **The danger is substituting visibility for falsifiability.**

- **Weak (visibility):** the project *names* its decision process / treasury / impact claim.
- **Stronger (falsifiability):** the project defines its structure precisely enough that an
  **independent reviewer can detect whether it was satisfied or violated** using available
  evidence — who can propose/approve/execute/pause/reverse a decision; who can move funds
  under what approval; what evidence would show the process was followed; what would
  *disconfirm* an impact claim.

A deployment, claim, or recommendation is **not valid simply because its fields are filled
in.** The direction of travel is away from vague completeness, toward violation-detectable
structure. The Toolkit need not reach this everywhere immediately — but this is the standard
it moves toward.

## The 3-level model of structural use

To avoid overclaiming, every structural statement sits at exactly one level:

| Level | What it is | What it does NOT do | Examples |
|---|---|---|---|
| **1 — Principles** | Guide judgment, tone, design direction | Define enforceable standards | "source lineage matters", "non-extractive synthesis matters", "structural integrity matters" — the [18 principles](principles.md) |
| **2 — Review prompts** | Help people ask better questions; improve reflection/sensemaking | Certify a structure is sound | "Who holds power here?" · "Who controls funds/data/publication?" · "What would count as failure / as evidence / would change our mind?" · "Local example or transferable pattern?" |
| **3 — Enforceable standards** | Precise enough that a reviewer can tell satisfied vs violated | (introduce only a few at first) | "a public claim must link to evidence or be marked unverified" · "AI-assisted synthesis must be marked until human-reviewed" · "a source system must be attributed, not treated as an extractable link pool" |

**Never confuse the levels.** A review prompt is not formal validation. Introduce only a
small number of enforceable standards at first; grow them where there is evidence, reviewer
capacity, and demand. The `csis-review` skill **flags against this model — it never certifies.**

## The 7 minimum enforceable safeguards

The next version can adopt this small set of practical, low-regret standards **without**
claiming full certification (master doc §"Minimum enforceable safeguards"):

1. **Source & evidence status** — any public-facing claim is source-linked, OR marked as
   interpretation / hypothesis / AI-assisted / unverified / requiring review.
2. **AI synthesis status** — AI-assisted synthesis stays marked as such until reviewed by a
   human with relevant context (enforced by the `ai_assisted` flag, K1).
3. **Resource review status** — resources carry simple status metadata; inclusion in the
   Resource Graph does **not** imply endorsement.
4. **Link status** — links carry status (active / broken / redirected / paywalled / archived
   / duplicate / replacement-needed / unresolved); broken links get resolved, replaced,
   archived, or marked unresolved. (Supports source-lineage enforcement.)
5. **Source-system care** — source systems are not extractable link pools; track what they
   are, who stewards them, attribution, reuse conditions, and what flows back
   (`source-system.yaml`).
6. **Deployment review-readiness** — a deployment is not "structurally sound" because a
   template is complete; it must at minimum define decision process, roles/authority,
   information requirements, power/control points, evidence basis, accountability pathway,
   failure-detection pathway, fixed/configurable/experimental boundaries, and public-use
   boundary.
7. **Implementation learning boundary** — implementation examples are marked as
   local-example / case-study / record / field-note / retrospective / pattern-candidate /
   reviewed-pattern / failure-case / open-question; a case is not a universal pattern without
   review (Principle 12).

## CSIS construct handling map

How each CSIS-adjacent construct should be handled **now** (master doc §"CSIS construct
handling map"):

| Construct | Recommended treatment now | Mode |
|---|---|---|
| **Precision-First** | Adopt the *direction* (visibility → violation-detectability) as a Toolkit-native standard, not full CSIS compliance. | native-adaptation |
| **Information Asymmetry** | Use as a review prompt unless full detection surfaces + active-maintenance logic are restored. | review-prompt |
| **Regenerative Obligation** | Cite CSIS directly or keep as design seed; do **not** paraphrase as if adopted. | cited-reference |
| **Coordination Scaling** | Cite or use as a cautionary prompt; do not treat thresholds as sufficient by themselves. | review-prompt / cited-reference |
| **Four Batteries** | Keep as design seed or contributor-health prompt. | review-prompt |
| **Structural Power** | Use as a review prompt and a deployment-field requirement. | review-prompt |
| **Partial adoption** | Acceptable **only** when exposure, incompleteness, and limits are disclosed; build a dependency map before adopting anything as enforceable. | (meta-rule) |
| **Tensegrity** | Use as a systems metaphor for balancing tensions — **not** as proof of integrity. | cited-reference |

## Honest framing line

> The Toolkit is structurally integrity-oriented, but not structurally integrity-certified.
> It is CSIS-informed, but not CSIS-conformant. Structural integrity is a **direction of
> development**, not a completed certification system. The current role is to make structural
> assumptions, risks, review needs, and source lineage more visible and reviewable, while
> gradually developing stronger standards through feedback and implementation learning.

Open CSIS decisions (e.g. which constructs to promote to enforceable, restricted-memory
handling) route to the backlog, not into premature standards. Reviewer prompts and reviewer
roles: [`review.md`](review.md), [`roles.md`](roles.md).
