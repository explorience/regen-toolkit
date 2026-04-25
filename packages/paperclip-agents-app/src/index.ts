/**
 * Paperclip Agents App - Main Entry Point
 * org-os Agent-Native Workspace Management
 */

export * from './types.js';

// Re-export core components
export { OrgOsAdapter } from './bridge/org-os-adapter.js';
export { SyncService } from './bridge/syncer.js';
export { loadAgentsFromMarkdown } from './bridge/agent-loader.js';
export { indexSkills } from './bridge/skill-indexer.js';
export { MemorySyncService } from './bridge/memory-sync.js';

// Re-export configuration
export { loadConfig, validateConfig } from './config/environment.js';
export { discoverOrgInstances } from './config/org-discovery.js';
export { PostgresSetup } from './config/postgres-setup.js';
export { PluginLoader } from './config/plugin-loader.js';

// Re-export utilities
export { createLogger } from './lib/logger.js';
export * from './lib/errors.js';
export * from './lib/utils.js';

// Re-export server
export { buildServer } from './server/index.js';

/**
 * Initialize and return the application
 */
export async function createApp() {
  const { buildServer } = await import('./server/index.js');
  return buildServer();
}

// Default initialization
if (import.meta.url === `file://${process.argv[1]}`) {
  createApp().then(app => {
    app.listen().catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  });
}
