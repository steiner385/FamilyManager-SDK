import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { setupTestApp } from '../../testing/utils/test-setup';
import { EventBus } from '../EventBus';
import { BaseEvent, EventDeliveryStatus, EventHandler } from '../types';

// Helper function to create typed mock handlers
const createMockHandler = (): EventHandler => {
  return jest.fn().mockImplementation(() => Promise.resolve()) as unknown as EventHandler;
};

describe('Event API', () => {
  const app = setupTestApp();
  let eventBus: EventBus;

  beforeEach(async () => {
    EventBus.resetInstance();
    eventBus = EventBus.getInstance();
    await eventBus.start();
  });

  describe('POST /events', () => {
    it('should emit events through the API', async () => {
      eventBus.registerChannel('test-channel');
      const handler = createMockHandler();
      eventBus.subscribe('test-channel', handler);

      const event: BaseEvent = {
        type: 'test-channel',
        timestamp: Date.now(),
        data: { test: true },
      };

      const response = await app.request(new Request('http://localhost/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }));

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.status).toBe(EventDeliveryStatus.SUCCESS);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should handle invalid channel emissions', async () => {
      const event: BaseEvent = {
        type: 'invalid-channel',
        timestamp: Date.now(),
        data: {},
      };

      const response = await app.request(new Request('http://localhost/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }));

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.error).toBe('Channel invalid-channel is not registered');
    });
  });

  describe('GET /events/channels', () => {
    it('should return registered channels', async () => {
      eventBus.registerChannel('channel-1');
      eventBus.registerChannel('channel-2');

      const response = await app.request(new Request('http://localhost/events/channels'));
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.channels).toEqual(['channel-1', 'channel-2']);
    });

    it('should return empty array when no channels registered', async () => {
      const response = await app.request(new Request('http://localhost/events/channels'));
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result.channels).toEqual([]);
    });
  });
});
