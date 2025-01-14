/**
 * Event system constants
 */
/**
 * Default configuration values
 */
export declare const DEFAULT_EVENT_CONFIG: {
    /** Default timeout for event delivery in milliseconds */
    readonly DEFAULT_TIMEOUT: 5000;
    /** Default maximum number of retries for failed event delivery */
    readonly DEFAULT_MAX_RETRIES: 3;
    /** Default event priority */
    readonly DEFAULT_PRIORITY: 1;
    /** Maximum number of concurrent event handlers */
    readonly MAX_CONCURRENT_HANDLERS: 100;
    /** Maximum event payload size in bytes */
    readonly MAX_PAYLOAD_SIZE: number;
};
/**
 * System event types
 */
export declare const SYSTEM_EVENTS: {
    /** Emitted when the event bus starts */
    readonly BUS_START: "system.bus.start";
    /** Emitted when the event bus stops */
    readonly BUS_STOP: "system.bus.stop";
    /** Emitted when a new handler is registered */
    readonly HANDLER_REGISTERED: "system.handler.registered";
    /** Emitted when a handler is removed */
    readonly HANDLER_REMOVED: "system.handler.removed";
    /** Emitted when an error occurs */
    readonly ERROR: "system.error";
    /** Emitted for performance monitoring */
    readonly PERFORMANCE: "system.performance";
};
/**
 * Reserved channel names
 */
export declare const RESERVED_CHANNELS: {
    /** Channel for system events */
    readonly SYSTEM: "system";
    /** Channel for monitoring events */
    readonly MONITORING: "monitoring";
    /** Channel for high-priority events */
    readonly PRIORITY: "priority";
    /** Channel for error events */
    readonly ERROR: "error";
};
/**
 * Event validation constants
 */
export declare const VALIDATION: {
    /** Maximum length for event type strings */
    readonly MAX_TYPE_LENGTH: 100;
    /** Maximum length for channel names */
    readonly MAX_CHANNEL_LENGTH: 50;
    /** Maximum depth for nested event data */
    readonly MAX_NESTING_DEPTH: 5;
    /** Pattern for valid event type names */
    readonly TYPE_PATTERN: RegExp;
    /** Pattern for valid channel names */
    readonly CHANNEL_PATTERN: RegExp;
};
/**
 * Performance monitoring thresholds
 */
export declare const PERFORMANCE: {
    /** Warning threshold for event processing time in milliseconds */
    readonly PROCESSING_TIME_WARNING: 1000;
    /** Critical threshold for event processing time in milliseconds */
    readonly PROCESSING_TIME_CRITICAL: 5000;
    /** Warning threshold for event queue size */
    readonly QUEUE_SIZE_WARNING: 1000;
    /** Critical threshold for event queue size */
    readonly QUEUE_SIZE_CRITICAL: 5000;
    /** Interval for performance metric collection in milliseconds */
    readonly METRICS_INTERVAL: 60000;
};
/**
 * Retry configuration
 */
export declare const RETRY: {
    /** Base delay for exponential backoff in milliseconds */
    readonly BASE_DELAY: 100;
    /** Maximum delay between retries in milliseconds */
    readonly MAX_DELAY: 5000;
    /** Jitter factor for retry delays (0-1) */
    readonly JITTER_FACTOR: 0.1;
};
//# sourceMappingURL=constants.d.ts.map