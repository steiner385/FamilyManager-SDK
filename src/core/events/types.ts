export enum EventStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum EventDeliveryStatus {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Delivered = 'DELIVERED'
}

export interface BaseEvent<T = unknown> {
  type: string;
  source: string;
  timestamp: number;
  payload: T;
  metadata?: Record<string, unknown>;
}

export interface PoolEvent<T = unknown> {
  id: string;
  channel: string;
  type: string;
  timestamp: number;
  data: T;
}

export interface PooledEvent<T = unknown> extends PoolEvent<T> {
  _inUse: boolean;
  isInUse(): boolean;
  markInUse(): void;
  reset(): void;
}

export type EventHandler<T = unknown> = (event: BaseEvent<T>) => Promise<void>;

export interface EventEmitter {
  publish<T>(channel: string, event: BaseEvent<T>): Promise<{ status: EventDeliveryStatus; errors?: string[] }>;
  subscribe<T>(channel: string, handler: EventHandler<T>): () => void;
  unsubscribe<T>(channel: string, handler: EventHandler<T>): void;
  registerChannel(channel: string): void;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface EventBusConfig {
  validateEvents?: boolean;
  maxRetries?: number;
  batchSize?: number;
  flushInterval?: number;
}

export interface PoolConfig {
  maxSize: number;
  initialSize: number;
  expandSteps: number;
}
