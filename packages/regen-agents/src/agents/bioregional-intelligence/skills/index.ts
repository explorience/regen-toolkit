/**
 * Skill implementations for the Bioregional Intelligence Agent
 * Re-exports from tools directory for backwards compatibility
 */

export {
  BioregionalMapperTool as BioregionalMapperSkill,
  LocalNodeConnectorTool as LocalNodeConnectorSkill,
} from '../tools/index.js';

// Legacy skill implementations (deprecated, use tools instead)
import { KnowledgeEntry, GeoBoundary, Stakeholder, NetworkMap } from '../../../types/index.js';

/**
 * @deprecated Use BioregionalMapperTool from tools/
 */
export class BioregionalMapperSkill {
  async createMapLayers(params: {
    bioregionId: string;
    dataSources: { type: string; data: unknown; name: string }[];
  }): Promise<MapLayer[]> {
    const layers: MapLayer[] = [];

    for (const source of params.dataSources) {
      layers.push({
        name: source.name,
        type: this.classifyLayerType(source.type),
        data: source.data,
        source: source.type,
      });
    }

    return layers;
  }

  private classifyLayerType(sourceType: string): 'ecosystem' | 'hydrology' | 'soil' | 'land-use' | 'infrastructure' | 'protected' {
    const typeMap: Record<string, any> = {
      'watershed': 'hydrology',
      'ecosystem': 'ecosystem',
      'soil': 'soil',
      'land-use': 'land-use',
      'infrastructure': 'infrastructure',
      'protected': 'protected',
    };
    return typeMap[sourceType] || 'ecosystem';
  }

  async extractFeatures(layers: MapLayer[]): Promise<Feature[]> {
    return layers.map(l => ({
      name: l.name,
      type: l.type,
      coordinates: { type: 'point', coordinates: [0, 0] },
      description: `Feature from ${l.name}`,
      significance: 'Key bioregional feature',
    }));
  }
}

/**
 * Local Node Connector Skill
 * Connects with local data sources and nodes
 */
export class LocalNodeConnectorSkill {
  private connectedNodes: Map<string, LocalNode> = new Map();

  async connectNode(node: {
    id: string;
    type: 'sensor' | 'community' | 'organization';
    location: GeoBoundary;
    capabilities: string[];
  }): Promise<ConnectionResult> {
    this.connectedNodes.set(node.id, {
      ...node,
      status: 'connected',
      lastContact: new Date(),
    });

    return {
      nodeId: node.id,
      status: 'connected',
      availableData: node.capabilities,
    };
  }

  async queryNode(nodeId: string, dataType: string): Promise<unknown> {
    const node = this.connectedNodes.get(nodeId);
    if (!node || node.status !== 'connected') {
      throw new Error(`Node ${nodeId} not connected`);
    }

    // Simulate data retrieval
    return { nodeId, dataType, timestamp: new Date() };
  }

  async getNodeStatus(nodeId: string): Promise<NodeStatus> {
    const node = this.connectedNodes.get(nodeId);
    if (!node) return { status: 'unknown' };

    return {
      status: node.status,
      lastContact: node.lastContact,
      capabilities: node.capabilities,
    };
  }
}

/**
 * Resource Flow Analysis Skill
 * Analyzes resource flows within the bioregion
 */
