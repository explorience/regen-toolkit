/**
 * Agents API Routes
 */

import { FastifyInstance } from 'fastify';
import pg from 'pg';
import { createLogger } from '../../lib/logger.js';
import { NotFoundError } from '../../lib/errors.js';
import { parsePagination, isValidUUID } from '../../lib/utils.js';

const { Pool } = pg;
const logger = createLogger('routes:agents');

interface OrgParams {
  id: string;
}

interface AgentParams {
  id: string;
  agentId: string;
}

interface ListQuery {
  page?: string;
  pageSize?: string;
  status?: string;
  search?: string;
}

export async function agentsRoutes(app: FastifyInstance): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  // List agents for organization
  app.get<{ Params: OrgParams; Querystring: ListQuery }>('/:id/agents', async (request, reply) => {
    const { id: orgId } = request.params;
    const { page, pageSize, offset } = parsePagination(request.query);
    const { status, search } = request.query;

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    let query = 'SELECT * FROM agents WHERE organization_id = $1';
    const params: any[] = [orgId];
    const conditions: string[] = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    // Count query
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0]?.count || '0');

    // Main query with pagination
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, offset);
    
    const result = await pool.query(query, params);

    return {
      success: true,
      data: {
        items: result.rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      timestamp: new Date().toISOString()
    };
  });

  // Get agent by ID
  app.get<{ Params: AgentParams }>('/:id/agents/:agentId', async (request, reply) => {
    const { id: orgId, agentId } = request.params;

    if (!isValidUUID(agentId)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Invalid agent ID format' }
      });
    }

    const result = await pool.query(
      'SELECT * FROM agents WHERE id = $1 AND organization_id = $2',
      [agentId, orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Agent', agentId);
    }

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Create agent
  app.post<{ Params: OrgParams }>('/:id/agents', async (request, reply) => {
    const { id: orgId } = request.params;
    const { name, description, model, capabilities, skills, channels, config } = request.body as any;

    if (!name) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'name is required' }
      });
    }

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    const result = await pool.query(`
      INSERT INTO agents (organization_id, name, description, model, capabilities, skills, channels, config, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      RETURNING *
    `, [orgId, name, description, model, capabilities, skills, channels, config]);

    logger.info({ orgId, agentId: result.rows[0].id, name }, 'Agent created');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Update agent
  app.put<{ Params: AgentParams }>('/:id/agents/:agentId', async (request, reply) => {
    const { id: orgId, agentId } = request.params;
    const updates = request.body as any;

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'No fields to update' }
      });
    }

    values.push(agentId, orgId);
    const result = await pool.query(`
      UPDATE agents SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount + 1} AND organization_id = $${paramCount + 2}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Agent', agentId);
    }

    logger.info({ agentId }, 'Agent updated');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Delete agent
  app.delete<{ Params: AgentParams }>('/:id/agents/:agentId', async (request, reply) => {
    const { id: orgId, agentId } = request.params;

    const result = await pool.query(
      'DELETE FROM agents WHERE id = $1 AND organization_id = $2 RETURNING id',
      [agentId, orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Agent', agentId);
    }

    logger.info({ agentId }, 'Agent deleted');

    return {
      success: true,
      data: { id: agentId },
      timestamp: new Date().toISOString()
    };
  });

  // Cleanup pool on close
  app.addHook('onClose', async () => {
    await pool.end();
  });
}
