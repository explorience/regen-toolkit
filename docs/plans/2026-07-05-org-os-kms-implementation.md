# org-os-kms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take `@org-os/kms` from scaffold to a full functional module that runs the toolkit-framework's KMS machine against a live org-os instance — executable lifecycle, registry bridge, CLI, dashboard + site render, federation — proven end-to-end on regen-toolkit with refi-dao-os as a real peer.

**Architecture:** A thin orchestration layer over `@regen-commons/toolkit-framework`'s public API. Registry + lifecycle **bindings stay declarative** (`bind.mjs`); a small op-registry (`ops.mjs`) + executor (`executor.mjs`) make them *run*. Thin imperative modules only where config can't express it: registry bridge, render, federation wrapper, promotion. The framework stays the single source of truth — no ingest/accept/review/validate logic is reimplemented; it is *called*.

**Tech Stack:** Pure ESM `.mjs`, zero build, `js-yaml`, `node --test`. All framework access via relative sibling path centralized in `src/framework.mjs`.

---

## Design reference (verified 2026-07-05)

**Framework import:** no npm workspaces, no linked `node_modules`. Framework resolves ONLY by relative path `../../toolkit-framework/src/<module>.mjs`. All of org-os-kms imports it through **one** shim, `src/framework.mjs`.

**Framework functions org-os-kms calls (exact):**
- `index.mjs`: `listSchemas()→string[]`, `loadSchema(name)`, `validateObject(schemaName,obj)→{valid,errors}`, `isValid(axis,value)→bool`, `toJsonLdContext(baseIri?)→{'@context'}`, `checkInvariants(obj)→{ok,...}`, `schemaFields(name)`.
- `storage.mjs`: `getAdapter(name)→adapter`, `listAdapters()→string[]`, `slugify(s)→string`, `deriveIndex(items,from)→{total,by_type,by_maturity,review_queue,generated_from}`, `isAwaitingReview(obj)→bool`.
- Adapter contract (call ON the adapter, never destructure — methods use `this`): `store(target,entries)→{stored:[ref]}`, `list(target)→[{schema,object,ref}]`, `update(target,ref,patch)→{ref,object}`, `index(target)→{...}`, `writeIndex(target)→{indexPath,contextPath}`, `name`.
- `repo-data` adapter writes `<target>/data/kb/<schema>.yaml` (entries keyed by slug), and `writeIndex` writes `<target>/data/kb/index.json` + `<target>/data/kb/context.jsonld`. Ref shape: `"<target>/data/kb/<schema>.yaml#<slug>"`.
- `review.mjs`: `reviewQueue({adapter,target})→[{schema,object,ref}]`, `promote({adapter,target,ref,maturity,reviewer,date})→{ref,object}`.
- `instance.mjs`: `loadConfig(dir='.')→config|null` (reads `<dir>/kms.yaml`), `initInstance({dir,name,mode,existingPath,adapter,target})→{instance,dir,workOrders}`, `federateAdd({dir,cardPath})→{slug,ref}` (writes `peers[slug]=ref`), `federateCheck({extensionsPath})→{compatible,incompatible}`.
- `ingest.mjs`: `prepare({path,workOrdersDir})→{created,skipped}`, `acceptWorkOrder({workOrdersDir,id})→{accepted,errors,objects:[{schema,object}]}`, `classifySource(path,content)→string`, `suggestSchemas(sourceType)→string[]`.

**kms.yaml shape** (framework `loadConfig` reads/writes these; open-model allows extra keys): `instance`, `adapter`, `target`, `self_ref`, `peers` (map `slug→ref`), `framework`. org-os-kms adds (harmless extras): `federation_namespace`, `upstream`, `render`, `peer_extensions`.

**Existing scaffold (keep + extend):** `bind.mjs` exports `REGISTRY_BINDINGS` (10 keys), `LIFECYCLE_BINDINGS`, `toOrgOsRegistries()`, `profileManifest()`. `test/bind.test.mjs` (2 tests) MUST keep passing.

**Repo facts:** `data/kb/` does NOT exist yet (adapter creates it). Existing org-os registries in `data/`: `resources.yaml`, `source-systems.yaml`, `option-library.yaml`, `tracks.yaml` exist; `deployments.yaml`, `implementation-memory.yaml`, `evolution-log.yaml`, `signals.yaml`, `contributions.yaml`, `misc.yaml` do NOT. No `packages/` gitignore — new files track.

**Refinements vs. spec:** (a) `target: '.'` not `data/kb`; (b) `csis-review` + `emit-contributions` are **skill directives**, not JS ops — executor collects them for the agent; (c) federation delegates to framework `federateAdd`/`federateCheck` — org-os-kms adds only RegenOS namespacing + a draft-only `contribute`.

**Test conventions (copy exactly):** `import { test } from 'node:test'; import assert from 'node:assert/strict';` · temp dirs via `mkdtempSync(join(tmpdir(),'kms-<name>-'))` (`mkdtempSync` from `node:fs`, `tmpdir` from `node:os`) · `const here = dirname(fileURLToPath(import.meta.url))` · imports from `'../src/<file>.mjs'`.

---

## File structure

```
packages/org-os-kms/
  src/
    framework.mjs        NEW — single access point; re-exports framework fns from relative sibling paths
    bind.mjs             MODIFY — LIFECYCLE_BINDINGS → canonical op-names; reconcile REGISTRY_BINDINGS ↔ profile
    config.mjs           NEW — loadKmsConfig(dir): wrap framework loadConfig + validate kms extras
    ops.mjs              NEW — OPS registry: op-name → {kind:'exec'|'skill', write?, run?}
    executor.mjs         NEW — runLifecycle(event, ctx): resolve ops, run in order, fail policy, collect skills
    registry-bridge.mjs  NEW — bridge(ctx): data/kb/<schema>.yaml → data/<registry>.yaml (upsert by id) + md docs
    render.mjs           NEW — renderDashboardSection(index) + renderSiteData({dir,target,outPath})
    federate.mjs         NEW — addPeer/checkPeers (delegate to framework) + contribute (draft-only) under RegenOS
    promote.mjs          NEW — promote({from,to,apply}): checksum drift manifest, draft-only by default
    cli.mjs              NEW — dispatch(argv): lifecycle|bridge|render|federate|promote|init
  profile/profile.yaml   MODIFY — reconcile registry_bindings + lifecycle op-names
  test/
    bind.test.mjs        KEEP (2 passing)
    framework.test.mjs   NEW
    config.test.mjs      NEW
    ops.test.mjs         NEW
    executor.test.mjs    NEW
    registry-bridge.test.mjs NEW
    render.test.mjs      NEW
    federate.test.mjs    NEW
    promote.test.mjs     NEW
    cli.test.mjs         NEW
    e2e.test.mjs         NEW — the adoption gate
kms.yaml                 NEW (repo root) — regen-toolkit instance config
scripts/initialize.mjs   MODIFY — inject KB dashboard section (guarded)
src/pages/knowledge-commons.astro NEW — minimal site surface reading src/data/kms-index.json
src/data/kms-index.json  GENERATED by render.site
```

All commands below run from `packages/org-os-kms/` unless noted. `npm test` = `node --test`.

---

## Phase 0 — Foundation

### Task 1: Framework access shim (`src/framework.mjs`)

**Files:**
- Create: `packages/org-os-kms/src/framework.mjs`
- Test: `packages/org-os-kms/test/framework.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/framework.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fw from '../src/framework.mjs';

test('framework shim re-exports the functions org-os-kms needs', () => {
  for (const name of ['listSchemas', 'validateObject', 'getAdapter', 'slugify',
    'deriveIndex', 'isAwaitingReview', 'reviewQueue', 'promote', 'loadConfig',
    'federateAdd', 'federateCheck', 'prepare', 'acceptWorkOrder']) {
    assert.equal(typeof fw[name], 'function', `missing ${name}`);
  }
});

test('framework shim resolves live schemas (binding actually reaches the framework)', () => {
  assert.ok(fw.listSchemas().includes('source-system'));
  assert.ok(fw.listSchemas().includes('review-maturity'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/framework.test.mjs`
