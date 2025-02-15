import '@testing-library/jest-dom';
import type { expect } from '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R, T = any> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveStyle(css: string | Record<string, unknown>): R;
      toHaveValue(value?: string | string[] | number | null): R;
      toBePartiallyChecked(): R;
    }
  }
}

declare module '@jest/expect' {
  interface AsymmetricMatchers extends jest.Matchers<void, any> {}
  interface Matchers<R extends void | Promise<void>, T = {}> extends jest.Matchers<R, T> {}
}

export {};