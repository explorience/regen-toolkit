#!/usr/bin/env node

/**
 * Organizational OS Setup Script
 * Interactive setup for configuring organizational identity and packages
 */

import { intro, outro, select, text, confirm, multiselect, isCancel, cancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

intro('Organizational OS Setup');

// Collect organizational information
const orgType = await select({
  message: 'What type of organization is this?',
  options: [
    { value: 'Organization', label: 'Organization (General)' },
    { value: 'DAO', label: 'DAO (Decentralized Autonomous Organization)' },
    { value: 'Cooperative', label: 'Cooperative' },
    { value: 'Project', label: 'Project' },
    { value: 'Foundation', label: 'Foundation' },
    { value: 'Other', label: 'Other' }
  ]
});

if (isCancel(orgType)) {
  cancel('Setup cancelled');
  process.exit(0);
}

const orgName = await text({
  message: 'Organization name:',
  placeholder: 'My Organization'
});

if (isCancel(orgName)) {
  cancel('Setup cancelled');
  process.exit(0);
}

const orgDescription = await text({
  message: 'Organization description:',
  placeholder: 'A brief description of your organization'
});

if (isCancel(orgDescription)) {
  cancel('Setup cancelled');
  process.exit(0);
}

const baseUrl = await text({
  message: 'Base URL (where will this be deployed?):',
  placeholder: 'org.example.com',
  validate: (value) => {
    if (!value) return 'Base URL is required';
    if (value.includes('http')) return 'Please enter just the domain (e.g., org.example.com)';
  }
});

if (isCancel(baseUrl)) {
  cancel('Setup cancelled');
  process.exit(0);
}

// Select operational packages
const packages = await multiselect({
  message: 'Which operational packages would you like to enable?',
  options: [
    { value: 'meetings', label: 'Meetings - Meeting management and action items' },
    { value: 'projects', label: 'Projects - Project tracking with IDEA framework' },
    { value: 'finances', label: 'Finances - Budget and expense tracking' },
    { value: 'coordination', label: 'Coordination - Multi-org coordination tools' },
    { value: 'webapps', label: 'Webapps - Interactive operational tools' },
    { value: 'web3', label: 'Web3 - Optional blockchain features' }
  ],
  required: false
});

if (isCancel(packages)) {
  cancel('Setup cancelled');
  process.exit(0);
}

// ── New v3.0: Agent and network configuration ─────────────────────────────────

const agentRuntime = await select({
  message: 'Which agent runtime will you use?',
  options: [
    { value: 'none', label: 'None (human-operated only)' },
    { value: 'cursor', label: 'Cursor AI (via workspace files)' },
    { value: 'openclaw', label: 'OpenClaw (full agent runtime)' },
    { value: 'custom', label: 'Custom agent runtime' }
  ]
});

if (isCancel(agentRuntime)) { cancel('Setup cancelled'); process.exit(0); }

const networkName = await text({
  message: 'Federation network name (optional — press Enter to skip):',
  placeholder: 'regen-coordination'
});
if (isCancel(networkName)) { cancel('Setup cancelled'); process.exit(0); }

const orgEmoji = await text({
  message: 'Organization emoji (optional):',
  placeholder: '🌱'
});
if (isCancel(orgEmoji)) { cancel('Setup cancelled'); process.exit(0); }

// ── Initialize workspace files ────────────────────────────────────────────────

// SOUL.md - only write if it's still the template placeholder
const soulPath = path.join(rootDir, 'SOUL.md');
const soulContent = fs.readFileSync(soulPath, 'utf-8');
if (soulContent.includes('_This file defines the organization')) {
  const updatedSoul = soulContent.replace(
    /Example:\n> We coordinate.*?\n\n/s,
    `\n${orgDescription}\n\n`
  );
  fs.writeFileSync(soulPath, updatedSoul);
}

// IDENTITY.md - fill in the basics
const identityPath = path.join(rootDir, 'IDENTITY.md');
let identityContent = fs.readFileSync(identityPath, 'utf-8');
identityContent = identityContent.replace(
  /\*\*Name:\*\* _\(e\.g\..+?\)_/,
  `**Name:** ${orgName}`
);
identityContent = identityContent.replace(
  /\*\*Type:\*\* _\(DAO.+?\)_/,
  `**Type:** ${orgType}`
);
if (orgEmoji && String(orgEmoji).trim()) {
  identityContent = identityContent.replace(
    /\*\*Emoji:\*\* _\(.+?\)_/,
    `**Emoji:** ${orgEmoji}`
  );
}
identityContent = identityContent.replace(
  /\*\*daoURI:\*\* `https:\/\/\[your-org\]\.github\.io\/\.well-known\/dao\.json`/,
  `**daoURI:** \`https://${baseUrl}/.well-known/dao.json\``
);
fs.writeFileSync(identityPath, identityContent);

// MEMORY.md - set creation date
const memoryPath = path.join(rootDir, 'MEMORY.md');
let memoryContent = fs.readFileSync(memoryPath, 'utf-8');
const initDate = new Date().toISOString().split('T')[0];
memoryContent = memoryContent.replace(
  /## Organizational History\n\n- \[DATE\] Organization founded/,
  `## Organizational History\n\n- [${initDate}] Workspace initialized via setup script`
);
fs.writeFileSync(memoryPath, memoryContent);

// HEARTBEAT.md - set last updated date
const heartbeatPath = path.join(rootDir, 'HEARTBEAT.md');
let heartbeatContent = fs.readFileSync(heartbeatPath, 'utf-8');
heartbeatContent = heartbeatContent.replace(
  /_Last updated: \[DATE\]_/,
  `_Last updated: ${initDate}_`
);
fs.writeFileSync(heartbeatPath, heartbeatContent);

// Create initial memory entry
const memoryDirPath = path.join(rootDir, 'memory');
if (!fs.existsSync(memoryDirPath)) {
  fs.mkdirSync(memoryDirPath, { recursive: true });
}
const todayMemoryPath = path.join(memoryDirPath, `${initDate}.md`);
if (!fs.existsSync(todayMemoryPath)) {
  const initMemoryContent = `# ${initDate}

## Workspace Initialization

- Workspace created: ${orgName} (${orgType})
- Agent runtime configured: ${agentRuntime}
- Packages enabled: ${Array.isArray(packages) ? packages.join(', ') || 'none' : 'none'}
- daoURI: https://${baseUrl}/.well-known/dao.json
- Network: ${networkName || 'not configured'}

## Next Steps

- [ ] Fill in SOUL.md with organization mission and values
- [ ] Fill in IDENTITY.md with chain addresses and governance details
- [ ] Fill in USER.md with operator preferences
- [ ] Add members to data/members.yaml
- [ ] Configure channels in TOOLS.md
- [ ] Run: npm run generate:schemas
`;
  fs.writeFileSync(todayMemoryPath, initMemoryContent);
}

// Create knowledge directory structure for declared domains
const knowledgeDirPath = path.join(rootDir, 'knowledge');
if (!fs.existsSync(knowledgeDirPath)) {
  fs.mkdirSync(knowledgeDirPath, { recursive: true });
}

// Update federation.yaml
const federationPath = path.join(rootDir, 'federation.yaml');
let federationContent = fs.readFileSync(federationPath, 'utf-8');

// v3.0 identity fields
federationContent = federationContent.replace(
  /type: "Organization"/,
  `type: "${orgType}"`
);
federationContent = federationContent.replace(
  /name: "Your Organization Name"/,
  `name: "${orgName}"`
);
if (orgEmoji && String(orgEmoji).trim()) {
  federationContent = federationContent.replace(
    /emoji: ""/,
    `emoji: "${orgEmoji}"`
  );
}
federationContent = federationContent.replace(
  /daoURI: "https:\/\/org\.example\.com\/\.well-known\/dao\.json"/,
  `daoURI: "https://${baseUrl}/.well-known/dao.json"`
);

// v3.0 network and agent fields
if (networkName && String(networkName).trim()) {
  federationContent = federationContent.replace(
    /^network: ""/m,
    `network: "${networkName}"`
  );
}
federationContent = federationContent.replace(
  /runtime: "none"/,
  `runtime: "${agentRuntime}"`
);
if (agentRuntime !== 'none') {
  federationContent = federationContent.replace(
    /proactive: false/,
    `proactive: true`
  );
}

// Update package flags
const packageFlags = {
  meetings: packages.includes('meetings'),
  projects: packages.includes('projects'),
  finances: packages.includes('finances'),
  coordination: packages.includes('coordination'),
  webapps: packages.includes('webapps'),
  web3: packages.includes('web3')
};

federationContent = federationContent.replace(
  /meetings: false/,
  `meetings: ${packageFlags.meetings}`
);
federationContent = federationContent.replace(
  /projects: false/,
  `projects: ${packageFlags.projects}`
);
federationContent = federationContent.replace(
  /finances: false/,
  `finances: ${packageFlags.finances}`
);
federationContent = federationContent.replace(
  /coordination: false/,
  `coordination: ${packageFlags.coordination}`
);
federationContent = federationContent.replace(
  /webapps: false/,
  `webapps: ${packageFlags.webapps}`
);
federationContent = federationContent.replace(
  /web3: false/,
  `web3: ${packageFlags.web3}`
);

// Set creation date
const now = new Date().toISOString();
federationContent = federationContent.replace(
  /created: ""/,
  `created: "${now}"`
);
federationContent = federationContent.replace(
  /last_updated: ""/,
  `last_updated: "${now}"`
);

fs.writeFileSync(federationPath, federationContent);

// Generate initial dao.json
const daoJsonPath = path.join(rootDir, '.well-known', 'dao.json');
let daoJsonTemplate = fs.readFileSync(path.join(rootDir, '.well-known', 'dao.json.template'), 'utf-8');

daoJsonTemplate = daoJsonTemplate.replace(/{{ORGANIZATION_NAME}}/g, orgName);
daoJsonTemplate = daoJsonTemplate.replace(/{{ORGANIZATION_DESCRIPTION}}/g, orgDescription);
daoJsonTemplate = daoJsonTemplate.replace(/{{BASE_URL}}/g, baseUrl);
daoJsonTemplate = daoJsonTemplate.replace(/"Organization"/, `"${orgType}"`);

fs.writeFileSync(daoJsonPath, daoJsonTemplate);

// Generate initial schema files
const schemaFiles = ['members.json', 'proposals.json', 'activities.json', 'contracts.json'];
if (packageFlags.meetings) schemaFiles.push('meetings.json');
if (packageFlags.projects) schemaFiles.push('projects.json');
if (packageFlags.finances) schemaFiles.push('finances.json');

for (const schemaFile of schemaFiles) {
  const templatePath = path.join(rootDir, '.well-known', `${schemaFile}.template`);
  const outputPath = path.join(rootDir, '.well-known', schemaFile);
  
  if (fs.existsSync(templatePath)) {
    let template = fs.readFileSync(templatePath, 'utf-8');
    template = template.replace(/{{BASE_URL}}/g, baseUrl);
    fs.writeFileSync(outputPath, template);
  }
}

// Create governance.md
const governancePath = path.join(rootDir, 'content', 'governance', 'governance.md');
const governanceDir = path.dirname(governancePath);
if (!fs.existsSync(governanceDir)) {
  fs.mkdirSync(governanceDir, { recursive: true });
}

const governanceContent = `---
title: Governance
---

# Governance

## ${orgName}

${orgDescription}

## Decision-Making Model

[Describe your organization's decision-making process]

## Proposals

[Link to proposals: \`/.well-known/proposals.json\`](/.well-known/proposals.json)

## Members

[Link to members: \`/.well-known/members.json\`](/.well-known/members.json)

## Governance Documents

- [Governance Process](./governance-process.md)
- [Bylaws](./bylaws.md)
`;

fs.writeFileSync(governancePath, governanceContent);

// Create index.md
const indexPath = path.join(rootDir, 'content', 'index.md');
if (!fs.existsSync(indexPath)) {
  const indexContent = `---
title: ${orgName}
---

# ${orgName}

${orgDescription}

## Organizational Identity

This organization publishes its identity via EIP-4824 compliant schemas:

- [daoURI](/.well-known/dao.json) - Main organizational identity
- [Members](/.well-known/members.json) - Membership registry
- [Proposals](/.well-known/proposals.json) - Governance proposals
- [Governance](/governance) - Governance documentation

## Operations

${packageFlags.meetings ? '- [Meetings](/meetings) - Meeting management\n' : ''}${packageFlags.projects ? '- [Projects](/projects) - Project tracking\n' : ''}${packageFlags.finances ? '- [Finances](/finances) - Financial management\n' : ''}

## Resources

- [Documentation](/docs)
- [Resources](/resources)
`;

  fs.writeFileSync(indexPath, indexContent);
}

// ── Notion Integration (optional) ──────────────────────────────────────────

const setupNotion = await confirm({
  message: 'Set up Notion integration? (optional — Claude Code/Cursor users get this via MCP)',
  initialValue: false,
});

if (isCancel(setupNotion)) {
  cancel('Setup cancelled');
  process.exit(0);
}

if (setupNotion) {
  const notionKey = await text({
    message: 'Notion API key (from https://www.notion.so/profile/integrations):',
    placeholder: 'ntn_...',
    validate: (value) => {
      if (!value) return 'API key is required if setting up Notion';
      if (!value.startsWith('ntn_') && !value.startsWith('secret_'))
        return 'Key should start with "ntn_" or "secret_"';
    },
  });

  if (isCancel(notionKey)) {
    cancel('Setup cancelled');
    process.exit(0);
  }

  const envPath = path.join(rootDir, '.env');
  const envContent = `# ReFi BCN OS — local environment\nNOTION_API_KEY=${notionKey}\n`;
  fs.writeFileSync(envPath, envContent);
  console.log('  ✓ Wrote .env with NOTION_API_KEY');
  console.log('  → Now share your Notion databases with the integration in Notion settings');
}

outro(`Setup complete for ${orgName}!

Next steps:
1. Fill in SOUL.md — organization values, mission, voice
2. Fill in IDENTITY.md — chain addresses, governance contracts
3. Fill in USER.md — operator profile and preferences
4. Configure TOOLS.md — channel IDs, API endpoints
5. Add members to data/members.yaml
6. Run: npm run generate:schemas
7. Run BOOTSTRAP.md ritual if using an agent runtime
8. Commit and push to deploy

Memory entry created at: memory/${initDate}.md
Agent runtime: ${agentRuntime}
`);
