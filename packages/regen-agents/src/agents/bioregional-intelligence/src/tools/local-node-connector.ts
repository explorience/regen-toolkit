/**
 * Local Node Connector Tool
 * Connects with local data sources, sensors, and community nodes in the bioregion
 */

import { GeoBoundary } from '../../../types/index.js';

export interface LocalNode {
  id: string;
  name: string;
  type: 'sensor' | 'community' | 'organization' | 'indigenous-knowledge' | 'research-station';
  location: GeoBoundary;
  contact?: string;
  capabilities: string[];
  dataTypes: string[];
  status: 'connected' | 'disconnected' | 'inactive' | 'unknown';
  lastContact: Date | null;
  dataQuality: 'high' | 'medium' | 'low';
  accessProtocol: 'open' | 'permissioned' | 'restricted';
  protocols: string[];
  trustLevel: number; // 0-1
}

export interface ConnectionResult {
  nodeId: string;
  status: 'connected' | 'failed' | 'unauthorized';
  availableData: string[];
  lastReading: Date | null;
  quality: 'high' | 'medium' | 'low';
  message: string;
}

export interface SensorReading {
  nodeId: string;
  timestamp: Date;
  dataType: string;
  value: number;
  unit: string;
  quality: number; // 0-1
  location: GeoBoundary;
  metadata: Record<string, unknown>;
}

export interface CommunityReport {
  nodeId: string;
  timestamp: Date;
  topic: string;
  content: string;
  source: string;
  confidence: number;
  tags: string[];
}

export class LocalNodeConnectorTool {
  private nodes: Map<string, LocalNode> = new Map();
  private readings: Map<string, SensorReading[]> = new Map();
  private reports: Map<string, CommunityReport[]> = new Map();

  async registerNode(node: Omit<LocalNode, 'status' | 'lastContact'>): Promise<LocalNode> {
    const fullNode: LocalNode = {
      ...node,
      status: 'disconnected',
      lastContact: null,
    };

    this.nodes.set(node.id, fullNode);
    this.readings.set(node.id, []);
    this.reports.set(node.id, []);

    return fullNode;
  }

