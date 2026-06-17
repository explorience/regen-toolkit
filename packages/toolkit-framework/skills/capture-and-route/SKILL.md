---
name: capture-and-route
version: 0.1.0
description: Turn a raw lead (link, paste, transcript, repo, tweet, forum post) into typed Toolkit objects routed to the right layer, with provenance + maturity + public-use state preserved. The framework's flagship intake skill.
framework: toolkit-framework
agnostic: true
---

# capture-and-route

The contributor front door (master doc Principle 18 + §5 deep intake). **A contributor adds one useful thing; the system routes it.** Works in any agent context — no org-os required.

## Core principle

> Deep intake: **one shared thing becomes many entries.** A report can yield a Resource + Concepts + a Claim + Evidence + an Option-inspiration + an Implementation-candidate + a Signal + a Source-System part + a public-use-boundary case.

## Inputs

Any of: a URL, pasted text, a call transcript, a GitHub repo, a tweet/thread, a forum post, a question, a pattern/failure observation.

## Steps

1. **Identify the whole.** What is this object as a whole? Where is it from? Who maintains it?
2. **Decompose (deep intake).** Extract the candidate sub-objects, each typed via the kernel (`schemas/kernel-profile.yaml` → resource · concept · option · deployment · signal) or the full ontology (`schemas/{core,extension}-entities.yaml`).
3. **Source-system check.** Is the origin a *living knowledge environment* (wiki/repo/forum/garden/podcast)? If so, draft a `source-system` card — and **capture its `return_path`** (the federation/reciprocity primitive). Source systems are peers, not link pools.
4. **Apply high-risk triggers.** People/community profiles, exact locations, Indigenous/TEK knowledge, ecological/carbon/MRV claims, funding/legal/governance recommendations, identity/reputation → set `high_risk: true` and a `public-use-boundary`. Do NOT create public person-nodes by default. Retweets/mentions are **signals, not endorsements**.
5. **Assign state (K1, `schemas/review-maturity.yaml`).** Set `maturity`, `public_use`, `lifecycle_state` honestly — a raw lead is `raw` / `raw-lead`, NOT `reviewed`. Mark `ai_assisted: true` for anything you synthesized.
6. **Route.** Resource → Layer 3; Concept → Layer 2/4; Option → Layer 5; Deployment → Layer 6; Implementation → Layer 8; Signal → Layer 9. Leave a `toolkit_route`.
7. **Preserve provenance** (`schemas/provenance.yaml`): origin, surfaced_by, transformation (quoted/summarized/synthesized/…), authorship.
8. **Validate** each emitted object: `toolkit-framework validate <schema> <file>`.

## Output

A set of typed, validated objects, each with provenance + state, and a routing note. Nothing raw is promoted to `reviewed`/public without human review (anti-extractive synthesis, Principle 9).

## Guardrails

- Don't invent source lineage. Don't erase uncertainty. Don't turn sensitive notes into public guidance. Don't overclaim maturity. Mark AI-assisted material as such.
