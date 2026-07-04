# org-os-kms — Design Spec

**Date:** 2026-07-05
**Status:** Approved (brainstorming) → pending implementation plan
**Module:** `@org-os/kms`
**Develops in:** `repos/regen-toolkit/packages/org-os-kms/`
**Canonical home:** `/03 Libraries/org-os/packages/org-os-kms/`
**Binds:** `@regen-commons/toolkit-framework` (v0.2.0, "the machine")

---

## 1. Context & problem

`@org-os/kms` is the module + org-os profile that binds the portable, org-os-agnostic
`@regen-commons/toolkit-framework` (the KMS engine — semantic kernel, schemas, "the machine"
pipeline, agentic skills) into a **live org-os instance**, and ships it pre-loaded as the default
knowledge system. It is deliberately **replaceable**: swap the host without touching the framework.

**Current state — a scaffold.** `packages/org-os-kms/` exists as `@org-os/kms` v0.0.1:
- `src/bind.mjs` — `REGISTRY_BINDINGS` (framework schema → org-os registry file),
  `LIFECYCLE_BINDINGS` (`/initialize`+`/close` → op lists, **currently descriptive strings**),
  `toOrgOsRegistries()`, `profileManifest()`.
- `profile/profile.yaml` — the org-os profile (framework + skill subset, `federation: RegenOS`,
  `replaceable: true`).
- `test/bind.test.mjs` — 2/2 passing. Proves the binding *shape*; the real org-os wiring is stubbed.

`docs/meta/GAPS.md` (framework): *"org-os-kms is still a scaffold … the real org-os binding is
pending the first adoption. Recommendation: develop it against the ReFi DAO adoption."*

**Goal.** Build the **full functional module** — turn the scaffold into a working binding that runs
the framework's machine against a live org-os instance, surfaces it, and federates it. Six pieces:

1. **Executable lifecycle bindings** — `/initialize` and `/close` actually *run* framework ops.
2. **Registry bridge** — `data/kb/*.yaml` (framework `repo-data` adapter output) → instance
   `data/*.yaml` registries + `.well-known/` schema regen.
3. **CLI / entry point** to drive the binding.
4. **Render surfaces** — surface KB objects on (a) the ASCII ops dashboard and (c) the live
   Astro/Starlight knowledge site (Seam 3).
5. **Federation** — the peer / contribute-back implementation.
6. **A live end-to-end adoption test** against a concrete instance.

---

## 2. Locked decisions

| Decision | Choice | Meaning |
|---|---|---|
| **Placement** | A+C | Develop/iterate in `repos/regen-toolkit/packages/org-os-kms/`; canonical home-of-record is `/03 Libraries/org-os/packages/org-os-kms/`. Design **must include a promotion/sync path** A→C. |
| **Scope** | B | All six pieces above. |
| **Topology** | C | `regen-toolkit` = primary adoption instance (dogfood, fast local loop); `refi-dao-os` = **real** federation peer (genuine 2-node network, not mocked). |
| **Render surfaces** | A+C | ASCII ops dashboard (`scripts/initialize.mjs`) **and** the live Astro knowledge site via the framework's derived `index.json` + `context.jsonld` (Seam 3). |
| **RegenOS** | A | The federation **namespace** both nodes sit under. `federation: RegenOS` is the network label; the actual peers are `regen-toolkit ↔ refi-dao-os` *within* RegenOS. Nothing to implement beyond namespacing peer cards. |
| **Architecture** | Hybrid (Approach 1 + 3) | Thin orchestration over the framework's public API (1) with **declarative** registry/lifecycle bindings executed by a small resolver (3). Thin imperative modules only where config can't express it. **Approach 2 (own reconciliation/conflict engine) explicitly rejected** — it re-solves what the framework's accept-gate + review already solve. |

---

## 3. Architecture

org-os-kms **reimplements no KMS logic**. Every operation is a call into the framework's public API.
Three principles:

- **Bindings stay data.** `REGISTRY_BINDINGS` / `LIFECYCLE_BINDINGS` remain declarative tables in
  `bind.mjs` (the Approach-3 spine — "replaceable host by editing config").
- **A small executor makes them run.** `ops.mjs` maps each declarative op-name → a framework-function
  thunk; `executor.mjs` reads a lifecycle event's op list, resolves each, runs them in order.
- **Thin imperative modules only where config can't express it:** the registry bridge, the two
  render outputs, the federation wrapper, the promotion sync.

This respects the framework's **three seams** and keeps the framework as single source of truth:
- Seam 1 (skill ↔ CLI = work orders): org-os-kms never touches the accept-gate; agents still only
  produce candidates, the framework CLI still validates and writes storage.
