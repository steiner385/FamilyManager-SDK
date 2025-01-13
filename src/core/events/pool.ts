import { 
  PoolConfig, 
  PoolEvent, 
  PooledEvent, 
  EventDeliveryStatus 
} from './types';

class ManagedEvent<T = unknown> implements PooledEvent<T> {
  id: string = '';
  poolId: string = '';
  type: string = '';
  channel: string = '';
  timestamp: number = 0;
  data: T = {} as T;
  source?: string;
  status: EventDeliveryStatus = EventDeliveryStatus.Pending;
  attempts: number = 0;
  lastAttempt?: number;
  _inUse: boolean = false;

  isInUse(): boolean {
    return this._inUse;
  }

  markInUse(): void {
    this._inUse = true;
  }

  reset(): void {
    this.id = '';
    this.poolId = '';
    this.type = '';
    this.channel = '';
    this.timestamp = 0;
    this.data = {} as T;
    this.source = undefined;
    this.status = EventDeliveryStatus.Pending;
    this.attempts = 0;
    this.lastAttempt = undefined;
    this._inUse = false;
  }
}

export class EventPool {
  private config: PoolConfig;
  private pool: ManagedEvent[] = [];

  constructor(config: PoolConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      this.pool.push(new ManagedEvent());
    }
  }

  acquire(): PooledEvent | null {
    // Try to find an available event
    const event = this.pool.find(e => !e.isInUse());
    
    if (event) {
      event.markInUse();
      return event;
    }

    // If no events available, try to expand pool
    if (this.pool.length < this.config.maxSize) {
      const expandSize = Math.min(
        this.config.expandSteps,
        this.config.maxSize - this.pool.length
      );
      
      for (let i = 0; i < expandSize; i++) {
        const newEvent = new ManagedEvent();
        this.pool.push(newEvent);
        if (i === 0) {
          newEvent.markInUse();
          return newEvent;
        }
      }
    }

    return null;
  }

  release(event: PooledEvent): void {
    const pooledEvent = this.pool.find(e => e === event);
    if (pooledEvent) {
      pooledEvent.reset();
    }
  }

  createEvent<T>(data: PoolEvent<T>): PooledEvent<T> | null {
    const event = this.acquire() as ManagedEvent<T> | null;
    if (!event) return null;

    event.id = data.id;
    event.poolId = data.poolId;
    event.type = data.type;
    event.channel = data.channel;
    event.timestamp = data.timestamp;
    event.data = data.data;
    event.source = data.source;

    return event;
  }

  acquireFromEvent<T>(baseEvent: PoolEvent<T>): PooledEvent<T> | null {
    return this.createEvent(baseEvent);
  }

  clear(): void {
    this.pool.forEach(event => event.reset());
  }

  destroy(): void {
    this.pool = [];
  }

  updateConfig(config: Partial<PoolConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getStats(): { size: number; available: number; inUse: number; total: number } {
    const inUse = this.pool.filter(e => e.isInUse()).length;
    return {
      size: this.pool.length,
      available: this.pool.length - inUse,
      inUse,
      total: this.config.maxSize
    };
  }
}
