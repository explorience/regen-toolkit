/**
 * Core types for the Regen Agents system
 * Defines interfaces shared across all specialist agents
 */

// ============================================================================
// Base Agent Types
// ============================================================================

export interface AgentConfig {
  name: string;
  description: string;
  model: string;
  maxTurns: number;
  skills: string[];
  tools: string[];
}

export interface AgentContext {
  organizationId: string;
  bioregionId?: string;
  projectId?: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface AgentInput {
  type: string;
  content: unknown;
  context: AgentContext;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
}

export interface AgentOutput {
  type: string;
  content: unknown;
  confidence: number;
  citations: Citation[];
  nextActions?: NextAction[];
  metadata: Record<string, unknown>;
}

export interface Citation {
  source: string;
  url?: string;
  title?: string;
  date?: string;
  page?: number;
}

export interface NextAction {
  action: string;
  agent?: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// Knowledge Integration Types
// ============================================================================

export interface KnowledgeEntry {
  id: string;
  agentId: string;
  category: string;
  tags: string[];
  content: string;
  confidence: number;
  citations: Citation[];
  createdAt: Date;
  relatedEntries?: string[];
}

export interface KnowledgeQuery {
  category?: string;
  tags?: string[];
  agentId?: string;
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
}

// ============================================================================
// Meeting Integration Types
// ============================================================================

export interface MeetingRecording {
  meetingId: string;
  title: string;
  date: Date;
  attendees: string[];
  transcript?: string;
  summary?: string;
  actionItems: ActionItem[];
  decisions: Decision[];
  agentFindings: AgentFinding[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignee?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  sourceAgent?: string;
}

export interface Decision {
  id: string;
  description: string;
  rationale?: string;
  madeBy: string;
  timestamp: Date;
  relatedProposals?: string[];
}

export interface AgentFinding {
  agentId: string;
  findingType: string;
  content: string;
  confidence: number;
  relatedTopics: string[];
}

// ============================================================================
// Funding Integration Types
// ============================================================================

export interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  amount: {
    min?: number;
    max?: number;
    currency: string;
  };
  deadline?: Date;
  eligibility: string[];
  categories: string[];
  requiredDocuments: string[];
  applicationUrl?: string;
  matchScore?: number;
}

export interface FundingTrigger {
  opportunity: FundingOpportunity;
  triggeredAgents: string[];
  requiredDeliverables: string[];
  timeline: {
    research: number; // days
    drafting: number;
    review: number;
  };
}

// ============================================================================
// Agriculture Researcher Types
// ============================================================================

export interface AgricultureResearchInput {
  topic: string;
  region?: string;
  climateZone?: string;
  soilType?: string;
  scale?: 'smallholder' | 'mid-scale' | 'large-scale' | 'landscape';
  practices?: string[];
  outputs?: ('research-summary' | 'practice-guide' | 'policy-recommendation' | 'case-study')[];
}

export interface AgricultureResearchOutput {
  researchSummary: string;
  practiceGuides: PracticeGuide[];
  caseStudies: CaseStudy[];
  policyRecommendations?: string[];
  keyFindings: KeyFinding[];
  gaps: string[];
}

export interface PracticeGuide {
  title: string;
  practice: string;
  applicability: string[];
  implementation: string[];
  expectedOutcomes: string[];
  risks: string[];
  resources: string[];
}

export interface CaseStudy {
  title: string;
  location: string;
  context: string;
  practices: string[];
  outcomes: {
    metric: string;
    value: string;
    timeframe: string;
  }[];
  lessons: string[];
  source: string;
}

// ============================================================================
// Commons Governance Types
// ============================================================================

export interface GovernanceAnalysisInput {
  proposalType: 'dao-charter' | 'cooperative-bylaws' | 'legal-wrapper' | 'dispute-resolution' | 'voting-mechanism' | 'treasury-management';
  content: string;
  context?: string;
  stakeholders?: string[];
  jurisdiction?: string;
}

export interface GovernanceAnalysisOutput {
  analysis: string;
  recommendations: GovernanceRecommendation[];
  ostromAssessment: OstromPrincipleAssessment[];
  riskAssessment: RiskAssessment[];
  implementationSteps?: string[];
  legalConsiderations?: string[];
}

export interface GovernanceRecommendation {
  category: string;
  recommendation: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  implementation: string;
}

export interface OstromPrincipleAssessment {
  principle: string;
  description: string;
  compliance: 'full' | 'partial' | 'none';
  gaps: string[];
  recommendations: string[];
}

export interface RiskAssessment {
  risk: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

// ============================================================================
// Impact Measurement Types
// ============================================================================

export interface ImpactAnalysisInput {
  projectData: ProjectData;
  framework?: 'iris-plus' | 'giin' | 'custom';
  metrics?: string[];
  timeRange?: { start: Date; end: Date };
  verificationLevel?: 'self-reported' | 'third-party' | 'audited';
}

export interface ProjectData {
  projectId: string;
  name: string;
  description: string;
  activities: string[];
  beneficiaries: number;
  geographicScope: string;
  startDate: Date;
  metrics: Record<string, number | string>;
}

export interface ImpactAnalysisOutput {
  impactReport: ImpactReport;
  dashboardData: DashboardData;
  verificationSummary: VerificationSummary;
  recommendations: string[];
}

export interface ImpactReport {
  summary: string;
  outcomes: Outcome[];
  sdgAlignment: SDGAlignment[];
  stakeholderFeedback?: string;
}

export interface Outcome {
  metric: string;
  value: number | string;
  baseline?: number | string;
  target?: number | string;
  unit: string;
  confidence: number;
  methodology: string;
}

export interface SDGAlignment {
  goal: number;
  targets: string[];
  contribution: 'direct' | 'indirect';
  evidence: string;
}

export interface DashboardData {
  kpis: KPIData[];
  timeSeries: TimeSeriesData[];
  comparisons: ComparisonData[];
}

export interface KPIData {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface TimeSeriesData {
  metric: string;
  dataPoints: { date: Date; value: number }[];
}

export interface ComparisonData {
  metric: string;
  projectValue: number;
  benchmarkValue: number;
  benchmarkSource: string;
}

export interface VerificationSummary {
  level: 'self-reported' | 'third-party' | 'audited';
  methods: string[];
  gaps: string[];
  recommendations: string[];
}

// ============================================================================
// Bioregional Intelligence Types
// ============================================================================

export interface BioregionalAnalysisInput {
  bioregionId: string;
  bioregionName: string;
  boundaries: GeoBoundary[];
  analysisTypes: ('territory-mapping' | 'resource-flows' | 'stakeholder-networks' | 'local-knowledge')[];
  dataSources?: DataSource[];
  stakeholderCategories?: string[];
}

export interface GeoBoundary {
  type: 'polygon' | 'point' | 'line';
  coordinates: number[] | number[][] | number[][][];
  properties?: Record<string, unknown>;
}

export interface DataSource {
  type: 'gis' | 'sensor' | 'interview' | 'historical' | 'satellite';
  source: string;
  dateRange?: { start: Date; end: Date };
  reliability: 'high' | 'medium' | 'low';
}

export interface BioregionalAnalysisOutput {
  bioregionalMap: BioregionalMap;
  resourceFlows: ResourceFlow[];
  stakeholderAnalysis: StakeholderAnalysis;
  localKnowledge: LocalKnowledge[];
  strategicInsights: StrategicInsight[];
}

export interface BioregionalMap {
  layers: MapLayer[];
  boundaries: GeoBoundary;
  keyFeatures: Feature[];
  scale: string;
  legend: MapLegend;
}

export interface MapLayer {
  name: string;
  type: 'ecosystem' | 'hydrology' | 'soil' | 'land-use' | 'infrastructure' | 'protected';
  data: unknown;
  source: string;
}

export interface Feature {
  name: string;
  type: string;
  coordinates: GeoBoundary;
  description: string;
  significance: string;
}

export interface MapLegend {
  items: { symbol: string; label: string; color: string }[];
}

export interface ResourceFlow {
  resource: string;
  type: 'water' | 'carbon' | 'nutrients' | 'energy' | 'biomass' | 'species';
  source: string;
  sink: string;
  quantity: {
    value: number;
    unit: string;
    uncertainty: number;
  };
  seasonality?: string;
  trends: string;
  interventions: string[];
}

export interface StakeholderAnalysis {
  stakeholders: Stakeholder[];
  networkMap: NetworkMap;
  powerDynamics: PowerDynamic[];
  collaborationOpportunities: CollaborationOpportunity[];
}

export interface Stakeholder {
  id: string;
  name: string;
  type: 'community' | 'farmer' | 'ngo' | 'government' | 'researcher' | 'business' | 'indigenous';
  interests: string[];
  influence: 'high' | 'medium' | 'low';
  engagement: 'active' | 'interested' | 'potential' | 'resistant';
  contact?: string;
  relationships: string[];
}

export interface NetworkMap {
  nodes: { id: string; label: string; type: string; size: number }[];
  edges: { source: string; target: string; type: string; strength: number }[];
}

export interface PowerDynamic {
  description: string;
  actors: string[];
  impact: string;
  recommendations: string[];
}

export interface CollaborationOpportunity {
  parties: string[];
  opportunity: string;
  potential: 'high' | 'medium' | 'low';
  barriers: string[];
  nextSteps: string[];
}

export interface LocalKnowledge {
  topic: string;
  source: string;
  content: string;
  reliability: 'high' | 'medium' | 'low';
  dateCollected: Date;
  verificationStatus: 'verified' | 'unverified' | 'disputed';
}

export interface StrategicInsight {
  insight: string;
  category: 'opportunity' | 'risk' | 'gap' | 'strength';
  evidence: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// Super Agent Types
// ============================================================================

export interface CoordinationRequest {
  request: string;
  agents: string[];
  deliverables: string[];
  context?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
}

export interface CoordinationResult {
  coordinationId: string;
  agentResults: Record<string, AgentOutput>;
  synthesis: string;
  conflicts?: Conflict[];
  integratedDeliverables: Record<string, unknown>;
  nextSteps: NextAction[];
}

export interface Conflict {
  agents: string[];
  issue: string;
  perspectives: Record<string, string>;
  resolution?: string;
}

// ============================================================================
// Key Finding Types (Shared)
// ============================================================================

export interface KeyFinding {
  finding: string;
  category: string;
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
  implications: string[];
}

// ============================================================================
// Agent Registry
// ============================================================================

export const AGENT_IDS = {
  AGRICULTURE_RESEARCHER: 'agriculture-researcher',
  COMMONS_GOVERNANCE: 'commons-governance',
  IMPACT_MEASUREMENT: 'impact-measurement',
  BIOREGIONAL_INTELLIGENCE: 'bioregional-intelligence',
} as const;

export type AgentId = typeof AGENT_IDS[keyof typeof AGENT_IDS];
