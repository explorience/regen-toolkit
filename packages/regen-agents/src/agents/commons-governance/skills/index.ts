/**
 * Skill implementations for the Commons Governance Specialist Agent
 * Re-exports from tools directory for backwards compatibility
 */

export {
  GovernanceDecisionTrackerTool as GovernanceDecisionTrackerSkill,
  CommonsGovernanceTool as CommonsGovernanceSkill,
} from '../tools/index.js';

// Legacy skill implementations (deprecated, use tools instead)
import { KnowledgeEntry, GovernanceRecommendation, OstromPrincipleAssessment, RiskAssessment } from '../../../types/index.js';

/**
 * @deprecated Use GovernanceDecisionTrackerTool from tools/
 */
export class GovernanceDecisionTrackerSkill {
  private decisions: Map<string, GovernanceDecision> = new Map();

  async trackDecision(decision: {
    id: string;
    proposalType: string;
    description: string;
    proposer: string;
    votingResults: { for: number; against: number; abstain: number };
    timestamp: Date;
  }): Promise<void> {
    this.decisions.set(decision.id, {
      ...decision,
      status: 'executed',
      outcomes: [],
    });
  }

  async recordOutcome(decisionId: string, outcome: {
    metric: string;
    expected: string;
    actual: string;
    timestamp: Date;
  }): Promise<void> {
    const decision = this.decisions.get(decisionId);
    if (decision) {
      decision.outcomes.push(outcome);
    }
  }

  async analyzeDecisionQuality(): Promise<DecisionQualityAnalysis> {
    const decisions = Array.from(this.decisions.values());
    
    return {
      totalDecisions: decisions.length,
      participationRate: this.calculateParticipationRate(decisions),
      outcomeAccuracy: this.calculateOutcomeAccuracy(decisions),
      commonIssues: this.identifyCommonIssues(decisions),
      recommendations: this.generateImprovementRecommendations(decisions),
    };
  }

  private calculateParticipationRate(decisions: GovernanceDecision[]): number {
    // Placeholder calculation
    return 0.65;
  }

  private calculateOutcomeAccuracy(decisions: GovernanceDecision[]): number {
    // Placeholder calculation
    return 0.75;
  }

  private identifyCommonIssues(decisions: GovernanceDecision[]): string[] {
    return ['Low participation in treasury decisions', 'Delayed execution of passed proposals'];
  }

  private generateImprovementRecommendations(decisions: GovernanceDecision[]): string[] {
    return [
      'Implement delegation mechanism for passive members',
      'Create clearer proposal templates',
      'Establish execution deadlines',
    ];
  }
}

/**
 * Commons Governance Skill
 * Analyzes and designs commons governance structures
 */
export class CommonsGovernanceSkill {
  private ostromPrinciples: OstromPrinciple[] = [
    {
      number: 1,
      name: 'Clearly Defined Boundaries',
      description: 'Individuals or households who have rights to withdraw resource units from the CPR must be clearly defined, as must the boundaries of the CPR itself.',
    },
    {
      number: 2,
      name: 'Proportional Equivalence',
      description: 'Rules specifying the amount of resource products that a user is allocated are related to local conditions and to rules requiring labor, materials, and/or money inputs.',
    },
    {
      number: 3,
      name: 'Collective-Choice Arrangements',
      description: 'Most individuals affected by the operational rules can participate in modifying the operational rules.',
    },
    {
      number: 4,
      name: 'Monitoring',
      description: 'Monitors, who actively audit CPR conditions and user behavior, are accountable to the users or are the users themselves.',
    },
    {
      number: 5,
      name: 'Graduated Sanctions',
      description: 'Users who violate operational rules are likely to be assessed graduated sanctions depending on the seriousness and context of the offense.',
    },
    {
      number: 6,
      name: 'Conflict Resolution Mechanisms',
      description: 'Users and their officials have rapid access to low-cost local arenas to resolve conflicts among users or between users and officials.',
    },
    {
      number: 7,
      name: 'Minimal Recognition of Rights',
      description: 'The rights of users to devise their own institutions are not challenged by external governmental authorities.',
    },
    {
      number: 8,
      name: 'Nested Enterprises',
      description: 'For CPRs that are parts of larger systems: Appropriation, provision, monitoring, enforcement, conflict resolution, and governance activities are organized in multiple layers of nested enterprises.',
    },
  ];

