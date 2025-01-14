import { createTestEvent, createTestEvents } from '../test-helpers';
describe('Test Helpers', () => {
    describe('createTestEvent', () => {
        it('should create event with correct structure', () => {
            const event = createTestEvent('TEST_TYPE', { value: 1 });
            expect(event.type).toBe('TEST_TYPE');
            expect(event.source).toBe('test-service');
            expect(event.timestamp).toBeDefined();
            expect(event.data).toEqual({ value: 1 });
            expect(event.id).toBeDefined();
            expect(event.channel).toBeDefined();
        });
        it('should create events with unique timestamps', () => {
            const event1 = createTestEvent('TEST_TYPE', { value: 1 });
            const event2 = createTestEvent('TEST_TYPE', { value: 1 });
            expect(event1.timestamp).not.toBe(event2.timestamp);
        });
        it('should allow custom source', () => {
            const event = createTestEvent('TEST_TYPE', { value: 1 }, 'custom-service');
            expect(event.source).toBe('custom-service');
        });
    });
    describe('createTestEvents', () => {
        it('should create specified number of events', () => {
            const events = createTestEvents(2, { value: 1 });
            expect(events).toHaveLength(2);
            events.forEach(event => {
                expect(event.type).toBe('TEST_TYPE');
                expect(event.data).toEqual({ value: 1 });
            });
        });
        it('should create events with unique timestamps', () => {
            const events = createTestEvents(2, { value: 1 });
            const timestamps = events.map(e => e.timestamp);
            const uniqueTimestamps = new Set(timestamps);
            expect(uniqueTimestamps.size).toBe(2);
        });
        it('should use provided payload for all events', () => {
            const data = { test: true };
            const events = createTestEvents(3, data);
            events.forEach(event => {
                expect(event.data).toEqual(data);
            });
        });
    });
});
//# sourceMappingURL=test-helpers.test.js.map