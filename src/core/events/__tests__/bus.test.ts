import { EventBus } from '../EventBus';
import { EventDeliveryStatus } from '../types';
import { createTestEvent } from '../utils/test-helpers';

describe('EventBus', () => {
  let eventBus: EventBus;
  const TEST_CHANNEL = 'test-channel';

  beforeEach(async () => {
    // Clean up any existing instance
    if (EventBus['instance']) {
      const instance = EventBus.getInstance();
      if (instance.getRunningState()) {
        await instance.stop();
      }
      EventBus.resetInstance();
    }

    // Create new instance
    eventBus = EventBus.getInstance({
      validateEvents: true,
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 100
    });
    await eventBus.start();
    
    // Register test channel
    eventBus.registerChannel(TEST_CHANNEL);
  });

  afterEach(async () => {
    if (eventBus.getRunningState()) {
      await eventBus.stop();
    }
    EventBus.resetInstance();
  });

  it('should be a singleton', () => {
    const instance1 = EventBus.getInstance();
    const instance2 = EventBus.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should publish and subscribe to events', async () => {
    const handler = jest.fn();
    await eventBus.subscribe(TEST_CHANNEL, handler);

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await eventBus.publish(TEST_CHANNEL, event);

    expect(result.status).toBe(EventDeliveryStatus.Success);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should handle multiple subscribers', async () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    await eventBus.subscribe(TEST_CHANNEL, handler1);
    await eventBus.subscribe(TEST_CHANNEL, handler2);

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await eventBus.publish(TEST_CHANNEL, event);

    expect(result.status).toBe(EventDeliveryStatus.Success);
    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it('should unsubscribe handlers', async () => {
    const handler = jest.fn();
    const unsubscribe = eventBus.subscribe(TEST_CHANNEL, handler);
    unsubscribe();

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    await eventBus.publish(TEST_CHANNEL, event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle subscriber errors', async () => {
    const error = new Error('Handler failed');
    const handler = jest.fn().mockRejectedValue(error);

    await eventBus.subscribe(TEST_CHANNEL, handler);

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await eventBus.publish(TEST_CHANNEL, event);

    expect(result.status).toBe(EventDeliveryStatus.Failed);
    expect(result.errors).toContain('Handler failed');
  });

  it('should not publish when stopped', async () => {
    await eventBus.stop();

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    await expect(eventBus.publish(TEST_CHANNEL, event)).rejects.toThrow('Event bus is not running');
  });

  it('should not subscribe when stopped', async () => {
    await eventBus.stop();

    const handler = jest.fn();
    expect(() => {
      eventBus.subscribe(TEST_CHANNEL, handler);
    }).toThrow('Event bus is not running');
  });

  it('should clear subscribers on stop', async () => {
    const handler = jest.fn();
    await eventBus.subscribe(TEST_CHANNEL, handler);
    await eventBus.stop();
    await eventBus.start();
    eventBus.registerChannel(TEST_CHANNEL);

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    await eventBus.publish(TEST_CHANNEL, event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle invalid channel', async () => {
    const event = createTestEvent('TEST_EVENT', { value: 1 });
    await expect(eventBus.publish('invalid-channel', event)).rejects.toThrow('Channel invalid-channel not found');
  });

  it('should register new channels', async () => {
    const NEW_CHANNEL = 'new-channel';
    eventBus.registerChannel(NEW_CHANNEL);

    const handler = jest.fn();
    await eventBus.subscribe(NEW_CHANNEL, handler);

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await eventBus.publish(NEW_CHANNEL, event);

    expect(result.status).toBe(EventDeliveryStatus.Success);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should not register duplicate channels', () => {
    expect(() => {
      eventBus.registerChannel(TEST_CHANNEL);
    }).toThrow(`Channel ${TEST_CHANNEL} already exists`);
  });
});
