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
  process.stdout.write('Starting build process...\n');
  
  // Clean existing build
  if (fs.existsSync('storybook-static')) {
    fs.rmSync('storybook-static', { recursive: true });
  }
  fs.mkdirSync('storybook-static');

  return new Promise((resolve, reject) => {
    console.log('Spawning build process...');
    
    const build = spawn('npm', ['run', 'build-storybook'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1', NODE_ENV: 'test' }
    });

    let timeout = setTimeout(() => {
      build.kill();
      reject(new Error('Storybook build timed out after 5 minutes'));
    }, 300000);

    build.on('exit', (code) => {
      clearTimeout(timeout);
      console.log(`Build process exited with code ${code}`);
      
      if (code === 0 && fs.existsSync('storybook-static/index.html')) {
        resolve();
      } else {
        reject(new Error(`Storybook build failed with code ${code}`));
      }
    });

    build.on('error', (error) => {
      clearTimeout(timeout);
      console.error('Build process error:', error);
      reject(error);
    });
  });
}

async function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      return handler(request, response, {
        public: 'storybook-static',
        cleanUrls: false,
        trailingSlash: false,
        headers: [
          {
            source: '**',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }
            ]
          }
        ],
        directoryListing: false
      });
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      reject(error);
    });

    server.listen(6011, '127.0.0.1', () => {
      console.log('Static server running at http://localhost:6011');
      resolve(server);
    });
  });
}

async function runTests() {
  let server;
  try {
    console.log('Starting test execution...');
    
    // Check if storybook-static exists
    if (!fs.existsSync('storybook-static')) {
      console.log('No storybook-static directory found, building Storybook...');
      await buildStorybook();
      console.log('Build completed successfully');
    } else {
      console.log('Using existing storybook-static directory');
    }

    // Start static file server
    console.log('Starting static server...');
    server = await startStaticServer();
    console.log('Static server started successfully');

    // Wait for server to be ready and verify key files
    console.log('Waiting for server to be ready...');
    const requiredFiles = [
      'iframe.html',
      'index.html',
      'assets/iframe-0454fe63.js'
    ];
    
    for (const file of requiredFiles) {
      const url = `http://localhost:6011/${file}`;
      console.log(`Checking ${url}...`);
      
      await waitOn({
        resources: [url],
        timeout: 30000,
        interval: 500,
        validateStatus: function(status) {
          return status === 200;
        },
        headers: {
          'Accept': '*/*'
        }
      });

      // Verify file content
      const response = await fetch(url);
      const content = await response.text();
      if (!content || content.length === 0) {
        throw new Error(`Empty response from ${file}`);
      }
      console.log(`✓ ${file} verified`);
    }

    // Additional delay to ensure everything is loaded
    console.log('All required files verified, waiting for full initialization...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Server is ready, running tests...');

    // Run the tests
    console.log('Running test-storybook...');
    process.stdout.write('Spawning test process...\n');
    // Build storybook if it doesn't exist or is empty
    if (!fs.existsSync('storybook-static') || fs.readdirSync('storybook-static').length === 0) {
      await buildStorybook();
    }

    const testProcess = spawn('npx', [
      'test-storybook',
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
      console.log('Closing static server...');
      await new Promise((resolve) => server.close(resolve));
      console.log('Static server closed');
    }
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
