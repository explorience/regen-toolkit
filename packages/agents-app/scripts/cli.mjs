/**
 * CLI Entry Point
 * 
 * Commands:
 * - setup: Initialize agents app
 * - dev: Start development server
 * - sync: Sync org-os with dashboard
 * - status: Show agent status
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const commands: Record<string, { desc: string; run: () => void }> = {
  setup: {
    desc: 'Set up the agents app for this organization',
    run: () => {
      import('./setup.mjs');
    },
  },
  
  dev: {
    desc: 'Start the dashboard in development mode',
    run: () => {
      console.log('🚀 Starting agent dashboard...');
      try {
        execSync('pnpm --filter @org-os/agents-app dev', {
          stdio: 'inherit',
          cwd: resolve('.'),
        });
      } catch (e) {
        console.error('Failed to start dashboard. Is @org-os/agents-app installed?');
        process.exit(1);
      }
    },
  },
  
  sync: {
    desc: 'Synchronize org-os data with dashboard',
    run: () => {
      console.log('🔄 Syncing organization data...');
      // TODO: Implement sync
      console.log('Sync complete');
    },
  },
  
  status: {
    desc: 'Show current agent status',
    run: () => {
      console.log('📊 Agent Status');
      console.log('================');
      // TODO: Query Paperclip API for status
      console.log('No agents running (dashboard not started)');
      console.log('Run: org-os-agents dev');
    },
  },
  
  help: {
    desc: 'Show this help message',
    run: () => {
      console.log('org-os-agents - Manage your AI agent organization\n');
      console.log('Commands:');
      for (const [cmd, { desc }] of Object.entries(commands)) {
        console.log(`  ${cmd.padEnd(10)} ${desc}`);
      }
    },
  },
};

const cmd = process.argv[2] || 'help';

if (commands[cmd]) {
  commands[cmd].run();
} else {
  console.error(`Unknown command: ${cmd}`);
  console.log('Run "org-os-agents help" for available commands');
  process.exit(1);
}
