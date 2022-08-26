import type { Config } from '@jest/types'

export default {
  globalSetup: '<rootDir>/jest/global.setup.ts',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/mocks/local.storage.ts', '<rootDir>/mocks/session.storage.ts'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/']
} as Config.InitialOptions
