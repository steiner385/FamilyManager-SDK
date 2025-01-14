import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import { ComponentProvider } from '../core/providers/ComponentProvider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { ToastProvider } from '../components/providers/ToastProvider';
function TestWrapper({ children, components = {} }) {
    return (_jsx(ComponentProvider, { components: components, children: _jsx(ThemeProvider, { children: _jsx(ToastProvider, { children: children }) }) }));
}
export function renderWithProviders(ui, options) {
    const { components, ...renderOptions } = options || {};
    return render(ui, {
        wrapper: ({ children }) => (_jsx(TestWrapper, { components: components, children: children })),
        ...renderOptions,
    });
}
//# sourceMappingURL=componentTester.js.map