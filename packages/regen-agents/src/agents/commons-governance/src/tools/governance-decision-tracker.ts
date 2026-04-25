/**
 * Governance Decision Tracker Tool
 * Tracks governance decisions and their outcomes over time
 */

import { AgentFinding } from '../../../types/index.js';

export interface GovernanceDecision {
  id: string;
  proposalType: string;
  title: string;
  description: string;
  proposer: string;
  votingResults: { for: number; against: number; abstain: number };
  quorum: number;
  threshold: number;
  timestamp: Date;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  executionDate?: Date;
  outcomes: DecisionOutcome[];
  tags: string[];
}

export interface DecisionOutcome {
  metric: string;
  expected: string;
  actual: string | null;
  timestamp: Date;
  variance: 'better' | 'as-expected' | 'worse' | 'unknown';
}

export interface DecisionQualityAnalysis {
  totalDecisions: number;
  participationRate: number;
  outcomeAccuracy: number;
  timeToExecution: number; // average days
  commonIssues: string[];
  recommendations: string[];
  trendAnalysis: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
}

export class GovernanceDecisionTrackerTool {
  private decisions: Map<string, GovernanceDecision> = new Map();
  private decisionHistory: GovernanceDecision[] = [];

  async trackDecision(decision: Omit<GovernanceDecision, 'outcomes'>): Promise<GovernanceDecision> {
    const fullDecision: GovernanceDecision = {
      ...decision,
      outcomes: [],
    };

    this.decisions.set(decision.id, fullDecision);
    this.decisionHistory.push(fullDecision);

    return fullDecision;
  }

  async recordOutcome(
    decisionId: string, 
    outcome: Omit<DecisionOutcome, 'variance'>
  ): Promise<void> {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error(`Decision ${decisionId} not found`);
    }

    // Calculate variance
    const variance = this.calculateVariance(outcome.expected, outcome.actual);

    const fullOutcome: DecisionOutcome = {
      ...outcome,
      variance,
    };

