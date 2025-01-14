import { PluginConfig, PluginConfigSchema } from './types';
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
    validate(config: PluginConfig, schema: PluginConfigSchema, context: ValidationContext): ConfigValidationResult;
}
export declare class DefaultConfigValidator implements ConfigValidator {
    validate(config: PluginConfig, schema: PluginConfigSchema, context: ValidationContext): ConfigValidationResult;
    private validateField;
}
//# sourceMappingURL=validation.d.ts.map