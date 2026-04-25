/**
 * org-os Integration Middleware
 * 
 * Express/Fastify middleware for org-os integration including authentication,
 * logging, and path validation.
 * 
 * @module integration/middleware
 */

import { existsSync, statSync } from 'fs';
import { resolve, relative, sep } from 'path';
import pino from 'pino';

// ============================================================================
// Logger Configuration
// ============================================================================

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Request with org-os context
 */
export interface OrgOsRequest {
  params?: Record<string, string>;
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  orgPath?: string;
  orgId?: string;
}

/**
 * Response with org-os data
 */
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

/**
 * Auth context
 */
export interface AuthContext {
  userId?: string;
  role: 'admin' | 'user' | 'readonly';
  permissions: string[];
}

/**
 * Middleware options
 */
export interface MiddlewareOptions {
  allowedPaths?: string[];
  requireAuth?: boolean;
  logRequests?: boolean;
  maxRequestSize?: number;
}

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: MiddlewareOptions = {
  allowedPaths: [],
  requireAuth: false,
  logRequests: true,
  maxRequestSize: 1024 * 1024 * 10, // 10MB
};

// ============================================================================
// Middleware Functions
// ============================================================================

/**
 * Authentication middleware for org-os routes.
 * 
 * Validates requests have appropriate authentication and authorization.
 * In production, this would validate JWT tokens or API keys.
 * 
 * @param options - Middleware configuration
 * @returns Middleware function
 */
export function orgOsAuthMiddleware(options: MiddlewareOptions = DEFAULT_OPTIONS) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (request: OrgOsRequest, response: OrgOsResponse): Promise<OrgOsResponse> => {
    // Skip auth if not required
    if (!config.requireAuth) {
      return { success: true }; // Continue to next handler
    }

    // In a full implementation, extract and validate JWT/API key
    // For now, check for Authorization header
    const authHeader = (request.headers as Record<string, string>)?.authorization;
    
    if (!authHeader) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization header required',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Validate token format (Bearer token)
    if (!authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authorization format. Use: Bearer <token>',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // In production, validate the token against auth service
    // For now, just check it exists
    const token = authHeader.slice(7);
    if (!token || token.length < 10) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Token valid, continue
    return { success: true };
  };
}

/**
 * Logging middleware for org-os routes.
 * 
 * Logs all requests with timing and appropriate detail level.
 * 
 * @param options - Middleware configuration
 * @returns Middleware function
 */
export function orgOsLoggingMiddleware(options: MiddlewareOptions = DEFAULT_OPTIONS) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return (request: OrgOsRequest, response: OrgOsResponse, next: () => void): void => {
    if (!config.logRequests) {
      next();
      return;
    }

    const startTime = Date.now();
    const path = request.params?.path || request.query?.path || 'unknown';
    const method = (request.headers as Record<string, string>)?.method || 'GET';

    // Log request
    logger.debug({ method, path }, 'org-os request');

    // Capture response
    const originalSend = response.send?.bind(response);
    response.send = function(data: unknown) {
      const duration = Date.now() - startTime;
      
      if ((response as Record<string, unknown>).statusCode >= 400) {
        logger.warn({ method, path, duration, status: (response as Record<string, unknown>).statusCode }, 'org-os error');
      } else {
        logger.info({ method, path, duration }, 'org-os request complete');
      }

      return originalSend(data);
    };

    next();
  };
}

/**
 * Validate org-os path to prevent path traversal attacks.
 * 
 * Ensures:
 * - Path doesn't escape allowed directories
 * - Path exists and is a directory
 * - Path contains federation.yaml
 * 
 * @param path - Path to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateOrgPath(
  path: string,
  options: { allowedPaths?: string[]; requireFederation?: boolean } = {}
): { valid: boolean; error?: string; normalizedPath?: string } {
  // Empty path
  if (!path || typeof path !== 'string') {
    return {
      valid: false,
      error: 'Path is required',
    };
  }

  // Resolve to absolute path
  let resolvedPath: string;
  try {
    resolvedPath = resolve(path);
  } catch {
    return {
      valid: false,
      error: 'Invalid path format',
    };
  }

  // Check for path traversal patterns
  const normalizedInput = path.replace(/\\/g, '/');
  if (normalizedInput.includes('..')) {
    // Special case: allow if it resolves within allowed paths
    if (options.allowedPaths?.some(allowed => resolvedPath.startsWith(resolve(allowed)))) {
      // Allow if within allowed path
    } else {
      logger.warn({ path, resolvedPath }, 'Path traversal attempt detected');
      return {
        valid: false,
        error: 'Path traversal not allowed',
      };
    }
  }

  // Check allowed paths
  if (options.allowedPaths && options.allowedPaths.length > 0) {
    const isAllowed = options.allowedPaths.some(allowed => 
      resolvedPath.startsWith(resolve(allowed))
    );
    
    if (!isAllowed) {
      logger.warn({ path, resolvedPath, allowed: options.allowedPaths }, 'Path outside allowed directories');
      return {
        valid: false,
        error: 'Path outside allowed directories',
      };
    }
  }

  // Check existence
  if (!existsSync(resolvedPath)) {
    return {
      valid: false,
      error: 'Path does not exist',
    };
  }

  // Check it's a directory
  if (!statSync(resolvedPath).isDirectory()) {
    return {
      valid: false,
      error: 'Path is not a directory',
    };
  }

  // Check for federation.yaml if required
  if (options.requireFederation !== false) {
    const fedPath = resolve(resolvedPath, 'federation.yaml');
    if (!existsSync(fedPath)) {
      return {
        valid: false,
        error: 'No federation.yaml found - not an org-os instance',
      };
    }
  }

  return {
    valid: true,
    normalizedPath: resolvedPath,
  };
}

/**
 * Rate limiting middleware for org-os routes.
 * 
 * Simple in-memory rate limiting. In production, use Redis or similar.
 * 
 * @param options - Rate limit configuration
 * @returns Middleware function
 */
export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
}) {
  const requests = new Map<string, number[]>();

  return (request: OrgOsRequest): { allowed: boolean; remaining: number; resetAt: Date } => {
    const clientId = (request.headers as Record<string, string>)?.['x-forwarded-for'] || 
                     (request.headers as Record<string, string>)?.['x-real-ip'] || 
                     'unknown';
    
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    // Get client's request history
    let clientRequests = requests.get(clientId) || [];
    clientRequests = clientRequests.filter(time => time > windowStart);
    
    const remaining = options.maxRequests - clientRequests.length;
    
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(clientRequests[0] + options.windowMs),
      };
    }
    
    // Add current request
    clientRequests.push(now);
    requests.set(clientId, clientRequests);
    
    return {
      allowed: true,
      remaining: remaining - 1,
      resetAt: new Date(now + options.windowMs),
    };
  };
}

/**
 * Input sanitization middleware.
 * 
 * Sanitizes user input to prevent injection attacks.
 * 
 * @returns Sanitized input
 */
export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    // Remove null bytes and control characters
    return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // Sanitize keys too
      const safeKey = key.replace(/[\x00-\x1F\x7F]/g, '').trim();
      sanitized[safeKey] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Create error handler for org-os routes.
 * 
 * @returns Error handler function
 */
export function createErrorHandler() {
  return (error: Error): OrgOsResponse => {
    logger.error({ error: error.message, stack: error.stack }, 'Unhandled error');

    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message;

    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
      timestamp: new Date().toISOString(),
    };
  };
}

export default {
  orgOsAuthMiddleware,
  orgOsLoggingMiddleware,
  validateOrgPath,
  createRateLimiter,
  sanitizeInput,
  createErrorHandler,
};
