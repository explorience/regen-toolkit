/**
 * Bidirectional Sync Service
 * Sync data between org-os filesystem and Paperclip database
 */

import { readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';
import { createLogger } from '../lib/logger.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';
import { SyncResult, SyncOptions, SyncError, SyncStatus } from '../types.js';
import pg from 'pg';

const { Pool } = pg;
const logger = createLogger('syncer');

export class SyncService {
  private adapter: any;
  private pool: pg.Pool;

  constructor(adapter: any, pool: pg.Pool) {
    this.adapter = adapter;
    this.pool = pool;
  }

  /**
   * Perform bidirectional sync
   */
  async sync(organizationId: string, options: SyncOptions): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: SyncError[] = [];
    let synced = 0;

    logger.info({ organizationId, options }, 'Starting sync');

    try {
      // Get organization path
      const orgResult = await this.pool.query(
        'SELECT path FROM organizations WHERE id = $1',
        [organizationId]
      );

      if (orgResult.rows.length === 0) {
        throw new PaperclipError(
          ErrorCode.NOT_FOUND,
          `Organization not found: ${organizationId}`
        );
      }

      const orgPath = orgResult.rows[0].path;
      const targets = options.targets || ['federation.yaml', 'AGENTS.md', 'skills/', 'memory/'];

      // Sync each target
      for (const target of targets) {
        try {
          await this.syncTarget(organizationId, orgPath, target, options);
          synced++;
        } catch (error) {
          errors.push({
            path: target,
            error: error instanceof Error ? error.message : 'Unknown error',
            code: ErrorCode.SYNC_FAILED
          });
        }
      }

      // Update sync state
      await this.updateSyncState(organizationId, targets.join(','), 'synced');

      const duration = Date.now() - startTime;
      
      logger.info({ synced, errors: errors.length, duration }, 'Sync completed');

      return {
        success: errors.length === 0,
        synced,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
        duration
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ error: errorMessage }, 'Sync failed');

      return {
        success: false,
        synced: 0,
        failed: targets?.length || 0,
        errors: [{
          path: 'sync',
          error: errorMessage,
          code: ErrorCode.SYNC_FAILED
        }],
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Sync a single target
   */
  private async syncTarget(
    organizationId: string,
    orgPath: string,
    target: string,
    options: SyncOptions
  ): Promise<void> {
    const targetPath = join(orgPath, target);

    if (target === 'federation.yaml') {
      await this.syncFederation(organizationId, targetPath, options);
    } else if (target === 'AGENTS.md') {
      await this.syncAgents(organizationId, targetPath, options);
    } else if (target.startsWith('skills/')) {
      await this.syncSkills(organizationId, targetPath, options);
    } else if (target.startsWith('memory/')) {
      await this.syncMemory(organizationId, targetPath, options);
    }
  }

  /**
   * Sync federation.yaml
   */
  private async syncFederation(
    organizationId: string,
    path: string,
    options: SyncOptions
  ): Promise<void> {
    if (options.dryRun) {
      logger.info({ path }, 'Dry run: would sync federation.yaml');
      return;
    }

    try {
      const content = await readFile(path, 'utf-8');
      const YAML = (await import('yaml')).default;
      const federation = YAML.parse(content);

      // Update organization in database
      await this.pool.query(`
        UPDATE organizations SET
          name = $1,
          type = $2,
          emoji = $3,
          dao_uri = $4,
          chain = $5,
          safe_address = $6,
          updated_at = NOW()
        WHERE id = $7
      `, [
        federation.identity?.name,
        federation.identity?.type,
        federation.identity?.emoji,
        federation.identity?.daoURI,
        federation.identity?.chain,
        federation.identity?.safe,
        organizationId
      ]);

      logger.info({ path }, 'Federation synced');
    } catch (error) {
      throw new PaperclipError(
        ErrorCode.SYNC_FAILED,
        `Failed to sync federation.yaml: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { path }
      );
    }
  }

  /**
   * Sync AGENTS.md
   */
  private async syncAgents(
    organizationId: string,
    path: string,
    options: SyncOptions
  ): Promise<void> {
    if (options.dryRun) {
      logger.info({ path }, 'Dry run: would sync AGENTS.md');
      return;
    }

    try {
      const content = await readFile(path, 'utf-8');
      const agents = this.parseAgentsMarkdown(content);

      // Get existing agents
      const existingResult = await this.pool.query(
        'SELECT name FROM agents WHERE organization_id = $1',
        [organizationId]
      );
      const existingAgents = new Set(existingResult.rows.map(r => r.name));

      // Upsert agents
      for (const agent of agents) {
        if (existingAgents.has(agent.name)) {
          // Update
          await this.pool.query(`
            UPDATE agents SET
              description = $1,
              capabilities = $2,
              skills = $3,
              updated_at = NOW()
            WHERE organization_id = $4 AND name = $5
          `, [agent.description, agent.capabilities, agent.skills, organizationId, agent.name]);
        } else {
          // Insert
          await this.pool.query(`
            INSERT INTO agents (organization_id, name, description, capabilities, skills, status)
            VALUES ($1, $2, $3, $4, $5, 'active')
          `, [organizationId, agent.name, agent.description, agent.capabilities, agent.skills]);
        }
        existingAgents.delete(agent.name);
      }

      // Remove agents that no longer exist in AGENTS.md
      for (const name of existingAgents) {
        await this.pool.query(
          'DELETE FROM agents WHERE organization_id = $1 AND name = $2',
          [organizationId, name]
        );
      }

      logger.info({ path, count: agents.length }, 'Agents synced');
    } catch (error) {
      throw new PaperclipError(
        ErrorCode.SYNC_FAILED,
        `Failed to sync AGENTS.md: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { path }
      );
    }
  }

  /**
   * Sync skills directory
   */
  private async syncSkills(
    organizationId: string,
    path: string,
    options: SyncOptions
  ): Promise<void> {
    if (options.dryRun) {
      logger.info({ path }, 'Dry run: would sync skills/');
      return;
    }

    // Skills sync is handled by org-os-adapter
    logger.info({ path }, 'Skills sync skipped (handled by adapter)');
  }

  /**
   * Sync memory directory
   */
  private async syncMemory(
    organizationId: string,
    path: string,
    options: SyncOptions
  ): Promise<void> {
    if (options.dryRun) {
      logger.info({ path }, 'Dry run: would sync memory/');
      return;
    }

    // Memory sync is handled by org-os-adapter
    logger.info({ path }, 'Memory sync skipped (handled by adapter)');
  }

  /**
   * Update sync state in database
   */
  private async updateSyncState(
    organizationId: string,
    sourcePath: string,
    status: SyncStatus,
    error?: string
  ): Promise<void> {
    await this.pool.query(`
      INSERT INTO sync_state (organization_id, source_path, last_sync_at, status, error)
      VALUES ($1, $2, NOW(), $3, $4)
      ON CONFLICT (organization_id, source_path)
      DO UPDATE SET
        last_sync_at = NOW(),
        status = $3,
        error = $4,
        updated_at = NOW()
    `, [organizationId, sourcePath, status, error]);
  }

  /**
   * Parse agents from markdown
   */
  private parseAgentsMarkdown(content: string): any[] {
    const agents: any[] = [];
    const lines = content.split('\n');
    let currentAgent: any = null;

    for (const line of lines) {
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        if (currentAgent) {
          agents.push(currentAgent);
        }
        currentAgent = {
          name: line.replace('## ', '').trim(),
          description: '',
          capabilities: [],
          skills: []
        };
      } else if (currentAgent && line.trim()) {
        currentAgent.description += ' ' + line.trim();
      }
    }

    if (currentAgent) {
      agents.push(currentAgent);
    }

    return agents;
  }
}

export default SyncService;
