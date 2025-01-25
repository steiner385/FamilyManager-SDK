import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { ErrorBoundary } from '../../src/components/common/ErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Test error triggered');
  return null;
};

test.describe('ErrorBoundary Component', () => {
  test('renders children when no error occurs', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary>
        <div data-testid="normal-content">Normal content</div>
      </ErrorBoundary>
    );
    
    await expect(component.getByTestId('normal-content')).toBeVisible();
    await expect(component.getByText('Normal content')).toBeVisible();
  });

  test('renders default error UI when error occurs', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    await expect(component.getByText('Something went wrong')).toBeVisible();
    await expect(component.getByText('Test error triggered')).toBeVisible();
    
    // Verify error boundary has proper ARIA attributes
    const errorContainer = component.locator('[role="alert"]');
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toHaveAttribute('aria-live', 'polite');
  });

  test('renders custom fallback when provided', async ({ mount }) => {
    const customFallback = (
      <div role="alert" data-testid="custom-error" className="custom-error">
        <h2>Custom Error View</h2>
        <p>Something went wrong with the application</p>
      </div>
    );

    const component = await mount(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    await expect(component.getByTestId('custom-error')).toBeVisible();
    await expect(component.getByText('Custom Error View')).toBeVisible();
    await expect(component.getByText('Something went wrong with the application')).toBeVisible();
  });

  test('contains errors within nested boundaries', async ({ mount }) => {
    const component = await mount(
      <div data-testid="root">
        <div data-testid="top">Top level content</div>
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
        <div data-testid="bottom">Bottom level content</div>
      </div>
    );

    // Verify error UI is shown
    await expect(component.getByText('Something went wrong')).toBeVisible();
    await expect(component.getByText('Test error triggered')).toBeVisible();

    // Verify surrounding content is still visible
    await expect(component.getByTestId('top')).toBeVisible();
    await expect(component.getByTestId('bottom')).toBeVisible();
  });
});
