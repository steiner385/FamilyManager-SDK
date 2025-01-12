export interface ErrorParams {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  source?: string;
  cause?: unknown;
}

export abstract class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly source?: string;
  readonly cause?: unknown;

  constructor(params: ErrorParams) {
    super(params.message);
    this.code = params.code;
    this.statusCode = params.statusCode || this.getDefaultStatusCode(params.code);
    this.details = params.details;
    this.source = params.source;
    this.cause = params.cause;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  protected getDefaultStatusCode(code: string): number {
    const codeMap: Record<string, number> = {
      'UNAUTHORIZED': 401,
      'FORBIDDEN': 403,
      'NOT_FOUND': 404,
      'VALIDATION_ERROR': 400,
      'INTERNAL_ERROR': 500
    };
    return codeMap[code] || 500;
  }

  public toJSON() {
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
