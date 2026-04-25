/**
 * Logger - Structured logging for Paperclip Agents App
 */

import pino from 'pino';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface LoggerConfig {
  level?: pino.LevelWithSilent;
  pretty?: boolean;
  destination?: string;
}

const defaultConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as pino.LevelWithSilent) || 'info',
  pretty: process.env.NODE_ENV !== 'production',
  destination: process.env.LOG_PATH
};

export function createLogger(name: string, config?: LoggerConfig): pino.Logger {
  const options: pino.LoggerOptions = {
    name,
    level: config?.level ?? defaultConfig.level,
    formatters: {
      level: (label) => ({ level: label })
    }
  };

  // File logging
  if (config?.destination || defaultConfig.destination) {
    const logPath = config?.destination || defaultConfig.destination;
    const dir = join(logPath, '..');
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    options.transport = {
      target: 'pino/file',
      options: { destination: logPath }
    };
  }

  // Pretty console logging
  if (config?.pretty ?? defaultConfig.pretty) {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false
      }
    };
  }

  return pino(options);
}

export default createLogger;
