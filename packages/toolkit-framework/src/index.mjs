// @regen-commons/toolkit-framework — programmatic API.
// Zero-build ESM so the framework is adoptable in any context with no compile step.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const here = dirname(fileURLToPath(import.meta.url));
export const SCHEMA_DIR = join(here, '..', 'schemas');

const _cache = new Map();

/** Load a schema YAML by name (without extension), cached. */
export function loadSchema(name) {
  if (_cache.has(name)) return _cache.get(name);
  const path = join(SCHEMA_DIR, `${name}.yaml`);
  if (!existsSync(path)) throw new Error(`schema not found: ${name} (${path})`);
  const doc = yaml.load(readFileSync(path, 'utf8'));
  _cache.set(name, doc);
  return doc;
}

/** List available schema names. */
export function listSchemas() {
  if (!existsSync(SCHEMA_DIR)) return [];
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => f.replace(/\.yaml$/, ''))
    .sort();
}

/** Is `value` a member of `axis` in the canonical state model (K1)? */
export function isValid(axis, value) {
  const s = loadSchema('review-maturity');
  const a = s.axes?.[axis];
  return !!a && Array.isArray(a.values) && a.values.includes(value);
}

// --- object-schema validation (K2/K3/K5 etc.) ---

function collectFields(schema) {
  const inherited = schema.extends ? collectFields(loadSchema(schema.extends)) : {};
  return { ...inherited, ...(schema.fields || {}) };
}

function collectRequired(schema) {
  const inherited = schema.extends ? collectRequired(loadSchema(schema.extends)) : [];
  return [...new Set([...inherited, ...(schema.required || [])])];
}

/**
 * Validate a plain object against an object-schema (`required` + `fields`, with `extends`).
 * Extra fields are allowed (the model is open/extensible per Principle 11). A field def may
 * carry `enum: [...]` or `axis: <K1 axis>` (validated against the canonical state model).
 * Returns { valid, errors }.
 */
export function validateObject(schemaName, obj) {
  const schema = loadSchema(schemaName);
  const fields = collectFields(schema);
  const required = collectRequired(schema);
  const errors = [];
  for (const r of required) {
    if (obj[r] === undefined || obj[r] === null || obj[r] === '') errors.push(`missing required field: ${r}`);
  }
  for (const [k, v] of Object.entries(obj)) {
    const def = fields[k];
    if (!def) continue; // unknown fields permitted (open model)
    if (def.enum && !def.enum.includes(v)) errors.push(`invalid value for "${k}": ${JSON.stringify(v)}`);
    if (def.axis && !isValid(def.axis, v)) errors.push(`invalid ${def.axis} for "${k}": ${JSON.stringify(v)}`);
  }
  return { valid: errors.length === 0, errors };
}
