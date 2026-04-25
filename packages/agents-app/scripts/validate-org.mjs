#!/usr/bin/env node
/**
 * Validate org-os structure and configuration
 * 
 * Checks for common issues and provides actionable fixes
 */

import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import yaml from 'js-yaml';

class OrgValidator {
  private orgPath: string;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(orgPath: string = process.cwd()) {
    this.orgPath = resolve(orgPath);
  }

  /**
   * Run full validation suite
   */
  validate(): boolean {
    console.log('🔍 Validating org-os structure...\n');

    this.checkFederation();
    this.checkAgents();
    this.checkSkills();
    this.checkStructure();

    this.reportResults();

    return this.errors.length === 0;
  }

  /**
   * Validate federation.yaml
   */
  private checkFederation(): void {
    const fedPath = join(this.orgPath, 'federation.yaml');

    if (!existsSync(fedPath)) {
      this.errors.push('Missing: federation.yaml');
      return;
    }

    try {
      const content = readFileSync(fedPath, 'utf8');
      const fed = yaml.load(content) as any;

      if (!fed.org?.name) {
        this.errors.push('federation.yaml: Missing org.name');
      }
      if (!fed.org?.identifier) {
        this.warnings.push('federation.yaml: Missing org.identifier (using name slug)');
      }
    } catch (e) {
      this.errors.push(`federation.yaml: Invalid YAML - ${(e as Error).message}`);
    }
  }

  /**
   * Validate AGENTS.md format
   */
  private checkAgents(): void {
    const agentsPath = join(this.orgPath, 'AGENTS.md');

    if (!existsSync(agentsPath)) {
      this.warnings.push('Missing: AGENTS.md (no agents defined)');
      return;
    }

    try {
      const content = readFileSync(agentsPath, 'utf8');

      // Basic format check: look for agent sections
      const agentSections = content.match(/##\s+[a-z0-9\-]+/gi);
      if (!agentSections || agentSections.length === 0) {
        this.warnings.push('AGENTS.md: No agents found (format: ## agent-id)');
      }

      // Check for capability sections
      const capabilities = content.match(/\*\*Capabilities:\*\*/gi);
      if (!capabilities) {
        this.warnings.push('AGENTS.md: Missing capabilities (add: **Capabilities:** ...')
      }
    } catch (e) {
      this.errors.push(`AGENTS.md: Read error - ${(e as Error).message}`);
    }
  }

  /**
   * Validate skills/ directory
   */
  private checkSkills(): void {
    const skillsPath = join(this.orgPath, 'skills');

    if (!existsSync(skillsPath)) {
      this.warnings.push('Missing: skills/ directory');
      return;
    }

    try {
      const entries = require('fs').readdirSync(skillsPath, { withFileTypes: true });
      const skillDirs = entries.filter((e: any) => e.isDirectory());

      if (skillDirs.length === 0) {
        this.warnings.push('skills/: No skills found');
        return;
      }

      // Check each skill has SKILL.md
      for (const skill of skillDirs) {
        const skillMd = join(skillsPath, skill.name, 'SKILL.md');
        if (!existsSync(skillMd)) {
          this.warnings.push(`skills/${skill.name}/: Missing SKILL.md`);
        }
      }
    } catch (e) {
      this.errors.push(`skills/: Read error - ${(e as Error).message}`);
    }
  }

  /**
   * Validate directory structure
   */
  private checkStructure(): void {
    const required = ['federation.yaml'];
    const recommended = ['AGENTS.md', 'memory', 'skills', 'data'];

    for (const file of required) {
      if (!existsSync(join(this.orgPath, file))) {
        this.errors.push(`Missing required: ${file}`);
      }
    }

    for (const file of recommended) {
      if (!existsSync(join(this.orgPath, file))) {
        this.warnings.push(`Missing recommended: ${file}`);
      }
    }
  }

  /**
   * Report validation results
   */
  private reportResults(): void {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All checks passed!\n');
      return;
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      for (const err of this.errors) {
        console.log(`  - ${err}`);
      }
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      for (const warn of this.warnings) {
        console.log(`  - ${warn}`);
      }
      console.log();
    }
  }
}

// Run validation
const validator = new OrgValidator();
const isValid = validator.validate();

process.exit(isValid ? 0 : 1);
