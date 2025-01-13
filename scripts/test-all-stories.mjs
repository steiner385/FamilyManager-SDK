#!/usr/bin/env node

import { exec } from 'child_process';
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
  
  // Use exec instead of execSync to capture output
  const testProcess = exec(`node ./scripts/test-storybook.mjs ${storyFile}`);
  
  // Capture and display stdout
  testProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  
  // Capture and display stderr
  testProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  
  // Wait for process to complete
  try {
    await new Promise((resolve, reject) => {
      testProcess.on('exit', (code) => {
        if (code === 0) {
          console.log(`\n✓ ${storyFile} tests passed\n`);
          resolve();
        } else {
          console.error(`\n✗ ${storyFile} tests failed with code ${code}\n`);
          failedTests.push(storyFile);
          resolve();
        }
      });
      
      testProcess.on('error', (err) => {
        console.error(`Error running tests for ${storyFile}:`, err);
        failedTests.push(storyFile);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error in test execution for ${storyFile}:`, error);
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