- Seam 2 (ingestion ↔ storage = adapters): org-os-kms drives the `repo-data` adapter (`data/kb/`);
  the bridge is a *downstream* consumer of adapter output, never a competing writer.
- Seam 3 (data ↔ site = derived index): `render.site` emits from the derived `index.json` +
  `context.jsonld`; it never hand-authors the index.

---

## 4. Component map & file tree

```
packages/org-os-kms/
  src/
    bind.mjs            (exists) declarative tables — REGISTRY_BINDINGS, LIFECYCLE_BINDINGS
                        + toOrgOsRegistries(), profileManifest()
    config.mjs          load/validate kms.yaml (instance, adapter, target, self_ref, peers,
                        framework, upstream)
    ops.mjs             OP REGISTRY: op-name → framework-fn thunk
                        (ingest.prepare, ingest.accept, store, review.list, review.promote,
                         csis-review, emit-contributions, index.rebuild, federate.check,
                         sync.push, render.dashboard, render.site, bridge)
    executor.mjs        LIFECYCLE EXECUTOR: read LIFECYCLE_BINDINGS[event], resolve via ops.mjs,
                        run in order, collect a report; apply fail policy (§6)
    registry-bridge.mjs data/kb/<schema>.yaml → instance data/<registry>.yaml
                        (idempotent, non-destructive) + trigger .well-known regen
    render.mjs          renderDashboardSection(kb) → ASCII block for initialize.mjs
                        renderSiteData(kb)       → site-consumable JSON (Seam 3)
    federate.mjs        wrap framework federateAdd/federateCheck over kms.yaml peers,
                        namespaced under RegenOS; return_path contribute-back (draft-and-present)
    promote.mjs         A→C sync: package dir → /03 Libraries/org-os/packages/org-os-kms/
                        with a checksum drift manifest (draft-and-present)
    cli.mjs             thin zero-dep CLI: init · lifecycle initialize|close · bridge ·
                        render dashboard|site · federate add|check|contribute · promote-upstream
  profile/profile.yaml  (exists) extend: register ops + render targets + peer topology
  test/                 node --test (see §7)
kms.yaml                (new, at instance root) instance config
```

**Six pieces → components:** ① lifecycle = `executor`+`ops` · ② bridge = `registry-bridge` ·
③ CLI = `cli` · ④ render (A+C) = `render` (dashboard + site) · ⑤ federation = `federate` ·
⑥ e2e = `test/e2e.test.mjs` + live dogfood.

**Conventions (match the framework):** pure ESM `.mjs`, zero build, only dep `js-yaml`,
`node --test`, atomic tmp+rename writes, `{ ok, errors, report }` return shapes, heavy header
comments stating the invariant each file protects, hand-rolled `--flag value` CLI parsing.

### 4.1 `kms.yaml` (instance config)

```yaml
instance: regen-toolkit          # instance id
adapter: repo-data               # framework storage adapter (writes data/kb/)
target: data/kb                  # framework-side KB output
framework: "@regen-commons/toolkit-framework"
self_ref: <this instance's source-system card ref>
upstream: "/03 Libraries/org-os/packages/org-os-kms"   # A→C promotion target
federation:
  namespace: RegenOS
  peers:
    - instance: refi-dao-os
      card: <peer source-system card ref>
      return_path: <contribute-back address>
```

---

## 5. Data flow — lifecycle wired to org-os

**On `/initialize`** (read-only / render — safe on session open):
`config.load` → `index.rebuild` (framework `deriveIndex` over `data/kb/`) →
`review.list` (awaiting-review count) → `render.dashboard` (initialize.mjs injects the section) →
`render.site`.

**On `/close`** (the descriptive strings become executable):
`csis-review` on changed objects → `bridge` (`data/kb/` → `data/*.yaml` + `generate:schemas`) →
`emit-contributions` (records for session-promoted objects) → `federate.check` →
`render.site` + `render.dashboard` refresh → `sync.push` *(draft-and-present)*.

**Ingestion** is the **unchanged framework machine**
(`source → prepare → workorder → agent fulfills candidates → accept (gate) → store repo-data →
review → promote`). org-os-kms only **bridges** the stored output into registries and **renders**
it. It never touches the accept-gate or review logic.

**Federation:** `federate add <peer-card>` registers refi-dao-os's source-system card under the
RegenOS namespace in `kms.yaml`; `federate check` = fork-compat over the peer's extensions;
`federate contribute` uses the peer's `return_path` to hand back contribution-records
*(draft-and-present, cross-repo)*.

---

