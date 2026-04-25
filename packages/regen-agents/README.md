# Regen Agents Package

Specialist agents for regenerative ecosystem coordination, built on the Organizational OS framework.

## Overview

This package provides 4 specialist agents designed to support regenerative organizations (DAOs, cooperatives, land stewardship groups) in their coordination work:

1. **🌱 Regenerative Agriculture Researcher** - Soil health, carbon sequestration, biodiversity
2. **⚖️ Commons Governance Specialist** - DAOs, cooperatives, legal wrappers, Ostrom principles  
3. **📊 Impact Measurement Analyst** - Metrics design, verification, reporting standards
4. **🗺️ Bioregional Intelligence Agent** - Territory mapping, resource flows, stakeholder networks

## Architecture

All 4 agents integrate with:
- **Meeting Processor** - Record findings from meetings
- **Knowledge Curator** - Store insights in the knowledge base
- **Funding Scout** - Trigger agents based on opportunities
- **Super Agent** - Coordinate across all 4 specialists

## Agent Structure

Each agent follows the same pattern:
```
src/agents/<agent-name>/
├── index.ts          # Main agent class
├── skills/           # Skill implementations
├── prompts/          # System prompts
├── examples/         # Usage examples
└── AGENT.md          # Agent specification
```

## Quick Start

```typescript
import { RegenAgentOrchestrator } from '@org-os/regen-agents';

const orchestrator = new RegenAgentOrchestrator();

// Trigger agriculture research
const agricultureAgent = orchestrator.getAgent('agriculture-researcher');
await agricultureAgent.research({
  topic: 'cover cropping for carbon sequestration',
  region: 'mediterranean-climate'
});

// Trigger governance analysis
const governanceAgent = orchestrator.getAgent('commons-governance');
await governanceAgent.analyzeProposal({
  proposalType: 'dao-charter',
  content: governanceDocument
});
```

## Agent Capabilities

### 🌱 Regenerative Agriculture Researcher
- Research soil health practices
- Analyze carbon sequestration methods
- Study water cycle restoration
- Evaluate biodiversity strategies
- Generate practice guides

### ⚖️ Commons Governance Specialist
- Analyze governance structures (DAOs, cooperatives)
- Review legal wrapper options
- Apply Ostrom's principles
- Design dispute resolution processes
- Generate governance recommendations

### 📊 Impact Measurement Analyst
- Design impact metrics (IRIS+, GIIN standards)
- Analyze project data
- Create verification protocols
- Generate impact reports
- Build dashboard specifications

### 🗺️ Bioregional Intelligence Agent
- Map territories and ecosystems
- Analyze resource flows
- Identify stakeholder networks
- Process local knowledge
- Generate bioregional profiles

## Integration

These agents are designed to work together. The Super Agent coordinates when multiple perspectives are needed:

```typescript
// Complex request that requires multiple agents
const result = await orchestrator.superAgent.coordinate({
  request: 'Design a regenerative land stewardship program',
  agents: ['agriculture-researcher', 'commons-governance', 'bioregional-intelligence'],
  deliverables: ['practice-guide', 'governance-framework', 'stakeholder-map']
});
```

## License

MIT - Regen Coordination Community
