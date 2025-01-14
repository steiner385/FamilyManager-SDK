import { mockDeep } from 'jest-mock-extended';
import { logger } from '../../logging/Logger';
import jwt from 'jsonwebtoken';
class MockDatabaseError extends Error {
    constructor(message, operation, details) {
        super(message);
        this.operation = operation;
        this.details = details;
        this.name = 'MockDatabaseError';
    }
}
class MockValidationError extends Error {
    constructor(message, fields) {
        super(message);
        this.fields = fields;
        this.name = 'MockValidationError';
    }
}
// Define UserRole enum
var UserRole;
(function (UserRole) {
    UserRole["PARENT"] = "PARENT";
    UserRole["MEMBER"] = "MEMBER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
// Mock the Prisma module
jest.mock('../../lib/prisma', () => ({
    prisma: mockDeep(),
}));
// Get the mocked prisma instance
const { prisma: mockPrisma } = jest.requireMock('../../lib/prisma');
// Configure mock behavior
const mockData = {
    users: new Map(),
    families: new Map()
};
// Helper functions
function validateUserData(data) {
    const errors = {};
    if (data.email && !data.email.includes('@')) {
        errors.email = ['Invalid email format'];
    }
    if (data.password && data.password.length < 8) {
        errors.password = ['Password must be at least 8 characters'];
    }
    if (data.username && data.username.length < 3) {
        errors.username = ['Username must be at least 3 characters'];
    }
    if (Object.keys(errors).length > 0) {
        throw new MockValidationError('Validation failed', errors);
    }
}
// Mock user operations
mockPrisma.user.create.mockImplementation(async (args) => {
    try {
        validateUserData(args.data);
        const data = args.data;
        const user = {
            id: data.id || generateMockId('user'),
            email: data.email,
            password: data.password,
            role: data.role || UserRole.MEMBER,
            firstName: data.firstName || 'Test',
            lastName: data.lastName || 'User',
            username: data.username,
            createdAt: new Date(),
            updatedAt: new Date(),
            familyId: data.family?.connect?.id || data.familyId || null
        };
        // Check for duplicate email
        const existingUser = Array.from(mockData.users.values())
            .find(u => u.email === user.email);
        if (existingUser) {
            throw new MockDatabaseError('Unique constraint violation on email', 'create', { email: user.email });
        }
        // Check family exists if connecting
        if (user.familyId && !mockData.families.has(user.familyId)) {
            throw new MockDatabaseError('Foreign key constraint violation on familyId', 'create', { familyId: user.familyId });
        }
        mockData.users.set(user.id, user);
        TestCleanup.trackUser(user.id);
        return mockDeep({
            ...user,
            family: () => user.familyId ? mockData.families.get(user.familyId) : null,
            createdTasks: () => [],
            assignedTasks: () => []
        });
    }
    catch (error) {
        logger.error('Failed to create mock user:', {
            error,
            data: args.data
        });
        throw error;
    }
});
mockPrisma.user.update.mockImplementation(async (args) => {
    const user = mockData.users.get(args.where.id);
    if (!user) {
        console.log('User not found for update:', args.where.id);
        console.log('Available users:', Array.from(mockData.users.keys()));
        return Promise.resolve(null);
    }
    console.log('Updating user:', user.id);
    console.log('Update data:', args.data);
    const data = args.data;
    const updatedUser = {
        ...user,
        ...(typeof data === 'object' ? {
            email: data.email?.toString() || user.email,
            password: data.password?.toString() || user.password,
            role: data.role?.toString() || user.role,
            firstName: data.firstName?.toString() || user.firstName,
            lastName: data.lastName?.toString() || user.lastName,
            username: data.username?.toString() || user.username,
            familyId: data.familyId?.toString() || user.familyId
        } : {}),
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: new Date()
    };
    // Update the user in our mock data store
    mockData.users.set(user.id, updatedUser);
    console.log('Updated user:', updatedUser);
    const family = updatedUser.familyId ? mockData.families.get(updatedUser.familyId) : undefined;
    const response = {
        ...updatedUser,
        family: family ? {
            id: family.id,
            name: family.name,
            members: family.members.map(m => ({
                id: m.id,
                email: m.email,
                firstName: m.firstName,
                lastName: m.lastName,
                role: m.role,
                username: m.username,
                familyId: m.familyId,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt
            }))
        } : null
    };
    const mockUser = mockDeep({
        ...response,
        family: () => Promise.resolve(response.family),
        createdTasks: () => Promise.resolve([]),
        assignedTasks: () => Promise.resolve([])
    });
    return mockUser;
});
const mockTransactions = new Map();
mockPrisma.$transaction.mockImplementation(async (operations) => {
    const transactionId = generateMockId('transaction');
    const transaction = {
        id: transactionId,
        operations: [],
        timestamp: Date.now()
    };
    try {
        const results = [];
        for (const operation of operations) {
            const result = await operation;
            results.push(result);
            transaction.operations.push({
                type: 'create',
                model: 'unknown',
                data: result
            });
        }
        mockTransactions.set(transactionId, transaction);
        return results;
    }
    catch (error) {
        logger.error('Transaction failed:', {
            transactionId,
            error
        });
        throw error;
    }
});
// Test data generation helpers
export function generateFutureDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
}
export function getTestUsers() {
    const timestamp = Date.now();
    return {
        parent: {
            email: `parent_${timestamp}@test.com`,
            password: 'TestPass123!',
            role: UserRole.PARENT,
            firstName: 'Test',
            lastName: 'Parent',
            username: `parent_${timestamp}`
        },
        member: {
            email: `member_${timestamp}@test.com`,
            password: 'TestPass123!',
            role: UserRole.MEMBER,
            firstName: 'Test',
            lastName: 'Member',
            username: `member_${timestamp}`
        }
    };
}
// Relationship mocking helpers
function createRelationshipProxy(data, relationships) {
    return new Proxy(data, {
        get(target, prop) {
            if (prop in relationships) {
                return relationships[prop];
            }
            return target[prop];
        }
    });
}
function buildUserRelationships(user) {
    return {
        family: () => user.familyId ? mockData.families.get(user.familyId) : null,
        createdTasks: () => [],
        assignedTasks: () => [],
        notifications: () => [],
        preferences: () => ({
            theme: 'light',
            language: 'en',
            notifications: true
        })
    };
}
function buildFamilyRelationships(family) {
    return {
        members: () => family.members,
        events: () => [],
        tasks: () => [],
        invites: () => []
    };
}
class TestContextManager {
    constructor() {
        this.context = {
            users: new Map(),
            families: new Map(),
            transactions: new Map(),
            tokens: new Map()
        };
    }
    static getInstance() {
        if (!TestContextManager.instance) {
            TestContextManager.instance = new TestContextManager();
        }
        return TestContextManager.instance;
    }
    getContext() {
        return this.context;
    }
    reset() {
        this.context = {
            users: new Map(),
            families: new Map(),
            transactions: new Map(),
            tokens: new Map()
        };
    }
    trackEntity(type, id, data) {
        this.context[type].set(id, data);
    }
    getEntity(type, id) {
        return this.context[type].get(id);
    }
}
export const testContext = TestContextManager.getInstance();
// Global test hooks
beforeAll(() => {
    resetTestData();
});
afterEach(async () => {
    await TestCleanup.cleanup();
});
afterAll(() => {
    resetTestData();
    mockPrisma.$reset();
});
mockPrisma.user.findUnique.mockImplementation((args) => {
    const user = mockData.users.get(args.where.id);
    if (!user)
        return null;
    return createRelationshipProxy(user, buildUserRelationships(user));
});
// Mock family operations
mockPrisma.family.create.mockImplementation((args) => {
    const data = args.data;
    const familyId = `family-${Date.now()}`;
    const family = {
        id: familyId,
        name: data.name,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: []
    };
    // Handle member connections
    if (data.members?.connect) {
        const memberIds = Array.isArray(data.members.connect)
            ? data.members.connect.map(m => m.id)
            : [data.members.connect.id];
        for (const memberId of memberIds) {
            const user = mockData.users.get(memberId);
            if (user) {
                const updatedUser = { ...user, familyId };
                mockData.users.set(memberId, updatedUser);
                family.members.push(updatedUser);
            }
        }
    }
    mockData.families.set(familyId, family);
    const response = {
        ...family,
        members: family.members.map(m => ({
            id: m.id,
            email: m.email,
            firstName: m.firstName,
            lastName: m.lastName,
            role: m.role,
            username: m.username,
            familyId: m.familyId,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt
        }))
    };
    const mockFamily = mockDeep({
        ...response,
        members: () => Promise.resolve(response.members),
        events: () => Promise.resolve([]),
        tasks: () => Promise.resolve([])
    });
    return mockFamily;
});
mockPrisma.family.findUnique.mockImplementation((args) => {
    const family = mockData.families.get(args.where.id);
    if (!family)
        return null;
    return createRelationshipProxy(family, buildFamilyRelationships(family));
});
mockPrisma.family.update.mockImplementation((args) => {
    const family = mockData.families.get(args.where.id);
    if (!family)
        return mockDeep(undefined);
    const updatedFamily = {
        ...family,
        name: typeof args.data.name === 'string' ? args.data.name : family.name,
        description: typeof args.data.description === 'string' ? args.data.description : family.description,
        updatedAt: new Date(),
        members: [...family.members]
    };
    // Handle member connections/disconnections
    if (args.data.members?.connect) {
        const memberIds = Array.isArray(args.data.members.connect)
            ? args.data.members.connect.map(m => m.id)
            : [args.data.members.connect.id];
        for (const memberId of memberIds) {
            const user = mockData.users.get(memberId);
            if (user) {
                const updatedUser = { ...user, familyId: family.id };
                mockData.users.set(memberId, updatedUser);
                if (!updatedFamily.members.some(m => m.id === memberId)) {
                    updatedFamily.members.push(updatedUser);
                }
            }
        }
    }
    if (args.data.members?.disconnect) {
        const memberIds = Array.isArray(args.data.members.disconnect)
            ? args.data.members.disconnect.map(m => m.id)
            : [args.data.members.disconnect.id];
        for (const memberId of memberIds) {
            const user = mockData.users.get(memberId);
            if (user) {
                const updatedUser = { ...user, familyId: null };
                mockData.users.set(memberId, updatedUser);
                updatedFamily.members = updatedFamily.members.filter(m => m.id !== memberId);
            }
        }
    }
    mockData.families.set(family.id, updatedFamily);
    const response = {
        ...updatedFamily,
        members: updatedFamily.members.map(m => ({
            id: m.id,
            email: m.email,
            firstName: m.firstName,
            lastName: m.lastName,
            role: m.role,
            username: m.username,
            familyId: m.familyId,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt
        }))
    };
    const mockFamily = mockDeep({
        ...response,
        members: () => Promise.resolve(response.members),
        events: () => Promise.resolve([]),
        tasks: () => Promise.resolve([])
    });
    return mockFamily;
});
import { hashPassword, generateToken, verifyToken } from '../../utils/auth';
const mockData = {
    users: new Map(),
    families: new Map()
};
function applyFilters(items, filters) {
    let result = [...items];
    if (filters.where) {
        result = result.filter(item => {
            return Object.entries(filters.where).every(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return Object.entries(value).every(([operator, operand]) => {
                        switch (operator) {
                            case 'contains':
                                return String(item[key]).includes(String(operand));
                            case 'gt':
                                return item[key] > operand;
                            case 'gte':
                                return item[key] >= operand;
                            case 'lt':
                                return item[key] < operand;
                            case 'lte':
                                return item[key] <= operand;
                            case 'in':
                                return Array.isArray(operand) && operand.includes(item[key]);
                            default:
                                return true;
                        }
                    });
                }
                return item[key] === value;
            });
        });
    }
    if (filters.orderBy) {
        result.sort((a, b) => {
            for (const [key, direction] of Object.entries(filters.orderBy)) {
                if (a[key] < b[key])
                    return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key])
                    return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return result;
}
function applyPagination(items, options) {
    const { skip = 0, take } = options;
    return take ? items.slice(skip, skip + take) : items.slice(skip);
}
// Helper functions for test data generation
export function generateMockId(prefix = 'test') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
export function generateMockEmail(role = 'user') {
    return `${role.toLowerCase()}_${Date.now()}@test.com`;
}
export function generateMockFamily(overrides = {}) {
    return {
        id: generateMockId('family'),
        name: `Test Family ${Date.now()}`,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        ...overrides
    };
}
export function generateMockUser(overrides = {}) {
    return {
        id: generateMockId('user'),
        email: generateMockEmail(),
        password: 'hashedPassword123',
        role: UserRole.MEMBER,
        firstName: 'Test',
        lastName: 'User',
        username: `testuser_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        familyId: null,
        ...overrides
    };
}
// Test cleanup utility
export class TestCleanup {
    static trackUser(userId) {
        this.userIds.add(userId);
    }
    static trackFamily(familyId) {
        this.familyIds.add(familyId);
    }
    static async cleanup() {
        // Clean up families first to handle cascading
        for (const familyId of this.familyIds) {
            const family = mockData.families.get(familyId);
            if (family) {
                // Update users to remove family reference
                family.members.forEach(member => {
                    const user = mockData.users.get(member.id);
                    if (user) {
                        mockData.users.set(member.id, { ...user, familyId: null });
                    }
                });
                mockData.families.delete(familyId);
            }
        }
        // Clean up users
        for (const userId of this.userIds) {
            mockData.users.delete(userId);
        }
        // Clear tracking sets
        this.userIds.clear();
        this.familyIds.clear();
    }
}
TestCleanup.userIds = new Set();
TestCleanup.familyIds = new Set();
export function generateFutureDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
}
export function getTestUsers() {
    const timestamp = Date.now();
    return {
        parent: {
            email: `parent_${timestamp}@test.com`,
            password: 'TestPass123!',
            role: UserRole.PARENT,
            firstName: 'Test',
            lastName: 'Parent',
            username: `parent_${timestamp}`
        },
        member: {
            email: `member_${timestamp}@test.com`,
            password: 'TestPass123!',
            role: UserRole.MEMBER,
            firstName: 'Test',
            lastName: 'Member',
            username: `member_${timestamp}`
        }
    };
}
export async function createTestUser(data) {
    const timestamp = Date.now();
    const hashedPassword = await hashPassword(data.password || 'TestPass123!');
    // Ensure unique and predictable identifiers
    const uniqueId = `test-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const role = data.role || UserRole.MEMBER;
    const email = data.email || `${role.toLowerCase()}_${timestamp}@test.com`;
    const username = data.username || uniqueId;
    const userData = {
        id: uniqueId,
        email,
        password: hashedPassword,
        role: role,
        firstName: data.firstName || 'Test',
        lastName: data.lastName || 'User',
        username
    };
    // Only add familyId if it's explicitly provided
    if (data.familyId) {
        userData.familyId = data.familyId;
    }
    try {
        // Create the user with our mock implementation
        const mockUser = await mockPrisma.user.create({
            data: userData
        });
        // Create token payload
        const tokenPayload = {
            userId: userData.id,
            email: userData.email,
            role: userData.role,
            familyId: userData.familyId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        };
        // Generate token
        const token = await generateToken(tokenPayload);
        // Set up test token verification
        const testTokenVerification = async (inputToken) => {
            try {
                const verifiedPayload = await verifyToken(inputToken);
                return verifiedPayload || null;
            }
            catch {
                return null;
            }
        };
        // Set test token verification if available
        if (typeof setTestTokenVerification === 'function') {
            setTestTokenVerification(testTokenVerification);
        }
        return {
            user: {
                ...mockUser,
                familyId: userData.familyId || undefined // Convert null to undefined
            },
            token
        };
    }
    catch (error) {
        console.error('Failed to create test user:', error);
        throw error;
    }
}
// Add a global reset function for test data
export function resetTestData() {
    // Reset mock data maps
    mockData.users.clear();
    mockData.families.clear();
    // Reset token verification to a more strict test verification method
    if (typeof setTestTokenVerification === 'function') {
        setTestTokenVerification(async (inputToken) => {
            try {
                // Verify the token with the secret key
                const decoded = jwt.verify(inputToken, process.env.JWT_SECRET || 'test-secret-key');
                // Strict validation of required fields
                if (!decoded.userId || !decoded.email || !decoded.role) {
                    console.warn('Incomplete token payload', decoded);
                    return null;
                }
                // Return the verified payload
                const payload = {
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                    familyId: decoded.familyId,
                    iat: decoded.iat,
                    exp: decoded.exp
                };
                // Minimal logging for debugging
                if (process.env.NODE_ENV === 'test') {
                    console.log('Token Verification:', {
                        userId: payload.userId,
                        role: payload.role,
                        isTestEnvironment: true
                    });
                }
                return payload;
            }
            catch (error) {
                // Consistent error handling
                console.error('Token verification error:', error instanceof Error ? error.message : String(error));
                return null;
            }
        });
    }
}
// Add a global afterEach reset for tests
afterEach(() => {
    resetTestData();
});
//# sourceMappingURL=test-utils.js.map