  assessAgainstOstrom(governance: {
    boundaryClarity: 'clear' | 'unclear' | 'partial';
    proportionalEquivalence: boolean;
    collectiveChoice: boolean;
    monitoring: 'robust' | 'weak' | 'none';
    sanctions: 'graduated' | 'binary' | 'none';
    conflictResolution: 'accessible' | 'difficult' | 'none';
    externalRecognition: boolean;
    nesting: 'appropriate' | 'incomplete' | 'none';
  }): OstromAssessment {
    const assessments: OstromPrincipleAssessment[] = [
      {
        principle: '1. Clearly Defined Boundaries',
        description: this.ostromPrinciples[0].description,
        compliance: governance.boundaryClarity === 'clear' ? 'full' : governance.boundaryClarity === 'partial' ? 'partial' : 'none',
        gaps: governance.boundaryClarity !== 'clear' ? ['Membership boundaries need clarification'] : [],
        recommendations: governance.boundaryClarity !== 'clear' ? ['Define clear membership criteria and resource boundaries'] : [],
      },
      {
        principle: '2. Proportional Equivalence',
        description: this.ostromPrinciples[1].description,
        compliance: governance.proportionalEquivalence ? 'full' : 'partial',
        gaps: !governance.proportionalEquivalence ? ['Benefits and costs not aligned'] : [],
        recommendations: !governance.proportionalEquivalence ? ['Review contribution and benefit distribution rules'] : [],
      },
      {
        principle: '3. Collective-Choice Arrangements',
        description: this.ostromPrinciples[2].description,
        compliance: governance.collectiveChoice ? 'full' : 'none',
        gaps: !governance.collectiveChoice ? ['Limited participation in rule-making'] : [],
        recommendations: !governance.collectiveChoice ? ['Enable proposal and amendment processes for all members'] : [],
      },
      {
        principle: '4. Monitoring',
        description: this.ostromPrinciples[3].description,
        compliance: governance.monitoring === 'robust' ? 'full' : governance.monitoring === 'weak' ? 'partial' : 'none',
        gaps: governance.monitoring !== 'robust' ? ['Inadequate monitoring systems'] : [],
        recommendations: governance.monitoring !== 'robust' ? ['Establish transparent monitoring mechanisms'] : [],
      },
      {
        principle: '5. Graduated Sanctions',
        description: this.ostromPrinciples[4].description,
        compliance: governance.sanctions === 'graduated' ? 'full' : governance.sanctions === 'binary' ? 'partial' : 'none',
        gaps: governance.sanctions !== 'graduated' ? ['Sanctions not appropriately graduated'] : [],
        recommendations: governance.sanctions !== 'graduated' ? ['Implement escalating consequence structure'] : [],
      },
      {
        principle: '6. Conflict Resolution Mechanisms',
        description: this.ostromPrinciples[5].description,
        compliance: governance.conflictResolution === 'accessible' ? 'full' : governance.conflictResolution === 'difficult' ? 'partial' : 'none',
        gaps: governance.conflictResolution !== 'accessible' ? ['Conflict resolution not easily accessible'] : [],
        recommendations: governance.conflictResolution !== 'accessible' ? ['Create low-cost dispute resolution processes'] : [],
      },
      {
        principle: '7. Minimal Recognition of Rights',
        description: this.ostromPrinciples[6].description,
        compliance: governance.externalRecognition ? 'full' : 'partial',
        gaps: !governance.externalRecognition ? ['External interference possible'] : [],
        recommendations: !governance.externalRecognition ? ['Secure legal recognition of self-governance rights'] : [],
      },
      {
        principle: '8. Nested Enterprises',
        description: this.ostromPrinciples[7].description,
        compliance: governance.nesting === 'appropriate' ? 'full' : governance.nesting === 'incomplete' ? 'partial' : 'none',
        gaps: governance.nesting !== 'appropriate' ? ['Governance layers not appropriately nested'] : [],
        recommendations: governance.nesting !== 'appropriate' ? ['Design governance at appropriate scales with coordination mechanisms'] : [],
      },
    ];

    const score = this.calculateOstromScore(assessments);

    return {
      assessments,
      overallScore: score,
      strengths: this.identifyStrengths(assessments),
      weaknesses: this.identifyWeaknesses(assessments),
    };
  }

