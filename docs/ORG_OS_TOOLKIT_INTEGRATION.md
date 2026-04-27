# org-os ↔ Toolkit Integration Design

**Version:** 1.0.0  
**Date:** 2026-03-28  
**Status:** Design Document  
**Scope:** Architecture for bidirectional coordination between regen-toolkit and organizational OS instances

---

## 1. Executive Summary

This document defines the integration architecture between **regen-toolkit** (educational content and tool assessment platform) and **org-os** (organizational operating system framework). The integration enables:

- **Content-driven coordination**: Toolkit content flows into org-os instances as actionable knowledge
- **Tool-aware governance**: org-os decisions reference toolkit tool assessments and maturity ratings
- **Cross-instance federation**: Toolkit serves as shared knowledge infrastructure across the 7-node Regen Coordination network
- **Agent-native workflows**: AI agents coordinate seamlessly across both systems

---

## 2. Role Definition

### 2.1 What regen-toolkit Provides to org-os

| Capability | Description | Value to org-os |
|------------|-------------|-----------------|
| **Educational Content** | 3-track knowledge base (Foundations, Applied Web3, Playbooks) | Onboarding material for new members, structured learning paths |
| **Tool Maturity Assessments** | 4-dimension evaluation framework for web3 protocols | Informed decision-making on tool adoption |
| **Critical Path Mapping** | Real-world implementation pathways for projects | Project planning and execution guidance |
| **Source Attribution System** | Structured references (A-O source system) | Decision traceability and evidence base |
| **Cross-link Networks** | Dense internal linking between concepts | Knowledge discovery and contextual learning |
| **Assessment Reports** | Protocol readiness evaluations for nonprofits | Risk assessment for governance decisions |

### 2.2 What org-os Provides to regen-toolkit

| Capability | Description | Value to Toolkit |
|------------|-------------|------------------|
| **Organizational Context** | Live data on node status, projects, funding | Content relevance to actual organizational needs |
| **Federation Infrastructure** | 7-node network topology with sync protocols | Distribution channel for toolkit content |
| **Agent Orchestration** | Multi-agent coordination across instances | Content generation and validation at scale |
| **Decision Logging** | EIP-4824 compliant decision records | Ground truth for case studies and patterns |
| **Governance Integration** | Council consensus mechanisms | Content prioritization and quality assurance |
| **Skill Distribution** | Shared capabilities pushed to nodes | Toolkit builder skill availability |

### 2.3 Dependency Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEPENDENCY MAP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   regen-toolkit                      org-os                     │
│   ─────────────                      ──────                     │
│                                                                 │
│   ┌──────────────┐                ┌──────────────┐              │
│   │ Content Layer│◄──────────────►│ Federation   │              │
│   │ (Markdown)   │   Sync Protocol│ Layer        │              │
│   └──────────────┘                └──────────────┘              │
│          │                               │                      │
│          ▼                               ▼                      │
│   ┌──────────────┐                ┌──────────────┐              │
│   │ Assessment   │◄──────────────►│ Decision     │              │
│   │ Engine       │   References   │ Layer        │              │
│   └──────────────┘                └──────────────┘              │
│          │                               │                      │
│          ▼                               ▼                      │
│   ┌──────────────┐                ┌──────────────┐              │
│   │ Agent Skills │◄──────────────►│ Agent Runtime│              │
│   │ (regen-      │   Skill Dist.  │ (OpenClaw)   │              │
│   │  toolkit-    │                │              │              │
│   │  builder)    │                │              │              │
│   └──────────────┘                └──────────────┘              │
│                                                                 │
│   ═══════════════════════════════════════════════════════      │
│   SHARED FOUNDATION: Egregore + Neo4j (Container Poiesis)      │
│   ═══════════════════════════════════════════════════════      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Toolkit → org-os**: Content sync, tool references, skill availability  
**org-os → Toolkit**: Usage telemetry, decision outcomes, case study material  
**Shared Foundation**: Egregore memory system provides unified graph storage

---

## 3. API Design

### 3.1 Architecture Pattern: Event-Driven with REST Fallback

The integration uses a hybrid approach:
- **Primary**: Event-driven via Egregore/Neo4j graph changes
- **Fallback**: REST API for direct queries and legacy integrations
- **Future**: KOI-Net for real-time knowledge synchronization

### 3.2 Toolkit → org-os API

#### Pattern 1: Content Publication

**When**: New toolkit article ready for distribution  
**Flow**: Toolkit publishes → Hub aggregates → Nodes subscribe

