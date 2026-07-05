# org-os-kms — Per-Instance Adoption & Data-Processing Plan

**Date:** 2026-07-05
**Status:** Planned (execute per-instance, later, directly in each instance)
**Prereq:** `@org-os/kms` is built + green (44 tests) at `regen-toolkit/packages/org-os-kms/`; see the design spec `2026-07-05-org-os-kms-design.md` and implementation plan `2026-07-05-org-os-kms-implementation.md`.

## Why this is per-instance

The module is built and installed (available). **Actual data processing — ingesting each org's real content into its knowledge commons — happens in each instance directly, not as a one-off here.** Each org owns its sources, its review, and its registries. This plan is the runbook every instance follows; it is *not* run in regen-toolkit as a batch.

**Every real-data write is draft-and-present:** run the step, show `git diff`, get the operator's approval, then commit. Never auto-commit an instance's `data/*.yaml` or site content.

## Instances (adoption order)

Recommended sequence — start with the org that has the clearest, richest source feed (per framework GAPS.md: *"develop against the ReFi DAO adoption"*):

1. **refi-dao-os** (`03 Libraries/refi-dao-os/`) — podcasts + blog. The first real adoption; contribute learnings back to the framework.
2. **regen-toolkit** (this repo) — its own 254-article inventory / master-doc extractions; dogfood locally.
3. **refi-bcn-os**, **refi-med-os**, **regen-coordination-os** — as each has content ready.

The 2-node federation (RegenOS) is proven once refi-dao-os and one other are both live and registered as peers.

---

## Part A — Install org-os-kms into an instance

An instance needs two packages resolvable: `@org-os/kms` and its dependency `@regen-commons/toolkit-framework` (org-os-kms imports the framework via the sibling path `../../toolkit-framework/src/…`). Pick ONE install mode:

- **Mode 1 — co-located siblings (works today, zero-build):** place both `toolkit-framework/` and `org-os-kms/` under the instance's `packages/` (siblings), exactly as in regen-toolkit. The relative import resolves; no npm needed. Simplest, but each instance carries a framework copy (drift managed by re-promoting from the canonical home).
- **Mode 2 — published dependency:** publish `@regen-commons/toolkit-framework` to a registry, change `org-os-kms/src/framework.mjs`'s specifiers to the bare package name (the shim exists for exactly this — one file), and `npm install` it in each instance. Cleaner long-term; requires a publish pipeline.

Until the framework is published, **Mode 1** is the path. Instances pull both packages from the canonical org-os home (`03 Libraries/org-os/packages/`, see Task 16 install).

### A.1 Per-instance setup steps
1. Copy/sync `packages/toolkit-framework/` + `packages/org-os-kms/` into the instance (from the canonical org-os home).
2. `cd` to the instance root. Create `kms.yaml` at the instance root (copy regen-toolkit's, change `instance:` and `self_ref:`; keep `adapter: repo-data`, `target: "."`).
3. Run `node packages/org-os-kms/src/cli.mjs init --name <instance> --adapter repo-data --target .` — creates `data/kb/` + a self `source-system` card + fills `kms.yaml self_ref`. **This is install, not data processing.** Present the diff (new `data/kb/`, edited `kms.yaml`); commit on approval.
4. Wire the dashboard section: cherry-pick the guarded block in `scripts/initialize.mjs` (from regen-toolkit) if the instance renders an org-os dashboard.

---

## Part B — Process the instance's data (the actual pipeline)

Run the framework's "machine" for each source. This is the per-instance data work.

1. **Register sources** — for each real feed (podcast RSS, blog, GitHub, forum), create a `source-system` card (title, type, steward, `return_path`) via the `register-source` skill or `capture-and-route`. Store it in the KB.
2. **Ingest** — `node packages/org-os-kms/src/cli.mjs` is thin; use the framework CLI for the pipeline, or the `ingest` skill:
   - `toolkit-framework ingest prepare --path <source-file-or-dir>` → work orders.
   - An agent fulfills each work order (writes candidate objects) per the `capture-and-route` / `ingest` skill.
   - `toolkit-framework ingest accept --id <wo>` → validated objects (the born-rules gate: `ai_assisted`, `maturity: raw`, provenance stamped).
   - `toolkit-framework store --adapter repo-data --target .` → objects land in `data/kb/<schema>.yaml`.
3. **Review & promote** — human review is required past `raw`: `toolkit-framework review list`, then `review promote --ref <ref> --reviewer <name> --maturity <m>`. AI-assisted ≠ human-reviewed. Draft-and-present.
4. **Bridge into registries** — `node packages/org-os-kms/src/cli.mjs bridge`. Merges `data/kb/*.yaml` → the instance's `data/<registry>.yaml` (upsert-by-id, non-destructive, `lineWidth:-1` clean diffs). **Inspect `git diff data/`, present, commit on approval.**
5. **Regenerate schemas** — `npm run generate:schemas && npm run validate:schemas` so `.well-known/` reflects the new registries. NOTE: the generator is not yet wired to loop over the new registries (`deployments`, `signals`, `implementation-memory`, `evolution-log`, `contributions`) — extend `scripts/generate-all-schemas.mjs` per instance, or scope regen to covered registries. (Deferred follow-up from the design.)
6. **Render** — `node packages/org-os-kms/src/cli.mjs render site` writes `src/data/kms-index.json`; if the instance has a site, `npm run build` to surface `/knowledge-commons`. `render` the dashboard section is automatic via `initialize.mjs`.
7. **Encyclopedia entries** — these bridge to `src/content/docs/kb/` (namespaced, safe). BEFORE the first encyclopedia bridge, validate the generated frontmatter against the instance's Starlight `docsSchema()` so `npm run build` can't break. (Deferred follow-up.)

---

## Part C — Federation (RegenOS)

Once ≥2 instances are live:
1. In each instance, `federate add --card <peer's source-system card>` — registers the peer under the RegenOS namespace in `kms.yaml`.
2. To enable fork-compat checks, add `peer_extensions: { <peer-slug>: <path-to-peer-extension-entities.yaml> }` to `kms.yaml`, then `federate check`.
3. Contribute-back: `federate contribute --peer <slug>` produces a DRAFT (the peer's `return_path` + records). A human performs the actual cross-repo hand-off. Never auto-write into a peer repo.

Establish refi-dao-os ↔ regen-toolkit as the first real 2-node RegenOS network.

---

## Guardrails (apply in every instance)

- **Draft-and-present** every `data/*.yaml`, site-content, and cross-repo write. Present `git diff`; commit only on approval.
- **Run from the instance root** with default `dir`/`target` (`target: "."`). Do not pass `--dir` with a relative `target` (the framework-vs-package `target`-convention divergence — a documented follow-up — is masked only at dir=cwd/target=`.`).
- **Vault safety:** never `git stash`/`clean`/`reset --hard` in an instance under `03 Libraries/*-os/`. Snapshot first for large operations.
- **Non-destruction is structural** (bridge upserts by id, preserves headers + existing rows) — but still review the diff.

## Definition of done (per instance)

`init` run + at least one real source ingested → reviewed → promoted → bridged (diff reviewed + committed) → rendered (dashboard + site), with the instance registered in the RegenOS federation. Learnings contributed back to the framework (framework v0.1.x grows through adoption).
