/**
 * Regen Agents Package - Main Entry Point
 * 
 * Specialist agents for regenerative ecosystem coordination
 */

// Export all types
export * from './types/index.js';

// Export all agents
export { RegenerativeAgricultureResearcher } from './agents/agriculture-researcher/index.js';
export { CommonsGovernanceSpecialist } from './agents/commons-governance/index.js';
export { ImpactMeasurementAnalyst } from './agents/impact-measurement/index.js';
export { BioregionalIntelligenceAgent } from './agents/bioregional-intelligence/index.js';

// Export integrations
export { KnowledgeCurator } from './integrations/knowledge-curator.js';
export { MeetingProcessor } from './integrations/meeting-processor.js';
export { FundingScout } from './integrations/funding-scout.js';

// Export super agent
export { RegenSuperAgent } from './super-agent/index.js';

// Main orchestrator class
import { RegenerativeAgricultureResearcher } from './agents/agriculture-researcher/index.js';
import { CommonsGovernanceSpecialist } from './agents/commons-governance/index.js';
import { ImpactMeasurementAnalyst } from './agents/impact-measurement/index.js';
import { BioregionalIntelligenceAgent } from './agents/bioregional-intelligence/index.js';
import { KnowledgeCurator } from './integrations/knowledge-curator.js';
import { MeetingProcessor } from './integrations/meeting-processor.js';
import { FundingScout } from './integrations/funding-scout.js';
import { RegenSuperAgent } from './super-agent/index.js';
import { AGENT_IDS } from './types/index.js';

export class RegenAgentOrchestrator {
  agricultureAgent: RegenerativeAgricultureResearcher;
  governanceAgent: CommonsGovernanceSpecialist;
  impactAgent: ImpactMeasurementAnalyst;
  bioregionalAgent: BioregionalIntelligenceAgent;
  knowledgeCurator: KnowledgeCurator;
  meetingProcessor: MeetingProcessor;
  fundingScout: FundingScout;
  superAgent: RegenSuperAgent;

  constructor() {
    // Initialize integrations first (shared dependencies)
    this.knowledgeCurator = new KnowledgeCurator();
    this.meetingProcessor = new MeetingProcessor();

    // Initialize all 4 specialist agents
    this.agricultureAgent = new RegenerativeAgricultureResearcher(
      this.knowledgeCurator,
      this.meetingProcessor
    );
    this.governanceAgent = new CommonsGovernanceSpecialist(
      this.knowledgeCurator,
      this.meetingProcessor
    );
    this.impactAgent = new ImpactMeasurementAnalyst(
      this.knowledgeCurator,
      this.meetingProcessor
    );
    this.bioregionalAgent = new BioregionalIntelligenceAgent(
      this.knowledgeCurator,
      this.meetingProcessor
    );

    // Initialize super agent
    this.superAgent = new RegenSuperAgent(
      this.knowledgeCurator,
      this.meetingProcessor
    );

    // Initialize funding scout (needs super agent)
    this.fundingScout = new FundingScout(this.superAgent);
  }

  /**
   * Get any agent by ID
   */
  getAgent(agentId: string): RegenerativeAgricultureResearcher | CommonsGovernanceSpecialist | ImpactMeasurementAnalyst | BioregionalIntelligenceAgent | null {
    switch (agentId) {
      case AGENT_IDS.AGRICULTURE_RESEARCHER:
        return this.agricultureAgent;
      case AGENT_IDS.COMMONS_GOVERNANCE:
        return this.governanceAgent;
      case AGENT_IDS.IMPACT_MEASUREMENT:
        return this.impactAgent;
      case AGENT_IDS.BIOREGIONAL_INTELLIGENCE:
        return this.bioregionalAgent;
      default:
        return null;
    }
  }

  /**
   * Coordinate multiple agents via the super agent
   */
  async coordinate(request: {
    description: string;
    agentIds: string[];
    deliverables: string[];
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    return this.superAgent.coordinate({
      request: request.description,
      agents: request.agentIds,
      deliverables: request.deliverables,
      priority: request.priority || 'medium',
    });
  }

  /**
   * Process a funding opportunity through appropriate agents
   */
  async processFundingOpportunity(opportunity: {
    id: string;
    title: string;
    description: string;
    focusAreas: string[];
    requiredDocuments: string[];
  }) {
    return this.fundingScout.registerOpportunity({
      id: opportunity.id,
      title: opportunity.title,
      description: opportunity.description,
      amount: { currency: 'USD' },
      eligibility: [],
      categories: opportunity.focusAreas,
      requiredDocuments: opportunity.requiredDocuments,
    });
  }
}

// Re-export agent IDs for convenience
export { AGENT_IDS };

// Version
export const VERSION = '0.1.0';
