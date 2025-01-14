import React from 'react';
export interface AccessibilityProps {
    'aria-label'?: string;
    'aria-describedby'?: string;
    role?: string;
    tabIndex?: number;
}
export interface A11yConfig {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    role?: string;
    tabIndex?: number;
}
export declare class AccessibilityManager {
    private static configs;
    static setConfig(componentId: string, config: A11yConfig): void;
    static getConfig(componentId: string): A11yConfig;
    static enhanceComponent<P extends AccessibilityProps>(componentId: string, element: React.ReactElement<P>): React.ReactElement<P>;
}
//# sourceMappingURL=AccessibilityManager.d.ts.map