/**
 * Costs API Routes
 */

import { FastifyInstance } from 'fastify';
import pg from 'pg';
import { createLogger } from '../../lib/logger.js';
import { NotFoundError } from '../../lib/errors.js';
import { parsePagination } from '../../lib/utils.js';

const { Pool } = pg;
const logger = createLogger('routes:costs');

interface OrgParams {
  id: string;
}

interface ListQuery {
  page?: string;
  pageSize?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month' | 'agent';
}

export async function costsRoutes(app: FastifyInstance): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  // Get cost summary for organization
  app.get<{ Params: OrgParams; Querystring: ListQuery }>('/:id/costs', async (request, reply) => {
    const { id: orgId } = request.params;
    const { page, pageSize, offset } = parsePagination(request.query);
    const { type, startDate, endDate, groupBy } = request.query;

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    let query = 'SELECT * FROM costs WHERE organization_id = $1';
    const params: any[] = [orgId];
    const conditions: string[] = [];

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    if (startDate) {
      params.push(startDate);
      conditions.push(`created_at >= $${params.length}`);
    }

    if (endDate) {
      params.push(endDate);
      conditions.push(`created_at <= $${params.length}`);
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

    // Get aggregate stats
    const statsQuery = `
      SELECT 
        SUM(amount) as total_amount,
        SUM(tokens_used) as total_tokens,
        COUNT(*) as total_operations
      FROM costs WHERE organization_id = $1
      ${conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : ''}
    `;
    const statsResult = await pool.query(statsQuery, params.slice(0, params.length - 2));

    return {
      success: true,
      data: {
        items: result.rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        summary: {
          totalAmount: parseFloat(statsResult.rows[0]?.total_amount || '0'),
          totalTokens: parseInt(statsResult.rows[0]?.total_tokens || '0'),
          totalOperations: parseInt(statsResult.rows[0]?.total_operations || '0')
        }
      },
      timestamp: new Date().toISOString()
    };
  });

  // Get daily costs
  app.get<{ Params: OrgParams }>('/:id/costs/daily', async (request, reply) => {
    const { id: orgId } = request.params;
    const { days = '30' } = request.query as any;

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(amount) as total_amount,
        SUM(tokens_used) as total_tokens,
        COUNT(*) as operations
      FROM costs 
      WHERE organization_id = $1 
        AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [orgId]);

    return {
      success: true,
      data: {
        items: result.rows.map(row => ({
          date: row.date,
          totalAmount: parseFloat(row.total_amount || '0'),
          totalTokens: parseInt(row.total_tokens || '0'),
          operations: parseInt(row.operations || '0')
        })),
        period: `last ${days} days`
      },
      timestamp: new Date().toISOString()
    };
  });

  // Record a cost
  app.post<{ Params: OrgParams }>('/:id/costs', async (request, reply) => {
    const { id: orgId } = request.params;
    const { agentId, taskId, type, amount, currency, model, tokensUsed, promptTokens, completionTokens, metadata } = request.body as any;

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    // Validate agent if provided
    if (agentId) {
      const agentCheck = await pool.query('SELECT id FROM agents WHERE id = $1', [agentId]);
      if (agentCheck.rows.length === 0) {
        throw new NotFoundError('Agent', agentId);
      }
    }

    // Validate task if provided
    if (taskId) {
      const taskCheck = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
      if (taskCheck.rows.length === 0) {
        throw new NotFoundError('Task', taskId);
      }
    }

    const result = await pool.query(`
      INSERT INTO costs (organization_id, agent_id, task_id, type, amount, currency, model, tokens_used, prompt_tokens, completion_tokens, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [orgId, agentId, taskId, type || 'api_call', amount || 0, currency || 'USD', model, tokensUsed, promptTokens, completionTokens, metadata]);

    logger.info({ orgId, costId: result.rows[0].id, type, amount }, 'Cost recorded');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Cleanup pool on close
  app.addHook('onClose', async () => {
    await pool.end();
  });
}
