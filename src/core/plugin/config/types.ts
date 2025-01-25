export interface ConfigSchema {
  properties: Record<string, ConfigPropertySchema>;
}

export interface ConfigPropertySchema {
  type: 'string' | 'number' | 'boolean' | 'object';
  sensitive?: boolean;
  required?: boolean;
  description?: string;
}

export interface ConfigValue {
  [key: string]: unknown;
}

export interface ConfigEncryption {
  encrypt(value: string): Promise<string>;
  decrypt(value: string): Promise<string>;
}

export interface ConfigValidationError {
  field?: string;
  message: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
}

export type ConfigMiddleware = (
  config: ConfigValue,
  next: (config: ConfigValue) => Promise<void>
) => Promise<void>;

export interface MiddlewareContext {
  pluginName: string;
  environment: string;
  timestamp: number;
}
