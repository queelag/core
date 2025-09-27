import { build } from 'esbuild'
import { cp, rm } from 'fs/promises'
import { glob } from 'glob'

/** @type {import('esbuild').BuildOptions} */
const OPTIONS = {
  logLevel: 'info',
  minify: true
}

await rm('dist', { force: true, recursive: true })

await Promise.all([
  /**
   * ESM
   */
  build({
    ...OPTIONS,
    entryPoints: await glob('./src/**/*.ts'),
    format: 'esm',
    outdir: 'dist',
    packages: 'external',
    platform: 'neutral'
  }),
  /**
   * CJS
   */
  build({
    ...OPTIONS,
    bundle: true,
    entryPoints: ['src/index.ts'],
    format: 'cjs',
    outfile: 'dist/index.cjs',
    packages: 'external',
    platform: 'neutral'
  }),
  /**
   * IIFE
   */
  build({
    ...OPTIONS,
    bundle: true,
    entryPoints: ['src/index.ts'],
    format: 'iife',
    globalName: 'AracnaCore',
    outfile: 'dist/index.iife.js',
    platform: 'browser',
    treeShaking: true
  })
]).catch(() => process.exit(1))

await cp('LICENSE', 'dist/LICENSE', { force: true })
await cp('README.md', 'dist/README.md', { force: true })
await cp('package.json', 'dist/package.json', { force: true })
