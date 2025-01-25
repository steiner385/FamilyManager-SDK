interface ApiError extends Error {
  code?: string;
  status?: number;
  data?: unknown;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return error as ApiError;
  }

  if (typeof error === 'string') {
    return new Error(error) as ApiError;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = new Error('API Error') as ApiError;
    apiError.data = error;
    
    // Try to extract status and code if they exist
    if ('status' in error && typeof error.status === 'number') {
      apiError.status = error.status;
    }
    if ('code' in error && typeof error.code === 'string') {
      apiError.code = error.code;
    }
    if ('message' in error && typeof error.message === 'string') {
      apiError.message = error.message;
    }
    
    return apiError;
  }

  return new Error('An unknown error occurred') as ApiError;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && ('code' in error || 'status' in error);
}

export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  
  // Return custom messages based on status codes
  if (apiError.status) {
    switch (apiError.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
    }
  }

  // Return custom messages based on error codes
  if (apiError.code) {
    switch (apiError.code) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      case 'CANCELLED':
        return 'Request was cancelled.';
    }
  }

  // Fallback to error message or default
  return apiError.message || 'An unknown error occurred';
}
