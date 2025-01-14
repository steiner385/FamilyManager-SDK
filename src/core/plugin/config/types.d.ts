export type ConfigMiddleware = (config: PluginConfig, next: (config: PluginConfig) => Promise<void>) => Promise<void>;
export interface ConfigEncryption {
    encrypt(value: string): Promise<string>;
    decrypt(value: string): Promise<string>;
}
export interface PluginConfigSchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        required?: boolean;
        default?: any;
        validate?: (value: any) => boolean;
        description?: string;
        sensitive?: boolean;
    };
}
export interface PluginConfig {
    [key: string]: any;
}
export interface ConfigValidationError {
    key: string;
    message: string;
}
export interface ConfigValidationResult {
    isValid: boolean;
    errors: ConfigValidationError[];
}
//# sourceMappingURL=types.d.ts.map