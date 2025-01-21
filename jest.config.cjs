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
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/core/testing/setup/jest.setup.ts'
  ],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: true,
      diagnostics: {
        ignoreCodes: [1343] // Ignore 'not using file extension' warning
      }
    }]
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-transform)/)'
  ],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  modulePaths: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/test/setup/',
    '\\.d\\.ts$'
  ],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
  reporters: [
    'default',
    ['<rootDir>/src/testing/reporters/ProgressReporter.js']
  ]
}
