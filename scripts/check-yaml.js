#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const YAML = require("yaml");

const IGNORED_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".system_generated",
  "legacy",
]);

function findYamlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        findYamlFiles(path.join(dir, entry.name), fileList);
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml"))
    ) {
      fileList.push(path.join(dir, entry.name));
    }
  }
  return fileList;
}

const rootDir = process.cwd();
const files = process.argv.slice(2);
const targetFiles = files.length > 0 ? files : findYamlFiles(rootDir);

let errorCount = 0;

for (const file of targetFiles) {
  const relativePath = path.relative(rootDir, file);
  try {
    const content = fs.readFileSync(file, "utf8");
    // Handle multiple documents in a single YAML file (--- separators)
    YAML.parseAllDocuments(content).forEach((doc) => {
      if (doc.errors.length > 0) {
        for (const err of doc.errors) {
          console.error(`❌ [YAML Error] in ${relativePath}:${err.linePos?.[0]?.line || 1}: ${err.message}`);
          errorCount++;
        }
      }
    });
  } catch (err) {
    console.error(`❌ [YAML Fatal] Failed to read/parse ${relativePath}: ${err.message}`);
    errorCount++;
  }
}

if (errorCount > 0) {
  console.error(`\n🚨 Found ${errorCount} YAML syntax error(s). Please fix before committing.`);
  process.exit(1);
} else {
  console.log(`✅ [Runawulf YAML Guard] Verified ${targetFiles.length} YAML file(s). All syntax valid.`);
  process.exit(0);
}
