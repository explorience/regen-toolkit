// src/storage.mjs — seam 2: ingestion ≠ storage. One interface, swappable targets.
//
// Adapter = {
//   name: string,
//   store(target, entries)      // entries: [{ schema, object }] → { stored: [ref] }; atomic per object; idempotent by slug(title)
//   list(target)                // → [{ schema, object, ref }]
//   update(target, ref, patch)  // shallow-merge patch into the stored object; atomic
//   index(target)               // → { total, by_type, by_maturity, review_queue, generated_from } — DERIVED, rebuildable
//   writeIndex(target)          // persist index.json + context.jsonld next to the objects → { indexPath, contextPath }
// }
import { kbFolderAdapter } from './adapters/kb-folder.mjs';
import { repoDataAdapter } from './adapters/repo-data.mjs';

const ADAPTERS = { 'kb-folder': kbFolderAdapter, 'repo-data': repoDataAdapter };

export function listAdapters() { return Object.keys(ADAPTERS); }

export function getAdapter(name) {
  const a = ADAPTERS[name];
  if (!a) throw new Error(`unknown storage adapter: ${name} (available: ${listAdapters().join(', ')})`);
  return a;
}

// deriveIndex lives in util.mjs (a leaf module) — see its docstring for why.
export { slugify, deriveIndex } from './util.mjs';
