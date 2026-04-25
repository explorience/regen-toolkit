/**
 * Git Sync — Bridge Between Git and KOI
 * 
 * Automatically syncs Git commits with KOI network.
 */

import { execSync } from 'child_process';
import { KoiBridge } from './bridge.js';
import { EventManager } from './events.js';
import { RIDManager } from './rid.js';

export interface GitSyncConfig {
  repoPath: string;
  koiBridge: KoiBridge;
  autoSync: boolean;
  syncInterval: number; // milliseconds
}

export class GitSync {
  private config: GitSyncConfig;
  private eventManager: EventManager;
  private lastSyncCommit?: string;

  constructor(config: GitSyncConfig) {
    this.config = config;
    this.eventManager = new EventManager();
  }

  /**
   * Initialize git hooks for auto-sync
   */
  async initialize(): Promise<void> {
    if (this.config.autoSync) {
      await this.installGitHooks();
    }
    
    // Get last commit
    this.lastSyncCommit = this.getLastCommit();
  }

  /**
   * Sync changes since last sync
   */
  async sync(): Promise<void> {
    const currentCommit = this.getLastCommit();
    
    if (currentCommit === this.lastSyncCommit) {
      console.log('No changes to sync');
      return;
    }

    // Get changed files
    const changedFiles = this.getChangedFiles(this.lastSyncCommit, currentCommit);
    
    // Process knowledge files
    const knowledgeFiles = changedFiles.filter(f => 
      f.startsWith('knowledge/') || 
      f.startsWith('data/')
    );

    for (const file of knowledgeFiles) {
      await this.syncFile(file);
    }

    this.lastSyncCommit = currentCommit;
    console.log(`Synced ${knowledgeFiles.length} files to KOI`);
  }

  /**
   * Handle incoming KOI events (update local git)
   */
  async handleIncomingEvent(event: any): Promise<void> {
    // Parse event and apply to local knowledge
    console.log(`Applying incoming event: ${event.rid}`);
    
    // In production: update files, commit, handle conflicts
    // This is a skeleton implementation
  }

  private async syncFile(filePath: string): Promise<void> {
    try {
      const content = this.readFile(filePath);
      const rid = this.generateRIDForFile(filePath);
      
      // Create KOI event
      const event = EventManager.createNewEvent(
        rid,
        {
          file: filePath,
          content: content,
          commit: this.getLastCommit()
        },
        {
          source: 'git-sync',
          repo: this.getRepoName()
        }
      );

      // Emit locally
      await this.eventManager.emit(event);
      
    } catch (error) {
      console.error(`Failed to sync ${filePath}: ${error}`);
    }
  }

  private generateRIDForFile(filePath: string): any {
    // Generate RID based on file path
    const cleanPath = filePath
      .replace(/\//g, '-')
      .replace(/\.[^.]+$/, '');
    
    return RIDManager.generateOrgOSRID('file', cleanPath);
  }

  private async installGitHooks(): Promise<void> {
    // Install post-commit hook for auto-sync
    const hookPath = `${this.config.repoPath}/.git/hooks/post-commit`;
    
    const hookContent = `#!/bin/bash
# KOI auto-sync hook
cd "${this.config.repoPath}"
npx koi-bridge sync || true
`;
    
    // Write hook
    const fs = await import('fs');
    fs.writeFileSync(hookPath, hookContent);
    fs.chmodSync(hookPath, '755');
    
    console.log('Installed git hooks for auto-sync');
  }

  private getLastCommit(): string {
    return execSync('git rev-parse HEAD', {
      cwd: this.config.repoPath,
      encoding: 'utf8'
    }).trim();
  }

  private getChangedFiles(fromCommit: string | undefined, toCommit: string): string[] {
    if (!fromCommit) {
      // First sync - get all tracked files
      return execSync('git ls-files', {
        cwd: this.config.repoPath,
        encoding: 'utf8'
      }).trim().split('\n');
    }

    return execSync(`git diff --name-only ${fromCommit}..${toCommit}`, {
      cwd: this.config.repoPath,
      encoding: 'utf8'
    }).trim().split('\n').filter(f => f.length > 0);
  }

  private readFile(filePath: string): string {
    const fs = require('fs');
    return fs.readFileSync(
      `${this.config.repoPath}/${filePath}`,
      'utf8'
    );
  }

  private getRepoName(): string {
    return execSync('basename $(git rev-parse --show-toplevel)', {
      cwd: this.config.repoPath,
      encoding: 'utf8'
    }).trim();
  }
}
