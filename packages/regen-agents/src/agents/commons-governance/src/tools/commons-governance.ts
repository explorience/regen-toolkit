/**
 * Commons Governance Tool
 * Analyzes and designs commons governance structures using Ostrom principles
 */

import { 
  GovernanceRecommendation, 
  OstromPrincipleAssessment, 
  RiskAssessment 
} from '../../../types/index.js';

export interface OstromPrinciple {
  number: number;
  name: string;
  description: string;
  guidance: string[];
  commonPitfalls: string[];
  caseExamples: string[];
}

export interface GovernanceAssessment {
  ostromAssessments: OstromPrincipleAssessment[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  criticalGaps: string[];
  recommendations: GovernanceRecommendation[];
}

export interface GovernanceDesignRequest {
  resourceType: 'physical' | 'digital' | 'hybrid';
  communitySize: number;
  geography: 'local' | 'regional' | 'global';
  governanceType: 'dao' | 'cooperative' | 'hybrid' | 'custom';
  keyChallenges: string[];
  constraints: string[];
}

export class CommonsGovernanceTool {
  private ostromPrinciples: OstromPrinciple[] = [
    {
      number: 1,
      name: 'Clearly Defined Boundaries',
      description: 'Individuals or households who have rights to withdraw resource units from the CPR must be clearly defined, as must the boundaries of the CPR itself.',
      guidance: [
        'Define membership criteria explicitly',
        'Map resource boundaries clearly',
        'Distinguish between members and non-members',
        'Consider graduated membership tiers',
      ],
      commonPitfalls: [
        'Ambiguous membership rules',
        'Overlapping resource claims',
        'Excluding legitimate stakeholders',
      ],
      caseExamples: [
        'Swiss alpine grazing communities',
        'Japanese common forests',
        'Maine lobster fisheries',
      ],
    },
    {
      number: 2,
      name: 'Proportional Equivalence Between Benefits and Costs',
      description: 'Rules specifying the amount of resource products that a user is allocated are related to local conditions and to rules requiring labor, materials, and/or money inputs.',
      guidance: [
        'Link benefits to contributions',
        'Adjust for local conditions',
        'Ensure transparency in allocation',
        'Allow for need-based exceptions',
      ],
      commonPitfalls: [
        'Free-rider problems',
        'Elite capture of benefits',
        'Inequitable burden distribution',
      ],
      caseExamples: [
        'Philippine irrigation systems',
        'Spanish huertas',
        'Turkish fisheries',
      ],
    },
    {
      number: 3,
      name: 'Collective-Choice Arrangements',
      description: 'Most individuals affected by the operational rules can participate in modifying the operational rules.',
      guidance: [
        'Enable proposal submission by all members',
        'Ensure accessible deliberation forums',
        'Protect minority voice in decisions',
        'Document decision rationale transparently',
      ],
      commonPitfalls: [
        'Low participation rates',
        'Capture by active minorities',
        'Complex proposals excluding lay members',
      ],
      caseExamples: [
        'Indonesian irrigation committees',
        'Swiss village assemblies',
        'Community forestry in Nepal',
      ],
    },
    {
      number: 4,
      name: 'Monitoring',
      description: 'Monitors, who actively audit CPR conditions and user behavior, are accountable to the users or are the users themselves.',
      guidance: [
        'Define clear monitoring protocols',
        'Ensure monitor accountability',
        'Use appropriate technology',
        'Balance cost and coverage',
      ],
      commonPitfalls: [
        'Insufficient monitoring resources',
        'Monitors accountable to external actors',
        'Over-reliance on self-reporting',
      ],
      caseExamples: [
        'Japanese forest management associations',
        'Swedish fishing cooperatives',
        'Community wildlife monitoring',
      ],
    },
    {
      number: 5,
      name: 'Graduated Sanctions',
      description: 'Users who violate operational rules are likely to be assessed graduated sanctions (depending on the seriousness and context of the offense) by other users, by officials accountable to these users, or by both.',
      guidance: [
        'Design proportional consequences',
        'Start with informal warnings',
        'Escalate based on severity and repetition',
        'Allow for appeal and restoration',
      ],
      commonPitfalls: [
        'Overly harsh initial sanctions',
        'Inconsistent enforcement',
        'No path for reintegration',
      ],
      caseExamples: [
        'Swiss alpine community sanctions',
        'Philippine coastal resource management',
        'Spanish irrigation tribunal enforcement',
      ],
    },
    {
      number: 6,
      name: 'Conflict Resolution Mechanisms',
      description: 'Users and their officials have rapid access to low-cost local arenas to resolve conflicts among users or between users and officials.',
      guidance: [
        'Provide accessible dispute forums',
        'Minimize cost and delay',
        'Ensure neutral facilitation',
        'Preserve ongoing relationships',
      ],
      commonPitfalls: [
        'Expensive or distant resolution options',
        'Biased decision-makers',
        'Overly adversarial processes',
      ],
      caseExamples: [
        'Indonesian village mediation',
        'Japanese forest association arbitration',
        'Swiss communal courts',
      ],
    },
    {
      number: 7,
      name: 'Minimal Recognition of Rights to Organize',
      description: 'The rights of users to devise their own institutions are not challenged by external governmental authorities.',
      guidance: [
        'Secure legal recognition',
        'Maintain autonomy in rule-making',
        'Engage constructively with government',
        'Document customary rights',
      ],
      commonPitfalls: [
        'Government co-optation',
        'Legal uncertainty',
        'External rule imposition',
      ],
      caseExamples: [
        'Mexican ejidos after reform',
        'Philippine indigenous community rights',
        'Swiss communal governance tradition',
      ],
    },
    {
      number: 8,
      name: 'Nested Enterprises',
      description: 'For CPRs that are parts of larger systems: Appropriation, provision, monitoring, enforcement, conflict resolution, and governance activities are organized in multiple layers of nested enterprises.',
      guidance: [
        'Match governance scale to resource scale',
        'Coordinate across governance levels',
        'Define clear authority at each level',
        'Enable information flow between levels',
      ],
      commonPitfalls: [
        'Mismatched governance and ecological scales',
        'Insufficient coordination',
        'Conflicting rules at different levels',
      ],
      caseExamples: [
        'Irrigation federations in Spain',
        'Watershed councils in Brazil',
        'Multi-level forestry in Sweden',
      ],
    },
  ];

