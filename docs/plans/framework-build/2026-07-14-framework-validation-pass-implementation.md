# Framework Validation Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run a representative slice of the toolkit's live content through the real 0.2 ingestion machine, land the non-controversial kernel fixes it needs (incl. the ReFi-DAO-surfaced data-loss bug), and produce three shareable artifacts + a staged capital contribute-back for the **Thu Jul 16 toolkit call**.

**Architecture:** Framework fixes are TDD'd inside `packages/toolkit-framework` (Node `node:test`, must stay 100/100 green). The instance consumes the machine as-is through its CLI (`init`/`ingest`/`store`/`review`), writing typed objects to `data/kb/` via the configured `repo-data` adapter. The three artifacts (live Astro page, Obsidian canvas, markdown report) render the real before/after. The capital proposal is a draft-only `update-proposal` — never applied to `docs/MASTER.md`.

**Tech Stack:** Node ≥22 (zero-build ESM `.mjs`), `js-yaml`, `node:test`; Astro/Starlight site (base-aware for GitHub Pages); Obsidian JSON Canvas.

**Working directory:** `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit` (all paths relative to it unless prefixed). Branch: `regen-toolkit-os`. ⚠️ **Vault safety:** no `git stash`/`clean`/`reset --hard`; `git add` only the specific listed files.

**Design spec:** `docs/plans/framework-build/2026-07-13-framework-validation-pass-design.md`

**Ground truth (from exploration 2026-07-14):**
- Framework tests: `cd packages/toolkit-framework && npm test` → currently **100 pass / 0 fail** (Node `node:test`, files `test/*.test.mjs`).
- Framework CLI: `node packages/toolkit-framework/src/cli.mjs <cmd>` (also `toolkit-framework` bin).
- Instance KB config `kms.yaml`: `adapter: repo-data`, `target: .` → KB registries at `data/kb/<schema>.yaml` + `data/kb/index.json`. Currently only the `regen-toolkit` self source-system card (index `total: 1`).
- Source articles: `src/content/docs/*.md` — **119 files, flat**; logical grouping in `src/data/journeys.js` (3 journeys × chapters).
- Live pages read data as JSON imports (`src/pages/regen-toolkit-os.astro` imports `../../kb/index.json`; that root `kb/` is a **stale kb-folder run** — the canonical KB per `kms.yaml` is `data/kb/`).

---

## Phase order & gating

`V0 → V1 → V2 → V3 → V4`, with the **Jul-14 intake** folded into V1 as confirmation (non-blocking). V1 must be green before V2 (ingestion depends on the overwrite guard). V3 depends on V2's real output. V4 is independent of V2/V3 and can run in parallel once V0 lands.

**Absolute deadline gate:** the Jul 16 demo needs V2 + V3 (slice ingested + 3 artifacts) at minimum. V1 fixes make V2 safe; V4 is the flagship talking point. If time compresses, V4 (capital proposal) can be a tighter draft, but V1.4 (overwrite guard) is non-negotiable before any real `store`.

---

## V0 — Consolidate the plan surface

### Task V0.1: Create the durable master plan

**Files:**
- Create: `docs/plans/framework-validation-pass.md`

