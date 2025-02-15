/// <reference types="jest" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Expect extends TestingLibraryMatchers<any, void> {}
    interface Matchers<R, T = any> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

declare module '@testing-library/jest-dom' {}

export {};