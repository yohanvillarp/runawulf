#!/usr/bin/env node

/**
 * Runawulf — File Length & Component Modularity Enforcer
 * 
 * Verifies that source files do not exceed recommended modularity thresholds:
 * - UI / React Components (.tsx): Max 250 lines
 * - TypeScript Logic Modules (.ts): Max 350 lines
 * 
 * Excludes: generated files, build outputs, tests, type declarations, legacy code.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const LIMITS = {
  '.tsx': 250, // React components, views, widgets
  '.ts': 350,  // Backend modules, services, bus routers
};

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '.nyc_output',
  'legacy',
  'plans',
]);

const IGNORED_EXTENSIONS = new Set([
  '.d.ts',
  '.test.ts',
  '.test.tsx',
  '.spec.ts',
  '.spec.tsx',
]);

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
}

function scanDirectory(dir, violations) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath, violations);
      }
      continue;
    }

    const ext = path.extname(entry.name);
    if (!LIMITS[ext]) continue;

    // Check ignored suffixes like .d.ts
    const isIgnored = Array.from(IGNORED_EXTENSIONS).some(ignoredExt => entry.name.endsWith(ignoredExt));
    if (isIgnored) continue;

    const lines = countLines(fullPath);
    const maxAllowed = LIMITS[ext];

    if (lines > maxAllowed) {
      const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
      violations.push({
        path: relPath,
        lines,
        maxAllowed,
        excess: lines - maxAllowed,
        ext,
      });
    }
  }
}

function run() {
  const violations = [];
  const targetDirs = ['apps', 'packages'].map(d => path.join(ROOT_DIR, d));

  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir, violations);
    }
  }

  if (violations.length > 0) {
    console.error('\n❌ [Runawulf Quality Gate] File Length & Modularity Violations Detected:\n');
    console.error('To preserve maintainability, files must not exceed their modularity limits:');
    console.error(' - React Components (.tsx): Max 250 lines');
    console.error(' - TypeScript Logic (.ts):  Max 350 lines\n');

    for (const v of violations) {
      console.error(
        `  • ${v.path}: ${v.lines} lines (Max: ${v.maxAllowed}, +${v.excess} lines)`
      );
    }

    console.error('\n💡 Action Required:');
    console.error('  Extract sub-components (widgets, features, entities) or split services using');
    console.error('  the Single Responsibility Principle before committing.\n');

    process.exit(1);
  }

  console.log('✅ [Runawulf Quality Gate] All source files respect modularity and line limits.');
  process.exit(0);
}

run();
