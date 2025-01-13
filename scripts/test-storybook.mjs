#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get story file name from command line argument
const storyFile = process.argv[2];
if (!storyFile) {
  console.error('Please provide a story file name as an argument');
  console.error('Example: node test-storybook.js LoadingSpinner.stories.tsx');
  process.exit(1);
}

// Convert story file name to testMatch pattern
const testPattern = `**/src/stories/${storyFile}`;
console.log(`Running tests for story: ${testPattern}`);

// Kill any existing storybook processes
try {
  console.log('Cleaning up any existing storybook processes...');
  execSync('pkill -f storybook || true');
} catch (error) {
  // Ignore errors from pkill
}

console.log('Starting Storybook tests in CI mode...');

// Start storybook in CI mode
const storybook = spawn('npx', ['storybook', 'dev', '--ci', '--port', '6011'], {
  stdio: 'pipe',
  shell: true
});

// Handle storybook process output
storybook.stdout.on('data', (data) => {
  console.log('Storybook:', data.toString());
});

storybook.stderr.on('data', (data) => {
  console.error('Storybook Error:', data.toString());
});

// Handle storybook process errors
storybook.on('error', (error) => {
  console.error('Failed to start Storybook:', error);
  process.exit(1);
});

storybook.on('close', (code) => {
  if (code !== null) {
    console.log(`Storybook process exited with code ${code}`);
  }
});

// Wait for storybook to be ready then run tests
async function runTests() {
  try {
    console.log('Waiting for Storybook server to be ready...');
    
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        await waitOn({
          resources: ['http://localhost:6011/iframe.html'],
          timeout: 60000,
          interval: 1000,
          validateStatus: function(status) {
            return status === 200;
          },
          verbose: true
        });
        console.log('Storybook server is ready!');
        break;
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw new Error(`Failed to start Storybook after ${maxRetries} attempts: ${error.message}`);
        }
        console.log(`Retry ${retries}/${maxRetries}: Waiting for Storybook server...`);
      }
    }

    // Add a small delay to ensure the server is fully initialized
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Running tests for ${storyFile}...`);
    
    // Run the tests with specific testMatch pattern
    const testProcess = spawn('npx', ['test-storybook', 
      '--ci',
      '--url', 'http://localhost:6011',
      '--timeout', '60000',
      '--verbose',
      '--testMatch', testPattern,
      '--config-dir', '.storybook'
    ], {
      stdio: 'pipe',
      shell: true
    });

    // Capture and log output
    testProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    testProcess.stderr.on('data', (data) => {
      console.error('Error:', data.toString());
    });

    testProcess.on('close', (code) => {
      console.log(`Test process exited with code ${code}`);
      
      // Kill storybook process
      console.log('Cleaning up...');
      storybook.kill();
      execSync('pkill -f storybook || true');
      
      process.exit(code);
    });

  } catch (error) {
    console.error('Error during test execution:', error);
    storybook.kill();
    execSync('pkill -f storybook || true');
    process.exit(1);
  }
}

runTests();
