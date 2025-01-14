import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

interface TestWrapperProps {
  children: React.ReactNode;
}

export class ComponentTestHelper {
  static async testAccessibility(Component: React.ComponentType, props = {}) {
    const { container } = render(React.createElement(Component, props));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }

  static createWrapper(providers: React.ComponentType<TestWrapperProps>[]) {
    return ({ children }: TestWrapperProps) => {
      return providers.reduce((wrapped, Provider) => 
        React.createElement(Provider, null, wrapped),
        children
      );
    };
  }

  static renderWithProviders(
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
  ) {
    const AllTheProviders = this.createWrapper([
      // Add your providers here
    ]);
    
    return render(ui, { wrapper: AllTheProviders, ...options });
  }
}
