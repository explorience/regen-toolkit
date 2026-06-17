import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, '..', 'src', 'cli.mjs');

test('cli prints a semver version', () => {
  const out = execFileSync('node', [cli, 'version'], { encoding: 'utf8' }).trim();
  assert.match(out, /^\d+\.\d+\.\d+$/);
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