```typescript
// Toolkit publishes content event
interface ContentPublishedEvent {
  event: "content.published";
  payload: {
    contentId: string;           // UUID for the article
    path: string;                // "content/3-playbooks/..."
    type: "playbook" | "assessment" | "case-study";
    frontmatter: {
      title: string;
      status: "draft" | "review" | "published";
      critical_paths: string[];  // ["sarreya", "forest-city"]
      tags: string[];            // ["Local Node Starter", "Impact DAO"]
      maturity?: "alpha" | "beta" | "production";
    };
    hash: string;                // Content checksum
    timestamp: ISO8601;
  };
  signature?: string;            // Optional content attestation
}

// Hub (Regen Coordination) aggregates
class HubContentAggregator {
  async onContentPublished(event: ContentPublishedEvent): Promise<void> {
    // 1. Validate content hash
    // 2. Route to appropriate domain knowledge/<domain>/
    // 3. Notify subscribed nodes via federation.yaml sync
    // 4. Update knowledge-commons index
  }
}
```

#### Pattern 2: Tool Assessment Query

**When**: org-os instance needs tool maturity data for decision  
**Flow**: org-os queries → Toolkit responds with assessment

```typescript
// org-os queries toolkit for tool assessment
interface ToolAssessmentQuery {
  query: "tool.assessment.get";
  toolName: string;            // "Gnosis Safe", "Gitcoin Grants"
  dimensions?: ("technical" | "adoption" | "support" | "maturity")[];
  context?: {
    orgType: "dao" | "coop" | "nonprofit";
    experienceLevel: "beginner" | "intermediate" | "advanced";
  };
}

interface ToolAssessmentResponse {
  tool: {
    name: string;
    category: string;
    overallScore: number;        // 0-100 aggregate
  };
  dimensions: {
    technical: { score: number; notes: string; };
    adoption: { score: number; notes: string; };
    support: { score: number; notes: string; };
    maturity: { score: number; notes: string; };
  };
  recommendations: {
    suitableFor: string[];       // ["small-daos", "nonprofits"]
    cautions: string[];
    alternatives: string[];
  };
  lastUpdated: ISO8601;
  assessorVersion: string;
}

// REST endpoint
GET /api/v1/tools/{tool-name}/assessment?org=dao&level=beginner
```

#### Pattern 3: Critical Path Discovery

**When**: Starting new project, need implementation guidance  
**Flow**: org-os describes need → Toolkit suggests critical paths

```typescript
interface CriticalPathQuery {
  query: "criticalpath.discover";
  project: {
    type: string;                // "lending-platform", "local-currency"
    location?: string;           // "Medellin", "Barcelona"
    stage: "ideation" | "planning" | "implementation";
  };
  constraints?: {
    budget?: "small" | "medium" | "large";
    timeline?: "urgent" | "standard" | "relaxed";
    legalStructure?: "dao" | "coop" | "hybrid";
  };
}

interface CriticalPathResponse {
  paths: Array<{
    id: string;
    name: string;
    description: string;
    stages: Array<{
      order: number;
      name: string;
      deliverables: string[];
      toolkitArticles: string[];  // Links to content
      estimatedDuration: string;
    }>;
    relevanceScore: number;      // Match to query context
    caseStudies: string[];       // Related real projects
  }>;
}
```

### 3.3 org-os → Toolkit API

#### Pattern 4: Decision Outcome Reporting

**When**: org-os makes decision using toolkit guidance  
**Flow**: Decision logged → Toolkit learns → Assessments improved

```typescript
interface DecisionOutcomeReport {
  report: "decision.outcome";
  decision: {
    decisionId: string;          // From org-os decision log
    title: string;
    orgUri: string;              // EIP-4824 daoURI
    timestamp: ISO8601;
  };
  toolkitReferences: {
    articlesCited: string[];     // Content that influenced decision
    toolsSelected: string[];     // Tools chosen based on assessments
    pathsFollowed: string[];     // Critical paths used
  };
  outcome: {
    status: "pending" | "implemented" | "abandoned" | "successful";
    lessons: string;             // Free-form lessons learned
    wouldRecommend: boolean;
  };
}

// Toolkit uses this for:
// - Updating tool maturity scores based on real usage
// - Identifying content gaps
// - Building case study library
```

#### Pattern 5: Node Context Sync

**When**: Toolkit needs to understand organizational context  
**Flow**: Toolkit queries → org-os provides sanitized context

```typescript
interface NodeContextQuery {
  query: "node.context";
  requestingToolkit: string;
  scope: "public" | "protected" | "private";
  interests: string[];           // ["governance", "funding", "projects"]
}

interface NodeContextResponse {
  node: {
    name: string;
    type: "LocalNode" | "DAO" | "Hub";
    stage: "bootstrapping" | "active" | "mature";
    domains: string[];           // Knowledge domains active
  };
  summary: {
    activeProjects: number;
    recentDecisions: number;
    fundingStage: string;
    primaryChallenges: string[];
  };
  // Content scoped by privacy level
  content: {
    public: any;
    protected?: any;             // Only if scope permits
    private?: any;               // Only if scope permits
  };
}
```

