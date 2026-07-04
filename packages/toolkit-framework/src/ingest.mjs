// src/ingest.mjs — both ends of seam 1's CLI side: `prepare` sends work out
// (classify → chunk → emit idempotent work orders) and `acceptWorkOrder` takes
// results back in (validate candidates, stamp lineage, atomic accept). The
// semantic half between the two is the agent's (skills/ingest).
import {
  readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync, renameSync,
} from 'node:fs';
import { join, extname, relative } from 'node:path';
import yaml from 'js-yaml';
import {
  makeWorkOrder, saveWorkOrder, loadWorkOrders, loadWorkOrder, transition,
} from './workorder.mjs';
import { validateObject, checkInvariants, listSchemas, loadSchema, schemaFields } from './index.mjs';

const CHUNK_MAX = 24000; // chars — best-effort split at heading, then paragraph boundaries; keeps one work order comfortably in an agent's working set
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

/** Split oversized markdown at `## ` boundaries, falling back to paragraph
 * boundaries when a single section alone exceeds max; returns [{ text, chunk }]
 * (chunk null when whole). Lossless: parts rejoin to the original content. */
export function chunkContent(content, max = CHUNK_MAX) {
  if (content.length <= max) return [{ text: content, chunk: null }];
  // Heading split first; any section still over max is re-split at paragraph
  // boundaries (after a blank-line run — lookaround keeps separators, so the
  // pieces rejoin losslessly). A single paragraph over max stays whole.
  const sections = content
    .split(/(?=\n## )/)
    .flatMap((s) => (s.length > max ? s.split(/(?<=\n\n)(?!\n)/) : [s]));
  const parts = [];
  let buf = '';
  for (const s of sections) {
    if (buf && buf.length + s.length > max) { parts.push(buf); buf = ''; }
    buf += s;
  }
  if (buf) parts.push(buf);
  if (parts.length === 1) return [{ text: parts[0], chunk: null }];
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

/** Load an order's candidate files: .workorders/<id>/candidates/*.yaml, each { schema, object }.
 * Keys are picked EXPLICITLY (never spread) so a candidate document cannot inject
 * `file` (path traversal) or `parse_error` — the agent controls only schema + object.
 * A file that fails to parse comes back as { file, parse_error } — never throws,
 * so the accept gate can turn agent-written garbage into error_notes, not a crash. */
export function loadCandidates(workOrdersDir, id) {
  const dir = join(workOrdersDir, id, 'candidates');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.yaml')).map((file) => {
    try {
      const doc = yaml.load(readFileSync(join(dir, file), 'utf8'));
      return { file, schema: doc?.schema, object: doc?.object };
    } catch (e) {
      return { file, parse_error: e.message };
    }
  });
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
  // Candidates may only target entry/mixin schemas — structural schemas
  // (core-entities, kernel-profile, …) have no `fields` and would validate
  // vacuously; work-order is pipeline state; frontmatter is the abstract base.
  const all = new Set(listSchemas());
  const known = new Set(listSchemas().filter((n) => {
    if (n === 'work-order' || n === 'frontmatter') return false; // pipeline state / abstract base
    const s = loadSchema(n);
    return Boolean(s.fields && Object.keys(s.fields).length);    // entry/mixin schemas only
  }));
  for (const c of candidates) {
    const where = (msg) => `${c.file}: ${msg}`;
    if (c.parse_error) { errors.push(where(`invalid YAML — ${c.parse_error}`)); continue; }
    if (!c.schema || !all.has(c.schema)) { errors.push(where(`unknown schema "${c.schema}"`)); continue; }
    if (!known.has(c.schema)) { errors.push(where(`not an ingestible schema "${c.schema}"`)); continue; }
    if (!c.object || typeof c.object !== 'object') { errors.push(where('missing object')); continue; }
    const v = validateObject(c.schema, c.object);
    if (!v.valid) errors.push(...v.errors.map(where));
    const inv = checkInvariants(c.object);
    if (!inv.ok) errors.push(...inv.violations.map(where));
    if ('maturity' in schemaFields(c.schema)) { // KB-content schema → born-rules
      if (c.object.ai_assisted !== true) errors.push(where('agent-produced objects must set ai_assisted: true'));
      if (c.object.maturity !== 'raw') errors.push(where('maturity must be "raw" at accept — promotion is review-promote\'s job'));
      if (!c.object.provenance?.origin) errors.push(where('provenance.origin is required (Principle 1)'));
    }
  }
  if (errors.length) {
    saveWorkOrder(workOrdersDir, { ...wo, error_notes: errors.join('\n') });
    return { accepted: false, errors, objects: [] };
  }

  const acceptedDir = join(workOrdersDir, id, 'accepted');
  mkdirSync(acceptedDir, { recursive: true });
  const objects = [];
  for (const c of candidates) {
    // The agent MAY refine source_lineage (e.g. per-chunk page/section refs);
    // work_order is the tamper-proof link back to the order the CLI stamps itself.
    const object = { ...c.object, work_order: id, source_lineage: c.object.source_lineage || wo.source_path };
    writeFileSync(join(acceptedDir, c.file), yaml.dump({ schema: c.schema, object }));
    renameSync(join(workOrdersDir, id, 'candidates', c.file), join(workOrdersDir, id, 'candidates', `.${c.file}.done`));
    objects.push({ schema: c.schema, object });
  }
  // Strip stale error_notes from earlier failed attempts — the accepted order is clean.
  const { error_notes: _stale, ...clean } = wo;
  saveWorkOrder(workOrdersDir, transition(clean, 'accepted'));
  return { accepted: true, errors: [], objects };
}
