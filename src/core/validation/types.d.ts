import { AppError } from '../errors/AppError';
export interface ValidationError {
    field: string;
    message: string;
}
export declare class ValidationException extends AppError {
    constructor(errors: ValidationError[], message?: string);
}
//# sourceMappingURL=types.d.ts.map