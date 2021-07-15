/**
 * Works as any function
 *
 * Usage:
 *
 * ```typescript
 * import { noop } from '@queelag/core'
 *
 * window.addEventListener('scroll', noop)
 * // does nothing
 * ```
 *
 * @param args Anything
 */
export function noop(...args: any): any {}