Expected: FAIL — cannot find module `../src/framework.mjs`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/framework.mjs
// THE single access point to @regen-commons/toolkit-framework.
// Resolved by RELATIVE sibling path because this repo has no npm workspaces and no
// linked node_modules. To publish org-os-kms to canonical org-os (where the framework
// is an installed package), change ONLY the specifiers below to the bare package name.
export {
  listSchemas, loadSchema, validateObject, isValid, schemaFields,
  toJsonLdContext, checkInvariants,
} from '../../toolkit-framework/src/index.mjs';
export {
  getAdapter, listAdapters, slugify, deriveIndex, isAwaitingReview,
} from '../../toolkit-framework/src/storage.mjs';
export { reviewQueue, promote } from '../../toolkit-framework/src/review.mjs';
export {
  loadConfig, initInstance, federateAdd, federateCheck,
} from '../../toolkit-framework/src/instance.mjs';
export {
  prepare, acceptWorkOrder, classifySource, suggestSchemas,
} from '../../toolkit-framework/src/ingest.mjs';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/framework.test.mjs`
Expected: PASS (2/2).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/framework.mjs packages/org-os-kms/test/framework.test.mjs
git commit -m "feat(org-os-kms): framework access shim (single relative import point)"
```

---

### Task 2: Canonical op-names in `bind.mjs` + profile reconcile

**Files:**
- Modify: `packages/org-os-kms/src/bind.mjs` (LIFECYCLE_BINDINGS block)
- Modify: `packages/org-os-kms/profile/profile.yaml` (registry_bindings + lifecycle_bindings)
- Test: extend `packages/org-os-kms/test/bind.test.mjs`

- [ ] **Step 1: Write the failing test (append to bind.test.mjs)**

```javascript
// append to test/bind.test.mjs
import { LIFECYCLE_BINDINGS } from '../src/bind.mjs';

test('lifecycle bindings are canonical op-names (initialize/close)', () => {
  assert.deepEqual(LIFECYCLE_BINDINGS.initialize,
    ['config.load', 'index.rebuild', 'review.list', 'render.dashboard', 'render.site']);
  assert.deepEqual(LIFECYCLE_BINDINGS.close,
    ['csis-review', 'bridge', 'emit-contributions', 'federate.check', 'render.site', 'render.dashboard', 'sync.push']);
});

test('REGISTRY_BINDINGS keeps all 10 schema targets', () => {
  assert.equal(Object.keys(REGISTRY_BINDINGS).length, 10);
  assert.equal(REGISTRY_BINDINGS['encyclopedia-entry'], 'src/content/docs/');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/bind.test.mjs`
Expected: FAIL — current `LIFECYCLE_BINDINGS` uses `/initialize` keys with descriptive strings.

- [ ] **Step 3: Edit `src/bind.mjs`** — replace the `LIFECYCLE_BINDINGS` block (keep `REGISTRY_BINDINGS`, `toOrgOsRegistries`, `profileManifest` unchanged):

```javascript
/** org-os session lifecycle -> ordered framework op-names (resolved by src/ops.mjs). */
export const LIFECYCLE_BINDINGS = {
  initialize: ['config.load', 'index.rebuild', 'review.list', 'render.dashboard', 'render.site'],
  close: ['csis-review', 'bridge', 'emit-contributions', 'federate.check', 'render.site', 'render.dashboard', 'sync.push'],
};
```

- [ ] **Step 4: Edit `profile/profile.yaml`** — replace `registry_bindings:` (add the 2 missing schemas so it matches `bind.mjs`) and `lifecycle_bindings:` (use op-names):

```yaml
registry_bindings:            # framework schema -> org-os registry (must match src/bind.mjs)
  resource: data/resources.yaml
  source-system: data/source-systems.yaml
  option-entry: data/option-library.yaml
  track: data/tracks.yaml
  deployment: data/deployments.yaml
  implementation-record: data/implementation-memory.yaml
  evolution-record: data/evolution-log.yaml
  signal: data/signals.yaml
  contribution-record: data/contributions.yaml
  encyclopedia-entry: src/content/docs/

lifecycle_bindings:
  initialize: [config.load, index.rebuild, review.list, render.dashboard, render.site]
  close: [csis-review, bridge, emit-contributions, federate.check, render.site, render.dashboard, sync.push]
```

- [ ] **Step 5: Run tests and commit**

Run: `node --test`
Expected: PASS (bind.test.mjs 4/4, framework 2/2).

```bash
git add packages/org-os-kms/src/bind.mjs packages/org-os-kms/profile/profile.yaml packages/org-os-kms/test/bind.test.mjs
git commit -m "feat(org-os-kms): canonical lifecycle op-names; reconcile profile↔bind bindings"
```

---

### Task 3: Op registry (`src/ops.mjs`)

**Files:**
- Create: `packages/org-os-kms/src/ops.mjs`
- Test: `packages/org-os-kms/test/ops.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/ops.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OPS } from '../src/ops.mjs';
import { LIFECYCLE_BINDINGS } from '../src/bind.mjs';

test('every lifecycle op-name resolves to a registered op', () => {
  const names = new Set([...LIFECYCLE_BINDINGS.initialize, ...LIFECYCLE_BINDINGS.close]);
  for (const n of names) assert.ok(OPS[n], `unregistered op: ${n}`);
});

test('exec ops carry a run() fn; skill ops carry a skill name', () => {
  for (const [name, op] of Object.entries(OPS)) {
    if (op.kind === 'exec') assert.equal(typeof op.run, 'function', `${name} missing run`);
    else { assert.equal(op.kind, 'skill'); assert.ok(op.skill, `${name} missing skill`); }
  }
});

test('csis-review and emit-contributions are skill directives', () => {
  assert.equal(OPS['csis-review'].kind, 'skill');
  assert.equal(OPS['emit-contributions'].kind, 'skill');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/ops.test.mjs`
Expected: FAIL — no `../src/ops.mjs`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/ops.mjs
// The OP REGISTRY: maps declarative op-names (from bind.mjs LIFECYCLE_BINDINGS) to either
// an executable thunk over the framework API (kind:'exec') or an agent skill directive
// (kind:'skill'). This is what makes the declarative lifecycle actually run, without
// reimplementing any framework logic. `write:true` marks ops whose failure must stop the
// run (fail-hard); reads/renders are fail-soft.
import * as fw from './framework.mjs';
import { loadKmsConfig } from './config.mjs';
import { bridge } from './registry-bridge.mjs';
import { renderDashboardSection, renderSiteData } from './render.mjs';
import { checkPeers } from './federate.mjs';

