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
// remembers where it lives via kms.yaml's `self_ref` — recorded dir-RELATIVE
// (portable: instance dirs move, clone/degit paths differ) and resolved on use.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, resolve, relative, isAbsolute } from 'node:path';
import yaml from 'js-yaml';
import { prepare } from './ingest.mjs';
import { getAdapter } from './storage.mjs';
import { validateObject } from './index.mjs';

export function loadConfig(dir = '.') {
  const p = join(dir, 'kms.yaml');
  return existsSync(p) ? yaml.load(readFileSync(p, 'utf8')) : null;
}

export function initInstance({ dir, name = null, mode = 'new', existingPath = null, adapter = 'kb-folder', target = 'kb' }) {
  // An existing kms.yaml is the instance's identity — re-init never renames it.
  const cfg = loadConfig(dir);
  const instance = cfg?.instance || name || basename(resolve(dir));
  const useAdapter = cfg?.adapter || adapter;
  const useTarget = cfg?.target || target;
  mkdirSync(join(dir, useTarget), { recursive: true });
  mkdirSync(join(dir, '.workorders'), { recursive: true });

  // The card stamp is gated on the CARD's resolvability, not on kms.yaml alone —
  // a deleted self card gets healed on re-run (self_ref must always resolve).
  // Tolerate a legacy absolute self_ref on read; we always WRITE relative.
  const selfPath = cfg?.self_ref ? (isAbsolute(cfg.self_ref) ? cfg.self_ref : join(dir, cfg.self_ref)) : null;
  const cardPresent = Boolean(selfPath && existsSync(selfPath));

  if (!cfg || !cardPresent) {
    // Born a federation citizen: the instance's own source-system card (draft —
    // the operator completes steward/return_path via the register-source skill).
    const card = {
      title: instance, type: 'repo', steward: instance,
      return_path: 'unset — complete via the register-source skill',
      maturity: 'raw', lifecycle_state: 'raw-lead', ai_assisted: true,
      notes: 'Self card created by init. Complete steward, return_path, reuse_conditions, how_to_credit before federating.',
    };
    // Validate before persisting (same discipline as acceptWorkOrder) — schema
    // drift must fail loudly, not silently stamp invalid cards into every instance.
    const v = validateObject('source-system', card);
    if (!v.valid) throw new Error(`self card invalid — framework bug or schema drift:\n  - ${v.errors.join('\n  - ')}`);

    const a = getAdapter(useAdapter);
    const targetPath = join(dir, useTarget);
    const { stored } = a.store(targetPath, [{ schema: 'source-system', object: card }]);
    a.writeIndex(targetPath);
    const selfRef = relative(dir, stored[0]); // dir-relative: portable across moves

    if (!cfg) {
      writeFileSync(join(dir, 'kms.yaml'), yaml.dump({
        instance, adapter: useAdapter, target: useTarget,
        self_ref: selfRef,
        source_registry: `${useTarget}/federation`,
        framework: '@regen-commons/toolkit-framework',
      }));
    } else if (cfg.self_ref !== selfRef) {
      // Heal moved the card (or normalized a legacy absolute ref): update ONLY
      // self_ref — every other config key stays exactly as the operator left it.
      writeFileSync(join(dir, 'kms.yaml'), yaml.dump({ ...cfg, self_ref: selfRef }));
    }
  }

  let workOrders = 0;
  if (mode === 'existing') {
    if (!existingPath) throw new Error('init --existing requires a content path');
    workOrders = prepare({ path: existingPath, workOrdersDir: join(dir, '.workorders') }).created.length;
  }
  return { instance, dir, workOrders };
}
