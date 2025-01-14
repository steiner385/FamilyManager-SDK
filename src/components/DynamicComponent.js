import { jsx as _jsx } from "react/jsx-runtime";
import { useUIComponent } from '../hooks/useUIComponent';
import ErrorBoundary from './common/ErrorBoundary';
export function DynamicComponent({ id, props = {} }) {
    const { Component, isRegistered } = useUIComponent(id);
    if (!isRegistered || !Component) {
        console.warn(`Component "${id}" not found in registry`);
        return null;
    }
    return (_jsx(ErrorBoundary, { children: _jsx(Component, { ...props }) }));
}
//# sourceMappingURL=DynamicComponent.js.map