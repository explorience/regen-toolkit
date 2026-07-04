# Toolkit Framework 0.2 "Machine" Weekend Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `packages/toolkit-framework` (0.1.0-beta.1, a validating skeleton) into a functional end-to-end ingestion machine: work-order pipeline, separable storage adapters, operating skills, replication/federation mechanism, extracted to a public repo — per the approved spec [`2026-07-04-machine-iteration-design.md`](2026-07-04-machine-iteration-design.md).

**Architecture:** Three seams. (1) Skill↔CLI = the **work-order contract**: agents only produce candidate typed objects; only the CLI validates + writes. (2) Ingestion↔storage = the **adapter interface** (`kb-folder` + `repo-data` shipping, `geo` documented stub). (3) Data↔site = the **derived KB index + JSON-LD export**. Everything is zero-build ESM + YAML, TDD with `node --test`.

**Tech Stack:** Node ≥22 built-ins (`node:test`, `node:fs`, `node:crypto`, `node:child_process`), `js-yaml` (the package's only dependency). No new dependencies.

**Conventions of this codebase (read before Task 1):**
- Package root: `packages/toolkit-framework`. All paths below are relative to it unless prefixed `REPO:` (= the regen-toolkit repo root).
- Schemas are YAML "object-schemas": `id`, `version`, `description`, optional `extends`, `required: [...]`, `fields: { name: { type|enum|axis } }`. Validation via `validateObject(schemaName, obj)` from `src/index.mjs` — open model (unknown fields pass), `enum` and `axis` (K1 state model) are enforced.
- Tests: `test/*.test.mjs`, run with `npm test` (= `node --test`) from the package dir. Style: `import { test } from 'node:test'; import assert from 'node:assert/strict';`.
- Every object-schema needs an `examples/<name>.example.yaml` that validates (enforced by `test/examples.test.mjs` — you must add new schemas to its `OBJECT_SCHEMAS` array).
- Skills are `skills/<name>/SKILL.md` with frontmatter `{ name, version, description, framework: toolkit-framework, agnostic: true }` (enforced by `test/skills.test.mjs` — add new skills to its `SKILLS` array).
- Commit style: `feat(toolkit-framework): …` / `docs(framework): …`, imperative, with the trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **Vault safety:** this repo lives inside an Obsidian vault. NEVER `git stash`, `git clean`, or `git reset --hard`. Worktrees are fine.

---

## Task 0: Worktree + environment setup

**Files:** none created in-repo yet.

- [ ] **Step 1: Create an isolated worktree** off `regen-toolkit-os` (use superpowers:using-git-worktrees):

```bash
cd "/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit"
git worktree add ../regen-toolkit-machine -b framework-machine-0.2 regen-toolkit-os
cd ../regen-toolkit-machine/packages/toolkit-framework
```

- [ ] **Step 2: Install the package's dependency locally** (the monorepo resolves `js-yaml` from the root `node_modules`; a fresh worktree has none):

```bash
npm install
```

- [ ] **Step 3: Verify the baseline is green**

Run: `npm test`
Expected: `tests 38 … pass 38 … fail 0`. If not green, STOP and report — do not build on a red baseline.

---

## WAVE 0 — Vertical slice (Friday night)

## Task 1: Work-order schema + lifecycle module

**Files:**
- Create: `schemas/work-order.yaml`
- Create: `examples/work-order.example.yaml`
- Create: `src/workorder.mjs`
- Create: `test/workorder.test.mjs`
- Modify: `test/examples.test.mjs` (add `'work-order'` to `OBJECT_SCHEMAS`)

- [ ] **Step 1: Write the failing tests**

```js
// test/workorder.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateObject } from '../src/index.mjs';
import {
  hashContent, makeWorkOrder, transition, saveWorkOrder, loadWorkOrders, loadWorkOrder,
} from '../src/workorder.mjs';

test('makeWorkOrder produces a valid, deterministic work-order (seam 1)', () => {
  const wo = makeWorkOrder({
    sourcePath: 'meetings/call.md', content: '# A call\nnotes…', sourceType: 'transcript',
    targetSchemas: ['source-system', 'resource'], instructions: 'deep intake',
  });
  assert.match(wo.id, /^wo-[0-9a-f]{12}$/);
  assert.equal(wo.status, 'open');
  assert.equal(wo.source_hash, hashContent('# A call\nnotes…'));
  // same input → same id (idempotency key)
  const again = makeWorkOrder({ sourcePath: 'meetings/call.md', content: '# A call\nnotes…', sourceType: 'transcript' });
  assert.equal(again.id, wo.id);
  // it validates against its own schema
  const { valid, errors } = validateObject('work-order', wo);
  assert.equal(valid, true, errors.join('; '));
});

test('work-order transitions follow the legal state machine', () => {
  let wo = makeWorkOrder({ sourcePath: 'a.md', content: 'x' });
  wo = transition(wo, 'claimed');
  wo = transition(wo, 'fulfilled');
  wo = transition(wo, 'accepted');
  assert.equal(wo.status, 'accepted');
  assert.throws(() => transition(wo, 'open'), /illegal work-order transition/);
  assert.throws(() => transition(makeWorkOrder({ sourcePath: 'a.md', content: 'x' }), 'accepted'),
    /illegal work-order transition: open → accepted/);
});

test('work-orders persist and load from a directory (resumable)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-wo-'));
  const wo = makeWorkOrder({ sourcePath: 'a.md', content: 'x' });
  saveWorkOrder(dir, wo);
  const all = loadWorkOrders(dir);
  assert.equal(all.length, 1);
  assert.equal(all[0].id, wo.id);
  assert.deepEqual(loadWorkOrder(dir, wo.id), wo);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test test/workorder.test.mjs`
Expected: FAIL — `Cannot find module … src/workorder.mjs`.

- [ ] **Step 3: Write the schema, example, and module**

```yaml
# schemas/work-order.yaml
# Seam 1 — the ingestion contract. A unit of semantic work an AGENT fulfills;
# only the CLI accepts results and only the CLI writes storage (spec §3/§5).
id: work-order
version: 0.2.0
description: A unit of ingestion work — source ref + instructions + lifecycle status. Agents fulfill; the CLI validates, accepts, stores.
required: [title, type, source_path, source_hash, status]
fields:
  title: { type: string }
  type: { enum: [work-order] }
  source_path: { type: string }
  source_hash: { type: string }          # sha256 of source content — the idempotency key
  source_type: { enum: [transcript, document, csv-crosswalk, url-list, directory, unknown] }
  target_schemas: { type: list }         # suggested object-schemas to extract
  instructions: { type: string }
  status: { enum: [open, claimed, fulfilled, accepted, rejected] }
  claimed_by: { type: string }
  chunk: { type: string }                # "2/5" when a large source is split
  produced: { type: list }               # storage refs, stamped by `store`
  error_notes: { type: string }          # validator output — the retry instructions
```

```yaml
# examples/work-order.example.yaml
title: "ingest meetings/call.md"
type: work-order
source_path: meetings/call.md
source_hash: 3d3f2c9b8a7e6d5c4b3a29181716151413121110efcdab8967452301fedcba98
source_type: transcript
target_schemas: [source-system, resource, signal]
instructions: "Deep intake per the ingest skill: one shared thing becomes many entries."
status: open
```

```js
// src/workorder.mjs — work-order lifecycle (seam 1). Deterministic ids, legal
// transitions, atomic file persistence (.workorders/ is the pipeline's inbox).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

export const WO_TRANSITIONS = {
  open: ['claimed', 'rejected'],
  claimed: ['fulfilled', 'open', 'rejected'],
  fulfilled: ['accepted', 'rejected'],
  accepted: [],
  rejected: ['open'],
};

export function hashContent(text) {
  return createHash('sha256').update(text).digest('hex');
}

export function makeWorkOrder({ sourcePath, content, sourceType = 'unknown', targetSchemas = [], instructions = '', chunk = null }) {
  const source_hash = hashContent(content);
  const id = `wo-${hashContent(`${sourcePath}:${source_hash}:${chunk ?? ''}`).slice(0, 12)}`;
  return {
    id,
    title: `ingest ${sourcePath}${chunk ? ` [${chunk}]` : ''}`,
    type: 'work-order',
    source_path: sourcePath,
    source_hash,
    source_type: sourceType,
    target_schemas: targetSchemas,
    instructions,
    status: 'open',
    ...(chunk ? { chunk } : {}),
  };
}

export function transition(wo, next) {
  const allowed = WO_TRANSITIONS[wo.status] || [];
  if (!allowed.includes(next)) throw new Error(`illegal work-order transition: ${wo.status} → ${next}`);
  return { ...wo, status: next };
}

/** Atomic write (tmp + rename) so a crashed session never leaves a torn file. */
export function saveWorkOrder(dir, wo) {
  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, `.${wo.id}.tmp`);
  writeFileSync(tmp, yaml.dump(wo));
  renameSync(tmp, join(dir, `${wo.id}.yaml`));
  return join(dir, `${wo.id}.yaml`);
}

export function loadWorkOrders(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.startsWith('wo-') && f.endsWith('.yaml'))
    .map((f) => yaml.load(readFileSync(join(dir, f), 'utf8')));
}

export function loadWorkOrder(dir, id) {
  const p = join(dir, `${id}.yaml`);
  if (!existsSync(p)) throw new Error(`work order not found: ${id} (${p})`);
  return yaml.load(readFileSync(p, 'utf8'));
}
```

In `test/examples.test.mjs`, extend the array (one-line change):

```js
const OBJECT_SCHEMAS = [
  'frontmatter', 'resource', 'source-system', 'option-entry', 'track', 'deployment',
  'implementation-record', 'claim-evidence', 'evolution-record', 'concept-lineage',
  'encyclopedia-entry', 'update-proposal', 'signal', 'contribution-record',
  'provenance', 'public-use-boundary', 'work-order',
];
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all pass (38 baseline + 3 new = 41), including the examples tests picking up `work-order.example.yaml`.

- [ ] **Step 5: Commit**

```bash
git add schemas/work-order.yaml examples/work-order.example.yaml src/workorder.mjs test/workorder.test.mjs test/examples.test.mjs
git commit -m "feat(toolkit-framework): work-order schema + lifecycle — the seam-1 ingestion contract

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Source classification, chunking, idempotent `prepare`

**Files:**
- Create: `src/ingest.mjs`
- Create: `test/ingest.test.mjs`
- Create: `test/fixtures/transcript.md`

- [ ] **Step 1: Create the fixture** (a small fake transcript — speaker lines make `classifySource` detect `transcript`):

```markdown
# Fixture Planning Call — test transcript

**Date:** 2026-07-04
**Attendees:** Ada, Grace

Ada: We should register the Fixture Wiki as a source system — it curates
regenerative patterns and has a clear contribute-back path via pull requests.

Grace: Agreed. And the "pattern language for commons onboarding" idea keeps
coming up — that is at least a concept plus a signal that our ontology lacks
an onboarding type.

Ada: I will link the wiki: https://fixture-wiki.example.org — steward is the
Fixture Collective, CC-BY-SA, monthly update rhythm.

Grace: Let us also note the claim that "onboarding time halves with a buddy
system" — evidence in their 2025 retrospective.
```

- [ ] **Step 2: Write the failing tests**

```js
// test/ingest.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifySource, chunkContent, prepare } from '../src/ingest.mjs';
import { loadWorkOrders } from '../src/workorder.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(here, 'fixtures', 'transcript.md');

test('classifySource detects source types', () => {
  assert.equal(classifySource('call.md', 'Ada: hi\nGrace: hello\nAda: more'), 'transcript');
  assert.equal(classifySource('notes.md', '# Doc\nplain prose, no speakers'), 'document');
  assert.equal(classifySource('rows.csv', 'a,b,c'), 'csv-crosswalk');
  assert.equal(classifySource('links.txt', 'https://a.org\nhttps://b.org'), 'url-list');
});

test('chunkContent splits oversized markdown at heading boundaries', () => {
  const small = chunkContent('# One\nshort');
  assert.equal(small.length, 1);
  assert.equal(small[0].chunk, null);
  const big = '## S1\n' + 'a'.repeat(20000) + '\n## S2\n' + 'b'.repeat(20000);
  const chunks = chunkContent(big);
  assert.ok(chunks.length >= 2, 'oversized content must split');
  assert.equal(chunks[0].chunk, `1/${chunks.length}`);
});

test('prepare emits work orders and is idempotent by source hash', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-prep-'));
  const woDir = join(dir, '.workorders');
  const first = prepare({ path: FIXTURE, workOrdersDir: woDir });
  assert.equal(first.created.length, 1);
  assert.equal(first.created[0].source_type, 'transcript');
  assert.ok(first.created[0].target_schemas.includes('source-system'));
  // second run: nothing new
  const second = prepare({ path: FIXTURE, workOrdersDir: woDir });
  assert.equal(second.created.length, 0);
  assert.equal(second.skipped.length, 1);
  assert.equal(loadWorkOrders(woDir).length, 1);
});

test('prepare walks a directory recursively', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-walk-'));
  mkdirSync(join(dir, 'sub'));
  writeFileSync(join(dir, 'one.md'), '# One\nprose');
  writeFileSync(join(dir, 'sub', 'two.md'), '# Two\nprose');
  writeFileSync(join(dir, 'skip.png'), 'binary-ish');
  const woDir = join(dir, '.workorders');
  const res = prepare({ path: dir, workOrdersDir: woDir });
  assert.equal(res.created.length, 2, 'md files only, recursive');
});
```

- [ ] **Step 3: Run to verify failure**

Run: `node --test test/ingest.test.mjs`
Expected: FAIL — `Cannot find module … src/ingest.mjs`.

- [ ] **Step 4: Implement `src/ingest.mjs` (prepare half)**

```js
// src/ingest.mjs — the deterministic half of ingestion (seam 1, CLI side):
// classify → chunk → emit idempotent work orders. The semantic half is the
// agent's (skills/ingest); acceptance is acceptWorkOrder (Task 4).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { makeWorkOrder, saveWorkOrder, loadWorkOrders } from './workorder.mjs';

const CHUNK_MAX = 24000; // chars — keeps one work order comfortably in an agent's working set
const INGESTIBLE = new Set(['.md', '.markdown', '.txt', '.csv']);

export function classifySource(path, content) {
  const ext = extname(path).toLowerCase();
  if (ext === '.csv') return 'csv-crosswalk';
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length && lines.every((l) => /^https?:\/\/\S+$/.test(l))) return 'url-list';
  // transcript heuristic: several "Speaker: …" lines
  const speakerLines = lines.filter((l) => /^[A-Z][\w .'-]{1,30}:\s/.test(l)).length;
  if (speakerLines >= 3) return 'transcript';
  if (ext === '.md' || ext === '.markdown') return 'document';
  return 'unknown';
}

/** Split oversized markdown at `## ` boundaries; returns [{ text, chunk }] (chunk null when whole). */
export function chunkContent(content, max = CHUNK_MAX) {
  if (content.length <= max) return [{ text: content, chunk: null }];
  const sections = content.split(/(?=\n## )/);
  const parts = [];
  let buf = '';
  for (const s of sections) {
    if (buf && buf.length + s.length > max) { parts.push(buf); buf = ''; }
    buf += s;
  }
  if (buf) parts.push(buf);
  return parts.map((text, i) => ({ text, chunk: `${i + 1}/${parts.length}` }));
}

/** Suggested extraction targets per source type (the deep-intake menu). */
export function suggestSchemas(sourceType) {
  const base = {
    transcript: ['source-system', 'resource', 'concept-lineage', 'signal', 'claim-evidence'],
    document: ['resource', 'encyclopedia-entry', 'concept-lineage', 'claim-evidence'],
    'csv-crosswalk': ['resource', 'source-system'],
    'url-list': ['resource', 'source-system'],
    directory: ['resource'],
    unknown: ['resource'],
  };
  return base[sourceType] || base.unknown;
}

export function defaultInstructions(sourceType) {
  return `Deep intake (${sourceType}): one shared thing becomes many entries. ` +
    `Follow skills/ingest — identify the whole, decompose into typed candidate objects, ` +
    `capture source-system return paths, apply high-risk triggers, assign honest K1 state ` +
    `(maturity: raw, ai_assisted: true), preserve provenance. Write candidates to ` +
    `.workorders/<id>/candidates/*.yaml as { schema, object }.`;
}

function* walkFiles(root) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const p = join(root, entry.name);
    if (entry.isDirectory()) yield* walkFiles(p);
    else if (INGESTIBLE.has(extname(entry.name).toLowerCase())) yield p;
  }
}

/** Scan a file or directory → emit work orders. Idempotent: an order whose id
 * (source path + content hash + chunk) already exists is skipped, never duplicated. */
export function prepare({ path, workOrdersDir }) {
  if (!existsSync(path)) throw new Error(`source not found: ${path}`);
  const files = statSync(path).isDirectory() ? [...walkFiles(path)] : [path];
  const existing = new Set(loadWorkOrders(workOrdersDir).map((w) => w.id));
  const created = [];
  const skipped = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const sourceType = classifySource(file, content);
    const sourcePath = statSync(path).isDirectory() ? relative(path, file) : file;
    for (const { text, chunk } of chunkContent(content)) {
      const wo = makeWorkOrder({
        sourcePath, content: text, sourceType, chunk,
        targetSchemas: suggestSchemas(sourceType),
        instructions: defaultInstructions(sourceType),
      });
      if (existing.has(wo.id)) { skipped.push(sourcePath); continue; }
      saveWorkOrder(workOrdersDir, wo);
      created.push(wo);
    }
  }
  return { created, skipped };
}
```

- [ ] **Step 5: Run to verify pass**

Run: `npm test`
Expected: all green (45 tests).

- [ ] **Step 6: Commit**

```bash
git add src/ingest.mjs test/ingest.test.mjs test/fixtures/transcript.md
git commit -m "feat(toolkit-framework): ingest prepare — classify, chunk, idempotent work-order emission

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Storage interface + `kb-folder` adapter (seam 2)

