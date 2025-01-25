import { ConfigValue, ConfigSchema } from './types';

export interface ValidationContext {
  pluginName: string;
  environment: string;
  configPath?: string[];
}

export interface ConfigValidationError {
  path: string[];
  message: string;
  code: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
}

export interface ConfigValidator {
  validate(
    config: ConfigValue,
    schema: ConfigSchema,
    context: ValidationContext
  ): ConfigValidationResult;
}

export class DefaultConfigValidator implements ConfigValidator {
  validate(
    config: ConfigValue,
    schema: ConfigSchema,
    context: ValidationContext
  ): ConfigValidationResult {
    const errors: ConfigValidationError[] = [];
    const configPath = context.configPath || [];

    for (const [key, def] of Object.entries(schema.properties)) {
      const currentPath = [...configPath, key];
      this.validateField(config[key], def, currentPath, context, errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateField(
    value: unknown,
    def: any,
    path: string[],
    context: ValidationContext,
    errors: ConfigValidationError[]
  ): void {
    if (def.required && value === undefined) {
      errors.push({
        path,
        code: 'REQUIRED',
        message: `Required field ${path.join('.')} is missing`
      });
      return;
    }

    if (value !== undefined) {
      if (typeof value !== def.type) {
        errors.push({
          path,
          code: 'INVALID_TYPE',
          message: `Expected ${def.type} for ${path.join('.')}, got ${typeof value}`
        });
      }

      if (def.validate && !def.validate(value)) {
        errors.push({
          path,
          code: 'VALIDATION_FAILED',
          message: `Validation failed for ${path.join('.')}`
        });
      }
    }
  }
}
