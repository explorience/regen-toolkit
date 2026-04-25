/**
 * org-os Bridge Package
 * 
 * Main entry point for the org-os bridge package.
 * Provides auto-discovery, loading, and synchronization of org-os instances.
 * 
 * @module org-os-bridge
 * 
 * @example
 * ```typescript
 * import { OrgOsAdapter, SyncService } from '@org-os/org-os-bridge';
 * 
 * // Discover and load organizations
 * const orgs = await OrgOsAdapter.discoverOrganizations();
 * const org = orgs[0];
 * 
 * // Create sync service
 * const sync = new SyncService(org);
 * await sync.pull();
 * ```
 */

export { OrgOsAdapter } from './adapter.js';
export { SyncService } from './sync.js';

// Re-export types
export type {
  OrgOsOrganization,
  OrgOsAgent,
  OrgOsSkill,
  OrgOsConfig,
  FileChange,
  DiscoveredOrganization,
  ValidationResult,
  ValidationError,
} from './types.js';

export type {
  SyncDirection,
  SyncItemType,
  SyncStatusValue,
  SyncOperationResult,
  SyncResult,
  SyncEvent,
  SyncConfig,
} from './sync.js';
