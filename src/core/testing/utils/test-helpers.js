import { prisma } from '../../utils/prisma';
/**
 * Core test utilities for user and family management.
 * Module-specific test utilities should be placed in their respective module's test directories.
 */
export async function createTestUser(data) {
    return prisma.user.create({
        data: {
            email: data.email,
            password: 'hashedPassword',
            role: data.role,
            firstName: data.firstName || 'Test',
            lastName: data.lastName || 'User',
            username: data.username || `test_${Date.now()}`
        }
    });
}
export async function createTestFamily(userId) {
    return prisma.family.create({
        data: {
            name: 'Test Family',
            members: {
                connect: { id: userId }
            }
        }
    });
}
export function createMockHandler() {
    const calls = [];
    const handler = async (event) => {
        calls.push(event);
        return { status: 'success' };
    };
    return { handler, calls };
}
export async function waitForEvents(timeout = 100) {
    await new Promise(resolve => setTimeout(resolve, timeout));
}
//# sourceMappingURL=test-helpers.js.map