**Files:**
- Create: `src/storage.mjs`
- Create: `src/adapters/kb-folder.mjs`
- Create: `test/storage.test.mjs`

The adapter contract every adapter implements (this comment block goes at the top of `src/storage.mjs` and the contract suite in Task 8 enforces it):

```
Adapter = {
  name: string,
  store(target, entries)      // entries: [{ schema, object }] → { stored: [ref] }; atomic per object; idempotent by slug(title)
  list(target)                // → [{ schema, object, ref }]
  update(target, ref, patch)  // shallow-merge patch into the stored object; atomic
  index(target)               // → { total, by_type, by_maturity, review_queue, generated_from } — DERIVED, rebuildable
  writeIndex(target)          // persist index.json + context.jsonld next to the objects → { indexPath, contextPath }
}
```

- [ ] **Step 1: Write the failing tests**

```js
// test/storage.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAdapter, listAdapters, slugify } from '../src/storage.mjs';

test('adapter registry knows kb-folder; unknown names error with the available list', () => {
  assert.ok(listAdapters().includes('kb-folder'));
  assert.throws(() => getAdapter('nope'), /unknown storage adapter: nope \(available:/);
});

test('slugify produces stable file-safe slugs', () => {
  assert.equal(slugify('Fixture Wiki — a Source!'), 'fixture-wiki-a-source');
});

test('kb-folder stores, lists, updates, indexes — atomic, idempotent, derived index', () => {
  const kb = mkdtempSync(join(tmpdir(), 'tf-kb-'));
  const a = getAdapter('kb-folder');
  const entry = {
    schema: 'source-system',
    object: { title: 'Fixture Wiki', type: 'wiki', steward: 'Fixture Collective',
      return_path: 'PRs welcome', maturity: 'raw', ai_assisted: true },
  };
  const { stored } = a.store(kb, [entry]);
  assert.equal(stored.length, 1);
  assert.ok(existsSync(join(kb, 'objects', 'source-system', 'fixture-wiki.yaml')));
  // idempotent: same title+schema overwrites, never duplicates
  a.store(kb, [entry]);
  assert.equal(a.list(kb).length, 1);
  // update merges a patch
  a.update(kb, stored[0], { maturity: 'plausible' });
  assert.equal(a.list(kb)[0].object.maturity, 'plausible');
  // index is derived + rebuildable
  const idx = a.index(kb);
  assert.equal(idx.total, 1);
  assert.equal(idx.by_type['source-system'], 1);
  assert.equal(idx.by_maturity.plausible, 1);
  const { indexPath, contextPath } = a.writeIndex(kb);
  assert.ok(existsSync(indexPath) && existsSync(contextPath));
  assert.ok(JSON.parse(readFileSync(contextPath, 'utf8'))['@context']);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test test/storage.test.mjs`
Expected: FAIL — `Cannot find module … src/storage.mjs`.

- [ ] **Step 3: Implement**

```js
// src/storage.mjs — seam 2: ingestion ≠ storage. One interface, swappable targets.
// (Adapter contract comment block from above goes here.)
import { kbFolderAdapter } from './adapters/kb-folder.mjs';

const ADAPTERS = { 'kb-folder': kbFolderAdapter };

export function listAdapters() { return Object.keys(ADAPTERS); }

export function getAdapter(name) {
  const a = ADAPTERS[name];
  if (!a) throw new Error(`unknown storage adapter: ${name} (available: ${listAdapters().join(', ')})`);
  return a;
}

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')      // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

```js
// src/adapters/kb-folder.mjs — the portable KB target: a self-contained folder
// (objects/ + derived index.json + context.jsonld). Repo-agnostic, syncable,
// graph-exportable. Durgadas can point an ingestion at a bare directory.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { slugify } from '../util.mjs';   // ⚠ NOT '../storage.mjs' — storage imports every adapter; importing storage back creates a TDZ cycle (see fix 7261151)
import { toJsonLdContext } from '../index.mjs';

function atomicWrite(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = join(dirname(path), `.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`);
  writeFileSync(tmp, text);
  renameSync(tmp, path);
}

function objectPath(target, schema, object) {
  return join(target, 'objects', schema, `${slugify(object.title || object.id || 'untitled')}.yaml`);
}

export const kbFolderAdapter = {
  name: 'kb-folder',

  store(target, entries) {
    const stored = [];
    for (const { schema, object } of entries) {
      const p = objectPath(target, schema, object);
      atomicWrite(p, yaml.dump(object));
      stored.push(p);
    }
    return { stored };
  },

  list(target) {
    const root = join(target, 'objects');
    if (!existsSync(root)) return [];
    const out = [];
    for (const schema of readdirSync(root)) {
      const dir = join(root, schema);
      for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
        const ref = join(dir, f);
        out.push({ schema, object: yaml.load(readFileSync(ref, 'utf8')), ref });
      }
    }
    return out;
  },

  update(target, ref, patch) {
    const object = { ...yaml.load(readFileSync(ref, 'utf8')), ...patch };
    atomicWrite(ref, yaml.dump(object));
    return { ref, object };
  },

  index(target) {
    const items = this.list(target);
    const by_type = {}; const by_maturity = {};
    let review_queue = 0;
    for (const { schema, object } of items) {
      by_type[schema] = (by_type[schema] || 0) + 1;
      if (object.maturity) by_maturity[object.maturity] = (by_maturity[object.maturity] || 0) + 1;
      if (object.maturity === 'raw' || object.ai_assisted === true) review_queue += 1;
    }
    return { total: items.length, by_type, by_maturity, review_queue,
      generated_from: 'derived — rebuildable from objects/' };
  },

  writeIndex(target) {
    const indexPath = join(target, 'index.json');
    const contextPath = join(target, 'context.jsonld');
    atomicWrite(indexPath, JSON.stringify(this.index(target), null, 2));
    atomicWrite(contextPath, JSON.stringify(toJsonLdContext(), null, 2));
    return { indexPath, contextPath };
  },
};
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all green (48 tests).

