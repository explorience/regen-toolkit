/**
 * Impact Measurement Analyst Agent
 * 
 * Specialist agent for designing impact metrics, analyzing project data,
 * and generating reports aligned with standards like IRIS+ and GIIN.
 */

import {
  AgentConfig,
  AgentContext,
  ImpactAnalysisInput,
  ImpactAnalysisOutput,
  ImpactReport,
  DashboardData,
  VerificationSummary,
  KnowledgeEntry,
  AgentFinding,
  Outcome,
  SDGAlignment,
} from '../../types/index.js';
import { KnowledgeCurator } from '../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../integrations/meeting-processor.js';

export class ImpactMeasurementAnalyst {
  private config: AgentConfig;
  private knowledgeCurator: KnowledgeCurator;
  private meetingProcessor: MeetingProcessor;

  constructor(
    knowledgeCurator: KnowledgeCurator,
    meetingProcessor: MeetingProcessor
  ) {
    this.config = {
      name: 'impact-measurement-analyst',
      description: 'Specialist agent for impact measurement and reporting',
      model: 'zen/kimi-k2.5',
      maxTurns: 50,
      skills: [
        'impact-tracker',
        'value-flow-tracker',
        'knowledge-curator',
        'metrics-design',
        'verification-analysis',
        'report-generation',
      ],
      tools: [
        'web-search',
        'web-fetch',
        'read',
        'write',
        'knowledge-store',
        'knowledge-query',
      ],
    };
    this.knowledgeCurator = knowledgeCurator;
    this.meetingProcessor = meetingProcessor;
  }

  /**
   * Main analysis method - analyzes project impact data
   */
  async analyzeImpact(input: ImpactAnalysisInput): Promise<ImpactAnalysisOutput> {
    const context: AgentContext = {
      organizationId: input.projectData.projectId,
      sessionId: this.generateSessionId(),
      timestamp: new Date(),
      metadata: {
        framework: input.framework,
        projectName: input.projectData.name,
      },
    };

    // Step 1: Query existing impact knowledge
    const existingKnowledge = await this.queryKnowledgeBase(input);

    // Step 2: Design metrics if needed
    const metrics = await this.designMetrics(input, existingKnowledge);

    // Step 3: Analyze outcomes
    const outcomes = this.analyzeOutcomes(input, metrics);

    // Step 4: Check SDG alignment
    const sdgAlignment = this.analyzeSDGAlignment(input, outcomes);

    // Step 5: Assess verification
    const verification = this.assessVerification(input, outcomes);

    // Step 6: Generate dashboard data
    const dashboardData = this.generateDashboardData(input, outcomes);

    const output: ImpactAnalysisOutput = {
      impactReport: {
        summary: this.generateImpactSummary(input, outcomes),
        outcomes,
        sdgAlignment,
      },
      dashboardData,
      verificationSummary: verification,
      recommendations: this.generateRecommendations(metrics, verification),
    };

    // Step 7: Store findings
    await this.storeImpactAnalysis(input, output, context);

    return output;
  }

  /**
   * Design impact metrics for a project
   */
  async designMetrics(params: {
    projectType: string;
    activities: string[];
    intendedOutcomes: string[];
    framework?: 'iris-plus' | 'giin' | 'custom';
  }): Promise<Metric[]> {
    const framework = params.framework || 'iris-plus';
    
    // Get framework standards
    const standards = this.getFrameworkStandards(framework);
    
    // Design appropriate metrics
    const metrics: Metric[] = [];
    
    for (const outcome of params.intendedOutcomes) {
      const relevantStandards = standards.filter(s => 
        s.outcomes.includes(outcome.toLowerCase())
      );
      
      metrics.push({
        name: `${outcome} Indicator`,
        description: `Measures ${outcome} through ${relevantStandards[0]?.metric || 'custom indicator'}`,
        unit: relevantStandards[0]?.unit || 'count',
        dataType: relevantStandards[0]?.dataType || 'numeric',
        collectionMethod: this.recommendCollectionMethod(outcome),
        frequency: this.recommendFrequency(outcome),
        baseline: undefined,
        target: undefined,
        source: relevantStandards[0]?.code || 'custom',
      });
    }

    return metrics;
  }

