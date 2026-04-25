#!/usr/bin/env node

/**
 * Generate all EIP-4824 compliant schemas from operational data
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read federation.yaml to get identity values
const federationPath = path.join(rootDir, 'federation.yaml');
const federationContent = yaml.load(fs.readFileSync(federationPath, 'utf-8'));
const daoURI = federationContent?.identity?.daoURI || 'https://org.example.com/.well-known/dao.json';
let baseUrl = 'org.example.com';
try {
  const daoUrl = new URL(daoURI);
  baseUrl = daoUrl.host;
} catch {
  baseUrl = 'org.example.com';
}
const orgName = federationContent?.identity?.name || 'Organization';
const orgType = federationContent?.identity?.type || 'Organization';

// Read dao.json to get organization info
const daoJsonPath = path.join(rootDir, '.well-known', 'dao.json');
let daoJson = {};
if (fs.existsSync(daoJsonPath)) {
  daoJson = JSON.parse(fs.readFileSync(daoJsonPath, 'utf-8'));
}

console.log('Generating EIP-4824 schemas...');

function generateDao() {
  const templatePath = path.join(rootDir, '.well-known', 'dao.json.template');
  const outputPath = path.join(rootDir, '.well-known', 'dao.json');

  if (!fs.existsSync(templatePath)) {
    return;
  }

  const description =
    'ReFi DAO operational identity surface for governance, members, projects, and coordination.';
  let template = fs.readFileSync(templatePath, 'utf-8');
  template = template.replace(/{{ORGANIZATION_NAME}}/g, orgName);
  template = template.replace(/{{ORGANIZATION_DESCRIPTION}}/g, description);
  template = template.replace(/{{BASE_URL}}/g, baseUrl);

  const daoJson = JSON.parse(template);
  daoJson.type = orgType;
  fs.writeFileSync(outputPath, JSON.stringify(daoJson, null, 2));
  console.log('✓ Generated dao.json');
}

// Generate members.json
function generateMembers() {
  const membersPath = path.join(rootDir, 'data', 'members.yaml');
  if (!fs.existsSync(membersPath)) {
    return;
  }

  const membersData = yaml.load(fs.readFileSync(membersPath, 'utf-8'));
  const members = (membersData?.members || []).map(m => ({
    id: m.id
  }));

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "DAO",
    "members": members
  };

  const outputPath = path.join(rootDir, '.well-known', 'members.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log('✓ Generated members.json');
}

// Generate meetings.json
function generateMeetings() {
  const meetingsYamlPath = path.join(rootDir, 'data', 'meetings.yaml');
  const meetingsDir = path.join(rootDir, 'content', 'meetings');

  const meetings = [];

  if (fs.existsSync(meetingsYamlPath)) {
    const meetingsData = yaml.load(fs.readFileSync(meetingsYamlPath, 'utf-8'));
    if (Array.isArray(meetingsData?.meetings)) {
      meetings.push(...meetingsData.meetings);
    }
  }

  const files = fs.existsSync(meetingsDir)
    ? fs.readdirSync(meetingsDir).filter(f => f.endsWith('.md'))
    : [];

  for (const file of files) {
    const filePath = path.join(meetingsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    if (!data.id) continue;

    // Extract action items from content
    const actionItems = [];
    const actionItemRegex = /- \[ \] (.+?)(?: \(@([A-Za-z0-9:_.\/-]+)(?:, due: (\d{4}-\d{2}-\d{2}))?\))?(?: #([A-Za-z0-9:_./-]+))?/g;
    let match;
    while ((match = actionItemRegex.exec(content)) !== null) {
      actionItems.push({
        id: match[4] || `action-${actionItems.length + 1}`,
        description: match[1],
        assignee: match[2] || null,
        status: "pending",
        dueDate: match[3] || null
      });
    }

    // Extract decisions
    const decisions = [];
    const decisionRegex = /- \[ \] (.+?)(?: #([A-Za-z0-9:_./-]+))?/g;
    const decisionsSection = content.match(/## Decisions\s+([\s\S]*?)(?=##|$)/);
    if (decisionsSection) {
      let decisionMatch;
      while ((decisionMatch = decisionRegex.exec(decisionsSection[1])) !== null) {
        decisions.push({
          id: decisionMatch[2] || `decision-${decisions.length + 1}`,
          description: decisionMatch[1],
          consensus: false
        });
      }
    }

    meetings.push({
      id: data.id,
      type: data.type || "meeting",
      title: data.title || file.replace('.md', ''),
      date: data.date || new Date().toISOString(),
      participants: data.participants || [],
      status: data.status || "planned",
      agenda: `https://${baseUrl}/meetings/${data.id}#agenda`,
      notes: `https://${baseUrl}/meetings/${data.id}`,
      decisions: decisions,
      actionItems: actionItems
    });
  }

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "MeetingRegistry",
    "meetings": meetings
  };

  const outputPath = path.join(rootDir, '.well-known', 'meetings.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated meetings.json (${meetings.length} meetings)`);
}

// Generate projects.json
function generateProjects() {
  const projectsDir = path.join(rootDir, 'content', 'projects');
  const projectsYamlPath = path.join(rootDir, 'data', 'projects.yaml');
  
  const projects = [];

  // Read from YAML file
  if (fs.existsSync(projectsYamlPath)) {
    const projectsData = yaml.load(fs.readFileSync(projectsYamlPath, 'utf-8'));
    if (projectsData?.projects) {
      projects.push(...projectsData.projects);
    }
  }

  // Read from markdown files
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(projectsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(content);

      if (!data.id) continue;

      // Extract tasks
      const tasks = [];
      const taskRegex = /- \[ \] (.+?)(?: \(@([A-Za-z0-9:_.\/-]+)\))?(?: #([A-Za-z0-9:_./-]+))?/g;
      let taskMatch;
      while ((taskMatch = taskRegex.exec(content)) !== null) {
        tasks.push({
          id: taskMatch[3] || `task-${tasks.length + 1}`,
          description: taskMatch[1],
          assignee: taskMatch[2] || null,
          status: "todo",
          priority: "medium"
        });
      }

      // Extract milestones
      const milestones = [];
      const milestoneRegex = /- \[ \] (.+?) \(due: (\d{4}-\d{2}-\d{2})\)(?: #([A-Za-z0-9:_./-]+))?/g;
      const milestonesSection = content.match(/### Milestones\s+([\s\S]*?)(?=###|$)/);
      if (milestonesSection) {
        let milestoneMatch;
        while ((milestoneMatch = milestoneRegex.exec(milestonesSection[1])) !== null) {
          milestones.push({
            id: milestoneMatch[3] || `milestone-${milestones.length + 1}`,
            title: milestoneMatch[1],
            status: "pending",
            dueDate: milestoneMatch[2]
          });
        }
      }

      projects.push({
        id: data.id,
        type: data.type || "project",
        name: data.name || file.replace('.md', ''),
        description: data.description || '',
        status: data.status || "Integrate",
        lead: data.lead || null,
        members: data.members || [],
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        milestones: milestones,
        tasks: tasks,
        budget: data.budget || null,
        relatedProposals: data.relatedProposals || []
      });
    }
  }

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "ProjectRegistry",
    "projects": projects
  };

  const outputPath = path.join(rootDir, '.well-known', 'projects.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated projects.json (${projects.length} projects)`);
}

// Generate finances.json
function generateFinances() {
  const financesPath = path.join(rootDir, 'data', 'finances.yaml');
  if (!fs.existsSync(financesPath)) {
    return;
  }

  const financesData = yaml.load(fs.readFileSync(financesPath, 'utf-8'));

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "FinancialRegistry",
    "budgets": financesData?.budgets || [],
    "expenses": financesData?.expenses || [],
    "revenues": financesData?.revenues || []
  };

  const outputPath = path.join(rootDir, '.well-known', 'finances.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated finances.json`);
}

// Generate proposals.json (placeholder)
function generateProposals() {
  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "proposals": []
  };

  const outputPath = path.join(rootDir, '.well-known', 'proposals.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log('✓ Generated proposals.json');
}

// Generate activities.json (placeholder)
function generateActivities() {
  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "activities": []
  };

  const outputPath = path.join(rootDir, '.well-known', 'activities.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log('✓ Generated activities.json');
}

// Generate contracts.json (placeholder)
function generateContracts() {
  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "contracts": []
  };

  const outputPath = path.join(rootDir, '.well-known', 'contracts.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log('✓ Generated contracts.json');
}

// Generate ideas.json
function generateIdeas() {
  const ideasPath = path.join(rootDir, 'data', 'ideas.yaml');
  if (!fs.existsSync(ideasPath)) {
    return;
  }

  const ideasData = yaml.load(fs.readFileSync(ideasPath, 'utf-8'));

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "IdeaRegistry",
    "ideas": ideasData?.ideas || []
  };

  const outputPath = path.join(rootDir, '.well-known', 'ideas.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated ideas.json (${(ideasData?.ideas || []).length} ideas)`);
}

// Generate knowledge.json
function generateKnowledge() {
  const manifestPath = path.join(rootDir, 'data', 'knowledge-manifest.yaml');
  const sourcesPath = path.join(rootDir, 'data', 'sources.yaml');

  const manifest = fs.existsSync(manifestPath)
    ? yaml.load(fs.readFileSync(manifestPath, 'utf-8'))
    : {};
  const sources = fs.existsSync(sourcesPath)
    ? yaml.load(fs.readFileSync(sourcesPath, 'utf-8'))
    : {};

  const schema = {
    "@context": "https://www.daostar.org/schemas",
    "type": "KnowledgeCommons",
    "status": manifest?.status || "pending",
    "domains": manifest?.domains || [],
    "sources": (sources?.sources || []).map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      url: s.url || s.feed_url || null,
      status: s.status
    }))
  };

  const outputPath = path.join(rootDir, '.well-known', 'knowledge.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  console.log(`✓ Generated knowledge.json (${(sources?.sources || []).length} sources)`);
}

// Run all generators
try {
  generateDao();
  generateMembers();
  generateMeetings();
  generateProjects();
  generateFinances();
  generateProposals();
  generateActivities();
  generateContracts();
  generateIdeas();
  generateKnowledge();

  console.log('\n✓ All schemas generated successfully!');
} catch (error) {
  console.error('Error generating schemas:', error);
  process.exit(1);
}
