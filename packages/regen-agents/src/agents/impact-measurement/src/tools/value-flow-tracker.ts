/**
 * Value Flow Tracker Tool
 * Tracks value flows and attribution in impact networks
 */

export interface ValueNode {
  id: string;
  type: 'input' | 'intermediary' | 'output' | 'outcome' | 'impact';
  name: string;
  description?: string;
  value: number;
  unit: string;
  stakeholders: string[];
}

export interface ValueFlow {
  id: string;
  source: string;
  target: string;
  value: number;
  unit: string;
  mechanism: 'financial' | 'in-kind' | 'knowledge' | 'social' | 'ecosystem';
  confidence: number;
  evidence: string[];
}

export interface ValueFlowMap {
  nodes: ValueNode[];
  flows: ValueFlow[];
  cycles: { nodes: string[]; value: number }[];
  leakages: { node: string; value: number; reason: string }[];
}

export interface AttributionAnalysis {
  contributions: {
    actor: string;
    contribution: number; // 0-1
    mechanism: string;
    confidence: number;
  }[];
  counterfactual: string;
  deadweight: number; // proportion that would have happened anyway
  displacement: number; // proportion shifted to/from elsewhere
  attributionConfidence: number;
}

export class ValueFlowTrackerTool {
  async mapValueFlows(
    inputs: {
      nodes: ValueNode[];
      flows: ValueFlow[];
    }
  ): Promise<ValueFlowMap> {
    // Identify cycles
    const cycles = this.identifyCycles(inputs.nodes, inputs.flows);

    // Identify leakages
    const leakages = this.identifyLeakages(inputs.nodes, inputs.flows);

    return {
      nodes: inputs.nodes,
      flows: inputs.flows,
      cycles,
      leakages,
    };
  }

  async analyzeAttribution(
    outcome: string,
    actors: string[],
    activities: { actor: string; activity: string; contribution: number }[]
  ): Promise<AttributionAnalysis> {
    // Calculate contributions
    const contributions = actors.map(actor => {
      const actorActivities = activities.filter(a => a.actor === actor);
      const totalContribution = actorActivities.reduce((sum, a) => sum + a.contribution, 0);
      
      return {
        actor,
        contribution: totalContribution,
        mechanism: actorActivities.map(a => a.activity).join(', '),
        confidence: this.assessContributionConfidence(actorActivities),
      };
    });

    // Normalize contributions
    const total = contributions.reduce((sum, c) => sum + c.contribution, 0);
    if (total > 0) {
      for (const c of contributions) {
        c.contribution = c.contribution / total;
      }
    }

    // Estimate counterfactual
    const counterfactual = this.estimateCounterfactual(outcome, activities);

    // Estimate deadweight and displacement
    const deadweight = 0.2; // Placeholder - would be estimated based on context
    const displacement = 0.1;

    return {
      contributions,
      counterfactual,
      deadweight,
      displacement,
      attributionConfidence: this.calculateAttributionConfidence(contributions),
    };
  }

  async traceValueChain(
    initialInput: string,
    valueMap: ValueFlowMap
  ): Promise<{
    path: string[];
    transformations: { stage: string; change: string; value: number }[];
    finalOutcomes: { outcome: string; value: number; confidence: number }[];
  }> {
    // Find path from input to outcomes
    const path = this.findValuePath(initialInput, valueMap);

    // Identify transformations along the path
    const transformations: { stage: string; change: string; value: number }[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const flow = valueMap.flows.find(f => f.source === path[i] && f.target === path[i + 1]);
      if (flow) {
        transformations.push({
          stage: `${path[i]} → ${path[i + 1]}`,
          change: flow.mechanism,
          value: flow.value,
        });
      }
    }

    // Find final outcomes (nodes with no outgoing flows)
    const finalNodes = valueMap.nodes.filter(n => 
      !valueMap.flows.some(f => f.source === n.id)
    );

    const finalOutcomes = finalNodes.map(n => ({
      outcome: n.name,
      value: n.value,
      confidence: 0.8, // Would be calculated based on evidence quality
    }));

    return {
      path,
      transformations,
      finalOutcomes,
    };
  }