### 3.4 Bidirectional Event Schema

```yaml
# Event types and directions
events:
  # Toolkit → org-os
  - name: content.published
    direction: toolkit→hub→nodes
    payload: ContentPublishedEvent
    
  - name: assessment.updated
    direction: toolkit→hub→nodes
    payload: ToolAssessmentEvent
    
  - name: skill.available
    direction: toolkit→hub→nodes
    payload: SkillAvailabilityEvent
    
  # org-os → Toolkit
  - name: decision.recorded
    direction: node→hub→toolkit
    payload: DecisionOutcomeReport
    
  - name: project.started
    direction: node→hub→toolkit
    payload: ProjectInitiatedEvent
    
  - name: case.study.material
    direction: node→hub→toolkit
    payload: CaseStudyMaterialEvent
    
  # Bidirectional
  - name: query.request
    direction: bidirectional
    payload: QueryRequest
    
  - name: federation.sync
    direction: bidirectional
    payload: FederationSyncEvent
```

---

## 4. Federation Patterns

### 4.1 Toolkit in Multi-Org Federation

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FEDERATION TOPOLOGY                                  │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    REGEN COORDINATION HUB                    │   │
│   │                     (regen-coordination-os)                  │   │
│   │                                                              │   │
│   │   ┌─────────────────┐    ┌─────────────────┐                 │   │
│   │   │  regen-toolkit  │    │  knowledge/     │                 │   │
│   │   │  (embedded pkg) │───►│  commons/       │                 │   │
│   │   │                 │    │  (aggregated)   │                 │   │
│   │   └─────────────────┘    └────────┬────────┘                 │   │
│   │                                    │                         │   │
│   └────────────────────────────────────┼─────────────────────────┘   │
│                                        │                            │
│                     Knowledge Sync     │  Skill Distribution        │
│                     (git subtree)      │  (GitHub Actions)          │
│                                        ▼                            │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│   │   ReFi DAO OS  │  │   ReFi BCN OS  │  │   NYC Node     │       │
│   │                │  │                │  │                │       │
│   │ ┌──────────┐   │  │ ┌──────────┐   │  │ ┌──────────┐   │       │
│   │ │toolkit/  │◄──┘  │ │toolkit/  │◄──┘  │ │toolkit/  │◄──┘       │
│   │ │(synced)  │      │ │(synced)  │      │ │(synced)  │           │
│   │ └──────────┘      │ └──────────┘      │ └──────────┘           │
│   │                   │                   │                       │
│   │ ┌──────────┐      │ ┌──────────┐      │ ┌──────────┐           │
│   │ │skills/   │◄─────┤ │skills/   │◄─────┤ │skills/   │           │
│   │ │(merged)  │      │ │(merged)  │      │ │(merged)  │           │
│   │ └──────────┘      │ └──────────┘      │ └──────────┘           │
│   └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                       │
│   LEGEND:                                                             │
│   ───────                                                             │
│   ▲◄── Sync direction                                                │
│   toolkit/ = Embedded toolkit content (git subtree)                    │
│   skills/  = Merged skills (hub pushes, nodes preserve additions)      │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 State Synchronization Strategies

| Data Type | Sync Strategy | Frequency | Conflict Resolution |
|-----------|---------------|-----------|---------------------|
| **Content (articles)** | Git subtree pull | Weekly | Hub is source of truth |
| **Tool assessments** | Event-driven | On update | Last-assessment-wins with versioning |
| **Skills** | Git push from hub | On change | Hub replaces body, nodes keep additions |
| **Decision outcomes** | Event aggregation | Weekly | Append-only, no conflicts |
| **Critical paths** | Git subtree | Monthly | Hub curates, nodes suggest |

### 4.3 Conflict Resolution

#### Scenario 1: Content Version Divergence

**When**: Node A modifies toolkit content locally, hub publishes new version

```typescript
// Resolution: Three-way merge with semantic understanding
class ContentMergeResolver {
  resolve(local: Article, incoming: Article, base: Article): MergeResult {
    // 1. Compare frontmatter (hub wins for canonical fields)
    // 2. Merge body (preserve local additions, update shared content)
    // 3. Flag conflicts for human review if:
    //    - Local changed assessment scores
    //    - Local added critical paths not in hub
    //    - Local removed toolkit attribution
    
    return {
      merged: mergedArticle,
      conflicts: flaggedSections,
      autoResolved: autoResolvedSections,
      requiresReview: flaggedSections.length > 0
    };
  }
}
```

#### Scenario 2: Assessment Data Conflicts

**When**: Multiple nodes report different outcomes for same tool

