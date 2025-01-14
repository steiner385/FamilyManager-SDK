export enum EventDeliveryStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  PARTIAL = 'PARTIAL'
}

export interface BaseEvent<T = any> {
  id: string;
  type: string;
  channel: string;
  timestamp: number;
  data: T;
  source?: string;
}

export interface EventBusConfig {
  maxConcurrent?: number;
  maxQueueSize?: number;
  defaultTimeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface EventSubscription {
  id: string;
  handler: EventHandler;
  unsubscribe: () => void;
  eventType?: string;
}

export interface EventEmitterConfig {
  maxListeners?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface EventBus {
  start(): Promise<void>;
  stop(): Promise<void>;
  publish<T = any>(event: BaseEvent<T>): Promise<EventDeliveryStatus>;
  subscribe<T = any>(channel: string, handler: EventHandler<T>): () => void;
  emit<T = any>(event: BaseEvent<T>): Promise<EventDeliveryStatus>;
}

export type EventHandler<T = any> = (event: BaseEvent<T>) => Promise<void>;

export interface PoolConfig {
  maxSize: number;
  initialSize: number;
  expandSteps: number;
}

export interface PoolEvent<T = any> extends BaseEvent<T> {
  poolId: string;
  isInUse: boolean;
}

export interface PooledEvent<T = any> extends PoolEvent<T> {
  isInUse: boolean;
  reset(): void;
}

export interface TestEvent extends BaseEvent<any> {
  type: 'test';
  data: {
    value: string;
  };
}

export interface ValidationError {
  path: string[];
  code: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ManagedEvent<T = any> extends PooledEvent<T> {
  isInUse: boolean;
  reset(): void;
}
