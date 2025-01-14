import { PrismaClient } from '@prisma/client';
import logger from './logger';
let prisma;
export function getPrismaClient() {
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
            prisma.$on('query', (e) => {
                logger.debug('Prisma Query', {
                    query: e.query,
                    params: e.params,
                    duration: e.duration,
                });
            });
        }
        // Log errors
        prisma.$on('error', (e) => {
            logger.error('Prisma Error', {
                message: e.message,
                target: e.target,
            });
        });
    }
    return prisma;
}
export async function disconnectPrisma() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = undefined;
    }
}
export async function resetPrismaClient() {
    await disconnectPrisma();
    prisma = getPrismaClient();
}
export default getPrismaClient();
//# sourceMappingURL=prisma.js.map