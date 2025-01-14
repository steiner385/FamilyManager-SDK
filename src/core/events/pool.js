import { EventDeliveryStatus } from './types';
class ManagedEvent {
    constructor() {
        this.id = '';
        this.poolId = '';
        this.type = '';
        this.channel = '';
        this.timestamp = 0;
        this.data = {};
        this.status = EventDeliveryStatus.PENDING;
        this.attempts = 0;
        this.isInUse = false;
    }
    reset() {
        this.id = '';
        this.poolId = '';
        this.type = '';
        this.channel = '';
        this.timestamp = 0;
        this.data = {};
        this.source = undefined;
        this.status = EventDeliveryStatus.PENDING;
        this.attempts = 0;
        this.lastAttempt = undefined;
        this.isInUse = false;
    }
}
export class EventPool {
    constructor(config) {
        this.pool = [];
        this.config = config;
        this.initialize();
    }
    initialize() {
        for (let i = 0; i < this.config.initialSize; i++) {
            this.pool.push(new ManagedEvent());
        }
    }
    acquire() {
        // Try to find an available event
        const event = this.pool.find(e => !e.isInUse);
        if (event) {
            event.isInUse = true;
            return event;
        }
        // If no events available, try to expand pool
        if (this.pool.length < this.config.maxSize) {
            const expandSize = Math.min(this.config.expandSteps, this.config.maxSize - this.pool.length);
            for (let i = 0; i < expandSize; i++) {
                const newEvent = new ManagedEvent();
                this.pool.push(newEvent);
                if (i === 0) {
                    newEvent.isInUse = true;
                    return newEvent;
                }
            }
        }
        return null;
    }
    release(event) {
        const pooledEvent = this.pool.find(e => e === event);
        if (pooledEvent) {
            pooledEvent.reset();
        }
    }
    createEvent(data) {
        const event = this.acquire();
        if (!event)
            return null;
        event.id = data.id;
        event.poolId = data.poolId;
        event.type = data.type;
        event.channel = data.channel;
        event.timestamp = data.timestamp;
        event.data = data.data;
        event.source = data.source;
        return event;
    }
    acquireFromEvent(baseEvent) {
        return this.createEvent(baseEvent);
    }
    clear() {
        this.pool.forEach(event => event.reset());
    }
    destroy() {
        this.pool = [];
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getStats() {
        const inUseCount = this.pool.filter(e => e.isInUse).length;
        return {
            size: this.pool.length,
            available: this.pool.length - inUseCount,
            inUse: inUseCount,
            total: this.config.maxSize
        };
    }
}
//# sourceMappingURL=pool.js.map