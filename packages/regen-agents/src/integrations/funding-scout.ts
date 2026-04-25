/**
 * Funding Scout Integration
 * 
 * Triggers appropriate agents when funding opportunities are identified.
 */

import { FundingOpportunity, FundingTrigger } from '../types/index.js';
import { RegenSuperAgent } from '../super-agent/index.js';

export class FundingScout {
  private opportunities: Map<string, FundingOpportunity> = new Map();
  private superAgent: RegenSuperAgent;

  constructor(superAgent: RegenSuperAgent) {
    this.superAgent = superAgent;
  }

  /**
   * Register a new funding opportunity
   */
  async registerOpportunity(opportunity: FundingOpportunity): Promise<void> {
    this.opportunities.set(opportunity.id, opportunity);
    
    // Trigger relevant agents
    await this.triggerAgents(opportunity);
    
    console.log(`[FundingScout] Registered opportunity: ${opportunity.title}`);
  }

  /**
   * Trigger appropriate agents for a funding opportunity
   */
  private async triggerAgents(opportunity: FundingOpportunity): Promise<void> {
    // Determine relevant agents based on opportunity categories
    const categories = opportunity.categories.map(c => c.toLowerCase());
    
    const relevantAgents: string[] = [];
    
    // Map categories to agents
    if (categories.some(c => 
      ['agriculture', 'farming', 'soil', 'carbon', 'regenerative', 'food', 'land'].includes(c)
    )) {
      relevantAgents.push('agriculture-researcher');
    }
    
    if (categories.some(c => 
      ['governance', 'dao', 'cooperative', 'organizational', 'legal', 'structure'].includes(c)
    )) {
      relevantAgents.push('commons-governance');
    }
    
    if (categories.some(c => 
      ['impact', 'metrics', 'measurement', 'reporting', 'monitoring', 'evaluation'].includes(c)
    )) {
      relevantAgents.push('impact-measurement');
    }
    
    if (categories.some(c => 
      ['bioregion', 'territory', 'landscape', 'watershed', 'regional', 'geographic'].includes(c)
    )) {
      relevantAgents.push('bioregional-intelligence');
    }

    if (relevantAgents.length > 0) {
      // Use Super Agent to coordinate
      await this.superAgent.handleFundingOpportunity({
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        focusAreas: opportunity.categories,
        requiredDeliverables: opportunity.requiredDocuments,
      });
    }
  }

  /**
   * Get all registered opportunities
   */
  async getOpportunities(): Promise<FundingOpportunity[]> {
    return Array.from(this.opportunities.values())
      .sort((a, b) => (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0));
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunity(id: string): Promise<FundingOpportunity | null> {
    return this.opportunities.get(id) || null;
  }

  /**
   * Get opportunities by eligibility
   */
  async getOpportunitiesByEligibility(criteria: string): Promise<FundingOpportunity[]> {
    return Array.from(this.opportunities.values())
      .filter(o => o.eligibility.some(e => e.toLowerCase().includes(criteria.toLowerCase())))
      .sort((a, b) => (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0));
  }

  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(days: number = 30): Promise<FundingOpportunity[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return Array.from(this.opportunities.values())
      .filter(o => o.deadline && o.deadline <= cutoff && o.deadline >= new Date())
      .sort((a, b) => (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0));
  }

  /**
   * Remove an opportunity
   */
  async removeOpportunity(id: string): Promise<boolean> {
    return this.opportunities.delete(id);
  }

  /**
   * Update opportunity match score
   */
  async updateMatchScore(id: string, score: number): Promise<void> {
    const opportunity = this.opportunities.get(id);
    if (opportunity) {
      opportunity.matchScore = score;
    }
  }

  /**
   * Get best matches for an organization
   */
  async getBestMatches(organizationProfile: {
    focusAreas: string[];
    geographicScope: string;
    entityType: string;
  }): Promise<FundingOpportunity[]> {
    return Array.from(this.opportunities.values())
      .map(o => ({
        ...o,
        matchScore: this.calculateMatchScore(o, organizationProfile),
      }))
      .filter(o => (o.matchScore || 0) > 0.5)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  private calculateMatchScore(
    opportunity: FundingOpportunity,
    profile: { focusAreas: string[]; geographicScope: string; entityType: string }
  ): number {
    let score = 0;
    let factors = 0;

    // Check category match
    const categoryMatches = opportunity.categories.filter(c => 
      profile.focusAreas.some(f => c.toLowerCase().includes(f.toLowerCase()))
    ).length;
    score += categoryMatches / Math.max(opportunity.categories.length, 1);
    factors++;

    // Check eligibility match
    const eligibilityMatches = opportunity.eligibility.filter(e => 
      e.toLowerCase().includes(profile.entityType.toLowerCase())
    ).length;
    score += eligibilityMatches > 0 ? 1 : 0;
    factors++;

    return score / factors;
  }
}
