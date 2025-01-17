import '@jest/globals';
import type { Config } from '@jest/types';
import type { JestConfigWithTsJest } from 'ts-jest';

// Re-export Jest globals
export {
  describe,
  test,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest
} from '@jest/globals';

// Configure Jest timeout
jest.setTimeout(60000);

// Configure test environment
process.env.NODE_ENV = 'test';

// Export Jest types
export type { Config, JestConfigWithTsJest };

// Add a dummy test to prevent "no tests" error
describe('Jest globals', () => {
  it('should be configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
