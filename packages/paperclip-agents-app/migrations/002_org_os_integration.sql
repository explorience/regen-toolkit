-- org-os Database Migrations
-- Adds tables for org-os integration: instances, sync events, metadata

-- ============================================================================
-- org_os_instances table
-- Tracks org-os instances imported into Paperclip
-- ============================================================================

CREATE TABLE IF NOT EXISTS org_os_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(1024) NOT NULL UNIQUE,
  uri VARCHAR(1024),
  type VARCHAR(50) DEFAULT 'Project',
  emoji VARCHAR(10),
  runtime VARCHAR(50) DEFAULT 'openclaw',
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT valid_org_path CHECK (path ~ '^/')
);

CREATE INDEX IF NOT EXISTS idx_org_os_instances_org_id ON org_os_instances(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_os_instances_path ON org_os_instances(path);
CREATE INDEX IF NOT EXISTS idx_org_os_instances_sync_enabled ON org_os_instances(sync_enabled);

-- ============================================================================
-- sync_events table
-- Logs all sync operations between Paperclip and org-os
-- ============================================================================

CREATE TABLE IF NOT EXISTS sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(255) NOT NULL REFERENCES org_os_instances(organization_id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('pull', 'push')),
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('agent', 'skill', 'task', 'memory', 'config', 'federation')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'conflict', 'skipped')),
  changes_count INTEGER DEFAULT 0,
  path VARCHAR(1024),
  details JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT valid_sync_direction CHECK (direction IN ('pull', 'push'))
);

CREATE INDEX IF NOT EXISTS idx_sync_events_org_id ON sync_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_sync_events_created_at ON sync_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_events_direction ON sync_events(direction);
CREATE INDEX IF NOT EXISTS idx_sync_events_status ON sync_events(status);

-- ============================================================================
-- org_os_metadata table
-- Stores federation.yaml data for each org-os instance
-- ============================================================================

CREATE TABLE IF NOT EXISTS org_os_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(255) NOT NULL UNIQUE REFERENCES org_os_instances(organization_id) ON DELETE CASCADE,
  
  -- Federation data
  federation_version VARCHAR(20),
  federation_spec VARCHAR(50),
  
  -- Organization identity
  org_name VARCHAR(255),
  org_type VARCHAR(50),
  org_emoji VARCHAR(10),
  org_dao_uri VARCHAR(1024),
  org_chain VARCHAR(50),
  org_safe_address VARCHAR(100),
  org_hats INTEGER,
  
  -- Network config
  network_name VARCHAR(100),
  network_hub VARCHAR(255),
  
  -- Agent config
  agent_runtime VARCHAR(50),
  agent_workspace VARCHAR(1024),
  agent_skills JSONB,
  agent_channels JSONB,
  agent_proactive BOOLEAN DEFAULT false,
  agent_heartbeat_interval VARCHAR(20),
  
  -- Knowledge commons
  knowledge_commons_enabled BOOLEAN DEFAULT false,
  knowledge_commons_sync_protocol VARCHAR(20),
  knowledge_commons_shared_domains JSONB,
  
  -- Packages enabled
  packages JSONB,
  
  -- Governance
  governance JSONB,
  
  -- Raw federation.yaml for reference
  raw_federation TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_os_metadata_org_id ON org_os_metadata(organization_id);

-- ============================================================================
-- Helper function to update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_org_os_instances_updated_at 
  BEFORE UPDATE ON org_os_instances 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_os_metadata_updated_at 
  BEFORE UPDATE ON org_os_metadata 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- End of migrations
-- ============================================================================
