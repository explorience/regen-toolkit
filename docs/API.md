# API Reference

## Core Functions

### Toolkit Orchestrator

```typescript
class ToolkitOrchestrator {
  initialize(): Promise<void>;
  execute(task: Task): Promise<Result>;
  shutdown(): Promise<void>;
}
```

### Agent Coordinator

```typescript
class AgentCoordinator {
  registerAgent(agent: Agent): void;
  dispatch(task: Task, agentId: string): Promise<TaskResult>;
  getStatus(): AgentStatus[];
}
```

### Integration Adapters

```typescript
// GitHub Integration
interface GitHubAdapter {
  authenticate(token: string): void;
  createIssue(repo: string, data: IssueData): Promise<Issue>;
  listRepos(): Promise<Repository[]>;
}

// org-os Adapter
interface OrgOsAdapter {
  connect(endpoint: string): Promise<void>;
  submitProposal(proposal: Proposal): Promise<ProposalResult>;
  queryState(): Promise<OrgState>;
}
```

## Types

See `src/types/` for complete type definitions.