- [ ] **Step 5: Commit**

```bash
git add src/storage.mjs src/adapters/kb-folder.mjs test/storage.test.mjs
git commit -m "feat(toolkit-framework): storage adapter interface + kb-folder adapter — ingestion≠storage made structural

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: The accept gate (validation between agent and KB)

**Files:**
- Modify: `src/index.mjs` (export `schemaFields`)
- Modify: `src/ingest.mjs` (add `loadCandidates`, `acceptWorkOrder`)
- Create: `test/accept.test.mjs`
- Create: `test/fixtures/candidates/good-source-system.yaml`, `test/fixtures/candidates/bad-maturity.yaml`

- [ ] **Step 1: Create candidate fixtures** (the exact format agents produce — one YAML file per candidate, `{ schema, object }`):

```yaml
# test/fixtures/candidates/good-source-system.yaml
schema: source-system
object:
  title: Fixture Wiki
  type: wiki
  steward: Fixture Collective
  url: https://fixture-wiki.example.org
  return_path: contribute via pull requests
  reuse_conditions: CC-BY-SA
  update_rhythm: monthly
  maturity: raw
  ai_assisted: true
  provenance:
    origin: "test/fixtures/transcript.md"
    transformation: synthesized
    authorship: ai-assisted
```

```yaml
# test/fixtures/candidates/bad-maturity.yaml
# invalid on TWO counts: claims 'reviewed' maturity while ai_assisted (invariant)
# and is missing provenance.origin (born-rule)
schema: source-system
object:
  title: Overclaiming Wiki
  type: wiki
  steward: Nobody
  return_path: none
  maturity: reviewed
  ai_assisted: true
```

- [ ] **Step 2: Write the failing tests**

```js
// test/accept.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare, acceptWorkOrder } from '../src/ingest.mjs';
import { loadWorkOrder, transition, saveWorkOrder } from '../src/workorder.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(here, 'fixtures', 'transcript.md');
const CANDIDATES = join(here, 'fixtures', 'candidates');

