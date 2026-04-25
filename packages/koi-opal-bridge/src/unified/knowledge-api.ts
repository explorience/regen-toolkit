/**
 * Unified Knowledge API
 * 
 * High-level API combining OPAL, KOI, and org-os native data
 */

import { OpalAdapter } from '../opal/adapter.js';
import { KoiBridge } from '../koi/bridge.js';

export interface UnifiedSearchParams {
  query: string;
  sources?: ('opal' | 'koi' | 'orgos')[];
  include_related?: boolean;
  filters?: {
    type?: string;
    date_range?: { start: Date; end: Date };
    author?: string;
  };
}

export interface KnowledgeResult {
  id: string;
  title: string;
  type: string;
  content: string;
  source: 'opal' | 'koi' | 'orgos';
  relevance: number;
  metadata: {
    created?: Date;
    author?: string;
    tags?: string[];
    rid?: any;
  };
  related?: string[];
}

export class UnifiedKnowledgeAPI {
  private opal: OpalAdapter;
  private koi: KoiBridge;
  private orgOsPath: string;

  constructor(config: {
    opal: OpalAdapter;
    koi: KoiBridge;
    orgOsPath: string;
  }) {
    this.opal = config.opal;
    this.koi = config.koi;
    this.orgOsPath = config.orgOsPath;
  }

  /**
   * Search across all knowledge sources
   */
  async search(params: UnifiedSearchParams): Promise<KnowledgeResult[]> {
    const results: KnowledgeResult[] = [];
    const sources = params.sources || ['opal', 'koi', 'orgos'];

    // Search OPAL
    if (sources.includes('opal')) {
      const opalResults = await this.opal.search(params.query);
      results.push(...opalResults.map(r => this.transformOpalResult(r)));
    }

    // Search KOI
    if (sources.includes('koi')) {
      const koiResults = await this.koi.query({
        network_scope: 'federated'
      });
      results.push(...koiResults.map(r => this.transformKoiResult(r)));
    }

    // Search org-os native
    if (sources.includes('orgos')) {
      const orgResults = await this.searchOrgOs(params);
      results.push(...orgResults);
    }

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Generate AI context for prompting
   */
  async generateAIContext(
    topic: string,
    options: {
      maxDocuments?: number;
      sources?: ('opal' | 'koi' | 'orgos')[];
    } = {}
  ): Promise<string> {
    const searchResults = await this.search({
      query: topic,
      sources: options.sources,
      include_related: true
    });

    const topResults = searchResults.slice(0, options.maxDocuments || 10);

    // Build context string
    let context = `## Knowledge Context for: ${topic}\n\n`;
    
    for (const result of topResults) {
      context += `### ${result.title}\n`;
      context += `Source: ${result.source} | Type: ${result.type}\n`;
      context += `${result.content}\n\n`;
    }

    return context;
  }

  /**
   * Get entity by RID (universal identifier)
   */
  async getByRID(rid: any): Promise<KnowledgeResult | null> {
    // Try KOI first (federated lookup)
    try {
      const bundles = await this.koi.fetchBundles([rid]);
      if (bundles.length > 0) {
        return this.transformKoiResult(bundles[0]);
      }
    } catch {
      // Continue to other sources
    }

    // Try local org-os
    return this.getOrgOsEntity(rid);
  }

  /**
   * Get organization knowledge graph
   */
  async getOrganizationGraph(orgId: string): Promise<{
    nodes: any[];
    edges: any[];
  }> {
    // Query KOI for organization subgraph
    const bundles = await this.koi.query({
      type: 'org',
      network_scope: 'local'
    });

    const nodes = bundles.map(b => ({
      id: b.rid.identifier,
      label: b.contents.name || b.rid.identifier,
      type: b.rid.type
    }));

    const edges: any[] = [];  // Would derive from relationships

    return { nodes, edges };
  }

  /**
   * Track recent activity across all sources
   */
  async getRecentActivity(
    options: {
      since?: Date;
      limit?: number;
    } = {}
  ): Promise<{
    opal: any[];
    koi: KoiEvent[];
    orgos: any[];
  }> {
    const since = options.since || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      opal: [],  // Would query OPAL activity
      koi: [],   // Would poll KOI events
      orgos: []  // Would query git history
    };
  }

  private transformOpalResult(raw: any): KnowledgeResult {
    return {
      id: raw.id,
      title: raw.name,
      type: raw.type,
      content: raw.description || '',
      source: 'opal',
      relevance: raw.confidence || 0.5,
      metadata: {
        author: raw.source,
        tags: [raw.type]
      }
    };
  }

  private transformKoiResult(bundle: any): KnowledgeResult {
    return {
      id: bundle.rid.identifier,
      title: bundle.contents.name || bundle.rid.identifier,
      type: bundle.rid.type,
      content: JSON.stringify(bundle.contents),
      source: 'koi',
      relevance: 0.8,
      metadata: {
        rid: bundle.rid,
        created: new Date(bundle.manifest.timestamp)
      }
    };
  }

  private async searchOrgOs(params: UnifiedSearchParams): Promise<KnowledgeResult[]> {
    // Search through org-os data files
    const results: KnowledgeResult[] = [];
    
    // Would implement: search data/*.yaml, content/*.md
    // For now, placeholder
    
    return results;
  }

  private async getOrgOsEntity(rid: any): Promise<KnowledgeResult | null> {
    // Lookup in org-os data registries
    return null;
  }
}

// Re-export types
export { KnowledgeResult, UnifiedSearchParams };