  async connectNode(nodeId: string): Promise<ConnectionResult> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return {
        nodeId,
        status: 'failed',
        availableData: [],
        lastReading: null,
        quality: 'low',
        message: 'Node not found',
      };
    }

    // Simulate connection attempt
    // In real implementation, this would attempt actual connection
    const success = Math.random() > 0.2; // 80% success rate for demo

    if (success) {
      node.status = 'connected';
      node.lastContact = new Date();

      return {
        nodeId,
        status: 'connected',
        availableData: node.dataTypes,
        lastReading: new Date(),
        quality: node.dataQuality,
        message: `Successfully connected to ${node.name}`,
      };
    } else {
      return {
        nodeId,
        status: 'failed',
        availableData: [],
        lastReading: null,
        quality: 'low',
        message: `Failed to connect to ${node.name}`,
      };
    }
  }

  async querySensorData(
    nodeId: string,
    dataType: string,
    timeRange: { start: Date; end: Date }
  ): Promise<SensorReading[]> {
    const node = this.nodes.get(nodeId);
    if (!node || node.status !== 'connected') {
      throw new Error(`Node ${nodeId} not connected`);
    }

    if (!node.dataTypes.includes(dataType)) {
      throw new Error(`Node ${nodeId} does not provide ${dataType} data`);
    }

    const nodeReadings = this.readings.get(nodeId) || [];
    
    return nodeReadings.filter(r => 
      r.dataType === dataType &&
      r.timestamp >= timeRange.start &&
      r.timestamp <= timeRange.end
    );
  }

  async submitSensorReading(nodeId: string, reading: Omit<SensorReading, 'nodeId'>): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    const fullReading: SensorReading = {
      ...reading,
      nodeId,
    };

    const nodeReadings = this.readings.get(nodeId) || [];
    nodeReadings.push(fullReading);
    this.readings.set(nodeId, nodeReadings);

    // Update node status
    node.lastContact = new Date();
  }

  async submitCommunityReport(
    nodeId: string,
    report: Omit<CommunityReport, 'nodeId' | 'timestamp'>
  ): Promise<CommunityReport> {
    const node = this.nodes.get(nodeId);
    if (!node || node.type !== 'community') {
      throw new Error(`Community node ${nodeId} not found`);
    }

    const fullReport: CommunityReport = {
      ...report,
      nodeId,
      timestamp: new Date(),
    };

    const nodeReports = this.reports.get(nodeId) || [];
    nodeReports.push(fullReport);
    this.reports.set(nodeId, nodeReports);

    return fullReport;
  }

  async getCommunityReports(
    nodeId: string,
    options?: {
      topic?: string;
      timeRange?: { start: Date; end: Date };
      tags?: string[];
    }
  ): Promise<CommunityReport[]> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    let reports = this.reports.get(nodeId) || [];

    if (options?.topic) {
      reports = reports.filter(r => r.topic === options.topic);
    }

    if (options?.timeRange) {
      reports = reports.filter(r =>
        r.timestamp >= options.timeRange!.start &&
        r.timestamp <= options.timeRange!.end
      );
    }

    if (options?.tags) {
      reports = reports.filter(r =>
        options.tags!.some(tag => r.tags.includes(tag))
      );
    }

    return reports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getNodeStatus(nodeId: string): Promise<{
    node: LocalNode | null;
    online: boolean;
    lastReading: Date | null;
    dataVolume: number;
    quality: 'high' | 'medium' | 'low';
  }> {
    const node = this.nodes.get(nodeId) || null;
    const readings = this.readings.get(nodeId) || [];
    const reports = this.reports.get(nodeId) || [];

    const dataVolume = readings.length + reports.length;
    
    // Determine last reading
    let lastReading: Date | null = null;
    if (readings.length > 0) {
      lastReading = readings[readings.length - 1].timestamp;
    }
    if (reports.length > 0) {
      const lastReport = reports[reports.length - 1].timestamp;
      if (!lastReading || lastReport > lastReading) {
        lastReading = lastReport;
      }
    }

    return {
      node,
      online: node?.status === 'connected' || false,
      lastReading,
      dataVolume,
      quality: node?.dataQuality || 'low',
    };
  }

  async findNodesByType(type: LocalNode['type']): Promise<LocalNode[]> {
    return Array.from(this.nodes.values())
      .filter(n => n.type === type)
      .sort((a, b) => (b.trustLevel || 0) - (a.trustLevel || 0));
  }

  async findNodesByLocation(
    center: GeoBoundary,
    radiusKm: number
  ): Promise<LocalNode[]> {
    return Array.from(this.nodes.values())
      .filter(n => {
        const distance = this.calculateDistance(center, n.location);
        return distance <= radiusKm;
      })
      .sort((a, b) => (b.dataQuality === 'high' ? 1 : 0) - (a.dataQuality === 'high' ? 1 : 0));
  }

  async findNodesByCapability(capability: string): Promise<LocalNode[]> {
    return Array.from(this.nodes.values())
      .filter(n => n.capabilities.includes(capability))
      .sort((a, b) => (b.trustLevel || 0) - (a.trustLevel || 0));
  }

  async aggregateData(
    dataType: string,
    timeRange: { start: Date; end: Date },
    aggregation: 'sum' | 'average' | 'min' | 'max' | 'count'
  ): Promise<{
    value: number;
    unit: string;
    nodeCount: number;
    confidence: number;
    breakdown: { nodeId: string; value: number; weight: number }[];
  }> {
    let allReadings: SensorReading[] = [];
    let nodeCount = 0;

    for (const [nodeId, readings] of this.readings) {
      const nodeReadings = readings.filter(r =>
        r.dataType === dataType &&
        r.timestamp >= timeRange.start &&
        r.timestamp <= timeRange.end
      );

      if (nodeReadings.length > 0) {
        allReadings.push(...nodeReadings);
        nodeCount++;
      }
    }

    if (allReadings.length === 0) {
      return {
        value: 0,
        unit: '',
        nodeCount: 0,
        confidence: 0,
        breakdown: [],
      };
    }

    const values = allReadings.map(r => r.value);
    const unit = allReadings[0].unit;

    let aggregatedValue: number;
    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((a, b) => a + b, 0);
        break;
      case 'average':
        aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
      default:
        aggregatedValue = 0;
    }

    // Calculate breakdown by node
    const byNode: Record<string, number[]> = {};
    for (const reading of allReadings) {
      if (!byNode[reading.nodeId]) byNode[reading.nodeId] = [];
      byNode[reading.nodeId].push(reading.value);
    }

    const breakdown = Object.entries(byNode).map(([nodeId, nodeValues]) => {
      const nodeValue = aggregation === 'sum'
        ? nodeValues.reduce((a, b) => a + b, 0)
        : nodeValues.reduce((a, b) => a + b, 0) / nodeValues.length;

      return {
        nodeId,
        value: nodeValue,
        weight: nodeValues.length / allReadings.length,
      };
    });

    // Calculate confidence based on data quality and coverage
    const confidence = Math.min(0.95, nodeCount * 0.1 + 0.5);

    return {
      value: Math.round(aggregatedValue * 100) / 100,
      unit,
      nodeCount,
      confidence: Math.round(confidence * 100) / 100,
      breakdown,
    };
  }

  private calculateDistance(a: GeoBoundary, b: GeoBoundary): number {
    // Simplified distance calculation
    const aCoords = a.type === 'point' ? a.coordinates as number[] : [0, 0];
    const bCoords = b.type === 'point' ? b.coordinates as number[] : [0, 0];

    const dx = (aCoords[0] - bCoords[0]) * 111;
    const dy = (aCoords[1] - bCoords[1]) * 111;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
