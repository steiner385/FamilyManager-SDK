import winston from 'winston';

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

  private safeLog(level: string, message: string, meta?: Record<string, unknown>): void {
    try {
      this.logger[level as keyof winston.Logger](message, meta);
    } catch (error) {
      console.error(`Failed to log message: ${message}`, error);
    }
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.safeLog('info', message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.safeLog('error', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.safeLog('warn', message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.safeLog('debug', message, meta);
  }

  // For testing purposes
  public setLogger(customLogger: winston.Logger): void {
    this.logger = customLogger;
  }
}

export const logger = Logger.getInstance();
