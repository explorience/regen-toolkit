// src/adapters/kb-folder.mjs — the portable KB target: a self-contained folder
// (objects/ + derived index.json + context.jsonld). Repo-agnostic, syncable,
// graph-exportable. An adopter can point an ingestion at a bare directory.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { slugify } from '../util.mjs';
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
      if (!statSync(dir).isDirectory()) continue;
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