```typescript
// Resolution: Weighted aggregation with transparency
class AssessmentConflictResolver {
  resolve(reports: DecisionOutcomeReport[]): ResolvedAssessment {
    // 1. Group by tool
    // 2. Weight by org type and experience
    //    - Production DAO > Test DAO
    //    - 1+ year usage > New adoption
    // 3. Flag significant divergences (>20 point difference)
    // 4. Generate confidence interval
    
    return {
      aggregatedScore: weightedAverage,
      confidence: confidenceLevel,
      divergences: significantDifferences,
      breakdown: byOrgType
    };
  }
}
```

#### Scenario 3: Skill Distribution Conflicts

**Policy**: Hub skills are authoritative for body content, nodes maintain additions

```yaml
# Skill merge rules from federation.yaml
distribute-skills:
  strategy: "hub-authoritative-with-preservation"
  rules:
    - hub_replaces: "SKILL.md body"
    - node_preserves: "local additions in node-additions.md"
    - merge_strategy: "concatenate-with-separator"
    - conflict_flag: "manual-review-if-node-removed-hub-content"
```

---

## 5. Agent Coordination

### 5.1 Cross-System Agent Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                     AGENT COORDINATION LAYER                            │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                    TOOLKIT AGENTS                               │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│   │  │regen-toolkit-│  │web3-tool-    │  │source-       │          │  │
│   │  │builder       │  │assessor      │  │synthesizer   │          │  │
│   │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │  │
│   │         │                 │                 │                   │  │
│   │         └─────────────────┼─────────────────┘                   │  │
│   │                           ▼                                     │  │
│   │                  ┌────────────────┐                           │  │
│   │                  │ Agent Bridge   │◄────────────────────────────┤  │
│   │                  │ (org-os-       │    ToolkitOrchestrator      │  │
│   │                  │  adapter)      │                             │  │
│   │                  └───────┬────────┘                             │  │
│   └──────────────────────────┼─────────────────────────────────────┘  │
│                              │                                         │
│   ═══════════════════════════╪══════════════════════════════════════   │
│         ORG-OS FEDERATION    │                                         │
│   ═══════════════════════════╪══════════════════════════════════════   │
│                              │                                         │
│   ┌──────────────────────────┼─────────────────────────────────────┐   │
│   │                  ┌───────▼────────┐                           │   │
│   │   ┌──────────────┤  Hub Agent    ├──────────────┐            │   │
│   │   │              │(Regen Coord)    │              │            │   │
│   │   │              └────────────────┘              │            │   │
│   │   │                      │                       │            │   │
│   │   │     ┌────────────────┼────────────────┐      │            │   │
│   │   │     │                │                │      │            │   │
│   │   ▼     ▼                ▼                ▼      │            │   │
│   │ ┌────────────┐    ┌────────────┐    ┌────────────┐           │   │
│   │ │ ReFi DAO   │    │ ReFi BCN   │    │ NYC/Bloom  │           │   │
│   │ │  Agent     │    │  Agent     │    │  Agents    │           │   │
│   │ └────────────┘    └────────────┘    └────────────┘           │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Command Routing Patterns

#### Pattern A: Toolkit-Initiated Coordination

```typescript
// Use case: New tool assessment needs node feedback
class ToolkitCoordinationPattern {
  async coordinateAssessment(toolName: string): Promise<void> {
    // 1. Toolkit creates assessment draft
    const draft = await this.toolkitBuilder.createAssessment(toolName);
    
    // 2. Query relevant nodes for real-world experience
    const relevantNodes = await this.hubAgent.findNodes({
      criteria: [
        { field: "projects.toolsUsed", includes: toolName },
        { field: "stage", in: ["active", "mature"] }
      ]
    });
    
    // 3. Dispatch subagents to gather feedback
    const feedbackPromises = relevantNodes.map(node => 
      this.agentCoordinator.dispatch({
        target: node.agentEndpoint,
        task: {
          type: "assessment.feedback",
          tool: toolName,
          questions: draft.reviewQuestions
        },
        timeout: "24h"
      })
    );
    
    // 4. Aggregate responses
    const feedback = await Promise.allSettled(feedbackPromises);
    
    // 5. Update assessment with real-world data
    await this.toolkitBuilder.updateAssessment(draft.id, {
      nodeFeedback: feedback,
      confidenceLevel: this.calculateConfidence(feedback)
    });
  }
}
```

#### Pattern B: org-os-Initiated Coordination

