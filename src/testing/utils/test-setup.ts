import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

export interface TestContext {
  prisma: PrismaClient;
  server: any; // Replace with your server type
}

export const setupTestContext = async (): Promise<TestContext> => {
  const mockPrisma = mockDeep<PrismaClient>();
  const mockServer = {}; // Replace with your server mock

  return {
    prisma: mockPrisma,
    server: mockServer,
  };
};

export const cleanupTestContext = async (): Promise<void> => {
  // Reset all mocks
  mockReset(mockDeep<PrismaClient>());
};

// Test user utilities
export const getTestUsers = () => [
  { id: '1', email: 'test1@example.com', role: 'USER' },
  { id: '2', email: 'test2@example.com', role: 'ADMIN' },
];

export const createTestUser = (overrides = {}) => ({
  id: 'test-id',
  email: 'test@example.com',
  role: 'USER',
  ...overrides,
});
