/**
 * org-os TypeScript Types
 * 
 * Complete type definitions for org-os structures
 */

export interface OrgOsOrganization {
  name: string;
  identifier: string;
  uri: string;
  path: string;
  agents?: OrgOsAgent[];
  skills?: OrgOsSkill[];
  upstream?: OrgOsUpstream[];
  peers?: OrgOsPeer[];
}

export interface OrgOsAgent {
  id: string;
  name: string;
  runtime: 'openclaw' | 'claude-code' | 'opencode' | 'cursor' | 'custom';
  capabilities: string[];
  budget?: number;
  description?: string;
  config?: Record<string, unknown>;
  status?: 'idle' | 'working' | 'error';
  lastHeartbeat?: string;
}

export interface OrgOsSkill {
  id: string;
  name: string;
  description: string;
  path: string;
  version?: string;
  tags?: string[];
}

export interface OrgOsTask {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  assignedAgents?: string[];
  estimatedCost?: number;
  actualCost?: number;
  parentGoal?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  progress?: number;
}

export interface OrgOsUpstream {
  type: string;
  repository: string;
  url?: string;
  path?: string;
  relationship: 'fork' | 'mirror' | 'dependency';
  lastSync?: string;
}

export interface OrgOsPeer {
  name: string;
  repo: string;
  url?: string;
  trust: 'full' | 'read' | 'write';
  role?: 'hub' | 'peer' | 'node' | 'legacy';
}

export interface Federation {
  org: OrgOsOrganization;
  upstream?: OrgOsUpstream[];
  peers?: OrgOsPeer[];
  [key: string]: unknown;
}

export interface OrgState {
  org: OrgOsOrganization;
  agents: Map<string, OrgOsAgent>;
  skills: Map<string, OrgOsSkill>;
  lastRefresh: number;
  isLoading: boolean;
  error?: string;
}

export interface SyncState {
  lastSync: number;
  tasksPushed: number;
  tasksPulled: number;
  conflicts: number;
  status: 'idle' | 'syncing' | 'error';
}
