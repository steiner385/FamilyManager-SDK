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

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }
}

export const logger = Logger.getInstance();
