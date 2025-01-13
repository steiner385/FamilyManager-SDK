import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logging/Logger';
import { 
  BaseEvent, 
  EventDeliveryStatus, 
  EventHandler, 
  EventSubscription, 
  EventEmitterConfig,
  EventBusConfig 
} from './types';

export class EventBus {
  private static instance: EventBus;
  private subscriptions: Map<string, EventSubscription[]>;
  private channels: Set<string>;
  private emitterConfig: EventEmitterConfig;
  private busConfig: EventBusConfig;
  private isRunning: boolean;

  private constructor(config: EventBusConfig = {}) {
    this.subscriptions = new Map();
    this.channels = new Set();
    this.isRunning = false;
    this.busConfig = config;
    this.emitterConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };
  }

  public static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  public static resetInstance(): void {
    EventBus.instance = new EventBus();
  }

  public getRunningState(): boolean {
    return this.isRunning;
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    logger.info('EventBus started');
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    this.clearSubscriptions();
    logger.info('EventBus stopped');
  }

  public registerChannel(channel: string): void {
    if (this.channels.has(channel)) {
      throw new Error(`Channel ${channel} is already registered`);
    }
    this.channels.add(channel);
    logger.debug(`Registered channel: ${channel}`);
  }

  public subscribe<T>(eventType: string, handler: EventHandler<T>): string {
    if (!this.isRunning) {
      throw new Error('Cannot subscribe while EventBus is stopped');
    }

    if (!this.channels.has(eventType)) {
      throw new Error(`Channel ${eventType} is not registered`);
    }
    const subscription: EventSubscription = {
      id: uuidv4(),
      eventType,
      handler,
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    this.subscriptions.get(eventType)!.push(subscription);
    logger.debug(`Subscribed to event ${eventType}`, { subscriptionId: subscription.id });

    return subscription.id;
  }

  public unsubscribe(subscriptionId: string): void {
    for (const [eventType, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex(sub => sub.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        logger.debug(`Unsubscribed from event ${eventType}`, { subscriptionId });
        if (subs.length === 0) {
          this.subscriptions.delete(eventType);
        }
        return;
      }
    }
  }

  public async emit<T>(event: BaseEvent<T>): Promise<EventDeliveryStatus> {
    if (!this.isRunning) {
      throw new Error('Cannot emit events while EventBus is stopped');
    }

    if (!this.channels.has(event.type)) {
      throw new Error(`Channel ${event.type} is not registered`);
    }

    const subscribers = this.subscriptions.get(event.type) || [];
    if (subscribers.length === 0) {
      logger.debug(`No subscribers for event ${event.type}`);
      return EventDeliveryStatus.SUCCESS;
    }

    let failedCount = 0;
    let successCount = 0;
    const results = await Promise.allSettled(
      subscribers.map(sub => this.deliverWithRetry(sub, event))
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedCount++;
        logger.error(`Failed to deliver event to subscriber ${subscribers[index].id}`, {
          error: result.reason,
          eventType: event.type
        });
      } else {
        successCount++;
      }
    });

    if (failedCount > 0) {
      return EventDeliveryStatus.PARTIAL;
    }
    return EventDeliveryStatus.SUCCESS;
  }

  private async deliverWithRetry<T>(
    subscription: EventSubscription,
    event: BaseEvent<T>,
    attempt: number = 1
  ): Promise<void> {
    try {
      await subscription.handler(event);
    } catch (error) {
      if (attempt >= this.emitterConfig.maxRetries!) {
        logger.error(`Max retries reached for event ${event.type}`, {
          subscriptionId: subscription.id,
          error,
        });
        throw error;
      }

      logger.warn(`Retrying event delivery for ${event.type}`, {
        attempt,
        subscriptionId: subscription.id,
      });

      await new Promise(resolve => setTimeout(resolve, this.emitterConfig.retryDelay!));
      return this.deliverWithRetry(subscription, event, attempt + 1);
    }
  }

  public getSubscriptionCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length || 0;
  }

  public clearSubscriptions(): void {
    this.subscriptions.clear();
  }

  public getChannels(): string[] {
    return Array.from(this.channels);
  }
}

// Export a default instance
export const eventBus = EventBus.getInstance();
