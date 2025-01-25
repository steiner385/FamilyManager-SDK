import { ConfigValue } from '../types';
import { ConfigError, ConfigErrorCode } from '../errors';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  message: string;
  field?: string;
}

export function createValidationMiddleware(validator: any, schema: any) {
  return async function validate(config: ConfigValue, next: (config: ConfigValue) => Promise<void>): Promise<void> {
    const errors: ValidationError[] = [];

    if (validator && schema) {
      const result = validator.validate(config, schema);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      throw new ConfigError(
        ConfigErrorCode.VALIDATION_ERROR,
        `Validation failed: ${errors.map(e => e.message).join(', ')}`,
        { errors }
      );
    }

    await next(config);
  };
}