export const OPS = {
  // write:true here = CRITICAL/fail-hard: if kms.yaml can't load, no downstream op can run.
  'config.load': { kind: 'exec', write: true, run: (ctx) => {
    ctx.config = loadKmsConfig(ctx.dir);
    return { ok: true, report: { instance: ctx.config.instance } };
  } },

  'index.rebuild': { kind: 'exec', write: false, run: (ctx) => {
    const a = fw.getAdapter(ctx.config.adapter);
    const written = a.writeIndex(ctx.config.target);
    ctx.index = a.index(ctx.config.target);
    return { ok: true, report: { total: ctx.index.total, ...written } };
  } },

  'review.list': { kind: 'exec', write: false, run: (ctx) => {
    ctx.review = fw.reviewQueue({ adapter: ctx.config.adapter, target: ctx.config.target });
    return { ok: true, report: { awaiting: ctx.review.length } };
  } },

  'render.dashboard': { kind: 'exec', write: false, run: (ctx) => {
    ctx.dashboardSection = renderDashboardSection(ctx.index || {});
    return { ok: true };
  } },

  'render.site': { kind: 'exec', write: false, run: (ctx) => {
    return renderSiteData({ dir: ctx.dir, target: ctx.config.target,
      outPath: (ctx.config.render && ctx.config.render.site_data) || 'src/data/kms-index.json' });
  } },

  'bridge': { kind: 'exec', write: true, run: (ctx) => bridge(ctx) },

  'federate.check': { kind: 'exec', write: false, run: (ctx) => checkPeers(ctx) },

  'sync.push': { kind: 'exec', write: true, run: () => (
    { ok: true, report: { draft: true, note: 'git add/commit/push — draft-and-present, run after review' } }
  ) },

  // skill directives — judgment ops the agent runs; the executor collects them.
  'csis-review': { kind: 'skill', skill: 'csis-review' },
  'emit-contributions': { kind: 'skill', skill: 'register-source' },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/ops.test.mjs`
Expected: PASS (3/3). (This file imports config/registry-bridge/render/federate — they don't exist yet, so ALSO create empty stubs to let the import resolve; the next tasks fill them. Create these one-line stubs now:)

```javascript
// src/config.mjs   (stub — Task 4 fills it)
export function loadKmsConfig() { throw new Error('not implemented'); }
// src/registry-bridge.mjs   (stub — Task 6 fills it)
export function bridge() { throw new Error('not implemented'); }
// src/render.mjs   (stub — Task 7 fills it)
export function renderDashboardSection() { throw new Error('not implemented'); }
export function renderSiteData() { throw new Error('not implemented'); }
// src/federate.mjs   (stub — Task 8 fills it)
export function checkPeers() { throw new Error('not implemented'); }
```

Re-run `node --test test/ops.test.mjs` → PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/ops.mjs packages/org-os-kms/src/config.mjs packages/org-os-kms/src/registry-bridge.mjs packages/org-os-kms/src/render.mjs packages/org-os-kms/src/federate.mjs packages/org-os-kms/test/ops.test.mjs
git commit -m "feat(org-os-kms): op registry (exec thunks + skill directives) with module stubs"
```

---

## Phase 1 — Config & executor

### Task 4: Config loader (`src/config.mjs`)

**Files:**
- Modify: `packages/org-os-kms/src/config.mjs` (replace the stub)
- Test: `packages/org-os-kms/test/config.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/config.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadKmsConfig } from '../src/config.mjs';

function tmpInstance(yamlText) {
  const dir = mkdtempSync(join(tmpdir(), 'kms-config-'));
  if (yamlText != null) writeFileSync(join(dir, 'kms.yaml'), yamlText);
  return dir;
}

test('loads a valid kms.yaml and defaults render to {}', () => {
  const dir = tmpInstance('instance: t\nadapter: repo-data\ntarget: "."\n');
  const cfg = loadKmsConfig(dir);
  assert.equal(cfg.instance, 't');
  assert.equal(cfg.adapter, 'repo-data');
  assert.deepEqual(cfg.render, {});
});

test('throws a clear error when kms.yaml is absent', () => {
  const dir = tmpInstance(null);
  assert.throws(() => loadKmsConfig(dir), /no kms.yaml/);
});

test('throws when adapter or target is missing', () => {
  const dir = tmpInstance('instance: t\n');
  assert.throws(() => loadKmsConfig(dir), /missing "adapter"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/config.test.mjs`
Expected: FAIL — stub throws `not implemented`.

- [ ] **Step 3: Replace `src/config.mjs`**

```javascript
// src/config.mjs
// Thin wrapper over the framework's loadConfig: reads <dir>/kms.yaml, validates the keys
// org-os-kms needs, and guarantees an object (never null) so callers can rely on it.
import * as fw from './framework.mjs';

export function loadKmsConfig(dir = '.') {
  const cfg = fw.loadConfig(dir);
  if (!cfg) throw new Error(`not an initialized instance (no kms.yaml): ${dir}`);
  if (!cfg.adapter) throw new Error('kms.yaml: missing "adapter"');
  if (cfg.target === undefined) throw new Error('kms.yaml: missing "target"');
  return { render: {}, peers: {}, ...cfg };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/config.test.mjs`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/config.mjs packages/org-os-kms/test/config.test.mjs
git commit -m "feat(org-os-kms): kms.yaml config loader with validation guards"
```

---

### Task 5: Lifecycle executor (`src/executor.mjs`)

**Files:**
- Create: `packages/org-os-kms/src/executor.mjs`
- Test: `packages/org-os-kms/test/executor.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/executor.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runLifecycle } from '../src/executor.mjs';
import { OPS } from '../src/ops.mjs';

// Build an isolated OPS-like map by monkeypatching run() to record order without touching disk.
function stubOps(order) {
  return {
    'a.read':  { kind: 'exec', write: false, run: () => { order.push('a.read'); return { ok: true }; } },
    'a.write': { kind: 'exec', write: true,  run: () => { order.push('a.write'); return { ok: true }; } },
    'a.render': { kind: 'exec', write: false, run: () => { order.push('a.render'); throw new Error('render boom'); } },
    'a.crash': { kind: 'exec', write: true,  run: () => { order.push('a.crash'); throw new Error('write boom'); } },
    'a.skill': { kind: 'skill', skill: 'demo-skill' },
  };
}

test('runs exec ops in order, collects skill directives', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.read', 'a.skill', 'a.write'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.read', 'a.write']);
  assert.deepEqual(r.skills, ['demo-skill']);
  assert.equal(r.errors.length, 0);
});

test('fail-soft: a render/read op error is logged but the run continues', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.render', 'a.read'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.render', 'a.read']);
  assert.match(r.errors[0], /render boom/);
});

test('fail-hard: a write op error stops the run', () => {
  const order = [];
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.crash', 'a.read'] }, ops: stubOps(order) });
  assert.deepEqual(order, ['a.crash']); // a.read never runs
  assert.match(r.errors[0], /write boom/);
});

test('fail-hard: a write op that returns {ok:false} (no throw) stops the run', () => {
  const order = [];
  const ops = {
    'a.softfail': { kind: 'exec', write: true, run: () => { order.push('a.softfail'); return { ok: false }; } },
    'a.read': { kind: 'exec', write: false, run: () => { order.push('a.read'); return { ok: true }; } },
  };
  const r = runLifecycle('initialize', { dir: '.' },
    { events: { initialize: ['a.softfail', 'a.read'] }, ops });
  assert.deepEqual(order, ['a.softfail']); // a.read never runs
  assert.match(r.errors[0], /a.softfail: reported failure/);
});

