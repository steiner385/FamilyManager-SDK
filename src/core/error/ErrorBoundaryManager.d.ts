import type { ComponentType } from 'react';
export interface ErrorConfig {
    fallback?: ComponentType<{
        error: Error;
        reset: () => void;
    }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetCondition?: () => boolean;
}
export declare class ErrorBoundaryManager {
    private static instance;
    private errorConfigs;
    private globalErrorHandler?;
    static getInstance(): ErrorBoundaryManager;
    setGlobalErrorHandler(handler: (error: Error, errorInfo: React.ErrorInfo) => void): void;
    setErrorConfig(componentId: string, config: ErrorConfig): void;
    getErrorConfig(componentId: string): ErrorConfig | undefined;
    handleError(error: Error, errorInfo: React.ErrorInfo, componentId?: string): void;
}
//# sourceMappingURL=ErrorBoundaryManager.d.ts.map