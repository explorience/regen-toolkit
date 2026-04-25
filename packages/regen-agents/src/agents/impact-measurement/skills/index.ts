/**
 * Skill implementations for the Impact Measurement Analyst Agent
 * Re-exports from tools directory for backwards compatibility
 */

export {
  ImpactTrackerTool as ImpactTrackerSkill,
  ValueFlowTrackerTool as ValueFlowTrackerSkill,
} from '../tools/index.js';

// Legacy skill implementations (deprecated, use tools instead)
import { KnowledgeEntry, Outcome } from '../../../types/index.js';

/**
 * @deprecated Use ImpactTrackerTool from tools/
 */
export class ImpactTrackerSkill {
  private metricHistory: Map<string, MetricHistory> = new Map();

  async trackMetric(metric: {
    name: string;
    value: number;
    timestamp: Date;
    projectId: string;
  }): Promise<void> {
    const key = `${metric.projectId}-${metric.name}`;
    let history = this.metricHistory.get(key);
    
    if (!history) {
      history = { metric: metric.name, projectId: metric.projectId, values: [] };
      this.metricHistory.set(key, history);
    }

    history.values.push({
      value: metric.value,
      timestamp: metric.timestamp,
    });
  }

  async getTrend(metricKey: string): Promise<TrendAnalysis> {
    const history = this.metricHistory.get(metricKey);
    if (!history || history.values.length < 2) {
      return { direction: 'stable', magnitude: 0, confidence: 0 };
    }

    // Simple trend calculation
    const sorted = history.values.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const first = sorted[0].value;
    const last = sorted[sorted.length - 1].value;
    const change = last - first;
    const percentChange = first !== 0 ? (change / first) * 100 : 0;

    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      magnitude: Math.abs(percentChange),
      confidence: Math.min(0.9, history.values.length * 0.1),
    };
  }

  async identifyAnomalies(metricKey: string, threshold: number = 2): Promise<Anomaly[]> {
    const history = this.metricHistory.get(metricKey);
    if (!history || history.values.length < 3) return [];

    const values = history.values.map(v => v.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);

    const anomalies: Anomaly[] = [];
    for (const entry of history.values) {
      const zScore = Math.abs(entry.value - mean) / stdDev;
      if (zScore > threshold) {
        anomalies.push({
          timestamp: entry.timestamp,
          value: entry.value,
          expected: mean,
          severity: zScore > 3 ? 'high' : 'medium',
        });
      }
    }

    return anomalies;
  }
}

/**
 * Value Flow Tracker Skill
 * Tracks value flows and attribution in impact networks
 */
export class ValueFlowTrackerSkill {
  async mapValueFlows(inputs: {
    sources: { id: string; type: string; value: number }[];
    sinks: { id: string; type: string; value: number }[];
    flows: { from: string; to: string; value: number; mechanism: string }[];
  }): Promise<ValueFlowMap> {
    return {
      nodes: [...inputs.sources, ...inputs.sinks],
      edges: inputs.flows.map(f => ({
        source: f.from,
        target: f.to,
        value: f.value,
        type: f.mechanism,
      })),
      analysis: this.analyzeValueFlows(inputs),
    };
  }

  private analyzeValueFlows(inputs: {
    sources: { id: string; value: number }[];
    sinks: { id: string; value: number }[];
    flows: { from: string; to: string; value: number }[];
  }): string {
    const totalSource = inputs.sources.reduce((sum, s) => sum + s.value, 0);
    const totalSink = inputs.sinks.reduce((sum, s) => sum + s.value, 0);
    const efficiency = totalSink / (totalSource || 1);

    return `Value flow efficiency: ${(efficiency * 100).toFixed(1)}%`;
  }
}

/**
 * Metrics Design Skill
 * Designs impact metrics aligned with frameworks
 */
export class MetricsDesignSkill {
  private irisPlusCatalog: IRISMetric[] = [
    { code: 'PI3752', name: 'Number of farmers with improved yields', category: 'agriculture', unit: 'count', dataType: 'numeric' },
    { code: 'PI3753', name: 'Increase in farmer income', category: 'economic', unit: 'USD', dataType: 'currency' },
    { code: 'PI4060', name: 'Soil organic carbon', category: 'environment', unit: 'tons/hectare', dataType: 'numeric' },
    { code: 'OI3648', name: 'Number of jobs created', category: 'employment', unit: 'count', dataType: 'numeric' },
  ];

  async designMetric(request: {
    outcome: string;
    framework: 'iris-plus' | 'giin' | 'custom';
    context: string;
  }): Promise<MetricDesign> {
    if (request.framework === 'iris-plus') {
      const match = this.irisPlusCatalog.find(m => 
        m.category === request.outcome.toLowerCase() ||
        m.name.toLowerCase().includes(request.outcome.toLowerCase())
      );

      if (match) {
        return {
          name: match.name,
          code: match.code,
          unit: match.unit,
          dataType: match.dataType,
          collectionMethod: this.recommendCollectionMethod(match.dataType),
          frequency: 'annual',
          source: 'IRIS+',
        };
      }
    }

    // Custom metric design
    return {
      name: `${request.outcome} Indicator`,
      code: 'custom',
      unit: 'count',
      dataType: 'numeric',
      collectionMethod: 'surveys',
      frequency: 'annual',
      source: 'custom-designed',
    };
  }

