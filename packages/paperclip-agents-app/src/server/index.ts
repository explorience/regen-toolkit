/**
 * Fastify Server
 * Paperclip API with org-os integration
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import { join, resolve } from 'path';
import { OrgOsAdapter } from '../bridge/org-os-adapter.js';

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

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    org: org.name,
    agents: org.agents.length,
    skills: org.skills.length,
  }));

  // API Routes
  app.get('/api/org', async () => ({
    success: true,
    data: {
      name: org.name,
      identifier: org.identifier,
      uri: org.uri,
      agents: org.agents,
      skills: org.skills,
    },
  }));

  app.get('/api/agents', async () => ({
    success: true,
    data: org.agents,
  }));

  app.get('/api/skills', async () => ({
    success: true,
    data: org.skills,
  }));

  // Start server
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`\n✅ Paperclip server running at http://${HOST}:${PORT}`);
    console.log(`   Organization: ${org.name}`);
    console.log(`   Agents: ${org.agents.length}`);
    console.log(`   Skills: ${org.skills.length}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
