import winston from 'winston';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogMetadata {
  userId?: string;
  familyId?: string;
  requestId?: string;
  [key: string]: any;
}

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public static resetInstance(): void {
    Logger.instance = new Logger();
  }

  public log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    // Validate log level
    if (!['error', 'warn', 'info', 'debug'].includes(level)) {
      return;
    }

    // Validate metadata to prevent circular references
    let safeMetadata = metadata;
    try {
      JSON.stringify(metadata);
    } catch (e) {
      safeMetadata = { metadataError: 'Invalid metadata structure' };
    }

    try {
      this.logger.log(level, message, safeMetadata);
    } catch (error) {
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

  public error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  public debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  // For testing purposes
  public setLogger(logger: winston.Logger): void {
    this.logger = logger;
  }
}

// Export a default instance
export const logger = Logger.getInstance();
