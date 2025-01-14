import { ConfigMiddleware, MiddlewareContext } from './types';
import { ConfigValidator, ValidationContext } from '../validation';
import { ConfigError, ConfigErrorCode } from '../errors';
import { PluginConfigSchema } from '../types';

export function createValidationMiddleware(
  validator: ConfigValidator,
  schema: PluginConfigSchema
): ConfigMiddleware {
  return async (config, next, middlewareContext: MiddlewareContext) => {
    const validationContext: ValidationContext = {
      pluginName: middlewareContext.pluginName,
      environment: middlewareContext.environment
    };

    const result = await validator.validate(config, schema, validationContext);
    
    if (!result.isValid) {
      throw new ConfigError(
        ConfigErrorCode.VALIDATION_ERROR,
        `Configuration validation failed for plugin ${middlewareContext.pluginName}`,
        { errors: result.errors }
      );
    }
    
    return next(config);
  };
}
