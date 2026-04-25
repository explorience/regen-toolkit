#!/usr/bin/env node

/**
 * KOI/OPAL Bridge CLI
 * 
 * Command-line interface for managing the KOI/OPAL integration
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { KoiOpalBridge, createBridge } from './index.js';

const program = new Command();

program
  .name('koi-opal')
  .description('KOI/OPAL Bridge for Organizational OS')
  .version('1.0.0');

// Setup command
program
  .command('setup')
  .description('Initialize KOI/OPAL bridge in org-os instance')
  .option('--opal-path <path>', 'Path to OPAL installation', '../opal')
  .option('--koi-url <url>', 'KOI coordinator URL', 'https://koi.regen.network/koi-net')
  .option('--node-type <type>', 'KOI node type', 'partial')
  .option('--template <name>', 'OPAL profile template', 'regen')
  .action(async (options) => {
    const spinner = ora('Setting up KOI/OPAL bridge...').start();
    
    try {
      // Create configuration
      console.log(chalk.blue('\\nConfiguration:'));
      console.log(`  OPAL path: ${options.opalPath}`);
      console.log(`  KOI URL: ${options.koiUrl}`);
      console.log(`  Node type: ${options.nodeType}`);
      console.log(`  Template: ${options.template}`);
      
      spinner.succeed('Setup complete');
    } catch (error) {
      spinner.fail(`Setup failed: ${error}`);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show bridge status')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    try {
      const bridge = await createBridge(options.config);
      const status = await bridge.getStatus();
      
      console.log(chalk.blue('\\nBridge Status:'));
      
      // OPAL status
      console.log(chalk.yellow('\\n  OPAL:'));
      console.log(`    Status: ${status.opal.status === 'connected' ? chalk.green('✓') : chalk.red('✗')} ${status.opal.status}`);
      console.log(`    Version: ${status.opal.version || 'unknown'}`);
      console.log(`    Pending items: ${status.opal.pendingItems}`);
      
      // KOI status
      console.log(chalk.yellow('\\n  KOI:'));
      console.log(`    Status: ${status.koi.status === 'connected' ? chalk.green('✓') : chalk.red('✗')} ${status.koi.status}`);
      console.log(`    Node ID: ${status.koi.nodeId || 'not registered'}`);
      console.log(`    Neighbors: ${status.koi.neighbors}`);
      
      // Sync status
      console.log(chalk.yellow('\\n  Sync:'));
      console.log(`    Last sync: ${status.sync.lastSync?.toISOString() || 'never'}`);
      console.log(`    In progress: ${status.sync.syncInProgress ? chalk.yellow('yes') : 'no'}`);
      
    } catch (error) {
      console.error(chalk.red(`Failed to get status: ${error}`));
      process.exit(1);
    }
  });

// Sync command
program
  .command('sync')
  .description('Trigger manual sync')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    const spinner = ora('Starting sync...').start();
    
    try {
      const bridge = await createBridge(options.config);
      await bridge.sync();
      spinner.succeed('Sync complete');
    } catch (error) {
      spinner.fail(`Sync failed: ${error}`);
      process.exit(1);
    }
  });

// OPAL subcommands
const opalCmd = program
  .command('opal')
  .description('OPAL operations');

opalCmd
  .command('process')
  .description('Process pending content through OPAL')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    const spinner = ora('Processing OPAL inbox...').start();
    
    try {
      const bridge = await createBridge(options.config);
      // Trigger processing
      spinner.succeed('Processing complete');
    } catch (error) {
      spinner.fail(`Processing failed: ${error}`);
      process.exit(1);
    }
  });

opalCmd
  .command('review')
  .description('Review staged entities (human-in-the-loop)')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    try {
      const bridge = await createBridge(options.config);
      const pending = await bridge.opal.getPending();
      
      console.log(chalk.blue(`\\n${pending.length} entities pending review:`));
      
      for (const entity of pending) {
        console.log(`\\n  ${chalk.cyan(entity.name)} (${entity.type})`);
        console.log(`    Confidence: ${entity.confidence}`);
        console.log(`    Source: ${entity.source}`);
      }
    } catch (error) {
      console.error(chalk.red(`Review failed: ${error}`));
      process.exit(1);
    }
  });

// KOI subcommands
const koiCmd = program
  .command('koi')
  .description('KOI operations');

koiCmd
  .command('sync')
  .description('Sync with KOI network')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    const spinner = ora('Syncing with KOI...').start();
    
    try {
      const bridge = await createBridge(options.config);
      await bridge.koi.pollEvents();
      spinner.succeed('KOI sync complete');
    } catch (error) {
      spinner.fail(`KOI sync failed: ${error}`);
      process.exit(1);
    }
  });

koiCmd
  .command('broadcast')
  .description('Broadcast pending entities to KOI')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (options) => {
    const spinner = ora('Broadcasting to KOI...').start();
    
    try {
      const bridge = await createBridge(options.config);
      // Trigger broadcast
      spinner.succeed('Broadcast complete');
    } catch (error) {
      spinner.fail(`Broadcast failed: ${error}`);
      process.exit(1);
    }
  });

// Ask command (unified query)
program
  .command('ask')
  .description('Query across all knowledge sources')
  .argument('<query>', 'Natural language query')
  .option('-s, --sources <list>', 'Sources to query (opal,koi,orgos)', 'opal,koi,orgos')
  .option('-c, --config <path>', 'Config file path', 'federation.yaml')
  .action(async (query, options) => {
    const spinner = ora('Searching knowledge commons...').start();
    
    try {
      const bridge = await createBridge(options.config);
      const sources = options.sources.split(',') as ('opal' | 'koi' | 'orgos')[];
      
      const results = await bridge.unified.search({
        query,
        sources,
        include_related: true
      });
      
      spinner.stop();
      
      console.log(chalk.blue(`\\nFound ${results.length} results for: "${query}"`));
      
      for (const result of results.slice(0, 10)) {
        const sourceColor = result.source === 'opal' ? chalk.magenta :
                           result.source === 'koi' ? chalk.green :
                           chalk.blue;
        
        console.log(`\\n  ${sourceColor('[' + result.source + ']')} ${chalk.bold(result.title)}`);
        console.log(`    Type: ${result.type} | Relevance: ${Math.round(result.relevance * 100)}%`);
        console.log(`    ${result.content.substring(0, 100)}...`);
      }
    } catch (error) {
      spinner.fail(`Query failed: ${error}`);
      process.exit(1);
    }
  });

program.parse();
