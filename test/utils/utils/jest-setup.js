/// <reference lib="dom" />
// Initialize performance metrics
globalThis.__PERFORMANCE_METRICS__ = {
    startTime: Date.now(),
    eventCount: 0,
    errorCount: 0,
    maxLatency: 0,
    totalLatency: 0,
    memoryUsage: process.memoryUsage(),
    MAX_LATENCY_MS: 100,
    MIN_EVENTS_PER_SEC: 100,
    MAX_ERROR_RATE: 0.01,
    MAX_MEMORY_MB: 512,
    trackEvent: (latencyMs) => {
        globalThis.__PERFORMANCE_METRICS__.eventCount++;
        globalThis.__PERFORMANCE_METRICS__.totalLatency += latencyMs;
        globalThis.__PERFORMANCE_METRICS__.maxLatency = Math.max(globalThis.__PERFORMANCE_METRICS__.maxLatency, latencyMs);
        globalThis.__PERFORMANCE_METRICS__.memoryUsage = process.memoryUsage();
    },
    trackError: () => {
        globalThis.__PERFORMANCE_METRICS__.errorCount++;
    },
    reset: () => {
        globalThis.__PERFORMANCE_METRICS__.startTime = Date.now();
        globalThis.__PERFORMANCE_METRICS__.eventCount = 0;
        globalThis.__PERFORMANCE_METRICS__.errorCount = 0;
        globalThis.__PERFORMANCE_METRICS__.maxLatency = 0;
        globalThis.__PERFORMANCE_METRICS__.totalLatency = 0;
        globalThis.__PERFORMANCE_METRICS__.memoryUsage = process.memoryUsage();
    }
};
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app, cleanup as cleanupMockServer } from './mock-server';
const CLEANUP_INTERVAL = 5; // Run cleanup every 5 tests
let testCount = 0;
// Force garbage collection if available
const gc = global.gc || (() => { });
// Initialize test-specific Prisma client
process.env.DATABASE_URL = 'file::memory:?cache=shared';
process.env.NODE_ENV = 'test';
let prisma;
// Push the test schema to the database and ensure connection
beforeAll(async () => {
    // Force garbage collection before starting tests
    gc();
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: 'file::memory:?cache=shared'
            }
        }
    });
    await prisma.$connect();
    // Reset the database schema
    await prisma.$executeRaw `PRAGMA foreign_keys = OFF;`;
    await prisma.$executeRaw `DROP TABLE IF EXISTS _prisma_migrations;`;
    await prisma.$executeRaw `DROP TABLE IF EXISTS Task;`;
    await prisma.$executeRaw `DROP TABLE IF EXISTS User;`;
    await prisma.$executeRaw `DROP TABLE IF EXISTS Family;`;
    await prisma.$executeRaw `PRAGMA foreign_keys = ON;`;
    // Push the schema using Prisma's schema push
    await prisma.$executeRaw `
    CREATE TABLE IF NOT EXISTS Family (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL
    );
  `;
    await prisma.$executeRaw `
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'MEMBER',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL,
      familyId TEXT,
      FOREIGN KEY (familyId) REFERENCES Family(id)
    );
  `;
    await prisma.$executeRaw `
    CREATE TABLE IF NOT EXISTS Task (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      dueDate DATETIME,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL,
      userId TEXT NOT NULL,
      assignedToId TEXT NOT NULL,
      familyId TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id),
      FOREIGN KEY (assignedToId) REFERENCES User(id),
      FOREIGN KEY (familyId) REFERENCES Family(id)
    );
  `;
    await prisma.$executeRaw `CREATE INDEX IF NOT EXISTS idx_user_familyid ON User(familyId);`;
    await prisma.$executeRaw `CREATE INDEX IF NOT EXISTS idx_task_userid ON Task(userId);`;
    await prisma.$executeRaw `CREATE INDEX IF NOT EXISTS idx_task_assignedtoid ON Task(assignedToId);`;
    await prisma.$executeRaw `CREATE INDEX IF NOT EXISTS idx_task_familyid ON Task(familyId);`;
    // Verify database connection and schema
    try {
        await prisma.user.findFirst();
    }
    catch (error) {
        console.error('Database connection verification failed:', error);
        throw error;
    }
});
// Clean up Prisma after all tests
afterAll(async () => {
    await prisma.$disconnect();
    // Force final garbage collection
    gc();
});
// Helper to convert request body to appropriate format
function getRequestBody(req) {
    if (!req.body)
        return undefined;
    if (typeof req.body === 'string')
        return req.body;
    if (Buffer.isBuffer(req.body))
        return new Blob([req.body]);
    return JSON.stringify(req.body);
}
export async function setupTestContext() {
    const agent = supertest.agent(async (req) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const response = await app.fetch(new Request(url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? getRequestBody(req) : undefined
        }));
        // Clean up response body after use
        const body = await response.text();
        return {
            status: response.status,
            headers: Object.fromEntries(response.headers),
            body
        };
    });
    return {
        agent,
        cleanup: async () => {
            await cleanupDatabase();
            await cleanupMockServer();
        }
    };
}
export async function cleanupDatabase() {
    try {
        // Use DELETE with smaller batches instead of truncating
        const BATCH_SIZE = 1000;
        await prisma.$transaction(async (tx) => {
            await tx.$executeRaw `PRAGMA foreign_keys = OFF;`;
            // Delete in batches
            let deleted;
            do {
                deleted = await tx.task.deleteMany({
                    where: {}
                });
                // Small delay between batches
                await new Promise(resolve => setImmediate(resolve));
            } while (deleted.count === BATCH_SIZE);
            // Repeat for other tables
            do {
                deleted = await tx.user.deleteMany({
                    where: {}
                });
                await new Promise(resolve => setImmediate(resolve));
            } while (deleted.count === BATCH_SIZE);
            do {
                deleted = await tx.family.deleteMany({
                    where: {}
                });
                await new Promise(resolve => setImmediate(resolve));
            } while (deleted.count === BATCH_SIZE);
            await tx.$executeRaw `PRAGMA foreign_keys = ON;`;
        });
        // Run vacuum to reclaim space
        await prisma.$executeRaw `VACUUM;`;
    }
    catch (error) {
        console.error('Error cleaning up database:', error);
        throw error;
    }
}
// Cleanup after each test
afterEach(async () => {
    testCount++;
    // Perform more aggressive cleanup periodically
    if (testCount % CLEANUP_INTERVAL === 0) {
        // Clear module cache
        jest.resetModules();
        // Clear any timers
        jest.clearAllTimers();
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }
        // Clear any large object references
        if (prisma) {
            try {
                await prisma.$disconnect();
                await prisma.$connect();
            }
            catch (error) {
                console.error('Error during Prisma cleanup:', error);
            }
        }
    }
    try {
        await cleanupDatabase();
    }
    catch (error) {
        console.error('Error during database cleanup:', error);
    }
    // Skip mock server cleanup if not initialized
    if (app) {
        try {
            await cleanupMockServer();
        }
        catch (error) {
            console.error('Error during mock server cleanup:', error);
        }
    }
});
//# sourceMappingURL=jest-setup.js.map