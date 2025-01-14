import { AppError } from '../errors/AppError';
export class ValidationException extends AppError {
    constructor(errors, message) {
        super({
            code: 'VALIDATION_ERROR',
            message: message || 'Validation failed',
            details: { errors }
        });
    }
}
//# sourceMappingURL=types.js.map