```typescript
// Use case: Node needs toolkit content for decision
class OrgOsCoordinationPattern {
  async prepareDecisionContext(decisionTopic: string): Promise<DecisionContext> {
    // 1. Node agent queries toolkit for relevant content
    const relevantContent = await this.toolkitOrchestrator.query({
      type: "content.discover",
      topic: decisionTopic,
      filters: {
        status: "published",
        maturity: ["beta", "production"],
        criticalPaths: ["active"]
      }
    });
    
    // 2. Get tool assessments if relevant
    const tools = this.extractToolMentions(relevantContent);
    const assessments = await Promise.all(
      tools.map(t => this.toolkitOrchestrator.query({
        type: "tool.assessment.get",
        tool: t
      }))
    );
    
    // 3. Package context for decision
    return {
      content: relevantContent,
      assessments: assessments,
      relatedDecisions: await this.hubAgent.findRelatedDecisions(decisionTopic),
      recommendedApproach: this.synthesizeRecommendation(relevantContent, assessments)
    };
  }
}
```

#### Pattern C: Multi-Node Consensus Pattern

```typescript
// Use case: Network-wide content quality assurance
class MultiNodeConsensusPattern {
  async validateContentQuality(contentId: string): Promise<ValidationResult> {
    // 1. Hub broadcasts validation request to council nodes
    const councilNodes = await this.hubAgent.getCouncilMembers();
    
    // 2. Each node agent reviews content independently
    const reviews = await this.agentCoordinator.broadcast({
      targets: councilNodes,
      task: {
        type: "content.review",
        contentId: contentId,
        criteria: ["accuracy", "relevance", "actionability", "safety"]
      },
      aggregation: "collect-all"
    });
    
    // 3. Hub aggregates and determines consensus
    const consensus = this.hubAgent.calculateConsensus(reviews, {
      threshold: 0.67,  // 2/3 majority
      requires: ["ReFi DAO", "ReFi BCN"]  // Must include these
    });
    
    // 4. Update content status based on consensus
    await this.toolkitOrchestrator.updateContentStatus(contentId, {
      status: consensus.approved ? "published" : "needs-revision",
      reviewNotes: consensus.summary,
      reviewerCount: reviews.length
    });
    
    return consensus;
  }
}
```

### 5.3 Response Aggregation

```typescript
interface AggregationStrategy {
  // For content reviews: majority with quality weighting
  contentValidation: {
    method: "weighted-majority";
    weights: {
      nodeMaturity: 0.3,
      reviewerExpertise: 0.4,
      reviewThoroughness: 0.3
    };
    threshold: 0.67;
  };
  
  // For tool assessments: evidence aggregation
  toolAssessment: {
    method: "evidence-accumulation";
    factors: {
      usageDuration: "weight-linear",
      orgTypeMatch: "weight-boost",
      outcomeSuccess: "weight-significant"
    };
    confidenceThreshold: 0.8;
  };
  
  // For critical paths: merge with conflict detection
  criticalPathMerge: {
    method: "three-way-merge";
    conflictResolution: "manual-for-divergence";
    autoMergeThreshold: 0.9;  // Similarity score
  };
}
```

---

## 6. Data Model

### 6.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA MODEL (ER Diagram)                             │
│                                                                             │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│  │   Project   │◄───────►│  Decision   │◄───────►│    Tool     │           │
│  │─────────────│    ┌────│─────────────│────┐    │─────────────│           │
│  │ id (PK)     │    │    │ id (PK)     │    │    │ id (PK)     │           │
│  │ name        │    │    │ title       │    │    │ name        │           │
│  │ status      │    │    │ status      │    │    │ category    │           │
│  │ criticalPath│◄───┘    │ outcome     │    └──►│ assessment  │           │
│  │ orgUri (FK) │         │ timestamp   │         │ maturity    │           │
│  └──────┬──────┘         └──────┬──────┘         └─────────────┘           │
│         │                         │                                         │
│         │    ┌────────────────────┘                                         │
│         │    │                                                               │
│         ▼    ▼                                                               │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│  │   Task      │◄───────►│   Agent     │◄───────►│   Feature   │           │
│  │─────────────│         │─────────────│         │─────────────│           │
│  │ id (PK)     │         │ id (PK)     │         │ id (PK)     │           │
│  │ description │         │ name        │         │ name        │           │
│  │ status      │         │ runtime     │         │ status      │           │
│  │ projectId   │         │ skills      │         │ priority    │           │
│  │ assigneeId  │────────►│ status      │         │ toolkitRef  │           │
│  └─────────────┘         └─────────────┘         └─────────────┘           │
│                                                                             │
│  RELATIONSHIPS:                                                             │
│  ─────────────                                                              │
│  Project ──(1:N)──► Task                                                    │
│  Project ──(N:1)──► OrgInstance (via orgUri)                                │
│  Decision ──(M:N)──► Tool (via tool references)                             │
│  Decision ──(1:N)──► ToolkitContent (via citations)                         │
│  Agent ──(M:N)──► Skill (via capabilities)                                  │
│  Feature ──(N:1)──► ToolkitContent (via toolkitRef)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Entity Definitions

#### Project

