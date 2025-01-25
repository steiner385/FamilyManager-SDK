export interface Event<T = unknown> {
  id: string;
  type: string;
  channel: string;
  source: string;
  timestamp: number;
  data?: T;
}

export interface BaseEvent<T = unknown> extends Event<T> {
  version?: string;
  priority?: number;
}

export interface PoolEvent<T = unknown> extends BaseEvent<T> {
  poolId: string;
  attempts: number;
  maxAttempts: number;
  nextAttempt?: number;
}

export interface PooledEvent<T = unknown> extends PoolEvent<T> {
  status: EventDeliveryStatus;
  error?: string;
}

export enum EventDeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  PARTIAL = 'PARTIAL'
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PoolConfig {
  maxAttempts: number;
  retryDelay: number;
  maxConcurrent: number;
  initialSize?: number;
  maxSize?: number;
  expandSteps?: number;
}

export type EventHandler<T = unknown> = (event: BaseEvent<T>) => Promise<void>;
