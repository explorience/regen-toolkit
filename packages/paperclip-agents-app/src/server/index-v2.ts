/**
 * Fastify Server (Enhanced)
 * Paperclip API with org-os integration, real-time sync, and WebSocket
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import { join, resolve } from 'path';
import { OrgOsAdapter } from '../bridge/org-os-adapter.js';
import { registerOrgRoutes } from './routes/org.js';
import { registerAgentsRoutes } from './routes/agents.js';
import { registerSkillsRoutes } from './routes/skills.js';
import { registerTasksRoutes } from './routes/tasks.js';
import { registerMemoryRoutes } from './routes/memory.js';
import { registerFederationRoutes } from './routes/federation.js';
import { registerCostsRoutes } from './routes/costs.js';
import { registerWebSocket } from './ws.js';
import { SyncOrchestrator } from './sync-orchestrator.js';

const PORT = process.env.PORT || 3100;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Load organization
  let org;
  try {
    org = OrgOsAdapter.loadOrganization(process.cwd());
    console.log(`📍 Loaded organization: ${org.name}`);
    console.log(`   Agents: ${org.agents.length}`);
    console.log(`   Skills: ${org.skills.length}`);
  } catch (e) {
    console.error('Failed to load organization:', (e as Error).message);
    process.exit(1);
  }

  // Initialize sync orchestrator
  const syncOrchestrator = new SyncOrchestrator(org, {
    autoSync: process.env.AUTO_SYNC !== 'false',
    enableFileWatcher: process.env.FILE_WATCHER !== 'false',
    broadcastUpdates: true,
  });

  // Handle sync events
  syncOrchestrator.onSync((event) => {
    console.log(`[SYNC] ${event.type}: ${event.category} (${event.changes} changes)`);
  });

  // Register WebSocket
  const ws = await registerWebSocket(app);

  // Handle broadcasts from sync orchestrator
  syncOrchestrator.onBroadcastNeeded((data) => {
    const recipients = ws.broadcast({
      type: 'sync_event',
      data,
      timestamp: new Date(),
    });
    console.log(`[WS] Broadcast to ${recipients} clients`);
  });

  // Start sync orchestrator
  syncOrchestrator.start();

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    org: org.name,
    agents: org.agents.length,
    skills: org.skills.length,
    timestamp: new Date(),
    sync: {
      syncing: syncOrchestrator.isSyncInProgress(),
      connectedClients: ws.getConnectedClients(),
    },
  }));

  // Sync status endpoint
  app.get('/api/sync/status', async () => ({
    success: true,
    data: {
      syncing: syncOrchestrator.isSyncInProgress(),
      history: syncOrchestrator.getSyncHistory(20),
    },
  }));

  // Sync trigger endpoint
  app.post<{ Body: { direction?: 'pull' | 'push' } }>('/api/sync', async (request, reply) => {
    try {
      const direction = request.body?.direction || 'pull';
      const result = await syncOrchestrator.syncFromApi(direction);
      return reply.send({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return reply.status(500).send({
        success: false,
        error: message,
        code: 'SYNC_FAILED',
      });
    }
  });

  // Register all route modules
  await registerOrgRoutes(app);
  await registerAgentsRoutes(app);
  await registerSkillsRoutes(app);
  await registerTasksRoutes(app);
  await registerMemoryRoutes(app);
  await registerFederationRoutes(app);
  await registerCostsRoutes(app);

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log('\nGracefully shutting down...');
    syncOrchestrator.stop();
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);

  // Start server
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`\n✅ Paperclip server running at http://${HOST}:${PORT}`);
    console.log(`   Organization: ${org.name}`);
    console.log(`   Agents: ${org.agents.length}`);
    console.log(`   Skills: ${org.skills.length}`);
    console.log(`   API: http://${HOST}:${PORT}/api/*`);
    console.log(`   WebSocket: ws://${HOST}:${PORT}/ws`);
    console.log(`   Auto-sync: ${syncOrchestrator.isSyncInProgress() ? 'enabled' : 'disabled'}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