```typescript
interface Project {
  // Identity
  id: string;                    // UUID
  slug: string;                  // URL-friendly name
  
  // Descriptive
  name: string;
  description: string;
  status: "ideation" | "planning" | "active" | "paused" | "completed" | "archived";
  
  // Relationships
  orgUri: string;                // EIP-4824 daoURI of owning org
  criticalPathId?: string;       // Associated toolkit critical path
  toolkitArticles: string[];     // Referenced content
  
  // Operational
  startDate?: ISO8601;
  targetCompletion?: ISO8601;
  budget?: {
    currency: string;
    allocated: number;
    spent: number;
  };
  
  // Privacy
  visibility: "public" | "protected" | "private";
}
```

#### Decision

```typescript
interface Decision {
  // Identity
  id: string;                    // UUID
  decisionUri: string;           // EIP-4824 decisionURI
  
  // Descriptive
  title: string;
  description: string;
  category: "governance" | "technical" | "funding" | "operational";
  
  // Outcome
  status: "proposed" | "approved" | "rejected" | "implemented" | "superseded";
  outcome?: string;              // Detailed outcome description
  
  // Relationships
  orgUri: string;
  proposalId?: string;           // Link to on-chain proposal if applicable
  toolkitReferences: {
    articles: string[];          // Cited toolkit content
    tools: string[];             // Tools referenced
    assessmentsUsed: string[];   // Assessment IDs
  };
  
  // Provenance
  proposedAt: ISO8601;
  decidedAt?: ISO8601;
  decidedBy?: "council" | "vote" | "consent" | "delegated";
  
  // Privacy (decisions are typically public for transparency)
  visibility: "public" | "protected";  // Protected = council-only until published
}
```

#### Agent

```typescript
interface Agent {
  // Identity
  id: string;                    // UUID
  name: string;
  runtime: "openclaw" | "cursor" | "custom";
  
  // Capabilities
  skills: string[];              // Skill identifiers
  permissions: Permission[];
  
  // Relationships
  orgUri: string;                // Home organization
  peerAgents: string[];          // Known peer agents (for coordination)
  
  // Status
  status: "idle" | "active" | "busy" | "error" | "offline";
  lastHeartbeat: ISO8601;
  
  // Configuration
  proactive: boolean;            // Can initiate actions
  channels: ("telegram" | "github" | "email")[];
}

interface Permission {
  resource: string;              // "content", "decisions", "tools", etc.
  action: "read" | "write" | "admin";
  scope: "own-org" | "federation" | "all";
}
```

#### Tool (Toolkit-Originated)

```typescript
interface Tool {
  // Identity
  id: string;                    // UUID
  slug: string;                  // Normalized name ("gnosis-safe")
  name: string;                  // Display name ("Gnosis Safe")
  
  // Categorization
  category: string;              // "wallet", "treasury", "governance", etc.
  tags: string[];
  
  // Assessment
  assessment: {
    overallScore: number;        // 0-100
    dimensions: {
      technical: number;         // Technical robustness
      adoption: number;          // Community adoption
      support: number;           // Support quality
      maturity: number;          // Product maturity
    };
    lastAssessed: ISO8601;
    assessorVersion: string;
  };
  
  // Content
  playbookArticle?: string;      // Link to toolkit playbook
  caseStudies: string[];         // Related project implementations
  
  // Federation
  usageReports: UsageReport[];   // Decision outcomes that used this tool
}

interface UsageReport {
  orgUri: string;
  projectId?: string;
  decisionId?: string;
  outcome: "success" | "partial" | "failure" | "abandoned";
  timestamp: ISO8601;
  notes: string;
}
```

#### Feature (Cross-System)

```typescript
interface Feature {
  // Identity
  id: string;                    // UUID
  name: string;
  description: string;
  
  // Cross-system reference
  toolkitRef?: string;           // Link to toolkit content/feature
  orgOsRef?: string;             // Link to org-os implementation
  
  // Status
  status: "planned" | "in-development" | "beta" | "production" | "deprecated";
  priority: "critical" | "high" | "medium" | "low";
  
  // Scope
  visibility: "public" | "protected" | "private";
  availableTo: string[];         // Org URIs with access
}
```

### 6.3 Privacy Scopes

