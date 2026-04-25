/**
 * PostgreSQL Setup and Connection Management
 */

import pg from 'pg';
import { createLogger } from '../lib/logger.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';
import { DatabaseConfig } from '../types.js';

const { Pool } = pg;
const logger = createLogger('postgres');

export interface PostgresSetupOptions {
  config: DatabaseConfig;
  createDatabase?: boolean;
  runMigrations?: boolean;
  migrationsPath?: string;
}

export class PostgresSetup {
  private pool: pg.Pool | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Connect to PostgreSQL
   */
  async connect(): Promise<pg.Pool> {
    if (this.pool) {
      return this.pool;
    }

    this.pool = new Pool({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: this.config.password,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      max: this.config.poolSize || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    try {
      const client = await this.pool.connect();
      client.release();
      logger.info({ database: this.config.database }, 'Connected to PostgreSQL');
    } catch (error) {
      throw new PaperclipError(
        ErrorCode.DATABASE_ERROR,
        `Failed to connect to PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { config: { ...this.config, password: '***' } }
      );
    }

    return this.pool;
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const pool = await this.connect();
      const result = await pool.query('SELECT NOW()');
      logger.info({ time: result.rows[0].now }, 'Database connection test successful');
      return true;
    } catch (error) {
      logger.error({ error }, 'Database connection test failed');
      return false;
    }
  }

  /**
   * Create database if not exists
   */
  async createDatabase(): Promise<boolean> {
    // Connect to default postgres database first
    const adminPool = new Pool({
      host: this.config.host,
      port: this.config.port,
      database: 'postgres',
      user: this.config.user,
      password: this.config.password,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false
    });

    try {
      // Check if database exists
      const result = await adminPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [this.config.database]
      );

      if (result.rows.length === 0) {
        await adminPool.query(`CREATE DATABASE ${this.config.database}`);
        logger.info({ database: this.config.database }, 'Database created');
      } else {
        logger.info({ database: this.config.database }, 'Database already exists');
      }

      await adminPool.end();
      return true;
    } catch (error) {
      await adminPool.end();
      throw new PaperclipError(
        ErrorCode.DATABASE_ERROR,
        `Failed to create database: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { database: this.config.database }
      );
    }
  }

  /**
   * Run SQL migrations
   */
  async runMigrations(migrationsPath: string): Promise<number> {
    const { readFile, readdir } = await import('fs/promises');
    const { join } = await import('path');

    const pool = await this.connect();

    // Create migrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get applied migrations
    const appliedResult = await pool.query('SELECT name FROM _migrations');
    const appliedMigrations = new Set(appliedResult.rows.map(r => r.name));

    // Get migration files
    const files = await readdir(migrationsPath);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    let appliedCount = 0;

    for (const file of sqlFiles) {
      if (!appliedMigrations.has(file)) {
        const content = await readFile(join(migrationsPath, file), 'utf-8');
        
        // Run each statement separately
        const statements = content.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            await pool.query(statement);
          }
        }

        await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        logger.info({ migration: file }, 'Migration applied');
        appliedCount++;
      }
    }

    logger.info({ appliedCount }, 'Migrations complete');
    return appliedCount;
  }

  /**
   * Close connection pool
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('Database connection closed');
    }
  }
}

export default PostgresSetup;
