/**
 * File Watcher Service
 * Monitors org-os files for changes and triggers sync
 */

import { watch, FSWatcher } from 'chokidar';
import { resolve } from 'path';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
  path: string;
  timestamp: Date;
  category: 'agents' | 'skills' | 'memory' | 'federation' | 'config' | 'other';
}

export interface FileWatcherOptions {
  debounce?: number;
  ignored?: string | string[];
  onFileChange?: (event: FileChangeEvent) => void;
  onError?: (error: Error) => void;
}

/**
 * File watcher that monitors org-os directory structure
 */
export class OrgOsFileWatcher {
  private watcher: FSWatcher | null = null;
  private workspaceRoot: string;
  private debounceTimer: Map<string, NodeJS.Timeout> = new Map();
  private debounceMs: number;
  private onFileChange?: (event: FileChangeEvent) => void;
  private onError?: (error: Error) => void;

  constructor(workspaceRoot: string, options: FileWatcherOptions = {}) {
    this.workspaceRoot = workspaceRoot;
    this.debounceMs = options.debounce || 300;
    this.onFileChange = options.onFileChange;
    this.onError = options.onError;
  }

  /**
   * Start watching the workspace
   */
  start() {
    const watchPaths = [
      resolve(this.workspaceRoot, 'AGENTS.md'),
      resolve(this.workspaceRoot, 'MASTERPROMPT.md'),
      resolve(this.workspaceRoot, 'federation.yaml'),
      resolve(this.workspaceRoot, 'skills/**/*'),
      resolve(this.workspaceRoot, 'memory/**/*'),
      resolve(this.workspaceRoot, 'data/**/*'),
      resolve(this.workspaceRoot, 'packages/**/*'),
    ];

    const ignored = [
      '**/node_modules',
      '**/.git',
      '**/dist/**',
      '**/.*',
      ...((Array.isArray(this.options?.ignored) ? this.options.ignored : [this.options?.ignored]) || []),
    ];

    this.watcher = watch(watchPaths, {
      ignored,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100,
      },
    });

    this.watcher.on('all', (eventType, filePath) => {
      this.handleFileChange(eventType as any, filePath);
    });

    this.watcher.on('error', (error) => {
      logger.error({ error }, 'File watcher error');
      if (this.onError) {
        this.onError(error);
      }
    });

    logger.info({ paths: watchPaths }, 'File watcher started');
  }

  /**
   * Stop watching
   */
  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      logger.info('File watcher stopped');
    }
  }

  /**
   * Handle file change with debouncing
   */
  private handleFileChange(eventType: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir', filePath: string) {
    // Clear existing timer for this file
    if (this.debounceTimer.has(filePath)) {
      clearTimeout(this.debounceTimer.get(filePath)!);
    }

    // Set new debounced timer
    const timer = setTimeout(() => {
      const category = this.categorizeFile(filePath);
      const event: FileChangeEvent = {
        type: eventType,
        path: filePath,
        timestamp: new Date(),
        category,
      };

      logger.debug({ event }, 'File changed (debounced)');

      if (this.onFileChange) {
        try {
          this.onFileChange(event);
        } catch (error) {
          logger.error({ error }, 'Error handling file change');
        }
      }

      this.debounceTimer.delete(filePath);
    }, this.debounceMs);

    this.debounceTimer.set(filePath, timer);
  }

  /**
   * Categorize file by path
   */
  private categorizeFile(filePath: string): FileChangeEvent['category'] {
    if (filePath.includes('AGENTS.md')) return 'agents';
    if (filePath.includes('skills/')) return 'skills';
    if (filePath.includes('memory/')) return 'memory';
    if (filePath.includes('federation.yaml')) return 'federation';
    if (filePath.includes('MASTERPROMPT.md') || filePath.includes('SOUL.md')) return 'config';
    return 'other';
  }

  /**
   * Check if watching
   */
  isWatching(): boolean {
    return this.watcher !== null;
  }

  private options?: FileWatcherOptions;
}

/**
 * Create and manage file watcher with auto-sync
 */
export function createAutoSyncWatcher(
  workspaceRoot: string,
  onSync: (event: FileChangeEvent) => Promise<void>,
  options?: FileWatcherOptions
) {
  const watcher = new OrgOsFileWatcher(workspaceRoot, {
    ...options,
    onFileChange: async (event) => {
      logger.info({ event }, 'Auto-sync triggered by file change');
      try {
        await onSync(event);
      } catch (error) {
        logger.error({ error }, 'Auto-sync failed');
      }
    },
  });

  watcher.start();
  return watcher;
}
