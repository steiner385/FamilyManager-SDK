import { PrismaClient } from '@prisma/client';
import request from 'supertest';
export declare function getPrismaClient(): PrismaClient;
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export interface BaseTestContext {
    agent: request.SuperTest<request.Test>;
    cleanup: () => Promise<void>;
}
export declare function connectWithRetry(retries?: number, delay?: number): Promise<void>;
export declare function setupBaseTest(): Promise<BaseTestContext>;
export declare function cleanupBaseTest(): Promise<void>;
export declare function cleanDatabase(): Promise<void>;
export declare function globalTeardown(): Promise<void>;
//# sourceMappingURL=test-base.d.ts.map