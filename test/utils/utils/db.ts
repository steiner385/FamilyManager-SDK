import { PrismaClient } from '@prisma/client';

// Share a single Prisma instance across tests
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal',
});

export { prisma };
