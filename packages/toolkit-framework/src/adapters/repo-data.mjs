// src/adapters/repo-data.mjs — the org-os instance target: per-schema registry
// files under data/kb/. Deliberately does NOT touch an instance's existing
// data/*.yaml (different shapes); @org-os/kms bridges the two.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { slugify, deriveIndex } from '../util.mjs';
import { hashContent } from '../workorder.mjs';
import { toJsonLdContext } from '../index.mjs';

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

function slugFor(object) {
  return slugify(object.title || object.id || '') || `untitled-${hashContent(yaml.dump(object)).slice(0, 8)}`;
}

const fileFor = (target, schema) => join(target, 'data', 'kb', `${safeSchema(schema)}.yaml`);
// normalize: a hand-edited/legacy file without an `entries:` key must not crash store/update
const loadFile = (p) => {
  const doc = (existsSync(p) ? yaml.load(readFileSync(p, 'utf8')) : null) || {};
  return { ...doc, entries: doc.entries || {} };
};

export const repoDataAdapter = {
  name: 'repo-data',

  store(target, entries) {
    const stored = [];
    const byFile = new Map();
    for (const { schema, object } of entries) {
      const p = fileFor(target, schema);
      if (!byFile.has(p)) byFile.set(p, loadFile(p));
      const slug = slugFor(object);
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
    return deriveIndex(this.list(target), 'data/kb/');
  },

  writeIndex(target) {
    const indexPath = join(target, 'data', 'kb', 'index.json');
    const contextPath = join(target, 'data', 'kb', 'context.jsonld');
    atomicWrite(indexPath, JSON.stringify(this.index(target), null, 2));
    atomicWrite(contextPath, JSON.stringify(toJsonLdContext(), null, 2));
    return { indexPath, contextPath };
  },
};
