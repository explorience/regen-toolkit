#!/usr/bin/env node
/**
 * Paperclip Agents Setup CLI
 * One-command setup for org-os instances
 */

import { readFile, writeFile, readdir, mkdir, access, cp } from 'fs/promises';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import pg from 'pg';
import YAML from 'yaml';
import chalk from 'chalk';
import prompts from 'prompts';
import dotenv from 'dotenv';
import { createLogger } from '../lib/logger.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';

dotenv.config();
const logger = createLogger('setup');

const { Pool } = pg;

// Colors for output
const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  step: chalk.bold.blue
};

// ============================================================================
// Main Setup Flow
// ============================================================================

async function main() {
  console.log(chalk.bold.cyan(`
╔══════════════════════════════════════════════════════════════╗
║       Paperclip Agents App - One-Command Setup              ║
║              org-os Agent-Native Workspace                  ║
╚══════════════════════════════════════════════════════════════╝
  `));

  try {
    // Step 1: Detect org-os structure
    await stepDetectOrgOs();
    
    // Step 2: Database setup
    await stepDatabaseSetup();
    
    // Step 3: Run migrations
    await stepRunMigrations();
    
    // Step 4: Discover organization
    await stepDiscoverOrganization();
    
    // Step 5: Seed data
    await stepSeedData();
    
    // Step 6: Create config
    await stepCreateConfig();
    
    // Done
    console.log(chalk.bold.green(`
╔══════════════════════════════════════════════════════════════╗
║                    ✓ Setup Complete!                          ║
╚══════════════════════════════════════════════════════════════╝

Next steps:
  • npm run agents:dev    # Start development server
  • npm run agents:start  # Start production server

API will be available at http://localhost:3100
    `));
    
    process.exit(0);
  } catch (error) {
    console.error(colors.error(`\n✗ Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    if (error instanceof PaperclipError) {
      logger.error({ code: error.code, details: error.details }, 'Setup error');
    }
    process.exit(1);
  }
}

// ============================================================================
// Step Functions
// ============================================================================

async function stepDetectOrgOs() {
  console.log(colors.step('\n① Detecting org-os structure...'));
  
  // Look for federation.yaml in common locations
  const searchPaths = [
    resolve('.'),
    resolve('..'),
    resolve('../../'),
    resolve('../../../')
  ];
  
  let foundPath: string | null = null;
  let federation: any = null;
  
  for (const searchPath of searchPaths) {
    const fedPath = join(searchPath, 'federation.yaml');
    if (existsSync(fedPath)) {
      try {
        const content = await readFile(fedPath, 'utf-8');
        federation = YAML.parse(content);
        foundPath = searchPath;
        break;
      } catch (e) {
        // Continue searching
      }
    }
  }
  
  if (!foundPath || !federation) {
    throw new PaperclipError(
      ErrorCode.DETECTION_FAILED,
      'Could not find org-os structure (federation.yaml)',
      { searchPaths }
    );
  }
  
  console.log(colors.success(`  ✓ Found federation.yaml`));
  console.log(colors.info(`    Organization: ${federation.identity?.name || 'Unknown'}`));
  console.log(colors.info(`    Type: ${federation.identity?.type || 'Unknown'}`));
  console.log(colors.info(`    Path: ${foundPath}`));
  
  // Store for later steps
  (global as any).orgOsPath = foundPath;
  (global as any).federation = federation;
}

async function stepDatabaseSetup() {
  console.log(colors.step('\n② Database setup...'));
  
  // Get database configuration
  const dbConfig = getDatabaseConfig();
  
  // Test connection
  const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: 'postgres', // Connect to default first
    user: dbConfig.user,
    password: dbConfig.password,
    ssl: dbConfig.ssl
  });
  
  try {
    // Test connection
    const client = await pool.connect();
    console.log(colors.success('  ✓ Database connection successful'));
    client.release();
    
    // Create database if not exists
    const dbCheck = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database]
    );
    
    if (dbCheck.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(colors.success(`  ✓ Database '${dbConfig.database}' created`));
    } else {
      console.log(colors.info(`  ℹ Database '${dbConfig.database}' already exists`));
    }
    
    await pool.end();
    
    // Connect to actual database
    const appPool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl
    });
    
    await appPool.query('SELECT 1');
    console.log(colors.success('  ✓ Connected to application database'));
    
    (global as any).dbPool = appPool;
    
  } catch (error) {
    await pool.end();
    throw new PaperclipError(
      ErrorCode.DATABASE_ERROR,
      `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { dbConfig: { ...dbConfig, password: '***' } }
    );
  }
}

async function stepRunMigrations() {
  console.log(colors.step('\n③ Running migrations...'));
  
  const pool = (global as any).dbPool;
  const migrationsPath = resolve(join(__dirname, '../../migrations'));
  
  try {
    // Create migrations table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Get applied migrations
    const applied = await pool.query('SELECT name FROM _migrations');
    const appliedNames = new Set(applied.rows.map(r => r.name));
    
    // Run each migration
    const files = await readdir(migrationsPath);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    let appliedCount = 0;
    
    for (const file of sqlFiles) {
      if (!appliedNames.has(file)) {
        const content = await readFile(join(migrationsPath, file), 'utf-8');
        await pool.query(content);
        await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        console.log(colors.success(`  ✓ ${file}`));
        appliedCount++;
      } else {
        console.log(colors.info(`  ℹ ${file} (already applied)`));
      }
    }
    
    if (appliedCount > 0) {
      console.log(colors.success(`  ✓ ${appliedCount} migration(s) applied`));
    } else {
      console.log(colors.info('  ℹ No new migrations to apply'));
    }
    
  } catch (error) {
    throw new PaperclipError(
      ErrorCode.MIGRATION_FAILED,
      `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { originalError: error }
    );
  }
}

async function stepDiscoverOrganization() {
  console.log(colors.step('\n④ Discovering organization...'));
  
  const pool = (global as any).dbPool;
  const federation = (global as any).federation;
  const orgPath = (global as any).orgOsPath;
  
  if (!federation.identity) {
    throw new PaperclipError(
      ErrorCode.INVALID_FEDERATION,
      'Missing identity section in federation.yaml'
    );
  }
  
  // Check if org already exists
  const existing = await pool.query(
    'SELECT id FROM organizations WHERE path = $1',
    [orgPath]
  );
  
  if (existing.rows.length > 0) {
    console.log(colors.info(`  ℹ Organization already exists (ID: ${existing.rows[0].id})`));
    (global as any).organizationId = existing.rows[0].id;
    return;
  }
  
  // Insert organization
  const result = await pool.query(`
    INSERT INTO organizations (name, type, emoji, path, dao_uri, chain, safe_address, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `, [
    federation.identity.name,
    federation.identity.type,
    federation.identity.emoji || null,
    orgPath,
    federation.identity.daoURI || null,
    federation.identity.chain || null,
    federation.identity.safe || null,
    JSON.stringify(federation.metadata || {})
  ]);
  
  console.log(colors.success(`  ✓ Organization created: ${federation.identity.name}`));
  (global as any).organizationId = result.rows[0].id;
}

async function stepSeedData() {
  console.log(colors.step('\n⑤ Seeding agents and skills...'));
  
  const pool = (global as any).dbPool;
  const orgId = (global as any).organizationId;
  const orgPath = (global as any).orgOsPath;
  
  // Seed agents from AGENTS.md
  const agentsPath = join(orgPath, 'AGENTS.md');
  if (existsSync(agentsPath)) {
    const content = await readFile(agentsPath, 'utf-8');
    const agents = parseAgentsMarkdown(content);
    
    for (const agent of agents) {
      const existing = await pool.query(
        'SELECT id FROM agents WHERE organization_id = $1 AND name = $2',
        [orgId, agent.name]
      );
      
      if (existing.rows.length === 0) {
        await pool.query(`
          INSERT INTO agents (organization_id, name, description, capabilities, skills, status)
          VALUES ($1, $2, $3, $4, $5, 'active')
        `, [
          orgId,
          agent.name,
          agent.description || null,
          JSON.stringify(agent.capabilities || []),
          JSON.stringify(agent.skills || [])
        ]);
      }
    }
    
    console.log(colors.success(`  ✓ ${agents.length} agent(s) seeded`));
  } else {
    console.log(colors.warning('  ⚠ AGENTS.md not found, skipping agent seeding'));
  }
  
  // Index skills from skills/ directory
  const skillsPath = join(orgPath, 'skills');
  if (existsSync(skillsPath)) {
    const entries = await readdir(skillsPath, { withFileTypes: true });
    let skillCount = 0;
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const skillDir = join(skillsPath, entry.name);
      const skillFile = join(skillDir, 'SKILL.md');
      
      if (existsSync(skillFile)) {
        const skillContent = await readFile(skillFile, 'utf-8');
        const description = extractFirstParagraph(skillContent);
        const category = inferSkillCategory(entry.name);
        
        const existing = await pool.query(
          'SELECT id FROM skills WHERE organization_id = $1 AND name = $2',
          [orgId, entry.name]
        );
        
        if (existing.rows.length === 0) {
          await pool.query(`
            INSERT INTO skills (organization_id, name, description, path, category, capabilities)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            orgId,
            entry.name,
            description,
            skillDir,
            category,
            JSON.stringify([])
          ]);
          skillCount++;
        }
      }
    }
    
    console.log(colors.success(`  ✓ ${skillCount} skill(s) indexed`));
  } else {
    console.log(colors.warning('  ⚠ skills/ directory not found, skipping skill indexing'));
  }
}

