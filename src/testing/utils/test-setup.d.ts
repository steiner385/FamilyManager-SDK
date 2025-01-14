import { PrismaClient } from '@prisma/client';
export interface TestContext {
    prisma: PrismaClient;
    server: any;
}
export declare const setupTestContext: () => Promise<TestContext>;
export declare const cleanupTestContext: () => Promise<void>;
export declare const getTestUsers: () => {
    id: string;
    email: string;
    role: string;
}[];
export declare const createTestUser: (overrides?: {}) => {
    id: string;
    email: string;
    role: string;
};
//# sourceMappingURL=test-setup.d.ts.map