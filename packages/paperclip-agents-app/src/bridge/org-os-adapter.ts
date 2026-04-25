/**
 * org-os Adapter - Core Bridge Component
 * Reads federation.yaml, AGENTS.md, and skills/ directory
 */

import { readFile, readdir, stat, watch } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import YAML from 'yaml';
import { 
  FederationManifest, 
  Organization, 
  Agent, 
  Skill,
  DiscoveredOrganization,
  FileChange,
  OrgOsAdapterConfig
} from '../types.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';
import { createLogger } from '../lib/logger.js';

const logger = createLogger('org-os-adapter');

export class OrgOsAdapter {
  private orgPath: string;
  private watchEnabled: boolean;
  private watchers: Map<string, ReturnType<typeof watch>>;

  constructor(config: OrgOsAdapterConfig) {
    this.orgPath = resolve(config.orgPath);
    this.watchEnabled = config.watch ?? false;
    this.watchers = new Map();
    
    logger.info({ orgPath: this.orgPath }, 'OrgOsAdapter initialized');
  }

  /**
   * Discover all org-os instances in a directory
   */
  async discoverOrganizations(basePath?: string): Promise<DiscoveredOrganization[]> {
    const searchPath = basePath ? resolve(basePath) : this.orgPath;
    const organizations: DiscoveredOrganization[] = [];

    try {
      const entries = await readdir(searchPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const fullPath = join(searchPath, entry.name);
        const federationPath = join(fullPath, 'federation.yaml');
        
        if (existsSync(federationPath)) {
          try {
            const federation = await this.loadFederation(fullPath);
            organizations.push({
              path: fullPath,
              name: federation.identity?.name || entry.name,
              type: federation.identity?.type || 'Project',
              hasFederation: true,
              hasAgents: existsSync(join(fullPath, 'AGENTS.md')),
              hasSkills: existsSync(join(fullPath, 'skills'))
            });
          } catch (error) {
            logger.warn({ path: fullPath, error }, 'Failed to load federation');
          }
        }
      }
      
      logger.info({ count: organizations.length }, 'Organizations discovered');
      return organizations;
    } catch (error) {
      throw new PaperclipError(
        ErrorCode.DISCOVERY_FAILED,
        `Failed to discover organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { searchPath, originalError: error }
      );
    }
  }

  /**
   * Load organization from federation.yaml
   */
  async loadOrganization(path?: string): Promise<Organization> {
    const orgPath = path ? resolve(path) : this.orgPath;
    const federation = await this.loadFederation(orgPath);
    
    if (!federation.identity) {
      throw new PaperclipError(
        ErrorCode.INVALID_FEDERATION,
        'Missing identity section in federation.yaml',
        { path: orgPath }
      );
    }

    const org: Organization = {
      id: this.generateId(orgPath),
      name: federation.identity.name,
      type: federation.identity.type,
      emoji: federation.identity.emoji,
      path: orgPath,
      daoUri: federation.identity.daoURI,
      chain: federation.identity.chain,
      safeAddress: federation.identity.safe,
      metadata: federation.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info({ orgId: org.id, orgName: org.name }, 'Organization loaded');
    return org;
  }

  /**
   * Load federation.yaml manifest
   */
  async loadFederation(orgPath?: string): Promise<FederationManifest> {
    const path = orgPath ? resolve(orgPath) : this.orgPath;
    const federationPath = join(path, 'federation.yaml');
    
    try {
      const content = await readFile(federationPath, 'utf-8');
      const federation = YAML.parse(content) as FederationManifest;
      
      logger.debug({ path: federationPath }, 'Federation manifest loaded');
      return federation;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new PaperclipError(
          ErrorCode.FILE_NOT_FOUND,
          `federation.yaml not found at ${federationPath}`,
          { path: federationPath }
        );
      }
      throw new PaperclipError(
        ErrorCode.PARSE_ERROR,
        `Failed to parse federation.yaml: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { path: federationPath, originalError: error }
      );
    }
  }