export class ResourceFlowAnalysisSkill {
  async analyzeFlow(flow: {
    resource: string;
    source: string;
    sink: string;
    dataPoints: { timestamp: Date; value: number }[];
  }): Promise<FlowAnalysis> {
    const values = flow.dataPoints.map(d => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend = this.calculateTrend(values);

    return {
      resource: flow.resource,
      source: flow.source,
      sink: flow.sink,
      average: avg,
      trend,
      seasonality: this.detectSeasonality(flow.dataPoints),
      uncertainty: this.calculateUncertainty(values),
    };
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private detectSeasonality(dataPoints: { timestamp: Date; value: number }[]): string | null {
    // Simple seasonality detection
    if (dataPoints.length < 12) return null;
    return 'Annual pattern detected';
  }

  private calculateUncertainty(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean;
  }
}

/**
 * Stakeholder Mapping Skill
 * Maps and analyzes stakeholder networks
 */
export class StakeholderMappingSkill {
  async buildNetwork(stakeholders: Stakeholder[]): Promise<NetworkVisualization> {
    const nodes = stakeholders.map(s => ({
      id: s.id,
      label: s.name,
      type: s.type,
      size: s.influence === 'high' ? 30 : s.influence === 'medium' ? 20 : 10,
      color: this.getNodeColor(s.type),
    }));

    const edges: NetworkEdge[] = [];
    for (const stakeholder of stakeholders) {
      for (const rel of stakeholder.relationships) {
        edges.push({
          source: stakeholder.id,
          target: rel,
          type: 'relationship',
          strength: 1,
        });
      }
    }

    return { nodes, edges };
  }

  async analyzePower(stakeholders: Stakeholder[]): Promise<PowerAnalysis[]> {
    const byInfluence = this.groupByInfluence(stakeholders);
    const analyses: PowerAnalysis[] = [];

    if (byInfluence.high.length > 0) {
      analyses.push({
        type: 'concentrated',
        description: 'High influence concentrated among few actors',
        actors: byInfluence.high.map(s => s.name),
        implications: ['Can drive major decisions', 'Risk of capture'],
      });
    }

    if (byInfluence.low.length > stakeholders.length * 0.5) {
      analyses.push({
        type: 'dispersed',
        description: 'Most stakeholders have limited influence',
        actors: byInfluence.low.map(s => s.name),
        implications: ['Need coalition building', 'Risk of disengagement'],
      });
    }

    return analyses;
  }

  async findCollaborations(stakeholders: Stakeholder[]): Promise<CollaborationOpportunity[]> {
    const opportunities: CollaborationOpportunity[] = [];

    // Find actors with shared interests
    for (let i = 0; i < stakeholders.length; i++) {
      for (let j = i + 1; j < stakeholders.length; j++) {
        const s1 = stakeholders[i];
        const s2 = stakeholders[j];
        
        const sharedInterests = s1.interests.filter(i => s2.interests.includes(i));
        if (sharedInterests.length > 0) {
          opportunities.push({
            parties: [s1.name, s2.name],
            sharedInterests,
            potential: this.assessCollaborationPotential(s1, s2),
            nextSteps: ['Initial conversation', 'Joint interest mapping'],
          });
        }
      }
    }

    return opportunities.sort((a, b) => 
      (b.potential === 'high' ? 3 : b.potential === 'medium' ? 2 : 1) -
      (a.potential === 'high' ? 3 : a.potential === 'medium' ? 2 : 1)
    );
  }

  private getNodeColor(type: string): string {
    const colors: Record<string, string> = {
      'community': '#4CAF50',
      'government': '#2196F3',
      'ngo': '#FF9800',
      'business': '#9C27B0',
      'researcher': '#00BCD4',
      'indigenous': '#795548',
    };
    return colors[type] || '#757575';
  }

  private groupByInfluence(stakeholders: Stakeholder[]) {
    return {
      high: stakeholders.filter(s => s.influence === 'high'),
      medium: stakeholders.filter(s => s.influence === 'medium'),
      low: stakeholders.filter(s => s.influence === 'low'),
    };
  }

  private assessCollaborationPotential(s1: Stakeholder, s2: Stakeholder): 'high' | 'medium' | 'low' {
    if (s1.engagement === 'active' && s2.engagement === 'active') return 'high';
    if (s1.engagement === 'resistant' || s2.engagement === 'resistant') return 'low';
    return 'medium';
  }
}

/**
 * Knowledge Curator Skill (Bioregional specialization)
 * Manages bioregional knowledge base
 */
export class KnowledgeCuratorSkill {
  async categorizeKnowledge(entry: KnowledgeEntry): Promise<string[]> {
    const categories: string[] = [];

    if (entry.tags.includes('ecosystem')) categories.push('ecosystems');
    if (entry.tags.includes('water')) categories.push('hydrology');
    if (entry.tags.includes('stakeholder')) categories.push('actors');
    if (entry.tags.includes('traditional')) categories.push('local-knowledge');

    return categories.length > 0 ? categories : ['general'];
  }

  async linkRelatedEntries(entryId: string, knowledgeBase: Map<string, KnowledgeEntry>): Promise<string[]> {
    const entry = knowledgeBase.get(entryId);
    if (!entry) return [];

    const related: string[] = [];
    
    for (const [id, other] of knowledgeBase) {
      if (id === entryId) continue;
      
      // Check for tag overlap
      const sharedTags = entry.tags.filter(t => other.tags.includes(t));
      if (sharedTags.length > 0) {
        related.push(id);
      }
    }

    return related.slice(0, 5); // Top 5 related
  }
}

// ============================================================================
// Internal Types
// ============================================================================

interface MapLayer {
  name: string;
  type: 'ecosystem' | 'hydrology' | 'soil' | 'land-use' | 'infrastructure' | 'protected';
  data: unknown;
  source: string;
}

interface Feature {
  name: string;
  type: string;
  coordinates: GeoBoundary;
  description: string;
  significance: string;
}

interface LocalNode {
  id: string;
  type: 'sensor' | 'community' | 'organization';
  location: GeoBoundary;
  capabilities: string[];
  status: 'connected' | 'disconnected';
  lastContact: Date;
}

interface ConnectionResult {
  nodeId: string;
  status: string;
  availableData: string[];
}

interface NodeStatus {
  status: string;
  lastContact?: Date;
  capabilities?: string[];
}

interface FlowAnalysis {
  resource: string;
  source: string;
  sink: string;
  average: number;
  trend: string;
  seasonality: string | null;
  uncertainty: number;
}

interface NetworkVisualization {
  nodes: { id: string; label: string; type: string; size: number; color: string }[];
  edges: NetworkEdge[];
}

interface NetworkEdge {
  source: string;
  target: string;
  type: string;
  strength: number;
}

interface PowerAnalysis {
  type: string;
  description: string;
  actors: string[];
  implications: string[];
}

interface CollaborationOpportunity {
  parties: string[];
  sharedInterests: string[];
  potential: 'high' | 'medium' | 'low';
  nextSteps: string[];
}
