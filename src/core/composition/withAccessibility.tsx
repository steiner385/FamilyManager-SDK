import React from 'react';

interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

export function withAccessibility<P extends AccessibilityProps>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof AccessibilityProps> & Partial<AccessibilityProps>> {
  return function AccessibleComponent(props: Omit<P, keyof AccessibilityProps> & AccessibilityProps) {
    const accessibilityProps: AccessibilityProps = {
      role: props.role || 'presentation',
      'aria-label': props['aria-label'],
      'aria-describedby': props['aria-describedby']
    };

    const componentProps = {
      ...props,
      ...accessibilityProps
    } as P;

    return <WrappedComponent {...componentProps} />;
  };
}
