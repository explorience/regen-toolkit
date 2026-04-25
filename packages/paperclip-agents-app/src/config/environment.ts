/**
 * Environment Configuration
 * Load and validate configuration from environment and files
 */

import { existsSync } from 'fs';
import { join, resolve } from 'path';
import YAML from 'yaml';
import { AppConfig, DatabaseConfig, LoggingConfig, AuthConfig, RateLimitConfig, CorsConfig } from '../types.js';
import { createLogger } from '../lib/logger.js';

const logger = createLogger('config');

const DEFAULT_CONFIG: AppConfig = {
  port: parseInt(process.env.PAPERCLIP_PORT || '3100'),
  host: process.env.PAPERCLIP_HOST || '0.0.0.0',
  database: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'paperclip',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: process.env.PGSSLMODE === 'require',
    poolSize: parseInt(process.env.PGPOOL_SIZE || '10')
  },
  logging: {
    level: (process.env.LOG_LEVEL as any) || 'info',
    pretty: process.env.NODE_ENV !== 'production'
  },
  auth: {
    jwtSecret: process.env.PAPERCLIP_JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.PAPERCLIP_JWT_EXPIRES_IN || '24h'
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW || '1 minute'
  },
  cors: {
    enabled: process.env.CORS_ENABLED !== 'false',
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : undefined
  }
};

export function loadConfig(): AppConfig {
  // Try to load from .paperclip/config.yaml
  const configPaths = [
    resolve('.paperclip/config.yaml'),
    resolve('../.paperclip/config.yaml'),
    resolve('../../.paperclip/config.yaml')
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const content = require('fs').readFileSync(configPath, 'utf-8');
        const fileConfig = YAML.parse(content);
        
        logger.info({ path: configPath }, 'Loaded config from file');
        
        return mergeConfig(DEFAULT_CONFIG, fileConfig);
      } catch (error) {
        logger.warn({ path: configPath, error }, 'Failed to load config file');
      }
    }
  }

  // Use default/config from environment
  logger.info('Using environment configuration');
  return DEFAULT_CONFIG;
}

function mergeConfig(defaults: AppConfig, overrides: Partial<AppConfig>): AppConfig {
  return {
    port: overrides.port ?? defaults.port,
    host: overrides.host ?? defaults.host,
    database: {
      ...defaults.database,
      ...overrides.database
    },
    logging: {
      ...defaults.logging,
      ...overrides.logging
    },
    auth: {
      ...defaults.auth,
      ...overrides.auth
    },
    rateLimit: {
      ...defaults.rateLimit,
      ...overrides.rateLimit
    },
    cors: {
      ...defaults.cors,
      ...overrides.cors
    }
  };
}

export function validateConfig(config: AppConfig): void {
  const errors: string[] = [];

  // Validate port
  if (config.port < 1 || config.port > 65535) {
    errors.push('Port must be between 1 and 65535');
  }

  // Validate database config
  if (!config.database.host) {
    errors.push('Database host is required');
  }
  if (!config.database.database) {
    errors.push('Database name is required');
  }
  if (!config.database.user) {
    errors.push('Database user is required');
  }

  // Validate auth config
  if (!config.auth.jwtSecret) {
    errors.push('JWT secret is required');
  }
  if (config.auth.jwtSecret === 'dev-secret-change-in-production') {
    logger.warn('Using default JWT secret - change in production!');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  logger.info('Configuration validated successfully');
}
