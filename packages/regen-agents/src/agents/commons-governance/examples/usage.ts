/**
 * Examples usage for the Commons Governance Specialist Agent
 */

import { CommonsGovernanceSpecialist } from '../index.js';
import { KnowledgeCurator } from '../../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../../integrations/meeting-processor.js';

// Setup
const knowledgeCurator = new KnowledgeCurator();
const meetingProcessor = new MeetingProcessor();
const agent = new CommonsGovernanceSpecialist(knowledgeCurator, meetingProcessor);

// ============================================================================
// Example 1: Analyze DAO Charter
// ============================================================================

async function exampleAnalyzeDAOCharter() {
  const result = await agent.analyzeProposal({
    proposalType: 'dao-charter',
    content: `
      DAO Charter - Regenerative Commons
      
      1. Membership: Token-gated, 100 tokens minimum
      2. Governance: Token-weighted voting, 51% threshold
      3. Treasury: Multi-sig (3 of 5) for < $10K, vote required above
      4. Proposals: 100 token deposit, 7-day voting period
      5. Disputes: Internal mediator, then binding arbitration
    `,
    context: 'New regenerative land stewardship DAO',
    stakeholders: ['farmers', 'investors', 'conservationists'],
  });

  console.log('Analysis:', result.analysis);
  console.log('Ostrom Score:', result.ostromAssessment);
  console.log('Risks:', result.riskAssessment);
  console.log('Recommendations:', result.recommendations);
}

// ============================================================================
// Example 2: Analyze Voting Mechanism
// ============================================================================

async function exampleAnalyzeVotingMechanism() {
  const result = await agent.analyzeDAOProposal({
    title: 'Switch to Quadratic Voting',
    type: 'governance',
    description: 'Proposal to implement quadratic voting for treasury decisions over $50K',
    proposer: '0x1234...',
    votingPeriod: 7,
    quorum: 0.33,
    threshold: 0.51,
  });

  console.log('Analysis:', result.analysis);
  console.log('Ostrom Fit:', result.ostromFit);
  console.log('Recommendation:', result.recommendation);
}

// ============================================================================
// Example 3: Compare Legal Wrappers
// ============================================================================

async function exampleCompareLegalWrappers() {
  const result = await agent.compareLegalWrappers({
    jurisdiction: 'Delaware',
    activities: ['land-stewardship', 'token-governance', 'profit-sharing'],
    members: 50,
    hasToken: true,
    requiresLiabilityProtection: true,
  });

  console.log('Options:', result.options);
  console.log('Recommendation:', result.recommendation);
  console.log('Comparison Matrix:', result.comparisonMatrix);
}

// ============================================================================
// Example 4: Design Dispute Resolution
// ============================================================================

async function exampleDesignDisputeResolution() {
  const result = await agent.designDisputeResolution({
    communitySize: 100,
    disputeTypes: ['treasury-disputes', 'governance-conflicts', 'member-conduct'],
    resources: ['volunteer-mediators', 'legal-fund'],
    escalationNeeded: true,
  });

  console.log('Process:', result.process);
  console.log('Roles:', result.roles);
  console.log('Timeline:', result.timeline);
}

// ============================================================================
// Example 5: Record Governance Meeting Findings
// ============================================================================

async function exampleRecordMeetingFindings() {
  await agent.recordMeetingFindings('governance-meeting-2024-03-15', [
    {
      agentId: 'commons-governance',
      findingType: 'governance-risk',
      content: 'Quorum requirement of 40% may be too high given historical participation rates of 25%',
      confidence: 0.9,
      relatedTopics: ['quorum', 'participation', 'voting'],
    },
    {
      agentId: 'commons-governance',
      findingType: 'ostrom-assessment',
      content: 'Strong collective-choice arrangements but weak monitoring mechanisms',
      confidence: 0.85,
      relatedTopics: ['ostrom', 'monitoring', 'collective-choice'],
    },
  ]);

  console.log('Governance meeting findings recorded');
}

// ============================================================================
// Run examples (commented out for safety)
// ============================================================================

// exampleAnalyzeDAOCharter();
// exampleAnalyzeVotingMechanism();
// exampleCompareLegalWrappers();
// exampleDesignDisputeResolution();
// exampleRecordMeetingFindings();

export {
  exampleAnalyzeDAOCharter,
  exampleAnalyzeVotingMechanism,
  exampleCompareLegalWrappers,
  exampleDesignDisputeResolution,
  exampleRecordMeetingFindings,
};
