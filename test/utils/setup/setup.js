import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app, { startServer } from '../index.js';
const prisma = new PrismaClient();
export async function setupTestContext(testApp) {
    // Use a random port between 40000-50000 for tests
    const testPort = Math.floor(Math.random() * 10000) + 40000;
    const appToUse = testApp || app;
    const serverInstance = await startServer(appToUse, { port: testPort });
    const agent = request(serverInstance.server);
    // Ensure database is clean before tests
    // Delete in correct order to handle foreign key constraints
    await prisma.$transaction([
        // Delete recipe related records first
        prisma.recipeIngredient.deleteMany(),
        prisma.recipeStep.deleteMany(),
        prisma.recipe.deleteMany(),
        // Delete shopping-related items first (maintain referential integrity)
        prisma.shoppingListItem.deleteMany(),
        prisma.shoppingItem.deleteMany(),
        prisma.shoppingList.deleteMany(),
        // Delete other related records
        prisma.task.deleteMany(),
        prisma.event.deleteMany(),
        // Update users to remove family relationships
        prisma.user.updateMany({
            where: { familyId: { not: null } },
            data: { familyId: null }
        }),
        // Finally delete users and families
        prisma.user.deleteMany(),
        prisma.family.deleteMany()
    ]);
    return {
        agent,
        serverInstance,
        cleanup: async () => {
            console.log('[Test] Starting cleanup...');
            try {
                // Track active connections
                const activeConnections = new Set();
                // Close server first
                if (serverInstance?.server) {
                    console.log('[Test] Closing server...');
                    // Force close any existing connections
                    serverInstance.server.unref();
                    // Close server with timeout
                    await new Promise((resolve, reject) => {
                        const forceCloseTimeout = setTimeout(() => {
                            console.warn('[Test] Force closing server after timeout');
                            serverInstance.server.unref();
                            resolve();
                        }, 1000);
                        serverInstance.server.close((err) => {
                            clearTimeout(forceCloseTimeout);
                            if (err) {
                                console.error('[Test] Server close error:', err);
                                reject(err);
                            }
                            else {
                                console.log('[Test] Server closed gracefully');
                                resolve();
                            }
                        });
                    });
                    console.log('[Test] Server shutdown complete');
                }
                // Clear database
                console.log('[Test] Starting database cleanup');
                try {
                    await prisma.$connect();
                    console.log('[Test] Database connected');
                    await prisma.$transaction([
                        prisma.shoppingListItem.deleteMany(),
                        prisma.shoppingItem.deleteMany(),
                        prisma.shoppingList.deleteMany(),
                        prisma.task.deleteMany(),
                        prisma.event.deleteMany(),
                        prisma.user.updateMany({
                            data: { familyId: null }
                        }),
                        prisma.user.deleteMany(),
                        prisma.family.deleteMany()
                    ]);
                    console.log('[Test] Database cleanup complete');
                }
                catch (dbError) {
                    console.error('[Test] Database cleanup error:', dbError);
                    throw dbError;
                }
                finally {
                    console.log('[Test] Disconnecting from database');
                    await prisma.$disconnect();
                    console.log('[Test] Database disconnected');
                }
                // Brief delay to ensure all resources are released
                console.log('[Test] Starting final cleanup delay');
                await new Promise(resolve => {
                    const timeout = setTimeout(() => {
                        console.log('[Test] Final cleanup delay complete');
                        resolve(undefined);
                    }, 100);
                    // Ensure the timeout is cleared
                    timeout.unref();
                });
                console.log('[Test] Cleanup completed successfully');
            }
            catch (error) {
                console.error('[Test] Cleanup error:', error);
                // Ensure prisma is disconnected even on error
                try {
                    await prisma.$disconnect();
                }
                catch (dbError) {
                    console.error('[Test] Database disconnect error:', dbError);
                }
                throw error;
            }
        }
    };
}
// Set reasonable test timeout
jest.setTimeout(30000);
//# sourceMappingURL=setup.js.map