  async assessGovernance(
    governanceData: {
      membershipRules?: string;
      resourceBoundaries?: string;
      benefitDistribution?: string;
      decisionMakingProcess?: string;
      monitoringSystems?: string;
      sanctioningProcedures?: string;
      disputeResolution?: string;
      externalRecognition?: string;
      governanceLayers?: string;
    }
  ): Promise<GovernanceAssessment> {
    const assessments: OstromPrincipleAssessment[] = [];

    // Assess each principle
    assessments.push(this.assessPrinciple1(governanceData.membershipRules, governanceData.resourceBoundaries));
    assessments.push(this.assessPrinciple2(governanceData.benefitDistribution));
    assessments.push(this.assessPrinciple3(governanceData.decisionMakingProcess));
    assessments.push(this.assessPrinciple4(governanceData.monitoringSystems));
    assessments.push(this.assessPrinciple5(governanceData.sanctioningProcedures));
    assessments.push(this.assessPrinciple6(governanceData.disputeResolution));
    assessments.push(this.assessPrinciple7(governanceData.externalRecognition));
    assessments.push(this.assessPrinciple8(governanceData.governanceLayers));

    const score = this.calculateOstromScore(assessments);
    const strengths = this.identifyStrengths(assessments);
    const weaknesses = this.identifyWeaknesses(assessments);
    const criticalGaps = this.identifyCriticalGaps(assessments);
    const recommendations = this.generateRecommendations(assessments);

    return {
      ostromAssessments: assessments,
      overallScore: score,
      strengths,
      weaknesses,
      criticalGaps,
      recommendations,
    };
  }