test('default deps use the real OPS + LIFECYCLE_BINDINGS', () => {
  assert.ok(OPS['config.load']); // sanity: real registry wired
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/executor.test.mjs`
Expected: FAIL — no `../src/executor.mjs`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/executor.mjs
// Reads a lifecycle event's ordered op-names, resolves each via the op registry, and runs
// exec ops in order. Fail policy: write ops fail-hard (stop, no partial corruption);
// read/render ops fail-soft (log + continue). Skill directives are collected for the agent.
import { LIFECYCLE_BINDINGS } from './bind.mjs';
import { OPS as DEFAULT_OPS } from './ops.mjs';

export function runLifecycle(event, ctx = {}, deps = {}) {
  const events = deps.events || LIFECYCLE_BINDINGS;
  const ops = deps.ops || DEFAULT_OPS;
  const names = events[event];
  if (!names) throw new Error(`unknown lifecycle event: ${event}`);

  const report = { event, ran: [], skills: [], errors: [] };
  for (const name of names) {
    const op = ops[name];
    if (!op) { report.errors.push(`unregistered op: ${name}`); return report; } // config error → fail-hard
    if (op.kind === 'skill') { report.skills.push(op.skill); continue; }
    try {
      const res = op.run(ctx) || {};
      const ok = res.ok !== false;
      report.ran.push({ op: name, ok, report: res.report });
      // A write op that REPORTS failure (without throwing) is also fail-hard: the real write
      // ops (bridge) signal errors via { ok:false }, not exceptions.
      if (!ok && op.write) { report.errors.push(`${name}: reported failure`); return report; }
    } catch (e) {
      report.errors.push(`${name}: ${e.message}`);
      if (op.write) return report; // fail-hard on throw
      // else fail-soft: continue
    }
  }
  return report;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/executor.test.mjs`
Expected: PASS (4/4).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/executor.mjs packages/org-os-kms/test/executor.test.mjs
git commit -m "feat(org-os-kms): lifecycle executor (ordered ops, fail-hard writes, skill collection)"
```

---

## Phase 2 — Imperative modules

### Task 6: Registry bridge (`src/registry-bridge.mjs`)

**Files:**
- Modify: `packages/org-os-kms/src/registry-bridge.mjs` (replace stub)
- Test: `packages/org-os-kms/test/registry-bridge.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/registry-bridge.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { bridge } from '../src/registry-bridge.mjs';
import * as fw from '../src/framework.mjs';

// Seed a temp instance's framework KB (data/kb/) via the repo-data adapter, then bridge.
function seed() {
  const dir = mkdtempSync(join(tmpdir(), 'kms-bridge-'));
  const a = fw.getAdapter('repo-data');
  a.store('.', []); // no-op guard
  // store a resource + a source-system into <dir>/data/kb/
  const a2 = fw.getAdapter('repo-data');
  a2.store(dir, [
    { schema: 'resource', object: { id: 'r1', title: 'Res One', maturity: 'raw', ai_assisted: true } },
    { schema: 'source-system', object: { id: 's1', title: 'Src One', type: 'wiki', steward: 'S', return_path: 'PRs' } },
  ]);
  return dir;
}

test('bridges framework KB objects into data/<registry>.yaml, upsert by id', () => {
  const dir = seed();
  const ctx = { dir, config: { adapter: 'repo-data', target: dir } };
  const out = bridge(ctx);
  assert.equal(out.ok, true);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const key = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.ok(resDoc[key].some(e => e.id === 'r1'));
});

test('idempotent: bridging twice does not duplicate', () => {
  const dir = seed();
  const ctx = { dir, config: { adapter: 'repo-data', target: dir } };
  bridge(ctx); bridge(ctx);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const key = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.equal(resDoc[key].filter(e => e.id === 'r1').length, 1);
});

test('non-destructive: pre-existing registry entries survive', () => {
  const dir = seed();
  mkdirSync(join(dir, 'data'), { recursive: true });
  writeFileSync(join(dir, 'data/resources.yaml'),
    yaml.dump({ resources: [{ id: 'keep', title: 'Keep Me' }] }));
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  assert.ok(resDoc.resources.some(e => e.id === 'keep'));
  assert.ok(resDoc.resources.some(e => e.id === 'r1'));
});

test('encyclopedia-entry writes a markdown doc, not a registry row', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-bridge-md-'));
  fw.getAdapter('repo-data').store(dir, [
    { schema: 'encyclopedia-entry', object: { id: 'topic-x', title: 'Topic X', body: 'Hello.' } },
  ]);
  bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  const p = join(dir, 'src/content/docs/topic-x.md');
  assert.ok(existsSync(p));
  assert.match(readFileSync(p, 'utf8'), /^---\n[\s\S]*title: Topic X[\s\S]*---\n\nHello\./);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/registry-bridge.test.mjs`
Expected: FAIL — stub throws `not implemented`.

- [ ] **Step 3: Replace `src/registry-bridge.mjs`**

```javascript
// src/registry-bridge.mjs
// Bridges the framework's repo-data KB (<target>/data/kb/<schema>.yaml, entries keyed by
// slug) into the live org-os instance registries (data/<registry>.yaml, a top-level list
// keyed by id). Upsert-by-id: idempotent and NON-DESTRUCTIVE (never deletes instance-only
// rows, never clobbers unmapped keys). encyclopedia-entry is the markdown special case.
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import * as fw from './framework.mjs';
import { REGISTRY_BINDINGS } from './bind.mjs';

function atomicWrite(absPath, text) {
  mkdirSync(dirname(absPath), { recursive: true });
  const tmp = absPath + '.tmp';
  writeFileSync(tmp, text);
  renameSync(tmp, absPath);
}

function upsertRegistry(absPath, stem, obj) {
  let doc = {};
  if (existsSync(absPath)) doc = yaml.load(readFileSync(absPath, 'utf8')) || {};
  // Prefer the file's existing list key; fall back to the filename stem for new files.
  const key = Object.keys(doc).find((k) => Array.isArray(doc[k])) || stem;
  if (!Array.isArray(doc[key])) doc[key] = [];
  const id = obj.id || fw.slugify(obj.title || '');
  const row = { id, ...obj };
  const i = doc[key].findIndex((e) => e.id === id);
  if (i >= 0) doc[key][i] = { ...doc[key][i], ...row };
  else doc[key].push(row);
  atomicWrite(absPath, yaml.dump(doc));
  return { registry: absPath, key, id, action: i >= 0 ? 'update' : 'insert' };
}

function writeMarkdownDoc(absPath, obj) {
  const { title = 'Untitled', body = '', ...rest } = obj;
  const fm = yaml.dump({ title, ...rest }).trim();
  atomicWrite(absPath, `---\n${fm}\n---\n\n${body}\n`);
  return { doc: absPath };
}

export function bridge(ctx) {
  const { dir, config } = ctx;
  const items = fw.getAdapter(config.adapter).list(config.target);
  const report = { bridged: [], docs: [], skipped: [], errors: [] };
  for (const { schema, object } of items) {
    try {
      const registry = REGISTRY_BINDINGS[schema];
      if (!registry) { report.skipped.push(schema); continue; }
      if (registry.endsWith('/')) {
        const slug = object.id || fw.slugify(object.title || 'untitled');
        report.docs.push(writeMarkdownDoc(join(dir, registry, `${slug}.md`), object).doc);
      } else {
        const stem = registry.replace(/^data\//, '').replace(/\.yaml$/, '');
        report.bridged.push(upsertRegistry(join(dir, registry), stem, object));
      }
    } catch (e) {
      report.errors.push(`${schema}: ${e.message}`);
    }
  }
  return { ok: report.errors.length === 0, report };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/registry-bridge.test.mjs`
Expected: PASS (4/4).

> Note for the human operator: before running the LIVE dogfood (Task 15), open a real
> registry (`data/resources.yaml`, `data/source-systems.yaml`) and confirm the top-level
> list key. The bridge already prefers the file's existing key, so live files bind under
> their real key; only brand-new registry files use the filename stem.

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/registry-bridge.mjs packages/org-os-kms/test/registry-bridge.test.mjs
git commit -m "feat(org-os-kms): registry bridge (upsert-by-id, non-destructive, md special case)"
```

---

### Task 7: Render (`src/render.mjs`)

**Files:**
- Modify: `packages/org-os-kms/src/render.mjs` (replace stub)
- Test: `packages/org-os-kms/test/render.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderDashboardSection, renderSiteData } from '../src/render.mjs';

test('dashboard section renders totals, types, and review depth', () => {
  const s = renderDashboardSection({ total: 3, by_type: { resource: 2, signal: 1 }, review_queue: 1 });
  assert.match(s, /Knowledge Commons/);
  assert.match(s, /3 objects/);
  assert.match(s, /resource/);
  assert.match(s, /1 awaiting review/);
});

test('dashboard section tolerates an empty index', () => {
  const s = renderDashboardSection({});
  assert.match(s, /0 objects/);
});

test('site data copies the derived index.json to the site path', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-render-'));
  mkdirSync(join(dir, 'data/kb'), { recursive: true });
  writeFileSync(join(dir, 'data/kb/index.json'), JSON.stringify({ total: 2, by_type: { resource: 2 } }));
  const out = renderSiteData({ dir, target: dir, outPath: 'src/data/kms-index.json' });
  assert.equal(out.ok, true);
  const written = JSON.parse(readFileSync(join(dir, 'src/data/kms-index.json'), 'utf8'));
  assert.equal(written.total, 2);
});

test('site data returns ok:false (fail-soft) when no index.json exists yet', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-render-empty-'));
  const out = renderSiteData({ dir, target: dir, outPath: 'src/data/kms-index.json' });
  assert.equal(out.ok, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/render.test.mjs`
Expected: FAIL — stub throws `not implemented`.

- [ ] **Step 3: Replace `src/render.mjs`**

```javascript
// src/render.mjs
// Two render outputs (Seam 3 = data → surface). renderDashboardSection() returns an ASCII
// block for the ops dashboard (scripts/initialize.mjs). renderSiteData() copies the
// framework's derived index.json to a site-consumable path; it never hand-authors the index.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export function renderDashboardSection(index = {}) {
  const total = index.total ?? 0;
  const byType = index.by_type || {};
  const rq = index.review_queue;
  const awaiting = Array.isArray(rq) ? rq.length : (rq ?? 0);
  const lines = [];
  lines.push('─── Knowledge Commons ' + '─'.repeat(55));
  lines.push('');
  lines.push(`  ${total} objects · ${Object.keys(byType).length} types · ${awaiting} awaiting review`);
  for (const [t, n] of Object.entries(byType)) lines.push(`  ${String(n).padStart(4)}  ${t}`);
  lines.push('');
  return lines.join('\n');
}

export function renderSiteData({ dir, target, outPath }) {
  // Read from `target` (where the repo-data adapter wrote the KB); write under `dir` (the
  // instance root). Do NOT join dir+target — for repo-data they denote the same root, and an
  // absolute target would break path.join.
  const src = join(target, 'data', 'kb', 'index.json');
  if (!existsSync(src)) return { ok: false, report: 'no data/kb/index.json — run index.rebuild first' };
  const data = JSON.parse(readFileSync(src, 'utf8'));
  const out = join(dir, outPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2));
  return { ok: true, report: { wrote: out } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/render.test.mjs`
Expected: PASS (4/4).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/render.mjs packages/org-os-kms/test/render.test.mjs
git commit -m "feat(org-os-kms): render — ASCII dashboard section + site index artifact"
```

---

### Task 8: Federation (`src/federate.mjs`)

**Files:**
- Modify: `packages/org-os-kms/src/federate.mjs` (replace stub)
- Test: `packages/org-os-kms/test/federate.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/federate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { addPeer, checkPeers, contribute, NAMESPACE } from '../src/federate.mjs';
import * as fw from '../src/framework.mjs';

// initInstance writes kms.yaml + a self card; then register a peer card.
function initTmp() {
  const dir = mkdtempSync(join(tmpdir(), 'kms-fed-'));
  // target = dir (absolute): tests run from the package dir, so the adapter must be pointed
  // at the temp instance root, not the relative '.' the real repo uses (cwd == repo root).
  fw.initInstance({ dir, name: 'primary', adapter: 'repo-data', target: dir });
  return dir;
}

test('addPeer delegates to framework federateAdd and tags the RegenOS namespace', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'PRs welcome' }));
  const r = addPeer({ dir, cardPath });
  assert.ok(r.slug);
  assert.equal(r.namespace, NAMESPACE);
  const cfg = fw.loadConfig(dir);
  assert.ok(cfg.peers[r.slug], 'peer written to kms.yaml');
});

test('checkPeers reports under the RegenOS namespace (skips peers without an extensions file)', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'PRs' }));
  addPeer({ dir, cardPath });
  const out = checkPeers({ dir, config: fw.loadConfig(dir) });
  assert.equal(out.report.namespace, NAMESPACE);
  assert.equal(out.report.peers.length, 1);
  assert.match(out.report.peers[0].skipped || '', /no extensions/);
});

