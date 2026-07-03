# Toolkit Framework — "The Machine" Iteration (0.2)

> **Design spec · 2026-07-04.** Approved through brainstorming with the operator. Turns `packages/toolkit-framework` from a validating skeleton (0.1.0-beta.1: 21 schemas, kernel, CLI, skill specs, 38/38 tests) into a **functional end-to-end ingestion machine** — the framework-as-package direction adopted at the [2026-07-02 planning call](../../../packages/operations/meetings/260702%20Regen%20Web3%20Toolkit%20Planning%20Call.md).
>
> **One line:** drop the framework into a repo → agents process unstructured resources per the framework → a validated, ontology-structured, provenance-complete knowledge base — with storage as a separable target.

## 1. Context & goal

The 2026-07-02 biweekly adopted **framework-as-package**: a portable module added to any repo that ingests unstructured resources into an ontology-structured KB, articulated with the live site. The June build produced the *skeleton* (schemas, semantic kernel, validators, skill specs); this iteration builds the *machine*: the ingestion pipeline, the storage seam, the operating skills, portability, and the first real corpora.

Design constraints from the call:

- **Ingestion ≠ storage** (Durgadas) — must be structurally separable, not welded.
- **Agents do the semantic work** — the group operates through agent runtimes (Claude Code/Cursor); no API-key infra.
- **Testable fast** — exercised on real content immediately; Gen Brasil Commons (Koi) is the headline acceptance case *when it lands*, never a blocking dependency.
- **Frame-1 language warning** (Durgadas) — audit "governance/accountability"-type terms; CSIS stays a separable overlay (R7).

## 2. Decisions (brainstorm outcomes)

| # | Question | Decision |
|---|---|---|
| 1 | Scope | Make the existing `packages/toolkit-framework` the functional machine **and** consolidate (`framework/` docs fold into the package; extract to a standalone repo this iteration). No restart. |
| 2 | Ingestion runtime | **Agent-native with the work-order seam**: package ships executable skills; agents produce candidate typed objects only; **only the CLI writes storage**. Headless/API mode is a later add-on. |
| 3 | Proving ground | Three tiers: this repo's own content (first full corpus — Heenal's site + unprocessed sources) → **ReFi DAO** podcasts/blog (first external adoption, = P9/SP11) → **ReFi BCN** (second adoption). **Gen Brasil = acceptance case whenever Koi delivers.** |
| 4 | Storage | Adapter interface with **two shipping adapters** (`repo-data`, `kb-folder`) + a **`geo` documented stub** marking the seam for Rather's Geo Protocol SDK. |
| 5 | Distribution | **Build here, extract at the end of the weekend sprint**: one-way publish to a public repo (`luizfernandosg/toolkit-framework` until org perms; `@regen-commons` scope reserved) + `cli init`; adoptions consume the public repo — portability proven by the acceptance path. npm publish deferred. |
| 6 | org-os-kms | Promoted from scaffold to **real module, built in parallel** — developed against the ReFi DAO adoption, not speculatively. Agnostic core stays org-os-free. |
| 7 | Site | **Thin slice now (B), growing into the dev environment (C)**: `/framework` page gains an ingestion view; both pages verified against the master doc; the C flow (process → preview graph → publish) stays additive on the same JSON-LD export. |
| 8 | Build sequencing | **Vertical slice first, then parallel tracks** (machine depth ∥ adoption) — keystone-first + dialectical, per June's FEEDBACK-LOOPS discipline. |

## 3. Architecture — the package shape and the three seams

```
packages/toolkit-framework/
  src/
    index.mjs, cli.mjs            existing (CLI gains: init · ingest · store · review · kb)
    workorder.mjs                 NEW — work-order lifecycle (create/claim/fulfill/accept)
    storage.mjs                   NEW — the adapter interface + registry
    adapters/
      repo-data.mjs               NEW — writes into a host repo's data/ tree (org-os pattern)
      kb-folder.mjs               NEW — self-contained kb/ dir: objects + derived index + JSON-LD export
      geo.mjs                     NEW — documented stub (the seam Rather's SDK fills; throws with seam docs)
    compatibility.mjs, invariants.mjs, lift.mjs   existing (lift = one source type: csv-crosswalk)
  schemas/
    work-order.yaml               NEW — the contract is itself a schema (22nd)
    …21 existing
  skills/                         see §4 — 4 new, 3 existing (1 extended)
  docs/meta/                      framework/ analysis docs fold in here (COVERAGE, GAPS, RECONCILIATIONS, …)
  templates/, examples/, test/    existing, extended
```

