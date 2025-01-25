import { BaseEvent, EventHandler } from './types';

interface RouterConfig {
  maxSubscribers?: number;
  maxChannels?: number;
}

export class EventRouter {
  private config: Required<RouterConfig>;
  private isRunning: boolean = false;
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();

  constructor(config: RouterConfig = {}) {
    this.config = {
      maxSubscribers: config.maxSubscribers ?? 100,
      maxChannels: config.maxChannels ?? 50
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Router is already running');
    }
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (this.isRunning) {
      this.isRunning = false;
      this.handlers.clear();
    }
  }

  registerChannel(channel: string): void {
    if (!this.isRunning) {
      throw new Error('Router is not running');
    }
    if (this.handlers.has(channel)) {
      throw new Error(`Channel ${channel} already exists`);
    }
    if (this.handlers.size >= this.config.maxChannels) {
      throw new Error('Maximum number of channels reached');
    }
    this.handlers.set(channel, new Set());
  }

  subscribe<T>(channel: string, handler: EventHandler<T>): () => void {
    if (!this.isRunning) {
      throw new Error('Router is not running');
    }

    const handlers = this.handlers.get(channel);
    if (!handlers) {
      throw new Error(`Channel ${channel} not found`);
    }

    if (handlers.size >= this.config.maxSubscribers) {
      throw new Error('Maximum number of subscribers reached for channel');
    }

    handlers.add(handler as EventHandler<any>);

    return () => {
      if (!this.isRunning) {
        return; // Silently ignore unsubscribe if router is stopped
      }
      const currentHandlers = this.handlers.get(channel);
      if (currentHandlers?.has(handler as EventHandler<any>)) {
        currentHandlers.delete(handler as EventHandler<any>);
      }
    };
  }

  async route<T>(channel: string, event: BaseEvent<T>): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Router is not running');
    }

    const handlers = this.handlers.get(channel);
    if (!handlers) {
      throw new Error(`Channel ${channel} not found`);
    }

    const errors: Error[] = [];
    await Promise.all(
      Array.from(handlers).map(async handler => {
        try {
          await (handler as EventHandler<T>)(event);
        } catch (error) {
          errors.push(error instanceof Error ? error : new Error(String(error)));
        }
      })
    );

    if (errors.length > 0) {
      throw new Error(`Route errors: ${errors.map(e => e.message).join(', ')}`);
    }
  }

  getRunningState(): boolean {
    return this.isRunning;
  }

  getChannels(): string[] {
    return Array.from(this.handlers.keys());
  }
}