function setup(candidateFiles) {
  const dir = mkdtempSync(join(tmpdir(), 'tf-acc-'));
  const woDir = join(dir, '.workorders');
  const [wo] = prepare({ path: FIXTURE, workOrdersDir: woDir }).created;
  saveWorkOrder(woDir, transition(transition(wo, 'claimed'), 'fulfilled'));
  const cdir = join(woDir, wo.id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  for (const f of candidateFiles) copyFileSync(join(CANDIDATES, f), join(cdir, f));
  return { woDir, id: wo.id };
}

test('accept validates candidates, stamps provenance, moves them to accepted/', () => {
  const { woDir, id } = setup(['good-source-system.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, true, JSON.stringify(res.errors));
  assert.equal(loadWorkOrder(woDir, id).status, 'accepted');
  assert.ok(existsSync(join(woDir, id, 'accepted', 'good-source-system.yaml')));
  // the CLI stamps lineage — provenance is structural, not trusted from the agent
  assert.equal(res.objects[0].object.work_order, id);
  assert.ok(res.objects[0].object.source_lineage.includes('transcript.md'));
});

test('accept is atomic: one bad candidate rejects nothing into the KB and keeps the order open with error notes', () => {
  const { woDir, id } = setup(['good-source-system.yaml', 'bad-maturity.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, false);
  assert.ok(res.errors.some((e) => e.includes('bad-maturity.yaml')));
  const wo = loadWorkOrder(woDir, id);
  assert.equal(wo.status, 'fulfilled', 'order stays fulfilled for retry');
  assert.ok(wo.error_notes.length > 10, 'validator output saved as retry instructions');
  assert.ok(!existsSync(join(woDir, id, 'accepted')), 'nothing partially accepted');
});

test('accept enforces the born-rules: ai_assisted true + maturity raw + provenance.origin', () => {
  const { woDir, id } = setup(['bad-maturity.yaml']);
  const res = acceptWorkOrder({ workOrdersDir: woDir, id });
  assert.equal(res.accepted, false);
  const all = res.errors.join(' | ');
  assert.match(all, /maturity must be "raw" at accept/);
  assert.match(all, /provenance\.origin/);
});
```

- [ ] **Step 3: Run to verify failure**

Run: `node --test test/accept.test.mjs`
Expected: FAIL — `acceptWorkOrder is not a function` (or import error).

- [ ] **Step 4: Implement.** In `src/index.mjs` add (below `collectRequired`):

```js
/** Public: the effective field map of a schema (with `extends` inheritance applied). */
export function schemaFields(schemaName) {
  return collectFields(loadSchema(schemaName));
}
```

Append to `src/ingest.mjs`:

```js
import { readdirSync as _readdir, mkdirSync as _mkdir, renameSync as _rename } from 'node:fs';
import yaml from 'js-yaml';
import { validateObject, checkInvariants, listSchemas, schemaFields } from './index.mjs';
import { loadWorkOrder, transition, saveWorkOrder as _saveWo } from './workorder.mjs';

/** Load an order's candidate files: .workorders/<id>/candidates/*.yaml, each { schema, object }. */
export function loadCandidates(workOrdersDir, id) {
  const dir = join(workOrdersDir, id, 'candidates');
  if (!existsSync(dir)) return [];
  return _readdir(dir).filter((f) => f.endsWith('.yaml')).map((file) => ({
    file, ...yaml.load(readFileSync(join(dir, file), 'utf8')),
  }));
}

/**
 * The accept gate (seam 1, CLI side). Validates EVERY candidate:
 *  - declared schema exists + object validates against it
 *  - mechanical invariants hold (checkInvariants)
 *  - born-rules for KB-content schemas (those carrying `maturity`):
 *    ai_assisted === true, maturity === 'raw', provenance.origin present
 * Then stamps lineage (work_order id + source_lineage) — provenance is
 * structural, not trusted from the agent. ATOMIC: any invalid candidate →
 * nothing moves, order keeps status, error_notes = the retry instructions.
 */
export function acceptWorkOrder({ workOrdersDir, id }) {
  const wo = loadWorkOrder(workOrdersDir, id);
  if (wo.status !== 'fulfilled') {
    return { accepted: false, errors: [`work order ${id} is "${wo.status}", not "fulfilled"`], objects: [] };
  }
  const candidates = loadCandidates(workOrdersDir, id);
  if (!candidates.length) return { accepted: false, errors: [`no candidates found for ${id}`], objects: [] };

  const errors = [];
  const known = new Set(listSchemas());
  for (const c of candidates) {
    const where = (msg) => `${c.file}: ${msg}`;
    if (!c.schema || !known.has(c.schema)) { errors.push(where(`unknown schema "${c.schema}"`)); continue; }
    if (!c.object || typeof c.object !== 'object') { errors.push(where('missing object')); continue; }
    const v = validateObject(c.schema, c.object);
    if (!v.valid) errors.push(...v.errors.map(where));
    const inv = checkInvariants(c.object);
    if (!inv.ok) errors.push(...inv.violations.map(where));
    if ('maturity' in schemaFields(c.schema)) {   // KB-content schema → born-rules
      if (c.object.ai_assisted !== true) errors.push(where('agent-produced objects must set ai_assisted: true'));
      if (c.object.maturity !== 'raw') errors.push(where('maturity must be "raw" at accept — promotion is review-promote\'s job'));
      if (!c.object.provenance?.origin) errors.push(where('provenance.origin is required (Principle 1)'));
    }
  }
  if (errors.length) {
    _saveWo(workOrdersDir, { ...wo, error_notes: errors.join('\n') });
    return { accepted: false, errors, objects: [] };
  }

  const acceptedDir = join(workOrdersDir, id, 'accepted');
  _mkdir(acceptedDir, { recursive: true });
  const objects = [];
  for (const c of candidates) {
    const object = { ...c.object, work_order: id, source_lineage: c.object.source_lineage || wo.source_path };
    writeFileSync(join(acceptedDir, c.file), yaml.dump({ schema: c.schema, object }));
    _rename(join(workOrdersDir, id, 'candidates', c.file), join(workOrdersDir, id, 'candidates', `.${c.file}.done`));
    objects.push({ schema: c.schema, object });
  }
  _saveWo(workOrdersDir, transition(wo, 'accepted'));
  return { accepted: true, errors: [], objects };
}
```

(Reuse the `readFileSync`, `writeFileSync`, `existsSync`, `join` imports already at the top of `src/ingest.mjs` — do not duplicate them; merge the new names into the existing import lines.)

- [ ] **Step 5: Run to verify pass**

Run: `npm test`
Expected: all green (51 tests).

- [ ] **Step 6: Commit**

```bash
git add src/index.mjs src/ingest.mjs test/accept.test.mjs test/fixtures/candidates/
git commit -m "feat(toolkit-framework): accept gate — atomic validation between agent candidates and the KB

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: CLI verbs — `ingest`, `store`, `kb index`

**Files:**
- Modify: `src/cli.mjs`
- Modify: `test/cli.test.mjs` (append tests)

- [ ] **Step 1: Write the failing tests** (append to `test/cli.test.mjs`):

```js
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import yaml from 'js-yaml';

const FIXTURE = join(here, 'fixtures', 'transcript.md');
const CANDIDATES = join(here, 'fixtures', 'candidates');
const run = (args, opts = {}) => execFileSync('node', [cli, ...args], { encoding: 'utf8', ...opts });

test('cli drives the full pipeline: prepare → claim → fulfill → accept → store → kb index', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-'));
  const wodir = join(dir, '.workorders');
  const kb = join(dir, 'kb');

  const prep = run(['ingest', 'prepare', FIXTURE, '--dir', wodir]);
  assert.match(prep, /1 work order/);
  const id = run(['ingest', 'list', '--dir', wodir]).trim().split(/\s+/)[0];
  assert.match(id, /^wo-/);

  run(['ingest', 'claim', id, '--dir', wodir, '--by', 'test-agent']);
  const cdir = join(wodir, id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(CANDIDATES, 'good-source-system.yaml'), join(cdir, 'good-source-system.yaml'));
  run(['ingest', 'fulfill', id, '--dir', wodir]);
  assert.match(run(['ingest', 'accept', id, '--dir', wodir]), /accepted/);

  assert.match(run(['store', '--dir', wodir, '--adapter', 'kb-folder', '--target', kb]), /stored 1 object/);
  // idempotent: re-store finds nothing new
  assert.match(run(['store', '--dir', wodir, '--adapter', 'kb-folder', '--target', kb]), /stored 0 objects/);

  const idx = JSON.parse(run(['kb', 'index', '--adapter', 'kb-folder', '--target', kb]));
  assert.equal(idx.total, 1);
  assert.equal(idx.by_type['source-system'], 1);
});

test('cli ingest accept fails loudly on a bad candidate (exit ≠ 0, notes saved)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-bad-'));
  const wodir = join(dir, '.workorders');
  run(['ingest', 'prepare', FIXTURE, '--dir', wodir]);
  const id = run(['ingest', 'list', '--dir', wodir]).trim().split(/\s+/)[0];
  run(['ingest', 'claim', id, '--dir', wodir]);
  const cdir = join(wodir, id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(CANDIDATES, 'bad-maturity.yaml'), join(cdir, 'bad-maturity.yaml'));
  run(['ingest', 'fulfill', id, '--dir', wodir]);
  assert.throws(() => run(['ingest', 'accept', id, '--dir', wodir], { stdio: 'pipe' }));
  const wo = yaml.load(readFileSync(join(wodir, `${id}.yaml`), 'utf8'));
  assert.ok(wo.error_notes.includes('maturity must be "raw"'));
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test test/cli.test.mjs`
Expected: FAIL — the CLI prints its help and exits 2 on the unknown `ingest` command.

- [ ] **Step 3: Implement.** In `src/cli.mjs`: add imports, a tiny flag parser, and the new cases before `default:`.

```js
// add to imports at top:
import { writeFileSync } from 'node:fs';
import { prepare, acceptWorkOrder } from './ingest.mjs';
import { loadWorkOrders, loadWorkOrder, transition, saveWorkOrder } from './workorder.mjs';
import { getAdapter, listAdapters } from './storage.mjs';

// zero-dep flag parsing: pull `--flag value` pairs out of args, leave positionals
function parseFlags(rawArgs, defaults = {}) {
  const flags = { ...defaults };
  const positional = [];
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith('--')) { flags[rawArgs[i].slice(2)] = rawArgs[i + 1]; i++; }
    else positional.push(rawArgs[i]);
  }
  return { flags, positional };
}
```

New switch cases (keep the existing ones untouched):

```js
  case 'ingest': {
    const [sub, ...rest] = args;
    const { flags, positional } = parseFlags(rest, { dir: '.workorders' });
    if (sub === 'prepare') {
      const [path] = positional;
      if (!path) { console.error('usage: toolkit-framework ingest prepare <path> [--dir .workorders]'); process.exit(2); }
      const { created, skipped } = prepare({ path, workOrdersDir: flags.dir });
      console.log(`${created.length} work order(s) created, ${skipped.length} skipped (already prepared)`);
      for (const wo of created) console.log(`  ${wo.id}  ${wo.source_type}  ${wo.source_path}${wo.chunk ? ` [${wo.chunk}]` : ''}`);
    } else if (sub === 'list') {
      const orders = loadWorkOrders(flags.dir).filter((w) => !flags.status || w.status === flags.status);
      for (const w of orders) console.log(`${w.id}  ${w.status}  ${w.source_path}`);
    } else if (sub === 'claim' || sub === 'fulfill') {
      const [id] = positional;
      if (!id) { console.error(`usage: toolkit-framework ingest ${sub} <wo-id> [--dir .workorders]`); process.exit(2); }
      const next = sub === 'claim' ? 'claimed' : 'fulfilled';
      const wo = transition(loadWorkOrder(flags.dir, id), next);
      if (flags.by) wo.claimed_by = flags.by;
      saveWorkOrder(flags.dir, wo);
      console.log(`${id} → ${next}`);
    } else if (sub === 'accept') {
      const [id] = positional;
      if (!id) { console.error('usage: toolkit-framework ingest accept <wo-id> [--dir .workorders]'); process.exit(2); }
      const res = acceptWorkOrder({ workOrdersDir: flags.dir, id });
      if (res.accepted) { console.log(`✓ ${id} accepted (${res.objects.length} object(s))`); }
      else { console.error(`✗ ${id} not accepted:\n  - ${res.errors.join('\n  - ')}`); process.exit(1); }
    } else { console.error('usage: toolkit-framework ingest <prepare|list|claim|fulfill|accept> …'); process.exit(2); }
    break;
  }

  case 'store': {
    // add `readdirSync` to the node:fs import and `join` to a node:path import at the top of cli.mjs
    const { flags } = parseFlags(args, { dir: '.workorders', adapter: 'kb-folder', target: 'kb' });
    const adapter = getAdapter(flags.adapter);
    let count = 0;
    for (const wo of loadWorkOrders(flags.dir).filter((w) => w.status === 'accepted' && !w.produced)) {
      const dir = join(flags.dir, wo.id, 'accepted');
      const entries = readdirSync(dir).filter((f) => f.endsWith('.yaml'))
        .map((f) => yaml.load(readFileSync(join(dir, f), 'utf8')));
      const { stored } = adapter.store(flags.target, entries);
      saveWorkOrder(flags.dir, { ...wo, produced: stored });
      count += stored.length;
    }
    adapter.writeIndex(flags.target);
    console.log(`stored ${count} object${count === 1 ? '' : 's'} via ${flags.adapter} → ${flags.target}`);
    break;
  }

  case 'kb': {
    const [sub, ...rest] = args;
    const { flags } = parseFlags(rest, { adapter: 'kb-folder', target: 'kb' });
    if (sub === 'index') {
      console.log(JSON.stringify(getAdapter(flags.adapter).index(flags.target), null, 2));
    } else { console.error('usage: toolkit-framework kb index [--adapter kb-folder] [--target kb]'); process.exit(2); }
    break;
  }
```

Also update the help text in `default:` to list the new verbs:

```js
    console.log('  ingest prepare <path>           scan a source → idempotent work orders');
    console.log('  ingest list|claim|fulfill|accept  drive the work-order lifecycle');
    console.log('  store [--adapter --target]      write accepted objects via a storage adapter');
    console.log('  kb index [--adapter --target]   print the derived KB index');
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all green (53 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli.mjs test/cli.test.mjs
git commit -m "feat(toolkit-framework): CLI verbs ingest/store/kb — the pipeline is drivable end-to-end

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: `ingest` skill v0 (the flagship operating skill)

**Files:**
- Create: `skills/ingest/SKILL.md`
- Modify: `test/skills.test.mjs` (add `'ingest'` to `SKILLS`)

- [ ] **Step 1: Update the test** — in `test/skills.test.mjs` change the array:

```js
const SKILLS = ['capture-and-route', 'compose-journey', 'csis-review', 'ingest'];
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test test/skills.test.mjs`
Expected: FAIL — `ingest/SKILL.md should exist`.

- [ ] **Step 3: Write the skill**

```markdown
---
name: ingest
version: 0.2.0
description: Operate the framework's ingestion pipeline end-to-end — claim work orders, read sources, produce candidate typed objects, and hand them to the CLI accept gate. The batch big sibling of capture-and-route. Agents NEVER write to storage; only the CLI does.
framework: toolkit-framework
agnostic: true
---

# ingest

You are the semantic half of the pipeline (seam 1). The CLI did the deterministic
half (`ingest prepare` → work orders in `.workorders/`). Your job: turn each
work order's source into **candidate typed objects**. You do not validate, you
do not store — the CLI's accept gate does.

## The loop

1. **Pick an open order:** `node <framework>/src/cli.mjs ingest list --status open --dir .workorders`
2. **Claim it:** `… ingest claim <wo-id> --by <your-name> --dir .workorders`
3. **Read the order** (`.workorders/<wo-id>.yaml`): `source_path`, `source_type`,
   `target_schemas` (suggestions, not a cage), `instructions`.
4. **Read the source. Decompose (deep intake):** one shared thing becomes many
   entries — a transcript can yield source-systems + resources + concepts +
   claims + signals. Consult `skills/capture-and-route/SKILL.md` steps 1–7 for
   the decomposition discipline (source-system check, high-risk triggers,
   routing, provenance).
5. **If the source's shape is foreign** (its own type system / vocabulary),
   run `skills/map-ontology` first and propose extensions rather than
   shoehorning.
6. **If the origin is a living knowledge environment**, run
   `skills/register-source` so the source-system card + return path exist
   BEFORE content objects reference them.
7. **Write candidates** to `.workorders/<wo-id>/candidates/<nn>-<schema>.yaml`,
   one per object:

   ```yaml
   schema: source-system        # any schema from `list-schemas`
   object:
     title: …
     type: …                    # the schema's discriminator
     maturity: raw              # ALWAYS raw — promotion is review-promote's job
     ai_assisted: true          # ALWAYS true for agent-produced objects
     provenance:
       origin: "<where this came from — file, URL>"
       transformation: synthesized   # quoted|summarized|synthesized|translated|remixed|inferred
       authorship: ai-assisted
     # …schema fields; run `validate <schema> <file>` locally if unsure
   ```

8. **Mark fulfilled:** `… ingest fulfill <wo-id> --dir .workorders`
9. **Hand to the gate:** `… ingest accept <wo-id> --dir .workorders`
   - Rejected? The order's `error_notes` are your retry instructions. Fix the
     candidates, `fulfill` is already set — run `accept` again.
10. **Never run `store` yourself unless the operator asked** — storing is an
    operator/CI decision (`store --adapter <kb-folder|repo-data> --target <dir>`).

## Hard rules

- `maturity: raw`, `ai_assisted: true`, `provenance.origin` — on every object. The gate enforces these; save yourself the round-trip.
- High-risk triggers (people, exact locations, TEK/Indigenous knowledge, MRV/carbon claims, funding/legal/governance recs) → `high_risk: true` + a `public-use-boundary` candidate.
- Retweets/mentions are signals, not endorsements. Do not create public person-nodes.
- One candidate file per object. Small objects over mega-objects — they compose.
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add skills/ingest/SKILL.md test/skills.test.mjs
git commit -m "feat(toolkit-framework): ingest skill v0 — the flagship pipeline operator

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Pipeline integration test + the REAL slice run

**Files:**
- Create: `test/pipeline.test.mjs`
- Creates (repo): `REPO:kb/` (first real stored objects), `REPO:.workorders/`

- [ ] **Step 1: Write the integration test** (fixture-driven, both directions):

```js
// test/pipeline.test.mjs — the vertical slice, end to end on fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare, acceptWorkOrder } from '../src/ingest.mjs';
import { loadWorkOrder, transition, saveWorkOrder } from '../src/workorder.mjs';
import { getAdapter } from '../src/storage.mjs';

const here = dirname(fileURLToPath(import.meta.url));

test('vertical slice: transcript → work order → candidates → accept → store → index', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-pipe-'));
  const woDir = join(dir, '.workorders');
  const kb = join(dir, 'kb');

  // prepare (idempotent)
  const [wo] = prepare({ path: join(here, 'fixtures', 'transcript.md'), workOrdersDir: woDir }).created;
  assert.equal(prepare({ path: join(here, 'fixtures', 'transcript.md'), workOrdersDir: woDir }).created.length, 0);

  // agent's part, simulated by fixtures
  saveWorkOrder(woDir, transition(transition(wo, 'claimed'), 'fulfilled'));
  const cdir = join(woDir, wo.id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(here, 'fixtures', 'candidates', 'good-source-system.yaml'), join(cdir, 'c1.yaml'));

  // gate + store
  const res = acceptWorkOrder({ workOrdersDir: woDir, id: wo.id });
  assert.equal(res.accepted, true, res.errors.join('; '));
  const adapter = getAdapter('kb-folder');
  const { stored } = adapter.store(kb, res.objects);
  assert.equal(stored.length, 1);
  adapter.writeIndex(kb);

  // the index is the site's read surface (seam 3)
  const idx = adapter.index(kb);
  assert.equal(idx.total, 1);
  assert.equal(idx.review_queue, 1, 'raw + ai_assisted objects await review');
  // provenance chain is complete
  const [{ object }] = adapter.list(kb);
  assert.equal(object.work_order, wo.id);
  assert.ok(object.provenance.origin);
  assert.ok(object.source_lineage);
});
```

- [ ] **Step 2: Run to verify pass** (no new prod code — this locks the slice):

Run: `npm test`
Expected: all green (54 tests).

- [ ] **Step 3: Commit**

```bash
git add test/pipeline.test.mjs
git commit -m "test(toolkit-framework): pipeline integration test — the vertical slice locked

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: THE REAL RUN — ingest the 2026-07-02 planning call.** From the **worktree repo root** (not the package dir). This is an agent-executed step: after `prepare`, YOU (the executing agent) fulfill the work order by following `skills/ingest/SKILL.md` on the real meeting note:

```bash
cd ../..   # worktree repo root
node packages/toolkit-framework/src/cli.mjs ingest prepare \
  "packages/operations/meetings/260702 Regen Web3 Toolkit Planning Call.md" --dir .workorders
node packages/toolkit-framework/src/cli.mjs ingest list --dir .workorders
```

Expected: 1+ work orders (the file is ~15k chars — likely a single order, `transcript` or `document`).

- [ ] **Step 5: Fulfill per the skill** — claim; read the meeting note; produce real candidates (expect ≥5: source-system cards for e.g. Gen Brasil Commons + CSIS/Craft standards site, resources for the AI Precision Toolkit + Geo Protocol, concept-lineage for "framework-as-package", signals for "ingestion≠storage" + "Frame-1 language warning", claim-evidence for "structure beats intention"); fulfill; accept:

```bash
node packages/toolkit-framework/src/cli.mjs ingest claim <wo-id> --by claude --dir .workorders
# …write .workorders/<wo-id>/candidates/*.yaml per the skill…
node packages/toolkit-framework/src/cli.mjs ingest fulfill <wo-id> --dir .workorders
node packages/toolkit-framework/src/cli.mjs ingest accept <wo-id> --dir .workorders
```

Expected: `✓ <wo-id> accepted (N object(s))`. If rejected: read `error_notes`, fix, re-accept — that loop working IS the design working.

- [ ] **Step 6: Store + inspect**

```bash
node packages/toolkit-framework/src/cli.mjs store --dir .workorders --adapter kb-folder --target kb
node packages/toolkit-framework/src/cli.mjs kb index --adapter kb-folder --target kb
```

Expected: `stored N objects…`; index JSON with `total: N`, `review_queue: N`.

- [ ] **Step 7: Commit the first real KB objects**

```bash
git add kb/ .workorders/
git commit -m "feat(kb): first real ingestion — 2026-07-02 planning call through the full pipeline

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**🎉 WAVE 0 DONE — the vertical slice is real. Everything after this thickens it.**

---

## WAVE 1A — Machine depth (Saturday)

## Task 8: Adapter contract suite + `repo-data` adapter

**Files:**
- Create: `src/adapters/repo-data.mjs`
- Create: `test/adapters.test.mjs`
- Modify: `src/storage.mjs` (register `repo-data`)

- [ ] **Step 1: Write the failing contract suite** — ONE suite, parametrized over every shipping adapter. This suite IS the interface's spec; any future adapter must pass it unchanged:

```js
// test/adapters.test.mjs — the adapter contract. Every shipping adapter passes
// the same assertions; the interface is what this file says it is.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAdapter } from '../src/storage.mjs';

const SHIPPING = ['kb-folder', 'repo-data'];
const entry = (title = 'Contract Fixture') => ({
  schema: 'source-system',
  object: { title, type: 'wiki', steward: 'Suite', return_path: 'PRs', maturity: 'raw', ai_assisted: true },
});

for (const name of SHIPPING) {
  test(`[${name}] store → list → update → index round-trip, idempotent + derived`, () => {
    const target = mkdtempSync(join(tmpdir(), `tf-${name}-`));
    const a = getAdapter(name);
    assert.equal(a.name, name);

    const { stored } = a.store(target, [entry()]);
    assert.equal(stored.length, 1);
    a.store(target, [entry()]);                       // idempotent by slug
    assert.equal(a.list(target).length, 1);

    a.update(target, stored[0], { maturity: 'plausible' });
    assert.equal(a.list(target)[0].object.maturity, 'plausible');

    const idx = a.index(target);
    assert.equal(idx.total, 1);
    assert.equal(idx.by_type['source-system'], 1);
    assert.ok(idx.generated_from.includes('derived'));

    const { indexPath, contextPath } = a.writeIndex(target);
    assert.ok(existsSync(indexPath) && existsSync(contextPath));
    // index.json content is real, not just present
    const written = JSON.parse(readFileSync(indexPath, 'utf8'));
    assert.equal(written.total, 1);

    // empty target: list/index degrade gracefully
    const empty = mkdtempSync(join(tmpdir(), `tf-${name}-empty-`));
    assert.deepEqual(a.list(empty), []);
    assert.equal(a.index(empty).total, 0);
  });

  test(`[${name}] adapter module is importable as the entry module (no import cycle)`, () => {
    const file = name === 'kb-folder' ? 'kb-folder' : name;
    const out = execFileSync('node', ['-e',
      `import('./src/adapters/${file}.mjs').then(m => console.log(Object.values(m)[0].name))`],
      { encoding: 'utf8', cwd: join(here, '..') });
    assert.equal(out.trim(), name);
  });
}
```

(Add `readFileSync` to the `node:fs` import, `execFileSync` from `node:child_process`, and `here` via `dirname(fileURLToPath(import.meta.url))` — see test/storage.test.mjs for the established pattern. Contract note: adapter methods use `this` internally — always call them ON the adapter object, never destructure; document this in the storage.mjs contract block if not already there.)

- [ ] **Step 2: Run to verify failure**

Run: `node --test test/adapters.test.mjs`
Expected: `kb-folder` passes; `repo-data` FAILS (`unknown storage adapter: repo-data`).

- [ ] **Step 3: Implement `src/adapters/repo-data.mjs`.** Same contract, org-os shape: objects merged into per-schema registry files under `<target>/data/kb/<schema>.yaml` (NOT the instance's existing `data/*.yaml` files — those have their own shapes; the kms registry-bridge maps between them later). `ref` format: `<file>#<slug>`.

```js
// src/adapters/repo-data.mjs — the org-os instance target: per-schema registry
// files under data/kb/. Deliberately does NOT touch an instance's existing
// data/*.yaml (different shapes); @org-os/kms bridges the two.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { slugify } from '../util.mjs';   // ⚠ NOT '../storage.mjs' — storage imports every adapter; importing storage back creates a TDZ cycle (see fix 7261151)
import { toJsonLdContext } from '../index.mjs';

function atomicWrite(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = join(dirname(path), `.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`);
  writeFileSync(tmp, text);
  renameSync(tmp, path);
}
const fileFor = (target, schema) => join(target, 'data', 'kb', `${schema}.yaml`);
const loadFile = (p) => (existsSync(p) ? yaml.load(readFileSync(p, 'utf8')) : { entries: {} });

export const repoDataAdapter = {
  name: 'repo-data',

  store(target, entries) {
    const stored = [];
    const byFile = new Map();
    for (const { schema, object } of entries) {
      const p = fileFor(target, schema);
      if (!byFile.has(p)) byFile.set(p, loadFile(p));
      const slug = slugify(object.title || 'untitled');
      byFile.get(p).entries[slug] = object;            // idempotent: same slug overwrites
      stored.push(`${p}#${slug}`);
    }
    for (const [p, doc] of byFile) atomicWrite(p, yaml.dump(doc));
    return { stored };
  },

  list(target) {
    const dir = join(target, 'data', 'kb');
    if (!existsSync(dir)) return [];
    const out = [];
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
      const schema = f.replace(/\.yaml$/, '');
      const doc = loadFile(join(dir, f));
      for (const [slug, object] of Object.entries(doc.entries || {})) {
        out.push({ schema, object, ref: `${join(dir, f)}#${slug}` });
      }
    }
    return out;
  },

  update(target, ref, patch) {
    const [file, slug] = ref.split('#');
    const doc = loadFile(file);
    if (!doc.entries[slug]) throw new Error(`no entry "${slug}" in ${file}`);
    doc.entries[slug] = { ...doc.entries[slug], ...patch };
    atomicWrite(file, yaml.dump(doc));
    return { ref, object: doc.entries[slug] };
  },

  index(target) {
    const items = this.list(target);
    const by_type = {}; const by_maturity = {};
    let review_queue = 0;
    for (const { schema, object } of items) {
      by_type[schema] = (by_type[schema] || 0) + 1;
      if (object.maturity) by_maturity[object.maturity] = (by_maturity[object.maturity] || 0) + 1;
      if (object.maturity === 'raw' || object.ai_assisted === true) review_queue += 1;
    }
    return { total: items.length, by_type, by_maturity, review_queue,
      generated_from: 'derived — rebuildable from data/kb/' };
  },

  writeIndex(target) {
    const indexPath = join(target, 'data', 'kb', 'index.json');
    const contextPath = join(target, 'data', 'kb', 'context.jsonld');
    atomicWrite(indexPath, JSON.stringify(this.index(target), null, 2));
    atomicWrite(contextPath, JSON.stringify(toJsonLdContext(), null, 2));
    return { indexPath, contextPath };
  },
};
```

Register it in `src/storage.mjs`:

```js
import { repoDataAdapter } from './adapters/repo-data.mjs';
const ADAPTERS = { 'kb-folder': kbFolderAdapter, 'repo-data': repoDataAdapter };
```

Both adapters share the derived-index computation — extract it once (DRY) into `src/storage.mjs`:

```js
/** Shared derived-index computation over an adapter's list() output. */
export function deriveIndex(items, from) {
  const by_type = {}; const by_maturity = {};
  let review_queue = 0;
  for (const { schema, object } of items) {
    by_type[schema] = (by_type[schema] || 0) + 1;
    if (object.maturity) by_maturity[object.maturity] = (by_maturity[object.maturity] || 0) + 1;
    if (object.maturity === 'raw' || object.ai_assisted === true) review_queue += 1;
  }
  return { total: items.length, by_type, by_maturity, review_queue, generated_from: `derived — rebuildable from ${from}` };
}
```

…and both adapters' `index()` become `return deriveIndex(this.list(target), 'objects/');` / `…, 'data/kb/');` (update the kb-folder one too; keep its test expectations — `generated_from` still contains "derived").

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all green (56 tests).

- [ ] **Step 5: Commit**

```bash
git add src/adapters/repo-data.mjs src/storage.mjs src/adapters/kb-folder.mjs test/adapters.test.mjs
git commit -m "feat(toolkit-framework): repo-data adapter + adapter contract suite — two real storage targets prove the seam

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: `geo` adapter — the documented stub

**Files:**
- Create: `src/adapters/geo.mjs`
- Modify: `src/storage.mjs` (register), `test/adapters.test.mjs` (stub assertions)

- [ ] **Step 1: Write the failing test** (append to `test/adapters.test.mjs`):

```js
test('[geo] is a documented stub: registered, but every operation throws with the seam docs', () => {
  const geo = getAdapter('geo');
  assert.equal(geo.name, 'geo');
  for (const call of [() => geo.store('x', []), () => geo.list('x'), () => geo.index('x')]) {
    assert.throws(call, /geo adapter is a documented stub.*Geo Protocol|IPFS/s);
  }
});
```

- [ ] **Step 2: Run to verify failure**, then **Step 3: Implement**:

```js
// src/adapters/geo.mjs — DOCUMENTED STUB (spec §2 d4). The seam Rather's Geo
// Protocol SDK fills. Geo = IPFS + The Graph; the SDK offers content-adding,
// an abstracted Aragon governance interface, and a read API to pull/compose
// any space (2026-07-02 call). To implement: map store() → SDK content-add
// (one triple-set per object via the JSON-LD context), list()/index() → read
// API over the instance's space, update() → content-add of the new version.
const SEAM = `geo adapter is a documented stub — the seam the Geo Protocol SDK fills.
Geo = IPFS + The Graph. store() → SDK content-add (objects serialize via the
kernel's JSON-LD @context: \`toolkit-framework context\`); list()/index() → the
Geo read API over this instance's space; update() → content-add a new version.
Ask Rather for the SDK + space setup; see docs/meta/GAPS.md (interop thread).`;

const stub = () => { throw new Error(SEAM); };

export const geoAdapter = {
  name: 'geo',
  store: stub, list: stub, update: stub, index: stub, writeIndex: stub,
};
```

Register: `import { geoAdapter } from './adapters/geo.mjs';` … `const ADAPTERS = { 'kb-folder': kbFolderAdapter, 'repo-data': repoDataAdapter, geo: geoAdapter };`

- [ ] **Step 4: Run** `npm test` — all green. **Step 5: Commit**

```bash
git add src/adapters/geo.mjs src/storage.mjs test/adapters.test.mjs
git commit -m "feat(toolkit-framework): geo adapter stub — the Geo Protocol seam, documented not welded

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Review queue — `src/review.mjs` + CLI `review list|promote`

**Files:**
- Create: `src/review.mjs`
- Create: `test/review.test.mjs`
- Modify: `src/cli.mjs` (add `review` case + help lines)

- [ ] **Step 1: Write the failing tests**

```js
// test/review.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAdapter } from '../src/storage.mjs';
import { reviewQueue, promote } from '../src/review.mjs';

function seed() {
  const kb = mkdtempSync(join(tmpdir(), 'tf-rev-'));
  const a = getAdapter('kb-folder');
  a.store(kb, [{ schema: 'source-system',
    object: { title: 'Raw Wiki', type: 'wiki', steward: 'S', return_path: 'r', maturity: 'raw', ai_assisted: true } }]);
  return { kb, a };
}

test('reviewQueue lists raw / ai_assisted objects', () => {
  const { kb } = seed();
  const q = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.equal(q.length, 1);
  assert.equal(q[0].object.title, 'Raw Wiki');
});

test('promote to reviewed requires a reviewer, clears ai_assisted, stamps review fields', () => {
  const { kb } = seed();
  const [{ ref }] = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'reviewed' }),
    /--reviewer is required/);
  const { object } = promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'reviewed',
    reviewer: 'luiz', date: '2026-07-05' });
  assert.equal(object.maturity, 'reviewed');
  assert.equal(object.ai_assisted, false, 'human review clears the flag (invariant); provenance.authorship keeps the history');
  assert.equal(object.last_reviewed, '2026-07-05');
  assert.equal(object.reviewed_by, 'luiz');
  assert.equal(reviewQueue({ adapter: 'kb-folder', target: kb }).length, 0);
});

