export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'PLUGIN_ERROR';
