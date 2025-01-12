/**
 * Event system constants
 */

/**
 * Default configuration values
 */
export const DEFAULT_EVENT_CONFIG = {
  /** Default timeout for event delivery in milliseconds */
  DEFAULT_TIMEOUT: 5000,
  
  /** Default maximum number of retries for failed event delivery */
  DEFAULT_MAX_RETRIES: 3,
  
  /** Default event priority */
  DEFAULT_PRIORITY: 1,
  
  /** Maximum number of concurrent event handlers */
  MAX_CONCURRENT_HANDLERS: 100,
  
  /** Maximum event payload size in bytes */
  MAX_PAYLOAD_SIZE: 1024 * 1024, // 1MB
} as const;

/**
 * System event types
 */
export const SYSTEM_EVENTS = {
  /** Emitted when the event bus starts */
  BUS_START: 'system.bus.start',
  
  /** Emitted when the event bus stops */
  BUS_STOP: 'system.bus.stop',
  
  /** Emitted when a new handler is registered */
  HANDLER_REGISTERED: 'system.handler.registered',
  
  /** Emitted when a handler is removed */
  HANDLER_REMOVED: 'system.handler.removed',
  
  /** Emitted when an error occurs */
  ERROR: 'system.error',
  
  /** Emitted for performance monitoring */
  PERFORMANCE: 'system.performance',
} as const;

/**
 * Reserved channel names
 */
export const RESERVED_CHANNELS = {
  /** Channel for system events */
  SYSTEM: 'system',
  
  /** Channel for monitoring events */
  MONITORING: 'monitoring',
  
  /** Channel for high-priority events */
  PRIORITY: 'priority',
  
  /** Channel for error events */
  ERROR: 'error',
} as const;

/**
 * Event validation constants
 */
export const VALIDATION = {
  /** Maximum length for event type strings */
  MAX_TYPE_LENGTH: 100,
  
  /** Maximum length for channel names */
  MAX_CHANNEL_LENGTH: 50,
  
  /** Maximum depth for nested event data */
  MAX_NESTING_DEPTH: 5,
  
  /** Pattern for valid event type names */
  TYPE_PATTERN: /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/,
  
  /** Pattern for valid channel names */
  CHANNEL_PATTERN: /^[a-z][a-z0-9-]*$/,
} as const;

/**
 * Performance monitoring thresholds
 */
export const PERFORMANCE = {
  /** Warning threshold for event processing time in milliseconds */
  PROCESSING_TIME_WARNING: 1000,
  
  /** Critical threshold for event processing time in milliseconds */
  PROCESSING_TIME_CRITICAL: 5000,
  
  /** Warning threshold for event queue size */
  QUEUE_SIZE_WARNING: 1000,
  
  /** Critical threshold for event queue size */
  QUEUE_SIZE_CRITICAL: 5000,
  
  /** Interval for performance metric collection in milliseconds */
  METRICS_INTERVAL: 60000,
} as const;

/**
 * Retry configuration
 */
export const RETRY = {
  /** Base delay for exponential backoff in milliseconds */
  BASE_DELAY: 100,
  
  /** Maximum delay between retries in milliseconds */
  MAX_DELAY: 5000,
  
  /** Jitter factor for retry delays (0-1) */
  JITTER_FACTOR: 0.1,
} as const;