async function stepCreateConfig() {
  console.log(colors.step('\n⑥ Creating configuration...'));
  
  const orgPath = (global as any).orgOsPath;
  const configDir = join(orgPath, '.paperclip');
  
  // Create .paperclip directory
  if (!existsSync(configDir)) {
    await mkdir(configDir, { recursive: true });
  }
  
  // Create config.yaml
  const config = {
    version: '0.1.0',
    organizationId: (global as any).organizationId,
    server: {
      port: process.env.PAPERCLIP_PORT || 3100,
      host: process.env.PAPERCLIP_HOST || '0.0.0.0'
    },
    database: {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'paperclip',
      user: process.env.PGUSER || 'postgres'
    },
    sync: {
      enabled: true,
      interval: 60000,
      targets: ['federation.yaml', 'AGENTS.md', 'skills/', 'memory/']
    },
    auth: {
      jwtSecret: process.env.PAPERCLIP_JWT_SECRET || generateSecret(),
      expiresIn: '24h'
    }
  };
  
  await writeFile(
    join(configDir, 'config.yaml'),
    YAML.stringify(config),
    'utf-8'
  );
  
  console.log(colors.success(`  ✓ Config created at ${configDir}/config.yaml`));
  
  // Create .env file
  const envContent = `
# Paperclip Agents App Configuration
# Generated by agents:setup

PAPERCLIP_PORT=3100
PAPERCLIP_HOST=0.0.0.0
PAPERCLIP_JWT_SECRET=${config.auth.jwtSecret}

# Database
PGHOST=${process.env.PGHOST || 'localhost'}
PGPORT=${process.env.PGPORT || 5432}
PGDATABASE=${process.env.PGDATABASE || 'paperclip'}
PGUSER=${process.env.PGUSER || 'postgres'}
PGPASSWORD=${process.env.PGPASSWORD || ''}
  `.trim();
  
  await writeFile(join(configDir, '.env'), envContent, 'utf-8');
  console.log(colors.success(`  ✓ Environment file created`));
}

