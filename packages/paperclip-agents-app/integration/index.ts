/**
 * Integration Index
 * 
 * Main entry point for the integration layer.
 * Exports routes, services, and middleware.
 * 
 * @module integration
 */

export { createOrgOsRoutes } from './routes.js';
export { OrgOsService } from './services.js';
export { orgOsAuthMiddleware, orgOsLoggingMiddleware, validateOrgPath } from './middleware.js';

// Re-export types
export type {
  OrgOsRoutesConfig,
  DiscoverRequest,
  ImportRequest,
  SyncStatusRequest,
  PullSyncRequest,
  PushSyncRequest,
  SyncHistoryRequest,
  OrgOsResponse,
  SyncStatusResponse,
  SyncHistoryResponse,
  ErrorResponse,
} from './routes.js';

export type {
  OrgOsServiceConfig,
  OrganizationImportResult,
  SyncEventRecord,
} from './services.js';
