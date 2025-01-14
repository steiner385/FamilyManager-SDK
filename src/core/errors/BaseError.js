export const DEFAULT_STATUS_CODES = {
    'NOT_FOUND': 404,
    'INVALID_RECURRENCE': 400,
    'VALIDATION_ERROR': 400,
    'AUTHENTICATION_ERROR': 401,
    'AUTHORIZATION_ERROR': 403,
    'PLUGIN_ERROR': 500
};
export class BaseError extends Error {
    constructor(params) {
        super(params.message);
        this.name = this.constructor.name;
        this.code = params.code;
        this.statusCode = params.statusCode ?? DEFAULT_STATUS_CODES[params.code] ?? 500;
        this.details = params.details;
        this.source = params.source;
        this.cause = params.cause;
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
            source: this.source,
            cause: this.cause
        };
    }
}
//# sourceMappingURL=BaseError.js.map