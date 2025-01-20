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
  return async function validate(config: PluginConfig, next: () => Promise<void>): Promise<void> {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (!config.name) {
      errors.push({
        field: 'name',
        message: 'Plugin name is required'
      });
    }

    if (!config.version) {
      errors.push({
        field: 'version',
        message: 'Plugin version is required'
      });
    }

    // Validate version format (semver)
    if (config.version && !this.isValidVersion(config.version)) {
      errors.push({
        field: 'version',
        message: 'Invalid version format. Must be semver (e.g., 1.0.0)'
      });
    }

    // Validate dependencies if present
    if (config.dependencies) {
      for (const [dep, version] of Object.entries(config.dependencies)) {
        if (!this.isValidVersion(version)) {
          errors.push({
            field: `dependencies.${dep}`,
            message: `Invalid version format for dependency ${dep}`
          });
        }
      }
    }

    const result = {
      isValid: errors.length === 0,
      errors
    };

    if (!result.isValid) {
      throw new ConfigError(
        ConfigErrorCode.VALIDATION_FAILED,
        `Validation failed: ${result.errors.map(e => e.message).join(', ')}`,
        { errors: result.errors }
      );
    }

    await next();
  }
}
