/**
 * KOI/OPAL Bridge - Main Entry Point
 * 
 * Unified interface for integrating OPAL (AI knowledge gardens) with KOI (distributed knowledge graphs)
 * within the Organizational OS framework.
 */

import { OpalAdapter } from './opal/adapter.js';
import { KoiBridge } from './koi/bridge.js';
import { UnifiedKnowledgeAPI } from './unified/knowledge-api.js';
import { SyncOrchestrator } from './unified/sync-orchestrator.js';

export interface KoiOpalBridgeConfig {
  // Organization OS paths
  orgOsPath: string;
  
  // OPAL configuration
  opal: {
    enabled: boolean;
    path: string;
    profile?: string;
  };
  
  // KOI configuration
  koi: {
    enabled: boolean;
    coordinatorUrl: string;
    nodeType: 'partial' | 'full';
    apiKey?: string;
  };
  
  // Sync configuration
  sync: {
    autoProcess: boolean;
    bidirectional: boolean;
    schedule?: string;  // Cron expression
  };
}

export interface BridgeStatus {
  opal: {
    status: 'connected' | 'disconnected' | 'error';
    version?: string;
    pendingItems: number;
  };
  koi: {
    status: 'connected' | 'disconnected' | 'error';
    nodeId?: string;
    neighbors: number;
  };
  sync: {
    lastSync: Date | null;
    syncInProgress: boolean;
  };
}

export class KoiOpalBridge {
  private config: KoiOpalBridgeConfig;
  private opalAdapter: OpalAdapter;
  private koiBridge: KoiBridge;
  private unifiedAPI: UnifiedKnowledgeAPI;
  private syncOrchestrator: SyncOrchestrator;

  constructor(config: KoiOpalBridgeConfig) {
    this.config = config;
    
    this.opalAdapter = new OpalAdapter({
      opalPath: config.opal.path,
      orgOsPath: config.orgOsPath,
      profile: config.opal.profile
    });
    
    this.koiBridge = new KoiBridge({
      coordinatorUrl: config.koi.coordinatorUrl,
      nodeType: config.koi.nodeType,
      apiKey: config.koi.apiKey
    });
    
    this.unifiedAPI = new UnifiedKnowledgeAPI({
      opal: this.opalAdapter,
      koi: this.koiBridge,
      orgOsPath: config.orgOsPath
    });
    
    this.syncOrchestrator = new SyncOrchestrator({
      opal: this.opalAdapter,
      koi: this.koiBridge,
      autoProcess: config.sync.autoProcess,
      bidirectional: config.sync.bidirectional
    });
  }

  // Access to subsystems
  get opal() { return this.opalAdapter; }
  get koi() { return this.koiBridge; }
  get unified() { return this.unifiedAPI; }

  /**
   * Initialize the bridge
   */
  async initialize(): Promise<void> {
    await this.opalAdapter.initialize();
    await this.koiBridge.initialize();
    await this.syncOrchestrator.initialize();
  }

  /**
   * Get current status of all components
   */
  async getStatus(): Promise<BridgeStatus> {
    return {
      opal: await this.opalAdapter.getStatus(),
      koi: await this.koiBridge.getStatus(),
      sync: this.syncOrchestrator.getStatus()
    };
  }

  /**
   * Start continuous sync (if configured)
   */
  async startSync(): Promise<void> {
    await this.syncOrchestrator.start();
  }

  /**
   * Stop sync
   */
  async stopSync(): Promise<void> {
    await this.syncOrchestrator.stop();
  }

  /**
   * Manual sync trigger
   */
  async sync(): Promise<void> {
    await this.syncOrchestrator.sync();
  }
}

// Convenience factory function
export async function createBridge(configPath: string): Promise<KoiOpalBridge> {
  const fs = await import('fs');
  const yaml = await import('yaml');
  
  const configFile = fs.readFileSync(configPath, 'utf-8');
  const config = yaml.parse(configFile) as KoiOpalBridgeConfig;
  
  const bridge = new KoiOpalBridge(config);
  await bridge.initialize();
  
  return bridge;
}
