import winston from 'winston';
export class Logger {
    constructor() {
        const format = winston.format.combine(winston.format.timestamp(), winston.format.json());
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
                })
            ]
        });
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    static resetInstance() {
        Logger.instance = new Logger();
    }
    log(level, message, metadata) {
        // Validate log level
        if (!['error', 'warn', 'info', 'debug'].includes(level)) {
            return;
        }
        // Validate metadata to prevent circular references
        let safeMetadata = metadata;
        try {
            JSON.stringify(metadata);
        }
        catch (e) {
            safeMetadata = { metadataError: 'Invalid metadata structure' };
        }
        try {
            this.logger.log(level, message, safeMetadata);
        }
        catch (error) {
            // Fallback to console.error if logging fails
            if (process.env.NODE_ENV !== 'test') {
                console.error(`Failed to log message: ${message}`, {
                    level,
                    error,
                    metadata: safeMetadata
                });
            }
        }
    }
    error(message, metadata) {
        this.log('error', message, metadata);
    }
    warn(message, metadata) {
        this.log('warn', message, metadata);
    }
    info(message, metadata) {
        this.log('info', message, metadata);
    }
    debug(message, metadata) {
        this.log('debug', message, metadata);
    }
    // For testing purposes
    setLogger(logger) {
        this.logger = logger;
    }
}
// Export a default instance
export const logger = Logger.getInstance();
//# sourceMappingURL=Logger.js.map