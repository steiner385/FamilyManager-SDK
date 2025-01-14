import { SuperTest, Test } from 'supertest';
export interface EventTestContext {
    agent: SuperTest<Test>;
    cleanup: () => Promise<void>;
    memberToken: string;
    parentToken: string;
    familyId: string;
    eventId?: string;
    memberId: string;
    parentId: string;
}
export declare function setupEventTestContext(): Promise<EventTestContext>;
//# sourceMappingURL=event-test-utils.d.ts.map