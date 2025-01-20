import { describe, expect, it, beforeEach } from '@jest/globals';
import { setupTestApp } from '../../testing/utils/test-setup';
import { EventBus } from '../EventBus';
import { BaseEvent } from '../types';

describe('Event API', () => {
  const app = setupTestApp();
  let eventBus: EventBus;

  beforeEach(async () => {
    EventBus.resetInstance();
    eventBus = EventBus.getInstance();
    await eventBus.start();
  });

  it('should handle basic event operations', async () => {
    const event: BaseEvent = {
      type: 'test-event',
      timestamp: Date.now(),
      data: { test: true }
    };

    const response = await app.request(new Request('http://localhost/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }));

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.status).toBe('success');
  });
});
