/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      // Add custom matchers here
      toHaveBeenCalledExactlyOnceWith(...args: any[]): R;
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }

  // Extend window with test-specific properties
  interface Window {
    IntersectionObserver: {
      new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
    };
    ResizeObserver: {
      new(callback: ResizeObserverCallback): ResizeObserver;
    };
  }
}

// Extend expect
declare module '@jest/expect' {
  interface AsymmetricMatchers {
    toBeInTheDocument(): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveClass(...classNames: string[]): void;
    toHaveTextContent(text: string | RegExp): void;
  }

  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveClass(...classNames: string[]): R;
    toHaveTextContent(text: string | RegExp): R;
  }
}