```typescript
// Privacy scope definitions for cross-system data
enum PrivacyScope {
  // Public: Visible to all federation members and external queries
  PUBLIC = "public",
  
  // Protected: Visible to federation members only, requires auth
  PROTECTED = "protected",
  
  // Private: Visible only within owning org, never federated
  PRIVATE = "private"
}

// Scope enforcement by entity type
interface ScopePolicy {
  // Projects: Can be any scope
  projects: {
    default: "private",
    canPublish: ["protected", "public"]
  };
  
  // Decisions: Public or protected (transparency default)
  decisions: {
    default: "public",
    preDecision: "protected",  // Until finalized
    canPublish: ["public", "protected"]
  };
  
  // Tool assessments: Always public (shared knowledge)
  toolAssessments: {
    default: "public",
    canPublish: ["public"]
  };
  
  // Agent operations: Protected or private
  agentOperations: {
    default: "protected",
    canPublish: ["protected", "private"]
  };
  
  // Features: Depends on maturity
  features: {
    default: "private",
    beta: "protected",
    production: "public",
    canPublish: ["private", "protected", "public"]
  };
}

// Scoped query handling
interface ScopedQuery<T> {
  data: T;
  scope: PrivacyScope;
  availableTo?: string[];        // For PROTECTED: list of allowed orgUris
  
  // If query requests broader scope than available, 
  // either redact or reject
  redactionRules: {
    sensitiveFields: string[];
    replacement: "null" | "redacted" | "omitted";
  };
}
```

---

## 7. Example Workflows with Agent Coordination

### Workflow 1: ReFi BCN Cooperative Formation with Toolkit Guidance

**Context**: ReFi BCN is forming a cooperative legal structure and needs guidance

**Steps**:

1. **TRIGGER**: ReFi BCN agent identifies need for cooperative formation

2. **TOOLKIT QUERY**: ReFi BCN Agent queries Toolkit Orchestrator for cooperative formation critical path

3. **RESPONSE**: Toolkit Orchestrator returns "ESS-Legal-Structure" critical path with stages and content links

4. **DECISION PREPARATION**: ReFi BCN Agent requests council insight via Hub Agent

5. **MULTI-NODE COORDINATION**: Hub Agent dispatches to ReFi DAO and Regen Coord agents

6. **KNOWLEDGE CONTRIBUTION**: ReFi DAO Agent shares LLC-DAO hybrid experience

7. **SYNTHESIS**: Hub Agent aggregates and provides adapted guidance for Catalan ESS ecosystem

8. **DECISION RECORDING**: ReFi BCN creates decision citing toolkit references and tools

9. **FEEDBACK LOOP**: Decision outcome reported to Toolkit, improving future critical paths

**Agents Involved**: ReFi BCN Agent, Toolkit Orchestrator, Hub Agent, ReFi DAO Agent, Regen Coord Agent

---

### Workflow 2: Tool Assessment with Network Validation

**Context**: Toolkit needs to assess a new protocol, leverages network experience

**Steps**:

1. **TRIGGER**: Toolkit Builder Agent initiates assessment of new protocol

2. **INITIAL ASSESSMENT**: Technical analysis via web3-tool-assessor skill

3. **NETWORK QUERY**: Hub Agent scans which nodes have used/evaluated the protocol

4. **NODE DISCOVERY**: ReFi DAO (no usage), ReFi BCN (testing), NYC Node (production), Bloom (evaluated alternative)

5. **SUBAGENT DISPATCH**: Agent Coordinator dispatches to relevant nodes for experience reports

6. **FEEDBACK COLLECTION**: Each node agent provides structured feedback on their experience

7. **AGGREGATION**: Toolkit Orchestrator aggregates with weighted scoring based on production usage

8. **ASSESSMENT PUBLICATION**: Published with node attribution (with permission)

9. **NETWORK UPDATE**: Event distributed to all nodes for local registry updates

**Agents Involved**: Toolkit Builder Agent, web3-tool-assessor, Toolkit Orchestrator, Hub Agent, Node Agents

---

### Workflow 3: Cross-Node Project Coordination via Critical Path

**Context**: NYC Node and ReFi BCN collaborate on lending platform

**Steps**:

1. **TRIGGER**: NYC Node proposes lending platform for mutual aid

2. **CRITICAL PATH DISCOVERY**: Toolkit Orchestrator finds relevant Medellin package

3. **PEER COLLABORATION**: NYC requests collaboration with ReFi BCN via Hub

4. **KNOWLEDGE CONTRIBUTION**: ReFi BCN shares ESS adaptations and compliance approach

5. **PROJECT CREATION**: NYC creates project with adapted critical path and collaboration links

6. **ONGOING COORDINATION**: Weekly syncs via Hub, monthly updates to Toolkit

7. **OUTCOME REPORTING**: Case study reported to Toolkit for future users

**Agents Involved**: NYC Node Agent, Toolkit Orchestrator, Hub Agent, ReFi BCN Agent

---

### Workflow 4: Content Quality Assurance via Council Consensus

**Context**: Toolkit article needs network validation before publication

**Steps**:

1. **TRIGGER**: Toolkit Builder creates article ready for review

2. **VALIDATION REQUEST**: Toolkit Orchestrator requests council review

3. **COUNCIL BROADCAST**: Agent Coordinator dispatches to council agents

4. **INDEPENDENT REVIEW**: Each council agent reviews against criteria (accuracy, safety, actionability)

