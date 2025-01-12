import { AppError } from '../../errors/AppError';

export type ConfigErrorCode = 
  | 'SCHEMA_NOT_FOUND'
  | 'VALIDATION_FAILED' 
  | 'PERSISTENCE_ERROR'
  | 'INVALID_SCHEMA'
  | 'CONFIG_NOT_FOUND';

export class ConfigError extends AppError {
  constructor(
    code: ConfigErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super({
      code,
      message,
      details,
      source: 'config'
    });
    this.name = 'ConfigError';
  }
}