- [ ] **Step 1: Write the master plan** (the team-facing coordination artifact, symmetric to ReFi DAO's `kms-koi-pipeline.md`). Create `docs/plans/framework-validation-pass.md`:

```markdown
---
id: framework-validation-pass
title: "Framework Validation Pass — self-ingestion + kernel fixes + Jul 16 demo (master plan)"
status: in-progress
priority: 1
scope: regen-toolkit
created: 2026-07-14
updated: 2026-07-14
supersedes: [site-and-content-convergence, framework-instance-split, resource-db-v3-lift]
rescopes: [CONVERGENCE-PIPELINE]
spec: docs/plans/framework-build/2026-07-13-framework-validation-pass-design.md
sibling_plan: "../../refi-dao-os/docs/agent-plans/kms-koi-pipeline.md"
validation_checkpoint: "2026-07-16 toolkit call"
---

## Goal

Run the current toolkit's real content through the 0.2 machine for the first time,
land the non-controversial kernel fixes it needs, and put three concrete artifacts
(+ a capital contribute-back proposal) in front of the team on Thu Jul 16.

## Phases

| Phase | What | When | Status |
|---|---|---|---|
| **V0 — Consolidate** | Master plan · stale plans archived · QUEUE/HEARTBEAT reconciled | Jul 14 | ▶ |
| **V1 — Kernel fixes** | source-system enum · `held` state · `track.outcome`→array · **B5 overwrite guard** | Jul 14 | |
| **V1-intake — Jul 14 feedback** | Fold ReFi DAO post-R3 `route: toolkit-framework` items (confirm/extend V1) | Jul 14 | |
| **V2 — Slice self-ingestion** | ~15–20 articles → real `ingest` pipeline → `data/kb/` | Jul 15 | |
| **V3 — Three artifacts** | Live page · Obsidian canvas · diff report | Jul 15–16 | |
| **V4 — Capital proposal** | 8 Forms of Capital as a staged `update-proposal` (draft-only) | Jul 15 | |
| **Post-demo** | Full 119 self-ingestion · repo migration · OS→main · V3 resource lift | after Jul 16 | |

**V1.4 (overwrite guard) is the gate before any real `store`.** The Jul 16 demo needs V2 + V3.

## Decision log

| Date | Decision | Source |
|---|---|---|
| 2026-07-05 | HYBRID — adopt framework backbone, contribute 8 Forms of Capital | ontology comparison |
| 2026-07-10 | Reprocess a subset → visual concrete diff before the next demo | 260710 council |
| 2026-07-13 | Option B (demo + kernel fixes), slice-then-full ingestion | brainstorm |
| 2026-07-14 | `public_use_boundary` already first-class (schema exists) — dropped from fix list | exploration |
| 2026-07-14 | Real run targets `data/kb/` (repo-data per kms.yaml); root `kb/` is a stale kb-folder run | exploration |

## Absorbed backlog (from superseded plans)

- **site-and-content-convergence** — "process content through the framework + fork the site" IS V2/V3 (now against the real 0.2 machine). Its site-fork idea → the V3 live page.
- **framework-instance-split** — the split is real (package extracted); residual conceptual items: none blocking.
- **resource-db-v3-lift** — the 698-row lift is post-demo, gated on V1's `held` state. Crosswalk detail preserved at `data/resources/csv/toolkit-layer-crosswalk.csv`.
- **Full 119 self-ingestion** — the phase that resumes after Jul 16 once V1 fixes are confirmed.

## Out of scope for Jul 16 (sequenced after)

Full 119 self-ingestion · repo migration → RC GitHub org · OS-overlay → `main` (needs a written proposal) · Resource-DB V3 full lift.

## Deferred to the group (surfaced Jul 16, not mechanical fixes)

`gathering`/`story` extension restoration · `function` value-vs-type collision · maturity/stage
normalization · salvaged-vs-live merge (ontology-comparison §8).
```

- [ ] **Step 2: Commit**

```bash
git add docs/plans/framework-validation-pass.md
git commit -m "plan(framework-validation-pass): master plan — consolidates the framework arc"
```

### Task V0.2: Supersede + archive the stale plans

**Files:**
- Create: `docs/plans/archive/` (if missing)
- Move + modify: `docs/plans/{site-and-content-convergence,framework-instance-split,resource-db-v3-lift}.md`
- Modify: `docs/plans/QUEUE.md`

- [ ] **Step 1: Check tracked-vs-untracked, then move the three plans into archive/**

```bash
mkdir -p docs/plans/archive
for f in site-and-content-convergence framework-instance-split resource-db-v3-lift; do
  if git ls-files --error-unmatch "docs/plans/$f.md" >/dev/null 2>&1; then
    git mv "docs/plans/$f.md" "docs/plans/archive/$f.md"
  else
    mv "docs/plans/$f.md" "docs/plans/archive/$f.md"
  fi
done
```

- [ ] **Step 2: Add a pointer banner to each archived plan**

For EACH of the three files in `docs/plans/archive/`, insert immediately after the frontmatter's closing `---` (or at line 1 if there is no frontmatter):

```markdown
> **⛔ SUPERSEDED 2026-07-14** by [`framework-validation-pass`](../framework-validation-pass.md).
> Its live scope is absorbed there (V2/V3 for content-through-framework + site; the resource
> lift is post-Jul-16, gated on the `held` state). Kept as historical record — do not execute.
```

- [ ] **Step 3: Update `docs/plans/QUEUE.md`**

In `## Active`, replace the `CONVERGENCE-PIPELINE` line's tail with a pointer note and add the master plan at the top of `## Active`:

```markdown
0. **[framework-validation-pass](framework-validation-pass.md) — ★ ACTIVE 2026-07-14 (TIME-CRITICAL, demo Thu Jul 16).** Run the toolkit through its own 0.2 machine (slice) + kernel fixes + 3 artifacts + staged capital proposal. Consolidates site-and-content-convergence · framework-instance-split · resource-db-v3-lift (archived); executes CONVERGENCE-PIPELINE P2/P3.
```

In `## Queued — high-priority`, delete the `site-and-content-convergence` entry (item 0) and renumber. Update the header date line: `> Last updated: 2026-07-14 (framework-validation-pass consolidated; 3 plans archived)`.

- [ ] **Step 4: Commit**

```bash
git add docs/plans/archive/ docs/plans/QUEUE.md
git commit -m "plan: archive 3 superseded plans under framework-validation-pass; QUEUE reconciled"
```

### Task V0.3: Reconcile HEARTBEAT

**Files:**
- Modify: `HEARTBEAT.md`

- [ ] **Step 1: Add the active section** at the top of `## Active Tasks` (after the checkpoint blockquotes, before the first `### `):

```markdown
### Framework Validation Pass — self-ingestion + Jul 16 demo _(ACTIVE 2026-07-14)_

> Master plan: [`docs/plans/framework-validation-pass.md`](docs/plans/framework-validation-pass.md). Demo **Thu Jul 16**. Symmetric to the ReFi DAO `kms-koi-pipeline`.

- [ ] **V1 — kernel fixes** (framework, TDD, keep 100/100): source-system enum (+`blog`/`publication`) · `held` maturity state · `track.outcome`→array · **B5 silent-overwrite guard** (the ReFi DAO data-loss-at-scale bug).
- [ ] **V2 — slice self-ingestion** — ~15–20 articles → real `ingest` pipeline → `data/kb/` (repo-data adapter).
- [ ] **V3 — three artifacts** — live page + Obsidian canvas + diff report.
- [ ] **V4 — capital `update-proposal`** (draft-only, for Matty).
```

- [ ] **Step 2: Update the `★ Process toolkit content through the framework` line** (in the "Framework Build" section) from `[~]` to reference this plan: append ` → now driven by [`framework-validation-pass`](docs/plans/framework-validation-pass.md) (V2 slice first).`

- [ ] **Step 3: Commit**

```bash
git add HEARTBEAT.md
git commit -m "heartbeat: surface framework-validation-pass (V1–V4, demo Jul 16)"
```

---

## V1 — Kernel fixes (framework, TDD)

> All work under `packages/toolkit-framework`. **Run `npm test` from that directory.** Keep 100/100 green — a fix that reds an unrelated test is not done. Each task: failing test → run-fail → implement → run-pass → commit.

### Task V1.1: Widen the `source-system` type enum (+ `blog`, `publication`)

**Files:**
- Test: `packages/toolkit-framework/test/schemas.test.mjs` (append)
- Modify: `packages/toolkit-framework/schemas/source-system.yaml`

- [ ] **Step 1: Write the failing test** — append to `test/schemas.test.mjs`:

```js
import { readFileSync } from 'node:fs';
import yamlLib from 'js-yaml';

const goodSource = yamlLib.load(
  readFileSync(new URL('./fixtures/candidates/good-source-system.yaml', import.meta.url), 'utf8')
).object;

test('source-system accepts type: blog', () => {
  assert.deepEqual(validateObject('source-system', { ...goodSource, type: 'blog' }), []);
});
test('source-system accepts type: publication', () => {
  assert.deepEqual(validateObject('source-system', { ...goodSource, type: 'publication' }), []);
});
```

(If `validateObject`/`test`/`assert` are already imported at the top of the file, don't re-import them — only add the `readFileSync`/`yamlLib` imports and the two tests.)

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/toolkit-framework && node --test test/schemas.test.mjs`
Expected: FAIL — `type: blog` not in enum (error like `type must be one of ...`).

- [ ] **Step 3: Add the two enum values** — in `schemas/source-system.yaml`, extend the `type.enum` list to include `blog` and `publication`:

```yaml
    enum: [wiki, map, repo, forum, knowledge-garden, directory, archive,
           database, library, docs-site, convening, podcast, newsletter, dataset,
           blog, publication]
```

- [ ] **Step 4: Run to verify pass** — `node --test test/schemas.test.mjs` → PASS. Then full suite: `npm test` → 102 pass / 0 fail.

- [ ] **Step 5: Commit**

```bash
git add packages/toolkit-framework/schemas/source-system.yaml packages/toolkit-framework/test/schemas.test.mjs
git commit -m "framework(schema): source-system enum +blog +publication (ontology-cmp §8, refi-dao A1)"
```

### Task V1.2: Add the `held` maturity state

**Files:**
- Read first: `packages/toolkit-framework/src/index.mjs` (find `isAwaitingReview` + confirm it's exported) and `src/util.mjs`
- Test: `packages/toolkit-framework/test/maturity.test.mjs` (append)
- Modify: `packages/toolkit-framework/schemas/review-maturity.yaml`
- Possibly modify: wherever `isAwaitingReview` is defined

- [ ] **Step 1: Locate `isAwaitingReview`** — `grep -rn "isAwaitingReview" packages/toolkit-framework/src`. Note the file + whether it keys off `maturity` (a set/whitelist of "not yet reviewed" states) and whether it's exported. You need this for Step 3's second test.

- [ ] **Step 2: Write the failing tests** — append to `test/maturity.test.mjs`:

```js
test('maturity axis includes held', () => {
  assert.equal(isValid('maturity', 'held'), true);
});
test('held objects are awaiting review', () => {
  assert.equal(isAwaitingReview({ maturity: 'held' }), true);
});
```

(Import `isValid` and `isAwaitingReview` from `../src/index.mjs` if not already imported. If `isAwaitingReview` lives in `../src/util.mjs`, import from there.)

- [ ] **Step 3: Run to verify it fails**

Run: `cd packages/toolkit-framework && node --test test/maturity.test.mjs`
Expected: FAIL — `held` not a member of the maturity axis (and/or `isAwaitingReview` returns false/undefined for it).

- [ ] **Step 4: Implement** —
  (a) In `schemas/review-maturity.yaml`, add `held` to `maturity.values` (place it right after `raw`, since "held for review" is an early, pre-triage state):
  ```yaml
    values:
      - raw
      - held
      - draft
      - candidate
      - source-linked
      - reviewed
      - field-informed
      - pattern-generating
      - deprecated
      - archived
  ```
  (b) If Step 1 showed `isAwaitingReview` whitelists specific "awaiting" maturities, add `held` to that set so `held` objects count in the review queue. If it instead treats "anything not promoted / `ai_assisted:true`" as awaiting, no code change is needed there — but the second test must still pass; adjust the test object to include the fields the function actually checks (e.g. `{ maturity:'held', ai_assisted:true }`) so it reflects real usage.

- [ ] **Step 5: Run to verify pass** — `node --test test/maturity.test.mjs` → PASS. Then `npm test` → all green (104 total).

- [ ] **Step 6: Commit**

```bash
git add packages/toolkit-framework/schemas/review-maturity.yaml packages/toolkit-framework/test/maturity.test.mjs packages/toolkit-framework/src/*.mjs
git commit -m "framework(schema): add 'held' maturity state — a home for held-for-review rows (§8)"
```

### Task V1.3: `track.outcome` scalar→array + enforce `type: array`

**Files:**
- Test: `packages/toolkit-framework/test/schemas.test.mjs` (append)
- Modify: `packages/toolkit-framework/schemas/track.yaml`
- Modify: `packages/toolkit-framework/src/index.mjs` (`validateObject`)

> Rationale: the validator currently enforces only `enum` and `axis`, **not** `type`. Changing the schema alone has no teeth. We add minimal `type: array` enforcement (the one type whose violation causes real downstream breakage) so the change is meaningful and testable.

- [ ] **Step 1: Write the failing tests** — append to `test/schemas.test.mjs`:

```js
test('track.outcome accepts an array', () => {
  const obj = { title: 'T', type: 'journey', audience: 'newcomers', outcome: ['understands DAOs', 'has a wallet'] };
  assert.deepEqual(validateObject('track', obj), []);
});
test('a field declared type: array rejects a scalar', () => {
  const obj = { title: 'T', type: 'journey', audience: 'newcomers', outcome: 'a single string' };
  const errors = validateObject('track', obj);
  assert.ok(errors.some((e) => /outcome/.test(e) && /array/.test(e)), `expected an array error, got: ${JSON.stringify(errors)}`);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/toolkit-framework && node --test test/schemas.test.mjs`
Expected: the second test FAILS (no array error is produced today — `type` isn't enforced).

- [ ] **Step 3: Implement** —
  (a) In `schemas/track.yaml`, change `outcome: { type: string }` → `outcome: { type: array }`.
  (b) In `src/index.mjs` `validateObject`, in the per-field loop (after the existing `enum`/`axis` checks), add:
  ```js
      if (def.type === 'array' && val !== undefined && !Array.isArray(val)) {
        errors.push(`${field} must be an array`);
      }
  ```
  Use whatever the loop's local variable names are for the field key and value (from exploration: it iterates present fields with a def; match the existing `errors.push(...)` style and the loop's `val`/`field` bindings).

- [ ] **Step 4: Run to verify pass** — `node --test test/schemas.test.mjs` → PASS. Then `npm test` — **watch for regressions**: any object elsewhere that passes a scalar to a `type: array` field will now error. If a legitimate existing test breaks, the schema was wrong there too — fix the data, not the check. Confirm the suite returns to all-green (106 total).

- [ ] **Step 5: Commit**

```bash
git add packages/toolkit-framework/schemas/track.yaml packages/toolkit-framework/src/index.mjs packages/toolkit-framework/test/schemas.test.mjs
git commit -m "framework: track.outcome scalar→array + enforce type:array in validateObject (§8)"
```

### Task V1.4: The B5 silent-overwrite guard (flagship)

**Files:**
- Test: `packages/toolkit-framework/test/storage.test.mjs` (append + reconcile) and `test/adapters.test.mjs` (append)
- Modify: `packages/toolkit-framework/src/adapters/kb-folder.mjs`
- Modify: `packages/toolkit-framework/src/adapters/repo-data.mjs`

> The bug: both adapters key stored objects by `slugify(title)`. Two **distinct** objects sharing a title-slug silently clobber (the second overwrites the first — `atomicWrite` with no existence check). The fix must keep true idempotency (re-storing the **same** object updates in place) while never destroying a **different** object.

- [ ] **Step 1: Add a shared identity helper** — in `packages/toolkit-framework/src/util.mjs`, export:

```js
// Two stored objects are "the same object" (idempotent update) when their ids match,
// or — lacking ids — when their content hashes match. Distinct objects that merely
// share a title-slug are NOT the same object (the B5 data-loss surface).
export function sameStoredObject(a, b) {
  if (a && b && a.id != null && b.id != null) return a.id === b.id;
  return hashContent(yaml.dump(a)) === hashContent(yaml.dump(b));
}
```

Ensure `hashContent` and `yaml` are already imported in `util.mjs` (the exploration confirms `slugify`/`hashContent` live here); if `yaml` isn't imported, add `import yaml from 'js-yaml';`.

- [ ] **Step 2: Write the failing tests** — append to `test/storage.test.mjs`. Use the file's existing temp-target setup (the helper it already uses to make a fresh KB dir; reuse it rather than inventing one). Sketch:

```js
test('B5: distinct objects with the same title-slug do not clobber', () => {
  const target = /* fresh temp KB dir, per this file's existing helper */;
  const adapter = getAdapter('kb-folder');
  const a = { title: 'Impact Vault', id: 'obj-a', body: 'first author' };
  const b = { title: 'Impact Vault', id: 'obj-b', body: 'second author' };
  const res = adapter.store(target, [{ schema: 'resource', object: a }, { schema: 'resource', object: b }]);
  const items = adapter.list(target).filter((i) => i.schema === 'resource');
  assert.equal(items.length, 2, 'both distinct objects survive');
  assert.deepEqual(items.map((i) => i.object.body).sort(), ['first author', 'second author']);
  assert.equal(res.collisions.length, 1, 'the collision is reported, not silent');
});

