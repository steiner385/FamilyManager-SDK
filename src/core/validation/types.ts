import { z } from 'zod';
import { AppError } from '../errors/AppError';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends AppError {
  constructor(errors: ValidationError[], message?: string) {
    super({
      code: 'VALIDATION_ERROR',
      message: message || 'Validation failed',
      details: { errors }
    });
  }
}
