import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

// Mock server implementation
export const createMockServer = () => {
  const app = new Hono();
  const prisma = new PrismaClient();

  return {
    app,
    prisma,
    async close() {
      await prisma.$disconnect();
    }
  };
};

// Mock server for testing
export const mockServer = createMockServer();

// Export singleton instances
export const app = mockServer.app;
export const prisma = mockServer.prisma;

// Cleanup helper
export const cleanup = async () => {
  await mockServer.close();
};
