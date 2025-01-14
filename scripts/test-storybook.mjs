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

// Start storybook in CI mode
console.log('Starting Storybook server...');
const storybook = spawn('npx', ['storybook', 'dev', '--ci', '--port', '6011'], {
  stdio: ['pipe', 'pipe', 'pipe'], // Explicitly set all streams to pipe
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' } // Force colored output
});

let serverStarted = false;

// Handle storybook process output
storybook.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  if (output.includes('Storybook') && output.includes('started')) {
    serverStarted = true;
  }
});

storybook.stderr.on('data', (data) => {
  console.error(`Storybook error: ${data}`);
});

storybook.on('error', (error) => {
  console.error('Failed to start Storybook:', error);
  cleanup();
  process.exit(1);
});

function cleanup() {
  console.log('Cleaning up...');
  storybook.kill();
  try {
    execSync('pkill -f storybook || true');
  } catch (error) {
    // Ignore cleanup errors
  }
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Wait for storybook to be ready then run tests
async function runTests() {
  try {
    console.log('Waiting for Storybook server to be ready...');
    
    // Wait for server to start
    await waitOn({
      resources: ['http://localhost:6011'],
      timeout: 90000,
      interval: 1000,
      validateStatus: function(status) {
        return status === 200;
      },
      verbose: true
    });

    if (!serverStarted) {
      throw new Error('Storybook server failed to start properly');
    }

    console.log('Storybook server is ready!');
    console.log(`Running tests for ${storyFile}...`);
    
    // Run the tests with specific testMatch pattern
    const testProcess = spawn('npx', [
      'test-storybook',
      '--ci',
      '--url', 'http://localhost:6011',
      '--timeout', '90000',
      '--verbose',
      '--testMatch', testPattern
    ], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    return new Promise((resolve, reject) => {
      testProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Test process exited with code ${code}`));
        }
      });

      testProcess.on('error', (error) => {
        reject(error);
      });
    });

  } catch (error) {
    console.error('Error during test execution:', error);
    throw error;
  } finally {
    cleanup();
  }
}

// Run tests and handle errors
runTests()
  .then(() => {
    console.log(`✓ ${storyFile} tests passed`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`✗ ${storyFile} tests failed:`, error);
    process.exit(1);
  });
