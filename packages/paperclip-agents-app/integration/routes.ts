/**
 * org-os Integration Routes
 * 
 * Express/Fastify routes for org-os API endpoints:
 * - /api/v1/orgs/* - Organization management
 * - /api/v1/sync/* - Synchronization operations
 * 
 * @module integration/routes
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { OrgOsService } from './services.js';
import { validateOrgPath, sanitizeInput, createRateLimiter } from './middleware.js';
import type { OrgOsServiceConfig, SyncEventRecord } from './services.js';

// ============================================================================
// Route Configuration
// ============================================================================

export interface OrgOsRoutesConfig {
  prefix: string;
  service: OrgOsService;
  requireAuth: boolean;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

const DEFAULT_CONFIG: OrgOsRoutesConfig = {
  prefix: '/api/v1',
  requireAuth: false,
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  },
};

// ============================================================================
// Request/Response Types
// ============================================================================

export interface DiscoverRequest {
  query?: {
    path?: string;
    limit?: string;
  };
}

export interface ImportRequest {
  body: {
    path: string;
    autoSync?: boolean;
  };
}

export interface SyncStatusRequest {
  params: {
    id: string;
  };
  query?: {
    path: string;
  };
}

export interface PullSyncRequest {
  body: {
    path: string;
    targets?: string[];
  };
}

export interface PushSyncRequest {
  body: {
    path: string;
    items?: string[];
  };
}

export interface SyncHistoryRequest {
  params: {
    id: string;
  };
  query?: {
    path: string;
    limit?: string;
  };
}

export interface OrgOsResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface SyncStatusResponse {
  organization: {
    id: string;
    name: string;
    path: string;
  };
  lastSync?: string;
  pendingChanges: boolean;
  syncEnabled: boolean;
}

export interface SyncHistoryResponse {
  organization: {
    id: string;
    name: string;
  };
  events: SyncEventRecord[];
  total: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// ============================================================================
// Rate Limiter
// ============================================================================

const rateLimiter = createRateLimiter({
  windowMs: DEFAULT_CONFIG.rateLimit.windowMs,
  maxRequests: DEFAULT_CONFIG.rateLimit.maxRequests,
});

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * Create org-os routes for Fastify.
 * 
 * @param service - OrgOsService instance
 * @param config - Route configuration
 * @returns Route registration function
 */
