import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ComponentProvider } from '../core/providers/ComponentProvider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { ToastProvider } from '../components/providers/ToastProvider';

interface WrapperProps {
  children: React.ReactNode;
  components?: Record<string, React.ComponentType>;
}

function TestWrapper({ children, components = {} }: WrapperProps) {
  return (
    <ComponentProvider components={components}>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ComponentProvider>
  );
}

import type { RenderResult } from '@testing-library/react';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    components?: Record<string, React.ComponentType>;
  }
): RenderResult {
  const { components, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper components={components}>{children}</TestWrapper>
    ),
    ...renderOptions,
  });
}
