/**
 * Agent Loader
 * Load agent definitions from AGENTS.md
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { createLogger } from '../lib/logger.js';
import { Agent } from '../types.js';

const logger = createLogger('agent-loader');

export interface AgentLoadOptions {
  orgPath: string;
  organizationId: string;
}

export async function loadAgentsFromMarkdown(
  orgPath: string,
  organizationId: string
): Promise<Agent[]> {
  const agentsPath = join(orgPath, 'AGENTS.md');
  const agents: Agent[] = [];

  try {
    const content = await readFile(agentsPath, 'utf-8');
    const sections = splitByHeaders(content);

    for (const section of sections) {
      const lines = section.split('\n');
      const nameLine = lines.find(l => l.startsWith('## '));

      if (nameLine) {
        const name = nameLine.replace('## ', '').trim();
        
        agents.push({
          id: generateId(organizationId, name),
          organizationId,
          name,
          description: extractFirstParagraph(section),
          capabilities: extractCapabilities(section),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    logger.info({ count: agents.length, path: agentsPath }, 'Agents loaded from AGENTS.md');
    return agents;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.warn({ path: agentsPath }, 'AGENTS.md not found');
      return [];
    }
    throw error;
  }
}

function splitByHeaders(content: string): string[] {
  const sections: string[] = [];
  let currentSection = '';

  for (const line of content.split('\n')) {
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      if (currentSection) {
        sections.push(currentSection.trim());
      }
      currentSection = line + '\n';
    } else {
      currentSection += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection.trim());
  }

  return sections;
}

function extractFirstParagraph(content: string): string {
  const lines = content.split('\n');
  let currentParagraph = '';

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentParagraph) break;
    } else if (!line.startsWith('#')) {
      currentParagraph += ' ' + line.trim();
    }
  }

  return currentParagraph.trim();
}

function extractCapabilities(content: string): string[] {
  const capabilities: string[] = [];
  const patterns = [
    { regex: /[-*]\s+(.+?):/g, extract: (m: RegExpExecArray) => m[1].trim() },
    { regex: /`(.+?)`/g, extract: (m: RegExpExecArray) => m[1].trim() }
  ];

  for (const { regex, extract } of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const capability = extract(match);
      if (capability && !capabilities.includes(capability)) {
        capabilities.push(capability);
      }
    }
  }

  return capabilities;
}

function generateId(orgId: string, name: string): string {
  const str = `${orgId}:${name}`;
  const hash = str.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString(36);
}

export default loadAgentsFromMarkdown;
