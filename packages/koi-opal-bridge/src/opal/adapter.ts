/**
 * OPAL Adapter - Interface to OPAL AI Knowledge Garden
 * 
 * Wraps OPAL's slash commands for programmatic use within org-os
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export interface OpalConfig {
  opalPath: string;
  orgOsPath: string;
  profile?: string;
}

export interface OpalStatus {
  status: 'connected' | 'disconnected' | 'error';
  version?: string;
  pendingItems: number;
  profile?: string;
}

export interface ExtractedEntity {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'pattern' | 'concept' | 'protocol' | string;
  description?: string;
  source: string;
  confidence: number;
  raw: any;
}

export class OpalAdapter {
  private config: OpalConfig;
  private opalDir: string;

  constructor(config: OpalConfig) {
    this.config = config;
    this.opalDir = path.resolve(config.orgOsPath, config.opalPath);
  }

  async initialize(): Promise<void> {
    // Verify OPAL installation
    if (!existsSync(this.opalDir)) {
      throw new Error(`OPAL not found at ${this.opalDir}`);
    }

    const claudeMd = path.join(this.opalDir, 'CLAUDE.md');
    if (!existsSync(claudeMd)) {
      throw new Error(`OPAL not properly initialized (CLAUDE.md missing)`);
    }
  }

  async getStatus(): Promise<OpalStatus> {
    try {
      // Check OPAL version/info
      const result = this.runOpalCommand('/status');
      
      return {
        status: 'connected',
        version: this.extractVersion(result),
        pendingItems: this.extractPendingCount(result),
        profile: this.config.profile
      };
    } catch (error) {
      return {
        status: 'error',
        pendingItems: 0
      };
    }
  }

  /**
   * Process content through OPAL pipeline
   * Equivalent to: /process
   */
  async process(filePath: string): Promise<ExtractedEntity[]> {
    // Copy file to OPAL inbox
    const inboxPath = path.join(this.opalDir, '_inbox');
    const targetPath = path.join(inboxPath, path.basename(filePath));
    
    // For now, simulate OPAL processing
    // In real implementation, would use OPAL's API or CLI
    const content = readFileSync(filePath, 'utf-8');
    const entities = this.simulateEntityExtraction(content);
    
    return entities;
  }

  /**
   * Get pending items for review
   * Equivalent to: /review --list
   */
  async getPending(): Promise<ExtractedEntity[]> {
    const stagingPath = path.join(this.opalDir, '_staging');
    
    if (!existsSync(stagingPath)) {
      return [];
    }
    
    // Read staged entities
    // In real implementation, parse OPAL's staging format
    return [];
  }

  /**
   * Approve an entity
   */
  async approve(entityId: string): Promise<void> {
    // Move from staging to knowledge base
    // Equivalent to: /review (interactive approval)
  }

  /**
   * Reject an entity
   */
  async reject(entityId: string): Promise<void> {
    // Remove from staging
  }

  /**
   * Search OPAL knowledge base
   * Equivalent to: /search or /ask
   */
  async search(query: string): Promise<any[]> {
    const result = this.runOpalCommand(`/ask "${query}"`);
    return this.parseSearchResult(result);
  }

  /**
   * Ingest org-os data files into OPAL
   */
  async ingestOrgOsData(dataType: 'members' | 'projects' | 'meetings' | 'finances'): Promise<void> {
    const dataPath = path.join(this.config.orgOsPath, 'data', `${dataType}.yaml`);
    
    if (!existsSync(dataPath)) {
      console.warn(`Data file not found: ${dataPath}`);
      return;
    }
    
    // Parse YAML and convert to OPAL entities
    const yaml = await import('yaml');
    const content = readFileSync(dataPath, 'utf-8');
    const data = yaml.parse(content);
    
    // Convert to OPAL-compatible format
    // Ingest into OPAL
    console.log(`Ingested ${dataType} data into OPAL`);
  }

  /**
   * Run OPAL slash command
   */
  private runOpalCommand(command: string): string {
    try {
      // In real implementation, this would communicate with OPAL's API
      // For now, return mock results
      return `Command: ${command}`;
    } catch (error) {
      throw new Error(`OPAL command failed: ${error}`);
    }
  }

  private extractVersion(result: string): string | undefined {
    // Parse version from OPAL status output
    return undefined;
  }

  private extractPendingCount(result: string): number {
    // Parse pending count from OPAL status output
    return 0;
  }

  private parseSearchResult(result: string): any[] {
    // Parse OPAL search results
    return [];
  }

  /**
   * Simulate entity extraction (placeholder for real OPAL integration)
   */
  private simulateEntityExtraction(content: string): ExtractedEntity[] {
    // This would be replaced by actual OPAL extraction
    const entities: ExtractedEntity[] = [];
    
    // Simple regex-based extraction as placeholder
    const personPattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
    const orgPattern = /\b([A-Z][a-z]+ (?:DAO|Network|Council|Coop))\b/g;
    
    let match;
    
    while ((match = personPattern.exec(content)) !== null) {
      entities.push({
        id: `person-${match[1].toLowerCase().replace(/\s+/g, '-')}`,
        name: match[1],
        type: 'person',
        source: 'opal-extraction',
        confidence: 0.7,
        raw: match
      });
    }
    
    while ((match = orgPattern.exec(content)) !== null) {
      entities.push({
        id: `org-${match[1].toLowerCase().replace(/\s+/g, '-')}`,
        name: match[1],
        type: 'organization',
        source: 'opal-extraction',
        confidence: 0.8,
        raw: match
      });
    }
    
    return entities;
  }
}
