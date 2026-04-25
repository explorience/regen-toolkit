-- Migration 005: Sync State
-- Enhanced sync state tracking

-- Sync history for audit trail
CREATE TABLE IF NOT EXISTS sync_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_path VARCHAR(512) NOT NULL,
    sync_type VARCHAR(20) NOT NULL DEFAULT 'manual',
    direction VARCHAR(20) NOT NULL DEFAULT 'bidirectional',
    status VARCHAR(20) NOT NULL DEFAULT 'success',
    items_synced INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms BIGINT,
    UNIQUE(organization_id, source_path, started_at)
);

CREATE INDEX idx_sync_history_organization ON sync_history(organization_id);
CREATE INDEX idx_sync_history_started_at ON sync_history(started_at);
CREATE INDEX idx_sync_history_status ON sync_history(status);

-- Plugin execution tracking
CREATE TABLE IF NOT EXISTS plugin_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plugin_name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'running',
    input JSONB DEFAULT '{}',
    output JSONB DEFAULT '{}',
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms BIGINT
);

CREATE INDEX idx_plugin_executions_organization ON plugin_executions(organization_id);
CREATE INDEX idx_plugin_executions_plugin ON plugin_executions(plugin_name);
CREATE INDEX idx_plugin_executions_started_at ON plugin_executions(started_at);

-- Comments
COMMENT ON TABLE sync_history IS 'Sync audit trail';
COMMENT ON TABLE plugin_executions IS 'Plugin execution tracking';
