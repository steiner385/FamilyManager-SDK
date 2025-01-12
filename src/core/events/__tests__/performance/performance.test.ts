import { EventBus } from '../../EventBus';
import { createTestEvent } from '../../utils/test-helpers';
import { BaseEvent } from '../../types';

describe('Event System Performance', () => {
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

    // Create new instance with performance-optimized config
    eventBus = EventBus.getInstance({
      validateEvents: true,
      maxRetries: 3,
      batchSize: 100,
      flushInterval: 50
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

  it('should handle high event throughput', async () => {
    const receivedEvents: BaseEvent[] = [];
    const handler = jest.fn(async (event: BaseEvent) => {
      receivedEvents.push(event);
    });

    await eventBus.subscribe(TEST_CHANNEL, handler);

    const numEvents = 1000;
    const events = Array.from({ length: numEvents }, (_, i) => 
      createTestEvent('TEST_EVENT', { index: i })
    );

    const startTime = Date.now();
    await Promise.all(events.map(event => eventBus.publish(TEST_CHANNEL, event)));
    const endTime = Date.now();

    expect(receivedEvents).toHaveLength(numEvents);
    expect(endTime - startTime).toBeLessThan(5000); // Should process 1000 events in under 5s
  });

  it('should handle concurrent subscribers', async () => {
    const numSubscribers = 10;
    const receivedCounts = new Array(numSubscribers).fill(0);
    
    const handlers = Array.from({ length: numSubscribers }, (_, i) => 
      jest.fn(async () => { receivedCounts[i]++; })
    );

    await Promise.all(handlers.map(handler => eventBus.subscribe(TEST_CHANNEL, handler)));

    const numEvents = 100;
    const events = Array.from({ length: numEvents }, (_, i) => 
      createTestEvent('TEST_EVENT', { index: i })
    );

    await Promise.all(events.map(event => eventBus.publish(TEST_CHANNEL, event)));

    // Each subscriber should receive all events
    receivedCounts.forEach(count => {
      expect(count).toBe(numEvents);
    });
  });

  it('should handle event batching', async () => {
    const receivedBatches: BaseEvent[][] = [];
    const handler = jest.fn(async (event: BaseEvent) => {
      if (!receivedBatches[0] || receivedBatches[0].length >= 100) {
        receivedBatches.unshift([]);
      }
      receivedBatches[0].push(event);
    });

    await eventBus.subscribe(TEST_CHANNEL, handler);

    const numEvents = 500;
    const events = Array.from({ length: numEvents }, (_, i) => 
      createTestEvent('TEST_EVENT', { index: i })
    );

    await Promise.all(events.map(event => eventBus.publish(TEST_CHANNEL, event)));

    // Should have batched events efficiently
    expect(receivedBatches.length).toBeLessThan(numEvents);
    expect(receivedBatches.flat()).toHaveLength(numEvents);
  });
});
