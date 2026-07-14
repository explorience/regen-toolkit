# Handoff Integration — Jul 16 Implementation Plan (T1 · T2 · T3a · T5)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or executing-plans. Checkbox (`- [ ]`) steps.

**Goal:** Ship for the Thu Jul 16 call: intake + orientation (T1), the framework↔Database_Spec crosswalk + Definition-of-Done conformance (T2), a real ingestion slice of Matty's curated Canonical_DB through the machine (T3a), and an agent-setup pack for Matty (T5).

**Architecture:** Read-only handoff source at `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/`. Docx already extracted to `.tmp/handoff-txt/`. Xlsx read via python+openpyxl. The ingestion reuses the framework machine (`ingest prepare` → subagent decompose → accept-gate → `store` to `data/kb/`, repo-data adapter) exactly as the framework-validation-pass did. All external artifacts draft-and-present.

**Tech Stack:** python3+openpyxl (xlsx→csv), the toolkit-framework CLI, markdown, the Astro site.

**Working dir:** `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit`. ⚠️ Vault safety: no stash/clean/reset; scoped `git add`. Never modify `docs/MASTER.md` or anything under the handoff folder.

**Design:** `docs/plans/handoff-integration/2026-07-14-handoff-integration-design.md` · **Master plan:** `docs/plans/handoff-integration.md`

---

## T1 — Intake & orient

### Task T1.1: Register the iteration + archive the previous master pointer

**Files:** Create `docs/HANDOFF-CHANGES-2026-07.md`; modify `HEARTBEAT.md`, `docs/plans/QUEUE.md`.

- [ ] **Step 1: Write `docs/HANDOFF-CHANGES-2026-07.md`** — the orientation/diff doc. Sections: (1) what arrived (the package + authority hierarchy, 7 levels); (2) what's settled vs open (from Guide §1); (3) the 6-Part / §0–43 target ToC (from Master_Spec §4) + the current→target section map; (4) **the convergence map** (the table from the design §2 — Matty's structure ↔ the framework); (5) the data inventory (6 canonical families + Discovery_Pool + annexes-redundant); (6) division of labor (Guide §10); (7) pointers into `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/`. Keep it a map, not a restatement — it points at the authoritative files.

- [ ] **Step 2:** Do NOT touch `docs/MASTER.md` (Matt's; his 2026-06-15 iteration stays canonical until he hands off the final). Note in `HANDOFF-CHANGES-2026-07.md` that the handoff `Master_Draft.docx` is *intake source*, not the new canonical master — the 6-Part refactor awaits Matty's next review cycle.

- [ ] **Step 3:** Add a `### Handoff Integration — Matty's Jul 2026 iteration` section to `HEARTBEAT.md` (under Active Tasks, top) pointing at `docs/plans/handoff-integration.md`, listing T1–T5 with T1/T2/T3a/T5 as this-week. Add the master plan to `docs/plans/QUEUE.md` `## Active` (top), and note `resource-db-v3-lift` is now also superseded by `handoff-integration` (it was already archived).

- [ ] **Step 4: Commit.**
```bash
git add docs/HANDOFF-CHANGES-2026-07.md HEARTBEAT.md docs/plans/QUEUE.md docs/plans/handoff-integration.md docs/plans/handoff-integration/
git commit -m "handoff(T1): intake + orient Matty's Jul 2026 iteration (master plan + changes map)"
```

---

## T2 — Crosswalk + Definition-of-Done conformance (the flagship)

### Task T2.1: The §40 crosswalk (framework ↔ Database_Spec)

**Files:** Create `docs/reports/2026-07-15-framework-masterdoc-crosswalk.md` + `data/crosswalks/handoff-database-spec.yaml`.

- [ ] **Step 1: Read the object model** — `.tmp/handoff-txt/Database_Spec.txt` Part II (Production Object Model) + Part III (status/vocab rules). List Matty's object families, shared fields, and the 8 status dimensions.

- [ ] **Step 2: Write the crosswalk YAML** — `data/crosswalks/handoff-database-spec.yaml`: for each Database_Spec object family → the framework schema it maps to (with `maps_to` + notes); for each of Matty's 8 status dimensions → the framework axis/flag (or `GAP` if unmodelled); for each migration zone (A/B/C/D) → the framework maturity/public-use equivalent; for the normalization layer → the framework crosswalk/dedup mechanism. Mirror the shape of `data/crosswalks/regen-toolkit.yaml`.

- [ ] **Step 3: Write the crosswalk report** — `docs/reports/2026-07-15-framework-masterdoc-crosswalk.md`: the human-readable §40 crosswalk (families, status, zones, agents/AI-workflows ↔ framework skills), the convergence narrative, and the **3 status-dimension gaps** (currentness, confidence, maintenance) + object-family gaps (branch/backlog/decision, publication-system↔artifact) flagged for T4.

- [ ] **Step 4: Commit.**
```bash
git add docs/reports/2026-07-15-framework-masterdoc-crosswalk.md data/crosswalks/handoff-database-spec.yaml
git commit -m "handoff(T2): §40 framework ↔ Database_Spec crosswalk + gap list"
```

### Task T2.2: Definition-of-Done conformance report

**Files:** Create `docs/reports/2026-07-15-definition-of-done-conformance.md`.

- [ ] **Step 1:** Take the Guide's 15-item Definition of Done (§12) verbatim as a checklist. For each, score the framework: ✅ demonstrated (with concrete evidence — e.g. #1 idempotent ← the B5 guard, 65 collisions caught 2026-07-14; #9 merge inspectable/reversible ← the review-promote we ran; #13 public-use exposes only approved fields ← public-use-boundary + Zone D; #14 AI-involvement measurable ← ai_assisted flag + the 722-object run), 🟡 partial (what's missing), or ⬜ not yet. Cite the framework-validation-pass artifacts as evidence.