5. **CONSENSUS CALCULATION**: Hub evaluates approval rate, conditions, blockers

6. **REVISION TRACKING**: Toolkit Builder incorporates feedback

7. **PUBLICATION**: Published with reviewer attribution

8. **NETWORK DISTRIBUTION**: Event distributed to all nodes

**Agents Involved**: Toolkit Builder Agent, Toolkit Orchestrator, Hub Agent, Council Agents

---

### Workflow 5: Emergency Response with Contextual Knowledge

**Context**: Unexpected governance attack requires rapid response

**Steps**:

1. **TRIGGER**: ReFi DAO Agent detects suspicious activity (HIGH severity)

2. **IMMEDIATE CONTEXT**: Toolkit Orchestrator retrieves emergency protocols with URGENT priority

3. **NETWORK ALERT**: Hub Agent broadcasts to emergency council channel

4. **KNOWLEDGE SYNTHESIS**: Hub aggregates protocols, governance structure, similar incidents

5. **DECISION SUPPORT**: Hub provides recommended actions with toolkit references

6. **RESPONSE EXECUTION**: ReFi DAO Agent executes with human approval using toolkit guidance

7. **POST-INCIDENT**: Outcome and lessons reported to Toolkit and Network

8. **NETWORK PREPARATION**: Post-mortem distributed for protocol review

**Agents Involved**: ReFi DAO Agent, Toolkit Orchestrator, Hub Agent, Council Agents

---

## 8. Next Steps and Implementation Roadmap

### Phase 1: Foundation (Immediate - 4 weeks)

| Task | Owner | Dependencies |
|------|-------|--------------|
| Implement OrgOsAdapter stub in regen-toolkit | Toolkit team | None |
| Define event schema validation (JSON Schema) | org-os core | None |
| Create toolkit content sync workflow (git subtree) | Regen Coord | GitHub Actions |
| Document federation.yaml extensions for toolkit | org-os core | None |

### Phase 2: API Development (4-8 weeks)

| Task | Owner | Dependencies |
|------|-------|--------------|
| Implement REST endpoints for tool assessment queries | Toolkit team | Phase 1 |
| Build event-driven messaging (Egregore integration) | org-os + Toolkit | Egregore mapping |
| Create agent coordination protocol (hub dispatch) | Regen Coord | Agent coordinator |
| Implement privacy scope enforcement | org-os core | Data model defined |

### Phase 3: Federation Integration (8-12 weeks)

| Task | Owner | Dependencies |
|------|-------|--------------|
| Deploy content sync to ReFi BCN and ReFi DAO | Regen Coord | Phase 2 |
| Enable skill distribution with toolkit skills | Regen Coord | Skills pipeline |
| Implement decision outcome reporting | Toolkit team | API stable |
| Test multi-node consensus patterns | All nodes | 3+ nodes active |

### Phase 4: Production (12+ weeks)

| Task | Owner | Dependencies |
|------|-------|--------------|
| Scale to all 7 Regen Coordination nodes | Regen Coord | Phase 3 validated |
| Implement KOI-Net for real-time sync | Knowledge infra team | KOI-Net stable |
| Build dashboard for integration monitoring | Toolkit team | Metrics defined |
| Document operational runbooks | All teams | Production deployment |

### Critical Success Factors

1. **Egregore Integration**: Shared Neo4j graph foundation operational
2. **Agent Coordination**: Hub agent reliably dispatches and aggregates
3. **Privacy Enforcement**: Scoped queries never leak private data
4. **Backward Compatibility**: Existing org-os instances remain stable

### Open Questions to Resolve

1. **Latency**: How real-time must tool assessments be? (Eventual vs. immediate)
2. **Attribution**: How should node contributions to assessments be credited?
3. **Revenue Sharing**: Value distribution to contributing nodes?
4. **Governance**: Who decides on toolkit content standards?

---

## 9. References

### Documents Referenced

- `MASTERPROMPT.md` (org-os) - Framework development patterns
- `CONTAINER_POIESIS_260327.md` - Egregore foundation, multi-level coordination
- `regen-coordination-os/MASTERPROMPT.md` - Hub coordination patterns
- `regen-coordination-os/federation.yaml` - Network topology
- `refi-bcn-os/federation.yaml` - Local node federation config
- `TOOLKIT-OPERATING-BRIEF.md` - Toolkit scope and constraints
- `SKILLS-INDEX.md` - Available toolkit skills

### Related Standards

- EIP-4824: DAO URI Standard for organizational identity
- Container Poiesis: Living system coordination methodology
- org-os Framework: Organizational operating system specification v3.0

---

*Document created: 2026-03-28*  
*Maintained by: org-os + regen-toolkit integration working group*  
*Next review: 2026-04-28*