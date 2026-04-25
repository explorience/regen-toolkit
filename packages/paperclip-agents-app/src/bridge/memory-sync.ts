/**
 * Memory Sync
 * Sync memory/ files between org-os and Paperclip database
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createLogger } from '../lib/logger.js';
import { Task, TaskStatus } from '../types.js';
import pg from 'pg';

const { Pool } = pg;
const logger = createLogger('memory-sync');

export interface MemorySyncOptions {
  orgPath: string;
  organizationId: string;
  dryRun?: boolean;
}

export class MemorySyncService {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  /**
   * Sync memory files to database
   */
  async syncMemoryFiles(orgPath: string, organizationId: string, dryRun = false): Promise<{
    synced: number;
    failed: number;
  }> {
    const memoryPath = join(orgPath, 'memory');
    let synced = 0;
    let failed = 0;

    if (!existsSync(memoryPath)) {
      logger.warn({ path: memoryPath }, 'memory/ directory not found');
      return { synced, failed };
    }

    try {
      // Get all memory files
      const entries = await readdir(memoryPath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) {
          continue;
        }

        try {
          if (!dryRun) {
            await this.syncMemoryFile(organizationId, join(memoryPath, entry.name));
          }
          synced++;
        } catch (error) {
          logger.warn({ file: entry.name, error }, 'Failed to sync memory file');
          failed++;
        }
      }

      logger.info({ synced, failed, path: memoryPath }, 'Memory sync complete');
      return { synced, failed };
    } catch (error) {
      logger.error({ path: memoryPath, error }, 'Memory sync failed');
      return { synced, failed };
    }
  }

  /**
   * Sync a single memory file
   */
  private async syncMemoryFile(organizationId: string, filePath: string): Promise<void> {
    const content = await readFile(filePath, 'utf-8');
    const fileName = filePath.split('/').pop() || '';
    
    // Parse memory entries from markdown
    const entries = this.parseMemoryEntries(content);

    for (const entry of entries) {
      // Check if entry exists
      const existing = await this.pool.query(
        'SELECT id FROM tasks WHERE organization_id = $1 AND title = $2',
        [organizationId, entry.title]
      );

      if (existing.rows.length > 0) {
        // Update existing task
        await this.pool.query(`
          UPDATE tasks SET
            description = $1,
            status = $2,
            metadata = metadata || $3,
            updated_at = NOW()
          WHERE id = $4
        `, [entry.description, entry.status, JSON.stringify({ source: 'memory', file: fileName }), existing.rows[0].id]);
      } else {
        // Create new task
        await this.pool.query(`
          INSERT INTO tasks (organization_id, title, description, status, metadata)
          VALUES ($1, $2, $3, $4, $5)
        `, [organizationId, entry.title, entry.description, entry.status, JSON.stringify({ source: 'memory', file: fileName })]);
      }
    }
  }

  /**
   * Parse memory entries from markdown
   */
  private parseMemoryEntries(content: string): Array<{
    title: string;
    description: string;
    status: TaskStatus;
  }> {
    const entries: Array<{ title: string; description: string; status: TaskStatus }> = [];
    const lines = content.split('\n');
    let currentEntry: { title: string; description: string; status: TaskStatus } | null = null;

    for (const line of lines) {
      // Look for task markers like - [ ] or - [x]
      const taskMatch = line.match(/^-\s*\[([ x])\]\s*(.+)/);
      if (taskMatch) {
        if (currentEntry) {
          entries.push(currentEntry);
        }
        
        const done = taskMatch[1].toLowerCase() === 'x';
        currentEntry = {
          title: taskMatch[2].trim(),
          description: '',
          status: done ? 'completed' : 'pending'
        };
      } else if (currentEntry && line.trim() && !line.startsWith('#')) {
        currentEntry.description += ' ' + line.trim();
      }
    }

    if (currentEntry) {
      entries.push(currentEntry);
    }

    return entries;
  }

  /**
   * Export database tasks to memory files
   */
  async exportToMemoryFiles(orgPath: string, organizationId: string): Promise<number> {
    const memoryPath = join(orgPath, 'memory');
    let exported = 0;

    // Get tasks grouped by status
    const pendingTasks = await this.pool.query(`
      SELECT title, description, created_at 
      FROM tasks 
      WHERE organization_id = $1 AND status = 'pending'
      ORDER BY created_at DESC
    `, [organizationId]);

    const completedTasks = await this.pool.query(`
      SELECT title, description, completed_at 
      FROM tasks 
      WHERE organization_id = $1 AND status = 'completed'
      ORDER BY completed_at DESC
      LIMIT 50
    `, [organizationId]);

    // Create memory directory if not exists
    if (!existsSync(memoryPath)) {
      await mkdir(memoryPath, { recursive: true });
    }

    // Write pending tasks
    if (pendingTasks.rows.length > 0) {
      const pendingContent = this.formatTasksAsMarkdown(pendingTasks.rows, 'pending');
      await writeFile(join(memoryPath, 'pending-tasks.md'), pendingContent, 'utf-8');
      exported++;
    }

    // Write completed tasks summary
    if (completedTasks.rows.length > 0) {
      const completedContent = this.formatTasksAsMarkdown(completedTasks.rows, 'completed');
      await writeFile(join(memoryPath, 'completed-tasks.md'), completedContent, 'utf-8');
      exported++;
    }

    logger.info({ exported, path: memoryPath }, 'Exported tasks to memory files');
    return exported;
  }

  /**
   * Format tasks as markdown
   */
  private formatTasksAsMarkdown(tasks: any[], status: string): string {
    let content = `# ${status.charAt(0).toUpperCase() + status.slice(1)} Tasks\n\n`;
    
    for (const task of tasks) {
      const checkmark = status === 'completed' ? 'x' : ' ';
      content += `- [${checkmark}] ${task.title}\n`;
      if (task.description) {
        content += `  ${task.description}\n`;
      }
    }

    return content;
  }
}

export default MemorySyncService;
