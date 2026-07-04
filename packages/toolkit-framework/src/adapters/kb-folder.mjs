// src/adapters/kb-folder.mjs — the portable KB target: a self-contained folder
// (objects/ + derived index.json + context.jsonld). Repo-agnostic, syncable,
// graph-exportable. An adopter can point an ingestion at a bare directory.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { slugify, deriveIndex } from '../util.mjs';
import { toJsonLdContext } from '../index.mjs';
import { hashContent } from '../workorder.mjs';

function atomicWrite(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = join(dirname(path), `.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`);
  writeFileSync(tmp, text);
  renameSync(tmp, path);
}

function safeSchema(schema) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(String(schema))) throw new Error(`invalid schema name for storage: ${JSON.stringify(schema)}`);
  return schema;
}

function objectPath(target, schema, object) {
  const slug = slugify(object.title || object.id || '') || `untitled-${hashContent(yaml.dump(object)).slice(0, 8)}`;
  return join(target, 'objects', safeSchema(schema), `${slug}.yaml`);
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
    return deriveIndex(this.list(target), 'objects/');
  },

  writeIndex(target) {
    const indexPath = join(target, 'index.json');
    const contextPath = join(target, 'context.jsonld');
    atomicWrite(indexPath, JSON.stringify(this.index(target), null, 2));
    atomicWrite(contextPath, JSON.stringify(toJsonLdContext(), null, 2));
    return { indexPath, contextPath };
  },
};