test('idempotent: re-storing the same object (same id) stays one file', () => {
  const target = /* fresh temp KB dir */;
  const adapter = getAdapter('kb-folder');
  const a = { title: 'Impact Vault', id: 'obj-a', body: 'v1' };
  adapter.store(target, [{ schema: 'resource', object: a }]);
  adapter.store(target, [{ schema: 'resource', object: { ...a, body: 'v2' } }]);
  const items = adapter.list(target).filter((i) => i.schema === 'resource');
  assert.equal(items.length, 1, 'same id overwrites in place');
  assert.equal(items[0].object.body, 'v2');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd packages/toolkit-framework && node --test test/storage.test.mjs`
Expected: the first test FAILS (`items.length` is 1 — b clobbered a; `res.collisions` is undefined).

- [ ] **Step 4: Implement the guard in `kb-folder.mjs`** — rewrite `store()` (and add the needed imports `existsSync, readFileSync` from `node:fs`, `dirname, basename` from `node:path`, plus `sameStoredObject, hashContent` from `../util.mjs`):

```js
store(target, entries) {
  const stored = [];
  const collisions = [];
  for (const { schema, object } of entries) {
    let p = objectPath(target, schema, object);
    if (existsSync(p)) {
      const existing = yaml.load(readFileSync(p, 'utf8'));
      if (!sameStoredObject(existing, object)) {
        const suffix = hashContent(yaml.dump(object)).slice(0, 8);
        const base = basename(p, '.yaml');
        p = join(dirname(p), `${base}-${suffix}.yaml`);
        collisions.push({ schema, slug: base, wroteTo: p });
      }
    }
    atomicWrite(p, yaml.dump(object));
    stored.push(p);
  }
  return { stored, collisions };
}
```

- [ ] **Step 5: Mirror the guard in `repo-data.mjs`** — in its `store()`, the write is `byFile.get(p).entries[slug] = object`. Guard it:

```js
    const slug = slugFor(object);
    const reg = byFile.get(p).entries;
    let key = slug;
    if (reg[key] !== undefined && !sameStoredObject(reg[key], object)) {
      key = `${slug}-${hashContent(yaml.dump(object)).slice(0, 8)}`;
      collisions.push({ schema, slug, key });
    }
    reg[key] = object;
```

Declare `const collisions = []` at the top of the method and return it alongside the existing result (`return { stored, collisions }` or merge into the existing return object). Add `sameStoredObject`/`hashContent` to the `../util.mjs` import.

- [ ] **Step 6: Add the repo-data test** — append the equivalent B5 + idempotency pair to `test/adapters.test.mjs`, using `getAdapter('repo-data')` and a fresh temp target (per that file's existing pattern). Assert both distinct objects appear in `data/kb/resource.yaml`'s `entries` and `collisions.length === 1`.

- [ ] **Step 7: Reconcile the pre-existing idempotency test** — the exploration flags `test/storage.test.mjs:44-69` ("idempotent: same title+schema overwrites, never duplicates"). Run `npm test`. If that test stored the **same** object (same id/content) → it stays green, done. If it asserted that two **different** objects collapse to one file, that assertion encoded the bug — update it to assert same-identity idempotency (matching Step 2's second test). Do not weaken the new guard to satisfy an assertion of the old behavior.

- [ ] **Step 8: Run to verify pass** — `node --test test/storage.test.mjs test/adapters.test.mjs` → PASS; then `npm test` → all green.

- [ ] **Step 9: Commit**

```bash
git add packages/toolkit-framework/src/util.mjs packages/toolkit-framework/src/adapters/kb-folder.mjs packages/toolkit-framework/src/adapters/repo-data.mjs packages/toolkit-framework/test/storage.test.mjs packages/toolkit-framework/test/adapters.test.mjs
git commit -m "framework(fix): B5 silent-overwrite guard — distinct title-slugs never clobber (refi-dao ledger B5)"
```

### Task V1-intake: Fold the Jul-14 ReFi DAO feedback (confirm/extend)

**Files:**
- Read: `../refi-dao-os/docs/kms/FRAMEWORK-FEEDBACK.md`
- Modify (if a new in-scope fix appears): the relevant schema/test + `docs/plans/framework-validation-pass.md` decision log

- [ ] **Step 1: After the Jul-14 Monty deep-dive**, read the ReFi DAO routed ledger and extract every item tagged `route: toolkit-framework`. Cross-check against V1.1–V1.4:
  - Confirmed-already (enum A1, capital A3 → V4, overwrite B5 → V1.4): mark `dispatched: 2026-07-14 <this plan>` in the ledger's item headings (or note it for the operator to mark).
  - **New** non-controversial fix in scope: add a V1.x task following the same TDD shape and note it in the master-plan decision log.
  - New but contentious/large: add to the master plan's "Deferred to the group" list, not V1.
- [ ] **Step 2:** This task is **non-blocking** — if the deep-dive slips, proceed to V2 with V1.1–V1.4. Record whatever intake happened (even "none yet") in the decision log.

- [ ] **Step 3: Commit** (if anything changed)

```bash
git add docs/plans/framework-validation-pass.md
git commit -m "plan: fold Jul-14 refi-dao feedback intake into framework-validation-pass"
```

---

## V2 — Slice self-ingestion (operational; verification-gated)

> Not unit-TDD — this drives the real machine. Each task has an explicit verification gate. Ingestion itself is **subagent-driven**: each work order is fulfilled by a fresh subagent loading `packages/toolkit-framework/skills/ingest/SKILL.md`.

### Task V2.1: Select the representative slice

**Files:**
- Read: `src/data/journeys.js` (authoritative slug→chapter→journey grouping)
- Create: `data/kb/_slice-manifest.yaml`

- [ ] **Step 1: Choose ~15–20 slugs** from `src/content/docs/*.md`, sampling across all 3 journeys and their chapters (per `src/data/journeys.js`), and deliberately covering **every ingestible object type** + the **four known edge cases**. Target coverage:
  - **All object types:** at least one article that yields each of resource, concept-lineage / concept, claim-evidence, signal, encyclopedia-entry, source-system reference, and (if present) a track/journey-shaped piece.
  - **Edge 1 — capital-heavy:** an article saturated with the 8-forms / capital language (e.g. `treasury-management.md`, a funding/impact piece) → exercises the missing capital axis (feeds V4).
  - **Edge 2 — `function` value/type collision:** an article that is itself a *pattern* or *case study* (so the machine must choose type-vs-classification).
  - **Edge 3 — source-system enum fallback:** an article that references a blog/publication source (now covered by V1.1 — confirm it lands as `blog`, not `database`).
  - **Edge 4 — title-collision (B5 trigger):** two articles (or an article + the existing self-card) that would decompose to same-title objects — confirm V1.4 keeps both.
  - Starter candidates seen in exploration: `what-is-dao.md`, `what-is-blockchain.md`, `setting-up-first-wallet.md`, `dmrv.md`, `silvi-protocol.md`, `gitcoin-grants-qf.md`, `treasury-management.md`, `knowledge-gardens.md`. Extend to ~18 against the coverage grid above.

- [ ] **Step 2: Write the manifest** — `data/kb/_slice-manifest.yaml`:

```yaml
# Representative slice for the 2026-07-16 self-ingestion demo. Chosen to exercise
# every object type + the four known edge cases. NOT the full 119 (that resumes post-demo).
selected: 2026-07-14
count: 18   # actual count
articles:
  - slug: what-is-dao
    journey: newcomer
    covers: [concept, encyclopedia-entry]
  - slug: treasury-management
    journey: local-node
    covers: [resource, capital-heavy]
  # ... one row per chosen article, each noting journey + what it covers
edge_cases:
  capital_heavy: [treasury-management]
  function_collision: [<slug>]
  enum_fallback: [<slug>]
  title_collision: [<slug-a>, <slug-b>]
notes: "Selection rationale so the diff can honestly say 'representative subset, chosen to exercise X/Y/Z'."
```

- [ ] **Step 3: Verify + commit** — every listed slug exists: `for s in $(grep 'slug:' data/kb/_slice-manifest.yaml | awk '{print $3}'); do test -f "src/content/docs/$s.md" || echo "MISSING: $s"; done` (expect no output).

```bash
git add data/kb/_slice-manifest.yaml
git commit -m "kb(V2): representative slice manifest (~18 articles, all types + 4 edge cases)"
```

### Task V2.2: Baseline snapshot (so the diff is real)

**Files:**
- Create: `data/kb/_baseline-index.json`

- [ ] **Step 1: Snapshot the pre-ingestion KB index** so the "before" number is captured before anything is added:

```bash
cp data/kb/index.json data/kb/_baseline-index.json
```

Expected content: `total: 1` (just the self source-system card). If `data/kb/index.json` is missing, first run `node packages/toolkit-framework/src/cli.mjs kb index --adapter repo-data --target . > data/kb/_baseline-index.json` and confirm it shows `total: 1`.

- [ ] **Step 2: Commit**

```bash
git add data/kb/_baseline-index.json
git commit -m "kb(V2): baseline index snapshot before slice ingestion (before/after honesty)"
```

### Task V2.3: Prepare work orders over the slice

**Files:**
- Creates: `.workorders/wo-*.yaml` (machine output)

- [ ] **Step 1: Stage the slice into a scratch dir** (so `ingest prepare` walks exactly the chosen articles, not all 119):

```bash
mkdir -p .tmp/slice
for s in $(grep 'slug:' data/kb/_slice-manifest.yaml | awk '{print $3}'); do cp "src/content/docs/$s.md" .tmp/slice/; done
ls .tmp/slice | wc -l   # expect your slice count (~18)
```

- [ ] **Step 2: Prepare** —

```bash
node packages/toolkit-framework/src/cli.mjs ingest prepare .tmp/slice
```

Expected: prints `N work order(s) queued` (≥ 18; more if any article chunked). Verify: `node packages/toolkit-framework/src/cli.mjs ingest list --status open` shows them.

- [ ] **Step 3: Commit the work orders**

```bash
git add .workorders/
git commit -m "kb(V2): prepare work orders over the ~18-article slice"
```

### Task V2.4: Fulfill the work orders (subagent-driven)

- [ ] **Step 1: For each open work order, dispatch a fresh subagent** whose brief is: load `packages/toolkit-framework/skills/ingest/SKILL.md` and run its loop for ONE work order —
  1. `ingest claim <wo-id> --by <agent-label>`
  2. read `.workorders/<wo-id>.yaml` + its `source_path`
  3. deep-decompose (delegating to `capture-and-route` discipline): one source → many typed objects, one candidate file per object at `.workorders/<wo-id>/candidates/<nn>-<schema>.yaml`, each `{ schema, object }` with mandatory `maturity: raw`, `ai_assisted: true`, `provenance.origin: <article path/url>`
  4. `ingest fulfill <wo-id>` then `ingest accept <wo-id>`
  5. return its final line as `feedback: <any framework friction hit> | feedback: none` (per the ReFi DAO feedback-loop discipline — the operator appends these to the master-plan backlog).

  Run these in parallel batches (the accept gate is atomic per work order; distinct work orders don't share candidate files). Use `superpowers:subagent-driven-development`.

- [ ] **Step 2: Verification gate** — every work order reaches `accepted`:

```bash
node packages/toolkit-framework/src/cli.mjs ingest list --status accepted | wc -l   # == work-order count
node packages/toolkit-framework/src/cli.mjs ingest list --status open               # empty
```

Any order stuck in `fulfilled` with `error_notes` = the accept gate rejected a candidate (born-rule or schema failure) — re-dispatch that one with the error notes. **Watch for the enum-fallback edge:** confirm the blog/publication source lands as `blog` (V1.1), not `database`.

- [ ] **Step 3: Commit the accepted candidates**

```bash
git add .workorders/
git commit -m "kb(V2): fulfill + accept the slice work orders → typed candidate objects"
```

### Task V2.5: Store to `data/kb/` + verify the before/after

**Files:**
- Writes: `data/kb/<schema>.yaml`, `data/kb/index.json`, `data/kb/context.jsonld`

- [ ] **Step 1: Store via the configured repo-data adapter** (matches `kms.yaml` → `data/kb/`):

```bash
node packages/toolkit-framework/src/cli.mjs store --adapter repo-data --target .
```

Expected: writes accepted objects into `data/kb/<schema>.yaml` and rewrites `data/kb/index.json`. **Watch the store output for `collisions`** — if V1.4 reported any, the title-collision edge (Edge 4) fired and both objects were preserved with a hash suffix; note the count for the diff report.

- [ ] **Step 2: Verify the real jump** —

```bash
node packages/toolkit-framework/src/cli.mjs kb index --adapter repo-data --target .
```

Expected: `total` is now baseline (1) + the slice's typed-object count (dozens); `by_type` spans multiple schemas; `by_maturity` is all `raw`; `review_queue` == total-minus-already-promoted. Confirm `total` ≫ `_baseline-index.json`'s `total: 1`.

- [ ] **Step 3: Reconciliation note** — the stale root `kb/` folder (from the earlier kb-folder run of the 07-02 call) is **not** touched here. Leave it; the canonical instance KB is `data/kb/`. Record this in the diff report (V3.1) so no one reads the root `kb/` as current.

- [ ] **Step 4: Commit the real KB**

```bash
git add data/kb/
git commit -m "kb(V2): store the slice → data/kb/ (real 0.2-machine typed objects, all raw)"
```

---

## V3 — Three artifacts

### Task V3.1: The diff report (the honest backing)

**Files:**
- Create: `docs/reports/2026-07-13-self-ingestion-diff.md`

- [ ] **Step 1: Write the report** with these sections (fill every number from V2.5's real index + the manifest — no placeholders):
  1. **What this is** — a representative slice (~18 of 119) run through the real 0.2 `ingest` pipeline; the full run resumes post-demo.
  2. **Before → after** — `data/kb/_baseline-index.json` (`total: 1`) vs the new `data/kb/index.json` (`total: N`, `by_type`, all `maturity: raw`, `review_queue: N`).
  3. **Per-type deltas** — a table: schema → count produced → 1–2 example object titles.
  4. **What the machine caught that June's heuristic missed** — compare against the June `data/{encyclopedia,concepts,…}.yaml` framework-view (the v0.1 heuristic pass): typed provenance/lineage on every object, source-system decomposition, the review-gate maturity, the capital-heavy signal (feeds V4).
  5. **Edge cases exercised** — capital-heavy, function collision, enum fallback (→ landed as `blog`), title collision (→ B5 guard preserved both; cite the `collisions` count).
  6. **The B5 story** — the ReFi DAO run surfaced a real silent-overwrite data-loss bug → fixed in the framework (V1.4) → this toolkit run benefited from the fix. The feedback loop working.
  7. **Honest caveats** — what the slice did *not* cover; the stale root `kb/` note; nothing promoted (all raw, awaiting human review).

- [ ] **Step 2: Commit**

```bash
git add docs/reports/2026-07-13-self-ingestion-diff.md
git commit -m "report(V3): self-ingestion diff — slice through the 0.2 machine (before/after + B5 story)"
```

### Task V3.2: The live page

**Files:**
- Create: `src/pages/self-ingestion.astro`
- Create: `src/data/self-ingestion-baseline.json` (import-safe copy of the baseline)
- Modify: `astro.config.mjs` (sidebar entry)

- [ ] **Step 1: Make the baseline import-safe** — Astro pages import JSON directly; copy the baseline into `src/data/` (page-relative imports of repo-root files are brittle):

```bash
cp data/kb/_baseline-index.json src/data/self-ingestion-baseline.json
```

- [ ] **Step 2: Write the page** — `src/pages/self-ingestion.astro`, following the exact patterns in `src/pages/regen-toolkit-os.astro` (Page.astro layout; base-aware `withBase`; JSON imports for data). Frontmatter:

```astro
---
import Page from "../layouts/Page.astro";
import baseline from "../data/self-ingestion-baseline.json";
import after from "../../data/kb/index.json";   // the real repo-data run

const base = import.meta.env.BASE_URL;
const withBase = (p) => base + String(p).replace(/^\//, "");

const beforeTotal = baseline.total;             // 1
const afterTotal = after.total;
const afterTypes = Object.entries(after.by_type)
  .sort((a, b) => b[1] - a[1])
  .map(([type, n]) => `${n} ${type.replace(/-/g, " ")}${n > 1 ? "s" : ""}`);
const reviewQueue = after.review_queue ?? after.reviewQueue;
---
```

Body: a title + one-paragraph honest framing ("a representative slice of the live toolkit, run through the machine — the full run comes next"), a before/after stat pair (`beforeTotal` → `afterTotal`), the `afterTypes` list, and a "everything is `raw`, `{reviewQueue}` awaiting human review — nothing promoted" note. Link back to `withBase("/framework/")` and `withBase("/regen-toolkit-os/")`. Keep the copy frame-language-clean (no extractive/hierarchical framing — Durgadas's Frame-1 check).

- [ ] **Step 3: Add to the sidebar** — in `astro.config.mjs`, in the Starlight sidebar "About the system" group (alongside the `/framework/` and `/regen-toolkit-os/` entries), add `{ label: 'Self-ingestion diff', link: '/self-ingestion/' }`.

- [ ] **Step 4: Build + verify locally**

```bash
npm run build 2>&1 | tail -5     # prebuild snapshots + astro build; expect exit 0
test -d dist/self-ingestion && echo "page built" || grep -rl "self-ingestion" dist | head -3
```

Expected: build exits 0; the page exists in `dist`. Then base-path check: `npm run dev` won't set the Pages base, so verify links use `withBase` by inspecting the built HTML for `/regen-toolkit/self-ingestion` under a Pages build: `GITHUB_PAGES=true npm run build 2>&1 | tail -3 && grep -o '/regen-toolkit/framework/' dist/self-ingestion/index.html | head -1` (expect the base-prefixed link).

- [ ] **Step 5: Commit**

```bash
git add src/pages/self-ingestion.astro src/data/self-ingestion-baseline.json astro.config.mjs
git commit -m "site(V3): self-ingestion diff page (before/after from real data/kb, base-aware)"
```

### Task V3.3: The Obsidian canvas

**Files:**
- Create: `docs/canvases/self-ingestion-diff.canvas`

- [ ] **Step 1: Author the canvas** as Obsidian JSON Canvas (shape confirmed from `docs/canvases/layers/01-ontology.canvas`: top-level `{ "nodes": [...], "edges": [...], "metadata": {...} }`; text nodes `{id,type:"text",text,x,y,width,height,color}`; file nodes `{id,type:"file",file,...}`; edges `{id,fromNode,fromSide,toNode,toSide,label,color}`; integer coords; color presets `"1"`–`"6"`). Lay out three lanes left→right:
  1. **INPUT** — a text node "~18 articles (slice of 119)" + 3–4 `file` nodes pointing at representative `src/content/docs/<slug>.md`.
  2. **THE MACHINE** — text nodes: `ingest prepare → work orders`, `agents decompose → candidates`, `accept gate (born-rules: raw · ai_assisted · provenance)`, `store → data/kb/` — with a color-`5` callout node "B5 overwrite guard — distinct title-slugs never clobber (refi-dao feedback)".
  3. **OUTPUT** — a text node with the real per-type counts (from `data/kb/index.json`) + a `file` node pointing at `data/kb/index.json`, and a note "all `raw` · N in review queue · nothing promoted".
  Edges connect INPUT→MACHINE stages→OUTPUT with labels (`prepare`, `decompose`, `accept`, `store`). Add `"metadata": { "name": "Self-ingestion diff", "generated": "2026-07-14", "slice": 18 }`.

- [ ] **Step 2: Validate the JSON + unique ids**

```bash
python3 -c "import json; c=json.load(open('docs/canvases/self-ingestion-diff.canvas')); ids=[n['id'] for n in c['nodes']]; assert len(ids)==len(set(ids)); print('ok', len(ids), 'nodes', len(c['edges']), 'edges')"
```

Expected: `ok`. Then ask the operator to open it in Obsidian and confirm no overlap / readable lanes (fix only `x/y/width/height` if reported).

- [ ] **Step 3: Commit**

```bash
git add docs/canvases/self-ingestion-diff.canvas
git commit -m "canvas(V3): self-ingestion flow + before/after + B5 guard callout"
```

### Task V3.4: Deploy the page (draft-and-present)

- [ ] **Step 1: Present before push** — the GitHub Pages deploy triggers on push to `regen-toolkit-os` (`.github/workflows/deploy-pages.yml`), and the preview is public at `https://explorience.github.io/regen-toolkit/`. Per the draft-and-present rule, STOP and present to the operator: the page's preview URL (`…/regen-toolkit/self-ingestion/`), a summary of what it shows, and ask for go/no-go on push.

- [ ] **Step 2: On explicit yes only** — push the branch to fire the workflow:

```bash
git push fork regen-toolkit-os   # fork = luizfernandosg/regen-toolkit (the Pages-enabled remote)
```

Then confirm the Action run succeeds (operator can watch `gh run list --branch regen-toolkit-os` or the Actions tab) and the page is live at the preview URL. Do not push to `origin`/`main` (the live Vercel site's lane).

---

## V4 — Capital contribute-back proposal (draft-only)

### Task V4.1: Draft the 8-Forms-of-Capital `update-proposal`

**Files:**
- Read: `packages/toolkit-framework/schemas/update-proposal.yaml` (the proposal shape) + `docs/reports/2026-07-05-ontology-comparison.md` §8 (the capital gap) + the master doc's capital treatment (grep `docs/MASTER.md` for "forms of capital")
- Create: `docs/proposals/2026-07-13-capital-update-proposal.md`

- [ ] **Step 1: Draft the proposal** — a concrete `update-proposal` (following `update-proposal.yaml`'s fields) to add a **capital-accounting axis + predicates** to the kernel. Contents:
  1. **The gap** — the kernel has no capital-accounting axis or predicates; the current build carries the 8 Forms of Capital first-class; ReFi content is saturated with it (cite the capital-heavy signal from V2/V3.1).
  2. **The proposal** — a namespaced extension: a `capital_form` classification (the 8 forms: living, material, financial, social, intellectual, experiential, spiritual, cultural), a small predicate set (e.g. `regenerates`, `depletes`, `converts-to`), and how they attach to existing entities (resource/claim/signal) with `maps_to_core`. Kernel stays a subset; this is a Layer-B extension + a proposed core predicate, not a breaking core change.
  3. **Why contribute-back, not conform** — the HYBRID decision: adopt the framework backbone, feed the missing regenerative piece upstream.
  4. **What it unlocks** — capital accounting across every instance's typed objects; the shared axis both orgs federate on.

- [ ] **Step 2: Guard rails** — this is **draft-only**. Do NOT edit `docs/MASTER.md` (Matt's doc; CLAUDE.md rule). The file header must say: "DRAFT for Matty — to shape together on the Jul 16 call. Not applied to the master doc."

- [ ] **Step 3: Commit + flag for presentation**

```bash
git add docs/proposals/2026-07-13-capital-update-proposal.md
git commit -m "proposal(V4): 8-Forms-of-Capital update-proposal (draft — to shape with Matty Jul 16)"
```

Present to the operator as the flagship contribute-back to walk Matty through — not to send anywhere.

---

## Final verification (against design §6 success criteria)

- [ ] **1 — V1 green:** `cd packages/toolkit-framework && npm test` → all pass (was 100; now higher). The four fixes are in.
- [ ] **2 — real ingestion:** `data/kb/index.json` `total` ≫ 1, spanning multiple `by_type`, all `maturity: raw`; produced by `store --adapter repo-data`, not by hand.
- [ ] **3 — three artifacts exist:** `src/pages/self-ingestion.astro` (built + optionally deployed), `docs/canvases/self-ingestion-diff.canvas` (valid JSON), `docs/reports/2026-07-13-self-ingestion-diff.md` (committed).
- [ ] **4 — capital proposal drafted, not sent:** `docs/proposals/2026-07-13-capital-update-proposal.md` exists; `docs/MASTER.md` untouched (`git status docs/MASTER.md` clean).
- [ ] **5 — feedback loop visible:** the B5 fix (V1.4) + the Jul-14 intake (V1-intake) are recorded in the master-plan decision log.
- [ ] **6 — honest framing:** every artifact says "representative subset," "full run resumes next," "all raw / awaiting review" — nothing overclaimed.
- [ ] **7 — plans reconciled:** `docs/plans/framework-validation-pass.md` is the live plan; 3 stale plans archived with banners; QUEUE + HEARTBEAT updated.

---

## Out of scope (do NOT start — post-Jul-16 phases)

- Full 119 self-ingestion (resumes after the demo, once V1 fixes are confirmed by Jul-14 feedback)
- Repo migration → RC GitHub org (own decision + runbook)
- OS-overlay → `main` (needs a written proposal; the meeting left it open)
- Resource-DB V3 full lift (698 rows; gated on the `held` state landing first)
- Promoting any ingested object beyond `raw` (that's a human `review promote` session, not this pass)
