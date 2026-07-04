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
