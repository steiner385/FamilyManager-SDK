export class EventBus {
    constructor() {
        this.subscribers = new Map();
        this.history = [];
        this.startTime = Date.now();
        this.stats = {
            totalEvents: 0,
            eventsPerSecond: 0,
            lastEventTimestamp: this.startTime
        };
        this.startStatsTracking();
    }
    /**
     * Subscribe to an event type
     */
    async subscribe(eventType, handler) {
        const handlers = this.subscribers.get(eventType) || [];
        handlers.push(handler);
        this.subscribers.set(eventType, handlers);
    }
    /**
     * Publish an event
     */
    async publish(type, data) {
        const event = {
            id: crypto.randomUUID(),
            type,
            data,
            metadata: {
                timestamp: Date.now(),
                source: 'event-bus',
                version: '1.0'
            }
        };
        // Update stats
        this.stats.totalEvents++;
        this.stats.lastEventTimestamp = event.metadata.timestamp;
        // Add to history
        this.history.push({
            event,
            timestamp: Date.now()
        });
        // Notify subscribers
        const handlers = this.subscribers.get(type) || [];
        await Promise.all(handlers.map(handler => handler(event)));
    }
    /**
     * Get event bus stats
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Clear event history
     */
    clearHistory() {
        this.history = [];
    }
    /**
     * Get event history
     */
    getHistory() {
        return [...this.history];
    }
    /**
     * Start tracking event stats
     */
    startStatsTracking() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        this.statsInterval = setInterval(() => {
            const now = Date.now();
            const timeWindow = now - this.startTime;
            this.stats.eventsPerSecond = (this.stats.totalEvents * 1000) / timeWindow;
        }, 1000);
    }
    /**
     * Stop event bus
     */
    async stop() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = undefined;
        }
        this.subscribers.clear();
        this.history = [];
    }
}
//# sourceMappingURL=EventBus.js.map