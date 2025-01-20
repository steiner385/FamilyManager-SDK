import { Logger } from '../logging/Logger';
import { PoolConfig, PoolEvent, PooledEvent, EventDeliveryStatus } from './types';

class ManagedEvent<T = unknown> implements PooledEvent<T> {
  private _inUse: boolean = false;
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
    this._inUse = true;
  }

  isInUse(): boolean {
    return this._inUse;
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
      this.pool.push(this.createEmptyEvent());
    }
  }

  private createEmptyEvent<T>(): ManagedEvent<T> {
    return new ManagedEvent({
      id: '',
      type: '',
      channel: '',
      source: '',
      timestamp: 0,
      poolId: '',
      attempts: 0,
      maxAttempts: this.config.maxAttempts
    });
  }

  private expandPool(): void {
    const currentSize = this.pool.length;
    const targetSize = Math.min(
      currentSize + this.config.expandSteps,
      this.config.maxSize
    );

    if (currentSize >= targetSize) {
      this.logger.warn('Cannot expand pool: maximum size reached');
      return;
    }

    const expansionSize = targetSize - currentSize;
    for (let i = 0; i < expansionSize; i++) {
      this.pool.push(this.createEmptyEvent());
    }

    this.logger.info(
      `Pool expanded by ${expansionSize} events (${currentSize} -> ${this.pool.length})`
    );
  }

  clear(): void {
    this.pool = [];
    this.initialize();
    this.logger.info('Pool cleared and reinitialized');
  }

  private findAvailableEvent<T>(event: PoolEvent<T>): ManagedEvent<T> | null {
    // First try to find an unused event slot
    const emptyEvent = this.pool.find(e => !e.isInUse());
    if (emptyEvent) {
      return emptyEvent as ManagedEvent<T>;
    }

    // If pool is full but we can expand, do so
    if (this.pool.length < this.config.maxSize) {
      this.expandPool();
      return this.pool.find(e => !e.isInUse()) as ManagedEvent<T>;
    }

    return null;
  }

  createEvent<T>(data: PoolEvent<T>): PooledEvent<T> | null {
    let event = this.findAvailableEvent(data);

    if (!event) {
      this.expandPool();
      event = this.findAvailableEvent(data);
    }

    if (event) {
      Object.assign(event, data);
      event.status = EventDeliveryStatus.PENDING;
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
      Object.assign(pooledEvent, this.createEmptyEvent());
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
    return this.createEvent({
      id: '',
      type: '',
      channel: '',
      source: '',
      timestamp: Date.now(),
      poolId: '',
      attempts: 0,
      maxAttempts: this.config.maxAttempts
    });
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
