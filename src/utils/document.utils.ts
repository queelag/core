import { ElementTagNameMap } from '../definitions/interfaces'
import { Environment } from '../modules/environment'

/**
 * Utils for anything related to the DOM document.
 *
 * @category Utility
 */
export class DocumentUtils {
  /**
   * Adds an event listener and returns a function that removes it, useful with react hooks.
   */
  static addEventListenerAndReturnRemover(type: keyof DocumentEventMap, listener: (...args: any[]) => any): () => void {
    document.addEventListener(type, listener)
    return () => document.removeEventListener(type, listener)
  }

  /**
   * Creates a K element if the DOM is available otherwise an empty object is returned.
   */
  static createElement<K extends keyof ElementTagNameMap>(tagName: K, options?: ElementCreationOptions): ElementTagNameMap[K] {
    return Environment.isWindowDefined ? document.createElement(tagName, options) : ({} as any)
  }
}
