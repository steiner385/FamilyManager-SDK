import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import type { Plugin, PluginState } from '../../plugin/types';

// Mock data interfaces
interface MockFamilyCreateArgs {
  data: {
    name: string;
    description?: string | null;
    members?: {
      connect?: { id: string } | { id: string }[];
    };
  };
}

interface MockFamilyUpdateArgs {
  where: { id: string };
  data: {
    name?: string;
    description?: string | null;
    members?: {
      connect?: { id: string } | { id: string }[];
      disconnect?: { id: string } | { id: string }[];
    };
  };
}

// Define UserRole enum
enum UserRole {
  PARENT = 'PARENT',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

// Define TokenPayload interface
interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  familyId?: string;
  iat?: number;
  exp?: number;
}

// Define Prisma interfaces
interface PrismaUser {
  id: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  familyId: string | null;
}

interface PrismaFamily {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: PrismaUser[];
}

// Mock data types
type MockUser = PrismaUser & {
  id: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  familyId: string | null;
};

type MockFamily = PrismaFamily;

// Mock the Prisma module
jest.mock('../../lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// Get the mocked prisma instance
const { prisma: mockPrisma } = jest.requireMock('../../lib/prisma') as {
  prisma: DeepMockProxy<PrismaClient>
};

// Configure mock behavior
const mockData = {
  users: new Map<string, MockUser>(),
  families: new Map<string, MockFamily>()
};

// Mock user operations
mockPrisma.user.create.mockImplementation(async (args: { 
  data: {
    id?: string;
    email: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    username: string;
    familyId?: string;
    family?: { connect: { id: string } };
  }
}) => {
  const data = args.data as Required<typeof args.data>;
  const user: MockUser = {
    id: data.id || `test-${Date.now()}`,  // Use provided ID if available
    email: data.email,
    password: data.password,
    role: data.role || 'MEMBER',
    firstName: data.firstName || 'Test',
    lastName: data.lastName || 'User',
    username: data.username,
    createdAt: new Date(),
    updatedAt: new Date(),
    familyId: (data.family as any)?.connect?.id || null
  };

  // Store the user in our mock data store
  mockData.users.set(user.id, user);
  console.log('Created user:', user.id);
  console.log('Current users:', Array.from(mockData.users.keys()));

  // Create a mock that matches what we need
  const mockClient = {
    ...user,
    family: () => Promise.resolve(null),
    createdTasks: () => Promise.resolve([]),
    assignedTasks: () => Promise.resolve([]),
    $fragment: jest.fn(),
    $on: jest.fn(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $use: jest.fn(),
    $transaction: jest.fn(),
    $extends: jest.fn()
  };

  return Promise.resolve(mockClient);
});

mockPrisma.user.update.mockImplementation(async (args: {
  where: { id: string };
  data: Partial<{
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    username: string;
    familyId: string;
  }>;
}) => {
  const user = mockData.users.get(args.where.id as string);
  if (!user) {
    console.log('User not found for update:', args.where.id);
    console.log('Available users:', Array.from(mockData.users.keys()));
    return Promise.resolve(null);
  }
  
  console.log('Updating user:', user.id);
  console.log('Update data:', args.data);
  
  const data = args.data as any;
  const updatedUser: MockUser = {
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
  const mockUser = mockDeep<any>({
    ...response,
    family: () => Promise.resolve(response.family),
    createdTasks: () => Promise.resolve([]),
    assignedTasks: () => Promise.resolve([])
  });
  return mockUser;
});

// Add a global beforeAll reset for tests
beforeAll(() => {
  resetTestData();
});

mockPrisma.user.findUnique.mockImplementation((args) => {
  console.log('findUnique - looking for user:', args.where.id);
  console.log('findUnique - available users:', Array.from(mockData.users.keys()));
  
  const user = mockData.users.get(args.where.id as string);
  if (!user) {
    console.log('findUnique - user not found');
    return mockDeep<any>(undefined);
  }
  
  console.log('findUnique - found user:', user);
  const family = user.familyId ? mockData.families.get(user.familyId) : undefined;
  const response = {
    ...user,
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
  const mockUser = mockDeep<any>({
    ...response,
    family: () => Promise.resolve(response.family),
    createdTasks: () => Promise.resolve([]),
    assignedTasks: () => Promise.resolve([])
  });
  return mockUser;
});

// Mock family operations
mockPrisma.family.create.mockImplementation((args: Prisma.FamilyCreateArgs) => {
  const data = args.data as Required<typeof args.data>;
  const familyId = `family-${Date.now()}`;
  const family: MockFamily = {
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
      ? data.members.connect.map(m => (m as { id: string }).id)
      : [(data.members.connect as { id: string }).id];

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
  const mockFamily = mockDeep<any>({
    ...response,
    members: () => Promise.resolve(response.members),
    events: () => Promise.resolve([]),
    tasks: () => Promise.resolve([])
  });
  return mockFamily;
});

mockPrisma.family.findUnique.mockImplementation((args) => {
  const family = mockData.families.get(args.where.id as string);
  if (!family) return mockDeep<any>(undefined);
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
  const mockFamily = mockDeep<any>({
    ...response,
    members: () => Promise.resolve(response.members),
    events: () => Promise.resolve([]),
    tasks: () => Promise.resolve([])
  });
  return mockFamily;
});

mockPrisma.family.update.mockImplementation((args: Prisma.FamilyUpdateArgs) => {
  const family = mockData.families.get(args.where.id as string);
  if (!family) return mockDeep<any>(undefined);
  
  const updatedFamily: MockFamily = {
    ...family,
    name: typeof args.data.name === 'string' ? args.data.name : family.name,
    description: typeof args.data.description === 'string' ? args.data.description : family.description,
    updatedAt: new Date(),
    members: [...family.members]
  };

  // Handle member connections/disconnections
  if (args.data.members?.connect) {
    const memberIds = Array.isArray(args.data.members.connect) 
      ? args.data.members.connect.map(m => (m as { id: string }).id)
      : [(args.data.members.connect as { id: string }).id];

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
      ? args.data.members.disconnect.map(m => (m as { id: string }).id)
      : [(args.data.members.disconnect as { id: string }).id];

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
  const mockFamily = mockDeep<any>({
    ...response,
    members: () => Promise.resolve(response.members),
    events: () => Promise.resolve([]),
    tasks: () => Promise.resolve([])
  });
  return mockFamily;
});

import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import jwt from 'jsonwebtoken';
import { hashPassword, generateToken, verifyToken } from '../../utils/auth';
import type { TokenPayload } from '../../utils/auth';
import { UserRole } from '../../types/user-role';

// Mock data store type
interface MockDataStore {
  users: Map<string, MockUser>;
  families: Map<string, MockFamily>;
}

const mockData: MockDataStore = {
  users: new Map(),
  families: new Map()
};

// Helper functions for test data generation
export function generateMockId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function generateMockEmail(role: string = 'user'): string {
  return `${role.toLowerCase()}_${Date.now()}@test.com`;
}

export function generateMockFamily(overrides: Partial<MockFamily> = {}): MockFamily {
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

export function generateMockUser(overrides: Partial<MockUser> = {}): MockUser {
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
  private static userIds: Set<string> = new Set();
  private static familyIds: Set<string> = new Set();

  static trackUser(userId: string): void {
    this.userIds.add(userId);
  }

  static trackFamily(familyId: string): void {
    this.familyIds.add(familyId);
  }

  static async cleanup(): Promise<void> {
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

export function generateFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

interface TestUserData {
  email?: string;
  password?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  username?: string;
  familyId?: string;
}

interface TestUser {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
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

export async function createTestUser(data: TestUserData) {
  const timestamp = Date.now();
  const hashedPassword = await hashPassword(data.password || 'TestPass123!');

  // Ensure unique and predictable identifiers
  const uniqueId = `test-${timestamp}-${Math.floor(Math.random() * 1000)}`;
  const role = data.role || UserRole.MEMBER;
  const email = data.email || `${role.toLowerCase()}_${timestamp}@test.com`;
  const username = data.username || uniqueId;

  const userData: {
    id: string;
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    username: string;
    familyId?: string;
  } = {
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
    const tokenPayload: TokenPayload = {
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
    const testTokenVerification = async (inputToken: string) => {
      try {
        const verifiedPayload = await verifyToken(inputToken);
        return verifiedPayload || null;
      } catch {
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
        familyId: userData.familyId || undefined  // Convert null to undefined
      }, 
      token 
    };
  } catch (error) {
    console.error('Failed to create test user:', error);
    throw error;
  }
}

// Add a global reset function for test data
export function resetTestData(): void {
  // Reset mock data maps
  mockData.users.clear();
  mockData.families.clear();

  // Reset token verification to a more strict test verification method
  if (typeof setTestTokenVerification === 'function') {
    setTestTokenVerification(async (inputToken: string) => {
      try {
        // Verify the token with the secret key
        const decoded = jwt.verify(inputToken, process.env.JWT_SECRET || 'test-secret-key') as TokenPayload;
        
        // Strict validation of required fields
        if (!decoded.userId || !decoded.email || !decoded.role) {
          console.warn('Incomplete token payload', decoded);
          return null;
        }

        // Return the verified payload
        const payload: TokenPayload = {
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
      } catch (error) {
        // Consistent error handling
        console.error('Token verification error:', 
          error instanceof Error ? error.message : String(error)
        );
        return null;
      }
    });
  }
}

// Add a global afterEach reset for tests
afterEach(() => {
  resetTestData();
});
