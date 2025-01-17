import { PrismaClient } from '@prisma/client';
import type { SuperTest, Test } from 'supertest';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function getTestClient(): Promise<SuperTest<Test>>;
export interface TestContext {
    agent: SuperTest<Test>;
    parentToken: string;
    memberToken: string;
    familyId: string;
}
export declare const testUsers: {
    parent: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    member: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    };
};
export declare function createTestContext(): Promise<TestContext>;
export declare const cleanupTestData: () => Promise<void>;
export declare const setupTestContext: () => Promise<TestContext>;
//# sourceMappingURL=task-test-utils.d.ts.map