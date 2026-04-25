/**
 * org-os Integration Services
 * 
 * Business logic for org-os integration including discovery, import, and sync operations.
 * 
 * @module integration/services
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve, relative } from 'path';
import { glob } from 'glob';
import * as yaml from 'js-yaml';
import { xxhash3 } from 'xxhash-wasm';
import pino from 'pino';

import { OrgOsAdapter, SyncService } from '../packages/org-os-bridge/src/index.js';
import type { 
  OrgOsOrganization, 
  OrgOsAgent, 
  OrgOsSkill,
  DiscoveredOrganization,
} from '../packages/org-os-bridge/src/index.js';

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
// Type Definitions
// ============================================================================

/**
 * Configuration for OrgOsService
 */
export interface OrgOsServiceConfig {
  basePath: string;
  autoSync: boolean;
  syncInterval: number;
  maxOrganizations: number;
}

/**
 * Result of importing an organization
 */
export interface OrganizationImportResult {
  success: boolean;
  organization?: OrgOsOrganization;
  companyId?: string;
  error?: string;
  synced?: number;
}

/**
 * Sync event record for storage
 */
export interface SyncEventRecord {
  id: string;
  organizationId: string;
  organizationPath: string;
  direction: 'pull' | 'push';
  itemType: 'agent' | 'skill' | 'task' | 'memory' | 'config' | 'federation';
  status: 'success' | 'error' | 'conflict' | 'skipped';
  changes?: number;
  details?: Record<string, unknown>;
  error?: string;
  timestamp: Date;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: OrgOsServiceConfig = {
  basePath: process.cwd(),
  autoSync: false,
  syncInterval: 60000, // 1 minute
  maxOrganizations: 100,
};

// ============================================================================
// Service Class
// ============================================================================

/**
 * OrgOsService provides high-level business logic for org-os integration.
 * 
 * It coordinates between the OrgOsAdapter (for discovery/loading) and SyncService
 * (for synchronization), plus provides additional operations like import and status.
 * 
 * @example
 * ```typescript
 * const service = new OrgOsService({ basePath: '/path/to/orgs' });
 * 
 * // Discover organizations
 * const discovered = await service.discoverOrganizations();
 * 
 * // Import an organization
 * const result = await service.importOrganization('/path/to/org-os');
 * ```
 */
export class OrgOsService {
  private config: OrgOsServiceConfig;
  private organizations: Map<string, OrgOsOrganization> = new Map();
  private syncServices: Map<string, SyncService> = new Map();
  private syncHistory: SyncEventRecord[] = [];
  private syncIntervalId?: NodeJS.Timeout;

  /**
   * Create a new OrgOsService.
   * 
   * @param config - Optional configuration
   */
  constructor(config: Partial<OrgOsServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info({ config: this.config }, 'Initialized OrgOsService');
  }

  // ============================================================================
  // Discovery Operations
  // ============================================================================

  /**
   * Discover all org-os instances in the base path.
   * 
   * @returns Array of discovered organizations with metadata
   */
  async discoverOrganizations(): Promise<DiscoveredOrganization[]> {
    logger.info({ basePath: this.config.basePath }, 'Discovering organizations');
    
    try {
      const discovered = await OrgOsAdapter.listDiscoveredOrganizations(this.config.basePath);
      logger.info({ count: discovered.length }, 'Discovery complete');
      return discovered;
    } catch (e) {
      logger.error({ error: (e as Error).message }, 'Discovery failed');
      return [];
    }
  }

  /**
   * Get detailed information about a specific organization.
   * 
   * @param path - Path to the organization
   * @returns Organization object or null if not found
   */
  async getOrganization(path: string): Promise<OrgOsOrganization | null> {
    // Check cache first
    if (this.organizations.has(path)) {
      return this.organizations.get(path)!;
    }

    try {
      // Validate path
      if (!OrgOsAdapter.validateOrgPath(path)) {
        logger.warn({ path }, 'Invalid organization path');
        return null;
      }

      const org = OrgOsAdapter.loadOrganization(path);
      this.organizations.set(path, org);
      return org;
    } catch (e) {
      logger.error({ path, error: (e as Error).message }, 'Failed to load organization');
      return null;
    }
  }

