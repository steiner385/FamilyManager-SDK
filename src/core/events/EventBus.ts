// Import necessary modules
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

// EventBus class definition
export class EventBus {
  private static instance: EventBus;
  private subscriptions: Map<string, Map<string, EventSubscription>>;
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
    this.subscriptions.set(channel, new Map());
    logger.debug(`Registered channel: ${channel}`);
  }

  public subscribe<T>(channel: string, handler: EventHandler<T>): string {
    if (!this.isRunning) {
      throw new Error('Cannot subscribe while EventBus is stopped');
    }

    if (!this.channels.has(channel)) {
      throw new Error(`Channel ${channel} is not registered`);
    }

    const id = uuidv4();
    const subscription: EventSubscription = {
      id,
      eventType: channel,
      handler,
      unsubscribe: () => this.unsubscribe(id)
    };

    const channelSubs = this.subscriptions.get(channel)!;
    channelSubs.set(id, subscription);
    logger.debug(`Subscribed to channel ${channel}`, { subscriptionId: id });

    return id;
  }

  public unsubscribe(subscriptionId: string): void {
    for (const [channel, subs] of this.subscriptions.entries()) {
      if (subs.delete(subscriptionId)) {
        logger.debug(`Unsubscribed from channel ${channel}`, { subscriptionId });
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

    const channelSubs = this.subscriptions.get(event.type);
    if (!channelSubs || channelSubs.size === 0) {
      logger.debug(`No subscribers for event ${event.type}`);
      return EventDeliveryStatus.SUCCESS;
    }

    let failedCount = 0;
    let successCount = 0;
    const results = await Promise.allSettled(
      Array.from(channelSubs.values()).map(sub => this.deliverWithRetry(sub, event))
    );

    results.forEach(result => {
      if (result.status === 'rejected') {
        failedCount++;
        logger.error(`Failed to deliver event to subscriber`, {
          error: result.reason,
          type: event.type
        });
      } else {
        successCount++;
      }
    });

    if (failedCount > 0 && successCount > 0) {
      return EventDeliveryStatus.PARTIAL;
    } else if (failedCount > 0) {
      return EventDeliveryStatus.FAILED;
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
        logger.error(`Max retries reached for event delivery`, {
          subscriptionId: subscription.id,
          error,
        });
        throw error;
      }

      logger.warn(`Retrying event delivery`, {
        attempt,
        subscriptionId: subscription.id,
      });

      await new Promise(resolve => setTimeout(resolve, this.emitterConfig.retryDelay!));
      return this.deliverWithRetry(subscription, event, attempt + 1);
    }
  }

  public getSubscriptionCount(channel: string): number {
    return this.subscriptions.get(channel)?.size || 0;
  }

  public clearSubscriptions(): void {
    for (const channelSubs of this.subscriptions.values()) {
      channelSubs.clear();
    }
  }

  public getChannels(): string[] {
    return Array.from(this.channels);
  }
}

// Export a default instance
export const eventBus = EventBus.getInstance();
