import { EventBus } from '../../EventBus';
import { createTestEvent } from '../../utils/test-helpers';
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
describe('Event System Performance', () => {
    let eventBus;
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
            maxRetries: 3,
            retryDelay: 50
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
        const receivedEvents = [];
        const handler = jest.fn((event) => {
            receivedEvents.push(event);
            return Promise.resolve();
        });
        eventBus.subscribe(TEST_CHANNEL, handler);
        const numEvents = 1000;
        const events = Array.from({ length: numEvents }, (_, i) => createTestEvent('TEST_EVENT', { index: i }));
        const startTime = Date.now();
        await Promise.all(events.map(event => eventBus.emit({ ...event, type: TEST_CHANNEL })));
        const endTime = Date.now();
        expect(receivedEvents).toHaveLength(numEvents);
        expect(endTime - startTime).toBeLessThan(5000); // Should process 1000 events in under 5s
    });
    it('should handle concurrent subscribers', async () => {
        const numSubscribers = 10;
        const receivedCounts = new Array(numSubscribers).fill(0);
        const handlers = Array.from({ length: numSubscribers }, (_, i) => jest.fn(() => {
            receivedCounts[i]++;
            return Promise.resolve();
        }));
        handlers.forEach(handler => eventBus.subscribe(TEST_CHANNEL, handler));
        const numEvents = 100;
        const events = Array.from({ length: numEvents }, (_, i) => createTestEvent('TEST_EVENT', { index: i }));
        await Promise.all(events.map(event => eventBus.emit({ ...event, type: TEST_CHANNEL })));
        // Each subscriber should receive all events
        receivedCounts.forEach(count => {
            expect(count).toBe(numEvents);
        });
    });
    it('should handle event batching', async () => {
        const receivedBatches = [];
        const handler = jest.fn((event) => {
            if (!receivedBatches[0] || receivedBatches[0].length >= 100) {
                receivedBatches.unshift([]);
            }
            receivedBatches[0].push(event);
            return Promise.resolve();
        });
        eventBus.subscribe(TEST_CHANNEL, handler);
        const numEvents = 500;
        const events = Array.from({ length: numEvents }, (_, i) => createTestEvent('TEST_EVENT', { index: i }));
        await Promise.all(events.map(event => eventBus.emit({ ...event, type: TEST_CHANNEL })));
        // Should have batched events efficiently
        expect(receivedBatches.length).toBeLessThan(numEvents);
        expect(receivedBatches.flat()).toHaveLength(numEvents);
    });
});
//# sourceMappingURL=performance.test.js.map