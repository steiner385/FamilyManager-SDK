import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app, { startServer } from '../../index';
// Set test environment
process.env.NODE_ENV = 'test';
// Increase timeouts
jest.setTimeout(120000);
// Create Prisma client with connection management
let prismaInstance = null;
export function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient({
            log: ['error', 'warn']
        });
    }
    return prismaInstance;
}
export const prisma = getPrismaClient();
// Add a test to prevent "no tests" error
describe('Base Test Setup', () => {
    it('should have required interfaces and types', () => {
        expect(typeof setupBaseTest).toBe('function');
        expect(typeof cleanupBaseTest).toBe('function');
    });
});
// Helper function to retry database connection
export async function connectWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log('Database connected successfully');
            return;
        }
        catch (error) {
            if (i === retries - 1)
                throw error;
            console.log(`Connection attempt ${i + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
// Base setup function with improved resource management
export async function setupBaseTest() {
    try {
        console.log('Starting base test setup...');
        const client = getPrismaClient();
        await connectWithRetry();
        const serverInstance = await startServer(app);
        const { server } = serverInstance;
        // Remove all listeners to prevent memory leaks
        server.removeAllListeners();
        const agent = request(server);
        return {
            agent,
            cleanup: async () => {
                try {
                    // Increase timeout for larger test suites
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('Server close timeout'));
                        }, 15000); // Increased from 5000ms to 15000ms
                        // Ensure all connections are properly closed
                        server.getConnections((err, count) => {
                            if (err)
                                console.error('Error getting connections:', err);
                            else if (count > 0)
                                console.log(`Closing ${count} remaining connections`);
                        });
                        server.close((err) => {
                            clearTimeout(timeout);
                            if (err) {
                                console.error('Error closing server:', err);
                                reject(err);
                            }
                            else {
                                // Clean up event listeners
                                server.removeAllListeners();
                                resolve();
                            }
                        });
                    });
                }
                catch (error) {
                    console.error('Error during cleanup:', error);
                    throw error;
                }
                finally {
                    // Ensure resources are always cleaned up
                    server.removeAllListeners();
                }
            }
        };
    }
    catch (error) {
        console.error('Base test setup error:', error);
        throw error;
    }
}
// Base cleanup function with improved error handling
export async function cleanupBaseTest() {
    try {
        console.log('Starting base cleanup...');
        if (prismaInstance) {
            await prismaInstance.$disconnect();
            prismaInstance = null;
            console.log('Database disconnected successfully');
        }
    }
    catch (error) {
        console.error('Base cleanup error:', error);
        // Ensure prisma instance is reset even on error
        prismaInstance = null;
        throw error;
    }
}
// Database cleanup helper with transaction and memory management
export async function cleanDatabase() {
    const client = getPrismaClient();
    try {
        console.log('Cleaning database...');
        // Use transaction to ensure atomic cleanup
        await client.$transaction([
            client.task.deleteMany(),
            client.user.deleteMany(),
            client.family.deleteMany()
        ]);
        console.log('Database cleaned successfully');
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }
    }
    catch (error) {
        console.error('Database cleanup error:', error);
        throw error;
    }
}
// Global teardown with complete cleanup
export async function globalTeardown() {
    try {
        if (prismaInstance) {
            await prismaInstance.$disconnect();
            prismaInstance = null;
            console.log('Database disconnected in global teardown');
        }
        // Clean up any remaining resources
        if (global.gc) {
            global.gc();
        }
        // Reset environment
        process.removeAllListeners();
    }
    catch (error) {
        console.error('Error in global teardown:', error);
        prismaInstance = null;
        throw error;
    }
}
//# sourceMappingURL=test-base.js.map