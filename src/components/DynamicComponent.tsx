import { useUIComponent } from '../hooks/useUIComponent'
import { ErrorBoundary } from '../../components/common/ErrorBoundary'

interface DynamicComponentProps {
  id: string
  props?: Record<string, any>
}

export function DynamicComponent({ id, props = {} }: DynamicComponentProps) {
  const { Component, isRegistered } = useUIComponent(id)

  if (!isRegistered || !Component) {
    console.warn(`Component "${id}" not found in registry`)
    return null
  }

  return (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  )
}