test('promote validates the maturity value against K1', () => {
  const { kb } = seed();
  const [{ ref }] = reviewQueue({ adapter: 'kb-folder', target: kb });
  assert.throws(() => promote({ adapter: 'kb-folder', target: kb, ref, maturity: 'canonical', reviewer: 'x' }),
    /not a valid maturity/);
});
```

- [ ] **Step 2: Run to verify failure**, then **Step 3: Implement**

```js
// src/review.mjs — the human gate. "Raw is never auto-promoted" gets its operator.
import { getAdapter } from './storage.mjs';
import { isValid, checkInvariants } from './index.mjs';

export function reviewQueue({ adapter, target }) {
  return getAdapter(adapter).list(target)
    .filter(({ object }) => object.maturity === 'raw' || object.ai_assisted === true);
}

export function promote({ adapter, target, ref, maturity, reviewer, date }) {
  if (!isValid('maturity', maturity)) throw new Error(`"${maturity}" is not a valid maturity (K1)`);
  const needsHuman = maturity !== 'raw';
  if (needsHuman && !reviewer) throw new Error('--reviewer is required to promote beyond raw — AI-assisted ≠ Human-reviewed');
  const a = getAdapter(adapter);
  const patch = { maturity };
  if (reviewer) {
    patch.ai_assisted = false;              // reviewed by a human now; provenance.authorship preserves history
    patch.reviewed_by = reviewer;
    patch.last_reviewed = date || new Date().toISOString().slice(0, 10);
  }
  const { object } = a.update(target, ref, patch);
  const inv = checkInvariants(object);
  if (!inv.ok) throw new Error(`promotion violates invariants:\n  - ${inv.violations.join('\n  - ')}`);
  a.writeIndex(target);
  return { ref, object };
}
```

CLI case (in `src/cli.mjs`, import `reviewQueue, promote` from `./review.mjs`):

```js
  case 'review': {
    const [sub, ...rest] = args;
    const { flags, positional } = parseFlags(rest, { adapter: 'kb-folder', target: 'kb' });
    if (sub === 'list') {
      const q = reviewQueue({ adapter: flags.adapter, target: flags.target });
      for (const { schema, object, ref } of q) console.log(`${ref}\n  ${schema} · "${object.title}" · maturity=${object.maturity} ai_assisted=${object.ai_assisted}`);
      console.log(`${q.length} awaiting review`);
    } else if (sub === 'promote') {
      const [ref] = positional;
      if (!ref || !flags.maturity) { console.error('usage: toolkit-framework review promote <ref> --maturity <value> [--reviewer <name>]'); process.exit(2); }
      try {
        const { object } = promote({ adapter: flags.adapter, target: flags.target, ref, maturity: flags.maturity, reviewer: flags.reviewer, date: flags.date });
        console.log(`✓ "${object.title}" → ${object.maturity}${flags.reviewer ? ` (reviewed by ${flags.reviewer})` : ''}`);
      } catch (e) { console.error(`✗ ${e.message}`); process.exit(1); }
    } else { console.error('usage: toolkit-framework review <list|promote> …'); process.exit(2); }
    break;
  }
