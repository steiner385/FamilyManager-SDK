import { hashPassword, generateToken } from '../../../utils/auth.js';
import { describe, test, it, expect, beforeEach, afterEach } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { UserRole } from '../../../types/user-role.js';
import request from 'supertest';
type TestAgent = ReturnType<typeof request>;
import app, { startServer } from '../../../index.js';
import { prisma, connectPrisma, disconnectPrisma } from '../../../utils/prisma';

// Define TaskTestContext interface
export interface TaskTestContext {
  agent: TestAgent;
  parentToken: string;
  memberToken: string;
  familyId: string;
  taskId?: string;
  memberId: string;
  parentId: string;
  serverInstance?: {
    server: any;
  };
}

// Constants
const SERVER_TIMEOUT = 5000;
const REQUEST_TIMEOUT = 5000;

// Server and client state
let testClient: TestAgent | null = null;
let serverInstance: any = null;
const activeConnections = new Set<any>();

// Get or create test client with proper configuration
async function getTestClient(): Promise<TestAgent> {
  try {
    // Close any existing server
    await closeTestClient();
    
    const server = await startServer(app);
    if (!server || !server.server) {
      throw new Error('Failed to initialize server');
    }

    // Track connections
    server.server.on('connection', (conn: any) => {
      activeConnections.add(conn);
      conn.on('close', () => activeConnections.delete(conn));
    });

    // Create test client
    testClient = request(server.server);
    serverInstance = server;
    return testClient;
  } catch (error) {
    console.error('Failed to initialize test client:', error);
    throw error;
  }
}

// Type guard for Error objects
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Improved server cleanup
async function closeTestClient(): Promise<void> {
  if (!serverInstance?.server) {
    return;
  }

  try {
    // Close all active connections first
    for (const conn of activeConnections) {
      try {
        conn.destroy();
      } catch (err) {
        console.error('Error destroying connection:', err);
      }
    }
    activeConnections.clear();

    // Close server with timeout
    await Promise.race([
      new Promise<void>((resolve, reject) => {
        try {
          serverInstance.server.close((err?: Error) => {
            if (err && (!isError(err) || err.message !== 'Server is not running')) {
              reject(err);
            } else {
              resolve();
            }
          });
        } catch (err) {
          if (isError(err) && err.message === 'Server is not running') {
            resolve();
          } else {
            reject(err);
          }
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Server close timeout')), SERVER_TIMEOUT))
    ]).catch(err => {
      if (isError(err) && err.message !== 'Server is not running') {
        console.warn('Server close warning:', err);
      }
    });
  } finally {
    serverInstance = null;
    testClient = null;
  }
}

// Test setup function
export async function setupTaskTest(): Promise<TaskTestContext> {
  try {
    await connectPrisma();
    const client = await getTestClient();
    
    const uniqueSuffix = Date.now().toString();
    
    // Create parent user
    const parentUser = await prisma.user.create({
      data: {
        email: `testparent-${uniqueSuffix}@test.com`,
        password: await hashPassword('TestPass123!'),
        firstName: 'Test',
        lastName: 'Parent',
        role: 'PARENT',
        username: `testparent-${uniqueSuffix}`
      }
    });

    // Create member user
    const memberUser = await prisma.user.create({
      data: {
        email: `testmember-${uniqueSuffix}@test.com`,
        password: await hashPassword('TestPass123!'),
        firstName: 'Test',
        lastName: 'Member',
        role: 'MEMBER',
        username: `testmember-${uniqueSuffix}`
      }
    });

    // Create family with connected users
    const family = await prisma.family.create({
      data: {
        name: 'Test Family',
        members: {
          connect: [
            { id: parentUser.id },
            { id: memberUser.id }
          ]
        }
      }
    });

    // Update users with familyId
    await prisma.$transaction([
      prisma.user.update({
        where: { id: parentUser.id },
        data: { familyId: family.id }
      }),
      prisma.user.update({
        where: { id: memberUser.id },
        data: { familyId: family.id }
      })
    ]);

    // Verify the connection
    const verifyParent = await prisma.user.findUnique({
      where: { id: parentUser.id },
      include: { family: true }
    });
    const verifyMember = await prisma.user.findUnique({
      where: { id: memberUser.id },
      include: { family: true }
    });
    console.log('Verify parent:', verifyParent);
    console.log('Verify member:', verifyMember);

    // Generate tokens
    const parentToken = await generateToken({
      userId: parentUser.id,
      email: parentUser.email,
      role: parentUser.role
    });

    const memberToken = await generateToken({
      userId: memberUser.id,
      email: memberUser.email,
      role: memberUser.role
    });

    return {
      agent: client,
      parentToken,
      memberToken,
      familyId: family.id,
      taskId: '',
      memberId: memberUser.id,
      parentId: parentUser.id,
      serverInstance: serverInstance
    };
  } catch (error) {
    console.error('Test setup error:', error);
    await cleanupTaskTest();
    throw error;
  }
}

// Test cleanup function
export async function cleanupTaskTest(): Promise<void> {
  try {
    // Clean up database
    await prisma.task.deleteMany();
    await prisma.user.updateMany({
      where: { familyId: { not: null } },
      data: { familyId: null }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
    await prisma.family.deleteMany();

    // Close server
    await closeTestClient();
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    try {
      await disconnectPrisma();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}

// Export utilities
export { prisma };

// Export test client getter
export function getSharedTestClient(): TestAgent {
  if (!testClient) {
    throw new Error('Test client not initialized. Call getTestClient() first.');
  }
  return testClient;
}
