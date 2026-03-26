#!/usr/bin/env node
/**
 * Reads all .md files in src/content/docs/ and extracts frontmatter
 * into public/tags/articles.json for the tag explorer.
 * 
 * Run: node scripts/generate-tags-json.js
 */
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'src', 'content', 'docs');
const outFile = path.join(__dirname, '..', 'public', 'tags', 'articles.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentSubKey = null;
  let inArray = false;
  let inObject = false;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Top-level key: value
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.+)/);
    if (kvMatch && !line.startsWith('  ')) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      // Remove quotes
      val = val.replace(/^['"](.*)['"]$/, '$1');
      if (val === '') {
        fm[currentKey] = {};
        inObject = true;
        inArray = false;
      } else {
        fm[currentKey] = val;
        inObject = false;
        inArray = false;
      }
      currentSubKey = null;
      continue;
    }
    
    // Top-level key with no value (object or will have sub-items)
    const keyOnly = line.match(/^(\w[\w-]*)\s*:\s*$/);
    if (keyOnly) {
      currentKey = keyOnly[1];
      fm[currentKey] = {};
      inObject = true;
      inArray = false;
      currentSubKey = null;
      continue;
    }
    
    // Array item: "  - value"
    const arrMatch = line.match(/^  - (.+)/);
    if (arrMatch && currentKey) {
      const val = arrMatch[1].trim().replace(/^['"](.*)['"]$/, '$1');
      if (!Array.isArray(fm[currentKey])) {
        fm[currentKey] = [];
      }
      fm[currentKey].push(val);
      inArray = true;
      inObject = false;
      continue;
    }
    
    // Sub-key under object: "  subkey: value"
    const subKvMatch = line.match(/^  (\w[\w-]*)\s*:\s*(.+)/);
    if (subKvMatch && currentKey && typeof fm[currentKey] === 'object' && !Array.isArray(fm[currentKey])) {
      let val = subKvMatch[2].trim().replace(/^['"](.*)['"]$/, '$1');
      fm[currentKey][subKvMatch[1]] = val;
      currentSubKey = subKvMatch[1];
      continue;
    }
    
    // Sub-key with no value (will have array items)
    const subKeyOnly = line.match(/^  (\w[\w-]*)\s*:\s*$/);
    if (subKeyOnly && currentKey && typeof fm[currentKey] === 'object' && !Array.isArray(fm[currentKey])) {
      currentSubKey = subKeyOnly[1];
      fm[currentKey][currentSubKey] = [];
      continue;
    }
    
    // Array item under sub-key: "    - value"
    const subArrMatch = line.match(/^    - (.+)/);
    if (subArrMatch && currentKey && currentSubKey) {
      const val = subArrMatch[1].trim().replace(/^['"](.*)['"]$/, '$1');
      if (!Array.isArray(fm[currentKey][currentSubKey])) {
        fm[currentKey][currentSubKey] = [];
      }
      fm[currentKey][currentSubKey].push(val);
      continue;
    }
  }
  
  return fm;
}

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
const articles = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(docsDir, file), 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;
  
  articles.push({
    slug: file.replace('.md', ''),
    title: fm.title || file.replace('.md', '').replace(/-/g, ' '),
    description: fm.description || '',
    tags: fm.tags || null,
    audience: fm.audience || null,
    maturity: fm.maturity || null,
    related: fm.related || null,
    status: fm.status || 'draft'
  });
}

// Sort alphabetically by title
articles.sort((a, b) => a.title.localeCompare(b.title));

// Ensure output dir exists
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(articles, null, 2));

console.log(`Generated ${articles.length} articles in ${outFile}`);
