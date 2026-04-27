// Agent Coordinator

import type { Agent, Task, Result, AgentStatus } from '@/types';

export class AgentCoordinator {
  private agents: Map<string, Agent> = new Map();
  private statuses: Map<string, AgentStatus> = new Map();

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.statuses.set(agent.id, {
      agentId: agent.id,
      status: 'idle',
      lastSeen: new Date(),
    });
  }

  async dispatch(task: Task, agentId: string): Promise<Result> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    this.updateStatus(agentId, 'busy');

    try {
      // Stub execution
      const result = await this.executeTask(task, agent);
      this.updateStatus(agentId, 'idle');
      return { success: true, data: result };
    } catch (error) {
      this.updateStatus(agentId, 'error');
      return { success: false, error: String(error) };
    }
  }

  getStatus(): AgentStatus[] {
    return Array.from(this.statuses.values());
  }

  private updateStatus(agentId: string, status: 'idle' | 'busy' | 'error'): void {
    this.statuses.set(agentId, {
      agentId,
      status,
      lastSeen: new Date(),
    });
  }

  private async executeTask(task: Task, agent: Agent): Promise<unknown> {
    // Stub task execution
    return { taskId: task.id, executedBy: agent.id };
  }
}
