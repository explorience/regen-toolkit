#!/usr/bin/env node
/**
 * Streamlined Setup - Pure Node.js, no dependencies
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const orgPath = process.cwd();

// Auto-detect org-os
function detectOrgOs() {
  const methods = [
    'federation.yaml',
    'AGENTS.md',
    '.well-known/org.json',
  ];

  for (const file of methods) {
    if (existsSync(join(orgPath, file))) {
      console.log(`✓ org-os detected via ${file}`);
      return true;
    }
  }
  return false;
}

// Validate structure
function validateOrgStructure() {
  console.log('\nValidating org structure:');
  
  const required = ['federation.yaml'];
  const optional = ['AGENTS.md', 'skills', 'memory'];
  
  for (const file of required) {
    if (!existsSync(join(orgPath, file))) {
      throw new Error(`Missing required: ${file}`);
    }
    console.log(`  ✓ ${file}`);
  }
  
  for (const file of optional) {
    if (existsSync(join(orgPath, file))) {
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  ⚠ ${file} (optional)`);
    }
  }
}

// Setup
function setupExistingOrg() {
  console.log('\n🦞 org-os Agents Setup\n');
  
  if (!detectOrgOs()) {
    console.log('❌ No org-os detected');
    console.log('\nMake sure you have federation.yaml or AGENTS.md in this directory');
    process.exit(1);
  }
  
  try {
    validateOrgStructure();
    
    // Create .paperclip if missing
    const paperclipDir = join(orgPath, '.paperclip');
    if (!existsSync(paperclipDir)) {
      mkdirSync(paperclipDir, { recursive: true });
      console.log('  ✓ Created .paperclip directory');
    }
    
    // Create config if missing
    const configPath = join(paperclipDir, 'config.yaml');
    if (!existsSync(configPath)) {
      writeFileSync(configPath, `# Paperclip Configuration
database:
  type: embedded
  path: ./.paperclip/db

server:
  port: 3100
  host: 0.0.0.0

sync:
  interval: 300000
`);
      console.log('  ✓ Created .paperclip/config.yaml');
    }
    
    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('  npm run agents:dev    # Start dashboard at http://localhost:3100');
  } catch (e) {
    console.error('\n❌ Setup failed:', e.message);
    process.exit(1);
  }
}

setupExistingOrg();
