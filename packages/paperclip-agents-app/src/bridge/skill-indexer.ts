/**
 * Skill Indexer
 * Index skills from skills/ directory
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createLogger } from '../lib/logger.js';
import { Skill } from '../types.js';

const logger = createLogger('skill-indexer');

export interface SkillIndexOptions {
  orgPath: string;
  organizationId: string;
}

export async function indexSkills(
  orgPath: string,
  organizationId: string
): Promise<Skill[]> {
  const skillsPath = join(orgPath, 'skills');
  const skills: Skill[] = [];

  if (!existsSync(skillsPath)) {
    logger.warn({ path: skillsPath }, 'skills/ directory not found');
    return skills;
  }

  try {
    const entries = await readdir(skillsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = join(skillsPath, entry.name);
      const skillFile = join(skillDir, 'SKILL.md');

      if (existsSync(skillFile)) {
        try {
          const skill = await loadSkillMetadata(skillDir, entry.name, organizationId);
          skills.push(skill);
        } catch (error) {
          logger.warn({ skillName: entry.name, error }, 'Failed to load skill metadata');
        }
      }
    }

    logger.info({ count: skills.length, path: skillsPath }, 'Skills indexed');
    return skills;
  } catch (error) {
    logger.error({ path: skillsPath, error }, 'Failed to index skills');
    return [];
  }
}

async function loadSkillMetadata(
  skillPath: string,
  skillName: string,
  organizationId: string
): Promise<Skill> {
  const skillFile = join(skillPath, 'SKILL.md');
  const content = await readFile(skillFile, 'utf-8');

  // Parse skill metadata from SKILL.md
  const description = extractDescription(content);
  const capabilities = extractCapabilities(content);
  const category = inferCategory(skillName, content);

  const stats = await stat(skillPath);

  return {
    id: generateId(organizationId, skillName),
    organizationId,
    name: skillName,
    description,
    path: skillPath,
    category,
    capabilities,
    createdAt: stats.birthtime,
    updatedAt: stats.mtime
  };
}

function extractDescription(content: string): string {
  const lines = content.split('\n');
  
  // Look for first paragraph after title
  let foundTitle = false;
  let description = '';

  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }

    if (foundTitle && line.trim() === '') {
      continue;
    }

    if (foundTitle && !line.startsWith('#')) {
      description += ' ' + line.trim();
    }

    if (description && line.trim() === '') {
      break;
    }
  }

  return description.trim();
}

function extractCapabilities(content: string): string[] {
  const capabilities: string[] = [];

  // Look for capability lists, tables, etc.
  const patterns = [
    /[-*]\s+\*\*([^*]+)\*\*/g,  // **bold** items
    /[-*]\s+(\w+(?:\s+\w+)*)/g,  // list items
    /Capability:\s*(.+)/gi,       // Capability: field
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const capability = match[1].trim();
      if (capability && !capabilities.includes(capability)) {
        capabilities.push(capability);
      }
    }
  }

  return capabilities;
}

function inferCategory(skillName: string, content: string): string {
  const name = skillName.toLowerCase();
  const contentLower = content.toLowerCase();

  if (name.includes('meeting') || name.includes('notes') || name.includes('transcription')) {
    return 'coordination';
  }
  if (name.includes('funding') || name.includes('grant') || name.includes('capital')) {
    return 'finance';
  }
  if (name.includes('knowledge') || name.includes('curator') || name.includes('research')) {
    return 'knowledge';
  }
  if (name.includes('schema') || name.includes('generator') || name.includes('validator')) {
    return 'technical';
  }
  if (name.includes('heartbeat') || name.includes('monitor') || name.includes('health')) {
    return 'operations';
  }
  if (name.includes('web') || name.includes('http') || name.includes('api')) {
    return 'integration';
  }

  return 'general';
}

function generateId(orgId: string, name: string): string {
  const str = `${orgId}:skill:${name}`;
  const hash = str.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString(36);
}

export default indexSkills;