  async designGovernance(
    request: GovernanceDesignRequest
  ): Promise<{
    proposedStructure: GovernanceStructure;
    principleAlignment: OstromPrincipleAssessment[];
    implementationRoadmap: { phase: string; actions: string[]; timeline: string }[];
    risks: RiskAssessment[];
  }> {
    // Design governance structure based on request
    const structure = this.createGovernanceStructure(request);
    
    // Assess against Ostrom principles
    const principleAlignment = await this.assessGovernance({
      membershipRules: structure.membership.description,
      resourceBoundaries: structure.boundaries.description,
      benefitDistribution: structure.economics.description,
      decisionMakingProcess: structure.governance.description,
      monitoringSystems: structure.monitoring.description,
      sanctioningProcedures: structure.sanctions.description,
      disputeResolution: structure.disputeResolution.description,
      externalRecognition: structure.legal.description,
      governanceLayers: structure.nesting.description,
    });

    // Create implementation roadmap
    const roadmap = this.createImplementationRoadmap(request, structure);

    // Identify risks
    const risks = this.identifyGovernanceRisks(request, structure);

    return {
      proposedStructure: structure,
      principleAlignment: principleAlignment.ostromAssessments,
      implementationRoadmap: roadmap,
      risks,
    };
  }

  async compareGovernanceModels(
    models: ('dao' | 'cooperative' | 'llc' | 'unincorporated' | 'hybrid')[]
  ): Promise<{
    comparison: GovernanceModelComparison[];
    recommendation: string;
    bestFit: string;
  }> {
    const comparisons: GovernanceModelComparison[] = models.map(model => ({
      model,
      strengths: this.getModelStrengths(model),
      weaknesses: this.getModelWeaknesses(model),
      ostromFit: this.assessModelOstromFit(model),
      costEstimate: this.estimateModelCost(model),
      timeToImplement: this.estimateImplementationTime(model),
    }));

    // Recommend best fit (simplified logic)
    const bestFit = comparisons.sort((a, b) => b.ostromFit - a.ostromFit)[0]?.model || models[0];

    return {
      comparison: comparisons,
      recommendation: `Based on Ostrom principle alignment, ${bestFit} is recommended with adaptation for local context.`,
      bestFit,
    };
  }

  getPrincipleDetails(principleNumber: number): OstromPrinciple | null {
    return this.ostromPrinciples.find(p => p.number === principleNumber) || null;
  }

  getAllPrinciples(): OstromPrinciple[] {
    return [...this.ostromPrinciples];
  }

  private assessPrinciple1(membershipRules?: string, boundaries?: string): OstromPrincipleAssessment {
    const hasClearMembership = membershipRules && 
      (membershipRules.includes('criteria') || membershipRules.includes('membership'));
    const hasClearBoundaries = boundaries && 
      (boundaries.includes('boundary') || boundaries.includes('territory'));

    const compliance = hasClearMembership && hasClearBoundaries ? 'full' : 
                      hasClearMembership || hasClearBoundaries ? 'partial' : 'none';

    return {
      principle: '1. Clearly Defined Boundaries',
      description: this.ostromPrinciples[0].description,
      compliance,
      gaps: compliance !== 'full' ? this.ostromPrinciples[0].commonPitfalls : [],
      recommendations: this.ostromPrinciples[0].guidance.slice(0, 3),
    };
  }

  private assessPrinciple2(benefitDistribution?: string): OstromPrincipleAssessment {
    const hasProportional = benefitDistribution && 
      (benefitDistribution.includes('contribution') || benefitDistribution.includes('proportion'));

    return {
      principle: '2. Proportional Equivalence',
      description: this.ostromPrinciples[1].description,
      compliance: hasProportional ? 'full' : 'partial',
      gaps: !hasProportional ? ['Benefit distribution rules not clearly linked to contributions'] : [],
      recommendations: this.ostromPrinciples[1].guidance.slice(0, 2),
    };
  }

