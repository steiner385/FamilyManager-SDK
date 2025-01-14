import { setupTestContext } from './test-utils.js';
import { testUsers, createTestUser } from './test-utils.js';
export async function setupEventTestContext() {
    const baseContext = await setupTestContext();
    // Create parent user
    const parentResponse = await createTestUser(testUsers.parent);
    // Create member user
    const memberResponse = await createTestUser(testUsers.member);
    // Create family
    const familyResponse = await baseContext.agent
        .post('/api/families')
        .set('Authorization', `Bearer ${parentResponse.token}`)
        .send({ name: 'Test Family' });
    // Add member to family
    await baseContext.agent
        .post(`/api/families/${familyResponse.body.id}/members`)
        .set('Authorization', `Bearer ${parentResponse.token}`)
        .send({ userId: memberResponse.user.id });
    return {
        agent: baseContext.agent,
        cleanup: baseContext.cleanup,
        memberToken: memberResponse.token,
        parentToken: parentResponse.token,
        familyId: familyResponse.body.id,
        memberId: memberResponse.user.id,
        parentId: parentResponse.user.id,
        eventId: undefined
    };
}
//# sourceMappingURL=event-test-utils.js.map