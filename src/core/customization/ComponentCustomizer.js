import React from 'react';
export class ComponentCustomizer {
    static customize(pluginName, componentName, options) {
        const key = `${pluginName}:${componentName}`;
        this.customizations.set(key, options);
    }
    static getCustomizations(pluginName, componentName) {
        const key = `${pluginName}:${componentName}`;
        return this.customizations.get(key) || {};
    }
    static withCustomizations(WrappedComponent, pluginName, componentName) {
        return function CustomizedComponent(props) {
            const customizations = ComponentCustomizer.getCustomizations(pluginName, componentName);
            return React.createElement(WrappedComponent, {
                ...customizations.props,
                ...props,
                style: {
                    ...customizations.styles,
                    ...props.style,
                }
            });
        };
    }
}
ComponentCustomizer.customizations = new Map();
//# sourceMappingURL=ComponentCustomizer.js.map