import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from '@jest/globals';

expect.extend(matchers);

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver
});

declare global {
  namespace jest {
    interface Matchers<R, T = any> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}
