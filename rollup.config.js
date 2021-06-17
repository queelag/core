const terser = require('rollup-plugin-terser').terser
const typescript = require('@rollup/plugin-typescript')

export default {
  input: 'src/index.ts',
  plugins: [terser(), typescript()],
  output: {
    file: 'dist/index.js',
    format: 'es'
  }
}
