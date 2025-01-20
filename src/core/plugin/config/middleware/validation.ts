import { PluginConfig } from '../../types';
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
  return async function validate(config: PluginConfig, next: (config: PluginConfig) => Promise<void>): Promise<void> {
    const errors: ValidationError[] = [];

    if (validator && schema) {
      const result = validator.validate(config, schema);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    // Basic validation if no schema provided
    if (!config.metadata?.name) {
      errors.push({
        field: 'metadata.name',
        message: 'Plugin name is required'
      });
    }

    if (!config.metadata?.version) {
      errors.push({
        field: 'metadata.version',
        message: 'Plugin version is required'
      });
    }

    if (errors.length > 0) {
      throw new ConfigError(
        ConfigErrorCode.VALIDATION_FAILED,
        `Validation failed: ${errors.map(e => e.message).join(', ')}`,
        { errors }
      );
    }

    await next();
  };
}
