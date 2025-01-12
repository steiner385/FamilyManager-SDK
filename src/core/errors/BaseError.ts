export interface ErrorParams {
  code: string;
  message: string;
  statusCode?: number;
  details?: any;
  source?: string;
  cause?: Error;
}

export const DEFAULT_STATUS_CODES: Record<string, number> = {
  'NOT_FOUND': 404,
  'INVALID_RECURRENCE': 400,
  'VALIDATION_ERROR': 400,
  'AUTHENTICATION_ERROR': 401,
  'AUTHORIZATION_ERROR': 403,
  'PLUGIN_ERROR': 500
};

export class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly source?: string;
  public readonly cause?: Error;

  constructor(params: ErrorParams) {
    super(params.message);
    this.name = this.constructor.name;
    this.code = params.code;
    this.statusCode = params.statusCode ?? DEFAULT_STATUS_CODES[params.code] ?? 500;
    this.details = params.details;
    this.source = params.source;
    this.cause = params.cause;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      source: this.source,
      cause: this.cause
    };
  }
}