  private assessPrinciple3(decisionMaking?: string): OstromPrincipleAssessment {
    const hasParticipation = decisionMaking && 
      (decisionMaking.includes('vote') || decisionMaking.includes('participate'));

    return {
      principle: '3. Collective-Choice Arrangements',
      description: this.ostromPrinciples[2].description,
      compliance: hasParticipation ? 'full' : 'none',
      gaps: !hasParticipation ? ['Limited participation mechanisms defined'] : [],
      recommendations: this.ostromPrinciples[2].guidance.slice(0, 3),
    };
  }

  private assessPrinciple4(monitoring?: string): OstromPrincipleAssessment {
    const hasMonitoring = monitoring && 
      (monitoring.includes('monitor') || monitoring.includes('audit'));

    return {
      principle: '4. Monitoring',
      description: this.ostromPrinciples[3].description,
      compliance: hasMonitoring ? 'full' : 'partial',
      gaps: !hasMonitoring ? ['Monitoring systems not defined'] : [],
      recommendations: this.ostromPrinciples[3].guidance.slice(0, 2),
    };
  }

  private assessPrinciple5(sanctions?: string): OstromPrincipleAssessment {
    const hasSanctions = sanctions && 
      (sanctions.includes('sanction') || sanctions.includes('consequence'));

    return {
      principle: '5. Graduated Sanctions',
      description: this.ostromPrinciples[4].description,
      compliance: hasSanctions ? 'full' : 'none',
      gaps: !hasSanctions ? ['Sanctioning procedures not defined'] : [],
      recommendations: this.ostromPrinciples[4].guidance.slice(0, 3),
    };
  }

  private assessPrinciple6(disputeResolution?: string): OstromPrincipleAssessment {
    const hasDispute = disputeResolution && 
      (disputeResolution.includes('dispute') || disputeResolution.includes('conflict'));

    return {
      principle: '6. Conflict Resolution Mechanisms',
      description: this.ostromPrinciples[5].description,
      compliance: hasDispute ? 'full' : 'partial',
      gaps: !hasDispute ? ['Conflict resolution not specified'] : [],
      recommendations: this.ostromPrinciples[5].guidance.slice(0, 2),
    };
  }

  private assessPrinciple7(externalRecognition?: string): OstromPrincipleAssessment {
    const hasRecognition = externalRecognition && 
      (externalRecognition.includes('recognize') || externalRecognition.includes('legal'));

    return {
      principle: '7. Minimal Recognition of Rights',
      description: this.ostromPrinciples[6].description,
      compliance: hasRecognition ? 'full' : 'partial',
      gaps: !hasRecognition ? ['External recognition not secured'] : [],
      recommendations: this.ostromPrinciples[6].guidance.slice(0, 2),
    };
  }

  private assessPrinciple8(governanceLayers?: string): OstromPrincipleAssessment {
    const hasNesting = governanceLayers && 
      (governanceLayers.includes('layer') || governanceLayers.includes('nested') || 
       governanceLayers.includes('federal'));

    return {
      principle: '8. Nested Enterprises',
      description: this.ostromPrinciples[7].description,
      compliance: hasNesting ? 'full' : 'partial',
      gaps: !hasNesting ? ['Governance nesting not addressed'] : [],
      recommendations: this.ostromPrinciples[7].guidance.slice(0, 2),
    };
  }

  private calculateOstromScore(assessments: OstromPrincipleAssessment[]): number {
    const scores = { full: 1, partial: 0.5, none: 0 };
    const total = assessments.reduce((sum, a) => sum + scores[a.compliance], 0);
    return Math.round((total / assessments.length) * 100) / 100;
  }

  private identifyStrengths(assessments: OstromPrincipleAssessment[]): string[] {
    return assessments
      .filter(a => a.compliance === 'full')
      .map(a => a.principle.split('.')[0]);
  }

  private identifyWeaknesses(assessments: OstromPrincipleAssessment[]): string[] {
    return assessments
      .filter(a => a.compliance === 'none')
      .map(a => a.principle.split('.')[0]);
  }

