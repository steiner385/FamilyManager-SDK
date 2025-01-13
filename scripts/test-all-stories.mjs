#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all story files
const storiesDir = path.join(__dirname, '../src/stories');
const storyFiles = fs.readdirSync(storiesDir)
  .filter(file => file.endsWith('.stories.tsx'));

console.log('Found story files:', storyFiles);

// Run tests for each story file
let failedTests = [];

for (const storyFile of storyFiles) {
  console.log(`\n=== Testing ${storyFile} ===\n`);
  try {
    execSync(`node ./scripts/test-storybook.mjs ${storyFile}`, {
      stdio: 'inherit'
    });
    console.log(`\n✓ ${storyFile} tests passed\n`);
  } catch (error) {
    console.error(`\n✗ ${storyFile} tests failed\n`);
    failedTests.push(storyFile);
  }
}

// Report results
console.log('\n=== Test Results ===\n');
console.log(`Total stories: ${storyFiles.length}`);
console.log(`Passed: ${storyFiles.length - failedTests.length}`);
console.log(`Failed: ${failedTests.length}`);

if (failedTests.length > 0) {
  console.log('\nFailed stories:');
  failedTests.forEach(file => console.log(`- ${file}`));
  process.exit(1);
}