  /**
   * Get all loaded organizations.
   * 
   * @returns Array of loaded organizations
   */
  getLoadedOrganizations(): OrgOsOrganization[] {
    return Array.from(this.organizations.values());
  }

  // ============================================================================
  // Import Operations
  // ============================================================================

  /**
   * Import an org-os instance into Paperclip.
   * 
   * This loads the organization, creates necessary records, and optionally syncs.
   * 
   * @param path - Path to the organization
   * @param autoSync - Whether to auto-sync after import
   * @returns Import result with organization and sync status
   */
  async importOrganization(path: string, autoSync: boolean = false): Promise<OrganizationImportResult> {
    logger.info({ path, autoSync }, 'Importing organization');

    // Validate path
    if (!OrgOsAdapter.validateOrgPath(path)) {
      return {
        success: false,
        error: 'Invalid organization path - path traversal detected or path does not exist',
      };
    }

    // Check organization limit
    if (this.organizations.size >= this.config.maxOrganizations) {
      return {
        success: false,
        error: `Maximum organizations (${this.config.maxOrganizations}) reached`,
      };
    }

    try {
      // Load organization
      const org = OrgOsAdapter.loadOrganization(path);
      
      // Store in cache
      this.organizations.set(path, org);

      // Create sync service
      const sync = new SyncService(org);
      this.syncServices.set(path, sync);

      // Optionally sync
      let synced = 0;
      if (autoSync) {
        const result = await sync.pull();
        synced = result.pulled;
        
        // Record sync events
        this.recordSyncEvents(org.identifier, path, result);
      }

      logger.info({ 
        path, 
        name: org.name, 
        agents: org.agents.length, 
        skills: org.skills.length,
        synced 
      }, 'Organization imported');

      return {
        success: true,
        organization: org,
        companyId: org.identifier, // In full impl, this would be a DB ID
        synced,
      };
    } catch (e) {
      logger.error({ path, error: (e as Error).message }, 'Import failed');
      return {
        success: false,
        error: (e as Error).message,
      };
    }
  }

  /**
   * Remove an organization from Paperclip.
   * 
   * @param path - Path to the organization
   * @returns True if removed, false if not found
   */
  async removeOrganization(path: string): Promise<boolean> {
    const org = this.organizations.get(path);
    if (!org) {
      return false;
    }

    this.organizations.delete(path);
    this.syncServices.delete(path);

    logger.info({ path, name: org.name }, 'Organization removed');
    return true;
  }

  // ============================================================================
  // Sync Operations
  // ============================================================================

  /**
   * Pull data from an organization.
   * 
   * @param path - Path to the organization
   * @returns Sync result
   */
  async pullSync(path: string): Promise<SyncService extends Promise<infer R> ? R : never> {
    const sync = this.syncServices.get(path);
    if (!sync) {
      // Create on demand
      const org = await this.getOrganization(path);
      if (!org) {
        throw new Error(`Organization not found at ${path}`);
      }
      const newSync = new SyncService(org);
      this.syncServices.set(path, newSync);
      return newSync.pull();
    }
    return sync.pull();
  }

  /**
   * Push data to an organization.
   * 
   * @param path - Path to the organization
   * @param items - Optional specific items to push
   * @returns Sync result
   */
  async pushSync(path: string, items?: string[]): Promise<SyncService extends Promise<infer R> ? R : never> {
    const sync = this.syncServices.get(path);
    if (!sync) {
      throw new Error(`No sync service for ${path}. Import organization first.`);
    }
    return sync.push(items);
  }