test('contribute is draft-only: never writes cross-repo without approval', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'open a PR' }));
  const { slug } = addPeer({ dir, cardPath });
  const out = contribute({ dir, slug, records: [{ id: 'c1' }] });
  assert.equal(out.applied, false);
  assert.equal(out.draft.return_path, 'open a PR');
  assert.equal(out.draft.namespace, NAMESPACE);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/federate.test.mjs`
Expected: FAIL — stub `checkPeers` throws; `addPeer`/`contribute`/`NAMESPACE` undefined.

- [ ] **Step 3: Replace `src/federate.mjs`**

```javascript
// src/federate.mjs
// Federation wrapper. Delegates peer registration + fork-compat to the framework
// (federateAdd/federateCheck) and adds two org-os-kms concerns: the RegenOS namespace, and
// a contribute() that is DRAFT-ONLY — cross-repo contribute-back is always draft-and-present.
import { readFileSync, existsSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import yaml from 'js-yaml';
import * as fw from './framework.mjs';

export const NAMESPACE = 'RegenOS';

export function addPeer({ dir, cardPath }) {
  const res = fw.federateAdd({ dir, cardPath }); // { slug, ref }; writes peers[slug] into kms.yaml
  return { ...res, namespace: NAMESPACE };
}

export function checkPeers(ctx) {
  const cfg = ctx.config || fw.loadConfig(ctx.dir);
  const peers = (cfg && cfg.peers) || {};
  const results = [];
  for (const [slug] of Object.entries(peers)) {
    const ext = cfg.peer_extensions && cfg.peer_extensions[slug];
    const extAbs = ext ? join(ctx.dir, ext) : null;
    if (extAbs && existsSync(extAbs)) {
      results.push({ slug, ...fw.federateCheck({ extensionsPath: extAbs }) });
    } else {
      results.push({ slug, skipped: 'no extensions file registered (kms.yaml peer_extensions)' });
    }
  }
  return { ok: true, report: { namespace: NAMESPACE, peers: results } };
}

function readCard(absFile, ref) {
  if (!existsSync(absFile)) return null;
  const doc = yaml.load(readFileSync(absFile, 'utf8')) || {};
  const slug = ref.split('#').pop();
  return (doc.entries || {})[slug] || null;
}

export function contribute({ dir, slug, records = [] }) {
  const cfg = fw.loadConfig(dir);
  const ref = cfg && cfg.peers && cfg.peers[slug];
  if (!ref) throw new Error(`unknown peer: ${slug}`);
  const [file] = ref.split('#');
  const cardPath = isAbsolute(file) ? file : join(dir, file); // refs may be absolute or dir-relative
  const card = readCard(cardPath, ref);
  const returnPath = (card && card.return_path) || '(unknown return_path)';
  // draft-and-present: return the plan; a human approves the actual cross-repo hand-off.
  return { applied: false, draft: { peer: slug, namespace: NAMESPACE, return_path: returnPath, records } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/federate.test.mjs`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/federate.mjs packages/org-os-kms/test/federate.test.mjs
git commit -m "feat(org-os-kms): federation wrapper (RegenOS namespace, draft-only contribute)"
```

---

### Task 9: Promotion (`src/promote.mjs`)

**Files:**
- Create: `packages/org-os-kms/src/promote.mjs`
- Test: `packages/org-os-kms/test/promote.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/promote.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promote } from '../src/promote.mjs';

function pair() {
  const from = mkdtempSync(join(tmpdir(), 'kms-from-'));
  const to = mkdtempSync(join(tmpdir(), 'kms-to-'));
  mkdirSync(join(from, 'src'), { recursive: true });
  writeFileSync(join(from, 'src/a.mjs'), 'export const a = 1;');
  writeFileSync(join(from, 'src/b.mjs'), 'export const b = 2;');
  return { from, to };
}

test('computes a drift manifest and defaults to draft (no write)', () => {
  const { from, to } = pair();
  const r = promote({ from, to });
  assert.equal(r.applied, false);
  const a = r.manifest.find(m => m.rel === 'src/a.mjs');
  assert.equal(a.status, 'new'); // absent in `to`
});

test('flags changed vs same files', () => {
  const { from, to } = pair();
  mkdirSync(join(to, 'src'), { recursive: true });
  writeFileSync(join(to, 'src/a.mjs'), 'export const a = 1;'); // identical
  writeFileSync(join(to, 'src/b.mjs'), 'export const b = 999;'); // changed
  const r = promote({ from, to });
  assert.equal(r.manifest.find(m => m.rel === 'src/a.mjs').status, 'same');
  assert.equal(r.manifest.find(m => m.rel === 'src/b.mjs').status, 'changed');
  assert.equal(r.drift.length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/promote.test.mjs`
Expected: FAIL — no `../src/promote.mjs`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/promote.mjs
// A→C promotion: compare the develop-in-place package (from) against its canonical home
// (to) and produce a checksum drift manifest. DRAFT-ONLY by default — copying into another
// repo is draft-and-present; a human approves and performs the reviewed copy.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

function walk(root, base = root, acc = []) {
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = join(root, name);
    if (statSync(p).isDirectory()) walk(p, base, acc);
    else acc.push(relative(base, p));
  }
  return acc;
}

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 12);

export function promote({ from, to, apply = false }) {
  const manifest = walk(from).map((rel) => {
    const srcHash = sha(join(from, rel));
    const dst = join(to, rel);
    const dstHash = existsSync(dst) ? sha(dst) : null;
    const status = dstHash === null ? 'new' : dstHash === srcHash ? 'same' : 'changed';
    return { rel, srcHash, dstHash, status };
  });
  const drift = manifest.filter((m) => m.status !== 'same');
  // apply is intentionally inert: the reviewed copy happens outside, after human approval.
  return { applied: false, requested_apply: apply, drift, manifest };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/promote.test.mjs`
Expected: PASS (2/2).

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/promote.mjs packages/org-os-kms/test/promote.test.mjs
git commit -m "feat(org-os-kms): A→C promotion drift manifest (draft-only)"
```

---

## Phase 3 — CLI, profile, instance config

### Task 10: CLI (`src/cli.mjs`)

**Files:**
- Create: `packages/org-os-kms/src/cli.mjs`
- Modify: `packages/org-os-kms/package.json` (add `bin`)
- Test: `packages/org-os-kms/test/cli.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
// test/cli.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dispatch } from '../src/cli.mjs';

test('parses "lifecycle initialize --dir X" into a verb + flags', () => {
  const r = dispatch(['lifecycle', 'initialize', '--dir', '/tmp/x'], { dry: true });
  assert.equal(r.verb, 'lifecycle');
  assert.equal(r.args[0], 'initialize');
  assert.equal(r.flags.dir, '/tmp/x');
});

test('unknown verb returns an error result, not a throw', () => {
  const r = dispatch(['frobnicate'], { dry: true });
  assert.match(r.error, /unknown verb: frobnicate/);
});

test('known verbs are all routable', () => {
  for (const v of ['lifecycle', 'bridge', 'render', 'federate', 'promote', 'init']) {
    assert.equal(dispatch([v], { dry: true }).verb, v);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/cli.test.mjs`
Expected: FAIL — no `../src/cli.mjs`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/cli.mjs
// Thin zero-dep CLI. dispatch(argv, {dry}) is unit-testable: with dry:true it only parses +
// routes; without it, it executes. Framework-style hand-rolled --flag value parsing.
import { runLifecycle } from './executor.mjs';
import { bridge } from './registry-bridge.mjs';
import { renderDashboardSection, renderSiteData } from './render.mjs';
import { addPeer, checkPeers, contribute } from './federate.mjs';
import { promote } from './promote.mjs';
import { loadKmsConfig } from './config.mjs';
import * as fw from './framework.mjs';

const VERBS = new Set(['lifecycle', 'bridge', 'render', 'federate', 'promote', 'init']);

function parseFlags(argv) {
  const args = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) { flags[t.slice(2)] = argv[i + 1]; i++; }
    else args.push(t);
  }
  return { args, flags };
}

