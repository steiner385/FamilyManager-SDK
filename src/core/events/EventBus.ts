import { Event, EventHandler } from './types';

export class EventBus {
  private static instance: EventBus;
  private channels: Set<string>;
  private handlers: Map<string, Set<EventHandler>>;
  private isRunning: boolean;

  private constructor() {
    this.channels = new Set();
    this.handlers = new Map();
    this.isRunning = false;
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
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

  public subscribe<T>(channel: string, handler: EventHandler<T>): () => void {
    if (!this.isRunning) {
      throw new Error('EventBus not started');
    }

    if (!this.channels.has(channel)) {
      throw new Error(`Channel not registered: ${channel}`);
    }

    let handlers = this.handlers.get(channel);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(channel, handlers);
    }

    handlers.add(handler as EventHandler);

    return () => {
      const currentHandlers = this.handlers.get(channel);
      if (currentHandlers?.has(handler as EventHandler)) {
        currentHandlers.delete(handler as EventHandler);
      }
    };
  }

  public async emit<T>(event: Event<T>): Promise<void> {
    if (!this.isRunning) {
      throw new Error('EventBus not started');
    }

    if (!this.channels.has(event.channel)) {
      throw new Error(`Channel not registered: ${event.channel}`);
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
