import { useEffect } from 'react';
import React from 'react';
import { AccessibilityManager, type A11yConfig, type AccessibilityProps } from '../core/accessibility/AccessibilityManager';

export function useAccessibility(componentId: string, config: A11yConfig) {
  useEffect(() => {
    AccessibilityManager.setConfig(componentId, config)
  }, [componentId, config])

  return {
    enhanceElement: <P extends AccessibilityProps>(element: React.ReactElement<P>) =>
      AccessibilityManager.enhanceComponent(componentId, element),
  }
}
