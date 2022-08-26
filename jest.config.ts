import type { Config } from '@jest/types'

export default {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/src/index.ts'],
  globalSetup: '<rootDir>/jest/global.setup.ts',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest/mocks/document.cookie.ts', '<rootDir>/jest/mocks/local.storage.ts', '<rootDir>/jest/mocks/session.storage.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts']
} as Config.InitialOptions