  private recommendCollectionMethod(dataType: string): string {
    const methods: Record<string, string> = {
      'numeric': 'surveys',
      'currency': 'financial-records',
      'percentage': 'calculated',
      'count': 'direct-observation',
    };
    return methods[dataType] || 'surveys';
  }
}

/**
 * Verification Analysis Skill
 * Analyzes data quality and verification levels
 */
export class VerificationAnalysisSkill {
  assessVerificationLevel(data: {
    sources: string[];
    collectionMethods: string[];
    sampleSize: number;
    hasExternalValidation: boolean;
  }): VerificationAssessment {
    let level: 'self-reported' | 'third-party' | 'audited' = 'self-reported';
    let score = 0;

    // Score based on data sources
    if (data.sources.includes('financial-audit')) score += 3;
    if (data.sources.includes('third-party-survey')) score += 2;
    if (data.sources.includes('direct-observation')) score += 1;

    // Score based on external validation
    if (data.hasExternalValidation) score += 2;

    // Determine level
    if (score >= 5) level = 'audited';
    else if (score >= 3) level = 'third-party';

    return {
      level,
      score,
      gaps: this.identifyGaps(data),
      recommendations: this.generateRecommendations(level, data),
    };
  }

  private identifyGaps(data: {
    sources: string[];
    collectionMethods: string[];
    sampleSize: number;
  }): string[] {
    const gaps: string[] = [];

    if (!data.sources.includes('third-party') && !data.sources.includes('financial-audit')) {
      gaps.push('No independent verification source');
    }

    if (data.sampleSize < 30) {
      gaps.push('Sample size may be insufficient for statistical significance');
    }

    return gaps;
  }

  private generateRecommendations(
    level: string,
    data: { hasExternalValidation: boolean }
  ): string[] {
    const recommendations: string[] = [];

    if (level === 'self-reported') {
      recommendations.push('Engage independent auditor for key metrics');
    }

    if (!data.hasExternalValidation) {
      recommendations.push('Implement external validation mechanisms');
    }

    return recommendations;
  }
}

/**
 * Report Generation Skill
 * Generates impact reports for different audiences
 */
export class ReportGenerationSkill {
  async generateReport(params: {
    type: 'internal' | 'funder' | 'public' | 'verification';
    outcomes: Outcome[];
    projectContext: string;
    period: { start: Date; end: Date };
  }): Promise<Report> {
    const sections = this.selectSections(params.type);

    return {
      title: this.generateTitle(params),
      type: params.type,
      period: params.period,
      sections: sections.map(s => this.generateSection(s, params)),
      summary: this.generateSummary(params.outcomes),
    };
  }

  private selectSections(type: string): string[] {
    const sectionMap: Record<string, string[]> = {
      'internal': ['executive-summary', 'outcomes', 'lessons-learned', 'next-steps'],
      'funder': ['executive-summary', 'outcomes', 'sdg-alignment', 'verification', 'budget-efficiency'],
      'public': ['executive-summary', 'stories', 'outcomes', 'future-plans'],
      'verification': ['methodology', 'data-sources', 'outcomes', 'limitations', 'auditor-notes'],
    };
    return sectionMap[type] || sectionMap['internal'];
  }

  private generateTitle(params: { projectContext: string; period: { start: Date; end: Date } }): string {
    const year = params.period.end.getFullYear();
    return `Impact Report: ${params.projectContext} (${year})`;
  }

  private generateSection(section: string, params: { outcomes: Outcome[]; projectContext: string }): ReportSection {
    const contentMap: Record<string, string> = {
      'executive-summary': `Overview of impact achievements for ${params.projectContext}`,
      'outcomes': params.outcomes.map(o => `${o.metric}: ${o.value} ${o.unit}`).join('; '),
      'sdg-alignment': 'Aligned with SDGs 2, 8, 13, 15',
      'lessons-learned': 'Key learnings from implementation',
      'next-steps': 'Planned improvements for next period',
    };

    return {
      title: section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      content: contentMap[section] || 'Section content pending',
    };
  }

  private generateSummary(outcomes: Outcome[]): string {
    const achieved = outcomes.filter(o => typeof o.value === 'number').length;
    return `Achieved ${achieved} of ${outcomes.length} target outcomes.`;
  }
}

// ============================================================================
// Internal Types
// ============================================================================

interface MetricHistory {
  metric: string;
  projectId: string;
  values: { value: number; timestamp: Date }[];
}

interface TrendAnalysis {
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
}

interface Anomaly {
  timestamp: Date;
  value: number;
  expected: number;
  severity: 'high' | 'medium' | 'low';
}

interface ValueFlowMap {
  nodes: { id: string; type: string; value: number }[];
  edges: { source: string; target: string; value: number; type: string }[];
  analysis: string;
}

interface IRISMetric {
  code: string;
  name: string;
  category: string;
  unit: string;
  dataType: string;
}

interface MetricDesign {
  name: string;
  code: string;
  unit: string;
  dataType: string;
  collectionMethod: string;
  frequency: string;
  source: string;
}

interface VerificationAssessment {
  level: 'self-reported' | 'third-party' | 'audited';
  score: number;
  gaps: string[];
  recommendations: string[];
}

interface Report {
  title: string;
  type: string;
  period: { start: Date; end: Date };
  sections: ReportSection[];
  summary: string;
}

interface ReportSection {
  title: string;
  content: string;
}
