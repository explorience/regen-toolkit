# Session Handoff / Fork Prompts — 2026-07-19

Supersedes `SESSION-HANDOFF-2026-07-15.md`. Below: shared context, then **4 ready-to-paste prompts** — the main one builds the live dev instance in Luiz's personal fork; the other three are parallel workstreams.

## Shared context (paste at the top of any of the prompts)

You are operating the **Regen Web3 Toolkit** — an Astro/Starlight site + org-os instance. Working dir: `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit`. Branch: **`regen-toolkit-os`** (dev; `main` = prod, auto-deploys the live site). Read `CLAUDE.md` (esp. VAULT SAFETY) + `memory/2026-07-19.md` + `docs/HANDOFF-CHANGES-2026-07.md` first.

**Guard rails:** never `git stash`/`clean`/`reset --hard`; scoped `git add`. Never modify `docs/MASTER.md` or `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/` (gitignored, read-only). Draft-and-present external actions. Remotes: `origin` = `explorience/regen-toolkit`, `fork` = `luizfernandosg/regen-toolkit` (the personal fork; GitHub Pages at `https://luizfernandosg.github.io/regen-toolkit/`, deploys on push to `regen-toolkit-os` via `.github/workflows/deploy-pages.yml`).

**State:** framework machine shipped (125 tests green). Two `raw` KB corpora: `data/kb/` (the toolkit's 119 live articles reprocessed → **722 typed objects**, repo-data adapter) and `kb-handoff/` (Matty's Canonical_DB slice → **146**, kb-folder adapter). Site `src/pages/` has **summary** pages (`convergence`, `self-ingestion`, `handoff`, `framework`, `regen-toolkit-os`) that read KB `index.json` for counts/diffs — the reprocessed content is **not yet rendered as browsable content pages**. The 119 source articles are `src/content/docs/*.md` (Starlight). Verify: `git log --oneline -5`; `cd packages/toolkit-framework && npm test` (125 pass); `node packages/toolkit-framework/src/cli.mjs kb index --adapter repo-data --target .` (722).

---

## PROMPT 1 (MAIN) — Build the full live dev instance in the personal fork

> Build a **full live dev instance** of the toolkit site — the complete Astro build, but with the **framework-reprocessed content rendered as browsable pages, structured per the framework** — deployed live from Luiz's personal fork (`luizfernandosg`), so the team can review the reprocessed content **now**, without waiting on Heenal's repo migration to the RC org. This matches the 2026-07-16 meeting plan (a staging site to review the framework-processed version side-by-side vs the current build, graph view included, before any PR to `main`). See `memory/2026-07-16.md`.
>
> [paste shared context above]
>
> **The gap to close:** today the site shows the 119 source articles + *summary* pages about the machine. It does **not** render the 722 (+146) typed KB objects as content. Build that — the "what the site becomes" view.
>
> **Build:**
> 1. **Render the KB as browsable content**, structured per the framework (the 10 layers / object flow: Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution). Generate Astro routes (getStaticPaths / a content collection) from the KB YAML — `data/kb/<schema>.yaml` (repo-data) + `kb-handoff/objects/**` (kb-folder). Suggested sections:
>    - **Encyclopedia** (`encyclopedia-entry`) · **Concepts** (`concept-lineage`) · **Resource Atlas** (`resource` + `source-system` + `organization` + `person`) · **Claims & Evidence** (`claim-evidence`) · **Signals**, **Options**, **Tracks**, **Implementation Memory**, **Relationships** (`relationship-record`), **Public-Use Boundaries**.
>    - Each object → a page (or grouped list) showing its fields, **provenance** (`origin` + `source_lineage`), a **`raw` / under-review badge**, and links to related objects (via `relationship-record` + `related_*` arrays). Provenance version-stamping is first-class (per the 07-16 meeting).
>    - Index/browse pages **by type and by layer**, plus a graph/atlas overview (reuse `docs/canvases/the-machine.canvas` styling or the existing `/convergence` schema-map).
> 2. **Keep the 119 source articles too**, so the site supports side-by-side comparison (old article vs its reprocessed objects). Cross-link where an object's `provenance.origin` points at a `src/content/docs/*.md`.
> 3. **Nav + honesty:** add a Starlight sidebar group "Reprocessed content (dev · raw, under review)"; make the raw/review-gated status unmistakable everywhere (nothing is promoted/published).
> 4. **Deploy live from the fork:** `npm run build` (verify both default and `GITHUB_PAGES=true`), then `git push fork regen-toolkit-os` → confirm live at `https://luizfernandosg.github.io/regen-toolkit/`. (Optional: if a dedicated dev URL is wanted, set up a Netlify/Vercel deploy from the fork — but Pages is already wired and zero-setup; do that first.) **Do not touch `main`/prod or `origin`.**
>
> **Approach:** reuse the existing page layout/CSS (`src/layouts/Page.astro`, the `in-*` classes on the summary pages) and the base-aware `withBase` pattern. Check `packages/toolkit-framework/site/` for a site model. Read the KB YAML at build time (JSON imports survive Vite; for YAML, generate a JSON snapshot in a `prebuild` step like `scripts/gen-*` do, or read via a small Node script). Start with the largest/most-legible types (encyclopedia-entry 116, concept-lineage, resource) to get a walkable site fast, then fill in.
>
> **Definition of done:** a live URL where you can browse the reprocessed content by type + layer, each object shows provenance + raw status, the 119 articles are still there for comparison, and the build is deployed from the fork (not prod). Report the URL + what's rendered vs still stubbed. Plan it (brainstorm → writing-plans → subagent-driven) before building; it's a real site-build.

