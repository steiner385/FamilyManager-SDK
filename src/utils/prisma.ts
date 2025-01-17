import { PrismaClient, Prisma } from '@prisma/client';
import logger from './logger';

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e: any) => {
        logger.debug('Prisma Query', {
          query: e.query,
          params: e.params,
          duration: e.duration,
        });
      });
    }

    // Log errors
    prisma.$on('error', (e: any) => {
      logger.error('Prisma Error', {
        message: e.message,
        target: e.target,
      });
    });
  }

  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined as unknown as PrismaClient;
  }
}

export async function resetPrismaClient(): Promise<void> {
  await disconnectPrisma();
  prisma = getPrismaClient();
}

export default getPrismaClient();
