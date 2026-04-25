/**
 * org-os Bridge Adapter
 * 
 * Connects Paperclip to org-os instances, enabling bidirectional
 * synchronization of organizations, agents, tasks, and skills.
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import yaml from 'js-yaml';
import { glob } from 'glob';

// Types
export interface OrgOsOrganization {
  name: string;
  identifier: string;
  uri: string;
  path: string;
  upstream?: {
    type: string;
    repository: string;
    path?: string;
  }[];
  agents?: OrgOsAgent[];
  skills?: OrgOsSkill[];
}

export interface OrgOsAgent {
  id: string;
  name: string;
  runtime: 'openclaw' | 'claude-code' | 'opencode' | 'cursor' | 'custom';
  capabilities: string[];
  budget?: number;
  description?: string;
  config?: Record<string, unknown>;
}

export interface OrgOsSkill {
  id: string;
  name: string;
  description: string;
  path: string;
}

export interface OrgOsTask {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  assignedAgents?: string[];
  estimatedCost?: number;
  parentGoal?: string;
}

export interface SyncResult {
  agentsCreated: number;
  skillsImported: number;
  tasksSynced: number;
  errors: string[];
}

export class OrgOsAdapter {
  private orgPath: string;
  private federation: any;
  
  constructor(orgPath: string) {
    this.orgPath = resolve(orgPath);
    this.federation = this.loadFederation();
  }
  
  /**
   * Check if current directory is a valid org-os instance
   */
  static isOrgOs(path: string): boolean {
    const resolved = resolve(path);
    return existsSync(join(resolved, 'federation.yaml')) ||
           existsSync(join(resolved, 'AGENTS.md'));
  }
  
  /**
   * Load and parse federation.yaml
   */
  private loadFederation(): any {
    const fedPath = join(this.orgPath, 'federation.yaml');
    if (!existsSync(fedPath)) {
      throw new Error(`No federation.yaml found at ${fedPath}`);
    }
    
    const content = readFileSync(fedPath, 'utf8');
    return yaml.load(content);
  }
  
  /**
   * Extract organization from federation.yaml
   */
  loadOrganization(): OrgOsOrganization {
    const org = this.federation?.org;
    if (!org) {
      throw new Error('No org section found in federation.yaml');
    }
    
    return {
      name: org.name,
      identifier: org.identifier || org.name.toLowerCase().replace(/\s+/g, '-'),
      uri: org.uri,
      path: this.orgPath,
      upstream: this.federation?.upstream,
      agents: this.loadAgents(),
      skills: this.loadSkills(),
    };
  }
  
  /**
   * Load agents from AGENTS.md and agents/ directory
   */
  private loadAgents(): OrgOsAgent[] {
    const agents: OrgOsAgent[] = [];
    
    // Try to load from AGENTS.md
    const agentsMdPath = join(this.orgPath, 'AGENTS.md');
    if (existsSync(agentsMdPath)) {
      const agentsFromMd = this.parseAgentsMd(agentsMdPath);
      agents.push(...agentsFromMd);
    }
    
    // Load from agents/ directory
    const agentsDir = join(this.orgPath, 'agents');
    if (existsSync(agentsDir)) {
      const agentFiles = glob.sync('*.yaml', { cwd: agentsDir });
      for (const file of agentFiles) {
        const agent = this.parseAgentYaml(join(agentsDir, file));
        if (!agents.find(a => a.id === agent.id)) {
          agents.push(agent);
        }
      }
    }
    
    return agents;
  }
  
  /**
   * Parse AGENTS.md for agent definitions
   */
  private parseAgentsMd(path: string): OrgOsAgent[] {
    const content = readFileSync(path, 'utf8');
    const agents: OrgOsAgent[] = [];
    
    // Simple regex-based parsing for now
    // Format: ## agent-id
    // - **Runtime:** openclaw
    // - **Capabilities:** coordination, governance
    
    const agentBlocks = content.split(/\n##\s+/).slice(1);
    
    for (const block of agentBlocks) {
      const lines = block.split('\n');
      const id = lines[0].trim();
      
      const runtimeMatch = block.match(/\*\*Runtime:\*\*\s*(\w+)/);
      const runtime = (runtimeMatch?.[1] || 'openclaw') as OrgOsAgent['runtime'];
      
      const capsMatch = block.match(/\*\*Capabilities:\*\*\s*([^\n]+)/);
      const capabilities = capsMatch?.[1]
        ?.split(/[,;]/)
        ?.map(c => c.trim())
        ?.filter(Boolean) || [];
      
      const budgetMatch = block.match(/\*\*Budget:\*\*\s*\$?(\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1]) : undefined;
      
      agents.push({
        id,
        name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        runtime,
        capabilities,
        budget,
      });
    }
    
    return agents;
  }
  
  /**
   * Parse individual agent YAML file
   */
  private parseAgentYaml(path: string): OrgOsAgent {
    const content = readFileSync(path, 'utf8');
    const data = yaml.load(content) as any;
    
    return {
      id: data.id || data.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      name: data.name || 'Unknown Agent',
      runtime: data.runtime || 'openclaw',
      capabilities: data.capabilities || [],
      budget: data.budget,
      description: data.description,
      config: data.config,
    };
  }
  
  /**
   * Load skills from skills/ directory
   */
  private loadSkills(): OrgOsSkill[] {
    const skillsDir = join(this.orgPath, 'skills');
    if (!existsSync(skillsDir)) {
      return [];
    }
    
    const skillDirs = glob.sync('*/', { cwd: skillsDir });
    
    return skillDirs.map(dir => {
      const id = dir.replace(/\/$/, '');
      const skillPath = join(skillsDir, dir);
      
      // Try to read SKILL.md for name/description
      const skillMdPath = join(skillPath, 'SKILL.md');
      let name = id;
      let description = '';
      
      if (existsSync(skillMdPath)) {
        const content = readFileSync(skillMdPath, 'utf8');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) name = titleMatch[1];
        
        const descMatch = content.match(/^##?\s+Description\s*\n+([^#]+)/m);
        if (descMatch) description = descMatch[1].trim();
      }
      
      return { id, name, description, path: skillPath };
    });
  }
  
  /**
   * Load tasks from memory/ or data/
   */
  loadTasks(): OrgOsTask[] {
    const tasks: OrgOsTask[] = [];
    
    // Check memory/ for Egregore-style tasks
    const memoryDir = join(this.orgPath, 'memory');
    if (existsSync(memoryDir)) {
      // TODO: Implement Egregore memory parsing
    }
    
    // Check data/ for YAML tasks
    const dataDir = join(this.orgPath, 'data');
    if (existsSync(dataDir)) {
      const taskFiles = glob.sync('*.yaml', { cwd: dataDir });
      for (const file of taskFiles) {
        // TODO: Parse task files
      }
    }
    
    return tasks;
  }
  
  /**
   * Generate Paperclip company configuration
   */
  generatePaperclipConfig(): any {
    const org = this.loadOrganization();
    
    return {
      company: {
        name: org.name,
        slug: org.identifier,
        orgOsPath: this.orgPath,
      },
      agents: org.agents.map(a => ({
        id: a.id,
        name: a.name,
        runtime: a.runtime,
        capabilities: a.capabilities,
        monthlyBudget: a.budget || 200,
      })),
      skills: org.skills.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
      })),
    };
  }
  
  /**
   * Save Paperclip configuration to .paperclip/config.yaml
   */
  savePaperclipConfig(): void {
    const config = this.generatePaperclipConfig();
    const configPath = join(this.orgPath, '.paperclip');
    
    // TODO: Implement config saving
    console.log('Paperclip config generated:', config);
  }
  
  /**
   * Perform full sync to Paperclip
   */
  async syncToPaperclip(paperclipAPI: any): Promise<SyncResult> {
    const result: SyncResult = {
      agentsCreated: 0,
      skillsImported: 0,
      tasksSynced: 0,
      errors: [],
    };
    
    try {
      const org = this.loadOrganization();
      
      // Sync agents
      for (const agent of org.agents || []) {
        try {
          await paperclipAPI.createAgent({
            id: agent.id,
            name: agent.name,
            runtime: agent.runtime,
            capabilities: agent.capabilities,
            monthlyBudget: agent.budget || 200,
          });
          result.agentsCreated++;
        } catch (e) {
          result.errors.push(`Failed to create agent ${agent.id}: ${e}`);
        }
      }
      
      // Sync skills
      for (const skill of org.skills || []) {
        try {
          await paperclipAPI.importSkill({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            sourcePath: skill.path,
          });
          result.skillsImported++;
        } catch (e) {
          result.errors.push(`Failed to import skill ${skill.id}: ${e}`);
        }
      }
      
    } catch (e) {
      result.errors.push(`Sync failed: ${e}`);
    }
    
    return result;
  }
}

export default OrgOsAdapter;