/**
 * Examples usage for the Impact Measurement Analyst Agent
 */

import { ImpactMeasurementAnalyst } from '../index.js';
import { KnowledgeCurator } from '../../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../../integrations/meeting-processor.js';

// Setup
const knowledgeCurator = new KnowledgeCurator();
const meetingProcessor = new MeetingProcessor();
const agent = new ImpactMeasurementAnalyst(knowledgeCurator, meetingProcessor);

// ============================================================================
// Example 1: Analyze Agricultural Project Impact
// ============================================================================

async function exampleAnalyzeAgriculturalImpact() {
  const result = await agent.analyzeImpact({
    projectData: {
      projectId: 'regen-farms-001',
      name: 'Valley Regenerative Agriculture Initiative',
      description: 'Transitioning 50 farms to regenerative practices over 3 years',
      activities: ['cover-cropping', 'reduced-tillage', 'rotational-grazing', 'composting'],
      beneficiaries: 150, // farmers and farm workers
      geographicScope: 'Mendocino County, California',
      startDate: new Date('2023-01-01'),
      metrics: {
        'farmers-trained': 45,
        'acres-transitioned': 3200,
        'soil-carbon-increase': 0.8, // tons/acre
        'water-use-reduction': 15, // percent
      },
    },
    framework: 'iris-plus',
    timeRange: {
      start: new Date('2023-01-01'),
      end: new Date('2024-03-01'),
    },
    verificationLevel: 'third-party',
  });

  console.log('Impact Summary:', result.impactReport.summary);
  console.log('Outcomes:', result.impactReport.outcomes);
  console.log('SDG Alignment:', result.impactReport.sdgAlignment);
  console.log('Verification:', result.verificationSummary);
  console.log('Recommendations:', result.recommendations);
}

// ============================================================================
// Example 2: Design Impact Metrics for New Project
// ============================================================================

async function exampleDesignMetrics() {
  const metrics = await agent.designMetrics({
    projectType: 'Community-Based Watershed Restoration',
    activities: [
      'riparian-buffer-planting',
      'invasive-species-removal',
      'fish-passage-improvement',
      'community-education',
    ],
    intendedOutcomes: [
      'water-quality-improvement',
      'biodiversity-enhancement',
      'community-engagement',
      'climate-resilience',
    ],
    framework: 'iris-plus',
  });

  console.log('Designed Metrics:');
  metrics.forEach(m => {
    console.log(`- ${m.name} (${m.unit}): ${m.description}`);
    console.log(`  Collection: ${m.collectionMethod}, Frequency: ${m.frequency}`);
  });
}

// ============================================================================
// Example 3: Process Project Data
// ============================================================================

async function exampleProcessProjectData() {
  const result = await agent.processProjectData({
    projectId: 'forest-carbon-001',
    rawData: {
      'trees-planted': 15000,
      'survival-rate': 0.78,
      'hectares-restored': 45,
      'community-members-engaged': 120,
      'carbon-sequestered': 850, // tons CO2e
    },
    metrics: [
      {
        name: 'trees-planted',
        description: 'Total trees planted',
        unit: 'count',
        dataType: 'numeric',
        collectionMethod: 'field-surveys',
        frequency: 'annual',
        source: 'custom',
      },
      {
        name: 'carbon-sequestered',
        description: 'CO2 equivalent sequestered',
        unit: 'tons',
        dataType: 'numeric',
        collectionMethod: 'modeling',
        frequency: 'annual',
        source: 'custom',
      },
    ],
    timeRange: {
      start: new Date('2023-01-01'),
      end: new Date('2023-12-31'),
    },
  });

  console.log('Calculated Metrics:', result.calculatedMetrics);
  console.log('Trends:', result.trends);
  console.log('Anomalies:', result.anomalies);
}

// ============================================================================
// Example 4: Generate Impact Report
// ============================================================================

async function exampleGenerateReport() {
  const report = await agent.generateReport({
    projectId: 'regen-farms-001',
    reportType: 'funder',
    period: {
      start: new Date('2023-01-01'),
      end: new Date('2023-12-31'),
    },
    format: 'full',
  });

  console.log('Report Title:', report.title);
  console.log('Executive Summary:', report.executiveSummary);
  console.log('Stories:', report.stories);
  console.log('Next Steps:', report.nextSteps);
}

// ============================================================================
// Example 5: Record Meeting Impact Findings
// ============================================================================

async function exampleRecordMeetingFindings() {
  await agent.recordMeetingFindings('impact-review-2024-03-15', [
    {
      agentId: 'impact-measurement',
      findingType: 'outcome-achievement',
      content: 'Soil carbon sequestration exceeded target by 12% across pilot sites',
      confidence: 0.9,
      relatedTopics: ['soil-carbon', 'targets', 'pilot-sites'],
    },
    {
      agentId: 'impact-measurement',
      findingType: 'measurement-gap',
      content: 'Farmer economic outcomes not yet tracked - recommend adding income metrics',
      confidence: 0.85,
      relatedTopics: ['economic-impact', 'metrics', 'farmer-livelihoods'],
    },
  ]);

  console.log('Impact meeting findings recorded');
}

// ============================================================================
// Run examples (commented out for safety)
// ============================================================================

// exampleAnalyzeAgriculturalImpact();
// exampleDesignMetrics();
// exampleProcessProjectData();
// exampleGenerateReport();
// exampleRecordMeetingFindings();

export {
  exampleAnalyzeAgriculturalImpact,
  exampleDesignMetrics,
  exampleProcessProjectData,
  exampleGenerateReport,
  exampleRecordMeetingFindings,
};
