import { useCallback, useEffect } from 'react'
import { ErrorBoundaryManager } from '../core/error/ErrorBoundaryManager'

export function useErrorBoundary(componentId: string, config?: ErrorConfig) {
  const manager = ErrorBoundaryManager.getInstance()

  useEffect(() => {
    if (config) {
      manager.setErrorConfig(componentId, config)
    }
  }, [componentId, config])

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    manager.handleError(error, errorInfo, componentId)
  }, [componentId])

  return { handleError }
}
