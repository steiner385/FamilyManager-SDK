import { describe, expect, it, beforeEach } from '@jest/globals';
import { Request } from 'node-fetch';
import { setupTestApp } from '../../../core/testing/utils/test-setup';
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
      id: 'test-event-1',
      type: 'test-event',
      channel: 'test-channel',
      source: 'test-source',
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
