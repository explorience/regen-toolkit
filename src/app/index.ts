// App orchestration entry point

import { ToolkitOrchestrator } from '@/services/toolkitOrchestrator';
import { AgentCoordinator } from '@/services/agentCoordinator';
import type { Task, Result } from '@/types';

export class App {
  private orchestrator: ToolkitOrchestrator;
  private coordinator: AgentCoordinator;

  constructor() {
    this.orchestrator = new ToolkitOrchestrator();
    this.coordinator = new AgentCoordinator();
  }

  async run(task: Task): Promise<Result> {
    await this.orchestrator.initialize();
    const result = await this.orchestrator.execute(task);
    await this.orchestrator.shutdown();
    return result;
  }

  getCoordinator(): AgentCoordinator {
    return this.coordinator;
  }
}

// Default export for CLI
export default App;
