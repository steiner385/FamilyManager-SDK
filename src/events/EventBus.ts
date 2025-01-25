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

export class EventBus {
  private subscribers: Map<string, ((event: Event) => Promise<void>)[]>;
  private stats: EventStats;
  private history: EventHistory[];
  private startTime: number;
  private statsInterval?: NodeJS.Timeout;

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
  public async subscribe(
    eventType: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void> {
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push(handler);
    this.subscribers.set(eventType, handlers);
  }

  /**
   * Publish an event
   */
  public async publish(type: string, data: any): Promise<void> {
    const event: Event = {
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
  public getStats(): EventStats {
    return { ...this.stats };
  }

  /**
   * Clear event history
   */
  public clearHistory(): void {
    this.history = [];
  }

  /**
   * Get event history
   */
  public getHistory(): EventHistory[] {
    return [...this.history];
  }

  /**
   * Start tracking event stats
   */
  private startStatsTracking(): void {
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
  public async stop(): Promise<void> {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = undefined;
    }
    this.subscribers.clear();
    this.history = [];
  }
}