  /**
   * Process project data and calculate metrics
   */
  async processProjectData(data: {
    projectId: string;
    rawData: Record<string, unknown>;
    metrics: Metric[];
    timeRange: { start: Date; end: Date };
  }): Promise<{
    calculatedMetrics: CalculatedMetric[];
    trends: Trend[];
    anomalies: Anomaly[];
  }> {
    const calculated: CalculatedMetric[] = [];
    
    for (const metric of data.metrics) {
      const value = this.calculateMetricValue(metric, data.rawData);
      calculated.push({
        metric: metric.name,
        value,
        unit: metric.unit,
        period: data.timeRange,
        confidence: 0.85,
        methodology: metric.collectionMethod,
      });
    }

    return {
      calculatedMetrics: calculated,
      trends: this.identifyTrends(calculated),
      anomalies: this.identifyAnomalies(calculated),
    };
  }

  /**
   * Generate impact report
   */
  async generateReport(params: {
    projectId: string;
    reportType: 'internal' | 'funder' | 'public' | 'verification';
    period: { start: Date; end: Date };
    format: 'narrative' | 'dashboard' | 'full';
  }): Promise<GeneratedReport> {
    // Query analysis results
    const analyses = await this.queryAnalyses(params.projectId, params.period);
    
    return {
      title: `Impact Report: ${params.projectId}`,
      period: params.period,
      type: params.reportType,
      executiveSummary: this.generateExecutiveSummary(analyses),
      outcomes: this.compileOutcomes(analyses),
      stories: this.extractStories(analyses),
      verification: this.summarizeVerification(analyses),
      recommendations: this.compileRecommendations(analyses),
      nextSteps: this.defineNextSteps(analyses),
    };
  }

