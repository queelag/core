import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/utils/path-utils.ts'],
      include: ['src/**/*.ts'],
      reporter: ['lcov']
    },
    include: ['tests/**/*.test.ts']
  }
})
