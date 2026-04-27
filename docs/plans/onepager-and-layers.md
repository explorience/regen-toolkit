---
title: "Regen Web3 Toolkit — org-os One-Pager + LAYERS.md"
project: regen-toolkit
date: 2026-04-25
status: completed
completed: 2026-04-26
related:
  - https://github.com/explorience/regen-toolkit/pull/310
  - docs/plans/public-sharing-pack.md
methodology:
  - "superpowers:writing-plans (this doc)"
  - "Pattern reference: docs/from-refi-dao/koi-integration-design.md §6 deliverable #7 — the one-pager template from the KOI design spec"
---

# Plan C — Org-OS One-Pager + LAYERS.md for the Toolkit

> **Status: completed 2026-04-26.** Executed directly on `feature/org-os-overlay`. Commits: `16f87b6` (ORG-OS.md + README link) and `e0f4fba` (LAYERS.md + cross-links from MASTERPLAN/IDENTITY).

> **Run after** PR #310 (`feature/org-os-overlay`) has settled. Either follow-up branch from `main`, or extend PR #310 if reviewers prefer to land everything together.

**Goal:** Produce two operator-facing reference docs in the toolkit repo:

1. **`docs/ORG-OS.md`** — operator one-pager. What is org-os, why the toolkit uses it, how to `/initialize`, where to go deeper. Single page, under 500 words body. Modeled on the KOI one-pager pattern (refi-dao-os).
2. **`docs/LAYERS.md`** — current state of the 8 layers. Owners, status, source-of-truth files, gaps, next steps. Living document, updated by layer owners as their layers evolve.

**Why now:** PR #310 introduces a lot of structure all at once (291 files, 8 layers, multiple skill collections). New contributors need a 5-minute entry point ("what is this overlay and how do I use it") and the master doc needs an at-a-glance status view that's easier to navigate than the 7,500-line `MASTER.md`.

---

## Pre-flight

- [ ] **Read the KOI one-pager spec** at `docs/from-refi-dao/koi-integration-design.md` §6 deliverable #7 — that's the canonical operator one-pager template the refi-dao team designed; mirror its tone and structure.
- [ ] **Read the toolkit's** `MASTERPLAN.md`, `IDENTITY.md`, `CLAUDE.md` — these are the inputs to summarize.
- [ ] **Confirm working directory:** `pwd` must be the toolkit repo.

---

## Task 1: Write `docs/ORG-OS.md` (the one-pager)

**Files:**
- Create: `docs/ORG-OS.md`

- [ ] **1.1** Draft the doc. Suggested structure (under 500 words body):

  ```markdown
  # org-os — One-Pager (Regen Web3 Toolkit)

  **org-os** is a coordination operating system overlay for organizations
  and projects — a structured repo layout for team coordination,
  meeting processing, decision tracking, and agent collaboration. The
  toolkit uses it to coordinate development around `docs/MASTER.md`
  (Matt's master doc).

  ## What it gives the toolkit

  1. **A canonical layout** — every contributor knows where meetings,
     decisions, and project state live (`packages/operations/`,
     `MEMORY.md`, `HEARTBEAT.md`).
  2. **A session lifecycle** — `/initialize` opens a session with a
     pre-rendered dashboard; `/close` wraps up with memory + commit.
  3. **Skills** — agent capabilities for processing meetings, scouting
     ideas, generating schemas, monitoring health.
  4. **Federation hooks** — peer instances (regen-coordination-os,
     bread-co-op-os) sync via `federation.yaml`. Future: KOI federation
     once refi-dao-os Wave 2 lands.

  ## How to start (operator)

  ```bash
  git clone --recurse-submodules https://github.com/explorience/regen-toolkit.git
  cd regen-toolkit
  npm install
  ```

  Then in Claude Code:

  ```
  /initialize
  ```

  This renders the dashboard (8 layers, projects, tasks, calendar,
  pipelines, federation), loads `docs/MASTER.md` as canonical, and
  surfaces the layer ownership state.

  Read `MASTERPLAN.md` for the full mandate, `IDENTITY.md` for
  ownership, and `LAYERS.md` for the current per-layer status.

  ## How to start (contributor on a specific layer)

  See `docs/LAYERS.md` — find your layer, follow the "Working on this
  layer" section.

  ## Why org-os, not just a README

  - **Multi-contributor** — distributed authorship, eight layers, no
    single project lead. The structure is what holds it together.
  - **Master doc as canonical** — `docs/MASTER.md` is the spec. Every
    decision traces back to it (or updates it intentionally).
  - **Agent-friendly** — skills + frontmatter + structured registries
    make AI assistance reliable; agents read the same files humans do.

  ## How it relates to the broader stack

  - **Knowledge site** (Astro/Starlight at `src/`, `content/`,
    `public/`): public-facing artifact. The site is what ships.
  - **org-os overlay** (root MDs, `data/`, `packages/operations/`,
    `skills/`): coordination layer. Co-located with the site, not on
    top of it.
  - **External skill collections** (`.agents/skills/` submodules):
    superpowers (agentic methodology) + karpathy-skills (LLM coding
    heuristics). Loaded via Claude Code.
  - **KOI federation** (planned, Wave 2 of refi-dao-os): meetings and
    knowledge will eventually flow through KOI; the org-os layout is
    designed to be sensor-friendly.

  ## Where to go deeper

  - `MASTERPLAN.md` — full development mandate
  - `IDENTITY.md` — leads, layer ownership, governance
  - `LAYERS.md` — per-layer status and next steps
  - `docs/MASTER.md` — the master doc itself
  - `CLAUDE.md` — agent operating instructions
  - `AGENTS.md` — session startup sequence

  ## Status (2026-04-25)

  - org-os overlay landed in PR #310
  - 8 layers documented in `IDENTITY.md`; `LAYERS.md` tracks status
  - Bi-weekly Thursday planning call processed via `meeting-processor`
  - KOI federation: planned, gated on refi-dao-os Wave 2
  ```

