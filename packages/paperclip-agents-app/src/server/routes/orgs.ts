/**
 * Organizations API Routes
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import pg from 'pg';
import { createLogger } from '../../lib/logger.js';
import { NotFoundError } from '../../lib/errors.js';
import { parsePagination } from '../../lib/utils.js';

const { Pool } = pg;
const logger = createLogger('routes:orgs');

interface OrgParams {
  id: string;
}

interface ListQuery {
  page?: string;
  pageSize?: string;
  type?: string;
  search?: string;
}

export async function orgsRoutes(app: FastifyInstance): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  // List organizations
  app.get<{ Querystring: ListQuery }>('/', async (request, reply) => {
    const { page, pageSize, offset } = parsePagination(request.query);
    const { type, search } = request.query;

    let query = 'SELECT * FROM organizations';
    const params: any[] = [];
    const conditions: string[] = [];

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR path ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
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

  // Get organization by ID
  app.get<{ Params: OrgParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    const result = await pool.query(
      'SELECT * FROM organizations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization', id);
    }

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Create organization
  app.post('/', async (request, reply) => {
    const { name, type, emoji, path, daoUri, chain, safeAddress } = request.body as any;

    if (!name || !type || !path) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'name, type, and path are required'
        }
      });
    }

    const result = await pool.query(`
      INSERT INTO organizations (name, type, emoji, path, dao_uri, chain, safe_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, type, emoji, path, daoUri, chain, safeAddress]);

    logger.info({ orgId: result.rows[0].id, name }, 'Organization created');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Update organization
  app.put<{ Params: OrgParams }>('/:id', async (request, reply) => {
    const { id } = request.params;
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
        error: {
          code: 'INVALID_INPUT',
          message: 'No fields to update'
        }
      });
    }

    values.push(id);
    const result = await pool.query(`
      UPDATE organizations SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount + 1}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization', id);
    }

    logger.info({ orgId: id }, 'Organization updated');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Delete organization
  app.delete<{ Params: OrgParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    const result = await pool.query(
      'DELETE FROM organizations WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization', id);
    }

    logger.info({ orgId: id }, 'Organization deleted');

    return {
      success: true,
      data: { id },
      timestamp: new Date().toISOString()
    };
  });

  // Cleanup pool on close
  app.addHook('onClose', async () => {
    await pool.end();
  });
}
