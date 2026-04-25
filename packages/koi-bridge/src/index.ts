/**
 * KOI Bridge — Main Entry Point
 * 
 * Unified interface for KOI-net integration
 */

import { KoiBridge, KoiBridgeConfig } from './bridge.js';
import { RIDManager, RID } from './rid.js';
import { EventManager, KoiEvent } from './events.js';
import { GitSync, GitSyncConfig } from './git-sync.js';

export interface KoiBridgeFullConfig {
  koi: KoiBridgeConfig;
  git: GitSyncConfig;
  autoSync: boolean;
}

export class KoiBridgePackage {
  private bridge: KoiBridge;
  private eventManager: EventManager;
  private gitSync: GitSync;
  private config: KoiBridgeFullConfig;

  constructor(config: KoiBridgeFullConfig) {
    this.config = config;
    this.bridge = new KoiBridge(config.koi);
    this.eventManager = new EventManager();
    this.gitSync = new GitSync(config.git);
  }

  async initialize(): Promise<void> {
    await this.bridge.initialize();
    await this.gitSync.initialize();
    
    // Set up event handlers
    this.eventManager.on('NEW', async (event) => {
      console.log(`New entity: ${event.rid.identifier}`);
      await this.gitSync.handleIncomingEvent(event);
    });
  }

  async sync(): Promise<void> {
    // Sync git → KOI
    await this.gitSync.sync();
    
    // Poll KOI → git
    const events = await this.bridge.pollEvents();
    for (const event of events) {
      await this.eventManager.emit(event);
    }
  }

  async broadcast(event: KoiEvent): Promise<void> {
    await this.bridge.broadcast([event]);
  }

  async query(params: {
    type?: string;
    related_to?: RID;
  }): Promise<RID[]> {
    return this.bridge.query(params);
  }

  get status() {
    return {
      koi: this.bridge.getStatus(),
      git: 'active'
    };
  }
}

// Export all modules
export { KoiBridge, KoiBridgeConfig } from './bridge.js';
export { RIDManager, RID } from './rid.js';
export { EventManager, KoiEvent } from './events.js';
export { GitSync, GitSyncConfig } from './git-sync.js';