  private identifyCriticalGaps(assessments: OstromPrincipleAssessment[]): string[] {
    return assessments
      .filter(a => a.compliance === 'none')
      .map(a => `${a.principle}: ${a.gaps.join(', ')}`);
  }

  private generateRecommendations(assessments: OstromPrincipleAssessment[]): GovernanceRecommendation[] {
    const recommendations: GovernanceRecommendation[] = [];

    for (const assessment of assessments) {
      if (assessment.compliance !== 'full') {
        for (const rec of assessment.recommendations) {
          recommendations.push({
            category: 'Ostrom Principle Alignment',
            recommendation: rec,
            rationale: `Addresses ${assessment.principle} (current compliance: ${assessment.compliance})`,
            priority: assessment.compliance === 'none' ? 'high' : 'medium',
            implementation: 'Review governance documentation and update procedures',
          });
        }
      }
    }

    return recommendations;
  }

  private createGovernanceStructure(request: GovernanceDesignRequest): GovernanceStructure {
    return {
      membership: {
        description: `Open membership for ${request.communitySize} participants with ${request.governanceType} governance`,
        criteria: ['Commitment to commons principles', 'Active participation requirement'],
        tiers: ['Active member', 'Contributing member', 'Supporting member'],
      },
      boundaries: {
        description: 'Resource boundaries defined by community consensus',
        physical: request.resourceType === 'physical' || request.resourceType === 'hybrid',
        digital: request.resourceType === 'digital' || request.resourceType === 'hybrid',
      },
      economics: {
        description: 'Benefits distributed proportional to contributions and needs',
        patronage: true,
        surplusSharing: true,
        reserveFund: true,
      },
      governance: {
        description: `${request.governanceType} decision-making with democratic participation`,
        voting: request.governanceType === 'dao' ? 'token-weighted' : 'one-member-one-vote',
        quorum: 0.33,
        threshold: 0.51,
        delegation: true,
      },
      monitoring: {
        description: 'Peer monitoring with transparent reporting',
        methods: ['Self-reporting', 'Peer verification', 'External audit'],
        frequency: 'quarterly',
      },
      sanctions: {
        description: 'Graduated sanctions from warning to expulsion',
        levels: ['Verbal warning', 'Written warning', 'Temporary suspension', 'Expulsion'],
        appeals: true,
      },
      disputeResolution: {
        description: 'Multi-stage dispute resolution from mediation to arbitration',
        stages: ['Informal negotiation', 'Mediation', 'Arbitration', 'External courts'],
      },
      legal: {
        description: `Legal recognition as ${request.governanceType} entity`,
        entityType: request.governanceType === 'dao' ? 'LLC wrapper' : request.governanceType,
        jurisdiction: request.geography === 'global' ? 'Delaware' : 'Local',
      },
      nesting: {
        description: 'Nested governance for multi-scale coordination',
        layers: request.geography === 'local' ? 1 : request.geography === 'regional' ? 2 : 3,
      },
    };
  }

  private createImplementationRoadmap(
    request: GovernanceDesignRequest, 
    structure: GovernanceStructure
  ): { phase: string; actions: string[]; timeline: string }[] {
    return [
      {
        phase: 'Phase 1: Foundation',
        actions: [
          'Draft governance charter',
          'Define membership criteria',
          'Secure legal recognition',
          'Establish initial board/committee',
        ],
        timeline: 'Months 1-3',
      },
      {
        phase: 'Phase 2: Systems',
        actions: [
          'Implement decision-making processes',
          'Set up monitoring systems',
          'Create dispute resolution procedures',
          'Launch member onboarding',
        ],
        timeline: 'Months 4-6',
      },
      {
        phase: 'Phase 3: Operations',
        actions: [
          'Full governance operations',
          'First member assemblies',
          'Resource allocation begins',
          'Continuous improvement processes',
        ],
        timeline: 'Months 7-12',
      },
    ];
  }

