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
