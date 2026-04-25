/**
 * TypeScript type definitions for Paperclip Agents App
 * Core types for org-os integration and agent management
 */

// ============================================================================
// org-os Federation Types
// ============================================================================

export interface FederationManifest {
  version: string;
  spec: string;
  identity?: OrganizationIdentity;
  network?: NetworkConfig;
  agent?: AgentConfig;
  knowledgeCommons?: KnowledgeCommonsConfig;
  integrations?: IntegrationsConfig;
  packages?: PackagesConfig;
  customizations?: Customization[];
  governance?: GovernanceConfig;
  platforms?: PlatformsConfig;
  metadata?: Metadata;
}

export interface OrganizationIdentity {
  name: string;
  type: OrganizationType;
  emoji?: string;
  daoURI?: string;
  chain?: string;
  safe?: string;
  hats?: number | null;
  gardens?: string;
  onchainRegistration?: OnchainRegistration;
}

export type OrganizationType = 
  | 'DAO' 
  | 'Cooperative' 
  | 'Foundation' 
  | 'Project' 
  | 'LocalNode' 
  | 'Hub';

export interface OnchainRegistration {
  enabled: boolean;
  chain?: string;
  contractAddress?: string;
}

export interface NetworkConfig {
  network?: string;
  hub?: string;
  peers?: Peer[];
  upstream?: UpstreamSource[];
  downstream?: DownstreamSource[];
}

export interface Peer {
  name: string;
  repo: string;
  url: string;
  trust: 'full' | 'read' | 'none';
}

export interface UpstreamSource {
  type: string;
  repository: string;
  url: string;
  relationship: string;
  lastSync?: string;
  syncFrequency?: string;
  remoteName?: string;
}

export interface DownstreamSource {
  type: string;
  repository: string;
  url: string;
  relationship: string;
}

export interface AgentConfig {
  runtime: 'openclaw' | 'cursor' | 'custom' | 'none' | 'paperclip';
  workspace?: string;
  skills?: string[];
  channels?: string[];
  proactive?: boolean;
  heartbeatInterval?: string;
}

export interface KnowledgeCommonsConfig {
  enabled: boolean;
  sharedDomains?: string[];
  syncProtocol?: 'git' | 'koi-net' | 'manual';
  publish?: {
    meetings?: boolean;
    projects?: boolean;
    funding?: boolean;
  };
  subscribe?: string[];
}

export interface IntegrationsConfig {
  agentRuntimes?: IntegrationItem[];
  knowledgeInfrastructure?: IntegrationItem[];
  publishing?: IntegrationItem[];
  grants?: IntegrationItem[];
}

export interface IntegrationItem {
  name: string;
  repo: string;
  url: string;
  role: string;
}

export interface PackagesConfig {
  knowledgeBase?: boolean;
  meetings?: boolean;
  projects?: boolean;
  finances?: boolean;
  coordination?: boolean;
  webapps?: boolean;
  web3?: boolean;
  egregore?: boolean;
}

export interface Customization {
  path: string;
  reason: string;
  type: 'addition' | 'modification' | 'deletion';
  maintainOnSync?: boolean;
}

export interface GovernanceConfig {
  maintainers?: Maintainer[];
  decisionModel?: string;
  proposalThreshold?: string;
}

export interface Maintainer {
  name: string;
  role: string;
}

export interface PlatformsConfig {
  primary?: string;
  deployment?: string;
  domain?: string;
  mirrors?: string[];
}

export interface Metadata {
  created?: string;
  lastUpdated?: string;
  frameworkVersion?: string;
}

// ============================================================================
// Database Entity Types
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  emoji?: string;
  path: string;
  daoUri?: string;
  chain?: string;
  safeAddress?: string;
  metadata?: FederationManifest['metadata'];
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  model?: string;
  capabilities?: string[];
  skills?: string[];
  channels?: string[];
  config?: Record<string, unknown>;
  status: AgentStatus;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AgentStatus = 'active' | 'inactive' | 'error' | 'maintenance';

export interface Skill {
  id: string;
  organizationId: string;
  agentId?: string;
  name: string;
  description?: string;
  path: string;
  category?: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  organizationId: string;
  agentId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Cost {
  id: string;
  organizationId: string;
  agentId?: string;
  taskId?: string;
  type: CostType;
  amount: number;
  currency: string;
  model?: string;
  tokensUsed?: number;
  promptTokens?: number;
  completionTokens?: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type CostType = 
  | 'api_call'
  | 'compute'
  | 'storage'
  | 'bandwidth'
  | 'plugin'
  | 'other';

export interface SyncState {
  id: string;
  organizationId: string;
  sourcePath: string;
  lastSyncAt: Date;
  lastHash?: string;
  status: SyncStatus;
  error?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type SyncStatus = 'synced' | 'pending' | 'error' | 'conflict';

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateOrganizationDto {
  name: string;
  type: OrganizationType;
  emoji?: string;
  path: string;
  daoUri?: string;
  chain?: string;
  safeAddress?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  type?: OrganizationType;
  emoji?: string;
  daoUri?: string;
  chain?: string;
  safeAddress?: string;
}

export interface CreateAgentDto {
  name: string;
  description?: string;
  model?: string;
  capabilities?: string[];
  skills?: string[];
  channels?: string[];
  config?: Record<string, unknown>;
}

export interface UpdateAgentDto {
  name?: string;
  description?: string;
  model?: string;
  capabilities?: string[];
  skills?: string[];
  channels?: string[];
  config?: Record<string, unknown>;
  status?: AgentStatus;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  agentId?: string;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  agentId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface SyncOptions {
  force?: boolean;
  dryRun?: boolean;
  targets?: string[];
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors?: SyncError[];
  duration: number;
}

export interface SyncError {
  path: string;
  error: string;
  code: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface AppConfig {
  port: number;
  host: string;
  database: DatabaseConfig;
  logging: LoggingConfig;
  auth: AuthConfig;
  rateLimit: RateLimitConfig;
  cors: CorsConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

export interface LoggingConfig {
  level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  pretty?: boolean;
}

export interface AuthConfig {
  jwtSecret: string;
  expiresIn?: string;
}

export interface RateLimitConfig {
  enabled: boolean;
  max: number;
  timeWindow: string;
}

export interface CorsConfig {
  enabled: boolean;
  origins?: string[];
}

// ============================================================================
// Bridge Types
// ============================================================================

export interface OrgOsAdapterConfig {
  orgPath: string;
  watch?: boolean;
  syncInterval?: number;
}

export interface DiscoveredOrganization {
  path: string;
  name: string;
  type: OrganizationType;
  hasFederation: boolean;
  hasAgents: boolean;
  hasSkills: boolean;
}

export interface FileChange {
  type: 'create' | 'update' | 'delete';
  path: string;
  hash?: string;
  timestamp: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
