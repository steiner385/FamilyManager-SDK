#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import waitOn from 'wait-on';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import handler from 'serve-handler';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable console output flushing
process.stdout._handle?.setBlocking?.(true);
process.stderr._handle?.setBlocking?.(true);

// Get story file name from command line argument
const storyFile = process.argv[2];
if (!storyFile) {
  console.error('Please provide a story file name as an argument');
  console.error('Example: node test-storybook.js LoadingSpinner.stories.tsx');
  process.exit(1);
}

console.debug('Debug: Script started');

// Convert story file name to testMatch pattern
const testPattern = `src/stories/${storyFile}`;
console.log(`Running tests for story: ${testPattern}`);

// Kill any existing storybook processes
try {
  console.log('Cleaning up any existing storybook dev server processes...');
  // More specific pkill that only targets the dev server
  execSync('pkill -f "storybook dev" || true');
  await new Promise(resolve => setTimeout(resolve, 1000));
} catch (error) {
  // Ignore errors from pkill
  console.log('No existing storybook processes found');
}

// Ensure storybook-static directory exists
if (!fs.existsSync('storybook-static')) {
  fs.mkdirSync('storybook-static', { recursive: true });
}

async function buildStorybook() {
  console.log('Building Storybook...');
  
  if (fs.existsSync('storybook-static')) {
    fs.rmSync('storybook-static', { recursive: true });
  }
  fs.mkdirSync('storybook-static');

  return new Promise((resolve, reject) => {
    
    const build = spawn('npm', ['run', 'build-storybook'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1', NODE_ENV: 'test' }
    });

    let timeout = setTimeout(() => {
      build.kill();
      reject(new Error('Build timed out after 5 minutes'));
    }, 300000);

    build.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0 && fs.existsSync('storybook-static/index.html')) {
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });

    build.on('error', reject);
  });
}

async function startStorybookServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => handler(req, res, { public: 'storybook-static' }));
    server.listen(6011, (err) => err ? reject(err) : resolve(server));
  });
}

// Keep track of server instance
let serverInstance;

async function runTests() {
  try {
    console.log('Starting test execution...');
    
    if (!fs.existsSync('storybook-static')) {
      await buildStorybook();
    }

    serverInstance = await startStorybookServer();
    await waitOn({
      resources: ['http://localhost:6011/iframe.html'],
      timeout: 60000,
      interval: 500,
      validateStatus: function(status) {
        return status === 200;
      },
    });
    console.log('Storybook server is ready');

    // Run the tests
    console.log('Running test-storybook...');
    process.stdout.write('Spawning test process...\n');
    // Build storybook if it doesn't exist or is empty
    if (!fs.existsSync('storybook-static') || fs.readdirSync('storybook-static').length === 0) {
      await buildStorybook();
    }

    // Keep track of whether tests are done
    let testsDone = false;
    
    const testProcess = spawn('npx', [
      'test-storybook',
      testPattern,
      '--ci',
      '--url', 'http://127.0.0.1:6011',
      '--verbose',
      '--maxWorkers', '1',
      '--no-cache',
      '--config-dir', '.storybook'
    ], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'test', CI: 'true' }
    });

    console.log('Test process started');

    // Set up a keepalive interval
    const keepalive = setInterval(() => {
      if (!testsDone) {
        fetch('http://127.0.0.1:6011/iframe.html')
          .catch(() => {}); // Ignore errors
      }
    }, 1000);

    try {
      await new Promise((resolve, reject) => {
        testProcess.on('exit', (code) => {
          testsDone = true;
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Test process exited with code ${code}`));
          }
        });

        testProcess.on('error', (err) => {
          testsDone = true;
          reject(err);
        });
      });
    } finally {
      clearInterval(keepalive);
      if (serverInstance) {
        console.log('Closing Storybook server...');
        serverInstance.close();
        console.log('Storybook server closed');
      }
    }
  } catch (error) {
    console.error('Error during test execution:', error);
    if (serverInstance) {
      console.log('Closing Storybook server due to error...');
      serverInstance.close();
      console.log('Storybook server closed');
    }
    throw error;
  }
}

// Set up error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Run tests and handle errors
console.log('Starting test runner...');

// Start test execution
runTests()
  .then(() => {
    console.log(`✓ ${storyFile} tests passed`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`✗ ${storyFile} tests failed:`, error);
    console.error('Error stack:', error.stack);
    process.exit(1);
});
