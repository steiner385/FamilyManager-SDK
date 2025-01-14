import { Event } from './types';
interface EventStats {
    totalEvents: number;
    eventsPerSecond: number;
    lastEventTimestamp: number;
}
interface EventHistory {
    event: Event;
    timestamp: number;
}
export declare class EventBus {
    private subscribers;
    private stats;
    private history;
    private startTime;
    private statsInterval?;
    constructor();
    /**
     * Subscribe to an event type
     */
    subscribe(eventType: string, handler: (event: Event) => Promise<void>): Promise<void>;
    /**
     * Publish an event
     */
    publish(type: string, data: any): Promise<void>;
    /**
     * Get event bus stats
     */
    getStats(): EventStats;
    /**
     * Clear event history
     */
    clearHistory(): void;
    /**
     * Get event history
     */
    getHistory(): EventHistory[];
    /**
     * Start tracking event stats
     */
    private startStatsTracking;
    /**
     * Stop event bus
     */
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map