export function createOrgOsRoutes(service: OrgOsService, config: Partial<OrgOsRoutesConfig> = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const rateLimit = createRateLimiter(cfg.rateLimit);

  return async (app: { get: (path: string, handler: (req: FastifyRequest, reply: FastifyReply) => Promise<void>) => void; post: (path: string, handler: (req: FastifyRequest, reply: FastifyReply) => Promise<void>) => void }) => {
    
    // -------------------------------------------------------------------------
    // GET /api/v1/orgs - List discovered organizations
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/orgs`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // Rate limit check
        const rateCheck = rateLimit(req);
        if (!rateCheck.allowed) {
          return reply.status(429).send({
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
              details: { resetAt: rateCheck.resetAt },
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        const query = req.query as Record<string, string>;
        const basePath = query.path || service.getConfig().basePath;
        
        // Override service base path for this request
        service.setConfig({ basePath });
        
        const discovered = await service.discoverOrganizations();
        
        return reply.send({
          success: true,
          data: {
            organizations: discovered,
            total: discovered.length,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'DISCOVERY_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // GET /api/v1/orgs/:id - Get organization details
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/orgs/:id`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const params = req.params as Record<string, string>;
        const orgId = decodeURIComponent(params.id);
        
        // Find organization by ID (path acts as ID in this implementation)
        const org = await service.getOrganization(orgId);
        
        if (!org) {
          return reply.status(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: `Organization not found: ${orgId}`,
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        return reply.send({
          success: true,
          data: {
            id: org.identifier,
            name: org.name,
            uri: org.uri,
            path: org.path,
            agents: org.agents,
            skills: org.skills,
            config: org.config,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'GET_ORG_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // POST /api/v1/orgs/import - Import organization
    // -------------------------------------------------------------------------
    app.post(`${cfg.prefix}/orgs/import`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // Rate limit check
        const rateCheck = rateLimit(req);
        if (!rateCheck.allowed) {
          return reply.status(429).send({
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
              details: { resetAt: rateCheck.resetAt },
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        const body = sanitizeInput(req.body) as Record<string, unknown>;
        const { path, autoSync } = body;

        if (!path || typeof path !== 'string') {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Path is required',
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Validate path
        const validation = validateOrgPath(path, { requireFederation: true });
        if (!validation.valid) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_PATH',
              message: validation.error,
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Import organization
        const result = await service.importOrganization(path, autoSync === true);
        
        if (!result.success) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'IMPORT_ERROR',
              message: result.error,
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        return reply.send({
          success: true,
          data: {
            organization: {
              id: result.organization?.identifier,
              name: result.organization?.name,
              path: result.organization?.path,
              agents: result.organization?.agents.length,
              skills: result.organization?.skills.length,
            },
            companyId: result.companyId,
            synced: result.synced,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'IMPORT_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // GET /api/v1/orgs/:id/sync-status - Get sync status
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/orgs/:id/sync-status`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const params = req.params as Record<string, string>;
        const orgId = decodeURIComponent(params.id);
        
        const status = await service.getSyncStatus(orgId);
        const org = await service.getOrganization(orgId);
        
        return reply.send({
          success: true,
          data: {
            organization: {
              id: org?.identifier || orgId,
              name: org?.name || 'Unknown',
              path: orgId,
            },
            lastSync: status.lastSync?.toISOString(),
            pendingChanges: status.pendingChanges,
            syncEnabled: status.syncEnabled,
          } as SyncStatusResponse,
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'SYNC_STATUS_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // POST /api/v1/sync/pull - Pull from org-os
    // -------------------------------------------------------------------------
    app.post(`${cfg.prefix}/sync/pull`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // Rate limit check
        const rateCheck = rateLimit(req);
        if (!rateCheck.allowed) {
          return reply.status(429).send({
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
              details: { resetAt: rateCheck.resetAt },
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        const body = sanitizeInput(req.body) as Record<string, unknown>;
        const { path, targets } = body;

        if (!path || typeof path !== 'string') {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Path is required',
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Validate path
        const validation = validateOrgPath(path, { requireFederation: true });
        if (!validation.valid) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_PATH',
              message: validation.error,
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Perform pull sync
        const result = await service.pullSync(path);
        
        return reply.send({
          success: result.success,
          data: {
            pulled: result.pulled,
            errors: result.errors,
            duration: result.duration,
            timestamp: result.timestamp.toISOString(),
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'PULL_SYNC_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // POST /api/v1/sync/push - Push to org-os
    // -------------------------------------------------------------------------
    app.post(`${cfg.prefix}/sync/push`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // Rate limit check
        const rateCheck = rateLimit(req);
        if (!rateCheck.allowed) {
          return reply.status(429).send({
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
              details: { resetAt: rateCheck.resetAt },
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        const body = sanitizeInput(req.body) as Record<string, unknown>;
        const { path, items } = body;

        if (!path || typeof path !== 'string') {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Path is required',
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Validate path
        const validation = validateOrgPath(path, { requireFederation: true });
        if (!validation.valid) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_PATH',
              message: validation.error,
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        // Perform push sync
        const result = await service.pushSync(path, items);
        
        return reply.send({
          success: result.success,
          data: {
            pushed: result.pushed,
            errors: result.errors,
            duration: result.duration,
            timestamp: result.timestamp.toISOString(),
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'PUSH_SYNC_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // GET /api/v1/sync/history - Get sync history
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/sync/history`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = req.query as Record<string, string>;
        const { path, limit } = query;

        if (!path) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Path query parameter is required',
            },
            timestamp: new Date().toISOString(),
          } as OrgOsResponse);
        }

        const history = service.getSyncHistory(path, limit ? parseInt(limit, 10) : 50);
        const org = await service.getOrganization(path);

        return reply.send({
          success: true,
          data: {
            organization: {
              id: org?.identifier || path,
              name: org?.name || 'Unknown',
            },
            events: history,
            total: history.length,
          } as SyncHistoryResponse,
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'HISTORY_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // GET /api/v1/agents - Get all agents
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/agents`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = req.query as Record<string, string>;
        const { capability } = query;

        let agents;
        if (capability) {
          agents = service.findAgentsByCapability(capability);
        } else {
          agents = service.getAllAgents().map(agent => ({
            ...agent,
            organization: service.getLoadedOrganizations().find(org => 
              org.agents.some(a => a.id === agent.id)
            )?.name,
          }));
        }

        return reply.send({
          success: true,
          data: {
            agents,
            total: agents.length,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'GET_AGENTS_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });

    // -------------------------------------------------------------------------
    // GET /api/v1/skills - Get all skills
    // -------------------------------------------------------------------------
    app.get(`${cfg.prefix}/skills`, async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const skills = service.getAllSkills();

        return reply.send({
          success: true,
          data: {
            skills,
            total: skills.length,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      } catch (e) {
        return reply.status(500).send({
          success: false,
          error: {
            code: 'GET_SKILLS_ERROR',
            message: (e as Error).message,
          },
          timestamp: new Date().toISOString(),
        } as OrgOsResponse);
      }
    });
  };
}

export default createOrgOsRoutes;