```

Help lines: `review list|promote <ref>         operate the review queue (human gate)`.

- [ ] **Step 4: Run** `npm test` — all green. **Step 5: Commit**

```bash
git add src/review.mjs src/cli.mjs test/review.test.mjs
git commit -m "feat(toolkit-framework): review queue + promote — the human gate over K1 maturity

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: `review-promote` + `register-source` skills

**Files:**
- Create: `skills/review-promote/SKILL.md`, `skills/register-source/SKILL.md`
- Modify: `test/skills.test.mjs`

- [ ] **Step 1: Update the test array** (fails until both files exist):

```js
const SKILLS = ['capture-and-route', 'compose-journey', 'csis-review', 'ingest', 'register-source', 'review-promote'];
```

- [ ] **Step 2: Write `skills/review-promote/SKILL.md`**

```markdown
---
name: review-promote
version: 0.2.0
description: Run a guided human review session over the KB's review queue — inspect raw/AI-assisted objects with the reviewer, promote K1 maturity honestly, never in bulk, never without a named human. The operator of "raw is never auto-promoted".
framework: toolkit-framework
agnostic: true
---

# review-promote

The human gate. You facilitate; the human decides. You NEVER promote without a
named reviewer in the room.

## Session loop

1. `… review list --adapter <a> --target <t>` — show the queue, grouped by schema.
2. For each object (or the slice the reviewer picks): present it whole — title,
   fields, provenance chain (origin → work_order → source_lineage). Flag anything
   the accept gate can't judge: unverified claims, thin provenance, Frame-1
   language (see csis-review), high-risk triggers missed at ingest.
3. Ask the reviewer for the verdict. The honest menu (K1):
   - stays `raw` (not ready) · `plausible` (sane but unverified) · `reviewed`
     (human checked it) · or **edit first** (fix fields, then promote).
4. `… review promote <ref> --maturity <value> --reviewer <name>` — one object
   at a time. The CLI clears `ai_assisted` on human review and re-derives the index.
5. End of session: report — N reviewed, M promoted, K sent back with notes
   (write notes into the object via the same promote flow before demoting).

## Hard rules

- No reviewer present → read-only session. Summarize the queue; promote nothing.
- Never batch-promote. Each object is a decision.
- Promotion to `reviewed` of MRV/carbon/funding/governance claims additionally
  needs the csis-review skill's high-risk pass — point the reviewer there.
```

- [ ] **Step 3: Write `skills/register-source/SKILL.md`**

```markdown
---
name: register-source
version: 0.2.0
description: Register a knowledge source as a first-class federation peer — create its source-system card (return path, reuse conditions, crediting, currentness), wire the provenance chain, and enforce referencing discipline before any content is ingested from it. Sources are peers, not link pools.
framework: toolkit-framework
agnostic: true
---

# register-source

Every ingestion starts here (spec §4). Content objects reference their source
system; the card must exist BEFORE the content does.

## Steps

1. **Identify the source system** behind the artifact: the living environment
   (wiki, repo, podcast, forum, newsletter, dataset, convening…) — not the file.
   A PDF someone sent is not the source system; the community that maintains it is.
2. **Draft the card** (`schemas/source-system.yaml` — enum for `type`):
   required: `title`, `type`, `steward`, **`return_path`** (the reciprocity
   primitive: how corrections/contributions flow BACK). Fill honestly:
   `reuse_conditions` (license/permission — if unknown, say unknown and set
   `high_risk: true`), `how_to_credit`, `currentness`, `update_rhythm`, `url`.
3. **No return path?** That's a finding, not a blank — write `return_path:
   "none known — flag to steward"` and raise a `signal` candidate proposing
   outreach. Extraction without reciprocity is Frame-1 behavior.
4. **Born-rules apply**: `maturity: raw`, `ai_assisted: true`, `provenance`
   with `origin` (where YOU learned of this source).
5. **Referencing discipline** for everything ingested from this source:
   claims become `claim-evidence` candidates citing the source card's slug —
   never naked assertions in prose fields.
6. **Emit** as a candidate in the current work order (or via capture-and-route
   for a standalone registration), then validate:
   `… validate source-system <file>`.

## In the pilots

Self-ingestion registers Heenal's site + the master doc as source systems;
ReFi DAO registers its podcast + blog; ReFi BCN its knowledge commons. The
federation triangle (spec §6a) is these cards pointing at each other.
```

- [ ] **Step 4: Run** `npm test` — all green. **Step 5: Commit**

```bash
git add skills/review-promote/ skills/register-source/ test/skills.test.mjs
git commit -m "feat(toolkit-framework): review-promote + register-source skills — the human gate and the sourcing discipline get operators

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: `cli init --new / --existing` (replication, spec §6a)

**Files:**
- Create: `src/instance.mjs`
- Create: `test/instance.test.mjs`
- Modify: `src/cli.mjs` (add `init` case; make `store`/`kb`/`review` read `kms.yaml` defaults)

- [ ] **Step 1: Write the failing tests**

```js
// test/instance.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { initInstance, loadConfig } from '../src/instance.mjs';
import { validateObject } from '../src/index.mjs';
import { loadWorkOrders } from '../src/workorder.mjs';

test('init --new stamps the substrate: kb/, .workorders/, kms.yaml, self source-system card', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-'));
  const res = initInstance({ dir, name: 'test-commons' });
  assert.ok(existsSync(join(dir, 'kb')));
  assert.ok(existsSync(join(dir, '.workorders')));
  const cfg = loadConfig(dir);
  assert.equal(cfg.instance, 'test-commons');
  assert.equal(cfg.adapter, 'kb-folder');
  assert.equal(cfg.target, 'kb');
  // born a federation citizen: its own card exists and validates
  const card = yaml.load(readFileSync(join(dir, 'kb', 'self.source-system.yaml'), 'utf8'));
  const { valid, errors } = validateObject('source-system', card);
  assert.equal(valid, true, errors.join('; '));
  assert.equal(card.maturity, 'raw', 'draft card until the operator completes it via register-source');
  assert.equal(res.workOrders, 0);
});

test('init --existing also queues the existing corpus as work orders', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-ex-'));
  const content = join(dir, 'content');
  const sub = join(content, 'docs');
  mkdirSync(sub, { recursive: true });   // build a tiny corpus
  writeFileSync(join(content, 'a.md'), '# A\nprose');
  writeFileSync(join(sub, 'b.md'), '# B\nprose');
  const res = initInstance({ dir, name: 'wrapped', mode: 'existing', existingPath: content });
  assert.equal(res.workOrders, 2);
  assert.equal(loadWorkOrders(join(dir, '.workorders')).length, 2);
});

test('init is idempotent — re-running never clobbers an existing kms.yaml or card', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-init-idem-'));
  initInstance({ dir, name: 'once' });
  const before = readFileSync(join(dir, 'kms.yaml'), 'utf8');
  initInstance({ dir, name: 'twice' });
  assert.equal(readFileSync(join(dir, 'kms.yaml'), 'utf8'), before, 'existing config untouched');
});
```

(Note the `node:fs` import at the top of this test file must include `mkdirSync`: `import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';`)

- [ ] **Step 2: Run to verify failure**, then **Step 3: Implement**