  async calculateMultipliers(
    valueMap: ValueFlowMap,
    initialInvestment: number
  ): Promise<{
    economicMultiplier: number;
    socialMultiplier: number;
    environmentalMultiplier: number;
    totalValueGenerated: number;
    confidence: number;
  }> {
    // Calculate economic value (financial flows)
    const financialFlows = valueMap.flows
      .filter(f => f.mechanism === 'financial')
      .reduce((sum, f) => sum + f.value, 0);

    // Calculate social value (in-kind + knowledge)
    const socialFlows = valueMap.flows
      .filter(f => f.mechanism === 'in-kind' || f.mechanism === 'knowledge')
      .reduce((sum, f) => sum + f.value, 0);

    // Calculate environmental value (ecosystem)
    const environmentalFlows = valueMap.flows
      .filter(f => f.mechanism === 'ecosystem')
      .reduce((sum, f) => sum + f.value, 0);

    const economicMultiplier = initialInvestment > 0 ? financialFlows / initialInvestment : 0;
    const socialMultiplier = initialInvestment > 0 ? socialFlows / initialInvestment : 0;
    const environmentalMultiplier = initialInvestment > 0 ? environmentalFlows / initialInvestment : 0;

    const totalValueGenerated = financialFlows + socialFlows + environmentalFlows;

    return {
      economicMultiplier,
      socialMultiplier,
      environmentalMultiplier,
      totalValueGenerated,
      confidence: 0.7, // Based on data quality
    };
  }

  async identifyValueCapture(
    valueMap: ValueFlowMap,
    stakeholderGroups: string[]
  ): Promise<{
    group: string;
    valueReceived: number;
    proportion: number;
    equityAssessment: 'equitable' | 'somewhat-inequitable' | 'inequitable';
    recommendations: string[];
  }[]> {
    const distribution: { group: string; valueReceived: number }[] = [];

    for (const group of stakeholderGroups) {
      const groupNodes = valueMap.nodes.filter(n => n.stakeholders.includes(group));
      const valueReceived = groupNodes.reduce((sum, n) => sum + n.value, 0);
      
      distribution.push({ group, valueReceived });
    }

    const totalValue = distribution.reduce((sum, d) => sum + d.valueReceived, 0);
    const averageValue = totalValue / distribution.length;

    return distribution.map(d => {
      const proportion = totalValue > 0 ? d.valueReceived / totalValue : 0;
      const deviation = Math.abs(d.valueReceived - averageValue) / (averageValue || 1);

      let equityAssessment: 'equitable' | 'somewhat-inequitable' | 'inequitable' = 'equitable';
      if (deviation > 0.5) equityAssessment = 'inequitable';
      else if (deviation > 0.25) equityAssessment = 'somewhat-inequitable';

      return {
        group: d.group,
        valueReceived: d.valueReceived,
        proportion,
        equityAssessment,
        recommendations: this.generateEquityRecommendations(equityAssessment, d.group),
      };
    });
  }

  private identifyCycles(nodes: ValueNode[], flows: ValueFlow[]): { nodes: string[]; value: number }[] {
    const cycles: { nodes: string[]; value: number }[] = [];
    const visited = new Set<string>();

    // Simple cycle detection (can be enhanced with graph algorithms)
    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const cycle = this.findCycle(node.id, node.id, flows, new Set());
      if (cycle) {
        const cycleFlows = cycle.map((nodeId, i) => {
          const nextId = cycle[(i + 1) % cycle.length];
          return flows.find(f => f.source === nodeId && f.target === nextId);
        }).filter(Boolean) as ValueFlow[];

        const cycleValue = cycleFlows.reduce((sum, f) => sum + f.value, 0) / cycleFlows.length;

        cycles.push({
          nodes: cycle,
          value: cycleValue,
        });

        cycle.forEach(n => visited.add(n));
      }
    }

