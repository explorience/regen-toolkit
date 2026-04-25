#!/usr/bin/env node

/**
 * Deploy org-os webapps as static sites (GitHub Pages compatible)
 *
 * Builds all packages with a `build` script and copies their dist/
 * output into a single `_site/` directory for deployment.
 *
 * Usage:
 *   node scripts/deploy-pages.mjs              # build all packages
 *   node scripts/deploy-pages.mjs dashboard    # build specific package
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const siteDir = path.join(rootDir, '_site');
const packagesDir = path.join(rootDir, 'packages');

// Webapp packages that can be deployed as static sites
const DEPLOYABLE_PACKAGES = [
  'dashboard',
  'ideation-board',
  'aggregator',
  'system-canvas',
];

const targetPackage = process.argv[2] || null;

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildPackage(pkgName) {
  const pkgDir = path.join(packagesDir, pkgName);
  if (!fs.existsSync(pkgDir)) {
    console.log(`  ⊘ ${pkgName}/ not found, skipping`);
    return false;
  }

  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`  ⊘ ${pkgName}/package.json not found, skipping`);
    return false;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  if (!pkgJson.scripts?.build) {
    console.log(`  ⊘ ${pkgName} has no build script, skipping`);
    return false;
  }

  console.log(`  ▸ Building ${pkgName}...`);
  try {
    execSync('npm run build', { cwd: pkgDir, stdio: 'pipe' });
  } catch (err) {
    console.error(`  ✗ ${pkgName} build failed: ${err.message}`);
    return false;
  }

  // Look for build output in common directories
  const distCandidates = ['dist', 'build', 'out', 'public'];
  for (const candidate of distCandidates) {
    const distPath = path.join(pkgDir, candidate);
    if (fs.existsSync(distPath) && fs.statSync(distPath).isDirectory()) {
      const destPath = path.join(siteDir, pkgName);
      copyDirSync(distPath, destPath);
      console.log(`  ✓ ${pkgName} → _site/${pkgName}/`);
      return true;
    }
  }

  console.log(`  ⊘ ${pkgName} built but no dist directory found`);
  return false;
}

// Main
console.log('Deploying org-os webapps to _site/\n');

// Clean _site
if (fs.existsSync(siteDir)) {
  fs.rmSync(siteDir, { recursive: true });
}
fs.mkdirSync(siteDir, { recursive: true });

// Create index page linking to all apps
const packages = targetPackage ? [targetPackage] : DEPLOYABLE_PACKAGES;
let built = 0;

for (const pkg of packages) {
  if (buildPackage(pkg)) built++;
}

// Generate index.html with links to all built apps
const builtApps = fs.readdirSync(siteDir).filter(f =>
  fs.statSync(path.join(siteDir, f)).isDirectory()
);

if (builtApps.length > 0) {
  const links = builtApps.map(app => `    <li><a href="./${app}/">${app}</a></li>`).join('\n');
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>org-os Apps</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 4rem auto; padding: 0 1rem; }
    a { color: #2563eb; }
    li { margin: 0.5rem 0; }
  </style>
</head>
<body>
  <h1>org-os Apps</h1>
  <ul>
${links}
  </ul>
</body>
</html>`;
  fs.writeFileSync(path.join(siteDir, 'index.html'), indexHtml);
}

console.log(`\n✓ Deployed ${built} package(s) to _site/`);
if (built > 0) {
  console.log('  To serve locally: npx serve _site');
  console.log('  To deploy: push _site/ to gh-pages branch');
}