- [ ] **1.2** Trim ruthlessly. Body under 500 words.
- [ ] **1.3** Verify cross-links resolve (`MASTERPLAN.md`, `IDENTITY.md`, `LAYERS.md`, `docs/MASTER.md`, `CLAUDE.md`, `AGENTS.md` all exist).
- [ ] **1.4** Add link to `docs/ORG-OS.md` from `README.md` (one line in the "Repository Structure" section).

## Task 2: Write `docs/LAYERS.md`

**Files:**
- Create: `docs/LAYERS.md`

- [ ] **2.1** Pull the 8-layer table from `IDENTITY.md` as the starting structure. For each layer, populate:

  ```markdown
  ## Layer N — <Name>

  **Owner:** <name(s) per IDENTITY.md>
  **Status:** <stub | partial | active | mature>
  **Source of truth:** <file paths in this repo>

  ### What it is
  <1-2 sentences from the master doc>

  ### Current state
  <what exists now — extracted artifacts, articles published, etc.>

  ### Open questions
  <unresolved design calls or content gaps>

  ### Working on this layer
  <how to contribute: which files to touch, who to coordinate with, how to PR>
  ```

- [ ] **2.2** Populate from existing artifacts:
  - **Layer 1 — Resource Graph:** Owner Brandon + curator. Source: `docs/MASTER.md` resource sections + 11+ URL lists pending lift to `data/resources.yaml`. Status: partial. Open: lift the URL lists.
  - **Layer 2 — Encyclopedia:** Owner Heenal. Source: `src/content/docs/`. Status: active (67 published / 254 inventory). Open: Phase 2 article pipeline.
  - **Layer 3 — Ontology:** Owners Matt + Rather + Luiz. Source: `data/ontology/*.yaml`. Status: partial (Rather's adoption pending propagation). Open: V1 vs V2a vs V2b resolution.
  - **Layer 4 — Option Library:** Owner Luiz (currently unowned in practice). Source: `data/option-library.yaml`. Status: stub-to-partial. Open: real owner needed.
  - **Layer 5 — Deployment:** Owner Luiz + Durgadas. Source: `data/deployment-requirements.yaml` + `docs/CSIS.md`. Status: partial (CSIS strict conformance posture set; standards integration in progress). Open: Dunbar + six-directional encoding.
  - **Layer 6 — Tracks:** Owner Heenal. Source: 5 learning paths in `src/content/docs/`. Status: active. Open: expand to 8 paths.
  - **Layer 7 — Implementations:** Unowned. Source: not yet captured. Status: stub. Open: identify case studies.
  - **Layer 8 — Feedback & Evolution:** Unowned. Source: `data/feedback-process.yaml` (5-step loop). Status: stub. Open: real owner needed.

- [ ] **2.3** Add a "How to update this doc" section: "Layer owners update their own section. Major status changes also reflected in `MEMORY.md` and `HEARTBEAT.md`."

- [ ] **2.4** Cross-link from `MASTERPLAN.md` and `IDENTITY.md` ("see `docs/LAYERS.md` for current per-layer status").

## Task 3: Validate cross-links + commit

- [ ] **3.1** Verify all referenced files exist (grep for `](.*\.md)` patterns and `ls` each).
- [ ] **3.2** Commit each doc separately (cleaner history):
  ```bash
  git add docs/ORG-OS.md README.md
  git commit -m "docs: add org-os one-pager (operator entry point)"

  git add docs/LAYERS.md MASTERPLAN.md IDENTITY.md
  git commit -m "docs: add LAYERS.md (per-layer status) + cross-links"
  ```
- [ ] **3.3** Push.

---

## Acceptance criteria

- [ ] `docs/ORG-OS.md` exists, body under 500 words, all cross-links resolve
- [ ] `docs/LAYERS.md` exists, all 8 layers populated with owner/status/source/state/open/contributing
- [ ] README.md links to `docs/ORG-OS.md`
- [ ] `MASTERPLAN.md` and `IDENTITY.md` link to `docs/LAYERS.md`
- [ ] An operator with no prior context can read ORG-OS.md in 5 minutes and know how to `/initialize`
- [ ] A layer contributor can find their layer in LAYERS.md and know what to do next

---

## Out of scope

- Layer-specific deep specs (those live in `docs/MASTER.md`)
- Layer history (use `MEMORY.md` for decisions, `memory/` for sessions)

---

## Estimated effort

- ORG-OS.md: 30–45 min (mostly polishing)
- LAYERS.md: 1–2 hours (8 layers, real content per layer)
- **Total: 2–3 hours**

---

## References

- Master doc: `docs/MASTER.md`
- IDENTITY.md (8-layer ownership table source)
- One-pager pattern: `docs/from-refi-dao/koi-integration-design.md` §6 deliverable #7
- PR: https://github.com/explorience/regen-toolkit/pull/310
