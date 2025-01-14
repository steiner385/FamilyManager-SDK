import React from 'react';
interface AccessibilityProps {
    'aria-label'?: string;
    'aria-describedby'?: string;
    role?: string;
}
export declare function withAccessibility<P extends AccessibilityProps>(WrappedComponent: React.ComponentType<P>): React.ComponentType<Omit<P, keyof AccessibilityProps> & Partial<AccessibilityProps>>;
export {};
//# sourceMappingURL=withAccessibility.d.ts.map