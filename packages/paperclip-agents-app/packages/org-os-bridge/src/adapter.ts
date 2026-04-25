/**
 * org-os Bridge Adapter
 * 
 * Discovers, loads, and manages org-os instances for Paperclip integration.
 * Provides auto-discovery of organizations via federation.yaml and AGENTS.md parsing.
 * 
 * @module org-os-bridge/adapter
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { glob } from 'glob';
import * as yaml from 'js-yaml';
import { watch, FSWatcher } from 'chokidar';
import { xxhash3 } from 'xxhash-wasm';
import { diffLines } from 'diff';
import pino from 'pino';

import type {
  FederationManifest,
  OrganizationIdentity,
  NetworkConfig,
  AgentConfig,
  KnowledgeCommonsConfig,
  IntegrationsConfig,
  PackagesConfig,
  GovernanceConfig,
  Metadata,
  OrganizationType,
} from './types.js';

import type {
  OrgOsOrganization,
  OrgOsAgent,
  OrgOsSkill,
  FileChange,
  DiscoveredOrganization,
} from './index.js';

// ============================================================================
// Logger Configuration
// ============================================================================

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

// ============================================================================
// Type Definitions (Internal)
// ============================================================================

interface FederationYaml {
  version?: string;
  spec?: string;
  org?: OrganizationIdentity;
  network?: NetworkConfig;
  agent?: AgentConfig;
  knowledgeCommons?: KnowledgeCommonsConfig;
  integrations?: IntegrationsConfig;
  packages?: PackagesConfig;
  governance?: GovernanceConfig;
  metadata?: Metadata;
}

interface OrgConfig {
  runtime: string;
  workspace?: string;
  skills?: string[];
  channels?: string[];
  proactive?: boolean;
  heartbeatInterval?: string;
}

// ============================================================================
// Adapter Class
// ============================================================================

/**
 * OrgOsAdapter provides methods to discover and load org-os instances.
 * 
 * It reads federation.yaml for organization metadata, parses AGENTS.md for agent
 * definitions, and indexes skills from the skills/ directory.
 * 
 * @example
 * ```typescript
 * const org = OrgOsAdapter.loadOrganization('/path/to/org-os');
 * console.log(org.name, org.agents);
 * ```
 */
export class OrgOsAdapter {
  private static watchers: Map<string, FSWatcher> = new Map();

  /**
   * Auto-discover org-os instances by walking up the directory tree from a starting path.
   * 
   * This walks upward from the given path, checking for federation.yaml files at each level.
   * The search stops when it reaches the filesystem root.
   * 
   * @param searchPath - Starting path to search from (default: process.cwd())
   * @returns Array of discovered organizations
   */
  static async discoverOrganizations(searchPath: string = process.cwd()): Promise<OrgOsOrganization[]> {
    logger.info({ searchPath }, 'Discovering organizations');
    const orgs: OrgOsOrganization[] = [];
    const visited = new Set<string>();

    const walk = (dir: string): void => {
      if (visited.has(dir)) return;
      visited.add(dir);

      const fedPath = join(dir, 'federation.yaml');
      
      // Check if this directory contains an org-os instance
      if (existsSync(fedPath)) {
        try {
          const org = this.loadOrganization(dir);
          orgs.push(org);
          logger.info({ path: dir, name: org.name }, 'Found organization');
        } catch (e) {
          logger.warn({ path: dir, error: (e as Error).message }, 'Failed to load organization');
        }
      }

      // Walk parent directory
      const parent = resolve(dir, '..');
      if (parent !== dir) {
        walk(parent);
      }
    };

    walk(searchPath);
    logger.info({ count: orgs.length }, 'Discovery complete');
    return orgs;
  }

  /**
   * Load a single org-os instance from a given path.
   * 
   * Reads federation.yaml for metadata, AGENTS.md for agents, and skills/ directory for skills.
   * 
   * @param orgPath - Absolute path to the org-os instance
   * @returns Organization object with agents and skills
   * @throws Error if federation.yaml is not found or is invalid
   */
  static loadOrganization(orgPath: string): OrgOsOrganization {
    const fedPath = join(orgPath, 'federation.yaml');

    if (!existsSync(fedPath)) {
      throw new Error(`No federation.yaml found at ${fedPath}`);
    }

    const content = readFileSync(fedPath, 'utf8');
    const fed = yaml.load(content) as FederationYaml;

    if (!fed.org) {
      throw new Error('federation.yaml missing required "org" section');
    }

    const org: OrgOsOrganization = {
      name: fed.org.name || 'Unknown Organization',
      identifier: this.generateIdentifier(fed.org.name),
      uri: fed.org.daoURI || '',
      path: orgPath,
      agents: this.loadAgents(orgPath),
      skills: this.indexSkills(orgPath),
      // Extended metadata from federation.yaml
      config: {
        runtime: fed.agent?.runtime || 'openclaw',
        workspace: fed.agent?.workspace,
        skills: fed.agent?.skills || [],
        channels: fed.agent?.channels || [],
        proactive: fed.agent?.proactive || false,
        heartbeatInterval: fed.agent?.heartbeatInterval,
        network: fed.network,
        knowledgeCommons: fed.knowledgeCommons,
        packages: fed.packages,
        governance: fed.governance,
      }
    };

    return org;
  }

