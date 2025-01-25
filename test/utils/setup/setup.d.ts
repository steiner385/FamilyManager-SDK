import type { SuperTest, Test } from 'supertest';
import type { ServerInstance } from '../index.js';
export interface TestContext {
    agent: SuperTest<Test>;
    serverInstance: ServerInstance;
    cleanup: () => Promise<void>;
}
import type { Hono } from 'hono';
export declare function setupTestContext(testApp?: Hono): Promise<TestContext>;
//# sourceMappingURL=setup.d.ts.map