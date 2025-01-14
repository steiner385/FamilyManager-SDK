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

async function runTest(storyFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Testing ${storyFile} ===\n`);
    
    const testProcess = exec(`node ./scripts/test-storybook.mjs ${storyFile}`);
    
    let output = '';
    let errorOutput = '';
    
    testProcess.stdout.on('data', (data) => {
      output += data;
      process.stdout.write(data);
    });
    
    testProcess.stderr.on('data', (data) => {
      errorOutput += data;
      process.stderr.write(data);
    });
    
    testProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`\n✓ ${storyFile} tests passed\n`);
        resolve();
      } else {
        console.error(`\n✗ ${storyFile} tests failed with code ${code}\n`);
        console.error('Error output:', errorOutput);
        failedTests.push({ file: storyFile, error: errorOutput });
        resolve(); // Resolve anyway to continue with other tests
      }
    });
    
    testProcess.on('error', (err) => {
      console.error(`Error running tests for ${storyFile}:`, err);
      failedTests.push({ file: storyFile, error: err.message });
      resolve(); // Resolve anyway to continue with other tests
    });
  });
}

// Run tests sequentially
async function runAllTests() {
  for (const storyFile of storyFiles) {
    await runTest(storyFile);
  }
  
  // Report results
  console.log('\n=== Test Results ===\n');
  console.log(`Total stories: ${storyFiles.length}`);
  console.log(`Passed: ${storyFiles.length - failedTests.length}`);
  console.log(`Failed: ${failedTests.length}`);
  
  if (failedTests.length > 0) {
    console.log('\nFailed stories:');
    failedTests.forEach(({ file, error }) => {
      console.log(`\n- ${file}`);
      console.log('Error details:');
      console.log(error);
    });
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
