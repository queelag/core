export class WindowUtils {
  /**
   * Adds an event listener and returns a function that removes it, useful with react hooks.
   */
  static addEventListenerAndReturnRemover(type: keyof WindowEventMap, listener: () => any): () => void {
    window.addEventListener(type, listener)
    return () => window.removeEventListener(type, listener)
  }
}
