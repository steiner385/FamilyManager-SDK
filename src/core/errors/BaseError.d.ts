export interface ErrorParams {
    code: string;
    message: string;
    statusCode?: number;
    details?: any;
    source?: string;
    cause?: Error;
}
export declare const DEFAULT_STATUS_CODES: Record<string, number>;
export declare class BaseError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly details?: any;
    readonly source?: string;
    readonly cause?: Error;
    constructor(params: ErrorParams);
    toJSON(): {
        name: string;
        code: string;
        message: string;
        statusCode: number;
        details: any;
        source: string | undefined;
        cause: Error | undefined;
    };
}
//# sourceMappingURL=BaseError.d.ts.map