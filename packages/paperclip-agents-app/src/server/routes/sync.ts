/**
 * Sync API Routes
 */

import { FastifyInstance } from 'fastify';
import pg from 'pg';
import { createLogger } from '../../lib/logger.js';
import { NotFoundError } from '../../lib/errors.js';
import { OrgOsAdapter } from '../../bridge/org-os-adapter.js';
import { SyncService } from '../../bridge/syncer.js';

const { Pool } = pg;
const logger = createLogger('routes:sync');

interface OrgParams {
  id: string;
}

interface SyncBody {
  force?: boolean;
  dryRun?: boolean;
  targets?: string[];
}

export async function syncRoutes(app: FastifyInstance): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  // Get sync status
  app.get<{ Params: OrgParams }>('/:id/sync/status', async (request, reply) => {
    const { id: orgId } = request.params;

    // Validate org exists
    const org = await pool.query('SELECT * FROM organizations WHERE id = $1', [orgId]);
    if (org.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    // Get sync state
    const syncState = await pool.query(`
      SELECT * FROM sync_state 
      WHERE organization_id = $1 
      ORDER BY last_sync_at DESC
      LIMIT 10
    `, [orgId]);

    // Get sync history
    const syncHistory = await pool.query(`
      SELECT * FROM sync_history 
      WHERE organization_id = $1 
      ORDER BY started_at DESC
      LIMIT 10
    `, [orgId]);

    return {
      success: true,
      data: {
        organization: {
          id: org.rows[0].id,
          name: org.rows[0].name,
          path: org.rows[0].path
        },
        syncState: syncState.rows,
        recentSyncs: syncHistory.rows.map(s => ({
          id: s.id,
          sourcePath: s.source_path,
          syncType: s.sync_type,
          direction: s.direction,
          status: s.status,
          itemsSynced: s.items_synced,
          startedAt: s.started_at,
          completedAt: s.completed_at,
          durationMs: s.duration_ms
        }))
      },
      timestamp: new Date().toISOString()
    };
  });

  // Trigger manual sync
  app.post<{ Params: OrgParams; Body: SyncBody }>('/:id/sync', async (request, reply) => {
    const { id: orgId } = request.params;
    const { force, dryRun, targets } = request.body;

    // Validate org exists
    const org = await pool.query('SELECT * FROM organizations WHERE id = $1', [orgId]);
    if (org.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    const orgPath = org.rows[0].path;
    const startTime = Date.now();

    logger.info({ orgId, orgPath, force, dryRun, targets }, 'Starting manual sync');

    try {
      // Initialize adapter and sync service
      const adapter = new OrgOsAdapter({ orgPath, watch: false });
      const syncService = new SyncService(adapter, pool);

      // Perform sync
      const result = await syncService.sync(orgId, {
        force: force ?? false,
        dryRun: dryRun ?? false,
        targets: targets ?? ['federation.yaml', 'AGENTS.md', 'skills/', 'memory/']
      });

      // Record sync in history
      await pool.query(`
        INSERT INTO sync_history 
        (organization_id, source_path, sync_type, direction, status, items_synced, errors, started_at, completed_at, duration_ms)
        VALUES ($1, $2, 'manual', 'bidirectional', $3, $4, $5, $6, $7, $8)
      `, [
        orgId,
        orgPath,
        result.success ? 'success' : 'failed',
        result.synced,
        JSON.stringify(result.errors || []),
        new Date(startTime),
        new Date(),
        Date.now() - startTime
      ]);

      logger.info({ orgId, result }, 'Sync completed');

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Record failed sync
      await pool.query(`
        INSERT INTO sync_history 
        (organization_id, source_path, sync_type, direction, status, errors, started_at, completed_at, duration_ms)
        VALUES ($1, $2, 'manual', 'bidirectional', 'failed', $3, $4, $5, $6)
      `, [
        orgId,
        orgPath,
        JSON.stringify([{ error: errorMessage }]),
        new Date(startTime),
        new Date(),
        Date.now() - startTime
      ]);

      logger.error({ orgId, error: errorMessage }, 'Sync failed');

      return reply.status(500).send({
        success: false,
        error: {
          code: 'SYNC_FAILED',
          message: errorMessage
        },
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get sync targets
  app.get<{ Params: OrgParams }>('/:id/sync/targets', async (request, reply) => {
    const { id: orgId } = request.params;

    // Validate org exists
    const org = await pool.query('SELECT * FROM organizations WHERE id = $1', [orgId]);
    if (org.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    const orgPath = org.rows[0].path;

    // Check available targets
    const targets = [
      { name: 'federation.yaml', path: `${orgPath}/federation.yaml`, available: false },
      { name: 'AGENTS.md', path: `${orgPath}/AGENTS.md`, available: false },
      { name: 'skills/', path: `${orgPath}/skills`, available: false },
      { name: 'memory/', path: `${orgPath}/memory`, available: false }
    ];

    // We can't check file existence here easily without fs
    // Just return the target list

    return {
      success: true,
      data: {
        targets,
        defaultTargets: ['federation.yaml', 'AGENTS.md', 'skills/', 'memory/']
      },
      timestamp: new Date().toISOString()
    };
  });

  // Cleanup pool on close
  app.addHook('onClose', async () => {
    await pool.end();
  });
}