```js
// src/instance.mjs — replication (spec §6a): one command from empty dir (or
// existing content) to a working, ingestable, federation-ready KB instance.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import yaml from 'js-yaml';
import { prepare } from './ingest.mjs';

export function loadConfig(dir = '.') {
  const p = join(dir, 'kms.yaml');
  return existsSync(p) ? yaml.load(readFileSync(p, 'utf8')) : null;
}

export function initInstance({ dir, name = null, mode = 'new', existingPath = null, adapter = 'kb-folder', target = 'kb' }) {
  const instance = name || basename(resolve(dir));
  mkdirSync(join(dir, target), { recursive: true });
  mkdirSync(join(dir, '.workorders'), { recursive: true });

  const cfgPath = join(dir, 'kms.yaml');
  if (!existsSync(cfgPath)) {
    writeFileSync(cfgPath, yaml.dump({
      instance, adapter, target,
      source_registry: `${target}/federation`,
      framework: '@regen-commons/toolkit-framework',
    }));
  }

  // Born a federation citizen: the instance's own source-system card (draft —
  // the operator completes steward/return_path via the register-source skill).
  const cardPath = join(dir, target, 'self.source-system.yaml');
  if (!existsSync(cardPath)) {
    writeFileSync(cardPath, yaml.dump({
      title: instance, type: 'repo', steward: instance,
      return_path: 'unset — complete via the register-source skill',
      maturity: 'raw', lifecycle_state: 'raw-lead', ai_assisted: true,
      notes: 'Self card created by init. Complete steward, return_path, reuse_conditions, how_to_credit before federating.',
    }));
  }

  let workOrders = 0;
  if (mode === 'existing') {
    if (!existingPath) throw new Error('init --existing requires a content path');
    workOrders = prepare({ path: existingPath, workOrdersDir: join(dir, '.workorders') }).created.length;
  }
  return { instance, dir, workOrders };
}
```

CLI case (import `initInstance, loadConfig` from `./instance.mjs`):

```js
  case 'init': {
    const { flags, positional } = parseFlags(args, {});
    const dir = positional[0] || '.';
    const mode = 'existing' in flags ? 'existing' : 'new';
    const res = initInstance({ dir, mode, existingPath: flags.existing || null,
      name: flags.name || null, adapter: flags.adapter || 'kb-folder' });
    console.log(`✓ instance "${res.instance}" initialized at ${res.dir}` +
      (res.workOrders ? ` — ${res.workOrders} work order(s) queued from existing content` : ''));
    console.log('next: complete kb/self.source-system.yaml (register-source skill), then run the ingest skill');
    break;
  }
```

Also wire config defaults into the `store`, `kb`, and `review` cases — replace their `parseFlags(rest, { adapter: 'kb-folder', target: 'kb' })` defaults with:

```js
    const cfg = loadConfig('.') || {};
    const { flags } = parseFlags(rest, { adapter: cfg.adapter || 'kb-folder', target: cfg.target || 'kb', dir: '.workorders' });
```

Help lines:

```js
    console.log('  init [dir] [--existing <path>]  replicate: stamp a new KB instance (or wrap existing content)');
```

- [ ] **Step 4: Run** `npm test` — all green. **Step 5: Commit**

```bash
git add src/instance.mjs src/cli.mjs test/instance.test.mjs
git commit -m "feat(toolkit-framework): cli init --new/--existing — replication in one command, born federation-ready

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: `cli federate add|check` (the handshake, spec §6a)

**Files:**
- Modify: `src/instance.mjs` (add `federateAdd`, `federateCheck`)
- Modify: `test/instance.test.mjs` (append), `src/cli.mjs` (add case)

- [ ] **Step 1: Write the failing tests** (append to `test/instance.test.mjs`):

```js
import { federateAdd, federateCheck } from '../src/instance.mjs';

test('federate add validates a peer card and registers it under kb/federation/', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-fed-'));
  initInstance({ dir, name: 'home' });
  const peerCard = join(dir, 'peer.yaml');
  writeFileSync(peerCard, yaml.dump({
    title: 'ReFi DAO Commons', type: 'repo', steward: 'ReFi DAO',
    return_path: 'PRs to refi-dao-os', maturity: 'raw', ai_assisted: true,
  }));
  const res = federateAdd({ dir, cardPath: peerCard });
  assert.ok(existsSync(join(dir, 'kb', 'federation', 'refi-dao-commons.yaml')));
  assert.equal(res.slug, 'refi-dao-commons');
  // invalid card refuses
  const bad = join(dir, 'bad.yaml');
  writeFileSync(bad, yaml.dump({ title: 'No Return Path', type: 'repo', steward: 'X' }));
  assert.throws(() => federateAdd({ dir, cardPath: bad }), /return_path/);
});

test('federate check runs fork-compatibility over a peer extensions file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-fedchk-'));
  const peerExt = join(dir, 'peer-extensions.yaml');
  writeFileSync(peerExt, yaml.dump({
    entities: {
      'mediation-protocol': { maps_to_core: 'resource' },
      'vibes-object': {},                                  // no maps_to_core → incompatible
    },
  }));
  const res = federateCheck({ extensionsPath: peerExt });
  assert.deepEqual(res.compatible, ['mediation-protocol']);
  assert.deepEqual(res.incompatible, ['vibes-object']);
});
```

- [ ] **Step 2: Run to verify failure**, then **Step 3: Implement** (append to `src/instance.mjs`; add `validateObject, isForkCompatible` and `slugify` imports):

```js
import { validateObject, isForkCompatible } from './index.mjs';
import { slugify } from './storage.mjs';

/** Register a peer KB: validate its source-system card, file it under <target>/federation/. */
export function federateAdd({ dir, cardPath }) {
  const cfg = loadConfig(dir) || { target: 'kb' };
  const card = yaml.load(readFileSync(cardPath, 'utf8'));
  const { valid, errors } = validateObject('source-system', card);
  if (!valid) throw new Error(`peer card invalid:\n  - ${errors.join('\n  - ')}`);
  const slug = slugify(card.title);
  const fedDir = join(dir, cfg.target, 'federation');
  mkdirSync(fedDir, { recursive: true });
  writeFileSync(join(fedDir, `${slug}.yaml`), yaml.dump(card));
  return { slug, path: join(fedDir, `${slug}.yaml`) };
}

/** Fork-compatibility over a peer's extension types ({ entities: { name: { maps_to_core } } }). */
export function federateCheck({ extensionsPath }) {
  const doc = yaml.load(readFileSync(extensionsPath, 'utf8'));
  const compatible = []; const incompatible = [];
  for (const [name, def] of Object.entries(doc.entities || {})) {
    (isForkCompatible(def) ? compatible : incompatible).push(name);
  }
  return { compatible, incompatible };
}
```

CLI case:

```js
  case 'federate': {
    const [sub, ...rest] = args;
    const { flags, positional } = parseFlags(rest, {});
    if (sub === 'add') {
      const [cardPath] = positional;
      if (!cardPath) { console.error('usage: toolkit-framework federate add <peer-card.yaml>'); process.exit(2); }
      try {
        const { slug, path } = federateAdd({ dir: '.', cardPath });
        console.log(`✓ peer "${slug}" registered → ${path}`);
      } catch (e) { console.error(`✗ ${e.message}`); process.exit(1); }
    } else if (sub === 'check') {
      const [extPath] = positional;
      if (!extPath) { console.error('usage: toolkit-framework federate check <peer-extensions.yaml>'); process.exit(2); }
      const { compatible, incompatible } = federateCheck({ extensionsPath: extPath });
      for (const n of compatible) console.log(`✓ ${n}`);
      for (const n of incompatible) console.log(`✗ ${n} — no maps_to_core to a real core type`);
      if (incompatible.length) process.exit(1);
      console.log(`fork-compatible: ${compatible.length}/${compatible.length}`);
    } else { console.error('usage: toolkit-framework federate <add|check> …'); process.exit(2); }
    break;
  }
```

Help: `federate add|check              register a peer KB / check ontology fork-compatibility`.

- [ ] **Step 4: Run** `npm test` — all green. **Step 5: Commit**

```bash
git add src/instance.mjs src/cli.mjs test/instance.test.mjs
git commit -m "feat(toolkit-framework): federate add/check — the handshake; every KB born addressable

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: `map-ontology` skill + csis-review frame-language mode

**Files:**
- Create: `skills/map-ontology/SKILL.md`
- Modify: `skills/csis-review/SKILL.md` (append a mode section — do not restructure the existing content)
- Modify: `test/skills.test.mjs`

- [ ] **Step 1: Update the test array** (+ a mode assertion):

```js
const SKILLS = ['capture-and-route', 'compose-journey', 'csis-review', 'ingest', 'map-ontology', 'register-source', 'review-promote'];
```

Append a test:

```js
test('csis-review carries the frame-language-audit mode', () => {
  const md = readFileSync(join(skillsDir, 'csis-review', 'SKILL.md'), 'utf8');
  assert.match(md, /## Mode: frame-language-audit/);
  assert.match(md, /structure beats/i);
});
```

- [ ] **Step 2: Run to verify failure**, then **Step 3: Write `skills/map-ontology/SKILL.md`**

```markdown
---
name: map-ontology
version: 0.2.0
description: Derive a foreign corpus's implicit ontology and map it onto the semantic kernel — reuse existing types where they fit, propose namespaced extensions with maps_to_core where they don't, and emit a crosswalk. How external knowledge bases join without being shoehorned.
framework: toolkit-framework
agnostic: true
---

# map-ontology

Run BEFORE bulk-ingesting any source with its own type system (an external KB,
a protocol document, an app's data model). The kernel is align-and-map, never
conform-or-reject (`architecture/ontology-posture.md`).

## Steps

1. **Survey the corpus.** List the kinds of things it talks about (its implicit
   entity types), the relationships it draws, and its vocabulary for states/
   maturity. 10–30 minutes of reading before any mapping.
2. **Map each foreign type** against the kernel, in order of preference:
   a. **Direct fit** → an existing core/extension type (check
      `schemas/{core,extension}-entities.yaml`; `list-schemas` for entry forms).
   b. **Near fit** → existing type + the foreign name recorded in `notes`/tags.
   c. **Genuinely new** → propose a namespaced extension:
      `<source-slug>/<type-name>` with a REQUIRED `maps_to_core` to the nearest
      core type. Verify with `federate check` semantics: no maps_to_core = not
      interoperable.
3. **Map the state vocabulary** to K1's three axes (maturity / public_use /
   lifecycle_state). Foreign ladders crosswalk; they don't replace (R1).
4. **Emit the crosswalk file** `crosswalks/<source-slug>.yaml`:

   ```yaml
   source: <source-slug>          # matches the source-system card
   version: 0.1.0
   types:
     <foreign-type>: { to: <kernel-type>, via: direct|near|extension, notes: … }
   states:
     <foreign-state>: { axis: maturity, to: <k1-value> }
   ```

5. **Proposed extensions are candidates too** — emit an `update-proposal`
   candidate (governed Layer-A/B change process, `process/ontology-change-process.md`),
   never edit `schemas/extension-entities.yaml` unilaterally.
6. **Report** to the operator: N direct, M near, K proposed extensions, plus
   anything that resisted mapping (that residue is ontology feedback — Loop 2).

## First real cases

Gen Brasil Commons (conflict-mediation protocol → likely extension under
`gen-brasil/…` mapping to `resource`/`option-entry`) · Proof of Coordination
(Durgadas) · Koi's two Portuguese apps (services / digital-tools analyses).
```

- [ ] **Step 4: Append to `skills/csis-review/SKILL.md`** (after its existing final section):

```markdown
## Mode: frame-language-audit

Durgadas (2026-07-02): Frame-1 terms make a thing *structurally* not
regenerative — "it seems like a semantic point, but it's really a structural
point… when intention and structure diverge, **structure beats intention 100%
of the time**." This mode audits language as structure, per CSIS's
informed-not-conformant posture (R7).

**Scope:** any doc set — site pages, framework docs, the master doc, KB objects.

1. **Scan** for Frame-1 markers: *governance, accountability, compliance,
   enforcement, stakeholder, incentivize, capture (of value), leverage,
   scale (as verb), best practice, human resources* — and power-over phrasings
   ("ensure members comply", "hold contributors accountable").
2. **For each hit, judge structurally, not lexically:** does the surrounding
   mechanism actually create hierarchy/extraction, or is it a loose word on a
   sound structure? Only the first is a finding; the second is a wording note.
3. **Propose the regenerative reframe** with the mechanism named: e.g.
   "governance options" → "coordination agreements / decision-making patterns";
   "accountability" → "reciprocity + visible provenance"; "enforce" →
   "make structurally impossible or visibly divergent".
4. **Report** as a table (term · location · structural? · proposed reframe ·
   owner) and emit `signal` candidates for structural findings. Master-doc
   findings batch as draft-and-present proposals (Loop 2) — never edit it.
5. **First exercise targets:** the framework package's own docs + the two site
   pages (`/framework`, `/regen-toolkit-os`) — per the 2026-07-02 action item.
```

