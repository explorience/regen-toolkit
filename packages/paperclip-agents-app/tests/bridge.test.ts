/**
 * Bridge Tests
 * Test org-os adapter functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrgOsAdapter } from '../bridge/org-os-adapter.js';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'fs/promises';

describe('OrgOsAdapter', () => {
  const testOrgPath = join(tmpdir(), 'paperclip-test-org');
  
  beforeEach(async () => {
    // Create test org structure
    await mkdir(testOrgPath, { recursive: true });
    
    // Create federation.yaml
    await writeFile(join(testOrgPath, 'federation.yaml'), `
version: "3.0"
spec: "organizational-os/3.0"
identity:
  name: "Test Organization"
  type: "Project"
  emoji: "🧪"
metadata:
  created: "2024-01-01"
`);
    
    // Create AGENTS.md
    await writeFile(join(testOrgPath, 'AGENTS.md'), `
# Test Agents

## Test Agent 1
Description for test agent 1.
- Capability A
- Capability B

## Test Agent 2
Description for test agent 2.
    `);
    
    // Create skills directory
    await mkdir(join(testOrgPath, 'skills'), { recursive: true });
    await writeFile(join(testOrgPath, 'skills', 'test-skill', 'SKILL.md'), `
# Test Skill

This is a test skill for testing purposes.
    `);
  });
  
  afterEach(async () => {
    // Cleanup
    try {
      await rm(testOrgPath, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('loadFederation', () => {
    it('should load federation.yaml', async () => {
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const federation = await adapter.loadFederation();
      
      expect(federation).toBeDefined();
      expect(federation.identity?.name).toBe('Test Organization');
      expect(federation.identity?.type).toBe('Project');
    });

    it('should throw on missing federation.yaml', async () => {
      const adapter = new OrgOsAdapter({ orgPath: '/nonexistent' });
      
      await expect(adapter.loadFederation()).rejects.toThrow();
    });
  });

  describe('loadOrganization', () => {
    it('should load organization from federation', async () => {
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const org = await adapter.loadOrganization();
      
      expect(org).toBeDefined();
      expect(org.name).toBe('Test Organization');
      expect(org.type).toBe('Project');
      expect(org.path).toBe(testOrgPath);
    });
  });

  describe('loadAgents', () => {
    it('should load agents from AGENTS.md', async () => {
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const agents = await adapter.loadAgents();
      
      expect(agents).toHaveLength(2);
      expect(agents[0].name).toBe('Test Agent 1');
      expect(agents[1].name).toBe('Test Agent 2');
    });

    it('should return empty array when AGENTS.md missing', async () => {
      await rm(join(testOrgPath, 'AGENTS.md'));
      
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const agents = await adapter.loadAgents();
      
      expect(agents).toHaveLength(0);
    });
  });

  describe('indexSkills', () => {
    it('should index skills from skills/ directory', async () => {
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const skills = await adapter.indexSkills();
      
      expect(skills).toHaveLength(1);
      expect(skills[0].name).toBe('test-skill');
    });

    it('should return empty array when skills/ missing', async () => {
      await rm(join(testOrgPath, 'skills'), { recursive: true });
      
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const skills = await adapter.indexSkills();
      
      expect(skills).toHaveLength(0);
    });
  });

  describe('validateStructure', () => {
    it('should validate correct structure', async () => {
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const result = await adapter.validateStructure();
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing files', async () => {
      await rm(join(testOrgPath, 'skills'), { recursive: true });
      
      const adapter = new OrgOsAdapter({ orgPath: testOrgPath });
      const result = await adapter.validateStructure();
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing skills/ directory');
    });
  });
});
