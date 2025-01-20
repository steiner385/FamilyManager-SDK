import { Logger } from '../logging/Logger';
import { logger } from '../logging/Logger';
import { Event, EventHandler } from './types';

export enum EventDeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING', 
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  PARTIAL = 'PARTIAL'
}

export class EventBus {
  private static instance: EventBus;
  private channels: Set<string>;
  private handlers: Map<string, Set<EventHandler>>;
  private isRunning: boolean;
  private subscriptionCounter: number;

  private logger: Logger;

  private constructor() {
    this.logger = logger;
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
    this.logger.info('EventBus started');
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.handlers.clear();
    this.logger.info('EventBus stopped');
  }

  public registerChannel(channel: string): void {
    if (!this.isRunning) {
      throw new Error('EventBus not started');
    }

    if (this.channels.has(channel)) {
      throw new Error(`Channel ${channel} is already registered`);
    }

    this.channels.add(channel);
    this.logger.debug(`Registered channel: ${channel}`);
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
    this.subscriptionMap.set(subscriptionId, { channel, handler: handler as EventHandler });

    return subscriptionId;
  }

  private subscriptionMap = new Map<string, { channel: string, handler: EventHandler }>();

  public unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptionMap.get(subscriptionId);
    if (subscription) {
      const { channel, handler } = subscription;
      const handlers = this.handlers.get(channel);
      if (handlers) {
        handlers.delete(handler);
        this.subscriptionMap.delete(subscriptionId);
      }
    }
  }

  private async retryHandler(handler: EventHandler, event: Event<any>, retries = 3, delay = 100): Promise<boolean> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await handler(event);
        return true;
      } catch (error) {
        this.logger.warn('Retrying event delivery', { attempt, error });
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  }

  public async emit<T>(event: Event<T>): Promise<EventDeliveryStatus> {
    if (!this.isRunning) {
      throw new Error('Cannot emit events while EventBus is stopped');
    }

    if (!this.channels.has(event.channel)) {
      throw new Error(`Channel ${event.channel} is not registered`);
    }

    const handlers = this.handlers.get(event.channel);
    if (!handlers || handlers.size === 0) {
      this.logger.debug(`No subscribers for event ${event.channel}`);
      return EventDeliveryStatus.SUCCESS;
    }

    const results = await Promise.all(
      Array.from(handlers).map(handler => this.retryHandler(handler, event))
    );

    const successCount = results.filter(success => success).length;

    if (successCount === 0) {
      return EventDeliveryStatus.FAILED;
    } else if (successCount < handlers.size) {
      return EventDeliveryStatus.PARTIAL;
    }

    return EventDeliveryStatus.DELIVERED;
  }
}

export const eventBus = EventBus.getInstance();
