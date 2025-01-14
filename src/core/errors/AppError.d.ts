import { BaseError, ErrorParams } from './BaseError';
export declare class AppError extends BaseError {
    constructor(messageOrParams: string | ErrorParams, statusCode?: number, code?: string, details?: any);
    static isAppError(error: unknown): error is AppError;
}
export declare class ValidationError extends AppError {
    constructor(message: string, details?: any);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message: string);
}
//# sourceMappingURL=AppError.d.ts.map