- [ ] **Step 5: Run** `npm test` — all green. **Step 6: Commit**

```bash
git add skills/map-ontology/ skills/csis-review/SKILL.md test/skills.test.mjs
git commit -m "feat(toolkit-framework): map-ontology skill + csis-review frame-language-audit mode

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**WAVE 1A DONE — the machine is deep: 7 skills, 3 adapters, review + replication + federation.**

---

## WAVE 1B — Consolidation + extraction (Sunday)

## Task 15: Fold `framework/` analysis docs into the package

**Files:**
- Move (git mv): `REPO:framework/{COVERAGE,GAPS,RECONCILIATIONS,FEEDBACK-LOOPS,PLACEMENT,SEPARATION}.md` → `docs/meta/`
- Rewrite: `REPO:framework/README.md` (pointer only)

- [ ] **Step 1: Move with history**

```bash
cd ../..   # worktree repo root
mkdir -p packages/toolkit-framework/docs/meta
for f in COVERAGE GAPS RECONCILIATIONS FEEDBACK-LOOPS PLACEMENT SEPARATION; do
  git mv "framework/$f.md" "packages/toolkit-framework/docs/meta/$f.md"
done
```

- [ ] **Step 2: Fix relative links inside the moved files** — they reference `../docs/plans/...` and `framework/...`; from their new home the repo docs live at `../../../../docs/`. Search and fix:

```bash
grep -n "](\.\./docs/plans" packages/toolkit-framework/docs/meta/*.md
# for each hit: ../docs/plans/… → ../../../../docs/plans/…
grep -n "](framework/" packages/toolkit-framework/docs/meta/*.md
# for each hit: framework/X.md → ./X.md
```

(Do the replacements with your editor/Edit tool, verify with a second grep that both patterns return nothing.)

- [ ] **Step 3: Rewrite `REPO:framework/README.md`** as a pointer:

```markdown
# Framework → moved into the package

The framework's home is **[`packages/toolkit-framework`](../packages/toolkit-framework/)** —
the adoptable package (schemas · semantic kernel · pipeline · skills · CLI).
Since 0.2.0 the package is fully self-describing: the analysis/meta docs that
lived here (COVERAGE, GAPS, RECONCILIATIONS, FEEDBACK-LOOPS, PLACEMENT,
SEPARATION) moved to
[`packages/toolkit-framework/docs/meta/`](../packages/toolkit-framework/docs/meta/).

- Adopt the framework: [`packages/toolkit-framework/README.md`](../packages/toolkit-framework/README.md)
- Try it in 5 minutes: [`docs/GETTING-STARTED.md`](../packages/toolkit-framework/docs/GETTING-STARTED.md)
- Build plan + design spec: [`docs/plans/framework-build/`](../docs/plans/framework-build/)
```

- [ ] **Step 4: Update the KB index doc** `packages/toolkit-framework/docs/README.md` — add a "meta" row pointing at `docs/meta/` (one line in its map/table, matching its existing style).

- [ ] **Step 5: Commit**

```bash
git add framework/README.md packages/toolkit-framework/docs/
git commit -m "docs(framework): fold analysis docs into the package (docs/meta) — the package is self-describing

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: GETTING-STARTED rewrite + READMEs

**Files:**
- Rewrite: `docs/GETTING-STARTED.md` (package dir)
- Modify: `README.md` (package dir — add the machine section + verb table)

- [ ] **Step 1: Rewrite `docs/GETTING-STARTED.md`** around the machine (keep the existing "real CLI output" spirit — run every command and paste real output):

Structure (write with real outputs from your worktree):

```markdown
# Getting started — 10 minutes to a working knowledge base

## 1. Get the framework            (degit/clone one-liner — filled in Task 17)
## 2. Replicate: `init`            (--new and --existing, what gets stamped, kms.yaml)
## 3. Ingest: prepare → skill → accept   (the work-order loop, candidate format, the gate's error notes as retry instructions)
## 4. Store: pick your seam        (kb-folder vs repo-data vs geo-stub — one paragraph each + when to choose which)
## 5. Review: the human gate       (review list / promote --reviewer; why ai_assisted clears)
## 6. Federate: the handshake      (self card → federate add → federate check)
## 7. Where agents fit             (the 7 skills, one line each; agents never write storage)
```

- [ ] **Step 2: Update the package `README.md`** — add after the existing intro: a "The machine (0.2)" section with the pipeline diagram from the spec (§5, compressed), the CLI verb table (all verbs incl. the new six), and the three-seam summary. Keep the existing adoption-front-door tone.

- [ ] **Step 3: Verify all documented commands actually run** — execute each command block in the rewritten docs against a scratch dir; paste real output. Any command that errors = fix the doc or the code before committing.

- [ ] **Step 4: Commit**

```bash
git add docs/GETTING-STARTED.md README.md
git commit -m "docs(toolkit-framework): GETTING-STARTED + README for the 0.2 machine — every command real

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Extraction — publish script + public repo + consume-path smoke test

**Files:**
- Create: `REPO:scripts/publish-framework.sh`

⚠️ **This task publishes to a public GitHub repo — CONFIRM WITH THE OPERATOR before the first `gh repo create` / `git push`** (authorized by spec §2 d5, but pause at the outward-facing step).

- [ ] **Step 1: Write the publish script** (one-way mirror; the monorepo stays the dev home):

```bash
#!/usr/bin/env bash
# scripts/publish-framework.sh — one-way publish of packages/toolkit-framework
# to the public standalone repo. The monorepo is the dev home; the public repo
# is the consumption point (spec §2 d5). Usage: scripts/publish-framework.sh [remote-url]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$REPO_ROOT/packages/toolkit-framework"
REMOTE="${1:-git@github.com:luizfernandosg/toolkit-framework.git}"
STAGE="$(mktemp -d)/toolkit-framework"

git clone --depth 1 "$REMOTE" "$STAGE" 2>/dev/null || { mkdir -p "$STAGE"; git -C "$STAGE" init -b main; git -C "$STAGE" remote add origin "$REMOTE"; }
rsync -a --delete --exclude node_modules --exclude .git "$PKG/" "$STAGE/"
SHA="$(git -C "$REPO_ROOT" rev-parse --short HEAD)"
git -C "$STAGE" add -A
git -C "$STAGE" commit -m "publish: sync from regen-toolkit@$SHA" || { echo "nothing to publish"; exit 0; }
git -C "$STAGE" push -u origin main
echo "published → $REMOTE (from $SHA)"
```

```bash
chmod +x scripts/publish-framework.sh
```

- [ ] **Step 2: Create the public repo** (⚠️ operator confirmation checkpoint — show this command and wait for a yes):

```bash
gh repo create luizfernandosg/toolkit-framework --public \
  --description "Regen Knowledge Commons Toolkit framework — portable, agent-native knowledge-commons machine (schemas · semantic kernel · ingestion pipeline · storage adapters · skills). @regen-commons scope reserved."
```

- [ ] **Step 3: Publish**

```bash
scripts/publish-framework.sh
```

Expected: `published → git@github.com:luizfernandosg/toolkit-framework.git (from <sha>)`.

- [ ] **Step 4: Smoke-test the consume path** (this is DoD #1's front half — a fresh consumer):

```bash
cd "$(mktemp -d)"
npx degit luizfernandosg/toolkit-framework tf && cd tf
npm install
npm test                                   # full suite green OUTSIDE the monorepo
node src/cli.mjs init /tmp/smoke-kb --name smoke
node src/cli.mjs list-schemas | head -5
```

Expected: tests all green; `✓ instance "smoke" initialized`. If `npm test` fails outside the monorepo, fix the package (likely a path assumption) before proceeding.

- [ ] **Step 5: Fill the degit one-liner into `docs/GETTING-STARTED.md` §1** (left open in Task 16), re-publish (`scripts/publish-framework.sh`), and commit the script + doc:

```bash
cd <worktree-repo-root>
git add scripts/publish-framework.sh packages/toolkit-framework/docs/GETTING-STARTED.md
git commit -m "feat(framework): publish script + public repo — the framework has an address

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 18: Version 0.2.0, full verify, tag, merge back

**Files:**
- Modify: `package.json` (version), `docs/meta/GAPS.md` (status refresh)

- [ ] **Step 1: Bump** — `package.json` `"version": "0.2.0"` (the cli version test is semver-generic; no test change).

- [ ] **Step 2: Refresh `docs/meta/GAPS.md`** — update section (c): the 3 flagship skills are now 7 and exercised by the real slice; the lift ETL is one source type of a general pipeline; `org-os-kms` remains scaffold (week 1, against the ReFi DAO adoption). 5–10 lines of edits, honest status only.

- [ ] **Step 3: Full verification** (superpowers:verification-before-completion):

```bash
cd packages/toolkit-framework
npm test                                    # expect: ~66+ tests, 0 fail
node src/cli.mjs kernel-check               # ✓
node src/cli.mjs list-schemas | wc -l       # 22
cd ../.. && node packages/toolkit-framework/src/cli.mjs kb index --target kb   # the real slice's KB
```

- [ ] **Step 4: Commit + tag + publish the final state**

```bash
git add packages/toolkit-framework/package.json packages/toolkit-framework/docs/meta/GAPS.md
git commit -m "chore(toolkit-framework): 0.2.0 — the machine iteration (pipeline, adapters, 7 skills, replication, federation)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git tag toolkit-framework-v0.2.0
scripts/publish-framework.sh
```

- [ ] **Step 5: Merge back** — use superpowers:finishing-a-development-branch: merge `framework-machine-0.2` → `regen-toolkit-os` (no PR needed — same-branch lane), delete the worktree afterwards (`git worktree remove ../regen-toolkit-machine`). NEVER stash/clean during the merge (vault safety).

**🏁 MACHINE DoD MET (spec §9):** vertical slice + machine depth complete, tests green, extracted, tagged 0.2.0. Week 1 (toolkit self-ingestion + ReFi DAO + org-os-kms + site ingestion view) is the next plan.

---

## Self-review notes (already applied)

- **Spec coverage:** §3 architecture → Tasks 1–5, 8–9; §4 skills → Tasks 6, 11, 14; §5 pipeline → Tasks 2, 4, 5, 7; §6 storage/consolidation/extraction → Tasks 3, 8, 9, 15–17; §6a replication/federation → Tasks 12–13; §7 error handling → woven through Tasks 1, 3, 4, 10; §8 testing → every task + Tasks 7/8 (integration + contract suites). NOT in this plan (deliberately — week 1 per revised timeline): org-os-kms real module, site ingestion view, toolkit self-ingestion corpus, ReFi DAO drop-in.
- **Type consistency locked:** `{ schema, object }` candidate format everywhere; adapter contract `{ name, store, list, update, index, writeIndex }`; refs are strings (path or `path#slug`); `prepare({ path, workOrdersDir })`; `acceptWorkOrder({ workOrdersDir, id })`; K1 field names `maturity`/`public_use`/`lifecycle_state`/`ai_assisted`/`high_risk`.
- **Known intentional choices:** born-rule enforcement keys on the schema carrying a `maturity` field (KB-content vs mixin schemas); `ai_assisted` clears on human review (matches `checkInvariants` as built — provenance.authorship preserves the AI history); repo-data writes `data/kb/`, never an instance's existing `data/*.yaml` (kms bridges later); test counts after each task are approximate guides, "all green" is the requirement.
```
