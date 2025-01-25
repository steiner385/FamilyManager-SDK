import type { ComponentType } from 'react';

export interface ErrorConfig {
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetCondition?: () => boolean;
}

export class ErrorBoundaryManager {
  private static instance: ErrorBoundaryManager;
  private errorConfigs = new Map<string, ErrorConfig>();
  private globalErrorHandler?: (error: Error, errorInfo: React.ErrorInfo) => void;

  static getInstance(): ErrorBoundaryManager {
    if (!ErrorBoundaryManager.instance) {
      ErrorBoundaryManager.instance = new ErrorBoundaryManager();
    }
    return ErrorBoundaryManager.instance;
  }

  setGlobalErrorHandler(handler: (error: Error, errorInfo: React.ErrorInfo) => void) {
    this.globalErrorHandler = handler;
  }

  setErrorConfig(componentId: string, config: ErrorConfig) {
    this.errorConfigs.set(componentId, config);
  }

  getErrorConfig(componentId: string): ErrorConfig | undefined {
    return this.errorConfigs.get(componentId);
  }

  handleError(error: Error, errorInfo: React.ErrorInfo, componentId?: string) {
    // Call component-specific handler if exists
    if (componentId) {
      this.errorConfigs.get(componentId)?.onError?.(error, errorInfo);
    }
    // Call global handler if exists
    this.globalErrorHandler?.(error, errorInfo);
  }
}