  private identifyGovernanceRisks(request: GovernanceDesignRequest, structure: GovernanceStructure): RiskAssessment[] {
    const risks: RiskAssessment[] = [];

    if (request.communitySize > 100) {
      risks.push({
        risk: 'Low participation in large community',
        likelihood: 'high',
        impact: 'high',
        mitigation: 'Implement delegation and representative structures',
      });
    }

    if (request.governanceType === 'dao') {
      risks.push({
        risk: 'Token-based governance capture',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Use quadratic voting or caps on voting power',
      });
    }

    if (request.keyChallenges.includes('conflict-history')) {
      risks.push({
        risk: 'Pre-existing conflicts resurface',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Proactive conflict resolution and community building',
      });
    }

    return risks;
  }

  private getModelStrengths(model: string): string[] {
    const strengths: Record<string, string[]> = {
      'dao': ['Transparent on-chain governance', 'Global participation', 'Automated execution'],
      'cooperative': ['Democratic member control', 'Legal precedent', 'Tax advantages'],
      'llc': ['Limited liability', 'Flexible governance', 'Familiar structure'],
      'unincorporated': ['Maximum flexibility', 'No formal costs', 'Informal adaptation'],
      'hybrid': ['Best of multiple models', 'Adaptable structure', 'Future-proof'],
    };
    return strengths[model] || [];
  }

  private getModelWeaknesses(model: string): string[] {
    const weaknesses: Record<string, string[]> = {
      'dao': ['Regulatory uncertainty', 'Technical complexity', 'Low participation risk'],
      'cooperative': ['Complex governance', 'Member participation required', 'Limited capital access'],
      'llc': ['Less familiar to crypto natives', 'State-specific rules', 'Centralization risk'],
      'unincorporated': ['No liability protection', 'Unclear governance', 'Limited scale'],
      'hybrid': ['Complexity of multiple systems', 'Coordination challenges', 'Legal uncertainty'],
    };
    return weaknesses[model] || [];
  }

  private assessModelOstromFit(model: string): number {
    const fits: Record<string, number> = {
      'dao': 0.65,
      'cooperative': 0.9,
      'llc': 0.7,
      'unincorporated': 0.5,
      'hybrid': 0.85,
    };
    return fits[model] || 0.5;
  }

  private estimateModelCost(model: string): string {
    const costs: Record<string, string> = {
      'dao': '$2K-10K (setup) + gas fees',
      'cooperative': '$5K-20K (legal + filing)',
      'llc': '$1K-5K (filing + agreements)',
      'unincorporated': '$0-500 (minimal)',
      'hybrid': '$10K-50K (multiple entities)',
    };
    return costs[model] || 'Variable';
  }

  private estimateImplementationTime(model: string): string {
    const times: Record<string, string> = {
      'dao': '2-4 weeks',
      'cooperative': '2-3 months',
      'llc': '1-2 weeks',
      'unincorporated': 'Immediate',
      'hybrid': '3-6 months',
    };
    return times[model] || 'Variable';
  }
}

// Internal Types

interface GovernanceStructure {
  membership: {
    description: string;
    criteria: string[];
    tiers: string[];
  };
  boundaries: {
    description: string;
    physical: boolean;
    digital: boolean;
  };
  economics: {
    description: string;
    patronage: boolean;
    surplusSharing: boolean;
    reserveFund: boolean;
  };
  governance: {
    description: string;
    voting: string;
    quorum: number;
    threshold: number;
    delegation: boolean;
  };
  monitoring: {
    description: string;
    methods: string[];
    frequency: string;
  };
  sanctions: {
    description: string;
    levels: string[];
    appeals: boolean;
  };
  disputeResolution: {
    description: string;
    stages: string[];
  };
  legal: {
    description: string;
    entityType: string;
    jurisdiction: string;
  };
  nesting: {
    description: string;
    layers: number;
  };
}

interface GovernanceModelComparison {
  model: string;
  strengths: string[];
  weaknesses: string[];
  ostromFit: number;
  costEstimate: string;
  timeToImplement: string;
}
