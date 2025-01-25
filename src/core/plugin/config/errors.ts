export enum ConfigErrorCode {
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_CONFIG = 'INVALID_CONFIG'
}

export interface ConfigErrorDetails {
  errors?: any[];
  [key: string]: any;
}

export class ConfigError extends Error {
  public details?: ConfigErrorDetails;

  constructor(
    public code: ConfigErrorCode,
    message: string,
    details?: ConfigErrorDetails
  ) {
    super(message);
    this.name = 'ConfigError';
    this.details = details;
  }
}
