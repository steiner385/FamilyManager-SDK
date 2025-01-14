/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@testing/(.*)$': '<rootDir>/src/testing/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/core/testing/setup/jest.setup.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/*.test.[jt]s?(x)"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.test.json'
    }
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
};
