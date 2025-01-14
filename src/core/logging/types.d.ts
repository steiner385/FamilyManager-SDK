export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogMetadata {
    timestamp: number;
    level: LogLevel;
    context?: string;
    [key: string]: unknown;
}
//# sourceMappingURL=types.d.ts.map