// ============================================================================
// Helper Functions
// ============================================================================

function getDatabaseConfig() {
  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'paperclip',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: process.env.PGSSLMODE === 'require'
  };
}

function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = '';
  for (let i = 0; i < 64; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

function parseAgentsMarkdown(content: string) {
  const agents: any[] = [];
  const sections = splitByHeaders(content);
  
  for (const section of sections) {
    const lines = section.split('\n');
    const nameLine = lines.find(l => l.startsWith('## '));
    
    if (nameLine) {
      const name = nameLine.replace('## ', '').trim();
      agents.push({
        name,
        description: extractFirstParagraph(section),
        capabilities: extractCapabilities(section),
        skills: []
      });
    }
  }
  
  return agents;
}

function splitByHeaders(content: string) {
  const sections: string[] = [];
  let currentSection = '';
  
  for (const line of content.split('\n')) {
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      if (currentSection) {
        sections.push(currentSection.trim());
      }
      currentSection = line + '\n';
    } else {
      currentSection += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push(currentSection.trim());
  }
  
  return sections;
}

function extractFirstParagraph(content: string) {
  const lines = content.split('\n');
  let currentParagraph = '';
  
  for (const line of lines) {
    if (line.trim() === '') {
      if (currentParagraph) break;
    } else if (!line.startsWith('#')) {
      currentParagraph += ' ' + line.trim();
    }
  }
  
  return currentParagraph.trim();
}

function extractCapabilities(content: string) {
  const capabilities: string[] = [];
  const pattern = /[-*]\s+(\w+(?:\s+\w+)*?):/g;
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    const capability = match[1].trim();
    if (capability && !capabilities.includes(capability)) {
      capabilities.push(capability);
    }
  }
  
  return capabilities;
}

function inferSkillCategory(skillName: string) {
  const name = skillName.toLowerCase();
  
  if (name.includes('meeting')) return 'coordination';
  if (name.includes('funding') || name.includes('grant')) return 'finance';
  if (name.includes('knowledge') || name.includes('curator')) return 'knowledge';
  if (name.includes('schema') || name.includes('generator')) return 'technical';
  if (name.includes('heartbeat') || name.includes('monitor')) return 'operations';
  if (name.includes('web')) return 'integration';
  
  return 'general';
}

// Run the setup
main();
