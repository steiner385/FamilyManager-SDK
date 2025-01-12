import { BaseEvent, EventDeliveryStatus, EventHandler, EventBusConfig, EventEmitter } from './types';
import { Logger } from '../logging/Logger';

export class EventBus implements EventEmitter {
  private static instance: EventBus | null = null;
  private isRunning: boolean = false;
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();
  private logger: Logger;

  private constructor(_config: EventBusConfig = {}) {
    this.logger = Logger.getInstance();
  }

  static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  static resetInstance(): void {
    if (EventBus.instance) {
      EventBus.instance.stop().catch(() => {
        // Silently handle any stop errors
      });
      
      // Explicitly reset all internal state
      EventBus.instance.handlers = new Map();
      EventBus.instance.isRunning = false;
      
      // Nullify the instance to force recreation
      EventBus.instance = null;
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('EventBus is already running');
      return;
    }

    this.isRunning = true;
    this.logger.debug('Starting event bus...');
    
    // Initialize handlers if empty
    if (this.handlers.size === 0) {
      this.handlers = new Map();
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.handlers.clear();
    
    this.logger.debug('Event bus stopped');
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  registerChannel(channel: string): void {
    if (!this.isRunning) {
      throw new Error('Event bus is not running');
    }

    if (this.handlers.has(channel)) {
      throw new Error(`Channel ${channel} already exists`);
    }

    this.handlers.set(channel, new Set());
    this.logger.debug(`Registered channel: ${channel}`);
  }

  async publish<T>(channel: string, event: BaseEvent<T>): Promise<{ status: EventDeliveryStatus; errors?: string[] }> {
    if (!this.isRunning) {
      throw new Error('Event bus is not running');
    }

    if (!this.handlers.has(channel)) {
      throw new Error(`Channel ${channel} not found`);
    }

    const handlers = this.handlers.get(channel) || new Set();
    const errors: string[] = [];

    try {
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(errorMessage);
          this.logger.error(`Handler error in channel ${channel}`, { error: errorMessage });
        }
      }

      return {
        status: errors.length === 0 ? EventDeliveryStatus.Success : EventDeliveryStatus.Failed,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to publish event in channel ${channel}`, { error: errorMessage });
      
      return {
        status: EventDeliveryStatus.Failed,
        errors: [errorMessage]
      };
    }
  }

  subscribe<T>(
    channelOrHandler: string | EventHandler<T>, 
    handler?: EventHandler<T>
  ): () => void {
    if (!this.isRunning) {
      throw new Error('Event bus is not running');
    }

    let channel: string;
    let eventHandler: EventHandler<T>;

    // Handle different method signatures
    if (typeof channelOrHandler === 'string') {
      channel = channelOrHandler;
      eventHandler = handler!;
    } else {
      channel = 'default';
      eventHandler = channelOrHandler;
    }

    if (!this.handlers.has(channel)) {
      throw new Error(`Channel ${channel} not found`);
    }

    const handlers = this.handlers.get(channel)!;
    handlers.add(eventHandler as EventHandler<any>);
    
    this.logger.debug(`Subscribed handler to channel: ${channel}`);

    return () => {
      const currentHandlers = this.handlers.get(channel);
      if (currentHandlers?.has(eventHandler as EventHandler<any>)) {
        currentHandlers.delete(eventHandler as EventHandler<any>);
        this.logger.debug(`Unsubscribed handler from channel: ${channel}`);
      }
    };
  }

  unsubscribe<T>(
    channelOrHandler: string | EventHandler<T>, 
    handler?: EventHandler<T>
  ): void {
    let channel: string;
    let eventHandler: EventHandler<T>;

    // Handle different method signatures
    if (typeof channelOrHandler === 'string') {
      channel = channelOrHandler;
      eventHandler = handler!;
    } else {
      channel = 'default';
      eventHandler = channelOrHandler;
    }

    const handlers = this.handlers.get(channel);
    if (handlers?.has(eventHandler as EventHandler<any>)) {
      handlers.delete(eventHandler as EventHandler<any>);
      this.logger.debug(`Unsubscribed handler from channel: ${channel}`);
    }
  }

  getRunningState(): boolean {
    return this.isRunning;
  }

  getChannels(): string[] {
    return Array.from(this.handlers.keys());
  }
}

// Lazy-loaded singleton export
let _eventBus: EventBus | null = null;

export function getEventBus(config?: EventBusConfig): EventBus {
  if (!_eventBus) {
    _eventBus = EventBus.getInstance(config);
  }
  return _eventBus;
}

export function resetEventBus(): void {
  if (_eventBus) {
    _eventBus.stop();
    _eventBus = null;
  }
}
