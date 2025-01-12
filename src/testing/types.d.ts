/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R, T> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: string): R;
    toContain(text: string): R;
    toBe(value: any): R;
    toBeDefined(): R;
    toBeNull(): R;
  }
}

declare module '@testing-library/jest-dom' {
  export interface Matchers<R = void, T = any> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: string): R;
    toContain(text: string): R;
    toBe(value: any): R;
    toBeDefined(): R;
    toBeNull(): R;
  }
}

declare module '@jest/expect' {
  interface Matchers<R = void, T = any> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: string): R;
    toContain(text: string): R;
    toBe(value: any): R;
    toBeDefined(): R;
    toBeNull(): R;
  }
}

declare module '@testing-library/jest-dom/matchers' {
  export interface Matchers<R = void, T = any> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: string): R;
    toContain(text: string): R;
    toBe(value: any): R;
    toBeDefined(): R;
    toBeNull(): R;
  }
}

declare global {
  namespace jest {
    interface Expect {
      <T = any>(actual: T): Matchers<void, T>;
    }
  }
}

export {};
