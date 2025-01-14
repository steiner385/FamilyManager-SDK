import { BaseError } from './BaseError';
const STATUS_CODE_MAPPINGS = {
    'VALIDATION_ERROR': 400,
    'INVALID_RECURRENCE': 400,
    'AUTHENTICATION_ERROR': 401,
    'AUTHORIZATION_ERROR': 403,
    'NOT_FOUND': 404,
    'INTERNAL_ERROR': 500,
    'PLUGIN_ERROR': 500
};
export class AppError extends BaseError {
    constructor(messageOrParams, statusCode = 500, code = 'INTERNAL_ERROR', details) {
        if (typeof messageOrParams === 'string') {
            super({
                message: messageOrParams,
                statusCode: statusCode || STATUS_CODE_MAPPINGS[code] || 500,
                code,
                details
            });
        }
        else {
            const params = messageOrParams;
            super({
                ...params,
                statusCode: params.statusCode || STATUS_CODE_MAPPINGS[params.code] || 500
            });
        }
        this.name = 'AppError';
    }
    static isAppError(error) {
        return error instanceof AppError;
    }
}
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Not authenticated') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends AppError {
    constructor(message = 'Not authorized') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
//# sourceMappingURL=AppError.js.map