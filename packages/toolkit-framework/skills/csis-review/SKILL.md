---
name: csis-review
version: 0.1.0
description: Structural-integrity review — apply the audience-segmented review prompts, grade an artifact against the three-level model, run the minimum enforceable safeguards, and flag (never certify) overclaiming / visibility-not-falsifiability.
framework: toolkit-framework
agnostic: true
---

# csis-review

The active counterpart to the static schemas. **CSIS-informed, not CSIS-conformant** (R7): this skill **flags for human/CSIS-literate review — it does NOT issue conformance verdicts.** See `process/csis-safeguards.md`.

## What it checks

1. **Three-level grading.** Classify each structural statement as Level 1 (principle), Level 2 (review prompt), or Level 3 (enforceable standard). Don't treat a principle as if it were enforceable.
2. **Visibility → falsifiability.** For a deployment: are its conditions precise enough that an independent reviewer could detect satisfaction *or violation* from available evidence? If not, flag "visibility substituted for falsifiability" (Durgadas's headline critique).
3. **Minimum enforceable safeguards** (the 7): source/evidence status · AI-synthesis status (marked until reviewed) · resource review status · link status · source-system care · deployment review-readiness (the 6 components — use `checkDeploymentValidity`) · implementation-learning boundary (case ≠ pattern).
4. **Overclaim scan.** Regeneration/impact/governance/structural-soundness claims that exceed their evidence or `maturity`/`public_use` state. Apply frame-language discipline (watch Frame-1 extractive language masquerading as regenerative).
5. **Public-use + consent.** High-risk content carries a `public-use-boundary`; person-nodes/Indigenous-knowledge/exact-locations get consent review.

## Output

A review report: per-item findings with a recommended **handling mode** (cited-reference / review-prompt / native-adaptation / adopted-standard) and a route to the right reviewer (source / domain / structural / community / ecological-MRV / governance / legal / AI / privacy). **Flags, not verdicts** — escalate to a human reviewer (and, for CSIS constructs, to a CSIS-literate reviewer).

## Guardrail

Until the open CSIS decisions resolve, do not assert conformance. Draft-and-present any public-facing output.
