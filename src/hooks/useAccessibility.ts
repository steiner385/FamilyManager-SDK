import { useEffect } from 'react';
import { AccessibilityManager, type A11yConfig } from '../core/accessibility/AccessibilityManager';

export function useAccessibility(componentId: string, config: A11yConfig) {
  useEffect(() => {
    AccessibilityManager.setConfig(componentId, config)
  }, [componentId, config])

  return {
    enhanceElement: (element: JSX.Element) =>
      AccessibilityManager.enhanceComponent(componentId, element),
  }
}