export function dispatch(argv, opts = {}) {
  const [verb, ...rest] = argv;
  const { args, flags } = parseFlags(rest);
  if (!VERBS.has(verb)) return { error: `unknown verb: ${verb}` };
  if (opts.dry) return { verb, args, flags };

  const dir = flags.dir || '.';
  switch (verb) {
    case 'lifecycle': return runLifecycle(args[0], { dir });
    case 'bridge':    return bridge({ dir, config: loadKmsConfig(dir) });
    case 'render': {
      const cfg = loadKmsConfig(dir);
      if (args[0] === 'site') return renderSiteData({ dir, target: cfg.target, outPath: (cfg.render && cfg.render.site_data) || 'src/data/kms-index.json' });
      const a = fw.getAdapter(cfg.adapter);
      return { section: renderDashboardSection(a.index(cfg.target)) };
    }
    case 'federate': {
      if (args[0] === 'add')      return addPeer({ dir, cardPath: flags.card });
      if (args[0] === 'check')    return checkPeers({ dir, config: loadKmsConfig(dir) });
      if (args[0] === 'contribute') return contribute({ dir, slug: flags.peer });
      return { error: `federate: unknown subcommand ${args[0]}` };
    }
    case 'promote':   return promote({ from: flags.from || '.', to: flags.to });
    case 'init':      return fw.initInstance({ dir, name: flags.name, adapter: flags.adapter || 'repo-data', target: flags.target || '.' });
  }
}

// Entry point when run directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = dispatch(process.argv.slice(2));
  console.log(JSON.stringify(result, null, 2));
}
```

- [ ] **Step 4: Run test to verify it passes; add `bin`**

Run: `node --test test/cli.test.mjs`
Expected: PASS (3/3).

Edit `package.json` — add after `"main"`:

```json
  "bin": { "org-os-kms": "src/cli.mjs" },
```

- [ ] **Step 5: Commit**

```bash
git add packages/org-os-kms/src/cli.mjs packages/org-os-kms/package.json packages/org-os-kms/test/cli.test.mjs
git commit -m "feat(org-os-kms): thin CLI (lifecycle/bridge/render/federate/promote/init)"
```

---

### Task 11: Instance config `kms.yaml` (repo root)

**Files:**
- Create: `kms.yaml` (regen-toolkit repo ROOT — NOT inside the package)
- Test: `packages/org-os-kms/test/e2e.test.mjs` covers this in Task 14; here just a smoke check.

- [ ] **Step 1: Create `kms.yaml` at the regen-toolkit repo root**

```yaml
# org-os-kms instance config for regen-toolkit (the primary adoption instance).
# Read by @regen-commons/toolkit-framework loadConfig + @org-os/kms.
instance: regen-toolkit
adapter: repo-data          # framework writes data/kb/<schema>.yaml
target: "."                 # repo root; repo-data appends data/kb/
framework: "@regen-commons/toolkit-framework"
self_ref: ""                # filled by `org-os-kms init` on first run
peers: {}                   # filled by `federate add` (e.g. refi-dao-os)
federation_namespace: RegenOS
upstream: "/03 Libraries/org-os/packages/org-os-kms"   # A→C promotion target
render:
  site_data: src/data/kms-index.json
