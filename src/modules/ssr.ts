import { ElementTagNameMap } from '../definitions/interfaces'

export class SSR {
  /**
   * Creates a K element if the DOM is available otherwise an empty object is returned.
   */
  static createElement<K extends keyof ElementTagNameMap>(tagName: K, options?: ElementCreationOptions): ElementTagNameMap[K] {
    return this.hasDOM ? document.createElement(tagName, options) : ({} as any)
  }

  static get hasDOM(): boolean {
    return typeof window !== 'undefined'
  }
}
