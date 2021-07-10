import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['axios', 'js-cookie', 'nanoid'],
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      file: 'dist/index.mjs',
      format: 'esm'
    }
  ],
  plugins: [terser(), typescript()]
}