- [ ] **Step 2:** Add a short "Do NOT optimize for" section (Guide §12) confirming the framework's discipline matches (no universal resource table — distinct object families; no auto authority/trust scores; no recommendation UI before review exists).

- [ ] **Step 3: Commit.**
```bash
git add docs/reports/2026-07-15-definition-of-done-conformance.md
git commit -m "handoff(T2): Definition-of-Done conformance — framework scored vs Guide §12 (15 items)"
```

---

## T3a — Real ingestion slice (the "first prototype corpus")

### Task T3a.1: Extract the slice from Canonical_DB → stageable CSV/markdown

**Files:** Create `.tmp/handoff-slice/*.csv`; create `data/kb/_handoff-slice-manifest.yaml`.

- [ ] **Step 1: Export the 6 canonical-input sheets to CSV** with python+openpyxl from `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/02_Core/Canonical_DB.xlsx` → `.tmp/handoff-slice/`: `Source-System Cards` (all 67), and a bounded sample from each of `New Objects` (~30, spanning object types), `Option Candidates` (~15), `Claims and Cautions` (~15), `Implementation Memory` (~15), `Relationship Leads` (~20). Also export **one merge pilot** cluster (`GAIAI` or `OpenCivics` sheets) to show dedup/merge.

- [ ] **Step 2: Also export the normalization config** the mapper needs: `Object Type Crosswalk`, `Relationship Predicate Map`, `Controlled Vocabularies`, `Normalization Flags` → `.tmp/handoff-slice/_norm/`. These guide typing + dedup (and demonstrate the alignment with the framework crosswalk + B5 guard).

- [ ] **Step 3: Write `data/kb/_handoff-slice-manifest.yaml`** — the slice definition + rationale (which sheets, row counts, which merge pilot, coverage of the Guide §8 prototype-corpus checklist: ≥3 source systems + 1 publication system + 1 knowledge-garden + 1 funding system + 1 ecological system + options/claims/relationships/impl-cases + a Concept/Track/Deployment).

- [ ] **Step 4: Verify + commit** the manifest (not the `.tmp` CSVs — those are scratch).
```bash
git add data/kb/_handoff-slice-manifest.yaml
git commit -m "handoff(T3a): first-prototype-corpus slice manifest from Canonical_DB"
```

### Task T3a.2: Ingest the slice through the machine

