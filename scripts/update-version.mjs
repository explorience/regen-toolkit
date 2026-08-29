#!/usr/bin/env node

/**
 * update-version.mjs — Bump the framework version across all sources of truth.
 *
 * Usage:
 *   node scripts/update-version.mjs <new-version>     # bump mode
 *   npm run version:update 3.1.0
 *
 *   node scripts/update-version.mjs --check           # check mode (v3.5+)
 *   npm run version:check
 *
 * Bump mode:
 * 1. Validates the new version is a proper semver and higher than current.
 * 2. Updates package.json → version.
 * 3. Updates federation.yaml → metadata.framework_version (major.minor only).
 * 4. Updates federation.yaml → version (top-level field).
 * 5. Updates federation.yaml → metadata.last_updated (ISO date).
 * 6. Promotes CHANGELOG.md [Unreleased] section to [<new-version>] — <date>.
 * 7. Inserts a new empty [Unreleased] section at the top.
 * 8. Does NOT commit, does NOT tag, does NOT push. Those are manual.
 *
 * Check mode (five surfaces since v0.5 WS-C5):
 * - Verifies package.json version, federation.yaml framework_version,
 *   the most-recent CHANGELOG.md [X.Y.Z] heading, root VERSION.md's
 *   "**Framework Version:**" line, and MASTERPLAN.md's "**Version:**" header
 *   all agree on major.minor.
 * - VERSION.md and MASTERPLAN.md are optional: absent, or present without a
 *   version line, means "makes no claim" and is not drift.
 * - Exit 0 if consistent; exit 1 with diff if not. No file modifications.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const frameworkRoot = resolve(process.argv[1], '../..');
const arg = process.argv[2];

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// --- Check mode (v3.5+, widened to five surfaces in v0.5 WS-C5) ---
//
// This read three sources for a long time, and the two it could not see were
// exactly the two that were wrong: root VERSION.md said 1.0.0 and MASTERPLAN.md
// said 2.0.0 while the framework was on 0.5.0. A surface a check cannot see is
// a surface that drifts unnoticed, so all five are read here.
//
// Absence is not drift: an instance need not carry VERSION.md or MASTERPLAN.md,
// and a VERSION.md without a "**Framework Version:**" line is making no claim.
// Those cases report "—" rather than failing.
if (arg === '--check') {
  const majorMinor = (v) => (v ? (String(v).match(/^(\d+)\.(\d+)/) || [])[0] : null);
  const readIfPresent = (rel) => {
    const p = resolve(frameworkRoot, rel);
    return existsSync(p) ? readFileSync(p, 'utf-8') : null;
  };

  const pkg = JSON.parse(readFileSync(resolve(frameworkRoot, 'package.json'), 'utf-8'));
  const pkgVersion = pkg.version;
  const pkgMajorMinor = majorMinor(pkgVersion);

  const fedRaw = readFileSync(resolve(frameworkRoot, 'federation.yaml'), 'utf-8');
  const fedFw = (fedRaw.match(/^\s*framework_version:\s*"?([\d.]+)"?$/m) || [])[1] || null;

  const changelogRaw = readFileSync(resolve(frameworkRoot, 'CHANGELOG.md'), 'utf-8');
  const clVersion = (changelogRaw.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m) || [])[1] || null;

  const versionMdRaw = readIfPresent('VERSION.md');
  const versionMd = versionMdRaw
    ? (versionMdRaw.match(/\*\*Framework Version:\*\*\s*`?(\d+\.\d+(?:\.\d+)?)`?/i) || [])[1] || null
    : null;

  const masterplanRaw = readIfPresent('MASTERPLAN.md');
  const masterplan = masterplanRaw
    ? (masterplanRaw.match(/^\*\*Version:\*\*\s*`?(\d+\.\d+(?:\.\d+)?)`?/m) || [])[1] || null
    : null;

  // surface label → declared value (null = makes no claim)
  const surfaces = [
    ['package.json', pkgVersion],
    ['federation.yaml framework_version', fedFw],
    ['CHANGELOG.md most-recent release', clVersion],
    ['VERSION.md Framework Version', versionMd],
    ['MASTERPLAN.md version header', masterplan],
  ];

  console.log('Version surface check (5 surfaces):');
  for (const [label, value] of surfaces) {
    console.log(`  ${(label + ':').padEnd(36)} ${value ?? '— (absent)'}`);
  }
  console.log('');

  const errors = [];
  if (!fedFw) errors.push('federation.yaml is missing metadata.framework_version');
  if (!clVersion) errors.push('CHANGELOG.md has no [X.Y.Z] release entry');
  for (const [label, value] of surfaces) {
    if (!value || label === 'package.json') continue;
    const mm = majorMinor(value);
    if (mm !== pkgMajorMinor) {
      errors.push(`major.minor mismatch: package.json ${pkgMajorMinor} ≠ ${label} ${mm}`);
    }
  }

  if (errors.length === 0) {
    console.log('✓ All version sources agree.');
    process.exit(0);
  }
  console.error('✗ Version surfaces inconsistent:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const newVersion = arg;

if (!newVersion) {
  die('Usage: node scripts/update-version.mjs <new-version> | --check');
}

const semverRe = /^(\d+)\.(\d+)\.(\d+)(-[\w.]+)?(\+[\w.]+)?$/;
const match = newVersion.match(semverRe);
if (!match) {
  die(`Not a valid semver: ${newVersion}`);
}
const [, major, minor] = match;
const majorMinor = `${major}.${minor}`;

// --- 1. package.json ---

const pkgPath = resolve(frameworkRoot, 'package.json');
const pkgRaw = readFileSync(pkgPath, 'utf-8');
const pkg = JSON.parse(pkgRaw);
const currentVersion = pkg.version;

function cmpSemver(a, b) {
  const pa = a.split(/[.+-]/).map((x) => parseInt(x, 10) || 0).slice(0, 3);
  const pb = b.split(/[.+-]/).map((x) => parseInt(x, 10) || 0).slice(0, 3);
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

if (cmpSemver(newVersion, currentVersion) <= 0) {
  die(`New version ${newVersion} must be greater than current ${currentVersion}`);
}

pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log(`✓ package.json: ${currentVersion} → ${newVersion}`);

// --- 2. federation.yaml (targeted line edits to preserve formatting / comments) ---

const fedPath = resolve(frameworkRoot, 'federation.yaml');
let fedRaw = readFileSync(fedPath, 'utf-8');

const today = new Date().toISOString().slice(0, 10);

const topVersionRe = /^version:\s*".*"$/m;
const metaFrameworkRe = /^(\s*)framework_version:\s*".*"$/m;
const metaLastUpdatedRe = /^(\s*)last_updated:\s*".*"$/m;

if (!topVersionRe.test(fedRaw)) {
  die('federation.yaml: missing top-level `version:` field');
}
if (!metaFrameworkRe.test(fedRaw)) {
  die('federation.yaml: missing `metadata.framework_version` field');
}

fedRaw = fedRaw.replace(topVersionRe, `version: "${majorMinor}"`);
fedRaw = fedRaw.replace(metaFrameworkRe, (_m, indent) => `${indent}framework_version: "${majorMinor}"`);
fedRaw = fedRaw.replace(metaLastUpdatedRe, (_m, indent) => `${indent}last_updated: "${today}"`);

writeFileSync(fedPath, fedRaw, 'utf-8');
console.log(`✓ federation.yaml: version "${majorMinor}", metadata.framework_version "${majorMinor}", last_updated "${today}"`);

// --- 3. CHANGELOG.md ---

const changelogPath = resolve(frameworkRoot, 'CHANGELOG.md');
let changelog = readFileSync(changelogPath, 'utf-8');

const unreleasedHeader = /## \[Unreleased\]\n/;
if (!unreleasedHeader.test(changelog)) {
  die('CHANGELOG.md: missing `## [Unreleased]` section');
}

// Promote [Unreleased] → [<new>] — <date>. Prepend a fresh [Unreleased] stub.
changelog = changelog.replace(
  unreleasedHeader,
  `## [Unreleased]\n\n_(Append changes here as they land.)_\n\n## [${newVersion}] — ${today}\n`
);

// Update or add comparison links at the bottom
const repoBase = 'https://github.com/regen-coordination/org-os-template';
const unreleasedLinkRe = /^\[Unreleased\]:.*$/m;
const newUnreleasedLink = `[Unreleased]: ${repoBase}/compare/v${newVersion}...HEAD`;
if (unreleasedLinkRe.test(changelog)) {
  changelog = changelog.replace(unreleasedLinkRe, newUnreleasedLink);
}

// Insert the new version link right after [Unreleased]
const newVersionLink = `[${newVersion}]: ${repoBase}/compare/v${currentVersion}...v${newVersion}`;
changelog = changelog.replace(
  unreleasedLinkRe.test(changelog) ? newUnreleasedLink : '',
  `${newUnreleasedLink}\n${newVersionLink}`
);

writeFileSync(changelogPath, changelog, 'utf-8');
console.log(`✓ CHANGELOG.md: promoted [Unreleased] → [${newVersion}] — ${today}`);

// --- 4. VERSION.md + MASTERPLAN.md ---
//
// C5 made these two checked surfaces but not updated ones, and `--check`
// compares major.minor — so a PATCH bump left both silently stale while still
// reporting "all version sources agree". Cutting 0.5.1 would have shipped a
// VERSION.md that says 0.5.0. Both are optional (an instance need not carry
// them, and one without a version line is making no claim), so a miss is
// reported rather than fatal.
function rewriteOptional(file, label, pattern, replace) {
  const p = resolve(frameworkRoot, file);
  if (!existsSync(p)) return;
  const before = readFileSync(p, 'utf-8');
  if (!pattern.test(before)) {
    console.log(`· ${file}: no ${label} line — makes no version claim, left alone`);
    return;
  }
  writeFileSync(p, before.replace(pattern, replace), 'utf-8');
  console.log(`✓ ${file}: ${label} → ${newVersion}`);
}

rewriteOptional(
  'VERSION.md',
  '**Framework Version:**',
  /(\*\*Framework Version:\*\*\s*)`?\d+\.\d+(?:\.\d+)?`?/i,
  `$1\`${newVersion}\``,
);
rewriteOptional(
  'MASTERPLAN.md',
  '**Version:**',
  /^(\*\*Version:\*\*\s*)`?\d+\.\d+(?:\.\d+)?`?/m,
  `$1${newVersion}`,
);

// --- Done ---

console.log('');
console.log(`✓ Version bumped to ${newVersion}`);
console.log('');
console.log('Next steps (manual):');
console.log('  1. Edit CHANGELOG.md — replace the stub for the new version with real content');
console.log('  2. Review diff: git diff');
console.log(`  3. Commit: git commit -am "release: v${newVersion}"`);
console.log(`  4. Tag:    git tag -a v${newVersion} -m "v${newVersion}"`);
console.log('  5. (optional) Push: git push && git push origin v' + newVersion);
