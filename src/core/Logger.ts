/**
 * Log levels supported by the logger
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
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
export class Logger {
  private config: LoggerConfig;

  constructor(
    private pluginName: string,
    config: Partial<LoggerConfig> = {}
  ) {
    this.config = {
      minLevel: LogLevel.INFO,
      timestamps: true,
      pluginName: true,
      ...config
    };
  }

  /**
   * Create a log entry
   */
  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      message,
      plugin: this.pluginName,
      context,
      error
    };
  }

  /**
   * Format a log entry as a string
   */
  private formatEntry(entry: LogEntry): string {
    const parts: string[] = [];

    if (this.config.timestamps) {
      parts.push(`[${new Date(entry.timestamp).toISOString()}]`);
    }

    if (this.config.pluginName) {
      parts.push(`[${entry.plugin}]`);
    }

    parts.push(`[${entry.level.toUpperCase()}]`);
    parts.push(entry.message);

    if (entry.context) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(entry.error.stack || entry.error.message);
    }

    return parts.join(' ');
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>) {
    if (this.config.minLevel === LogLevel.DEBUG) {
      const entry = this.createEntry(LogLevel.DEBUG, message, context);
      console.debug(this.formatEntry(entry));
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>) {
    if (this.config.minLevel !== LogLevel.ERROR) {
      const entry = this.createEntry(LogLevel.INFO, message, context);
      console.info(this.formatEntry(entry));
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>) {
    if (this.config.minLevel !== LogLevel.ERROR) {
      const entry = this.createEntry(LogLevel.WARN, message, context);
      console.warn(this.formatEntry(entry));
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createEntry(LogLevel.ERROR, message, context, error);
    console.error(this.formatEntry(entry));
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    return new Logger(this.pluginName, {
      ...this.config,
      formatter: (entry) => this.formatEntry({
        ...entry,
        context: { ...context, ...entry.context }
      })
    });
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>) {
    this.config = {
      ...this.config,
      ...config
    };
  }
}
