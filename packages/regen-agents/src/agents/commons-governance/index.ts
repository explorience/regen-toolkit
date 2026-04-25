/**
 * Commons Governance Specialist Agent
 * 
 * Specialist agent for analyzing and designing governance structures for commons,
 * DAOs, cooperatives, and collective resource management.
 */

import {
  AgentConfig,
  AgentContext,
  GovernanceAnalysisInput,
  GovernanceAnalysisOutput,
  GovernanceRecommendation,
  OstromPrincipleAssessment,
  RiskAssessment,
  KnowledgeEntry,
  AgentFinding,
} from '../../types/index.js';
import { KnowledgeCurator } from '../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../integrations/meeting-processor.js';

export class CommonsGovernanceSpecialist {
  private config: AgentConfig;
  private knowledgeCurator: KnowledgeCurator;
  private meetingProcessor: MeetingProcessor;

  constructor(
    knowledgeCurator: KnowledgeCurator,
    meetingProcessor: MeetingProcessor
  ) {
    this.config = {
      name: 'commons-governance-specialist',
      description: 'Specialist agent for commons governance and institutional design',
      model: 'zen/kimi-k2.5',
      maxTurns: 50,
      skills: [
        'governance-decision-tracker',
        'commons-governance',
        'schema-generator',
        'ostrom-analysis',
        'legal-wrapper-analysis',
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
   * Main analysis method - analyzes governance proposals and documents
   */
  async analyzeProposal(input: GovernanceAnalysisInput): Promise<GovernanceAnalysisOutput> {
    const context: AgentContext = {
      organizationId: 'default',
      sessionId: this.generateSessionId(),
      timestamp: new Date(),
      metadata: {
        proposalType: input.proposalType,
        jurisdiction: input.jurisdiction,
      },
    };

    // Step 1: Query existing governance knowledge
    const existingKnowledge = await this.queryKnowledgeBase(input);

    // Step 2: Analyze governance structure
    const structureAnalysis = this.analyzeGovernanceStructure(input);

    // Step 3: Apply Ostrom principles assessment
    const ostromAssessment = this.assessOstromPrinciples(input, structureAnalysis);

    // Step 4: Identify risks
    const riskAssessment = this.assessRisks(input, structureAnalysis, ostromAssessment);

    // Step 5: Generate recommendations
    const recommendations = this.generateRecommendations(
      input,
      structureAnalysis,
      ostromAssessment,
      riskAssessment
    );

    const output: GovernanceAnalysisOutput = {
      analysis: structureAnalysis.summary,
      recommendations,
      ostromAssessment,
      riskAssessment,
      implementationSteps: this.generateImplementationSteps(recommendations),
      legalConsiderations: input.proposalType === 'legal-wrapper' 
        ? this.analyzeLegalConsiderations(input)
        : undefined,
    };

    // Step 6: Store findings
    await this.storeGovernanceAnalysis(input, output, context);

    return output;
  }

  /**
   * Analyze a DAO proposal
   */
  async analyzeDAOProposal(proposal: {
    title: string;
    type: 'treasury' | 'governance' | 'membership' | 'parameter-change';
    description: string;
    proposer: string;
    votingPeriod: number;
    quorum: number;
    threshold: number;
  }): Promise<{
    analysis: string;
    ostromFit: OstromPrincipleAssessment[];
    risks: RiskAssessment[];
    recommendation: 'support' | 'oppose' | 'amend' | 'needs-more-info';
  }> {
    const structureAnalysis = this.analyzeDAOStructure(proposal);
    const ostromAssessment = this.assessDAOAgainstOstrom(proposal);
    const risks = this.identifyDAORisks(proposal);

    return {
      analysis: structureAnalysis,
      ostromFit: ostromAssessment,
      risks,
      recommendation: this.generateDAORecommendation(proposal, ostromAssessment, risks),
    };
  }

  /**
   * Compare legal wrapper options
   */
  async compareLegalWrappers(options: {
    jurisdiction: string;
    activities: string[];
    members: number;
    hasToken: boolean;
    requiresLiabilityProtection: boolean;
  }): Promise<{
    options: LegalWrapperOption[];
    recommendation: string;
    comparisonMatrix: Record<string, unknown>;
  }> {
    const wrappers = this.identifyApplicableWrappers(options);
    
    const wrapperOptions: LegalWrapperOption[] = wrappers.map(w => ({
      type: w,
      pros: this.getWrapperPros(w, options),
      cons: this.getWrapperCons(w, options),
      compliance: this.getWrapperCompliance(w, options.jurisdiction),
      costEstimate: this.estimateWrapperCost(w),
    }));

    return {
      options: wrapperOptions,
      recommendation: this.recommendWrapper(wrapperOptions, options),
      comparisonMatrix: this.createComparisonMatrix(wrapperOptions),
    };
  }

  /**
   * Design dispute resolution process
   */
  async designDisputeResolution(params: {
    communitySize: number;
    disputeTypes: string[];
    resources: string[];
    escalationNeeded: boolean;
  }): Promise<{
    process: DisputeResolutionProcess;
    roles: DisputeResolutionRole[];
    timeline: { phase: string; duration: string }[];
  }> {
    return {
      process: this.createDisputeProcess(params),
      roles: this.defineDisputeRoles(params),
      timeline: this.defineDisputeTimeline(params),
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
    input: GovernanceAnalysisInput
  ): Promise<KnowledgeEntry[]> {
    return this.knowledgeCurator.query({
      category: 'governance-analysis',
      tags: [input.proposalType, input.jurisdiction].filter(Boolean) as string[],
    });
  }

  private analyzeGovernanceStructure(input: GovernanceAnalysisInput): GovernanceStructure {
    return {
      type: this.identifyGovernanceType(input.proposalType),
      decisionMaking: this.mapDecisionMaking(input.content),
      memberRights: this.identifyMemberRights(input.content),
      summary: `Governance structure analyzed for ${input.proposalType}`,
    };
  }

  private identifyGovernanceType(proposalType: string): string {
    const typeMap: Record<string, string> = {
      'dao-charter': 'DAO',
      'cooperative-bylaws': 'Cooperative',
      'legal-wrapper': 'Hybrid',
      'dispute-resolution': 'Process',
      'voting-mechanism': 'Decision-System',
      'treasury-management': 'Financial-Governance',
    };
    return typeMap[proposalType] || 'Unknown';
  }

  private mapDecisionMaking(content: string): DecisionMakingStructure {
    return {
      authority: 'distributed',
      votingMechanism: 'token-weighted',
      quorum: 0.33,
      threshold: 0.5,
    };
  }

  private identifyMemberRights(content: string): MemberRights {
    return {
      voting: true,
      proposal: true,
      information: true,
      exit: true,
    };
  }

  private assessOstromPrinciples(
    input: GovernanceAnalysisInput,
    structure: GovernanceStructure
  ): OstromPrincipleAssessment[] {
    const principles = [
      {
        principle: '1. Clearly Defined Boundaries',
        description: 'Individuals or households who have rights to withdraw resource units from the CPR must be clearly defined, as must the boundaries of the CPR itself.',
        compliance: this.assessBoundaryClarity(input, structure) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '2. Proportional Equivalence Between Benefits and Costs',
        description: 'Rules specifying the amount of resource products that a user is allocated are related to local conditions and to rules requiring labor, materials, and/or money inputs.',
        compliance: this.assessProportionalEquivalence(input) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '3. Collective-Choice Arrangements',
        description: 'Most individuals affected by the operational rules can participate in modifying the operational rules.',
        compliance: this.assessCollectiveChoice(input, structure) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '4. Monitoring',
        description: 'Monitors, who actively audit CPR conditions and user behavior, are accountable to the users or are the users themselves.',
        compliance: this.assessMonitoring(input) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '5. Graduated Sanctions',
        description: 'Users who violate operational rules are likely to be assessed graduated sanctions (depending on the seriousness and context of the offense) by other users, by officials accountable to these users, or by both.',
        compliance: this.assessSanctions(input) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '6. Conflict Resolution Mechanisms',
        description: 'Users and their officials have rapid access to low-cost local arenas to resolve conflicts among users or between users and officials.',
        compliance: this.assessConflictResolution(input) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '7. Minimal Recognition of Rights to Organize',
        description: 'The rights of users to devise their own institutions are not challenged by external governmental authorities.',
        compliance: this.assessRecognitionRights(input) as any,
        gaps: [],
        recommendations: [],
      },
      {
        principle: '8. Nested Enterprises',
        description: 'For CPRs that are parts of larger systems: Appropriation, provision, monitoring, enforcement, conflict resolution, and governance activities are organized in multiple layers of nested enterprises.',
        compliance: this.assessNestedEnterprises(input) as any,
        gaps: [],
        recommendations: [],
      },
    ];

    return principles;
  }

  private assessRisks(
    input: GovernanceAnalysisInput,
    structure: GovernanceStructure,
    ostromAssessment: OstromPrincipleAssessment[]
  ): RiskAssessment[] {
    const risks: RiskAssessment[] = [];

    // Check for capture risk
    if (structure.decisionMaking.votingMechanism === 'token-weighted') {
      risks.push({
        risk: 'Governance capture by large token holders',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Implement quadratic voting or delegation mechanisms',
      });
    }

    // Check for participation risk
    const collectiveChoice = ostromAssessment.find(p => 
      p.principle.includes('Collective-Choice')
    );
    if (collectiveChoice?.compliance !== 'full') {
      risks.push({
        risk: 'Low participation in governance decisions',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Lower quorum requirements, improve engagement mechanisms',
      });
    }

    // Check for monitoring risk
    const monitoring = ostromAssessment.find(p => p.principle.includes('Monitoring'));
    if (monitoring?.compliance !== 'full') {
      risks.push({
        risk: 'Inadequate monitoring of resource use or compliance',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Establish clear monitoring protocols and incentives',
      });
    }

    return risks;
  }

  private generateRecommendations(
    input: GovernanceAnalysisInput,
    structure: GovernanceStructure,
    ostromAssessment: OstromPrincipleAssessment[],
    riskAssessment: RiskAssessment[]
  ): GovernanceRecommendation[] {
    const recommendations: GovernanceRecommendation[] = [];

    // Generate recommendations based on Ostrom gaps
    for (const principle of ostromAssessment) {
      if (principle.compliance !== 'full') {
        recommendations.push({
          category: 'Ostrom Principle Alignment',
          recommendation: `Strengthen ${principle.principle.split('.')[0]}: ${principle.description.substring(0, 50)}...`,
          rationale: `Current compliance level: ${principle.compliance}`,
          priority: principle.compliance === 'none' ? 'high' : 'medium',
          implementation: principle.recommendations[0] || 'Review and revise governance documentation',
        });
      }
    }

    // Generate recommendations based on risks
    for (const risk of riskAssessment) {
      recommendations.push({
        category: 'Risk Mitigation',
        recommendation: risk.mitigation,
        rationale: `Addresses risk: ${risk.risk} (Likelihood: ${risk.likelihood}, Impact: ${risk.impact})`,
        priority: (risk.likelihood === 'high' || risk.impact === 'high') ? 'high' : 'medium',
        implementation: 'Update governance procedures and communicate to members',
      });
    }

    return recommendations;
  }

  private generateImplementationSteps(recommendations: GovernanceRecommendation[]): string[] {
    const highPriority = recommendations.filter(r => r.priority === 'high');
    const mediumPriority = recommendations.filter(r => r.priority === 'medium');

    return [
      'Phase 1: Address high-priority recommendations',
      ...highPriority.map(r => `  - ${r.recommendation}`),
      'Phase 2: Implement medium-priority items',
      ...mediumPriority.map(r => `  - ${r.recommendation}`),
      'Phase 3: Monitor and iterate based on feedback',
    ];
  }

  private analyzeLegalConsiderations(input: GovernanceAnalysisInput): string[] {
    return [
      'Review applicable securities laws if offering membership interests',
      'Consider tax implications of entity structure',
      'Assess liability protection for members',
      'Evaluate regulatory compliance requirements',
      'Review employment law implications if hiring',
    ];
  }

  private async storeGovernanceAnalysis(
    input: GovernanceAnalysisInput,
    output: GovernanceAnalysisOutput,
    context: AgentContext
  ): Promise<void> {
    await this.knowledgeCurator.store({
      id: this.generateId(),
      agentId: this.config.name,
      category: 'governance-analysis',
      tags: [input.proposalType, 'ostrom', 'analysis'],
      content: JSON.stringify({
        analysis: output.analysis,
        ostromScore: this.calculateOstromScore(output.ostromAssessment),
        riskCount: output.riskAssessment.length,
      }),
      confidence: 0.85,
      citations: [],
      createdAt: new Date(),
    });
  }

  private calculateOstromScore(assessment: OstromPrincipleAssessment[]): number {
    const scores = { full: 1, partial: 0.5, none: 0 };
    const total = assessment.reduce((sum, p) => sum + scores[p.compliance], 0);
    return total / assessment.length;
  }

  private analyzeDAOStructure(proposal: any): string {
    return `DAO proposal type: ${proposal.type}. Voting: ${proposal.quorum} quorum, ${proposal.threshold} threshold.`;
  }

  private assessDAOAgainstOstrom(proposal: any): OstromPrincipleAssessment[] {
    return this.assessOstromPrinciples(
      { proposalType: 'voting-mechanism', content: JSON.stringify(proposal) },
      { type: 'DAO', decisionMaking: { authority: 'token-weighted' } as any, memberRights: {} as any, summary: '' }
    );
  }

  private identifyDAORisks(proposal: any): RiskAssessment[] {
    return this.assessRisks(
      { proposalType: 'treasury-management', content: '' },
      { type: 'DAO', decisionMaking: { votingMechanism: 'token-weighted' } as any, memberRights: {} as any, summary: '' },
      []
    );
  }

  private generateDAORecommendation(
    proposal: any,
    ostromAssessment: OstromPrincipleAssessment[],
    risks: RiskAssessment[]
  ): 'support' | 'oppose' | 'amend' | 'needs-more-info' {
    const highRisks = risks.filter(r => r.impact === 'high' && r.likelihood === 'high');
    if (highRisks.length > 2) return 'oppose';
    
    const lowOstrom = ostromAssessment.filter(p => p.compliance === 'none');
    if (lowOstrom.length > 2) return 'amend';
    
    return 'support';
  }

  private identifyApplicableWrappers(options: any): string[] {
    const wrappers: string[] = ['LLC'];
    if (options.activities.includes('cooperative')) wrappers.push('Cooperative');
    if (options.jurisdiction === 'Delaware') wrappers.push('Delaware Series LLC');
    return wrappers;
  }

  private getWrapperPros(wrapper: string, options: any): string[] {
    const pros: Record<string, string[]> = {
      'LLC': ['Flexible governance', 'Limited liability', 'Pass-through taxation'],
      'Cooperative': ['Member ownership', 'Democratic control', 'Profit sharing'],
    };
    return pros[wrapper] || [];
  }

  private getWrapperCons(wrapper: string, options: any): string[] {
    const cons: Record<string, string[]> = {
      'LLC': ['Less familiar to traditional investors', 'State-specific rules'],
      'Cooperative': ['Complex governance', 'Member participation required'],
    };
    return cons[wrapper] || [];
  }

  private getWrapperCompliance(wrapper: string, jurisdiction: string): string[] {
    return ['File articles of organization', 'Create operating agreement', 'Maintain registered agent'];
  }

  private estimateWrapperCost(wrapper: string): string {
    const costs: Record<string, string> = {
      'LLC': '$500-2000 setup + annual fees',
      'Cooperative': '$2000-5000 setup + legal review',
    };
    return costs[wrapper] || 'Varies by jurisdiction';
  }

  private recommendWrapper(options: LegalWrapperOption[], params: any): string {
    return options[0]?.type || 'LLC';
  }

  private createComparisonMatrix(options: LegalWrapperOption[]): Record<string, unknown> {
    return Object.fromEntries(options.map(o => [o.type, { pros: o.pros.length, cons: o.cons.length }]));
  }

  private createDisputeProcess(params: any): DisputeResolutionProcess {
    return {
      stages: [
        { name: 'Informal Discussion', description: 'Direct communication between parties' },
        { name: 'Mediation', description: 'Facilitated negotiation with neutral third party' },
        { name: 'Arbitration', description: 'Binding decision by appointed arbitrator' },
      ],
      triggers: params.disputeTypes,
    };
  }

  private defineDisputeRoles(params: any): DisputeResolutionRole[] {
    return [
      { name: 'Mediator', responsibilities: ['Facilitate discussion', 'Remain neutral'] },
      { name: 'Arbitrator', responsibilities: ['Hear evidence', 'Issue binding decision'] },
    ];
  }

  private defineDisputeTimeline(params: any): { phase: string; duration: string }[] {
    return [
      { phase: 'Initial Discussion', duration: '7 days' },
      { phase: 'Mediation', duration: '14 days' },
      { phase: 'Arbitration', duration: '30 days' },
    ];
  }

  // Ostrom Assessment Helpers
  private assessBoundaryClarity(input: GovernanceAnalysisInput, structure: GovernanceStructure): string {
    return input.content.includes('membership') ? 'full' : 'partial';
  }

  private assessProportionalEquivalence(input: GovernanceAnalysisInput): string {
    return input.content.includes('contribution') ? 'full' : 'partial';
  }

  private assessCollectiveChoice(input: GovernanceAnalysisInput, structure: GovernanceStructure): string {
    return structure.decisionMaking.authority === 'distributed' ? 'full' : 'partial';
  }

  private assessMonitoring(input: GovernanceAnalysisInput): string {
    return input.content.includes('monitor') ? 'full' : 'partial';
  }

  private assessSanctions(input: GovernanceAnalysisInput): string {
    return input.content.includes('sanction') ? 'full' : 'none';
  }

  private assessConflictResolution(input: GovernanceAnalysisInput): string {
    return input.content.includes('dispute') ? 'full' : 'partial';
  }

  private assessRecognitionRights(input: GovernanceAnalysisInput): string {
    return 'full'; // Assume external recognition
  }

  private assessNestedEnterprises(input: GovernanceAnalysisInput): string {
    return input.content.includes('nested') || input.content.includes('federal') ? 'full' : 'partial';
  }

  private generateSessionId(): string {
    return `gov-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateId(): string {
    return `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ============================================================================
// Internal Types
// ============================================================================

interface GovernanceStructure {
  type: string;
  decisionMaking: DecisionMakingStructure;
  memberRights: MemberRights;
  summary: string;
}

interface DecisionMakingStructure {
  authority: string;
  votingMechanism: string;
  quorum: number;
  threshold: number;
}

interface MemberRights {
  voting: boolean;
  proposal: boolean;
  information: boolean;
  exit: boolean;
}

interface LegalWrapperOption {
  type: string;
  pros: string[];
  cons: string[];
  compliance: string[];
  costEstimate: string;
}

interface DisputeResolutionProcess {
  stages: { name: string; description: string }[];
  triggers: string[];
}

interface DisputeResolutionRole {
  name: string;
  responsibilities: string[];
}
