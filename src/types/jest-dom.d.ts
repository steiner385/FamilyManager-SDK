/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R, T> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    toHaveClass(className: string): R;
  }
}