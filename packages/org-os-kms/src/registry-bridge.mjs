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
