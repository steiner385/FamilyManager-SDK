import { PrismaClient } from '@prisma/client';

// Extend PrismaClient with our Task model
interface TaskModel {
  task: {
    findMany: (args: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
}

// Create a custom client type that includes our Task model
export type CustomPrismaClient = PrismaClient & TaskModel;

// Create and export a singleton instance
const prisma = new PrismaClient() as CustomPrismaClient;

export { prisma };
