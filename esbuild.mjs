import { build } from 'esbuild'
import { glob } from 'glob'

/** @type {import('esbuild').BuildOptions} */
const OPTIONS = {
  logLevel: 'info',
  minify: true
}

/**
 * ESM
 */
build({
  ...OPTIONS,
  entryPoints: await glob('./src/**/*.ts'),
  format: 'esm',
  packages: 'external',
  platform: 'neutral',
  outdir: 'dist'
}).catch(() => process.exit(1))

/**
 * CJS
 */
build({
  ...OPTIONS,
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'cjs',
  packages: 'external',
  platform: 'neutral',
  outfile: 'dist/index.cjs.js'
}).catch(() => process.exit(1))

/**
 * IIFE
 */
build({
  ...OPTIONS,
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'iife',
  globalName: 'AracnaCore',
  platform: 'browser',
  outfile: 'dist/index.iife.js'
}).catch(() => process.exit(1))
