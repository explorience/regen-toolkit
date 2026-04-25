/**
 * Fastify Server
 * 
 * Paperclip-compatible API server with org-os bridge integration.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import websocket from '@fastify/websocket';
import { join, resolve } from 'path';
import { OrgOsAdapter } from '../bridge/orgOsAdapter.js';

const PORT = process.env.PORT || 3100;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(websocket);

  // Static files (UI build)
  await app.register(staticPlugin, {
    root: join(resolve(), 'dist/ui'),
    prefix: '/',
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', service: 'org-os-agents' };
  });

  // API Routes
  app.get('/api/org', async (request, reply) => {
    try {
      const adapter = new OrgOsAdapter(process.cwd());
      const org = adapter.loadOrganization();
      return { success: true, data: org };
    } catch (e) {
      reply.status(500);
      return { success: false, error: (e as Error).message };
    }
  });

  app.get('/api/agents', async (request, reply) => {
    try {
      const adapter = new OrgOsAdapter(process.cwd());
      const org = adapter.loadOrganization();
      return { success: true, data: org.agents };
    } catch (e) {
      reply.status(500);
      return { success: false, error: (e as Error).message };
    }
  });

  app.get('/api/skills', async (request, reply) => {
    try {
      const adapter = new OrgOsAdapter(process.cwd());
      const org = adapter.loadOrganization();
      return { success: true, data: org.skills };
    } catch (e) {
      reply.status(500);
      return { success: false, error: (e as Error).message };
    }
  });

  // WebSocket for real-time updates
  app.get('/ws/agents', { websocket: true }, (connection) => {
    connection.socket.on('message', (message) => {
      // Handle agent status updates
      const data = JSON.parse(message.toString());
      // Broadcast to all connected clients
    });

    // Send initial agent status
    connection.socket.send(JSON.stringify({
      type: 'init',
      message: 'Connected to agent stream',
    }));
  });

  // Start server
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();