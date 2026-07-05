// src/federate.mjs
// Federation wrapper. Delegates peer registration + fork-compat to the framework
// (federateAdd/federateCheck) and adds two org-os-kms concerns: the RegenOS namespace, and
// a contribute() that is DRAFT-ONLY — cross-repo contribute-back is always draft-and-present.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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
    // peer_extensions is operator-supplied in kms.yaml; absent → we skip fork-compat for that peer.
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

export function contribute({ dir, slug, records = [] }) {
  const cfg = fw.loadConfig(dir);
  const ref = cfg && cfg.peers && cfg.peers[slug];
  if (!ref) throw new Error(`unknown peer: ${slug}`);
  // Look the card up via the adapter — refs are adapter-opaque; never parse them as paths.
  // Enumerate the same target federateAdd stored at (join(dir, target)) so list()'s refs are
  // identical to the stored peers[slug] ref (adapter contract). In production target === '.'
  // and dir is the instance root, so this equals cfg.target.
  const found = fw.getAdapter(cfg.adapter).list(join(dir, cfg.target)).find((e) => e.ref === ref);
  const returnPath = (found && found.object && found.object.return_path) || '(unknown return_path)';
  // draft-and-present: return the plan; a human approves the actual cross-repo hand-off.
  return { applied: false, draft: { peer: slug, namespace: NAMESPACE, return_path: returnPath, records } };
}
