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

## Mode: frame-language-audit

Grounding (2026-07-02 planning call, paraphrased — the exact wording comes from
a noisy auto-transcription and is **not verified for public quoting**; see the
KB's claim-evidence record + its public-use-boundary companion before citing):
Frame-1 terms can make a thing *structurally* not regenerative — the point is
structural, not semantic; where intention and structure diverge,
**structure beats intention**. This mode audits language as structure, per CSIS's
informed-not-conformant posture (R7). Cite the published CSIS/Craft standards
(and the AI Precision Toolkit once released) rather than call transcripts.

**Scope:** any doc set — site pages, framework docs, the master doc, KB objects.

1. **Scan** for Frame-1 markers: *governance, accountability, compliance,
   enforcement, stakeholder, incentivize, capture (of value), leverage,
   scale (as verb), best practice, human resources* — and power-over phrasings
   ("ensure members comply", "hold contributors accountable").
2. **For each hit, judge structurally, not lexically:** does the surrounding
   mechanism actually create hierarchy/extraction, or is it a loose word on a
   sound structure? Only the first is a finding; the second is a wording note.
3. **Propose the regenerative reframe** with the mechanism named: e.g.
   "governance options" → "coordination agreements / decision-making patterns";
   "accountability" → "reciprocity + visible provenance"; "enforce" →
   "make structurally impossible or visibly divergent".
4. **Report** as a table (term · location · structural? · proposed reframe ·
   owner) and emit `signal` candidates for structural findings. Master-doc
   findings batch as draft-and-present proposals (Loop 2) — never edit it.
5. **First exercise targets:** the framework package's own docs + the two site
   pages (`/framework`, `/regen-toolkit-os`) — per the 2026-07-02 action item.
