import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import yaml from 'js-yaml';

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, '..', 'src', 'cli.mjs');

test('cli prints a semver version', () => {
  const out = execFileSync('node', [cli, 'version'], { encoding: 'utf8' }).trim();
  // semver incl. optional pre-release (e.g. 0.1.0-beta.1) + build metadata
  assert.match(out, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
});

test('cli lists schemas', () => {
  const out = execFileSync('node', [cli, 'list-schemas'], { encoding: 'utf8' });
  assert.match(out, /review-maturity/);
  assert.match(out, /source-system/);
});

test('cli check-state validates against K1', () => {
  const out = execFileSync('node', [cli, 'check-state', 'maturity', 'reviewed'], { encoding: 'utf8' });
  assert.match(out, /valid maturity/);
  assert.throws(() => execFileSync('node', [cli, 'check-state', 'maturity', 'canonical'], { encoding: 'utf8', stdio: 'pipe' }));
});

test('cli kernel-check passes + context emits valid JSON-LD', () => {
  const out = execFileSync('node', [cli, 'kernel-check'], { encoding: 'utf8' });
  assert.match(out, /kernel consistent/);
  const ctx = JSON.parse(execFileSync('node', [cli, 'context'], { encoding: 'utf8' }));
  assert.ok(ctx['@context']['source-system']);
});

const FIXTURE = join(here, 'fixtures', 'transcript.md');
const CANDIDATES = join(here, 'fixtures', 'candidates');
const run = (args, opts = {}) => execFileSync('node', [cli, ...args], { encoding: 'utf8', ...opts });

test('cli drives the full pipeline: prepare → claim → fulfill → accept → store → kb index', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-'));
  const wodir = join(dir, '.workorders');
  const kb = join(dir, 'kb');

  const prep = run(['ingest', 'prepare', FIXTURE, '--dir', wodir]);
  assert.match(prep, /1 work order/);
  const id = run(['ingest', 'list', '--dir', wodir]).trim().split(/\s+/)[0];
  assert.match(id, /^wo-/);

  run(['ingest', 'claim', id, '--dir', wodir, '--by', 'test-agent']);
  const cdir = join(wodir, id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(CANDIDATES, 'good-source-system.yaml'), join(cdir, 'good-source-system.yaml'));
  run(['ingest', 'fulfill', id, '--dir', wodir]);
  assert.match(run(['ingest', 'accept', id, '--dir', wodir]), /accepted/);

  assert.match(run(['store', '--dir', wodir, '--adapter', 'kb-folder', '--target', kb]), /stored 1 object/);
  // idempotent: re-store finds nothing new
  assert.match(run(['store', '--dir', wodir, '--adapter', 'kb-folder', '--target', kb]), /stored 0 objects/);

  const idx = JSON.parse(run(['kb', 'index', '--adapter', 'kb-folder', '--target', kb]));
  assert.equal(idx.total, 1);
  assert.equal(idx.by_type['source-system'], 1);
});

test('cli ingest accept fails loudly on a bad candidate (exit ≠ 0, notes saved)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-bad-'));
  const wodir = join(dir, '.workorders');
  run(['ingest', 'prepare', FIXTURE, '--dir', wodir]);
  const id = run(['ingest', 'list', '--dir', wodir]).trim().split(/\s+/)[0];
  run(['ingest', 'claim', id, '--dir', wodir]);
  const cdir = join(wodir, id, 'candidates');
  mkdirSync(cdir, { recursive: true });
  copyFileSync(join(CANDIDATES, 'bad-maturity.yaml'), join(cdir, 'bad-maturity.yaml'));
  run(['ingest', 'fulfill', id, '--dir', wodir]);
  assert.throws(() => run(['ingest', 'accept', id, '--dir', wodir], { stdio: 'pipe' }),
    (e) => e.status === 1, 'domain failure must exit 1');
  const wo = yaml.load(readFileSync(join(wodir, `${id}.yaml`), 'utf8'));
  assert.ok(wo.error_notes.includes('maturity must be "raw"'));
});

test('cli ingest rejects malformed work-order ids (no path fishing)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-id-'));
  // must exit 2 (usage error from the id-shape guard) — NOT 1 from a downstream
  // "not found" throw, which would mean the guard was bypassed or removed
  assert.throws(() => run(['ingest', 'claim', '../escape', '--dir', join(dir, '.workorders')], { stdio: 'pipe' }),
    (e) => e.status === 2 && /usage/.test(String(e.stderr)), 'id guard must reject with usage + exit 2');
});

test('cli init stamps an instance and kms.yaml defaults feed store/kb', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-init-'));
  const out = run(['init', dir, '--name', 'smoke']);
  assert.match(out, /✓ instance "smoke" initialized/);
  assert.match(out, /next: complete the self source-system card/, 'no path printed — self_ref is adapter-opaque');
  // kms.yaml defaults picked up when cwd is the instance dir
  const idx = JSON.parse(run(['kb', 'index'], { cwd: dir }));
  assert.equal(idx.total, 1, 'self card visible via config-default adapter/target');
});

test('cli surfaces a malformed kms.yaml as a clean error, not a raw stack (store/kb/review/init)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-badcfg-'));
  writeFileSync(join(dir, 'kms.yaml'), 'foo: [unclosed');
  assert.throws(() => run(['kb', 'index'], { cwd: dir, stdio: 'pipe' }),
    (e) => e.status === 1 && /kms\.yaml/.test(String(e.stderr)));
});

test('cli federate add registers a peer card through the adapter — visible in kb index', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-fed-'));
  run(['init', dir, '--name', 'fedhome']);
  const peerCard = join(dir, 'peer.yaml');
  writeFileSync(peerCard, yaml.dump({
    title: 'Peer Commons', type: 'repo', steward: 'Peer',
    return_path: 'PRs', maturity: 'raw', ai_assisted: true,
  }));
  const out = run(['federate', 'add', 'peer.yaml'], { cwd: dir });
  assert.match(out, /✓ peer "peer-commons" registered/);
  const idx = JSON.parse(run(['kb', 'index'], { cwd: dir }));
  assert.equal(idx.total, 2, 'self + peer both counted');
});

test('cli federate check fails cleanly on a missing extensions file (✗ + exit 1, no raw stack)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-fedchk-noent-'));
  run(['init', dir, '--name', 'chkhome']);
  assert.throws(() => run(['federate', 'check', '/nonexistent.yaml'], { cwd: dir, stdio: 'pipe' }),
    (e) => e.status === 1 && /✗/.test(String(e.stderr)));
});

test('cli federate check on an empty extensions file succeeds with an honest 0/0', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tf-cli-fedchk-empty-'));
  run(['init', dir, '--name', 'chkhome']);
  writeFileSync(join(dir, 'empty.yaml'), '');
  const out = run(['federate', 'check', 'empty.yaml'], { cwd: dir });
  assert.match(out, /fork-compatible: 0\/0/);
});
