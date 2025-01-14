import winston from 'winston';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export interface LogMetadata {
    userId?: string;
    familyId?: string;
    requestId?: string;
    [key: string]: any;
}
export declare class Logger {
    private static instance;
    private logger;
    private constructor();
    static getInstance(): Logger;
    static resetInstance(): void;
    log(level: LogLevel, message: string, metadata?: LogMetadata): void;
    error(message: string, metadata?: LogMetadata): void;
    warn(message: string, metadata?: LogMetadata): void;
    info(message: string, metadata?: LogMetadata): void;
    debug(message: string, metadata?: LogMetadata): void;
    setLogger(logger: winston.Logger): void;
}
export declare const logger: Logger;
//# sourceMappingURL=Logger.d.ts.map