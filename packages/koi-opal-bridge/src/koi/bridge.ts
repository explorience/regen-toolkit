/**
 * KOI Bridge - Interface to KOI-net Protocol
 * 
 * TypeScript HTTP client for KOI-net distributed knowledge graphs
 */

import fetch from 'node-fetch';

export interface KoiConfig {
  coordinatorUrl: string;
  nodeType: 'partial' | 'full';
  apiKey?: string;
}

export interface KoiStatus {
  status: 'connected' | 'disconnected' | 'error';
  nodeId?: string;
  neighbors: number;
  lastError?: string;
}

export interface RID {
  scheme: string;
  type: string;
  identifier: string;
  version?: string;
}

export interface Manifest {
  rid: RID;
  timestamp: string;
  sha256_hash: string;
  metadata?: Record<string, any>;
}

export interface Bundle {
  rid: RID;
  manifest: Manifest;
  contents: any;
}

export interface KoiEvent {
  rid: RID;
  event_type: 'NEW' | 'UPDATE' | 'FORGET';
  manifest?: Manifest;
  contents?: any;
}

export class KoiBridge {
  private config: KoiConfig;
  private nodeId?: string;
  private eventQueue: KoiEvent[] = [];

  constructor(config: KoiConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Register with coordinator
    if (this.config.nodeType === 'full') {
      await this.registerFullNode();
    } else {
      await this.registerPartialNode();
    }
  }

  async getStatus(): Promise<KoiStatus> {
    try {
      const response = await this.fetchFromCoordinator('/status');
      const data = await response.json();
      
      return {
        status: 'connected',
        nodeId: this.nodeId,
        neighbors: data.neighbors || 0
      };
    } catch (error) {
      return {
        status: 'error',
        neighbors: 0,
        lastError: String(error)
      };
    }
  }

  /**
   * Broadcast event to KOI network
   * POST /events/broadcast
   */
  async broadcast(event: KoiEvent): Promise<void> {
    const response = await this.fetchFromCoordinator('/events/broadcast', {
      method: 'POST',
      body: JSON.stringify({ events: [event] })
    });
    
    if (!response.ok) {
      throw new Error(`Broadcast failed: ${response.statusText}`);
    }
  }

  /**
   * Poll events from coordinator (for partial nodes)
   * POST /events/poll
   */
  async pollEvents(): Promise<KoiEvent[]> {
    const response = await this.fetchFromCoordinator('/events/poll', {
      method: 'POST',
      body: JSON.stringify({ rid: this.nodeId })
    });
    
    if (!response.ok) {
      throw new Error(`Poll failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.events || [];
  }

  /**
   * Fetch bundles from coordinator
   * POST /bundles/fetch
   */
  async fetchBundles(rids: RID[]): Promise<Bundle[]> {
    const response = await this.fetchFromCoordinator('/bundles/fetch', {
      method: 'POST',
      body: JSON.stringify({ rids })
    });
    
    if (!response.ok) {
      throw new Error(`Fetch bundles failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.bundles || [];
  }

  /**
   * Fetch manifests from coordinator
   * POST /manifests/fetch
   */
  async fetchManifests(rids: RID[]): Promise<Manifest[]> {
    const response = await this.fetchFromCoordinator('/manifests/fetch', {
      method: 'POST',
      body: JSON.stringify({ rids })
    });
    
    if (!response.ok) {
      throw new Error(`Fetch manifests failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.manifests || [];
  }

  /**
   * Query KOI network for related knowledge
   */
  async query(params: {
    type?: string;
    related_to?: RID;
    network_scope?: 'local' | 'federated' | 'global';
  }): Promise<Bundle[]> {
    // Construct query RID
    const queryRid: RID = {
      scheme: 'koinet',
      type: 'query',
      identifier: this.generateQueryId(params)
    };
    
    // Broadcast query event
    await this.broadcast({
      rid: queryRid,
      event_type: 'NEW',
      contents: params
    });
    
    // In real implementation, would wait for responses
    // For now, return mock results
    return [];
  }

  /**
   * Generate RID for org-os entity
   */
  generateRID(type: string, identifier: string, metadata?: Record<string, any>): RID {
    return {
      scheme: 'orgos',
      type,
      identifier: identifier.toLowerCase().replace(/\s+/g, '-'),
      version: metadata?.version
    };
  }

  private async fetchFromCoordinator(endpoint: string, options?: any): Promise<any> {
    const url = `${this.config.coordinatorUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers
      }
    });
  }

  private async registerFullNode(): Promise<void> {
    // Full node registration
    this.nodeId = `koinet:node:orgos:${Date.now()}`;
  }

  private async registerPartialNode(): Promise<void> {
    // Partial node registration
    this.nodeId = `koinet:node:orgos-partial:${Date.now()}`;
  }

  private generateQueryId(params: any): string {
    return `${params.type || 'all'}-${Date.now()}`;
  }
}