## 6. Error handling & safety

- **Executor fail policy:** renders/reads are **fail-soft** (log + continue); writes are
  **fail-hard** (stop on first error — no partial registry corruption). Bridge writes are atomic
  (tmp+rename).
- **Bridge idempotency:** keyed by object `id`; re-run is a no-op if unchanged; **never deletes
  instance-only data** or clobbers unmapped keys. `encyclopedia-entry → src/content/docs/` is the
  markdown special case (writes a doc file, not a registry row).
- **Cross-repo writes** (federation contribute to `refi-dao-os`; A→C promotion to
  `/03 Libraries/org-os/`): **always draft-and-present** — show the diff, get approval, never
  auto-write into another repo. Satisfies both the org-os safety rule and vault-safety.
- **Config guard:** missing/invalid `kms.yaml` → refuse all writes with a clear error.
- **Site build integrity:** `render.site` only writes a data artifact the site *reads*; it never
  edits site source and never breaks `npm run dev` / `build` / `preview`. The live site is preserved.

---

## 7. Testing (node --test, framework convention)

Keep `bind.test.mjs` (2 green). Add, all temp-dir isolated (`mkdtemp`):

- `config.test.mjs` — kms.yaml load/validate; guard rejects missing/invalid.
- `ops.test.mjs` — every op-name resolves to a callable; op registry is **complete vs.
  LIFECYCLE_BINDINGS** (no unresolved op).
- `executor.test.mjs` — initialize/close sequences run in order against a temp instance;
  fail-hard on a write error, fail-soft on a render error.
- `registry-bridge.test.mjs` — mapping, idempotency (re-run = no-op), non-destruction of
  instance-only data, `encyclopedia-entry` markdown special case.
- `render.test.mjs` — dashboard section shape + site-data JSON shape from a fixture KB.
- `federate.test.mjs` — peer registration under the RegenOS namespace, fork-compat check,
  contribute produces a **draft** (no real cross-repo write).
- `e2e.test.mjs` — **piece 6**: seed a source → run the full machine → bridge → render, in a temp
  instance mirroring regen-toolkit's layout. The end-to-end gate.

**Acceptance (live dogfood):** run the module against regen-toolkit's real `kb/` + `data/`, and
register `refi-dao-os` as the real peer. This is the adoption proof, not a unit test.

---

## 8. Promotion (A→C)

`org-os-kms promote-upstream` (`src/promote.mjs`) syncs the package dir →
`/03 Libraries/org-os/packages/org-os-kms/` with a checksum drift manifest, **draft-and-present**,
run **once the module is functional + green** in the toolkit. Not part of the runtime loop — it is
the release step that moves the finished module to its canonical home.

---

## 9. Scope & assumptions

- **In scope:** all six pieces (§1), the hybrid architecture, the A→C promotion path, live dogfood
  acceptance on regen-toolkit + refi-dao-os as a real peer.
- **Assumptions:** framework v0.2.0 public API is stable and consumed as-is; the `repo-data` adapter
  is the storage seam; regen-toolkit's instance layout (`data/`, `kb/`, `scripts/initialize.mjs`,
  Astro site under `src/`) is the reference layout; `/03 Libraries/org-os/packages/` and
  `/03 Libraries/refi-dao-os/` both exist (verified 2026-07-05).
- **Not reimplemented:** ingest, accept-gate, review/promote, invariants, compatibility engine,
  JSON-LD context — all stay in the framework and are *called*.

---

## 10. Open risks

- **Cross-repo friction (A→C + federation).** Promotion and contribute-back both reach into sibling
  repos; both are draft-and-present, but drift between the toolkit copy and the canonical copy is a
  standing maintenance cost. The checksum manifest surfaces it; it does not eliminate it.
- **New registries need `generate:schemas` coverage.** The bindings map framework schemas onto
  registries beyond org-os's canonical 13 (`resources`, `source-systems`, `option-library`,
  `tracks`, `deployments`, `implementation-memory`, `evolution-log`, `signals`, `contributions`).
  The bridge must ensure `.well-known/` generation covers these (declare in `instances.yaml`
  `data_registries_extra[]` per the DATA-MODEL extension pattern) or scope schema regen to the
  registries that have generators.
- **RegenOS is still vaguely defined** (per the queued `regen-os-documentation` plan). Decision A
  contains the blast radius to "namespace only" — but if RegenOS later becomes a concrete node, the
  peer model must accommodate it (the source-system-card primitive already does).
- **Encyclopedia-entry → `src/content/docs/`** touches live site content. Bridge writes there must be
  reviewed like any site edit (draft-and-present, preserve build).