  /**
   * Get sync status for an organization.
   * 
   * @param path - Path to the organization
   * @returns Sync status object
   */
  async getSyncStatus(path: string): Promise<{
    lastSync?: Date;
    pendingChanges: boolean;
    syncEnabled: boolean;
  }> {
    const sync = this.syncServices.get(path);
    const org = this.organizations.get(path);

    if (!org) {
      return {
        pendingChanges: false,
        syncEnabled: false,
      };
    }

    if (!sync) {
      return {
        pendingChanges: false,
        syncEnabled: false,
      };
    }

    const pendingChanges = await sync.hasPendingChanges();
    const history = sync.getHistory(1);
    const lastSync = history[0]?.timestamp;

    return {
      lastSync,
      pendingChanges,
      syncEnabled: true,
    };
  }

  /**
   * Get sync history for an organization.
   * 
   * @param path - Path to the organization
   * @param limit - Maximum number of records to return
   * @returns Array of sync event records
   */
  getSyncHistory(path: string, limit: number = 50): SyncEventRecord[] {
    return this.syncHistory
      .filter((e) => e.organizationPath === path)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Start auto-sync for all loaded organizations.
   */
  startAutoSync(): void {
    if (this.syncIntervalId) {
      logger.warn('Auto-sync already running');
      return;
    }

    logger.info({ interval: this.config.syncInterval }, 'Starting auto-sync');
    
    this.syncIntervalId = setInterval(async () => {
      for (const [path, sync] of this.syncServices) {
        try {
          const hasChanges = await sync.hasPendingChanges();
          if (hasChanges) {
            logger.debug({ path }, 'Auto-syncing organization');
            const result = await sync.pull();
            this.recordSyncEvents(sync.getOrganization().identifier, path, result);
          }
        } catch (e) {
          logger.error({ path, error: (e as Error).message }, 'Auto-sync failed');
        }
      }
    }, this.config.syncInterval);
  }

  /**
   * Stop auto-sync.
   */
  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = undefined;
      logger.info('Auto-sync stopped');
    }
  }

  // ============================================================================
  // Agent & Skill Operations
  // ============================================================================

  /**
   * Get all agents across all loaded organizations.
   * 
   * @returns Array of all agents
   */
  getAllAgents(): OrgOsAgent[] {
    const agents: OrgOsAgent[] = [];
    for (const org of this.organizations.values()) {
      agents.push(...org.agents);
    }
    return agents;
  }

  /**
   * Get all skills across all loaded organizations.
   * 
   * @returns Array of all skills
   */
  getAllSkills(): OrgOsSkill[] {
    const skills: OrgOsSkill[] = [];
    for (const org of this.organizations.values()) {
      skills.push(...org.skills);
    }
    return skills;
  }

  /**
   * Find agents by capability.
   * 
   * @param capability - Capability to search for
   * @returns Array of matching agents
   */
  findAgentsByCapability(capability: string): Array<OrgOsAgent & { organization: string }> {
    const results: Array<OrgOsAgent & { organization: string }> = [];
    
    for (const org of this.organizations.values()) {
      for (const agent of org.agents) {
        if (agent.capabilities.includes(capability)) {
          results.push({
            ...agent,
            organization: org.name,
          });
        }
      }
    }
    
    return results;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Record sync events for history tracking.
   */
  private recordSyncEvents(
    organizationId: string,
    path: string,
    result: { pulled: number; pushed: number; errors: Array<{ direction: 'pull' | 'push'; itemType: string; path: string; status: string; error?: string }> }
  ): void {
    const timestamp = new Date();
    
    for (const error of result.errors) {
      this.syncHistory.push({
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        organizationId,
        organizationPath: path,
        direction: error.direction,
        itemType: error.itemType as SyncEventRecord['itemType'],
        status: error.status as SyncEventRecord['status'],
        error: error.error,
        timestamp,
      });
    }
  }

  /**
   * Get service configuration.
   */
  getConfig(): OrgOsServiceConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration.
   */
  setConfig(config: Partial<OrgOsServiceConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info({ config: this.config }, 'Configuration updated');
  }

  /**
   * Shutdown the service and clean up resources.
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down OrgOsService');
    this.stopAutoSync();
    OrgOsAdapter.stopAllWatchers();
    this.organizations.clear();
    this.syncServices.clear();
  }
}

export default OrgOsService;
