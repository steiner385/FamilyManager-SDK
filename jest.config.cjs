/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: ['TS151001']
      }
    }]
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'd.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@testing/(.*)$': '<rootDir>/src/testing/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '\\.d\\.ts$': '<rootDir>/src/testing/types.d.ts',
    '^../../utils/logger$': '<rootDir>/src/core/utils/logger.ts',
    '^../../events/EventBus$': '<rootDir>/src/core/events/EventBus.ts',
    '^../routing/RouteRegistry$': '<rootDir>/src/core/routing/RouteRegistry.ts'
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/testing/setup.ts',
    '<rootDir>/src/core/testing/jest-setup.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/testing/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
