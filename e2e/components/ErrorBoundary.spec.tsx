/** @jsxImportSource react */
import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import ErrorBoundary from '../../src/components/common/ErrorBoundary';

const ErrorComponent: React.FC = () => {
  throw new Error('Test error');
  return null;
};

test.describe('ErrorBoundary', () => {
  test('should render fallback UI when an error occurs', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const errorMessage = component.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Something went wrong');
  });

  test('should render children when no error occurs', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary>
        <div data-testid="test-content">Test Content</div>
      </ErrorBoundary>
    );

    const content = component.getByTestId('test-content');
    await expect(content).toBeVisible();
    await expect(content).toHaveText('Test Content');
  });

  test('should call onError handler when error occurs', async ({ mount }) => {
    let errorHandled = false;
    
    const component = await mount(
      <ErrorBoundary onError={() => { errorHandled = true; }}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Wait for error boundary to catch error
    await component.waitFor();
    expect(errorHandled).toBe(true);
  });

  test('should render custom fallback UI', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary 
        fallback={<div data-testid="custom-fallback">Custom Error UI</div>}
      >
        <ErrorComponent />
      </ErrorBoundary>
    );

    const customFallback = component.getByTestId('custom-fallback');
    await expect(customFallback).toBeVisible();
    await expect(customFallback).toHaveText('Custom Error UI');
  });

  test('should handle error triggered by prop change', async ({ mount }) => {
    const component = await mount(
      <ErrorBoundary testErrorTrigger={false}>
        <div>Initial Content</div>
      </ErrorBoundary>
    );

    // Force error by updating props
    await component.update(
      <ErrorBoundary testErrorTrigger={true}>
        <div>Initial Content</div>
      </ErrorBoundary>
    );

    const errorMessage = component.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Something went wrong');
  });
});
