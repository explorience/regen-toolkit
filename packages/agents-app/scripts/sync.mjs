#!/usr/bin/env node
/**
 * Task Synchronization
 * Bidirectional sync between org-os and Paperclip
 */

import { OrgOsAdapter } from '../src/bridge/orgOsAdapter.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface SyncState {
  lastSync: number;
  orgOsVersion: string;
  paperclipVersion: string;
  conflicts: any[];
}

class TaskSyncManager {
  private adapter: OrgOsAdapter;
  private stateFile: string;
  
  constructor(orgPath: string) {
    this.adapter = new OrgOsAdapter(orgPath);
    this.stateFile = join(orgPath, '.paperclip', 'sync-state.json');
  }
  
  async sync(): Promise<SyncState> {
    console.log('🔄 Starting task synchronization...');
    
    const state: SyncState = {
      lastSync: Date.now(),
      orgOsVersion: '1.0.0',
      paperclipVersion: '0.1.0',
      conflicts: [],
    };
    
    try {
      // 1. Load org-os tasks
      const orgTasks = this.adapter.loadTasks();
      console.log(`  Loaded ${orgTasks.length} org-os tasks`);
      
      // 2. Load Paperclip tasks (from mock API for now)
      const pcTasks = this.loadPaperclipTasks();
      console.log(`  Loaded ${pcTasks.length} Paperclip tasks`);
      
      // 3. Detect conflicts
      const conflicts = this.detectConflicts(orgTasks, pcTasks);
      if (conflicts.length > 0) {
        console.warn(`  ⚠️  Found ${conflicts.length} conflicts`);
        state.conflicts = conflicts;
      }
      
      // 4. Merge (last-write-wins for P0)
      const merged = this.merge(orgTasks, pcTasks);
      console.log(`  ✓ Merged ${merged.length} tasks`);
      
      // 5. Save sync state
      this.saveSyncState(state);
      console.log('✅ Sync complete');
      
      return state;
    } catch (e) {
      console.error('❌ Sync failed:', (e as Error).message);
      throw e;
    }
  }
  
  private loadPaperclipTasks(): any[] {
    // TODO: Query Paperclip API
    return [];
  }
  
  private detectConflicts(orgTasks: any[], pcTasks: any[]): any[] {
    const conflicts = [];
    
    for (const orgTask of orgTasks) {
      const pcTask = pcTasks.find(t => t.orgOsId === orgTask.id);
      if (pcTask && pcTask.lastModified > orgTask.lastModified) {
        conflicts.push({
          taskId: orgTask.id,
          orgOsVersion: orgTask.lastModified,
          paperclipVersion: pcTask.lastModified,
          resolution: 'paperclip-wins', // Last-write-wins
        });
      }
    }
    
    return conflicts;
  }
  
  private merge(orgTasks: any[], pcTasks: any[]): any[] {
    const merged = new Map();
    
    // Add org-os tasks
    for (const task of orgTasks) {
      merged.set(task.id, { ...task, source: 'org-os' });
    }
    
    // Merge/override with Paperclip tasks
    for (const task of pcTasks) {
      if (merged.has(task.orgOsId)) {
        merged.set(task.orgOsId, { ...merged.get(task.orgOsId), ...task, source: 'both' });
      }
    }
    
    return Array.from(merged.values());
  }
  
  private saveSyncState(state: SyncState): void {
    writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
  }
}

// CLI
const orgPath = process.cwd();
const sync = new TaskSyncManager(orgPath);

sync.sync()
  .then((state) => {
    console.log('\nSync State:', JSON.stringify(state, null, 2));
    process.exit(0);
  })
  .catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
  });
