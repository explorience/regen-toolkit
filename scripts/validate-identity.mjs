#!/usr/bin/env node

/**
 * Lightweight validation for Organizational OS identity and schema artifacts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const requiredFiles = [
  'federation.yaml',
  '.well-known/dao.json',
  '.well-known/members.json',
  '.well-known/projects.json',
  '.well-known/finances.json',
  '.well-known/meetings.json',
  'data/members.yaml',
  'data/projects.yaml',
  'data/finances.yaml',
  'data/meetings.yaml'
];

let hasErrors = false;

function fail(message) {
  hasErrors = true;
  console.error(`ERROR: ${message}`);
}

function info(message) {
  console.log(`OK: ${message}`);
}

for (const relPath of requiredFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing required file: ${relPath}`);
  } else {
    info(`Found ${relPath}`);
  }
}

const jsonFiles = [
  '.well-known/dao.json',
  '.well-known/members.json',
  '.well-known/projects.json',
  '.well-known/finances.json',
  '.well-known/meetings.json'
];

for (const relPath of jsonFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) continue;
  try {
    JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    info(`Valid JSON: ${relPath}`);
  } catch (err) {
    fail(`Invalid JSON in ${relPath}: ${err.message}`);
  }
}

const daoPath = path.join(rootDir, '.well-known/dao.json');
if (fs.existsSync(daoPath)) {
  const dao = JSON.parse(fs.readFileSync(daoPath, 'utf-8'));
  const requiredDaoFields = [
    'name',
    'description',
    'membersURI',
    'projectsURI',
    'financesURI',
    'meetingsURI'
  ];
  for (const field of requiredDaoFields) {
    if (!dao[field]) {
      fail(`dao.json missing required field: ${field}`);
    }
  }
}

if (hasErrors) {
  console.error('\nValidation failed.');
  process.exit(1);
}

console.log('\nValidation passed.');
