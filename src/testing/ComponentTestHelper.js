import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
export class ComponentTestHelper {
    static async testAccessibility(Component, props = {}) {
        const { container } = render(React.createElement(Component, props));
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }
    static createWrapper(providers) {
        return ({ children }) => {
            return providers.reduce((wrapped, Provider) => React.createElement(Provider, null, wrapped), children);
        };
    }
    static renderWithProviders(ui, options) {
        const AllTheProviders = this.createWrapper([
        // Add your providers here
        ]);
        return render(ui, { wrapper: AllTheProviders, ...options });
    }
}
//# sourceMappingURL=ComponentTestHelper.js.map