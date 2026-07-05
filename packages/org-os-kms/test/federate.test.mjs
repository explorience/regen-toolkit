import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { addPeer, checkPeers, contribute, NAMESPACE } from '../src/federate.mjs';
import * as fw from '../src/framework.mjs';

// initInstance writes kms.yaml + a self card; then register a peer card.
function initTmp() {
  const dir = mkdtempSync(join(tmpdir(), 'kms-fed-'));
  // target = dir (absolute): tests run from the package dir, so the adapter must be pointed
  // at the temp instance root, not the relative '.' the real repo uses (cwd == repo root).
  fw.initInstance({ dir, name: 'primary', adapter: 'repo-data', target: dir });
  return dir;
}

test('addPeer delegates to framework federateAdd and tags the RegenOS namespace', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'PRs welcome' }));
  const r = addPeer({ dir, cardPath });
  assert.ok(r.slug);
  assert.equal(r.namespace, NAMESPACE);
  const cfg = fw.loadConfig(dir);
  assert.ok(cfg.peers[r.slug], 'peer written to kms.yaml');
});

test('checkPeers reports under the RegenOS namespace (skips peers without an extensions file)', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'PRs' }));
  addPeer({ dir, cardPath });
  const out = checkPeers({ dir, config: fw.loadConfig(dir) });
  assert.equal(out.report.namespace, NAMESPACE);
  assert.equal(out.report.peers.length, 1);
  assert.match(out.report.peers[0].skipped || '', /no extensions/);
});

test('checkPeers delegates to federateCheck when a peer extensions file is registered (fork-compat branch)', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'PRs' }));
  const { slug } = addPeer({ dir, cardPath });

  // Peer-published extension set: one entity maps to a real core type (compatible),
  // one maps to a bogus core type (incompatible) — per isForkCompatible (maps_to_core must
  // resolve to a real core entity). Shape: { entities: { <name>: { maps_to_core } } }.
  const extPath = join(dir, 'peer-ext.yaml');
  writeFileSync(extPath, yaml.dump({
    entities: {
      'regen-practice': { maps_to_core: 'practice' }, // 'practice' is a real core type → compatible
      'floating-widget': { maps_to_core: 'not-a-core-type' }, // no such core type → incompatible
    },
  }));

  // Register the extensions file under kms.yaml peer_extensions (operator-supplied).
  const kmsPath = join(dir, 'kms.yaml');
  const cfg = yaml.load(readFileSync(kmsPath, 'utf8'));
  cfg.peer_extensions = { [slug]: 'peer-ext.yaml' };
  writeFileSync(kmsPath, yaml.dump(cfg));

  const out = checkPeers({ dir }); // reload the updated kms.yaml
  assert.equal(out.report.namespace, NAMESPACE);
  assert.equal(out.report.peers.length, 1);
  const peer = out.report.peers[0];
  assert.equal(peer.slug, slug);
  // Delegation actually ran: NOT skipped, and it surfaces federateCheck's fork-compat buckets.
  assert.equal(peer.skipped, undefined);
  assert.ok(Array.isArray(peer.compatible), 'carries a compatible[] array from federateCheck');
  assert.ok(Array.isArray(peer.incompatible), 'carries an incompatible[] array from federateCheck');
  assert.ok(peer.compatible.includes('regen-practice'), 'maps_to_core:practice → compatible');
  assert.ok(peer.incompatible.includes('floating-widget'), 'maps_to_core:not-a-core-type → incompatible');
});

test('contribute is draft-only: never writes cross-repo without approval', () => {
  const dir = initTmp();
  const cardPath = join(dir, 'peer.yaml');
  writeFileSync(cardPath, yaml.dump({ title: 'ReFi DAO', type: 'wiki', steward: 'ReFi DAO', return_path: 'open a PR' }));
  const { slug } = addPeer({ dir, cardPath });
  const out = contribute({ dir, slug, records: [{ id: 'c1' }] });
  assert.equal(out.applied, false);
  assert.equal(out.draft.return_path, 'open a PR');
  assert.equal(out.draft.namespace, NAMESPACE);
});
