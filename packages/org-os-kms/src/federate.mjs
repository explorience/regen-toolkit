// src/federate.mjs
// Federation wrapper. Delegates peer registration + fork-compat to the framework
// (federateAdd/federateCheck) and adds two org-os-kms concerns: the RegenOS namespace, and
// a contribute() that is DRAFT-ONLY — cross-repo contribute-back is always draft-and-present.
import { readFileSync, existsSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import yaml from 'js-yaml';
import * as fw from './framework.mjs';

export const NAMESPACE = 'RegenOS';

export function addPeer({ dir, cardPath }) {
  const res = fw.federateAdd({ dir, cardPath }); // { slug, ref }; writes peers[slug] into kms.yaml
  return { ...res, namespace: NAMESPACE };
}

export function checkPeers(ctx) {
  const cfg = ctx.config || fw.loadConfig(ctx.dir);
  const peers = (cfg && cfg.peers) || {};
  const results = [];
  for (const [slug] of Object.entries(peers)) {
    const ext = cfg.peer_extensions && cfg.peer_extensions[slug];
    const extAbs = ext ? join(ctx.dir, ext) : null;
    if (extAbs && existsSync(extAbs)) {
      results.push({ slug, ...fw.federateCheck({ extensionsPath: extAbs }) });
    } else {
      results.push({ slug, skipped: 'no extensions file registered (kms.yaml peer_extensions)' });
    }
  }
  return { ok: true, report: { namespace: NAMESPACE, peers: results } };
}

function readCard(absFile, ref) {
  if (!existsSync(absFile)) return null;
  const doc = yaml.load(readFileSync(absFile, 'utf8')) || {};
  const slug = ref.split('#').pop();
  return (doc.entries || {})[slug] || null;
}

export function contribute({ dir, slug, records = [] }) {
  const cfg = fw.loadConfig(dir);
  const ref = cfg && cfg.peers && cfg.peers[slug];
  if (!ref) throw new Error(`unknown peer: ${slug}`);
  const [file] = ref.split('#');
  const cardPath = isAbsolute(file) ? file : join(dir, file); // refs may be absolute or dir-relative
  const card = readCard(cardPath, ref);
  const returnPath = (card && card.return_path) || '(unknown return_path)';
  // draft-and-present: return the plan; a human approves the actual cross-repo hand-off.
  return { applied: false, draft: { peer: slug, namespace: NAMESPACE, return_path: returnPath, records } };
}
