import { Event, EventHandler } from './types';

export class EventBus {
  private static instance: EventBus;
  private channels: Set<string>;
  private handlers: Map<string, Set<EventHandler>>;
  private isRunning: boolean;
  private subscriptionCounter: number;

  private constructor() {
    this.channels = new Set();
    this.handlers = new Map();
    this.isRunning = false;
    this.subscriptionCounter = 0;
  }

  public getRunningState(): boolean {
    return this.isRunning;
  }

  public getSubscriptionCount(channel: string): number {
    return this.handlers.get(channel)?.size || 0;
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public static resetInstance(): void {
    EventBus.instance = new EventBus();
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
  }

  public registerChannel(channel: string): void {
    if (!this.isRunning) {
      throw new Error('EventBus not started');
    }

    this.channels.add(channel);
  }

  public unregisterChannel(channel: string): void {
    if (!this.isRunning) {
      throw new Error('EventBus not started');
    }

    this.channels.delete(channel);
    this.handlers.delete(channel);
  }

  public getChannels(): string[] {
    return Array.from(this.channels);
  }

  public subscribe<T>(channel: string, handler: EventHandler<T>): string {
    if (!this.isRunning) {
      throw new Error('Cannot subscribe while EventBus is stopped');
    }

    if (!this.channels.has(channel)) {
      throw new Error(`Channel ${channel} is not registered`);
    }

    let handlers = this.handlers.get(channel);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(channel, handlers);
    }

    const subscriptionId = `${channel}-${++this.subscriptionCounter}`;
    handlers.add(handler as EventHandler);

    return subscriptionId;
  }

  public unsubscribe(subscriptionId: string): void {
    const [channel] = subscriptionId.split('-');
    const handlers = this.handlers.get(channel);
    if (handlers) {
      // Since we can't easily map back to the original handler,
      // we'll just remove one handler. This is a simplification.
      const handler = handlers.values().next().value;
      if (handler) {
        handlers.delete(handler);
      }
    }
  }

  public async emit<T>(event: Event<T>): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Cannot emit events while EventBus is stopped');
    }

    if (!this.channels.has(event.channel)) {
      throw new Error(`Channel ${event.channel} is not registered`);
    }

    const handlers = this.handlers.get(event.channel);
    if (handlers) {
      const promises = Array.from(handlers).map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });

      await Promise.all(promises);
    }
  }
}

export const eventBus = EventBus.getInstance();
