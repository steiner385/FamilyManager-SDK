import { PrismaClient } from '@prisma/client';
import { createTestClient } from './hono-test-adapter';
import app from '../../index';
import type { SuperTest, Test } from 'supertest';
import { describe, it, expect } from '@jest/globals';

// Add minimal test suite to prevent "no tests" error
describe('Task Test Utils', () => {
  it('should have required exports', () => {
    expect(prisma).toBeDefined();
    expect(typeof createTestContext).toBe('function');
    expect(typeof cleanupTestData).toBe('function');
  });
});

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize test client
let testClient: SuperTest<Test> | null = null;

export async function getTestClient(): Promise<SuperTest<Test>> {
  if (!testClient) {
    const { client } = await createTestClient(app);
    testClient = client;
  }
  return testClient;
}

// Test context type
export interface TestContext {
  agent: SuperTest<Test>;
  parentToken: string;
  memberToken: string;
  familyId: string;
}

// Test users
export const testUsers = {
  parent: {
    email: 'parent@test.com',
    password: 'Parent123!',
    firstName: 'Parent',
    lastName: 'User',
    role: 'PARENT'
  },
  member: {
    email: 'member@test.com',
    password: 'Member123!',
    firstName: 'Member',
    lastName: 'User',
    role: 'MEMBER'
  }
};

// Initialize test context
export async function createTestContext(): Promise<TestContext> {
  const agent = await getTestClient();
  return {
    agent,
    parentToken: '',
    memberToken: '',
    familyId: ''
  };
}

// Database cleanup function
export const cleanupTestData = async (): Promise<void> => {
  try {
    await prisma.$transaction([
      prisma.task.deleteMany(),
      prisma.user.deleteMany(),
      prisma.family.deleteMany()
    ]);
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
};

// Test setup function
export const setupTestContext = async (): Promise<TestContext> => {
  const context = await createTestContext();
  try {
    // Clean up existing test users first
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUsers.parent.email, testUsers.member.email]
        }
      }
    });

    // Create test users sequentially to avoid race conditions
    const parentResponse = await context.agent
      .post('/api/users/register')
      .send(testUsers.parent)
      .timeout(5000);

    const memberResponse = await context.agent
      .post('/api/users/register')
      .send(testUsers.member)
      .timeout(5000);

    if (!parentResponse.body?.token || !memberResponse.body?.token || !memberResponse.body?.user?.id) {
      throw new Error('Failed to create test users');
    }

    context.parentToken = parentResponse.body.token;
    context.memberToken = memberResponse.body.token;

    // Create family
    const familyResponse = await context.agent
      .post('/api/families')
      .set('Authorization', `Bearer ${context.parentToken}`)
      .send({ name: 'Test Family' })
      .timeout(5000);

    if (!familyResponse.body?.id) {
      throw new Error('Failed to create family');
    }

    context.familyId = familyResponse.body.id;

    // Add member to family
    await context.agent
      .post(`/api/families/${context.familyId}/members`)
      .set('Authorization', `Bearer ${context.parentToken}`)
      .send({ userId: memberResponse.body.user.id })
      .timeout(5000);

    return context;
  } catch (error) {
    console.error('Test setup error:', error);
    throw error;
  }
};