peer_extensions: {}         # slug -> path of a peer's extension-entities.yaml (for federate.check)
```

- [ ] **Step 2: Smoke-check it loads**

Run (from repo root):
```bash
node -e "import('./packages/org-os-kms/src/config.mjs').then(m => console.log(m.loadKmsConfig('.').instance))"
```
Expected: prints `regen-toolkit`.

- [ ] **Step 3: Commit**

```bash
git add kms.yaml
git commit -m "chore(org-os-kms): regen-toolkit instance config (kms.yaml, target='.')"
```

---

## Phase 4 — Integrations

### Task 12: Inject KB section into the ops dashboard (`scripts/initialize.mjs`)

**Files:**
- Modify: `scripts/initialize.mjs` (regen-toolkit repo root)

- [ ] **Step 1: Read the dashboard assembler**

Run: `grep -n "Federation\|Recent Context\|function render\|sections.push\|console.log" scripts/initialize.mjs | head -40`
Identify where section strings are assembled into the final markdown/ASCII output (look for where the "Federation" or "Recent Context" section is appended).

- [ ] **Step 2: Add a guarded import + section near the other sections**

Insert near the top of the render function (adapt the exact insertion point to the file — place it where other section strings are built):

```javascript
// --- org-os-kms: Knowledge Commons section (guarded; no-op if the KB isn't initialized) ---
let kmsSection = '';
try {
  const { existsSync, readFileSync } = await import('node:fs');
  if (existsSync('data/kb/index.json')) {
    const { renderDashboardSection } = await import('../packages/org-os-kms/src/render.mjs');
    kmsSection = renderDashboardSection(JSON.parse(readFileSync('data/kb/index.json', 'utf8')));
  }
} catch { /* KB not present or module unavailable — dashboard renders without it */ }
```

Then include `kmsSection` in the assembled output (append it where the other section variables are concatenated, e.g. just before the Federation section). If sections are pushed to an array: `if (kmsSection) sections.push(kmsSection);`.

- [ ] **Step 3: Verify the dashboard still renders (with and without a KB)**

Run (from repo root, no KB yet):
```bash
node scripts/initialize.mjs --format=markdown | head -5
```
Expected: dashboard renders normally, no error, no Knowledge Commons section (KB absent).

- [ ] **Step 4: Commit**

```bash
git add scripts/initialize.mjs
git commit -m "feat(org-os-kms): surface Knowledge Commons section on the ops dashboard (guarded)"
```

---

### Task 13: Minimal knowledge-commons site surface (Astro)

**Files:**
- Create: `src/pages/knowledge-commons.astro` (regen-toolkit repo root `src/`)
- Depends on: `src/data/kms-index.json` (produced by `render.site`; create a placeholder so build passes even before first render)

- [ ] **Step 1: Create a placeholder data file so the import always resolves**

Create `src/data/kms-index.json`:
```json
{ "total": 0, "by_type": {}, "by_maturity": {}, "review_queue": [], "generated_from": "placeholder — regenerated by org-os-kms render.site" }
```

- [ ] **Step 2: Create the page**

Create `src/pages/knowledge-commons.astro`:
```astro
---
// Minimal Knowledge Commons surface (Seam 3: data → site). Reads the derived KMS index
// that org-os-kms render.site writes. Kept plain so it never risks the Starlight build.
import index from '../data/kms-index.json';
const byType = Object.entries(index.by_type ?? {});
const awaiting = Array.isArray(index.review_queue) ? index.review_queue.length : (index.review_queue ?? 0);
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Knowledge Commons</title></head>
  <body>
    <h1>Knowledge Commons</h1>
    <p>{index.total} objects · {byType.length} types · {awaiting} awaiting review</p>
    <ul>
      {byType.map(([type, n]) => <li>{n} — {type}</li>)}
    </ul>
    <p><small>{index.generated_from}</small></p>
  </body>
</html>
```

- [ ] **Step 3: Verify the site still builds**

Run (from repo root): `npm run build`
Expected: build succeeds; `/knowledge-commons` is emitted. (If Starlight config rejects a bare page, instead add the surface as a Starlight content doc — but the plain page under `src/pages/` builds alongside Starlight by default.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/knowledge-commons.astro src/data/kms-index.json
git commit -m "feat(org-os-kms): minimal Knowledge Commons site surface (Seam 3)"
```

---

## Phase 5 — End-to-end & acceptance

### Task 14: End-to-end adoption test (`test/e2e.test.mjs`)

**Files:**
- Create: `packages/org-os-kms/test/e2e.test.mjs`

- [ ] **Step 1: Write the end-to-end test**

```javascript
// test/e2e.test.mjs
// The adoption gate: a temp instance mirroring regen-toolkit's layout goes source → framework
// store → bridge → render, driven the way the lifecycle would. No mocks of the framework.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import * as fw from '../src/framework.mjs';
import { bridge } from '../src/registry-bridge.mjs';
import { renderSiteData, renderDashboardSection } from '../src/render.mjs';
import { runLifecycle } from '../src/executor.mjs';

test('e2e: framework store → bridge → index → render, under the org-os lifecycle', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-e2e-'));
  // target = dir (absolute) so the whole run is hermetic to the temp instance (tests don't
  // chdir). The real repo uses target '.' because its cwd IS the instance root.
  writeFileSync(join(dir, 'kms.yaml'), yaml.dump({
    instance: 'e2e', adapter: 'repo-data', target: dir, framework: '@regen-commons/toolkit-framework',
    peers: {}, render: { site_data: 'src/data/kms-index.json' },
  }));

  // 1) Store reviewed KB objects the way the framework machine would (post-accept).
  const a = fw.getAdapter('repo-data');
  a.store(dir, [
    { schema: 'resource', object: { id: 'kb-1', title: 'KB One', maturity: 'raw', ai_assisted: true } },
    { schema: 'signal', object: { id: 'sig-1', title: 'Signal One', maturity: 'raw', ai_assisted: true } },
  ]);
  a.writeIndex(dir);
  assert.ok(existsSync(join(dir, 'data/kb/index.json')));

  // 2) Bridge into instance registries.
  const b = bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  assert.equal(b.ok, true);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const resKey = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.ok(resDoc[resKey].some(e => e.id === 'kb-1'));

  // 3) Render both surfaces.
  const site = renderSiteData({ dir, target: dir, outPath: 'src/data/kms-index.json' });
  assert.equal(site.ok, true);
  const section = renderDashboardSection(a.index(dir));
  assert.match(section, /2 objects/);

  // 4) Lifecycle initialize runs end-to-end against this instance (real ops, no throw).
  const report = runLifecycle('initialize', { dir });
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
});
```

- [ ] **Step 2: Run and verify it passes**

Run: `node --test test/e2e.test.mjs`
Expected: PASS. (The temp `kms.yaml` uses an absolute `target: dir`, so `runLifecycle` reads/writes entirely inside the temp instance without any `chdir`.)

- [ ] **Step 3: Run the FULL suite**

Run: `node --test`
Expected: ALL green (bind, framework, config, ops, executor, registry-bridge, render, federate, promote, cli, e2e).

- [ ] **Step 4: Commit**

```bash
git add packages/org-os-kms/test/e2e.test.mjs
git commit -m "test(org-os-kms): end-to-end adoption gate (store→bridge→render→lifecycle)"
```

---

### Task 15: Live dogfood on regen-toolkit + refi-dao-os peer (operator-run)

**Files:** none created; this is the acceptance run. Draft-and-present all writes.

- [ ] **Step 1: Confirm the real registry list keys**

Run (repo root): `head -5 data/resources.yaml data/source-systems.yaml`
Confirm the top-level list key each uses. The bridge binds under the existing key; if a file uses an unexpected shape (e.g. a bare list, not a mapping), note it and adjust `upsertRegistry` handling before the live bridge.

- [ ] **Step 2: Initialize the instance (writes self card + heals kms.yaml)**

Run (repo root): `node packages/org-os-kms/src/cli.mjs init --name regen-toolkit --adapter repo-data --target .`
Expected: creates `data/kb/` with a self `source-system` card + `index.json`; `kms.yaml` `self_ref` filled. Review the diff before committing.

- [ ] **Step 3: Register refi-dao-os as a peer (draft-and-present)**

Create a `source-system` card for refi-dao-os (title, type, steward, `return_path`) at a temp path, then:
Run: `node packages/org-os-kms/src/cli.mjs federate add --card /tmp/refi-dao-card.yaml`
Expected: `peers['refi-dao']` written to `kms.yaml`. Present the change; commit on approval.

- [ ] **Step 4: Run bridge + render against real data (REVIEW the diff, do not auto-commit)**

Run: `node packages/org-os-kms/src/cli.mjs bridge`
Run: `node packages/org-os-kms/src/cli.mjs render site`
Inspect `git diff data/ src/data/kms-index.json`. Present to the operator. The `/close` skill handles the actual commit/push (draft-and-present per CLAUDE.md safety rules).

- [ ] **Step 5: Verify dashboard + site show the KB**

Run: `node scripts/initialize.mjs --format=markdown | grep -A6 "Knowledge Commons"`
Run: `npm run build && npm run preview` → open `/knowledge-commons`.
Expected: both surfaces reflect the bridged objects.

