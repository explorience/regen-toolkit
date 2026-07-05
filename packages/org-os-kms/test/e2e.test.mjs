// test/e2e.test.mjs
// The adoption gate: a temp instance mirroring regen-toolkit's layout goes source → framework
// store → bridge → render, driven the way the lifecycle would. No mocks of the framework.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import * as fw from '../src/framework.mjs';
import { bridge } from '../src/registry-bridge.mjs';
import { renderSiteData, renderDashboardSection } from '../src/render.mjs';
import { runLifecycle } from '../src/executor.mjs';

test('e2e: framework store → bridge → index → render, under the org-os lifecycle', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kms-e2e-'));
  // target = dir (absolute) so the whole run is hermetic to the temp instance (tests don't
  // chdir). The real repo uses target '.' because its cwd IS the instance root.
  writeFileSync(join(dir, 'kms.yaml'), yaml.dump({
    instance: 'e2e', adapter: 'repo-data', target: dir, framework: '@regen-commons/toolkit-framework',
    peers: {}, render: { site_data: 'src/data/kms-index.json' },
  }));

  // 1) Store reviewed KB objects the way the framework machine would (post-accept).
  const a = fw.getAdapter('repo-data');
  a.store(dir, [
    { schema: 'resource', object: { id: 'kb-1', title: 'KB One', maturity: 'raw', ai_assisted: true } },
    { schema: 'signal', object: { id: 'sig-1', title: 'Signal One', maturity: 'raw', ai_assisted: true } },
  ]);
  a.writeIndex(dir);
  assert.ok(existsSync(join(dir, 'data/kb/index.json')));

  // 2) Bridge into instance registries.
  const b = bridge({ dir, config: { adapter: 'repo-data', target: dir } });
  assert.equal(b.ok, true);
  const resDoc = yaml.load(readFileSync(join(dir, 'data/resources.yaml'), 'utf8'));
  const resKey = Object.keys(resDoc).find(k => Array.isArray(resDoc[k]));
  assert.ok(resDoc[resKey].some(e => e.id === 'kb-1'));

  // 3) Render both surfaces.
  const site = renderSiteData({ dir, target: dir, outPath: 'src/data/kms-index.json' });
  assert.equal(site.ok, true);
  const section = renderDashboardSection(a.index(dir));
  assert.match(section, /2 objects/);

  // 4) Lifecycle initialize runs end-to-end against this instance (real ops, no throw).
  const report = runLifecycle('initialize', { dir });
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
});
