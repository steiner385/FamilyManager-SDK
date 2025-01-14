import { ConfigError, ConfigErrorCode } from '../errors';
export function createValidationMiddleware(validator, schema) {
    return async (config, next, middlewareContext) => {
        const validationContext = {
            pluginName: middlewareContext.pluginName,
            environment: middlewareContext.environment
        };
        const result = await validator.validate(config, schema, validationContext);
        if (!result.isValid) {
            throw new ConfigError(ConfigErrorCode.VALIDATION_ERROR, `Configuration validation failed for plugin ${middlewareContext.pluginName}`, { errors: result.errors });
        }
        return next(config);
    };
}
//# sourceMappingURL=validation.js.map