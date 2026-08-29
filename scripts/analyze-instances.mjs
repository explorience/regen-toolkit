#!/usr/bin/env node

/**
 * analyze-instances.mjs — Scan every downstream instance and report drift
 *
 * Reads data/instances.yaml (framework-only registry) and inspects each
 * locally-cloned instance. Compares discovered state against declared state
 * and against skills-matrix.yaml / packages-matrix.yaml. Writes a dated
 * drift report to memory/reports/.
 *
 * Usage: node scripts/analyze-instances.mjs [--json]
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { load as loadYaml } from 'js-yaml';

const frameworkRoot = resolve(process.argv[1], '../..');
const dataDir = join(frameworkRoot, 'data');
const jsonMode = process.argv.includes('--json');

function readYaml(path) {
  if (!existsSync(path)) return null;
  try {
    return loadYaml(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function listDirs(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .map((d) => d.name);
}

function listYamlFiles(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => f.replace(/\.yaml$/, ''));
}

const canonicalRegistries = new Set([
  'members', 'projects', 'finances', 'governance', 'meetings', 'ideas',
  'funding-opportunities', 'relationships', 'sources', 'knowledge-manifest',
  'events', 'channels', 'assets',
  'instances', 'skills-matrix', 'packages-matrix',
]);

const instancesFile = readYaml(join(dataDir, 'instances.yaml'));
const skillsMatrix = readYaml(join(dataDir, 'skills-matrix.yaml'));
const packagesMatrix = readYaml(join(dataDir, 'packages-matrix.yaml'));

if (!instancesFile?.instances) {
  console.error('✗ data/instances.yaml not found or malformed');
  process.exit(1);
}

const knownSkills = new Set((skillsMatrix?.skills || []).map((s) => s.id));
const knownPackages = new Set((packagesMatrix?.packages || []).map((p) => p.id));

// Read, never hardcoded: this said '3.0' in every drift report generated after
// the 2026-06-17 re-baseline, quietly contradicting the framework it ran from.
const frameworkVersion = (() => {
  try {
    return JSON.parse(readFileSync(join(frameworkRoot, 'package.json'), 'utf-8')).version;
  } catch {
    return null;
  }
})();

const report = {
  generated_at: new Date().toISOString(),
  framework_version: frameworkVersion,
  instances: [],
  summary: {
    total: 0,
    cloned: 0,
    production: 0,
    drift_total: 0,
    unmapped_skills: [],
    unmapped_packages: [],
  },
};

for (const inst of instancesFile.instances) {
  const result = {
    id: inst.id,
    name: inst.name,
    type: inst.type,
    maturity: inst.maturity,
    declared: {
      skills_extra: inst.skills_extra || [],
      packages: inst.packages || [],
      data_registries_extra: inst.data_registries_extra || [],
      masterplan_version: inst.masterplan_version,
      framework_version: inst.framework_version,
    },
    discovered: null,
    drift: [],
  };

  report.summary.total++;
  if (inst.cloned) report.summary.cloned++;
  if (inst.maturity === 'production') report.summary.production++;

  if (!inst.cloned || !inst.local_path) {
    result.drift.push('not_cloned_locally');
    report.summary.drift_total += result.drift.length;
    report.instances.push(result);
    continue;
  }

  const instancePath = resolve(frameworkRoot, inst.local_path);

  if (!existsSync(instancePath)) {
    result.drift.push(`local_path_missing:${inst.local_path}`);
    report.summary.drift_total += result.drift.length;
    report.instances.push(result);
    continue;
  }

  const instSkills = listDirs(join(instancePath, 'skills'));
  const instPackages = listDirs(join(instancePath, 'packages'));
  const instData = listYamlFiles(join(instancePath, 'data'));
  const hasMasterplan = existsSync(join(instancePath, 'MASTERPLAN.md'));
  const hasFederation = existsSync(join(instancePath, 'federation.yaml'));
  const fedYaml = hasFederation ? readYaml(join(instancePath, 'federation.yaml')) : null;
  const fedFrameworkVersion = fedYaml?.metadata?.framework_version || null;

  result.discovered = {
    skills: instSkills,
    packages: instPackages,
    data_registries: instData,
    has_masterplan: hasMasterplan,
    has_federation: hasFederation,
    federation_version: fedFrameworkVersion,
  };

  // Drift checks
  if (!hasMasterplan && inst.maturity !== 'alpha' && inst.type !== 'AgentRuntime' && inst.type !== 'Project') {
    result.drift.push('missing_masterplan');
  }
  if (!hasFederation && inst.type !== 'AgentRuntime') {
    result.drift.push('missing_federation_yaml');
  }
  if (fedFrameworkVersion && inst.framework_version && fedFrameworkVersion !== inst.framework_version) {
    result.drift.push(`framework_version_mismatch:declared=${inst.framework_version},actual=${fedFrameworkVersion}`);
  }

  // Skills not in matrix
  const frameworkSkills = listDirs(join(frameworkRoot, 'skills'));
  const extraSkills = instSkills.filter((s) => !frameworkSkills.includes(s));
  const declaredExtra = new Set(inst.skills_extra || []);
  for (const skill of extraSkills) {
    if (!declaredExtra.has(skill)) {
      result.drift.push(`undeclared_skill:${skill}`);
    }
    if (!knownSkills.has(skill)) {
      result.drift.push(`unmapped_skill:${skill}`);
      if (!report.summary.unmapped_skills.includes(skill)) {
        report.summary.unmapped_skills.push(skill);
      }
    }
  }

  // Packages not in matrix
  for (const pkg of instPackages) {
    if (!knownPackages.has(pkg)) {
      result.drift.push(`unmapped_package:${pkg}`);
      if (!report.summary.unmapped_packages.includes(pkg)) {
        report.summary.unmapped_packages.push(pkg);
      }
    }
  }

  // Extra data registries
  const declaredDataExtra = new Set(inst.data_registries_extra || []);
  for (const reg of instData) {
    if (!canonicalRegistries.has(reg) && !declaredDataExtra.has(reg)) {
      result.drift.push(`undeclared_data_registry:${reg}`);
    }
  }

  report.summary.drift_total += result.drift.length;
  report.instances.push(result);
}

// --- Output ---

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const reportsDir = join(frameworkRoot, 'memory', 'reports');
if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });

const mdLines = [];
mdLines.push(`# Instance Drift Report — ${today}`);
mdLines.push('');
mdLines.push(`**Generated:** ${report.generated_at}`);
mdLines.push(`**Framework version:** ${report.framework_version}`);
mdLines.push('');
mdLines.push(`## Summary`);
mdLines.push('');
mdLines.push(`- Instances tracked: ${report.summary.total}`);
mdLines.push(`- Cloned locally: ${report.summary.cloned}`);
mdLines.push(`- Production: ${report.summary.production}`);
mdLines.push(`- Total drift items: ${report.summary.drift_total}`);
mdLines.push(`- Unmapped skills (not in skills-matrix): ${report.summary.unmapped_skills.length ? report.summary.unmapped_skills.join(', ') : 'none'}`);
mdLines.push(`- Unmapped packages (not in packages-matrix): ${report.summary.unmapped_packages.length ? report.summary.unmapped_packages.join(', ') : 'none'}`);
mdLines.push('');

for (const inst of report.instances) {
  mdLines.push(`## ${inst.name} (\`${inst.id}\`)`);
  mdLines.push('');
  mdLines.push(`- Type: ${inst.type}`);
  mdLines.push(`- Maturity: ${inst.maturity}`);
  if (inst.discovered) {
    mdLines.push(`- Skills: ${inst.discovered.skills.length} (${inst.discovered.skills.join(', ') || '—'})`);
    mdLines.push(`- Packages: ${inst.discovered.packages.length} (${inst.discovered.packages.join(', ') || '—'})`);
    mdLines.push(`- Data registries: ${inst.discovered.data_registries.length}`);
    mdLines.push(`- MASTERPLAN: ${inst.discovered.has_masterplan ? 'yes' : 'no'}`);
    mdLines.push(`- federation.yaml: ${inst.discovered.has_federation ? `yes (v${inst.discovered.federation_version || '?'})` : 'no'}`);
  } else {
    mdLines.push(`- **Not locally scannable**`);
  }
  if (inst.drift.length) {
    mdLines.push('');
    mdLines.push(`**Drift (${inst.drift.length}):**`);
    for (const d of inst.drift) {
      mdLines.push(`- ⚠ ${d}`);
    }
  } else {
    mdLines.push('');
    mdLines.push(`**Drift:** none ✓`);
  }
  mdLines.push('');
}

const reportPath = join(reportsDir, `instances-drift-${today}.md`);
writeFileSync(reportPath, mdLines.join('\n'), 'utf-8');

// Console summary
console.log(`\n📊 Instance Drift Report — ${today}`);
console.log('─'.repeat(50));
console.log(`Instances tracked:     ${report.summary.total}`);
console.log(`Cloned locally:        ${report.summary.cloned}`);
console.log(`Production:            ${report.summary.production}`);
console.log(`Total drift items:     ${report.summary.drift_total}`);
console.log(`Unmapped skills:       ${report.summary.unmapped_skills.join(', ') || 'none'}`);
console.log(`Unmapped packages:     ${report.summary.unmapped_packages.join(', ') || 'none'}`);
console.log('');
for (const inst of report.instances) {
  const status = inst.drift.length === 0 ? '✓' : `⚠ ${inst.drift.length}`;
  console.log(`  ${status.padEnd(5)} ${inst.id.padEnd(25)} ${inst.maturity}`);
}
console.log('');
console.log(`Full report: ${reportPath.replace(frameworkRoot, '.')}`);
console.log('');

if (report.summary.drift_total > 0) {
  process.exit(0); // drift is informational, not a failure
}
