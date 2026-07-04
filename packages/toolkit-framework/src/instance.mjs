// src/instance.mjs — replication (design spec §6a): one command from empty dir
// (or existing content) to a working, ingestable, federation-ready KB instance.
//
// Design note (self-card placement): the self source-system card is stored
// THROUGH the storage adapter (adapter.store + writeIndex), not as a loose file
// at kb/self.source-system.yaml. The kb-folder adapter's list()/index() only
// see objects/<schema>/*.yaml — a loose file would be invisible to `kb index`
// and to review/promote, i.e. the instance would NOT actually be a federation
// citizen from the adapter's point of view. Storing via the adapter means the
// card is real inventory from birth (kb index → total 1) and the instance
// remembers where it lives via kms.yaml's `self_ref`.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import yaml from 'js-yaml';
import { prepare } from './ingest.mjs';
import { getAdapter } from './storage.mjs';

export function loadConfig(dir = '.') {
  const p = join(dir, 'kms.yaml');
  return existsSync(p) ? yaml.load(readFileSync(p, 'utf8')) : null;
}

export function initInstance({ dir, name = null, mode = 'new', existingPath = null, adapter = 'kb-folder', target = 'kb' }) {
  const instance = name || basename(resolve(dir));
  mkdirSync(join(dir, target), { recursive: true });
  mkdirSync(join(dir, '.workorders'), { recursive: true });

  const cfgPath = join(dir, 'kms.yaml');
  // Idempotent: a config already means this instance was stamped before — never
  // re-stamp the self card or clobber the existing kms.yaml.
  if (!existsSync(cfgPath)) {
    const card = {
      title: instance, type: 'repo', steward: instance,
      return_path: 'unset — complete via the register-source skill',
      maturity: 'raw', lifecycle_state: 'raw-lead', ai_assisted: true,
      notes: 'Self card created by init. Complete steward, return_path, reuse_conditions, how_to_credit before federating.',
    };
    const a = getAdapter(adapter);
    const targetPath = join(dir, target);
    const { stored } = a.store(targetPath, [{ schema: 'source-system', object: card }]);
    a.writeIndex(targetPath);
    const [selfRef] = stored;

    writeFileSync(cfgPath, yaml.dump({
      instance, adapter, target,
      self_ref: selfRef,
      source_registry: `${target}/federation`,
      framework: '@regen-commons/toolkit-framework',
    }));
  }

  let workOrders = 0;
  if (mode === 'existing') {
    if (!existingPath) throw new Error('init --existing requires a content path');
    workOrders = prepare({ path: existingPath, workOrdersDir: join(dir, '.workorders') }).created.length;
  }
  return { instance, dir, workOrders };
}
