import React from 'react'
import { LoadingSpinner } from '../../components'

interface LoadingProps {
  isLoading?: boolean
}

export function withLoading<P extends LoadingProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return function LoadingComponent(props: P) {
    const { isLoading, ...rest } = props
    
    if (isLoading) {
      return <LoadingSpinner />
    }
    
    return <WrappedComponent {...rest as P} />
  }
}
