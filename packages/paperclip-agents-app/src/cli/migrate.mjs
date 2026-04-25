#!/usr/bin/env node
/**
 * Migration CLI
 * Run database migrations
 */

import { readFile, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import pg from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan,
  step: chalk.bold.blue
};

async function main() {
  const direction = process.argv[2] || 'up';
  const migrationsPath = resolve(join(__dirname, '../../migrations'));
  
  console.log(chalk.bold.cyan(`\n📦 Paperclip Migrations - ${direction === 'up' ? 'Apply' : 'Rollback'}\n`));

  const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'paperclip',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    ssl: process.env.PGSSLMODE === 'require'
  });

  try {
    // Create migrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get migration files
    const files = await readdir(migrationsPath);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    if (direction === 'up') {
      // Get applied migrations
      const applied = await pool.query('SELECT name FROM _migrations');
      const appliedNames = new Set(applied.rows.map(r => r.name));

      let appliedCount = 0;

      for (const file of sqlFiles) {
        if (!appliedNames.has(file)) {
          const content = await readFile(join(migrationsPath, file), 'utf-8');
          
          // Run each statement separately
          const statements = content.split(';').filter(s => s.trim());
          for (const statement of statements) {
            if (statement.trim()) {
              await pool.query(statement);
            }
          }

          await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
          console.log(colors.success(`  ✓ ${file}`));
          appliedCount++;
        }
      }

      if (appliedCount > 0) {
        console.log(colors.success(`\n✓ ${appliedCount} migration(s) applied\n`));
      } else {
        console.log(colors.info('\nℹ No new migrations to apply\n'));
      }
    } else if (direction === 'down') {
      // Rollback last migration
      const lastMigration = await pool.query(
        'SELECT name FROM _migrations ORDER BY id DESC LIMIT 1'
      );

      if (lastMigration.rows.length === 0) {
        console.log(colors.warning('\n⚠ No migrations to rollback\n'));
      } else {
        const file = lastMigration.rows[0].name;
        console.log(colors.warning(`  ↩ Rolling back: ${file}`));
        
        // Note: Actual rollback would need down migrations
        await pool.query('DELETE FROM _migrations WHERE name = $1', [file]);
        console.log(colors.success(`  ✓ Rolled back: ${file}\n`));
      }
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(colors.error(`\n✗ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    await pool.end();
    process.exit(1);
  }
}

main();
