import { mockDeep, mockReset } from 'jest-mock-extended';
export const setupTestContext = async () => {
    const mockPrisma = mockDeep();
    const mockServer = {}; // Replace with your server mock
    return {
        prisma: mockPrisma,
        server: mockServer,
    };
};
export const cleanupTestContext = async () => {
    // Reset all mocks
    mockReset(mockDeep());
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
//# sourceMappingURL=test-setup.js.map