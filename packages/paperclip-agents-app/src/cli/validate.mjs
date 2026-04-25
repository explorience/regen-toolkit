#!/usr/bin/env node
/**
 * Validation CLI
 * Validate org-os structure
 */

import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';
import chalk from 'chalk';

const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan
};

async function main() {
  const orgPath = process.argv[2] || resolve('.');
  
  console.log(chalk.bold.cyan(`\n🔍 Validating org-os structure: ${orgPath}\n`));

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check federation.yaml
  const federationPath = join(orgPath, 'federation.yaml');
  if (!existsSync(federationPath)) {
    errors.push('Missing federation.yaml');
  } else {
    try {
      const content = await readFile(federationPath, 'utf-8');
      const federation = YAML.parse(content);
      
      if (!federation.identity?.name) {
        errors.push('federation.yaml: Missing identity.name');
      }
      if (!federation.identity?.type) {
        errors.push('federation.yaml: Missing identity.type');
      }
      
      console.log(colors.success('  ✓ federation.yaml is valid'));
    } catch (error) {
      errors.push(`federation.yaml: Parse error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check AGENTS.md
  const agentsPath = join(orgPath, 'AGENTS.md');
  if (!existsSync(agentsPath)) {
    warnings.push('Missing AGENTS.md (optional but recommended)');
  } else {
    console.log(colors.success('  ✓ AGENTS.md exists'));
  }

  // Check skills directory
  const skillsPath = join(orgPath, 'skills');
  if (!existsSync(skillsPath)) {
    warnings.push('Missing skills/ directory (optional but recommended)');
  } else {
    console.log(colors.success('  ✓ skills/ directory exists'));
  }

  // Check memory directory
  const memoryPath = join(orgPath, 'memory');
  if (!existsSync(memoryPath)) {
    warnings.push('Missing memory/ directory (optional but recommended)');
  } else {
    console.log(colors.success('  ✓ memory/ directory exists'));
  }

  // Output results
  console.log('\n---');
  
  if (errors.length > 0) {
    console.log(colors.error('\n✗ Validation failed with errors:'));
    for (const error of errors) {
      console.log(colors.error(`  - ${error}`));
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(colors.warning('\n⚠ Validation passed with warnings:'));
    for (const warning of warnings) {
      console.log(colors.warning(`  - ${warning}`));
    }
  }

  console.log(colors.success('\n✓ Validation passed!\n'));
  process.exit(0);
}

main();
