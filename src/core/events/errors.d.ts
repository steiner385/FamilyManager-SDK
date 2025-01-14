/**
 * Custom error classes for the event system
 */
/**
 * Base error class for all event system errors
 */
export declare class EventError extends Error {
    constructor(message: string);
}
/**
 * Thrown when event validation fails
 */
export declare class EventValidationError extends EventError {
    errors: string[];
    constructor(message: string, errors: string[]);
}
/**
 * Thrown when event delivery fails
 */
export declare class EventDeliveryError extends EventError {
    eventType: string;
    channel?: string | undefined;
    constructor(message: string, eventType: string, channel?: string | undefined);
}
/**
 * Thrown when event handler registration fails
 */
export declare class EventHandlerError extends EventError {
    handlerId: string;
    constructor(message: string, handlerId: string);
}
/**
 * Thrown when event subscription fails
 */
export declare class EventSubscriptionError extends EventError {
    subscriptionId: string;
    constructor(message: string, subscriptionId: string);
}
/**
 * Thrown when event timeout occurs
 */
export declare class EventTimeoutError extends EventError {
    eventType: string;
    timeout: number;
    constructor(message: string, eventType: string, timeout: number);
}
/**
 * Thrown when event bus configuration is invalid
 */
export declare class EventBusConfigError extends EventError {
    constructor(message: string);
}
/**
 * Thrown when event channel operations fail
 */
export declare class EventChannelError extends EventError {
    channel: string;
    constructor(message: string, channel: string);
}
//# sourceMappingURL=errors.d.ts.map