import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
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
