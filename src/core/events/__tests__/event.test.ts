import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import type { Response } from 'supertest';
import { setupTestContext, cleanupTestContext } from '../../testing/utils/test-setup';
import type { TestContext } from '../../testing/utils/test-setup';
import { getTestUsers, createTestUser, generateFutureDate } from '../../testing/utils/test-utils';

describe('Event Management Endpoints', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await setupTestContext();
  });

  afterAll(async () => {
    await cleanupTestContext();
    if (context?.serverInstance?.server) {
      await new Promise<void>((resolve) => {
        context.serverInstance.server.close(() => resolve());
      });
    }
  });

  beforeEach(async () => {
    const users = getTestUsers();
    // Create parent user
    const parentResponse = await createTestUser(users.parent);
    context.parentToken = parentResponse.token;
    context.parentId = parentResponse.user.id;

    // Create member user
    const memberResponse = await createTestUser(users.member);
    context.memberToken = memberResponse.token;
    context.memberId = memberResponse.user.id;

    // Create family
    const familyResponse = await context.agent
      .post('/api/families')
      .set('Authorization', `Bearer ${context.parentToken}`)
      .send({ name: 'Test Family' });
    
    context.familyId = familyResponse.body.id;

    // Add member to family
    await context.agent
      .post(`/api/families/${context.familyId}/members`)
      .set('Authorization', `Bearer ${context.parentToken}`)
      .send({ userId: context.memberId });
  });

  describe('POST /api/events', () => {
    it('should validate event dates', async () => {
      console.log('[Test] Starting event date validation test');
      const startTime = generateFutureDate(2); // Start after end
      const endTime = generateFutureDate(1);
      
      console.log('[Test] Generated dates:', {
        startTime,
        endTime,
        startTimestamp: new Date(startTime).getTime(),
        endTimestamp: new Date(endTime).getTime()
      });

      const requestBody = {
        title: 'Test Event',
        description: 'Test description',
        startTime,
        endTime,
        familyId: context.familyId || 'test-family-id'
      };

      // Force Jest to show logs
      const originalLog = console.log;
      console.log = console.info;
      
      try {
        console.log('[Test] Sending request with body:', JSON.stringify(requestBody, null, 2));
        
        const response = await context.agent
          .post('/api/events')
          .set('Authorization', `Bearer ${context.memberToken}`)
          .set('Content-Type', 'application/json')
          .send(requestBody);

        console.log('[Test] Received response:', {
          status: response.status,
          body: response.body,
          headers: response.headers
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBe('start time must be before end time');
      } catch (error) {
        console.error('[Test] Request failed:', error);
        throw error;
      } finally {
        console.log = originalLog;
      }
    });

    // ... rest of the test file remains unchanged ...
  });
});
