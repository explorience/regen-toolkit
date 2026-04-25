-- Migration 005: Sync State (SQLite)
-- Enhanced sync state tracking

-- Sync history for audit trail
CREATE TABLE IF NOT EXISTS sync_history (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_path TEXT NOT NULL,
    sync_type TEXT NOT NULL DEFAULT 'manual',
    direction TEXT NOT NULL DEFAULT 'bidirectional',
    status TEXT NOT NULL DEFAULT 'success',
    items_synced INTEGER DEFAULT 0,
    errors TEXT DEFAULT '[]',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    UNIQUE(organization_id, source_path, started_at)
);

CREATE INDEX IF NOT EXISTS idx_sync_history_organization ON sync_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_started_at ON sync_history(started_at);
CREATE INDEX IF NOT EXISTS idx_sync_history_status ON sync_history(status);

-- Plugin execution tracking
CREATE TABLE IF NOT EXISTS plugin_executions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_name TEXT NOT NULL,
    version TEXT,
    status TEXT NOT NULL DEFAULT 'running',
    input TEXT DEFAULT '{}',
    output TEXT DEFAULT '{}',
    error TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_plugin_executions_organization ON plugin_executions(organization_id);
CREATE INDEX IF NOT EXISTS idx_plugin_executions_plugin ON plugin_executions(plugin_name);
CREATE INDEX IF NOT EXISTS idx_plugin_executions_started_at ON plugin_executions(started_at);
