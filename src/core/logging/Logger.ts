import winston from 'winston';
import { LogLevel, LogMetadata } from './types';

// Singleton instance
let instance: Logger | null = null;

export class Logger {
  private logger: winston.Logger;

  private constructor(customLogger?: winston.Logger) {
    if (customLogger) {
      this.logger = customLogger;
    } else {
      const timestampFormat = winston.format.timestamp();
      const jsonFormat = winston.format.json();
      const combinedFormat = winston.format.combine(timestampFormat, jsonFormat);
      
      this.logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combinedFormat,
        transports: [
          new winston.transports.Console({
            format: combinedFormat
          })
        ]
      });
    }
  }

  public static getInstance(customLogger?: winston.Logger): Logger {
    if (!instance || customLogger) {
      instance = new Logger(customLogger);
    }
    return instance;
  }

  public static resetInstance(): void {
    instance = null;
  }

  // Method to set logger for testing purposes
  public setLogger(logger: winston.Logger): void {
    this.logger = logger;
  }

  log(level: LogLevel, message: string, metadata?: Partial<LogMetadata> & { timestamp?: number }): void {
    const timestamp = metadata?.timestamp ?? Date.now();
    const logMetadata = { timestamp, ...metadata };

    this.logger.log(level, message, logMetadata);
  }

  debug(message: string, metadata?: Partial<LogMetadata>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Partial<LogMetadata>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Partial<LogMetadata>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Partial<LogMetadata>): void {
    this.log('error', message, metadata);
  }
}

// Create and export a default logger instance
export const logger = Logger.getInstance();
