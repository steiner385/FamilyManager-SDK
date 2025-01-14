/**
 * Base event interface that all events must implement
 */
export interface Event {
    /** Unique event identifier */
    id: string;
    /** Event type (e.g., 'user.created', 'family.updated') */
    type: string;
    /** Event data */
    data: any;
    /** Event metadata */
    metadata: EventMetadata;
}
/**
 * Event metadata interface
 */
export interface EventMetadata {
    /** Timestamp when the event was created */
    timestamp: number;
    /** Plugin that created the event */
    source: string;
    /** Event version */
    version: string;
    /** Correlation ID for tracking related events */
    correlationId?: string;
    /** Causation ID for tracking event chains */
    causationId?: string;
    /** User ID associated with the event */
    userId?: string;
    /** Additional context data */
    context?: Record<string, any>;
}
/**
 * Event handler function type
 */
export type EventHandler = (event: Event) => Promise<void>;
/**
 * Event subscription options
 */
export interface SubscriptionOptions {
    /** Event type pattern to match (supports wildcards) */
    pattern: string;
    /** Handler function to call when event matches */
    handler: EventHandler;
    /** Optional filter function */
    filter?: (event: Event) => boolean;
    /** Maximum number of retries for failed handlers */
    maxRetries?: number;
    /** Whether to handle events in order */
    ordered?: boolean;
}
/**
 * Event publication options
 */
export interface PublicationOptions {
    /** Whether to wait for all handlers to complete */
    waitForHandlers?: boolean;
    /** Timeout for handlers in milliseconds */
    timeout?: number;
    /** Additional event metadata */
    metadata?: Partial<EventMetadata>;
}
/**
 * Event bus configuration
 */
export interface EventBusConfig {
    /** Whether to enable debug logging */
    debug?: boolean;
    /** Default publication options */
    defaultPublicationOptions?: PublicationOptions;
    /** Default subscription options */
    defaultSubscriptionOptions?: Partial<SubscriptionOptions>;
    /** Maximum number of concurrent event handlers */
    maxConcurrentHandlers?: number;
    /** Event retention period in milliseconds */
    retentionPeriod?: number;
}
/**
 * Event validation result
 */
export interface EventValidationResult {
    /** Whether the event is valid */
    isValid: boolean;
    /** Validation errors if any */
    errors?: string[];
}
/**
 * Event error types
 */
export declare enum EventErrorType {
    VALIDATION = "validation_error",
    HANDLER = "handler_error",
    TIMEOUT = "timeout_error",
    PUBLICATION = "publication_error",
    SUBSCRIPTION = "subscription_error"
}
/**
 * Event error class
 */
export declare class EventError extends Error {
    type: EventErrorType;
    event?: Event | undefined;
    details?: any | undefined;
    constructor(type: EventErrorType, message: string, event?: Event | undefined, details?: any | undefined);
}
/**
 * Event handler result
 */
export interface EventHandlerResult {
    /** Whether the handler succeeded */
    success: boolean;
    /** Error if handler failed */
    error?: Error;
    /** Time taken to handle event in milliseconds */
    duration: number;
    /** Number of retries if any */
    retries?: number;
}
/**
 * Event bus statistics
 */
export interface EventBusStats {
    /** Total number of events published */
    totalEvents: number;
    /** Total number of active subscriptions */
    activeSubscriptions: number;
    /** Number of events published per second */
    eventsPerSecond: number;
    /** Average event handling time in milliseconds */
    averageHandlingTime: number;
    /** Number of failed events */
    failedEvents: number;
    /** Number of retried events */
    retriedEvents: number;
}
//# sourceMappingURL=types.d.ts.map