import React from 'react';
export class AccessibilityManager {
    static setConfig(componentId, config) {
        this.configs.set(componentId, config);
    }
    static getConfig(componentId) {
        return this.configs.get(componentId) || {};
    }
    static enhanceComponent(componentId, element) {
        const config = this.getConfig(componentId);
        return React.cloneElement(element, {
            ...element.props,
            'aria-label': config.ariaLabel,
            'aria-describedby': config.ariaDescribedBy,
            role: config.role,
            tabIndex: config.tabIndex,
        });
    }
}
AccessibilityManager.configs = new Map();
//# sourceMappingURL=AccessibilityManager.js.map