/**
 * Custom error classes for the event system
 */

/**
 * Base error class for all event system errors
 */
export class EventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventError';
    Object.setPrototypeOf(this, EventError.prototype);
  }
}

/**
 * Thrown when event validation fails
 */
export class EventValidationError extends EventError {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'EventValidationError';
    Object.setPrototypeOf(this, EventValidationError.prototype);
  }
}

/**
 * Thrown when event delivery fails
 */
export class EventDeliveryError extends EventError {
  constructor(
    message: string,
    public eventType: string,
    public channel?: string
  ) {
    super(message);
    this.name = 'EventDeliveryError';
    Object.setPrototypeOf(this, EventDeliveryError.prototype);
  }
}

/**
 * Thrown when event handler registration fails
 */
export class EventHandlerError extends EventError {
  constructor(message: string, public handlerId: string) {
    super(message);
    this.name = 'EventHandlerError';
    Object.setPrototypeOf(this, EventHandlerError.prototype);
  }
}

/**
 * Thrown when event subscription fails
 */
export class EventSubscriptionError extends EventError {
  constructor(message: string, public subscriptionId: string) {
    super(message);
    this.name = 'EventSubscriptionError';
    Object.setPrototypeOf(this, EventSubscriptionError.prototype);
  }
}

/**
 * Thrown when event timeout occurs
 */
export class EventTimeoutError extends EventError {
  constructor(
    message: string,
    public eventType: string,
    public timeout: number
  ) {
    super(message);
    this.name = 'EventTimeoutError';
    Object.setPrototypeOf(this, EventTimeoutError.prototype);
  }
}

/**
 * Thrown when event bus configuration is invalid
 */
export class EventBusConfigError extends EventError {
  constructor(message: string) {
    super(message);
    this.name = 'EventBusConfigError';
    Object.setPrototypeOf(this, EventBusConfigError.prototype);
  }
}

/**
 * Thrown when event channel operations fail
 */
export class EventChannelError extends EventError {
  constructor(message: string, public channel: string) {
    super(message);
    this.name = 'EventChannelError';
    Object.setPrototypeOf(this, EventChannelError.prototype);
  }
}
