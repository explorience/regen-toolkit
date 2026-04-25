/**
 * org-os Discovery Configuration
 * Auto-discover org-os instances
 */

import { existsSync, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import { DiscoveredOrganization, FederationManifest } from '../types.js';
import { createLogger } from '../lib/logger.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';

const logger = createLogger('org-discovery');

export interface DiscoveryOptions {
  basePath: string;
  recursive?: boolean;
  includeNested?: boolean;
}

export async function discoverOrgInstances(options: DiscoveryOptions): Promise<DiscoveredOrganization[]> {
  const { basePath, recursive = false, includeNested = false } = options;
  const organizations: DiscoveredOrganization[] = [];

  logger.info({ basePath, recursive }, 'Starting org-os discovery');

  try {
    await scanDirectory(basePath, organizations, recursive, includeNested);
  } catch (error) {
    throw new PaperclipError(
      ErrorCode.DISCOVERY_FAILED,
      `Failed to discover organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { basePath, originalError: error }
    );
  }

  logger.info({ count: organizations.length }, 'Discovery complete');
  return organizations;
}

async function scanDirectory(
  dirPath: string,
  organizations: DiscoveredOrganization[],
  recursive: boolean,
  includeNested: boolean
): Promise<void> {
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = join(dirPath, entry.name);
    const federationPath = join(fullPath, 'federation.yaml');

    // Check if this is an org-os instance
    if (existsSync(federationPath)) {
      try {
        const federation = await loadFederation(federationPath);
        
        organizations.push({
          path: fullPath,
          name: federation.identity?.name || entry.name,
          type: federation.identity?.type || 'Project',
          hasFederation: true,
          hasAgents: existsSync(join(fullPath, 'AGENTS.md')),
          hasSkills: existsSync(join(fullPath, 'skills'))
        });
      } catch (error) {
        logger.warn({ path: fullPath, error }, 'Failed to load federation.yaml');
      }
    } else if (recursive && includeNested) {
      // Recursively scan subdirectories
      await scanDirectory(fullPath, organizations, recursive, includeNested);
    }
  }
}

async function loadFederation(path: string): Promise<FederationManifest> {
  const content = await readFile(path, 'utf-8');
  return YAML.parse(content);
}

export async function isValidOrgPath(path: string): Promise<boolean> {
  const federationPath = join(path, 'federation.yaml');
  
  if (!existsSync(federationPath)) {
    return false;
  }

  try {
    const federation = await loadFederation(federationPath);
    return !!federation.identity?.name;
  } catch {
    return false;
  }
}
