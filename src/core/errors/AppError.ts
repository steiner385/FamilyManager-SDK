import { BaseError, ErrorParams } from './BaseError';

export class AppError extends BaseError {
  constructor(params: ErrorParams) {
    super({
      ...params,
      statusCode: params.statusCode || AppError.getDefaultStatusCode(params.code)
    });
  }

  private static getDefaultStatusCode(code: string): number {
    const codeMap: Record<string, number> = {
      'UNAUTHORIZED': 401,
      'FORBIDDEN': 403,
      'NOT_FOUND': 404,
      'VALIDATION_ERROR': 400,
      'PLUGIN_ERROR': 500,
      'CONFIG_ERROR': 400,
      'EVENT_NOT_FOUND': 404,
      'CALENDAR_NOT_FOUND': 404,
      'INVALID_DATE_RANGE': 400,
      'SYNC_FAILED': 500,
      'INVALID_RECURRENCE': 400
    };
    return codeMap[code] || 500;
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
