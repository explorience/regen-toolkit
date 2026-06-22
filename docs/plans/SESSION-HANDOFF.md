# Session Handoff — Checkpoint + Prompt Pack

> Open this, copy the prompt you need into a fresh session. Built 2026-06-17. **For tomorrow with Matty:** run **Session 1** (framework beta + KB + gaps) and **Session 2** (site + content) tonight; **Session 3** (the share pack) produces the thing you send. See "Recommended path" at the bottom.

---

## 0. CHECKPOINT — where things are (every session reads this first)

- **Repo / branch:** `…/regen-coordination-os/repos/regen-toolkit`, branch **`regen-toolkit-os`** — a **parallel dev branch**. The live site deploys from `main` (Heenal's v1) — **never touch that deploy.** Work additively; commit + push to `regen-toolkit-os`.
- **The framework — BUILT:** `packages/toolkit-framework/` = `@regen-commons/toolkit-framework` **v0.1.0**, **34/34 tests green** (`cd packages/toolkit-framework && npm test`). Zero-build (YAML + ESM + markdown, dep = `js-yaml`). Contents: `schemas/` (21 — the semantic kernel + shared keystones + 10 layer schemas), `src/` (validator · compatibility engine · invariants · lift ETL · CLI), `skills/` (capture-and-route, compose-journey, csis-review), `architecture/` (8 docs), `process/` (8 docs), `site/journey-model.md`. CLI: `node src/cli.mjs <list-schemas|kernel-check|context|validate|lift|check-state>`.
- **The integration — BUILT:** `packages/org-os-kms/` = `@org-os/kms` (module + org-os profile, framework pre-loaded; replaceable). 2/2 tests.
- **Design + decisions (repo root):** `framework/` = `PLACEMENT.md` (where/how it lives — modular, federated, co-evolution), `COVERAGE.md` (master-doc↔package map + keystones K1–K8), `FEEDBACK-LOOPS.md` (the 4 co-evolution loops), `RECONCILIATIONS.md` (**R1–R10 all resolved** — the master-doc inconsistencies we settled), `README.md`, `SEPARATION.md`. Build plan: `docs/plans/framework-build/README.md` (SP0–SP10 ✅).
- **Master doc:** `docs/MASTER.md` = the 2026-06-15 working iteration (30,847 lines, by Matt). **Derive from it; do not edit it directly.** Diff: `docs/MASTER-DOC-CHANGES-2026-06-15.md`.
- **The site (Heenal's v1, on this branch):** `src/` — `src/data/journeys.js` (3 journeys, 52 steps), 119 articles in `src/content/docs/`, `src/pages/{index,start/[journey]}.astro`, `src/data/knowledge-graph.json`, `astro.config.mjs`. `npm run build` → 124 pages. Other branches' content available read-only via `git show archive/<tag>:<path>` (`git tag -l 'archive/*'`).
- **Resource DB V3 (instance content):** `data/resources/` — xlsx + 28 CSVs (12,456 rows). `data/resources/csv/toolkit-layer-crosswalk.csv` is the routing key.
- **Open convergence plan:** `docs/plans/site-and-content-convergence.md` (process content through framework + the 2 site pages).
- **Recent commits (regen-toolkit-os):** `a8e1640` site+content plan · `a53d174` framework fully built · earlier: SP0–SP10.
- **Loop-2 owed to Matty/group:** the R1–R10 reconciliations (in `framework/RECONCILIATIONS.md`) are batched as **master-doc feedback proposals** (we resolved his doc's contradictions; he needs to ratify).

**Guardrails for every session:** additive only; `packages/toolkit-framework` tests stay green; never break `npm run build`; `npm run validate:schemas` stays clean; `npm run vault:snapshot -- "before <reason>"` (from the parent vault) before any large op; commit incrementally with clear messages; push to `regen-toolkit-os`.

---

## 1. GENERAL session launcher (reusable — fill the {braces} to split any workstream)

```
You are continuing the Regen Knowledge Commons Toolkit framework work in the regen-toolkit
repo, on branch `regen-toolkit-os` (a PARALLEL dev branch — the live site deploys from `main`,
never touch it). Work additively and commit+push to regen-toolkit-os.

READ FIRST (in order): CLAUDE.md ; docs/plans/SESSION-HANDOFF.md (§0 Checkpoint) ; {RELEVANT DOCS/PLAN}.
THEN invoke the skill: {SKILL — e.g. superpowers:writing-plans, superpowers:subagent-driven-development,
  superpowers:brainstorming, deep-research}.

GOAL: {one-sentence goal}.
SCOPE: {what's in / out}.
DELIVERABLE: {the concrete artifact(s)}.
CONSTRAINTS: additive; keep `cd packages/toolkit-framework && npm test` green; never break
  `npm run build`; honest state (raw never auto-promoted, AI-drafts never labeled "reviewed");
  the framework package is consumed read-only — instance content goes in data/ + src/.
DONE = {deliverable} committed + pushed + a one-paragraph summary of what changed + any
  framework gaps/contradictions surfaced (append them to framework/GAPS.md or RECONCILIATIONS.md).
```

> Tip for parallelism: Sessions 1 and 2 below touch **different files** (Session 1 = `packages/toolkit-framework/` docs; Session 2 = `data/` + `src/pages/`) so they can run **concurrently**. Session 3 depends on both.

---

## 2. SESSION 1 — Framework → initial **beta** + cohesive, thorough knowledge base/docs + gaps register

> Goal: make the framework a polished, self-explaining **beta** with a coherent knowledge base that follows the master doc's definitions and **explicitly surfaces gaps, contradictions, and points-to-develop** for Matty + the group. Touches only `packages/toolkit-framework/` (+ `framework/GAPS.md`). Can run in parallel with Session 2.

```
[Use the GENERAL launcher above with:]
READ FIRST: CLAUDE.md ; docs/plans/SESSION-HANDOFF.md (§0) ; framework/{COVERAGE,RECONCILIATIONS,
  FEEDBACK-LOOPS}.md ; packages/toolkit-framework/README.md + architecture/ + process/ ; and the
  master doc docs/MASTER.md (read the framework sections — System Overview, the 10 layers, Ontology,
  Cross-Cutting Principles, CSIS/Structural-Integrity, the Next Working Draft, Appendices A–I).
SKILL: superpowers:writing-plans first (plan the KB structure), then superpowers:subagent-driven-development.

GOAL: bring @regen-commons/toolkit-framework to a coherent, try-able initial BETA with a thorough
knowledge base, fully tracing the master doc's definitions and flagging what's unresolved.

DO:
1. Knowledge base / docs completeness:
   - Write packages/toolkit-framework/docs/README.md (a KB index/guide that ties together
     architecture/ + process/ + schemas/ + skills/ — one coherent map; "start here").
   - Write a GETTING-STARTED.md (install/use in <5 min: list-schemas, kernel-check, validate an
     example, run capture-and-route on one input) and an end-to-end WORKED-EXAMPLE.md
     (one real input → capture-and-route → typed objects → compose-journey → a track).
   - Create packages/toolkit-framework/examples/ with 1 valid sample per schema (resource,
     source-system, option, track, deployment, implementation-record, …) — each passes `validate`.
   - Create templates/instance/ — the Appendix A–I templates (source-system card, resource registry,
     deep-intake, option, deployment, implementation-memory, social-signal, glossary) as fill-in markdown.
   - A GLOSSARY (Appendix H) of the load-bearing terms (CSIS-informed vs conformant, source system,
     resource/concept/option/deployment/signal, public-use boundary, …).
2. Beta polish: bump version to 0.1.0-beta.1; ensure every schema has an example + is referenced
   from the KB index; add a one-line `description` to any schema missing it; keep 34/34 + add tests
   for the examples (each example validates).
3. GAPS register — the artifact Matty/the group review: write framework/GAPS.md =
   (a) what the framework covers vs the master doc (point to COVERAGE),
   (b) CONTRADICTIONS still in the master doc that need the group's call (extend RECONCILIATIONS
       R1–R10 into plain-language "decisions Matt/Durgadas/Rather/Heenal need to make"),
   (c) POINTS-TO-DEVELOP (what's a stub/scaffold vs done: org-os-kms is a scaffold; crosswalks are
       starters; reward-economy is design-seed-only; the lift needs the real V3 review pass),
   (d) OPEN QUESTIONS surfaced by building (e.g. exact Layer-A core membership 12 vs 15; schema
       serialization format; Steward as phase vs cross-cut).
   Frame each as a concrete question + our recommendation, so it's easy to decide on.

DONE = beta KB + examples + templates + GAPS.md committed + pushed; tests green; a one-paragraph
summary + the top 5 decisions we need from the group.
```

---

## 3. SESSION 2 — Site + content convergence (execute the existing plan)

> Goal: process the current toolkit content through the framework and fork/extend Heenal's site with a **framework page** + a **regen-toolkit-os page**, on this branch. Touches `data/` + `src/pages/` + `astro.config.mjs`. Can run in parallel with Session 1.

```
You are continuing the Regen Knowledge Commons Toolkit work in the regen-toolkit repo, branch
`regen-toolkit-os` (parallel dev branch; live site deploys from main — never touch it).

READ FIRST: CLAUDE.md ; docs/plans/SESSION-HANDOFF.md (§0 Checkpoint) ;
  docs/plans/site-and-content-convergence.md (the plan to execute).
SKILL: superpowers:subagent-driven-development (execute the plan task-by-task with spec+quality review).

GOAL: execute docs/plans/site-and-content-convergence.md end-to-end:
  Phase 1 reconcile framework↔Heenal's journeys.js ; Phase 2 process content through the framework
  into data/ (V3 DB lift, 119 articles → encyclopedia entries, journeys → tracks, other-branch/legacy
  content via archive/* tags, CSIS review) ; Phase 3 add src/pages/framework.astro +
  src/pages/regen-toolkit-os.astro (the framework + instance pages), cross-linked from the homepage.

CONSTRAINTS (from the plan): vault-snapshot first; additive (keep the 119 articles + 3 journeys);
  honest state (don't mark AI-pipeline drafts "reviewed"); name dropped-as-superseded content, no
  silent loss; the framework package is read-only; never break `npm run build`. The framework page
  may render LIVE data (import listSchemas/validateKernel from ../../packages/toolkit-framework).

DONE = data/ populated + the 2 pages building + the report at
  docs/reports/<date>-content-through-framework-report.md ; tests + build + validate:schemas green ;
  push ; append any framework gaps this surfaced to framework/GAPS.md (Loop 4). One-paragraph summary.
```

---

## 4. SESSION 3 — The **share pack** for Matty + the group (the concrete startpoint)

> Goal: converge Sessions 1 + 2 into a single, streamlined, shareable startpoint — easy to **follow, understand, try out, and use/integrate/develop**. This is what you send Matty tomorrow. Run after 1 + 2 (or alone with placeholders if time-boxed).

```
You are continuing the Regen Knowledge Commons Toolkit work in the regen-toolkit repo, branch
`regen-toolkit-os`. READ FIRST: CLAUDE.md ; docs/plans/SESSION-HANDOFF.md (§0) ;
  packages/toolkit-framework/README.md + docs/ ; framework/GAPS.md ; the 2 new site pages ;
  framework/RECONCILIATIONS.md.
SKILL: superpowers:brainstorming (briefly, to shape the message) then write.

GOAL: produce a CONCRETE, plain-language startpoint to share with Matty + the group tomorrow —
optimized for "easy to follow, understand, try out, use/integrate/develop." Match Heenal's
voice (anti-jargon, anti-hype, honest).

DELIVERABLES (create docs/reports/<date>-toolkit-framework-share-pack.md as the index, plus the pieces):
1. A one-page plain-language explainer: "The Regen Knowledge Commons Toolkit, as a framework —
   what it is, why it matters, and what we built." (Derive from the master doc's framing; ≤1 page.)
2. "Try it in 5 minutes" — copy-paste steps: clone/checkout regen-toolkit-os → `node packages/
   toolkit-framework/src/cli.mjs kernel-check | list-schemas` → look at the framework + instance
   site pages (or run `npm run dev`) → adopt path (the @org-os/kms profile).
3. "What we need from you / the group" — the GAPS.md decisions distilled to the top 5–7, each a
   crisp question + our recommendation (Matt/Durgadas/Rather/Heenal). This IS the Loop-2 master-doc
   feedback (R1–R10) in shareable form.
4. The links: the framework page + regen-toolkit-os page (URLs/paths), the framework KB index,
   the repo branch, GAPS.md.
5. A 5-line Telegram/forum-post version (the "hey, here's a concrete first cut, take a look" message).

CONSTRAINTS: nothing overclaimed; clearly mark what's beta/scaffold vs done; honest about open
questions (that's the point — it invites contribution). DONE = the share pack committed + pushed +
the 5-line message printed in your final summary so the operator can paste it.
```

---

## 5. SESSION 4 (optional, follow-up) — Master-doc feedback proposals (Loop 2, formal)

> If you want the R1–R10 resolutions as draft-and-present edit proposals for Matt's Google Doc (not just the share-pack summary).

```
[GENERAL launcher] READ FIRST: framework/RECONCILIATIONS.md ; framework/COVERAGE.md ; docs/MASTER.md.
SKILL: superpowers:writing-plans (no code).
GOAL: turn R1–R10 into a draft-and-present proposal set for Matt's master doc — one section per
reconciliation: the contradiction, our resolution, the exact master-doc edit we suggest. Output
docs/reports/<date>-master-doc-proposals.md. Draft-and-present only — do NOT edit docs/MASTER.md.
DONE = the proposals doc committed + pushed.
```

---

## Recommended path for tomorrow morning

- **Tonight, in parallel:** **Session 1** (framework beta + KB + GAPS) and **Session 2** (site + content + the 2 pages) — they touch different files.
- **Then:** **Session 3** (share pack) — produces the one-pager + "try it in 5 min" + "what we need from you" + the post message. **This is what you send Matty.**
- **Minimum viable for tomorrow** if time-boxed: Session 2's two site pages + Session 3's share pack (Session 1's GAPS can be a lighter pass). That alone is a concrete, try-able startpoint with a clear ask.
- Session 4 is a nice-to-have for the formal master-doc proposals.
