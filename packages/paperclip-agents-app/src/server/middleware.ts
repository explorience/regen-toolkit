/**
 * Server Middleware
 * Authentication, logging, and request preprocessing
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../lib/logger.js';

const logger = createLogger('middleware');

/**
 * Request logging middleware
 */
export async function loggingMiddleware(
  app: FastifyInstance
): Promise<void> {
  app.addHook('onRequest', async (request, reply) => {
    request.log.info({ url: request.url, method: request.method }, 'Incoming request');
  });

  app.addHook('onResponse', async (request, reply) => {
    request.log.info(
      { 
        url: request.url, 
        method: request.method,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime
      }, 
      'Request completed'
    );
  });
}

/**
 * Authentication middleware (optional)
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Try to authenticate but don't fail if no token
  const authHeader = request.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Token verification would happen here
      // For now, we just pass through
      request.headers.authorization = authHeader;
    } catch (error) {
      // Token invalid, continue without auth
      logger.debug({ error }, 'Optional auth failed');
    }
  }
}

/**
 * Validate organization ownership
 */
export async function validateOrgOwnership(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const orgId = (request.params as Record<string, string>).orgId;
  
  if (!orgId) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Organization ID is required'
      }
    });
  }
  
  // In production, validate that the authenticated user has access to this org
  // For now, we just pass through
}

/**
 * Input validation middleware
 */
export function validateInput<T>(
  schema: Record<string, unknown>
) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Zod validation would happen here
    // Fastify handles JSON schema validation automatically
  };
}

/**
 * Rate limiting by organization
 */
export async function orgRateLimit(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const orgId = (request.params as Record<string, string>).orgId;
  
  // Custom rate limiting by org would go here
  // For now, use global rate limiting from Fastify
}
