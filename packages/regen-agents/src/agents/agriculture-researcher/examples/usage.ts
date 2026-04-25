/**
 * Usage examples for the Regenerative Agriculture Researcher Agent
 */

import { RegenerativeAgricultureResearcher } from '../index.js';
import { KnowledgeCurator } from '../../../integrations/knowledge-curator.js';
import { MeetingProcessor } from '../../../integrations/meeting-processor.js';

// Setup
const knowledgeCurator = new KnowledgeCurator();
const meetingProcessor = new MeetingProcessor();
const agent = new RegenerativeAgricultureResearcher(knowledgeCurator, meetingProcessor);

// ============================================================================
// Example 1: Research Cover Cropping for Mediterranean Climate
// ============================================================================

async function exampleResearchCoverCropping() {
  const result = await agent.research({
    topic: 'cover cropping for carbon sequestration',
    region: 'mediterranean-climate',
    climateZone: 'Csa',
    soilType: 'loamy',
    scale: 'mid-scale',
    practices: ['multi-species cover crops', 'permanent ground cover'],
    outputs: ['research-summary', 'practice-guide', 'case-study'],
  });

  console.log('Research Summary:', result.researchSummary);
  console.log('Practice Guides:', result.practiceGuides.length);
  console.log('Case Studies:', result.caseStudies.length);
  console.log('Key Findings:', result.keyFindings);
}

// ============================================================================
// Example 2: Process Scientific Paper
// ============================================================================

async function exampleProcessPaper() {
  const paper = {
    title: 'Soil Carbon Sequestration Through Regenerative Agriculture: A Meta-Analysis',
    content: `
      Abstract: This study synthesizes 85 peer-reviewed papers examining soil carbon 
      sequestration rates under regenerative agriculture practices. Key findings include:
      - Average sequestration rate of 0.5-1.2 Mg C ha-1 yr-1 under cover cropping
      - Highest rates observed in Mediterranean climates with multi-species mixes
      - Significant variation based on soil type, with clay loams showing greatest potential
      - Co-benefits include improved water infiltration and biodiversity support
      Limitations: Most studies limited to 5-year timeframe; long-term dynamics uncertain
    `,
    source: 'Journal of Environmental Management, 2024',
  };

  const analysis = await agent.processScientificPaper(paper);
  
  console.log('Extracted Findings:', analysis.findings.length);
  console.log('Citations:', analysis.citations);
}

// ============================================================================
// Example 3: Process Farmer Interview
// ============================================================================

async function exampleProcessInterview() {
  const interview = {
    farmerId: 'farmer-maria-001',
    transcript: `
      Interviewer: Tell me about your transition to regenerative practices.
      
      Farmer Maria: We started with cover crops five years ago. At first, it was just 
      mustard and vetch between our vegetable crops. Now we use a seven-species mix 
      and have permanent living roots in the ground year-round.
      
      The biggest change we've seen is in water. Before, during heavy rains, we'd 
      get flooding and runoff. Now the soil just drinks it up. We've measured 
      infiltration rates and they're three times higher than when we started.
      
      Challenges? Equipment was hard. We had to modify our planter to work with 
      residue. And finding markets for cover crop seed was tricky at first.
      
      Advice? Start small, measure everything, and connect with other farmers. 
      The network has been invaluable.
    `,
    location: 'Napa Valley, California',
  };

  const insights = await agent.processFarmerInterview(interview);
  
  console.log('Insights:', insights.insights);
  console.log('Practices:', insights.practices);
  console.log('Challenges:', insights.challenges);
}

// ============================================================================
// Example 4: Generate Practice Guide for Specific Context
// ============================================================================

async function exampleGeneratePracticeGuide() {
  const guide = await agent.generatePracticeGuide(
    'Holistic Planned Grazing',
    {
      region: 'Northern California',
      scale: 'large-scale',
      soilType: 'clay-loam',
    }
  );

  console.log('Guide Title:', guide.title);
  console.log('Applicability:', guide.applicability);
  console.log('Implementation Steps:', guide.implementation);
  console.log('Expected Outcomes:', guide.expectedOutcomes);
  console.log('Risks to Consider:', guide.risks);
}

// ============================================================================
// Example 5: Record Meeting Findings
// ============================================================================

async function exampleRecordMeeting() {
  await agent.recordMeetingFindings('meeting-2024-03-15', [
    {
      agentId: 'agriculture-researcher',
      findingType: 'soil-health-indicator',
      content: 'Soil organic matter increased 1.2% over 3 years on pilot sites using multi-species cover crops',
      confidence: 0.85,
      relatedTopics: ['cover-crops', 'soil-health', 'carbon-sequestration'],
    },
    {
      agentId: 'agriculture-researcher',
      findingType: 'practice-recommendation',
      content: 'Recommend delaying termination of cover crops by 2-3 weeks in dry springs to maximize biomass',
      confidence: 0.75,
      relatedTopics: ['cover-crops', 'timing', 'biomass'],
    },
  ]);

  console.log('Meeting findings recorded successfully');
}

// ============================================================================
// Example 6: Funding Opportunity Response
// ============================================================================

async function exampleFundingResponse() {
  const fundingOpportunity = {
    title: 'Climate-Smart Agriculture Implementation Grant',
    description: 'Funding for farmer networks to implement and monitor carbon-sequestering practices',
    focus: 'carbon-sequestration',
    requiredDeliverables: ['research-basis', 'implementation-plan', 'monitoring-protocol'],
  };

  // Research the opportunity
  const researchResult = await agent.research({
    topic: fundingOpportunity.focus,
    region: 'target-region',
    outputs: ['research-summary', 'practice-guide'],
  });

  // Generate proposal components
  const proposal = {
    researchBasis: researchResult.researchSummary,
    recommendedPractices: researchResult.practiceGuides.map(g => ({
      practice: g.practice,
      applicability: g.applicability,
      implementation: g.implementation,
    })),
    monitoringProtocol: researchResult.practiceGuides[0]?.resources || [],
  };

  console.log('Proposal prepared:', proposal);
}

// ============================================================================
// Run examples (commented out for safety)
// ============================================================================

// exampleResearchCoverCropping();
// exampleProcessPaper();
// exampleProcessInterview();
// exampleGeneratePracticeGuide();
// exampleRecordMeeting();
// exampleFundingResponse();

export {
  exampleResearchCoverCropping,
  exampleProcessPaper,
  exampleProcessInterview,
  exampleGeneratePracticeGuide,
  exampleRecordMeeting,
  exampleFundingResponse,
};
