import { jsx as _jsx } from "react/jsx-runtime";
export function withAccessibility(WrappedComponent) {
    return function AccessibleComponent(props) {
        const accessibilityProps = {
            role: props.role || 'presentation',
            'aria-label': props['aria-label'],
            'aria-describedby': props['aria-describedby']
        };
        const componentProps = {
            ...props,
            ...accessibilityProps
        };
        return _jsx(WrappedComponent, { ...componentProps });
    };
}
//# sourceMappingURL=withAccessibility.js.map