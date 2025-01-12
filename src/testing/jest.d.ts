/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R, T> {
    toHaveStyle(css: Record<string, any>): R;
    toHaveTextContent(text: string | RegExp): R;
  }
}

export {};
