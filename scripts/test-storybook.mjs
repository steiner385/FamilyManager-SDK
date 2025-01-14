#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import handler from 'serve-handler';

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

async function buildStorybook() {
  console.log('Building Storybook...');
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build-storybook'], {
      stdio: 'inherit',
      shell: true
    });

    build.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Storybook build failed with code ${code}`));
      }
    });

    build.on('error', reject);
  });
}

async function startStaticServer() {
  const server = createServer((request, response) => {
    return handler(request, response, {
      public: 'storybook-static'
    });
  });

  server.listen(6011, () => {
    console.log('Static server running at http://localhost:6011');
  });

  return server;
}

async function runTests() {
  let server;
  try {
    // Build Storybook first
    await buildStorybook();

    // Start static file server
    server = await startStaticServer();

    // Wait for server to be ready
    await waitOn({
      resources: ['http://localhost:6011'],
      timeout: 30000,
      interval: 1000,
      validateStatus: function(status) {
        return status === 200;
      }
    });

    console.log('Server is ready, running tests...');

    // Run the tests
    const testProcess = spawn('npx', [
      'test-storybook',
      '--ci',
      '--url', 'http://localhost:6011',
      '--timeout', '60000',
      '--verbose',
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

      testProcess.on('error', reject);
    });

  } catch (error) {
    console.error('Error during test execution:', error);
    throw error;
  } finally {
    if (server) {
      server.close();
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
