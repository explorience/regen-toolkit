/**
 * org-os Bridge Sync Service
 * 
 * Provides bidirectional synchronization between Paperclip and org-os instances.
 * Handles pulling data from org-os and pushing updates back.
 * 
 * @module org-os-bridge/sync
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative } from 'path';
import { glob } from 'glob';
import * as yaml from 'js-yaml';
import { diffLines, diffWords } from 'diff';
import { xxhash3 } from 'xxhash-wasm';
import pino from 'pino';

import type { OrgOsOrganization, OrgOsAgent, OrgOsSkill } from './index.js';
import { OrgOsAdapter } from './adapter.js';

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
 * Direction of sync operation
 */
export type SyncDirection = 'pull' | 'push';

/**
 * Type of item being synced
 */
export type SyncItemType = 'agent' | 'skill' | 'task' | 'memory' | 'config' | 'federation';

/**
 * Status of a sync operation
 */
export type SyncStatusValue = 'success' | 'error' | 'conflict' | 'skipped';

/**
 * Result of a sync operation
 */
export interface SyncOperationResult {
  success: boolean;
  direction: SyncDirection;
  itemType: SyncItemType;
  path: string;
  changes: number;
  message?: string;
  error?: string;
}

/**
 * Result of a full sync
 */
export interface SyncResult {
  success: boolean;
  pulled: number;
  pushed: number;
  errors: SyncOperationResult[];
  duration: number;
  timestamp: Date;
}

/**
 * Sync event record for logging/history
 */
export interface SyncEvent {
  id: string;
  organizationId: string;
  direction: SyncDirection;
  itemType: SyncItemType;
  path: string;
  status: SyncStatusValue;
  changes?: number;
  details?: Record<string, unknown>;
  error?: string;
  timestamp: Date;
}

/**
 * Configuration for sync operations
 */
export interface SyncConfig {
  autoPullAgents: boolean;
  autoPullSkills: boolean;
  autoPushTasks: boolean;
  conflictResolution: 'prefer-local' | 'prefer-remote' | 'manual';
  dryRun: boolean;
  targets?: SyncItemType[];
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: SyncConfig = {
  autoPullAgents: true,
  autoPullSkills: true,
  autoPushTasks: false,
  conflictResolution: 'prefer-remote',
  dryRun: false,
  targets: ['agent', 'skill', 'config', 'federation'],
};

// ============================================================================
// SyncService Class
// ============================================================================

/**
 * SyncService handles bidirectional synchronization between Paperclip and org-os.
 * 
 * Pull operations bring data from org-os into Paperclip (agents, skills, config).
 * Push operations send updates back to org-os (task completion, memory updates).
 * 
 * @example
 * ```typescript
 * const sync = new SyncService(org);
 * const result = await sync.pull();
 * console.log(result.pulled, result.errors);
 * ```
 */
export class SyncService {
  private org: OrgOsOrganization;
  private config: SyncConfig;
  private lastHashes: Map<string, string> = new Map();
  private syncHistory: SyncEvent[] = [];

  /**
   * Create a new SyncService for an organization.
   * 
   * @param org - Organization to sync
   * @param config - Optional sync configuration
   */
  constructor(org: OrgOsOrganization, config: Partial<SyncConfig> = {}) {
    this.org = org;
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info({ org: org.name, config: this.config }, 'Initialized SyncService');
  }

  /**
   * Pull all configured data from org-os.
   * 
   * @returns SyncResult with pulled count and any errors
   */
  async pull(): Promise<SyncResult> {
    const startTime = Date.now();
    logger.info({ org: this.org.name }, 'Starting pull sync');

    const results: SyncOperationResult[] = [];
    let pulled = 0;

    try {
      // Pull federation/config
      if (this.config.targets?.includes('federation') || this.config.targets?.includes('config')) {
        const fedResult = await this.pullFederation();
        results.push(fedResult);
        if (fedResult.success) pulled++;
      }

      // Pull agents
      if (this.config.targets?.includes('agent') && this.config.autoPullAgents) {
        const agentResult = await this.pullAgents();
        results.push(agentResult);
        if (agentResult.success) pulled++;
      }

      // Pull skills
      if (this.config.targets?.includes('skill') && this.config.autoPullSkills) {
        const skillResult = await this.pullSkills();
        results.push(skillResult);
        if (skillResult.success) pulled++;
      }
    } catch (e) {
      logger.error({ error: (e as Error).message }, 'Pull sync failed');
    }

    const duration = Date.now() - startTime;
    const errors = results.filter((r) => !r.success);

    logger.info({ 
      org: this.org.name, 
      pulled, 
      errors: errors.length, 
      duration 
    }, 'Pull sync complete');

    return {
      success: errors.length === 0,
      pulled,
      pushed: 0,
      errors,
      duration,
      timestamp: new Date(),
    };
  }

