import { useCallback, useEffect } from 'react';
import { ErrorBoundaryManager } from '../core/error/ErrorBoundaryManager';
export function useErrorBoundary(componentId, config) {
    const manager = ErrorBoundaryManager.getInstance();
    useEffect(() => {
        if (config) {
            manager.setErrorConfig(componentId, config);
        }
    }, [componentId, config]);
    const handleError = useCallback((error, errorInfo) => {
        manager.handleError(error, errorInfo, componentId);
    }, [componentId]);
    return { handleError };
}
//# sourceMappingURL=useErrorBoundary.js.map