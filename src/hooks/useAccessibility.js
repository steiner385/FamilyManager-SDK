import { useEffect } from 'react';
import { AccessibilityManager } from '../core/accessibility/AccessibilityManager';
export function useAccessibility(componentId, config) {
    useEffect(() => {
        AccessibilityManager.setConfig(componentId, config);
    }, [componentId, config]);
    return {
        enhanceElement: (element) => AccessibilityManager.enhanceComponent(componentId, element),
    };
}
//# sourceMappingURL=useAccessibility.js.map