    return cycles;
  }

  private findCycle(
    start: string,
    current: string,
    flows: ValueFlow[],
    visited: Set<string>,
    path: string[] = []
  ): string[] | null {
    if (visited.has(current)) {
      if (current === start) return [...path, current];
      return null;
    }

    visited.add(current);
    path.push(current);

    const outgoing = flows.filter(f => f.source === current);
    for (const flow of outgoing) {
      const cycle = this.findCycle(start, flow.target, flows, new Set(visited), [...path]);
      if (cycle) return cycle;
    }

    return null;
  }

  private identifyLeakages(nodes: ValueNode[], flows: ValueFlow[]): { node: string; value: number; reason: string }[] {
    const leakages: { node: string; value: number; reason: string }[] = [];

    for (const node of nodes) {
      const incoming = flows.filter(f => f.target === node.id).reduce((sum, f) => sum + f.value, 0);
      const outgoing = flows.filter(f => f.source === node.id).reduce((sum, f) => sum + f.value, 0);

      if (incoming > outgoing * 1.1) {
        leakages.push({
          node: node.id,
          value: incoming - outgoing,
          reason: 'Value accumulation or loss',
        });
      }
    }

    return leakages;
  }

  private findValuePath(initialInput: string, valueMap: ValueFlowMap): string[] {
    const path: string[] = [initialInput];
    let current = initialInput;

    while (true) {
      const outgoing = valueMap.flows.filter(f => f.source === current);
      if (outgoing.length === 0) break;

      // Follow the highest value flow
      const next = outgoing.sort((a, b) => b.value - a.value)[0];
      if (path.includes(next.target)) break; // Cycle detected

      path.push(next.target);
      current = next.target;
    }

    return path;
  }

  private assessContributionConfidence(activities: { contribution: number }[]): number {
    if (activities.length === 0) return 0;
    
    // Higher confidence if multiple activities with clear contributions
    const baseConfidence = Math.min(0.9, activities.length * 0.2 + 0.3);
    
    // Adjust based on contribution clarity
    const clearContributions = activities.filter(a => a.contribution > 0.1).length;
    const clarityFactor = clearContributions / activities.length;

    return baseConfidence * clarityFactor;
  }

  private estimateCounterfactual(outcome: string, activities: { activity: string }[]): string {
    // Estimate what would have happened without intervention
    const commonOutcomes: Record<string, string> = {
      'employment': 'Likely 30-50% of jobs would have been created through other means',
      'education': 'Alternative education pathways available but lower quality',
      'health': 'Basic services available but less comprehensive',
      'environment': 'Minimal improvement without active intervention',
    };

    for (const [key, estimate] of Object.entries(commonOutcomes)) {
      if (outcome.toLowerCase().includes(key)) {
        return estimate;
      }
    }

    return 'Counterfactual uncertain - requires further investigation';
  }

  private calculateAttributionConfidence(contributions: { confidence: number }[]): number {
    if (contributions.length === 0) return 0;
    const avg = contributions.reduce((sum, c) => sum + c.confidence, 0) / contributions.length;
    return Math.round(avg * 100) / 100;
  }

  private generateEquityRecommendations(
    assessment: 'equitable' | 'somewhat-inequitable' | 'inequitable',
    group: string
  ): string[] {
    const recommendations: Record<string, string[]> = {
      'equitable': ['Maintain current distribution mechanisms'],
      'somewhat-inequitable': [
        `Review value flows to ${group}`,
        'Consider rebalancing mechanisms',
        'Engage stakeholders in dialogue',
      ],
      'inequitable': [
        `Urgent review of value capture by ${group}`,
        'Implement redistribution mechanisms',
        'Establish equity monitoring',
        'Consider stakeholder compensation',
      ],
    };

    return recommendations[assessment];
  }
}