  private calculateOstromScore(assessments: OstromPrincipleAssessment[]): number {
    const scores = { full: 1, partial: 0.5, none: 0 };
    const total = assessments.reduce((sum, a) => sum + scores[a.compliance], 0);
    return total / assessments.length;
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
}

/**
 * Schema Generator Skill
 * Generates governance schemas and documentation
 */
export class SchemaGeneratorSkill {
  generateDAOSchema(params: {
    name: string;
    tokenType: 'fungible' | 'non-fungible' | 'soulbound';
    votingMechanism: 'token-weighted' | 'one-person-one-vote' | 'quadratic' | 'delegation';
    quorum: number;
    proposalThreshold: number;
  }): GovernanceSchema {
    return {
      entity: {
        name: params.name,
        type: 'DAO',
        jurisdiction: 'Delaware LLC (optional)',
      },
      token: {
        type: params.tokenType,
        utility: ['governance', 'membership'],
        distribution: 'community-first',
      },
      governance: {
        votingMechanism: params.votingMechanism,
        quorum: params.quorum,
        proposalThreshold: params.proposalThreshold,
        votingPeriod: 7, // days
        executionDelay: 2, // days
      },
      treasury: {
        management: 'multi-sig + on-chain execution',
        spendingLimits: {
          small: 10000,
          medium: 100000,
          large: 'require-vote',
        },
      },
      disputeResolution: {
        mechanism: 'internal-mediator',
        escalation: 'external-arbitration',
      },
    };
  }

  generateCooperativeSchema(params: {
    name: string;
    type: 'consumer' | 'producer' | 'worker' | 'multi-stakeholder';
    jurisdiction: string;
    members: number;
  }): GovernanceSchema {
    return {
      entity: {
        name: params.name,
        type: 'Cooperative',
        jurisdiction: params.jurisdiction,
        formation: 'articles-of-incorporation',
      },
      membership: {
        type: params.type,
        open: true,
        requirements: ['participation-agreement', 'equity-contribution'],
        rights: ['vote', 'patronage', 'information'],
      },
      governance: {
        board: {
          size: Math.min(9, Math.max(3, Math.ceil(params.members / 20))),
          election: 'annual-member-vote',
          term: 3, // years
        },
        meetings: {
          annual: true,
          special: 'member-petition',
          quorum: 0.25,
        },
      },
      economics: {
        patronage: 'proportional-to-use',
        equity: 'member-investment',
        surplus: 'patronage-distribution',
      },
    };
  }
}

// ============================================================================
// Internal Types
// ============================================================================

interface GovernanceDecision {
  id: string;
  proposalType: string;
  description: string;
  proposer: string;
  votingResults: { for: number; against: number; abstain: number };
  timestamp: Date;
  status: 'executed' | 'pending' | 'failed';
  outcomes: { metric: string; expected: string; actual: string; timestamp: Date }[];
}

interface DecisionQualityAnalysis {
  totalDecisions: number;
  participationRate: number;
  outcomeAccuracy: number;
  commonIssues: string[];
  recommendations: string[];
}

interface OstromPrinciple {
  number: number;
  name: string;
  description: string;
}

interface OstromAssessment {
  assessments: OstromPrincipleAssessment[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

interface GovernanceSchema {
  entity: {
    name: string;
    type: string;
    jurisdiction?: string;
    formation?: string;
  };
  token?: {
    type: string;
    utility: string[];
    distribution: string;
  };
  governance: {
    votingMechanism?: string;
    quorum?: number;
    proposalThreshold?: number;
    votingPeriod?: number;
    executionDelay?: number;
    board?: {
      size: number;
      election: string;
      term: number;
    };
    meetings?: {
      annual: boolean;
      special: string;
      quorum: number;
    };
  };
  treasury?: {
    management: string;
    spendingLimits: {
      small: number;
      medium: number;
      large: string;
    };
  };
  disputeResolution?: {
    mechanism: string;
    escalation: string;
  };
  membership?: {
    type: string;
    open: boolean;
    requirements: string[];
    rights: string[];
  };
  economics?: {
    patronage: string;
    equity: string;
    surplus: string;
  };
}