    decision.outcomes.push(fullOutcome);
  }

  async updateDecisionStatus(
    decisionId: string, 
    status: GovernanceDecision['status'],
    executionDate?: Date
  ): Promise<void> {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error(`Decision ${decisionId} not found`);
    }

    decision.status = status;
    if (executionDate) {
      decision.executionDate = executionDate;
    }
  }

  async analyzeDecisionQuality(params?: {
    timeRange?: { start: Date; end: Date };
    proposalType?: string;
    tags?: string[];
  }): Promise<DecisionQualityAnalysis> {
    let decisions = this.decisionHistory;

    // Apply filters
    if (params?.timeRange) {
      decisions = decisions.filter(d => 
        d.timestamp >= params.timeRange!.start && 
        d.timestamp <= params.timeRange!.end
      );
    }

    if (params?.proposalType) {
      decisions = decisions.filter(d => d.proposalType === params.proposalType);
    }

    if (params?.tags) {
      decisions = decisions.filter(d => 
        params.tags!.some(tag => d.tags.includes(tag))
      );
    }

    return {
      totalDecisions: decisions.length,
      participationRate: this.calculateParticipationRate(decisions),
      outcomeAccuracy: this.calculateOutcomeAccuracy(decisions),
      timeToExecution: this.calculateTimeToExecution(decisions),
      commonIssues: this.identifyCommonIssues(decisions),
      recommendations: this.generateImprovementRecommendations(decisions),
      trendAnalysis: this.analyzeTrends(decisions),
    };
  }

  async getDecisionsByTag(tag: string): Promise<GovernanceDecision[]> {
    return Array.from(this.decisions.values())
      .filter(d => d.tags.includes(tag))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getDecisionTimeline(decisionId: string): Promise<{
    proposal: GovernanceDecision;
    keyEvents: { date: Date; event: string; actor?: string }[];
    currentStatus: string;
    daysActive: number;
  } | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const keyEvents: { date: Date; event: string; actor?: string }[] = [
      { date: decision.timestamp, event: 'Proposal submitted', actor: decision.proposer },
    ];

    if (decision.executionDate) {
      keyEvents.push({ 
        date: decision.executionDate, 
        event: 'Decision executed',
      });
    }

    for (const outcome of decision.outcomes) {
      keyEvents.push({
        date: outcome.timestamp,
        event: `Outcome recorded: ${outcome.metric}`,
      });
    }

    const daysActive = Math.floor(
      (Date.now() - decision.timestamp.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      proposal: decision,
      keyEvents: keyEvents.sort((a, b) => a.date.getTime() - b.date.getTime()),
      currentStatus: decision.status,
      daysActive,
    };
  }

  async identifyBottlenecks(): Promise<{
    bottleneck: string;
    frequency: number;
    avgDelay: number;
    affectedDecisions: string[];
    recommendations: string[];
  }[]> {
    const bottlenecks: {
      bottleneck: string;
      frequency: number;
      totalDelay: number;
      affectedDecisions: string[];
    }[] = [
      { bottleneck: 'Quorum not reached', frequency: 0, totalDelay: 0, affectedDecisions: [] },
      { bottleneck: 'Threshold not met', frequency: 0, totalDelay: 0, affectedDecisions: [] },
      { bottleneck: 'Execution delayed', frequency: 0, totalDelay: 0, affectedDecisions: [] },
    ];

    for (const decision of this.decisionHistory) {
      const totalVotes = decision.votingResults.for + decision.votingResults.against + decision.votingResults.abstain;
      
      if (totalVotes < decision.quorum) {
        const b = bottlenecks.find(b => b.bottleneck === 'Quorum not reached')!;
        b.frequency++;
        b.affectedDecisions.push(decision.id);
      }

      if (decision.status === 'pending' && decision.executionDate) {
        const delay = decision.executionDate.getTime() - decision.timestamp.getTime();
        const b = bottlenecks.find(b => b.bottleneck === 'Execution delayed')!;
        b.frequency++;
        b.totalDelay += delay;
        b.affectedDecisions.push(decision.id);
      }
    }

    return bottlenecks
      .filter(b => b.frequency > 0)
      .map(b => ({
        bottleneck: b.bottleneck,
        frequency: b.frequency,
        avgDelay: b.totalDelay / b.frequency / (1000 * 60 * 60 * 24), // in days
        affectedDecisions: b.affectedDecisions,
        recommendations: this.getBottleneckRecommendations(b.bottleneck),
      }));
  }

  private calculateVariance(expected: string, actual: string | null): DecisionOutcome['variance'] {
    if (!actual) return 'unknown';
    
    // Simple comparison (could be enhanced with numerical parsing)
    if (actual === expected) return 'as-expected';
    
    // Check if outcome seems better/worse based on keywords
    const positiveIndicators = ['increased', 'improved', 'higher', 'better', 'more'];
    const negativeIndicators = ['decreased', 'worse', 'lower', 'less', 'failed'];
    
    const hasPositive = positiveIndicators.some(p => actual.toLowerCase().includes(p));
    const hasNegative = negativeIndicators.some(n => actual.toLowerCase().includes(n));
    
    if (hasPositive && !hasNegative) return 'better';
    if (hasNegative && !hasPositive) return 'worse';
    
    return 'as-expected';
  }

  private calculateParticipationRate(decisions: GovernanceDecision[]): number {
    if (decisions.length === 0) return 0;
    
    const totalVotes = decisions.reduce((sum, d) => 
      sum + d.votingResults.for + d.votingResults.against + d.votingResults.abstain, 0
    );
    const totalPossible = decisions.reduce((sum, d) => sum + d.quorum * 3, 0); // Rough estimate
    
    return totalPossible > 0 ? totalVotes / totalPossible : 0;
  }

  private calculateOutcomeAccuracy(decisions: GovernanceDecision[]): number {
    const executed = decisions.filter(d => d.status === 'executed');
    if (executed.length === 0) return 0;

    const withOutcomes = executed.filter(d => d.outcomes.length > 0);
    if (withOutcomes.length === 0) return 0;

    const accurate = withOutcomes.filter(d => 
      d.outcomes.every(o => o.variance === 'as-expected' || o.variance === 'better')
    );

    return accurate.length / withOutcomes.length;
  }

  private calculateTimeToExecution(decisions: GovernanceDecision[]): number {
    const executed = decisions.filter(d => d.executionDate);
    if (executed.length === 0) return 0;

    const totalDays = executed.reduce((sum, d) => {
      const days = (d.executionDate!.getTime() - d.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return Math.round(totalDays / executed.length);
  }

  private identifyCommonIssues(decisions: GovernanceDecision[]): string[] {
    const issues: string[] = [];

    // Check for low participation
    const lowParticipation = decisions.filter(d => {
      const total = d.votingResults.for + d.votingResults.against + d.votingResults.abstain;
      return total < d.quorum * 0.5;
    });
    if (lowParticipation.length > decisions.length * 0.2) {
      issues.push('Low participation in governance decisions');
    }

    // Check for execution delays
    const delayed = decisions.filter(d => d.status === 'pending' && 
      (Date.now() - d.timestamp.getTime()) > 30 * 24 * 60 * 60 * 1000 // 30 days
    );
    if (delayed.length > 0) {
      issues.push('Proposals pending execution for >30 days');
    }

    // Check for failed proposals
    const failed = decisions.filter(d => d.status === 'failed');
    if (failed.length > decisions.length * 0.3) {
      issues.push('High proposal failure rate');
    }

    return issues;
  }

  private generateImprovementRecommendations(decisions: GovernanceDecision[]): string[] {
    const recommendations: string[] = [];
    const issues = this.identifyCommonIssues(decisions);

    if (issues.includes('Low participation in governance decisions')) {
      recommendations.push('Implement delegation mechanism for passive members');
      recommendations.push('Create clearer proposal templates to lower barriers');
      recommendations.push('Use notification systems to increase awareness');
    }

    if (issues.includes('Proposals pending execution for >30 days')) {
      recommendations.push('Establish automatic execution triggers');
      recommendations.push('Create execution working group with clear mandate');
    }

    if (issues.includes('High proposal failure rate')) {
      recommendations.push('Implement pre-proposal temperature checks');
      recommendations.push('Provide mentorship for new proposers');
      recommendations.push('Review quorum and threshold requirements');
    }

    return recommendations;
  }

  private analyzeTrends(decisions: GovernanceDecision[]): DecisionQualityAnalysis['trendAnalysis'] {
    const improving: string[] = [];
    const declining: string[] = [];
    const stable: string[] = [];

    // Analyze participation trend
    const participationByMonth = this.groupByMonth(decisions, d => 
      (d.votingResults.for + d.votingResults.against) / (d.quorum || 1)
    );
    
    if (this.isTrendIncreasing(participationByMonth)) {
      improving.push('Participation rates');
    } else if (this.isTrendDecreasing(participationByMonth)) {
      declining.push('Participation rates');
    } else {
      stable.push('Participation rates');
    }

    return { improving, declining, stable };
  }

  private groupByMonth<T>(
    decisions: GovernanceDecision[], 
    valueFn: (d: GovernanceDecision) => T
  ): { month: string; value: T }[] {
    const grouped: Record<string, T[]> = {};

    for (const d of decisions) {
      const month = d.timestamp.toISOString().slice(0, 7); // YYYY-MM
      grouped[month] = grouped[month] || [];
      grouped[month].push(valueFn(d));
    }

    return Object.entries(grouped)
      .map(([month, values]) => ({
        month,
        value: values.reduce((a, b) => a + (b as number), 0) / values.length as T,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private isTrendIncreasing(values: { value: number }[]): boolean {
    if (values.length < 3) return false;
    const first = values.slice(0, Math.ceil(values.length / 2)).reduce((a, b) => a + b.value, 0);
    const second = values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b.value, 0);
    return second > first * 1.1;
  }

  private isTrendDecreasing(values: { value: number }[]): boolean {
    if (values.length < 3) return false;
    const first = values.slice(0, Math.ceil(values.length / 2)).reduce((a, b) => a + b.value, 0);
    const second = values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b.value, 0);
    return second < first * 0.9;
  }

  private getBottleneckRecommendations(bottleneck: string): string[] {
    const recommendations: Record<string, string[]> = {
      'Quorum not reached': [
        'Lower quorum requirements',
        'Implement vote delegation',
        'Increase engagement through education',
      ],
      'Threshold not met': [
        'Review threshold levels',
        'Implement phased proposals',
        'Provide proposal coaching',
      ],
      'Execution delayed': [
        'Create execution working group',
        'Automate execution where possible',
        'Set clear execution deadlines',
      ],
    };

    return recommendations[bottleneck] || ['Review and streamline process'];
  }
}
