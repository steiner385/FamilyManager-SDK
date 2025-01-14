export interface BaseEvent<T = any> {
  id: string;
  type: string;
  channel: string;
  timestamp: number;
  data: T;
  metadata?: Record<string, any>;
  source?: string;
}

export enum EventDeliveryStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL'
}

export type EventHandler<T = any> = (event: BaseEvent<T>) => Promise<void> | void;

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
}

export interface EventEmitterConfig {
  maxRetries?: number;
  retryDelay?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface PoolConfig {
  maxSize: number;
  retentionPeriod: number;
  initialSize: number;
  expandSteps: number;
}

export interface PoolEvent<T = any> extends BaseEvent<T> {
  poolId: string;
}

export interface PooledEvent<T = any> extends PoolEvent<T> {
  status: EventDeliveryStatus;
  attempts: number;
  lastAttempt?: number;
}

export interface EventBusConfig {
  enableValidation?: boolean;
  enableCompression?: boolean;
  poolConfig?: PoolConfig;
}
