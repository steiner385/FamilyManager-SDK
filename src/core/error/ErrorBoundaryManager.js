export class ErrorBoundaryManager {
    constructor() {
        this.errorConfigs = new Map();
    }
    static getInstance() {
        if (!ErrorBoundaryManager.instance) {
            ErrorBoundaryManager.instance = new ErrorBoundaryManager();
        }
        return ErrorBoundaryManager.instance;
    }
    setGlobalErrorHandler(handler) {
        this.globalErrorHandler = handler;
    }
    setErrorConfig(componentId, config) {
        this.errorConfigs.set(componentId, config);
    }
    getErrorConfig(componentId) {
        return this.errorConfigs.get(componentId);
    }
    handleError(error, errorInfo, componentId) {
        // Call component-specific handler if exists
        if (componentId) {
            this.errorConfigs.get(componentId)?.onError?.(error, errorInfo);
        }
        // Call global handler if exists
        this.globalErrorHandler?.(error, errorInfo);
    }
}
//# sourceMappingURL=ErrorBoundaryManager.js.map