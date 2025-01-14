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

// Build storybook first
try {
  console.log('Building Storybook...');
  execSync('npm run build-storybook', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build Storybook:', error);
  process.exit(1);
}

console.log('Starting Storybook server...');

// Start storybook in CI mode
const storybook = spawn('npx', ['storybook', 'dev', '--ci', '--port', '6011'], {
  stdio: 'pipe', // Change to pipe to capture all output
  shell: true
});

// Handle storybook process output
storybook.stdout?.on('data', (data) => {
  console.log(`Storybook: ${data}`);
});

storybook.stderr?.on('data', (data) => {
  console.error(`Storybook error: ${data}`);
});

storybook.on('error', (error) => {
  console.error('Failed to start Storybook:', error);
  process.exit(1);
});

// Handle storybook process exit
storybook.on('exit', (code, signal) => {
  if (code !== null) {
    console.log(`Storybook process exited with code ${code}`);
  }
  if (signal !== null) {
    console.log(`Storybook process was killed with signal ${signal}`);
  }
});

// Wait for storybook to be ready then run tests
async function runTests() {
  try {
    console.log('Waiting for Storybook server to be ready...');
    
    await waitOn({
      resources: ['http://localhost:6011'],
      timeout: 90000, // Increase timeout to 90 seconds
      interval: 1000,
      validateStatus: function(status) {
        return status === 200;
      },
      verbose: true
    });

    console.log('Storybook server is ready!');

    // Add a longer delay to ensure the server is fully initialized
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log(`Running tests for ${storyFile}...`);
    
    // Run the tests with specific testMatch pattern
    const testProcess = spawn('npx', [
      'test-storybook',
      '--ci',
      '--url', 'http://localhost:6011',
      '--timeout', '90000',
      '--verbose',
      '--debug',
      '--testMatch', testPattern
    ], {
      stdio: 'inherit',
      shell: true
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
    // Cleanup
    storybook.kill();
    try {
      execSync('pkill -f storybook || true');
    } catch (error) {
      // Ignore cleanup errors
    }
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