  /**
   * Generate a URL-safe identifier from an organization name.
   */
  private static generateIdentifier(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Parse agents from AGENTS.md file in the org-os path.
   * 
   * Expected format:
   * ## agent-id
   * - **Runtime:** openclaw
   * - **Capabilities:** coordination, governance
   * - **Budget:** $1000
   * 
   * @param orgPath - Path to the organization
   * @returns Array of parsed agent definitions
   */
  static loadAgents(orgPath: string): OrgOsAgent[] {
    const agentsPath = join(orgPath, 'AGENTS.md');

    if (!existsSync(agentsPath)) {
      logger.debug({ orgPath }, 'No AGENTS.md found');
      return [];
    }

    const content = readFileSync(agentsPath, 'utf8');
    const agents: OrgOsAgent[] = [];

    // Parse ## agent-id sections
    // Split on "## " to get individual agent sections
    const sections = content.split(/\n##\s+/);

    for (const section of sections.slice(1)) {
      const lines = section.split('\n');
      if (!lines[0]?.trim()) continue;
      
      const id = lines[0].trim();
      if (!id) continue;

      // Extract runtime (defaults to openclaw)
      const runtimeMatch = section.match(/\*\*Runtime:\*\*\s*(\w+)/);
      const runtime = runtimeMatch?.[1] || 'openclaw';

      // Extract capabilities as comma or semicolon separated list
      const capsMatch = section.match(/\*\*Capabilities:\*\*\s*([^\n]+)/);
      const capabilities = capsMatch?.[1]
        ?.split(/[,;]/)
        ?.map((c) => c.trim())
        ?.filter(Boolean) || [];

      // Extract budget (optional, numeric value)
      const budgetMatch = section.match(/\*\*Budget:\*\*\s*\$?(\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : undefined;

      // Extract description (optional, first paragraph after agent header)
      const descMatch = section.match(/(?:^|\n)([^#\n][^\n]+)/);
      const description = descMatch?.[1]?.trim();

      // Extract skills (optional)
      const skillsMatch = section.match(/\*\*Skills:\*\*\s*([^\n]+)/);
      const skills = skillsMatch?.[1]
        ?.split(/[,;]/)
        ?.map((s) => s.trim())
        ?.filter(Boolean) || [];

      // Extract channels (optional)
      const channelsMatch = section.match(/\*\*Channels:\*\*\s*([^\n]+)/);
      const channels = channelsMatch?.[1]
        ?.split(/[,;]/)
        ?.map((c) => c.trim())
        ?.filter(Boolean) || [];

      agents.push({
        id,
        name: this.humanizeAgentName(id),
        runtime,
        capabilities,
        budget,
        description,
        skills,
        channels,
      });
    }

    logger.debug({ orgPath, count: agents.length }, 'Loaded agents');
    return agents;
  }

  /**
   * Convert agent ID to human-readable name.
   * Example: "refi-bcn-coordinator" -> "Refi Bcn Coordinator"
   */
  private static humanizeAgentName(id: string): string {
    return id
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Index skills from the skills/ directory.
   * 
   * Reads each skill's SKILL.md to extract name and description.
   * 
   * @param orgPath - Path to the organization
   * @returns Array of indexed skills
   */
  static indexSkills(orgPath: string): OrgOsSkill[] {
    const skillsDir = join(orgPath, 'skills');

    if (!existsSync(skillsDir)) {
      logger.debug({ orgPath }, 'No skills directory found');
      return [];
    }

    // Find all subdirectories in skills/
    const skillDirs = glob.sync('*/', { cwd: skillsDir, absolute: false });
    const skills: OrgOsSkill[] = [];

    for (const dir of skillDirs) {
      const id = dir.replace(/\/$/, '');
      const skillPath = join(skillsDir, dir);
      const skillMdPath = join(skillPath, 'SKILL.md');

      let name = this.humanizeAgentName(id);
      let description = '';
      let category = 'general';

      if (existsSync(skillMdPath)) {
        try {
          const content = readFileSync(skillMdPath, 'utf8');
          
          // Extract title from first # heading
          const titleMatch = content.match(/^#\s+(.+)$/m);
          if (titleMatch) name = titleMatch[1];

          // Extract description (first non-heading paragraph)
          const descMatch = content.match(/^##?\s+Description\s*\n+([^#]+)/m);
          if (descMatch) description = descMatch[1].trim();

          // Extract category from "## Category" heading
          const catMatch = content.match(/^##?\s+Category\s*\n+([^\n]+)/m);
          if (catMatch) category = catMatch[1].trim().toLowerCase();
        } catch (e) {
          logger.warn({ path: skillMdPath, error: (e as Error).message }, 'Failed to parse SKILL.md');
        }
      }

      skills.push({
        id,
        name,
        description,
        path: skillPath,
        category,
      });
    }

    logger.debug({ orgPath, count: skills.length }, 'Indexed skills');
    return skills;
  }

  /**
   * Read memory files for operational context.
   * 
   * Reads the most recent 3 memory/*.md files for context.
   * 
   * @param orgPath - Path to the organization
   * @returns Map of filename to content (truncated to 500 chars)
   */
  static readMemory(orgPath: string): Record<string, string> {
    const memoryDir = join(orgPath, 'memory');

    if (!existsSync(memoryDir)) {
      return {};
    }

    const memoryFiles = glob.sync('*.md', { cwd: memoryDir });
    const context: Record<string, string> = {};

    // Sort by filename (date-based) and take most recent 3
    for (const file of memoryFiles.sort().reverse().slice(0, 3)) {
      const content = readFileSync(join(memoryDir, file), 'utf8');
      context[file] = content.substring(0, 500);
    }

    return context;
  }

  /**
   * Watch an org-os instance for file changes.
   * 
   * Returns a watcher that emits events when federation.yaml, AGENTS.md, or skills/ change.
   * 
   * @param orgPath - Path to the organization to watch
   * @param callback - Function called on file changes
   * @returns Cleanup function to stop watching
   */
  static watchOrganization(
    orgPath: string,
    callback: (change: FileChange) => void
  ): () => void {
    logger.info({ orgPath }, 'Starting organization watch');

    const patterns = [
      join(orgPath, 'federation.yaml'),
      join(orgPath, 'AGENTS.md'),
      join(orgPath, 'skills', '**', 'SKILL.md'),
      join(orgPath, 'memory', '*.md'),
    ];

    const watcher = watch(patterns, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
      }
    });

    watcher.on('change', async (path: string) => {
      const hash = await this.computeFileHash(path);
      callback({
        type: 'update',
        path: relative(orgPath, path),
        hash,
        timestamp: new Date(),
      });
    });

    watcher.on('add', async (path: string) => {
      const hash = await this.computeFileHash(path);
      callback({
        type: 'create',
        path: relative(orgPath, path),
        hash,
        timestamp: new Date(),
      });
    });

    watcher.on('unlink', (path: string) => {
      callback({
        type: 'delete',
        path: relative(orgPath, path),
        timestamp: new Date(),
      });
    });

    this.watchers.set(orgPath, watcher);

    // Return cleanup function
    return () => {
      logger.info({ orgPath }, 'Stopping organization watch');
      watcher.close();
      this.watchers.delete(orgPath);
    };
  }

  /**
   * Compute a fast hash of a file's contents.
   */
  private static async computeFileHash(filePath: string): Promise<string> {
    try {
      const content = readFileSync(filePath);
      const hash = await xxhash3(content);
      return hash;
    } catch {
      return '';
    }
  }

  /**
   * Compare two versions of a file and return the diff.
   */
  static computeDiff(oldContent: string, newContent: string): string {
    const changes = diffLines(oldContent, newContent);
    return changes
      .map((part) => {
        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
        return prefix + part.value;
      })
      .join('');
  }

  /**
   * Validate an org-os path for security.
   * 
   * Ensures the path doesn't escape expected directories.
   */
  static validateOrgPath(path: string): boolean {
    // Normalize and resolve to absolute
    const resolved = resolve(path);
    
    // Check for path traversal attempts
    if (path.includes('..') && !resolve(path).startsWith(process.cwd())) {
      logger.warn({ path }, 'Path traversal attempt detected');
      return false;
    }

    // Must exist and be a directory
    if (!existsSync(resolved) || !statSync(resolved).isDirectory()) {
      logger.warn({ path }, 'Path does not exist or is not a directory');
      return false;
    }

    return true;
  }

  /**
   * List all discovered organizations in a given root directory.
   * 
   * @param rootPath - Root directory to search (default: process.cwd())
   * @returns Array of discovered organization metadata
   */
  static async listDiscoveredOrganizations(rootPath: string = process.cwd()): Promise<DiscoveredOrganization[]> {
    const orgs: DiscoveredOrganization[] = [];
    
    // Find all directories containing federation.yaml
    const fedFiles = glob.sync('**/federation.yaml', { 
      cwd: rootPath,
      absolute: true 
    });

    for (const fedPath of fedFiles) {
      const orgDir = dirname(fedPath);
      
      try {
        const fed = yaml.load(readFileSync(fedPath, 'utf8')) as FederationYaml;
        
        orgs.push({
          path: orgDir,
          name: fed.org?.name || 'Unknown',
          type: fed.org?.type || 'Project',
          hasFederation: true,
          hasAgents: existsSync(join(orgDir, 'AGENTS.md')),
          hasSkills: existsSync(join(orgDir, 'skills')),
        });
      } catch (e) {
        logger.warn({ path: fedPath }, 'Failed to parse federation.yaml');
      }
    }

    return orgs;
  }

  /**
   * Stop all watchers.
   */
  static stopAllWatchers(): void {
    for (const [path, watcher] of this.watchers) {
      logger.info({ path }, 'Closing watcher');
      watcher.close();
    }
    this.watchers.clear();
  }
}

export default OrgOsAdapter;
