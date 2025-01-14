import { EventRouter } from '../router';
import { createTestEvent, createMockEventHandler, createMockErrorHandler } from '../utils/test-helpers';
describe('EventRouter', () => {
    let router;
    const TEST_CHANNEL = 'test-channel';
    beforeEach(() => {
        router = new EventRouter();
        router.start();
        router.registerChannel(TEST_CHANNEL);
    });
    afterEach(() => {
        router.stop();
    });
    it('should route events to subscribers', async () => {
        const { handler, receivedEvents } = createMockEventHandler();
        router.subscribe(TEST_CHANNEL, handler);
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await router.route(TEST_CHANNEL, event);
        expect(receivedEvents).toHaveLength(1);
        expect(receivedEvents[0]).toBe(event);
    });
    it('should not route events after unsubscribe', async () => {
        const { handler, receivedEvents } = createMockEventHandler();
        const unsubscribe = router.subscribe(TEST_CHANNEL, handler);
        unsubscribe();
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await router.route(TEST_CHANNEL, event);
        expect(receivedEvents).toHaveLength(0);
    });
    it('should handle multiple subscribers', async () => {
        const { handler: handler1, receivedEvents: events1 } = createMockEventHandler();
        const { handler: handler2, receivedEvents: events2 } = createMockEventHandler();
        router.subscribe(TEST_CHANNEL, handler1);
        router.subscribe(TEST_CHANNEL, handler2);
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await router.route(TEST_CHANNEL, event);
        expect(events1).toHaveLength(1);
        expect(events2).toHaveLength(1);
        expect(events1[0]).toBe(event);
        expect(events2[0]).toBe(event);
    });
    it('should handle subscriber errors', async () => {
        const errorHandler = createMockErrorHandler('Handler failed');
        router.subscribe(TEST_CHANNEL, errorHandler);
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await expect(router.route(TEST_CHANNEL, event)).rejects.toThrow('Handler failed');
    });
    it('should not route events when stopped', async () => {
        const { handler } = createMockEventHandler();
        router.subscribe(TEST_CHANNEL, handler);
        router.stop();
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await expect(router.route(TEST_CHANNEL, event))
            .rejects.toThrow('Router is not running');
    });
    it('should handle invalid channel', async () => {
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await expect(router.route('invalid-channel', event)).rejects.toThrow('Channel invalid-channel not found');
    });
    it('should register new channels', async () => {
        const NEW_CHANNEL = 'new-channel';
        router.registerChannel(NEW_CHANNEL);
        const { handler, receivedEvents } = createMockEventHandler();
        router.subscribe(NEW_CHANNEL, handler);
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await router.route(NEW_CHANNEL, event);
        expect(receivedEvents).toHaveLength(1);
        expect(receivedEvents[0]).toBe(event);
    });
    it('should not register duplicate channels', () => {
        expect(() => {
            router.registerChannel(TEST_CHANNEL);
        }).toThrow(`Channel ${TEST_CHANNEL} already exists`);
    });
    it('should handle maximum subscribers limit', () => {
        const maxSubscribers = 100;
        for (let i = 0; i < maxSubscribers; i++) {
            const { handler } = createMockEventHandler();
            router.subscribe(TEST_CHANNEL, handler);
        }
        const { handler } = createMockEventHandler();
        expect(() => {
            router.subscribe(TEST_CHANNEL, handler);
        }).toThrow('Maximum number of subscribers reached for channel');
    });
    it('should maintain channel isolation', async () => {
        const OTHER_CHANNEL = 'other-channel';
        router.registerChannel(OTHER_CHANNEL);
        const { handler: handler1, receivedEvents: events1 } = createMockEventHandler();
        const { handler: handler2, receivedEvents: events2 } = createMockEventHandler();
        router.subscribe(TEST_CHANNEL, handler1);
        router.subscribe(OTHER_CHANNEL, handler2);
        const event = createTestEvent('TEST_EVENT', { value: 1 });
        await router.route(TEST_CHANNEL, event);
        expect(events1).toHaveLength(1);
        expect(events2).toHaveLength(0);
    });
});
//# sourceMappingURL=router.test.js.map