---

## PROMPT 2 (parallel) — Compare/validate the new instance vs the old build

> [paste shared context] Plan + build a **comparison/validation** between the framework-reprocessed dev instance (Prompt 1) and the current 119-article live build. Deliverables: a coverage map (which articles → which/how-many objects; any dropped or thinned content), a **relationship/graph-view diff** (what connections the framework surfaces that the flat article set didn't), a quality/faithfulness spot-check protocol (does the typed content preserve the source's meaning?), and the **named-reviewer checklist** (per-page sign-off, ~2–4 weeks) the 07-16 meeting specified. Output a report + a reusable checklist. This is the review gate before any PR to `main`. Don't ingest or deploy — this is analysis + process.

---

## PROMPT 3 (parallel) — Consolidate plans + finish Matty's DB (T3b)

> [paste shared context] Execute **T3b — full Canonical_DB ingestion**: sub-plan already written at `docs/plans/handoff-integration/2026-07-15-t3b-full-ingestion.md`. Ingest the full 6 canonical families (~2,689 rows) through the machine into `kb-handoff/`, guided by Matty's normalization sheets — now using the **T4 schemas** (Relationship Leads → `relationship-record`; person/org New-Object rows → `person`/`organization`; no more parking or resource-fallback). Then a bounded Discovery_Pool promotion. First, **consolidate the plan surface**: reconcile `framework-validation-pass`, `handoff-integration`, and `CONVERGENCE-PIPELINE` so there's one clear active spine (the sibling ReFi DAO `kms-koi-pipeline` is the model). Write the migration manifest (Guide DoD #15: every row accounted). Heavy multi-runner batch — plan the partition, keep provenance + born-rules, watch B5 vs Matty's 87 flags.

---

## PROMPT 4 (parallel) — Preserve Heenal's GitHub PM system through the migration

> [paste shared context] Before/around the repo migration to the Regen Coordination org, make sure **Heenal's project-management work on the GitHub repo is not lost**: issues, issue logs, labels/milestones, and any **GitHub Projects** boards + their mapped issues. Investigate what exists on the current repo (via `gh` against the repo that holds it — confirm the owner; `explorience/regen-toolkit` is `origin` but the meeting says the canonical is Heenal's account). Produce: an inventory of his issues/projects/labels; whether a GitHub **repo transfer** preserves them (it does for issues/projects within the same platform, but confirm for Projects v2 + cross-account); a **backup/export** (e.g. `gh issue list --json`, project export) as a safety net; and a short carry-over runbook so nothing is dropped when Hina transfers. Draft-and-present; don't mutate his repo.

---

_Push status: `regen-toolkit-os` is ahead of both `fork` and `origin` (this session + parallel-session commits). Pushing is the operator's call — but **Prompt 1 requires a push to `fork`** to deploy the dev instance._
