#!/usr/bin/env node

/**
 * Generate meetings.json schema from meeting markdown files
 * This is called by generate-all-schemas.mjs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../../');

export function generateMeetingsURI(baseUrl) {
  const meetingsDir = path.join(rootDir, 'content', 'meetings');
  if (!fs.existsSync(meetingsDir)) {
    return { meetings: [] };
  }

  const meetings = [];
  const files = fs.readdirSync(meetingsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(meetingsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    if (!data.id) continue;

    // Extract action items
    const actionItems = [];
    const actionItemRegex = /- \[ \] (.+?)(?: \(@(\w+), due: (\d{4}-\d{2}-\d{2})\))?(?: #(\w+))?/g;
    let match;
    while ((match = actionItemRegex.exec(body)) !== null) {
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
    const decisionRegex = /- \[ \] (.+?)(?: #(\w+))?/g;
    const decisionsSection = body.match(/## Decisions\s+([\s\S]*?)(?=##|$)/);
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

  return { meetings };
}
