import { Logger } from '../logging/Logger';
import { PoolConfig, PoolEvent, PooledEvent, EventDeliveryStatus } from './types';

class ManagedEvent<T = unknown> implements PooledEvent<T> {
  private _inUse: boolean = true; // Initialize as true since events are always created in-use
  id: string;
  type: string;
  channel: string;
  source: string;
  timestamp: number;
  data?: T;
  version?: string;
  priority?: number;
  poolId: string;
  attempts: number;
  maxAttempts: number;
  nextAttempt?: number;
  status: EventDeliveryStatus;
  error?: string;

  constructor(event: PoolEvent<T>) {
    this.id = event.id;
    this.type = event.type;
    this.channel = event.channel;
    this.source = event.source;
    this.timestamp = event.timestamp;
    this.data = event.data;
    this.version = event.version;
    this.priority = event.priority;
    this.poolId = event.poolId;
    this.attempts = event.attempts;
    this.maxAttempts = event.maxAttempts;
    this.nextAttempt = event.nextAttempt;
    this.status = EventDeliveryStatus.PENDING;
    this._inUse = true; // Always mark as in use when constructing from an event
  }

  isInUse(): boolean {
    return this._inUse;
  }

  setInUse(value: boolean): void {
    this._inUse = value;
  }
}

export class EventPool {
  private pool: ManagedEvent[];
  private config: Required<PoolConfig>;
  private logger: Logger;

  constructor(config: PoolConfig) {
    this.logger = Logger.getInstance();
    this.pool = [];
    this.config = {
      maxAttempts: config.maxAttempts,
      retryDelay: config.retryDelay,
      maxConcurrent: config.maxConcurrent,
      initialSize: config.initialSize ?? 100,
      maxSize: config.maxSize ?? 1000,
      expandSteps: config.expandSteps ?? 100
    };

    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      const event = this.createEmptyEvent();
      event.setInUse(false); // Explicitly mark as not in use
      this.pool.push(event);
    }
  }

  private createEmptyEvent<T>(): ManagedEvent<T> {
    const event = new ManagedEvent<T>({
      id: '',
      type: '',
      channel: '',
      source: '',
      timestamp: 0,
      poolId: '',
      attempts: 0,
      maxAttempts: this.config.maxAttempts
    } as PoolEvent<T>);
    return event;
  }

  private expandPool(): void {
    const currentSize = this.pool.length;
    if (currentSize >= this.config.maxSize) {
      this.logger.warn('Cannot expand pool: maximum size reached');
      return;
    }

    // Only expand by the minimum needed amount
    const neededSize = Math.min(
      currentSize + this.config.expandSteps,
      this.config.maxSize
    );
    const expansionSize = neededSize - currentSize;

    for (let i = 0; i < expansionSize; i++) {
      const event = this.createEmptyEvent();
      event.setInUse(false);
      this.pool.push(event);
    }

    this.logger.info(
      `Pool expanded by ${expansionSize} events (${currentSize} -> ${this.pool.length})`
    );
  }

  clear(): void {
    // Reset all existing events instead of recreating
    this.pool.forEach(event => {
      Object.assign(event, {
        id: '',
        type: '',
        channel: '',
        source: '',
        timestamp: 0,
        data: undefined,
        version: undefined,
        priority: undefined,
        poolId: '',
        attempts: 0,
        maxAttempts: this.config.maxAttempts,
        nextAttempt: undefined,
        status: EventDeliveryStatus.PENDING,
        error: undefined
      });
      event.setInUse(false);
    });
    this.logger.info('Pool cleared and reset');
  }

  private findAvailableEvent<T>(event: PoolEvent<T>): ManagedEvent<T> | null {
    // First try to find an unused event slot
    let emptyEvent = this.pool.find(e => !e.isInUse());
    
    // If no empty event and we can expand, do so
    if (!emptyEvent && this.pool.length < this.config.maxSize) {
      this.expandPool();
      emptyEvent = this.pool.find(e => !e.isInUse());
    }

    return emptyEvent as ManagedEvent<T> || null;
  }

  createEvent<T>(data: PoolEvent<T>): PooledEvent<T> | null {
    let event = this.findAvailableEvent(data);

    if (!event) {
      this.expandPool();
      event = this.findAvailableEvent(data);
    }

    if (event) {
      Object.assign(event, data);
      event.status = EventDeliveryStatus.PROCESSING;
      event.status = EventDeliveryStatus.PROCESSING;
      event.setInUse(true);
      return event;
    }

    this.logger.error('Failed to create event: pool is full');
    return null;
  }

  acquireFromEvent<T>(baseEvent: PoolEvent<T>): PooledEvent<T> | null {
    return this.createEvent(baseEvent);
  }

  release(event: PooledEvent): void {
    const pooledEvent = this.pool.find(e => e.id === event.id);
    if (pooledEvent) {
      // Reset all properties to empty values
      Object.assign(pooledEvent, {
        id: '',
        type: '',
        channel: '',
        source: '',
        timestamp: 0,
        data: undefined,
        version: undefined,
        priority: undefined,
        poolId: '',
        attempts: 0,
        maxAttempts: this.config.maxAttempts,
        nextAttempt: undefined,
        status: EventDeliveryStatus.PENDING,
        error: undefined
      });
      (pooledEvent as ManagedEvent).setInUse(false);
    }
  }

  getStats(): { size: number; available: number; inUse: number; total: number } {
    const available = this.pool.filter(e => !e.isInUse()).length;
    const inUse = this.pool.length - available;
    return {
      size: this.pool.length,
      available,
      inUse,
      total: this.config.maxSize
    };
  }

  acquire(): ManagedEvent | null {
    const event = this.findAvailableEvent({
      id: '',
      type: '',
      channel: '',
      source: '',
      timestamp: Date.now(),
      poolId: '',
      attempts: 0,
      maxAttempts: this.config.maxAttempts
    });
    
    if (event) {
      event.setInUse(true);
      return event;
    }
    
    return null;
  }

  destroy(): void {
    this.pool = [];
    this.logger.info('Event pool destroyed');
  }

  updateConfig(config: Partial<PoolConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    this.logger.info('Pool configuration updated', { config: this.config });
  }
}
