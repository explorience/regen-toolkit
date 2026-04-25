/**
 * Sync Orchestrator
 * Coordinates bidirectional sync between org-os files, database, and clients
 */

import { OrgOsAdapter } from '../bridge/org-os-adapter.js';
import { SyncService } from '../packages/org-os-bridge/src/sync.js';
import { OrgOsFileWatcher, FileChangeEvent } from './file-watcher.js';
import type { OrgOsOrganization } from '../packages/org-os-bridge/src/types.js';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

export interface SyncEvent {
  id: string;
  type: 'file_change' | 'api_update' | 'database_change' | 'sync_complete' | 'sync_error';
  category: 'agents' | 'skills' | 'memory' | 'federation' | 'config' | 'other';
  timestamp: Date;
  changes: number;
  source: 'filesystem' | 'api' | 'database' | 'unknown';
  details?: Record<string, unknown>;
  error?: string;
}

export interface SyncOrchestratorConfig {
  autoSync: boolean;
  debounceMs: number;
  enableFileWatcher: boolean;
  broadcastUpdates: boolean;
}

const DEFAULT_CONFIG: SyncOrchestratorConfig = {
  autoSync: true,
  debounceMs: 500,
  enableFileWatcher: true,
  broadcastUpdates: true,
};

/**
 * Orchestrates bidirectional synchronization
 */
export class SyncOrchestrator {
  private org: OrgOsOrganization;
  private syncService: SyncService;
  private fileWatcher: OrgOsFileWatcher | null = null;
  private config: SyncOrchestratorConfig;
  private syncHistory: SyncEvent[] = [];
  private isSyncing = false;
  private onSyncEvent?: (event: SyncEvent) => void;
  private onBroadcast?: (data: any) => void;

  constructor(
    org: OrgOsOrganization,
    config: Partial<SyncOrchestratorConfig> = {}
  ) {
    this.org = org;
    this.syncService = new SyncService(org, {
      autoPullAgents: true,
      autoPullSkills: true,
      autoPushTasks: false,
      conflictResolution: 'prefer-remote',
      dryRun: false,
    });
    this.config = { ...DEFAULT_CONFIG, ...config };

    logger.info({ org: org.name, config: this.config }, 'SyncOrchestrator initialized');
  }

  /**
   * Set callbacks for sync events
   */
  onSync(callback: (event: SyncEvent) => void) {
    this.onSyncEvent = callback;
  }

  onBroadcastNeeded(callback: (data: any) => void) {
    this.onBroadcast = callback;
  }

  /**
   * Start orchestration
   */
  start() {
    if (this.config.enableFileWatcher) {
      this.startFileWatcher();
    }

    logger.info('SyncOrchestrator started');
  }

  /**
   * Stop orchestration
   */
  stop() {
    if (this.fileWatcher) {
      this.fileWatcher.stop();
    }

    logger.info('SyncOrchestrator stopped');
  }

  /**
   * Start file watcher for auto-sync
   */
  private startFileWatcher() {
    this.fileWatcher = new OrgOsFileWatcher(this.org.path, {
      debounce: this.config.debounceMs,
      onFileChange: async (event) => {
        if (this.config.autoSync) {
          await this.handleFileChange(event);
        }
      },
      onError: (error) => {
        logger.error({ error }, 'File watcher error');
        this.recordSyncEvent({
          type: 'sync_error',
          category: 'other',
          source: 'filesystem',
          error: error.message,
          changes: 0,
        });
      },
    });

    this.fileWatcher.start();
    logger.info('File watcher started for auto-sync');
  }

  /**
   * Handle file change and trigger sync
   */
  private async handleFileChange(event: FileChangeEvent) {
    if (this.isSyncing) {
      logger.debug({ event }, 'Sync already in progress, queuing file change');
      return;
    }

    this.isSyncing = true;

    try {
      logger.info({ event }, 'File change detected, pulling from org-os');

      // Pull latest changes from org-os files
      const result = await this.syncService.pull();

      // Record sync event
      this.recordSyncEvent({
        type: 'file_change',
        category: event.category,
        source: 'filesystem',
        changes: result.pulled,
        details: {
          filePath: event.path,
          eventType: event.type,
        },
      });

      // Reload organization
      this.org = OrgOsAdapter.loadOrganization(this.org.path);

      // Broadcast to connected clients
      if (this.config.broadcastUpdates && this.onBroadcast) {
        this.onBroadcast({
          type: 'sync_complete',
          category: event.category,
          changes: result.pulled,
          timestamp: new Date(),
        });
      }

      logger.info({ pulled: result.pulled }, 'File change sync completed');
    } catch (error) {
      logger.error({ error }, 'File change sync failed');
      this.recordSyncEvent({
        type: 'sync_error',
        category: event.category,
        source: 'filesystem',
        error: error instanceof Error ? error.message : 'Unknown error',
        changes: 0,
      });
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Handle API-triggered sync
   */
  async syncFromApi(direction: 'pull' | 'push' = 'pull', category?: string) {
    if (this.isSyncing) {
      logger.warn('Sync already in progress');
      return;
    }

    this.isSyncing = true;

    try {
      logger.info({ direction, category }, 'API sync triggered');

      const result = direction === 'pull' 
        ? await this.syncService.pull()
        : await this.syncService.push();

      // Reload organization
      this.org = OrgOsAdapter.loadOrganization(this.org.path);

      this.recordSyncEvent({
        type: 'sync_complete',
        category: (category as any) || 'other',
        source: 'api',
        changes: direction === 'pull' ? result.pulled : result.pushed,
      });

      // Broadcast to clients
      if (this.config.broadcastUpdates && this.onBroadcast) {
        this.onBroadcast({
          type: 'sync_complete',
          direction,
          timestamp: new Date(),
        });
      }

      return result;
    } catch (error) {
      logger.error({ error }, 'API sync failed');
      this.recordSyncEvent({
        type: 'sync_error',
        category: (category as any) || 'other',
        source: 'api',
        error: error instanceof Error ? error.message : 'Unknown error',
        changes: 0,
      });
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get sync history
   */
  getSyncHistory(limit: number = 50): SyncEvent[] {
    return this.syncHistory.slice(-limit);
  }

  /**
   * Record a sync event
   */
  private recordSyncEvent(event: Omit<SyncEvent, 'id' | 'timestamp'>) {
    const syncEvent: SyncEvent = {
      ...event,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.syncHistory.push(syncEvent);

    // Keep only last 100 events in memory
    if (this.syncHistory.length > 100) {
      this.syncHistory.shift();
    }

    if (this.onSyncEvent) {
      this.onSyncEvent(syncEvent);
    }

    logger.debug({ event: syncEvent }, 'Sync event recorded');
  }

  /**
   * Get current organization
   */
  getOrganization(): OrgOsOrganization {
    return this.org;
  }

  /**
   * Check if syncing
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}