- [ ] **Step 1: Baseline** — snapshot `data/kb/index.json` → `data/kb/_handoff-baseline-index.json` (current total is 722 from the article run; the handoff slice adds to it — or use a separate target dir `data/kb-handoff/` if you want the handoff corpus isolated from the article corpus; **decide and record in the manifest**. Recommended: separate `--target` dir so the two corpora stay distinct, matching Matty's "distinct object families / don't collapse into one table").

- [ ] **Step 2: `ingest prepare`** the slice CSVs → work orders (`node packages/toolkit-framework/src/cli.mjs ingest prepare .tmp/handoff-slice`). Verify N work orders open.

- [ ] **Step 3: Ingest via subagents** — one runner per sheet-group, using the `ingest` skill, **guided by the exported normalization config** (type via the Object Type Crosswalk, predicates via the Predicate Map, honor the Normalization Flags for known duplicates). Each row → typed object with `provenance.origin` = `Canonical_DB.xlsx#<sheet>!<row>` and `source_lineage` preserving the canonical_id/RKC id. Born-rules apply (raw · ai_assisted · provenance). Verify all reach `accepted`.

- [ ] **Step 4: `store`** → verify the index jump + **watch the B5 collisions** (the merge pilot + the 87 known dup-flags should produce real collisions the guard preserves — the demo moment: "Matty's normalization flagged 87 dups; the machine caught the same class automatically"). Commit `data/kb*` + `.workorders/`.
```bash
git add data/kb-handoff/ .workorders/ data/kb/_handoff-baseline-index.json
git commit -m "handoff(T3a): first-prototype-corpus ingested through the machine (Canonical_DB slice)"
```

### Task T3a.3: Surface it — page + honest diff

**Files:** Create `src/pages/handoff.astro` (or extend `self-ingestion.astro`); create `docs/reports/2026-07-15-handoff-slice-diff.md`.

- [ ] **Step 1:** Add a `/handoff/` page (mirror `src/pages/self-ingestion.astro` patterns — Page layout, base-aware `withBase`, JSON import of the handoff index) showing before/after + the family breakdown + the merge/dedup story. Honest framing: a *prototype corpus* from Matty's curated DB, not the full 2,689-row migration.

- [ ] **Step 2:** Write `docs/reports/2026-07-15-handoff-slice-diff.md` — per-family counts, the merge-pilot result, how the machine's dedup matched Matty's `Normalization Flags`, and the caveats (slice, all raw, review-gated).

- [ ] **Step 3:** `npm run build` (both default + `GITHUB_PAGES=true`); verify the page. Commit. **Present before pushing/deploying** (draft-and-present).
```bash
git add src/pages/handoff.astro src/data/*handoff* docs/reports/2026-07-15-handoff-slice-diff.md astro.config.mjs
git commit -m "handoff(T3a): /handoff page + slice diff report (prototype corpus)"
```

---

## T5 — Fit + the call

### Task T5.1: Agent-setup pack for Matty

**Files:** Create `docs/onboarding/operate-the-toolkit-agents.md`.

- [ ] **Step 1:** Write a concise onboarding guide for Matty to run the agents himself (his explicit ask): install Claude Code (or Cursor); clone the repo; `/initialize`; the ingest loop (`ingest prepare` → the `ingest` skill → review-promote); the safety rails (draft-and-present, review gate, born-rules). Reference `packages/toolkit-framework/docs/GETTING-STARTED.md`. Tailor to a non-CLI-native operator — "fire up the engine and feed it," step by step. Keep it draft — Luiz walks him through it live.

- [ ] **Step 2: Commit.**
```bash
git add docs/onboarding/operate-the-toolkit-agents.md
git commit -m "handoff(T5): agent-setup onboarding pack for Matty"
```

### Task T5.2: Call framing + re-anchor plans

**Files:** Create `docs/briefings/2026-07-16-toolkit-call-brief.md`; modify `docs/plans/CONVERGENCE-PIPELINE.md`.

- [ ] **Step 1:** Write the call brief — the convergence story (you spec'd it, we built it: the DoD conformance + crosswalk), the live `/self-ingestion` (722) + `/handoff` (prototype corpus) pages, the capital proposal as decision #5's schema side, the open decisions to ratify (design §8), and the agent-setup offer. Draft-and-present.

- [ ] **Step 2:** Add a pointer in `docs/plans/CONVERGENCE-PIPELINE.md` noting P2 (resource lift) execution → `handoff-integration` T3; keep it as the strategic map.

- [ ] **Step 3: Commit + present the whole Jul-16 package to the operator** (pages to deploy, capital proposal + crosswalk + brief to share with Matty — draft-and-present; nothing sent without go).
```bash
git add docs/briefings/2026-07-16-toolkit-call-brief.md docs/plans/CONVERGENCE-PIPELINE.md
git commit -m "handoff(T5): Jul 16 call brief + convergence-pipeline re-anchor"
```

---

## Out of scope for Jul 16 (do NOT start)

- **T3b** full Canonical_DB ingestion (2,689 rows) + Discovery_Pool promotion — its own plan, deterministic mapper guided by the normalization sheets, after the call.
- **T4** framework evolution (status dimensions, object families) — after the crosswalk gaps are ratified.
- **Master narrative** 6-Part/§0–43 refactor — awaits Matty's next review cycle.
- Annex diffing — the annexes are redundant snapshots; skip.

## Verification (Jul 16 readiness)

- [ ] Crosswalk (report + YAML) + DoD conformance committed; gaps flagged for T4.
- [ ] Real slice ingested through the machine into `data/kb-handoff/`; index jumped; B5 collisions observed vs Matty's dup-flags.
- [ ] `/handoff` page builds (both bases) + slice diff report committed.
- [ ] Agent-setup pack + call brief drafted (draft-and-present).
- [ ] `docs/MASTER.md` untouched; handoff folder untouched; nothing deployed/sent without operator go.
