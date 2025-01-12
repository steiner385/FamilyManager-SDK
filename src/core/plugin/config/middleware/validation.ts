import { ConfigMiddleware } from './types';
import { ConfigValidator } from '../validation';
import { ConfigError } from '../errors';

export function createValidationMiddleware(validator: ConfigValidator): ConfigMiddleware {
  return async (config, next) => {
    const result = await validator.validate(config);
    if (!result.isValid) {
      throw new ConfigError(
        'VALIDATION_FAILED',
        'Configuration validation failed',
        { errors: result.errors }
      );
    }
    await next(config);
  };
}
