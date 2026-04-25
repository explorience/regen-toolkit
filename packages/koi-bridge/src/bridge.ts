/**
 * KOI Bridge — HTTP Client for KOI-net Coordinator
 * 
 * Handles all HTTP communication with the KOI coordinator node.
 */

import fetch from 'node-fetch';

export interface KoiBridgeConfig {
  coordinatorUrl: string;
  nodeType: 'partial' | 'full';
  apiKey?: string;
  timeout?: number;
}

export interface RID {
  scheme: string;
  type: string;
  identifier: string;
  version?: string;
}

export interface KoiEvent {
  rid: RID;
  event_type: 'NEW' | 'UPDATE' | 'FORGET';
  manifest?: Manifest;
  contents?: any;
}

export interface Manifest {
  rid: RID;
  timestamp: string;
  sha256_hash: string;
  metadata?: Record<string, any>;
}

export class KoiBridge {
  private config: KoiBridgeConfig;
  private nodeId?: string;

  constructor(config: KoiBridgeConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Register with coordinator
    const response = await this.post('/nodes/register', {
      type: this.config.nodeType,
      capabilities: ['git-sync', 'event-subscription']
    });
    
    const data = await response.json();
    this.nodeId = data.node_id;
    
    console.log(`Registered with KOI as node: ${this.nodeId}`);
  }

  async broadcast(events: KoiEvent[]): Promise<void> {
    const response = await this.post('/events/broadcast', { events });
    
    if (!response.ok) {
      throw new Error(`Broadcast failed: ${response.statusText}`);
    }
    
    console.log(`Broadcasted ${events.length} events to KOI network`);
  }

  async pollEvents(): Promise<KoiEvent[]> {
    const response = await this.post('/events/poll', {
      node_id: this.nodeId,
      since: Date.now() - 3600000 // Last hour
    });
    
    if (!response.ok) {
      throw new Error(`Poll failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.events || [];
  }

  async fetchBundles(rids: RID[]): Promise<any[]> {
    const response = await this.post('/bundles/fetch', { rids });
    
    if (!response.ok) {
      throw new Error(`Fetch bundles failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.bundles || [];
  }

  async query(params: {
    type?: string;
    scheme?: string;
    related_to?: RID;
    limit?: number;
  }): Promise<RID[]> {
    const response = await this.post('/query', params);
    
    if (!response.ok) {
      throw new Error(`Query failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.rids || [];
  }

  async getStatus(): Promise<{
    connected: boolean;
    nodeId?: string;
    coordinatorVersion?: string;
    peers: number;
  }> {
    try {
      const response = await this.get('/status');
      const data = await response.json();
      
      return {
        connected: true,
        nodeId: this.nodeId,
        coordinatorVersion: data.version,
        peers: data.peers || 0
      };
    } catch (error) {
      return {
        connected: false,
        peers: 0
      };
    }
  }

  private async post(endpoint: string, body: any): Promise<any> {
    const url = `${this.config.coordinatorUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      timeout: this.config.timeout || 30000
    });
  }

  private async get(endpoint: string): Promise<any> {
    const url = `${this.config.coordinatorUrl}${endpoint}`;
    
    const headers: Record<string, string> = {};
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    return fetch(url, {
      method: 'GET',
      headers,
      timeout: this.config.timeout || 30000
    });
  }
}
