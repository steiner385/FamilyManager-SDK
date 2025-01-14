import '@testing-library/jest-dom';
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  interface JestMatchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      toBeInTheDocument(): R;
      toHaveStyle(css: Record<string, any>): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toHaveValue(value: string | string[] | number | null): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toHaveErrorMessage(text: string | RegExp): R;
      toHaveAccessibleDescription(text: string | RegExp): R;
      toHaveAccessibleName(text: string | RegExp): R;
    }
  }
}

declare module '@testing-library/jest-dom' {
  export interface JestMatchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