**The three seams (the design's core):**

1. **Skill ↔ CLI = the work-order contract.** Agents never touch storage. `cli ingest prepare` decomposes sources into work orders; the agent fulfills them by producing *candidate object files*; `cli ingest accept` validates. The agent is replaceable (Claude Code today, API script tomorrow, a human always).
2. **Ingestion ↔ storage = the adapter interface.** Accepted objects flow to whichever adapter the instance configured. Durgadas's separation, made structural — proven by two real targets.
3. **Data ↔ site = the KB index + JSON-LD context.** The site and any graph/retrieval consumer (Rather's layer) read derived indexes, never pipeline internals.

Root `framework/` shrinks to a one-paragraph pointer README; the package becomes fully self-describing. `packages/org-os-kms` stays a separate package (the replaceable org-os binding).

## 4. Skill roster (7)

| Skill | Status | Does |
|---|---|---|
| `ingest` | NEW, flagship | Orchestrates the pipeline: claims work orders → reads sources → produces candidate typed objects → hands to CLI. Calls `register-source` / `map-ontology` as sub-steps. |
| `register-source` | NEW | The sourcing/provenance skill. Every ingestion starts here: `source-system` entry (return_path, reuse_conditions, how_to_credit, currentness — K2), provenance chain (source → work order → object — K5), referencing discipline (claims get `claim-evidence` entries). |
| `map-ontology` | NEW | The external-KB skill. Derives a foreign corpus's implicit ontology, maps it onto the semantic kernel, proposes namespaced extensions with `maps_to_core`, emits a crosswalk file. How the starter crosswalks get real; how Gen Brasil's conflict-mediation protocol gets typed instead of shoehorned. |
| `review-promote` | NEW | Operates the review queue: guided human review, promotes K1 maturity axes, enforces AI-assisted ≠ human-reviewed. "Raw is never auto-promoted" gets an operator. |
| `capture-and-route` | existing | Exercised + revised against real content (single-lead capture; `ingest` is its batch big sibling). |
| `compose-journey` | existing | Unchanged this iteration (feeds the B→C site path). |
| `csis-review` | existing, extended | Gains a **frame-language-audit mode** (Frame 1 terms). Inside csis-review so CSIS stays the separable overlay per R7. First exercise target: the framework's own docs. |

Typical flow: `register-source` → (`map-ontology` if the source is foreign-shaped) → `ingest` → `review-promote`. Deferred (YAGNI until an adoption demands it): evolution-loop operator, retrieval/query skill.

## 5. Data flow — the pipeline and the work-order contract

```
source artifact(s)                       (file, dir, URL list, CSV, transcript, book chapter…)
   │  cli ingest prepare <path> ──────── scans, classifies source type, chunks large sources,
   ▼                                     emits work orders (.workorders/wo-*.yaml, status: open)
work orders                              ← SEAM 1. Schema'd (work-order.yaml): source ref+hash ·
   │                                       target schemas · instructions · status:
   │  agent runs `ingest` skill           open→claimed→fulfilled→accepted/rejected
   ▼
candidate objects                        YAML conforming to the 21 schemas; born with
   │                                     ai_assisted: true, maturity: raw, full provenance chain
   │  cli ingest accept <wo-id> ──────── validates: schema + invariants + kernel (maps_to_core);
   ▼                                     atomic — accepts fully or stays open with error notes
review queue                             review states on K1 axes; review-promote operates it;
   │                                     raw NEVER auto-promotes
   │  cli store --adapter <name> ─────── ← SEAM 2: ingestion ≠ storage
   ▼
storage target                           repo-data | kb-folder | geo (stub)
   │  derived, never source-of-truth
   ▼
KB index + JSON-LD export                ← SEAM 3: site pages, graph/retrieval consumers
```

Properties: **idempotent** (work orders keyed by source hash — re-running `prepare` never duplicates) · **resumable** (orders are files with status; crashed sessions pick up) · **provenance-complete** (every stored object traces to source + work order + fulfilling agent) · **nothing enters the KB unvalidated** (invalid agent output leaves the order open with error notes; never a partial write).

## 6. Track B — adoption, org-os-kms, extraction, site slice

**org-os-kms (scaffold → real):**

- `init` — the org-os layer over the framework's agnostic `cli init`. The framework's `cli init` stamps the substrate into *any* repo (`kb/` or `data/` mapping, `.workorders/`, `kms.yaml`-style config: storage adapter, source-registry location); `org-os-kms init` calls it, then adds the org-os wiring (skills into the instance's skill surface, registries, hooks below).
- **Registry bridge** — org-os `data/*.yaml` registries ↔ framework schemas (instance data counts as KB content; framework objects surface in org-os tooling).
- **Lifecycle hooks** — `/initialize` surfaces KB state (counts, review queue, open work orders); `/close` records ingestion sessions to daily memory.
- **Federation** — peers as `source-system` entries with return paths; RegenOS declaration.

Every kms feature exists because an adoption needed it.

**Adoptions:** self-ingestion of this repo (week 1) → ReFi DAO (`refi-dao-os`: kms init → register podcast/blog sources → ingest slice ≈5–10 items → review → KB visible in its dashboard) → ReFi BCN (week 2, threads with the Andrea invite). Each produces an **adoption report**: every friction point becomes a reconciliation or fix (Loop 3).

**Extraction (Sunday, once the contract suite locks the seams):** one-way publish of `packages/toolkit-framework` → public repo via sync script; monorepo stays the dev home. Consumption: `npx degit`/clone + `cli init`, documented in GETTING-STARTED. Adoptions consume the public repo from day one.

**Site thin slice (B→C):** `/framework` page gains an **ingestion view** — KB counts by type, review-state breakdown, open work orders, recently accepted objects — read from the derived KB index (seam 3), same live-data pattern the page already uses. Both pages get the verify-against-master-doc pass (frame-language audit run on them too). C (process → preview graph → publish, gated on Afo's dev environment) is additive later on the same JSON-LD export; no rework.

**Consolidation:** `framework/*.md` → `packages/toolkit-framework/docs/meta/` (git mv, history preserved); root `framework/README.md` remains as pointer. COVERAGE/GAPS/RECONCILIATIONS stay living documents — adoption reports feed them.

## 7. Error handling

- Adapter writes atomic per object (temp-file + rename); `store` re-runs idempotent.
- KB index always **rebuildable from the objects** — derived state deletable with zero data loss.
- Rejected work orders retain validator error notes as retry instructions.
- Every CLI failure exits non-zero with per-field messages — agents and humans get the same diagnostics.
- Frame-1/CSIS: ingestion tags `high_risk` items for review rather than blocking (CSIS remains optional overlay).

## 8. Testing

TDD throughout (June discipline; `superpowers:test-driven-development`):

- **Adapter contract suite** — one suite runs against *both* adapters (geo stub asserts it throws with seam docs). The suite is the interface's spec.
- Work-order lifecycle tests (every legal/illegal state transition) · idempotency + resume tests · provenance-chain completeness tests.
- **Pipeline integration test**: fixture source → prepare → fixture agent output → accept → store → index, on both adapters.
- Skills keep the June frontmatter/agnosticism tests **plus** each new skill ships a worked example produced by actually running it.
- Existing 38 tests stay green. Acceptance tiers: self-test (this repo's own transcript) → toolkit corpus → ReFi DAO slice → Gen Brasil when it lands.

## 9. Sequencing & definition of done

| Phase | When | Delivers |
|---|---|---|
| **Weekend sprint — the machine** | Fri 2026-07-04 (tonight) → Sun 07-06 | **Fri night — vertical slice:** work-order schema + minimal `prepare`/`accept`/`store` + kb-folder adapter + `ingest` skill v0; one real transcript through the whole pipe. **Sat — machine depth I:** repo-data adapter + shared contract suite, review queue + `review-promote`, `register-source`. **Sun — machine depth II:** `map-ontology`, csis-review frame-language mode, `framework/` → `docs/meta/` fold-in, GETTING-STARTED rewrite, **extraction to public repo + `cli init`**. All tests green → tag `0.2.0`. |
| **Week 1 — toolkit content + ReFi DAO start** | Mon 07-07 → Fri 07-11 | **Self-ingestion of this repo's content** (Heenal's site: articles, journeys, resource DB + unprocessed sources) — doubles as the gap-diff vs the master doc the call asked for. Site ingestion view live; both pages verified. **ReFi DAO begins:** org-os-kms real module, drop-in consuming the public repo, corpus scout + first slice. |
| **Week 2 — ReFi DAO build-out + ReFi BCN** | Mon 07-14 → | ReFi DAO knowledge commons build-out; **ReFi BCN drop-in begins**; adoption reports → reconciliation batch. **07-16 biweekly demo.** Gen Brasil slots in whenever Koi delivers. |

**DoD (surfaced at the 07-16 biweekly):**

1. In `refi-dao-os`: init from the public repo → ingest real podcast/blog content → validated, provenance-complete objects in its KB → visible in a dashboard/page.
2. Both adapters passing the shared contract suite.
3. Adoption report(s): gaps → reconciliations.
4. This repo's `/framework` page rendering live ingestion state; both pages verified against the master doc.

**Machine DoD (Sunday night):** vertical slice + machine depth complete, tests green, extracted, tagged `0.2.0`.

## 10. Feedback loops, risks, non-goals

**Absorbing Matty's master-doc iteration** (he owes one; explicitly incorporating the Frame Language Analyzer + Idea Processor): non-gating. When it lands → rerun the coverage sweep → new reconciliation batch → COVERAGE/GAPS refresh. Schemas evolve; the seams don't.

**Risks:** ReFi DAO corpus accessibility unknown (scout first; fallback: any real external corpus, e.g. the public ReFi podcast feed) · Gen Brasil is upside-only · Afo's permissions gate nothing (public-repo + fork-pages path already works) · weekend compression — mitigated by the day-3→day-1 vertical slice: the demo exists from the first night and only thickens.

**Non-goals (unchanged from the build plan):** reward/contribution mechanism (design-seed only) · on-chain substrate (Geo adapter is a stub, not an integration) · broad public contribution flows · headless/API ingestion mode.

---

*Follows: implementation plan via `superpowers:writing-plans` → execution per wave (worktree, TDD, subagent-driven where parallel).*
