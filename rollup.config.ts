import typescript from '@rollup/plugin-typescript'
import { RollupOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['cookie', 'nanoid', 'rfc4648'],
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      dir: 'dist',
      preserveModules: true,
      format: 'esm'
    }
  ],
  plugins: [terser(), typescript()]
} as RollupOptions
