/**
 * Log levels supported by the logger
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
/**
 * Logger class for plugins
 */
export class Logger {
    constructor(pluginName, config = {}) {
        this.pluginName = pluginName;
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
    createEntry(level, message, context, error) {
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
    formatEntry(entry) {
        const parts = [];
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
    debug(message, context) {
        if (this.config.minLevel === LogLevel.DEBUG) {
            const entry = this.createEntry(LogLevel.DEBUG, message, context);
            console.debug(this.formatEntry(entry));
        }
    }
    /**
     * Log an info message
     */
    info(message, context) {
        if (this.config.minLevel !== LogLevel.ERROR) {
            const entry = this.createEntry(LogLevel.INFO, message, context);
            console.info(this.formatEntry(entry));
        }
    }
    /**
     * Log a warning message
     */
    warn(message, context) {
        if (this.config.minLevel !== LogLevel.ERROR) {
            const entry = this.createEntry(LogLevel.WARN, message, context);
            console.warn(this.formatEntry(entry));
        }
    }
    /**
     * Log an error message
     */
    error(message, error, context) {
        const entry = this.createEntry(LogLevel.ERROR, message, context, error);
        console.error(this.formatEntry(entry));
    }
    /**
     * Create a child logger with additional context
     */
    child(context) {
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
    configure(config) {
        this.config = {
            ...this.config,
            ...config
        };
    }
}
//# sourceMappingURL=Logger.js.map