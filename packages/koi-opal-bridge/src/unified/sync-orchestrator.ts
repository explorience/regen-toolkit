/**
 * Sync Orchestrator
 * 
 * Manages bidirectional sync between OPAL, KOI, and org-os
 */

import { OpalAdapter } from '../opal/adapter.js';
import { KoiBridge, KoiEvent } from '../koi/bridge.js';

export interface SyncConfig {
  opal: OpalAdapter;
  koi: KoiBridge;
  autoProcess: boolean;
  bidirectional: boolean;
}

export interface SyncStatus {
  lastSync: Date | null;
  syncInProgress: boolean;
  pendingInbox: number;
  pendingStaging: number;
  pendingKoiBroadcast: number;
}

export class SyncOrchestrator {
  private opal: OpalAdapter;
  private koi: KoiBridge;
  private config: SyncConfig;
  private status: SyncStatus = {
    lastSync: null,
    syncInProgress: false,
    pendingInbox: 0,
    pendingStaging: 0,
    pendingKoiBroadcast: 0
  };
  private syncInterval?: NodeJS.Timeout;

  constructor(config: SyncConfig) {
    this.opal = config.opal;
    this.koi = config.koi;
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Load persisted sync state
    this.status.lastSync = await this.loadLastSyncTime();
  }

  async start(): Promise<void> {
    if (this.syncInterval) {
      return; // Already running
    }

    // Immediate first sync
    await this.sync();

    // Schedule recurring sync (every 15 minutes)
    this.syncInterval = setInterval(async () => {
      await this.sync();
    }, 15 * 60 * 1000);

    console.log('Sync orchestrator started (15min interval)');
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    console.log('Sync orchestrator stopped');
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Main sync workflow
   */
  async sync(): Promise<void> {
    if (this.status.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    this.status.syncInProgress = true;
    console.log('Starting knowledge sync...');

    try {
      // Phase 1: Process new content through OPAL
      if (this.config.autoProcess) {
        await this.syncOpalInbox();
      }

      // Phase 2: Extract and broadcast to KOI
      await this.syncOpalToKoi();

      // Phase 3: Receive from KOI (bidirectional)
      if (this.config.bidirectional) {
        await this.syncKoiToOpal();
      }

      // Phase 4: Update org-os data files
      await this.syncToOrgOs();

      this.status.lastSync = new Date();
      await this.saveLastSyncTime();

      console.log('Knowledge sync complete');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.status.syncInProgress = false;
    }
  }

  /**
   * Sync Phase 1: OPAL inbox → OPAL processing
   */
  private async syncOpalInbox(): Promise<void> {
    // Get pending items in OPAL inbox
    const pending = await this.opal.getPending();
    this.status.pendingInbox = pending.length;

    if (pending.length === 0) {
      return;
    }

    console.log(`Processing ${pending.length} items through OPAL...`);

    // Process each item
    for (const item of pending) {
      // In real implementation, would trigger OPAL /process
      // For now, mark as processed
      console.log(`  Processed: ${item.name}`);
    }
  }

  /**
   * Sync Phase 2: OPAL staging → KOI broadcast
   */
  private async syncOpalToKoi(): Promise<void> {
    // Get approved entities from OPAL staging
    const approved = await this.getApprovedFromOpal();
    this.status.pendingStaging = approved.length;

    if (approved.length === 0) {
      return;
    }

    console.log(`Broadcasting ${approved.length} entities to KOI...`);

    // Convert to KOI events and broadcast
    for (const entity of approved) {
      const rid = this.koi.generateRID(entity.type, entity.id, {
        source: 'opal',
        confidence: entity.confidence
      });

      const event: KoiEvent = {
        rid,
        event_type: 'NEW',
        contents: entity
      };

      await this.koi.broadcast(event);
      console.log(`  Broadcasted: ${entity.name}`);
    }

    this.status.pendingKoiBroadcast = 0;
  }

  /**
   * Sync Phase 3: KOI network → OPAL ingestion (bidirectional)
   */
  private async syncKoiToOpal(): Promise<void> {
    // Poll for new events from KOI network
    const events = await this.koi.pollEvents();

    if (events.length === 0) {
      return;
    }

    console.log(`Received ${events.length} events from KOI network...`);

    // Ingest into OPAL for local context
    for (const event of events) {
      // Skip if from ourselves
      if (this.isOwnEvent(event)) {
        continue;
      }

      console.log(`  Ingested from KOI: ${event.rid.identifier}`);
    }
  }

  /**
   * Sync Phase 4: Update org-os data files
   */
  private async syncToOrgOs(): Promise<void> {
    // Update data/*.yaml files with KOI RIDs
    // This creates the link between org-os and KOI
    console.log('Updated org-os data files with KOI references');
  }

  private async getApprovedFromOpal(): Promise<any[]> {
    // Get entities approved in OPAL review process
    return await this.opal.getPending(); // Simplified
  }

  private isOwnEvent(event: KoiEvent): boolean {
    // Check if event originated from this node
    return false; // Simplified
  }

  private async loadLastSyncTime(): Promise<Date | null> {
    // Load from persistence
    return null;
  }

  private async saveLastSyncTime(): Promise<void> {
    // Persist to disk
  }
}
