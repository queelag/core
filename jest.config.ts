import type { Config } from '@jest/types'

export default {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/dist/', '/node_modules/']
} as Config.InitialOptions
