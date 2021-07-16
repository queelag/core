/**
 * Utils for anything related to stores.
 *
 * @category Utility
 */
export class StoreUtils {
  /** @hidden */
  constructor() {}

  /**
   * Updates a whitelist set of keys in a store from a props object.
   *
   * @template T The object interface
   * @template U The props interface
   */
  static updateKeys<T extends object, U extends object>(store: T, props: U, whitelist: (keyof T & keyof U)[], onUpdate: () => any = () => {}): void {
    let updated: boolean | undefined

    // @ts-ignore
    Object.entries(props).forEach(([k, v]: [keyof T & keyof U, any]) => {
      if (whitelist.includes(k) && this.shouldUpdateKey(store, k, v)) {
        // @ts-ignore
        store[k] = v
        updated = true
      }
    })

    updated && onUpdate()
  }

  /**
   * Checks if a whitelisted set of keys should be updated by comparing the values of store and props.
   *
   * @template T The object interface
   * @template U The props interface
   */
  static shouldUpdateKeys<T extends object, U extends object>(store: T, props: U, whitelist: (keyof T & keyof U)[]): boolean {
    return whitelist.some((k: keyof T & keyof U) => this.shouldUpdateKey(store, k, props[k]))
  }

  /**
   * Checks if a key should be updated by comparing store and prop values.
   *
   * @template T The object interface
   */
  static shouldUpdateKey<T extends object>(store: T, key: keyof T, prop: any): prop is T {
    return prop !== undefined && store[key] !== prop
  }
}