---

### Task 16: Promote to canonical org-os (A→C, draft-and-present)

**Files:** writes into `/03 Libraries/org-os/packages/org-os-kms/` — **only after operator approval**.

- [ ] **Step 1: Compute the drift manifest (no write)**

Run (repo root):
```bash
node -e "import('./packages/org-os-kms/src/promote.mjs').then(m => console.log(JSON.stringify(m.promote({ from: 'packages/org-os-kms', to: '/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/org-os/packages/org-os-kms' }).drift, null, 2)))"
```
Expected: prints the list of new/changed files that would land upstream.

- [ ] **Step 2: Present the manifest to the operator**

Show the drift list. Get explicit approval before any cross-repo copy. Do NOT copy without it (org-os safety + vault safety).

- [ ] **Step 3: On approval, perform the reviewed copy**

With approval, copy the package dir into the canonical home (e.g. `rsync -a --exclude node_modules packages/org-os-kms/ "/03 Libraries/org-os/packages/org-os-kms/"`), verify `node --test` passes there, and update the framework import in the copied `src/framework.mjs` if the canonical repo resolves the package by name instead of relative path. Commit in that repo separately.

---

## Self-review

**Spec coverage** (each spec section → task):
- §1 six pieces: ① lifecycle → Tasks 2,3,5 · ② bridge → Task 6 · ③ CLI → Task 10 · ④ render A+C → Tasks 7,12,13 · ⑤ federation → Task 8 · ⑥ e2e → Tasks 14,15. ✓
- §2 decisions: placement A+C → Tasks 1 (shim enables both), 9, 16 · topology C → Tasks 8, 15 · render A+C → 12, 13 · RegenOS namespace → Task 8. ✓
- §3 architecture (thin/declarative/reject-2) → framework.mjs (1), bind op-names (2), ops/executor (3,5); no reimplementation. ✓
- §4 components → Tasks 1–13 (every file mapped). `config.mjs`, `promote.mjs`, `kms.yaml` present. ✓
- §5 data flow initialize/close → LIFECYCLE_BINDINGS (Task 2) + executor (Task 5). ✓
- §6 error/safety: fail-hard/soft → Task 5; idempotent/non-destructive bridge → Task 6; draft-and-present cross-repo → Tasks 8, 15, 16; config guard → Task 4; site build preserved → Task 13. ✓
- §7 testing: every listed test file → its task; e2e gate → Task 14. ✓
- §8 promotion → Tasks 9, 16. ✓
- §10 risks: registry key convention (Task 6 note + Task 15 step 1); `generate:schemas` coverage for new registries — **captured as a note here**: the bridge writes registry YAML but does NOT itself run `.well-known` schema generation; the org-os `/close` flow runs `npm run generate:schemas`. New registries (`deployments`, `signals`, etc.) need generators or scoped regen — verify during Task 15 and, if a generator is missing, that is a follow-up outside this plan.

**Refinements from spec (intentional, noted at top):** `target: '.'`; `csis-review`/`emit-contributions` are skill directives; federation delegates to the framework.

**Placeholder scan:** none — every code step has complete code; every command has expected output.

**Type consistency:** `bridge(ctx)`, `renderSiteData({dir,target,outPath})`, `renderDashboardSection(index)`, `checkPeers(ctx)`, `addPeer({dir,cardPath})`, `contribute({dir,slug,records})`, `promote({from,to,apply})`, `runLifecycle(event,ctx,deps)`, `loadKmsConfig(dir)`, `dispatch(argv,opts)` — names + signatures match across all tasks and the CLI wiring.

---

## Post-review implementation deltas

Changes made during subagent-driven execution in response to spec/quality review (the code files are authoritative; these override the as-written task bodies above):

- **Task 1:** `bind.mjs` now imports the framework via `./framework.mjs` (not the direct relative path), so the shim is genuinely the single seam.
- **Task 2:** added a machine-checked **profile↔bind no-drift** test (loads `profile.yaml`, deep-equals the JS constants) — the "no drift" requirement is now enforced, not just commented.
- **Task 4:** added a `target`-missing guard test (that branch was untested) + a rationale comment on the `=== undefined` check.
- **Task 5:** `config.load` is `write:true` (**fail-hard** — a missing/invalid `kms.yaml` halts the run cleanly instead of cascading soft errors). The executor also **fail-hards when a write op returns `{ok:false}` without throwing** (the real `bridge` signals failure that way, not by throwing). Added unregistered-op and unknown-event coverage.
- **Task 6 (hardening):**
  - **`encyclopedia-entry` binding is `src/content/docs/kb/`** (namespaced under `kb/`), NOT `src/content/docs/` — the site's docs root holds ~119 hand-authored articles with bare slugs, and an unconditional overwrite there is a data-loss vector. Generated encyclopedia docs live under `kb/` so they can never clobber hand-authored ones. (This changes the `REGISTRY_BINDINGS['encyclopedia-entry']` value in `bind.mjs` + `profile.yaml` + the Task 2 assertion accordingly.)
  - **Bridge batches objects by target file** (one read+write per registry) instead of per-object read-modify-write — linear (not O(n²)) on the real ~1616-row `data/resources.yaml`, and produces clean diffs.
  - **New-file registry key uses the underscore form** (`source_systems`, not the hyphenated filename) to match the org-os generated-registry convention.
  - Added tests for the real production registry shape (scalar `schema_version` header + underscore key preserved) and the new-file underscore-key fallback (revert-proven).
  - **Bridge dumps YAML at `{ lineWidth: -1 }`** (both registry + markdown-frontmatter dumps) to match how the real `data/*.yaml` were generated — without this, inserting one row reformats ~1,360 lines of `source-systems.yaml` / ~17,791 of `resources.yaml`, making the draft-and-present diff unreviewable. Guarded by a no-fold regression test.
- **Task 7:** added a `review_queue`-as-array coverage test (the deriveIndex shape).
- **Task 8:** `contribute` reads the peer card via the adapter (`getAdapter().list().find(e => e.ref === ref)`) instead of parsing the opaque ref as a path — works across adapters. It enumerates `join(dir, cfg.target)` to match how the framework's `federateAdd` stores refs. Added a `checkPeers` fork-compat delegation test. **Latent follow-up:** framework (`instance.mjs`) treats `target` as dir-relative (`join(dir,target)`) while the package (`bridge`/`render`/`index.rebuild`) uses raw `target`; masked in production (dir=cwd, target=`.`) — unify on `join(dir,target)` so `--dir` is honored everywhere.
- **Task 9:** added a safety test that `promote({apply:true})` is inert (returns `applied:false`, writes nothing).
- **Task 10:** robust CLI entry-point guard (`resolve(process.argv[1]) === fileURLToPath(import.meta.url)`) — handles relative argv + the space in the repo path; added `#!/usr/bin/env node` shebang (bin needs it) + try/catch entry that prints `✗ <msg>` and `exit(1)` on error.
- **Task 5 (again) / lifecycle:** `/close` now runs `index.rebuild` before its renders (was rendering a stale "0 objects" index).
- **Task 14:** e2e gate hardened against a vacuous pass — asserts the five `initialize` ops actually ran (`report.ran` op sequence), all returned `ok`, the site artifact landed with `total === 2`, and the signal path bridged (break-proven: an empty `initialize` binding makes it fail).

## Deferred follow-ups (post-dogfood, documented not done)
- Unify the framework-vs-package `target` convention on `join(dir, target)` (latent; not triggered by the dogfood which runs dir=`.`/target=`.`).
- `generate:schemas` coverage for the new registries (`deployments`, `signals`, `implementation-memory`, `evolution-log`, `contributions`) — the bridge writes them but `.well-known/` generation isn't wired to a registry loop.
- Validate `encyclopedia-entry` frontmatter against Starlight's `docsSchema()` before the first encyclopedia bridge (unexpected keys could fail `npm run build`).
- Cosmetic: `emit-contributions` maps to the `register-source` skill; render says "1 types" (no pluralization).
