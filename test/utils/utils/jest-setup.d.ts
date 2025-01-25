import supertest from 'supertest';
type TestAgent = ReturnType<typeof supertest.agent>;
export interface TestContext {
    agent: TestAgent;
    cleanup: () => Promise<void>;
}
export declare function setupTestContext(): Promise<TestContext>;
export declare function cleanupDatabase(): Promise<void>;
export {};
//# sourceMappingURL=jest-setup.d.ts.map