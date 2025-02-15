import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Re-export all jest-dom matchers
export * from '@testing-library/jest-dom';

// Add any custom matchers here
expect.extend({
  toBeValidEvent(received: any) {
    return {
      pass: received && typeof received.type === 'string' && received.metadata,
      message: () => `expected ${received} to be a valid event`
    };
  }
});