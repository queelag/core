import { Environment } from '../modules/environment'

/**
 * Creates a K element if the DOM is available otherwise an empty object is returned.
 */
export function createDocumentElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]
export function createDocumentElement<K extends keyof SVGElementTagNameMap>(tagName: K, options?: ElementCreationOptions): SVGElementTagNameMap[K]
export function createDocumentElement<K1 extends keyof HTMLElementTagNameMap, K2 extends keyof SVGElementTagNameMap>(
  tagName: K1 | K2,
  options?: ElementCreationOptions
): HTMLElementTagNameMap[K1] | SVGElementTagNameMap[K2] {
  return Environment.isWindowDefined ? document.createElement(tagName, options) : ({} as any)
}
