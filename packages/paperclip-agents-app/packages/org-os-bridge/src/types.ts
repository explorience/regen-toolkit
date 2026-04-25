/**
 * org-os Bridge Types
 * 
 * Type definitions for the org-os bridge package.
 * These types are shared between adapter and sync modules.
 * 
 * @module org-os-bridge/types
 */

// ============================================================================
// Organization Types
// ============================================================================

/**
 * Organization loaded from org-os
 */
export interface OrgOsOrganization {
  name: string;
  identifier: string;
  uri: string;
  path: string;
  agents: OrgOsAgent[];
  skills: OrgOsSkill[];
  config?: OrgOsConfig;
}

/**
 * Configuration from federation.yaml
 */
export interface OrgOsConfig {
  runtime: string;
  workspace?: string;
  skills?: string[];
  channels?: string[];
  proactive?: boolean;
  heartbeatInterval?: string;
  network?: OrgOsNetworkConfig;
  knowledgeCommons?: OrgOsKnowledgeCommons;
  packages?: OrgOsPackages;
  governance?: OrgOsGovernance;
}

export interface OrgOsNetworkConfig {
  network?: string;
  hub?: string;
  peers?: OrgOsPeer[];
  upstream?: OrgOsUpstreamSource[];
  downstream?: OrgOsDownstreamSource[];
}

export interface OrgOsPeer {
  name: string;
  repo: string;
  url: string;
  trust: 'full' | 'read' | 'none';
}

export interface OrgOsUpstreamSource {
  type: string;
  repository: string;
  url: string;
  relationship: string;
  lastSync?: string;
  syncFrequency?: string;
  remoteName?: string;
}

export interface OrgOsDownstreamSource {
  type: string;
  repository: string;
  url: string;
  relationship: string;
}

export interface OrgOsKnowledgeCommons {
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

export interface OrgOsPackages {
  knowledgeBase?: boolean;
  meetings?: boolean;
  projects?: boolean;
  finances?: boolean;
  coordination?: boolean;
  webapps?: boolean;
  web3?: boolean;
  egregore?: boolean;
}

export interface OrgOsGovernance {
  maintainers?: OrgOsMaintainer[];
  decisionModel?: string;
  proposalThreshold?: string;
}

export interface OrgOsMaintainer {
  name: string;
  role: string;
}

// ============================================================================
// Agent Types
// ============================================================================

/**
 * Agent definition from AGENTS.md
 */
export interface OrgOsAgent {
  id: string;
  name: string;
  runtime: string;
  capabilities: string[];
  budget?: number;
  description?: string;
  skills?: string[];
  channels?: string[];
}

// ============================================================================
// Skill Types
// ============================================================================

/**
 * Skill definition from skills/ directory
 */
export interface OrgOsSkill {
  id: string;
  name: string;
  description: string;
  path: string;
  category?: string;
}

// ============================================================================
// File Change Types
// ============================================================================

/**
 * File change event
 */
export interface FileChange {
  type: 'create' | 'update' | 'delete';
  path: string;
  hash?: string;
  timestamp: Date;
}

// ============================================================================
// Discovery Types
// ============================================================================

/**
 * Discovered organization metadata
 */
export interface DiscoveredOrganization {
  path: string;
  name: string;
  type: string;
  hasFederation: boolean;
  hasAgents: boolean;
  hasSkills: boolean;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

// ============================================================================
// Re-exports
// ============================================================================

export type { OrganizationType } from '../types/index.js';
