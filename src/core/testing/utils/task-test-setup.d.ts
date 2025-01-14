import request from 'supertest';
type TestAgent = ReturnType<typeof request>;
import { prisma } from '../../../utils/prisma';
export interface TaskTestContext {
    agent: TestAgent;
    parentToken: string;
    memberToken: string;
    familyId: string;
    taskId?: string;
    memberId: string;
    parentId: string;
    serverInstance?: {
        server: any;
    };
}
export declare function setupTaskTest(): Promise<TaskTestContext>;
export declare function cleanupTaskTest(): Promise<void>;
export { prisma };
export declare function getSharedTestClient(): TestAgent;
//# sourceMappingURL=task-test-setup.d.ts.map