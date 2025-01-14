/**
 * Simple logger implementation for plugins
 */
export declare class Logger {
    private name;
    constructor(name: string);
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map