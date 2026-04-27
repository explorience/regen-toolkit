// Core types for Regen Toolkit

export interface Task {
  id: string;
  type: string;
  payload: unknown;
}

export interface Result {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
}

export interface AgentStatus {
  agentId: string;
  status: 'idle' | 'busy' | 'error';
  lastSeen: Date;
}

export interface IssueData {
  title: string;
  body?: string;
  labels?: string[];
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
}

export interface Proposal {
  id: string;
  type: string;
  data: unknown;
}

export interface ProposalResult {
  proposalId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface OrgState {
  timestamp: Date;
  proposals: Proposal[];
}
