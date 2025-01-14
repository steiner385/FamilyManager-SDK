import React from 'react';
import { type A11yConfig, type AccessibilityProps } from '../core/accessibility/AccessibilityManager';
export declare function useAccessibility(componentId: string, config: A11yConfig): {
    enhanceElement: <P extends AccessibilityProps>(element: React.ReactElement<P>) => React.ReactElement<P, string | React.JSXElementConstructor<any>>;
};
//# sourceMappingURL=useAccessibility.d.ts.map