  /**
   * Push updates back to org-os.
   * 
   * @param items - Optional specific items to push
   * @returns SyncResult with pushed count and any errors
   */
  async push(items?: string[]): Promise<SyncResult> {
    const startTime = Date.now();
    logger.info({ org: this.org.name, items }, 'Starting push sync');

    const results: SyncOperationResult[] = [];
    let pushed = 0;

    try {
      // Push tasks (if enabled)
      if (this.config.autoPushTasks) {
        const taskResult = await this.pushTasks();
        results.push(taskResult);
        if (taskResult.success) pushed++;
      }

      // Push memory updates
      if (!items || items.includes('memory')) {
        const memoryResult = await this.pushMemory();
        results.push(memoryResult);
        if (memoryResult.success) pushed++;
      }
    } catch (e) {
      logger.error({ error: (e as Error).message }, 'Push sync failed');
    }

    const duration = Date.now() - startTime;
    const errors = results.filter((r) => !r.success);

    logger.info({ 
      org: this.org.name, 
      pushed, 
      errors: errors.length, 
      duration 
    }, 'Push sync complete');

    return {
      success: errors.length === 0,
      pulled: 0,
      pushed,
      errors,
      duration,
      timestamp: new Date(),
    };
  }

  /**
   * Perform a full bidirectional sync.
   * 
   * @returns Combined sync result
   */
  async sync(): Promise<SyncResult> {
    const pullResult = await this.pull();
    const pushResult = await this.push();

    return {
      success: pullResult.success && pushResult.success,
      pulled: pullResult.pulled,
      pushed: pushResult.pushed,
      errors: [...pullResult.errors, ...pushResult.errors],
      duration: pullResult.duration + pushResult.duration,
      timestamp: new Date(),
    };
  }

  // ============================================================================
  // Pull Operations
  // ============================================================================

  /**
   * Pull federation.yaml (configuration)
   */
  private async pullFederation(): Promise<SyncOperationResult> {
    const fedPath = join(this.org.path, 'federation.yaml');
    
    try {
      if (!existsSync(fedPath)) {
        return {
          success: false,
          direction: 'pull',
          itemType: 'federation',
          path: fedPath,
          changes: 0,
          error: 'federation.yaml not found',
        };
      }

      const content = readFileSync(fedPath, 'utf8');
      const hash = await xxhash3(Buffer.from(content));
      
      // Check if changed
      const lastHash = this.lastHashes.get('federation');
      if (lastHash === hash) {
        logger.debug({ path: fedPath }, 'Federation unchanged, skipping');
        return {
          success: true,
          direction: 'pull',
          itemType: 'federation',
          path: fedPath,
          changes: 0,
          message: 'unchanged',
        };
      }

      this.lastHashes.set('federation', hash);

      logger.info({ path: fedPath }, 'Pulled federation.yaml');
      
      this.recordEvent({
        direction: 'pull',
        itemType: 'federation',
        path: fedPath,
        status: 'success',
      });

      return {
        success: true,
        direction: 'pull',
        itemType: 'federation',
        path: fedPath,
        changes: 1,
      };
    } catch (e) {
      return {
        success: false,
        direction: 'pull',
        itemType: 'federation',
        path: fedPath,
        changes: 0,
        error: (e as Error).message,
      };
    }
  }

  /**
   * Pull agents from AGENTS.md
   */
  private async pullAgents(): Promise<SyncOperationResult> {
    const agentsPath = join(this.org.path, 'AGENTS.md');
    
    try {
      if (!existsSync(agentsPath)) {
        return {
          success: false,
          direction: 'pull',
          itemType: 'agent',
          path: agentsPath,
          changes: 0,
          error: 'AGENTS.md not found',
        };
      }

      // Reload agents from file
      const agents = OrgOsAdapter.loadAgents(this.org.path);
      this.org.agents = agents;

      const hash = await xxhash3(Buffer.from(readFileSync(agentsPath, 'utf8')));
      this.lastHashes.set('agents', hash);

      logger.info({ path: agentsPath, count: agents.length }, 'Pulled agents');
      
      this.recordEvent({
        direction: 'pull',
        itemType: 'agent',
        path: agentsPath,
        status: 'success',
        details: { count: agents.length },
      });

      return {
        success: true,
        direction: 'pull',
        itemType: 'agent',
        path: agentsPath,
        changes: agents.length,
      };
    } catch (e) {
      return {
        success: false,
        direction: 'pull',
        itemType: 'agent',
        path: agentsPath,
        changes: 0,
        error: (e as Error).message,
      };
    }
  }