  /**
   * Record meeting findings
   */
  async recordMeetingFindings(
    meetingId: string,
    findings: AgentFinding[]
  ): Promise<void> {
    await this.meetingProcessor.recordAgentFindings(meetingId, this.config.name, findings);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async queryKnowledgeBase(
    input: ImpactAnalysisInput
  ): Promise<KnowledgeEntry[]> {
    return this.knowledgeCurator.query({
      category: 'impact-analysis',
      tags: [input.projectData.name, input.framework].filter(Boolean) as string[],
    });
  }

  private async designMetrics(
    input: ImpactAnalysisInput,
    existingKnowledge: KnowledgeEntry[]
  ): Promise<Metric[]> {
    const framework = input.framework || 'iris-plus';
    const intendedOutcomes = this.inferOutcomes(input.projectData.activities);
    
    return this.designMetrics({
      projectType: input.projectData.description,
      activities: input.projectData.activities,
      intendedOutcomes,
      framework,
    });
  }

  private inferOutcomes(activities: string[]): string[] {
    // Map activities to common impact outcomes
    const outcomeMap: Record<string, string[]> = {
      'agriculture': ['food-security', 'income-generation', 'soil-health'],
      'education': ['literacy', 'skills-development', 'employment'],
      'health': ['mortality-reduction', 'disease-prevention', 'wellbeing'],
      'energy': ['access-to-electricity', 'emissions-reduction', 'cost-savings'],
      'water': ['clean-water-access', 'sanitation', 'health-improvement'],
    };

    const outcomes = new Set<string>();
    for (const activity of activities) {
      const normalized = activity.toLowerCase();
      for (const [key, value] of Object.entries(outcomeMap)) {
        if (normalized.includes(key)) {
          value.forEach(o => outcomes.add(o));
        }
      }
    }

    return Array.from(outcomes);
  }

  private getFrameworkStandards(framework: string): FrameworkStandard[] {
    const irisPlusStandards: FrameworkStandard[] = [
      { code: 'PI3752', outcome: 'food-security', metric: 'number of farmers with improved yields', unit: 'count', dataType: 'numeric', outcomes: ['food-security', 'agriculture'] },
      { code: 'PI3753', outcome: 'income-generation', metric: 'increase in farmer income', unit: 'USD', dataType: 'currency', outcomes: ['income-generation', 'economic'] },
      { code: 'PI4060', outcome: 'soil-health', metric: 'soil organic carbon', unit: 'tons/hectare', dataType: 'numeric', outcomes: ['soil-health', 'carbon'] },
    ];

    const standards: Record<string, FrameworkStandard[]> = {
      'iris-plus': irisPlusStandards,
      'giin': irisPlusStandards, // Simplified - would have different standards
      'custom': [],
    };

    return standards[framework] || [];
  }

  private recommendCollectionMethod(outcome: string): string {
    const methods: Record<string, string> = {
      'food-security': 'farm-level-surveys',
      'income-generation': 'financial-records',
      'soil-health': 'soil-testing',
      'literacy': 'standardized-assessments',
      'health': 'clinic-records',
    };
    return methods[outcome] || 'surveys';
  }

  private recommendFrequency(outcome: string): string {
    const frequencies: Record<string, string> = {
      'food-security': 'seasonal',
      'income-generation': 'annual',
      'soil-health': 'bi-annual',
      'literacy': 'annual',
      'health': 'continuous',
    };
    return frequencies[outcome] || 'annual';
  }

  private analyzeOutcomes(input: ImpactAnalysisInput, metrics: Metric[]): Outcome[] {
    return metrics.map(m => ({
      metric: m.name,
      value: input.projectData.metrics[m.name] || 'pending',
      baseline: m.baseline,
      target: m.target,
      unit: m.unit,
      confidence: 0.8,
      methodology: m.collectionMethod,
    }));
  }

  private analyzeSDGAlignment(input: ImpactAnalysisInput, outcomes: Outcome[]): SDGAlignment[] {
    const alignment: SDGAlignment[] = [];
    
    // Map outcomes to SDGs
    const sdgMap: Record<string, { goal: number; targets: string[] }> = {
      'food-security': { goal: 2, targets: ['2.3', '2.4'] },
      'income-generation': { goal: 8, targets: ['8.3', '8.5'] },
      'soil-health': { goal: 15, targets: ['15.3'] },
      'clean-water-access': { goal: 6, targets: ['6.1', '6.2'] },
    };

    for (const outcome of outcomes) {
      const sdg = sdgMap[outcome.metric.toLowerCase().replace(' indicator', '')];
      if (sdg) {
        alignment.push({
          goal: sdg.goal,
          targets: sdg.targets,
          contribution: 'direct',
          evidence: `Project activity: ${input.projectData.activities.join(', ')}`,
        });
      }
    }

    return alignment;
  }

  private assessVerification(input: ImpactAnalysisInput, outcomes: Outcome[]): VerificationSummary {
    const level = input.verificationLevel || 'self-reported';
    
    const methods: Record<string, string[]> = {
      'self-reported': ['project-documentation', 'participant-surveys'],
      'third-party': ['independent-audit', 'site-visits', 'data-review'],
      'audited': ['full-financial-audit', 'impact-verification', 'stakeholder-interviews'],
    };

    return {
      level,
      methods: methods[level],
      gaps: this.identifyVerificationGaps(outcomes, level),
      recommendations: this.generateVerificationRecommendations(level),
    };
  }

  private identifyVerificationGaps(outcomes: Outcome[], level: string): string[] {
    const gaps: string[] = [];
    
    if (level === 'self-reported') {
      gaps.push('Independent verification not conducted');
    }
    
    const pendingOutcomes = outcomes.filter(o => o.value === 'pending');
    if (pendingOutcomes.length > 0) {
      gaps.push(`${pendingOutcomes.length} metrics without data`);
    }

    return gaps;
  }

  private generateVerificationRecommendations(level: string): string[] {
    if (level === 'self-reported') {
      return [
        'Engage third-party verifier for key metrics',
        'Implement data quality controls',
        'Document methodology and assumptions',
      ];
    }
    return [];
  }

  private generateDashboardData(input: ImpactAnalysisInput, outcomes: Outcome[]): DashboardData {
    return {
      kpis: outcomes.map(o => ({
        name: o.metric,
        value: typeof o.value === 'number' ? o.value : 0,
        unit: o.unit,
        trend: 'stable',
        changePercent: 0,
      })),
      timeSeries: [], // Would require historical data
      comparisons: [],
    };
  }

  private generateImpactSummary(input: ImpactAnalysisInput, outcomes: Outcome[]): string {
    const achieved = outcomes.filter(o => typeof o.value === 'number');
    return `${input.projectData.name} achieved measurable outcomes in ${achieved.length} of ${outcomes.length} impact areas.`;
  }

  private generateRecommendations(metrics: Metric[], verification: VerificationSummary): string[] {
    return [
      `Complete data collection for ${metrics.filter(m => !m.baseline).length} missing baselines`,
      `Strengthen verification through ${verification.level === 'self-reported' ? 'third-party' : 'enhanced'} methods`,
      'Document lessons learned for replication',
    ];
  }

  private async storeImpactAnalysis(
    input: ImpactAnalysisInput,
    output: ImpactAnalysisOutput,
    context: AgentContext
  ): Promise<void> {
    await this.knowledgeCurator.store({
      id: this.generateId(),
      agentId: this.config.name,
      category: 'impact-analysis',
      tags: [input.projectData.projectId, input.framework || 'custom'],
      content: JSON.stringify({
        summary: output.impactReport.summary,
        outcomes: output.impactReport.outcomes.length,
        sdgs: output.impactReport.sdgAlignment.map(s => s.goal),
      }),
      confidence: 0.85,
      citations: [],
      createdAt: new Date(),
    });
  }

  private calculateMetricValue(metric: Metric, rawData: Record<string, unknown>): number {
    // Placeholder calculation
    return Number(rawData[metric.name]) || 0;
  }

  private identifyTrends(calculated: CalculatedMetric[]): Trend[] {
    return [];
  }

  private identifyAnomalies(calculated: CalculatedMetric[]): Anomaly[] {
    return [];
  }

  private async queryAnalyses(projectId: string, period: { start: Date; end: Date }): Promise<ImpactAnalysisOutput[]> {
    // Query stored analyses
    return [];
  }

  private generateExecutiveSummary(analyses: ImpactAnalysisOutput[]): string {
    return `Analysis of ${analyses.length} impact assessments.`;
  }

  private compileOutcomes(analyses: ImpactAnalysisOutput[]): Outcome[] {
    return analyses.flatMap(a => a.impactReport.outcomes);
  }

  private extractStories(analyses: ImpactAnalysisOutput[]): string[] {
    return [];
  }

  private summarizeVerification(analyses: ImpactAnalysisOutput[]): VerificationSummary {
    return analyses[0]?.verificationSummary || { level: 'self-reported', methods: [], gaps: [], recommendations: [] };
  }

  private compileRecommendations(analyses: ImpactAnalysisOutput[]): string[] {
    return analyses.flatMap(a => a.recommendations);
  }

  private defineNextSteps(analyses: ImpactAnalysisOutput[]): string[] {
    return [
      'Continue monitoring key indicators',
      'Address identified gaps',
      'Document and share learnings',
    ];
  }

  private generateSessionId(): string {
    return `impact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateId(): string {
    return `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ============================================================================
// Internal Types
// ============================================================================

interface Metric {
  name: string;
  description: string;
  unit: string;
  dataType: string;
  collectionMethod: string;
  frequency: string;
  baseline?: number;
  target?: number;
  source: string;
}

interface FrameworkStandard {
  code: string;
  outcome: string;
  metric: string;
  unit: string;
  dataType: string;
  outcomes: string[];
}

interface CalculatedMetric {
  metric: string;
  value: number;
  unit: string;
  period: { start: Date; end: Date };
  confidence: number;
  methodology: string;
}

interface Trend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
}

interface Anomaly {
  metric: string;
  expected: number;
  actual: number;
  severity: 'low' | 'medium' | 'high';
}

interface GeneratedReport {
  title: string;
  period: { start: Date; end: Date };
  type: string;
  executiveSummary: string;
  outcomes: Outcome[];
  stories: string[];
  verification: VerificationSummary;
  recommendations: string[];
  nextSteps: string[];
}