  /**
   * Load agents from AGENTS.md
   */
  async loadAgents(orgPath?: string): Promise<Agent[]> {
    const path = orgPath ? resolve(orgPath) : this.orgPath;
    const agentsPath = join(path, 'AGENTS.md');
    
    try {
      const content = await readFile(agentsPath, 'utf-8');
      const agents = this.parseAgentsMarkdown(content);
      
      logger.info({ count: agents.length, path: agentsPath }, 'Agents loaded from AGENTS.md');
      return agents;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.warn({ path: agentsPath }, 'AGENTS.md not found');
        return [];
      }
      throw new PaperclipError(
        ErrorCode.PARSE_ERROR,
        `Failed to parse AGENTS.md: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { path: agentsPath, originalError: error }
      );
    }
  }

  /**
   * Index skills from skills/ directory
   */
  async indexSkills(orgPath?: string): Promise<Skill[]> {
    const path = orgPath ? resolve(orgPath) : this.orgPath;
    const skillsPath = join(path, 'skills');
    
    try {
      const skills: Skill[] = [];
      
      if (!existsSync(skillsPath)) {
        logger.warn({ path: skillsPath }, 'skills/ directory not found');
        return [];
      }

      const entries = await readdir(skillsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const skillDir = join(skillsPath, entry.name);
        const skillFile = join(skillDir, 'SKILL.md');
        
        if (existsSync(skillFile)) {
          try {
            const skill = await this.loadSkillMetadata(skillDir, entry.name);
            skills.push(skill);
          } catch (error) {
            logger.warn({ skillName: entry.name, error }, 'Failed to load skill');
          }
        }
      }
      
      logger.info({ count: skills.length, path: skillsPath }, 'Skills indexed');
      return skills;
    } catch (error) {
      throw new PaperclipError(
        ErrorCode.SKILL_INDEX_FAILED,
        `Failed to index skills: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { skillsPath, originalError: error }
      );
    }
  }

  /**
   * Load skill metadata from SKILL.md
   */
  private async loadSkillMetadata(skillPath: string, skillName: string): Promise<Skill> {
    const skillFile = join(skillPath, 'SKILL.md');
    const content = await readFile(skillFile, 'utf-8');
    
    // Parse skill name and description from SKILL.md
    const lines = content.split('\n');
    const description = lines.find(line => line.startsWith('# '))?.replace('# ', '').trim() || '';
    const firstParagraph = this.extractFirstParagraph(content);
    
    return {
      id: this.generateId(skillPath),
      organizationId: '', // Will be set by caller
      name: skillName,
      description: firstParagraph || description,
      path: skillPath,
      category: this.inferSkillCategory(skillName),
      capabilities: this.extractCapabilities(content),
      createdAt: (await stat(skillPath)).mtime,
      updatedAt: new Date()
    };
  }

  /**
   * Parse agents from AGENTS.md markdown
   */
  private parseAgentsMarkdown(content: string): Agent[] {
    const agents: Agent[] = [];
    const sections = this.splitByHeaders(content);
    
    for (const section of sections) {
      const lines = section.split('\n');
      const nameLine = lines.find(l => l.startsWith('## '));
      
      if (nameLine) {
        const name = nameLine.replace('## ', '').trim();
        const agent: Agent = {
          id: this.generateId(name),
          organizationId: '', // Will be set by caller
          name,
          description: this.extractFirstParagraph(section),
          capabilities: this.extractCapabilities(section),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        agents.push(agent);
      }
    }
    
    return agents;
  }

  /**
   * Split markdown by headers
   */
  private splitByHeaders(content: string): string[] {
    const sections: string[] = [];
    let currentSection = '';
    let inHeader = false;
    
    for (const line of content.split('\n')) {
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        if (currentSection) {
          sections.push(currentSection.trim());
        }
        currentSection = line + '\n';
        inHeader = true;
      } else {
        currentSection += line + '\n';
      }
    }
    
    if (currentSection) {
      sections.push(currentSection.trim());
    }
    
    return sections;
  }

  /**
   * Extract first paragraph from markdown
   */
  private extractFirstParagraph(content: string): string {
    const lines = content.split('\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    for (const line of lines) {
      if (line.trim() === '') {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = '';
        }
        if (paragraphs.length > 0) break;
      } else if (!line.startsWith('#')) {
        currentParagraph += ' ' + line.trim();
      }
    }
    
    if (currentParagraph) {
      paragraphs.push(currentParagraph.trim());
    }
    
    return paragraphs[0] || '';
  }

  /**
   * Extract capabilities from markdown
   */
  private extractCapabilities(content: string): string[] {
    const capabilities: string[] = [];
    const patterns = [
      /\|\s*\*\*(.+?)\s*\*\*\s*\|/g,  // Table format: | **capability** |
      /[-*]\s+(.+?):/g,                 // List format: - capability:
      /`(.+?)`/g                        // Code format: `capability`
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const capability = match[1].trim();
        if (capability && !capabilities.includes(capability)) {
          capabilities.push(capability);
        }
      }
    }
    
    return capabilities;
  }

  /**
   * Infer skill category from name
   */
  private inferSkillCategory(skillName: string): string {
    const name = skillName.toLowerCase();
    
    if (name.includes('meeting')) return 'coordination';
    if (name.includes('funding') || name.includes('grant')) return 'finance';
    if (name.includes('knowledge') || name.includes('curator')) return 'knowledge';
    if (name.includes('schema') || name.includes('generator')) return 'technical';
    if (name.includes('heartbeat') || name.includes('monitor')) return 'operations';
    if (name.includes('web')) return 'integration';
    
    return 'general';
  }

  /**
   * Watch org-os files for changes
   */
  watchOrgOsFiles(orgPath: string, callback: (change: FileChange) => void): void {
    if (!this.watchEnabled) {
      logger.warn('File watching is disabled');
      return;
    }

    const watchPaths = [
      join(orgPath, 'federation.yaml'),
      join(orgPath, 'AGENTS.md'),
      join(orgPath, 'skills')
    ];

    for (const watchPath of watchPaths) {
      if (existsSync(watchPath)) {
        const watcher = watch(watchPath, { recursive: true }, async (eventType, filename) => {
          const change: FileChange = {
            type: eventType === 'rename' ? 'create' : 'update',
            path: join(watchPath, filename || ''),
            timestamp: new Date()
          };
          
          logger.info({ change }, 'File change detected');
          callback(change);
        });
        
        this.watchers.set(watchPath, watcher);
        logger.info({ path: watchPath }, 'Watching for changes');
      }
    }
  }

  /**
   * Stop watching all files
   */
  stopWatching(): void {
    for (const [path, watcher] of this.watchers) {
      watcher.close();
      logger.info({ path }, 'Stopped watching');
    }
    this.watchers.clear();
  }

  /**
   * Generate unique ID from path
   */
  private generateId(path: string): string {
    const hash = path.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return Math.abs(hash).toString(36);
  }

  /**
   * Validate org-os structure
   */
  async validateStructure(orgPath?: string): Promise<{ valid: boolean; errors: string[] }> {
    const path = orgPath ? resolve(orgPath) : this.orgPath;
    const errors: string[] = [];

    // Check for federation.yaml
    if (!existsSync(join(path, 'federation.yaml'))) {
      errors.push('Missing federation.yaml');
    }

    // Check for AGENTS.md
    if (!existsSync(join(path, 'AGENTS.md'))) {
      errors.push('Missing AGENTS.md');
    }

    // Check for skills directory
    if (!existsSync(join(path, 'skills'))) {
      errors.push('Missing skills/ directory');
    }

    // Try to load and parse federation.yaml
    try {
      await this.loadFederation(path);
    } catch (error) {
      errors.push(`Invalid federation.yaml: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const valid = errors.length === 0;
    
    logger.info({ valid, errors: errors.length }, 'Structure validation complete');
    return { valid, errors };
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopWatching();
    logger.info('Adapter cleanup complete');
  }
}

export default OrgOsAdapter;
