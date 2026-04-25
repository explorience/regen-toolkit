/**
 * Tasks API Routes
 */

import { FastifyInstance } from 'fastify';
import pg from 'pg';
import { createLogger } from '../../lib/logger.js';
import { NotFoundError } from '../../lib/errors.js';
import { parsePagination, isValidUUID } from '../../lib/utils.js';

const { Pool } = pg;
const logger = createLogger('routes:tasks');

interface OrgParams {
  id: string;
}

interface TaskParams {
  id: string;
  taskId: string;
}

interface ListQuery {
  page?: string;
  pageSize?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export async function tasksRoutes(app: FastifyInstance): Promise<void> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  // List tasks for organization
  app.get<{ Params: OrgParams; Querystring: ListQuery }>('/:id/tasks', async (request, reply) => {
    const { id: orgId } = request.params;
    const { page, pageSize, offset } = parsePagination(request.query);
    const { status, priority, assignee } = request.query;

    // Validate org exists
    const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [orgId]);
    if (orgCheck.rows.length === 0) {
      throw new NotFoundError('Organization', orgId);
    }

    let query = 'SELECT * FROM tasks WHERE organization_id = $1';
    const params: any[] = [orgId];
    const conditions: string[] = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (priority) {
      params.push(priority);
      conditions.push(`priority = $${params.length}`);
    }

    if (assignee) {
      params.push(assignee);
      conditions.push(`assignee = $${params.length}`);
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

  // Get task by ID
  app.get<{ Params: TaskParams }>('/:id/tasks/:taskId', async (request, reply) => {
    const { id: orgId, taskId } = request.params;

    if (!isValidUUID(taskId)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Invalid task ID format' }
      });
    }

    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND organization_id = $2',
      [taskId, orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task', taskId);
    }

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Create task
  app.post<{ Params: OrgParams }>('/:id/tasks', async (request, reply) => {
    const { id: orgId } = request.params;
    const { title, description, agentId, priority, assignee, dueDate, metadata } = request.body as any;

    if (!title) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'title is required' }
      });
    }

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

    const result = await pool.query(`
      INSERT INTO tasks (organization_id, agent_id, title, description, priority, assignee, due_date, metadata, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *
    `, [orgId, agentId, title, description, priority || 'medium', assignee, dueDate, metadata]);

    logger.info({ orgId, taskId: result.rows[0].id, title }, 'Task created');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Update task
  app.put<{ Params: TaskParams }>('/:id/tasks/:taskId', async (request, reply) => {
    const { id: orgId, taskId } = request.params;
    const updates = request.body as any;

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    // Handle status change to completed
    if (updates.status === 'completed') {
      paramCount++;
      fields.push(`completed_at = $${paramCount}`);
      values.push(new Date());
    }

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

    values.push(taskId, orgId);
    const result = await pool.query(`
      UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount + 1} AND organization_id = $${paramCount + 2}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task', taskId);
    }

    logger.info({ taskId }, 'Task updated');

    return {
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString()
    };
  });

  // Delete task
  app.delete<{ Params: TaskParams }>('/:id/tasks/:taskId', async (request, reply) => {
    const { id: orgId, taskId } = request.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND organization_id = $2 RETURNING id',
      [taskId, orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task', taskId);
    }

    logger.info({ taskId }, 'Task deleted');

    return {
      success: true,
      data: { id: taskId },
      timestamp: new Date().toISOString()
    };
  });

  // Cleanup pool on close
  app.addHook('onClose', async () => {
    await pool.end();
  });
}
