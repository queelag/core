import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['cookie', 'fetch-blob', 'lodash/cloneDeep', 'lodash/merge', 'nanoid', 'node-fetch', 'rfc4648', 'superstruct'],
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
}