  /**
   * Pull skills from skills/ directory
   */
  private async pullSkills(): Promise<SyncOperationResult> {
    try {
      const skills = OrgOsAdapter.indexSkills(this.org.path);
      this.org.skills = skills;

      logger.info({ count: skills.length }, 'Pulled skills');
      
      this.recordEvent({
        direction: 'pull',
        itemType: 'skill',
        path: join(this.org.path, 'skills'),
        status: 'success',
        details: { count: skills.length },
      });

      return {
        success: true,
        direction: 'pull',
        itemType: 'skill',
        path: join(this.org.path, 'skills'),
        changes: skills.length,
      };
    } catch (e) {
      return {
        success: false,
        direction: 'pull',
        itemType: 'skill',
        path: join(this.org.path, 'skills'),
        changes: 0,
        error: (e as Error).message,
      };
    }
  }

  // ============================================================================
  // Push Operations
  // ============================================================================

  /**
   * Push task updates to org-os
   */
  private async pushTasks(): Promise<SyncOperationResult> {
    const tasksDir = join(this.org.path, 'tasks');
    
    try {
      if (!existsSync(tasksDir)) {
        mkdirSync(tasksDir, { recursive: true });
      }

      // In a full implementation, this would push actual task data
      logger.info({ path: tasksDir }, 'Pushed tasks directory');
      
      this.recordEvent({
        direction: 'push',
        itemType: 'task',
        path: tasksDir,
        status: 'success',
      });

      return {
        success: true,
        direction: 'push',
        itemType: 'task',
        path: tasksDir,
        changes: 0,
        message: 'Tasks directory synced',
      };
    } catch (e) {
      return {
        success: false,
        direction: 'push',
        itemType: 'task',
        path: tasksDir,
        changes: 0,
        error: (e as Error).message,
      };
    }
  }

  /**
   * Push memory updates to org-os
   */
  private async pushMemory(): Promise<SyncOperationResult> {
    const memoryDir = join(this.org.path, 'memory');
    
    try {
      if (!existsSync(memoryDir)) {
        return {
          success: true,
          direction: 'push',
          itemType: 'memory',
          path: memoryDir,
          changes: 0,
          message: 'No memory to push',
        };
      }

      // Memory is typically pulled, not pushed
      logger.debug({ path: memoryDir }, 'Memory directory exists');
      
      return {
        success: true,
        direction: 'push',
        itemType: 'memory',
        path: memoryDir,
        changes: 0,
        message: 'Memory push skipped (memory is pull-only)',
      };
    } catch (e) {
      return {
        success: false,
        direction: 'push',
        itemType: 'memory',
        path: memoryDir,
        changes: 0,
        error: (e as Error).message,
      };
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Record a sync event for history tracking.
   */
  private recordEvent(event: Omit<SyncEvent, 'id' | 'organizationId' | 'timestamp'>): void {
    const record: SyncEvent = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationId: this.org.identifier,
      timestamp: new Date(),
      ...event,
    };
    this.syncHistory.push(record);
    logger.debug({ eventId: record.id }, 'Recorded sync event');
  }

  /**
   * Get sync history for this organization.
   */
  getHistory(limit?: number): SyncEvent[] {
    if (limit) {
      return this.syncHistory.slice(-limit);
    }
    return [...this.syncHistory];
  }

  /**
   * Get the current organization.
   */
  getOrganization(): OrgOsOrganization {
    return this.org;
  }

  /**
   * Update the organization reference.
   */
  setOrganization(org: OrgOsOrganization): void {
    this.org = org;
    logger.info({ org: org.name }, 'Organization updated');
  }

  /**
   * Get current configuration.
   */
  getConfig(): SyncConfig {
    return { ...this.config };
  }

  /**
   * Update configuration.
   */
  setConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info({ config: this.config }, 'Configuration updated');
  }

  /**
   * Check if there are pending changes to sync.
   */
  async hasPendingChanges(): Promise<boolean> {
    const fedPath = join(this.org.path, 'federation.yaml');
    const agentsPath = join(this.org.path, 'AGENTS.md');

    try {
      const fedHash = await xxhash3(Buffer.from(readFileSync(fedPath, 'utf8')));
      const agentsHash = await xxhash3(Buffer.from(readFileSync(agentsPath, 'utf8')));

      return (
        this.lastHashes.get('federation') !== fedHash ||
        this.lastHashes.get('agents') !== agentsHash
      );
    } catch {
      return false;
    }
  }
}

export default SyncService;
