export interface BaseEvent {
  type: string;
  timestamp: number;
  data: any;
}

export enum EventDeliveryStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
  PARTIAL = 'partial'
}

export type EventHandler = (event: BaseEvent) => Promise<void> | void;

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
}

export interface EventEmitterConfig {
  maxRetries?: number;
  retryDelay?: number;
}
