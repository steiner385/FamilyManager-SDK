import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { EventBus } from '../EventBus';
import { BaseEvent, EventDeliveryStatus, EventHandler } from '../types';
import { logger } from '../../logging/Logger';

// Mock dependencies
jest.mock('../../logging/Logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Helper function to create typed mock handlers
const createMockHandler = () => {
  return jest.fn().mockImplementation(() => Promise.resolve()) as unknown as EventHandler;
};

// Helper function to create test events
const createTestEvent = (type: string, data: any = {}): BaseEvent => ({
  id: 'test-id',
  type,
  channel: type, // Use same value for both type and channel
  timestamp: Date.now(),
  data
});

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    // Reset singleton instance
    EventBus.resetInstance();
    eventBus = EventBus.getInstance();
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should maintain singleton instance', () => {
      const instance1 = EventBus.getInstance();
      const instance2 = EventBus.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = EventBus.getInstance();
      EventBus.resetInstance();
      const instance2 = EventBus.getInstance();
      expect(instance1).not.toBe(instance2);
    });

    it('should maintain configuration across getInstance calls', () => {
      const config = { maxRetries: 5, retryDelay: 2000 };
      const instance1 = EventBus.getInstance(config);
      const instance2 = EventBus.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Running State', () => {
    it('should start in stopped state', () => {
      expect(eventBus.getRunningState()).toBe(false);
    });

    it('should change state on start/stop', async () => {
      await eventBus.start();
      expect(eventBus.getRunningState()).toBe(true);

      await eventBus.stop();
      expect(eventBus.getRunningState()).toBe(false);
    });

    it('should log state changes', async () => {
      await eventBus.start();
      expect(logger.info).toHaveBeenCalledWith('EventBus started');

      await eventBus.stop();
      expect(logger.info).toHaveBeenCalledWith('EventBus stopped');
    });

    it('should clear subscriptions on stop', async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
      const handler = createMockHandler();
      eventBus.subscribe('test-channel', handler);

      await eventBus.stop();
      expect(eventBus.getSubscriptionCount('test-channel')).toBe(0);
    });
  });

  describe('Channel Registration', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should register new channels', () => {
      eventBus.registerChannel('test-channel');
      expect(() => eventBus.registerChannel('test-channel')).toThrow();
      expect(logger.debug).toHaveBeenCalledWith('Registered channel: test-channel');
    });

    it('should prevent duplicate channel registration', () => {
      eventBus.registerChannel('test-channel');
      expect(() => eventBus.registerChannel('test-channel')).toThrow(
        'Channel test-channel is already registered'
      );
    });

    it('should require channel registration before subscription', () => {
      const handler = createMockHandler();
      expect(() => eventBus.subscribe('unregistered-channel', handler)).toThrow(
        'Channel unregistered-channel is not registered'
      );
    });
  });

  describe('Event Subscription', () => {
    beforeEach(async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
    });

    it('should subscribe to events', () => {
      const handler = createMockHandler();
      const subscriptionId = eventBus.subscribe('test-channel', handler);
      expect(typeof subscriptionId).toBe('string');
      expect(eventBus.getSubscriptionCount('test-channel')).toBe(1);
    });

    it('should prevent subscription when stopped', async () => {
      await eventBus.stop();
      const handler = createMockHandler();
      expect(() => eventBus.subscribe('test-channel', handler)).toThrow(
        'Cannot subscribe while EventBus is stopped'
      );
    });

    it('should unsubscribe from events', () => {
      const handler = createMockHandler();
      const subscriptionId = eventBus.subscribe('test-channel', handler);
      expect(eventBus.getSubscriptionCount('test-channel')).toBe(1);

      eventBus.unsubscribe(subscriptionId);
      expect(eventBus.getSubscriptionCount('test-channel')).toBe(0);
    });

    it('should handle multiple subscriptions to same channel', () => {
      const handler1 = createMockHandler();
      const handler2 = createMockHandler();
      eventBus.subscribe('test-channel', handler1);
      eventBus.subscribe('test-channel', handler2);
      expect(eventBus.getSubscriptionCount('test-channel')).toBe(2);
    });
  });

  describe('Event Emission', () => {
    beforeEach(async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
    });

    it('should emit events to subscribers', async () => {
      const handler = createMockHandler();
      eventBus.subscribe('test-channel', handler);

      const event = createTestEvent('test-channel', { test: true });
      await eventBus.emit(event);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should prevent emission when stopped', async () => {
      await eventBus.stop();
      const event = createTestEvent('test-channel');
      await expect(eventBus.emit(event)).rejects.toThrow(
        'Cannot emit events while EventBus is stopped'
      );
    });

    it('should handle events with no subscribers', async () => {
      const event = createTestEvent('test-channel');
      const status = await eventBus.emit(event);
      expect(status).toBe(EventDeliveryStatus.SUCCESS);
      expect(logger.debug).toHaveBeenCalledWith('No subscribers for event test-channel');
    });

    it('should deliver events to multiple subscribers', async () => {
      const handler1 = createMockHandler();
      const handler2 = createMockHandler();
      eventBus.subscribe('test-channel', handler1);
      eventBus.subscribe('test-channel', handler2);

      const event = createTestEvent('test-channel', { test: true });
      await eventBus.emit(event);
      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);
    });
  });

  describe('Retry Mechanism', () => {
    let handler: EventHandler;
    let event: BaseEvent;

    beforeEach(async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
      handler = createMockHandler();
      event = createTestEvent('test-channel', { test: true });
    });

    it('should retry failed deliveries', async () => {
      const mockHandler = handler as jest.Mock;
      mockHandler
        .mockImplementationOnce(() => Promise.reject(new Error('First attempt failed')))
        .mockImplementationOnce(() => Promise.reject(new Error('Second attempt failed')))
        .mockImplementationOnce(() => Promise.resolve());

      eventBus.subscribe('test-channel', handler);
      await eventBus.emit(event);

      expect(handler).toHaveBeenCalledTimes(3);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Retrying event delivery'),
        expect.any(Object)
      );
    });

    it('should respect maxRetries configuration', async () => {
      EventBus.resetInstance();
      eventBus = EventBus.getInstance({ maxRetries: 2 });
      await eventBus.start();
      eventBus.registerChannel('test-channel');

      const mockHandler = handler as jest.Mock;
      mockHandler
        .mockImplementationOnce(() => Promise.reject(new Error('First attempt failed')))
        .mockImplementationOnce(() => Promise.reject(new Error('Second attempt failed')))
        .mockImplementationOnce(() => Promise.reject(new Error('Third attempt failed')));

      eventBus.subscribe('test-channel', handler);
      const status = await eventBus.emit(event);

      expect(handler).toHaveBeenCalledTimes(3);
      expect(status).toBe(EventDeliveryStatus.FAILED);
    });

    it('should respect retryDelay configuration', async () => {
      const retryDelay = 100;
      EventBus.resetInstance();
      eventBus = EventBus.getInstance({ retryDelay });
      await eventBus.start();
      eventBus.registerChannel('test-channel');

      const mockHandler = handler as jest.Mock;
      mockHandler
        .mockImplementationOnce(() => Promise.reject(new Error('First attempt failed')))
        .mockImplementationOnce(() => Promise.resolve());

      eventBus.subscribe('test-channel', handler);
      const start = Date.now();
      await eventBus.emit(event);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(retryDelay);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
    });

    it('should handle partial delivery failures', async () => {
      const successHandler = createMockHandler();
      const failureHandler = createMockHandler();
      (failureHandler as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Handler failed'))
      );

      eventBus.subscribe('test-channel', successHandler);
      eventBus.subscribe('test-channel', failureHandler);

      const event = createTestEvent('test-channel');
      const status = await eventBus.emit(event);
      expect(status).toBe(EventDeliveryStatus.PARTIAL);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle invalid channel emissions', async () => {
      const event = createTestEvent('invalid-channel');
      await expect(eventBus.emit(event)).rejects.toThrow(
        'Channel invalid-channel is not registered'
      );
    });

    it('should handle subscriber cleanup on unsubscribe', () => {
      const handler = createMockHandler();
      const subscriptionId = eventBus.subscribe('test-channel', handler);

      // Unsubscribe multiple times should not throw
      eventBus.unsubscribe(subscriptionId);
      eventBus.unsubscribe(subscriptionId);

      expect(eventBus.getSubscriptionCount('test-channel')).toBe(0);
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await eventBus.start();
      eventBus.registerChannel('test-channel');
    });

    it('should handle rapid event emissions', async () => {
      const handler = createMockHandler();
      eventBus.subscribe('test-channel', handler);

      const events = Array.from({ length: 100 }, (_, i) => 
        createTestEvent('test-channel', { index: i })
      );

      await Promise.all(events.map(event => eventBus.emit(event)));
      expect(handler).toHaveBeenCalledTimes(100);
    });

    it('should handle concurrent subscriptions and emissions', async () => {
      const handlers = Array.from({ length: 10 }, () => createMockHandler());

      // Subscribe handlers
      handlers.forEach(handler => eventBus.subscribe('test-channel', handler));

      // Create and emit events
      const events = Array.from({ length: 10 }, (_, i) => 
        createTestEvent('test-channel', { index: i })
      );

      // Emit events concurrently
      await Promise.all(events.map(event => eventBus.emit(event)));

      // Verify all handlers were called correctly
      handlers.forEach(handler => {
        expect(handler).toHaveBeenCalledTimes(10);
      });
    });
  });
});
