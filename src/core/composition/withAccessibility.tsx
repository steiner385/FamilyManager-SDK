import React from 'react'

interface AccessibilityProps {
  'aria-label'?: string
  'aria-describedby'?: string
  role?: string
}

export function withAccessibility<P extends AccessibilityProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AccessibleComponent(props: P) {
    const { role, ...rest } = props
    
    return (
      <WrappedComponent
        role={role || 'presentation'}
        {...rest}
      />
    )
  }
}
