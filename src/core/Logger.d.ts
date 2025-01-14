/**
 * Log levels supported by the logger
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * Log entry structure
 */
export interface LogEntry {
    /** Timestamp of the log entry */
    timestamp: number;
    /** Log level */
    level: LogLevel;
    /** Log message */
    message: string;
    /** Plugin that generated the log */
    plugin: string;
    /** Additional context data */
    context?: Record<string, any>;
    /** Error details if applicable */
    error?: Error;
}
/**
 * Logger configuration options
 */
export interface LoggerConfig {
    /** Minimum log level to output */
    minLevel?: LogLevel;
    /** Whether to include timestamps */
    timestamps?: boolean;
    /** Whether to include plugin name */
    pluginName?: boolean;
    /** Custom log formatter */
    formatter?: (entry: LogEntry) => string;
}
/**
 * Logger class for plugins
 */
export declare class Logger {
    private pluginName;
    private config;
    constructor(pluginName: string, config?: Partial<LoggerConfig>);
    /**
     * Create a log entry
     */
    private createEntry;
    /**
     * Format a log entry as a string
     */
    private formatEntry;
    /**
     * Log a debug message
     */
    debug(message: string, context?: Record<string, any>): void;
    /**
     * Log an info message
     */
    info(message: string, context?: Record<string, any>): void;
    /**
     * Log a warning message
     */
    warn(message: string, context?: Record<string, any>): void;
    /**
     * Log an error message
     */
    error(message: string, error?: Error, context?: Record<string, any>): void;
    /**
     * Create a child logger with additional context
     */
    child(context: Record<string, any>): Logger;
    /**
     * Update logger configuration
     */
    configure(config: Partial<LoggerConfig>): void;
}
//# sourceMappingURL=Logger.d.ts.map