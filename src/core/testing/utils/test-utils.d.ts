import { UserRole } from '../../types/user-role';
declare enum UserRole {
    PARENT = "PARENT",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}
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
interface MockTransaction {
    id: string;
    operations: Array<{
        type: 'create' | 'update' | 'delete';
        model: string;
        data: any;
    }>;
    timestamp: number;
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
interface TestContext {
    users: Map<string, MockUser>;
    families: Map<string, MockFamily>;
    transactions: Map<string, MockTransaction>;
    tokens: Map<string, string>;
}
declare class TestContextManager {
    private static instance;
    private context;
    private constructor();
    static getInstance(): TestContextManager;
    getContext(): TestContext;
    reset(): void;
    trackEntity(type: keyof TestContext, id: string, data: any): void;
    getEntity<T>(type: keyof TestContext, id: string): T | undefined;
}
export declare const testContext: TestContextManager;
export declare function generateMockId(prefix?: string): string;
export declare function generateMockEmail(role?: string): string;
export declare function generateMockFamily(overrides?: Partial<MockFamily>): MockFamily;
export declare function generateMockUser(overrides?: Partial<MockUser>): MockUser;
export declare class TestCleanup {
    private static userIds;
    private static familyIds;
    static trackUser(userId: string): void;
    static trackFamily(familyId: string): void;
    static cleanup(): Promise<void>;
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
export declare function createTestUser(data: TestUserData): Promise<{
    user: any;
    token: string;
}>;
export declare function resetTestData(): void;
export {};
//# sourceMappingURL=test-utils.d.ts.map