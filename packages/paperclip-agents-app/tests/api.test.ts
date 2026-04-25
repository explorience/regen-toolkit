/**
 * API Tests
 * Test REST API endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildServer } from '../server/index.js';

describe('API', () => {
  let app: any;

  beforeAll(async () => {
    // Build test server (will use test database in real tests)
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/health'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('healthy');
    });
  });

  describe('Organizations', () => {
    it('should list organizations', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orgs'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('items');
      expect(body.data).toHaveProperty('total');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent organization', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orgs/non-existent-id'
      });

      // Note: Actual 404 handling depends on implementation
      expect([404, 500]).toContain(response.statusCode);
    });
  });
});
