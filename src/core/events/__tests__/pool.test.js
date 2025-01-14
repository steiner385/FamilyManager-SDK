import { EventPool } from '../pool';
describe('EventPool', () => {
    let pool;
    beforeEach(() => {
        pool = new EventPool({
            maxSize: 10,
            initialSize: 5,
            expandSteps: 2
        });
    });
    afterEach(() => {
        pool.destroy();
    });
    it('should initialize with correct size', () => {
        const stats = pool.getStats();
        expect(stats.size).toBe(5);
        expect(stats.available).toBe(5);
        expect(stats.inUse).toBe(0);
        expect(stats.total).toBe(10);
    });
    it('should acquire and release events', () => {
        const event = pool.acquire();
        expect(event).toBeDefined();
        if (event) {
            expect(event.isInUse()).toBe(true);
            expect(pool.getStats().inUse).toBe(1);
            pool.release(event);
            expect(event.isInUse()).toBe(false);
            expect(pool.getStats().inUse).toBe(0);
        }
    });
    it('should expand pool when needed', () => {
        const events = [];
        for (let i = 0; i < 7; i++) {
            events.push(pool.acquire());
        }
        const stats = pool.getStats();
        expect(stats.size).toBe(7);
        expect(stats.available).toBe(0);
        expect(stats.inUse).toBe(7);
        expect(stats.total).toBe(10);
    });
    it('should not expand beyond maxSize', () => {
        const events = [];
        for (let i = 0; i < 12; i++) {
            events.push(pool.acquire());
        }
        const stats = pool.getStats();
        expect(stats.size).toBe(10);
        expect(stats.available).toBe(0);
        expect(stats.inUse).toBe(10);
        expect(stats.total).toBe(10);
        expect(events[10]).toBeNull();
        expect(events[11]).toBeNull();
    });
    it('should create events with data', () => {
        const event = pool.createEvent({
            id: '1',
            channel: 'test',
            type: 'test',
            timestamp: 123,
            data: { value: 1 }
        });
        expect(event).toBeDefined();
        if (event) {
            expect(event.id).toBe('1');
            expect(event.channel).toBe('test');
            expect(event.type).toBe('test');
            expect(event.timestamp).toBe(123);
            expect(event.data).toEqual({ value: 1 });
            expect(event.isInUse()).toBe(true);
        }
    });
    it('should handle pool exhaustion', () => {
        // Fill the pool
        for (let i = 0; i < 10; i++) {
            pool.acquire();
        }
        const stats = pool.getStats();
        expect(stats.size).toBe(10);
        expect(stats.available).toBe(0);
        expect(stats.inUse).toBe(10);
        // Try to acquire when full
        const event = pool.acquire();
        expect(event).toBeNull();
    });
    it('should clear and reinitialize pool', () => {
        // Acquire some events
        pool.acquire();
        pool.acquire();
        let stats = pool.getStats();
        expect(stats.inUse).toBe(2);
        // Clear pool
        pool.clear();
        stats = pool.getStats();
        expect(stats.size).toBe(5);
        expect(stats.available).toBe(5);
        expect(stats.inUse).toBe(0);
    });
    it('should update configuration', () => {
        pool.updateConfig({ maxSize: 15 });
        const events = [];
        for (let i = 0; i < 11; i++) {
            events.push(pool.acquire());
        }
        const stats = pool.getStats();
        expect(stats.total).toBe(15);
        expect(stats.size).toBe(11);
    });
    it('should acquire from base event', () => {
        const baseEvent = {
            id: '1',
            channel: 'test',
            type: 'test',
            timestamp: 123,
            data: { value: 1 }
        };
        const event = pool.acquireFromEvent(baseEvent);
        expect(event).toBeDefined();
        if (event) {
            expect(event.id).toBe('1');
            expect(event.channel).toBe('test');
            expect(event.type).toBe('test');
            expect(event.timestamp).toBe(123);
            expect(event.data).toEqual({ value: 1 });
            expect(event.isInUse()).toBe(true);
        }
    });
});
//# sourceMappingURL=pool.test.js.map