/**
 * Examples usage for the Bioregional Intelligence Agent
 */

import { BioregionalIntelligenceAgent } from '../index.js';
import { KnowledgeCurator } from '../../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../../integrations/meeting-processor.js';

// Setup
const knowledgeCurator = new KnowledgeCurator();
const meetingProcessor = new MeetingProcessor();
const agent = new BioregionalIntelligenceAgent(knowledgeCurator, meetingProcessor);

// ============================================================================
// Example 1: Analyze Bioregion
// ============================================================================

async function exampleAnalyzeBioregion() {
  const result = await agent.analyzeBioregion({
    bioregionId: 'watershed-001',
    bioregionName: 'Russian River Watershed',
    boundaries: [{
      type: 'polygon',
      coordinates: [[[-123.5, 38.5], [-122.5, 38.5], [-122.5, 39.5], [-123.5, 39.5], [-123.5, 38.5]],
    }],
    analysisTypes: [
      'territory-mapping',
      'resource-flows',
      'stakeholder-networks',
      'local-knowledge',
    ],
    dataSources: [
      { type: 'gis', source: 'USGS watershed boundaries', reliability: 'high' },
      { type: 'sensor', source: 'Stream gauge network', reliability: 'high' },
    ],
  });

  console.log('Map Layers:', result.bioregionalMap.layers.length);
  console.log('Resource Flows:', result.resourceFlows.length);
  console.log('Stakeholders:', result.stakeholderAnalysis.stakeholders.length);
  console.log('Strategic Insights:', result.strategicInsights);
}

// ============================================================================
// Example 2: Process GIS Data
// ============================================================================

async function exampleProcessGISData() {
  const result = await agent.processGISData({
    bioregionId: 'watershed-001',
    layers: [
      { name: 'Land Use 2023', type: 'land-use', data: { /* GIS data */ } },
      { name: 'Soil Types', type: 'soil', data: { /* GIS data */ } },
      { name: 'Protected Areas', type: 'protected', data: { /* GIS data */ } },
    ],
    boundaries: {
      type: 'polygon',
      coordinates: [[[-123.5, 38.5], [-122.5, 38.5], [-122.5, 39.5], [-123.5, 39.5], [-123.5, 38.5]],
    },
  });

  console.log('Processed Map Layers:', result.mapLayers.length);
  console.log('Key Features:', result.keyFeatures);
  console.log('Analysis:', result.analysis);
}

// ============================================================================
// Example 3: Process Sensor Data
// ============================================================================

async function exampleProcessSensorData() {
  const result = await agent.processSensorData({
    bioregionId: 'watershed-001',
    sensorType: 'water',
    readings: [
      { timestamp: new Date('2024-01-01'), location: { type: 'point', coordinates: [-123.0, 38.7] }, value: 45.2 },
      { timestamp: new Date('2024-02-01'), location: { type: 'point', coordinates: [-123.0, 38.7] }, value: 42.8 },
      { timestamp: new Date('2024-03-01'), location: { type: 'point', coordinates: [-123.0, 38.7] }, value: 48.5 },
    ],
  });

  console.log('Trends:', result.trends);
  console.log('Anomalies:', result.anomalies);
  console.log('Recommendations:', result.recommendations);
}

// ============================================================================
// Example 4: Map Stakeholder Network
// ============================================================================

async function exampleMapStakeholderNetwork() {
  const result = await agent.mapStakeholderNetwork({
    bioregionId: 'watershed-001',
    stakeholders: [
      {
        id: 'farm-coop',
        name: 'Local Farmers Cooperative',
        type: 'community',
        interests: ['water-rights', 'soil-health'],
        influence: 'high',
        engagement: 'active',
        relationships: ['water-board', 'enviro-ngo'],
      },
      {
        id: 'water-board',
        name: 'Regional Water Board',
        type: 'government',
        interests: ['regulatory-compliance', 'water-quality'],
        influence: 'high',
        engagement: 'interested',
        relationships: ['farm-coop', 'enviro-ngo'],
      },
      {
        id: 'enviro-ngo',
        name: 'Watershed Conservation Group',
        type: 'ngo',
        interests: ['biodiversity', 'habitat-restoration'],
        influence: 'medium',
        engagement: 'active',
        relationships: ['farm-coop', 'water-board'],
      },
    ],
  });

  console.log('Network Map Nodes:', result.networkMap.nodes.length);
  console.log('Network Map Edges:', result.networkMap.edges.length);
  console.log('Power Dynamics:', result.powerDynamics);
  console.log('Collaboration Opportunities:', result.collaborationOpportunities);
}

// ============================================================================
// Example 5: Record Meeting Findings
// ============================================================================

async function exampleRecordMeetingFindings() {
  await agent.recordMeetingFindings('bioregional-planning-meeting-2024-03-15', [
    {
      agentId: 'bioregional-intelligence',
      findingType: 'stakeholder-insight',
      content: 'Farmers Cooperative expressed strong interest in joint watershed monitoring',
      confidence: 0.9,
      relatedTopics: ['stakeholders', 'monitoring', 'collaboration'],
    },
    {
      agentId: 'bioregional-intelligence',
      findingType: 'resource-flow-data',
      content: 'Stream gauge data shows 15% decline in summer flows over past decade',
      confidence: 0.85,
      relatedTopics: ['water', 'climate-change', 'data-trends'],
    },
  ]);

  console.log('Bioregional meeting findings recorded');
}

// ============================================================================
// Run examples (commented out for safety)
// ============================================================================

// exampleAnalyzeBioregion();
// exampleProcessGISData();
// exampleProcessSensorData();
// exampleMapStakeholderNetwork();
// exampleRecordMeetingFindings();

export {
  exampleAnalyzeBioregion,
  exampleProcessGISData,
  exampleProcessSensorData,
  exampleMapStakeholderNetwork,
  exampleRecordMeetingFindings,
};
