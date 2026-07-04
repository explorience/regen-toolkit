// src/instance.mjs — replication (design spec §6a): one command from empty dir
// (or existing content) to a working, ingestable, federation-ready KB instance.
//
// Design note (self-card placement): the self source-system card is stored
// THROUGH the storage adapter (adapter.store + writeIndex), not as a loose file
// at kb/self.source-system.yaml. The kb-folder adapter's list()/index() only
// see objects/<schema>/*.yaml — a loose file would be invisible to `kb index`
// and to review/promote, i.e. the instance would NOT actually be a federation
// citizen from the adapter's point of view. Storing via the adapter means the
// card is real inventory from birth (kb index → total 1).
//
// Design note (self_ref is adapter-opaque, NOT a path): refs are adapter-opaque
// tokens (storage.mjs contract — kb-folder issues file paths, repo-data issues
// `<file>#<slug>`). kms.yaml's `self_ref` stores that ref EXACTLY as the adapter
// issued it. Never parse it, join() it against `dir`, or resolve it as a path
// outside the adapter. Card PRESENCE/staleness is decided by asking the adapter
// itself (findSelfCard, below) — never by existsSync on a derived path, which
// broke under adapters whose refs aren't filesystem paths (e.g. repo-data).
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import yaml from 'js-yaml';
import { prepare } from './ingest.mjs';
import { getAdapter } from './storage.mjs';
import { validateObject } from './index.mjs';

export function loadConfig(dir = '.') {
  const p = join(dir, 'kms.yaml');
  if (!existsSync(p)) return null;
  try {
    return yaml.load(readFileSync(p, 'utf8'));
  } catch (e) {
    if (e instanceof yaml.YAMLException) {
      throw new Error(`kms.yaml is not valid YAML (fix or remove it): ${p} — ${e.message}`);
    }
    throw e;
  }
}

/**
 * Adapter-agnostic self-card lookup: is this instance's own source-system card
 * present in the adapter's inventory? Matches on the object itself (schema +
 * title) via the adapter's list() — never by resolving a ref as a path, since
 * refs are opaque and not all adapters issue filesystem paths (repo-data).
 */
function findSelfCard(adapter, targetDir, instance) {
  return adapter.list(targetDir).find((e) => e.schema === 'source-system' && e.object.title === instance) || null;
}

export function initInstance({ dir, name = null, mode = 'new', existingPath = null, adapter = 'kb-folder', target = 'kb' }) {
  // An existing kms.yaml is the instance's identity — re-init never renames it.
  const cfg = loadConfig(dir);
  const instance = cfg?.instance || name || basename(resolve(dir));
  const useAdapter = cfg?.adapter || adapter;
  const useTarget = cfg?.target || target;
  mkdirSync(join(dir, useTarget), { recursive: true });
  mkdirSync(join(dir, '.workorders'), { recursive: true });

  const a = getAdapter(useAdapter);
  const targetPath = join(dir, useTarget);
  // Presence is decided adapter-agnostically (see design note above) — a truly
  // missing self card gets healed (re-stamped); a merely moved/renamed one is
  // found by the adapter's own list() and self_ref is repointed, not duplicated.
  const found = findSelfCard(a, targetPath, instance);

  if (!found) {
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

    const { stored } = a.store(targetPath, [{ schema: 'source-system', object: card }]);
    a.writeIndex(targetPath);
    const selfRef = stored[0]; // adapter-opaque — stored VERBATIM, never relative()'d or joined

    if (!cfg) {
      writeFileSync(join(dir, 'kms.yaml'), yaml.dump({
        instance, adapter: useAdapter, target: useTarget,
        self_ref: selfRef,
        source_registry: `${useTarget}/federation`,
        framework: '@regen-commons/toolkit-framework',
      }));
    } else if (cfg.self_ref !== selfRef) {
      // Heal re-stamped the missing card: update ONLY self_ref — every other
      // config key stays exactly as the operator left it.
      writeFileSync(join(dir, 'kms.yaml'), yaml.dump({ ...cfg, self_ref: selfRef }));
    }
  } else if (cfg && cfg.self_ref !== found.ref) {
    // The card exists (the adapter says so) but self_ref is stale — moved,
    // renamed, or a legacy/relative-path ref from an older kms.yaml. Repoint to
    // whatever the adapter issues NOW, verbatim — do not re-stamp a duplicate.
    writeFileSync(join(dir, 'kms.yaml'), yaml.dump({ ...cfg, self_ref: found.ref }));
  }

  let workOrders = 0;
  if (mode === 'existing') {
    if (!existingPath) throw new Error('init --existing requires a content path');
    workOrders = prepare({ path: existingPath, workOrdersDir: join(dir, '.workorders') }).created.length;
  }
  return { instance, dir, workOrders };
}
